import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import StepView from "./components/StepView";
import MapDashboard from "./components/MapDashboard";
import { actionsData, landingPageData, deepDiveData } from "./data/content";
import { Menu, ArrowRight, MapPin } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<number | string>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-paper flex font-sans selection:bg-accent selection:text-surface">
      <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-2.5 bg-surface shadow-sm border border-line text-ink hover:text-accent hover:bg-paper transition-colors rounded-none"
            aria-label="Open Sidebar"
          >
            <Menu size={20} className="stroke-[1.5]" />
          </button>
        )}

        <div className="px-6 md:px-12 lg:px-20 pt-8 pb-24 max-w-7xl mx-auto">
          {currentStep === 0 ? (
            <LandingPage 
              onStart={() => setCurrentStep(1)} 
              onIntro={() => setCurrentStep(1)} 
              onNavigateToStep={(id) => setCurrentStep(id)}
            />
          ) : currentStep === 'dashboard' ? (
            <MapDashboard 
              stats={landingPageData.dashboard} 
              onNavigateToStep={(id) => setCurrentStep(id)}
            />
          ) : currentStep === 'journeys' ? (
            <div className="py-12 max-w-5xl mx-auto pb-32">
              <div className="mb-12">
                <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block tracking-wider uppercase">Part II</span>
                <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">Country Implementation Journeys</h1>
                <p className="text-xl text-ink-muted leading-relaxed font-light font-sans max-w-3xl">
                  Explore how different countries have operationalized multilevel governance in practice, navigating unique challenges and identifying clear pathways to implement systemic climate action.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'sweden', title: "Sweden", desc: "Flagship systems-oriented case of aligning national platforms, city climates contracts, and system demonstrators.", ready: true },
                  { id: 'brazil', title: "Brazil", desc: "Coming soon. An overview of how Brazil integrates municipal development into national green strategies.", ready: false },
                  { id: 'morocco', title: "Morocco", desc: "Coming soon. Discovering Morocco's approach to financing local climate adaptation pathways.", ready: false }
                ].map((country, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentStep(country.id)}
                    className="flex flex-col text-left group bg-surface border border-line hover:bg-paper transition-colors relative"
                  >
                    <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-line overflow-hidden w-full relative">
                      {country.ready ? (
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <MapPin size={32} className="text-ink-muted opacity-30" />
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading text-2xl font-medium text-ink mb-3">{country.title}</h3>
                        <p className="text-sm text-ink-muted font-light leading-relaxed mb-6">{country.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink">
                        {country.ready ? (
                          <><span>Read Journey</span><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                        ) : (
                          <span className="text-ink-muted">Content Incoming</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : currentStep === 'sweden' ? (
            <div className="py-12 max-w-4xl mx-auto pb-32">
              <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block tracking-wider uppercase">Country Journey</span>
              <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">{deepDiveData.sweden.title}</h1>
              <p className="text-xl text-ink-muted leading-relaxed font-light font-sans max-w-3xl mb-12">
                {deepDiveData.sweden.description}
              </p>
              
              <div className="flex flex-col gap-8 mb-10">
                {/* A. The Swedish Context */}
                <div className="bg-surface border border-line p-8 md:p-10">
                  <h3 className="font-heading font-medium text-2xl text-ink mb-4">{deepDiveData.sweden.context.title}</h3>
                  <p className="text-ink-muted leading-relaxed mb-4">
                    {deepDiveData.sweden.context.description}
                  </p>
                  <p className="text-ink-muted leading-relaxed">
                    {deepDiveData.sweden.context.purpose}
                  </p>
                </div>

                {/* B. Governance Model */}
                <div className="bg-surface border border-line p-8 md:p-10">
                  <h3 className="font-heading font-medium text-2xl text-ink mb-6">{deepDiveData.sweden.governanceModel.title}</h3>
                  <p className="text-ink-muted leading-relaxed mb-6">
                    {deepDiveData.sweden.governanceModel.pathwaysIntro}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {deepDiveData.sweden.governanceModel.actionPathways.map((pathway, idx) => (
                      <div key={idx} className={idx === deepDiveData.sweden.governanceModel.actionPathways.length - 1 && deepDiveData.sweden.governanceModel.actionPathways.length % 2 !== 0 ? "md:col-span-2" : ""}>
                        <h4 className="text-sm font-bold text-ink mb-2">{pathway.name}</h4>
                        <p className="text-sm text-ink-muted font-light leading-relaxed">{pathway.description}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-line mb-8" />

                  <h3 className="font-heading font-medium text-xl text-ink mb-6">{deepDiveData.sweden.governanceModel.orchestrationLogic.title}</h3>
                  <ul className="list-disc pl-5 space-y-3 text-ink-muted leading-relaxed">
                    {deepDiveData.sweden.governanceModel.orchestrationLogic.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : currentStep === 'brazil' ? (
            <div className="py-12 max-w-4xl mx-auto pb-32">
              <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block tracking-wider uppercase">Country Journey</span>
              <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">Brazil's Journey to Multilevel Climate Implementation</h1>
              <div className="p-10 bg-surface border border-line text-center py-20">
                <p className="text-xl text-ink-muted font-light">Content incoming...</p>
              </div>
            </div>
           ) : currentStep === 'morocco' ? (
            <div className="py-12 max-w-4xl mx-auto pb-32">
              <span className="font-sans text-sm font-semibold text-ink-muted mb-4 block tracking-wider uppercase">Country Journey</span>
              <h1 className="font-heading text-5xl md:text-6xl text-ink leading-[1.1] mb-6">Morocco's Journey to Multilevel Climate Implementation</h1>
              <div className="p-10 bg-surface border border-line text-center py-20">
                <p className="text-xl text-ink-muted font-light">Content incoming...</p>
              </div>
            </div>
          ) : (
            <StepView 
              step={actionsData.find(s => s.id === currentStep)} 
              onNext={typeof currentStep === 'number' && currentStep < 6 ? () => setCurrentStep(currentStep + 1) : undefined}
              onPrev={() => setCurrentStep(typeof currentStep === 'number' && currentStep - 1 > 0 ? currentStep - 1 : 0)}
              isFirst={currentStep === 1}
              isLast={currentStep === 6}
            />
          )}
        </div>
      </main>
    </div>
  );
}
