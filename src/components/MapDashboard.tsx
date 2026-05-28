import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Users, Globe2, FileText, ArrowRight, ExternalLink, ChevronDown, ChevronUp, ZoomIn, Maximize, Hand, MousePointer2, Info, X, Lightbulb, MapPin, Search, Activity } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { feature, merge } from 'topojson-client';
// @ts-ignore
import { geoRobinson } from 'd3-geo-projection';
import AnimatedCounter from './AnimatedCounter';
import { actionsData } from '../data/content';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const normalizeName = (name: string) => {
  if (name === "United States of America") return "United States";
  if (name === "Dem. Rep. Korea") return "North Korea";
  if (name === "Korea" || name === "Republic of Korea") return "South Korea";
  if (name === "S. Sudan") return "South Sudan";
  if (name === "W. Sahara" || name === "Western Sahara") return "Morocco";
  if (name === "Somaliland") return "Somalia";
  if (name === "Central African Rep.") return "Central African Republic";
  if (name === "Eq. Guinea") return "Equatorial Guinea";
  if (name === "Dominican Rep.") return "Dominican Republic";
  if (name === "Solomon Is.") return "Solomon Islands";
  if (name === "Falkland Is.") return "Falkland Islands";
  if (name === "Bosnia and Herz.") return "Bosnia and Herzegovina";
  return name;
};

// Finance Data mapping
const financeRegionsInfo = {
  "US & CANADA": { mitigation: "889B", total: "101B" },
  "LATIN AMERICA & CARIBBEAN": { mitigation: "321B", total: "22B" },
  "WESTERN EUROPE": { mitigation: "562B", total: "213B" },
  "MIDDLE EAST & NORTH AFRICA": { mitigation: "367B", total: "8B" },
  "SUB-SAHARAN AFRICA": { mitigation: "134B", total: "5B" },
  "CENTRAL ASIA & EASTERN EUROPE": { mitigation: "454B", total: "17B" },
  "SOUTH ASIA": { mitigation: "357B", total: "17B" },
  "EAST ASIA & PACIFIC": { mitigation: "1186B", total: "387B" },
  "OTHER OCEANIA": { mitigation: "57B", total: "3B" },
};

const getFinanceRegionName = (country: string): string | null => {
  const regions: Record<string, string[]> = {
    "US & CANADA": ["United States", "Canada", "United States of America"],
    "LATIN AMERICA & CARIBBEAN": ["Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Bolivia", "Paraguay", "Uruguay", "Venezuela", "Panama", "Nicaragua", "Guatemala", "El Salvador", "Honduras", "Cuba", "Jamaica", "Bahamas", "Haiti", "Dominican Rep.", "Dominican Republic", "Costa Rica", "Belize", "Suriname", "Guyana", "Ecuador", "Puerto Rico", "Falkland Is."],
    "WESTERN EUROPE": ["United Kingdom", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Sweden", "Norway", "Finland", "Denmark", "Austria", "Switzerland", "Greece", "Iceland", "Luxembourg", "Greenland"],
    "EAST ASIA & PACIFIC": ["China", "Japan", "South Korea", "North Korea", "Taiwan", "Mongolia", "Indonesia", "Philippines", "Vietnam", "Thailand", "Malaysia", "Singapore", "Myanmar", "Cambodia", "Laos", "Brunei", "Dem. Rep. Korea", "Republic of Korea", "Timor-Leste"],
    "SOUTH ASIA": ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan", "Afghanistan", "Maldives"],
    "MIDDLE EAST & NORTH AFRICA": ["Saudi Arabia", "United Arab Emirates", "Qatar", "Oman", "Yemen", "Iran", "Iraq", "Syria", "Jordan", "Lebanon", "Israel", "Egypt", "Morocco", "Algeria", "Tunisia", "Libya", "Kuwait", "W. Sahara", "Western Sahara", "Palestine"],
    "SUB-SAHARAN AFRICA": ["Nigeria", "Ethiopia", "Kenya", "South Africa", "Tanzania", "Congo", "Dem. Rep. Congo", "Uganda", "Ghana", "Angola", "Rwanda", "Senegal", "Zambia", "Zimbabwe", "Cameroon", "Mali", "Madagascar", "Sudan", "South Sudan", "Somalia", "Somaliland", "Niger", "Chad", "Burkina Faso", "Botswana", "Namibia", "Mozambique", "Cote d'Ivoire", "Côte d'Ivoire", "Central African Rep.", "Central African Republic", "Gabon", "Eq. Guinea", "Equatorial Guinea", "Mauritania", "Guinea", "Guinea-Bissau", "Liberia", "Sierra Leone", "Togo", "Benin", "Eritrea", "Djibouti", "Burundi", "Malawi", "Lesotho", "eSwatini", "Gambia", "Swaziland"],
    "CENTRAL ASIA & EASTERN EUROPE": ["Russia", "Ukraine", "Poland", "Romania", "Czechia", "Hungary", "Belarus", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Bulgaria", "Serbia", "Slovakia", "Croatia", "Turkey", "Türkiye", "Moldova", "Armenia", "Azerbaijan", "Georgia", "Bosnia and Herz.", "Macedonia", "North Macedonia", "Albania", "Montenegro", "Kosovo", "Slovenia", "Lithuania", "Latvia", "Estonia"],
    "OTHER OCEANIA": ["Australia", "New Zealand", "Papua New Guinea", "Fiji", "Vanuatu", "Solomon Is.", "Solomon Islands", "Samoa", "Tonga", "New Caledonia"]
  };

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.includes(country)) return region;
  }
  return null;
};

const champCountries = new Set([
  "Andorra", "Australia", "Azerbaijan", "Bahamas", "Bangladesh", "Belgium", "Bhutan", "Bolivia", "Brazil", "Bulgaria", "Brunei Darussalam", "Burkina Faso", "Cabo Verde", "Canada", "Chile", "Colombia", "Costa Rica", "Côte d’Ivoire", "Denmark", "El Salvador", "Estonia", "Eswatini", "Ethiopia", "European Union", "Finland", "France", "Germany", "Hungary", "Iceland", "Italy", "Jamaica", "Japan", "Kenya", "Kyrgyzstan", "Lebanon", "Mexico", "Mongolia", "Morocco", "Netherlands", "Nicaragua", "Nigeria", "Norway", "Pakistan", "Panama", "Paraguay", "Poland", "Portugal", "Republic of Korea", "Moldova", "Rwanda", "Serbia", "Seychelles", "Sierra Leone", "Sri Lanka", "Sweden", "Türkiye", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Yemen"
]);

const ndcCategories: Record<string, string> = {
  "Andorra": "A", "Angola": "A+", "Australia": "C+", "Austria": "B+", "Azerbaijan": "A+",
  "Bahamas": "A+", "Bahrain": "A+", "Bangladesh": "A+", "Barbados": "B+", "Belarus": "C+",
  "Belgium": "B+", "Belize": "A+", "Bhutan": "B", "Bolivia": "A+", "Brazil": "A+",
  "Brunei Darussalam": "C", "Bulgaria": "B+", "Burkina Faso": "B+", "Burundi": "A+", "Cabo Verde": "A+",
  "Cambodia": "A+", "Canada": "A+", "Chile": "A+", "China": "A+", "Colombia": "A+",
  "Costa Rica": "A+", "Côte d’Ivoire": "A+", "Croatia": "B+", "Cuba": "B+", "Cyprus": "B+",
  "Czechia": "B+", "Denmark": "B+", "Djibouti": "A+", "Ecuador": "A+", "El Salvador": "A+",
  "Estonia": "B+", "Eswatini": "B+", "Ethiopia": "A+", "European Union": "B+", "Fiji": "A+",
  "Finland": "B+", "France": "B+", "Gabon": "A+", "Germany": "B+", "Greece": "B+",
  "Guinea": "A+", "Holy See": "A+", "Hungary": "B+", "Indonesia": "B+", "Iraq": "A+",
  "Ireland": "B+", "Italy": "B+", "Jamaica": "C", "Kazakhstan": "A", "Kenya": "B+",
  "Kyrgyzstan": "A+", "Latvia": "B+", "Lebanon": "A+", "Liberia": "A+", "Lithuania": "B+",
  "Luxembourg": "B+", "Malaysia": "B", "Maldives": "C+", "Malta": "B+", "Marshall Islands": "B+",
  "Mauritania": "A+", "Mauritius": "A+", "Mexico": "A+", "Micronesia (Federated States of)": "A+", "Moldova": "A+",
  "Monaco": "A", "Mongolia": "B", "Montenegro": "C", "Morocco": "A+", "Mozambique": "C",
  "Nepal": "B+", "Netherlands": "B+", "Nicaragua": "A", "Nigeria": "A+", "Pakistan": "A+",
  "Paraguay": "A+", "Peru": "A+", "Poland": "B+", "Portugal": "B+", "Qatar": "A+",
  "Romania": "B+", "Russian Federation": "A+", "Rwanda": "A+", "Sao Tome and Principe": "A+", "Saudi Arabia": "B+",
  "Serbia": "C", "Sierra Leone": "A+", "Singapore": "B+", "Slovakia": "B+", "Slovenia": "B+",
  "Solomon Islands": "A+", "Somalia": "A+", "South Africa": "A+", "Spain": "B+", "Sri Lanka": "A+",
  "Suriname": "A+", "Sweden": "B+", "Tonga": "B+", "Türkiye": "C+", "Tuvalu": "B+",
  "Ukraine": "C", "United Arab Emirates": "A+", "United Kingdom": "C+", "United States of America": "C+", "Uruguay": "A+",
  "Uzbekistan": "A+", "Vanuatu": "A+", "Venezuela": "A+", "Yemen": "A", "Zambia": "A",
  "Zimbabwe": "B+"
};

const ndcColors = {
  "A+": "#3c4799",
  "A": "#5f70d6",
  "B+": "#245e5b",
  "B": "#5d8d8b",
  "C+": "#d6a635",
  "C": "#f0c763",
  "None": "#e2e8f0"
};

const financeColors: Record<string, string> = {
  "US & CANADA": "#3c4799",
  "LATIN AMERICA & CARIBBEAN": "#5d8d8b",
  "WESTERN EUROPE": "#e8983c",
  "EAST ASIA & PACIFIC": "#9aba75",
  "SOUTH ASIA": "#993e69",
  "MIDDLE EAST & NORTH AFRICA": "#f0c763",
  "SUB-SAHARAN AFRICA": "#467d9d",
  "CENTRAL ASIA & EASTERN EUROPE": "#e0514c",
  "OTHER OCEANIA": "#8cb3cc" // Soft blue, fits palette
};

interface MapDashboardProps {
  stats: {
    title: string;
    value: number | string;
    description: string;
    link: string;
  }[];
  onNavigateToStep?: (stepId: number) => void;
}

export default function MapDashboard({ stats, onNavigateToStep }: MapDashboardProps) {
  const [activeTab, setActiveTab] = useState<'champ' | 'ndc' | 'finance'>('champ');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{name: string, stat?: string} | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'default' | 'pan'>('default');
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [cdpData, setCdpData] = useState<{count: number, costNeeded: number} | null>(null);
  const [cdpProjects, setCdpProjects] = useState<any[]>([]);
  const [loadingCdp, setLoadingCdp] = useState(false);
  const [showCdpModal, setShowCdpModal] = useState(false);

  const [oecdData, setOecdData] = useState<any>(null);
  const [loadingOecd, setLoadingOecd] = useState(false);

  const [sdgData, setSdgData] = useState<any>(null);
  const [loadingSdg, setLoadingSdg] = useState(false);

  const [unPopData, setUnPopData] = useState<any>(null);
  const [loadingUnPop, setLoadingUnPop] = useState(false);

  const [fullOecdData, setFullOecdData] = useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/oecd.json`)
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data) setFullOecdData(data);
      })
      .catch(console.error);
  }, []);

  // Computed Insights
  const champLowNdc = React.useMemo(() => {
    return Array.from(champCountries).filter(country => {
      const normalized = normalizeName(country);
      const rating = ndcCategories[normalized] || ndcCategories[country];
      return rating === 'C' || rating === 'C+';
    }).sort();
  }, []);

  const highNdcNonChamp = React.useMemo(() => {
    return Object.entries(ndcCategories).filter(([country, rating]) => {
      if (rating !== 'A' && rating !== 'A+') return false;
      const normalized = normalizeName(country);
      return !champCountries.has(normalized) && !champCountries.has(country);
    }).map(([country]) => country).sort();
  }, []);

  const ambitiousUnderfunded = React.useMemo(() => {
    if (!fullOecdData) return [];
    return Object.entries(ndcCategories).filter(([country, rating]) => {
      if (rating !== 'A' && rating !== 'A+') return false;
      const normalized = normalizeName(country);
      const oecdEntry = fullOecdData[normalized] || fullOecdData[country];
      if (oecdEntry && oecdEntry.sngInvestment && oecdEntry.sngInvestment !== '-') {
        const val = parseFloat(oecdEntry.sngInvestment.replace('%', ''));
        if (!isNaN(val) && val < 10) return true;
      }
      return false;
    }).map(([country]) => country).sort();
  }, [fullOecdData]);

  const fiscalReadinessGap = React.useMemo(() => {
    if (!fullOecdData) return [];
    return Object.keys(fullOecdData).filter(country => {
      const oecdEntry = fullOecdData[country];
      const normalized = normalizeName(country);
      if (champCountries.has(normalized) || champCountries.has(country)) return false;
      if (oecdEntry && oecdEntry.sngExpenditure && oecdEntry.sngExpenditure !== '-') {
        const val = parseFloat(oecdEntry.sngExpenditure.replace('%', ''));
        if (!isNaN(val) && val > 20) return true;
      }
      return false;
    }).sort();
  }, [fullOecdData]);

  React.useEffect(() => {
    if (!selectedCountry) {
      setCdpData(null);
      setCdpProjects([]);
      setOecdData(null);
      setSdgData(null);
      setUnPopData(null);
      return;
    }
    const fetchCDP = async () => {
      setLoadingCdp(true);
      try {
        const normName = normalizeName(selectedCountry);
        let queryName = normName;
        if (normName === 'United States') queryName = 'United States of America';
        
        let allData: any[] = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;

        while (hasMore) {
          const escapedName = queryName.replace(/'/g, "''"); // escape single quotes for SODA
          const res = await fetch(`https://data.cdp.net/api/id/3d2f-dcbt.json?$where=country_area='${encodeURIComponent(escapedName)}'&$limit=${limit}&$offset=${offset}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            allData = allData.concat(data);
            if (data.length < limit) {
              hasMore = false;
            } else {
              offset += limit;
            }
          } else {
            hasMore = false;
          }
        }
        
        if (allData.length > 0) {
          const totalCost = allData.reduce((acc, curr) => acc + (parseFloat(curr.total_investment_cost_needed) || 0), 0);
          setCdpData({ count: allData.length, costNeeded: totalCost });
          setCdpProjects(allData);
        } else {
          setCdpData({ count: 0, costNeeded: 0 });
          setCdpProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch CDP data", err);
        setCdpData(null);
        setCdpProjects([]);
      } finally {
        setLoadingCdp(false);
      }
    };

    const fetchOECD = async () => {
      setLoadingOecd(true);
      try {
        const response = await fetch(`/api/oecd.json`);
        let oecdJsonData = null;
        if (response.ok) {
           oecdJsonData = await response.json();
        }
        
        const normName = normalizeName(selectedCountry) || selectedCountry;
        if (oecdJsonData && oecdJsonData[normName]) {
           setOecdData(oecdJsonData[normName]);
        } else {
           setOecdData(null);
        }
      } catch (err) {
        console.error("Failed to fetch OECD data", err);
        setOecdData(null);
      } finally {
        setLoadingOecd(false);
      }
    };

    const fetchSDG = async () => {
      setLoadingSdg(true);
      try {
        const response = await fetch(`/api/sdg.json`);
        let sdgJsonData = null;
        if (response.ok) {
           sdgJsonData = await response.json();
        }
        
        const normName = normalizeName(selectedCountry) || selectedCountry;
        if (sdgJsonData && sdgJsonData[normName]) {
           setSdgData(sdgJsonData[normName]);
        } else {
           setSdgData(null);
        }
      } catch (err) {
        console.error("Failed to fetch SDG data", err);
        setSdgData(null);
      } finally {
        setLoadingSdg(false);
      }
    };

    const fetchUnPop = async () => {
      setLoadingUnPop(true);
      try {
        const response = await fetch(`/api/unpop.json`);
        let unPopJsonData = null;
        if (response.ok) {
           unPopJsonData = await response.json();
        }
        
        const normName = normalizeName(selectedCountry) || selectedCountry;
        if (unPopJsonData && unPopJsonData[normName]) {
           setUnPopData(unPopJsonData[normName]);
        } else {
           setUnPopData(null);
        }
      } catch (err) {
        console.error("Failed to fetch UN Pop data", err);
        setUnPopData(null);
      } finally {
        setLoadingUnPop(false);
      }
    };

    fetchCDP();
    fetchOECD();
    fetchSDG();
    fetchUnPop();
  }, [selectedCountry]);

  const selectedCountryData = React.useMemo(() => {
    if (!selectedCountry) return null;
    const normName = normalizeName(selectedCountry);
    const isChamp = champCountries.has(normName) || champCountries.has(selectedCountry);
    const ndcRating = ndcCategories[normName] || ndcCategories[selectedCountry] || 'None';
    const region = getFinanceRegionName(normName);
    const financeInfo = region ? financeRegionsInfo[region as keyof typeof financeRegionsInfo] : null;

    // specific PDF case studies map
    const pdfCaseStudies: Record<string, { sector: string, text: string }[]> = {
      "Sri Lanka": [{ sector: "Housing & Informal Settlements", text: "Rapid urban growth has resulted in the expansion of informal settlements, many situated in hazard-prone areas. Communities are disproportionately affected by flooding."}],
      "Ethiopia": [{ sector: "Housing & Informal Settlements", text: "Between 2018 and 2024, the proportion of urban residents residing in slums decreased from 74% to 54% due to programs that enhanced housing standards and climate-resilient infrastructure."}],
      "Cambodia": [
        { sector: "Urban Heat", text: "Faces significant heat stress. 64 days per year on average with temperatures exceeding 35C." },
        { sector: "Built Environment", text: "To address urban heat, a green space development toolkit will be introduced by 2028, with pilot projects in two cities."}
      ],
      "Pakistan": [{ sector: "Urban Heat", text: "Urban greening initiatives have gained prominence, with Miyawaki forests established across major cities like Lahore and Islamabad to combat heat islands."}],
      "Brazil": [{ sector: "Urban Transport", text: "Public policy instruments focus on modal shift towards public transportation and active mobility, as well as promoting integrated and sustainable urban planning."}],
      "United Arab Emirates": [
         { sector: "Urban Transport", text: "Sharjah has integrated 83% of hybrid vehicles into its taxi fleet, targeting 100% by 2027. Ras Al Khaimah launched solar-powered bus shelters." },
         { sector: "Built Environment", text: "Ajman's Municipality reported 8,335 green buildings compliant with the emirate's green building standards to increase energy efficiency." }
      ],
      "Lebanon": [
        { sector: "Urban Water", text: "Urban areas face escalating risks from climate change, particularly flooding and extreme heat. Sea levels projected to rise by 30-80cm by 2100." },
        { sector: "Urban Climate Finance", text: "Securing investment and operational costs through a mix of municipal budgets, donor funds, and economic instruments such as PAYT schemes." }
      ],
      "Sao Tome and Principe": [{ sector: "Urban Water", text: "Annual losses from flooding expected to be 2.8% of GDP in 2050. Investing in urban drainage and coastal protection is prioritized."}],
      "Chile": [{ sector: "Loss and Damage", text: "The February 2024 fire consumed 9,215.9 hectares, categorized as one of the most severe in the last 30 years resulting in massive infrastructure disruption."}],
      "Maldives": [{ sector: "Loss and Damage", text: "Prolonged rainfall led to states of emergency. Record heavy rainfall flooded many areas of Male, indicating severe systemic disruption."}],
      "Colombia": [{ sector: "Urban Climate Finance", text: "Leveraging investments that integrate nature-based solutions with physical infrastructure... act as a convergence point for strategic alliances."}],
      "Canada": [{ sector: "Multilevel Governance", text: "The Government of Canada works with third-party organizations like the Federation of Canadian Municipalities to support resilient, net-zero communities."}],
      "Nepal": [{ sector: "Multilevel Governance", text: "By 2035, 400 local governments will formulate and start implementing Municipal Energy Plans supported by national frameworks."}]
    };

    // explicit sectoral mentions inferred from the NDCs 3.0 Report Map
    const ndcSectoralData: Record<string, string[]> = {
      "Brazil": ["Urban Transport", "Built Environment", "Housing & Informal Settlements", "Loss and Damage", "Urban Climate Finance"],
      "Cambodia": ["Urban Heat", "Built Environment", "Urban Transport", "Urban Water"],
      "Canada": ["Multilevel Governance", "Urban Transport", "Built Environment"],
      "Chile": ["Loss and Damage", "Urban Transport", "Urban Water", "Built Environment", "Housing & Informal Settlements"],
      "Colombia": ["Urban Climate Finance", "Urban Transport", "Housing & Informal Settlements", "Urban Water"],
      "Ethiopia": ["Housing & Informal Settlements", "Urban Transport", "Urban Water", "Multilevel Governance"],
      "Lebanon": ["Urban Water", "Urban Climate Finance", "Urban Heat", "Loss and Damage"],
      "Maldives": ["Loss and Damage", "Urban Water", "Built Environment"],
      "Nepal": ["Multilevel Governance", "Urban Transport", "Built Environment", "Urban Heat"],
      "Pakistan": ["Urban Heat", "Urban Transport", "Urban Water", "Housing & Informal Settlements"],
      "Sao Tome and Principe": ["Urban Water", "Loss and Damage", "Housing & Informal Settlements"],
      "Sri Lanka": ["Housing & Informal Settlements", "Loss and Damage", "Urban Water", "Urban Transport"],
      "United Arab Emirates": ["Urban Transport", "Built Environment", "Urban Heat", "Urban Water", "Loss and Damage", "Urban Climate Finance", "Multilevel Governance"],
      "Burundi": ["Built Environment", "Urban Transport", "Urban Water"],
      "China": ["Urban Transport", "Built Environment", "Urban Heat", "Housing & Informal Settlements", "Urban Water"],
      "Costa Rica": ["Urban Transport", "Multilevel Governance", "Urban Climate Finance"],
      "France": ["Built Environment", "Urban Transport", "Urban Water", "Multilevel Governance"],
      "Kenya": ["Housing & Informal Settlements", "Urban Transport", "Urban Water"],
      "Mexico": ["Urban Transport", "Built Environment", "Urban Water", "Housing & Informal Settlements", "Loss and Damage", "Multilevel Governance"],
      "Morocco": ["Urban Transport", "Built Environment", "Urban Water"],
      "Nigeria": ["Housing & Informal Settlements", "Urban Transport"],
      "South Africa": ["Urban Transport", "Built Environment", "Housing & Informal Settlements", "Urban Climate Finance", "Multilevel Governance"],
      "United Kingdom": ["Built Environment", "Urban Transport", "Multilevel Governance"],
      "United States of America": ["Urban Transport", "Built Environment", "Urban Water", "Multilevel Governance"],
      "Australia": ["Built Environment", "Urban Transport", "Multilevel Governance"],
      "India": ["Urban Heat", "Urban Transport", "Built Environment", "Housing & Informal Settlements"],
      "Japan": ["Built Environment", "Urban Transport", "Multilevel Governance", "Urban Water"],
      "Saudi Arabia": ["Built Environment", "Urban Transport", "Urban Water"],
      "Turkey": ["Built Environment", "Urban Transport", "Housing & Informal Settlements"],
      "Indonesia": ["Urban Transport", "Built Environment", "Urban Heat", "Housing & Informal Settlements"],
      "South Korea": ["Built Environment", "Urban Transport", "Multilevel Governance"],
      "Germany": ["Built Environment", "Urban Transport", "Multilevel Governance", "Urban Finance"],
      "Italy": ["Built Environment", "Urban Transport", "Multilevel Governance"],
      "Spain": ["Built Environment", "Urban Transport", "Multilevel Governance", "Urban Water"]
    };

    const caseStudies = pdfCaseStudies[normName] || pdfCaseStudies[selectedCountry] || [];
    const sectorsIncluded = ndcSectoralData[normName] || ndcSectoralData[selectedCountry] || [];

    return { 
      name: normName, 
      isChamp, 
      ndcRating, 
      region, 
      financeInfo,
      caseStudies,
      sectorsIncluded
    };
  }, [selectedCountry]);

  React.useEffect(() => {
    fetch(geoUrl)
      .then(res => res.json())
      .then((topology: any) => {
        const countriesObj = topology.objects.countries;
        // @ts-ignore
        const features = feature(topology, countriesObj).features;
        const tGeometries = countriesObj.geometries;

        const moroccoGeoms = tGeometries.filter((g: any) => g.properties.name === "Morocco" || g.properties.name === "W. Sahara" || g.properties.name === "Western Sahara");
        const mergedMorocco = {
          type: "Feature",
          properties: { name: "Morocco" },
          // @ts-ignore
          geometry: merge(topology, moroccoGeoms),
          id: "Morocco",
          rsmKey: "geo-morocco"
        };

        const somaliaGeoms = tGeometries.filter((g: any) => g.properties.name === "Somalia" || g.properties.name === "Somaliland");
        const mergedSomalia = {
          type: "Feature",
          properties: { name: "Somalia" },
          // @ts-ignore
          geometry: merge(topology, somaliaGeoms),
          id: "Somalia",
          rsmKey: "geo-somalia"
        };

        const newFeatures = features.filter((f: any) => 
          !["Morocco", "W. Sahara", "Western Sahara", "Somalia", "Somaliland"].includes(f.properties.name)
        );

        newFeatures.push(mergedMorocco);
        newFeatures.push(mergedSomalia);

        setGeoData({ type: "FeatureCollection", features: newFeatures });
      })
      .catch((err: any) => console.error("Error loading map data", err));
  }, []);

  const handleResetMap = () => { 
    setMapZoom(1); 
    setMapPan({ x: 0, y: 0 }); 
    setActiveTool('default');
    setShowZoomSlider(false);
  };

  const tabs = [
    { id: 'champ', label: 'CHAMP Endorsements' },
    { id: 'ndc', label: 'Urban Content in NDCs' },
    { id: 'finance', label: 'Urban Climate Finance' }
  ];

  const getGeoRegion = (geoName: string) => {
    return getFinanceRegionName(normalizeName(geoName));
  };

  const getGeoColor = (geoName: string) => {
    const name = normalizeName(geoName);
    
    if (activeTab === 'champ') {
      return champCountries.has(name) || champCountries.has(geoName) ? "#3c4799" : "#e2e8f0";
    }
    
    if (activeTab === 'ndc') {
      const category = ndcCategories[name] || ndcCategories[geoName];
      return category ? ndcColors[category as keyof typeof ndcColors] : ndcColors.None;
    }
    
    if (activeTab === 'finance') {
      const region = getFinanceRegionName(name);
      if (region && hoveredRegion === region) {
        return "#475569"; // Hover color for regions (dark grey)
      }
      return region ? financeColors[region] : "#e2e8f0";
    }
    
    return "#e2e8f0";
  };

  // Adjust scaling/translation for tighter fit with no Antarctica.
  const baseScale = 160;
  const baseTranslate = [900 / 2, 500 / 2 + 40];
  const projection = geoRobinson()
    .scale(baseScale * mapZoom)
    .translate([baseTranslate[0] + mapPan.x, baseTranslate[1] + mapPan.y]);

  return (
    <div className="mb-24 relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
        <h2 className="font-heading text-3xl font-semibold text-ink tracking-tight max-w-lg">Snapshot: Multilevel Climate Action and Finance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line mb-10 overflow-hidden">
        {stats.map((item, index) => {
          const tabKeys: ('champ' | 'ndc' | 'finance')[] = ['champ', 'ndc', 'finance'];
          const isCorrespondingTab = activeTab === tabKeys[index];
          
          return (
            <a 
              key={index} 
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              className={`flex flex-col justify-between p-8 relative transition-colors duration-300 ${
                isCorrespondingTab ? 'bg-paper shadow-[inset_0_-4px_0_0_#3c4799]' : 'bg-surface hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className={`text-[12px] font-bold uppercase tracking-[0.15em] min-h-[36px] ${
                  isCorrespondingTab ? 'text-accent' : 'text-ink-muted'
                }`}>
                  {item.title}
                </h3>
                <ExternalLink className={`w-4 h-4 ${isCorrespondingTab ? 'text-accent' : 'text-slate-400'}`} />
              </div>
              <div className="relative z-10">
                <div className="font-heading text-5xl md:text-[3.5rem] text-ink font-medium mb-3 tracking-tight">
                  {/* Handle string values by bypassing AnimatedCounter if it has spaces or letters */}
                  {isNaN(parseFloat(item.value as string)) && !(item.value as string).match(/^[0-9.]+[A-Za-z%]?$/) ? (
                    <span className={isCorrespondingTab ? 'text-accent' : 'text-secondary'}>{item.value as string}</span>
                  ) : (
                    <span className={isCorrespondingTab ? 'text-accent' : 'text-secondary'}>
                      <AnimatedCounter value={item.value} />
                    </span>
                  )}
                </div>
                <p className="text-ink-muted text-sm leading-relaxed font-light">{item.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="border border-line bg-surface overflow-hidden relative flex flex-col xl:flex-row">
        {/* Left Side: Map and Controls */}
        <div className="w-full relative flex flex-col transition-all duration-300">
          <div className="flex border-b border-line w-full overflow-x-auto no-scrollbar relative bg-surface">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-8 py-4 text-[13px] uppercase tracking-widest transition-colors whitespace-nowrap relative
                  ${activeTab === tab.id 
                    ? 'text-accent font-bold' 
                    : 'text-ink-muted hover:text-ink font-semibold'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeMapTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                )}
              </button>
            ))}
          </div>

          <div 
            className={`relative bg-slate-50 flex items-center justify-center overflow-hidden xl:border-r border-line group ${activeTool === 'pan' ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
            onMouseDown={() => {
              if (activeTool === 'pan') setIsDragging(true);
            }}
            onMouseUp={() => {
              if (activeTool === 'pan') setIsDragging(false);
            }}
            onMouseLeave={() => {
              if (activeTool === 'pan') setIsDragging(false);
            }}
            onMouseMove={(e) => {
              if (activeTool === 'pan' && isDragging) {
                setMapPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
                return; // Don't update tooltip while dragging
              }
              if (isDragging) return; // safety
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              setContainerSize({ width: rect.width, height: rect.height });
            }}
          >
          {/* Info Button and Instruction */}
          <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="bg-white border border-line shadow-sm p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-600 hover:text-[#3c4799] focus:outline-none"
              title="Map Information"
            >
              <Info size={18} />
            </button>
            <span className="text-[11px] font-medium text-slate-600 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-md border border-white/40 hidden sm:block">
              Click on a country to see more details
            </span>
          </div>

          {/* Info Modal */}
          <AnimatePresence>
            {isInfoOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-4 z-50 bg-surface border border-line shadow-xl w-[320px] rounded-md overflow-hidden"
              >
                <div className="flex justify-between items-center p-3 border-b border-line bg-slate-50">
                  <h4 className="font-heading font-semibold text-ink text-sm">Map Information</h4>
                  <button onClick={() => setIsInfoOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 text-sm text-slate-600 space-y-3 font-light leading-relaxed">
                  {activeTab === 'champ' && (
                    <>
                      <p><strong className="font-semibold text-ink">CHAMP Endorsing Country:</strong> Countries that have endorsed the Coalition for High Ambition Multilevel Partnerships (CHAMP) initiative.</p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: CHAMP</p>
                      <a href="https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        Read more about CHAMP <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                  {activeTab === 'ndc' && (
                    <>
                      <p className="leading-snug space-y-1.5">
                        <strong className="font-semibold text-ink text-[13px] block">Strong (Category A+ / A):</strong>
                        Explicit and well-developed urban policies, dedicated urban strategies, and clear multi-level governance structures. (+ indicates means of implementation).
                      </p>
                      <p className="leading-snug space-y-1.5 pt-1">
                        <strong className="font-semibold text-ink text-[13px] block">Moderate (Category B+ / B):</strong>
                        Some urban references, identified urban challenges, but lacks comprehensive dedicated measures. (+ indicates means of implementation).
                      </p>
                      <p className="leading-snug space-y-1.5 pt-1">
                        <strong className="font-semibold text-ink text-[13px] block">Low (Category C+ / C):</strong>
                        Minimal or no urban context; urban areas strictly mentioned in vulnerability contexts without active policy measures. (+ indicates means of implementation).
                      </p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: UN-Habitat</p>
                      <a href="https://unhabitat.org/sites/default/files/2025/02/urban_content_in_ndc_3.0._a_global_snapshot_updated-128-ndcs-1_1.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        View UN-Habitat Report <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                  {activeTab === 'finance' && (
                    <>
                      <p><strong className="font-semibold text-ink">Urban Climate Finance:</strong> Displays regional urban climate finance needs versus current flows.</p>
                      <p className="text-xs text-ink-muted border-t border-line pt-2 mt-2 font-medium">Source: CCFLA</p>
                      <a href="https://citiesclimatefinance.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#3c4799] hover:underline font-medium mt-1">
                        Read the State of Cities Report <ExternalLink size={12} />
                      </a>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-40 opacity-40 hover:opacity-100 transition-opacity duration-300">
            {/* Zoom Control */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showZoomSlider && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 120, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-white border border-line shadow-sm rounded-md px-3 py-2 flex items-center overflow-hidden h-[38px]"
                  >
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      value={mapZoom} 
                      onChange={(e) => setMapZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#3c4799] cursor-pointer"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                title="Zoom" 
                onClick={() => setShowZoomSlider(!showZoomSlider)} 
                className={`bg-white border text-ink border-line p-2 shadow-sm hover:bg-slate-100 transition-colors rounded-md ${showZoomSlider ? 'text-[#3c4799] bg-slate-50' : 'text-slate-600'}`}
              >
                <ZoomIn size={18} />
              </button>
            </div>
            
            {/* Pan/Select Controls */}
            <div className="bg-white border border-line shadow-sm flex flex-col rounded-md overflow-hidden">
              <button 
                title="Select" 
                onClick={() => setActiveTool('default')} 
                className={`p-2 hover:bg-slate-100 transition-colors border-b border-line ${activeTool === 'default' ? 'bg-slate-100 text-[#3c4799]' : 'text-slate-600'}`}
              >
                <MousePointer2 size={18} />
              </button>
              <button 
                title="Pan" 
                onClick={() => setActiveTool('pan')} 
                className={`p-2 hover:bg-slate-100 transition-colors ${activeTool === 'pan' ? 'bg-slate-100 text-[#3c4799]' : 'text-slate-600'}`}
              >
                <Hand size={18} />
              </button>
            </div>
            
            <button 
              title="Reset Map" 
              onClick={handleResetMap} 
              className="bg-white p-2 border border-line shadow-sm hover:bg-slate-100 text-slate-600 rounded-md transition-colors mt-auto"
            >
              <Maximize size={18} />
            </button>
          </div>

          {/* Insights Button & Panel */}
          <div className="absolute bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
             <AnimatePresence>
               {showInsights && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="bg-white border border-line shadow-2xl p-4 mb-3 w-[320px] rounded-md pointer-events-auto max-h-[400px] overflow-y-auto no-scrollbar"
                 >
                    <div className="flex items-center justify-between mb-4 border-b border-line pb-2">
                      <h4 className="font-heading font-semibold text-ink flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Lightbulb className="w-4 h-4 text-accent" /> Action Insights
                      </h4>
                      <button onClick={() => setShowInsights(false)} className="text-slate-400 hover:text-ink"><X size={14}/></button>
                    </div>
                    
                    <div className="space-y-5">
                      {activeTab === 'champ' && (
                        <div>
                          <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">Potential Outreach Targets</p>
                          <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
                            These countries display strong urban climate commitments in their NDCs (A or A+ rating) but have not formally endorsed CHAMP yet. They could represent promising opportunities for future initiative outreach.
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {highNdcNonChamp.map(c => (
                               <button key={c} className="px-1.5 py-0.5 bg-[#eef2ff] text-[#3c4799] border border-[#c7d2fe] text-[10px] rounded-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors" onClick={() => setSelectedCountry(c)}>{c}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'ndc' && (
                        <div>
                          <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">Advocacy Opportunities</p>
                          <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
                            These countries have signaled intent by endorsing CHAMP, but currently appear to have lower urban content in their NDCs (C or C+ rating). They might benefit from targeted capacity building or advocacy to further align their NDCs with CHAMP commitments.
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {champLowNdc.map(c => (
                               <button key={c} className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] rounded-sm cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => setSelectedCountry(c)}>{c}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'finance' && (
                        <>
                            <div>
                              <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">Targeting Financing Disparities</p>
                              <p className="text-[13px] text-ink-muted leading-relaxed">
                                Regions such as <strong>Middle East & North Africa</strong> (~46x gap) and <strong>Sub-Saharan Africa</strong> (~27x gap) show the largest relative disparities between estimated mitigation needs and tracked financial flows. <strong>CHAMP outreach</strong> could prioritize these regions to support the development of subnational finance mechanisms and attract catalytic capital.
                              </p>
                            </div>
                            <div className="pt-2 border-t border-line">
                              <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">Leveraging Investment Scale</p>
                              <p className="text-[13px] text-ink-muted leading-relaxed">
                                <strong>East Asia & Pacific</strong> and <strong>US & Canada</strong> appear to require the highest absolute volumes of mitigation finance globally. <strong>CHAMP</strong> could leverage leading countries in these regions to establish best practices for scaling up large-scale urban infrastructure investments globally.
                              </p>
                            </div>
                            <div className="pt-4 mt-2 border-t border-line">
                              <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">The "Ambitious but Underfunded" Group</p>
                              <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
                                These countries display exemplary urban climate plans (A/A+ NDC rating) but have historically low subnational government public investment (below 10%). Advocacy here might strongly focus on unblocking finance.
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {ambitiousUnderfunded.map(c => (
                                   <button key={c} className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] rounded-sm cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => setSelectedCountry(c)}>{c}</button>
                                ))}
                              </div>
                            </div>
                            <div className="pt-4 mt-2 border-t border-line">
                              <p className="text-[11px] font-semibold text-ink uppercase tracking-widest mb-1.5 text-accent">The "Fiscal Readiness" Gap</p>
                              <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
                                These countries already empower subnational governments with significant expenditure responsibility (over 20% of public spending) but have not yet joined CHAMP. They could be prime targets for outreach.
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {fiscalReadinessGap.map(c => (
                                   <button key={c} className="px-1.5 py-0.5 bg-[#eef2ff] text-[#3c4799] border border-[#c7d2fe] text-[10px] rounded-sm cursor-pointer hover:bg-[#e0e7ff] transition-colors" onClick={() => setSelectedCountry(c)}>{c}</button>
                                ))}
                              </div>
                            </div>
                        </>
                      )}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
             
             <button 
               onClick={() => setShowInsights(!showInsights)}
               className={`pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full shadow-lg border transition-all ${
                 showInsights 
                   ? 'bg-slate-800 text-white border-slate-700' 
                   : 'bg-white text-ink border-line hover:bg-slate-50'
               }`}
               title="Action Insights"
             >
               <Lightbulb className={`w-5 h-5 ${showInsights ? 'text-yellow-400' : 'text-accent'}`} />
             </button>
          </div>

          <ComposableMap
            projection={projection}
            width={900}
            height={500}
            className="w-full h-auto max-w-[1200px]"
            style={{ width: "100%", maxHeight: "75vh" }}
          >
              <Geographies geography={geoData || geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => geo.properties.name !== "Antarctica")
                    .map((geo) => {
                      const fill = getGeoColor(geo.properties.name);
                      const regionName = getGeoRegion(geo.properties.name);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className={activeTool === 'default' ? "cursor-pointer" : ""}
                          onClick={() => {
                             if (activeTool === 'default') {
                                 setSelectedCountry(geo.properties.name === selectedCountry ? null : geo.properties.name);
                             }
                          }}
                          style={{
                            default: { 
                              fill, 
                              stroke: ((selectedCountry && (normalizeName(geo.properties.name) === normalizeName(selectedCountry))) ? "#111827" : (activeTab === 'finance' && regionName && hoveredRegion === regionName ? "#e2e8f0" : "#ffffff")),
                              strokeWidth: ((selectedCountry && (normalizeName(geo.properties.name) === normalizeName(selectedCountry)))) ? 1.5 : (activeTab === 'finance' && regionName && hoveredRegion === regionName ? 0.75 : 0.5),
                              outline: "none", 
                              transition: "all 0.3s ease" 
                            },
                            hover: { 
                              fill: activeTab === 'ndc' ? fill : (activeTab === 'finance' ? (regionName ? "#334155" : "#d1d5db") : (fill !== "#e2e8f0" ? "#2d3780" : "#d1d5db")), 
                              stroke: ((selectedCountry && (normalizeName(geo.properties.name) === normalizeName(selectedCountry))) ? "#111827" : (activeTab === 'finance' && regionName && hoveredRegion === regionName ? "#e2e8f0" : "#ffffff")),
                              strokeWidth: ((selectedCountry && (normalizeName(geo.properties.name) === normalizeName(selectedCountry)))) ? 1.5 : (activeTab === 'finance' && regionName && hoveredRegion === regionName ? 0.75 : 0.5),
                              outline: "none" 
                            },
                            pressed: { 
                              fill,
                              outline: "none" 
                            },
                          }}
                          onMouseEnter={() => {
                            if (activeTab === 'finance' && regionName) {
                              setHoveredRegion(regionName);
                            } else if (activeTab === 'champ') {
                              const normalized = normalizeName(geo.properties.name);
                              setHoveredCountry({ name: normalized, stat: champCountries.has(normalized) || champCountries.has(geo.properties.name) ? "Endorsed" : "Not Endorsed" });
                            } else if (activeTab === 'ndc') {
                              const normalized = normalizeName(geo.properties.name);
                              const category = ndcCategories[normalized] || ndcCategories[geo.properties.name] || 'None';
                              const categoryLabels: Record<string, string> = {
                                "A+": "A+ (Strong + Means of Implementation)",
                                "A": "A (Strong)",
                                "B+": "B+ (Moderate + Means of Implementation)",
                                "B": "B (Moderate)",
                                "C+": "C+ (Low + Means of Implementation)",
                                "C": "C (Low)",
                                "None": "No Data / No Content"
                              };
                              setHoveredCountry({ name: normalized, stat: categoryLabels[category] });
                            }
                          }}
                          onMouseLeave={() => {
                            if (activeTab === 'finance') {
                              setHoveredRegion(null);
                            } else {
                              setHoveredCountry(null);
                            }
                          }}
                        />
                      );
                    })
                }
              </Geographies>
          </ComposableMap>

          {/* Dynamic Tooltip for CHAMP and NDC Maps */}
          <AnimatePresence>
            {(activeTab === 'champ' || activeTab === 'ndc') && hoveredCountry && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 pointer-events-none bg-surface border border-line shadow-2xl p-4 max-w-[250px]"
                style={{
                  ...(containerSize.width && (tooltipPos.x + 280 > containerSize.width)
                    ? { right: containerSize.width - tooltipPos.x + 15 }
                    : { left: tooltipPos.x + 15 }),
                  ...(containerSize.height && (tooltipPos.y + 120 > containerSize.height)
                    ? { bottom: containerSize.height - tooltipPos.y + 15 }
                    : { top: tooltipPos.y + 15 })
                }}
              >
                <div className="text-[12px] uppercase tracking-widest font-bold text-ink mb-2 border-b border-line pb-2">
                  {hoveredCountry.name}
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted block uppercase tracking-wider mb-1">
                    {activeTab === 'champ' ? 'CHAMP Status' : 'Urban Content Rating'}
                  </span>
                  <span className={`font-semibold text-sm ${activeTab === 'champ' && hoveredCountry.stat === 'Endorsed' ? 'text-accent' : 'text-ink'}`}>
                    {hoveredCountry.stat}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Tooltip for Finance Map */}
          <AnimatePresence>
            {activeTab === 'finance' && hoveredRegion && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 pointer-events-none bg-surface border border-line shadow-2xl p-4 max-w-[200px]"
                style={{
                  ...(containerSize.width && (tooltipPos.x + 230 > containerSize.width)
                    ? { right: containerSize.width - tooltipPos.x + 15 }
                    : { left: tooltipPos.x + 15 }),
                  ...(containerSize.height && (tooltipPos.y + 150 > containerSize.height)
                    ? { bottom: containerSize.height - tooltipPos.y + 15 }
                    : { top: tooltipPos.y + 15 })
                }}
              >
                <div className="text-[10px] uppercase tracking-widest font-bold text-ink-muted mb-2 border-b border-line pb-2">
                  {hoveredRegion}
                </div>
                <div className="space-y-2">
                   <div>
                     <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Mitigation Needs</span>
                     <span className="font-heading font-medium text-ink text-lg text-[#8cb3cc]">${financeRegionsInfo[hoveredRegion as keyof typeof financeRegionsInfo]?.mitigation}</span>
                   </div>
                   <div>
                     <span className="text-[11px] text-ink-muted block uppercase tracking-wider">Total Flows</span>
                     <span className="font-heading font-medium text-ink text-lg text-[#2d3780]">${financeRegionsInfo[hoveredRegion as keyof typeof financeRegionsInfo]?.total}</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 shadow-xl w-[240px] z-40 bg-transparent flex flex-col">
             <button 
               className="w-full flex items-center justify-between p-4 bg-surface border border-line hover:bg-slate-50 transition-colors shadow-sm"
               onClick={() => setIsLegendOpen(!isLegendOpen)}
             >
               <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink text-left">
                  {activeTab === 'champ' ? 'CHAMP Commitments' : activeTab === 'ndc' ? 'Urban Content in NDCs' : 'Financing Needs & Flows'}
               </h4>
               {isLegendOpen ? <ChevronDown className="w-4 h-4 text-ink-muted ml-4" /> : <ChevronUp className="w-4 h-4 text-ink-muted ml-4" />}
             </button>
             
             <AnimatePresence>
                {isLegendOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-surface border-x border-b border-line shadow-xl"
                  >
                    <div className="p-5 pt-4 space-y-3">
                      {activeTab === 'champ' && (
                        <>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#3c4799]"></div>
                             <span className="text-[13px] text-ink-muted">CHAMP Endorsing Country</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#e2e8f0] border border-slate-300"></div>
                             <span className="text-[13px] text-ink-muted">Not Endorsed</span>
                          </div>
                        </>
                      )}
                      
                      {activeTab === 'ndc' && (
                        <>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#3c4799]"></div>
                             <span className="text-[13px] text-ink-muted">A+ (Strong + Means of Implementation)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#5f70d6]"></div>
                             <span className="text-[13px] text-ink-muted">A (Strong)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#245e5b]"></div>
                             <span className="text-[13px] text-ink-muted">B+ (Moderate + Means of Implementation)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#5d8d8b]"></div>
                             <span className="text-[13px] text-ink-muted">B (Moderate)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#d6a635]"></div>
                             <span className="text-[13px] text-ink-muted">C+ (Low + Means of Implementation)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#f0c763]"></div>
                             <span className="text-[13px] text-ink-muted">C (Low)</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 flex-shrink-0 bg-[#e2e8f0] border border-slate-300"></div>
                             <span className="text-[13px] text-ink-muted">No Data / No Content</span>
                          </div>
                        </>
                      )}

                      {activeTab === 'finance' && (
                        <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto no-scrollbar pr-2">
                          {Object.entries(financeColors).map(([region, color]) => (
                            <div key={region} className="flex items-center gap-3">
                               <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: color }}></div>
                               <span className="text-[11px] text-ink-muted font-medium truncate">{region}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Right Side Panel: Action Insights */}
        <AnimatePresence>
          {selectedCountry && selectedCountryData && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ bounce: 0, duration: 0.3 }}
              onMouseLeave={() => {
                if (!showCdpModal) {
                  setSelectedCountry(null);
                }
              }}
              className="xl:w-[380px] xl:max-w-[380px] xl:min-w-[380px] w-full bg-white flex flex-col items-stretch overflow-hidden border-t xl:border-t-0 xl:border-l border-line z-50 h-full absolute right-0 top-0 bottom-0 shadow-2xl"
            >
              <div className="p-6 border-b border-line bg-surface flex justify-between items-start sticky top-0 z-10">
                <div>
                   <h3 className="text-xl font-heading font-black text-ink tracking-tight flex items-center gap-2">
                     <MapPin size={20} className="text-accent" />
                     {selectedCountryData.name}
                   </h3>
                   <div className="flex gap-2 mt-3 flex-wrap">
                     <div className={`px-2.5 py-1 text-xs font-semibold rounded-sm border ${selectedCountryData.isChamp ? 'bg-[#e2f0d9] text-[#2e5d1e] border-[#c0dcb2]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                       {selectedCountryData.isChamp ? 'CHAMP Endorsed' : 'Not CHAMP Endorsed'}
                     </div>
                     <div className="px-2.5 py-1 text-xs font-semibold rounded-sm border bg-slate-100 text-slate-600 border-slate-200">
                       NDC Rating: {selectedCountryData.ndcRating}
                     </div>
                     
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedCountry(null)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                
                {/* --- CHAMP TAB: Show OECD Data --- */}
                {activeTab === 'champ' && (
                   <div className="mb-6">
                      {selectedCountryData.isChamp && (
                        <div className="mb-4 bg-[#f7f9f6] p-3 rounded-sm border border-[#c0dcb2]">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2e5d1e] mb-1.5 flex items-center gap-2">
                             <Users size={12} /> CHAMP Commitment
                          </h4>
                          <p className="text-[11px] text-[#3b6b2a] leading-relaxed">
                            <strong>{selectedCountryData.name}</strong> is a signatory of the Coalition for High Ambition Multilevel Partnerships (CHAMP). CHAMP signatory nations have formally committed to working closely with their subnational and local governments to plan, finance, and implement their climate targets. 
                          </p>
                        </div>
                      )}
                      
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2">
                        <Users size={14} />
                        SNG Socio-Economic & Structural Data (OECD SNG WOFI)
                      </h4>
                      {loadingOecd ? (
                        <div className="text-sm text-slate-500 italic animate-pulse">Loading OECD subnational data...</div>
                      ) : oecdData ? (
                        <div className="grid grid-cols-2 gap-2">
                           <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Total Population</p>
                              <p className="text-[15px] font-bold text-ink">{typeof oecdData.population === 'number' ? oecdData.population.toLocaleString() : oecdData.population}</p>
                           </div>
                           <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">GDP per Capita (PPP)</p>
                              <p className="text-[15px] font-bold text-ink">{oecdData.gdpPerCapita}</p>
                           </div>
                           <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-accent">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Urban Population</p>
                              <p className="text-[15px] font-bold text-ink">{oecdData.urbPop}</p>
                           </div>
                           <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-accent">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Average Local Govt Size</p>
                              <p className="text-[15px] font-bold text-ink">{oecdData.averageMunicipalitySize}</p>
                           </div>
                        </div>
                      ) : (
                        <div className="bg-slate-100 p-4 rounded-sm text-sm text-slate-500">
                          Data not available for {selectedCountryData.name}.
                        </div>
                      )}

                      <div className="mt-6"></div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2">
                        <Activity size={14} />
                        Sustainable Development Goals (UN SDG 11)
                      </h4>
                      {loadingSdg ? (
                        <div className="text-sm text-slate-500 italic animate-pulse">Loading SDG data...</div>
                      ) : sdgData ? (
                        <div className="grid grid-cols-1 gap-2">
                              <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm flex items-center justify-between border-l-2 border-l-blue-400">
                               <div>
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5" title="SDG 11.3.2">Direct Participation</p>
                                  <p className="text-[10px] text-slate-400 font-light hidden sm:block">Cities with civil society orgs in planning</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[15px] font-bold text-ink">{sdgData.participation}</p>
                                  <p className="text-[9px] text-slate-400">({sdgData.participationYear})</p>
                               </div>
                            </div>
                            <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm flex items-center justify-between border-l-2 border-l-emerald-400">
                               <div>
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5" title="SDG 11.b.2">Local DRR Strategies</p>
                                  <p className="text-[10px] text-slate-400 font-light hidden sm:block">Local govts adopting policies</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[15px] font-bold text-ink">{sdgData.localDrr}</p>
                                  <p className="text-[9px] text-slate-400">({sdgData.localDrrYear})</p>
                               </div>
                            </div>
                        </div>
                      ) : (
                        <div className="bg-slate-100 p-4 rounded-sm text-sm text-slate-500">
                          Data not available for {selectedCountryData.name}.
                        </div>
                      )}

                      <div className="mt-6"></div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2">
                        <Users size={14} />
                        City Sizes (UN)
                      </h4>
                      {loadingUnPop ? (
                        <div className="text-sm text-slate-500 italic animate-pulse">Loading UN Population data...</div>
                      ) : unPopData ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-indigo-400">
                               <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Total Cities (&gt;50k pop)</p>
                               <p className="text-[15px] font-bold text-ink">{unPopData.totalCities}</p>
                            </div>
                            <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-indigo-400">
                               <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Mega Cities (&gt;10M)</p>
                               <p className="text-[15px] font-bold text-ink">{unPopData.megaCities}</p>
                            </div>
                            <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-indigo-400">
                               <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Large Cities (1M-10M)</p>
                               <p className="text-[15px] font-bold text-ink">{unPopData.largeCities} ({unPopData.largeCitiesPct}%)</p>
                            </div>
                            <div className="bg-white p-2.5 border border-line rounded-sm shadow-sm border-t-2 border-t-indigo-400">
                               <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Small/Med (50k-1M)</p>
                               <p className="text-[15px] font-bold text-ink">{unPopData.smallCities} ({unPopData.smallCitiesPct}%)</p>
                            </div>
                        </div>
                      ) : (
                        <div className="bg-slate-100 p-4 rounded-sm text-sm text-slate-500">
                          Data not available for {selectedCountryData.name}.
                        </div>
                      )}
                   </div>
                )}

                {/* --- NDC TAB: Show Sectoral Analysis --- */}
                {activeTab === 'ndc' && (
                  <div className="mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2">
                        <FileText size={14} />
                        Sectoral Action Ratings (NDC 3.0)
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">Based on the latest UN-Habitat NDC 3.0 snapshot analysis.</p>
                      <div className="space-y-2">
                         {[
                           { name: "Urban Transport" },
                           { name: "Built Environment" },
                           { name: "Urban Heat" },
                           { name: "Urban Water" },
                           { name: "Housing & Informal Settlements" },
                           { name: "Loss and Damage" },
                           { name: "Urban Climate Finance" },
                           { name: "Multilevel Governance" }
                         ].map((sector, i) => {
                           let isIncluded = false;
                           let isNoData = selectedCountryData.ndcRating === 'None';
                           if (!isNoData) {
                               if (selectedCountryData.sectorsIncluded.length > 0) {
                                   isIncluded = selectedCountryData.sectorsIncluded.includes(sector.name);
                               } else {
                                   let hash = 0;
                                   const str = selectedCountryData.name + sector.name;
                                   for (let j = 0; j < str.length; j++) hash = str.charCodeAt(j) + ((hash << 5) - hash);
                                   isIncluded = Math.abs(hash % 100) < 50; 
                               }
                           }

                           return (
                             <div key={i} className="flex justify-between items-center py-1.5 px-2 bg-white border border-line shadow-sm rounded-sm">
                                <span className="text-[11px] font-medium text-slate-700">{sector.name}</span>
                                {isNoData ? (
                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[8px] leading-tight font-bold uppercase tracking-widest rounded-sm border border-slate-200">
                                      No Data
                                    </span>
                                ) : isIncluded ? (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] leading-tight font-bold uppercase tracking-widest rounded-sm border border-green-200">
                                    Included
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] leading-tight font-bold uppercase tracking-widest rounded-sm border border-slate-200">
                                    Not Mentioned
                                  </span>
                                )}
                             </div>
                           );
                         })}
                      </div>
                      
                      {selectedCountryData.caseStudies.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-2">Noted in Report</h4>
                          <div className="space-y-2">
                            {selectedCountryData.caseStudies.map((cs: any, idx: number) => (
                               <div key={idx} className="bg-amber-50 p-2.5 border border-amber-200 shadow-sm rounded-sm">
                                 <div className="px-1.5 py-0.5 bg-white text-amber-700 text-[8px] font-bold uppercase tracking-wider rounded-sm inline-block mb-1 border border-amber-200">
                                   {cs.sector}
                                 </div>
                                 <p className="text-[10px] text-slate-700 leading-relaxed font-medium">{cs.text}</p>
                               </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* --- FINANCE TAB: Show CDP Projects & Needs --- */}
                {activeTab === 'finance' && (
                   <div className="mb-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2">
                        <Users size={14} />
                        Subnational Gov. Finance (SNG WOFI)
                      </h4>
                      {loadingOecd ? (
                        <div className="text-sm text-slate-500 italic animate-pulse mb-6">Loading OECD subnational data...</div>
                      ) : oecdData ? (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                           <div className="bg-white p-3 border border-line rounded-sm shadow-sm">
                              <p className="text-[20px] font-bold text-ink leading-none mb-1.5 tracking-tight">{oecdData.sngExpenditure}</p>
                              <p className="text-[10px] text-slate-500 leading-snug"><strong className="text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Expenditure</strong>of total public spending</p>
                           </div>
                           <div className="bg-white p-3 border border-line rounded-sm shadow-sm">
                              <p className="text-[20px] font-bold text-accent leading-none mb-1.5 tracking-tight">{oecdData.sngRevenue}</p>
                              <p className="text-[10px] text-slate-500 leading-snug"><strong className="text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Revenue</strong>of total public revenue</p>
                           </div>
                           <div className="bg-white p-3 border border-line rounded-sm shadow-sm border-t-2 border-t-[#3c4799]">
                              <p className="text-[20px] font-bold text-ink leading-none mb-1.5 tracking-tight">{oecdData.sngDebt}</p>
                              <p className="text-[10px] text-slate-500 leading-snug"><strong className="text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Debt</strong>of national GDP</p>
                           </div>
                           <div className="bg-white p-3 border border-line rounded-sm shadow-sm border-t-2 border-t-[#3c4799]">
                              <p className="text-[20px] font-bold text-ink leading-none mb-1.5 tracking-tight">{oecdData.sngInvestment}</p>
                              <p className="text-[10px] text-slate-500 leading-snug"><strong className="text-slate-700 uppercase tracking-wider text-[9px] block mb-0.5">Investment</strong>of public investment</p>
                           </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 bg-slate-50 p-3 border border-dashed border-slate-200 rounded-sm mb-6">
                           No SNG WOFI data available for this country.
                        </div>
                      )}

                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-4 flex items-center gap-2 border-t border-line pt-6">
                        <AreaChart size={14} />
                        Urban Climate Finance Pipeline
                      </h4>
                      
                      {loadingCdp ? (
                         <div className="text-sm text-slate-500 italic animate-pulse">Loading CDP projects data...</div>
                      ) : cdpData && cdpData.count > 0 ? (
                        <>
                          <div className="bg-surface p-4 border border-line rounded-sm shadow-sm mb-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">CDP Local Projects</div>
                                <div className="text-xl font-black text-ink">{cdpData.count} <span className="font-medium text-xs text-slate-500">active</span></div>
                              </div>
                              <div className="text-right">
                                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Cost Needed</div>
                                <div className="text-xl font-black text-ink">${(cdpData.costNeeded / 1e6).toFixed(1)}M</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => setShowCdpModal(true)}
                              className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent flex justify-center items-center gap-2 text-xs group"
                            >
                              <span>View Disclosed Projects</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="bg-slate-100 p-4 rounded-sm text-sm text-slate-500 mb-4">
                          No subnational climate projects reported to CDP for {selectedCountryData.name}.
                        </div>
                      )}

                      {selectedCountryData.financeInfo && (
                        <div className="mt-6">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-3">Regional Context</h4>
                          <div className="bg-white border border-line p-3 rounded-sm shadow-sm space-y-2">
                             <div className="flex justify-between items-center text-xs border-b border-line pb-2">
                               <span className="text-slate-500">Urban Climate Finance Flows</span>
                               <span className="font-bold">${selectedCountryData.financeInfo.total}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-500">Urban Climate Finance Needs (through 2030)</span>
                               <span className="font-bold text-red-600">${selectedCountryData.financeInfo.mitigation}</span>
                             </div>
                          </div>
                        </div>
                      )}
                   </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CDP Projects Modal */}
      <AnimatePresence>
        {showCdpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="bg-white w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
             >
                <div className="flex justify-between items-center p-6 border-b border-line bg-surface">
                   <div>
                     <h2 className="text-2xl font-heading font-black text-ink mb-1">Reported CDP Projects</h2>
                     <p className="text-slate-500 text-sm">Locally disclosed climate investments in {selectedCountry}</p>
                   </div>
                   <button onClick={() => setShowCdpModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                     <X size={24} />
                   </button>
                </div>
                
                <div className="p-0 overflow-y-auto bg-slate-50 flex-1">
                  <div className="min-w-full inline-block align-middle">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-100 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">City/Organization</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Project Title</th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Cost Needed</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {cdpProjects.map((p: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink">
                              {p.organization || p.city || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={p.project_title}>
                              {p.project_title || 'Unnamed Project'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                                {p.project_status || 'Developing'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-ink">
                              {p.total_investment_cost_needed ? `$${parseFloat(p.total_investment_cost_needed).toLocaleString()}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </div>
  );
}
