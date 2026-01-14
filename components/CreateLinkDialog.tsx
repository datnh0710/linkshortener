'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createLinkAction } from '@/app/actions/link';
import { Plus, Loader2 } from 'lucide-react';

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await createLinkAction(formData);

        setLoading(false);

        if (result.success) {
            setUrl('');
            setCustomSlug('');
            setOpen(false);
        } else {
            setError(result.error || 'Failed to create link');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Link
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Create shortened link</DialogTitle>
                    <DialogDescription>
                        Enter a URL to create a shortened link. We'll generate a unique short code for you.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium">
                            Original URL
                        </label>
                        <Input
                            id="url"
                            name="url"
                            type="url"
                            placeholder="https://example.com/very-long-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="customSlug" className="text-sm font-medium">
                            Custom Slug <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Input
                            id="customSlug"
                            name="customSlug"
                            type="text"
                            placeholder="my-custom-link"
                            value={customSlug}
                            onChange={(e) => setCustomSlug(e.target.value)}
                            disabled={loading}
                            maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                            Leave empty to auto-generate. Use letters, numbers, and hyphens only (3-50 characters).
                        </p>
                    </div>
                    {error && (
                        <div className="text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Link'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
