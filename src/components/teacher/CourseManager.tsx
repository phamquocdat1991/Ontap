import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Sparkles, CheckCircle2, Clock, Edit3, 
  Layers, ChevronRight, Eye, Trash2, ArrowLeft 
} from 'lucide-react';
import { Course, Chapter, Lesson } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface CourseManagerProps {
  onOpenLessonAI: () => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ onOpenLessonAI }) => {
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-toan-10');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cList, chapList, lesList] = await Promise.all([
        api.getCourses(),
        api.getChapters(selectedCourseId),
        api.getLessons(selectedCourseId)
      ]);
      setCourses(cList);
      setChapters(chapList);
      setLessons(lesList);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCourseId]);

  const handleTogglePublish = async (lesson: Lesson) => {
    const nextStatus = lesson.status === 'published' ? 'teacher_reviewed' : 'published';
    try {
      const updated = await api.updateLesson(lesson.id, { status: nextStatus });
      setLessons(prev => prev.map(l => l.id === lesson.id ? updated : l));
      addToast(
        'Đã cập nhật trạng thái',
        `Bài học "${lesson.title}" hiện ở trạng thái: ${nextStatus === 'published' ? 'Công bố' : 'Đã thẩm duyệt'}.`,
        'success'
      );
    } catch (err: any) {
      addToast('Lỗi cập nhật', err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Khóa Học & Cấu Trúc Chương Trình (GDPT 2018)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý cây phân cấp Khóa học &rarr; Chương &rarr; Bài học. Kiểm soát trạng thái công bố bài học cho học sinh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLessonAI}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Soạn bài mới với AI
          </button>
        </div>
      </div>

      {/* Courses Pill Selection */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {courses.map((crs) => (
          <button
            key={crs.id}
            onClick={() => setSelectedCourseId(crs.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
              selectedCourseId === crs.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {crs.title} ({crs.bookSeries})
          </button>
        ))}
      </div>

      {/* Chapters & Lessons Tree Grid */}
      <div className="space-y-6">
        {chapters.map((chap) => {
          const chapLessons = lessons.filter(l => l.chapterId === chap.id);
          return (
            <div key={chap.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {chap.order}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{chap.title}</h2>
                    <p className="text-xs text-slate-400">{chap.description}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {chapLessons.length} bài học
                </span>
              </div>

              {/* Lessons List inside Chapter */}
              <div className="divide-y divide-slate-800/80">
                {chapLessons.map((les) => (
                  <div
                    key={les.id}
                    className="p-4 sm:p-5 hover:bg-slate-800/30 transition-colors flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">Bài {les.order}</span>
                        <h3 className="text-sm font-bold text-white">{les.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          les.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          les.status === 'teacher_reviewed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {les.status === 'published' ? '✓ Đã công bố' : les.status === 'teacher_reviewed' ? 'Đã duyệt' : 'Bản thảo AI'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        YCCĐ: {les.learningObjectives?.join(', ') || 'Nắm vững kiến thức trọng tâm'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {les.durationMinutes} phút
                        </span>
                        {les.contentAI && (
                          <span className="text-cyan-400 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Nội dung sư phạm AI chuẩn hóa
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setSelectedLesson(les)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        Xem nội dung
                      </button>

                      <button
                        onClick={() => handleTogglePublish(les)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          les.status === 'published'
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        {les.status === 'published' ? 'Gỡ công bố' : 'Công bố bài học'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson View Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {selectedLesson.status === 'published' ? 'Đã công bố cho học sinh' : 'Đang duyệt'}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{selectedLesson.title}</h2>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {selectedLesson.contentAI ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs sm:text-sm text-slate-300">
                <div>
                  <h4 className="font-bold text-emerald-400 uppercase text-xs mb-1">Mục tiêu cần đạt:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedLesson.contentAI.objectives?.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-teal-400 uppercase text-xs mb-1">Kiến thức trọng tâm:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedLesson.contentAI.keyKnowledge?.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>

                {selectedLesson.contentAI.formulas && (
                  <div>
                    <h4 className="font-bold text-cyan-400 uppercase text-xs mb-1">Công thức cốt lõi:</h4>
                    <div className="space-y-2">
                      {selectedLesson.contentAI.formulas.map((f, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-300">
                          <span className="text-slate-400 font-sans">{f.name}: </span>
                          {f.formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-xs">Chưa có nội dung AI chi tiết cho bài học này.</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
