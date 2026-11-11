import React from 'react';
import { X, Mail, Instagram, Users, Sparkles, Shield, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FounderRecruitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderRecruitmentModal: React.FC<FounderRecruitmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#111C2D] to-[#0D1522] border border-blue-500/30 rounded-2xl shadow-2xl text-white overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600"></div>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
                <Sparkles className="w-3 h-3" /> Collaboration Initiative
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Let’s Build Something Together.
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close recruitment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-300 text-sm leading-relaxed">
          <p className="text-base text-slate-200 font-medium">
            We’re looking to connect with motivated people interested in building online businesses from the ground up. We value complementary skills, consistent effort, honest communication and a willingness to learn.
          </p>

          {/* Quick Highlight Cards (Matching mockup visual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#162338]/80 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-400" /> Who we're looking for:
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Passionate young builders (13–19)</strong> &amp; first-time creators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Useful skills:</strong> Product design, dev, writing, SEO, marketing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>International &amp; remote</strong> friendly collaboration</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#162338]/80 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-sky-400" /> What’s in it for you?
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Collaborate on real projects</strong> from scratch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Build something amazing</strong> without vanity metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Grow your skills together</strong> through shared practical work</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Qualities We Value */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Collaboration Qualities We Value
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Willing to start from zero and learn</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Can contribute practical, useful skills</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Communicate honestly and consistently</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Realistic about business hurdles &amp; patience</span>
              </div>
            </div>
          </div>

          {/* Initial Focus */}
          <div className="space-y-2 text-xs text-slate-300">
            <h4 className="font-bold text-slate-200">Initial Collaboration Direction</h4>
            <p>
              Digital products, online business development, customer research, product validation, and potential future software projects. We believe in researching first and building with real customer evidence.
            </p>
          </div>

          {/* Contact Direct Actions */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-xl p-5">
            <h4 className="font-bold text-white text-sm mb-1">Direct Contact Channels</h4>
            <p className="text-xs text-slate-300 mb-4">
              Initial communication is text-first. Feel free to introduce yourself, what you’re learning, or what you like building.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:businessworkflowsupport@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
                <span className="text-[11px] text-blue-200 font-normal hidden sm:inline">(businessworkflowsupport@gmail.com)</span>
              </a>
              <a
                href="https://www.instagram.com/Clientready88/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs transition shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>DM on Instagram</span>
                <span className="text-[11px] text-pink-200 font-normal hidden sm:inline">(@Clientready88)</span>
              </a>
            </div>
          </div>

          {/* Safety & Transparency Notice */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-xs">
              <Shield className="w-3.5 h-3.5" /> Safety &amp; Transparency Notice
            </div>
            <p>
              We do not maintain a public database of applicants. Never submit passwords, financial account details, identity documents, or home addresses. Anyone under 18 should involve a trusted parent or adult before entering formal contracts or financial arrangements.
            </p>
            <p className="text-slate-400">
              Disclaimer: We do not promise guaranteed earnings, employment, equity or business success, nor does this imply that a formal commercial partnership already exists.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
