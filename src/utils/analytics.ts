import { Project } from '../types';

export interface ProgressBreakdown {
  percentage: number;
  items: {
    id: string;
    label: string;
    completed: boolean;
    detail: string;
  }[];
}

export const calculateProjectProgress = (project: Project): ProgressBreakdown => {
  // 1. Idea Defined: Name, problem, target audience, and solution provided
  const ideaDefined = Boolean(
    project.name.trim() &&
    project.problemStatement.trim().length > 10 &&
    project.targetAudienceHypothesis.trim().length > 5 &&
    project.proposedSolution.trim().length > 10
  );

  // 2. Research Plan: Target customer profile filled + at least 3 research questions created
  const hasTargetProfile = Boolean(
    project.targetCustomer?.category?.trim() &&
    project.targetCustomer?.problemsExperienced?.trim()
  );
  const hasQuestions = (project.researchQuestions?.length || 0) >= 3;
  const researchPlan = hasTargetProfile && hasQuestions;

  // 3. Competitor Analysis: At least 1 competitor analyzed with strengths & weaknesses
  const competitorAnalysis = (project.competitors?.length || 0) >= 1;

  // 4. Validate with Users: At least 1 answered question OR 1 finding OR 1 feedback recorded
  const hasAnsweredQuestion = (project.researchQuestions || []).some((q) => q.status === 'answered' || Boolean(q.notesOrAnswer?.trim()));
  const hasFindings = (project.findings?.length || 0) > 0;
  const hasFeedback = (project.feedbackList?.length || 0) > 0;
  const validateWithUsers = hasAnsweredQuestion || hasFindings || hasFeedback;

  // 5. Readiness Report: At least 3 validation categories moved beyond 'not_researched' or 'assumption' to 'some_evidence' / 'research_in_progress'
  const validationProgress = (project.validationRecords || []).filter(
    (v) => v.status === 'some_evidence' || v.status === 'stronger_evidence' || v.status === 'research_in_progress'
  ).length;
  const readinessReport = validationProgress >= 3 && competitorAnalysis && validateWithUsers;

  const items = [
    {
      id: 'idea',
      label: 'Idea Defined',
      completed: ideaDefined,
      detail: ideaDefined ? 'Problem & solution hypothesis articulated' : 'Clarify problem and proposed solution',
    },
    {
      id: 'plan',
      label: 'Research Plan',
      completed: researchPlan,
      detail: researchPlan ? 'Target customer and 3+ questions set' : 'Define customer profile & 3+ questions',
    },
    {
      id: 'competitors',
      label: 'Competitor Analysis',
      completed: competitorAnalysis,
      detail: competitorAnalysis ? `${project.competitors.length} alternatives documented` : 'Add at least 1 existing competitor',
    },
    {
      id: 'validate',
      label: 'Validate with Users',
      completed: validateWithUsers,
      detail: validateWithUsers ? 'Direct feedback or findings gathered' : 'Record observations, interviews or findings',
    },
    {
      id: 'readiness',
      label: 'Readiness Report',
      completed: readinessReport,
      detail: readinessReport ? 'Sufficient evidence for synthesis' : 'Collect evidence across 3+ validation areas',
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return {
    percentage,
    items,
  };
};

export interface NextStepSuggestion {
  id: string;
  title: string;
  description: string;
  tabTarget: 'workspace' | 'planner' | 'competitors' | 'validation' | 'reports';
  priority: 'high' | 'medium' | 'low';
}

export const getProjectNextSteps = (project: Project): NextStepSuggestion[] => {
  const suggestions: NextStepSuggestion[] = [];

  // Check Idea definition
  if (!project.problemStatement || project.problemStatement.length < 15) {
    suggestions.push({
      id: 'step-problem',
      title: 'Clarify the core customer problem',
      description: 'Describe the specific frustration customers experience in your Idea Workspace.',
      tabTarget: 'workspace',
      priority: 'high',
    });
  }

  // Check target customer
  if (!project.targetCustomer?.category || !project.targetCustomer?.problemsExperienced) {
    suggestions.push({
      id: 'step-customer',
      title: 'Define your target customer profile',
      description: 'Detail who they are, where they look for solutions, and where they discuss problems online.',
      tabTarget: 'planner',
      priority: 'high',
    });
  }

  // Check questions
  const questionCount = project.researchQuestions?.length || 0;
  if (questionCount < 3) {
    suggestions.push({
      id: 'step-questions',
      title: 'Add customer research questions',
      description: `You have ${questionCount} question(s). Aim for at least 4 open-ended discovery questions.`,
      tabTarget: 'planner',
      priority: 'high',
    });
  }

  // Check competitors
  const competitorCount = project.competitors?.length || 0;
  if (competitorCount === 0) {
    suggestions.push({
      id: 'step-competitors',
      title: 'Finish your competitor research',
      description: 'Compare your idea with existing alternatives that customers already use today.',
      tabTarget: 'competitors',
      priority: 'medium',
    });
  } else if (!project.missingSolutionsNotes?.trim()) {
    suggestions.push({
      id: 'step-missing',
      title: 'Document what existing solutions miss',
      description: 'Identify the exact gaps in current market tools under Competitor Analysis.',
      tabTarget: 'competitors',
      priority: 'medium',
    });
  }

  // Check user feedback / findings
  const feedbackCount = project.feedbackList?.length || 0;
  const findingsCount = project.findings?.length || 0;
  if (feedbackCount === 0 && findingsCount === 0) {
    suggestions.push({
      id: 'step-feedback',
      title: 'Collect feedback from your target audience',
      description: 'Record quotes from public forums (Reddit, reviews) or direct interviews.',
      tabTarget: 'planner',
      priority: 'high',
    });
  }

  // Check validation board
  const unverifiedAssumptions = (project.validationRecords || []).filter(
    (v) => v.status === 'assumption' || v.status === 'not_researched'
  ).length;
  if (unverifiedAssumptions >= 4) {
    suggestions.push({
      id: 'step-validate',
      title: 'Review your validation report & assumptions',
      description: `You have ${unverifiedAssumptions} unverified assumptions. Attach evidence to test them.`,
      tabTarget: 'validation',
      priority: 'medium',
    });
  }

  // If mostly complete
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'step-review-report',
      title: 'Review your validation report',
      description: 'Inspect your evidence summary and export a readiness review for your team or mentors.',
      tabTarget: 'reports',
      priority: 'low',
    });
  }

  return suggestions.slice(0, 3);
};

export type ReportConclusionState = 
  | 'not_started' 
  | 'insufficient_evidence' 
  | 'in_progress' 
  | 'some_evidence' 
  | 'ready_for_testing';

export interface ReportConclusion {
  state: ReportConclusionState;
  title: string;
  badgeColor: string;
  badgeBg: string;
  summary: string;
  recommendations: string[];
}

export const evaluateReportConclusion = (project: Project): ReportConclusion => {
  const { percentage } = calculateProjectProgress(project);
  const evidenceRecords = (project.validationRecords || []).filter(
    (v) => v.status === 'some_evidence' || v.status === 'stronger_evidence'
  ).length;
  const feedbackCount = project.feedbackList?.length || 0;
  const competitorCount = project.competitors?.length || 0;

  if (percentage < 20) {
    return {
      state: 'not_started',
      title: 'Research Not Started',
      badgeColor: 'text-amber-800',
      badgeBg: 'bg-amber-100 border-amber-300',
      summary: 'This business idea currently consists almost entirely of unverified assumptions. No significant customer discussions, competitor evaluations, or evidence records have been documented.',
      recommendations: [
        'Complete the core problem and target audience definition.',
        'Brainstorm at least 4 open-ended discovery questions using the research planner.',
        'Find 2 online communities (Reddit, Discord, forums) where your target audience congregates.',
      ],
    };
  }

  if (percentage < 50 || (evidenceRecords === 0 && feedbackCount === 0)) {
    return {
      state: 'insufficient_evidence',
      title: 'Insufficient Evidence',
      badgeColor: 'text-orange-800',
      badgeBg: 'bg-orange-100 border-orange-300',
      summary: 'Initial planning has started, but there is not yet enough customer evidence to determine whether this problem is acute or whether existing alternatives already satisfy users.',
      recommendations: [
        'Conduct 3–5 open-ended problem discovery interviews.',
        'Observe real customer complaints in competitor app reviews or forum threads.',
        'Update your validation tracker as observations confirm or contradict your hypotheses.',
      ],
    };
  }

  if (percentage < 80) {
    return {
      state: 'in_progress',
      title: 'Research in Progress',
      badgeColor: 'text-blue-800',
      badgeBg: 'bg-blue-100 border-blue-300',
      summary: 'Active research is underway. You have documented competitors and initial customer observations. Key questions regarding willingness to pay and alternative friction points still need verification.',
      recommendations: [
        'Deepen competitor analysis to identify specific unmet customer needs.',
        'Test whether potential users are currently spending time or money attempting to solve this problem.',
        'Synthesize repeated findings into problem severity scores.',
      ],
    };
  }

  if (evidenceRecords >= 4 && feedbackCount >= 3 && competitorCount >= 2) {
    return {
      state: 'ready_for_testing',
      title: 'Ready for Prototype Testing',
      badgeColor: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 border-emerald-300',
      summary: 'Strong foundational research collected. Multiple independent observations corroborate the customer problem, competitor gaps are identified, and user feedback provides concrete direction for an MVP.',
      recommendations: [
        'Design a low-fidelity landing page or clickable prototype to test user interest.',
        'Conduct usability walkthroughs with 5 interviewed prospects.',
        'Validate willingness to pre-order, join a waitlist, or commit time.',
      ],
    };
  }

  return {
    state: 'some_evidence',
    title: 'Some Evidence Collected',
    badgeColor: 'text-teal-800',
    badgeBg: 'bg-teal-100 border-teal-300',
    summary: 'Several customer problems have been observed and cross-referenced with competitors. Continue gathering feedback to ensure these observations represent a widespread pattern.',
    recommendations: [
      'Look for counter-evidence or users who tried to solve this and stopped.',
      'Check if customers have a budget or established purchasing behavior.',
      'Refine the proposed solution scope to the single most acute pain point.',
    ],
  };
};

// Check if a question sounds like a sales pitch
export const detectPitchQuestion = (text: string): boolean => {
  const pitchPatterns = [
    /would you (buy|pay|use|download|like)/i,
    /how much would you pay/i,
    /do you think our/i,
    /if we built/i,
    /what do you think of (this|my) idea/i,
    /would this be useful/i,
    /would you like an app that/i,
  ];
  return pitchPatterns.some((pattern) => pattern.test(text));
};
