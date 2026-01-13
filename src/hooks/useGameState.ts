import { useState, useCallback } from 'react';
import { GameState, GameConfig, ScoreEntry } from '@/types/game';

const initialPlayerState = (startingScore: number) => ({
  currentScore: startingScore,
  setsWon: 0,
  legsWonInCurrentSet: 0,
  gameHistory: [] as ScoreEntry[],
});

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = useCallback((config: GameConfig) => {
    const newState: GameState = {
      config,
      player1: initialPlayerState(config.startingScore),
      player2: initialPlayerState(config.startingScore),
      player1Name: config.player1Name || 'Player 1',
      player2Name: config.player2Name || 'Player 2',
      currentPlayer: 1,
      currentDart: 1,
      currentSet: 1,
      currentLeg: 1,
      gameStarted: true,
      gameWon: false,
      winner: null,
    };
    setGameState(newState);
  }, []);

  const recordScore = useCallback((score: number) => {
    if (!gameState || gameState.gameWon) return;

    setGameState((prev) => {
      if (!prev) return prev;

      const activePlayer = prev.currentPlayer === 1 ? 'player1' : 'player2';
      const currentPlayerState = prev[activePlayer];
      
      // Validate score
      if (score < 0 || score > 180) return prev;

      const newScore = currentPlayerState.currentScore - score;

      // Check for bust (going below 0)
      if (newScore < 0) {
        return prev; // Bust - no score recorded
      }

      // Check if player needs to finish on double/bull
      if (newScore === 0) {
        // Valid finishes: doubles (2, 4, 6, ..., 40) or bull (50)
        const isValidFinish = score === 50 || (score % 2 === 0 && score >= 2 && score <= 40);
        if (!isValidFinish) {
          // Invalid finish - must finish on double (2-40) or bull (50)
          return prev;
        }
      }

      // Valid score - record it
      const scoreEntry: ScoreEntry = {
        player: prev.currentPlayer,
        score,
        timestamp: Date.now(),
      };

      const updatedPlayerState = {
        ...currentPlayerState,
        currentScore: newScore,
        gameHistory: [...currentPlayerState.gameHistory, scoreEntry],
      };

      // Check for leg win
      if (newScore === 0) {
        updatedPlayerState.legsWonInCurrentSet += 1;
        
        // Check if set is won
        const legsNeeded = Math.ceil(prev.config.legsPerSet / 2);
        if (updatedPlayerState.legsWonInCurrentSet >= legsNeeded) {
          updatedPlayerState.setsWon += 1;
          updatedPlayerState.legsWonInCurrentSet = 0;
          
          // Check if game is won
          const setsNeeded = Math.ceil(prev.config.setsToWin / 2);
          if (updatedPlayerState.setsWon >= setsNeeded) {
            return {
              ...prev,
              [activePlayer]: updatedPlayerState,
              gameWon: true,
              winner: prev.currentPlayer,
            };
          }
          
          // Set won but game continues - reset scores and move to next set
          const winningPlayer = activePlayer;
          const otherPlayer = winningPlayer === 'player1' ? 'player2' : 'player1';
          return {
            ...prev,
            [winningPlayer]: {
              ...updatedPlayerState,
              currentScore: prev.config.startingScore,
              gameHistory: [],
            },
            [otherPlayer]: {
              ...prev[otherPlayer],
              currentScore: prev.config.startingScore,
              gameHistory: [],
              legsWonInCurrentSet: 0,
            },
            currentSet: prev.currentSet + 1,
            currentLeg: 1,
            currentPlayer: 1, // Reset to player 1 for new set
            currentDart: 1, // Reset dart counter
          };
        }
        
        // Leg won but set continues - reset scores and move to next leg
        const otherPlayer = prev.currentPlayer === 1 ? 'player2' : 'player1';
        return {
          ...prev,
          [activePlayer]: updatedPlayerState,
          [otherPlayer]: {
            ...prev[otherPlayer],
            currentScore: prev.config.startingScore,
            gameHistory: [],
          },
          currentLeg: prev.currentLeg + 1,
          currentPlayer: prev.currentPlayer === 1 ? 2 : 1, // Switch player
          currentDart: 1, // Reset dart counter
        };
      }

      // No win - update score and check if turn is complete (3 darts thrown)
      const nextDart = prev.currentDart + 1;
      if (nextDart > 3) {
        // Turn complete - switch to next player and reset dart counter
        return {
          ...prev,
          [activePlayer]: updatedPlayerState,
          currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
          currentDart: 1, // Reset to dart 1 for next player
        };
      } else {
        // More darts remaining in this turn - increment dart counter
        return {
          ...prev,
          [activePlayer]: updatedPlayerState,
          currentDart: nextDart,
        };
      }
    });
  }, [gameState]);

  const undoLastScore = useCallback(() => {
    if (!gameState || gameState.gameWon) return;

    setGameState((prev) => {
      if (!prev) return prev;

      // If current dart is 1, the last score was from the previous player on dart 3
      if (prev.currentDart === 1) {
        const previousPlayer = prev.currentPlayer === 1 ? 2 : 1;
        const previousPlayerState = prev[previousPlayer === 1 ? 'player1' : 'player2'];
        
        if (previousPlayerState.gameHistory.length === 0) return prev;
        
        const lastEntry = previousPlayerState.gameHistory[previousPlayerState.gameHistory.length - 1];
        const newHistory = previousPlayerState.gameHistory.slice(0, -1);
        const restoredScore = previousPlayerState.currentScore + lastEntry.score;
        
        return {
          ...prev,
          [previousPlayer === 1 ? 'player1' : 'player2']: {
            ...previousPlayerState,
            currentScore: restoredScore,
            gameHistory: newHistory,
          },
          currentPlayer: previousPlayer,
          currentDart: 3, // Go back to dart 3 of previous player
        };
      }

      // Current dart is 2 or 3, undo from current player
      const currentPlayerState = prev[prev.currentPlayer === 1 ? 'player1' : 'player2'];
      
      if (currentPlayerState.gameHistory.length === 0) return prev;

      const lastEntry = currentPlayerState.gameHistory[currentPlayerState.gameHistory.length - 1];
      const newHistory = currentPlayerState.gameHistory.slice(0, -1);
      const restoredScore = currentPlayerState.currentScore + lastEntry.score;
      
      return {
        ...prev,
        [prev.currentPlayer === 1 ? 'player1' : 'player2']: {
          ...currentPlayerState,
          currentScore: restoredScore,
          gameHistory: newHistory,
        },
        currentDart: prev.currentDart - 1, // Decrement dart counter
      };
    });
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  return {
    gameState,
    startGame,
    recordScore,
    undoLastScore,
    resetGame,
  };
}
