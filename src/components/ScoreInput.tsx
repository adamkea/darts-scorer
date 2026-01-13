import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ScoreInputProps {
  onScoreSubmit: (score: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  currentDart: number;
  currentPlayer: 1 | 2;
  currentPlayerName: string;
}

const singleDartScores = [
  { label: '20', value: 20 },
  { label: 'T20', value: 60 },
  { label: '19', value: 19 },
  { label: 'T19', value: 57 },
  { label: '18', value: 18 },
  { label: 'T18', value: 54 },
  { label: 'Bull', value: 50 },
  { label: '25', value: 25 },
];

const threeDartScores = [
  { label: '180', value: 180 },
  { label: '174', value: 174 },
  { label: '171', value: 171 },
  { label: '167', value: 167 },
  { label: '164', value: 164 },
  { label: '160', value: 160 },
  { label: '140', value: 140 },
  { label: '100', value: 100 },
];

export function ScoreInput({ onScoreSubmit, onUndo, canUndo, currentDart, currentPlayer, currentPlayerName }: ScoreInputProps) {
  const [score, setScore] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [turnTotal, setTurnTotal] = useState<number | null>(null);

  // Reset turn total when dart counter resets (new turn starts)
  useEffect(() => {
    if (currentDart === 1) {
      setTurnTotal(null);
      setScore('');
    }
  }, [currentDart, currentPlayer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreValue = parseInt(score);
    
    if (batchMode) {
      // In batch mode, enter the total for all 3 darts (0-180)
      if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 180) {
        setTurnTotal(scoreValue);
        setScore('');
      }
    } else {
      // Single dart mode - submit immediately
      if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 180) {
        onScoreSubmit(scoreValue);
        setScore('');
      }
    }
  };

  const handleQuickScore = (value: number) => {
    if (batchMode) {
      // In batch mode, set as turn total
      setTurnTotal(value);
      setScore('');
    } else {
      // Single dart mode - submit immediately
      onScoreSubmit(value);
      setScore('');
    }
  };

  const handleSubmitTurnTotal = () => {
    if (turnTotal !== null) {
      // Submit the turn total as individual scores
      // We'll split it into 3 equal parts (rounded) for simplicity
      // Or we could submit it 3 times with the total on the last dart
      // For now, let's submit it as 3 separate entries to maintain game logic
      const remainingDarts = 3 - currentDart + 1;
      
      // Distribute the total across remaining darts
      if (remainingDarts === 3) {
        // Submit as three equal parts
        const perDart = Math.floor(turnTotal / 3);
        const remainder = turnTotal % 3;
        onScoreSubmit(perDart + (remainder >= 1 ? 1 : 0));
        onScoreSubmit(perDart + (remainder >= 2 ? 1 : 0));
        onScoreSubmit(perDart);
      } else if (remainingDarts === 2) {
        // Split between two darts
        const perDart = Math.floor(turnTotal / 2);
        const remainder = turnTotal % 2;
        onScoreSubmit(perDart + remainder);
        onScoreSubmit(perDart);
      } else {
        // Only one dart remaining
        onScoreSubmit(turnTotal);
      }
      
      setTurnTotal(null);
      setScore('');
    }
  };

  const handleBatchModeToggle = (checked: boolean) => {
    // Only allow toggling at the start of a turn (dart 1)
    if (currentDart === 1) {
      setBatchMode(checked);
      setTurnTotal(null);
      setScore('');
    }
  };

  const quickScores = batchMode ? threeDartScores : singleDartScores;
  const canToggleMode = currentDart === 1; // Only allow toggle at start of turn

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle>Enter Score</CardTitle>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="batch-mode" className={cn(
                "text-sm cursor-pointer",
                canToggleMode ? "text-muted-foreground" : "text-muted-foreground/50 cursor-not-allowed"
              )}>
                Single Dart
              </Label>
              <Switch
                id="batch-mode"
                checked={batchMode}
                onCheckedChange={handleBatchModeToggle}
                disabled={!canToggleMode}
              />
              <Label htmlFor="batch-mode" className={cn(
                "text-sm cursor-pointer",
                canToggleMode ? "text-muted-foreground" : "text-muted-foreground/50 cursor-not-allowed"
              )}>
                All Darts
              </Label>
            </div>
            {!batchMode && (
              <div className="text-sm text-muted-foreground">
                {currentPlayerName} - Dart {currentDart} of 3
              </div>
            )}
            {batchMode && (
              <div className="text-sm text-muted-foreground">
                {turnTotal !== null ? `Total: ${turnTotal}` : 'Enter turn total'}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batchMode && turnTotal !== null && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Turn Total:</div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-secondary rounded-md">
                  <span className="text-2xl font-bold">{turnTotal}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setTurnTotal(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="number"
              min="0"
              max={batchMode ? "180" : "180"}
              placeholder={batchMode ? "Turn total (0-180)" : "0-180"}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="text-2xl text-center"
            />
            {batchMode ? (
              <Button 
                type="submit" 
                size="lg"
                disabled={turnTotal !== null}
              >
                {turnTotal !== null ? 'Set' : 'Set Total'}
              </Button>
            ) : (
              <Button type="submit" size="lg">Submit</Button>
            )}
          </form>

          {batchMode && turnTotal !== null && (
            <Button
              type="button"
              onClick={handleSubmitTurnTotal}
              className="w-full"
              size="lg"
            >
              Submit Turn ({turnTotal} points)
            </Button>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">
              {batchMode ? 'Quick Turn Totals' : 'Quick Scores'}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {quickScores.map((quick) => (
                <Button
                  key={quick.label}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickScore(quick.value)}
                  className="h-12"
                  disabled={batchMode && turnTotal !== null}
                >
                  {quick.label}
                </Button>
              ))}
            </div>
          </div>

          {canUndo && !batchMode && (
            <Button
              variant="secondary"
              onClick={onUndo}
              className="w-full"
            >
              Undo Last Score
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
