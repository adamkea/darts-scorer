import { useGameState } from './hooks/useGameState';
import { GameSetup } from './components/GameSetup';
import { ScoreBoard } from './components/ScoreBoard';

function App() {
  const { gameState, startGame, recordScore, undoLastScore, resetGame } = useGameState();

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GameSetup onStartGame={startGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <ScoreBoard
        gameState={gameState}
        onScoreSubmit={recordScore}
        onUndo={undoLastScore}
        onReset={resetGame}
      />
    </div>
  );
}

export default App;
