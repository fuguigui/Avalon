import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockGames = [
  { id: "XF4G8H", date: "2024-07-28", players: 7, outcome: "Good Wins", roles: "Merlin, Percival, 3x Loyal, Assassin, Morgana" },
  { id: "K9J2L1", date: "2024-07-27", players: 5, outcome: "Evil Wins", roles: "Merlin, Loyal, Assassin, Mordred, Morgana" },
  { id: "M3N5P7", date: "2024-07-26", players: 10, outcome: "Good Wins", roles: "Merlin, Percival, 4x Loyal, Assassin, Mordred, Morgana, Oberon" },
  { id: "Q1R9T2", date: "2024-07-25", players: 8, outcome: "Evil Wins", roles: "Merlin, Percival, 3x Loyal, Assassin, Mordred, Minion" },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="font-headline text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium font-code">{game.id}</TableCell>
                <TableCell>{game.date}</TableCell>
                <TableCell>{game.players}</TableCell>
                <TableCell>
                  <Badge variant={game.outcome === "Good Wins" ? "default" : "destructive"} className={game.outcome === "Good Wins" ? "bg-blue-600 hover:bg-blue-500" : ""}>
                    {game.outcome}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{game.roles}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
