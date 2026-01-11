export type Player = 1 | 2;

export interface GameConfig {
  setsToWin: number; // Best of X sets (e.g., best of 3, 5, 7)
  legsPerSet: number; // Number of legs needed to win a set
  startingScore: number; // Starting score (default 501)
  player1Name?: string; // Optional custom name for player 1
  player2Name?: string; // Optional custom name for player 2
}

export interface PlayerState {
  currentScore: number;
  setsWon: number;
  legsWonInCurrentSet: number;
  gameHistory: ScoreEntry[];
}

export interface ScoreEntry {
  player: Player;
  score: number;
  timestamp: number;
}

export interface GameState {
  config: GameConfig;
  player1: PlayerState;
  player2: PlayerState;
  player1Name: string; // Player 1 name (custom or default)
  player2Name: string; // Player 2 name (custom or default)
  currentPlayer: Player;
  currentDart: number; // 1, 2, or 3 - which dart in the current turn
  currentSet: number;
  currentLeg: number;
  gameStarted: boolean;
  gameWon: boolean;
  winner: Player | null;
}
