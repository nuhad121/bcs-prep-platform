export const subjectPalette: Record<string, string> = {
  Bangla: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  English: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  'Bangladesh Affairs': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  'International Affairs': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  'Geography / Environment / Disaster Management': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  'General Science': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
  ICT: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
  'Mathematical Reasoning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  'Mental Ability': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  'Ethics, Values & Good Governance': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  'Technical / Professional Subject': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
  'Written Exam': 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
  'Viva Preparation': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
};

export const phaseNames = [
  'Foundation & Standard Textbooks',
  'Complete Syllabus Coverage',
  'MCQ + Previous Year Questions',
  'Written Exam Foundation',
  'Full Model Tests + Viva Preparation',
];

export const academicBackgrounds = [
  'Science',
  'Engineering',
  'Medical',
  'Business Studies',
  'Humanities',
  'Political Science',
  'Law',
  'Economics',
  'Computer Science',
  'Other',
] as const;

export const cadreOptions = ['General Cadre Only', 'General + Technical/Professional Cadre'] as const;
export const dailyStudyTimes = ['2 Hours', '3 Hours', '4 Hours', '5 Hours', '6 Hours', '8+ Hours'] as const;

export const defaultThemes = [
  'Bangladesh Constitution — Fundamental Rights',
  'English Grammar & Vocabulary',
  'Mathematical Reasoning — Percentages',
  'International Relations Fundamentals',
  'General Science — Life Processes',
  'Bangla Literature — Poetry Analysis',
  'ICT — MS Excel Essentials',
  'Ethics & Good Governance',
  'Bangladesh Geography — Rivers and Climate',
  'Mental Ability — Number Series',
];

export const genericSubjects = [
  'Bangla',
  'English',
  'Bangladesh Affairs',
  'International Affairs',
  'Geography / Environment / Disaster Management',
  'General Science',
  'ICT',
  'Mathematical Reasoning',
  'Mental Ability',
  'Ethics, Values & Good Governance',
  'Technical / Professional Subject',
] as const;
