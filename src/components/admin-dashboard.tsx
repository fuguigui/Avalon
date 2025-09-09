'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
        <CardDescription>What would you like to do?</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button asChild size="lg">
          <Link href="/admin/create">Create a Game</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/dashboard">View Past Games</Link>
        </Button>
        <Button onClick={handleLogout} size="lg" variant="destructive">
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
}
