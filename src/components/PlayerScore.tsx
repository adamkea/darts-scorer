import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerState } from '@/types/game';
import { cn } from '@/lib/utils';

interface PlayerScoreProps {
  playerNumber: 1 | 2;
  playerState: PlayerState;
  isActive: boolean;
  setsToWin: number;
  currentDart: number;
  currentPlayer: 1 | 2;
  playerName: string;
}

export function PlayerScore({ playerNumber, playerState, isActive, setsToWin, currentDart, currentPlayer, playerName }: PlayerScoreProps) {
  // Calculate how many darts have been thrown for this player
  const dartsThrown = isActive && currentPlayer === playerNumber ? currentDart - 1 : 0;

  return (
    <Card className={cn(
      "transition-all",
      isActive && "ring-2 ring-primary shadow-lg"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl">
              {playerName}
            </CardTitle>
            {/* Dart indicators */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((dart) => (
                <div
                  key={dart}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    dart <= dartsThrown
                      ? "bg-muted opacity-40"
                      : isActive && currentPlayer === playerNumber
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                  title={dart <= dartsThrown ? `Dart ${dart} thrown` : `Dart ${dart} remaining`}
                />
              ))}
            </div>
            {isActive && <Badge className="ml-1">Active</Badge>}
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Sets Won</div>
            <div className="text-3xl font-bold">
              {playerState.setsWon} / {Math.ceil(setsToWin / 2)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Current Score</div>
            <div className={cn(
              "text-6xl font-bold transition-colors",
              playerState.currentScore === 0 && "text-green-600",
              isActive && "text-primary"
            )}>
              {playerState.currentScore}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Legs Won (This Set)</div>
            <div className="text-2xl font-semibold">
              {playerState.legsWonInCurrentSet}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
