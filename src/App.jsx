import React, { useState, useMemo, useEffect } from 'react';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import GameOver from './components/GameOver';

function App() {
  const [gameStatus, setGameStatus] = useState('setup'); // setup, playing, finished
  const [gameConfig, setGameConfig] = useState(null); // { players: [], startPoints: 20, stake: '' }
  const [history, setHistory] = useState([]);

  // Derive current player scores from history
  const players = useMemo(() => {
    if (!gameConfig) return [];

    // Initialize scores
    const currentPlayers = gameConfig.players.map((name, index) => ({
      id: index,
      name: name,
      score: gameConfig.startPoints
    }));

    // Replay history
    history.forEach(round => {
      // Find winner ID
      const winnerId = round.winnerId;

      currentPlayers.forEach(p => {
        if (p.id !== winnerId) {
          p.score -= round.deduction;
        }
      });
    });

    return currentPlayers;

  }, [gameConfig, history]);

  // Check for game over
  const loser = useMemo(() => {
    return players.find(p => p.score <= 0) || null;
  }, [players]);

  // Effect to manage game status transitions based on derived state
  useEffect(() => {
    if (gameStatus === 'playing' && loser) {
      setGameStatus('finished');
    } else if (gameStatus === 'finished' && !loser) {
      // If we deleted a round and score went > 0, resume playing
      setGameStatus('playing');
    }
  }, [loser, gameStatus]);


  const handleStartGame = (settings) => {
    setGameConfig({
      players: settings.players, // Names array
      startPoints: settings.startPoints,
      stake: settings.stake
    });
    setHistory([]);
    setGameStatus('playing');
  };

  const handleRestart = () => {
    setGameStatus('setup');
    setGameConfig(null);
    setHistory([]);
  };

  return (
    <div className="App">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', margin: 0 }}>OkeySay</h1>
        <p style={{ opacity: 0.7, marginTop: '5px' }}>Basit Skor Tutucu</p>
      </div>

      {gameStatus === 'setup' && (
        <GameSetup onStartGame={handleStartGame} />
      )}

      {gameStatus === 'playing' && (
        <GameBoard
          players={players}
          stake={gameConfig?.stake}
          history={history}
          setHistory={setHistory}
        />
      )}

      {gameStatus === 'finished' && loser && (
        <GameOver
          players={players}
          history={history}
          stake={gameConfig?.stake}
          loser={loser}
          onRestart={handleRestart}
          setHistory={setHistory}
        />
      )}

      <footer style={{ marginTop: '4rem', opacity: 0.4, fontSize: '0.8rem' }}>
        &copy; {new Date().getFullYear()} OkeySay. İyi Eğlenceler!
      </footer>
    </div>
  );
}

export default App;
