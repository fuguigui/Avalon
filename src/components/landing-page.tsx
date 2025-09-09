import { KnightIcon } from '@/components/icons/knight-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLoginForm } from '@/components/forms/admin-login-form';
import { JoinGameForm } from '@/components/forms/join-game-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <header className="absolute top-8 flex items-center gap-3 text-center">
        <KnightIcon className="h-10 w-10 text-accent" />
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          AVALON
        </h1>
      </header>

      <main className="w-full max-w-md">
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="join">Join Game</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Join an Existing Game</CardTitle>
              </CardHeader>
              <CardContent>
                <JoinGameForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminLoginForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>The resistance must not fail. Good luck, loyal servants of Arthur.</p>
      </footer>
    </div>
  );
}