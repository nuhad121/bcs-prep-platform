import { BookmarkItem, DailyNote, ErrorLogEntry, ExamAttempt, Profile, Settings, StudyDay } from '../types';

const keys = {
  profile: 'bcs-profile',
  plan: 'bcs-plan',
  tasks: 'bcs-task-completion',
  notes: 'bcs-notes',
  examResults: 'bcs-exam-results',
  errors: 'bcs-errors',
  bookmarks: 'bcs-bookmarks',
  settings: 'bcs-settings',
};

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const saveProfile = (profile: Profile) => localStorage.setItem(keys.profile, JSON.stringify(profile));
export const getProfile = (): Profile | null => safeParse<Profile | null>(localStorage.getItem(keys.profile), null);

export const savePlan = (plan: StudyDay[]) => localStorage.setItem(keys.plan, JSON.stringify(plan));
export const getPlan = (): StudyDay[] => safeParse<StudyDay[]>(localStorage.getItem(keys.plan), []);

export const saveProgress = (progress: Record<string, boolean>) => localStorage.setItem(keys.tasks, JSON.stringify(progress));
export const getProgress = (): Record<string, boolean> => safeParse<Record<string, boolean>>(localStorage.getItem(keys.tasks), {});

export const saveDailyNotes = (notes: Record<string, DailyNote>) => localStorage.setItem(keys.notes, JSON.stringify(notes));
export const getDailyNotes = (): Record<string, DailyNote> => safeParse<Record<string, DailyNote>>(localStorage.getItem(keys.notes), {});

export const saveExamResult = (result: ExamAttempt) => {
  const existing = getExamResults();
  localStorage.setItem(keys.examResults, JSON.stringify([result, ...existing]));
};
export const getExamResults = (): ExamAttempt[] => safeParse<ExamAttempt[]>(localStorage.getItem(keys.examResults), []);

export const saveError = (error: ErrorLogEntry) => {
  const existing = getErrors();
  localStorage.setItem(keys.errors, JSON.stringify([error, ...existing]));
};
export const getErrors = (): ErrorLogEntry[] => safeParse<ErrorLogEntry[]>(localStorage.getItem(keys.errors), []);

export const saveBookmark = (bookmark: BookmarkItem) => {
  const existing = getBookmarks();
  localStorage.setItem(keys.bookmarks, JSON.stringify([bookmark, ...existing]));
};
export const getBookmarks = (): BookmarkItem[] => safeParse<BookmarkItem[]>(localStorage.getItem(keys.bookmarks), []);

export const saveSettings = (settings: Settings) => localStorage.setItem(keys.settings, JSON.stringify(settings));
export const getSettings = (): Settings => safeParse<Settings>(localStorage.getItem(keys.settings), { theme: 'light', notifications: true });

export const clearAllData = () => {
  Object.values(keys).forEach((key) => localStorage.removeItem(key));
};

export const exportProgress = () => {
  const payload = {
    profile: getProfile(),
    plan: getPlan(),
    tasks: getProgress(),
    notes: getDailyNotes(),
    examResults: getExamResults(),
    errors: getErrors(),
    bookmarks: getBookmarks(),
    settings: getSettings(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'bcs-prep-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
};

export const importProgress = (json: string) => {
  const parsed = safeParse<Record<string, unknown>>(json, {});
  if (!parsed || typeof parsed !== 'object') return false;

  if (parsed.profile) localStorage.setItem(keys.profile, JSON.stringify(parsed.profile));
  if (parsed.plan) localStorage.setItem(keys.plan, JSON.stringify(parsed.plan));
  if (parsed.tasks) localStorage.setItem(keys.tasks, JSON.stringify(parsed.tasks));
  if (parsed.notes) localStorage.setItem(keys.notes, JSON.stringify(parsed.notes));
  if (parsed.examResults) localStorage.setItem(keys.examResults, JSON.stringify(parsed.examResults));
  if (parsed.errors) localStorage.setItem(keys.errors, JSON.stringify(parsed.errors));
  if (parsed.bookmarks) localStorage.setItem(keys.bookmarks, JSON.stringify(parsed.bookmarks));
  if (parsed.settings) localStorage.setItem(keys.settings, JSON.stringify(parsed.settings));
  return true;
};
