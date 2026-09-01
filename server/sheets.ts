import { db } from './db';
import { SheetSyncLog, SheetSyncRow, ExamAttempt, PracticeAttempt } from '../src/types';

export class GoogleSheetsService {
  /**
   * Sync an exam attempt to Google Sheets
   */
  public static async syncExamAttempt(attempt: ExamAttempt, studentId: string): Promise<SheetSyncLog> {
    const student = db.getUserById(studentId);
    const exam = db.getExamById(attempt.examId);
    const course = exam ? db.getCourseById(exam.courseId) : undefined;
    const progress = exam ? db.getUserProgressList(studentId) : [];
    
    const avgProgress = progress.length 
      ? Math.round(progress.reduce((acc, p) => acc + p.percentage, 0) / progress.length)
      : 100;

    const durationMins = attempt.durationSeconds ? Math.floor(attempt.durationSeconds / 60) : 0;
    const durationSecs = attempt.durationSeconds ? attempt.durationSeconds % 60 : 0;
    const durationFormatted = `${durationMins} phút ${durationSecs} giây`;

    const submissionId = `SUB-EXAM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*1000)}`;

    const rowData: SheetSyncRow = {
      timestamp: new Date().toISOString(),
      studentId: studentId,
      studentName: student?.fullName || attempt.studentName || 'Học sinh',
      className: student?.className || attempt.className || '10A1',
      subject: course?.subject || 'Toán học',
      chapter: exam?.scope || 'Kiểm tra định kỳ',
      lesson: exam?.title || 'Đề kiểm tra',
      assessmentType: 'Exam',
      attempt: 1,
      correct: attempt.correctCount || 0,
      incorrect: attempt.incorrectCount || 0,
      score: attempt.score || 0,
      duration: durationFormatted,
      lessonProgress: `${avgProgress}%`,
      submissionId: submissionId
    };

    // Simulate reliable sync with persistent logging
    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected; // If connected, sync success; otherwise failed with log

    const log: SheetSyncLog = {
      id: `sync-log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      attemptId: attempt.id,
      submissionId: submissionId,
      studentId: rowData.studentId,
      studentName: rowData.studentName,
      className: rowData.className,
      subject: rowData.subject,
      chapter: rowData.chapter,
      lessonTitle: rowData.lesson,
      assessmentType: 'Exam',
      attemptNumber: 1,
      correct: rowData.correct,
      incorrect: rowData.incorrect,
      score: rowData.score,
      duration: rowData.duration,
      lessonProgress: rowData.lessonProgress,
      status: isSuccess ? 'success' : 'failed',
      errorMsg: isSuccess ? undefined : 'Google Sheets chưa được cấp quyền hoặc Spreadsheet ID không hợp lệ.',
      syncedAt: new Date().toISOString()
    };

    db.addSheetSyncLog(log);

    // Update attempt's sync status
    db.updateExamAttempt(attempt.id, {
      syncStatus: isSuccess ? 'success' : 'failed'
    });

    return log;
  }

  /**
   * Sync a practice quiz attempt to Google Sheets
   */
  public static async syncPracticeAttempt(attempt: PracticeAttempt, studentId: string): Promise<SheetSyncLog> {
    const student = db.getUserById(studentId);
    const quiz = db.getPracticeQuizById(attempt.quizId);
    const lesson = quiz ? db.getLessonById(quiz.lessonId) : undefined;
    const course = lesson ? db.getCourseById(lesson.courseId) : undefined;
    const progress = lesson ? db.getLessonProgress(studentId, lesson.id) : undefined;

    const correctCount = attempt.score ? Math.round((attempt.score / (attempt.totalScore || 10)) * (quiz?.questions.length || 4)) : 0;
    const incorrectCount = (quiz?.questions.length || 4) - correctCount;

    const durationMins = attempt.durationSeconds ? Math.floor(attempt.durationSeconds / 60) : 0;
    const durationSecs = attempt.durationSeconds ? attempt.durationSeconds % 60 : 0;
    const durationFormatted = `${durationMins} phút ${durationSecs} giây`;

    const submissionId = `SUB-PRAC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*1000)}`;

    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected;

    const log: SheetSyncLog = {
      id: `sync-log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      attemptId: attempt.id,
      submissionId: submissionId,
      studentId: studentId,
      studentName: student?.fullName || attempt.studentName || 'Học sinh',
      className: student?.className || '10A1',
      subject: course?.subject || 'Toán học',
      chapter: 'Luyện tập bài học',
      lessonTitle: lesson?.title || quiz?.title || 'Bài luyện tập',
      assessmentType: 'Practice',
      attemptNumber: attempt.attemptNumber,
      correct: correctCount,
      incorrect: Math.max(0, incorrectCount),
      score: attempt.score || 0,
      duration: durationFormatted,
      lessonProgress: `${progress?.percentage || 100}%`,
      status: isSuccess ? 'success' : 'failed',
      errorMsg: isSuccess ? undefined : 'Chưa kết nối Google Spreadsheet ID',
      syncedAt: new Date().toISOString()
    };

    db.addSheetSyncLog(log);
    return log;
  }

  /**
   * Retry syncing a failed log entry
   */
  public static async retrySync(logId: string): Promise<SheetSyncLog | undefined> {
    const logs = db.getSheetSyncLogs();
    const target = logs.find(l => l.id === logId);
    if (!target) return undefined;

    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected && Boolean(settings.spreadsheetId);

    const updated = db.updateSheetSyncLog(logId, {
      status: isSuccess ? 'success' : 'failed',
      errorMsg: isSuccess ? undefined : 'Kết nối thất bại. Vui lòng kiểm tra lại Google Sheet ID.',
      syncedAt: new Date().toISOString()
    });

    if (updated && updated.attemptId) {
      db.updateExamAttempt(updated.attemptId, {
        syncStatus: isSuccess ? 'success' : 'failed'
      });
    }

    return updated;
  }
}
