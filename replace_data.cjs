const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('ndcCategoriesData.json', 'utf8'));

let targetFile = path.resolve('src/components/MapDashboard.tsx');
let fileContent = fs.readFileSync(targetFile, 'utf8');

// Replace champCountries
const champCountriesStr = `const champCountries = new Set([\n  ${data.champCountries.map(c => `"${c}"`).join(', ')}\n]);`;
fileContent = fileContent.replace(/const champCountries = new Set\(\[[\s\S]*?\]\);/, champCountriesStr);

// Replace ndcCategories
const mappedRatings = {};
for (const [key, val] of Object.entries(data.ndcCategories)) {
  let mappedVal = "None"; // default
  if (['A+', 'A', 'B+', 'B', 'C+', 'C'].includes(val)) {
    if (val === 'A+') mappedVal = 'A+';
    else if (val === 'A' || val === 'B+') mappedVal = 'A-B';
    else mappedVal = 'C';
  }
  if (mappedVal !== "None") {
    mappedRatings[key] = mappedVal;
  }
}

const aPlus = [];
const aB = [];
const cList = [];

for (const [k, v] of Object.entries(mappedRatings)) {
  if (v === 'A+') aPlus.push(k);
  else if (v === 'A-B') aB.push(k);
  else cList.push(k);
}

const formatArray = (arr) => {
    let result = '';
    for(let i=0; i<arr.length; i+=5) {
        result += '  ' + arr.slice(i, i+5).map(c => `"${c}": "${mappedRatings[c]}"`).join(', ') + ',\n';
    }
    return result.trim().replace(/,$/, '');
};

const ndcSet = `const ndcCategories: Record<string, string> = {\n${formatArray([...aPlus, ...aB, ...cList])}\n};`;

// Also check for inconsistencies and write to a file or output
const sectorsMapRegex = /const ndcSectorsMap: Record<string, string\[\]> = (\{[\s\S]*?\n    \});/;
const match = fileContent.match(sectorsMapRegex);

const inconsistencies = [];
if (match) {
   // evaluate the sectorsMap
   const code = "return " + match[1] + ";";
   const sectorsMapObj = new Function(code)();
   for (const [country, rating] of Object.entries(data.ndcCategories)) {
       const isPlus = rating.includes('+');
       if (isPlus) {
           const sectors = sectorsMapObj[country];
           if (sectors) {
               const hasFinance = sectors.includes('Urban Climate Finance') || sectors.includes('Urban Finance');
               const hasMulti = sectors.includes('Multilevel Governance');
               if (!hasFinance && !hasMulti) {
                   inconsistencies.push(`${country} has rating ${rating} but no Finance or Multilevel Governance in sectors.`);
               }
           }
       }
   }
}

console.log("Inconsistencies detected:", inconsistencies);

fileContent = fileContent.replace(/const ndcCategories: Record<string, string> = \{[\s\S]*?\n\};/, ndcSet);
fs.writeFileSync(targetFile, fileContent);
