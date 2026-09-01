import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Play, CheckCircle2, ChevronLeft, ChevronRight, 
  RotateCcw, ShieldAlert, Sparkles, BookOpen, Clock, Eye
} from 'lucide-react';
import { Material, LessonProgress } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface SmartMaterialViewerProps {
  material: Material;
  lessonId: string;
  userId: string;
  initialProgress?: LessonProgress;
  onProgressUpdate?: (prog: LessonProgress) => void;
}

export const SmartMaterialViewer: React.FC<SmartMaterialViewerProps> = ({
  material,
  lessonId,
  userId,
  initialProgress,
  onProgressUpdate
}) => {
  const { addToast } = useToast();

  // Progress state
  const [currentPage, setCurrentPage] = useState(initialProgress?.lastPosition || 1);
  const totalPages = material.pageCount || material.slideCount || 8;
  const [viewedPages, setViewedPages] = useState<number[]>(initialProgress?.viewedPages || [1]);
  
  // Video tracking state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [lastSegmentStart, setLastSegmentStart] = useState(0);
  const [watchedSegments, setWatchedSegments] = useState<[number, number][]>(initialProgress?.watchedSegments || []);
  const [completionPercentage, setCompletionPercentage] = useState(initialProgress?.percentage || 0);
  const [isCompleted, setIsCompleted] = useState(initialProgress?.isCompleted || false);
  const [syncing, setSyncing] = useState(false);

  // Sync progress for PDF / PPT page navigation
  const recordPageView = async (pageNum: number) => {
    setCurrentPage(pageNum);
    const updatedPages = Array.from(new Set([...viewedPages, pageNum])).sort((a, b) => a - b);
    setViewedPages(updatedPages);

    try {
      setSyncing(true);
      const res = await api.trackProgress({
        userId,
        lessonId,
        pageViewed: pageNum,
        totalPages
      });
      setCompletionPercentage(res.percentage);
      if (res.isCompleted && !isCompleted) {
        setIsCompleted(true);
        addToast('Chúc mừng!', 'Bạn đã hoàn thành yêu cầu đọc tài liệu bài học này!', 'success');
      }
      onProgressUpdate?.(res);
    } catch (err) {
      console.warn('Progress sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Video interval tracking (Anti-skip engine)
  const handleVideoTimeUpdate = async () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setVideoCurrentTime(current);

    // If played at least 4 seconds continuously, record interval
    if (Math.abs(current - lastSegmentStart) >= 4) {
      const segStart = Math.min(lastSegmentStart, current);
      const segEnd = Math.max(lastSegmentStart, current);
      setLastSegmentStart(current);

      try {
        const res = await api.trackProgress({
          userId,
          lessonId,
          videoSegment: [Math.floor(segStart), Math.floor(segEnd)],
          totalDuration: material.duration || 360
        });
        setCompletionPercentage(res.percentage);
        setWatchedSegments(res.watchedSegments || []);
        if (res.isCompleted && !isCompleted) {
          setIsCompleted(true);
          addToast('Tuyệt vời!', 'Bạn đã hoàn thành theo dõi toàn bộ video bài giảng!', 'success');
        }
        onProgressUpdate?.(res);
      } catch (err) {
        console.warn('Video progress track failed:', err);
      }
    }
  };

  const handleVideoSeeking = () => {
    if (videoRef.current) {
      setLastSegmentStart(videoRef.current.currentTime);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Viewer Header */}
      <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            {material.type === 'video' ? <Play className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs font-bold text-white line-clamp-1">{material.filename}</p>
            <p className="text-[11px] text-slate-400">
              {material.type.toUpperCase()} • {material.fileSize || '2.4 MB'} • {material.type === 'video' ? `${Math.floor((material.duration || 360)/60)} phút` : `${totalPages} trang`}
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {isCompleted ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Đã hoàn thành
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-300">
                  Tiến độ: <span className="text-emerald-400 font-bold">{completionPercentage}%</span>
                </span>
              )}
            </div>
            <div className="w-32 bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Viewer Content Body */}
      <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[380px]">
        {material.type === 'video' ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <video
              ref={videoRef}
              controls
              onTimeUpdate={handleVideoTimeUpdate}
              onSeeking={handleVideoSeeking}
              className="w-full rounded-xl bg-black aspect-video border border-slate-800 shadow-2xl"
              src={material.storageUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            >
              Trình duyệt không hỗ trợ phát video HTML5.
            </video>

            {/* Anti-skip note */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Hệ thống ghi nhận thời gian học thực tế theo từng phân đoạn đã xem (yêu cầu ≥ 99% để tính hoàn thành).
              </span>
            </div>
          </div>
        ) : (
          /* PDF / Presentation / Document Simulator */
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Simulated Document Canvas Sheet */}
            <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative min-h-[320px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Tài liệu Chuyên đề Chuẩn GDPT 2018
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    Trang {currentPage} / {totalPages}
                  </span>
                </div>

                {/* Simulated Content of Current Page */}
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <h3 className="font-bold text-white text-base">
                    Phần {currentPage}: {currentPage === 1 ? 'Khái niệm & Định nghĩa Nền tảng' : currentPage === 2 ? 'Quy tắc 3 Điểm & Quy tắc Hình bình hành' : currentPage === 3 ? 'Biểu thức Tọa độ trong Hệ trục Oxy' : `Chuyên đề Nâng cao & Ứng dụng Thực tiễn (Trang ${currentPage})`}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    {currentPage === 1 && 'Vectơ là một đoạn thẳng có hướng. Trong hình học giải tích và cơ học, vectơ biểu diễn hướng và độ lớn của lực, vận tốc và độ dời. Hai vectơ bằng nhau khi và chỉ khi chúng cùng phương, cùng hướng và có cùng độ dài.'}
                    {currentPage === 2 && 'Quy tắc ba điểm: Cho 3 điểm phân biệt A, B, C bất kì, ta luôn có đẳng thức vectơ: AB + BC = AC. Phép trừ tương đương: AB - AC = CB. Quy tắc hình bình hành cho ta AB + AD = AC khi ABCD là hình bình hành.'}
                    {currentPage === 3 && 'Trong mặt phẳng tọa độ Oxy, mỗi vectơ u được biểu diễn duy nhất qua 2 vectơ đơn vị i và j: u = x*i + y*j, ký hiệu u = (x; y). Độ dài |u| = sqrt(x^2 + y^2).'}
                    {currentPage > 3 && `Nội dung đào sâu và bài toán phát triển năng lực cho học sinh trang ${currentPage}. Hãy đọc kĩ từng trang để ghi nhận tiến độ học tập chính xác vào hệ thống.`}
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300">
                    💡 Ghi chú cốt lõi: Đọc và tương tác từng trang giúp học sinh nắm trọn vẹn mạch tư duy bài học.
                  </div>
                </div>
              </div>

              {/* Bottom Document Controls */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => recordPageView(currentPage - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trang trước
                </button>

                {/* Page indicator pills */}
                <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    const isViewed = viewedPages.includes(p);
                    const isCurrent = currentPage === p;
                    return (
                      <button
                        key={p}
                        onClick={() => recordPageView(p)}
                        className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 text-white'
                            : isViewed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => recordPageView(currentPage + 1)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-1 transition-all"
                >
                  Trang sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
