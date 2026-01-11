import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';

interface TurnSummaryProps {
  gameState: GameState;
}

interface TurnTotal {
  turnNumber: number;
  player1Total: number | null;
  player2Total: number | null;
}

export function TurnSummary({ gameState }: TurnSummaryProps) {
  // Group scores by turns (3 darts per turn) for each player
  const turnTotals = useMemo(() => {
    const turns: TurnTotal[] = [];
    
    // Process player 1 scores
    const player1Turns: { [key: number]: number } = {};
    const player1Scores = gameState.player1.gameHistory;
    let player1Turn = 1;
    let player1DartCount = 0;
    
    player1Scores.forEach((entry) => {
      if (!player1Turns[player1Turn]) {
        player1Turns[player1Turn] = 0;
      }
      player1Turns[player1Turn] += entry.score;
      player1DartCount++;
      
      if (player1DartCount === 3) {
        player1Turn++;
        player1DartCount = 0;
      }
    });
    
    // Process player 2 scores
    const player2Turns: { [key: number]: number } = {};
    const player2Scores = gameState.player2.gameHistory;
    let player2Turn = 1;
    let player2DartCount = 0;
    
    player2Scores.forEach((entry) => {
      if (!player2Turns[player2Turn]) {
        player2Turns[player2Turn] = 0;
      }
      player2Turns[player2Turn] += entry.score;
      player2DartCount++;
      
      if (player2DartCount === 3) {
        player2Turn++;
        player2DartCount = 0;
      }
    });
    
    // Combine into turn summary
    const maxTurns = Math.max(
      Object.keys(player1Turns).length,
      Object.keys(player2Turns).length,
      1
    );
    
    for (let i = 1; i <= maxTurns; i++) {
      turns.push({
        turnNumber: i,
        player1Total: player1Turns[i] ?? null,
        player2Total: player2Turns[i] ?? null,
      });
    }
    
    return turns;
  }, [gameState.player1.gameHistory, gameState.player2.gameHistory]);
  
  if (turnTotals.length === 0 || (turnTotals[0].player1Total === null && turnTotals[0].player2Total === null)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Turn Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 text-sm font-semibold border-b pb-2">
            <div>Turn</div>
            <div className="text-center">{gameState.player1Name}</div>
            <div className="text-center">{gameState.player2Name}</div>
          </div>
          
          {/* Turn rows */}
          <div className="max-h-64 overflow-y-auto space-y-1">
            {turnTotals.map((turn, index) => (
              <div
                key={turn.turnNumber}
                className={cn(
                  "grid grid-cols-3 gap-4 text-sm py-1",
                  index % 2 === 0 && "bg-muted/50 rounded"
                )}
              >
                <div className="font-medium">{turn.turnNumber}</div>
                <div className="text-center">
                  {turn.player1Total !== null ? (
                    <span className="font-semibold">{turn.player1Total}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                <div className="text-center">
                  {turn.player2Total !== null ? (
                    <span className="font-semibold">{turn.player2Total}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
