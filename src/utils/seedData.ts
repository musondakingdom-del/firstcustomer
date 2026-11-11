import { Project, ValidationRecord, ActivityItem } from '../types';

export const DEFAULT_VALIDATION_CATEGORIES: Array<{
  categoryId: ValidationRecord['categoryId'];
  title: string;
}> = [
  { categoryId: 'customer_problem', title: 'Customer Problem' },
  { categoryId: 'target_customer', title: 'Target Customer' },
  { categoryId: 'existing_solutions', title: 'Existing Solutions' },
  { categoryId: 'market_interest', title: 'Market Interest' },
  { categoryId: 'proposed_solution', title: 'Proposed Solution' },
  { categoryId: 'willingness_to_pay', title: 'Willingness to Pay' },
  { categoryId: 'customer_feedback', title: 'Customer Feedback' },
];

export const createDefaultValidationRecords = (): ValidationRecord[] => {
  return DEFAULT_VALIDATION_CATEGORIES.map((cat) => ({
    categoryId: cat.categoryId,
    title: cat.title,
    hypothesis: '',
    evidence: '',
    unknowns: '',
    status: 'not_researched',
    updatedAt: new Date().toISOString(),
  }));
};

// Pure empty state: zero demo, mock, or fake starter projects
export const INITIAL_PROJECTS: Project[] = [];

// Pure empty state: zero demo activity records
export const INITIAL_ACTIVITIES: ActivityItem[] = [];
