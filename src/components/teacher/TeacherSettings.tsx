import React, { useState, useEffect } from 'react';
import { 
  Settings, Shield, Save, CheckCircle2, Server, 
  HelpCircle, Database, Lock, RefreshCw, Layers 
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const TeacherSettings: React.FC = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>({
    googleSheetsConnected: true,
    autoSync: true,
    passingScoreThreshold: 80,
    videoWatchThreshold: 99,
    enableAiGrading: true,
    schoolName: 'THPT Chuyên Lê Hồng Phong'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      addToast('Đã lưu cấu hình hệ thống!', 'Các tham số sư phạm và đồng bộ đã được áp dụng thành công.', 'success');
    } catch (err: any) {
      addToast('Lỗi lưu cấu hình', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          Cài Đặt Hệ Thống & Tham Số Sư Phạm
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thiết lập ngưỡng hoàn thành bài học, tiêu chuẩn điểm đạt, cấu hình AI và lưu trữ đám mây an toàn.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pedagogical Thresholds */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            1. Tiêu Chuẩn Hoàn Thành & Đánh Giá
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ngưỡng theo dõi Video bài giảng (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={settings.videoWatchThreshold}
                  onChange={(e) => setSettings({ ...settings, videoWatchThreshold: Number(e.target.value) })}
                  className="w-24 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">
                  (Mặc định: 99% - Yêu cầu học sinh xem không được tua)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Điểm Đạt Bài Luyện Tập (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={settings.passingScoreThreshold}
                  onChange={(e) => setSettings({ ...settings, passingScoreThreshold: Number(e.target.value) })}
                  className="w-24 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm font-bold text-amber-400 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">
                  (Mặc định: 80% - tương đương 8.0/10 điểm)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Settings */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            2. Trí Tuệ Nhân Tạo & Tự Động Hóa
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-white">Bật Trợ Lý Chấm Điểm Tự Luận Gemini AI</p>
                <p className="text-[11px] text-slate-400">AI tự động đề xuất điểm số và nhận xét sư phạm theo thang Rubric.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAiGrading}
                onChange={(e) => setSettings({ ...settings, enableAiGrading: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-white">Tự Động Đồng Bộ Google Sheets</p>
                <p className="text-[11px] text-slate-400">Ghi nhận tức thì dòng kết quả 15 cột ngay khi học sinh nộp bài thi.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Cloud File Storage Instructions */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            3. Hướng Dẫn Thiết Lập Lưu Trữ Tệp Tin Đám Mây (Cloud Storage)
          </h2>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
            <p className="text-emerald-400 font-bold font-sans">
              📌 Hướng dẫn kích hoạt Firebase Storage hoặc Google Cloud Storage thực tế:
            </p>
            <p>1. Truy cập Firebase Console &rarr; Chọn Dự án của bạn &rarr; Mở thẻ <strong>Storage</strong>.</p>
            <p>2. Nhấn <strong>Get Started</strong> và chọn Cloud Region (khuyến nghị: <code>asia-southeast1</code>).</p>
            <p>3. Thiết lập Security Rules kiểm soát quyền truy cập: Cho phép Giáo viên ghi (Write) và Học sinh đọc (Read).</p>
            <p>4. Khai báo <code>FIREBASE_STORAGE_BUCKET</code> vào biến môi trường hệ thống.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang lưu...' : 'Lưu Thay Đổi Cài Đặt'}
        </button>
      </form>
    </div>
  );
};
