
'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export function SiteHeader() {
    const pathname = usePathname();

    // Don't show the header on the landing page
    if (pathname === '/') {
        return null;
    }
    
    // Don't show on game page which has its own header
    if (pathname.startsWith('/game/')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex flex-1 justify-end">
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/">
                            <Home className="h-6 w-6 text-foreground" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
