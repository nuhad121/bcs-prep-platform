import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, CheckCheck, ChevronRight, ClipboardList, CircleDashed, Compass, Flame, FolderOpen, NotebookPen, Search, Settings as SettingsIcon, Sparkles, Star, Target, Trophy, User } from 'lucide-react';

type CadreType = 'General Cadre Only' | 'General + Technical/Professional Cadre';
type AcademicBackground = 'Science' | 'Engineering' | 'Medical' | 'Business Studies' | 'Humanities' | 'Political Science' | 'Law' | 'Economics' | 'Computer Science' | 'Other';
type DailyStudyTime = '2 Hours' | '3 Hours' | '4 Hours' | '5 Hours' | '6 Hours' | '8+ Hours';
type SubjectName = 'Bangla' | 'English' | 'Bangladesh Affairs' | 'International Affairs' | 'Geography / Environment / Disaster Management' | 'General Science' | 'ICT' | 'Mathematical Reasoning' | 'Mental Ability' | 'Ethics, Values & Good Governance' | 'Technical / Professional Subject' | 'Written Exam' | 'Viva Preparation';
type ExamType = 'Preliminary' | 'Written' | 'Viva';

type Profile = {
  id: string;
  name: string;
  cadre: CadreType;
  durationDays: number;
  background: AcademicBackground;
  customBackground?: string;
  dailyStudyTime: DailyStudyTime;
  startDate: string;
  createdAt: string;
};

type StudyTask = {
  id: string;
  subject: SubjectName;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
};

type DayStatus = 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'EXAM PASSED' | 'REVIEW REQUIRED';

type StudyDay = {
  day: number;
  date: string;
  theme: string;
  phase: string;
  tasks: StudyTask[];
  completion: number;
  status: DayStatus;
  examScore?: number;
};

type DailyNote = {
  learned: string;
  mistakes: string;
  importantFacts: string;
  revise: string;
};

type ExamQuestion = {
  id: string;
  subject: SubjectName;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type ExamAttempt = {
  id: string;
  day: number;
  score: number;
  total: number;
  percentage: number;
  correct: number;
  wrong: number;
  submittedAt: string;
  answers: Record<string, string>;
  questions: ExamQuestion[];
};

type ErrorLogEntry = {
  id: string;
  subject: SubjectName | 'General';
  topic: string;
  question: string;
  myAnswer: string;
  correctAnswer: string;
  whyWrong: string;
  revisionDate: string;
  status: 'Unreviewed' | 'Reviewed' | 'Mastered';
  createdAt: string;
};

type BookmarkItem = {
  id: string;
  type: 'question' | 'topic' | 'task' | 'note';
  title: string;
  detail: string;
  tag: string;
  createdAt: string;
};

type Settings = {
  theme: 'light' | 'dark';
  notifications: boolean;
};

type PYQRecord = {
  id: string;
  bcs: string;
  exam: ExamType | 'Preliminary';
  questionNumber: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number | null;
  explanation?: string;
  source?: string;
};

type SetupState = {
  name: string;
  cadre: CadreType;
  durationDays: number;
  background: AcademicBackground;
  customBackground: string;
  dailyStudyTime: DailyStudyTime;
  startDate: string;
};

const STORAGE_KEYS = {
  profile: 'bcs-profile',
  plan: 'bcs-plan',
  tasks: 'bcs-tasks',
  notes: 'bcs-notes',
  examResults: 'bcs-exam-results',
  errors: 'bcs-errors',
  bookmarks: 'bcs-bookmarks',
  settings: 'bcs-settings',
  pyqBookmarks: 'bcs-pyq-bookmarks',
};

const subjectPalette: Record<string, string> = {
  Bangla: 'tag-bangla',
  English: 'tag-english',
  'Bangladesh Affairs': 'tag-bd',
  'International Affairs': 'tag-intl',
  'Geography / Environment / Disaster Management': 'tag-geo',
  'General Science': 'tag-science',
  ICT: 'tag-ict',
  'Mathematical Reasoning': 'tag-math',
  'Mental Ability': 'tag-mental',
  'Ethics, Values & Good Governance': 'tag-ethics',
  'Technical / Professional Subject': 'tag-tech',
  'Written Exam': 'tag-written',
  'Viva Preparation': 'tag-viva',
};

const phaseNames = [
  'Foundation & Standard Textbooks',
  'Complete Syllabus Coverage',
  'MCQ + Previous Year Questions',
  'Written Exam Foundation',
  'Full Model Tests + Viva Preparation',
];

const defaultThemes = [
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

const cadreOptions: CadreType[] = ['General Cadre Only', 'General + Technical/Professional Cadre'];
const durationOptions = [
  { value: 30, label: '30 Days — Express Revision / Crash Course' },
  { value: 180, label: '180 Days — Complete 6-Month Preparation' },
  { value: 365, label: '365 Days — 1-Year Foundation & Practice' },
  { value: 730, label: '730 Days — 2-Year Long-Term Strategy' },
];
const academicOptions: AcademicBackground[] = ['Science', 'Engineering', 'Medical', 'Business Studies', 'Humanities', 'Political Science', 'Law', 'Economics', 'Computer Science', 'Other'];
const studyTimeOptions: DailyStudyTime[] = ['2 Hours', '3 Hours', '4 Hours', '5 Hours', '6 Hours', '8+ Hours'];

const sampleQuestions: ExamQuestion[] = [
  { id: 'q1', subject: 'Bangladesh Affairs', topic: 'Constitution', question: 'Which article of the Bangladesh Constitution guarantees equality of opportunity?', options: ['Article 22', 'Article 29', 'Article 39', 'Article 51'], answer: 2, explanation: 'Article 39 deals with equality of opportunity and protection of rights in public life.' },
  { id: 'q2', subject: 'Bangla', topic: 'Grammar', question: 'Which is the correct Bangla spelling?', options: ['সদাচরণ', 'সদাচরন', 'সৎাচরণ', 'সদচরণ'], answer: 0, explanation: 'The correct spelling is “সদাচরণ”.' },
  { id: 'q3', subject: 'English', topic: 'Vocabulary', question: 'Choose the correct synonym of “meticulous.”', options: ['Careless', 'Precise', 'Rude', 'Silent'], answer: 1, explanation: 'Meticulous means very careful and precise.' },
  { id: 'q4', subject: 'General Science', topic: 'Biology', question: 'Which cell organelle is known as the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], answer: 1, explanation: 'Mitochondria produce ATP, the cell’s usable energy.' },
  { id: 'q5', subject: 'ICT', topic: 'Hardware', question: 'Which device is used to input data into a computer?', options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], answer: 2, explanation: 'A keyboard is an input device used to enter text and commands.' },
  { id: 'q6', subject: 'Mathematical Reasoning', topic: 'Percentages', question: 'If 25% of a number is 40, what is the number?', options: ['120', '140', '160', '180'], answer: 2, explanation: '25% = 1/4, so the full number is 40 × 4 = 160.' },
  { id: 'q7', subject: 'Mental Ability', topic: 'Number series', question: 'Find the next number: 2, 6, 12, 20, 30, ?', options: ['36', '40', '42', '48'], answer: 2, explanation: 'The pattern is 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.' },
  { id: 'q8', subject: 'International Affairs', topic: 'Global institutions', question: 'Which organization is mainly responsible for international peacekeeping?', options: ['IMF', 'UN', 'WHO', 'World Bank'], answer: 1, explanation: 'The United Nations is the main global body for peacekeeping and diplomacy.' },
  { id: 'q9', subject: 'Ethics, Values & Good Governance', topic: 'Governance', question: 'Accountability in public administration means:', options: ['Following personal interest only', 'Answering for decisions and actions', 'Ignoring public complaints', 'Reducing citizen participation'], answer: 1, explanation: 'Accountability means being answerable for decisions and actions.' },
  { id: 'q10', subject: 'Geography / Environment / Disaster Management', topic: 'Climate', question: 'What is the main cause of monsoon rainfall in Bangladesh?', options: ['Snowstorms', 'Seasonal ocean winds', 'Polar winds', 'Volcanic dust'], answer: 1, explanation: 'Seasonal winds carrying moisture from the ocean bring the monsoon to Bangladesh.' },
];

const pyqDemoData: PYQRecord[] = [
  { id: '46-pre-001', bcs: '46th', exam: 'Preliminary', questionNumber: 1, subject: 'Bangladesh Affairs', topic: 'Constitution', question: 'The Constitution of Bangladesh came into force on which date?', options: ['16 December 1971', '26 March 1971', '4 November 1972', '7 March 1973'], correctAnswer: 2, explanation: 'The Constitution took effect on 4 November 1972.', source: 'Sample demo bank' },
  { id: '46-pre-002', bcs: '46th', exam: 'Preliminary', questionNumber: 2, subject: 'General Science', topic: 'Biology', question: 'Which blood cells help in clotting?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], correctAnswer: 2, explanation: 'Platelets are directly involved in clot formation.', source: 'Sample demo bank' },
  { id: '46-pre-003', bcs: '46th', exam: 'Preliminary', questionNumber: 3, subject: 'Mathematical Reasoning', topic: 'Percentages', question: 'What is 15% of 600?', options: ['60', '75', '90', '100'], correctAnswer: 2, explanation: '15% of 600 = 90.', source: 'Sample demo bank' },
  { id: '45-pre-001', bcs: '45th', exam: 'Preliminary', questionNumber: 1, subject: 'Bangla', topic: 'Literature', question: 'Which of the following is a poetic form?', options: ['নাটক', 'গদ্য', 'কবিতা', 'উপন্যাস'], correctAnswer: 2, explanation: 'কবিতা is a poetic form.', source: 'Sample demo bank' },
];

const save = <T,>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value));
const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const defaultSetup: SetupState = {
  name: 'Student',
  cadre: 'General Cadre Only',
  durationDays: 180,
  background: 'Science',
  customBackground: '',
  dailyStudyTime: '4 Hours',
  startDate: new Date().toISOString().slice(0, 10),
};

const buildPlan = (profile: Profile): StudyDay[] => {
  const result: StudyDay[] = [];
  const start = new Date(profile.startDate);
  const subjects: SubjectName[] = ['Bangla', 'English', 'Bangladesh Affairs', 'General Science', 'ICT', 'Mathematical Reasoning', 'International Affairs', 'Mental Ability'];

  for (let day = 1; day <= profile.durationDays; day += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + day - 1);

    const tasks: StudyTask[] = Array.from({ length: 5 }, (_, index) => {
      const subject = subjects[(day + index) % subjects.length];
      const topicMap: Record<string, string[]> = {
        Bangla: ['Grammar rules', 'Sentence correction', 'Poetry review', 'Reading practice'],
        English: ['Vocabulary drill', 'Grammar revision', 'Sentence correction', 'Reading passage'],
        'Bangladesh Affairs': ['Constitution chapter', 'Current affairs', 'History review', 'Government structure'],
        'General Science': ['Biology notes', 'Chemistry review', 'Physics formulas', 'Environment review'],
        ICT: ['Excel basics', 'Networking', 'MS Word practice', 'Digital literacy'],
        'Mathematical Reasoning': ['Percentages', 'Ratio practice', 'Algebra', 'Data interpretation'],
        'International Affairs': ['Global issues', 'Diplomacy review', 'Regional relations', 'Current events'],
        'Mental Ability': ['Number series', 'Analogy', 'Logical reasoning', 'Coding-decoding'],
      };
      const title = topicMap[subject][index % topicMap[subject].length];
      return {
        id: `day-${day}-task-${index}`,
        subject,
        title,
        description: `Study ${title.toLowerCase()} and revise the most important points.`,
        duration: [25, 30, 35, 40, 45][index % 5],
        completed: false,
      };
    });

    const phase = phaseNames[Math.min(Math.floor((day - 1) / 36), phaseNames.length - 1)];
    result.push({
      day,
      date: date.toISOString().slice(0, 10),
      theme: defaultThemes[(day - 1) % defaultThemes.length],
      phase,
      tasks,
      completion: day <= 7 ? Math.round((day / 7) * 100) : 0,
      status: day <= 4 ? 'IN PROGRESS' : 'NOT STARTED',
      examScore: day <= 3 ? 75 + day * 5 : undefined,
    });
  }
  return result;
};

const getCurrentDayNumber = (profile: Profile | null): number => {
  if (!profile) return 1;
  const start = new Date(profile.startDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(profile.durationDays, diffDays + 1));
};

const addToast = (setToast: React.Dispatch<React.SetStateAction<{ id: number; message: string }[]>>, message: string) => {
  setToast((prev) => [...prev, { id: Date.now(), message }]);
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | null>(() => read<Profile | null>(STORAGE_KEYS.profile, null));
  const [plan, setPlan] = useState<StudyDay[]>(() => read<StudyDay[]>(STORAGE_KEYS.plan, []));
  const [progress, setProgress] = useState<Record<string, boolean>>(() => read<Record<string, boolean>>(STORAGE_KEYS.tasks, {}));
  const [notes, setNotes] = useState<Record<number, DailyNote>>(() => read<Record<number, DailyNote>>(STORAGE_KEYS.notes, {}));
  const [examResults, setExamResults] = useState<ExamAttempt[]>(() => read<ExamAttempt[]>(STORAGE_KEYS.examResults, []));
  const [errors, setErrors] = useState<ErrorLogEntry[]>(() => read<ErrorLogEntry[]>(STORAGE_KEYS.errors, []));
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => read<BookmarkItem[]>(STORAGE_KEYS.bookmarks, []));
  const [pyqBookmarks, setPyqBookmarks] = useState<string[]>(() => read<string[]>(STORAGE_KEYS.pyqBookmarks, []));
  const [settings, setSettings] = useState<Settings>(() => read<Settings>(STORAGE_KEYS.settings, { theme: 'light', notifications: true }));
  const [toast, setToast] = useState<{ id: number; message: string }[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (profile) save(STORAGE_KEYS.profile, profile);
  }, [profile]);
  useEffect(() => save(STORAGE_KEYS.plan, plan), [plan]);
  useEffect(() => save(STORAGE_KEYS.tasks, progress), [progress]);
  useEffect(() => save(STORAGE_KEYS.notes, notes), [notes]);
  useEffect(() => save(STORAGE_KEYS.examResults, examResults), [examResults]);
  useEffect(() => save(STORAGE_KEYS.errors, errors), [errors]);
  useEffect(() => save(STORAGE_KEYS.bookmarks, bookmarks), [bookmarks]);
  useEffect(() => save(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => save(STORAGE_KEYS.pyqBookmarks, pyqBookmarks), [pyqBookmarks]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.theme === 'dark');
  }, [settings.theme]);

  useEffect(() => {
    if (!toast.length) return;
    const timer = window.setTimeout(() => setToast((prev) => prev.slice(1)), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const createProfile = (setup: SetupState) => {
    const generated: Profile = {
      id: `profile-${Date.now()}`,
      name: setup.name || 'Student',
      cadre: setup.cadre,
      durationDays: setup.durationDays,
      background: setup.background,
      customBackground: setup.customBackground,
      dailyStudyTime: setup.dailyStudyTime,
      startDate: setup.startDate,
      createdAt: new Date().toISOString(),
    };
    const newPlan = buildPlan(generated);
    setProfile(generated);
    setPlan(newPlan);
    setProgress({});
    setNotes({});
    setExamResults([]);
    setErrors([]);
    setBookmarks([]);
    navigate('/dashboard');
  };

  const toggleTask = (taskId: string) => {
    setProgress((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    addToast(setToast, 'Task updated.');
  };

  const updateDayNote = (dayNumber: number, field: keyof DailyNote, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [dayNumber]: {
        learned: '', mistakes: '', importantFacts: '', revise: '',
        ...(prev[dayNumber] || {}),
        [field]: value,
      },
    }));
  };

  const addErrorLog = (payload: Partial<ErrorLogEntry>) => {
    const entry: ErrorLogEntry = {
      id: `error-${Date.now()}`,
      subject: (payload.subject as SubjectName) || 'General',
      topic: payload.topic || 'General review',
      question: payload.question || 'Not provided',
      myAnswer: payload.myAnswer || 'N/A',
      correctAnswer: payload.correctAnswer || 'N/A',
      whyWrong: payload.whyWrong || 'Need revision',
      revisionDate: payload.revisionDate || new Date().toISOString().slice(0, 10),
      status: payload.status || 'Unreviewed',
      createdAt: new Date().toISOString(),
    };
    setErrors((prev) => [entry, ...prev]);
    addToast(setToast, 'Saved to error log.');
  };

  const handleExamSubmit = (day: number, questions: ExamQuestion[], answers: Record<string, string>) => {
    let correct = 0;
    questions.forEach((q) => {
      const selected = answers[q.id];
      const expected = q.options[q.answer];
      if (selected === expected) correct += 1;
    });
    const total = questions.length;
    const percentage = Number(((correct / total) * 100).toFixed(1));
    const attempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      day,
      score: correct,
      total,
      percentage,
      correct,
      wrong: total - correct,
      submittedAt: new Date().toISOString(),
      answers,
      questions,
    };
    setExamResults((prev) => [attempt, ...prev]);
    setPlan((prevPlan) => prevPlan.map((d) => d.day === day ? { ...d, status: percentage >= 80 ? 'EXAM PASSED' : 'REVIEW REQUIRED', completion: Math.max(d.completion, 80), examScore: percentage } : d));
    addToast(setToast, `Exam submitted: ${correct}/${total} (${percentage}%)`);
    navigate('/progress');
  };

  const resetAllProgress = () => {
    const confirmReset = window.confirm('This will clear all saved study progress. Continue?');
    if (!confirmReset) return;
    localStorage.clear();
    setProfile(null);
    setPlan([]);
    setProgress({});
    setNotes({});
    setExamResults([]);
    setErrors([]);
    setBookmarks([]);
    setPyqBookmarks([]);
    setSettings({ theme: 'light', notifications: true });
    navigate('/');
  };

  const exportProgress = () => {
    const payload = { profile, plan, progress, notes, examResults, errors, bookmarks, settings };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bcs-prep-progress.json';
    anchor.click();
    URL.revokeObjectURL(url);
    addToast(setToast, 'Progress exported.');
  };

  const importProgress = (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.profile) setProfile(data.profile);
      if (data.plan) setPlan(data.plan);
      if (data.progress) setProgress(data.progress);
      if (data.notes) setNotes(data.notes);
      if (data.examResults) setExamResults(data.examResults);
      if (data.errors) setErrors(data.errors);
      if (data.bookmarks) setBookmarks(data.bookmarks);
      if (data.settings) setSettings(data.settings);
      addToast(setToast, 'Progress imported.');
    } catch {
      addToast(setToast, 'Invalid import file.');
    }
  };

  const currentDayNumber = getCurrentDayNumber(profile);
  const activePlan = plan.length ? plan : (profile ? buildPlan(profile) : []);

  const resultsSummary = useMemo(() => {
    const totalTasks = activePlan.reduce((sum, day) => sum + day.tasks.length, 0);
    const completedTasks = Object.values(progress).filter(Boolean).length;
    const completion = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, completion };
  }, [activePlan, progress]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const items: { type: string; title: string }[] = [];
    activePlan.forEach((day) => {
      if (day.theme.toLowerCase().includes(q) || day.phase.toLowerCase().includes(q)) {
        items.push({ type: 'Day', title: `Day ${day.day}: ${day.theme}` });
      }
    });
    bookmarks.forEach((item) => {
      if (item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)) items.push({ type: item.type, title: item.title });
    });
    errors.forEach((item) => {
      if (item.topic.toLowerCase().includes(q) || item.question.toLowerCase().includes(q)) items.push({ type: 'Error', title: item.topic });
    });
    Object.entries(notes).forEach(([day, note]) => {
      const combined = `${note.learned} ${note.mistakes} ${note.importantFacts} ${note.revise}`.toLowerCase();
      if (combined.includes(q)) items.push({ type: 'Note', title: `Day ${day} notes` });
    });
    return items.slice(0, 8);
  }, [search, activePlan, bookmarks, errors, notes]);

  return (
    <div className={`app-shell ${settings.theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="app-body">
        <aside className="sidebar">
          <div className="brand-box">
            <div className="brand-mark">BCS</div>
            <div>
              <strong>Preparation</strong>
              <small>Adaptive roadmap</small>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/" end><Compass size={17} /> Overview</NavLink>
            <NavLink to="/setup"><Target size={17} /> Setup</NavLink>
            <NavLink to="/dashboard"><ClipboardList size={17} /> Dashboard</NavLink>
            <NavLink to="/plan"><CalendarDays size={17} /> Daily Plan</NavLink>
            <NavLink to="/progress"><CheckCheck size={17} /> Progress</NavLink>
            <NavLink to="/revision"><NotebookPen size={17} /> Revision</NavLink>
            <NavLink to="/error-log"><FolderOpen size={17} /> Error Log</NavLink>
            <NavLink to="/model-tests"><Sparkles size={17} /> Model Tests</NavLink>
            <NavLink to="/previous-questions"><Search size={17} /> Previous Questions</NavLink>
            <NavLink to="/bookmarks"><Star size={17} /> Bookmarks</NavLink>
            <NavLink to="/profile"><User size={17} /> Profile</NavLink>
            <NavLink to="/settings"><SettingsIcon size={17} /> Settings</NavLink>
          </nav>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="search-box">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subjects, notes, topics, questions..." />
            </div>
            <div className="top-actions">
              <button className="ghost-button" onClick={() => setSettings((prev) => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}>
                {settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              {profile && <span className="user-pill">Hi, {profile.name}</span>}
            </div>
          </header>

          {search && (
            <div className="search-results">
              {searchResults.length ? searchResults.map((item, index) => (
                <div key={`${item.title}-${index}`} className="search-item">
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                </div>
              )) : <div className="search-empty">No matches found.</div>}
            </div>
          )}

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupWizard defaultValues={profile ? { ...defaultSetup, name: profile.name, cadre: profile.cadre, durationDays: profile.durationDays, background: profile.background, dailyStudyTime: profile.dailyStudyTime, startDate: profile.startDate } : defaultSetup} onSubmit={createProfile} />} />
            <Route path="/dashboard" element={profile ? <DashboardPage profile={profile} plan={activePlan} progress={progress} setProgress={setProgress} currentDayNumber={currentDayNumber} addToast={(msg) => addToast(setToast, msg)} /> : <EmptyState text="No profile yet. Start your preparation setup first." actionLabel="Open setup" action={() => navigate('/setup')} />} />
            <Route path="/plan" element={<PlanPage plan={activePlan} progress={progress} onToggleTask={toggleTask} />} />
            <Route path="/day/:dayNumber" element={<DayDetailPage plan={activePlan} notes={notes} progress={progress} onToggleTask={toggleTask} onNoteChange={updateDayNote} onAddError={addErrorLog} />} />
            <Route path="/exam/:dayNumber" element={<ExamPage plan={activePlan} onSubmit={handleExamSubmit} />} />
            <Route path="/progress" element={<ProgressPage plan={activePlan} progress={progress} examResults={examResults} profile={profile} />} />
            <Route path="/revision" element={<RevisionPage errors={errors} />} />
            <Route path="/error-log" element={<ErrorLogPage errors={errors} onAddError={addErrorLog} />} />
            <Route path="/model-tests" element={<ModelTestsPage />} />
            <Route path="/previous-questions" element={<PreviousQuestionsPage pyqBookmarks={pyqBookmarks} setPyqBookmarks={setPyqBookmarks} />} />
            <Route path="/previous-questions/:year" element={<PreviousQuestionsPage pyqBookmarks={pyqBookmarks} setPyqBookmarks={setPyqBookmarks} />} />
            <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks} />} />
            <Route path="/profile" element={<ProfilePage profile={profile} />} />
            <Route path="/settings" element={<SettingsPage settings={settings} onThemeToggle={() => setSettings((p) => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }))} onReset={resetAllProgress} onExport={exportProgress} onImport={importProgress} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {toast.length > 0 && <div className="toast-stack">{toast.map((item) => <div key={item.id} className="toast">{item.message}</div>)}</div>}
    </div>
  );
}

function LandingPage() {
  const features = ['Personalized Roadmap', 'Daily Study Planner', 'Daily MCQ Exam', 'Progress Tracking', 'Error Log', 'Model Tests'];
  const stats = [
    { label: 'Subjects', value: '10+' },
    { label: 'Daily Tasks', value: '4–5' },
    { label: 'MCQ Practice', value: 'Daily' },
    { label: 'Progress Tracking', value: 'Live' },
  ];

  return (
    <div className="page-shell">
      <section className="hero-card large">
        <div>
          <span className="eyebrow">Smart BCS preparation</span>
          <h1>BCS Preparation — Structured. Personalized. Trackable.</h1>
          <p>Build your BCS preparation day by day with personalized study plans, daily exams, progress tracking and intelligent revision.</p>
          <div className="cta-row">
            <Link to="/setup" className="primary-button">Start Preparation</Link>
            <a href="#features" className="secondary-button">View Demo</a>
          </div>
        </div>
        <div className="mini-panel">
          <div className="mini-metric"><span>Current phase</span><strong>Phase 2</strong></div>
          <div className="mini-metric"><span>Study streak</span><strong>🔥 7 days</strong></div>
          <div className="mini-metric"><span>Study target</span><strong>4 hrs/day</strong></div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section id="features" className="feature-grid">
        {features.map((item) => (
          <div key={item} className="feature-card">
            <h3>{item}</h3>
            <p>Structured learning support with practical tracking and measurable progress.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function SetupWizard({ defaultValues, onSubmit }: { defaultValues: SetupState; onSubmit: (setup: SetupState) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultValues);

  const steps = [
    {
      title: 'Target Cadre',
      body: (
        <div className="choice-grid">
          {cadreOptions.map((item) => (
            <button key={item} className={`choice-card ${form.cadre === item ? 'active' : ''}`} onClick={() => setForm({ ...form, cadre: item })}>
              <h4>{item}</h4>
              {item === 'General + Technical/Professional Cadre' && <small>Technical/professional candidates get extra subject-specific study time.</small>}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Preparation Duration',
      body: (
        <div className="choice-grid">
          {durationOptions.map((item) => (
            <button key={item.value} className={`choice-card ${form.durationDays === item.value ? 'active' : ''}`} onClick={() => setForm({ ...form, durationDays: item.value })}>
              <h4>{item.label}</h4>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Academic Background',
      body: (
        <div className="choice-grid">
          {academicOptions.map((item) => (
            <button key={item} className={`choice-card ${form.background === item ? 'active' : ''}`} onClick={() => setForm({ ...form, background: item })}>
              <h4>{item}</h4>
            </button>
          ))}
          <label className="field">
            <span>Custom subject</span>
            <input value={form.customBackground} onChange={(e) => setForm({ ...form, customBackground: e.target.value })} placeholder="Type your subject if not listed" />
          </label>
        </div>
      ),
    },
    {
      title: 'Daily Study Time',
      body: (
        <div className="choice-grid">
          {studyTimeOptions.map((item) => (
            <button key={item} className={`choice-card ${form.dailyStudyTime === item ? 'active' : ''}`} onClick={() => setForm({ ...form, dailyStudyTime: item })}>
              <h4>{item}</h4>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Study Start Date',
      body: (
        <label className="field">
          <span>Study start date</span>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </label>
      ),
    },
    {
      title: 'Confirmation',
      body: (
        <div className="summary-card">
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Target Cadre:</strong> {form.cadre}</p>
          <p><strong>Duration:</strong> {form.durationDays} Days</p>
          <p><strong>Background:</strong> {form.customBackground || form.background}</p>
          <p><strong>Daily Study Time:</strong> {form.dailyStudyTime}</p>
          <p><strong>Start Date:</strong> {form.startDate}</p>
        </div>
      ),
    },
  ];

  const nextDisabled = step === 0 ? !form.cadre : step === 1 ? !form.durationDays : step === 2 ? !form.background : step === 3 ? !form.dailyStudyTime : step === 4 ? !form.startDate : false;

  return (
    <div className="page-shell">
      <div className="wizard-card">
        <div className="section-head">
          <div>
            <span className="eyebrow">Setup wizard</span>
            <h2>{steps[step].title}</h2>
          </div>
        </div>
        {step === 0 && (
          <label className="field">
            <span>Your name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" />
          </label>
        )}
        {steps[step].body}
        <div className="wizard-actions">
          <button className="ghost-button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Previous</button>
          {step < steps.length - 1 ? (
            <button className="primary-button" disabled={nextDisabled} onClick={() => setStep((s) => s + 1)}>Next</button>
          ) : (
            <button className="primary-button" onClick={() => onSubmit(form)}>Generate My BCS Plan</button>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ profile, plan, progress, setProgress, currentDayNumber, addToast }: { profile: Profile; plan: StudyDay[]; progress: Record<string, boolean>; setProgress: React.Dispatch<React.SetStateAction<Record<string, boolean>>>; currentDayNumber: number; addToast: (msg: string) => void; }) {
  const currentDay = plan.find((d) => d.day === currentDayNumber) || plan[0] || { day: 1, theme: 'BCS Foundation', phase: 'Phase 1', tasks: [] as StudyTask[], completion: 0, status: 'NOT STARTED' as DayStatus };
  const overall = Math.min(100, Math.round((currentDayNumber / Math.max(profile.durationDays || 180, 1)) * 100));

  return (
    <div className="page-shell">
      <section className="dash-header-card">
        <div>
          <span className="eyebrow">Good morning, {profile.name}</span>
          <h2>Day {currentDayNumber} of {profile.durationDays}</h2>
        </div>
        <div className="mini-stats">
          <div><span>Current phase</span><strong>{currentDay.phase}</strong></div>
          <div><span>Current streak</span><strong>🔥 7 days</strong></div>
        </div>
      </section>

      <section className="summary-card">
        <div className="ring-row">
          <div className="ring" style={{ ['--value' as any]: overall }}>
            <span>{overall}%</span>
          </div>
          <div>
            <strong>Overall Preparation</strong>
            <p>Keep your daily study rhythm consistent to build momentum.</p>
          </div>
        </div>
      </section>

      <section className="today-card">
        <div className="section-head">
          <h3>Today's Mission</h3>
          <span>DAY {currentDay.day}</span>
        </div>
        <h4>{currentDay.theme}</h4>
        {currentDay.tasks.length ? currentDay.tasks.map((task) => (
          <label key={task.id} className="task-row">
            <input type="checkbox" checked={!!progress[task.id]} onChange={() => { setProgress((prev) => ({ ...prev, [task.id]: !prev[task.id] })); addToast('Task updated.'); }} />
            <div className="task-content">
              <span className={`tag ${subjectPalette[task.subject] || 'tag-default'}`}>{task.subject}</span>
              <strong>{task.title}</strong>
              <small>{task.description}</small>
            </div>
            <span className="task-time">{task.duration} min</span>
          </label>
        )) : <p>No tasks available for this day yet.</p>}
      </section>
    </div>
  );
}

function PlanPage({ plan, progress, onToggleTask }: { plan: StudyDay[]; progress: Record<string, boolean>; onToggleTask: (taskId: string) => void; }) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <h2>Daily plan</h2>
      </div>
      <div className="day-grid">
        {plan.map((day) => (
          <div key={day.day} className="day-card">
            <div className="day-card-head">
              <div>
                <span>Day {day.day}</span>
                <h4>{day.theme}</h4>
              </div>
              <span className="status-tag">{day.status}</span>
            </div>
            <div className="meta-row"><span>{day.date}</span><span>{day.phase}</span></div>
            <div className="progress-line"><span style={{ width: `${day.completion}%` }} /></div>
            <div className="mini-summary"><small>{day.completion}% complete</small><small>{day.examScore ? `Score: ${day.examScore}%` : 'Exam not taken'}</small></div>
            <div className="task-mini">
              {day.tasks.slice(0, 3).map((task) => (
                <label key={task.id}>
                  <input type="checkbox" checked={!!progress[task.id]} onChange={() => onToggleTask(task.id)} />
                  <span>{task.title}</span>
                </label>
              ))}
            </div>
            <Link to={`/day/${day.day}`} className="small-link">Open day</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayDetailPage({ plan, notes, progress, onToggleTask, onNoteChange, onAddError }: { plan: StudyDay[]; notes: Record<number, DailyNote>; progress: Record<string, boolean>; onToggleTask: (taskId: string) => void; onNoteChange: (day: number, field: keyof DailyNote, value: string) => void; onAddError: (payload: Partial<ErrorLogEntry>) => void; }) {
  const { dayNumber } = useParams();
  const day = plan.find((d) => d.day === Number(dayNumber)) || plan[0];
  const note = notes[Number(dayNumber)] || { learned: '', mistakes: '', importantFacts: '', revise: '' };

  if (!day) return <NotFoundPage />;

  return (
    <div className="page-shell">
      <div className="day-detail-header">
        <div>
          <span className="eyebrow">DAY {day.day}</span>
          <h2>{day.theme}</h2>
          <p>Phase: {day.phase}</p>
        </div>
        <div className="stat-box">
          <span>Estimated total time</span>
          <strong>{day.tasks.reduce((sum, task) => sum + task.duration, 0)} minutes</strong>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Task list</h3>
          {day.tasks.map((task) => (
            <div key={task.id} className="task-detail">
              <div className="task-box">
                <span className={`tag ${subjectPalette[task.subject] || 'tag-default'}`}>{task.subject}</span>
                <div>
                  <strong>{task.title}</strong>
                  <small>{task.description}</small>
                </div>
              </div>
              <div className="task-actions">
                <span>{task.duration} min</span>
                <button className="small-button" onClick={() => onToggleTask(task.id)}>{progress[task.id] ? 'Completed' : 'Mark Complete'}</button>
              </div>
            </div>
          ))}
        </section>

        <section className="panel">
          <h3>Daily notes</h3>
          <label className="field"><span>What I learned</span><textarea value={note.learned} onChange={(e) => onNoteChange(day.day, 'learned', e.target.value)} /></label>
          <label className="field"><span>Mistakes I made</span><textarea value={note.mistakes} onChange={(e) => onNoteChange(day.day, 'mistakes', e.target.value)} /></label>
          <label className="field"><span>Important facts</span><textarea value={note.importantFacts} onChange={(e) => onNoteChange(day.day, 'importantFacts', e.target.value)} /></label>
          <label className="field"><span>Things to revise</span><textarea value={note.revise} onChange={(e) => onNoteChange(day.day, 'revise', e.target.value)} /></label>
        </section>
      </div>

      <section className="panel exam-panel">
        <h3>Day exam</h3>
        <Link to={`/exam/${day.day}`} className="primary-button">Take Day {day.day} Exam</Link>
        {!day.tasks.every((task) => progress[task.id]) && <p className="reminder">Reminder: not all study tasks are completed yet, but the exam is still available.</p>}
        <button className="ghost-button" onClick={() => onAddError({ subject: day.tasks[0]?.subject || 'General', topic: day.theme, question: 'Daily study review', myAnswer: 'Unanswered', correctAnswer: 'Review daily notes', whyWrong: 'Need better retention', revisionDate: new Date().toISOString().slice(0, 10), status: 'Unreviewed' })}>Add to Error Log</button>
      </section>
    </div>
  );
}

function ExamPage({ plan, onSubmit }: { plan: StudyDay[]; onSubmit: (day: number, questions: ExamQuestion[], answers: Record<string, string>) => void; }) {
  const { dayNumber } = useParams();
  const day = Number(dayNumber || 1);
  const baseQuestions = sampleQuestions.slice(0, 10);
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    const raw = localStorage.getItem(`day-exam-${day}`);
    if (raw) {
      try { return JSON.parse(raw) as ExamQuestion[]; } catch { return baseQuestions; }
    }
    return baseQuestions;
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem(`day-exam-${day}`, JSON.stringify(questions));
  }, [questions, day]);

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="page-shell">
      <div className="exam-card">
        <div className="exam-top">
          <div>
            <span className="eyebrow">Day {day} exam</span>
            <h2>{plan.find((d) => d.day === day)?.theme || 'Daily exam'}</h2>
          </div>
          <div className="timer-box">
            <strong>15 questions</strong>
            <small>{answeredCount} answered</small>
          </div>
        </div>

        <div className="progress-bar"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>

        <div className="question-box">
          <p className="question-count">Question {index + 1} / {questions.length}</p>
          <h3>{current.question}</h3>
          <div className="options-list">
            {current.options.map((option, optionIndex) => (
              <button key={option} className={`option-btn ${answers[current.id] === option ? 'selected' : ''}`} onClick={() => setAnswers((prev) => ({ ...prev, [current.id]: option }))}>
                {String.fromCharCode(65 + optionIndex)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-actions">
          <button className="ghost-button" onClick={() => setIndex((i) => Math.max(0, i - 1))}>Previous</button>
          <button className="ghost-button" onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}>Next</button>
          <button className="primary-button" onClick={() => onSubmit(day, questions, answers)}>Submit Exam</button>
        </div>
      </div>
    </div>
  );
}

function ProgressPage({ plan, progress, examResults, profile }: { plan: StudyDay[]; progress: Record<string, boolean>; examResults: ExamAttempt[]; profile: Profile | null; }) {
  const totalTasks = plan.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = Object.values(progress).filter(Boolean).length;
  const average = examResults.length ? Math.round(examResults.reduce((sum, item) => sum + item.percentage, 0) / examResults.length) : 0;
  const best = examResults.length ? Math.max(...examResults.map((item) => item.percentage)) : 0;

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Progress</h2></div>
      <div className="stats-grid">
        <div className="stat-card"><span>Overall completion</span><strong>{Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)}%</strong></div>
        <div className="stat-card"><span>Tasks completed</span><strong>{completedTasks}</strong></div>
        <div className="stat-card"><span>Days completed</span><strong>{plan.filter((day) => day.status !== 'NOT STARTED').length}</strong></div>
        <div className="stat-card"><span>Exams taken</span><strong>{examResults.length}</strong></div>
        <div className="stat-card"><span>Average exam score</span><strong>{average}%</strong></div>
        <div className="stat-card"><span>Best score</span><strong>{best}%</strong></div>
        <div className="stat-card"><span>Current streak</span><strong>🔥 7 days</strong></div>
        <div className="stat-card"><span>Longest streak</span><strong>12 days</strong></div>
      </div>

      <div className="panel">
        <h3>Subject performance</h3>
        <div className="subject-list">
          {['Bangla', 'English', 'Bangladesh Affairs', 'International Affairs', 'General Science', 'ICT', 'Mathematical Reasoning', 'Mental Ability', 'Ethics, Values & Good Governance'].map((subject, idx) => (
            <div key={subject} className="subject-progress-row">
              <span>{subject}</span>
              <div className="subject-bar"><span style={{ width: `${68 + idx * 3}%` }} /></div>
              <strong>{68 + idx * 3}%</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3>Weekly performance</h3>
        <div className="bars">
          {[48, 63, 70, 79, 81, 88, 90].map((value, index) => (
            <div key={index} className="bar-group"><span className="bar" style={{ height: `${value}%` }} /><small>{index + 1}</small></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevisionPage({ errors }: { errors: ErrorLogEntry[] }) {
  const due = errors.slice(0, 4);

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Revision</h2></div>
      <div className="panel">
        <h3>Revision due today</h3>
        {due.length ? due.map((item, index) => (
          <div key={`${item.topic}-${index}`} className="revision-row">
            <strong>{item.topic}</strong>
            <small>{item.subject} • {item.revisionDate}</small>
          </div>
        )) : <p>No revision items due today.</p>}
      </div>
    </div>
  );
}

function ErrorLogPage({ errors, onAddError }: { errors: ErrorLogEntry[]; onAddError: (payload: Partial<ErrorLogEntry>) => void; }) {
  const [draft, setDraft] = useState({
    subject: 'Bangladesh Affairs',
    topic: 'Constitution',
    question: 'Review question',
    myAnswer: 'A',
    correctAnswer: 'B',
    whyWrong: 'Misread the key article.',
    revisionDate: new Date().toISOString().slice(0, 10),
    status: 'Unreviewed' as ErrorLogEntry['status'],
  });

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Error log</h2></div>
      <div className="two-column">
        <section className="panel">
          <h3>Add mistake</h3>
          <label className="field"><span>Subject</span><input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value as any })} /></label>
          <label className="field"><span>Topic</span><input value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} /></label>
          <label className="field"><span>Question</span><input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} /></label>
          <label className="field"><span>My answer</span><input value={draft.myAnswer} onChange={(e) => setDraft({ ...draft, myAnswer: e.target.value })} /></label>
          <label className="field"><span>Correct answer</span><input value={draft.correctAnswer} onChange={(e) => setDraft({ ...draft, correctAnswer: e.target.value })} /></label>
          <label className="field"><span>Why I got it wrong</span><textarea value={draft.whyWrong} onChange={(e) => setDraft({ ...draft, whyWrong: e.target.value })} /></label>
          <label className="field"><span>Revision date</span><input type="date" value={draft.revisionDate} onChange={(e) => setDraft({ ...draft, revisionDate: e.target.value })} /></label>
          <button className="primary-button" onClick={() => onAddError(draft)}>Save mistake</button>
        </section>

        <section className="panel">
          <h3>Recent mistakes</h3>
          {errors.length ? errors.map((entry) => (
            <div key={entry.id} className="error-item">
              <div className="error-head"><strong>{entry.topic}</strong><span>{entry.status}</span></div>
              <small>{entry.subject}</small>
              <p>{entry.question}</p>
            </div>
          )) : <p>No mistake logged yet.</p>}
        </section>
      </div>
    </div>
  );
}

function ModelTestsPage() {
  const [mode, setMode] = useState('Full MCQ Test');
  const [count, setCount] = useState(50);

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Model tests</h2></div>
      <div className="panel">
        <div className="choice-grid compact">
          {['Full MCQ Test', 'Subject Test', 'Mixed Test', 'Previous Year Practice', 'Timed Test'].map((item) => (
            <button key={item} className={`choice-card ${mode === item ? 'active' : ''}`} onClick={() => setMode(item)}><h4>{item}</h4></button>
          ))}
        </div>

        <div className="field-row">
          {[50, 100, 200].map((item) => (
            <button key={item} className={`small-button ${count === item ? 'selected' : ''}`} onClick={() => setCount(item)}>{item}</button>
          ))}
        </div>

        <button className="primary-button" onClick={() => window.alert(`Starting ${mode} with ${count} questions.`)}>Start {mode}</button>
      </div>
    </div>
  );
}

function PreviousQuestionsPage({ pyqBookmarks, setPyqBookmarks }: { pyqBookmarks: string[]; setPyqBookmarks: React.Dispatch<React.SetStateAction<string[]>>; }) {
  const { year } = useParams();
  const [selectedYear, setSelectedYear] = useState(year || '46th');
  const [examType, setExamType] = useState<'Preliminary' | 'Written' | 'Viva'>('Preliminary');
  const [subject, setSubject] = useState('All Subjects');
  const [mode, setMode] = useState<'Study' | 'Exam'>('Study');
  const [search, setSearch] = useState('');

  const years = Array.from(new Set(pyqDemoData.map((item) => item.bcs))).sort((a, b) => Number(a.replace(/[^0-9]/g, '')) - Number(b.replace(/[^0-9]/g, '')));

  const filtered = pyqDemoData.filter((item) => {
    const matchesYear = item.bcs === selectedYear;
    const matchesType = item.exam === examType;
    const matchesSubject = subject === 'All Subjects' || item.subject === subject;
    const matchesSearch = !search || [item.question, item.subject, item.topic, item.bcs].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesType && matchesSubject && matchesSearch;
  });

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Previous questions</h2></div>
      <div className="panel">
        <div className="filters-grid">
          <label className="field"><span>Select BCS Year</span><select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="field"><span>Exam type</span><select value={examType} onChange={(e) => setExamType(e.target.value as 'Preliminary' | 'Written' | 'Viva')}><option value="Preliminary">Preliminary</option><option value="Written">Written</option><option value="Viva">Viva</option></select></label>
          <label className="field"><span>Subject filter</span><select value={subject} onChange={(e) => setSubject(e.target.value)}><option>All Subjects</option><option>Bangla</option><option>English</option><option>Bangladesh Affairs</option><option>International Affairs</option><option>General Science</option><option>ICT</option><option>Mathematical Reasoning</option><option>Mental Ability</option><option>Ethics, Values & Good Governance</option></select></label>
          <label className="field"><span>Mode</span><select value={mode} onChange={(e) => setMode(e.target.value as 'Study' | 'Exam')}><option value="Study">Study Mode</option><option value="Exam">Exam Mode</option></select></label>
        </div>
        <label className="field"><span>Search previous-year questions</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by question or topic..." /></label>
      </div>

      <div className="panel">
        <h3>{selectedYear} BCS • {examType} Examination</h3>
        <p>Total Questions: {filtered.length}</p>
        {filtered.map((item) => (
          <div key={item.id} className="pyq-card">
            <div className="pyq-head">
              <strong>Question {item.questionNumber}</strong>
              <span className={`tag ${subjectPalette[item.subject] || 'tag-default'}`}>{item.subject}</span>
            </div>
            <p>{item.question}</p>
            <div className="options-list">
              {item.options.map((option, idx) => <div key={`${item.id}-${idx}`} className="option-row">{String.fromCharCode(65 + idx)}. {option}</div>)}
            </div>
            {mode === 'Study' && item.correctAnswer !== null && (
              <div className="explanation-box">
                <p><strong>Correct Answer:</strong> {item.options[item.correctAnswer]}</p>
                <p><strong>Explanation:</strong> {item.explanation || 'Explanation not available.'}</p>
              </div>
            )}
            <div className="inline-actions">
              <button className="ghost-button" onClick={() => setPyqBookmarks((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])}>{pyqBookmarks.includes(item.id) ? 'Bookmarked' : 'Bookmark'}</button>
              <button className="ghost-button" onClick={() => {
                const entry: ErrorLogEntry = { id: `pyq-${Date.now()}`, subject: item.subject as SubjectName, topic: item.topic, question: item.question, myAnswer: 'Unanswered', correctAnswer: item.correctAnswer !== null ? item.options[item.correctAnswer] : 'Answer not available', whyWrong: 'Need more revision', revisionDate: new Date().toISOString().slice(0, 10), status: 'Unreviewed', createdAt: new Date().toISOString() };
                const existing = read<ErrorLogEntry[]>(STORAGE_KEYS.errors, []);
                save(STORAGE_KEYS.errors, [entry, ...existing]);
                window.alert('Added to error log.');
              }}>Add to Error Log</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookmarksPage({ bookmarks }: { bookmarks: BookmarkItem[] }) {
  return (
    <div className="page-shell">
      <div className="page-header"><h2>Bookmarks</h2></div>
      <div className="panel">
        {bookmarks.length ? bookmarks.map((item) => (
          <div key={item.id} className="bookmark-item">
            <div className="bookmark-top"><span>{item.type}</span><strong>{item.title}</strong></div>
            <small>{item.detail}</small>
          </div>
        )) : <p>No bookmarks saved yet.</p>}
      </div>
    </div>
  );
}

function ProfilePage({ profile }: { profile: Profile | null }) {
  if (!profile) return <EmptyState text="No profile has been created yet." actionLabel="Create profile" action={() => (window.location.href = '/setup')} />;

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Profile</h2></div>
      <div className="panel">
        <div className="profile-row"><span>Name</span><strong>{profile.name}</strong></div>
        <div className="profile-row"><span>Target Cadre</span><strong>{profile.cadre}</strong></div>
        <div className="profile-row"><span>Preparation Duration</span><strong>{profile.durationDays} days</strong></div>
        <div className="profile-row"><span>Background</span><strong>{profile.customBackground || profile.background}</strong></div>
        <div className="profile-row"><span>Daily Study Time</span><strong>{profile.dailyStudyTime}</strong></div>
        <div className="profile-row"><span>Start Date</span><strong>{profile.startDate}</strong></div>
      </div>
    </div>
  );
}

function SettingsPage({ settings, onThemeToggle, onReset, onExport, onImport }: { settings: Settings; onThemeToggle: () => void; onReset: () => void; onExport: () => void; onImport: (json: string) => void; }) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="page-shell">
      <div className="page-header"><h2>Settings</h2></div>
      <div className="panel">
        <label className="switch-row"><span>Dark mode</span><input type="checkbox" checked={settings.theme === 'dark'} onChange={onThemeToggle} /></label>
        <label className="switch-row"><span>Notifications</span><input type="checkbox" checked={settings.notifications} onChange={() => {}} /></label>
        <div className="button-stack">
          <button className="ghost-button" onClick={onExport}>Export progress</button>
          <button className="ghost-button" onClick={() => fileInputRef.current?.click()}>Import progress</button>
          <button className="ghost-button danger" onClick={onReset}>Reset all progress</button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onImport(String(reader.result || ''));
          reader.readAsText(file);
        }} />
      </div>
    </div>
  );
}

function EmptyState({ text, actionLabel, action }: { text: string; actionLabel: string; action: () => void; }) {
  return (
    <div className="page-shell center-box">
      <div className="panel empty-state">
        <h3>{text}</h3>
        <button className="primary-button" onClick={action}>{actionLabel}</button>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page-shell center-box">
      <div className="panel empty-state">
        <h3>404 — Page not found</h3>
        <Link to="/" className="primary-button">Go home</Link>
      </div>
    </div>
  );
}

export default App;
