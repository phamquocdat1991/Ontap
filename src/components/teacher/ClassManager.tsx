import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Trash2, Search, CheckCircle2, 
  BookOpen, Plus, School, Award, RefreshCw, Mail, Shield 
} from 'lucide-react';
import { SchoolClass, User } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ClassManager: React.FC = () => {
  const { addToast } = useToast();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('class-1');
  const [loading, setLoading] = useState(true);

  // New Student modal
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classList, userList] = await Promise.all([
        api.getClasses(),
        api.getUsers()
      ]);
      setClasses(classList);
      setUsers(userList);
      if (classList.length > 0 && !selectedClassId) {
        setSelectedClassId(classList[0].id);
      }
    } catch (err) {
      console.error('Failed to load classes and students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) {
      addToast('Thiếu thông tin', 'Vui lòng nhập họ tên và email', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await api.createUser({
        fullName: newStudentName,
        email: newStudentEmail,
        role: 'student',
        classId: selectedClassId,
        school: 'THPT Chuyên Lê Hồng Phong'
      });
      setUsers(prev => [...prev, created]);
      setShowAddStudent(false);
      setNewStudentName('');
      setNewStudentEmail('');
      addToast('Thêm học sinh thành công!', `Đã thêm ${created.fullName} vào danh sách lớp.`, 'success');
    } catch (err: any) {
      addToast('Lỗi thêm học sinh', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học sinh ${name}? Mọi tiến độ và bài làm sẽ bị xóa.`)) {
      return;
    }

    try {
      await api.deleteUser(studentId);
      setUsers(prev => prev.filter(u => u.id !== studentId));
      addToast('Đã xóa học sinh', `Đã xóa hồ sơ và dữ liệu của ${name}.`, 'info');
    } catch (err: any) {
      addToast('Lỗi xóa học sinh', err.message, 'error');
    }
  };

  const currentClass = classes.find(c => c.id === selectedClassId);
  const studentsInClass = users.filter(u => u.role === 'student' && (u.classId === selectedClassId || !u.classId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Quản Lý Lớp Học & Danh Sách Học Sinh
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý hồ sơ học sinh, theo dõi tỉ lệ tham gia và phân quyền lớp học.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Thêm học sinh mới
          </button>
        </div>
      </div>

      {/* Class Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const count = users.filter(u => u.role === 'student' && u.classId === cls.id).length;
          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {cls.grade}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{cls.name}</h3>
                    <p className="text-[11px] text-slate-400">Niên khóa: {cls.academicYear}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {count || cls.studentCount} HS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 line-clamp-1">{cls.description || 'Lớp học tiêu chuẩn'}</p>
            </div>
          );
        })}
      </div>

      {/* Students Roster Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Danh sách học sinh: {currentClass?.name || '10A1'} ({studentsInClass.length} học sinh)
          </h2>
          <span className="text-[11px] text-slate-400">Giáo viên phụ trách: {currentClass?.teacherName || 'Thầy Phạm Quốc Đạt'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Email tài khoản</th>
                <th className="p-3.5">Trường</th>
                <th className="p-3.5">Vai trò</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {studentsInClass.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-3">
                    <img
                      src={st.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'}
                      alt={st.fullName}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{st.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {st.id}</p>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">{st.email}</td>
                  <td className="p-3.5 text-slate-400">{st.school || 'THPT Chuyên Lê Hồng Phong'}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      Học sinh
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đang hoạt động
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDeleteStudent(st.id, st.fullName)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Xóa học sinh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              Thêm Học Sinh Vào Lớp {currentClass?.name}
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và Tên Học Sinh *</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                  placeholder="VD: Hoàng Minh Quân"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Tài Khoản Học Sinh *</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  required
                  placeholder="VD: minhquan.10a1@school.edu.vn"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60"
                >
                  {isSubmitting ? 'Đang thêm...' : 'Lưu học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
