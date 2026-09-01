import React, { useState } from 'react';
import { 
  Sparkles, Users, BookOpen, Layers, Award, 
  Menu, X, ChevronDown, Check, GraduationCap, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  toggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab = 'dashboard', 
  onSelectTab = (_tab: string) => {},
  toggleMobileMenu = () => {} 
}) => {
  const { user, usersList, switchUser, isTeacher, isStudent, isAdmin } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-md">
      {/* Left: Brand / Logo + Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Mở danh mục điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onSelectTab(isTeacher ? 'dashboard' : 'student-dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                AI LEARNING HUB
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GDPT 2018
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Hệ thống Học tập & Khảo thí Sư phạm Số
            </p>
          </div>
        </div>
      </div>

      {/* Center: Quick Shortcuts (Desktop) */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-slate-800/80">
        {isTeacher ? (
          <>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bảng điều khiển
            </button>
            <button
              onClick={() => onSelectTab('ai-lesson-gen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'lesson-ai'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Soạn bài AI
            </button>
            <button
              onClick={() => onSelectTab('exam-matrix')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'exam-matrix'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Ma trận Đề thi
            </button>
            <button
              onClick={() => onSelectTab('grading')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'grading'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Chấm thi AI
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectTab('student-dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'student-dashboard'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Góc học tập
            </button>
            <button
              onClick={() => onSelectTab('student-courses')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'student-courses' || currentTab === 'lesson-view'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Bài học
            </button>
            <button
              onClick={() => onSelectTab('student-practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'student-practice' || currentTab === 'practice-runner'
                  ? 'bg-slate-800 text-teal-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Luyện tập nhanh
            </button>
            <button
              onClick={() => onSelectTab('student-exams')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'student-exams' || currentTab === 'exam-room'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phòng kiểm tra
            </button>
          </>
        )}
      </div>

      {/* Right: Role Switcher & Profile */}
      <div className="relative">
        <button
          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
          aria-expanded={showRoleDropdown}
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName || 'User'}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/40 shrink-0"
          />
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
              {user?.fullName}
            </p>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
              {isTeacher ? 'Giáo viên' : isStudent ? 'Học sinh' : 'Quản trị viên'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Dropdown Menu for fast switching role/account */}
        {showRoleDropdown && (
          <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Chuyển đổi vai trò trải nghiệm
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Chọn tài khoản mẫu để kiểm thử góc nhìn Giáo viên hoặc Học sinh.
              </p>
            </div>

            <div className="py-1.5 space-y-1">
              {usersList.map((u) => {
                const isCurrent = user?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all ${
                      isCurrent
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.fullName}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div className="text-left truncate">
                        <p className="font-semibold text-white truncate">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400">
                          {u.role === 'teacher' ? `Giáo viên (${u.subjectSpecialty || 'Toán'})` : `Học sinh (${u.className || '10A1'})`}
                        </p>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 rounded-2xl mt-1 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dữ liệu phân quyền độc lập an toàn</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
