import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 right-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <Home className="h-6 w-6 text-accent" />
            <span className="sr-only">Home</span>
          </Link>
        </Button>
      </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
