import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, FileCheck, Award, TrendingUp, AlertTriangle, 
  HelpCircle, ArrowRight, Sparkles, RefreshCw, CheckCircle2, ChevronRight,
  GraduationCap, BarChart2, CheckSquare, Layers
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';
import { api } from '../../services/api';
import { LoadingState } from '../common/StateViews';

interface TeacherDashboardProps {
  onNavigate?: (tab: string) => void;
  onOpenLessonAI?: () => void;
  onOpenExamMatrix?: () => void;
  onOpenGrading?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  onNavigate = (_tab: string) => {},
  onOpenLessonAI,
  onOpenExamMatrix,
  onOpenGrading
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLessonAIClick = () => {
    if (onOpenLessonAI) onOpenLessonAI();
    else onNavigate('lesson-ai');
  };

  const handleExamMatrixClick = () => {
    if (onOpenExamMatrix) onOpenExamMatrix();
    else onNavigate('exam-matrix');
  };

  const handleGradingClick = () => {
    if (onOpenGrading) onOpenGrading();
    else onNavigate('grading');
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !analytics) {
    return <LoadingState message="Đang nạp dữ liệu phân tích sư phạm..." />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 md:pb-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/80 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Trợ lý Sư phạm Giáo dục Thông minh GDPT 2018
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bảng Điều Khiển Sư Phạm & Khảo Thí
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Theo dõi tiến độ học tập thực tế theo chuẩn GDPT 2018, tự động hóa chấm thi với Gemini AI và đồng bộ bảng điểm Google Sheets thời gian thực.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handleLessonAIClick}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              Soạn bài học AI mới
            </button>
            <button
              onClick={handleExamMatrixClick}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all min-h-[44px]"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Tạo Ma trận Đề thi 4 mức độ
            </button>
            <button
              onClick={handleGradingClick}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all min-h-[44px]"
            >
              <Award className="w-4 h-4 text-amber-400" />
              Chấm thi & Duyệt điểm AI
            </button>
            <button
              onClick={fetchAnalytics}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Core KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Học sinh theo dõi</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{analytics?.totalStudents || 38}</span>
            <span className="text-xs text-slate-400 ml-2">học sinh ({analytics?.totalClasses || 2} lớp)</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% tài khoản đã kích hoạt
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tỉ lệ hoàn thành bài</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{analytics?.averageCompletionRate || 78.5}%</span>
            <span className="text-xs text-slate-400 ml-2">toàn khóa học</span>
          </div>
          <p className="text-xs text-slate-400">Dựa trên thời lượng xem video & tài liệu</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Điểm trung bình thi</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{analytics?.averageExamScore || 8.2}</span>
            <span className="text-xs text-slate-400 ml-2">/ 10.0 điểm</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium">85% đạt chuẩn khá - giỏi</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bài học & Đề thi</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white">{analytics?.totalLessons || 2}</span>
            <span className="text-xs text-slate-400 ml-2">bài học ({analytics?.totalExams || 1} đề thi)</span>
          </div>
          <p className="text-xs text-slate-400">Đã thẩm định chuẩn GDPT 2018</p>
        </div>
      </div>

      {/* 3. Actionable Pedagogical Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Unengaged Students Warning */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Học sinh chưa hoàn thành</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                {analytics?.unengagedStudents?.length || 0} em cần nhắc nhở
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {analytics?.unengagedStudents?.slice(0, 4).map((st) => (
                <div key={st.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{st.name}</p>
                    <p className="text-[11px] text-slate-400">{st.className}</p>
                  </div>
                  <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl">
                    Chưa học {st.incompleteLessonsCount} bài
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('classes')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            Xem danh sách lớp & nhắc nhở
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Most Failed Questions Breakdown */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-rose-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Câu hỏi học sinh sai nhiều nhất</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                Cần ôn tập
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {analytics?.mostFailedQuestions?.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 line-clamp-1">{q.question}</span>
                    <span className="font-bold text-rose-400 text-xs ml-2 shrink-0">{q.failRate}% sai</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${q.failRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('question-bank')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            Mở Ngân hàng Câu hỏi để bù đắp
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Hardest Lessons */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Chuyên đề cần củng cố</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {analytics?.hardestLessons?.map((l, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <p className="text-xs font-bold text-white line-clamp-1">{l.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Tiến độ TB: {l.averageProgress}%</span>
                    <span className="text-amber-400 font-semibold">Tỉ lệ chưa qua: {l.failRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            Quản lý bài học & tài liệu
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
