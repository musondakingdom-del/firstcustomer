import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Download, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  DollarSign, 
  ThumbsUp, 
  ThumbsDown,
  X,
  Target
} from 'lucide-react';
import { Project, Competitor } from '../../types';
import { exportCompetitorsToCSV } from '../../utils/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';

interface CompetitorAnalysisProps {
  project: Project;
  onUpdateProject: (updatedProject: Project, actionLabel: string, iconType: any) => void;
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  project,
  onUpdateProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [deleteCompetitorId, setDeleteCompetitorId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [pricingInfo, setPricingInfo] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [customerComplaints, setCustomerComplaints] = useState('');
  const [researchSource, setResearchSource] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');

  // Missing solutions notes state
  const [missingNotes, setMissingNotes] = useState(project.missingSolutionsNotes || '');
  const [missingNotesSavedToast, setMissingNotesSavedToast] = useState(false);

  const openAddModal = () => {
    setEditingCompetitor(null);
    setName('');
    setWebsiteUrl('');
    setDescription('');
    setTargetAudience('');
    setPricingInfo('');
    setFeaturesInput('');
    setStrengths('');
    setWeaknesses('');
    setCustomerComplaints('');
    setResearchSource('');
    setPersonalNotes('');
    setModalOpen(true);
  };

  const openEditModal = (c: Competitor) => {
    setEditingCompetitor(c);
    setName(c.name);
    setWebsiteUrl(c.websiteUrl);
    setDescription(c.description);
    setTargetAudience(c.targetAudience);
    setPricingInfo(c.pricingInfo);
    setFeaturesInput((c.mainFeatures || []).join(', '));
    setStrengths(c.strengths);
    setWeaknesses(c.weaknesses);
    setCustomerComplaints(c.customerComplaints);
    setResearchSource(c.researchSource);
    setPersonalNotes(c.personalNotes);
    setModalOpen(true);
  };

  const handleSaveCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const featureList = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter((f) => Boolean(f));

    let updatedCompetitors: Competitor[] = [];

    if (editingCompetitor) {
      updatedCompetitors = (project.competitors || []).map((c) =>
        c.id === editingCompetitor.id
          ? {
              ...c,
              name: name.trim(),
              websiteUrl: websiteUrl.trim(),
              description: description.trim(),
              targetAudience: targetAudience.trim(),
              pricingInfo: pricingInfo.trim(),
              mainFeatures: featureList,
              strengths: strengths.trim(),
              weaknesses: weaknesses.trim(),
              customerComplaints: customerComplaints.trim(),
              researchSource: researchSource.trim(),
              personalNotes: personalNotes.trim(),
            }
          : c
      );
    } else {
      const newC: Competitor = {
        id: `comp-${Date.now()}`,
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        description: description.trim(),
        targetAudience: targetAudience.trim(),
        pricingInfo: pricingInfo.trim(),
        mainFeatures: featureList,
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim(),
        customerComplaints: customerComplaints.trim(),
        researchSource: researchSource.trim(),
        personalNotes: personalNotes.trim(),
      };
      updatedCompetitors = [...(project.competitors || []), newC];
    }

    const updated: Project = {
      ...project,
      competitors: updatedCompetitors,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(
      updated,
      editingCompetitor ? `Updated competitor ${name}` : `Added competitor ${name}`,
      'competitor'
    );
    setModalOpen(false);
  };

  const handleDeleteCompetitor = (id: string) => {
    const updatedCompetitors = (project.competitors || []).filter((c) => c.id !== id);
    const updated: Project = {
      ...project,
      competitors: updatedCompetitors,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Deleted competitor record', 'competitor');
  };

  const handleSaveMissingNotes = () => {
    const updated: Project = {
      ...project,
      missingSolutionsNotes: missingNotes.trim(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateProject(updated, 'Updated market gap notes ("What Existing Solutions Are Missing?")', 'competitor');
    setMissingNotesSavedToast(true);
    setTimeout(() => setMissingNotesSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-blue-600" />
            <span>Competitor &amp; Alternative Analysis</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze existing alternatives customers currently use. Discover their strengths, weaknesses, and complaints.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCompetitorsToCSV(project)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-md shadow-blue-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Competitor</span>
          </button>
        </div>
      </div>

      {/* Competitor Cards or Empty State */}
      {(!project.competitors || project.competitors.length === 0) ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Competitors Documented</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Every business problem already has alternatives—whether it’s specialized software, Excel spreadsheets, paper notes, or doing nothing.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Add First Competitor
          </button>
        </div>
      ) : (
        <>
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {project.competitors.map((comp) => (
              <div key={comp.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                      {comp.websiteUrl && (
                        <a
                          href={comp.websiteUrl.startsWith('http') ? comp.websiteUrl : `https://${comp.websiteUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Visit Website</span>
                        </a>
                      )}
                    </div>
                    {comp.pricingInfo && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {comp.pricingInfo}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {comp.description || 'No description provided.'}
                  </p>

                  {/* Target Audience */}
                  {comp.targetAudience && (
                    <div className="text-xs text-slate-700">
                      <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block">Target:</span>
                      <span>{comp.targetAudience}</span>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                      <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-emerald-700 mb-1">
                        <ThumbsUp className="w-3 h-3" /> Strengths
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-3">
                        {comp.strengths || 'Not documented'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100 text-red-900">
                      <div className="flex items-center gap-1 font-bold text-[10px] uppercase text-red-700 mb-1">
                        <ThumbsDown className="w-3 h-3" /> Weaknesses
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-3">
                        {comp.weaknesses || 'Not documented'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Complaints Callout */}
                  {comp.customerComplaints && (
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 block">
                        Customer Complaints &amp; Frustrations:
                      </span>
                      <p className="text-[11px] mt-0.5 line-clamp-2">{comp.customerComplaints}</p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    Source: {comp.researchSource || 'Manual input'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(comp)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded"
                      title="Edit Competitor"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCompetitorId(comp.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      title="Delete Competitor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Side-by-Side Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Competitor Comparison Matrix</h3>
                <p className="text-xs text-slate-500">Side-by-side comparison of market alternatives</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Competitor</th>
                    <th className="p-3.5">Target Audience</th>
                    <th className="p-3.5">Pricing</th>
                    <th className="p-3.5">Main Strengths</th>
                    <th className="p-3.5">Weaknesses</th>
                    <th className="p-3.5">Customer Complaints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.competitors.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="p-3.5 text-slate-600 min-w-[140px]">{c.targetAudience || '—'}</td>
                      <td className="p-3.5 text-slate-700 font-semibold whitespace-nowrap">{c.pricingInfo || '—'}</td>
                      <td className="p-3.5 text-emerald-800 min-w-[160px]">{c.strengths || '—'}</td>
                      <td className="p-3.5 text-red-800 min-w-[160px]">{c.weaknesses || '—'}</td>
                      <td className="p-3.5 text-amber-900 min-w-[180px]">{c.customerComplaints || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SECTION: WHAT EXISTING SOLUTIONS ARE MISSING? */}
      <div className="bg-gradient-to-r from-blue-900/10 via-white to-sky-900/5 rounded-2xl border border-blue-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">What Existing Solutions Are Missing?</h3>
          </div>
          {missingNotesSavedToast && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600">
          This is where your potential market opportunity lives. What specific frustration or friction is ignored by all the competitors listed above?
        </p>
        <textarea
          rows={3}
          value={missingNotes}
          onChange={(e) => setMissingNotes(e.target.value)}
          placeholder="e.g. Existing tools require 30 minutes of setup daily or are too generic. None cater to fast mobile-first student daily focus check-ins..."
          className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveMissingNotes}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
          >
            Save Opportunity Notes
          </button>
        </div>
      </div>

      {/* ADD / EDIT COMPETITOR MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingCompetitor ? 'Edit Competitor' : 'Add Competitor or Existing Alternative'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompetitor} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Competitor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Notion, Todoist, Google Sheets"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="e.g. https://notion.so"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does their product or service do?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Knowledge workers, tech teams"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pricing Information</label>
                  <input
                    type="text"
                    value={pricingInfo}
                    onChange={(e) => setPricingInfo(e.target.value)}
                    placeholder="e.g. Free tier, $8/user/mo"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Main Features (comma separated)</label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="e.g. Calendar sync, Time tracking, Mobile widgets"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-800 mb-1">Strengths</label>
                  <textarea
                    rows={2}
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="What do they do really well?"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-800 mb-1">Weaknesses</label>
                  <textarea
                    rows={2}
                    value={weaknesses}
                    onChange={(e) => setWeaknesses(e.target.value)}
                    placeholder="Where do they fall short?"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-amber-800 mb-1">
                  Customer Complaints &amp; Frustrations (App Store / Reddit / Reviews)
                </label>
                <textarea
                  rows={2}
                  value={customerComplaints}
                  onChange={(e) => setCustomerComplaints(e.target.value)}
                  placeholder="What do their actual customers complain about most often?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Research Source</label>
                  <input
                    type="text"
                    value={researchSource}
                    onChange={(e) => setResearchSource(e.target.value)}
                    placeholder="e.g. G2 reviews, Trustpilot, Reddit"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Personal Notes</label>
                  <input
                    type="text"
                    value={personalNotes}
                    onChange={(e) => setPersonalNotes(e.target.value)}
                    placeholder="Key takeaway for our own project"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
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
                  Save Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(deleteCompetitorId)}
        title="Delete Competitor?"
        message="Are you sure you want to remove this competitor record?"
        isDanger={true}
        onConfirm={() => {
          if (deleteCompetitorId) handleDeleteCompetitor(deleteCompetitorId);
          setDeleteCompetitorId(null);
        }}
        onClose={() => setDeleteCompetitorId(null)}
      />
    </div>
  );
};
