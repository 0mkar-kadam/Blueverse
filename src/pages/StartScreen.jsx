import React, { useState, useEffect } from 'react';

const StartScreen = ({ onStart }) => {
    const [psNumber, setPsNumber] = useState('');
    const [error, setError] = useState('');

    // Typewriter State
    const fullText = "Initialize Agent Sequence...";
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        const typing = setInterval(() => {
            if (i <= fullText.length) {
                setDisplayText(fullText.slice(0, i));
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
        return () => clearInterval(typing);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!psNumber.trim()) {
            setError('>> ERROR: IDENTITY REQUIRED');
            return;
        }
        onStart(psNumber);
    };

    return (
        <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Typewriter Header */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '400', color: '#00d4ff', fontFamily: 'monospace', minHeight: '2.5rem' }}>
                <span className="typewriter-text">{displayText}</span>
            </h2>

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
                    Welcome, Traveler.
                </h3>
                <p style={{ color: '#a0aec0', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    The Blueverse awaits your contribution. <br />
                    Are you ready to sync?
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <input
                        type="text"
                        className="input-glass"
                        placeholder="ENTER PS NUMBER"
                        value={psNumber}
                        onChange={(e) => {
                            setPsNumber(e.target.value.toUpperCase());
                            setError('');
                        }}
                    />
                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', marginTop: '1rem', fontFamily: 'monospace', animation: 'fadeIn 0.3s' }}>{error}</p>}
                </div>

                <button
                    type="submit"
                    className="btn-primary-glow"
                    style={{ width: '100%' }}
                >
                    Initiate Launch
                </button>
            </form>
        </div>
    );
};

export default StartScreen;
