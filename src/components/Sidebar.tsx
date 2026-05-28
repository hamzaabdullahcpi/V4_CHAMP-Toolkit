import { motion } from "motion/react";
import { LayoutDashboard, Target, Building2, Network, Coins, TrendingUp, Users, BookOpen, X, MapPin, ChevronDown, ChevronRight, Globe, Settings } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  currentStep: number | string;
  setCurrentStep: (step: number | string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ currentStep, setCurrentStep, isOpen, toggleSidebar }: SidebarProps) {
  const [part1Open, setPart1Open] = useState(true);
  const [part2Open, setPart2Open] = useState(false);

  const navItemsGeneral: { id: number | string, label: string, icon: any }[] = [
    { id: 0, label: "Home", icon: BookOpen },
    { id: 'dashboard', label: "Dashboard", icon: LayoutDashboard },
  ];

  const navItemsPart1: { id: number | string, label: string, icon: any }[] = [
    { id: 1, label: "1. Shared Commitments", icon: Users },
    { id: 2, label: "2. Enabling Environments", icon: Target },
    { id: 3, label: "3. Institutionalize MLG", icon: Building2 },
    { id: 4, label: "4. Plan Investments", icon: Network },
    { id: 5, label: "5. Mobilize Finance", icon: Coins },
    { id: 6, label: "6. Learn & Scale", icon: TrendingUp },
  ];

  const navItemsPart2: { id: number | string, label: string, icon: any }[] = [
    { id: 'journeys', label: "Overview", icon: Globe },
    { id: 'sweden', label: "Sweden", icon: MapPin },
    { id: 'brazil', label: "Brazil", icon: MapPin },
    { id: 'morocco', label: "Morocco", icon: MapPin },
  ];

  const renderNavItems = (items: { id: number | string, label: string, icon: any }[]) => {
    return items.map((item) => {
      const isActive = currentStep === item.id;
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          onClick={() => setCurrentStep(item.id)}
          className={`group w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-all duration-200 border-l-2 ${
            isActive
              ? "bg-accent/[0.03] border-accent text-ink font-semibold"
              : "border-transparent text-ink-muted hover:bg-accent hover:border-accent hover:text-surface font-medium"
          }`}
        >
          <Icon size={16} className={`stroke-[2] ${isActive ? "text-accent" : "text-ink-muted group-hover:text-surface"}`} />
          <span className="text-left tracking-tight">{item.label}</span>
        </button>
      );
    });
  };

  return (
    <div className={`w-64 h-screen bg-surface border-r border-line flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden`}>
      <div className="p-6 border-b border-line flex justify-between items-start shrink-0">
        <div>
          <h1 className="font-heading font-semibold text-xl text-ink leading-[1.2] tracking-tight">
            CHAMP Toolkit
          </h1>
          <p className="font-mono text-[10px] text-ink-muted mt-2 uppercase tracking-widest font-semibold flex items-center gap-1.5">
             Multilevel Gov
          </p>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          aria-label="Close Sidebar"
        >
          <X size={16} className="stroke-[1.5]" />
        </button>
      </div>

      <nav className="flex-1 py-6 flex flex-col overflow-y-auto">
        <div className="mb-4">
          {renderNavItems(navItemsGeneral)}
        </div>

        <div className="mb-2">
          <button 
            onClick={() => setPart1Open(!part1Open)}
            className="w-full flex items-center justify-between px-6 py-2 text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 hover:text-ink transition-colors"
          >
            <span>Part 1: Core Actions</span>
            {part1Open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <motion.div 
            initial={false}
            animate={{ height: part1Open ? 'auto' : 0, opacity: part1Open ? 1 : 0 }}
            className="overflow-hidden"
          >
            {renderNavItems(navItemsPart1)}
          </motion.div>
        </div>

        <div>
          <button 
            onClick={() => setPart2Open(!part2Open)}
            className="w-full flex items-center justify-between px-6 py-2 text-xs font-bold text-ink-muted uppercase tracking-wider mt-4 mb-2 hover:text-ink transition-colors"
          >
            <span>Part 2: Country Journeys</span>
            {part2Open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <motion.div 
            initial={false}
            animate={{ height: part2Open ? 'auto' : 0, opacity: part2Open ? 1 : 0 }}
            className="overflow-hidden"
          >
            {renderNavItems(navItemsPart2)}
          </motion.div>
        </div>
      </nav>
    </div>
  );
}
