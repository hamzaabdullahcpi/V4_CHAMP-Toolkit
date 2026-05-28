const https = require('https');
const url = 'https://www.sng-wofi.org/country_profiles/assets/js/script.js';
https.get(url, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body.substring(0, 1500)));
});
