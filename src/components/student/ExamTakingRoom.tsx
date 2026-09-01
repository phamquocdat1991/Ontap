import React, { useState, useEffect } from 'react';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, ArrowLeft, 
  Send, FileText, Check, ShieldCheck, Sparkles, RefreshCw,
  HelpCircle, ChevronRight 
} from 'lucide-react';
import { Exam, ExamAttempt } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { LoadingState } from '../common/StateViews';

interface ExamTakingRoomProps {
  examId: string;
  studentId: string;
  studentName: string;
  onExit: () => void;
}

export const ExamTakingRoom: React.FC<ExamTakingRoomProps> = ({ 
  examId, 
  studentId, 
  studentName, 
  onExit 
}) => {
  const { addToast } = useToast();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(45 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const eList = await api.getExams();
        const curExam = eList.find(e => e.id === examId);
        if (curExam) {
          setExam(curExam);
          setTimeLeft((curExam.durationMinutes || 45) * 60);
        }
      } catch (err) {
        console.error('Failed to load exam:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (submissionResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submissionResult, timeLeft]);

  const handleSelectMC = (qId: string, option: string) => {
    if (submissionResult) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleEssayChange = (qId: string, text: string) => {
    if (submissionResult) return;
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleSubmitExam = async () => {
    if (!exam || isSubmitting || submissionResult) return;
    try {
      setIsSubmitting(true);
      setShowConfirmSubmit(false);
      const attempt = await api.submitExamAttempt({
        examId: exam.id,
        answers,
        durationSeconds: (exam.durationMinutes * 60) - timeLeft
      });

      setSubmissionResult(attempt);
      addToast(
        'Đã nộp bài kiểm tra thành công!',
        `Điểm số sơ bộ: ${attempt.score}/10. Kết quả đã được lưu trữ và đồng bộ an toàn.`,
        'success'
      );
    } catch (err: any) {
      addToast('Lỗi nộp bài', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !exam) {
    return <LoadingState message="Đang chuẩn bị đề kiểm tra cho bạn..." />;
  }

  // Result View after submission
  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 py-6">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Đã hoàn thành bài kiểm tra
            </span>
            <h1 className="text-2xl font-black text-white mt-3">{exam.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Học sinh: <strong className="text-slate-200">{studentName}</strong> • Thời gian làm bài: {Math.floor(submissionResult.durationSeconds / 60)} phút
            </p>
          </div>

          {/* Score Display Card */}
          <div className="grid grid-cols-3 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{submissionResult.correctCount}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Câu Đúng</p>
            </div>
            <div className="border-x border-slate-800">
              <p className="text-2xl sm:text-3xl font-black text-rose-400">{submissionResult.incorrectCount}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Câu Sai</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{submissionResult.score} / 10</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Điểm Tổng</p>
            </div>
          </div>

          {/* Status Notes */}
          <div className="text-left bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <p className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Điểm trắc nghiệm đã được chấm tự động.
            </p>
            {Object.keys(submissionResult.essayEvaluations || {}).length > 0 && (
              <p className="flex items-center gap-2 text-purple-300 font-semibold">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                Phần tự luận đã được Gemini AI sơ khảo theo thang điểm Rubric và chuyển tới Thầy/Cô thẩm định.
              </p>
            )}
            <p className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              Kết quả đã đồng bộ an toàn tới Google Sheets của lớp học.
            </p>
          </div>

          <button
            onClick={onExit}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all min-h-[44px]"
          >
            Quay Về Trang Học Tập
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalCount = exam.questions.length;
  const isUrgent = timeLeft < 300; // under 5 minutes

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-6">
      {/* Fixed / Sticky Exam Control Header */}
      <div className="bg-slate-900/95 backdrop-blur-md sticky top-16 z-30 p-4 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirmExit(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Thoát phòng thi"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase">
              Phòng Kiểm Tra Trực Tuyến
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">{exam.title}</h2>
          </div>
        </div>

        {/* Non-stressful Friendly Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
            isUrgent
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-950 text-slate-200 border-slate-800'
          }`}>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>Còn lại: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60 min-h-[44px]"
          >
            <Send className="w-4 h-4" />
            <span>Nộp bài thi</span>
          </button>
        </div>
      </div>

      {/* Progress pill tracker */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">
          Tiến độ: <strong className="text-emerald-400 font-bold">{answeredCount} / {totalCount}</strong> câu đã hoàn thành
        </span>
        <div className="flex items-center gap-1">
          {exam.questions.map((q, idx) => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${
                answers[q.id] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {exam.questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isEssay = q.type === 'essay';

          return (
            <div key={q.id || idx} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs">
                  Câu {idx + 1} ({isEssay ? 'Tự luận' : 'Trắc nghiệm'}) • {q.points || 2.5} điểm
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isAnswered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isAnswered ? '✓ Đã chọn đáp án' : 'Chưa làm'}
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">{q.question}</p>

              {/* Multiple Choice Options with touch target >= 44px */}
              {!isEssay && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelectMC(q.id, opt)}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all min-h-[48px] ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-500'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Essay Text Area */}
              {isEssay && (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={6}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleEssayChange(q.id, e.target.value)}
                    placeholder="Trình bày chi tiết các bước lập luận, biến đổi công thức và kết luận..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-mono resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Số từ: {(answers[q.id] || '').trim().split(/\s+/).filter(Boolean).length} từ</span>
                    <span>AI & Giáo viên sẽ chấm bài theo thang điểm Rubric</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Banner */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold text-white">
            Tiến độ làm bài: {answeredCount} / {totalCount} câu hỏi
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Hãy kiểm tra kỹ câu trả lời trước khi gửi bài chấm điểm.
          </p>
        </div>

        <button
          onClick={() => setShowConfirmSubmit(true)}
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-emerald-950/60 transition-all min-h-[44px]"
        >
          {isSubmitting ? 'Đang nộp bài...' : 'Nộp Bài Thi Ngay'}
        </button>
      </div>

      {/* Confirm Submit Dialog */}
      <ConfirmModal
        isOpen={showConfirmSubmit}
        title="Xác nhận nộp bài thi?"
        message={
          answeredCount < totalCount
            ? `Bạn mới chỉ hoàn thành ${answeredCount}/${totalCount} câu hỏi. Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?`
            : `Bạn đã hoàn thành đầy đủ ${answeredCount}/${totalCount} câu hỏi. Bạn có chắc chắn muốn nộp bài để hệ thống chấm điểm?`
        }
        confirmText="Xác nhận nộp bài"
        cancelText="Kiểm tra lại"
        type={answeredCount < totalCount ? 'warning' : 'success'}
        onConfirm={handleSubmitExam}
        onCancel={() => setShowConfirmSubmit(false)}
        isLoading={isSubmitting}
      />

      {/* Confirm Exit Dialog */}
      <ConfirmModal
        isOpen={showConfirmExit}
        title="Thoát phòng thi?"
        message="Bài làm của bạn chưa được nộp. Nếu thoát lúc này, tiến độ làm bài thi có thể không được lưu lại."
        confirmText="Rời khỏi phòng thi"
        cancelText="Tiếp tục làm bài"
        type="danger"
        onConfirm={onExit}
        onCancel={() => setShowConfirmExit(false)}
      />
    </div>
  );
};
