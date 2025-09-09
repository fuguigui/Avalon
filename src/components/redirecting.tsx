'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';

export function Redirecting({ onCancel }: { onCancel: () => void }) {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/admin');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">You are logged in</CardTitle>
        <CardDescription>
          It is checked you are online. Will redirect in {countdown} seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Redirecting to the Admin Panel...</span>
        </div>
        <Button onClick={onCancel} variant="outline">
          Log out and stay on this page
        </Button>
      </CardContent>
    </Card>
  );
}
