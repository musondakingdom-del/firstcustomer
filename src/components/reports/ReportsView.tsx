import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Scale, 
  MessageSquare, 
  TrendingUp, 
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { Project } from '../../types';
import { calculateProjectProgress, evaluateReportConclusion } from '../../utils/analytics';
import { exportDataAsJSON, exportCompetitorsToCSV, exportFeedbackToCSV, exportQuestionsToCSV } from '../../utils/storage';

interface ReportsViewProps {
  project?: Project;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ project }) => {
  // If no project exists at all
  if (!project) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Research Data Needed First</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
          Reports summarize empirical customer research and evidence. To generate a report, first create a business idea in the workspace and begin collecting customer feedback and competitor observations.
        </p>
      </div>
    );
  }

  const progress = calculateProjectProgress(project);
  const conclusion = evaluateReportConclusion(project);

  const hasAnyResearch = Boolean(
    (project.researchQuestions?.length || 0) > 0 ||
    (project.researchSources?.length || 0) > 0 ||
    (project.competitors?.length || 0) > 0 ||
    (project.findings?.length || 0) > 0 ||
    (project.feedbackList?.length || 0) > 0
  );

  // Filter unverified vs supported records
  const unverifiedRecords = (project.validationRecords || []).filter(
    (r) => r.status === 'assumption' || r.status === 'not_researched'
  );
  const supportedRecords = (project.validationRecords || []).filter(
    (r) => r.status === 'some_evidence' || r.status === 'stronger_evidence'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-4 sm:px-6 pt-2">
      {/* Header with Export / Print actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Research &amp; Readiness Report</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated synthesis of your customer discovery, competitor data, and validation progress.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => exportDataAsJSON([project], true, project)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Project JSON</span>
          </button>
        </div>
      </div>

      {/* Notice when user hasn't collected research data yet */}
      {!hasAnyResearch && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Collect Research Data First:</strong> You have created this business project, but have not yet logged any customer discovery questions, competitors, or user feedback. Reports reflect evidence you enter—start by interviewing potential users or tracking competitor weaknesses.
          </div>
        </div>
      )}

      {/* Printable Report Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 text-slate-800">
        {/* Report Top Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              FirstCustomer Validation Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Category: <strong className="text-slate-700 capitalize">{project.businessType.replace('_', ' ')}</strong> • Stage: <strong className="text-slate-700 capitalize">{project.stage.replace('_', ' ')}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400">
            <div>Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>Storage Engine: Local Browser Client</div>
          </div>
        </div>

        {/* Executive Rule-Based Readiness Conclusion */}
        <div className={`p-5 rounded-xl border ${conclusion.badgeBg} space-y-2 print-break-inside-avoid`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Readiness Conclusion
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${conclusion.badgeColor} bg-white/70 border border-current`}>
              {conclusion.title}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-800 leading-relaxed">
            {conclusion.summary}
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-700 block mb-1">Recommended Next Steps:</span>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {conclusion.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transparency Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 print-break-inside-avoid">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Disclaimer:</strong> This report reflects data you have entered. It is not an official market research certification, and no research tool can guarantee commercial success. Business viability requires ongoing real-world testing.
          </p>
        </div>

        {/* 1. Business Idea Overview */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            1. Business Idea Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-500 block mb-1">Concept Description:</span>
              <p className="text-slate-800">{project.description || 'Not provided yet.'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-500 block mb-1">Proposed Solution:</span>
              <p className="text-slate-800">{project.proposedSolution || 'Not provided yet.'}</p>
            </div>
          </div>
        </section>

        {/* 2. Target Customer Definition */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            2. Target Customer Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-500 block">Category &amp; Age:</span>
              <span className="text-slate-800 font-semibold">{project.targetCustomer?.category || 'Not specified'}</span>
              {project.targetCustomer?.ageRange && <span className="text-slate-500"> ({project.targetCustomer.ageRange})</span>}
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-500 block">Target Market:</span>
              <span className="text-slate-800">{project.targetCustomer?.locationMarket || 'Not set'}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-500 block">Where They Discuss:</span>
              <span className="text-slate-800">{project.targetCustomer?.whereTheyDiscuss || 'Not specified'}</span>
            </div>
          </div>
        </section>

        {/* 3. Problem Being Investigated */}
        <section className="space-y-2 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            3. Core Problem Statement
          </h2>
          <div className="p-3.5 rounded-lg bg-slate-50 text-xs text-slate-800 leading-relaxed">
            {project.problemStatement || 'Problem statement has not been articulated yet.'}
          </div>
        </section>

        {/* 4 & 5. Research Completed & Sources */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            4. Research Completed &amp; Discussion Sources
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div className="p-3 rounded-lg bg-slate-50 text-center">
              <div className="text-lg font-black text-slate-900">{project.researchQuestions?.length || 0}</div>
              <div className="text-[10px] text-slate-500">Questions Created</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-center">
              <div className="text-lg font-black text-blue-600">{project.researchSources?.length || 0}</div>
              <div className="text-[10px] text-slate-500">Sources Tracked</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-center">
              <div className="text-lg font-black text-indigo-600">{project.findings?.length || 0}</div>
              <div className="text-[10px] text-slate-500">Recurring Findings</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-center">
              <div className="text-lg font-black text-emerald-600">{project.feedbackList?.length || 0}</div>
              <div className="text-[10px] text-slate-500">Feedback Logs</div>
            </div>
          </div>

          {project.researchSources && project.researchSources.length > 0 && (
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 text-[11px] block">Public Forums &amp; Sources Reviewed:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {project.researchSources.map((s) => (
                  <li key={s.id}>
                    <strong className="text-slate-800">{s.sourceName}:</strong> {s.problemDiscussed || s.summary} ({s.dateResearched})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 6. Recurring Problems Identified */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            5. Recurring Problems Identified
          </h2>
          {(!project.findings || project.findings.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No recurring problem findings logged yet.</p>
          ) : (
            <div className="space-y-2">
              {project.findings.map((f) => (
                <div key={f.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{f.title}</h4>
                    <p className="text-slate-600 mt-0.5">{f.problemDescription}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 self-start">
                    {f.observationCount} obs
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. Competitor Comparison Summary */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            6. Competitors &amp; Alternative Solutions
          </h2>
          {(!project.competitors || project.competitors.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No competitors evaluated yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {project.competitors.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-[11px] font-semibold text-slate-600">{c.pricingInfo}</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    <strong>Strengths:</strong> {c.strengths || 'N/A'}
                  </div>
                  <div className="text-[11px] text-red-800">
                    <strong>Weaknesses / Complaints:</strong> {c.weaknesses || c.customerComplaints || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.missingSolutionsNotes && (
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
              <span className="font-bold block mb-0.5">Identified Gap ("What Existing Solutions Are Missing"):</span>
              <p>{project.missingSolutionsNotes}</p>
            </div>
          )}
        </section>

        {/* 8. Customer Feedback Summary */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b pb-1 border-slate-100">
            7. Customer Feedback Summary
          </h2>
          {(!project.feedbackList || project.feedbackList.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No customer feedback logs recorded yet.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {project.feedbackList.map((fb) => (
                <div key={fb.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900">{fb.title}</span>
                    <blockquote className="italic text-slate-600 mt-0.5">"{fb.quoteOrObservation}"</blockquote>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${
                    fb.sentiment === 'supports' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {fb.sentiment === 'supports' ? 'Supports' : 'Challenges'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 9 & 10. Assumptions Still Unverified vs Supporting Evidence */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-break-inside-avoid">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Assumptions Still Unverified ({unverifiedRecords.length})</span>
            </h3>
            {unverifiedRecords.length === 0 ? (
              <p className="text-xs text-emerald-800">All 7 areas have begun gathering observations.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-amber-950">
                {unverifiedRecords.map((r) => (
                  <li key={r.categoryId}>
                    <strong>{r.title}:</strong> {r.hypothesis || 'Unspecified'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Supported by Evidence ({supportedRecords.length})</span>
            </h3>
            {supportedRecords.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No areas corroborated by multi-source evidence yet.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-emerald-950">
                {supportedRecords.map((r) => (
                  <li key={r.categoryId}>
                    <strong>{r.title}:</strong> {r.evidence}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Footer Signature Block */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <span>FirstCustomer — Free &amp; Open Source Business Validation Platform</span>
          <span>Core Philosophy: Research first. Build second.</span>
        </div>
      </div>
    </div>
  );
};
