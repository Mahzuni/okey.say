import React, { useState } from 'react';
import { User, Trophy, Play } from 'lucide-react';

const GameSetup = ({ onStartGame }) => {
    const [playerCount, setPlayerCount] = useState(4);
    const [startPoints, setStartPoints] = useState(20);
    const [stake, setStake] = useState('');
    const [playerNames, setPlayerNames] = useState(Array(4).fill(''));

    const handleNameChange = (index, value) => {
        const newNames = [...playerNames];
        newNames[index] = value;
        setPlayerNames(newNames);
    };

    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);
        // Resize array if needed, preserving existing names
        if (count > playerNames.length) {
            setPlayerNames([...playerNames, ...Array(count - playerNames.length).fill('')]);
        } else {
            setPlayerNames(playerNames.slice(0, count));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Default names if empty
        const finalNames = playerNames.map((name, i) => name.trim() || `${i + 1}. Oyuncu`);
        onStartGame({
            players: finalNames,
            startPoints: parseInt(startPoints),
            stake: stake
        });
    };

    return (
        <div className="glass-panel fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Trophy size={28} color="#FFD700" />
                Yeni Oyun Kurulumu
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>

                {/* Helper function for slider or buttons could go here, keeping it simple for now */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Oyuncu Sayısı</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[2, 3, 4].map(num => (
                            <button
                                key={num}
                                type="button"
                                className={`glass-button ${playerCount === num ? 'active' : ''}`}
                                style={{ flex: 1, background: playerCount === num ? 'rgba(255,255,255,0.4)' : undefined }}
                                onClick={() => handlePlayerCountChange(num)}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Başlangıç Puanı</label>
                    <input
                        type="number"
                        className="glass-input"
                        style={{ width: '100%' }}
                        value={startPoints}
                        onChange={(e) => setStartPoints(e.target.value)}
                        min="1"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>İddia / Ödül (İsteğe Bağlı)</label>
                    <input
                        type="text"
                        className="glass-input"
                        style={{ width: '100%' }}
                        placeholder="Örn. Kaybeden dondurma ismarlar"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Oyuncu İsimleri</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {Array.from({ length: playerCount }).map((_, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={18} />
                                <input
                                    type="text"
                                    className="glass-input"
                                    style={{ flex: 1 }}
                                    placeholder={`${i + 1}. Oyuncu İsmi`}
                                    value={playerNames[i] || ''}
                                    onChange={(e) => handleNameChange(i, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="glass-button" style={{ marginTop: '1rem', background: 'rgba(50, 205, 50, 0.4)', fontSize: '1.1rem' }}>
                    <Play size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Oyunu Başlat
                </button>

            </form>
        </div>
    );
};

export default GameSetup;
