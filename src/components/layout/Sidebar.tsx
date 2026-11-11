import React from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  ClipboardList, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Info, 
  Github, 
  ExternalLink,
  Search,
  TrendingUp,
  HardDrive
} from 'lucide-react';
import { ActiveNavTab } from '../../types';
import { FounderRecruitmentCard } from '../recruitment/FounderRecruitmentCard';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenRecruitmentModal: () => void;
  isRecruitmentDismissed: boolean;
  onDismissRecruitment: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenRecruitmentModal,
  isRecruitmentDismissed,
  onDismissRecruitment,
  onOpenSettings,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace' as ActiveNavTab, label: 'Idea Workspace', icon: Lightbulb },
    { id: 'planner' as ActiveNavTab, label: 'Research Planner', icon: ClipboardList },
    { id: 'competitors' as ActiveNavTab, label: 'Competitor Analysis', icon: Scale },
    { id: 'validation' as ActiveNavTab, label: 'Validation Tracker', icon: CheckCircle2 },
    { id: 'reports' as ActiveNavTab, label: 'Reports', icon: FileText },
    { id: 'about' as ActiveNavTab, label: 'About', icon: Info },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#111C2D] border-r border-[#1E293B] text-slate-300 h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1E293B]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center text-white">
          <div className="w-full h-full bg-[#0E1726]/30 backdrop-blur-xs rounded-[10px] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-sky-200 stroke-[2.5]" />
          </div>
        </div>
        <div>
          <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1">
            FirstCustomer
          </span>
          <span className="block text-[10px] font-medium text-blue-400 uppercase tracking-wider">
            Research. Validate. Grow.
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* GitHub Open-Source Link */}
        <div className="pt-2">
          <a
            href="https://github.com/firstcustomer/firstcustomer"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition group"
            title="Open-source repository (MIT Licensed)"
          >
            <div className="flex items-center gap-3">
              <Github className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              <span>GitHub</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>
        </div>
      </div>

      {/* Footer Area with Founder Recruitment & Guest Mode */}
      <div className="p-3 border-t border-[#1E293B] space-y-2 bg-[#0E1726]/60">
        {/* Founder Recruitment Card (Matching Mockup) */}
        <FounderRecruitmentCard
          onOpenModal={onOpenRecruitmentModal}
          isDismissed={isRecruitmentDismissed}
          onDismiss={onDismissRecruitment}
          variant="sidebar"
        />

        {/* Guest Mode & Local Storage Status */}
        <div 
          onClick={onOpenSettings}
          className="cursor-pointer group px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-xs transition"
          title="Click to view storage & backup settings"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200 group-hover:text-white text-[11px]">Guest Mode</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span>Local Storage</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
