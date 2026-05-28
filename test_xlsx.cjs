const https = require('https');
https.request('https://www.sng-wofi.org/publications/SNGWOFI_2022_dataset.xlsx', {method: 'HEAD'}, (res) => {
  console.log(res.statusCode);
  console.log(res.headers);
}).end();
