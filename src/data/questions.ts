import { MCQQuestion, SubjectName } from '../types';

const questionBank: Omit<MCQQuestion, 'id'>[] = [
  {
    subject: 'Bangladesh Affairs',
    topic: 'Constitution',
    question: 'What does Article 39 of the Constitution of Bangladesh guarantee?',
    options: ['Right to equality', 'Freedom of speech', 'Protection of property', 'Right to education'],
    answer: 0,
    explanation: 'Article 39 relates to equality of opportunity and protection of rights in the state structure. The basic idea is ensuring equal rights and access to public service and similar guarantees.',
  },
  {
    subject: 'Bangladesh Affairs',
    topic: 'Constitution',
    question: 'Who is the head of the executive authority in Bangladesh?',
    options: ['Prime Minister', 'President', 'Speaker', 'Chief Justice'],
    answer: 1,
    explanation: 'The President is the constitutional head of the state; the Prime Minister leads the government and executive functions in practice.',
  },
  {
    subject: 'Bangla',
    topic: 'Grammar',
    question: 'Which one is the correct spelling?',
    options: ['সদাচরণ', 'সদাচরন', 'সৎাচরণ', 'সদাচরন'],
    answer: 0,
    explanation: 'The correct spelling is “সদাচরণ” in Bangla standard orthography.',
  },
  {
    subject: 'English',
    topic: 'Vocabulary',
    question: 'Choose the correct synonym of “meticulous.”',
    options: ['Careless', 'Precise', 'Rude', 'Silent'],
    answer: 1,
    explanation: 'Meticulous means showing great attention to detail; “precise” is the closest synonym.',
  },
  {
    subject: 'General Science',
    topic: 'Biology',
    question: 'Which part of the plant cell controls the movement of substances in and out of the cell?',
    options: ['Nucleus', 'Cell membrane', 'Cell wall', 'Chloroplast'],
    answer: 1,
    explanation: 'The cell membrane is selectively permeable and regulates the flow of substances in and out of the cell.',
  },
  {
    subject: 'ICT',
    topic: 'Software',
    question: 'Which device is used to input data into a computer?',
    options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
    answer: 2,
    explanation: 'A keyboard is an input device used for entering text and commands into a computer system.',
  },
  {
    subject: 'Mathematical Reasoning',
    topic: 'Percentages',
    question: 'If 25% of a number is 40, what is the number?',
    options: ['120', '140', '160', '180'],
    answer: 2,
    explanation: '25% = 1/4. If one-fourth of the number is 40, the full number is 40 × 4 = 160.',
  },
  {
    subject: 'Mental Ability',
    topic: 'Number series',
    question: 'Find the next number: 2, 6, 12, 20, 30, ?',
    options: ['36', '42', '40', '48'],
    answer: 1,
    explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.',
  },
  {
    subject: 'International Affairs',
    topic: 'Global institutions',
    question: 'Which organization is known for maintaining international peace and security?',
    options: ['IMF', 'UN', 'WHO', 'ASEAN'],
    answer: 1,
    explanation: 'The United Nations is the primary international body for peacekeeping, diplomacy, and international cooperation.',
  },
  {
    subject: 'Ethics, Values & Good Governance',
    topic: 'Governance',
    question: 'Accountability in public administration primarily means:',
    options: ['Following personal interest', 'Answering for actions and decisions', 'Ignoring complaints', 'Limiting citizen participation'],
    answer: 1,
    explanation: 'Accountability means government officials and institutions are responsible and answerable for their decisions and actions.',
  },
  {
    subject: 'Geography / Environment / Disaster Management',
    topic: 'Climate',
    question: 'Which factor is the main cause of monsoon rainfall in Bangladesh?',
    options: ['Desert winds', 'Seasonal winds from ocean', 'Volcano eruption', 'Polar front'],
    answer: 1,
    explanation: 'The South Asian monsoon is caused by seasonal wind patterns influenced by moisture from the Bay of Bengal and the Indian Ocean.',
  },
  {
    subject: 'Bangladesh Affairs',
    topic: 'History',
    question: 'The language movement of 1952 was mainly centered on the demand for:',
    options: ['Economic rights', 'Language rights', 'Industrial policy', 'Voting rights'],
    answer: 1,
    explanation: 'The Language Movement was a demand for recognition of Bangla as a state language and a key step toward national identity.',
  },
  {
    subject: 'English',
    topic: 'Grammar',
    question: 'Choose the correct sentence:',
    options: ['He do not know the answer.', 'He does not know the answer.', 'He not know the answer.', 'He is not knowing the answer.'],
    answer: 1,
    explanation: 'With “he,” the correct auxiliary form is “does” in the present simple negative sentence.',
  },
  {
    subject: 'Technical / Professional Subject',
    topic: 'Engineering concepts',
    question: 'The SI unit of electric current is:',
    options: ['Volt', 'Watt', 'Ampere', 'Ohm'],
    answer: 2,
    explanation: 'Electric current is measured in amperes (A), named after André-Marie Ampère.',
  },
  {
    subject: 'Bangla',
    topic: 'Literature',
    question: 'Which one is a poetic form?',
    options: ['নাটক', 'গদ্য', 'কবিতা', 'উপন্যাস'],
    answer: 2,
    explanation: 'কবিতা is a poetic form written in verse and rhythm, unlike prose or drama.',
  },
];

export const generateExamQuestions = (day: number, subject: SubjectName = 'Bangladesh Affairs'): MCQQuestion[] => {
  const filtered = questionBank.filter((q) => q.subject === subject || q.subject === 'Bangladesh Affairs');
  const selected = filtered.length ? filtered : questionBank;
  return selected.slice(0, 15).map((question, index) => ({ ...question, id: `${day}-${index}-${question.subject}` }));
};

export const generateModelTestQuestions = (count: number): MCQQuestion[] =>
  questionBank.slice(0, Math.min(count, questionBank.length)).map((question, index) => ({ ...question, id: `model-${index}-${question.subject}` }));
