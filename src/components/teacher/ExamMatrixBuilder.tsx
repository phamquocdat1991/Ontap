import React, { useState, useMemo } from 'react';
import { 
  Layers, Sparkles, CheckCircle2, FileText, ArrowRight, 
  Edit3, Save, HelpCircle, ShieldCheck, ChevronRight, RefreshCw, Send,
  GraduationCap
} from 'lucide-react';
import { ExamMatrix, Question, Exam } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  EDUCATION_LEVELS, ALL_SUBJECTS, ALL_GRADES, 
  getSubjectsByGrade, getLevelByGrade, getLevelNameByGrade 
} from '../../constants/curriculum';

interface ExamMatrixBuilderProps {
  onExamPublished?: (exam: Exam) => void;
}

export const ExamMatrixBuilder: React.FC<ExamMatrixBuilderProps> = ({ onExamPublished }) => {
  const { addToast } = useToast();

  // Workflow steps: 1: Parameters -> 2: Matrix & Spec Generation -> 3: Review Matrix -> 4: Generate Exam -> 5: Final Review & Publish
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Level & Grade & Subject
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'primary' | 'secondary' | 'high'>('high');
  const [grade, setGrade] = useState('10');
  const [subject, setSubject] = useState('Toán học');

  const availableSubjects = useMemo(() => {
    return getSubjectsByGrade(grade);
  }, [grade]);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    const newSubjects = getSubjectsByGrade(newGrade);
    if (!newSubjects.some(s => s.name === subject)) {
      setSubject(newSubjects[0]?.name || 'Toán học');
    }
    setSelectedLevel(getLevelByGrade(newGrade));
  };

  // Step 1: Input Parameters
  const [examType, setExamType] = useState<'regular' | 'midterm' | 'final' | 'chapter_review'>('midterm');
  const [scope, setScope] = useState('Chương IV: Vectơ trong mặt phẳng tọa độ Oxy');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [totalScore, setTotalScore] = useState(10);
  const [questionCount, setQuestionCount] = useState(4);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['class-1', 'class-2']);

  // Step 2 & 3: Generated Matrix & Specification
  const [isGeneratingMatrix, setIsGeneratingMatrix] = useState(false);
  const [matrix, setMatrix] = useState<ExamMatrix | null>(null);
  const [specification, setSpecification] = useState('');
  const [isMatrixApproved, setIsMatrixApproved] = useState(false);

  // Step 4 & 5: Generated Exam Questions & Rubric
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [examTitle, setExamTitle] = useState('Kiểm tra Đánh giá Định kỳ: Vectơ và Hệ tọa độ Oxy (45 phút)');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [rubric, setRubric] = useState('');
  const [scoringGuide, setScoringGuide] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // 1. Generate Matrix with Gemini
  const handleGenerateMatrix = async () => {
    try {
      setIsGeneratingMatrix(true);
      const res = await api.generateMatrixAI({
        subject,
        grade,
        scope,
        durationMinutes,
        totalScore,
        questionCount,
        examType
      });
      setMatrix(res);
      setSpecification(`Bản đặc tả ma trận đề thi chuẩn Thông tư BGDĐT môn ${subject} ${grade}. Phạm vi: ${scope}. Bao gồm ${questionCount} câu hỏi phân tầng 4 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).`);
      setStep(3); // Go to Matrix Review step
      addToast('Tạo Ma trận Đề thi thành công!', 'Ma trận 4 mức độ và Bản đặc tả đã được xây dựng theo chuẩn GDPT 2018.', 'success');
    } catch (err: any) {
      addToast('Lỗi tạo ma trận', err.message, 'error');
    } finally {
      setIsGeneratingMatrix(false);
    }
  };

  // 2. Approve Matrix
  const handleApproveMatrix = async () => {
    setIsMatrixApproved(true);
    addToast('Đã phê duyệt Ma trận!', 'Bắt đầu sinh đề thi chính thức bám sát ma trận...', 'info');
    
    // Auto-generate full exam questions from approved matrix
    if (!matrix) return;
    try {
      setIsGeneratingExam(true);
      setStep(4);
      const examData = await api.generateExamFromMatrixAI({
        matrix,
        scope
      });
      setGeneratedQuestions(examData.questions || []);
      setRubric(examData.rubric || '');
      setScoringGuide(examData.scoringGuide || '');
      setSpecification(examData.specification || specification);
      setStep(5); // Final Review
      addToast('Sinh đề thi thành công!', 'Đề thi, đáp án và thang điểm Rubric đã sẵn sàng.', 'success');
    } catch (err: any) {
      addToast('Lỗi sinh đề thi', err.message, 'error');
    } finally {
      setIsGeneratingExam(false);
    }
  };

  // 3. Final Publish Exam to classes
  const handlePublishExam = async () => {
    try {
      setIsPublishing(true);
      let targetCourseId = `course-${subject.toLowerCase().replace(/\s+/g, '-')}-${grade}`;
      const courses = await api.getCourses();
      const existingCourse = courses.find(c => c.subject.toLowerCase() === subject.toLowerCase() && c.grade === grade);
      
      if (existingCourse) {
        targetCourseId = existingCourse.id;
      } else {
        const newCourse = await api.createCourse({
          title: `${subject} ${grade} - Đề Kiểm Tra`,
          subject,
          grade,
          description: `Khóa học và Ngân hàng đề kiểm tra môn ${subject} lớp ${grade}`,
          status: 'published'
        });
        targetCourseId = newCourse.id;
      }

      const newExam = await api.createExam({
        courseId: targetCourseId,
        classIds: selectedClasses,
        title: examTitle,
        type: examType,
        scope,
        durationMinutes,
        totalScore,
        questionCount: generatedQuestions.length,
        status: 'published',
        matrix: matrix || undefined,
        specification,
        questions: generatedQuestions,
        rubric,
        scoringGuide
      });

      addToast(
        'Đã công bố đề thi thành công!',
        `Đề thi "${examTitle}" (${subject} ${grade}) đã được gửi tới các lớp được phân công.`,
        'success'
      );
      onExamPublished?.(newExam);
    } catch (err: any) {
      addToast('Lỗi công bố đề thi', err.message, 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Workflow Stepper */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {[
            { s: 1, label: '1. Thông số Khảo thí' },
            { s: 3, label: '2. Ma trận 4 Mức độ' },
            { s: 4, label: '3. Sinh Đề thi AI' },
            { s: 5, label: '4. Duyệt Rubric & Công bố' }
          ].map((st) => (
            <div
              key={st.s}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                step >= st.s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= st.s ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
              }`}>
                {st.s === 1 ? '1' : st.s === 3 ? '2' : st.s === 4 ? '3' : '4'}
              </span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PARAMETER SELECTION */}
      {step === 1 && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Bước 1: Thiết lập Thông số Đề kiểm tra Đánh giá Năng lực
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Chuẩn hóa theo Chương trình GDPT 2018 áp dụng cho tất cả các cấp học (Tiểu học, THCS, THPT) và môn học.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Cấp học mục tiêu:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedLevel('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedLevel === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                {EDUCATION_LEVELS.map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl.id);
                      handleGradeChange(lvl.grades[0]);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedLevel === lvl.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Khối:</span>
              {ALL_GRADES.filter(g => selectedLevel === 'all' || getLevelByGrade(g) === selectedLevel).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeChange(g)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    grade === g
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Môn học ({availableSubjects.length} môn lớp {grade})
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {availableSubjects.map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Khối lớp</label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {ALL_GRADES.map(g => (
                  <option key={g} value={g}>
                    Lớp {g} ({getLevelNameByGrade(g)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hình thức Kiểm tra</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="regular">Kiểm tra Thường xuyên (15 - 20 phút)</option>
                <option value="midterm">Kiểm tra Giữa kỳ (45 phút)</option>
                <option value="final">Kiểm tra Cuối kỳ (90 phút)</option>
                <option value="chapter_review">Đánh giá Theo Chuyên đề</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Thời gian làm bài (Phút)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phạm vi Kiến thức / Chủ đề Đánh giá *</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="VD: Chương IV: Vectơ trong mặt phẳng tọa độ Oxy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tổng điểm</label>
              <input
                type="number"
                value={totalScore}
                onChange={(e) => setTotalScore(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Số lượng Câu hỏi dự kiến</label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateMatrix}
            disabled={isGeneratingMatrix}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingMatrix ? 'animate-spin' : ''}`} />
            {isGeneratingMatrix ? 'Gemini AI Đang Tính Toán Ma Trận Chuẩn BGDĐT...' : 'Tiếp tục: Xây Dựng Ma Trận & Bản Đặc Tả Đề Thi'}
          </button>
        </div>
      )}

      {/* STEP 3: REVIEW & APPROVE MATRIX */}
      {step === 3 && matrix && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Bước 2: Thẩm Định Ma Trận
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Ma Trận Đề Kiểm Tra & Bản Đặc Tả (4 Mức Độ Nhận Thức)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {subject} {grade} • {durationMinutes} phút • Thang điểm {totalScore}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700"
              >
                Chỉnh sửa thông số
              </button>
              <button
                onClick={handleApproveMatrix}
                disabled={isGeneratingExam}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isGeneratingExam ? 'Đang Sinh Đề Thi...' : 'Phê Duyệt Ma Trận & Sinh Đề Thi'}
              </button>
            </div>
          </div>

          {/* Matrix Table Visualizer */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-800 text-slate-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3 border-r border-slate-700">Chủ đề / Chương</th>
                  <th className="p-3 border-r border-slate-700 text-center bg-blue-950/40">1. Nhận biết (30-40%)</th>
                  <th className="p-3 border-r border-slate-700 text-center bg-emerald-950/40">2. Thông hiểu (30%)</th>
                  <th className="p-3 border-r border-slate-700 text-center bg-amber-950/40">3. Vận dụng (20%)</th>
                  <th className="p-3 border-r border-slate-700 text-center bg-purple-950/40">4. Vận dụng cao (10%)</th>
                  <th className="p-3 text-right">Tổng điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {matrix.cells?.map((cell, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white border-r border-slate-800">{cell.chapter}</td>
                    <td className="p-3 text-center border-r border-slate-800 font-mono">
                      {cell.nhanBiet.countMC} câu TN ({cell.nhanBiet.points}đ)
                    </td>
                    <td className="p-3 text-center border-r border-slate-800 font-mono">
                      {cell.thongHieu.countMC} câu TN ({cell.thongHieu.points}đ)
                    </td>
                    <td className="p-3 text-center border-r border-slate-800 font-mono">
                      {cell.vanDung.countMC} câu TN ({cell.vanDung.points}đ)
                    </td>
                    <td className="p-3 text-center border-r border-slate-800 font-mono">
                      {cell.vanDungCao.countEssay} câu TL ({cell.vanDungCao.points}đ)
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">{cell.totalPoints} điểm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Specification Document Card */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Bản Đặc Tả Đề Kiểm Tra (Specification):
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {specification}
            </p>
            {matrix.summaryNote && (
              <p className="text-[11px] text-slate-400 italic pt-1">
                📌 Lưu ý: {matrix.summaryNote}
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 4 & 5: FINAL EXAM QUESTIONS, RUBRICS, AND PUBLISH */}
      {step === 5 && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Bước 4: Kiểm Duyệt Đề Thi Chính Thức & Rubric
              </span>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="text-xl font-black text-white bg-transparent border-b border-slate-700 focus:border-emerald-500 outline-none w-full mt-1"
              />
            </div>

            <button
              onClick={handlePublishExam}
              disabled={isPublishing}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
            >
              <Send className="w-4 h-4" />
              {isPublishing ? 'Đang phát đề...' : 'Công Bố Đề Thi Cho Học Sinh'}
            </button>
          </div>

          {/* Generated Questions List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Danh sách {generatedQuestions.length} Câu hỏi Đề thi:
            </h3>

            {generatedQuestions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">
                    Câu {idx + 1} ({q.type === 'multiple_choice' ? 'Trắc nghiệm' : q.type === 'essay' ? 'Tự luận' : 'Trả lời ngắn'}) • {q.points} điểm
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 uppercase border border-slate-700">
                    Mức độ: {q.difficulty}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white">{q.question}</p>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={`p-2.5 rounded-xl border ${opt === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-emerald-400 font-bold">Đáp án chuẩn: {q.correctAnswer}</p>
                  <p className="text-slate-300">{q.explanation}</p>
                  {q.rubric && (
                    <p className="text-amber-300 text-[11px] pt-1 font-mono">Rubric chấm: {q.rubric}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Full Rubric & Scoring Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-bold text-xs text-amber-300 uppercase mb-2">Thang điểm Rubric Tự luận:</h4>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">{rubric}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <h4 className="font-bold text-xs text-cyan-300 uppercase mb-2">Hướng dẫn Chấm thi & Điểm số:</h4>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">{scoringGuide}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
