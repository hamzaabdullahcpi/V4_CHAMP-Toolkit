const xlsx = require('xlsx');
const fs = require('fs');
const wb = xlsx.readFile('NDC3.0_champ.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(JSON.stringify(data.slice(0, 5), null, 2));

const allData = xlsx.utils.sheet_to_json(sheet);
fs.writeFileSync('parsed_ndc.json', JSON.stringify(allData, null, 2));
