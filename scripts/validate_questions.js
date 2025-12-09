import { questions } from '../src/services/questions.js';

let mismatchCount = 0;
console.log(`Validating ${questions.length} questions...`);

questions.forEach((q, idx) => {
    const isAnswerInOptions = q.options.includes(q.answer);
    if (!isAnswerInOptions) {
        console.log(`\n[Mismatch ID: ${q.id}]`);
        console.log('Answer:', `"${q.answer}"`);
        console.log('Options:', q.options.map(o => `"${o}"`));
        mismatchCount++;
    }
});

if (mismatchCount === 0) {
    console.log('\n✅ All questions have valid answers locally.');
} else {
    console.log(`\n❌ Found ${mismatchCount} mismatches.`);
}
