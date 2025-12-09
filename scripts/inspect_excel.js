import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../BlueverseQuizQuestions.xlsx');

console.log('Reading file:', filePath);

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);

    workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (data.length > 0) {
            console.log(`\n--- Sheet: ${sheetName} ---`);
            console.log('Headers (Row 1):', data[0]);
            console.log('First Data Row (Row 2):', data[1]);
        } else {
            console.log(`\n--- Sheet: ${sheetName} is empty ---`);
        }
    });

} catch (err) {
    console.error('Error reading file:', err.message);
}
