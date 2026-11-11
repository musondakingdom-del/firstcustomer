import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Lightbulb, 
  Edit3, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Scale, 
  MessageSquare, 
  FileText, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  FolderOpen, 
  ChevronRight, 
  Info,
  Plus
} from 'lucide-react';
import { Project, ActivityItem, ActiveNavTab } from '../../types';
import { calculateProjectProgress, getProjectNextSteps } from '../../utils/analytics';
import { FounderRecruitmentCard } from '../recruitment/FounderRecruitmentCard';

interface DashboardProps {
  projects: Project[];
  activeProject?: Project;
  activities: ActivityItem[];
  onNavigate: (tab: ActiveNavTab) => void;
  onEditActiveProject: () => void;
  onOpenRecruitmentModal: () => void;
  isRecruitmentDismissed: boolean;
  onDismissRecruitment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  activeProject,
  activities,
  onNavigate,
  onEditActiveProject,
  onOpenRecruitmentModal,
  isRecruitmentDismissed,
  onDismissRecruitment,
}) => {
  // Real stats calculated strictly from actual user data (0 when empty)
  const totalProjects = projects.length;
  const researchingCount = projects.filter((p) => p.stage === 'researching').length;
  
  // Total completed research activities: sum of actual questions, competitors, findings, and feedback
  const researchActivitiesCount = projects.reduce(
    (sum, p) =>
      sum +
      (p.researchQuestions?.length || 0) +
      (p.competitors?.length || 0) +
      (p.findings?.length || 0) +
      (p.feedbackList?.length || 0),
    0
  );

  const readyCount = projects.filter((p) => {
    const pProg = calculateProjectProgress(p);
    return pProg.percentage >= 80;
  }).length;

  // Calculate progress for active project, or 0% when none
  const progress = activeProject
    ? calculateProjectProgress(activeProject)
    : {
        percentage: 0,
        items: [
          { id: 'idea', label: 'Idea Defined', completed: false, detail: 'Define problem & solution hypothesis' },
          { id: 'plan', label: 'Research Plan', completed: false, detail: 'Define customer profile & 3+ questions' },
          { id: 'competitors', label: 'Competitor Analysis', completed: false, detail: 'Add at least 1 existing competitor' },
          { id: 'validate', label: 'Validate with Users', completed: false, detail: 'Record observations or findings' },
          { id: 'readiness', label: 'Readiness Report', completed: false, detail: 'Collect evidence across validation areas' },
        ],
      };

  const nextSteps = activeProject
    ? getProjectNextSteps(activeProject)
    : [
        {
          id: 'step-create',
          title: 'Create your first business idea',
          description: 'Define the core problem and target customer in the Idea Workspace.',
          tabTarget: 'workspace' as const,
          priority: 'high' as const,
        },
        {
          id: 'step-target',
          title: 'Define your target customer profile',
          description: 'Document who experiences this problem and where they talk about it.',
          tabTarget: 'planner' as const,
          priority: 'high' as const,
        },
        {
          id: 'step-questions',
          title: 'Plan customer discovery questions',
          description: 'Formulate open-ended questions about past habits instead of selling.',
          tabTarget: 'planner' as const,
          priority: 'medium' as const,
        },
      ];

  const getStageBadge = (stage?: Project['stage']) => {
    if (!stage) {
      return { label: 'Not Started', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
    switch (stage) {
      case 'just_idea':
        return { label: 'Just an Idea', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'researching':
        return { label: 'Researching', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'validating':
        return { label: 'Validating', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'building':
        return { label: 'Building', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'launched':
        return { label: 'Launched', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: stage, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const stageBadge = getStageBadge(activeProject?.stage);

  return (
    <div className="space-y-6 pb-20 lg:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1528] via-[#102447] to-[#16356B] border border-blue-500/30 text-white p-6 sm:p-8 lg:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Validate your idea <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">before</span> you build.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Understand your customers, research problems and discover whether your business idea solves something people actually need.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate(activeProject ? 'planner' : 'workspace')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-blue-600/30 group"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Researching</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('workspace')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 font-medium text-xs sm:text-sm transition"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Explore My Projects</span>
              </button>
            </div>
          </div>

          {/* Clean Graphic Illustration */}
          <div className="hidden md:flex shrink-0 items-center justify-center pr-4">
            <div className="relative w-48 h-36 flex items-end justify-center gap-3">
              <div className="w-6 h-14 bg-gradient-to-t from-blue-700/60 to-sky-400/80 rounded-t-lg shadow-inner"></div>
              <div className="w-6 h-20 bg-gradient-to-t from-blue-600/70 to-sky-300/80 rounded-t-lg shadow-inner"></div>
              <div className="w-6 h-28 bg-gradient-to-t from-blue-500/80 to-sky-200/90 rounded-t-lg shadow-inner"></div>
              <div className="w-6 h-34 bg-gradient-to-t from-blue-400 to-white rounded-t-lg shadow-lg"></div>

              <div className="absolute top-2 -right-2 w-16 h-16 rounded-full border-4 border-sky-300/80 bg-blue-500/20 backdrop-blur-md shadow-xl flex items-center justify-center transform rotate-12">
                <div className="w-6 h-6 rounded-full bg-sky-200/40"></div>
                <div className="absolute -bottom-3 -right-3 w-3 h-8 bg-sky-300 rounded-full rotate-45 transform origin-top"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards: Real User Data (0 When Empty) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Projects</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalProjects}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Stored locally on your device</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">In Research</div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{researchingCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active investigation</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Research Activities</div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{researchActivitiesCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Questions, sources &amp; feedback</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Ready for Review</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{readyCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">&gt;80% research complete</div>
        </div>
      </div>

      {/* 3. Row: Project Overview (Left) + Research Progress (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${activeProject ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Your Project Overview</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeProject ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  {activeProject ? 'Active Project' : 'No Active Project'}
                </span>
                {activeProject && (
                  <button
                    onClick={onEditActiveProject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Main Project Card Content */}
            {activeProject ? (
              <div className="py-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Lightbulb className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 truncate">
                      {activeProject.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${stageBadge.bg}`}>
                      {stageBadge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {activeProject.description || 'No description provided yet.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-700">
                    No Business Idea Created Yet
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You haven’t added a business idea to research yet. Start by defining the core problem, proposed solution, and who you believe needs it.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => onNavigate('workspace')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Business Idea</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Meta Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  <Users className="w-3 h-3 text-blue-600" /> Target Audience
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  {activeProject?.targetAudienceHypothesis || 'Not specified'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  <AlertCircle className="w-3 h-3 text-indigo-600" /> Core Problem
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                  {activeProject?.problemStatement || 'Not specified'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Status
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <span>{stageBadge.label}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              {activeProject ? (
                <>Business Type: <strong className="text-slate-800 capitalize">{activeProject.businessType.replace('_', ' ')}</strong></>
              ) : (
                '0 projects saved in guest mode'
              )}
            </span>
            <button
              onClick={() => onNavigate('workspace')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>{activeProject ? 'Manage all ideas' : 'Go to workspace'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Research Progress Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Research Progress</h2>
              </div>
              <span className={`text-xs font-bold ${progress.percentage > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                {progress.percentage > 0 ? `${progress.percentage}% Complete` : 'Not Started'}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="py-4 flex items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#2563EB"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progress.percentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{progress.percentage}%</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                    {progress.percentage > 0 ? 'Validated' : '0 of 5 done'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1 text-xs">
              {progress.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className={item.completed ? 'font-semibold text-slate-800' : 'text-slate-500'}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[110px]" title={item.detail}>
                    {item.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 text-center">
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Readiness Summary →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Row: Quick Research Tools + Key Insights & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Research Tools */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Quick Research Tools</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => onNavigate(activeProject ? 'planner' : 'workspace')}
              className="group p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Plan Your Research</div>
                  <div className="text-[11px] text-slate-500 truncate">Create questions &amp; goals</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => onNavigate(activeProject ? 'competitors' : 'workspace')}
              className="group p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Scale className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Check Competitors</div>
                  <div className="text-[11px] text-slate-500 truncate">See what others offer</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => onNavigate(activeProject ? 'validation' : 'workspace')}
              className="group p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Track Feedback</div>
                  <div className="text-[11px] text-slate-500 truncate">Log real responses</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => onNavigate(activeProject ? 'reports' : 'workspace')}
              className="group p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Generate Report</div>
                  <div className="text-[11px] text-slate-500 truncate">Get your insights</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Key Insights & Next Steps */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Key Insights &amp; Next Steps</h2>
            </div>

            {/* Tip callout */}
            <div className="my-4 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Tip:</strong> Talk to potential customers, check online communities, and validate your idea with real feedback before building code.
              </p>
            </div>

            {/* Next steps list */}
            <div className="space-y-3 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Recommended Actions
              </div>
              {nextSteps.map((step, idx) => (
                <div 
                  key={step.id}
                  onClick={() => onNavigate(step.tabTarget)}
                  className="cursor-pointer group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {step.description}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Deterministic guidance based on project state</span>
            <span className="font-semibold text-slate-600">Zero AI Hallucinations</span>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Section: Helpful Empty State */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Activity</h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {activities.length > 0 ? `${activities.length} event(s)` : 'No events yet'}
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-1">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <p className="font-semibold text-slate-700">No activity recorded yet</p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              As you define ideas, formulate research questions, add competitor notes, and record customer feedback, your progress will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 pt-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800">{act.action}</span>
                    <span className="text-slate-400 text-[11px] ml-2">in {act.projectName}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Mobile Recruitment Banner */}
      <div className="lg:hidden">
        <FounderRecruitmentCard
          onOpenModal={onOpenRecruitmentModal}
          isDismissed={isRecruitmentDismissed}
          onDismiss={onDismissRecruitment}
          variant="mobile-banner"
        />
      </div>
    </div>
  );
};
