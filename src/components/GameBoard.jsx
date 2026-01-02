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
        <div className="fade-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem', boxSizing: 'border-box' }}>

            {/* Sticky Score Header - Floating Pill Style */}
            <div style={{
                position: 'sticky',
                top: '10px',
                zIndex: 100,
                width: '96%', // Prevent touching edges
                margin: '0 auto 1.5rem auto', // Centered
                padding: '0.5rem',
                background: 'rgba(36, 36, 36, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {stake && (
                    <div style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Gift color="#FF69B4" size={14} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{stake}</span>
                    </div>
                )}

                <div style={{
                    display: 'flex', // Flex is often safer than grid for even distribution avoiding overflow
                    justifyContent: 'space-between',
                    gap: '4px',
                    width: '100%',
                }}>
                    {players.map(p => (
                        <div key={p.id} style={{
                            flex: 1,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            background: p.score <= 5 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: p.score <= 5 ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            padding: '0.4rem 0',
                            minWidth: 0
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                marginBottom: '0px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                                opacity: 0.9,
                                padding: '0 4px'
                            }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: '1.6rem', lineHeight: 1.1, fontWeight: 800, color: p.score <= 5 ? '#ff6b6b' : 'white' }}>
                                {p.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Input Grid - Minimalist Numbers */}
            <div className="glass-panel" style={{
                marginBottom: '2rem',
                padding: '1rem 0.5rem',
                margin: '0 0.5rem 2rem 0.5rem'
            }}>
                <h2 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', textAlign: 'center' }}>Hızlı Skor Girişi</h2>

                {/* Scroll Container */}
                <div style={{ overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `minmax(80px, 1fr) repeat(4, 1fr)`, gap: '6px', alignItems: 'center', minWidth: '320px' }}>
                        {/* Header */}
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>Oyuncu</div>
                        {winTypes.map(t => (
                            <div key={t.value} style={{ fontSize: '0.7rem', textAlign: 'center', fontWeight: 'bold', color: t.color, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', opacity: 0.8 }}>
                                {t.label.toUpperCase()}
                            </div>
                        ))}

                        {/* Rows */}
                        {players.map(p => (
                            <React.Fragment key={p.id}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                {winTypes.map(t => (
                                    <button
                                        key={`${p.id}-${t.value}`}
                                        className="glass-button"
                                        style={{
                                            padding: '10px 0',
                                            background: 'rgba(255,255,255,0.08)',
                                            fontSize: '1.1rem', // Bigger number
                                            fontWeight: 700,
                                            borderRadius: '8px',
                                            color: t.color // Color the number itself
                                        }}
                                        onClick={() => handleAddRound(p.id, t.value, t.label)}
                                    >
                                        {t.value}
                                    </button>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.75rem', marginTop: '0.8rem', textAlign: 'center' }}>
                    Puan düşmek için sayıya tıkla.
                </p>
            </div>

            {/* History Table */}
            {history.length > 0 && (
                <div className="glass-panel" style={{
                    padding: '1rem',
                    overflowX: 'auto',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}>
                    <h2 style={{ textAlign: 'left', marginTop: 0, fontSize: '1.5rem' }}>Oyun Geçmişi</h2>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        color: 'white',
                        fontSize: '0.9rem',
                        minWidth: '600px' // Keep minWidth to force scroll inside the container, NOT the page
                    }}>
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
