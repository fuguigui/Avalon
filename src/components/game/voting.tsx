import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Shield, Swords } from 'lucide-react';
import type { Role } from '@/lib/types';
import { ROLES } from '@/lib/constants';

interface VotingProps {
  type: 'team' | 'quest';
  playerRole?: Role['name'];
}

export default function Voting({ type, playerRole }: VotingProps) {
  const isEvil = playerRole ? ROLES[playerRole]?.alignment === 'evil' : false;

  const renderTeamVote = () => (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Vote on the Proposed Team</CardTitle>
        <CardDescription>Do you approve this team for the quest?</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button variant="outline" size="lg" className="flex-1 text-green-400 border-green-400 hover:bg-green-400/10 hover:text-green-300">
          <ThumbsUp className="mr-2 h-5 w-5" /> Approve
        </Button>
        <Button variant="outline" size="lg" className="flex-1 text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300">
          <ThumbsDown className="mr-2 h-5 w-5" /> Reject
        </Button>
      </CardContent>
    </>
  );

  const renderQuestVote = () => (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Vote on the Quest Outcome</CardTitle>
        <CardDescription>Choose whether the quest succeeds or fails.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button variant="outline" size="lg" className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-400/10 hover:text-blue-300">
          <Shield className="mr-2 h-5 w-5" /> Success
        </Button>
        <Button variant="outline" size="lg" className="flex-1 text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300" disabled={!isEvil}>
          <Swords className="mr-2 h-5 w-5" /> Fail
        </Button>
      </CardContent>
    </>
  );

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-lg">
        {type === 'team' ? renderTeamVote() : renderQuestVote()}
      </Card>
    </div>
  );
}
