const https = require('https');
const url = 'https://www.sng-wofi.org/country_profiles/presentation.html';
const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(body);
  });
});
req.on('error', console.error);
