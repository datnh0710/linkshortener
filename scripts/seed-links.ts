import 'dotenv/config';
import { db } from '@/db';
import { links } from '@/db/schema';

// Generate a random short code
function generateShortCode(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Sample users (using Clerk-style user IDs)
const users = [
    'user_2abcdefghijklmnop1',
    'user_2abcdefghijklmnop2',
    'user_2abcdefghijklmnop3',
];

// Sample URLs
const sampleUrls = [
    'https://www.github.com/trending',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://stackoverflow.com/questions/tagged/typescript',
    'https://www.linkedin.com/in/example-profile',
    'https://medium.com/@author/how-to-build-a-link-shortener',
    'https://www.producthunt.com/posts/new-product',
    'https://twitter.com/tech_news/status/123456789',
    'https://docs.nextjs.org/app/building-your-application',
    'https://www.npmjs.com/package/drizzle-orm',
    'https://vercel.com/templates/next.js',
];

async function seedLinks() {
    try {
        console.log('🌱 Seeding database with example links...\n');

        // Generate 10 links distributed across 3 users
        const linksToInsert = [];

        for (let i = 0; i < 10; i++) {
            const userIndex = i % users.length; // Distribute links across users
            const clicks = Math.floor(Math.random() * 100); // Random clicks 0-99

            linksToInsert.push({
                shortCode: generateShortCode(),
                originalUrl: sampleUrls[i],
                userId: users[userIndex],
                clicks,
            });
        }

        // Insert all links
        await db.insert(links).values(linksToInsert);

        console.log('✅ Successfully inserted 10 example links for 3 users:\n');

        // Display summary
        users.forEach((userId, index) => {
            const userLinks = linksToInsert.filter(link => link.userId === userId);
            console.log(`User ${index + 1} (${userId}):`);
            userLinks.forEach(link => {
                console.log(`  - ${link.shortCode} → ${link.originalUrl} (${link.clicks} clicks)`);
            });
            console.log();
        });

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

seedLinks()
    .then(() => {
        console.log('✨ Seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to seed database:', error);
        process.exit(1);
    });
