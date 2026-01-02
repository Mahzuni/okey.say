import React from 'react';
import { Download, RefreshCw, Skull, Trash2 } from 'lucide-react';
import { generatePDF } from '../utils/pdfExport';

const GameOver = ({ players, history, stake, loser, onRestart, setHistory }) => {

    const handleExport = () => {
        // Hide buttons during capture if possible, but simplest is just capture everything
        // Actually, buttons in PDF look weird.
        // Let's hide buttons for a split second or clone node.
        // html2canvas supports 'ignoreElements'.
        // Or just put buttons OUTSIDE the capture area.
        generatePDF('game-results-content');
    };

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    // Helper from GameBoard
    const getRunningScores = (roundIndex) => {
        const totalLost = players[0].score + history.reduce((acc, r) => acc + (r.winnerId !== players[0].id ? r.deduction : 0), 0);
        const snap = {};
        players.forEach(p => {
            let sc = totalLost;
            for (let i = 0; i <= roundIndex; i++) {
                if (history[i].winnerId !== p.id) {
                    sc -= history[i].deduction;
                }
            }
            snap[p.id] = sc;
        });
        return snap;
    };

    const handleDeleteRound = (roundId) => {
        setHistory(prev => prev.filter(r => r.id !== roundId));
    };


    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>

            {/* Capture Area */}
            <div id="game-results-content" className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem', background: '#2a2a2a' }}>
                {/* Using a darker solid/semi-solid background for better PDF contrast than pure glass transparency */}

                <div style={{ textAlign: 'center' }}>
                    <Skull size={64} color="#ff6b6b" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ color: '#ff6b6b', marginTop: 0, fontSize: '3rem' }}>Oyun Bitti!</h1>

                    <p style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
                        <strong style={{ textDecoration: 'underline', color: '#ff6b6b' }}>{loser.name}</strong> kaybetti!
                    </p>

                    {stake && (
                        <div style={{ marginBottom: '3rem', fontSize: '1.2rem', padding: '10px', border: '1px dashed rgba(255,255,255,0.3)', borderRadius: '8px', display: 'inline-block' }}>
                            Ödül: <strong>{stake}</strong>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Son Durum</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {sortedPlayers.map((p, i) => (
                            <div key={p.id} style={{
                                display: 'flex', justifyContent: 'space-between', padding: '15px',
                                background: p.id === loser.id ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                border: p.id === loser.id ? '1px solid #ff6b6b' : 'none',
                                fontSize: '1.2rem'
                            }}>
                                <span>{i + 1}. {p.name}</span>
                                <span style={{ fontWeight: 'bold' }}>{p.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History Table in Report */}
                {history.length > 0 && (
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Detaylı Oyun Geçmişi</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Saat</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Kazanan</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Tür</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Ceza</th>
                                    {players.map(p => (
                                        <th key={p.id} style={{ padding: '10px', textAlign: 'center' }}>{p.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => {
                                    const snap = getRunningScores(i);
                                    return (
                                        <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{i + 1}</td>
                                            <td style={{ padding: '10px', textAlign: 'left', opacity: 0.7 }}>
                                                {new Date(h.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{h.winnerName}</td>
                                            <td style={{ padding: '10px', textAlign: 'left' }}>{h.winTypeLabel}</td>
                                            <td style={{ padding: '10px', textAlign: 'left', color: '#ff6b6b' }}>-{h.deduction}</td>
                                            {players.map(p => (
                                                <td key={p.id} style={{
                                                    padding: '10px',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: h.winnerId === p.id ? '#4ade80' : 'white',
                                                    opacity: h.winnerId === p.id ? 1 : 0.7
                                                }}>
                                                    {snap[p.id]}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="glass-button" onClick={handleExport} style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                    <Download size={22} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    PDF Olarak İndir
                </button>
                <button className="glass-button danger" onClick={onRestart} style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
                    <RefreshCw size={22} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Yeniden Başla
                </button>
            </div>

            {/* If the game is "Finished" but user wants to fix a mistake, we can show delete buttons? 
          The previous request implied editing. 
          Currently I removed delete buttons from THIS view to keep the PDF clean, 
          but if they need to edit, they are technically in "finished" state.
          My App.jsx logic says if !loser (after delete), go back to playing.
          So I should probably allow deleting here too? 
          Or maybe just "Back to Game" button?
          "Yeniden Başla" resets.
          Let's add a "Düzenle" (Edit/Resume) button or just show Delete icons in the table IF we are not exporting?
          Actually, let's keep it simple. The user sees the PDF preview essentially.
          If they spot a mistake, they might need to go back.
          I will add a tiny delete button in the 'playing' view logic? 
          Actually, if the game is over, and they realize the last hand was wrong,
          they should be able to delete it.
          I will ADD the delete buttons to this table, BUT use 'data-html2canvas-ignore' on them!
      */}

        </div>
    );
};

export default GameOver;
