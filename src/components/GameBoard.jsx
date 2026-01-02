import React, { useEffect } from 'react';
import { Gift, Trash2 } from 'lucide-react';

const GameBoard = ({ players, stake, history, setHistory }) => {

    const winTypes = [
        { value: 1, label: 'Gösterge', color: '#4facfe' },
        { value: 2, label: 'Normal', color: '#00f2fe' },
        { value: 4, label: 'Okey', color: '#f093fb' },
        { value: 8, label: 'Çift', color: '#f5576c' },
    ];

    const handleAddRound = (winnerId, deduction, winTypeLabel) => {
        setHistory(prev => [...prev, {
            id: Date.now(),
            winnerId,
            winnerName: players.find(p => p.id === winnerId).name,
            deduction,
            winTypeLabel,
            timestamp: new Date().toISOString()
        }]);
    };

    const handleDeleteRound = (roundId) => {
        setHistory(prev => prev.filter(r => r.id !== roundId));
    };

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

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}>

            {/* Sticky Score Header - Optimized for mobile */}
            <div style={{
                position: 'sticky',
                top: '10px',
                zIndex: 100,
                // Negative margins counteract container padding, but on mobile container padding might be small. 
                // Better to set width 100vw or similar if layout allows, but sticking to logic.
                margin: '0 -1rem 2rem -1rem',
                padding: '0.8rem 0.5rem',
                background: 'rgba(36, 36, 36, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {stake && (
                    <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Gift color="#FF69B4" size={20} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{stake}</span>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                    gap: '10px',
                    width: '100%',
                    maxWidth: '100%'
                }}>
                    {players.map(p => (
                        <div key={p.id} className="glass-panel" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: p.score <= 5 ? '2px solid rgba(255, 107, 107, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '0.5rem',
                            minWidth: 0 // Allow shrinking
                        }}>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                marginBottom: '0.2rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%'
                            }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: '2.5rem', lineHeight: 1, fontWeight: 800, color: p.score <= 5 ? '#ff6b6b' : 'white' }}>
                                {p.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Input Grid - Scrollable Container */}
            <h2 style={{ marginTop: '1rem', fontSize: '1.5rem', textAlign: 'center' }}>Hızlı Skor Girişi</h2>
            <div className="glass-panel" style={{ marginBottom: '3rem', overflowX: 'auto', padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, 1fr) repeat(4, 1fr)', gap: '10px', alignItems: 'center', minWidth: '600px' }}>
                    {/* Header */}
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>KAZANAN</div>
                    {winTypes.map(t => (
                        <div key={t.value} style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold', color: t.color, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            {t.value}
                        </div>
                    ))}

                    {/* Rows */}
                    {players.map(p => (
                        <React.Fragment key={p.id}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                            {winTypes.map(t => (
                                <button
                                    key={`${p.id}-${t.value}`}
                                    className="glass-button"
                                    style={{
                                        padding: '12px 0',
                                        background: 'rgba(255,255,255,0.08)',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = t.color; e.currentTarget.style.opacity = '1'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.opacity = '1'; }}
                                    onClick={() => handleAddRound(p.id, t.value, t.label)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
                    Oyunu kazanan kişinin butonuna bas.
                </p>
            </div>

            {/* History Table */}
            {history.length > 0 && (
                <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
                    <h2 style={{ textAlign: 'left', marginTop: 0, fontSize: '1.5rem' }}>Oyun Geçmişi</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem', minWidth: '600px' }}>
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
                                <th style={{ padding: '10px' }}>Sil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, i) => {
                                const snap = getRunningScores(i);
                                return (
                                    <tr key={h.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px', textAlign: 'left' }}>{i + 1}</td>
                                        <td style={{ padding: '10px', textAlign: 'left', opacity: 0.7, fontSize: '0.8rem' }}>
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
                                                opacity: h.winnerId === p.id ? 1 : 0.8,
                                                color: h.winnerId === p.id ? '#4ade80' : 'white'
                                            }}>
                                                {snap[p.id]}
                                            </td>
                                        ))}
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDeleteRound(h.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', opacity: 0.7 }}
                                                title="Bu eli sil"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default GameBoard;
