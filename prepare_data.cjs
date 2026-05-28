const fs = require('fs');
const data = require('./parsed_ndc.json');

const ndcCategories = {};
const champCountries = new Set();
let output = [];

data.forEach(row => {
  let country = row.COUNTRY;
  const isChamp = country.endsWith('*');
  if (isChamp) {
    country = country.slice(0, -1);
  }
  
  // Custom normalization to match what we might need
  if (country === 'Bolivia (Plurinational State of)') country = 'Bolivia';
  if (country === 'Venezuela (Bolivarian Republic of)') country = 'Venezuela';
  if (country === 'Republic of Moldova') country = 'Moldova';
  
  if (isChamp) {
    champCountries.add(country);
  }
  const rating = row['NDC 3.0'];
  if (rating && rating !== 'No') {
    ndcCategories[country] = rating;
  }
});

fs.writeFileSync('ndcCategoriesData.json', JSON.stringify({
  ndcCategories,
  champCountries: Array.from(champCountries)
}, null, 2));

console.log("Categories:", Object.keys(ndcCategories).length);
console.log("CHAMP Countries:", champCountries.size);
