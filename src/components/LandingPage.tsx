import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { landingPageData, actionsData } from "../data/content";
import { ArrowRight, Globe, FileText, TrendingUp, ExternalLink, HelpCircle, Target, Rocket, CheckCircle2, MapPin } from "lucide-react";
import MapDashboard from "./MapDashboard";

interface LandingPageProps {
  onStart: () => void;
  onIntro: () => void;
  onNavigateToStep?: (stepId: number) => void;
}

export default function LandingPage({ onStart, onIntro, onNavigateToStep }: LandingPageProps) {
  const icons = [Globe, FileText, TrendingUp];
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      label: "COP 31 Context",
      icon: Globe,
      title: "Global Momentum Toward COP 31",
      description: "The Toolkit supports CHAMP by enabling countries to deliver national climate commitments at the city level—where emissions and risks are concentrated—by mobilizing finance to drive emissions reductions, strengthen resilience, and close the urban climate finance gap.",
      buttonText: "Learn more about COP 31",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    },
    {
      label: "Key Publication",
      icon: FileText,
      title: "UN-Habitat NDC Report Launch",
      description: "A comprehensive guide on integrating urban climate action into Nationally Determined Contributions (NDCs). This vital report provides national governments with the framework needed to ensure municipal financing pipelines are formally recognized and supported.",
      buttonText: "Read the Report",
      image: "https://unhabitat.org/sites/default/files/styles/cover_image_lg/public/2026/02/urban_content_in_ndc_3.0._a_global_snapshot_updated-128-NDCs-1_page-0001_0.jpg.webp?itok=WVyoOJ-f"
    },
    {
      label: "Country Spotlight",
      icon: MapPin, 
      title: "Spotlight: Sweden & CHAMP",
      description: "Sweden has actively engaged with the CHAMP initiative by fostering deep collaborations between national agencies and local municipalities, serving as a global blueprint for institutionalizing Multilevel Governance and systematically testing urban climate solutions.",
      buttonText: "Explore Case Study",
      image: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80"
    }
  ];

  /* Auto-slide effect */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Hero Banner Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full overflow-hidden mb-16 min-h-[45vh] lg:min-h-[50vh] flex flex-col justify-end group shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rounded-sm md:mt-8 border border-line"
      >
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80" 
            alt="Sustainable City Skyline" 
            className="w-full h-full object-cover transition-transform duration-[20s] ease-out group-hover:scale-105" 
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8 md:p-14 lg:p-16 flex flex-col items-start text-left w-full h-full justify-end max-w-5xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md mb-6 rounded-sm">
            <div className="w-1.5 h-1.5 bg-surface"></div>
            <span className="text-[11px] font-bold text-surface uppercase tracking-[0.2em]">A toolkit for national governments, cities and friends of CHAMP</span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-surface mb-6 leading-[1.05]">
            <span className="bg-[#3c4799] text-white px-3 py-0.5 rounded-sm inline-block mr-2">CHAMP</span>
            Toolkit
            <span className="block text-surface/80 mt-2 font-light text-4xl md:text-5xl lg:text-6xl">for Multilevel Climate Investment.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-surface/90 leading-relaxed font-light mb-8 max-w-4xl">
            Supporting the ‘CHAMP Investment Pledge’ delivery through guidance on policy reform, governance, investment pipelines, project aggregation and financial instruments.
          </p>
        </div>
      </motion.div>

      {/* Flowing MLG Journey Graphic */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-24 flex flex-col items-center"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 w-full">
          <div className="text-center w-full">
            <p className="text-[17px] text-ink-muted leading-[1.7] font-light max-w-2xl mx-auto">
              Explore a <strong className="text-ink font-medium">6-action journey to Multilevel Governance</strong>. This sequenced path covers the spectrum of actions needed to operationalize MLG.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-6xl mx-auto bg-surface border border-line divide-y md:divide-y-0 md:divide-x divide-line relative z-20 flex-wrap mb-12">
          {[
            { num: "01", label: "Shared Commitments", goal: "Establish shared political commitment and long-term alignment." },
            { num: "02", label: "Assess Environments", goal: "Diagnose legal, institutional, and financial conditions." },
            { num: "03", label: "Institutionalize MLG", goal: "Establish formal governance architectures." },
            { num: "04", label: "Plan Investments", goal: "Translate investment plans into structured pipelines." },
            { num: "05", label: "Mobilize Finance", goal: "Deploy catalytic funding to test and scale solutions." },
            { num: "06", label: "Learn & Scale", goal: "Enhance investment systems by leveraging partnerships." }
          ].map((step, i) => (
            <div 
              key={i} 
              onClick={() => onNavigateToStep && onNavigateToStep(i + 1)} 
              className="flex flex-col flex-1 min-w-[150px] p-6 md:p-8 relative group hover:bg-paper transition-colors cursor-pointer"
            >
              <span className="font-heading text-accent text-xl font-medium mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{step.num}</span>
              <span className="text-[15px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">{step.label}</span>

              {/* Tooltip positioned below to prevent overlap */}
              <div className="absolute top-full pt-4 left-1/2 -translate-x-1/2 w-64 md:w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30 pointer-events-none">
                <div className="bg-ink text-surface text-[13px] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-left leading-[1.6] font-light relative border border-white/10">
                  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 rotate-45 w-2.5 h-2.5 bg-ink border-l border-t border-white/10"></div>
                  {step.goal}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-6">
          <motion.button
            onClick={() => onNavigateToStep && onNavigateToStep('dashboard' as any)}
            className="group/btn relative inline-flex items-center justify-center gap-4 bg-ink text-surface px-10 py-5 text-[15px] font-bold uppercase tracking-widest hover:bg-accent hover:shadow-[0_4px_16px_rgba(60,71,153,0.3)] transition-all overflow-hidden w-full md:w-[340px]"
          >
            See Dashboard
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            onClick={() => onNavigateToStep && onNavigateToStep('sweden' as any)}
            className="group/btn relative inline-flex items-center justify-center gap-4 bg-ink text-surface px-10 py-5 text-[15px] font-bold uppercase tracking-widest hover:bg-accent hover:shadow-[0_4px_16px_rgba(60,71,153,0.3)] transition-all overflow-hidden w-full md:w-[340px]"
          >
            See Country Journeys
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>

      {/* Intro Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-line mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-line">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-7 p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-line space-y-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-ink leading-snug font-medium mb-6">
                {landingPageData.champOpportunity.title}
              </h2>
              <p className="text-lg text-ink-muted leading-relaxed font-light">
                {landingPageData.champOpportunity.goal}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">Content Focus:</h3>
              <ul className="space-y-4">
                {landingPageData.champOpportunity.points.map((point, idx) => (
                  <li key={idx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-accent mt-2 shrink-0 rotate-45" />
                    <span className="text-[15px]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <a 
                href="https://www.cop28.com/en/cop28-uae-coalition-for-high-ambition-multilevel-partnerships-for-climate-action" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-surface border border-line text-ink hover:bg-paper hover:border-ink transition-colors px-6 py-3 text-[13px] font-bold uppercase tracking-wider"
              >
                Know more about CHAMP and MLG
                <ExternalLink size={16} className="text-ink-muted shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Case Study */}
          <div className="lg:col-span-5 bg-slate-50 flex flex-col">
            <div className="h-64 w-full bg-slate-900 relative shrink-0 border-b border-line">
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80" 
                alt="Case Study Thumbnail" 
                className="w-full h-full object-cover mix-blend-luminosity opacity-70"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-surface px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-ink border border-line">
                Case Study
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-center">
              <h3 className="font-heading text-2xl font-medium text-ink mb-4">
                {landingPageData.champOpportunity.caseStudy.title}
              </h3>
              <p className="text-ink-muted font-light leading-relaxed text-[15px]">
                {landingPageData.champOpportunity.caseStudy.description}
              </p>
            </div>
          </div>
        </div>

              </motion.div>

{/* Toolkit Context Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
          <h2 className="font-heading text-3xl font-semibold text-ink tracking-tight max-w-lg">The Strategic Context</h2>
          <p className="text-ink-muted font-light max-w-md md:text-right leading-relaxed">Understanding the rationale, outcomes, and impact of the CHAMP Multilevel Governance Toolkit.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
          {landingPageData.toolkitContext.map((ctx, idx) => (
            <div key={idx} className="bg-surface p-10 flex flex-col hover:bg-paper transition-colors">
              <div className="mb-8">
                <h3 className="font-heading text-xl font-medium text-ink leading-snug">{ctx.question}</h3>
              </div>
              <ul className="space-y-5">
                {ctx.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex gap-4 text-ink font-light leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-accent mt-2 shrink-0 rotate-45" />
                    <span className="text-[14px] leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Carousel Context Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-ink p-10 md:p-14 mb-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-16"
      >
        <div className="relative z-10 md:w-1/2 min-h-[300px] flex flex-col justify-center">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 border border-surface/20 px-4 py-1.5 mb-10 text-xs font-medium text-surface tracking-wider uppercase">
              {(() => {
                const CurrentIcon = carouselSlides[currentSlide].icon;
                return <CurrentIcon size={14} className="stroke-[2]" />;
              })()}
              {carouselSlides[currentSlide].label}
            </div>
            
            <h2 className="font-heading text-4xl md:text-5xl text-surface font-semibold mb-6 leading-[1.15] tracking-tight">
              {carouselSlides[currentSlide].title.split(/(Toward COP 31|Report Launch|Sweden & CHAMP)/).map((part, i) => 
                part.match(/(Toward COP 31|Report Launch|Sweden & CHAMP)/) ? 
                <span key={i} className="text-surface/50 font-normal italic block mt-1">{part}</span> : part
              )}
            </h2>
            
            <p className="text-base md:text-lg text-surface/70 leading-relaxed mb-10 max-w-lg font-light">
              {carouselSlides[currentSlide].description}
            </p>
            
            <button className="bg-surface text-ink px-6 py-3 font-semibold hover:bg-surface/90 hover:scale-[1.02] transition-all inline-flex items-center gap-3 text-[13px] uppercase tracking-wider">
              {carouselSlides[currentSlide].buttonText} <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex gap-2 mt-12">
            {carouselSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all ${currentSlide === idx ? 'w-8 h-1 bg-surface' : 'w-2 h-1 bg-surface/30 hover:bg-surface/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            initial={{ rotate: -1, y: 10 }}
            whileInView={{ rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-72 h-72 md:w-[420px] md:h-[420px] bg-[#0A0A0A] border border-surface/20 overflow-hidden relative shadow-2xl"
          >
            <motion.img 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={carouselSlides[currentSlide].image} 
              alt={carouselSlides[currentSlide].title} 
              className="w-full h-full object-cover hover:opacity-100 hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Partnership Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex flex-col md:flex-row md:items-stretch items-center gap-12 md:gap-16">
          <div className="md:w-5/12 space-y-6 flex flex-col justify-center">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-ink leading-tight tracking-tight">
              A Joint Contribution to CHAMP
            </h2>
            <p className="text-xl md:text-2xl text-ink-muted font-light leading-relaxed">
              This toolkit is a strategic partnership between <strong className="text-ink font-semibold">CCFLA</strong> and <strong className="text-ink font-semibold">Viable Cities</strong>. A key goal of this toolkit is to showcase impactful multilevel governance initiatives championed in <strong className="text-ink font-semibold">Sweden</strong>.
            </p>
          </div>
          <div className="md:w-7/12 w-full flex flex-col items-center justify-between gap-6 py-4">
            {/* Top row: CCFLA and Viable Cities logos placed horizontally */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 w-full">
              <div className="flex-1 flex justify-end items-center">
                <img 
                  src="https://www.climatepolicyinitiative.org/wp-content/uploads/2020/09/CCFLA-hero.png" 
                  alt="CCFLA" 
                  className="h-44 md:h-56 object-contain hover:-translate-y-1 transition-all mix-blend-multiply md:translate-x-6" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block w-px h-32 bg-line shrink-0"></div>
              <div className="flex-1 flex justify-start items-center">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/59e86b55aeb625e2140eec1a/1634044375194-3G0ZG1T5HGMGNB2QSEYU/1.+VC_Logotyp_PRIM%C3%84R_RGB.png" 
                  alt="Viable Cities" 
                  className="h-20 md:h-28 object-contain hover:-translate-y-1 transition-all mix-blend-multiply opacity-90" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Bottom row: Sweden flag */}
            <div className="flex flex-col items-center justify-center pt-6 border-t border-line w-4/5 md:w-3/4">
              <span className="text-ink-muted text-sm uppercase tracking-widest font-semibold mb-6">Supported by</span>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/3840px-Flag_of_Sweden.svg.png" 
                alt="Sweden" 
                className="w-40 object-contain shadow-sm rounded-sm hover:-translate-y-1 transition-transform" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
  {/* Key Initiatives & Partnerships (Cards) */}
        <div className="w-full">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-6">
            <h2 className="font-heading text-3xl font-semibold text-ink tracking-tight max-w-lg">
              Global Ecosystem & Key Initiatives
            </h2>
            <p className="text-ink-muted font-light max-w-md md:text-right leading-relaxed">
              Key initiatives supporting CHAMP and synergies with the toolkit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {landingPageData.champOpportunity.initiatives.map((init, idx) => (
              <a
                key={idx}
                href={init.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-8 bg-surface hover:bg-paper transition-colors"
              >
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted mb-4 block truncate">{init.name}</span>
                  <h4 className="font-semibold text-ink text-sm leading-relaxed">{init.title}</h4>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-8 h-8 flex items-center justify-center border border-line bg-surface group-hover:bg-accent group-hover:border-accent transition-colors">
                    <ExternalLink size={14} className="text-ink-muted group-hover:text-surface transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>



    </div>
  );
}
