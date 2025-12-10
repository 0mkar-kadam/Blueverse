import { questions } from './questions';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'blueverse_quiz_results';
const SEEN_QUESTIONS_KEY = 'blueverse_seen_questions';

export const QuizService = {
    // Get N random questions, avoiding recently seen ones
    getQuestions: (count = 5) => {
        // 1. Get seen IDs
        let seenIds = [];
        try {
            seenIds = JSON.parse(localStorage.getItem(SEEN_QUESTIONS_KEY) || '[]');
        } catch (e) { console.error(e); }

        // 2. Filter available questions
        let available = questions.filter(q => !seenIds.includes(q.id));

        // 3. If not enough available, reset seen list to recycle questions
        if (available.length < count) {
            console.log('Resetting seen questions pool for freshness.');
            available = [...questions];
            seenIds = [];
            localStorage.removeItem(SEEN_QUESTIONS_KEY);
        }

        // 4. Shuffle available
        const shuffled = available.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        // 5. Update seen list with NEW selections
        const newSeenIds = [...seenIds, ...selected.map(q => q.id)];
        localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(newSeenIds));

        return selected;
    },

    // Save result to Database (Supabase) + LocalStorage (Backup)
    saveResult: async (userData) => {
        // userData: { psNumber, score, total }
        const payload = {
            ...userData,
            timestamp: new Date().toISOString()
        };

        // 1. Try Supabase
        if (supabase) {
            try {
                const { error } = await supabase
                    .from('quiz_results')
                    .insert([
                        {
                            ps_number: userData.psNumber,
                            score: userData.score,
                            total_questions: userData.total,
                            metadata: { timestamp: payload.timestamp } // Optional extra data
                        }
                    ]);

                if (error) throw error;
                console.log('Data saved to Supabase successfully.');
            } catch (err) {
                console.error('Supabase Save Failed (Saving to LocalStorage instead):', err.message);
                QuizService.saveToLocal(payload);
            }
        } else {
            console.warn('Supabase not configured. Saving to LocalStorage.');
            QuizService.saveToLocal(payload);
        }

        return true;
    },

    // Helper for LocalStorage fallback
    // Check if user has already played
    checkHasPlayed: (psNumber) => {
        // 1. Check LocalStorage
        const results = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        const hasPlayedLocal = results.some(r => r.psNumber && r.psNumber.toUpperCase() === psNumber.toUpperCase());
        
        return hasPlayedLocal;
        // Note: For stricter checks, we would verify with Supabase here
    },

    saveToLocal: (payload) => {
        const currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        currentData.push(payload);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
        console.log('Data saved to Local Storage.');
    }
};
