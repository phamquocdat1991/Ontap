import React from 'react';
import { 
  LayoutDashboard, BookOpen, HelpCircle, FileCheck, 
  Sparkles, Layers, Award, MoreHorizontal 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onOpenMore?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentView, 
  onSelectView,
  onOpenMore 
}) => {
  const { isTeacher, isStudent } = useAuth();

  const studentTabs = [
    { id: 'student-dashboard', label: 'Góc học tập', icon: LayoutDashboard },
    { id: 'student-courses', label: 'Khóa học', icon: BookOpen },
    { id: 'student-practice', label: 'Luyện tập', icon: HelpCircle },
    { id: 'student-exams', label: 'Phòng thi', icon: FileCheck },
  ];

  const teacherTabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'lesson-ai', label: 'Soạn AI', icon: Sparkles },
    { id: 'exam-matrix', label: 'Đề thi', icon: Layers },
    { id: 'grading', label: 'Chấm thi', icon: Award },
    { id: 'more', label: 'Thêm', icon: MoreHorizontal },
  ];

  const tabs = isTeacher ? teacherTabs : studentTabs;

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-bottom"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id || (tab.id === 'student-courses' && currentView === 'lesson-view');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'more') {
                  onOpenMore?.();
                } else {
                  onSelectView(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 min-h-[48px] rounded-2xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-500/20 text-emerald-300' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
