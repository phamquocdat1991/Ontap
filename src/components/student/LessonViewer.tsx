import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, CheckCircle2, Clock, Sparkles, 
  HelpCircle, ChevronRight, ChevronLeft, AlertTriangle, 
  Lightbulb, Play, FileText, Check, Lock, CheckCircle,
  Share2, Bookmark, BarChart2
} from 'lucide-react';
import { Lesson, Material, LessonProgress, Course, Chapter } from '../../types';
import { api } from '../../services/api';
import { SmartMaterialViewer } from '../materials/SmartMaterialViewer';
import { useToast } from '../../context/ToastContext';

interface LessonViewerProps {
  lessonId: string;
  studentId: string;
  onBack: () => void;
  onStartPractice: (lessonId: string) => void;
}

type SectionKey = 'material' | 'concepts' | 'formulas' | 'examples' | 'mistakes';

export const LessonViewer: React.FC<LessonViewerProps> = ({ 
  lessonId, 
  studentId, 
  onBack,
  onStartPractice 
}) => {
  const { addToast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('material');
  const [loading, setLoading] = useState(true);
  const [viewedSections, setViewedSections] = useState<Record<string, boolean>>({ material: true });

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);
        const [lList, mList, pList, cList, chList] = await Promise.all([
          api.getLessons(),
          api.getMaterials(lessonId),
          api.getStudentProgress(studentId),
          api.getCourses(),
          api.getChapters()
        ]);

        const curLesson = lList.find(l => l.id === lessonId);
        if (curLesson) {
          setLesson(curLesson);
          const curCourse = cList.find(c => c.id === curLesson.courseId);
          if (curCourse) setCourse(curCourse);
          const curChapter = chList.find(ch => ch.id === curLesson.chapterId);
          if (curChapter) setChapter(curChapter);
        }

        setMaterials(mList);
        if (mList.length > 0) setSelectedMaterial(mList[0]);

        const curProg = pList.find(p => p.lessonId === lessonId);
        if (curProg) {
          setProgress(curProg);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonData();
  }, [lessonId, studentId]);

  const sectionsList: { id: SectionKey; label: string; icon: any; desc: string }[] = [
    { id: 'material', label: 'Tài liệu & Video bài giảng', icon: Play, desc: 'Bài giảng số & Giáo trình PDF' },
    { id: 'concepts', label: 'Khái niệm & Thuật ngữ', icon: BookOpen, desc: 'Khái niệm trọng tâm chuẩn GDPT' },
    { id: 'formulas', label: 'Công thức cốt lõi', icon: Sparkles, desc: 'Công thức & Định lý then chốt' },
    { id: 'examples', label: 'Ví dụ giải mẫu', icon: Lightbulb, desc: 'Bài toán mẫu có bình giải' },
    { id: 'mistakes', label: 'Lỗi thường gặp & Mẹo', icon: AlertTriangle, desc: 'Sai lầm phổ biến & Cách sửa' },
  ];

  const handleSelectSection = (secId: SectionKey) => {
    setActiveSection(secId);
    setViewedSections(prev => ({ ...prev, [secId]: true }));
  };

  const handleMaterialProgress = async (matProg: {
    materialId: string;
    completed: boolean;
    pagesRead?: number[];
    videoSecondsWatched?: number;
    videoTotalSeconds?: number;
  }) => {
    if (!lesson) return;
    try {
      const updated = await api.updateProgress({
        lessonId: lesson.id,
        courseId: lesson.courseId,
        materialProgress: {
          [matProg.materialId]: {
            materialId: matProg.materialId,
            completed: matProg.completed,
            pagesRead: matProg.pagesRead,
            videoSecondsWatched: matProg.videoSecondsWatched,
            videoTotalSeconds: matProg.videoTotalSeconds
          }
        }
      });
      setProgress(updated);
      if (matProg.completed) {
        addToast('Tuyệt vời!', 'Bạn đã hoàn thành xem tài liệu bài học này!', 'success');
      }
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const currentSectionIndex = sectionsList.findIndex(s => s.id === activeSection);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < sectionsList.length - 1;

  const goToPrevSection = () => {
    if (hasPrev) {
      handleSelectSection(sectionsList[currentSectionIndex - 1].id);
    }
  };

  const goToNextSection = () => {
    if (hasNext) {
      handleSelectSection(sectionsList[currentSectionIndex + 1].id);
    }
  };

  if (loading || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Đang tải nội dung bài học...</h3>
          <p className="text-xs text-slate-400 mt-1">Đồng bộ học liệu chuẩn GDPT 2018</p>
        </div>
      </div>
    );
  }

  const content = lesson.contentAI;
  const progressPercent = progress?.progressPercentage || (Object.keys(viewedSections).length * 20);
  const isLessonCompleted = progress?.status === 'completed' || progressPercent >= 90;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* 1. Pedagogical Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap overflow-x-auto py-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Góc học tập</span>
        </button>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300 font-medium truncate max-w-[150px]">
          {course?.title || 'Toán học 10'}
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300 font-medium truncate max-w-[200px]">
          {chapter?.title || 'Chương IV: Vectơ'}
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold truncate">
          Bài {lesson.order}: {lesson.title}
        </span>
      </nav>

      {/* 2. Lesson Title & Overview Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Bài {lesson.order} • GDPT 2018
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Thời lượng: {lesson.durationMinutes || 45} phút
              </span>
              <span className="text-xs text-slate-400">
                Bộ sách: <strong className="text-slate-200">{course?.bookSeries || 'Kết Nối Tri Thức'}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {lesson.title}
            </h1>

            {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
              <div className="flex items-start gap-2 pt-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 mt-0.5">
                  Mục tiêu cần đạt:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lesson.learningObjectives.join(' • ')}
                </p>
              </div>
            )}
          </div>

          {/* Quick Practice Trigger Button (Top Right) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onStartPractice(lesson.id)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all min-h-[44px]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Luyện Tập Nhanh (Có gợi ý)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prominent Progress Bar */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Tiến độ học tập bài học:
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {progressPercent}% {isLessonCompleted && '• Đã hoàn thành ✓'}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Main Body: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Curriculum Content Outline & Section Tracker (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Mục lục bài học
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                {Object.keys(viewedSections).length}/{sectionsList.length} phần
              </span>
            </div>

            <div className="space-y-2">
              {sectionsList.map((sec, idx) => {
                const isActive = activeSection === sec.id;
                const isViewed = viewedSections[sec.id];
                const Icon = sec.icon;

                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 min-h-[48px] ${
                      isActive
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : isViewed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 truncate">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                          {idx + 1}. {sec.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {sec.desc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isViewed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Review Prompt Card */}
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Tự đánh giá năng lực</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sau khi đọc xong lý thuyết và ví dụ mẫu, hãy hoàn thành bài luyện tập để củng cố kiến thức và tích lũy điểm thưởng!
            </p>
            <button
              onClick={() => onStartPractice(lesson.id)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Mở bài luyện tập ngay
            </button>
          </div>
        </div>

        {/* Right Column: Central Reading Stage (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Content Viewer Container */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 min-h-[450px]">
            {/* Section Active Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Phần {currentSectionIndex + 1} / {sectionsList.length}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {sectionsList[currentSectionIndex].label}
                </h2>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {sectionsList[currentSectionIndex].desc}
              </span>
            </div>

            {/* TAB 1: Smart Material & Video Viewer */}
            {activeSection === 'material' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {materials.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <span className="text-xs text-slate-400 font-semibold shrink-0">Chọn học liệu:</span>
                    {materials.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMaterial(m)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedMaterial?.id === m.id 
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {m.filename}
                      </button>
                    ))}
                  </div>
                )}

                {selectedMaterial ? (
                  <SmartMaterialViewer
                    material={selectedMaterial}
                    lessonId={lesson.id}
                    userId={studentId}
                    initialProgress={progress || undefined}
                    onProgressUpdate={(newProg) => setProgress(newProg)}
                  />
                ) : (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-white">Chưa có tệp học liệu đính kèm</p>
                    <p className="text-xs text-slate-400">Bạn có thể theo dõi nội dung tóm lược lý thuyết ở các phần tiếp theo.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Concepts & Definitions */}
            {activeSection === 'concepts' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-slate-400">
                  Các khái niệm, thuật ngữ then chốt học sinh cần hiểu rõ và nắm vững:
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {content?.concepts?.map((c, i) => (
                    <div 
                      key={i} 
                      className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 space-y-2 hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-emerald-300">{c.term}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-8">
                        {c.definition}
                      </p>
                    </div>
                  )) || <p className="text-slate-400 text-xs">Chưa có dữ liệu khái niệm.</p>}
                </div>
              </div>
            )}

            {/* TAB 3: Formulas & Theorems */}
            {activeSection === 'formulas' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-slate-400">
                  Hệ thống công thức, định lý toán học trọng tâm cần ghi nhớ:
                </p>
                <div className="space-y-4">
                  {content?.formulas?.map((f, i) => (
                    <div key={i} className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-cyan-300">{f.name}</h3>
                        </div>
                        {f.note && (
                          <span className="text-xs text-slate-400 italic bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                            {f.note}
                          </span>
                        )}
                      </div>
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-emerald-300 font-bold text-sm sm:text-base tracking-wide overflow-x-auto">
                        {f.formula}
                      </div>
                    </div>
                  )) || <p className="text-slate-400 text-xs">Chưa có công thức.</p>}
                </div>
              </div>
            )}

            {/* TAB 4: Examples & Solutions */}
            {activeSection === 'examples' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-slate-400">
                  Ví dụ minh họa có lời giải chi tiết và định hướng phương pháp:
                </p>
                <div className="space-y-5">
                  {content?.examples?.map((ex, i) => (
                    <div key={i} className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                          Ví dụ {i + 1}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                        {ex.question}
                      </p>
                      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line font-mono leading-relaxed overflow-x-auto">
                        {ex.solution}
                      </div>
                      {ex.explanation && (
                        <div className="bg-emerald-950/20 border border-emerald-800/30 p-3 rounded-xl text-xs text-emerald-300">
                          💡 <strong>Nhận xét sư phạm:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  )) || <p className="text-slate-400 text-xs">Chưa có ví dụ mẫu.</p>}
                </div>
              </div>
            )}

            {/* TAB 5: Mistakes & Advice */}
            {activeSection === 'mistakes' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-slate-400">
                  Các sai lầm học sinh thường gặp trong bài kiểm tra và cách khắc phục:
                </p>
                <div className="space-y-4">
                  {content?.commonMistakes?.map((m, i) => (
                    <div key={i} className="bg-rose-950/20 rounded-2xl border border-rose-900/40 p-5 space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        Lỗi sai: {m.mistake}
                      </p>
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-emerald-300 font-medium">
                        ✓ <strong>Phương pháp đúng:</strong> {m.correction}
                      </div>
                      {m.advice && (
                        <p className="text-xs text-slate-400 italic pl-1">
                          Lời khuyên: {m.advice}
                        </p>
                      )}
                    </div>
                  )) || <p className="text-slate-400 text-xs">Chưa có dữ liệu lỗi sai.</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons (Bottom of Central Stage) */}
            <div className="border-t border-slate-800 pt-6 flex items-center justify-between flex-wrap gap-3">
              <button
                disabled={!hasPrev}
                onClick={goToPrevSection}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Phần trước</span>
              </button>

              <div className="flex items-center gap-3">
                {hasNext ? (
                  <button
                    onClick={goToNextSection}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all min-h-[44px]"
                  >
                    <span>Tiếp tục học phần tiếp</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onStartPractice(lesson.id)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all min-h-[44px]"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Làm bài luyện tập củng cố</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
