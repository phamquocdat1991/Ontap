import { 
  User, SchoolClass, Course, Chapter, Lesson, Material, LessonProgress, 
  PracticeQuiz, PracticeAttempt, Exam, ExamAttempt, SheetSyncLog, SystemSettings, 
  AnalyticsSummary, Question, ExamMatrix, LessonContentAI 
} from '../types';

let currentUserId = 'teacher-1';

export function setApiUser(userId: string) {
  currentUserId = userId;
  localStorage.setItem('ai_hub_user_id', userId);
}

export function getApiUser(): string {
  const saved = localStorage.getItem('ai_hub_user_id');
  if (saved) currentUserId = saved;
  return currentUserId;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': getApiUser(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = 'Có lỗi xảy ra khi xử lý yêu cầu.';
    try {
      const errData = await response.json();
      errorMsg = errData.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // Auth & Users
  getMe: () => request<User>('/api/auth/me'),
  getUsers: () => request<User[]>('/api/users'),
  createUser: (data: Partial<User>) => request<User>('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (id: string) => request<{ success: boolean; message: string }>(`/api/users/${id}`, { method: 'DELETE' }),

  // Classes & Courses
  getClasses: () => request<SchoolClass[]>('/api/classes'),
  createClass: (data: Partial<SchoolClass>) => request<SchoolClass>('/api/classes', { method: 'POST', body: JSON.stringify(data) }),
  getCourses: () => request<Course[]>('/api/courses'),
  createCourse: (data: Partial<Course>) => request<Course>('/api/courses', { method: 'POST', body: JSON.stringify(data) }),
  getChapters: (courseId?: string) => request<Chapter[]>(`/api/chapters${courseId ? `?courseId=${courseId}` : ''}`),
  createChapter: (data: Partial<Chapter>) => request<Chapter>('/api/chapters', { method: 'POST', body: JSON.stringify(data) }),

  // Lessons
  getLessons: (courseId?: string, chapterId?: string) => {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    if (chapterId) params.append('chapterId', chapterId);
    return request<Lesson[]>(`/api/lessons?${params.toString()}`);
  },
  getLessonById: (id: string) => request<Lesson>(`/api/lessons/${id}`),
  createLesson: (data: Partial<Lesson>) => request<Lesson>('/api/lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (id: string, data: Partial<Lesson>) => request<Lesson>(`/api/lessons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Materials
  getMaterials: (lessonId?: string) => request<Material[]>(`/api/materials${lessonId ? `?lessonId=${lessonId}` : ''}`),
  uploadMaterial: (data: { lessonId: string; filename: string; type: string; pageCount?: number; slideCount?: number; duration?: number; sampleContent?: string }) => 
    request<{ material: Material; aiInsights?: any }>('/api/materials/upload', { method: 'POST', body: JSON.stringify(data) }),

  // Progress
  getLessonProgress: (userId: string, lessonId: string) => request<LessonProgress>(`/api/progress/${userId}/${lessonId}`),
  getUserProgressList: (userId: string) => request<LessonProgress[]>(`/api/progress/user/${userId}`),
  getStudentProgress: (userId: string) => request<LessonProgress[]>(`/api/progress/user/${userId}`),
  trackProgress: (data: {
    userId: string;
    lessonId: string;
    pageViewed?: number;
    totalPages?: number;
    videoSegment?: [number, number];
    totalDuration?: number;
  }) => request<LessonProgress>('/api/progress/track', { method: 'POST', body: JSON.stringify(data) }),
  updateProgress: (data: {
    lessonId: string;
    courseId: string;
    materialProgress?: Record<string, any>;
  }) => request<LessonProgress>('/api/progress/track', { 
    method: 'POST', 
    body: JSON.stringify({ 
      userId: getApiUser(), 
      ...data 
    }) 
  }),

  // Practice Quizzes
  getPracticeQuizzes: (lessonId?: string) => request<PracticeQuiz[]>(`/api/practice/quizzes${lessonId ? `?lessonId=${lessonId}` : ''}`),
  getPracticeQuizById: (id: string) => request<PracticeQuiz>(`/api/practice/quizzes/${id}`),
  createPracticeQuiz: (data: Partial<PracticeQuiz>) => request<PracticeQuiz>('/api/practice/quizzes', { method: 'POST', body: JSON.stringify(data) }),
  getPracticeAttempts: (quizId?: string, userId?: string) => {
    const params = new URLSearchParams();
    if (quizId) params.append('quizId', quizId);
    if (userId) params.append('userId', userId);
    return request<PracticeAttempt[]>(`/api/practice/attempts?${params.toString()}`);
  },
  startPracticeAttempt: (quizId: string, lessonId?: string) => request<PracticeAttempt>('/api/practice/start', { method: 'POST', body: JSON.stringify({ quizId, lessonId }) }),
  submitPracticeAttempt: async (data: { practiceQuizId?: string; attemptId?: string; lessonId?: string; answers: Record<string, string> }) => {
    let attemptId = data.attemptId;
    if (!attemptId && data.practiceQuizId) {
      const startRes = await request<PracticeAttempt>('/api/practice/start', { 
        method: 'POST', 
        body: JSON.stringify({ quizId: data.practiceQuizId, lessonId: data.lessonId }) 
      });
      attemptId = startRes.id;
    }
    const res = await request<{ attempt: PracticeAttempt; feedback: Record<string, { isCorrect: boolean; explanation: string; hint1?: string; hint2?: string; points: number }> }>(
      '/api/practice/submit', 
      { method: 'POST', body: JSON.stringify({ attemptId, answers: data.answers }) }
    );
    return {
      attempt: res.attempt,
      score: res.attempt.score,
      isPassed: res.attempt.passed ?? res.attempt.isPassed,
      correctCount: res.attempt.correctCount || 0,
      totalQuestions: res.attempt.totalQuestions || 0,
      feedback: res.feedback
    };
  },

  // Exams
  getExams: () => request<Exam[]>('/api/exams'),
  getExamById: (id: string) => request<Exam>(`/api/exams/${id}`),
  createExam: (data: Partial<Exam>) => request<Exam>('/api/exams', { method: 'POST', body: JSON.stringify(data) }),
  updateExam: (id: string, data: Partial<Exam>) => request<Exam>(`/api/exams/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getExamAttempts: (examId: string) => request<ExamAttempt[]>(`/api/exams/${examId}/attempts`),
  startExamAttempt: (examId: string) => request<ExamAttempt>('/api/exams/start', { method: 'POST', body: JSON.stringify({ examId }) }),
  submitExamAttempt: async (data: { examId?: string; attemptId?: string; answers: Record<string, string>; durationSeconds?: number }) => {
    let attemptId = data.attemptId;
    if (!attemptId && data.examId) {
      const started = await request<ExamAttempt>('/api/exams/start', {
        method: 'POST',
        body: JSON.stringify({ examId: data.examId })
      });
      attemptId = started.id;
    }
    return request<ExamAttempt>('/api/exams/submit', { 
      method: 'POST', 
      body: JSON.stringify({ attemptId, answers: data.answers, durationSeconds: data.durationSeconds }) 
    });
  },
  reviewExamAttempt: (attemptId: string, data: { score: number; essayEvaluations?: any; teacherNotes?: string }) => 
    request<ExamAttempt>(`/api/exams/attempts/${attemptId}/review`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Gemini AI Server Endpoints
  generateLessonAI: (data: {
    subject: string;
    grade: string;
    bookSeries: string;
    chapter: string;
    lesson: string;
    learningObjectives?: string;
    duration?: number;
    teacherNotes?: string;
  }) => request<LessonContentAI>('/api/ai/generate-lesson', { method: 'POST', body: JSON.stringify(data) }),

  generatePracticeAI: (data: {
    lessonTitle: string;
    subject: string;
    grade: string;
    lessonContent: string;
    questionCount?: number;
  }) => request<Question[]>('/api/ai/generate-practice', { method: 'POST', body: JSON.stringify(data) }),

  generateMatrixAI: (data: {
    subject: string;
    grade: string;
    scope: string;
    durationMinutes: number;
    totalScore: number;
    questionCount: number;
    examType: string;
  }) => request<ExamMatrix>('/api/ai/generate-matrix', { method: 'POST', body: JSON.stringify(data) }),

  generateExamFromMatrixAI: (data: {
    matrix: ExamMatrix;
    scope: string;
  }) => request<{ questions: Question[]; rubric: string; scoringGuide: string; specification: string }>('/api/ai/generate-exam-from-matrix', { method: 'POST', body: JSON.stringify(data) }),

  // Google Sheets
  getSheetLogs: () => request<SheetSyncLog[]>('/api/sheets/logs'),
  retrySheetSync: (logId: string) => request<SheetSyncLog>('/api/sheets/retry-sync', { method: 'POST', body: JSON.stringify({ logId }) }),
  connectSheet: (data: { spreadsheetId: string; spreadsheetUrl?: string; spreadsheetName?: string }) => 
    request<SystemSettings>('/api/sheets/connect', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics & Settings
  getAnalytics: () => request<AnalyticsSummary>('/api/analytics/dashboard'),
  getSettings: () => request<SystemSettings>('/api/settings'),
  updateSettings: (data: Partial<SystemSettings>) => request<SystemSettings>('/api/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};
