import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Sparkles, Plus, CheckCircle2, Search, Filter, 
  Lightbulb, Layers, FileText, ChevronRight, Save 
} from 'lucide-react';
import { Question, Lesson } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const QuestionBankManager: React.FC = () => {
  const { addToast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState('lesson-1');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // AI Quiz Generator modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [questionCount, setQuestionCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchLessonsAndQuizzes = async () => {
    try {
      setLoading(true);
      const [lesList, qList] = await Promise.all([
        api.getLessons(),
        api.getPracticeQuizzes(selectedLessonId)
      ]);
      setLessons(lesList);
      if (qList.length > 0) {
        setQuestions(qList[0].questions || []);
      }
    } catch (err) {
      console.error('Failed to load question bank:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonsAndQuizzes();
  }, [selectedLessonId]);

  const handleGenerateAIQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetLesson = lessons.find(l => l.id === selectedLessonId);
    if (!targetLesson) return;

    try {
      setIsGenerating(true);
      const generated = await api.generatePracticeAI({
        lessonTitle: targetLesson.title,
        subject: 'Toán học',
        grade: '10',
        lessonContent: JSON.stringify(targetLesson.contentAI || {}),
        questionCount
      });

      // Save as practice quiz
      await api.createPracticeQuiz({
        lessonId: targetLesson.id,
        courseId: targetLesson.courseId,
        title: `Bài luyện tập nhanh: ${targetLesson.title}`,
        timeLimitMinutes: 15,
        passPercentage: 80,
        questions: generated
      });

      setQuestions(generated);
      setShowAiModal(false);
      addToast(
        'Sinh câu hỏi AI thành công!',
        `Đã tạo ${generated.length} câu hỏi phân tầng 4 mức độ có kèm gợi ý Hint 1 & Hint 2.`,
        'success'
      );
    } catch (err: any) {
      addToast('Lỗi tạo câu hỏi', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterDifficulty === 'all') return true;
    return q.difficulty === filterDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            Ngân Hàng Câu Hỏi & Bài Luyện Tập AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Câu hỏi đa dạng (Trắc nghiệm, Đúng/Sai, Điền số, Tự luận), tích hợp hệ thống gợi ý 2 cấp độ giúp học sinh tự sửa sai.
          </p>
        </div>

        <button
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50"
        >
          <Sparkles className="w-4 h-4" />
          Sinh Bộ Câu Hỏi AI Với Gợi Ý
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Chọn Bài học:</label>
          <select
            value={selectedLessonId}
            onChange={(e) => setSelectedLessonId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Mức độ:</span>
          {['all', 'nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao'].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterDifficulty === diff
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {diff === 'all' ? 'Tất cả' : diff.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div key={q.id || idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-xs">
                Câu {idx + 1} ({q.type === 'multiple_choice' ? 'Trắc nghiệm' : q.type === 'true_false' ? 'Đúng/Sai' : 'Trả lời ngắn'}) • {q.points || 2.5} điểm
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 uppercase border border-slate-700">
                Mức độ: {q.difficulty}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-white">{q.question}</p>

            {q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`p-2.5 rounded-xl border ${opt === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}

            {/* Explanations & Pedagogical Hints */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <p className="text-emerald-400 font-semibold">
                ✓ Đáp án chuẩn: <span className="text-white">{q.correctAnswer}</span>
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                💡 Lời giải chi tiết: {q.explanation}
              </p>
              {(q.hint1 || q.hint2) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  {q.hint1 && (
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-amber-300">
                      <span className="font-bold">Gợi ý Cấp 1 (Định hướng): </span>{q.hint1}
                    </div>
                  )}
                  {q.hint2 && (
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-teal-300">
                      <span className="font-bold">Gợi ý Cấp 2 (Công thức): </span>{q.hint2}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Generate Quiz Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Sinh Câu Hỏi Luyện Tập Chuẩn Sư Phạm
            </h3>

            <form onSubmit={handleGenerateAIQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số lượng câu hỏi</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  min="2"
                  max="10"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
                >
                  {isGenerating ? 'Gemini AI Đang Tạo...' : 'Bắt đầu sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
