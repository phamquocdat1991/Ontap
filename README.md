# AI Learning Hub / Ôn tập — Firebase Auth + Firestore + Storage + Google Sheets

Ứng dụng React + Vite + Express dành cho quản lý bài học, học liệu, tiến độ, luyện tập, kiểm tra và Gemini AI.

Bản P2 này sử dụng kiến trúc production cho bốn lớp nền tảng:

- **Firebase Authentication (Email/Password)**: đăng nhập giáo viên, học sinh, quản trị viên.
- **Cloud Firestore**: lưu dữ liệu nghiệp vụ bền vững.
- **Firebase Storage / Google Cloud Storage**: upload và đọc PDF, DOCX, PPTX, video thật bằng signed URL có thời hạn.
- **Google Sheets API**: ghi thật cấu trúc 15 cột hiện có bằng service account phía server.

## 1. Kiến trúc bảo mật

1. Browser đăng nhập bằng Firebase Authentication.
2. Mỗi request `/api/*` gửi `Authorization: Bearer <Firebase ID token>`.
3. Express xác minh ID token bằng Firebase Admin SDK.
4. Server lấy profile `users/{uid}` trong Firestore để xác định role.
5. Binary học liệu **không đi qua Vercel Function**. Giáo viên xin signed PUT URL từ server, sau đó browser upload thẳng lên Storage.
6. Material trong Firestore lưu `storagePath`; server cấp signed GET URL ngắn hạn khi đọc học liệu.
7. Google Sheets token OAuth được lấy bằng service account ở server. Không có OAuth secret hoặc private key trong browser.

Firestore Security Rules vẫn deny truy cập trực tiếp từ browser; dữ liệu nghiệp vụ đi qua Express API.

## 2. Tạo Firebase project

### 2.1 Authentication

Firebase Console → Build → Authentication → Sign-in method → bật **Email/Password**.

### 2.2 Firestore

Firebase Console → Build → Firestore Database → Create database.

Triển khai rules:

```bash
npx firebase-tools login
npx firebase-tools use <FIREBASE_PROJECT_ID>
npx firebase-tools deploy --only firestore:rules
```

### 2.3 Firebase Storage

Firebase Console → Build → Storage → Get started.

Xác định bucket chính xác, ví dụ:

```text
your-project-id.firebasestorage.app
```

Khai báo server-side:

```env
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
```

Service account dùng bởi `FIREBASE_CLIENT_EMAIL` cần quyền đọc/ghi object trên bucket. Quyền tối thiểu thực tế thường dùng cho app này là quyền chứa `storage.objects.create`, `storage.objects.get` và metadata cần thiết; khi cấu hình theo IAM có thể dùng **Storage Object Admin** ở phạm vi bucket.

### 2.4 CORS cho signed upload

Signed PUT upload từ browser cần bucket CORS. Repository có file `storage.cors.json`.

Mẫu hiện dùng `origin: ["*"]` để bản ZIP có thể chạy trên localhost và domain Vercel chưa biết trước. Với production, nên thay `*` bằng domain thật, ví dụ:

```json
"origin": ["https://your-domain.vercel.app", "http://localhost:5173"]
```

Áp dụng bằng Google Cloud CLI:

```bash
gcloud storage buckets update gs://YOUR_BUCKET --cors-file=storage.cors.json
```

## 3. Firebase Web App

Project settings → General → Your apps → Add app → Web.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_STORAGE_BUCKET=
```

Các `VITE_FIREBASE_*` là cấu hình client Firebase, không phải service-account secret.

## 4. Firebase Admin credential

Firebase Console → Project settings → Service accounts → Generate new private key.

Cách A:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
```

Hoặc cách B:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"project_id":"...","client_email":"...","private_key":"-----BEGIN PRIVATE KEY-----\n..."}
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
```

Không commit service-account JSON/private key và không đặt private key dưới prefix `VITE_`.

## 5. Firebase App Check (reCAPTCHA Enterprise)

P3 bảo vệ cả Firebase services và custom Express API bằng App Check.

1. Google Cloud Console → reCAPTCHA Enterprise: tạo **Web score-based key** cho domain production/preview cần dùng.
2. Firebase Console → **App Check** → đăng ký Web App với reCAPTCHA Enterprise key.
3. Vercel Environment Variables:

```env
VITE_FIREBASE_APPCHECK_SITE_KEY=your-recaptcha-enterprise-key
FIREBASE_APP_CHECK_ENFORCED=true
```

Custom API gửi token trong header `X-Firebase-AppCheck`; server dùng Firebase Admin `verifyToken()` trước khi vào `/api/*` (trừ health check).

Local development có thể dùng debug token đã đăng ký trong Firebase Console:

```env
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=true
FIREBASE_APP_CHECK_ENFORCED=false
```

Không đặt debug token vào production.

Sau khi theo dõi App Check metrics ổn định, bật enforcement cho **Cloud Storage** và các Firebase products cần bảo vệ trong Firebase Console.

## 6. Reset password + TOTP MFA

### Reset password

Màn đăng nhập có nút **Quên mật khẩu?** sử dụng Firebase `sendPasswordResetEmail()`.

Có thể tùy chỉnh email trong Firebase Console → Authentication → Templates.

### TOTP MFA

TOTP MFA yêu cầu **Firebase Authentication with Identity Platform** và email người dùng đã xác minh.

1. Nâng cấp/bật Authentication with Identity Platform trong Firebase/Google Cloud Console.
2. Bật TOTP multi-factor authentication.
3. Người dùng đăng nhập → nút **Bảo mật tài khoản** trên header.
4. Xác minh email nếu cần.
5. Nhập mật khẩu hiện tại để re-authenticate.
6. Thêm secret/URI TOTP vào Google Authenticator, Microsoft Authenticator hoặc ứng dụng tương thích.
7. Nhập mã TOTP để hoàn tất enrollment.

Khi tài khoản có MFA, lần đăng nhập sau sẽ yêu cầu mã TOTP sau bước email/mật khẩu.

## 7. Google Sheets API hai chiều

### 7.1 Bật API và chia sẻ Spreadsheet

Trong Google Cloud Console của cùng service account, bật **Google Sheets API**.

Share Spreadsheet quyền **Editor** cho:

```text
FIREBASE_CLIENT_EMAIL
```

Trong app → **Đồng Bộ Google Sheets → Cấu hình**, nhập Spreadsheet ID/URL và tên tab.

Server tự:

1. kiểm tra quyền thật;
2. tạo tab nếu chưa có;
3. tạo/kiểm tra header đúng 15 cột;
4. chỉ đặt `googleSheetsConnected=true` khi API xác nhận.

Cấu trúc 15 cột:

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

### 7.2 App → Sheets

Khi `autoSync=true`, bài luyện tập/đề thi được ghi bằng Google Sheets API. Retry kiểm tra `Submission ID` trước khi append để giảm nguy cơ trùng dòng.

### 7.3 Sheets → App

Chiều ngược **không tự áp dụng âm thầm**:

1. Giáo viên bấm **Đọc từ Sheets**.
2. Server đọc A:O và đối chiếu `Submission ID` với `sheetSyncLogs` trong Firestore.
3. Preview hiển thị dòng có thay đổi và xung đột.
4. Giáo viên bấm **Áp dụng** mới cập nhật điểm/Correct/Incorrect vào attempt tương ứng.

Quy tắc an toàn:

- không tạo attempt mới từ Sheets;
- Student ID và Assessment Type phải khớp log gốc;
- điểm không được vượt tổng điểm bài;
- Correct + Incorrect không được vượt số câu;
- không sửa câu trả lời gốc hoặc trạng thái bài nộp chỉ từ file Sheets.

## 8. Upload, xóa file, progress và OCR

Giáo viên vào **Kho Học Liệu & Video Bài Giảng**.

Định dạng: PDF / DOCX / PPTX / PNG / JPEG / WEBP / Video.

Luồng upload:

```text
Teacher browser
  -> POST /api/materials/upload-url (Firebase Auth + App Check)
  -> server xác minh teacher/admin và trả objectPath canonical
  -> Firebase Storage Web SDK uploadBytesResumable()
  -> UI hiển thị % / bytes, pause / resume / cancel
  -> POST /api/materials/complete-upload
  -> server kiểm tra object thật trên Storage
  -> tạo Material trong Firestore
  -> POST /api/materials/:id/process (non-video)
```

File binary đi thẳng browser → Firebase Storage, không đi qua Vercel Function.

### Xóa học liệu

`DELETE /api/materials/:id` chỉ teacher/admin được gọi. Server xóa:

- file gốc `materials/...`;
- toàn bộ file dẫn xuất `derived/<materialId>/...`;
- metadata Material trong Firestore.

Browser không được quyền xóa trực tiếp theo `storage.rules`.

### OCR

- PDF/ảnh: Gemini OCR phía server.
- DOCX/PPTX: chuyển sang PDF trước, sau đó OCR PDF.
- OCR được lưu ở `Material.ocrText` và có thể xem trong viewer.
- Nếu OCR lỗi, file vẫn có thể được xử lý phân trang; lỗi OCR không tự tạo nội dung giả.

## 9. Chuyển DOCX/PPTX thành từng trang/slide

P3 không phụ thuộc LibreOffice trên Vercel.

Luồng:

```text
Firebase Storage source
  -> server download
  -> Google Drive API resumable upload vào Shared Drive folder
  -> import DOCX -> Google Docs / PPTX -> Google Slides
  -> export PDF
  -> pdf-lib tách PDF thành các PDF 1 trang
  -> Firebase Storage derived/<materialId>/pages/page-XXXX.pdf
  -> xóa file tạm trên Google Drive
```

### Cấu hình Google Drive

1. Bật **Google Drive API** trong Google Cloud project.
2. Tạo/chọn một **Shared Drive**.
3. Tạo folder dành riêng cho chuyển đổi tạm.
4. Thêm `FIREBASE_CLIENT_EMAIL` vào Shared Drive với quyền đủ để tạo/xóa file (khuyến nghị Content manager).
5. Lấy Folder ID và cấu hình:

```env
GOOGLE_DRIVE_CONVERSION_FOLDER_ID=...
```

Không dùng “My Drive” cá nhân của service account cho luồng này.

Viewer học sinh mở từng PDF 1 trang/slide thật và engine tiến độ ghi nhận từng trang đã xem.

## 10. Firebase Storage Rules

Deploy rules:

```bash
firebase deploy --only storage
```

`storage.rules` hiện:

- chỉ teacher/admin authenticated được upload `materials/...`;
- kiểm tra MIME và giới hạn dưới 500 MB;
- browser không đọc trực tiếp bằng rule (app đọc qua signed URL từ server);
- browser không update/delete trực tiếp;
- `derived/...` chỉ server Admin SDK truy cập.

## 11. Chạy local

```bash
npm install
cp .env.example .env
npm run dev
```

Kiểm tra trước khi push:

```bash
npm run check
```

`npm run check`: TypeScript → regression tests → Vite/server build.

Local Firestore JSON fallback chỉ dùng khi thật sự cần:

```env
ALLOW_LOCAL_DATA=true
FIREBASE_APP_CHECK_ENFORCED=false
```

Không bật các fallback này trên Vercel production.

## 12. Bootstrap Firebase

Đặt mật khẩu seed tối thiểu 6 ký tự:

```env
BOOTSTRAP_TEACHER_PASSWORD=
BOOTSTRAP_STUDENT_PASSWORD=
BOOTSTRAP_ADMIN_PASSWORD=
```

Sau đó:

```bash
npm run bootstrap:firebase
```

Sau bootstrap, xóa `BOOTSTRAP_*_PASSWORD` khỏi environment.

## 13. Deploy GitHub + Vercel

GitHub Actions `.github/workflows/ci.yml` chạy:

1. `npm install`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Vercel sử dụng Node 22.x. `vercel.json` bật Fluid Compute và đặt `maxDuration: 300` cho Express Function để có thêm thời gian cho OCR/Office conversion.

### Vercel Environment Variables

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_APPCHECK_SITE_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_STORAGE_BUCKET
FIREBASE_APP_CHECK_ENFORCED=true
GOOGLE_DRIVE_CONVERSION_FOLDER_ID
GEMINI_API_KEY
```

Có thể dùng `FIREBASE_SERVICE_ACCOUNT_JSON` thay ba biến Admin ID/email/private key.

Không đặt production secret dưới prefix `VITE_` ngoại trừ Firebase Web config và reCAPTCHA Enterprise site key vốn là cấu hình client.

## 14. Firestore collections

- `users`
- `classes`
- `courses`
- `chapters`
- `lessons`
- `materials`
- `lessonProgress`
- `practiceQuizzes`
- `practiceAttempts`
- `exams`
- `examAttempts`
- `sheetSyncLogs`
- `settings/system`

Material P3 có thể có `storagePath`, `derivedPdfPath`, `derivedPagePaths`, `ocrText`, `processingStatus`. URL signed (`storageUrl`, `derivedPdfUrl`, `derivedPageUrls`) chỉ được tạo khi API trả dữ liệu và không lưu như URL public vĩnh viễn.

## 15. Phạm vi P3

P3 triển khai đúng các mục đã duyệt:

- App Check;
- reset password;
- TOTP MFA;
- xóa file Storage;
- upload progress % + pause/resume/cancel;
- OCR;
- DOCX/PPTX → PDF → từng trang/slide PDF riêng;
- Google Sheets hai chiều có preview/xung đột.

Không tự thêm social login, SMS MFA, OCR provider khác, background queue, versioning file, hay thay đổi cấu trúc đề/khóa học ngoài các phần trên.
