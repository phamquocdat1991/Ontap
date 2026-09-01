import React from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Sparkles, FolderUp, 
  HelpCircle, Layers, FileCheck, Award, Table, Settings,
  Shield, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onSelectView,
  isOpenMobile = false,
  onCloseMobile = () => {}
}) => {
  const { isTeacher, isStudent, isAdmin, user } = useAuth();

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Tổng quan & Phân tích', icon: LayoutDashboard, badge: 'KPI' },
    { id: 'classes', label: 'Lớp học & Học sinh', icon: Users },
    { id: 'courses', label: 'Khóa học & Bài học', icon: BookOpen },
    { id: 'lesson-ai', label: 'Soạn bài học AI', icon: Sparkles, highlight: true },
    { id: 'materials', label: 'Kho Học liệu & Video', icon: FolderUp },
    { id: 'question-bank', label: 'Ngân hàng Câu hỏi', icon: HelpCircle },
    { id: 'exam-matrix', label: 'Ma trận & Đề kiểm tra', icon: Layers, highlight: true },
    { id: 'grading', label: 'Chấm thi & Duyệt AI', icon: Award, badge: 'AI' },
    { id: 'sheets-sync', label: 'Đồng bộ Google Sheets', icon: Table },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'student-dashboard', label: 'Góc Học Tập', icon: LayoutDashboard },
    { id: 'student-courses', label: 'Khóa học & Bài giảng', icon: BookOpen },
    { id: 'student-practice', label: 'Luyện tập (Có gợi ý)', icon: HelpCircle, badge: 'Quiz' },
    { id: 'student-exams', label: 'Phòng thi & Kiểm tra', icon: FileCheck, badge: 'Exam' },
  ];

  const navItems = isTeacher || isAdmin ? teacherNavItems : studentNavItems;

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* User Info Capsule */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
              alt={user?.fullName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
            <p className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
              {isTeacher ? (user?.subjectSpecialty || 'Giáo viên Toán THPT') : isStudent ? (user?.className || 'Học sinh 10A1') : 'Quản trị viên'}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isTeacher ? 'DANH MỤC QUẢN TRỊ' : 'LỘ TRÌNH HỌC TẬP'}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">GDPT 2018</span>
        </div>

        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'student-courses' && currentView === 'lesson-view');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[44px] ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40'
                  : item.highlight
                  ? 'text-emerald-300 hover:bg-emerald-500/10 hover:text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">GDPT 2018 • Server-Side Gemini</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer (When Open) */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
            onClick={onCloseMobile} 
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
