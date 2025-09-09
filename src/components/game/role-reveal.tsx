import type { Player } from '@/lib/types';
import { ROLES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Swords } from 'lucide-react';
import Image from 'next/image';

interface RoleRevealProps {
  player: Player;
}

export default function RoleReveal({ player }: RoleRevealProps) {
  // Use a mock role if none is assigned for demonstration
  const role = ROLES[player.role || 'Merlin'];

  const alignmentIcon = role.alignment === 'good'
    ? <Shield className="h-8 w-8 text-blue-400" />
    : <Swords className="h-8 w-8 text-red-400" />;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Your Role Is...</CardTitle>
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2 text-xl font-bold">
              {alignmentIcon}
              <span className={role.alignment === 'good' ? 'text-blue-400' : 'text-red-400'}>{role.name}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <Image 
                src={`https://picsum.photos/seed/${role.name}/300/400`}
                data-ai-hint={`${role.alignment === 'good' ? 'knight' : 'sorcerer'} fantasy`}
                alt={role.name}
                width={200}
                height={280}
                className="rounded-lg shadow-lg shadow-accent/20 border-2 border-accent/50 mb-4"
            />
          <CardDescription className="text-base">
            {role.description}
          </CardDescription>
           {role.knows && (
            <div className="mt-4 w-full bg-secondary p-3 rounded-lg">
                <h4 className="font-bold text-sm text-foreground">You know the following roles:</h4>
                <p className="text-xs text-muted-foreground">{role.knows.join(', ')}</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
