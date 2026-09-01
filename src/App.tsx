import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AILessonGenerator } from './components/teacher/AILessonGenerator';
import { ExamMatrixBuilder } from './components/teacher/ExamMatrixBuilder';
import { GradingManager } from './components/teacher/GradingManager';
import { CourseManager } from './components/teacher/CourseManager';
import { MaterialManager } from './components/teacher/MaterialManager';
import { QuestionBankManager } from './components/teacher/QuestionBankManager';
import { ClassManager } from './components/teacher/ClassManager';
import { GoogleSheetsSync } from './components/teacher/GoogleSheetsSync';
import { TeacherSettings } from './components/teacher/TeacherSettings';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { LessonViewer } from './components/student/LessonViewer';
import { PracticeQuizRunner } from './components/student/PracticeQuizRunner';
import { ExamTakingRoom } from './components/student/ExamTakingRoom';

const MainApp: React.FC = () => {
  const { user, isTeacher, isStudent, isLoading } = useAuth();
  
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [activeExamId, setActiveExamId] = useState<string>('exam-1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Handle switching views based on user role changes
  useEffect(() => {
    if (!user) return;
    if (isTeacher && (currentView.startsWith('student-') || currentView === 'exam-room' || currentView === 'practice-runner' || currentView === 'lesson-view')) {
      setCurrentView('dashboard');
    } else if (isStudent && !currentView.startsWith('student-') && currentView !== 'exam-room' && currentView !== 'practice-runner' && currentView !== 'lesson-view') {
      setCurrentView('student-dashboard');
    }
  }, [user?.role, isTeacher, isStudent]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100 p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">AI LEARNING HUB • GDPT 2018</h2>
            <p className="text-xs text-slate-400 mt-1">Đang nạp dữ liệu giáo dục và cấu hình sư phạm số...</p>
          </div>
        </div>
      </div>
    );
  }

  // Student specific navigation handlers
  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentView('lesson-view');
  };

  const handleStartPractice = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setCurrentView('practice-runner');
  };

  const handleTakeExam = (examId: string) => {
    setActiveExamId(examId);
    setCurrentView('exam-room');
  };

  const handleHeaderNav = (tab: string) => {
    if (tab === 'dashboard') setCurrentView(isTeacher ? 'dashboard' : 'student-dashboard');
    else if (tab === 'ai-lesson-gen') setCurrentView('lesson-ai');
    else if (tab === 'exam-matrix') setCurrentView('exam-matrix');
    else if (tab === 'grading') setCurrentView('grading');
    else if (tab === 'lessons') setCurrentView('student-courses');
    else if (tab === 'practice') setCurrentView('student-practice');
    else if (tab === 'exams') setCurrentView('student-exams');
    else setCurrentView(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Universal Header */}
      <Header 
        currentTab={currentView} 
        onSelectTab={handleHeaderNav} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Role-Based Sidebar Navigation (Desktop + Mobile Drawer) */}
        {currentView !== 'exam-room' && (
          <Sidebar
            currentView={currentView}
            onSelectView={(view) => setCurrentView(view)}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${currentView === 'exam-room' ? 'max-w-5xl mx-auto w-full' : ''}`}>
          {/* TEACHER & ADMIN VIEWS */}
          {isTeacher && (
            <>
              {currentView === 'dashboard' && (
                <TeacherDashboard
                  onNavigate={(view) => setCurrentView(view)}
                  onOpenLessonAI={() => setCurrentView('lesson-ai')}
                  onOpenExamMatrix={() => setCurrentView('exam-matrix')}
                  onOpenGrading={() => setCurrentView('grading')}
                />
              )}
              {currentView === 'lesson-ai' && (
                <AILessonGenerator
                  onLessonCreated={() => setCurrentView('courses')}
                  onBack={() => setCurrentView('dashboard')}
                />
              )}
              {currentView === 'exam-matrix' && (
                <ExamMatrixBuilder
                  onExamPublished={() => setCurrentView('grading')}
                />
              )}
              {currentView === 'courses' && (
                <CourseManager
                  onOpenLessonAI={() => setCurrentView('lesson-ai')}
                />
              )}
              {currentView === 'materials' && <MaterialManager />}
              {currentView === 'question-bank' && <QuestionBankManager />}
              {currentView === 'grading' && <GradingManager />}
              {currentView === 'classes' && <ClassManager />}
              {currentView === 'sheets-sync' && <GoogleSheetsSync />}
              {currentView === 'settings' && <TeacherSettings />}
            </>
          )}

          {/* STUDENT VIEWS */}
          {isStudent && (
            <>
              {(currentView === 'student-dashboard' || currentView === 'student-courses' || currentView === 'student-exams') && (
                <StudentDashboard
                  user={user}
                  onOpenLesson={handleOpenLesson}
                  onTakeExam={handleTakeExam}
                />
              )}
              {currentView === 'lesson-view' && (
                <LessonViewer
                  lessonId={activeLessonId}
                  studentId={user.id}
                  onBack={() => setCurrentView('student-dashboard')}
                  onStartPractice={handleStartPractice}
                />
              )}
              {currentView === 'practice-runner' && (
                <PracticeQuizRunner
                  lessonId={activeLessonId}
                  studentId={user.id}
                  onBack={() => setCurrentView('lesson-view')}
                />
              )}
              {currentView === 'exam-room' && (
                <ExamTakingRoom
                  examId={activeExamId}
                  studentId={user.id}
                  studentName={user.fullName}
                  onExit={() => setCurrentView('student-dashboard')}
                />
              )}
              {currentView === 'student-practice' && (
                <StudentDashboard
                  user={user}
                  onOpenLesson={handleOpenLesson}
                  onTakeExam={handleTakeExam}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden in Exam Room for maximum focus) */}
      {currentView !== 'exam-room' && (
        <BottomNav
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          onOpenMore={() => setIsMobileMenuOpen(true)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
