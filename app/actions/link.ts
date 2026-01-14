'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Generates a unique short code for URL shortening
 * @param length - Length of the short code (default: 6)
 * @returns A unique alphanumeric code
 */
function generateShortCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Creates a new shortened link
 * @param formData - Form data containing the original URL
 * @returns Object with success status and optional error message
 */
export async function createLinkAction(formData: FormData) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const originalUrl = formData.get('url') as string;
        const customSlug = formData.get('customSlug') as string;

        if (!originalUrl) {
            return { success: false, error: 'URL is required' };
        }

        // Validate URL format
        try {
            new URL(originalUrl);
        } catch {
            return { success: false, error: 'Invalid URL format' };
        }

        let shortCode: string;

        // Use custom slug if provided
        if (customSlug && customSlug.trim()) {
            const slug = customSlug.trim();

            // Validate custom slug format (alphanumeric and hyphens only)
            if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
                return { success: false, error: 'Custom slug can only contain letters, numbers, and hyphens' };
            }

            // Check minimum length
            if (slug.length < 3) {
                return { success: false, error: 'Custom slug must be at least 3 characters long' };
            }

            // Check maximum length
            if (slug.length > 50) {
                return { success: false, error: 'Custom slug must be 50 characters or less' };
            }

            // Check if custom slug is already taken
            const existing = await db
                .select()
                .from(links)
                .where(eq(links.shortCode, slug))
                .limit(1);

            if (existing.length > 0) {
                return { success: false, error: 'This custom slug is already taken' };
            }

            shortCode = slug;
        } else {
            // Generate unique short code
            shortCode = generateShortCode();
            let attempts = 0;
            const maxAttempts = 10;

            // Ensure short code is unique
            while (attempts < maxAttempts) {
                const existing = await db
                    .select()
                    .from(links)
                    .where(eq(links.shortCode, shortCode))
                    .limit(1);

                if (existing.length === 0) {
                    break;
                }

                shortCode = generateShortCode();
                attempts++;
            }

            if (attempts === maxAttempts) {
                return { success: false, error: 'Failed to generate unique short code' };
            }
        }

        // Insert new link
        await db.insert(links).values({
            userId,
            shortCode,
            originalUrl,
            clicks: 0,
        });

        revalidatePath('/dashboard');

        return { success: true, shortCode };
    } catch (error) {
        console.error('Failed to create link:', error);
        return { success: false, error: 'Failed to create link' };
    }
}

/**
 * Updates an existing shortened link
 * @param linkId - The ID of the link to update
 * @param formData - Form data containing the updated URL and optional custom slug
 * @returns Object with success status and optional error message
 */
export async function updateLinkAction(linkId: number, formData: FormData) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify link ownership
        const [existingLink] = await db
            .select()
            .from(links)
            .where(eq(links.id, linkId))
            .limit(1);

        if (!existingLink) {
            return { success: false, error: 'Link not found' };
        }

        if (existingLink.userId !== userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const originalUrl = formData.get('url') as string;
        const customSlug = formData.get('customSlug') as string;

        if (!originalUrl) {
            return { success: false, error: 'URL is required' };
        }

        // Validate URL format
        try {
            new URL(originalUrl);
        } catch {
            return { success: false, error: 'Invalid URL format' };
        }

        let shortCode = existingLink.shortCode;

        // Handle custom slug update
        if (customSlug && customSlug.trim()) {
            const slug = customSlug.trim();

            // Only check if slug changed
            if (slug !== existingLink.shortCode) {
                // Validate custom slug format
                if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
                    return { success: false, error: 'Custom slug can only contain letters, numbers, and hyphens' };
                }

                if (slug.length < 3) {
                    return { success: false, error: 'Custom slug must be at least 3 characters long' };
                }

                if (slug.length > 50) {
                    return { success: false, error: 'Custom slug must be 50 characters or less' };
                }

                // Check if new slug is already taken
                const [duplicate] = await db
                    .select()
                    .from(links)
                    .where(eq(links.shortCode, slug))
                    .limit(1);

                if (duplicate) {
                    return { success: false, error: 'This custom slug is already taken' };
                }

                shortCode = slug;
            }
        }

        // Update link
        await db
            .update(links)
            .set({
                originalUrl,
                shortCode,
                updatedAt: new Date(),
            })
            .where(eq(links.id, linkId));

        revalidatePath('/dashboard');

        return { success: true, shortCode };
    } catch (error) {
        console.error('Failed to update link:', error);
        return { success: false, error: 'Failed to update link' };
    }
}

/**
 * Deletes a shortened link
 * @param linkId - The ID of the link to delete
 * @returns Object with success status and optional error message
 */
export async function deleteLinkAction(linkId: number) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Verify link ownership
        const [existingLink] = await db
            .select()
            .from(links)
            .where(eq(links.id, linkId))
            .limit(1);

        if (!existingLink) {
            return { success: false, error: 'Link not found' };
        }

        if (existingLink.userId !== userId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete link
        await db.delete(links).where(eq(links.id, linkId));

        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete link:', error);
        return { success: false, error: 'Failed to delete link' };
    }
}
