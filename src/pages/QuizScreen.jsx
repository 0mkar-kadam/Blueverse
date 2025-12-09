import React, { useState } from 'react';

const QuizScreen = ({ questions, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];

    const handleOptionClick = (option) => {
        if (selectedOption) return; // Lock selection
        setSelectedOption(option);

        const isCorrect = option === currentQuestion.answer;
        if (isCorrect) setScore(s => s + 1);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setSelectedOption(null);
            } else {
                onFinish(isCorrect ? score + 1 : score);
            }
        }, 1200); // Slightly longer for the user to see the "correct" status
    };

    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div key={currentIndex} style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8892b0', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <span>Question {currentIndex + 1} <span style={{ opacity: 0.5 }}>/ {questions.length}</span></span>
                    <span>Blueverse OS</span>
                </div>
                {/* Progress Bar */}
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #007bff, #00d4ff)', borderRadius: '10px', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                </div>
            </div>

            <h3 style={{ marginBottom: '2.5rem', fontSize: '1.4rem', lineHeight: '1.5', fontWeight: '600' }}>
                {currentQuestion.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentQuestion.options.map((option, idx) => {
                    let style = {};
                    let className = "option-btn";

                    // Base Style
                    const baseStyle = {
                        padding: '18px 24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '1rem',
                        position: 'relative',
                        overflow: 'hidden'
                    };

                    if (selectedOption) {
                        baseStyle.cursor = 'default';
                        if (option === currentQuestion.answer) {
                            baseStyle.background = 'rgba(0, 212, 255, 0.2)';
                            baseStyle.borderColor = '#00d4ff';
                            baseStyle.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
                        } else if (option === selectedOption) {
                            baseStyle.background = 'rgba(255, 77, 77, 0.2)';
                            baseStyle.borderColor = '#ff4d4d';
                        } else {
                            baseStyle.opacity = 0.5;
                        }
                    } else {
                        // Hover effect logic handled via CSS generally, but inline for now we rely on simple props
                    }

                    return (
                        <div
                            key={idx}
                            onClick={() => handleOptionClick(option)}
                            style={baseStyle}
                            onMouseEnter={(e) => {
                                if (!selectedOption) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!selectedOption) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }
                            }}
                        >
                            {option}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizScreen;
