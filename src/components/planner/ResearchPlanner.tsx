import React, { useState } from 'react';
import { 
  Users, 
  HelpCircle, 
  Globe, 
  FileCheck2, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ExternalLink, 
  Search, 
  Lightbulb, 
  Bookmark, 
  Clock, 
  X,
  MessageSquare
} from 'lucide-react';
import { 
  Project, 
  TargetCustomer, 
  ResearchQuestion, 
  ResearchSource, 
  ResearchFinding, 
  QuestionCategory, 
  QuestionStatus,
  EvidenceStatus 
} from '../../types';
import { detectPitchQuestion } from '../../utils/analytics';
import { exportQuestionsToCSV } from '../../utils/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface ResearchPlannerProps {
  project: Project;
  onUpdateProject: (updatedProject: Project, actionLabel: string, iconType: any) => void;
}

const TEMPLATE_QUESTIONS: { question: string; category: QuestionCategory }[] = [
  { question: 'What is the most difficult part of doing this task today?', category: 'problem_discovery' },
  { question: 'How do you currently try to solve or work around this problem?', category: 'current_workflow' },
  { question: 'What frustrates you most about the existing solutions or tools you’ve tried?', category: 'frustrations' },
  { question: 'How often do you experience this frustration (daily, weekly, monthly)?', category: 'problem_discovery' },
  { question: 'What have you already tried before that didn’t work or you stopped using?', category: 'alternatives' },
  { question: 'What happens if you are unable to solve this problem?', category: 'frustrations' },
  { question: 'Where do you normally search when looking for a tool or answer to this?', category: 'alternatives' },
];

export const ResearchPlanner: React.FC<ResearchPlannerProps> = ({ project, onUpdateProject }) => {
  const [activeSubTab, setActiveSubTab] = useState<'customer' | 'questions' | 'sources' | 'findings'>('customer');

  // Customer profile form state
  const [customerData, setCustomerData] = useState<TargetCustomer>(() => ({
    ...project.targetCustomer,
    interests: project.targetCustomer?.interests || [],
  }));
  const [interestInput, setInterestInput] = useState('');
  const [customerSavedToast, setCustomerSavedToast] = useState(false);

  // Question modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ResearchQuestion | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [questionCat, setQuestionCat] = useState<QuestionCategory>('problem_discovery');
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>('planned');
  const [questionNotes, setQuestionNotes] = useState('');
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  // Source modal state
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<ResearchSource | null>(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceProblem, setSourceProblem] = useState('');
  const [sourceSummary, setSourceSummary] = useState('');
  const [sourceNotes, setSourceNotes] = useState('');
  const [deleteSourceId, setDeleteSourceId] = useState<string | null>(null);

  // Findings modal state
  const [findingModalOpen, setFindingModalOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<ResearchFinding | null>(null);
  const [findingTitle, setFindingTitle] = useState('');
  const [findingDesc, setFindingDesc] = useState('');
  const [findingSource, setFindingSource] = useState('');
  const [findingNotes, setFindingNotes] = useState('');
  const [findingObservations, setFindingObservations] = useState(1);
  const [findingStatus, setFindingStatus] = useState<EvidenceStatus>('initial_observation');
  const [deleteFindingId, setDeleteFindingId] = useState<string | null>(null);

  // Save Target Customer Profile
  const handleSaveCustomerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Project = {
      ...project,
      targetCustomer: customerData,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Updated Target Customer profile', 'project');
    setCustomerSavedToast(true);
    setTimeout(() => setCustomerSavedToast(false), 3000);
  };

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    if (!customerData.interests.includes(interestInput.trim())) {
      setCustomerData({
        ...customerData,
        interests: [...customerData.interests, interestInput.trim()],
      });
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (idx: number) => {
    setCustomerData({
      ...customerData,
      interests: customerData.interests.filter((_, i) => i !== idx),
    });
  };

  // Question Builder actions
  const openAddQuestion = (templateText?: string, templateCat?: QuestionCategory) => {
    setEditingQuestion(null);
    setQuestionText(templateText || '');
    setQuestionCat(templateCat || 'problem_discovery');
    setQuestionStatus('planned');
    setQuestionNotes('');
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (q: ResearchQuestion) => {
    setEditingQuestion(q);
    setQuestionText(q.question);
    setQuestionCat(q.category);
    setQuestionStatus(q.status);
    setQuestionNotes(q.notesOrAnswer || '');
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const isPitch = detectPitchQuestion(questionText);
    let updatedQuestions: ResearchQuestion[] = [];

    if (editingQuestion) {
      updatedQuestions = (project.researchQuestions || []).map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              question: questionText.trim(),
              category: questionCat,
              status: questionStatus,
              notesOrAnswer: questionNotes.trim(),
              isPitchWarning: isPitch,
            }
          : q
      );
    } else {
      const newQ: ResearchQuestion = {
        id: `q-${Date.now()}`,
        question: questionText.trim(),
        category: questionCat,
        status: questionStatus,
        notesOrAnswer: questionNotes.trim(),
        isPitchWarning: isPitch,
        createdAt: new Date().toISOString(),
      };
      updatedQuestions = [...(project.researchQuestions || []), newQ];
    }

    const updated: Project = {
      ...project,
      researchQuestions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(
      updated,
      editingQuestion ? 'Updated research question' : 'Added customer research question',
      'question'
    );
    setQuestionModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = (project.researchQuestions || []).filter((q) => q.id !== id);
    const updated: Project = {
      ...project,
      researchQuestions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Deleted research question', 'question');
  };

  // Source Tracker actions
  const openAddSource = () => {
    setEditingSource(null);
    setSourceName('');
    setSourceUrl('');
    setSourceProblem('');
    setSourceSummary('');
    setSourceNotes('');
    setSourceModalOpen(true);
  };

  const openEditSource = (s: ResearchSource) => {
    setEditingSource(s);
    setSourceName(s.sourceName);
    setSourceUrl(s.sourceUrl);
    setSourceProblem(s.problemDiscussed);
    setSourceSummary(s.summary);
    setSourceNotes(s.notes);
    setSourceModalOpen(true);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;

    let updatedSources: ResearchSource[] = [];
    if (editingSource) {
      updatedSources = (project.researchSources || []).map((s) =>
        s.id === editingSource.id
          ? {
              ...s,
              sourceName: sourceName.trim(),
              sourceUrl: sourceUrl.trim(),
              problemDiscussed: sourceProblem.trim(),
              summary: sourceSummary.trim(),
              notes: sourceNotes.trim(),
            }
          : s
      );
    } else {
      const newS: ResearchSource = {
        id: `src-${Date.now()}`,
        sourceName: sourceName.trim(),
        sourceUrl: sourceUrl.trim(),
        dateResearched: new Date().toISOString().split('T')[0],
        problemDiscussed: sourceProblem.trim(),
        summary: sourceSummary.trim(),
        notes: sourceNotes.trim(),
      };
      updatedSources = [...(project.researchSources || []), newS];
    }

    const updated: Project = {
      ...project,
      researchSources: updatedSources,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Added research discussion source', 'question');
    setSourceModalOpen(false);
  };

  const handleDeleteSource = (id: string) => {
    const updatedSources = (project.researchSources || []).filter((s) => s.id !== id);
    const updated: Project = {
      ...project,
      researchSources: updatedSources,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Deleted research source', 'question');
  };

  // Finding actions
  const openAddFinding = () => {
    setEditingFinding(null);
    setFindingTitle('');
    setFindingDesc('');
    setFindingSource('');
    setFindingNotes('');
    setFindingObservations(1);
    setFindingStatus('initial_observation');
    setFindingModalOpen(true);
  };

  const openEditFinding = (f: ResearchFinding) => {
    setEditingFinding(f);
    setFindingTitle(f.title);
    setFindingDesc(f.problemDescription);
    setFindingSource(f.source);
    setFindingNotes(f.evidenceNotes);
    setFindingObservations(f.observationCount);
    setFindingStatus(f.evidenceStatus);
    setFindingModalOpen(true);
  };

  const handleSaveFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findingTitle.trim()) return;

    let updatedFindings: ResearchFinding[] = [];
    if (editingFinding) {
      updatedFindings = (project.findings || []).map((f) =>
        f.id === editingFinding.id
          ? {
              ...f,
              title: findingTitle.trim(),
              problemDescription: findingDesc.trim(),
              source: findingSource.trim(),
              evidenceNotes: findingNotes.trim(),
              observationCount: findingObservations,
              evidenceStatus: findingStatus,
            }
          : f
      );
    } else {
      const newF: ResearchFinding = {
        id: `find-${Date.now()}`,
        title: findingTitle.trim(),
        problemDescription: findingDesc.trim(),
        source: findingSource.trim(),
        evidenceNotes: findingNotes.trim(),
        dateRecorded: new Date().toISOString().split('T')[0],
        observationCount: findingObservations,
        evidenceStatus: findingStatus,
      };
      updatedFindings = [...(project.findings || []), newF];
    }

    const updated: Project = {
      ...project,
      findings: updatedFindings,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Recorded customer research finding', 'finding');
    setFindingModalOpen(false);
  };

  const handleDeleteFinding = (id: string) => {
    const updatedFindings = (project.findings || []).filter((f) => f.id !== id);
    const updated: Project = {
      ...project,
      findings: updatedFindings,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Deleted research finding', 'finding');
  };

  const getEvidenceBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'unverified_assumption':
        return { label: 'Unverified Assumption', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'initial_observation':
        return { label: 'Initial Observation', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'repeated_observation':
        return { label: 'Repeated Observation', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'supported_by_multiple':
        return { label: 'Supported by Multiple Sources', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
      {/* Top Banner / Philosophy Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-sky-900/5 to-white border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Customer Research Planner — <span className="text-blue-600 font-extrabold">{project.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rule of thumb: Discover customer problems first. Do not attempt to sell or pitch your solution during research.
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('customer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeSubTab === 'customer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Target Customer
          </button>
          <button
            onClick={() => setActiveSubTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeSubTab === 'questions' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Question Builder ({project.researchQuestions?.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab('sources')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeSubTab === 'sources' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Discussion Sources ({project.researchSources?.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab('findings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeSubTab === 'findings' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Recurring Findings ({project.findings?.length || 0})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TARGET CUSTOMER DEFINITION */}
      {activeSubTab === 'customer' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Target Customer Definition
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Clearly define who experiences this problem. Avoid generic definitions like "everyone."
              </p>
            </div>
            {customerSavedToast && (
              <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </div>
            )}
          </div>

          <form onSubmit={handleSaveCustomerProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Category / Role
                </label>
                <input
                  type="text"
                  value={customerData.category}
                  onChange={(e) => setCustomerData({ ...customerData, category: e.target.value })}
                  placeholder="e.g. High School Students, Freelance Translators"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Age Range (if relevant)
                </label>
                <input
                  type="text"
                  value={customerData.ageRange}
                  onChange={(e) => setCustomerData({ ...customerData, ageRange: e.target.value })}
                  placeholder="e.g. 13–19, 25–40 (Optional)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Location or Market
                </label>
                <input
                  type="text"
                  value={customerData.locationMarket}
                  onChange={(e) => setCustomerData({ ...customerData, locationMarket: e.target.value })}
                  placeholder="e.g. English-speaking, Urban commuters, US/EU"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Customer Description &amp; Life Situation
              </label>
              <textarea
                rows={2}
                value={customerData.description}
                onChange={(e) => setCustomerData({ ...customerData, description: e.target.value })}
                placeholder="Who are they in their daily routine? What are their daily constraints and priorities?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Interests & tags */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Customer Interests &amp; Habits
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="Type an interest and press Add or Enter (e.g. Study aesthetics, Solo travel)"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(customerData.interests || []).map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(idx)}
                      className="text-blue-400 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Problems &amp; Frustrations They Experience
                </label>
                <textarea
                  rows={2}
                  value={customerData.problemsExperienced}
                  onChange={(e) => setCustomerData({ ...customerData, problemsExperienced: e.target.value })}
                  placeholder="What specifically causes anxiety, wasted hours, or lost money?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Relevant Behaviors &amp; Past Actions
                </label>
                <textarea
                  rows={2}
                  value={customerData.relevantBehaviors}
                  onChange={(e) => setCustomerData({ ...customerData, relevantBehaviors: e.target.value })}
                  placeholder="What habits do they already have? Have they attempted to fix this before?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Where They Look for Solutions Today
                </label>
                <input
                  type="text"
                  value={customerData.whereTheyLook}
                  onChange={(e) => setCustomerData({ ...customerData, whereTheyLook: e.target.value })}
                  placeholder="e.g. App Store free charts, TikTok tutorials, Google searches"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Where They Discuss These Problems Online
                </label>
                <input
                  type="text"
                  value={customerData.whereTheyDiscuss}
                  onChange={(e) => setCustomerData({ ...customerData, whereTheyDiscuss: e.target.value })}
                  placeholder="e.g. Reddit r/study, Discord servers, Twitter hashtags"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-xs"
              >
                Save Target Customer Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: QUESTION BUILDER */}
      {activeSubTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" /> Research Question Builder
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Craft open-ended discovery questions to learn past behaviors. The Mom Test rule: never pitch or ask for future hypothetical promises.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportQuestionsToCSV(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => openAddQuestion()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>

            {/* Editable Example Questions Palette */}
            <div className="py-4 border-b border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick-Add Proven Discovery Templates</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_QUESTIONS.map((tq, i) => (
                  <button
                    key={i}
                    onClick={() => openAddQuestion(tq.question, tq.category)}
                    className="text-left px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg text-xs text-slate-700 transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 shrink-0 text-slate-400" />
                    <span>"{tq.question}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            {(!project.researchQuestions || project.researchQuestions.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No research questions created yet. Click one of the templates above or "Add Question" to begin.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 pt-2">
                {project.researchQuestions.map((q) => {
                  const isPitch = q.isPitchWarning || detectPitchQuestion(q.question);
                  return (
                    <div key={q.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {q.category.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            q.status === 'answered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : q.status === 'asked'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {q.status}
                          </span>
                          {isPitch && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="This question sounds like a sales pitch. Better to ask about actual past behavior!">
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> Sales Pitch Warning
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </p>

                        {q.notesOrAnswer && (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 mt-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Observations &amp; Responses
                            </span>
                            <p className="mt-0.5 text-slate-800">{q.notesOrAnswer}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => openEditQuestion(q)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Question & Record Responses"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteQuestionId(q.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SOURCES TRACKER */}
      {activeSubTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" /> Research Source Tracker
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Log where customers discuss this topic publicly: Reddit subreddits, public forums, app store reviews, or in-person interviews.
              </p>
            </div>
            <button
              onClick={openAddSource}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Source</span>
            </button>
          </div>

          {(!project.researchSources || project.researchSources.length === 0) ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No research sources recorded yet. Track Reddit threads, forums, or customer interviews here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.researchSources.map((src) => (
                <div key={src.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{src.sourceName}</span>
                      <span className="text-[10px] text-slate-400">{src.dateResearched}</span>
                    </div>

                    {src.sourceUrl && (
                      <a
                        href={src.sourceUrl.startsWith('http') ? src.sourceUrl : `https://${src.sourceUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{src.sourceUrl}</span>
                      </a>
                    )}

                    {src.problemDiscussed && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Problem Discussed:</span>
                        <p className="text-slate-800 mt-0.5">{src.problemDiscussed}</p>
                      </div>
                    )}

                    {src.summary && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Observations:</span>
                        <p className="text-slate-700 mt-0.5">{src.summary}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200 mt-3 flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditSource(src)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteSourceId(src.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: RECURRING FINDINGS */}
      {activeSubTab === 'findings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" /> Recurring Research Findings
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Record repeated customer problems. Distinguish between an initial single observation and patterns supported by multiple independent people.
              </p>
            </div>
            <button
              onClick={openAddFinding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Finding</span>
            </button>
          </div>

          {(!project.findings || project.findings.length === 0) ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No findings recorded yet. Once you see a pattern in conversations or threads, log it here.
            </div>
          ) : (
            <div className="space-y-3">
              {project.findings.map((f) => {
                const badge = getEvidenceBadge(f.evidenceStatus);
                return (
                  <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {f.observationCount} independent observation(s)
                        </span>
                        <span className="text-[10px] text-slate-400 ml-auto sm:ml-0">
                          {f.dateRecorded}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                      <p className="text-slate-700 leading-relaxed">{f.problemDescription}</p>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 flex flex-col sm:flex-row gap-2">
                        <div><strong>Source:</strong> {f.source || 'Direct observation'}</div>
                        {f.evidenceNotes && <div className="sm:border-l sm:border-slate-200 sm:pl-2"><strong>Notes:</strong> {f.evidenceNotes}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => openEditFinding(f)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteFindingId(f.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUESTION MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingQuestion ? 'Edit Research Question' : 'Add Research Question'}
              </h3>
              <button onClick={() => setQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. What is the most difficult part of staying organized each week?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
                {detectPitchQuestion(questionText) && (
                  <div className="mt-1.5 p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Notice: This question sounds like a sales pitch. Asking people if they "would like" or "would buy" something leads to false positive encouragement. Focus on what they currently do today.
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={questionCat}
                    onChange={(e) => setQuestionCat(e.target.value as QuestionCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="problem_discovery">Problem Discovery</option>
                    <option value="current_workflow">Current Workflow</option>
                    <option value="frustrations">Frustrations &amp; Costs</option>
                    <option value="alternatives">Alternative Solutions</option>
                    <option value="decision_making">Decision Making</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={questionStatus}
                    onChange={(e) => setQuestionStatus(e.target.value as QuestionStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="planned">Planned</option>
                    <option value="asked">Asked to Users</option>
                    <option value="answered">Answered / Corroborated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations, Quotes &amp; Responses
                </label>
                <textarea
                  rows={3}
                  value={questionNotes}
                  onChange={(e) => setQuestionNotes(e.target.value)}
                  placeholder="What did customers actually say or describe when asked this?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOURCE MODAL */}
      {sourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSource ? 'Edit Source' : 'Add Research Source'}
              </h3>
              <button onClick={() => setSourceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSource} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Reddit r/GetStudying, Customer Interview 01, App Store Reviews"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source URL / Location</label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="e.g. https://reddit.com/r/GetStudying/... or In-person library"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Discussed</label>
                <input
                  type="text"
                  value={sourceProblem}
                  onChange={(e) => setSourceProblem(e.target.value)}
                  placeholder="e.g. Disorganized syllabus deadlines across 3 portals"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observations &amp; Summary</label>
                <textarea
                  rows={3}
                  value={sourceSummary}
                  onChange={(e) => setSourceSummary(e.target.value)}
                  placeholder="Summary of what community members or interviewees expressed."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSourceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FINDING MODAL */}
      {findingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingFinding ? 'Edit Research Finding' : 'Record Research Finding'}
              </h3>
              <button onClick={() => setFindingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFinding} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Problem Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={findingTitle}
                  onChange={(e) => setFindingTitle(e.target.value)}
                  placeholder="e.g. High setup friction causes abandonment of complex tools"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows={2}
                  value={findingDesc}
                  onChange={(e) => setFindingDesc(e.target.value)}
                  placeholder="Detailed description of the customer friction observed."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Evidence Status</label>
                  <select
                    value={findingStatus}
                    onChange={(e) => setFindingStatus(e.target.value as EvidenceStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="unverified_assumption">Unverified Assumption</option>
                    <option value="initial_observation">Initial Observation</option>
                    <option value="repeated_observation">Repeated Observation</option>
                    <option value="supported_by_multiple">Supported by Multiple Sources</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observation Count</label>
                  <input
                    type="number"
                    min={1}
                    value={findingObservations}
                    onChange={(e) => setFindingObservations(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Reference</label>
                <input
                  type="text"
                  value={findingSource}
                  onChange={(e) => setFindingSource(e.target.value)}
                  placeholder="e.g. Reddit r/GetStudying + 4 student interviews"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFindingModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modals */}
      <ConfirmationModal
        isOpen={Boolean(deleteQuestionId)}
        title="Delete Question?"
        message="Are you sure you want to delete this research question?"
        isDanger={true}
        onConfirm={() => {
          if (deleteQuestionId) handleDeleteQuestion(deleteQuestionId);
          setDeleteQuestionId(null);
        }}
        onClose={() => setDeleteQuestionId(null)}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteSourceId)}
        title="Delete Source?"
        message="Are you sure you want to remove this research source?"
        isDanger={true}
        onConfirm={() => {
          if (deleteSourceId) handleDeleteSource(deleteSourceId);
          setDeleteSourceId(null);
        }}
        onClose={() => setDeleteSourceId(null)}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteFindingId)}
        title="Delete Finding?"
        message="Are you sure you want to delete this research finding record?"
        isDanger={true}
        onConfirm={() => {
          if (deleteFindingId) handleDeleteFinding(deleteFindingId);
          setDeleteFindingId(null);
        }}
        onClose={() => setDeleteFindingId(null)}
      />
    </div>
  );
};
