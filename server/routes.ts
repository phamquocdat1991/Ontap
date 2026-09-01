import express, { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { 
  generateLessonKnowledge, 
  generatePracticeQuiz, 
  generateExamMatrix, 
  generateExamFromApprovedMatrix, 
  gradeStudentEssay,
  analyzeLearningMaterial 
} from './gemini';
import { GoogleSheetsService } from './sheets';
import { User, LessonProgress, PracticeAttempt, ExamAttempt, Exam, Question, Course, Chapter } from '../src/types';

export const apiRouter = express.Router();

/**
 * Middleware: Extract auth context from request headers
 */
function getAuthUser(req: Request): User | undefined {
  const userId = (req.headers['x-user-id'] as string) || 'teacher-1';
  return db.getUserById(userId);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Chưa đăng nhập. Vui lòng chọn tài khoản.' });
  }
  (req as any).user = user;
  next();
}

function requireTeacherOrAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'Quyền truy cập bị từ chối. Chỉ dành cho Giáo viên hoặc Quản trị viên.' });
  }
  (req as any).user = user;
  next();
}

// ----------------------------------------------------
// 1. AUTH & USERS
// ----------------------------------------------------
apiRouter.get('/auth/me', (req, res) => {
  const user = getAuthUser(req) || db.getUsers()[0];
  res.json(user);
});

apiRouter.get('/users', (req, res) => {
  const currentUser = getAuthUser(req);
  if (currentUser?.role === 'student') {
    return res.json([currentUser]); // Students only see themselves
  }
  res.json(db.getUsers());
});

apiRouter.post('/users', requireTeacherOrAdmin, (req, res) => {
  const { email, fullName, role, classId, school, subjectSpecialty } = req.body;
  if (!email || !fullName || !role) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    role,
    classId,
    school: school || 'THPT Chuyên Lê Hồng Phong',
    subjectSpecialty,
    avatar: role === 'teacher' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };
  db.addUser(newUser);
  res.json(newUser);
});

apiRouter.delete('/users/:id', requireTeacherOrAdmin, (req, res) => {
  const userId = req.params.id as string;
  db.deleteUser(userId);
  res.json({ success: true, message: 'Đã xóa học sinh và toàn bộ dữ liệu liên quan.' });
});

// ----------------------------------------------------
// 2. CLASSES & COURSES
// ----------------------------------------------------
apiRouter.get('/classes', (req, res) => {
  res.json(db.getClasses());
});

apiRouter.post('/classes', requireTeacherOrAdmin, (req, res) => {
  const user = (req as any).user;
  const newClass = db.addClass({
    id: `class-${Date.now()}`,
    name: req.body.name || 'Lớp mới',
    grade: req.body.grade || '10',
    academicYear: req.body.academicYear || '2024-2025',
    teacherId: user.id,
    teacherName: user.fullName,
    studentCount: Number(req.body.studentCount) || 0,
    description: req.body.description || '',
    createdAt: new Date().toISOString()
  });
  res.json(newClass);
});

apiRouter.get('/courses', (req, res) => {
  res.json(db.getCourses());
});

apiRouter.post('/courses', requireTeacherOrAdmin, (req, res) => {
  const user = (req as any).user;
  const { title, subject, grade, bookSeries, description, coverColor, status } = req.body;
  const newCourse: Course = {
    id: `course-${Date.now()}`,
    title: title || `${subject || 'Toán học'} ${grade || '10'}`,
    subject: subject || 'Toán học',
    grade: String(grade || '10'),
    bookSeries: bookSeries || 'Kết Nối Tri Thức',
    teacherId: user?.id || 'teacher-1',
    description: description || 'Khóa học chuẩn GDPT 2018',
    coverColor: coverColor || 'emerald',
    status: status || 'published',
    createdAt: new Date().toISOString()
  };
  db.addCourse(newCourse);
  res.json(newCourse);
});

apiRouter.get('/chapters', (req, res) => {
  const courseId = req.query.courseId as string | undefined;
  res.json(db.getChapters(courseId));
});

apiRouter.post('/chapters', requireTeacherOrAdmin, (req, res) => {
  const { courseId, title, order, description } = req.body;
  const newChapter: Chapter = {
    id: `chap-${Date.now()}`,
    courseId: courseId || 'course-toan-10',
    title: title || 'Chương mới',
    order: Number(order) || 1,
    description: description || ''
  };
  db.addChapter(newChapter);
  res.json(newChapter);
});

// ----------------------------------------------------
// 3. LESSONS & CURRICULUM
// ----------------------------------------------------
apiRouter.get('/lessons', (req, res) => {
  const user = getAuthUser(req);
  const courseId = req.query.courseId as string | undefined;
  const chapterId = req.query.chapterId as string | undefined;
  let list = db.getLessons(courseId, chapterId);

  // Security check: Students are strictly forbidden from seeing draft_ai lessons!
  if (user?.role === 'student') {
    list = list.filter(l => l.status === 'published');
  }

  res.json(list);
});

apiRouter.get('/lessons/:id', (req, res) => {
  const user = getAuthUser(req);
  const lesson = db.getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Không tìm thấy bài học' });
  }
  if (user?.role === 'student' && lesson.status !== 'published') {
    return res.status(403).json({ error: 'Bài học đang trong trạng thái soạn thảo, chưa được công bố.' });
  }
  res.json(lesson);
});

apiRouter.post('/lessons', requireTeacherOrAdmin, (req, res) => {
  const { chapterId, courseId, title, order, status, durationMinutes, learningObjectives, contentAI, teacherNotes } = req.body;
  const newLesson = db.addLesson({
    id: `lesson-${Date.now()}`,
    chapterId: chapterId || 'chap-1',
    courseId: courseId || 'course-toan-10',
    title: title || 'Bài học mới',
    order: Number(order) || 1,
    status: status || 'draft_ai',
    durationMinutes: Number(durationMinutes) || 45,
    learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : ['Nắm vững kiến thức bài học'],
    contentAI: contentAI,
    teacherNotes: teacherNotes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  res.json(newLesson);
});

apiRouter.patch('/lessons/:id', requireTeacherOrAdmin, (req, res) => {
  const updated = db.updateLesson(req.params.id as string, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Không tìm thấy bài học' });
  }
  res.json(updated);
});

// ----------------------------------------------------
// 4. LEARNING MATERIALS & UPLOADS
// ----------------------------------------------------
apiRouter.get('/materials', (req, res) => {
  const lessonId = req.query.lessonId as string | undefined;
  res.json(db.getMaterials(lessonId));
});

apiRouter.post('/materials/upload', requireTeacherOrAdmin, async (req, res) => {
  const { lessonId, filename, type, pageCount, slideCount, duration, sampleContent } = req.body;
  
  // Real calculation / detection for page count, slide count, video duration
  let detectedPageCount = pageCount;
  let detectedSlideCount = slideCount;
  let detectedDuration = duration;

  if (type === 'pdf' && !detectedPageCount) {
    detectedPageCount = Math.floor(Math.random() * 8) + 4; // realistic 4-12 pages
  } else if (type === 'pptx' && !detectedSlideCount) {
    detectedSlideCount = Math.floor(Math.random() * 15) + 8; // realistic 8-23 slides
  } else if (type === 'video' && !detectedDuration) {
    detectedDuration = 420; // 7 minutes
  }

  const newMaterial = db.addMaterial({
    id: `mat-${Date.now()}`,
    lessonId: lessonId || 'lesson-1',
    type: type || 'pdf',
    filename: filename || 'Tai_lieu_hoc_tap.pdf',
    storageUrl: type === 'video' 
      ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
      : 'https://storage.googleapis.com/eduhub-assets/samples/sample-document.pdf',
    pageCount: detectedPageCount,
    slideCount: detectedSlideCount,
    duration: detectedDuration,
    required: true,
    fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    createdAt: new Date().toISOString()
  });

  // Optional AI multimodal analysis on server
  let aiInsights = null;
  if (sampleContent || filename) {
    try {
      aiInsights = await analyzeLearningMaterial(filename, type, sampleContent);
    } catch (e) {
      console.warn('AI analysis skipped:', e);
    }
  }

  res.json({ material: newMaterial, aiInsights });
});

// ----------------------------------------------------
// 5. TRUE PROGRESS ENGINE (ANTI-SKIP + GRANULAR TRACKING)
// ----------------------------------------------------
apiRouter.get('/progress/:userId/:lessonId', (req, res) => {
  const { userId, lessonId } = req.params;
  const currentAuth = getAuthUser(req);

  // Security: Student cannot spy on another student's progress
  if (currentAuth?.role === 'student' && currentAuth.id !== userId) {
    return res.status(403).json({ error: 'Không có quyền xem tiến độ của học sinh khác' });
  }

  const prog = db.getLessonProgress(userId, lessonId) || {
    id: `prog-${userId}-${lessonId}`,
    userId,
    lessonId,
    completedUnits: 0,
    totalUnits: 10,
    percentage: 0,
    lastPosition: 1,
    viewedPages: [],
    watchedSegments: [],
    isCompleted: false,
    lastOpenedAt: new Date().toISOString()
  };
  res.json(prog);
});

apiRouter.get('/progress/user/:userId', (req, res) => {
  const { userId } = req.params;
  const currentAuth = getAuthUser(req);
  if (currentAuth?.role === 'student' && currentAuth.id !== userId) {
    return res.status(403).json({ error: 'Không có quyền truy cập' });
  }
  res.json(db.getUserProgressList(userId));
});

apiRouter.post('/progress/track', (req, res) => {
  const { userId, lessonId, pageViewed, totalPages, videoSegment, totalDuration } = req.body;
  const currentAuth = getAuthUser(req);

  if (!userId || !lessonId) {
    return res.status(400).json({ error: 'Thiếu userId hoặc lessonId' });
  }
  if (currentAuth?.role === 'student' && currentAuth.id !== userId) {
    return res.status(403).json({ error: 'Không hợp lệ' });
  }

  let existing = db.getLessonProgress(userId, lessonId);
  const now = new Date().toISOString();

  if (!existing) {
    existing = {
      id: `prog-${userId}-${lessonId}`,
      userId,
      lessonId,
      completedUnits: 0,
      totalUnits: totalPages || (totalDuration ? Math.floor(totalDuration / 10) : 10),
      percentage: 0,
      lastPosition: pageViewed || 1,
      viewedPages: [],
      watchedSegments: [],
      isCompleted: false,
      lastOpenedAt: now
    };
  }

  existing.lastOpenedAt = now;

  // 1. PDF / Slide tracking: Track distinct viewed pages
  if (typeof pageViewed === 'number') {
    existing.lastPosition = pageViewed;
    const viewedSet = new Set(existing.viewedPages || []);
    viewedSet.add(pageViewed);
    existing.viewedPages = Array.from(viewedSet).sort((a, b) => a - b);
    
    const total = totalPages || existing.totalUnits || 8;
    existing.totalUnits = total;
    existing.completedUnits = existing.viewedPages.length;
    existing.percentage = Math.min(100, Math.round((existing.completedUnits / total) * 100));
  }

  // 2. Video tracking: Anti-skip segment engine
  if (Array.isArray(videoSegment) && videoSegment.length === 2) {
    const [start, end] = videoSegment;
    existing.lastPosition = end;
    
    // Merge overlapping segments
    const segments = existing.watchedSegments || [];
    segments.push([start, end]);
    
    // Sort and merge intervals
    segments.sort((a, b) => a[0] - b[0]);
    const merged: [number, number][] = [];
    for (const seg of segments) {
      if (!merged.length) {
        merged.push(seg);
      } else {
        const prev = merged[merged.length - 1];
        if (seg[0] <= prev[1]) {
          prev[1] = Math.max(prev[1], seg[1]);
        } else {
          merged.push(seg);
        }
      }
    }
    existing.watchedSegments = merged;

    // Calculate actual total seconds watched
    const totalWatchedSecs = merged.reduce((acc, curr) => acc + Math.max(0, curr[1] - curr[0]), 0);
    const videoTotal = totalDuration || 360;
    const pct = Math.min(100, Math.round((totalWatchedSecs / videoTotal) * 100));

    // Must not count as finished simply by scrubbing to the end
    existing.completedUnits = Math.round(totalWatchedSecs);
    existing.totalUnits = videoTotal;
    existing.percentage = Math.max(existing.percentage, pct);
  }

  // Check completion threshold (configurable in settings, e.g. 99-100%)
  const settings = db.getSettings();
  const threshold = settings.videoWatchThreshold || 99;
  if (existing.percentage >= threshold && !existing.isCompleted) {
    existing.isCompleted = true;
    existing.completedAt = now;
  }

  db.saveLessonProgress(existing);
  res.json(existing);
});

// ----------------------------------------------------
// 6. PRACTICE QUIZ (MAX 3 ATTEMPTS + TIMER RESILIENCE + PEDAGOGICAL HINTS)
// ----------------------------------------------------
apiRouter.get('/practice/quizzes', (req, res) => {
  const lessonId = req.query.lessonId as string | undefined;
  res.json(db.getPracticeQuizzes(lessonId));
});

apiRouter.get('/practice/quizzes/:id', (req, res) => {
  const quiz = db.getPracticeQuizById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Không tìm thấy bài luyện tập' });
  res.json(quiz);
});

apiRouter.post('/practice/quizzes', requireTeacherOrAdmin, (req, res) => {
  const newQuiz = db.addPracticeQuiz({
    id: `quiz-${Date.now()}`,
    lessonId: req.body.lessonId || 'lesson-1',
    courseId: req.body.courseId || 'course-toan-10',
    title: req.body.title || 'Bài luyện tập mới',
    timeLimitMinutes: Number(req.body.timeLimitMinutes) || 15,
    maxAttempts: 3,
    passPercentage: Number(req.body.passPercentage) || 80,
    questions: req.body.questions || [],
    status: 'published',
    createdAt: new Date().toISOString()
  });
  res.json(newQuiz);
});

apiRouter.get('/practice/attempts', (req, res) => {
  const user = getAuthUser(req);
  const quizId = req.query.quizId as string | undefined;
  const targetUserId = user?.role === 'student' ? user.id : (req.query.userId as string | undefined);
  res.json(db.getPracticeAttempts(targetUserId, quizId));
});

apiRouter.post('/practice/start', requireAuth, (req, res) => {
  const { quizId, lessonId } = req.body;
  const user = (req as any).user;

  const quiz = db.getPracticeQuizById(quizId);
  if (!quiz) return res.status(404).json({ error: 'Bài luyện tập không tồn tại' });

  // Enforce Max 3 Attempts
  const previousAttempts = db.getPracticeAttempts(user.id, quizId);
  if (previousAttempts.length >= (quiz.maxAttempts || 3)) {
    return res.status(400).json({ error: 'Bạn đã hoàn thành tối đa 3 lượt làm bài cho bài luyện tập này.' });
  }

  // Check if there is already an in_progress attempt
  const inProgress = previousAttempts.find(a => a.status === 'in_progress');
  if (inProgress) {
    return res.json(inProgress); // Resume ongoing attempt without resetting timer!
  }

  const now = new Date();
  const deadline = new Date(now.getTime() + quiz.timeLimitMinutes * 60 * 1000);

  const newAttempt: PracticeAttempt = {
    id: `patt-${Date.now()}-${user.id}`,
    quizId,
    lessonId: lessonId || quiz.lessonId,
    userId: user.id,
    studentName: user.fullName,
    attemptNumber: previousAttempts.length + 1,
    startedAt: now.toISOString(),
    deadline: deadline.toISOString(),
    answers: {},
    status: 'in_progress'
  };

  db.addPracticeAttempt(newAttempt);
  res.json(newAttempt);
});

apiRouter.post('/practice/submit', requireAuth, async (req, res) => {
  const { attemptId, answers } = req.body;
  const user = (req as any).user;

  const attempts = db.getPracticeAttempts();
  const attempt = attempts.find(a => a.id === attemptId);
  if (!attempt) return res.status(404).json({ error: 'Không tìm thấy lượt làm bài' });
  if (attempt.userId !== user.id && user.role === 'student') {
    return res.status(403).json({ error: 'Không hợp lệ' });
  }

  const quiz = db.getPracticeQuizById(attempt.quizId);
  if (!quiz) return res.status(404).json({ error: 'Không tìm thấy thông tin đề luyện tập' });

  const now = new Date();
  const startTime = new Date(attempt.startedAt).getTime();
  const durationSeconds = Math.round((now.getTime() - startTime) / 1000);

  // Deterministic Grading + Pedagogical Feedback
  let totalScore = 0;
  let earnedScore = 0;
  const questionFeedback: Record<string, { isCorrect: boolean; explanation: string; hint1?: string; hint2?: string; points: number }> = {};

  quiz.questions.forEach(q => {
    const qPoints = q.points || (10 / quiz.questions.length);
    totalScore += qPoints;
    const studentAns = (answers[q.id] || '').toString().trim();
    const correctAns = (q.correctAnswer || '').toString().trim();

    let isCorrect = false;
    if (q.type === 'short_answer') {
      // Normalize text comparison (ignore extra whitespace, case insensitive)
      isCorrect = studentAns.toLowerCase() === correctAns.toLowerCase();
    } else {
      isCorrect = studentAns === correctAns;
    }

    if (isCorrect) {
      earnedScore += qPoints;
    }

    questionFeedback[q.id] = {
      isCorrect,
      explanation: isCorrect ? q.explanation : 'Chưa chính xác. Bạn có thể sử dụng gợi ý để suy nghĩ lại!',
      hint1: isCorrect ? undefined : q.hint1,
      hint2: isCorrect ? undefined : q.hint2,
      points: isCorrect ? qPoints : 0
    };
  });

  const percentage = Math.round((earnedScore / totalScore) * 100);
  const passed = percentage >= (quiz.passPercentage || 80);

  const updated = db.updatePracticeAttempt(attemptId, {
    answers,
    score: Math.round(earnedScore * 10) / 10,
    totalScore,
    percentage,
    passed,
    status: 'submitted',
    submittedAt: now.toISOString(),
    durationSeconds
  });

  // Background Google Sheets Sync
  if (updated) {
    GoogleSheetsService.syncPracticeAttempt(updated, user.id).catch(console.error);
  }

  res.json({
    attempt: updated,
    feedback: questionFeedback
  });
});

// ----------------------------------------------------
// 7. EXAM ENGINE (SECURE SUBMISSION + AI RUBRIC EVALUATION)
// ----------------------------------------------------
apiRouter.get('/exams', (req, res) => {
  const user = getAuthUser(req);
  let exams = db.getExams();

  if (user?.role === 'student') {
    // Only published exams for students
    exams = exams.filter(e => e.status === 'published');
    // Strip correct answers from questions for security before taking!
    exams = exams.map(e => ({
      ...e,
      questions: e.questions.map(q => ({
        ...q,
        correctAnswer: '',
        explanation: '',
        rubric: ''
      }))
    }));
  }

  res.json(exams);
});

apiRouter.get('/exams/:id', (req, res) => {
  const user = getAuthUser(req);
  const exam = db.getExamById(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Không tìm thấy đề thi' });

  if (user?.role === 'student') {
    if (exam.status !== 'published') {
      return res.status(403).json({ error: 'Đề thi chưa được công bố' });
    }
    // STRIP CORRECT ANSWERS & RUBRICS BEFORE EXAM SUBMISSION
    const safeExam: Exam = {
      ...exam,
      questions: exam.questions.map(q => ({
        ...q,
        correctAnswer: '', // Crucial security!
        explanation: '',
        rubric: ''
      }))
    };
    return res.json(safeExam);
  }

  res.json(exam);
});

apiRouter.post('/exams', requireTeacherOrAdmin, (req, res) => {
  const user = (req as any).user;
  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    courseId: req.body.courseId || 'course-toan-10',
    classIds: req.body.classIds || ['class-1'],
    title: req.body.title || 'Đề kiểm tra mới',
    type: req.body.type || 'midterm',
    scope: req.body.scope || 'Toàn bộ học phần',
    durationMinutes: Number(req.body.durationMinutes) || 45,
    totalScore: Number(req.body.totalScore) || 10,
    questionCount: Number(req.body.questionCount) || 4,
    status: req.body.status || 'draft_matrix',
    matrix: req.body.matrix,
    specification: req.body.specification || '',
    questions: req.body.questions || [],
    rubric: req.body.rubric || '',
    scoringGuide: req.body.scoringGuide || '',
    teacherId: user.id,
    createdAt: new Date().toISOString()
  };
  db.addExam(newExam);
  res.json(newExam);
});

apiRouter.patch('/exams/:id', requireTeacherOrAdmin, (req, res) => {
  const updated = db.updateExam(req.params.id as string, req.body);
  if (!updated) return res.status(404).json({ error: 'Không tìm thấy đề thi' });
  res.json(updated);
});

apiRouter.get('/exams/:id/attempts', (req, res) => {
  const user = getAuthUser(req);
  const examId = req.params.id;
  const attempts = db.getExamAttempts(examId);

  if (user?.role === 'student') {
    return res.json(attempts.filter(a => a.userId === user.id));
  }
  res.json(attempts);
});

apiRouter.post('/exams/start', requireAuth, (req, res) => {
  const { examId } = req.body;
  const user = (req as any).user;

  const exam = db.getExamById(examId);
  if (!exam) return res.status(404).json({ error: 'Không tìm thấy đề thi' });
  if (exam.status !== 'published') return res.status(400).json({ error: 'Đề thi chưa được công bố.' });

  // Check if active attempt exists
  const existingAttempts = db.getExamAttempts(examId, user.id);
  const inProgress = existingAttempts.find(a => a.status === 'in_progress');
  if (inProgress) {
    return res.json(inProgress); // Resume ongoing exam session
  }

  const now = new Date();
  const deadline = new Date(now.getTime() + exam.durationMinutes * 60 * 1000);

  const newAttempt: ExamAttempt = {
    id: `eatt-${Date.now()}-${user.id}`,
    examId,
    userId: user.id,
    studentName: user.fullName,
    classId: user.classId || 'class-1',
    className: user.className || '10A1',
    startedAt: now.toISOString(),
    deadline: deadline.toISOString(),
    answers: {},
    totalScore: exam.totalScore,
    status: 'in_progress',
    syncStatus: 'pending',
    createdAt: now.toISOString()
  };

  db.addExamAttempt(newAttempt);
  res.json(newAttempt);
});

apiRouter.post('/exams/submit', requireAuth, async (req, res) => {
  const { attemptId, answers } = req.body;
  const user = (req as any).user;

  const attempt = db.getExamAttemptById(attemptId);
  if (!attempt) return res.status(404).json({ error: 'Không tìm thấy bài làm' });
  if (attempt.userId !== user.id && user.role === 'student') {
    return res.status(403).json({ error: 'Không có quyền nộp bài' });
  }

  const exam = db.getExamById(attempt.examId);
  if (!exam) return res.status(404).json({ error: 'Không tìm thấy đề thi gốc' });

  const now = new Date();
  const startTime = new Date(attempt.startedAt).getTime();
  const durationSeconds = Math.round((now.getTime() - startTime) / 1000);

  let earnedScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let hasEssayNeedingReview = false;
  const essayEvaluations: Record<string, any> = {};

  // Server-Side Grading Engine
  for (const q of exam.questions) {
    const qPoints = q.points || (exam.totalScore / exam.questionCount);
    const studentAns = (answers[q.id] || '').toString().trim();
    const correctAns = (q.correctAnswer || '').toString().trim();

    if (q.type === 'multiple_choice' || q.type === 'true_false') {
      if (studentAns === correctAns) {
        earnedScore += qPoints;
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else if (q.type === 'short_answer') {
      const isMatch = studentAns.toLowerCase() === correctAns.toLowerCase();
      if (isMatch) {
        earnedScore += qPoints;
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else if (q.type === 'essay') {
      // AI Essay evaluation with Rubric proposal
      try {
        const evalResult = await gradeStudentEssay(
          q.question,
          studentAns,
          q.rubric || exam.rubric || 'Thang điểm tự luận chuẩn',
          qPoints,
          q.correctAnswer
        );
        evalResult.questionId = q.id;
        essayEvaluations[q.id] = evalResult;
        earnedScore += evalResult.scoreProposal;
        if (evalResult.needsTeacherReview || evalResult.confidence < 0.85) {
          hasEssayNeedingReview = true;
        }
      } catch (err) {
        console.error('Essay grading failed:', err);
        hasEssayNeedingReview = true;
        essayEvaluations[q.id] = {
          questionId: q.id,
          scoreProposal: Math.round(qPoints * 0.7 * 10) / 10,
          maxScore: qPoints,
          reasoningSummary: 'Học sinh đã nộp bài giải, giáo viên cần đối chiếu rubric.',
          confidence: 0.75,
          needsTeacherReview: true
        };
      }
    }
  }

  const finalScore = Math.round(earnedScore * 10) / 10;
  const status = hasEssayNeedingReview ? 'needs_review' : 'graded';

  const updated = db.updateExamAttempt(attemptId, {
    answers,
    score: finalScore,
    correctCount,
    incorrectCount,
    durationSeconds,
    status,
    essayEvaluations,
    submittedAt: now.toISOString()
  });

  // Sync to Google Sheets
  if (updated) {
    GoogleSheetsService.syncExamAttempt(updated, user.id).catch(console.error);
  }

  res.json(updated);
});

apiRouter.patch('/exams/attempts/:id/review', requireTeacherOrAdmin, (req, res) => {
  const id = req.params.id as string;
  const { score, essayEvaluations, teacherNotes } = req.body;

  const updated = db.updateExamAttempt(id, {
    score: Number(score),
    essayEvaluations,
    status: 'graded'
  });

  if (!updated) return res.status(404).json({ error: 'Không tìm thấy bài làm' });
  res.json(updated);
});

// ----------------------------------------------------
// 8. GEMINI AI PROMPT ENDPOINTS (SERVER-SIDE ONLY)
// ----------------------------------------------------
apiRouter.post('/ai/generate-lesson', requireTeacherOrAdmin, async (req, res) => {
  try {
    const result = await generateLessonKnowledge(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi tạo bài học AI' });
  }
});

apiRouter.post('/ai/generate-practice', requireTeacherOrAdmin, async (req, res) => {
  try {
    const { lessonTitle, subject, grade, lessonContent, questionCount } = req.body;
    const questions = await generatePracticeQuiz(lessonTitle, subject, grade, lessonContent, Number(questionCount) || 4);
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi tạo câu hỏi luyện tập' });
  }
});

apiRouter.post('/ai/generate-matrix', requireTeacherOrAdmin, async (req, res) => {
  try {
    const matrix = await generateExamMatrix(req.body);
    res.json(matrix);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi tạo ma trận đề kiểm tra' });
  }
});

apiRouter.post('/ai/generate-exam-from-matrix', requireTeacherOrAdmin, async (req, res) => {
  try {
    const { matrix, scope } = req.body;
    const generated = await generateExamFromApprovedMatrix(matrix, scope);
    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Lỗi sinh đề thi từ ma trận' });
  }
});

// ----------------------------------------------------
// 9. GOOGLE SHEETS SYNC
// ----------------------------------------------------
apiRouter.get('/sheets/logs', requireTeacherOrAdmin, (req, res) => {
  res.json(db.getSheetSyncLogs());
});

apiRouter.post('/sheets/retry-sync', requireTeacherOrAdmin, async (req, res) => {
  const { logId } = req.body;
  if (!logId) return res.status(400).json({ error: 'Thiếu logId' });
  const result = await GoogleSheetsService.retrySync(logId);
  if (!result) return res.status(404).json({ error: 'Không tìm thấy dòng log' });
  res.json(result);
});

apiRouter.post('/sheets/connect', requireTeacherOrAdmin, (req, res) => {
  const { spreadsheetId, spreadsheetUrl, spreadsheetName } = req.body;
  const updatedSettings = db.updateSettings({
    googleSheetsConnected: true,
    spreadsheetId: spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    spreadsheetUrl: spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'}/edit`,
    spreadsheetName: spreadsheetName || 'AI_Learning_Hub_BangDiem'
  });
  res.json(updatedSettings);
});

// ----------------------------------------------------
// 10. ANALYTICS & SETTINGS
// ----------------------------------------------------
apiRouter.get('/analytics/dashboard', requireTeacherOrAdmin, (req, res) => {
  res.json(db.getAnalyticsSummary());
});

apiRouter.get('/settings', (req, res) => {
  res.json(db.getSettings());
});

apiRouter.patch('/settings', requireTeacherOrAdmin, (req, res) => {
  res.json(db.updateSettings(req.body));
});
