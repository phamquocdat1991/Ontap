import React, { useState, useMemo } from 'react';
import { 
  Sparkles, BookOpen, Check, Save, Eye, Layers, Lightbulb, 
  AlertTriangle, HelpCircle, CheckCircle2, ChevronRight, Edit3, ArrowLeft,
  GraduationCap, Bookmark, Zap
} from 'lucide-react';
import { LessonContentAI, Course, Chapter, Lesson } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  EDUCATION_LEVELS, ALL_SUBJECTS, ALL_GRADES, BOOK_SERIES, SAMPLE_TOPIC_PRESETS,
  getSubjectsByGrade, getLevelByGrade, getLevelNameByGrade 
} from '../../constants/curriculum';

interface AILessonGeneratorProps {
  onLessonCreated?: (lesson: Lesson) => void;
  onBack?: () => void;
}

export const AILessonGenerator: React.FC<AILessonGeneratorProps> = ({ onLessonCreated, onBack }) => {
  const { addToast } = useToast();

  // Selected Level & Grade
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'primary' | 'secondary' | 'high'>('high');
  const [grade, setGrade] = useState('10');

  // Filter available subjects based on grade
  const availableSubjects = useMemo(() => {
    return getSubjectsByGrade(grade);
  }, [grade]);

  // Form Inputs
  const [subject, setSubject] = useState('Toán học');
  const [bookSeries, setBookSeries] = useState('Kết Nối Tri Thức Với Cuộc Sống');
  const [chapter, setChapter] = useState('Chương IV: Vectơ trong mặt phẳng tọa độ Oxy');
  const [lessonName, setLessonName] = useState('Khái niệm vectơ và các phép toán cơ bản');
  const [learningObjectives, setLearningObjectives] = useState('Học sinh hiểu được khái niệm đoạn thẳng có hướng, hai vectơ cùng phương cùng hướng, quy tắc ba điểm và hình bình hành.');
  const [duration, setDuration] = useState(45);
  const [teacherNotes, setTeacherNotes] = useState('Cần nhấn mạnh lỗi sai khi trừ hai vectơ chung gốc.');

  // Handle grade change
  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    const newSubjects = getSubjectsByGrade(newGrade);
    if (!newSubjects.some(s => s.name === subject)) {
      setSubject(newSubjects[0]?.name || 'Toán học');
    }
    setSelectedLevel(getLevelByGrade(newGrade));
  };

  // Quick preset apply
  const handleApplyPreset = (preset: typeof SAMPLE_TOPIC_PRESETS[0]) => {
    setGrade(preset.grade);
    setSelectedLevel(getLevelByGrade(preset.grade));
    setSubject(preset.subject);
    setChapter(preset.chapter);
    setLessonName(preset.lesson);
    setLearningObjectives(preset.objectives);
    addToast('Đã áp dụng mẫu bài học', `${preset.subject} Lớp ${preset.grade}: ${preset.lesson}`, 'info');
  };

  // Filter presets for current grade/level
  const relevantPresets = useMemo(() => {
    return SAMPLE_TOPIC_PRESETS.filter(p => {
      if (selectedLevel === 'all') return true;
      return getLevelByGrade(p.grade) === selectedLevel;
    }).slice(0, 6);
  }, [selectedLevel]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<LessonContentAI | null>(null);
  const [previewTab, setPreviewTab] = useState<'overview' | 'concepts' | 'formulas' | 'examples' | 'mistakes' | 'quiz'>('overview');
  const [lessonStatus, setLessonStatus] = useState<'draft_ai' | 'teacher_reviewed' | 'published'>('teacher_reviewed');
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonName.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng nhập tên bài học', 'warning');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await api.generateLessonAI({
        subject,
        grade,
        bookSeries,
        chapter,
        lesson: lessonName,
        learningObjectives,
        duration,
        teacherNotes
      });
      setGeneratedContent(res);
      addToast('Tạo bài học AI thành công!', 'Nội dung sư phạm chuẩn GDPT 2018 đã sẵn sàng để quý Thầy/Cô kiểm duyệt.', 'success');
    } catch (err: any) {
      addToast('Lỗi tạo bài học', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!generatedContent) return;
    try {
      setIsSaving(true);
      let targetCourseId = `course-${subject.toLowerCase().replace(/\s+/g, '-')}-${grade}`;
      const courses = await api.getCourses();
      const existingCourse = courses.find(c => c.subject.toLowerCase() === subject.toLowerCase() && c.grade === grade);
      
      if (existingCourse) {
        targetCourseId = existingCourse.id;
      } else {
        const newCourse = await api.createCourse({
          title: `${subject} ${grade} - GDPT 2018`,
          subject,
          grade,
          bookSeries,
          description: `Khóa học ${subject} lớp ${grade} (${bookSeries})`,
          status: 'published'
        });
        targetCourseId = newCourse.id;
      }

      const newLesson = await api.createLesson({
        title: generatedContent.title || lessonName,
        courseId: targetCourseId,
        chapterId: 'chap-1',
        order: 1,
        durationMinutes: duration,
        status: lessonStatus,
        learningObjectives: generatedContent.objectives,
        contentAI: generatedContent,
        teacherNotes: teacherNotes
      });

      addToast(
        'Đã lưu bài học thành công!',
        `Bài học đã được lưu vào khóa "${subject} ${grade}" với trạng thái: ${lessonStatus === 'published' ? 'Công bố cho học sinh' : 'Đã thẩm duyệt bởi Giáo viên'}.`,
        'success'
      );
      onLessonCreated?.(newLesson);
    } catch (err: any) {
      addToast('Lỗi lưu bài học', err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white mr-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Soạn Bài Học Trí Tuệ Nhân Tạo (GDPT 2018)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hỗ trợ toàn bộ cấp học: Tiểu học (1-5) • THCS (6-9) • THPT (10-12) & Tất cả các môn học GDPT 2018.
          </p>
        </div>

        {generatedContent && (
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setLessonStatus('teacher_reviewed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lessonStatus === 'teacher_reviewed' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Đã duyệt (Chưa công bố)
              </button>
              <button
                onClick={() => setLessonStatus('published')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lessonStatus === 'published' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Công bố cho học sinh
              </button>
            </div>

            <button
              onClick={handleSaveLesson}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu vào Khóa học'}
            </button>
          </div>
        )}
      </div>

      {/* Level Switcher & Fast Suggestion Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Chọn Cấp học & Khối lớp:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedLevel === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
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
                  selectedLevel === lvl.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Khối lớp:</span>
          {ALL_GRADES.filter(g => selectedLevel === 'all' || getLevelByGrade(g) === selectedLevel).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => handleGradeChange(g)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                grade === g
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
              }`}
            >
              Lớp {g} <span className="text-[9px] font-normal opacity-75">({getLevelNameByGrade(g)})</span>
            </button>
          ))}
        </div>

        {/* Topic Suggestion Presets */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-300">Gợi ý bài học mẫu chuẩn GDPT 2018 (Bấm để điền nhanh):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {relevantPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">
                    {preset.subject} • Lớp {preset.grade}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">Áp dụng &rarr;</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1 group-hover:text-white">
                  {preset.lesson}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Teacher Controls */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Thông số Bài học Chuẩn Sư phạm
              </span>
              <span className="text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {getLevelNameByGrade(grade)} - Lớp {grade}
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học ({availableSubjects.length} môn)</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {availableSubjects.map(sub => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Khối lớp</label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {ALL_GRADES.map(g => (
                    <option key={g} value={g}>
                      Lớp {g} ({getLevelNameByGrade(g)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bộ Sách Giáo Khoa (GDPT 2018)</label>
              <select
                value={bookSeries}
                onChange={(e) => setBookSeries(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {BOOK_SERIES.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Chương / Chủ đề</label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="VD: Chương IV: Vectơ trong mặt phẳng tọa độ"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Bài Học *</label>
              <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="VD: Khái niệm vectơ và các phép toán cơ bản"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Yêu Cầu Cần Đạt (YCCĐ / Mục tiêu)</label>
              <textarea
                rows={2}
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Mục tiêu trọng tâm học sinh cần đạt sau bài học..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thời lượng (Phút)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú Sư phạm</label>
                <input
                  type="text"
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Lưu ý trọng tâm..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50 mt-4"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Gemini AI Đang Soạn Bài Chuẩn GDPT 2018...' : 'Sinh Bài Học Với Gemini AI'}
            </button>
          </form>
        </div>

        {/* Right Panel: Interactive Generated Lesson Preview */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between min-h-[500px]">
          {generatedContent ? (
            <div className="space-y-4">
              {/* Lesson Title & Tabs */}
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Bản thảo AI đã tạo
                  </span>
                  <span className="text-xs text-slate-400">{bookSeries} • {duration} phút</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{generatedContent.title}</h2>

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 overflow-x-auto mt-3 pt-2">
                  {[
                    { id: 'overview', label: 'Mục tiêu & Trọng tâm' },
                    { id: 'concepts', label: 'Khái niệm' },
                    { id: 'formulas', label: 'Công thức' },
                    { id: 'examples', label: 'Ví dụ giải mẫu' },
                    { id: 'mistakes', label: 'Lỗi hay gặp' },
                    { id: 'quiz', label: 'Kiểm tra nhanh' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        previewTab === tab.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="py-2 text-slate-200 text-xs sm:text-sm">
                {previewTab === 'overview' && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h3 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">Yêu Cầu Cần Đạt (YCCĐ):</h3>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                        {generatedContent.objectives?.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-teal-400 text-xs uppercase tracking-wider mb-2">Kiến Thức Trọng Tâm:</h3>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                        {generatedContent.keyKnowledge?.map((k, i) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    </div>

                    {generatedContent.summary && (
                      <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-slate-300 italic">
                        "{generatedContent.summary}"
                      </div>
                    )}
                  </div>
                )}

                {previewTab === 'concepts' && (
                  <div className="space-y-3 animate-in fade-in">
                    {generatedContent.concepts?.map((c, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <p className="font-bold text-emerald-400 text-xs mb-1">{c.term}</p>
                        <p className="text-slate-300 text-xs leading-relaxed">{c.definition}</p>
                      </div>
                    ))}
                  </div>
                )}

                {previewTab === 'formulas' && (
                  <div className="space-y-3 animate-in fade-in">
                    {generatedContent.formulas?.map((f, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-cyan-400 text-xs">{f.name}</span>
                          {f.note && <span className="text-[10px] text-slate-400 italic">{f.note}</span>}
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-emerald-300 font-bold text-xs sm:text-sm">
                          {f.formula}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {previewTab === 'examples' && (
                  <div className="space-y-3 animate-in fade-in">
                    {generatedContent.examples?.map((ex, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                        <p className="font-bold text-amber-300 text-xs">Ví dụ {i + 1}: {ex.question}</p>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-line text-xs font-mono">
                          {ex.solution}
                        </div>
                        {ex.explanation && (
                          <p className="text-[11px] text-slate-400 italic">💡 Nhận xét: {ex.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {previewTab === 'mistakes' && (
                  <div className="space-y-3 animate-in fade-in">
                    {generatedContent.commonMistakes?.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1.5">
                        <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Lỗi thường gặp: {m.mistake}
                        </p>
                        <p className="text-xs text-emerald-300 font-medium">✓ Cách giải đúng: {m.correction}</p>
                        {m.advice && <p className="text-[11px] text-slate-400 italic">Lời khuyên: {m.advice}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {previewTab === 'quiz' && (
                  <div className="space-y-3 animate-in fade-in">
                    {generatedContent.quickCheck?.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                        <p className="text-xs font-bold text-white">Câu {i + 1}: {q.question}</p>
                        {q.options && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className={`p-2 rounded-lg border ${opt === q.answer ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-emerald-400 font-semibold">Đáp án: {q.answer}</p>
                        {q.hint && <p className="text-[10px] text-slate-400 italic">Gợi ý tư duy: {q.hint}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-emerald-400 mb-4 border border-slate-700">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-300">Chưa có bản thảo bài học</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Điền thông số môn học, bộ sách và nhấn nút "Sinh Bài Học Với Gemini AI" để hệ thống tự động soạn thảo bài học chuẩn GDPT 2018.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
