export type UserRole = 'teacher' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  classId?: string;
  className?: string;
  school?: string;
  subjectSpecialty?: string;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "10A1", "11B2"
  grade: string; // "10", "11", "12"
  academicYear: string; // "2024-2025"
  teacherId: string;
  teacherName?: string;
  studentCount: number;
  description?: string;
  createdAt: string;
}

export type BookSeries = 'Cánh Diều' | 'Kết Nối Tri Thức' | 'Chân Trời Sáng Tạo' | 'Bộ Chuẩn Khác';

export interface Course {
  id: string;
  title: string;
  subject: string; // "Toán học", "Vật lí", "Hóa học", "Ngữ văn", "Tiếng Anh", "Sinh học", "Lịch sử", "Tin học"...
  grade: string; // "10", "11", "12"
  bookSeries: BookSeries;
  teacherId: string;
  description: string;
  coverColor?: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description?: string;
}

export type LessonStatus = 'draft_ai' | 'teacher_reviewed' | 'published';

export interface LessonContentAI {
  title: string;
  objectives: string[];
  keyKnowledge: string[];
  concepts: { term: string; definition: string }[];
  formulas: { name: string; formula: string; note?: string }[];
  examples: { question: string; solution: string; explanation?: string }[];
  commonMistakes: { mistake: string; correction: string; advice: string }[];
  quickCheck: { question: string; options?: string[]; answer: string; hint?: string }[];
  summary: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  order: number;
  status: LessonStatus;
  durationMinutes: number;
  learningObjectives: string[];
  contentAI?: LessonContentAI;
  teacherNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaterialType = 'pdf' | 'docx' | 'pptx' | 'image' | 'video';

export interface Material {
  id: string;
  lessonId: string;
  type: MaterialType;
  filename: string;
  storageUrl: string;
  pageCount?: number;
  slideCount?: number;
  duration?: number; // in seconds for video
  required: boolean;
  fileSize?: string;
  createdAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedUnits: number;
  totalUnits: number;
  percentage: number;
  lastPosition: number; // page number or seconds in video
  viewedPages?: number[]; // list of distinct pages/slides viewed
  watchedSegments?: [number, number][]; // [startTime, endTime] watched
  isCompleted: boolean;
  lastOpenedAt: string;
  completedAt?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
export type DifficultyLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Kept secure on server during exams!
  explanation: string;
  hint1?: string;
  hint2?: string;
  difficulty: DifficultyLevel;
  learningObjective?: string;
  points: number;
  rubric?: string; // For essays
}

export interface PracticeQuiz {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  timeLimitMinutes: number;
  maxAttempts: number; // Default 3
  passPercentage: number; // e.g. 80
  questions: Question[];
  status: 'draft' | 'published';
  createdAt: string;
}

export interface PracticeAttempt {
  id: string;
  quizId: string;
  lessonId: string;
  userId: string;
  studentName?: string;
  attemptNumber: number; // 1, 2, or 3
  startedAt: string;
  deadline: string; // Server calculated deadline ISO
  submittedAt?: string;
  answers: Record<string, string>; // questionId -> studentAnswer
  score?: number;
  totalScore?: number;
  percentage?: number;
  passed?: boolean;
  isPassed?: boolean;
  correctCount?: number;
  totalQuestions?: number;
  status: 'in_progress' | 'submitted' | 'timed_out';
  durationSeconds?: number;
}

export type ExamType = 'chapter_review' | 'midterm' | 'final';
export type ExamStatus = 'draft_matrix' | 'approved_matrix' | 'generated_review' | 'published';

export interface ExamMatrixCell {
  chapter: string;
  nhanBiet: { countMC: number; countEssay: number; points: number };
  thongHieu: { countMC: number; countEssay: number; points: number };
  vanDung: { countMC: number; countEssay: number; points: number };
  vanDungCao: { countMC: number; countEssay: number; points: number };
  totalPoints: number;
}

export interface ExamMatrix {
  subject: string;
  grade: string;
  examType: ExamType;
  durationMinutes: number;
  totalScore: number;
  questionCount: number;
  cells: ExamMatrixCell[];
  summaryNote?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  classIds?: string[];
  title: string;
  type: ExamType;
  scope: string; // e.g., "Chương 1 & Chương 2"
  durationMinutes: number;
  totalScore: number;
  questionCount: number;
  status: ExamStatus;
  matrix?: ExamMatrix;
  specification?: string;
  questions: Question[];
  rubric?: string;
  scoringGuide?: string;
  teacherId: string;
  createdAt: string;
  publishedAt?: string;
}

export interface EssayGradingResult {
  questionId: string;
  scoreProposal: number;
  maxScore: number;
  reasoningSummary: string;
  confidence: number; // 0 to 1
  needsTeacherReview: boolean;
  teacherApprovedScore?: number;
  teacherNote?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  studentName: string;
  classId: string;
  className: string;
  startedAt: string;
  deadline: string;
  submittedAt?: string;
  answers: Record<string, string>; // questionId -> answer
  score?: number;
  totalScore: number;
  correctCount?: number;
  incorrectCount?: number;
  status: 'in_progress' | 'submitted' | 'graded' | 'needs_review';
  syncStatus: 'pending' | 'success' | 'failed';
  essayEvaluations?: Record<string, EssayGradingResult>;
  durationSeconds?: number;
  createdAt: string;
}

export interface SheetSyncRow {
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  chapter: string;
  lesson: string;
  assessmentType: string;
  attempt: number | string;
  correct: number;
  incorrect: number;
  score: number;
  duration: string;
  lessonProgress: string;
  submissionId: string;
}

export interface SheetSyncLog {
  id: string;
  attemptId: string;
  submissionId: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  chapter: string;
  lessonTitle: string;
  assessmentType: 'Practice' | 'Exam';
  attemptNumber: number;
  correct: number;
  incorrect: number;
  score: number;
  duration: string;
  lessonProgress: string;
  status: 'pending' | 'success' | 'failed';
  errorMsg?: string;
  syncedAt: string;
}

export interface SystemSettings {
  googleSheetsConnected: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  spreadsheetName?: string;
  autoSync: boolean;
  passingScoreThreshold: number; // Default 80%
  videoWatchThreshold: number; // Default 99%
  enableAiGrading: boolean;
  schoolName: string;
}

export interface AnalyticsSummary {
  totalStudents: number;
  totalClasses: number;
  totalLessons: number;
  totalExams: number;
  averageCompletionRate: number; // e.g. 78.5%
  averageExamScore: number; // e.g. 7.6 / 10
  unengagedStudents: { id: string; name: string; className: string; incompleteLessonsCount: number }[];
  mostFailedQuestions: { questionId: string; question: string; failRate: number; totalAttempts: number }[];
  hardestLessons: { lessonId: string; title: string; averageProgress: number; failRate: number }[];
}
