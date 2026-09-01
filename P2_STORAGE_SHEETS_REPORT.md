# BÁO CÁO P2 — FIREBASE STORAGE + GOOGLE SHEETS API

Ngày rà soát/nâng cấp: 01/09/2026  
Baseline: `Ontap-main-P1-firebase-firestore-2026-09-01.zip`  
Phiên bản package sau P2: `1.2.0`

## 1. Phạm vi đã được duyệt

P2 chỉ triển khai đúng hai nhóm đã được duyệt:

1. Upload/đọc PDF, DOCX, PPTX, video thật qua Firebase Storage / Google Cloud Storage.
2. Google Sheets API thật cho cấu trúc 15 cột hiện có.

Không thêm nghiệp vụ học tập mới, không thêm social login/MFA/App Check/rate limit, không thêm đồng bộ hai chiều Sheets → app, không thêm OCR/chuyển Office thành ảnh từng trang.

## 2. Firebase Storage — đã triển khai

### Luồng upload

- Giáo viên/admin gọi `POST /api/materials/upload-url` bằng Firebase ID token.
- Server kiểm tra bài học, loại file và MIME.
- Server cấp V4 signed PUT URL có thời hạn 15 phút.
- Browser PUT binary trực tiếp lên Cloud Storage, không truyền binary qua Vercel Function.
- Browser gọi `POST /api/materials/complete-upload`.
- Server kiểm tra object thực sự tồn tại, MIME thực và metadata Storage.
- Chỉ sau khi xác minh thành công server mới tạo `Material` trong Firestore.

### Metadata mới của Material

- `storagePath`: đường dẫn object trong bucket.
- `mimeType`: MIME thực từ Storage metadata.
- `fileSizeBytes`: kích thước thực.
- `storageUrl`: không được lưu như URL public vĩnh viễn; API ký URL đọc mới khi trả Material.

### Signed read URL

- URL đọc V4 có thời hạn 60 phút.
- Học sinh chỉ nhận URL sau khi API đã kiểm tra lesson published theo rule P1.
- Teacher/admin vẫn xem học liệu draft theo quyền hiện có.

### Viewer

- PDF: hiển thị file thật bằng browser PDF viewer; điều hướng `#page=` theo trang đang ghi tiến độ.
- Video: phát file thật; engine tiến độ dùng duration thực của `<video>` khi có.
- DOCX/PPTX: hiển thị file thật qua Google Docs Viewer.
- Với DOCX/PPTX, Google Viewer không phát page-view events cho ứng dụng nên UI ghi rõ nút trang/slide là xác nhận tiến độ của hệ thống, không mô tả sai thành telemetry tự động.

### CORS

Thêm `storage.cors.json` cho signed PUT upload. File mẫu dùng `origin: ["*"]` vì chưa biết domain deployment; README yêu cầu thay bằng domain production thật khi có.

## 3. Google Sheets API — đã triển khai

### Xác thực

- Dùng service account Firebase Admin phía server.
- Thêm dependency `google-auth-library` 11.0.2.
- Scope: `https://www.googleapis.com/auth/spreadsheets`.
- Không có OAuth secret/private key trong browser.

### Kết nối Spreadsheet

`POST /api/sheets/connect` giờ thực hiện thật:

1. parse Spreadsheet ID hoặc URL;
2. gọi Sheets API để xác minh service account có quyền truy cập;
3. tìm tab dữ liệu;
4. tự tạo tab nếu chưa tồn tại;
5. tạo header 15 cột nếu tab trống;
6. từ chối nếu tab có header khác cấu trúc để tránh ghi nhầm dữ liệu;
7. chỉ đặt `googleSheetsConnected=true` khi toàn bộ kiểm tra thành công.

Thông tin xác minh lưu trong settings:

- `spreadsheetId`
- `spreadsheetUrl`
- `spreadsheetName` (tên tab)
- `spreadsheetTitle`
- `googleSheetsServiceAccountEmail`
- `googleSheetsLastVerifiedAt`

Student settings vẫn bị sanitize và không nhận metadata Sheets.

### Ghi 15 cột

Giữ nguyên thứ tự:

1. Timestamp
2. Student ID
3. Student Name
4. Class
5. Subject
6. Chapter
7. Lesson
8. Assessment Type
9. Attempt
10. Correct
11. Incorrect
12. Score
13. Duration
14. Lesson Progress
15. Submission ID

Dùng `spreadsheets.values.append` với `USER_ENTERED`.

### Auto sync

- Chỉ chạy nếu `autoSync=true` VÀ `googleSheetsConnected=true`.
- Sync được `await` trước khi request submit kết thúc để phù hợp môi trường Vercel serverless; không còn fire-and-forget.
- Sheets lỗi không làm mất kết quả bài làm; app ghi log `failed` với lỗi thật.
- Exam attempt chỉ đặt `syncStatus=success` sau khi Sheets API xác nhận.

### Retry

Trước khi retry, server tìm `Submission ID` ở cột O. Nếu ID đã tồn tại, log được đánh dấu thành công mà không append lần hai. Điều này giảm nguy cơ tạo dòng trùng khi response trước bị mất sau khi Sheets đã ghi dữ liệu.

## 4. File đã sửa so với P1

17 file:

- `.env.example`
- `README.md`
- `package.json`
- `server/db.ts`
- `server/firebaseAdmin.ts`
- `server/routes.ts`
- `server/sheets.ts`
- `server/utils/firebaseConfig.ts`
- `src/components/materials/SmartMaterialViewer.tsx`
- `src/components/student/ExamTakingRoom.tsx`
- `src/components/teacher/GoogleSheetsSync.tsx`
- `src/components/teacher/GradingManager.tsx`
- `src/components/teacher/MaterialManager.tsx`
- `src/components/teacher/TeacherSettings.tsx`
- `src/services/api.ts`
- `src/types/index.ts`
- `tests/core-regressions.cjs`

## 5. File mới

7 file source/config/test trước báo cáo:

- `docs/superpowers/plans/2026-09-01-p2-storage-sheets.md`
- `server/googleSheetsClient.ts`
- `server/materialStorage.ts`
- `server/utils/materialStorage.ts`
- `server/utils/sheets.ts`
- `storage.cors.json`
- `tests/p2-regressions.cjs`

Báo cáo này là file tài liệu bổ sung, không tham gia runtime.

## 6. Biến môi trường

Ngoài P1, P2 bắt buộc thêm:

```env
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
```

Google Sheets dùng lại:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

hoặc `FIREBASE_SERVICE_ACCOUNT_JSON`.

Không cần Google OAuth client secret ở frontend.

## 7. Thiết lập ngoài source cần thực hiện

### Firebase Storage

1. Tạo/bật Firebase Storage bucket.
2. Bảo đảm service account có quyền đọc/ghi object cần thiết trên bucket.
3. Áp dụng CORS bằng:

```bash
gcloud storage buckets update gs://YOUR_BUCKET --cors-file=storage.cors.json
```

4. Với production, thay wildcard CORS bằng domain thật nếu có thể.

### Google Sheets

1. Bật Google Sheets API trong Google Cloud project.
2. Share Spreadsheet quyền Editor cho `FIREBASE_CLIENT_EMAIL`.
3. Trong app, nhập Spreadsheet ID/URL và tên tab.
4. Bấm `Xác minh & Kết nối`.

## 8. Kết quả verification source cuối

- Core regression tests P1: 14 PASS.
- P2 regression tests: 9 PASS.
- Tổng: 23 PASS / 0 FAIL.
- TS/TSX syntax scan: 49 file / 0 lỗi cú pháp.
- Relative imports thiếu: 0.
- External package dùng nhưng chưa khai báo: 0.
- `package.json`: hợp lệ.
- `vercel.json`: hợp lệ.
- `storage.cors.json`: hợp lệ; PUT có trong allow list; không khai báo OPTIONS sai cách.
- GitHub Actions YAML: hợp lệ.
- Secret scan: không có private-key marker trong runtime/source; marker thật chỉ xuất hiện ở tài liệu/example placeholder.
- Frontend không import `firebase-admin`, `google-auth-library` hoặc biến private key.
- Storage routes thật tồn tại: PASS.
- Google Sheets API append flow thật tồn tại: PASS.
- Nhãn mô phỏng liên quan Storage/Sheets trong UI: 0.

## 9. Build production — giới hạn môi trường kiểm thử

Đã thử:

```bash
npm install --no-audit --no-fund
npm ping --registry=https://registry.npmjs.org
```

Cả hai đều timeout trong sandbox hiện tại. Không có `node_modules` hoặc lockfile dở dang được tạo.

Vì vậy **không tuyên bố `npm run lint` / `npm run build` đã PASS** trong sandbox này. GitHub Actions đã được giữ để chạy TypeScript + 23 regression tests + build khi repository có Internet.

## 10. Không tự thêm ở P2

Chưa triển khai:

- xóa object Storage khi xóa Material;
- lifecycle cleanup object upload dở;
- resumable upload có progress %;
- Storage versioning;
- Firebase App Check;
- antivirus/file scanning;
- PDF.js page telemetry sâu;
- OCR;
- chuyển DOCX/PPTX thành ảnh/HTML nội bộ;
- Sheets → app two-way sync;
- tạo Spreadsheet mới từ app;
- OAuth Google Drive của từng giáo viên.

Các mục trên cần duyệt riêng nếu tiếp tục.
