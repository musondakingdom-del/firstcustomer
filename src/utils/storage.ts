import { Project, ActivityItem } from '../types';
import { INITIAL_PROJECTS, INITIAL_ACTIVITIES } from './seedData';

const STORAGE_KEYS = {
  PROJECTS: 'firstcustomer_projects_v1',
  ACTIVE_ID: 'firstcustomer_active_project_id_v1',
  ACTIVITIES: 'firstcustomer_activities_v1',
  RECRUITMENT_DISMISSED: 'firstcustomer_recruitment_dismissed_v1',
  THEME: 'firstcustomer_theme_v1',
};

// Check if localStorage is available
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__fc_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Purge any developer demonstration records from stored list
const filterOutDemoData = (projects: Project[]): Project[] => {
  return projects.filter(
    (p) =>
      p.id !== 'proj-sample-student-productivity' &&
      p.name !== 'My Business Idea'
  );
};

// Purge demo activities
const filterOutDemoActivities = (activities: ActivityItem[]): ActivityItem[] => {
  const demoIds = new Set(['act-1', 'act-2', 'act-3', 'act-4']);
  return activities.filter(
    (a) =>
      !demoIds.has(a.id) &&
      a.projectId !== 'proj-sample-student-productivity' &&
      a.projectName !== 'My Business Idea'
  );
};

// Load all projects
export const loadProjects = (): Project[] => {
  if (!isStorageAvailable()) {
    return INITIAL_PROJECTS;
  }
  try {
    const data = window.localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) {
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      const realProjects = filterOutDemoData(parsed);
      // If demo data was removed, resave clean data
      if (realProjects.length !== parsed.length) {
        saveProjects(realProjects);
      }
      return realProjects;
    }
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Failed to parse projects from localStorage:', err);
    return INITIAL_PROJECTS;
  }
};

// Save all projects
export const saveProjects = (projects: Project[]): boolean => {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
    return false;
  }
};

// Load active project ID
export const loadActiveProjectId = (projects: Project[]): string => {
  if (!isStorageAvailable() || projects.length === 0) {
    return '';
  }
  try {
    const storedId = window.localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    if (storedId && projects.some((p) => p.id === storedId)) {
      return storedId;
    }
    return projects[0]?.id || '';
  } catch {
    return projects[0]?.id || '';
  }
};

// Save active project ID
export const saveActiveProjectId = (id: string): void => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
  } catch (err) {
    console.error('Failed to save active project id:', err);
  }
};

// Activities
export const loadActivities = (): ActivityItem[] => {
  if (!isStorageAvailable()) return INITIAL_ACTIVITIES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realActivities = filterOutDemoActivities(parsed);
      if (realActivities.length !== parsed.length) {
        saveActivities(realActivities);
      }
      return realActivities;
    }
    return INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
};

export const saveActivities = (activities: ActivityItem[]): void => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
  } catch (err) {
    console.error('Failed to save activities:', err);
  }
};

export const addActivity = (
  projectId: string,
  projectName: string,
  action: string,
  iconType: ActivityItem['iconType']
): ActivityItem[] => {
  const current = loadActivities();
  const newItem: ActivityItem = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    projectId,
    projectName,
    action,
    timestamp: 'Just now',
    iconType,
  };
  const updated = [newItem, ...current.filter((_, idx) => idx < 40)];
  saveActivities(updated);
  return updated;
};

// Founder recruitment card dismissed state
export const isRecruitmentDismissed = (): boolean => {
  if (!isStorageAvailable()) return false;
  return window.localStorage.getItem(STORAGE_KEYS.RECRUITMENT_DISMISSED) === 'true';
};

export const setRecruitmentDismissed = (dismissed: boolean): void => {
  if (!isStorageAvailable()) return;
  window.localStorage.setItem(STORAGE_KEYS.RECRUITMENT_DISMISSED, dismissed ? 'true' : 'false');
};

// JSON Export and Backup
export const exportDataAsJSON = (projects: Project[], activeProjectOnly: boolean = false, activeProject?: Project): void => {
  const dataToExport = {
    app: 'FirstCustomer',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    philosophy: 'Research first. Build second.',
    projects: activeProjectOnly && activeProject ? [activeProject] : projects,
  };

  const jsonStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = activeProjectOnly && activeProject 
    ? `firstcustomer-${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-backup.json`
    : `firstcustomer-all-projects-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// CSV Exports
export const exportCompetitorsToCSV = (project: Project): void => {
  if (!project.competitors || project.competitors.length === 0) {
    alert('No competitors to export for this project.');
    return;
  }
  const headers = ['Competitor Name', 'Website', 'Description', 'Target Audience', 'Pricing', 'Strengths', 'Weaknesses', 'Customer Complaints', 'Source'];
  const rows = project.competitors.map((c) => [
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.websiteUrl || '').replace(/"/g, '""')}"`,
    `"${(c.description || '').replace(/"/g, '""')}"`,
    `"${(c.targetAudience || '').replace(/"/g, '""')}"`,
    `"${(c.pricingInfo || '').replace(/"/g, '""')}"`,
    `"${(c.strengths || '').replace(/"/g, '""')}"`,
    `"${(c.weaknesses || '').replace(/"/g, '""')}"`,
    `"${(c.customerComplaints || '').replace(/"/g, '""')}"`,
    `"${(c.researchSource || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-competitors.csv`, 'text/csv;charset=utf-8;');
};

export const exportQuestionsToCSV = (project: Project): void => {
  if (!project.researchQuestions || project.researchQuestions.length === 0) {
    alert('No research questions to export.');
    return;
  }
  const headers = ['Category', 'Question', 'Status', 'Notes & Observations', 'Created Date'];
  const rows = project.researchQuestions.map((q) => [
    `"${(q.category || '').replace(/"/g, '""')}"`,
    `"${(q.question || '').replace(/"/g, '""')}"`,
    `"${(q.status || '').replace(/"/g, '""')}"`,
    `"${(q.notesOrAnswer || '').replace(/"/g, '""')}"`,
    `"${(q.createdAt || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-research-questions.csv`, 'text/csv;charset=utf-8;');
};

export const exportFeedbackToCSV = (project: Project): void => {
  if (!project.feedbackList || project.feedbackList.length === 0) {
    alert('No customer feedback to export.');
    return;
  }
  const headers = ['Title', 'Date', 'Source Type', 'Customer Category', 'Quote or Observation', 'Problem Identified', 'Suggested Improvement', 'Sentiment', 'Category Tag'];
  const rows = project.feedbackList.map((f) => [
    `"${(f.title || '').replace(/"/g, '""')}"`,
    `"${(f.dateReceived || '').replace(/"/g, '""')}"`,
    `"${(f.sourceType || '').replace(/"/g, '""')}"`,
    `"${(f.customerCategory || '').replace(/"/g, '""')}"`,
    `"${(f.quoteOrObservation || '').replace(/"/g, '""')}"`,
    `"${(f.problemIdentified || '').replace(/"/g, '""')}"`,
    `"${(f.suggestedImprovement || '').replace(/"/g, '""')}"`,
    `"${(f.sentiment || '').replace(/"/g, '""')}"`,
    `"${(f.categoryTag || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-feedback.csv`, 'text/csv;charset=utf-8;');
};

const downloadBlob = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Reset to clean empty workspace
export const resetToEmptyWorkspace = (): { projects: Project[]; activeId: string } => {
  saveProjects([]);
  saveActiveProjectId('');
  saveActivities([]);
  return {
    projects: [],
    activeId: '',
  };
};
