import { CreateGameForm } from '@/components/forms/create-game-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateGamePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-headline">Create a New Game</CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateGameForm />
                </CardContent>
            </Card>
        </div>
    )
}
