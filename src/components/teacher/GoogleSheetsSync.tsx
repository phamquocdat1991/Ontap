import React, { useState, useEffect } from 'react';
import { 
  Table, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, 
  Settings, ShieldCheck, Download, Link2 
} from 'lucide-react';
import { SheetSyncLog, SystemSettings } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const GoogleSheetsSync: React.FC = () => {
  const { addToast } = useToast();
  const [logs, setLogs] = useState<SheetSyncLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Settings modal
  const [showConfig, setShowConfig] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const [sheetName, setSheetName] = useState('');

  const fetchLogsAndSettings = async () => {
    try {
      setLoading(true);
      const [logList, sysSettings] = await Promise.all([
        api.getSheetLogs(),
        api.getSettings()
      ]);
      setLogs(logList);
      setSettings(sysSettings);
      setSheetId(sysSettings.spreadsheetId || '');
      setSheetName(sysSettings.spreadsheetName || '');
    } catch (err) {
      console.error('Failed to load Google Sheets sync logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndSettings();
  }, []);

  const handleRetrySync = async (logId: string) => {
    try {
      setRetryingId(logId);
      const updated = await api.retrySheetSync(logId);
      setLogs(prev => prev.map(l => l.id === logId ? updated : l));
      addToast('Đồng bộ lại thành công!', 'Dữ liệu kết quả bài thi đã được ghi nhận vào Google Sheets.', 'success');
    } catch (err: any) {
      addToast('Lỗi đồng bộ', err.message, 'error');
    } finally {
      setRetryingId(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.connectSheet({
        spreadsheetId: sheetId,
        spreadsheetName: sheetName
      });
      setSettings(updated);
      setShowConfig(false);
      addToast('Đã lưu cấu hình Google Sheets', 'Kết nối thành công tới trang tính.', 'success');
    } catch (err: any) {
      addToast('Lỗi lưu cấu hình', err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Table className="w-6 h-6 text-emerald-400" />
            Đồng Bộ Bảng Điểm Google Sheets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dữ liệu luôn lưu Firestore an toàn trước, Google Sheets đóng vai trò lớp đồng bộ thứ hai để giáo viên xuất báo cáo và đối chiếu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {settings?.spreadsheetUrl && (
            <a
              href={settings.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Mở Google Spreadsheet Trực Tiếp
            </a>
          )}

          <button
            onClick={() => setShowConfig(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Cấu hình Trang tính
          </button>

          <button
            onClick={fetchLogsAndSettings}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Spreadsheet Status Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {settings?.spreadsheetName || 'AI_Learning_Hub_BangDiem_Lop10A1'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đang hoạt động
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Spreadsheet ID: {settings?.spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'}
            </p>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400">Trạng thái tự động đồng bộ: </span>
          <span className="text-emerald-400 font-bold">BẬT (Sau mỗi lần nộp bài)</span>
        </div>
      </div>

      {/* 15 Columns Synced Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Nhật ký 15 Cột dữ liệu đồng bộ Google Sheets ({logs.length} bản ghi)
          </h2>
          <span className="text-[11px] text-slate-400">Chuẩn hóa cấu trúc theo thời gian thực</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left text-slate-300 whitespace-nowrap">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[9px] font-bold">
              <tr>
                <th className="p-3">1. Timestamp</th>
                <th className="p-3">2. Student ID</th>
                <th className="p-3">3. Student Name</th>
                <th className="p-3">4. Class</th>
                <th className="p-3">5. Subject</th>
                <th className="p-3">6. Chapter</th>
                <th className="p-3">7. Lesson</th>
                <th className="p-3">8. Assessment Type</th>
                <th className="p-3 text-center">9. Attempt</th>
                <th className="p-3 text-center">10. Correct</th>
                <th className="p-3 text-center">11. Incorrect</th>
                <th className="p-3 text-center">12. Score</th>
                <th className="p-3">13. Duration</th>
                <th className="p-3">14. Lesson Progress</th>
                <th className="p-3">15. Submission ID</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">
                    {new Date(row.syncedAt).toLocaleTimeString('vi-VN')} {new Date(row.syncedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{row.studentId}</td>
                  <td className="p-3 font-bold text-white">{row.studentName}</td>
                  <td className="p-3 text-slate-300">{row.className}</td>
                  <td className="p-3 text-slate-300">{row.subject}</td>
                  <td className="p-3 text-slate-400">{row.chapter}</td>
                  <td className="p-3 text-slate-300 font-semibold">{row.lessonTitle}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      row.assessmentType === 'Exam' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {row.assessmentType}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">Lần {row.attemptNumber}</td>
                  <td className="p-3 text-center font-bold text-emerald-400">{row.correct}</td>
                  <td className="p-3 text-center font-bold text-rose-400">{row.incorrect}</td>
                  <td className="p-3 text-center font-black text-amber-400 text-xs">{row.score}đ</td>
                  <td className="p-3 text-slate-400">{row.duration}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{row.lessonProgress}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">{row.submissionId}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      row.status === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {row.status === 'success' ? '✓ Thành công' : '✕ Thất bại'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {row.status === 'failed' && (
                      <button
                        onClick={() => handleRetrySync(row.id)}
                        disabled={retryingId === row.id}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1 ml-auto"
                      >
                        <RefreshCw className={`w-3 h-3 ${retryingId === row.id ? 'animate-spin' : ''}`} />
                        Thử lại
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-emerald-400" />
              Cấu Hình Bảng Tính Google Sheets
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Trang Tính</label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="VD: AI_Learning_Hub_BangDiem"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Spreadsheet ID *</label>
                <input
                  type="text"
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                  required
                  placeholder="VD: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ID nằm trong đường link URL trang tính giữa "/d/" và "/edit".
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60"
                >
                  Lưu kết nối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
