import React, { useState, useEffect } from 'react';
import { 
  Project, 
  ActiveNavTab, 
  ActivityItem 
} from './types';
import { FolderOpen } from 'lucide-react';
import { 
  loadProjects, 
  saveProjects, 
  loadActiveProjectId, 
  saveActiveProjectId, 
  loadActivities, 
  addActivity, 
  isRecruitmentDismissed, 
  setRecruitmentDismissed,
  resetToEmptyWorkspace 
} from './utils/storage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { IdeaWorkspace } from './components/workspace/IdeaWorkspace';
import { ResearchPlanner } from './components/planner/ResearchPlanner';
import { CompetitorAnalysis } from './components/competitors/CompetitorAnalysis';
import { ValidationTracker } from './components/validation/ValidationTracker';
import { ReportsView } from './components/reports/ReportsView';
import { AboutView } from './components/about/AboutView';
import { FounderRecruitmentModal } from './components/recruitment/FounderRecruitmentModal';
import { DataSettingsModal } from './components/settings/DataSettingsModal';
import { ConfirmationModal } from './components/common/ConfirmationModal';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => loadActiveProjectId(loadProjects()));
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadActivities());

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [recruitmentDismissed, setRecruitmentDismissedState] = useState<boolean>(() => isRecruitmentDismissed());
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);

  // Sync projects to storage
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Sync active project id
  useEffect(() => {
    saveActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Select / switch active project
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  // Save (create or update) a project
  const handleSaveProject = (updatedProj: Project) => {
    const exists = projects.some((p) => p.id === updatedProj.id);
    let newProjectsList: Project[];

    if (exists) {
      newProjectsList = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
      const updatedActs = addActivity(updatedProj.id, updatedProj.name, `Updated project details`, 'project');
      setActivities(updatedActs);
    } else {
      newProjectsList = [updatedProj, ...projects];
      const updatedActs = addActivity(updatedProj.id, updatedProj.name, `Created new project "${updatedProj.name}"`, 'project');
      setActivities(updatedActs);
      setActiveProjectId(updatedProj.id);
    }

    setProjects(newProjectsList);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const projToDelete = projects.find((p) => p.id === id);
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);

    if (activeProjectId === id) {
      setActiveProjectId(filtered[0]?.id || '');
    }

    if (projToDelete) {
      const updatedActs = addActivity(id, projToDelete.name, `Deleted project "${projToDelete.name}"`, 'project');
      setActivities(updatedActs);
    }
  };

  // Duplicate project
  const handleDuplicateProject = (id: string) => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return;

    const cloned: Project = {
      ...orig,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${orig.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [cloned, ...projects];
    setProjects(updatedList);
    setActiveProjectId(cloned.id);
    const updatedActs = addActivity(cloned.id, cloned.name, `Duplicated project from "${orig.name}"`, 'project');
    setActivities(updatedActs);
  };

  // Sub-feature update handler (planner, competitors, validation)
  const handleUpdateProjectSubFeature = (
    updatedProj: Project,
    actionLabel: string,
    iconType: ActivityItem['iconType'] = 'project'
  ) => {
    const updatedList = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updatedList);
    const updatedActs = addActivity(updatedProj.id, updatedProj.name, actionLabel, iconType);
    setActivities(updatedActs);
  };

  // Dismiss recruitment card
  const handleDismissRecruitment = () => {
    setRecruitmentDismissedState(true);
    setRecruitmentDismissed(true);
  };

  // Clear all projects
  const handleClearAllProjects = () => {
    resetToEmptyWorkspace();
    setProjects([]);
    setActiveProjectId('');
    setActivities([]);
    setSettingsModalOpen(false);
  };

  // Restore imported projects
  const handleRestoreProjects = (imported: Project[]) => {
    setProjects(imported);
    if (imported.length > 0) {
      setActiveProjectId(imported[0].id);
      const updatedActs = addActivity(imported[0].id, imported[0].name, `Restored ${imported.length} project(s) from backup`, 'project');
      setActivities(updatedActs);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex text-[#172033] antialiased">
      {/* Desktop Sidebar (Matching #111C2D deep navy from mockup) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
        isRecruitmentDismissed={recruitmentDismissed}
        onDismissRecruitment={handleDismissRecruitment}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header Bar */}
        <Header
          projects={projects}
          activeProject={activeProject}
          onSelectProject={handleSelectProject}
          onCreateProject={() => setActiveTab('workspace')}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
          activeTab={activeTab}
        />

        {/* View Router */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              projects={projects}
              activeProject={activeProject}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
              onEditActiveProject={() => setActiveTab('workspace')}
              onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
              isRecruitmentDismissed={recruitmentDismissed}
              onDismissRecruitment={handleDismissRecruitment}
            />
          )}

          {activeTab === 'workspace' && (
            <IdeaWorkspace
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={handleSelectProject}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
            />
          )}

          {activeTab === 'planner' && (
            activeProject ? (
              <ResearchPlanner
                project={activeProject}
                onUpdateProject={handleUpdateProjectSubFeature}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Active Project Selected</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To plan customer interviews and formulate discovery questions, please create or select an idea in the Idea Workspace first.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Go to Idea Workspace
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'competitors' && (
            activeProject ? (
              <CompetitorAnalysis
                project={activeProject}
                onUpdateProject={handleUpdateProjectSubFeature}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Active Project Selected</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To research competitors and market alternatives, create a business idea first.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Go to Idea Workspace
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'validation' && (
            activeProject ? (
              <ValidationTracker
                project={activeProject}
                onUpdateProject={handleUpdateProjectSubFeature}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-12 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Active Project Selected</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To track hypotheses and customer evidence across 7 dimensions, please select or create a project first.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    Go to Idea Workspace
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'reports' && (
            <ReportsView project={activeProject} />
          )}

          {activeTab === 'about' && (
            <AboutView
              onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
              onOpenSettings={() => setSettingsModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenDrawer={() => setMobileMenuOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRecruitmentModal={() => setRecruitmentModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Founder Recruitment Modal */}
      <FounderRecruitmentModal
        isOpen={recruitmentModalOpen}
        onClose={() => setRecruitmentModalOpen(false)}
      />

      {/* Local Data Storage & Backup Settings Modal */}
      <DataSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        projects={projects}
        activeProject={activeProject}
        onRestoreProjects={handleRestoreProjects}
        onClearAll={() => setClearAllConfirmOpen(true)}
      />

      {/* Clear All Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={clearAllConfirmOpen}
        title="Clear All Projects &amp; Data?"
        message="This will permanently delete all projects, research questions, competitor logs, and customer feedback from your browser storage. This cannot be undone unless you have a JSON backup."
        isDanger={true}
        confirmText="Clear All Data"
        onConfirm={handleClearAllProjects}
        onClose={() => setClearAllConfirmOpen(false)}
      />
    </div>
  );
}
