const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ndcCategoriesData.json', 'utf8'));

let targetFile = 'src/components/MapDashboard.tsx';
let fileContent = fs.readFileSync(targetFile, 'utf8');

const sectsMatch = fileContent.match(/const ndcSectoralData: Record<string, string\[\]> = (\{[^]*?\n +\});/);
if (sectsMatch) {
    const code = "return " + sectsMatch[1] + ";";
    const sectorsMapObj = new Function(code)();
    const inconsistencies = [];
    
    // In MapDashboard, there are specific color categories
    const mappedCategories = {};
    for (const [country, rating] of Object.entries(data.ndcCategories)) {
      if (rating.includes('+')) {
         const sectors = sectorsMapObj[country];
         if (sectors) {
            const hasFinance = sectors.includes('Urban Climate Finance') || sectors.includes('Urban Finance');
            const hasMulti = sectors.includes('Multilevel Governance');
            if (!hasFinance && !hasMulti) {
                inconsistencies.push(`${country} has rating ${rating} but NO Finance or Multilevel Governance in its detailed sectors.`);
            }
         } else {
            // inconsistencies.push(`${country} has rating ${rating} but NOT present in the frontend detailed sectors map.`);
         }
      }
    }
    
    console.log("Found Inconsistencies:");
    inconsistencies.forEach(x => console.log(x));
}
