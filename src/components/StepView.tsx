import { useState, useEffect } from "react";
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Sparkles, CheckCircle2, ExternalLink, ShieldCheck, MapPin, Building2, Globe2, X, FileText, ArrowRight, Tag, AlertCircle, FileSearch, Banknote, Map, Landmark, Database, Users, BookOpen } from "lucide-react";
import { identifyStakeholders, generateContextualizedPlan, AiContextData } from "../services/geminiService";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PARTNER_TYPES = [
  "Multilateral Development Bank (MDB)",
  "Non-Governmental Organization (NGO)",
  "City Network",
  "Bilateral Donor",
  "Philanthropy",
  "Private Investor",
  "UN Agency"
];

function PartnerModal({ partnerData, onClose }: { partnerData: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-surface shadow-2xl border border-line overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-8 border-b border-line bg-surface">
          <h3 className="font-heading text-2xl font-medium text-ink pr-8">{partnerData.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-paper transition-colors text-ink-muted hover:text-ink">
            <X size={20} className="stroke-[1.5]" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto bg-paper">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
            {partnerData.subPartners.map((sub: any) => (
              <a
                key={sub.name}
                href={sub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-surface hover:bg-paper transition-all group"
              >
                <span className="text-[15px] font-medium text-ink group-hover:text-accent transition-colors">{sub.name}</span>
                <ExternalLink size={16} className="text-ink-muted group-hover:text-accent shrink-0 ml-2 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContextModal({ item, onClose }: { item: any, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-surface shadow-2xl border border-line overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-8 border-b border-line bg-surface">
          <h3 className="font-heading text-3xl font-medium text-ink pr-8 leading-tight">{item.title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-paper transition-colors text-ink-muted hover:text-ink">
            <X size={24} className="stroke-[1.5]" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto bg-paper">
          <div className="max-w-none">
            <p className="text-xl text-ink font-light leading-relaxed mb-8">{item.intro}</p>
            <div className="space-y-6 text-ink-muted font-light leading-relaxed text-[15px]">
              {item.fullText.map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          {item.reports && item.reports.length > 0 && (
            <div className="mt-12 pt-10 border-t border-line">
              <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-6 flex items-center gap-3">
                <FileText size={16} className="text-accent" />
                Key Partner Reports
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                {item.reports.map((report: any, idx: number) => (
                  <a key={idx} href={report.link} target="_blank" rel="noopener noreferrer" className="group p-6 bg-surface hover:bg-paper transition-all flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-bold text-accent mb-3 block uppercase tracking-widest">{report.partner}</span>
                      <h5 className="font-medium text-ink group-hover:text-accent transition-colors leading-snug">{report.title}</h5>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-muted group-hover:text-accent transition-colors">
                      Read Report <ArrowRight size={14} className="stroke-[2]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function UnifiedContextCard({ data }: { data: any }) {
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null);

  const opportunityIcons = [Map, Landmark, Database, Users];

  return (
    <div className="bg-surface border border-line mb-12">
      {/* What is this action */}
      <div className="p-8 border-b border-line bg-surface">
        <h2 className="font-heading text-2xl font-medium text-ink mb-4">What is this action</h2>
        <p className="text-ink-muted leading-relaxed text-lg font-light">{data.whatIsThisAction}</p>
      </div>

      {/* Systems Logic */}
      {data.systemsLogic && (
        <div className="p-8 border-b border-line bg-surface">
          <h2 className="font-heading text-2xl font-medium text-ink mb-4">Systems Logic</h2>
          <p className="text-ink-muted leading-relaxed text-lg font-light">{data.systemsLogic}</p>
        </div>
      )}

      {/* Opportunities */ }
      <div className="flex flex-col divide-y divide-line">
        
        {/* Opportunities */}
        <div className="p-8 bg-paper">
          <h2 className="font-heading text-xl font-medium text-ink mb-6">What opportunities this action presents</h2>
          <div className="space-y-px bg-line border border-line">
            {data.opportunities.map((item: any, idx: number) => {
              const Icon = opportunityIcons[idx % opportunityIcons.length];
              return (
              <div key={idx} className="bg-surface hover:bg-paper transition-colors">
                <button
                  className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setExpandedOpportunity(expandedOpportunity === idx ? null : idx)}
                >
                  <div className="flex items-center gap-4 pr-6">
                    <div className="p-2 sm:p-2.5 bg-accent/5 border border-line text-accent shrink-0 group-hover:bg-accent/10 transition-colors">
                      <Icon size={18} className="stroke-[2]" />
                    </div>
                    <h3 className="font-semibold text-base md:text-lg text-ink m-0 leading-snug font-sans">{item.title}</h3>
                  </div>
                  <div className={`shrink-0 w-8 h-8 border border-line flex items-center justify-center transition-transform duration-300 ${expandedOpportunity === idx ? 'rotate-180 bg-surface' : 'bg-paper'}`}>
                    <ChevronDown size={18} className="stroke-[1.5] text-ink" />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedOpportunity === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-line bg-surface">
                        <p className="text-ink font-medium mb-4 leading-relaxed mt-4 text-sm md:text-base">{item.shortText}</p>
                        <div className="space-y-4 text-ink-muted leading-relaxed text-sm md:text-base font-light">
                          {item.expandedText.map((p: string, pIdx: number) => (
                             <p key={pIdx}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="p-8 border-t border-line bg-surface">
        <h2 className="font-heading text-xl font-medium text-ink mb-6">Key Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          {data.resources.map((res: any, idx: number) => (
            <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="group p-6 bg-surface hover:bg-paper transition-all flex items-start gap-4">
              <div className="text-accent opacity-60 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                <FileText size={20} className="stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-accent mb-1.5 block tracking-wider uppercase truncate">{res.name}</span>
                <h5 className="font-sans text-sm font-medium text-ink leading-snug line-clamp-2">{res.title}</h5>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextCard({ item }: { item: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="bg-surface p-8 border hover:bg-paper border-transparent hover:border-line flex flex-col h-full relative group transition-all duration-300">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
        <h3 className="font-heading font-medium text-ink text-xl md:text-2xl mb-4 leading-snug">{item.title}</h3>
        <p className="text-ink-muted leading-relaxed font-light mb-8 flex-1">{item.intro}</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-between w-full py-3 mt-2 text-ink font-semibold transition-colors border-t border-line group-hover:border-accent group-hover:text-accent"
        >
          <span className="font-sans text-xs tracking-wider font-bold uppercase">Know more</span>
          <ArrowRight size={16} />
        </button>
      </div>
      <AnimatePresence>
        {isModalOpen && <ContextModal item={item} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function RecommendationCard({ rec, stepTitle }: { rec: any; stepTitle: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [form, setForm] = useState<AiContextData>({ country: '', city: '', partnerType: '' });
  
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [plan, setPlan] = useState<string | null>(null);
  const [phase, setPhase] = useState<'setup' | 'stakeholders' | 'plan'>('setup');

  const isNational = rec.actor === "National Governments";
  const isCity = rec.actor === "Cities & Subnationals";
  const isPartner = rec.actor === "International Partners";

  const isFormValid = () => {
    if (isNational) return form.country!.trim() !== '';
    if (isCity) return form.country!.trim() !== '' && form.city!.trim() !== '';
    if (isPartner) return form.partnerType!.trim() !== '' && form.country!.trim() !== '';
    return false;
  };

  const handleIdentifyStakeholders = async () => {
    if (!isFormValid()) return;
    setIsIdentifying(true);
    setError(null);
    try {
      const result = await identifyStakeholders(rec.points, rec.actor, form);
      setStakeholders(result);
      setPhase('stakeholders');
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (stakeholders.length === 0) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateContextualizedPlan(rec.points, rec.actor, form, stakeholders);
      setPlan(result);
      setPhase('plan');
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeStakeholder = (indexToRemove: number) => {
    setStakeholders(stakeholders.filter((_, idx) => idx !== indexToRemove));
  };

  const addStakeholder = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setStakeholders([...stakeholders, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div className="bg-surface border border-line">
      <div className="flex justify-between items-center cursor-pointer p-6 md:p-8 hover:bg-paper transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className="text-accent bg-paper p-3 border border-line">
            {isNational && <ShieldCheck size={24} className="stroke-[2]" />}
            {isCity && <MapPin size={24} className="stroke-[2]" />}
            {isPartner && <Globe2 size={24} className="stroke-[2]" />}
          </div>
          <span className="font-heading font-medium text-ink text-2xl">{rec.actor}</span>
        </div>
        <div className={`w-8 h-8 border border-line flex items-center justify-center shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-paper text-ink' : 'bg-surface text-ink-muted'}`}>
          <ChevronDown size={18} className="stroke-[1.5]" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-10 pb-10 pt-4">
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-ink-muted border-b border-line pb-4 mb-8">Core Recommendations</h4>
              <ul className="space-y-8">
                {rec.points.map((p: string, idx: number) => (
                  <li key={idx} className="flex gap-6 group">
                    <div className="font-mono text-[11px] font-bold text-ink-muted mt-1.5 shrink-0 bg-paper border border-line w-8 h-8 flex items-center justify-center rounded-full group-hover:border-accent group-hover:text-accent transition-colors">{(idx + 1).toString().padStart(2, '0')}</div>
                    <span className="text-ink text-[17px] md:text-[19px] leading-[1.7] font-light">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Contextualization Form */}
            <div className="mx-6 md:mx-8 mb-8 p-6 md:p-8 bg-paper border border-line">
              <h4 className="text-sm font-semibold text-ink mb-6 flex items-center gap-3">
                <Sparkles size={14} className="text-accent"/> 
                Contextualize with AI
              </h4>
              
              {phase === 'setup' && (
                <div className="space-y-5">
                  {isNational && (
                    <div>
                      <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Select Country <span className="text-warning">*</span></label>
                      <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-4 py-3 border border-line bg-surface text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium transition-all appearance-none cursor-pointer">
                        <option value="">Select Country...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                  {isCity && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Select Country <span className="text-warning">*</span></label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-4 py-3 border border-line bg-surface text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium transition-all appearance-none cursor-pointer">
                          <option value="">Select Country...</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Enter City <span className="text-warning">*</span></label>
                        <input type="text" placeholder="e.g. São Paulo" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-3 border border-line bg-surface text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium transition-all placeholder:text-ink-muted/50" />
                      </div>
                    </div>
                  )}
                  {isPartner && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Target Country <span className="text-warning">*</span></label>
                        <select value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-4 py-3 border border-line bg-surface text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium transition-all appearance-none cursor-pointer">
                          <option value="">Select Country...</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-2">Partner Type <span className="text-warning">*</span></label>
                        <select value={form.partnerType} onChange={e => setForm({...form, partnerType: e.target.value})} className="w-full px-4 py-3 border border-line bg-surface text-ink focus:border-accent focus:ring-1 focus:ring-accent outline-none font-medium transition-all appearance-none cursor-pointer">
                          <option value="">Select Partner Type...</option>
                          {PARTNER_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleIdentifyStakeholders} 
                    disabled={!isFormValid() || isIdentifying} 
                    className="w-full bg-ink text-surface px-6 py-4 text-sm font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isIdentifying ? (
                      <><div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" /> Identifying Stakeholders...</>
                    ) : (
                      <><Tag size={16} /> Identify MLG Stakeholders</>
                    )}
                  </button>
                </div>
              )}

              {phase === 'stakeholders' && (
                <div className="space-y-6">
                  <div className="bg-surface p-5 border border-line">
                    <h5 className="text-sm font-semibold text-ink mb-6 flex items-center gap-3">
                      <Tag size={14} className="text-accent" /> Key Stakeholders
                    </h5>
                    <p className="text-sm font-light text-ink-muted mb-6">Review and edit the stakeholders identified from the report. Add new ones by typing and pressing Enter.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {stakeholders.map((sh, idx) => (
                        <div key={idx} className="inline-flex items-center gap-1.5 bg-accent/5 border border-line text-ink px-3 py-1.5 text-sm font-medium hover:bg-accent/10 transition-colors">
                          <a 
                            href={`https://duckduckgo.com/?q=${encodeURIComponent(sh + ' official website')}&ia=web`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 cursor-pointer"
                            title="Search for stakeholder"
                          >
                            {sh}
                            <ExternalLink size={10} className="opacity-50" />
                          </a>
                          <button onClick={() => removeStakeholder(idx)} className="hover:text-accent p-0.5 transition-colors ml-2 border-l border-line/50 pl-2" title="Remove stakeholder">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <input 
                      type="text" 
                      placeholder="Add stakeholder and press Enter..." 
                      value={newTag} 
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={addStakeholder}
                      className="w-full p-4 border border-line bg-surface text-ink text-sm focus:border-accent outline-none font-mono"
                    />
                  </div>

                  <button 
                    onClick={handleGeneratePlan} 
                    disabled={isGenerating || stakeholders.length === 0} 
                    className="w-full bg-ink text-surface px-6 py-4 text-sm font-semibold hover:bg-accent transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <><div className="w-4 h-4 border border-surface/30 border-t-surface animate-spin" /> Generating Plan...</>
                    ) : (
                      <><Sparkles size={14} /> Know more about stakeholders' roles across recommendations</>
                    )}
                  </button>
                </div>
              )}

              {phase === 'plan' && plan && (
                <div className="bg-surface border border-line mt-8 mb-4">
                  <div className="bg-paper border-b border-line p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent text-surface rounded-none mt-1">
                        <CheckCircle2 size={24} className="stroke-[1.5]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-heading text-ink font-semibold">MLG Stakeholders' Roles</h2>
                        <p className="text-sm text-ink-muted font-light mt-2 max-w-lg leading-relaxed">We have mapped the critical institutional partners necessary to operationalize each recommendation, defining their precise strategic responsibilities.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-12 bg-surface">
                    <Markdown
                      components={{
                        h3: ({node, ...props}) => (
                          <h3 className="font-heading font-semibold text-ink text-2xl leading-snug border-b border-line pb-4 mb-6 mt-12 first:mt-0" {...props}>
                            {props.children}
                          </h3>
                        ),
                        ul: ({node, ...props}) => <ul className="space-y-4 text-ink font-light leading-relaxed mb-8" {...props} />,
                        li: ({node, ...props}) => (
                          <li className="flex items-start gap-4 p-4 border border-line hover:bg-paper transition-colors" {...props}>
                            <div className="mt-1.5 text-accent opacity-50"><X size={12} className="rotate-45" /></div>
                            <div className="flex-1 text-[15px]">{props.children}</div>
                          </li>
                        ),
                        p: ({node, ...props}) => <span className="block mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-sans text-sm font-semibold text-ink block mb-2" {...props} />
                      }}
                    >
                      {plan}
                    </Markdown>
                  </div>

                  <div className="bg-paper p-4 border-t border-line flex justify-center">
                    <button 
                      onClick={() => {setPhase('setup'); setPlan(null); setStakeholders([]);}} 
                      className="text-sm font-semibold text-ink-muted hover:text-ink transition-colors flex items-center justify-center gap-3 px-6 py-3 border border-transparent hover:border-line"
                    >
                      <ArrowRight size={14} className="rotate-180" /> Start Over
                    </button>
                  </div>
                </div>
              )}

              {/* AI Errors */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold uppercase tracking-wider">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default function StepView({ step, onNext, onPrev, isFirst, isLast }: { step: any, onNext?: () => void, onPrev?: () => void, isFirst?: boolean, isLast?: boolean }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pathways' | 'recommendations'>('overview');
  const [activePartnerModal, setActivePartnerModal] = useState<any>(null);

  // Reset tab when step changes
  useEffect(() => {
    setActiveTab('overview');
    setActivePartnerModal(null);
  }, [step.id]);

  if (!step) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-12 max-w-4xl mx-auto pb-32"
    >
      <div className="mb-10 max-w-3xl">
        <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block tracking-wider uppercase">Action 0{step.id}</span>
        <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">
          {step.title}
        </h1>
        <p className="text-xl text-ink-muted leading-relaxed font-light font-sans max-w-2xl">
          {step.goal}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-line mb-12 w-full overflow-x-auto no-scrollbar relative">
        {[
          { id: 'overview', label: 'Overview & Context' },
          { id: 'pathways', label: 'Action Pathways' },
          { id: 'recommendations', label: 'Recommendations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'pathways' | 'recommendations')}
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
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Context and Rationale -> Why This Step is Needed */}
              {step.unifiedContext ? (
                <section>
                  <UnifiedContextCard data={step.unifiedContext} />
                </section>
              ) : (
                <section>
                  <h2 className="font-heading text-3xl font-medium text-ink mb-8">Why This Step is Needed</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {step.context.map((ctx: any, idx: number) => (
                      <div key={idx} className="h-full">
                        <ContextCard item={ctx} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'pathways' && (
            <motion.div
              key="pathways"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Operational Action Pathways -> Action Pathways */}
              <section>
                <div className="grid grid-cols-1 gap-px bg-line border border-line">
                  {step.pathways.map((pathway: any, index: number) => (
                    <div key={index} className="bg-surface p-8 md:p-10 transition-all hover:bg-paper relative group">
                        <h3 className="font-heading font-medium text-2xl text-ink mb-6">{pathway.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">What it is</h4>
                            <p className="text-ink leading-relaxed font-light text-[15px]">{pathway.whatItIs}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">How it works</h4>
                            <p className="text-ink leading-relaxed font-light text-[15px]">{pathway.howItWorks}</p>
                          </div>
                        </div>
                        
                        <div className="mt-10 pt-10 border-t border-line">
                          {pathway.transferability && (
                            <>
                              <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-4">Transferability</h4>
                              <p className="text-ink leading-relaxed font-light text-[15px] mb-8">{pathway.transferability}</p>
                            </>
                          )}
                          
                          <div className="flex flex-col md:flex-row gap-6">
                            {(pathway.models && pathway.models.length > 0) && (
                              <div className="flex-1">
                                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-widest block mb-3">Model{(pathway.models.length > 1) ? 's' : ''}</span>
                                <div className="flex flex-wrap gap-2">
                                  {pathway.models.map((fw: any, fwIdx: number) => (
                                    <a 
                                      key={fwIdx}
                                      href={fw.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper border border-line text-[13px] font-semibold text-accent hover:bg-surface hover:border-accent transition-colors"
                                    >
                                      <Building2 size={16} />
                                      {fw.name}
                                      <ExternalLink size={14} className="ml-0.5" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {pathway.partners && pathway.partners.length > 0 && (
                              <div className="flex-1">
                                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-widest block mb-3">Key Partners</span>
                                <div className="flex flex-wrap gap-2">
                                  {pathway.partners.map((p: any) => (
                                    p.subPartners ? (
                                      <button 
                                        key={p.name}
                                        onClick={() => setActivePartnerModal(p)}
                                        className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1.5 px-3 py-1.5 border border-line bg-surface text-[13px] font-semibold text-ink-muted hover:border-ink hover:text-ink transition-colors cursor-pointer"
                                      >
                                        {p.name}
                                      </button>
                                    ) : (
                                      <a 
                                        key={p.name} 
                                        href={p.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-line text-[13px] font-semibold text-ink-muted hover:border-ink hover:text-ink transition-colors"
                                      >
                                        {p.name}
                                        <ExternalLink size={12} className="text-slate-400" />
                                      </a>
                                    )
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {pathway.caseStudies && pathway.caseStudies.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-line">
                              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-widest block mb-4">Implementation Examples</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                                {pathway.caseStudies.map((cs: any, i: number) => (
                                  <a key={i} href={cs.link} target="_blank" rel="noopener noreferrer" className="group border border-line overflow-hidden hover:border-accent transition-all flex items-stretch bg-surface cursor-pointer h-24">
                                    <div className="w-24 shrink-0 overflow-hidden bg-paper relative">
                                      {cs.image ? (
                                        <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-ink-muted/30"><FileText size={24}/></div>
                                      )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-center">
                                      <h5 className="font-semibold text-sm text-ink group-hover:text-accent transition-colors leading-snug line-clamp-2">{cs.title}</h5>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Recommendations */}
              <section>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
                  <h2 className="font-heading text-3xl text-ink">Recommendations for Multilevel Governance Stakeholders</h2>
                </div>
                <div className="space-y-12">
                  {step.recommendations.map((rec: any, index: number) => (
                    <RecommendationCard key={index} rec={rec} stepTitle={step.title} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePartnerModal && (
            <PartnerModal 
              partnerData={activePartnerModal} 
              onClose={() => setActivePartnerModal(null)} 
            />
          )}
        </AnimatePresence>
        
        {/* Navigation Buttons for StepView */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-line">
          <button 
            onClick={onPrev}
            className="flex items-center gap-3 px-6 py-3 border border-line bg-surface hover:bg-paper transition-colors font-semibold text-ink-muted hover:text-ink uppercase tracking-wider text-xs"
          >
            <ArrowRight size={16} className="rotate-180" />
            {isFirst ? "Back to Intro" : "Previous Step"}
          </button>
          
          {onNext && (
            <button 
              onClick={onNext}
              className="flex items-center gap-3 px-6 py-3 bg-ink text-surface hover:bg-accent transition-colors font-semibold uppercase tracking-wider text-xs"
            >
              Next Step
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
