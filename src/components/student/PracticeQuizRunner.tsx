import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, ArrowLeft, CheckCircle2, XCircle, Lightbulb, 
  Sparkles, Award, RefreshCw, ChevronRight, BookOpen 
} from 'lucide-react';
import { PracticeQuiz, Question } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingState, EmptyState } from '../common/StateViews';

interface PracticeQuizRunnerProps {
  lessonId: string;
  studentId: string;
  onBack: () => void;
}

export const PracticeQuizRunner: React.FC<PracticeQuizRunnerProps> = ({ 
  lessonId, 
  studentId, 
  onBack 
}) => {
  const { addToast } = useToast();
  const [quiz, setQuiz] = useState<PracticeQuiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [hintsRevealed, setHintsRevealed] = useState<Record<string, { hint1?: boolean; hint2?: boolean }>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const qList = await api.getPracticeQuizzes(lessonId);
        if (qList.length > 0) {
          setQuiz(qList[0]);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleSelectAnswer = (qId: string, ans: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const toggleHint = (qId: string, level: 'hint1' | 'hint2') => {
    setHintsRevealed(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [level]: !prev[qId]?.[level]
      }
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    try {
      const res = await api.submitPracticeAttempt({
        practiceQuizId: quiz.id,
        lessonId,
        answers: userAnswers
      });
      setResultScore(res.score);
      setIsSubmitted(true);
      if (res.isPassed) {
        addToast('Luyện tập xuất sắc!', `Bạn đã đạt ${res.score}/10 điểm (${res.correctCount}/${res.totalQuestions} câu đúng).`, 'success');
      } else {
        addToast('Cố gắng hơn nhé!', `Bạn đạt ${res.score}/10 điểm. Hãy xem lại lời giải chi tiết bên dưới.`, 'warning');
      }
    } catch (err: any) {
      addToast('Lỗi nộp bài', err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingState message="Đang nạp bài luyện tập cho bạn..." />;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="Chưa có câu hỏi luyện tập cho bài học này"
        description="Giáo viên đang hoàn thiện ngân hàng câu hỏi. Bạn có thể quay lại học bài hoặc thử sức với bài khác."
        actionText="Quay lại bài học"
        onAction={onBack}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Quay lại bài học"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Luyện Tập Nhanh Có Gợi Ý
            </span>
            <h1 className="text-lg sm:text-xl font-black text-white mt-1">{quiz.title}</h1>
          </div>
        </div>

        {isSubmitted && resultScore !== null && (
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Điểm Đạt Được</p>
              <p className="text-base font-black text-amber-400">{resultScore} / 10</p>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const selected = userAnswers[q.id];
          const isCorrect = isSubmitted && selected === q.correctAnswer;
          const isWrong = isSubmitted && selected && selected !== q.correctAnswer;
          const qHints = hintsRevealed[q.id] || {};

          return (
            <div
              key={q.id || idx}
              className={`bg-slate-900 rounded-3xl border p-6 sm:p-7 space-y-4 shadow-xl transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-rose-500/50 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs">
                  Câu {idx + 1} • {q.points || 2.5} điểm
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 uppercase">
                  {q.difficulty === 'recognition' ? 'Nhận biết' : q.difficulty === 'understanding' ? 'Thông hiểu' : q.difficulty === 'application' ? 'Vận dụng' : 'Vận dụng cao'}
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">{q.question}</p>

              {/* Options with touch target >= 44px */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, oi) => {
                    const isOptSelected = selected === opt;
                    const isOptCorrect = isSubmitted && opt === q.correctAnswer;

                    return (
                      <button
                        key={oi}
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all min-h-[48px] ${
                          isOptCorrect
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : isOptSelected && isWrong
                            ? 'bg-rose-600 text-white border-rose-500'
                            : isOptSelected
                            ? 'bg-slate-800 text-emerald-300 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Progressive Hints (Pedagogy) */}
              {!isSubmitted && (q.hint1 || q.hint2) && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {q.hint1 && (
                      <button
                        onClick={() => toggleHint(q.id, 'hint1')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[38px] ${
                          qHints.hint1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                        }`}
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {qHints.hint1 ? 'Ẩn Gợi ý 1' : 'Xem Gợi ý 1 (Định hướng)'}
                      </button>
                    )}
                    {q.hint2 && (
                      <button
                        onClick={() => toggleHint(q.id, 'hint2')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[38px] ${
                          qHints.hint2 ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-teal-300 hover:bg-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {qHints.hint2 ? 'Ẩn Gợi ý 2' : 'Xem Gợi ý 2 (Công thức)'}
                      </button>
                    )}
                  </div>

                  {qHints.hint1 && (
                    <div className="bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-2xl text-xs text-amber-200 animate-in fade-in">
                      💡 <strong>Gợi ý định hướng:</strong> {q.hint1}
                    </div>
                  )}
                  {qHints.hint2 && (
                    <div className="bg-teal-950/20 border border-teal-800/40 p-3.5 rounded-2xl text-xs text-teal-200 animate-in fade-in">
                      ✨ <strong>Gợi ý công thức:</strong> {q.hint2}
                    </div>
                  )}
                </div>
              )}

              {/* Explanations when submitted */}
              {isSubmitted && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Bạn đã trả lời chính xác!
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Bạn chọn chưa chính xác.
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-300 font-semibold">Đáp án đúng: {q.correctAnswer}</p>
                  <p className="text-slate-300 leading-relaxed font-mono pt-1">
                    📖 Lời giải chi tiết: {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!isSubmitted ? (
        <div className="sticky bottom-6 bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-between">
          <span className="text-xs text-slate-300">
            Đã làm <strong className="text-emerald-400 font-bold">{Object.keys(userAnswers).length}/{quiz.questions.length}</strong> câu
          </span>

          <button
            onClick={handleSubmitQuiz}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all min-h-[44px]"
          >
            Nộp Bài Luyện Tập
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-4 gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold min-h-[44px]"
          >
            Quay lại bài học
          </button>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setUserAnswers({});
              setResultScore(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            Luyện tập lại
          </button>
        </div>
      )}
    </div>
  );
};
