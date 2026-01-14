import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ shortCode: string }> }
) {
    try {
        const { shortCode } = await params;

        // Find the link by shortCode
        const [link] = await db
            .select()
            .from(links)
            .where(eq(links.shortCode, shortCode))
            .limit(1);

        if (!link) {
            return new NextResponse('Link not found', { status: 404 });
        }

        // Increment the click count
        await db
            .update(links)
            .set({ clicks: link.clicks + 1 })
            .where(eq(links.id, link.id));

        // Redirect to the original URL
        return NextResponse.redirect(link.originalUrl, { status: 307 });
    } catch (error) {
        console.error('Redirect error:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
