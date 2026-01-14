import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Dashboard() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    const userLinks = await db
        .select()
        .from(links)
        .where(eq(links.userId, userId))
        .orderBy(desc(links.createdAt));

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your shortened links
                </p>
            </div>

            {userLinks.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            No links yet. Create your first shortened link!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {userLinks.map((link) => (
                        <Card key={link.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="text-lg">
                                            <a
                                                href={`/${link.shortCode}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {typeof window !== 'undefined'
                                                    ? `${window.location.origin}/${link.shortCode}`
                                                    : `/${link.shortCode}`
                                                }
                                            </a>
                                        </CardTitle>
                                        <CardDescription className="break-all">
                                            {link.originalUrl}
                                        </CardDescription>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <div className="text-sm text-muted-foreground">
                                            Clicks
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {link.clicks}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>
                                        Created: {new Date(link.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>
                                        Short code: <code className="bg-muted px-1.5 py-0.5 rounded">{link.shortCode}</code>
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
