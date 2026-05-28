const https = require('https');
https.get('https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SNG_STRUCT,1.0/all?startPeriod=2016&dimensionAtObservation=AllDimensions', { headers: { 'Accept': 'application/vnd.sdmx.data+json; charset=utf-8; version=2.0' } }, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { 
      try {
          const json = JSON.parse(data);
          console.log(Object.keys(json));
          console.log(json.data.structure.dimensions.observation);
          // or series
          const obs = json.data.dataSets[0].observations;
          let count = 0;
          for (let key in obs) {
              if(count++ < 5) console.log(key, obs[key]);
          }
      } catch(e) {
          console.log("Error parsing", e);
          console.log(data.substring(0,500));
      }
  });
}).on("error", (err) => { console.log("Error: " + err.message); });
