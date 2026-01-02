import React from 'react';
import { X } from 'lucide-react';

const ScoreModal = ({ players, onClose, onRoundComplete }) => {
    const winTypes = [
        { value: 1, label: 'Gösterge', color: '#4facfe' },
        { value: 2, label: 'Normal', color: '#00f2fe' },
        { value: 4, label: 'Okey', color: '#f093fb' },
        { value: 8, label: 'Çift', color: '#f5576c' },
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="glass-panel fade-in" style={{ width: '95%', maxWidth: '900px', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Bu eli kim, nasıl kazandı?</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) repeat(4, 1fr)', gap: '10px', alignItems: 'center' }}>
                    {/* Header Row */}
                    <div style={{ fontWeight: 'bold', opacity: 0.7, padding: '10px' }}>Oyuncu</div>
                    {winTypes.map(type => (
                        <div key={type.value} style={{ textAlign: 'center', fontWeight: 'bold', opacity: 0.7, fontSize: '0.9rem' }}>
                            {type.label} ({type.value})
                        </div>
                    ))}

                    {/* Player Rows */}
                    {players.map(p => (
                        <React.Fragment key={p.id}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', padding: '10px' }}>{p.name}</div>
                            {winTypes.map(type => (
                                <button
                                    key={`${p.id}-${type.value}`}
                                    className="glass-button"
                                    style={{
                                        padding: '15px 5px',
                                        fontSize: '0.9rem',
                                        background: 'rgba(255,255,255,0.08)',
                                        borderColor: 'rgba(255,255,255,0.1)'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = type.color; e.currentTarget.style.opacity = '1'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.opacity = '1'; }}
                                    onClick={() => onRoundComplete(p.id, type.value, type.label)}
                                >
                                    Seç
                                </button>
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6, textAlign: 'center' }}>
                    İptal etmek için sağ üstteki X'e basın.
                </div>
            </div>
        </div>
    );
};

export default ScoreModal;
