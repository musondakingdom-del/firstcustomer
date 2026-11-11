import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  Lightbulb, 
  ClipboardList, 
  Scale, 
  CheckCircle2, 
  FileText, 
  Info, 
  Github, 
  HardDrive, 
  TrendingUp,
  HeartHandshake,
  ExternalLink,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { ActiveNavTab } from '../../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDrawer: () => void;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenRecruitmentModal: () => void;
  onOpenSettings: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  onOpenDrawer,
  activeTab,
  onSelectTab,
  onOpenRecruitmentModal,
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
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Drawer */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#111C2D] border-r border-[#1E293B] text-slate-300 flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4 text-sky-200 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base">FirstCustomer</span>
              <span className="block text-[9px] text-blue-400 font-semibold tracking-wider">RESEARCH FIRST</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#1E293B] space-y-1">
            <button
              onClick={() => {
                onClose();
                onOpenRecruitmentModal();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-sky-300 hover:bg-blue-900/30 transition"
            >
              <HeartHandshake className="w-4 h-4 text-sky-400" />
              <span>Founder Recruitment</span>
            </button>
            <a
              href="https://github.com/firstcustomer/firstcustomer"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <span className="flex items-center gap-3">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="p-3 border-t border-[#1E293B] bg-[#0E1726]/60">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Guest Mode (Local Storage)</span>
            </span>
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bottom Sticky Navigation Bar for Quick Phone Access */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111C2D]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-400 text-[10px]">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
            activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectTab('planner')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
            activeTab === 'planner' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Research</span>
        </button>

        <button
          onClick={() => onSelectTab('competitors')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
            activeTab === 'competitors' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Competitors</span>
        </button>

        <button
          onClick={() => onSelectTab('reports')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
            activeTab === 'reports' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>

        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:text-slate-200 transition"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
