import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GameConfig } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [setsToWin, setSetsToWin] = useState(3);
  const [legsPerSet, setLegsPerSet] = useState(3);
  const [startingScore, setStartingScore] = useState(501);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setsToWin >= 1 && legsPerSet >= 1 && startingScore > 0) {
      onStartGame({
        setsToWin,
        legsPerSet,
        startingScore,
        player1Name: player1Name.trim() || undefined,
        player2Name: player2Name.trim() || undefined,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Game Setup</CardTitle>
          <CardDescription>Configure your darts game settings</CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="sets" className="text-sm font-medium">
              Sets to Win (Best of)
            </label>
            <Input
              id="sets"
              type="number"
              min="1"
              max="11"
              value={setsToWin}
              onChange={(e) => setSetsToWin(parseInt(e.target.value) || 1)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Best of {setsToWin} set{setsToWin !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="legs" className="text-sm font-medium">
              Legs per Set (Best of)
            </label>
            <Input
              id="legs"
              type="number"
              min="1"
              max="11"
              value={legsPerSet}
              onChange={(e) => setLegsPerSet(parseInt(e.target.value) || 1)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Best of {legsPerSet} leg{legsPerSet !== 1 ? 's' : ''} per set
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="score" className="text-sm font-medium">
              Starting Score
            </label>
            <Input
              id="score"
              type="number"
              min="1"
              max="999"
              value={startingScore}
              onChange={(e) => setStartingScore(parseInt(e.target.value) || 501)}
              required
            />
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-sm font-medium">Player Names (Optional)</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="player1" className="text-xs text-muted-foreground">
                  Player 1
                </label>
                <Input
                  id="player1"
                  type="text"
                  placeholder="Player 1"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="player2" className="text-xs text-muted-foreground">
                  Player 2
                </label>
                <Input
                  id="player2"
                  type="text"
                  placeholder="Player 2"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Start Game
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
