import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api, setApiUser, getApiUser } from '../services/api';
import { useToast } from './ToastContext';

const FALLBACK_USERS: User[] = [
  {
    id: 'teacher-1',
    email: 'phamquocdat1991@gmail.com',
    fullName: 'Thầy Phạm Quốc Đạt',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    school: 'THPT Chuyên Lê Hồng Phong',
    subjectSpecialty: 'Toán học & Tin học',
    createdAt: '2024-09-01T00:00:00Z'
  },
  {
    id: 'student-1',
    email: 'nguyenvanan.10a1@school.edu.vn',
    fullName: 'Nguyễn Văn An',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    classId: 'class-1',
    className: '10A1 (Chuyên Toán)',
    school: 'THPT Chuyên Lê Hồng Phong',
    createdAt: '2024-09-05T00:00:00Z'
  },
  {
    id: 'admin-1',
    email: 'admin.aihub@education.gov.vn',
    fullName: 'Quản Trị Viên Hệ Thống',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    school: 'Sở GD&ĐT',
    createdAt: '2024-08-01T00:00:00Z'
  }
];

interface AuthContextType {
  user: User | null;
  role: UserRole;
  usersList: User[];
  isLoading: boolean;
  switchUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  isTeacher: boolean;
  isStudent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(FALLBACK_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const loadCurrentUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Timeout promise to avoid hanging forever on slow networks or cold starts
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3500)
      );

      const fetchPromise = Promise.all([
        api.getMe(),
        api.getUsers().catch(() => [])
      ]);

      const [currentUser, allUsers] = await Promise.race([fetchPromise, timeoutPromise]);
      setUser(currentUser);
      setUsersList(allUsers && allUsers.length > 0 ? allUsers : FALLBACK_USERS);
      setApiUser(currentUser.id);
    } catch (err: any) {
      console.warn('API fetch delayed or unavailable, activating offline pedagogical fallback:', err);
      const savedId = getApiUser();
      const fallbackUser = FALLBACK_USERS.find(u => u.id === savedId) || FALLBACK_USERS[0];
      setUser(fallbackUser);
      setUsersList(FALLBACK_USERS);
      setApiUser(fallbackUser.id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUserData();
  }, [loadCurrentUserData]);

  const switchUser = async (userId: string) => {
    try {
      setApiUser(userId);
      let updatedUser: User;
      try {
        updatedUser = await api.getMe();
      } catch {
        updatedUser = usersList.find(u => u.id === userId) || FALLBACK_USERS.find(u => u.id === userId) || FALLBACK_USERS[0];
      }
      setUser(updatedUser);
      addToast(
        'Đã chuyển đổi tài khoản',
        `Hiện đang đăng nhập với vai trò: ${updatedUser.role === 'teacher' ? 'Giáo viên' : updatedUser.role === 'admin' ? 'Quản trị viên' : 'Học sinh'} (${updatedUser.fullName})`,
        'success'
      );
    } catch (err: any) {
      addToast('Lỗi chuyển tài khoản', err.message, 'error');
    }
  };

  const refreshUsers = async () => {
    try {
      const users = await api.getUsers();
      if (users && users.length > 0) {
        setUsersList(users);
      }
    } catch (err) {
      console.warn('Cannot refresh users:', err);
    }
  };

  const role: UserRole = user?.role || 'teacher';
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        usersList,
        isLoading,
        switchUser,
        refreshUsers,
        isTeacher,
        isStudent,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

