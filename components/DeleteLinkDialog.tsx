'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { deleteLinkAction } from '@/app/actions/link';
import { Trash2, Loader2 } from 'lucide-react';
import type { LinkSelect } from '@/db/schema';

interface DeleteLinkDialogProps {
    link: LinkSelect;
}

export function DeleteLinkDialog({ link }: DeleteLinkDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        const result = await deleteLinkAction(link.id);

        setLoading(false);

        if (result.success) {
            setOpen(false);
        } else {
            setError(result.error || 'Failed to delete link');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete link</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this link? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="space-y-2 rounded-lg bg-muted p-4">
                        <div className="text-sm font-medium">Short code:</div>
                        <code className="text-sm">{link.shortCode}</code>
                        <div className="text-sm font-medium mt-3">Original URL:</div>
                        <div className="text-sm text-muted-foreground break-all">{link.originalUrl}</div>
                    </div>
                </div>
                {error && (
                    <div className="text-sm text-destructive">
                        {error}
                    </div>
                )}
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Link
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
