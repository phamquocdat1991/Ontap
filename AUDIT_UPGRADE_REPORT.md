# BÁO CÁO RÀ SOÁT – SỬA LỖI – NÂNG CẤP KỸ THUẬT APP ÔN TẬP

**Ngày rà soát:** 01/09/2026  
**Nguồn:** `Ontap-main(1).zip`  
**Mục tiêu:** sửa lỗi hiện hữu, áp dụng các nâng cấp kỹ thuật tương đương đã được duyệt ở app trước khi phù hợp, chuẩn hóa source cho GitHub/Vercel. Không tự ý bổ sung nghiệp vụ mới.

## 1. Phạm vi đã thực hiện

1. Rà soát luồng giáo viên/học sinh, khóa học, bài học, học liệu, tiến độ, luyện tập, phòng thi, chấm bài, thống kê, Gemini và Google Sheets mô phỏng.
2. Sửa lỗi logic tiến độ theo từng học liệu.
3. Sửa tính toàn vẹn lượt làm bài luyện tập và phòng thi.
4. Khóa các API có nguy cơ lộ dữ liệu nháp/đáp án/cấu hình cho học sinh.
5. Loại số liệu thống kê hard-code/fallback gây hiểu nhầm.
6. Kiểm tra và xác thực dữ liệu JSON do Gemini sinh trước khi lưu/hiển thị.
7. Chuẩn hóa Express API cho Vercel Function và thêm GitHub Actions CI.
8. Giữ Gemini API key ở server-side; không đưa key vào frontend.
9. Làm rõ các phần hiện chỉ mô phỏng: Google Sheets và upload Cloud Storage.
10. Không triển khai Firebase Auth, database production, file storage thật hoặc Google Sheets API thật vì đây là tích hợp mới cần được duyệt riêng.

## 2. Các lỗi chính đã phát hiện và xử lý

| # | Lỗi / rủi ro gốc | Nguyên nhân | Xử lý | Trạng thái |
|---|---|---|---|---|
| 1 | Dashboard học sinh có thể hiện tiến độ 0% dù đã học | UI đọc `progressPercentage/status` trong khi model dùng `percentage/isCompleted` | Đồng bộ đúng field dữ liệu | Đã sửa |
| 2 | Nhiều học liệu trong một bài dùng chung một tiến độ | `LessonProgress` chỉ có một bộ `viewedPages/watchedSegments` | Thêm `materialProgress` theo `materialId`, tổng hợp tiến độ từ các học liệu bắt buộc | Đã sửa |
| 3 | Xem xong học liệu A có thể làm học liệu B bị tính hoàn thành | State viewer không tách theo tài liệu | Remount viewer theo `materialId`, lưu progress riêng | Đã sửa |
| 4 | Tài liệu chỉ 1 trang không chắc được ghi nhận hoàn thành | Chỉ track khi đổi trang | Ghi nhận trang 1 khi mở tài liệu | Đã sửa |
| 5 | Đoạn cuối video có thể không được ghi nhận | Segment chỉ flush trong một số sự kiện | Flush segment khi pause/end | Đã sửa |
| 6 | Bài luyện tập chưa tạo lượt làm ngay khi mở | Attempt được tạo quá muộn | Start/resume attempt từ server khi vào quiz | Đã sửa |
| 7 | Refresh có thể làm timer luyện tập không đáng tin cậy | Đồng hồ dựa nhiều vào state client | Deadline được tạo/lưu phía server và UI tính ngược từ deadline | Đã sửa |
| 8 | Có thể nộp luyện tập sau deadline hoặc nộp lại | Server thiếu kiểm tra trạng thái/deadline đầy đủ | Chỉ nhận attempt `in_progress`, chặn quá hạn và submit lặp | Đã sửa |
| 9 | Đáp án luyện tập có nguy cơ lộ trước khi nộp | API trả question object đầy đủ | `safeQuestions()` xóa đáp án/explanation/rubric cho học sinh; feedback chỉ trả sau submit | Đã sửa |
| 10 | `lessonId` của lượt luyện tập có thể bị client gửi sai | Server tin `lessonId` trong request | Luôn lấy `lessonId` từ quiz gốc | Đã sửa |
| 11 | Phòng thi refresh có thể reset/không đồng bộ timer | Attempt chưa được start/resume đúng luồng | Start/resume attempt server-side, deadline cố định | Đã sửa |
| 12 | Có thể nộp bài thi quá hạn/nộp lại | Thiếu kiểm tra trạng thái/deadline | Chặn ở server; attempt hết hạn chuyển `timed_out` | Đã sửa |
| 13 | Người dùng khác có thể gọi endpoint submit cho attempt không thuộc mình | Kiểm tra ownership chỉ áp dụng một phần | Bắt buộc `attempt.userId === current user` khi submit | Đã sửa |
| 14 | Học sinh có thể thấy đề thi công bố nhưng không thuộc lớp mình | Chưa lọc `classIds` | Lọc danh sách, chi tiết và start exam theo lớp được giao | Đã sửa |
| 15 | Tắt chấm tự luận AI nhưng server vẫn có thể gọi AI | Cấu hình UI chưa chi phối engine | Tôn trọng `enableAiGrading`; tắt thì chuyển giáo viên duyệt | Đã sửa |
| 16 | Khi Gemini lỗi/chưa có key, chấm tự luận có thể đoán điểm fallback | Heuristic fallback gán điểm | Không tự đoán điểm tự luận; trả 0 đề xuất + `needsTeacherReview` | Đã sửa |
| 17 | AI có thể trả JSON sai cấu trúc nhưng vẫn được sử dụng | Thiếu schema validation | Validate lesson, question, matrix và generated exam trước khi trả API | Đã sửa |
| 18 | Khi đã cấu hình Gemini key nhưng API lỗi, hệ thống có thể âm thầm trả nội dung fallback | Catch tất cả lỗi và fallback | Có key thì lỗi được ném lên API; fallback chỉ phục vụ chế độ demo không key | Đã sửa |
| 19 | Request không có `x-user-id` có thể bị coi như giáo viên mặc định | Server fallback `teacher-1` | Bỏ fallback server; endpoint cần auth trả 401 | Đã sửa |
| 20 | Học sinh có thể truy vấn học liệu của bài nháp trực tiếp qua API | `/materials` chưa kiểm tra trạng thái lesson | Học sinh bắt buộc `lessonId` và lesson phải `published` | Đã sửa |
| 21 | Học sinh có thể track progress cho bài nháp | `/progress/track` chưa kiểm tra trạng thái lesson | Kiểm tra lesson tồn tại và published cho student | Đã sửa |
| 22 | Học sinh có thể thấy toàn bộ lớp/khóa học nháp | GET API chưa lọc vai trò đầy đủ | Student chỉ thấy lớp của mình và course published | Đã sửa |
| 23 | Học sinh có thể thấy metadata Google Sheets trong settings | `/settings` trả toàn bộ SystemSettings | Student chỉ nhận school/threshold/AI grading public settings | Đã sửa |
| 24 | Thống kê dashboard dùng số fallback như 78.5/8.2/8.5 | Hard-code khi thiếu dữ liệu | Tính từ dữ liệu thật; chưa có dữ liệu thì 0 | Đã sửa |
| 25 | “Câu sai nhiều nhất”/bài khó có dữ liệu mẫu giả | Analytics dùng danh sách hard-code | Tính từ attempts/progress hiện có | Đã sửa |
| 26 | Học sinh chưa gán lớp có thể xuất hiện trong nhiều lớp | Filter lớp quá rộng | Chỉ lấy student có `classId` đúng lớp | Đã sửa |
| 27 | Sĩ số 0 bị thay bằng seed count cũ | UI dùng `count || cls.studentCount` | Hiển thị count thực tế kể cả 0 | Đã sửa |
| 28 | UI báo Google Sheets như kết nối/đồng bộ thật | Backend thực tế chỉ ghi log mô phỏng | Đổi nhãn/thông báo thành “Mô phỏng”, sync thực không được tuyên bố thành công | Đã sửa |
| 29 | Upload học liệu tạo URL/page metadata như thể upload thật | Endpoint không nhận binary file | Bỏ random detection; UI/response ghi rõ metadata/URL mẫu | Đã sửa mô tả; chưa thêm Storage thật |
| 30 | Source chưa có cấu hình Vercel phù hợp cho Express API + Vite | Chỉ có local `server.ts` | Tách `createApiApp()`, thêm `api/index.ts`, `vercel.json` | Đã sửa |
| 31 | `db.ts` cố ghi `data/store.json` trên Vercel | Local filesystem persistence dùng cho local server | Trên Vercel chủ động tắt disk persistence và chạy seed/in-memory demo | Đã sửa tương thích; dữ liệu chưa bền vững |
| 32 | Chưa có kiểm tra tự động khi push GitHub | Không có CI | Thêm GitHub Actions: install → TypeScript → regression → build | Đã thêm |

## 3. Nâng cấp kỹ thuật tương đương đã áp dụng

### 3.1 Gemini server-side và an toàn credential
- `GEMINI_API_KEY` chỉ được đọc trong server.
- Không sử dụng biến `VITE_GEMINI_API_KEY`.
- Model hiện tại trong source đã là `gemini-3.7-flash`, nên giữ nguyên thay vì thay model không cần thiết.
- JSON AI được kiểm tra cấu trúc trước khi ứng dụng nhận.
- Khi key thật đã cấu hình mà Gemini lỗi, hệ thống không âm thầm giả lập kết quả như thể AI thành công.

### 3.2 GitHub CI
Tạo `.github/workflows/ci.yml`:
1. Node 22.
2. `npm install --no-audit --no-fund`.
3. `npm run lint`.
4. `npm test`.
5. `npm run build`.

### 3.3 Vercel
- Frontend: Vite → `dist`.
- Backend: Express app được export qua `api/index.ts`.
- `/api/*` được route về Express Vercel Function.
- SPA fallback về `index.html`.
- Gemini key được khai báo ở Vercel Environment Variables.
- Disk persistence được tắt trên Vercel để tránh coi filesystem serverless là database.

## 4. File đã sửa

**20 file gốc được sửa:**

- `.env.example`
- `package.json`
- `server.ts`
- `server/db.ts`
- `server/gemini.ts`
- `server/routes.ts`
- `server/sheets.ts`
- `src/services/api.ts`
- `src/types/index.ts`
- `src/components/materials/SmartMaterialViewer.tsx`
- `src/components/student/ExamTakingRoom.tsx`
- `src/components/student/LessonViewer.tsx`
- `src/components/student/PracticeQuizRunner.tsx`
- `src/components/student/StudentDashboard.tsx`
- `src/components/teacher/ClassManager.tsx`
- `src/components/teacher/GoogleSheetsSync.tsx`
- `src/components/teacher/GradingManager.tsx`
- `src/components/teacher/MaterialManager.tsx`
- `src/components/teacher/TeacherDashboard.tsx`
- `src/components/teacher/TeacherSettings.tsx`

## 5. File mới

**13 file kỹ thuật mới trước báo cáo này:**

- `.github/workflows/ci.yml`
- `README.md`
- `api/index.ts`
- `server/app.ts`
- `server/validation.ts`
- `server/utils/access.ts`
- `server/utils/assessment.ts`
- `server/utils/progress.ts`
- `server/utils/runtime.ts`
- `tests/core-regressions.cjs`
- `vercel.json`
- `docs/superpowers/specs/2026-09-01-ontap-audit-design.md`
- `docs/superpowers/plans/2026-09-01-ontap-audit-fix-plan.md`

Báo cáo `AUDIT_UPGRADE_REPORT.md` là file bàn giao bổ sung, không tham gia runtime.

## 6. Kiểm thử đã thực hiện

### Regression tests thuần
Các ca kiểm thử hiện có:
1. Gộp video segment đúng, không đếm trùng đoạn xem.
2. Tiến độ 2 học liệu được tính trung bình đúng, không lấy state của một tài liệu cho cả bài.
3. Đáp án/explanation/rubric bị ẩn trước khi học sinh nộp quiz.
4. Attempt đã submit/hết hạn không được submit tiếp.
5. Validator từ chối câu hỏi AI sai schema.
6. Học sinh chỉ truy cập đề thi khi thuộc lớp được giao.
7. Public settings của học sinh không chứa spreadsheet metadata.
8. Vercel runtime tắt local disk persistence.

### Kiểm tra tĩnh
- Parse JSON: `package.json`, `vercel.json`, `tsconfig.json`.
- Parse YAML: `.github/workflows/ci.yml`.
- Transpile syntax toàn bộ TS/TSX bằng TypeScript compiler API.
- Kiểm tra toàn bộ relative imports tồn tại.
- Quét không còn `progressPercentage` sai trong student UI.
- Quét frontend không chứa `VITE_GEMINI_API_KEY`.
- Kiểm tra server không còn auth fallback `|| 'teacher-1'`.

### Hạn chế xác minh build trong sandbox
`npm install` không hoàn thành vì môi trường sandbox hiện không tải được dependency từ npm registry trong thời gian cho phép và `node_modules` không tồn tại. Vì vậy **không tuyên bố `npm run lint` hoặc `npm run build` production đã PASS trong sandbox này**. GitHub Actions đã được thêm để chạy đầy đủ TypeScript/test/build trong môi trường GitHub có npm network.

## 7. Trạng thái GitHub/Vercel

Source hiện đã có cấu trúc và cấu hình cần thiết để:
- đưa lên repository GitHub;
- chạy CI khi push/PR;
- import repository vào Vercel;
- build frontend Vite;
- route API sang Express Vercel Function.

Tuy nhiên, để dùng production với dữ liệu học sinh thật, hai giới hạn sau là bắt buộc phải giải quyết trước:
1. `x-user-id` hiện chỉ là demo identity, không phải xác thực an toàn.
2. Dữ liệu trên Vercel hiện là seed/in-memory và không bền vững qua Function instances/deployments.

## 8. Các nâng cấp CHƯA thực hiện – cần giáo viên duyệt riêng

### P1 – Xác thực production
**Đề xuất:** Firebase Authentication hoặc một Identity Provider phù hợp.  
**Mục tiêu:** không cho client tự giả `x-user-id`; phân quyền teacher/student/admin bằng token server-verified.

### P1 – Database bền vững trên Vercel
**Đề xuất:** Firestore hoặc PostgreSQL (tùy hệ sinh thái muốn dùng).  
**Mục tiêu:** users, lớp, course, lesson, progress, attempts, exams, settings không mất/khác nhau giữa serverless instances.

### P2 – Upload và đọc học liệu thật
**Đề xuất:** Firebase Storage/Google Cloud Storage/Vercel Blob + parser PDF/DOCX/PPTX/video metadata.  
**Mục tiêu:** thay endpoint metadata mô phỏng bằng file upload thật.

### P2 – Google Sheets API thật
**Đề xuất:** Service Account hoặc OAuth tùy mô hình quyền truy cập.  
**Mục tiêu:** ghi bảng điểm/tiến độ thật thay vì sync log mô phỏng.

**Bốn hạng mục trên chưa được tự ý thêm.**
