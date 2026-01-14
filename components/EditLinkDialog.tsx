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
import { updateLinkAction } from '@/app/actions/link';
import { Pencil, Loader2 } from 'lucide-react';
import type { LinkSelect } from '@/db/schema';

interface EditLinkDialogProps {
    link: LinkSelect;
}

export function EditLinkDialog({ link }: EditLinkDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState(link.originalUrl);
    const [customSlug, setCustomSlug] = useState(link.shortCode);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await updateLinkAction(link.id, formData);

        setLoading(false);

        if (result.success) {
            setOpen(false);
        } else {
            setError(result.error || 'Failed to update link');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit link</DialogTitle>
                    <DialogDescription>
                        Update the URL or custom slug for this shortened link.
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
                            Custom Slug
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
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Use letters, numbers, and hyphens only (3-50 characters).
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
                                    Updating...
                                </>
                            ) : (
                                'Update Link'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
