import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ResultScreen = ({ score, total, psNumber, onRestart }) => {
    const percentage = Math.round((score / total) * 100);
    let message = "Keep Exploring!";
    let subMessage = "The Blueverse is vast.";

    if (percentage >= 100) {
        message = "Legendary!";
        subMessage = "You are a true Blueverse Native.";
    } else if (percentage >= 80) {
        message = "Outstanding!";
        subMessage = "You have deep knowledge of the ecosystem.";
    } else if (percentage >= 60) {
        message = "Great Job!";
        subMessage = "You're well on your way.";
    }

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#007bff', '#00d4ff', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#007bff', '#00d4ff', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    const [feedbackGiven, setFeedbackGiven] = React.useState(false);
    const [selectedMood, setSelectedMood] = React.useState(null);

    const handleFeedback = (mood) => {
        setSelectedMood(mood);
        console.log(`User feedback: ${mood}`);

        // Save Result Here
        import('../services/QuizService').then(({ QuizService }) => {
            QuizService.saveResult({
                psNumber,
                score,
                total,
                feedback: mood
            });
        });

        // Small delay for effect
        setTimeout(() => {
            setFeedbackGiven(true);
        }, 600);
    };

    const FeedbackUI = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#fff' }}>How was your experience?</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '3rem' }}>
                {['🤩', '🙂', '😐', '🤔'].map((emoji, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleFeedback(idx)}
                        style={{
                            fontSize: '2.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: '2px solid rgba(0,212,255,0.3)',
                            borderRadius: '12px',
                            padding: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            transform: selectedMood === idx ? 'scale(1.1)' : 'scale(1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.borderColor = '#00d4ff';
                            e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                        }}
                        onMouseOut={(e) => {
                            if (selectedMood !== idx) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }
                        }}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <p style={{ color: '#a0aec0' }}>Select an option to see your results.</p>
        </div>
    );

    if (!feedbackGiven) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <FeedbackUI />
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', padding: '1rem', animation: 'fadeIn 1s' }}>
            <h2 style={{ marginBottom: '2.5rem', fontSize: '1.8rem' }}>Mission Complete</h2>

            <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'conic-gradient(#00d4ff ' + percentage + '%, rgba(255,255,255,0.05) 0)',
                margin: '0 auto 2.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
                position: 'relative'
            }}>
                <div style={{
                    width: '160px',
                    height: '160px',
                    background: 'var(--color-glass-bg)',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute'
                }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: '800', background: 'linear-gradient(to bottom, #fff, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {score}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        out of {total}
                    </span>
                </div>
            </div>

            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: '#fff' }}>{message}</h3>
            <p style={{ marginBottom: '3rem', color: '#a0aec0' }}>{subMessage}</p>

            <button
                onClick={onRestart} // Note: This will restart the flow, so new PS might be needed if validation is strict per session
                className="btn-primary-glow"
                style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', width: 'auto', display: 'none' }}
            >
                Play Again
            </button>

            <p style={{ marginTop: '2rem', color: '#00d4ff', fontWeight: '600' }}>Thank you for playing!</p>
        </div>
    );
};

export default ResultScreen;
