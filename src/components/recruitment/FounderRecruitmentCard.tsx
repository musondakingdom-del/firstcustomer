import React from 'react';
import { Users, X, ArrowRight, HeartHandshake } from 'lucide-react';

interface FounderRecruitmentCardProps {
  onOpenModal: () => void;
  isDismissed: boolean;
  onDismiss: () => void;
  variant?: 'sidebar' | 'mobile-banner';
}

export const FounderRecruitmentCard: React.FC<FounderRecruitmentCardProps> = ({
  onOpenModal,
  isDismissed,
  onDismiss,
  variant = 'sidebar',
}) => {
  if (isDismissed) return null;

  if (variant === 'mobile-banner') {
    return (
      <div className="mx-4 my-3 p-3.5 rounded-xl bg-gradient-to-r from-[#111C2D] to-[#1E293B] border border-blue-500/30 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Founder Recruitment</h4>
            <p className="text-[11px] text-slate-300 truncate">Building something of your own?</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenModal}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-1"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white"
            title="Dismiss recruitment note"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Sidebar card variant (matching mockup design)
  return (
    <div className="founder-recruitment-card relative rounded-xl bg-gradient-to-b from-[#162338] to-[#0E1726] border border-blue-500/30 p-3.5 text-white shadow-lg overflow-hidden group">
      {/* Glow accent */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Header with dismiss */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-100">Founder Recruitment</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition"
          aria-label="Dismiss founder recruitment"
          title="Dismiss (re-open anytime in About page)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-slate-300 mb-3 leading-snug">
        Building something of your own? We’re looking for people interested in creating and growing online businesses together.
      </p>

      {/* Visual action button with handshake illustration */}
      <button
        onClick={onOpenModal}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 text-xs font-semibold transition group-hover:border-blue-400/50"
      >
        <span className="flex items-center gap-1.5 text-[11px]">
          <span>See who we're looking for</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
        <span className="text-base" title="Collaborative partnership">🤝</span>
      </button>
    </div>
  );
};
