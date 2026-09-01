import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api, setApiUser, getApiUser } from '../services/api';
import { useToast } from './ToastContext';

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
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const loadCurrentUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [currentUser, allUsers] = await Promise.all([
        api.getMe(),
        api.getUsers().catch(() => [])
      ]);
      setUser(currentUser);
      setUsersList(allUsers);
      setApiUser(currentUser.id);
    } catch (err: any) {
      console.error('Failed to load auth user:', err);
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
      const updatedUser = await api.getMe();
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
      setUsersList(users);
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
