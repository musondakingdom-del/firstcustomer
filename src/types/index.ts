export type BusinessType = 
  | 'digital_product' 
  | 'physical_product' 
  | 'saas' 
  | 'mobile_app' 
  | 'freelance_service' 
  | 'ecommerce' 
  | 'other';

export type IdeaStage = 
  | 'just_idea' 
  | 'researching' 
  | 'validating' 
  | 'building' 
  | 'launched';

export type QuestionCategory = 
  | 'problem_discovery' 
  | 'current_workflow' 
  | 'frustrations' 
  | 'alternatives' 
  | 'decision_making' 
  | 'custom';

export type QuestionStatus = 'planned' | 'asked' | 'answered';

export interface ResearchQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  isPitchWarning?: boolean; // alerts user if question sounds like selling instead of discovery
  status: QuestionStatus;
  notesOrAnswer?: string;
  createdAt: string;
}

export interface ResearchSource {
  id: string;
  sourceName: string;
  sourceUrl: string;
  dateResearched: string;
  problemDiscussed: string;
  summary: string;
  notes: string;
}

export type EvidenceStatus = 
  | 'unverified_assumption' 
  | 'initial_observation' 
  | 'repeated_observation' 
  | 'supported_by_multiple';

export interface ResearchFinding {
  id: string;
  title: string;
  problemDescription: string;
  source: string;
  evidenceNotes: string;
  dateRecorded: string;
  observationCount: number;
  evidenceStatus: EvidenceStatus;
}

export interface Competitor {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  targetAudience: string;
  pricingInfo: string;
  mainFeatures: string[];
  strengths: string;
  weaknesses: string;
  customerComplaints: string;
  researchSource: string;
  personalNotes: string;
}

export type ValidationStatus = 
  | 'not_researched' 
  | 'assumption' 
  | 'research_in_progress' 
  | 'some_evidence' 
  | 'stronger_evidence' 
  | 'needs_further_testing';

export interface ValidationRecord {
  categoryId: 
    | 'customer_problem' 
    | 'target_customer' 
    | 'existing_solutions' 
    | 'market_interest' 
    | 'proposed_solution' 
    | 'willingness_to_pay' 
    | 'customer_feedback';
  title: string;
  hypothesis: string; // What you believe
  evidence: string;   // Collected evidence
  unknowns: string;   // What remains unknown
  status: ValidationStatus;
  updatedAt: string;
}

export type FeedbackSentiment = 'supports' | 'challenges' | 'neutral';

export type FeedbackTag = 
  | 'positive_interest' 
  | 'negative_feedback' 
  | 'feature_request' 
  | 'existing_alternative' 
  | 'problem_confirmation' 
  | 'unclear_feedback';

export interface CustomerFeedback {
  id: string;
  title: string;
  dateReceived: string;
  sourceType: string;
  customerCategory: string;
  quoteOrObservation: string;
  problemIdentified: string;
  suggestedImprovement: string;
  sentiment: FeedbackSentiment;
  categoryTag: FeedbackTag;
  notes: string;
}

export interface TargetCustomer {
  description: string;
  category: string;
  ageRange: string;
  locationMarket: string;
  interests: string[];
  relevantBehaviors: string;
  problemsExperienced: string;
  whereTheyLook: string;
  whereTheyDiscuss: string;
}

export interface Project {
  id: string;
  name: string;
  businessType: BusinessType;
  description: string;
  problemStatement: string;
  targetAudienceHypothesis: string;
  proposedSolution: string;
  stage: IdeaStage;
  createdAt: string;
  updatedAt: string;
  targetCustomer: TargetCustomer;
  researchQuestions: ResearchQuestion[];
  researchSources: ResearchSource[];
  findings: ResearchFinding[];
  competitors: Competitor[];
  validationRecords: ValidationRecord[];
  feedbackList: CustomerFeedback[];
  missingSolutionsNotes: string; // "What Existing Solutions Are Missing?"
}

export interface ActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  action: string;
  timestamp: string;
  iconType: 'project' | 'question' | 'competitor' | 'finding' | 'feedback' | 'validation';
}

export type ActiveNavTab = 
  | 'dashboard' 
  | 'workspace' 
  | 'planner' 
  | 'competitors' 
  | 'validation' 
  | 'reports' 
  | 'about';
