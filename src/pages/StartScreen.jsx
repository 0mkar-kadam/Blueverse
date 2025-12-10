import React, { useState, useEffect } from 'react';
import { QuizService } from '../services/QuizService';

const StartScreen = ({ onStart }) => {
    const [psNumber, setPsNumber] = useState('');
    const [error, setError] = useState('');

    // Typewriter State
    const fullText = "The Ultimate Quizverse";
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

    const checkDuplicatePlay = async (ps) => {
        return await QuizService.checkHasPlayed(ps);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanPs = psNumber.trim().toUpperCase();

        if (!cleanPs) {
            setError('>> ERROR: IDENTITY REQUIRED');
            return;
        }

        if (cleanPs.length < 5) {
            setError('>> ERROR: INVALID IDENTIFIER LENGTH');
            return;
        }

        // Show verifying state (optional UX improvement)
        const btn = document.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.innerText = "VERIFYING...";
        }

        // Check for duplicates
        if (await checkDuplicatePlay(cleanPs)) {
            setError('Nice try! You\'ve already played. Give others a chance to save the Blueverse! 😉');
            if (btn) {
                btn.disabled = false;
                btn.innerText = "Enter Quizverse";
            }
            return;
        }

        onStart(cleanPs);
    };

    return (
        <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Typewriter Header */}
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '400', color: '#00d4ff', fontFamily: 'monospace', minHeight: '2.5rem' }}>
                <span className="typewriter-text">{displayText}</span>
            </h2>
            <p style={{ color: '#00d4ff', fontSize: '1rem', marginTop: '-1rem', marginBottom: '2rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>
                Powered by AI, Driven by You!
            </p>

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(0,212,255,0.4)', whiteSpace: 'nowrap' }}>
                    Welcome To Media World!
                </h3>
                <p style={{ color: '#a0aec0', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    A next-gen quiz experience where AI meets IQ
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
                    Enter Quizverse
                </button>
            </form>
        </div>
    );
};

export default StartScreen;
