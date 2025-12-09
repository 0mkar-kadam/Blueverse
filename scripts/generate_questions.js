import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'BlueverseQuizQuestions.xlsx');
const outputPath = path.join(process.cwd(), 'src/services/questions.js');

console.log('Reading Excel:', filePath);

try {
    const workbook = XLSX.readFile(filePath);
    let allQuestions = [];
    let idCounter = 1;

    // Iterate over all sheets
    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        console.log(`Processing sheet: ${sheetName} (${rows.length} rows)`);

        rows.forEach(row => {
            // Validate essential fields
            if (!row['Question'] || !row['Option A']) return;

            const questionObj = {
                id: idCounter++,
                question: row['Question'].trim(),
                options: [
                    row['Option A']?.toString().trim(),
                    row['Option B']?.toString().trim(),
                    row['Option C']?.toString().trim(),
                    row['Option D']?.toString().trim()
                ].filter(Boolean), // Remove empty options
                answer: row['Correct Answer']?.toString().trim()
            };

            // Double check: if 'Correct Answer' is missing but 'Correct Option' exists (e.g. 'A')
            if (!questionObj.answer && row['Correct Option']) {
                const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
                const idx = map[row['Correct Option'].trim().toUpperCase()];
                if (idx !== undefined && questionObj.options[idx]) {
                    questionObj.answer = questionObj.options[idx];
                }
            }

            allQuestions.push(questionObj);
        });
    });

    console.log(`Total questions extracted: ${allQuestions.length}`);

    const fileContent = `// Auto-generated from BlueverseQuizQuestions.xlsx
export const questions = ${JSON.stringify(allQuestions, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log('Successfully wrote to:', outputPath);

} catch (err) {
    console.error('Error generating questions:', err.message);
}
