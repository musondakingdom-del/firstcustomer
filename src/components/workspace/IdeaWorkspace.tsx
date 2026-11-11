import React, { useState } from 'react';
import { 
  Plus, 
  Lightbulb, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Target, 
  Layers, 
  AlertCircle,
  TrendingUp,
  X,
  CheckCircle2
} from 'lucide-react';
import { Project, BusinessType, IdeaStage } from '../../types';
import { calculateProjectProgress } from '../../utils/analytics';
import { createDefaultValidationRecords } from '../../utils/seedData';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface IdeaWorkspaceProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
}

const BUSINESS_TYPES: { id: BusinessType; label: string }[] = [
  { id: 'digital_product', label: 'Digital Product' },
  { id: 'saas', label: 'SaaS (Software as a Service)' },
  { id: 'mobile_app', label: 'Mobile Application' },
  { id: 'freelance_service', label: 'Freelance Service' },
  { id: 'ecommerce', label: 'E-commerce Store' },
  { id: 'physical_product', label: 'Physical Product' },
  { id: 'other', label: 'Other Business Model' },
];

const IDEA_STAGES: { id: IdeaStage; label: string; desc: string }[] = [
  { id: 'just_idea', label: 'Just an Idea', desc: 'Raw concept, no initial research yet.' },
  { id: 'researching', label: 'Researching', desc: 'Conducting discovery & problem interviews.' },
  { id: 'validating', label: 'Validating', desc: 'Testing demand and alternative weaknesses.' },
  { id: 'building', label: 'Building MVP', desc: 'Developing the minimal core solution.' },
  { id: 'launched', label: 'Already Launched', desc: 'Live in public with initial users.' },
];

export const IdeaWorkspace: React.FC<IdeaWorkspaceProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onSaveProject,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    businessType: BusinessType;
    description: string;
    problemStatement: string;
    targetAudienceHypothesis: string;
    proposedSolution: string;
    stage: IdeaStage;
  }>({
    name: '',
    businessType: 'digital_product',
    description: '',
    problemStatement: '',
    targetAudienceHypothesis: '',
    proposedSolution: '',
    stage: 'just_idea',
  });

  const [formError, setFormError] = useState<string>('');

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      businessType: 'digital_product',
      description: '',
      problemStatement: '',
      targetAudienceHypothesis: '',
      proposedSolution: '',
      stage: 'just_idea',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      businessType: project.businessType,
      description: project.description,
      problemStatement: project.problemStatement,
      targetAudienceHypothesis: project.targetAudienceHypothesis,
      proposedSolution: project.proposedSolution,
      stage: project.stage,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Business or product name is required.');
      return;
    }
    if (!formData.problemStatement.trim()) {
      setFormError('Please describe the problem you intend to solve.');
      return;
    }

    if (editingProject) {
      // Update existing project
      const updated: Project = {
        ...editingProject,
        name: formData.name.trim(),
        businessType: formData.businessType,
        description: formData.description.trim(),
        problemStatement: formData.problemStatement.trim(),
        targetAudienceHypothesis: formData.targetAudienceHypothesis.trim(),
        proposedSolution: formData.proposedSolution.trim(),
        stage: formData.stage,
        updatedAt: new Date().toISOString(),
      };
      onSaveProject(updated);
    } else {
      // Create brand new project
      const newProj: Project = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: formData.name.trim(),
        businessType: formData.businessType,
        description: formData.description.trim(),
        problemStatement: formData.problemStatement.trim(),
        targetAudienceHypothesis: formData.targetAudienceHypothesis.trim(),
        proposedSolution: formData.proposedSolution.trim(),
        stage: formData.stage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetCustomer: {
          description: '',
          category: formData.targetAudienceHypothesis.trim(),
          ageRange: '',
          locationMarket: '',
          interests: [],
          relevantBehaviors: '',
          problemsExperienced: formData.problemStatement.trim(),
          whereTheyLook: '',
          whereTheyDiscuss: '',
        },
        researchQuestions: [],
        researchSources: [],
        findings: [],
        competitors: [],
        validationRecords: createDefaultValidationRecords(),
        feedbackList: [],
        missingSolutionsNotes: '',
      };
      onSaveProject(newProj);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Idea Workspace</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your business concepts. Keep each project’s customer discovery, competitors, and evidence separate.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Business Idea</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Lightbulb className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Business Ideas in Workspace</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Ideas stay saved locally on your device. Create your first project to start researching target customers and alternatives.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Create Business Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            const progress = calculateProjectProgress(proj);

            return (
              <div
                key={proj.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {proj.businessType.replace('_', ' ')}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        <Check className="w-3 h-3" /> Active Idea
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1" title={proj.name}>
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Core Problem snippet */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Problem Solved
                    </span>
                    <p className="text-slate-700 line-clamp-2 mt-0.5 text-[11px]">
                      {proj.problemStatement || 'Not defined yet.'}
                    </p>
                  </div>

                  {/* Research Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">Validation Progress</span>
                      <span className="font-bold text-blue-600">{progress.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Controls */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition"
                      title="Edit Idea Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(proj.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Research Idea</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProject ? 'Edit Business Idea' : 'Create New Business Idea'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Business or Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. StudyFlow, QuickInvoice, CleanRoutine"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* 2. Business Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt.id} value={bt.id}>
                        {bt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Current Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as IdeaStage })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                  >
                    {IDEA_STAGES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. Describe Your Idea in Plain Words
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A one-sentence summary of what your product or service is."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* 4. Problem statement */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. What Problem Does It Solve? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  placeholder="What specific friction, delay, wasted money, or frustration does your customer face today?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* 5. Target Audience Hypothesis */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  6. Who Do You Think Needs This Solution?
                </label>
                <input
                  type="text"
                  value={formData.targetAudienceHypothesis}
                  onChange={(e) => setFormData({ ...formData, targetAudienceHypothesis: e.target.value })}
                  placeholder="e.g. High school students (13–19), Solo freelance graphic designers, Independent cafe owners"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* 6. Proposed Solution */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  7. What Solution Are You Proposing?
                </label>
                <textarea
                  rows={2}
                  value={formData.proposedSolution}
                  onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                  placeholder="How does your proposed solution address the problem in a simple, low-effort way?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-sm"
                >
                  {editingProject ? 'Save Changes' : 'Create Idea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Business Idea?"
        message="Are you sure you want to delete this project? All associated questions, competitor analysis, findings, and feedback will be removed permanently from your browser storage."
        isDanger={true}
        confirmText="Delete Project"
        onConfirm={() => {
          if (deleteTargetId) onDeleteProject(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
