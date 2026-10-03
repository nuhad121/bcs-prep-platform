import { Profile, StudyDay, StudyTask, SubjectName } from '../types';
import { defaultThemes, genericSubjects, phaseNames } from './curriculum';

const subjectPool: SubjectName[] = [
  'Bangla',
  'English',
  'Bangladesh Affairs',
  'International Affairs',
  'General Science',
  'ICT',
  'Mathematical Reasoning',
  'Mental Ability',
  'Ethics, Values & Good Governance',
  'Technical / Professional Subject',
];

const titlesBySubject: Record<SubjectName, string[]> = {
  Bangla: ['Grammar rules', 'Literature notes', 'Poetry analysis', 'Reading comprehension'],
  English: ['Vocabulary drill', 'Grammar practice', 'Sentence correction', 'Reading passage'],
  'Bangladesh Affairs': ['Constitution chapter', 'Current affairs summary', 'History revision', 'Government structure'],
  'International Affairs': ['Global issues summary', 'UN & diplomacy', 'Regional relations', 'Current international events'],
  'General Science': ['Biology concept review', 'Physics formulas', 'Chemistry basics', 'Environmental science'],
  ICT: ['Excel fundamentals', 'Internet and networking', 'MS Word short practice', 'Digital literacy'],
  'Mathematical Reasoning': ['Percentage drill', 'Algebra revision', 'Ratio practice', 'Data interpretation'],
  'Mental Ability': ['Number series', 'Coding-decoding', 'Logical reasoning', 'Analogy practice'],
  'Ethics, Values & Good Governance': ['Good governance principles', 'Ethical analysis', 'Governance case study', 'Public accountability'],
  'Technical / Professional Subject': ['Core concept revision', 'Professional knowledge', 'System analysis', 'Technical case review'],
  'Written Exam': ['Essay outline practice', 'Answer-writing practice', 'Analysis and structure', 'Argument building'],
  'Viva Preparation': ['Mock viva questions', 'Interview confidence', 'Presentation practice', 'Q&A preparation'],
};

export const demoProfile: Profile = {
  id: 'demo-user',
  name: 'Demo Learner',
  cadre: 'General Cadre Only',
  durationDays: 180,
  background: 'Science',
  dailyStudyTime: '4 Hours',
  startDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  createdAt: new Date().toISOString(),
};

export const generateStudyPlan = (profile: Profile): StudyDay[] => {
  const plan: StudyDay[] = [];
  const startDate = new Date(profile.startDate);

  for (let day = 1; day <= profile.durationDays; day += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + day - 1);

    const tasks: StudyTask[] = Array.from({ length: 5 }, (_, index) => {
      const selectedSubject = genericSubjects[(day + index) % genericSubjects.length];
      const title = titlesBySubject[selectedSubject as SubjectName]?.[index % (titlesBySubject[selectedSubject as SubjectName]?.length ?? 1)] ?? 'Concept review';
      return {
        id: `day-${day}-${index}`,
        subject: selectedSubject as SubjectName,
        title,
        description: `Complete focused study on ${title.toLowerCase()} and revise the key facts.`,
        duration: [25, 30, 35, 40, 45][index % 5],
        completed: false,
      };
    });

    const phase = phaseNames[Math.min(Math.floor((day - 1) / 36), phaseNames.length - 1)];
    const completion = day <= 7 ? (day / 7) * 100 : 0;

    plan.push({
      day,
      date: date.toISOString().slice(0, 10),
      theme: defaultThemes[(day - 1) % defaultThemes.length],
      phase,
      tasks,
      completion,
      status: day <= 7 ? 'IN PROGRESS' : 'NOT STARTED',
      examScore: day <= 5 ? 75 + (day % 4) * 5 : undefined,
    });
  }

  return plan;
};

export const generateTodayMission = (dayNumber: number) => ({
  day: dayNumber,
  title: defaultThemes[(dayNumber - 1) % defaultThemes.length],
  phase: phaseNames[Math.min(Math.floor((dayNumber - 1) / 36), phaseNames.length - 1)],
  tasks: [
    { subject: 'Bangladesh Affairs', title: 'Study Fundamental Rights', description: 'Review key articles and examples.', duration: 45 },
    { subject: 'Bangla', title: 'Grammar rules', description: 'Practice sentence correction and idioms.', duration: 40 },
    { subject: 'English', title: 'Vocabulary', description: 'Improve target words and collocations.', duration: 30 },
    { subject: 'Mathematical Reasoning', title: 'Percentage practice', description: 'Solve 10 questions on profit and loss.', duration: 30 },
    { subject: 'Revision', title: 'Previous mistakes', description: 'Review common weak areas from yesterday.', duration: 20 },
  ],
});
