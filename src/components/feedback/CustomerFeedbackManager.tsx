import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  CheckCircle2, 
  Tag, 
  Calendar,
  X,
  Filter
} from 'lucide-react';
import { Project, CustomerFeedback, FeedbackSentiment, FeedbackTag } from '../../types';
import { exportFeedbackToCSV } from '../../utils/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface CustomerFeedbackManagerProps {
  project: Project;
  onUpdateProject: (updatedProject: Project, actionLabel: string, iconType: any) => void;
}

const TAG_CONFIG: Record<FeedbackTag, { label: string; bg: string; text: string; border: string }> = {
  positive_interest: { label: 'Positive Interest', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  negative_feedback: { label: 'Negative / Skeptical', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  feature_request: { label: 'Feature Request', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  existing_alternative: { label: 'Existing Alternative', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  problem_confirmation: { label: 'Problem Confirmed', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  unclear_feedback: { label: 'Unclear / Needs Follow-up', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export const CustomerFeedbackManager: React.FC<CustomerFeedbackManagerProps> = ({
  project,
  onUpdateProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<CustomerFeedback | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [dateReceived, setDateReceived] = useState(new Date().toISOString().split('T')[0]);
  const [sourceType, setSourceType] = useState('Direct Interview');
  const [customerCategory, setCustomerCategory] = useState('');
  const [quoteOrObservation, setQuoteOrObservation] = useState('');
  const [problemIdentified, setProblemIdentified] = useState('');
  const [suggestedImprovement, setSuggestedImprovement] = useState('');
  const [sentiment, setSentiment] = useState<FeedbackSentiment>('supports');
  const [categoryTag, setCategoryTag] = useState<FeedbackTag>('problem_confirmation');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingFeedback(null);
    setTitle('');
    setDateReceived(new Date().toISOString().split('T')[0]);
    setSourceType('Direct Interview');
    setCustomerCategory('');
    setQuoteOrObservation('');
    setProblemIdentified('');
    setSuggestedImprovement('');
    setSentiment('supports');
    setCategoryTag('problem_confirmation');
    setNotes('');
    setModalOpen(true);
  };

  const openEditModal = (fb: CustomerFeedback) => {
    setEditingFeedback(fb);
    setTitle(fb.title);
    setDateReceived(fb.dateReceived);
    setSourceType(fb.sourceType);
    setCustomerCategory(fb.customerCategory);
    setQuoteOrObservation(fb.quoteOrObservation);
    setProblemIdentified(fb.problemIdentified);
    setSuggestedImprovement(fb.suggestedImprovement);
    setSentiment(fb.sentiment);
    setCategoryTag(fb.categoryTag);
    setNotes(fb.notes);
    setModalOpen(true);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !quoteOrObservation.trim()) return;

    let updatedList: CustomerFeedback[] = [];

    if (editingFeedback) {
      updatedList = (project.feedbackList || []).map((f) =>
        f.id === editingFeedback.id
          ? {
              ...f,
              title: title.trim(),
              dateReceived,
              sourceType: sourceType.trim(),
              customerCategory: customerCategory.trim(),
              quoteOrObservation: quoteOrObservation.trim(),
              problemIdentified: problemIdentified.trim(),
              suggestedImprovement: suggestedImprovement.trim(),
              sentiment,
              categoryTag,
              notes: notes.trim(),
            }
          : f
      );
    } else {
      const newFb: CustomerFeedback = {
        id: `fb-${Date.now()}`,
        title: title.trim(),
        dateReceived,
        sourceType: sourceType.trim(),
        customerCategory: customerCategory.trim(),
        quoteOrObservation: quoteOrObservation.trim(),
        problemIdentified: problemIdentified.trim(),
        suggestedImprovement: suggestedImprovement.trim(),
        sentiment,
        categoryTag,
        notes: notes.trim(),
      };
      updatedList = [...(project.feedbackList || []), newFb];
    }

    const updated: Project = {
      ...project,
      feedbackList: updatedList,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(
      updated,
      editingFeedback ? 'Updated customer feedback record' : 'Logged customer feedback observation',
      'feedback'
    );
    setModalOpen(false);
  };

  const handleDeleteFeedback = (id: string) => {
    const updatedList = (project.feedbackList || []).filter((f) => f.id !== id);
    const updated: Project = {
      ...project,
      feedbackList: updatedList,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Deleted customer feedback entry', 'feedback');
  };

  const filteredList = (project.feedbackList || []).filter((f) => {
    if (filterSentiment === 'all') return true;
    return f.sentiment === filterSentiment;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Customer Feedback Log
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record unfiltered customer quotes, survey reactions, and community feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sentiment Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterSentiment('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${filterSentiment === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              All ({project.feedbackList?.length || 0})
            </button>
            <button
              onClick={() => setFilterSentiment('supports')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${filterSentiment === 'supports' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'}`}
            >
              <ThumbsUp className="w-3 h-3 text-emerald-600" /> Supports
            </button>
            <button
              onClick={() => setFilterSentiment('challenges')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${filterSentiment === 'challenges' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-600'}`}
            >
              <ThumbsDown className="w-3 h-3 text-red-600" /> Challenges
            </button>
          </div>

          <button
            onClick={() => exportFeedbackToCSV(project)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Feedback</span>
          </button>
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          No feedback entries match this filter. Log what customers actually said during interviews or in community threads.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const tagInfo = TAG_CONFIG[item.categoryTag] || TAG_CONFIG.problem_confirmation;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${tagInfo.bg} ${tagInfo.text} ${tagInfo.border}`}>
                      {tagInfo.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                      {item.sentiment === 'supports' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Supports Idea
                        </span>
                      ) : item.sentiment === 'challenges' ? (
                        <span className="text-red-700 flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3" /> Challenges Idea
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Minus className="w-3 h-3" /> Neutral
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>

                  {/* Customer quote box */}
                  <blockquote className="p-2.5 rounded-lg bg-slate-50 border-l-3 border-blue-500 text-slate-800 text-[11px] italic">
                    {item.quoteOrObservation}
                  </blockquote>

                  {item.problemIdentified && (
                    <div>
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">Problem Identified:</span>
                      <p className="text-slate-700 text-[11px]">{item.problemIdentified}</p>
                    </div>
                  )}

                  {item.suggestedImprovement && (
                    <div>
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">Suggested Improvement / Need:</span>
                      <p className="text-slate-700 text-[11px]">{item.suggestedImprovement}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">
                    {item.sourceType} • {item.customerCategory || 'Uncategorized'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingFeedback ? 'Edit Feedback Entry' : 'Log Customer Feedback'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Feedback Summary / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Student reaction to paper vs mobile planner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Type</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Direct Interview">Direct Interview</option>
                    <option value="Reddit Discussion">Reddit Discussion</option>
                    <option value="App Store Review">App Store Review</option>
                    <option value="Discord Server">Discord Server</option>
                    <option value="Survey Response">Survey Response</option>
                    <option value="Email Feedback">Email Feedback</option>
                    <option value="Other Public Discussion">Other Public Source</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">General Customer Category</label>
                  <input
                    type="text"
                    value={customerCategory}
                    onChange={(e) => setCustomerCategory(e.target.value)}
                    placeholder="e.g. High School Senior, College Freshman"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  What Did They Say or What Was Observed? (Quote) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={quoteOrObservation}
                  onChange={(e) => setQuoteOrObservation(e.target.value)}
                  placeholder="Keep it authentic: verbatim words or exact behavioral observation."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sentiment vs Idea</label>
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value as FeedbackSentiment)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="supports">Supports Idea (Validating)</option>
                    <option value="challenges">Challenges Idea (Contradicts)</option>
                    <option value="neutral">Neutral / Observation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Tag</label>
                  <select
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value as FeedbackTag)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="problem_confirmation">Problem Confirmation</option>
                    <option value="positive_interest">Positive Interest</option>
                    <option value="negative_feedback">Negative Feedback</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="existing_alternative">Existing Alternative</option>
                    <option value="unclear_feedback">Unclear Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Problem Identified</label>
                <input
                  type="text"
                  value={problemIdentified}
                  onChange={(e) => setProblemIdentified(e.target.value)}
                  placeholder="e.g. Paper planners get lost and have high friction"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Suggested Improvement / Need</label>
                <input
                  type="text"
                  value={suggestedImprovement}
                  onChange={(e) => setSuggestedImprovement(e.target.value)}
                  placeholder="e.g. Evening push notification with strictly top 3 items"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Feedback Record?"
        message="Are you sure you want to remove this customer feedback entry?"
        isDanger={true}
        onConfirm={() => {
          if (deleteTargetId) handleDeleteFeedback(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
