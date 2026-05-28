const https = require('https');
const urlSocio = 'https://sdmx.oecd.org/public/rest/data/OECD.CFE.RDG,DSD_SNG_WOFI@DF_SOCIO,1.0/all?startPeriod=2016&dimensionAtObservation=AllDimensions';

https.get(urlSocio, { headers: { 'Accept': 'application/vnd.sdmx.data+json; charset=utf-8; version=2.0' } }, (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { 
      try {
          const json = JSON.parse(data);
          let dim = json.data.structures[0].dimensions.observation;
          console.log("Socio Dimensions:", dim.map(d => Object.keys(d)));
          let refArea = dim.find(d => d.id === 'REF_AREA');
          console.log("Ref Area values:", refArea ? refArea.values.length : 'none');
          
          let indicator = dim.find(d => d.id === 'MEASURE' || d.id === 'INDICATOR' || d.id.includes('IND'));
          if (indicator) {
              console.log("Indicators:", indicator.values.map(v => v.name));
          } else {
             console.log("Dimensions:", dim.map(d => d.id));
             let m = dim.find(d => d.id === 'SECTOR');
             if(m) console.log("Sector:", m.values.map(v => v.name));
          }
      } catch(e) {}
  });
});
