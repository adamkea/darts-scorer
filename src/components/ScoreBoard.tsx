import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlayerScore } from './PlayerScore';
import { ScoreInput } from './ScoreInput';
import { TurnSummary } from './TurnSummary';
import { GameState } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

interface ScoreBoardProps {
  gameState: GameState;
  onScoreSubmit: (score: number) => void;
  onUndo: () => void;
  onReset: () => void;
}

export function ScoreBoard({ gameState, onScoreSubmit, onUndo, onReset }: ScoreBoardProps) {
  const activePlayerState = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
  const canUndo = activePlayerState.gameHistory.length > 0 && !gameState.gameWon;
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Game Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">Darts Game</CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Set {gameState.currentSet}</span>
                <span>•</span>
                <span>Leg {gameState.currentLeg}</span>
                <span>•</span>
                <span>
                  Best of {gameState.config.setsToWin} sets
                </span>
                {!gameState.gameWon && (
                  <>
                    <span>•</span>
                    <span>
                      Dart {gameState.currentDart} of 3
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button variant="outline" onClick={onReset}>
                New Game
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Winner Banner */}
      {gameState.gameWon && gameState.winner && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                🎯 {gameState.winner === 1 ? gameState.player1Name : gameState.player2Name} Wins!
              </div>
              <div className="text-lg text-green-600 dark:text-green-400">
                Congratulations on winning the game!
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        <PlayerScore
          playerNumber={1}
          playerState={gameState.player1}
          isActive={gameState.currentPlayer === 1 && !gameState.gameWon}
          setsToWin={gameState.config.setsToWin}
          currentDart={gameState.currentDart}
          currentPlayer={gameState.currentPlayer}
          playerName={gameState.player1Name}
        />
        <PlayerScore
          playerNumber={2}
          playerState={gameState.player2}
          isActive={gameState.currentPlayer === 2 && !gameState.gameWon}
          setsToWin={gameState.config.setsToWin}
          currentDart={gameState.currentDart}
          currentPlayer={gameState.currentPlayer}
          playerName={gameState.player2Name}
        />
      </div>

      {/* Score Input */}
      {!gameState.gameWon && (
        <ScoreInput
          onScoreSubmit={onScoreSubmit}
          onUndo={onUndo}
          canUndo={canUndo}
          currentDart={gameState.currentDart}
          currentPlayer={gameState.currentPlayer}
          currentPlayerName={gameState.currentPlayer === 1 ? gameState.player1Name : gameState.player2Name}
        />
      )}

      {/* Turn Summary */}
      <TurnSummary gameState={gameState} />
    </div>
  );
}
