import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Edit3, 
  FileText, 
  Layers, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare,
  Clock,
  X
} from 'lucide-react';
import { Project, ValidationRecord, ValidationStatus } from '../../types';
import { CustomerFeedbackManager } from '../feedback/CustomerFeedbackManager';

interface ValidationTrackerProps {
  project: Project;
  onUpdateProject: (updatedProject: Project, actionLabel: string, iconType: any) => void;
}

const STATUS_BADGES: Record<ValidationStatus, { label: string; bg: string; text: string; border: string; desc: string }> = {
  not_researched: {
    label: 'Not Researched',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    desc: 'No inquiries or observations conducted yet.',
  },
  assumption: {
    label: 'Assumption',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    desc: 'Unproven belief based on personal intuition.',
  },
  research_in_progress: {
    label: 'Research in Progress',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    desc: 'Actively observing discussions or interviewing prospects.',
  },
  some_evidence: {
    label: 'Some Supporting Evidence',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    desc: 'At least 1–2 independent sources corroborate this.',
  },
  stronger_evidence: {
    label: 'Stronger Evidence',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    desc: 'Consistently validated across multiple independent data points.',
  },
  needs_further_testing: {
    label: 'Needs Further Testing',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    desc: 'Mixed feedback or conflicting evidence observed.',
  },
};

export const ValidationTracker: React.FC<ValidationTrackerProps> = ({
  project,
  onUpdateProject,
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'feedback'>('board');
  const [editingRecord, setEditingRecord] = useState<ValidationRecord | null>(null);

  // Modal editing states
  const [hypothesis, setHypothesis] = useState('');
  const [evidence, setEvidence] = useState('');
  const [unknowns, setUnknowns] = useState('');
  const [status, setStatus] = useState<ValidationStatus>('not_researched');

  const openEditModal = (rec: ValidationRecord) => {
    setEditingRecord(rec);
    setHypothesis(rec.hypothesis || '');
    setEvidence(rec.evidence || '');
    setUnknowns(rec.unknowns || '');
    setStatus(rec.status);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const updatedRecords = (project.validationRecords || []).map((r) =>
      r.categoryId === editingRecord.categoryId
        ? {
            ...r,
            hypothesis: hypothesis.trim(),
            evidence: evidence.trim(),
            unknowns: unknowns.trim(),
            status,
            updatedAt: new Date().toISOString(),
          }
        : r
    );

    const updated: Project = {
      ...project,
      validationRecords: updatedRecords,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updated, `Updated validation status for ${editingRecord.title}`, 'validation');
    setEditingRecord(null);
  };

  // Metrics summary
  const records = project.validationRecords || [];
  const assumptionCount = records.filter((r) => r.status === 'assumption' || r.status === 'not_researched').length;
  const inProgressCount = records.filter((r) => r.status === 'research_in_progress' || r.status === 'needs_further_testing').length;
  const evidenceCount = records.filter((r) => r.status === 'some_evidence' || r.status === 'stronger_evidence').length;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <span>Validation Tracker &amp; Evidence Board</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Distinguish unverified founder assumptions from actual customer evidence across 7 core dimensions.
          </p>
        </div>

        {/* Tab switch: Board vs Feedback */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'board' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Validation Board (7)
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'feedback' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Feedback ({project.feedbackList?.length || 0})</span>
          </button>
        </div>
      </div>

      {activeTab === 'board' ? (
        <>
          {/* Status breakdown alert */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Assumptions / Unresearched
                </span>
                <span className="text-xl font-black text-amber-900">{assumptionCount} areas</span>
              </div>
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  In Active Investigation
                </span>
                <span className="text-xl font-black text-blue-900">{inProgressCount} areas</span>
              </div>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Supported by Evidence
                </span>
                <span className="text-xl font-black text-emerald-900">{evidenceCount} areas</span>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          {/* Validation Board Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {records.map((rec) => {
              const badge = STATUS_BADGES[rec.status] || STATUS_BADGES.not_researched;

              return (
                <div
                  key={rec.categoryId}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                      <button
                        onClick={() => openEditModal(rec)}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition shrink-0"
                        title="Update Validation Status & Evidence"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* What You Believe (Hypothesis) */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 block mb-0.5">
                        What You Believe (Hypothesis):
                      </span>
                      <p className="text-slate-800 leading-snug">
                        {rec.hypothesis || 'No hypothesis defined yet.'}
                      </p>
                    </div>

                    {/* Collected Evidence */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 block mb-0.5">
                        Collected Evidence:
                      </span>
                      <p className="text-emerald-950 leading-snug">
                        {rec.evidence || 'No direct evidence attached yet.'}
                      </p>
                    </div>

                    {/* What Remains Unknown */}
                    {rec.unknowns && (
                      <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 block mb-0.5">
                          What Remains Unknown:
                        </span>
                        <p className="text-amber-950 leading-snug">{rec.unknowns}</p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="italic">{badge.desc}</span>
                    <button
                      onClick={() => openEditModal(rec)}
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Dedicated Customer Feedback Manager tab */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
          <CustomerFeedbackManager project={project} onUpdateProject={onUpdateProject} />
        </div>
      )}

      {/* EDIT VALIDATION MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Validation — {editingRecord.title}
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Record what you believe vs what customer interviews have proven.
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Current Validation Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ValidationStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="not_researched">Not Researched</option>
                  <option value="assumption">Assumption (Intuition only)</option>
                  <option value="research_in_progress">Research in Progress</option>
                  <option value="some_evidence">Some Supporting Evidence (1–2 sources)</option>
                  <option value="stronger_evidence">Stronger Evidence (Multiple independent sources)</option>
                  <option value="needs_further_testing">Needs Further Testing (Mixed signals)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  What You Believe (Hypothesis)
                </label>
                <textarea
                  rows={2}
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="State your hypothesis in clear testable terms."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1">
                  Collected Evidence &amp; Observations
                </label>
                <textarea
                  rows={3}
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="What customer statements, survey numbers, or forum observations support this?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-800 mb-1">
                  What Remains Unknown or Unproven?
                </label>
                <textarea
                  rows={2}
                  value={unknowns}
                  onChange={(e) => setUnknowns(e.target.value)}
                  placeholder="What questions or price points are still untested?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Validation Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
