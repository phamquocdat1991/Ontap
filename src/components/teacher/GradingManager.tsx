import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle2, AlertCircle, Eye, Edit3, Sparkles, 
  Search, RefreshCw, Check, X, ShieldAlert, ArrowLeft 
} from 'lucide-react';
import { ExamAttempt, Exam } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const GradingManager: React.FC = () => {
  const { addToast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-1');
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [overrideScore, setOverrideScore] = useState<number>(0);
  const [teacherNote, setTeacherNote] = useState<string>('');
  const [isSavingReview, setIsSavingReview] = useState(false);

  const fetchExamsAndAttempts = async () => {
    try {
      setLoading(true);
      const exList = await api.getExams();
      setExams(exList);
      if (exList.length > 0) {
        const targetId = selectedExamId || exList[0].id;
        setSelectedExamId(targetId);
        const attList = await api.getExamAttempts(targetId);
        setAttempts(attList);
      }
    } catch (err) {
      console.error('Failed to load grading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamsAndAttempts();
  }, [selectedExamId]);

  const openAttemptReview = (att: ExamAttempt) => {
    setSelectedAttempt(att);
    setOverrideScore(att.score || 0);
    const firstEssayKey = att.essayEvaluations ? Object.keys(att.essayEvaluations)[0] : null;
    const firstEssay = firstEssayKey ? att.essayEvaluations[firstEssayKey] : null;
    setTeacherNote(firstEssay?.teacherNote || '');
  };

  const handleSaveReview = async () => {
    if (!selectedAttempt) return;
    try {
      setIsSavingReview(true);
      const updatedEvaluations = { ...(selectedAttempt.essayEvaluations || {}) };
      Object.keys(updatedEvaluations).forEach(k => {
        updatedEvaluations[k] = {
          ...updatedEvaluations[k],
          teacherApprovedScore: overrideScore,
          teacherNote: teacherNote,
          needsTeacherReview: false
        };
      });

      const res = await api.reviewExamAttempt(selectedAttempt.id, {
        score: overrideScore,
        essayEvaluations: updatedEvaluations,
        teacherNotes: teacherNote
      });

      setSelectedAttempt(res);
      // Update in list
      setAttempts(prev => prev.map(a => a.id === res.id ? res : a));
      addToast('Đã chốt điểm thành công!', `Bài thi của học sinh ${res.studentName} đã được cập nhật điểm chính thức: ${overrideScore} điểm.`, 'success');
      setSelectedAttempt(null);
    } catch (err: any) {
      addToast('Lỗi duyệt điểm', err.message, 'error');
    } finally {
      setIsSavingReview(false);
    }
  };

  const currentExam = exams.find(e => e.id === selectedExamId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Quản Lý Chấm Thi & Thẩm Định AI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống chấm trắc nghiệm tự động (deterministic) và AI đề xuất điểm tự luận dựa theo thang điểm Rubric.
          </p>
        </div>

        {/* Select Exam Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.durationMinutes}p)
              </option>
            ))}
          </select>

          <button
            onClick={fetchExamsAndAttempts}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Danh sách bài nộp: {attempts.length} học sinh
          </h2>
          <span className="text-[11px] text-emerald-400 font-semibold">
            {attempts.filter(a => a.status === 'graded').length} bài đã chấm xong
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Lớp</th>
                <th className="p-3.5">Thời gian nộp</th>
                <th className="p-3.5 text-center">Đúng / Sai</th>
                <th className="p-3.5 text-center">Điểm số</th>
                <th className="p-3.5">Trạng thái chấm</th>
                <th className="p-3.5">Đồng bộ Sheets</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {attempts.map((att) => {
                const durationMins = att.durationSeconds ? Math.floor(att.durationSeconds / 60) : 0;
                return (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                        {att.studentName?.charAt(0) || 'H'}
                      </div>
                      {att.studentName}
                    </td>
                    <td className="p-3.5 text-slate-300">{att.className || '10A1'}</td>
                    <td className="p-3.5 text-slate-400">
                      {att.submittedAt ? new Date(att.submittedAt).toLocaleTimeString('vi-VN') : 'Đang làm bài'}
                      <span className="block text-[10px] text-slate-500">{durationMins} phút</span>
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      <span className="text-emerald-400 font-bold">{att.correctCount || 0}</span>
                      <span className="text-slate-500"> / </span>
                      <span className="text-rose-400">{att.incorrectCount || 0}</span>
                    </td>
                    <td className="p-3.5 text-center font-bold text-sm">
                      {typeof att.score === 'number' ? (
                        <span className="text-amber-400">{att.score} / {att.totalScore || 10}</span>
                      ) : (
                        <span className="text-slate-500">--</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        att.status === 'graded' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        att.status === 'needs_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {att.status === 'graded' ? '✓ Đã chấm' : att.status === 'needs_review' ? '⚠️ Cần giáo viên duyệt' : 'Đang làm'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        att.syncStatus === 'success' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {att.syncStatus === 'success' ? 'Đã đồng bộ' : 'Chờ đồng bộ'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAttemptReview(att)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem & Duyệt Điểm
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal / Drawer */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Thẩm Định Bài Thi: {selectedAttempt.studentName}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Lớp {selectedAttempt.className} • Nộp lúc: {selectedAttempt.submittedAt ? new Date(selectedAttempt.submittedAt).toLocaleString('vi-VN') : ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions & Student Answers Review */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {currentExam?.questions.map((q, idx) => {
                const studentAns = selectedAttempt.answers[q.id];
                const essayEval = selectedAttempt.essayEvaluations?.[q.id];

                return (
                  <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-400">
                        Câu {idx + 1} ({q.type === 'multiple_choice' ? 'Trắc nghiệm' : q.type === 'essay' ? 'Tự luận' : 'Trả lời ngắn'}) • {q.points} điểm
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-white">{q.question}</p>

                    {/* Student answer container */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <p className="text-slate-400 font-semibold">Bài làm của học sinh:</p>
                      <p className="text-white whitespace-pre-line font-mono">{studentAns || '(Học sinh để trống)'}</p>
                    </div>

                    {/* Official answer key & explanation */}
                    <div className="text-xs text-slate-400">
                      <span className="text-emerald-400 font-semibold">Đáp án chuẩn: </span>
                      <span className="text-slate-300">{q.correctAnswer}</span>
                    </div>

                    {/* AI Essay Evaluation breakdown */}
                    {essayEval && (
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Gemini AI Đánh Giá Tự Luận Theo Rubric:
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            Điểm AI đề xuất: {essayEval.scoreProposal} / {essayEval.maxScore}đ (Độ tin cậy: {Math.round(essayEval.confidence * 100)}%)
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 italic font-mono bg-slate-900/80 p-2.5 rounded-lg border border-purple-900/50">
                          "{essayEval.reasoningSummary}"
                        </p>

                        {essayEval.needsTeacherReview && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            AI gắn cờ: Cần Thầy/Cô xác nhận hoặc điều chỉnh lại điểm số.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Teacher Final Override Controls */}
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Quyết Định Điểm Số Của Giáo Viên:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Điểm Tổng Chốt (/10)</label>
                  <input
                    type="number"
                    step="0.25"
                    max="10"
                    min="0"
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-2.5 text-base font-bold text-amber-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lời Phê & Nhận Xét Sư Phạm Cho Học Sinh</label>
                  <input
                    type="text"
                    value={teacherNote}
                    onChange={(e) => setTeacherNote(e.target.value)}
                    placeholder="VD: Bài làm tốt, trình bày logic. Chú ý vẽ hình rõ ràng hơn."
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={isSavingReview}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
                >
                  <Check className="w-4 h-4" />
                  {isSavingReview ? 'Đang lưu...' : 'Phê Duyệt & Chốt Điểm Thi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
