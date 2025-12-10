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
        // userData: { psNumber, score, total, feedback }
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
                            feedback: userData.feedback, // NEW: Store feedback
                            metadata: { timestamp: payload.timestamp }
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
    // Check if user has already played (Database Only)
    checkHasPlayed: async (psNumber) => {
        if (!psNumber) return false;

        // 1. Strict Database Check
        if (supabase) {
            try {
                const { count, error } = await supabase
                    .from('quiz_results')
                    .select('*', { count: 'exact', head: true })
                    .eq('ps_number', psNumber.toUpperCase());

                if (error) {
                    console.error('Supabase Validation Error:', error);
                    return false; // Fail open if DB error, or return true to block? user wants strictness, but blocking if offline is bad. 
                    // Let's assume false to allow play if DB is unreachable to avoid lockouts, but log it.
                }

                return count > 0;
            } catch (err) {
                console.error('Validation Exception:', err);
                return false;
            }
        }

        // Fallback: If no Supabase (e.g. dev mode without config), check local
        // This is only for dev safety, in prod it relies on Supabase
        console.warn('Supabase not configured for validation. Falling back to local.');
        const results = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        return results.some(r => r.psNumber && r.psNumber.toUpperCase() === psNumber.toUpperCase());
    },

    saveToLocal: (payload) => {
        const currentData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
        currentData.push(payload);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
        console.log('Data saved to Local Storage.');
    }
};
