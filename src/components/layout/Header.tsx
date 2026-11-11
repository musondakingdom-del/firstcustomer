import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  ChevronDown, 
  HardDrive, 
  ShieldCheck, 
  FolderOpen, 
  Moon, 
  Sun,
  User,
  ExternalLink,
  Github,
  HeartHandshake
} from 'lucide-react';
import { Project, ActiveNavTab } from '../../types';

interface HeaderProps {
  projects: Project[];
  activeProject?: Project;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
  onOpenRecruitmentModal: () => void;
  activeTab: ActiveNavTab;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onOpenMobileMenu,
  onOpenSettings,
  onOpenRecruitmentModal,
  activeTab,
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const guestMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
      if (guestMenuRef.current && !guestMenuRef.current.contains(e.target as Node)) {
        setGuestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (tab: ActiveNavTab): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'workspace': return 'Idea Workspace';
      case 'planner': return 'Customer Research Planner';
      case 'competitors': return 'Competitor Analysis';
      case 'validation': return 'Validation Tracker';
      case 'reports': return 'Reports & Readiness Summary';
      case 'about': return 'About FirstCustomer';
      default: return 'FirstCustomer';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Trigger + Breadcrumb / Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">FirstCustomer / </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 inline-block">
              {getPageTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Right: Project Switcher + Quick Actions + Guest Mode Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Active Project Switcher */}
          <div className="relative" ref={projectMenuRef}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition max-w-[180px] sm:max-w-[240px]"
              title="Switch active project"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {activeProject ? activeProject.name : 'Select Project'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            </button>

            {projectDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Business Project
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {projects.length === 0 ? (
                    <div className="px-3 py-3 text-center text-[11px] text-slate-400">
                      No projects created yet
                    </div>
                  ) : (
                    projects.map((proj) => {
                      const isSelected = activeProject?.id === proj.id;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            onSelectProject(proj.id);
                            setProjectDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                            isSelected ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="truncate">{proj.name}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </button>
                      );
                    })
                  )}
                </div>
                <div className="border-t border-slate-100 p-1.5">
                  <button
                    onClick={() => {
                      setProjectDropdownOpen(false);
                      onCreateProject();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Project Quick Button (Desktop) */}
          <button
            onClick={onCreateProject}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-2xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Idea</span>
          </button>

          {/* Guest Mode Menu Dropdown (Matching mockup top right) */}
          <div className="relative" ref={guestMenuRef}>
            <button
              onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
              title="Guest Mode & Local Storage"
            >
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <User className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline font-semibold text-slate-800 text-[11px]">Guest Mode</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {guestDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 bg-slate-50 rounded-lg mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guest Session Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Zero accounts or logins required. Everything is saved locally on your browser.
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setGuestDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-left transition"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    <span>Storage &amp; Backup Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setGuestDropdownOpen(false);
                      onOpenRecruitmentModal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-left transition"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-blue-500" />
                    <span>Founder Recruitment</span>
                  </button>
                  <a
                    href="https://github.com/firstcustomer/firstcustomer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-left transition"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="w-3.5 h-3.5 text-slate-500" />
                      <span>GitHub Repository</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
