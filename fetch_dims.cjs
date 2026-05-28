const https = require('https');
const urlStruct = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SNG_STRUCT,1.0/all?startPeriod=2016&dimensionAtObservation=AllDimensions';
https.get(urlStruct, { headers: { 'Accept': 'application/vnd.sdmx.data+json; charset=utf-8; version=2.0' } }, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { 
      try {
          const json = JSON.parse(data);
          let dim = json.data.structures[0].dimensions.observation;
          console.log(JSON.stringify(dim.map(d => ({id: d.id, values: d.values.map(v => v.name)})), null, 2));
      } catch(e) { console.error(e) }
  });
});
