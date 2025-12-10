import React, { useState } from 'react';
import Layout from './components/Layout';
import StartScreen from './pages/StartScreen';
import QuizScreen from './pages/QuizScreen';
import ResultScreen from './pages/ResultScreen';
import { QuizService } from './services/QuizService';

const App = () => {
  const [screen, setScreen] = useState('start'); // start, quiz, result
  const [psNumber, setPsNumber] = useState('');
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  const handleStart = (ps) => {
    setPsNumber(ps);
    const q = QuizService.getQuestions(5);
    setQuestions(q);
    setScreen('quiz');
  };

  const handleQuizFinish = (finalScore) => {
    setScore(finalScore);
    // Saving is now handled in ResultScreen after feedback
    setScreen('result');
  };

  const handleRestart = () => {
    setScreen('start');
    setPsNumber('');
    setScore(0);
  };

  return (
    <Layout title={screen === 'quiz' ? 'Quiz in Progress' : ''}>
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'quiz' && <QuizScreen questions={questions} onFinish={handleQuizFinish} />}
      {screen === 'result' && <ResultScreen score={score} total={questions.length} psNumber={psNumber} onRestart={handleRestart} />}
    </Layout>
  );
};

export default App;
