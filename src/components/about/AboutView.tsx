import React from 'react';
import { 
  Info, 
  Target, 
  ShieldCheck, 
  HeartHandshake, 
  Github, 
  Mail, 
  Instagram, 
  ExternalLink, 
  CheckCircle2, 
  Lightbulb, 
  Compass, 
  Users, 
  Code2, 
  HardDrive 
} from 'lucide-react';

interface AboutViewProps {
  onOpenRecruitmentModal: () => void;
  onOpenSettings: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onOpenRecruitmentModal,
  onOpenSettings,
}) => {
  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-2 text-slate-800 text-xs sm:text-sm">
      {/* Hero Header */}
      <div className="text-center space-y-3 py-6 border-b border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
          <Compass className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          About FirstCustomer
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
          A free, open-source customer research and business validation workbench.
        </p>
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
          "Research first. Build second."
        </div>
      </div>

      {/* Core Mission Quote Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-[#111C2D] text-white shadow-xl space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
          The Guiding Principle
        </span>
        <blockquote className="text-base sm:text-lg font-bold leading-relaxed">
          "FirstCustomer helps you investigate whether a problem is worth solving before spending resources building a solution."
        </blockquote>
        <p className="text-xs text-slate-300 leading-relaxed">
          Too many beginners build entire apps, websites, or digital products based solely on personal intuition—only to launch to complete silence. FirstCustomer provides a structured framework to discover customer pain, study existing alternatives, and document real corroborating evidence.
        </p>
      </div>

      {/* Why Customer Research Matters vs Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Assumptions vs. Evidence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            An assumption is what an entrepreneur <em>wants</em> to believe: that people will pay, that current apps are hated, that their idea is revolutionary. Evidence is what customers actually do: past behaviors, complaints in Reddit threads, and money already spent on imperfect workarounds.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Who We Built This For</h3>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li><strong>Beginner &amp; Young Entrepreneurs:</strong> High school or college students launching their first project.</li>
            <li><strong>Solo Founders &amp; Indie Hackers:</strong> Exploring SaaS or software without wasting engineering cycles.</li>
            <li><strong>Digital Product Creators:</strong> Validating courses, templates, and ebooks.</li>
            <li><strong>Freelancers:</strong> Productizing services into recurring revenue models.</li>
          </ul>
        </div>
      </div>

      {/* Free & Open-Source Commitment */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Free, Private &amp; Open-Source</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          FirstCustomer does not require payment, subscriptions, credit cards, or tracking cookies. All data is saved directly in your browser’s <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">localStorage</code>. No remote server reads your business ideas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href="https://github.com/firstcustomer/firstcustomer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Github className="w-4 h-4 text-slate-800" />
              <div>
                <span className="font-bold text-slate-900 text-xs block">GitHub Repository</span>
                <span className="text-[10px] text-slate-500">MIT Licensed &amp; Open Source</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 text-xs block">Data &amp; Backups</span>
                <span className="text-[10px] text-slate-500">Export JSON or manage storage</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-600">Settings</span>
          </button>
        </div>
      </div>

      {/* Founder Collaboration Card Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#111C2D] to-[#1E293B] border border-blue-500/30 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Founder Collaboration</h3>
              <p className="text-xs text-slate-300">Building something of your own?</p>
            </div>
          </div>
          <button
            onClick={onOpenRecruitmentModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/30"
          >
            See Who We’re Looking For
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          We’re actively connecting with motivated young creators and first-time founders (especially ages 13–19) interested in learning practical business building, product design, development, and customer validation.
        </p>

        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-4 text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Contact:</span>
            <a href="mailto:businessworkflowsupport@gmail.com" className="text-blue-400 hover:underline">
              businessworkflowsupport@gmail.com
            </a>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Instagram:</span>
            <a href="https://www.instagram.com/Clientready88/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
              @Clientready88
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
