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

            {/* Sticky Score Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                width: '100%',
                background: 'rgba(36, 36, 36, 0.98)', // Slightly more unnecessary transparency
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                padding: '0.5rem 0', // Vertical padding only
                marginBottom: '1rem'
            }}>
                {stake && (
                    <div style={{ marginBottom: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Gift color="#FF69B4" size={14} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{stake}</span>
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                    gap: '2px', // Minimal gap
                    padding: '0 4px', // Minimal side padding
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {players.map(p => (
                        <div key={p.id} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            background: p.score <= 5 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: p.score <= 5 ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '0.3rem 0',
                            minWidth: 0
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                                opacity: 0.9,
                                padding: '0 2px'
                            }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: '1.8rem', lineHeight: 1.1, fontWeight: 800, color: p.score <= 5 ? '#ff6b6b' : 'white' }}>
                                {p.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Input Grid - Scrollable */}
            <div className="glass-panel" style={{
                marginBottom: '2rem',
                padding: '1rem 0.5rem',
                margin: '0 0.5rem 2rem 0.5rem' // Margin from screen edges
            }}>
                <h2 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', textAlign: 'center' }}>Hızlı Skor Girişi</h2>

                {/* Scroll Container */}
                <div style={{ overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `minmax(70px, 1fr) repeat(4, minmax(60px, 1fr))`, gap: '6px', alignItems: 'center', minWidth: '400px' }}>
                        {/* Header */}
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>KAZANAN</div>
                        {winTypes.map(t => (
                            <div key={t.value} style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold', color: t.color, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                                {t.value}
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
                                            padding: '8px 0',
                                            background: 'rgba(255,255,255,0.08)',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            minWidth: '40px' // Ensure clickable target
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
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.75rem', marginTop: '0.8rem', textAlign: 'center' }}>
                    Sağa kaydırarak diğer puanları görebilirsiniz.
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
