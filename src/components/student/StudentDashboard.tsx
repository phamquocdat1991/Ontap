import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, CheckCircle2, Clock, Play, FileText, 
  ArrowRight, Flame, Sparkles, TrendingUp, HelpCircle, 
  ChevronRight, Calendar, Star, Target, CheckCircle 
} from 'lucide-react';
import { Course, Lesson, Exam, LessonProgress, User } from '../../types';
import { api } from '../../services/api';
import { LoadingState } from '../common/StateViews';

interface StudentDashboardProps {
  user: User;
  onOpenLesson: (lessonId: string) => void;
  onTakeExam: (examId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onOpenLesson, onTakeExam }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cList, lList, eList, pList] = await Promise.all([
          api.getCourses(),
          api.getLessons(),
          api.getExams(),
          api.getStudentProgress(user.id)
        ]);
        setCourses(cList);
        setLessons(lList.filter(l => l.status === 'published'));
        setExams(eList.filter(e => e.status === 'published'));
        setProgressList(pList);
      } catch (err) {
        console.error('Failed to load student data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return <LoadingState message="Đang nạp dữ liệu học tập của bạn..." />;
  }

  // Filter lessons & exams by selected course
  const filteredLessons = selectedCourseId === 'all' 
    ? lessons 
    : lessons.filter(l => l.courseId === selectedCourseId);

  const filteredExams = selectedCourseId === 'all'
    ? exams
    : exams.filter(e => e.courseId === selectedCourseId);

  // Active course details
  const activeCourse = courses.find(c => c.id === selectedCourseId);

  // Calculations
  const completedLessons = progressList.filter(p => p.status === 'completed' || p.progressPercentage >= 90).length;
  const totalLessons = lessons.length || 1;
  const overallPercentage = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/80 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Học sinh • {user.className || 'Lớp 10A1'}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Flame className="w-4 h-4 fill-amber-400" /> Chuỗi 5 ngày học liên tiếp
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Chào mừng trở lại, {user.fullName}! 
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn đang học môn <strong className="text-emerald-400">Toán 10 (Bộ Kết Nối Tri Thức)</strong>. Hãy hoàn thành các bài học để tự tin bứt phá trong bài kiểm tra sắp tới nhé!
            </p>
          </div>

          {/* Quick Motivational Stats Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm self-start md:self-auto shrink-0 shadow-lg">
            <div className="text-center pr-4 border-r border-slate-800">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{overallPercentage}%</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Đã Hoàn Thành</p>
            </div>
            <div className="text-center pl-2">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{completedLessons}/{lessons.length}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400">Bài Đã Học</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 shrink-0">Môn học:</span>
        <button
          onClick={() => setSelectedCourseId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCourseId === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tất cả các môn ({lessons.length} bài)
        </button>
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCourseId === c.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.subject} {c.grade}
          </button>
        ))}
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Course Syllabus & Lessons (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  {activeCourse ? `Bài Học: ${activeCourse.title}` : 'Lộ Trình Bài Học GDPT 2018'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeCourse?.description || 'Chuẩn chương trình Giáo dục Phổ thông 2018'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {filteredLessons.length} bài học
              </span>
            </div>

            {/* Lessons List with clear cards and large buttons */}
            <div className="space-y-3.5">
              {filteredLessons.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Chưa có bài học nào trong môn này. Hãy chọn "Tất cả các môn" để xem các bài học khác.</p>
                </div>
              ) : (
                filteredLessons.map((les) => {
                  const prog = progressList.find(p => p.lessonId === les.id);
                  const isCompleted = prog?.status === 'completed' || (prog?.progressPercentage || 0) >= 90;
                  const percent = prog?.progressPercentage || 0;

                  return (
                    <div
                      key={les.id}
                      className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            Bài {les.order}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate">
                            {les.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã hoàn thành
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">
                          {les.learningObjectives?.join(' • ') || 'Nắm vững khái niệm và công thức cốt lõi'}
                        </p>

                        {/* Progress bar */}
                        <div className="space-y-1 pt-1 max-w-sm">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Tiến độ học</span>
                            <span className="font-mono font-bold text-emerald-400">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          onClick={() => onOpenLesson(les.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                            isCompleted
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                          }`}
                        >
                          {isCompleted ? 'Ôn tập lại' : percent > 0 ? 'Học tiếp' : 'Bắt đầu học'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Exams & Target Challenges (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Assigned Exams */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Đề Kiểm Tra Được Giao
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {filteredExams.length} đề thi
              </span>
            </div>

            <div className="space-y-3">
              {filteredExams.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Không có đề thi nào trong môn này.
                </div>
              ) : (
                filteredExams.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ex.type === 'midterm' ? 'Giữa kỳ' : ex.type === 'regular' ? '15 Phút' : 'Cuối kỳ'}
                      </span>
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" /> {ex.durationMinutes} phút
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">{ex.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Gồm {ex.questionCount || 4} câu hỏi (Trắc nghiệm & Tự luận có giải thích)
                      </p>
                    </div>

                    <button
                      onClick={() => onTakeExam(ex.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all min-h-[44px]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Vào Phòng Kiểm Tra
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Learning Tip Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400">
              <Star className="w-4 h-4 fill-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Mẹo học tập hiệu quả</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hãy chú ý phần <strong className="text-rose-400">Lỗi thường gặp</strong> trong mỗi bài học để tránh mất điểm đáng tiếc ở các bài toán vectơ nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
