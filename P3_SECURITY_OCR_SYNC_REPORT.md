# BÁO CÁO P3 — BẢO MẬT, HỌC LIỆU NÂNG CAO VÀ ĐỒNG BỘ HAI CHIỀU

Ngày rà soát: 2026-09-01  
Baseline: P2 v1.2.0  
Bản P3: v1.3.0

## 1. Phạm vi được duyệt

P3 chỉ triển khai 8 hạng mục người dùng đã duyệt:

1. Firebase App Check.
2. Reset password bằng email.
3. TOTP MFA.
4. Xóa file Firebase Storage.
5. Upload progress % + pause/resume/cancel.
6. OCR học liệu.
7. Chuyển DOCX/PPTX thành từng trang/slide.
8. Google Sheets hai chiều.

Không thêm social login, SMS MFA, background queue, file versioning, OCR provider ngoài Gemini hoặc thay đổi cấu trúc nghiệp vụ khóa học/đề thi.

## 2. Kiến trúc P3

### App Check
- Web SDK dùng reCAPTCHA Enterprise.
- Client gửi `X-Firebase-AppCheck` cho custom Express API.
- Server Firebase Admin xác minh bằng `verifyToken()` trước API router.
- `/health` được giữ public để kiểm tra deployment.
- Production mặc định enforce; local có biến tắt rõ ràng.

### Reset password + MFA
- Reset password dùng `sendPasswordResetEmail()`.
- TOTP MFA dùng Firebase Authentication with Identity Platform.
- Enrollment yêu cầu email đã xác minh và re-authentication bằng mật khẩu hiện tại.
- Đăng nhập MFA xử lý `auth/multi-factor-auth-required` rồi resolve bằng mã TOTP.

### Firebase Storage
- Upload binary trực tiếp browser -> Firebase Storage bằng `uploadBytesResumable()`.
- UI hiển thị %, bytes, pause, resume và cancel.
- Server chỉ cấp canonical `objectPath`, sau upload kiểm tra object thật rồi mới tạo Material.
- DELETE material xóa file gốc + toàn bộ file dẫn xuất trước khi xóa metadata Firestore.

### OCR + DOCX/PPTX
- PDF/ảnh OCR bằng Gemini phía server.
- DOCX/PPTX: server tải source từ Storage -> resumable upload vào folder Shared Drive -> import Google Docs/Slides -> export PDF -> `pdf-lib` tách thành từng PDF 1 trang -> lưu Storage `derived/<materialId>/pages/` -> xóa file Drive tạm.
- OCR trên PDF chuyển đổi; nếu OCR lỗi thì không tự bịa nội dung.
- Viewer sử dụng signed URL của từng PDF 1 trang/slide nên tiến độ được ghi theo trang thật.

### Google Sheets hai chiều
- App -> Sheets giữ luồng append 15 cột hiện có.
- Sheets -> App bắt buộc bước Preview rồi giáo viên mới Apply.
- Chỉ nhận dòng có `Submission ID` khớp `sheetSyncLogs` trong Firestore.
- Không tạo attempt mới từ Sheets.
- Không sửa answers/status từ Sheets.
- Kiểm tra Student ID, Assessment Type, tổng điểm và số câu trước khi áp dụng.

## 3. File thay đổi so với P2

### 23 file được sửa
- `.env.example`
- `README.md`
- `firebase.json`
- `package.json`
- `server/app.ts`
- `server/db.ts`
- `server/gemini.ts`
- `server/googleSheetsClient.ts`
- `server/materialStorage.ts`
- `server/routes.ts`
- `server/sheets.ts`
- `server/utils/access.ts`
- `server/utils/materialStorage.ts`
- `src/components/auth/LoginScreen.tsx`
- `src/components/common/Header.tsx`
- `src/components/materials/SmartMaterialViewer.tsx`
- `src/components/teacher/GoogleSheetsSync.tsx`
- `src/components/teacher/MaterialManager.tsx`
- `src/context/AuthContext.tsx`
- `src/services/api.ts`
- `src/services/firebase.ts`
- `src/types/index.ts`
- `vercel.json`

### 14 file mới, tính cả báo cáo
- `server/appCheck.ts`
- `server/googleDriveClient.ts`
- `server/materialProcessing.ts`
- `server/utils/appCheck.ts`
- `server/utils/officeConversion.ts`
- `server/utils/sheetsImport.ts`
- `server/utils/sheetsPull.ts`
- `src/components/auth/AccountSecurityModal.tsx`
- `src/services/materialUpload.ts`
- `storage.rules`
- `tests/p3-regressions.cjs`
- `docs/superpowers/specs/2026-09-01-p3-security-material-sync-design.md`
- `docs/superpowers/plans/2026-09-01-p3-security-material-sync.md`
- `P3_SECURITY_OCR_SYNC_REPORT.md`

Không xóa file source P2 nào.

## 4. Cấu hình mới cần thiết

### App Check
```env
VITE_FIREBASE_APPCHECK_SITE_KEY=
FIREBASE_APP_CHECK_ENFORCED=true
```
Local only:
```env
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=true
FIREBASE_APP_CHECK_ENFORCED=false
```

### Google Drive conversion
```env
GOOGLE_DRIVE_CONVERSION_FOLDER_ID=
```
Folder phải nằm trong Shared Drive và service account `FIREBASE_CLIENT_EMAIL` phải có quyền tạo/xóa file.

### Các biến P1/P2 vẫn cần
- `VITE_FIREBASE_*`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` hoặc `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_STORAGE_BUCKET`
- `GEMINI_API_KEY`

## 5. Firebase/Google Console cần bật

1. Firebase Authentication Email/Password.
2. Firebase Authentication with Identity Platform + TOTP MFA.
3. Firestore.
4. Firebase Storage.
5. App Check cho Web App bằng reCAPTCHA Enterprise.
6. Google Sheets API.
7. Google Drive API.
8. Shared Drive folder dùng cho Office conversion.
9. Deploy `firestore.rules` và `storage.rules`.

## 6. Vercel

`vercel.json`:
- Node API entry `api/index.ts`.
- Fluid Compute bật bằng `"fluid": true`.
- `maxDuration` tăng từ 60 lên 300 giây để phù hợp hơn với OCR/Office conversion.
- SPA routing giữ nguyên.

Không chuyển binary upload qua Vercel Function.

## 7. Kiểm thử đã chạy trên source P3

Kết quả fresh verification trước đóng gói:

- Regression P1: 14 PASS.
- Regression P2: 9 PASS.
- Regression P3: 7 PASS.
- Tổng: **30/30 PASS**.
- TS/TSX parser: **58 file, 0 lỗi cú pháp**.
- Relative import missing: **0**.
- Dependency được dùng nhưng chưa khai báo: **0**.
- `package.json`: PASS.
- `vercel.json`: PASS.
- `firebase.json`: PASS.
- `storage.cors.json`: PASS.
- GitHub Actions YAML: PASS.
- Internal TypeScript errors sau khi loại riêng lỗi do `node_modules` chưa cài: **0**.
- Quét secret: không có Firebase Admin private key/API secret thực trong frontend/source.
- Feature scan xác nhận đủ App Check/reset/MFA/upload resumable/delete/OCR/derived pages/Sheets pull.

## 8. Điều chưa thể xác minh trong sandbox

`npm install --no-audit --no-fund` bị timeout. `npm ping` xác nhận:

```text
EAI_AGAIN registry.npmjs.org
```

Vì không có `node_modules`, không thể chạy TypeScript package-aware và Vite production build thật trong sandbox. Không tuyên bố production build PASS.

GitHub Actions đã cấu hình để chạy khi source có Internet:

```text
npm install -> npm run lint -> npm test -> npm run build
```

## 9. Lưu ý vận hành

- TOTP MFA chỉ hoạt động sau khi Identity Platform/TOTP được bật và email người dùng được xác minh.
- App Check production cần đăng ký đúng domain/reCAPTCHA Enterprise key; bật enforcement sau khi kiểm tra metrics.
- Office conversion cần Shared Drive folder; service account không nên dựa vào My Drive cá nhân.
- OCR trực tiếp hiện giới hạn 20 MB mỗi lần; file lớn vẫn có thể được phân trang nhưng OCR có thể bị bỏ qua và ghi warning.
- Google Sheets chiều về chỉ cập nhật điểm thống kê của attempt đã tồn tại; không được dùng để tạo bài nộp mới.
