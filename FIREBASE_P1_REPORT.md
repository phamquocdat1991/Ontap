# BÁO CÁO P1 — FIREBASE AUTHENTICATION + CLOUD FIRESTORE

Ngày rà soát: 01/09/2026

## 1. Phạm vi được duyệt

Chỉ triển khai P1 đã được duyệt:

1. Firebase Authentication thật bằng Email/Password.
2. Cloud Firestore làm persistence bền vững cho dữ liệu nghiệp vụ hiện có.

Không triển khai trong P1:

- Upload binary qua Firebase Storage/Vercel Blob.
- Google Sheets API thật.
- Password reset email.
- Google/Apple/social login.
- MFA.
- App Check/rate limiting.
- Tính năng nghiệp vụ mới ngoài luồng hiện có.

## 2. Kiến trúc sau nâng cấp

### Client

- React dùng Firebase Web SDK.
- Theo dõi phiên đăng nhập bằng `onAuthStateChanged`.
- Đăng nhập Email/Password bằng Firebase Authentication.
- Mỗi API request lấy ID token hiện hành và gửi `Authorization: Bearer <token>`.
- Không còn LocalStorage account switcher hoặc `x-user-id` trong runtime production.

### Server

- Express API xác minh Firebase ID token bằng Firebase Admin SDK.
- Sau xác minh, server đọc hồ sơ `users/{firebaseUid}`.
- Role được lấy từ hồ sơ server-side, không tin role/user ID do client tự gửi.
- Firestore Admin SDK thực hiện toàn bộ đọc/ghi dữ liệu.
- Firestore Rules deny client direct read/write.

### Persistence

Các collection/document chính:

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

## 3. Các lỗi/điểm yếu đã xử lý trong P1

| # | Vấn đề | Xử lý | Trạng thái |
|---|---|---|---|
| 1 | Danh tính client trước đây có thể giả mạo | Thay bằng Firebase ID token + Admin `verifyIdToken()` | Đã xử lý |
| 2 | Chuyển tài khoản demo/LocalStorage impersonation | Loại khỏi UI/runtime | Đã xử lý |
| 3 | Dữ liệu Vercel trước đây chỉ in-memory/seed | Thay DB adapter bằng Firestore | Đã xử lý |
| 4 | Role có thể bị tin từ client | Role chỉ lấy từ Firestore profile sau auth | Đã xử lý |
| 5 | Teacher có thể gọi API tạo teacher/admin nếu chỉ kiểm tra endpoint chung | Teacher chỉ được provision `student`; staff role chỉ admin | Đã xử lý |
| 6 | Tạo học sinh chưa tạo credential thật | Server tạo Firebase Auth user + Firestore profile | Đã xử lý |
| 7 | Mật khẩu học sinh có nguy cơ trở thành dữ liệu hồ sơ | Password chỉ gửi tới Firebase Auth, không ghi profile | Đã xử lý |
| 8 | Xóa học sinh chưa xóa Auth account/persisted data | Xóa Auth user + profile + progress/attempt data | Đã xử lý |
| 9 | Seed ID `teacher-1/student-1` không phù hợp Firebase UID | Bootstrap remap toàn bộ quan hệ sang Firebase UID | Đã xử lý |
| 10 | Bootstrap có thể tạo account không password | Bắt buộc BOOTSTRAP password >= 6 khi cần tạo mới | Đã xử lý |
| 11 | `ALLOW_LOCAL_DATA=true` trước đó vô tình làm tắt Admin Auth | Tách quyết định Auth config khỏi Firestore/local data mode | Đã xử lý |
| 12 | Express 4 không tự forward rejected Promise từ async Firestore route | Nâng Express 5.2.1 + JSON error middleware | Đã xử lý |
| 13 | Catch-all `*` không hợp lệ theo Express 5 | Đổi thành `/{*splat}` | Đã xử lý |
| 14 | `bun.lock` cũ không chứa dependency Firebase mới | Loại lockfile cũ để tránh frozen-lock mismatch trên Vercel | Đã xử lý |
| 15 | Firestore có thể bị client gọi trực tiếp | `firestore.rules` deny direct client access | Đã xử lý |
| 16 | Chưa có Firebase config deploy file | Thêm `firebase.json` | Đã xử lý |
| 17 | Client có nguy cơ nhận service-account secret nếu đặt nhầm VITE_* | Tách rõ public Web config và server-only Admin variables | Đã xử lý |

## 4. File đã sửa/thêm/xóa

So với bản `Ontap-main-audited-upgraded-2026-09-01.zip` trước P1:

### 17 file sửa

- `.env.example`
- `README.md`
- `firebase-blueprint.json`
- `firestore.rules`
- `package.json`
- `server.ts`
- `server/app.ts`
- `server/db.ts`
- `server/routes.ts`
- `server/sheets.ts`
- `server/utils/access.ts`
- `src/App.tsx`
- `src/components/common/Header.tsx`
- `src/components/teacher/ClassManager.tsx`
- `src/context/AuthContext.tsx`
- `src/services/api.ts`
- `tests/core-regressions.cjs`

### 10 file mới của source/P1

- `docs/superpowers/plans/2026-09-01-firebase-auth-firestore.md`
- `docs/superpowers/specs/2026-09-01-firebase-auth-firestore-design.md`
- `firebase.json`
- `scripts/bootstrap-firebase.ts`
- `server/auth.ts`
- `server/firebaseAdmin.ts`
- `server/utils/authHeaders.ts`
- `server/utils/firebaseConfig.ts`
- `src/components/auth/LoginScreen.tsx`
- `src/services/firebase.ts`

### 1 file xóa

- `bun.lock` — lockfile cũ không còn đồng bộ với dependencies Firebase/Express mới và không thể tái sinh trong sandbox do npm registry không truy cập được.

### Báo cáo mới

- `FIREBASE_P1_REPORT.md`

## 5. Dependency thay đổi

Thêm:

- `firebase ^12.18.0`
- `firebase-admin ^14.3.0`

Nâng:

- `express ^5.2.1`
- `@types/express ^5.0.6`

Runtime:

- Pin `engines.node = 22.x` để GitHub Actions và Vercel dùng cùng major Node.js.

Lý do nâng Express: toàn bộ DB route P1 dùng `async/await`; Express 5 xử lý rejected Promise từ async handler/middleware trực tiếp và phù hợp kiến trúc Firestore mới.

## 6. Environment Variables

### Client Firebase Web

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_STORAGE_BUCKET=
```

### Server Firebase Admin

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Hoặc:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={...}
```

### Gemini

```env
GEMINI_API_KEY=
```

### Bootstrap một lần

```env
BOOTSTRAP_TEACHER_PASSWORD=
BOOTSTRAP_STUDENT_PASSWORD=
BOOTSTRAP_ADMIN_PASSWORD=
```

Xóa các biến BOOTSTRAP sau khi provision.

## 7. Bootstrap Firestore/Auth

Sau khi tạo Firebase project, bật Email/Password và tạo Firestore:

```bash
npm install
npm run bootstrap:firebase
```

Script sẽ:

1. tìm hoặc tạo Firebase Auth users theo seed email;
2. nhận Firebase UID;
3. remap các quan hệ teacher/student sang UID;
4. ghi toàn bộ seed collections và settings vào Firestore.

## 8. Kiểm thử đã thực hiện trong sandbox

### Regression tests

Kết quả cuối hiện tại: **14/14 PASS**.

Bao gồm:

- material progress aggregation;
- không lộ answer/rubric trước submit;
- deadline attempt;
- AI schema validation;
- exam class assignment;
- student settings sanitization;
- Vercel disk persistence guard;
- Bearer token parser;
- Firebase private-key newline normalization;
- service-account JSON parser;
- Firestore selection logic;
- Firebase Auth config độc lập với local-data fallback;
- teacher/admin provisioning-role policy.

### Static verification

- TS/TSX transpile syntax: **46 file, 0 lỗi**.
- Relative imports: **0 thiếu**.
- JSON configs: PASS.
- GitHub Actions YAML: PASS.
- Bare package imports: **0 dependency undeclared**.
- Runtime source: không còn `x-user-id`, `x-demo-user-id`, account switcher.
- `src/`: không chứa Firebase service-account private key/client email hoặc Gemini server key.
- Không có service-account JSON, `.pem` hoặc `.key` được đóng gói.

## 9. Kiểm tra chưa thể hoàn tất trong sandbox

`npm install`/`npm run build` chưa thể chạy đầy đủ vì môi trường hiện tại không phân giải được npm registry:

```text
EAI_AGAIN registry.npmjs.org
```

Do đó báo cáo **không tuyên bố Vite production build đã PASS** trong sandbox.

Repository đã có GitHub Actions chạy:

1. `npm install`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Khi push lên GitHub có Internet, đây là lớp xác minh production build bắt buộc.

## 10. Hạng mục vẫn CHƯA thêm vì ngoài P1

- Firebase Storage/Vercel Blob upload thật.
- Đọc/ lưu binary PDF-DOCX-PPTX-video qua storage thật.
- Google Sheets API thật.
- Password reset email.
- Social login.
- MFA.
- Firebase App Check.
- Rate limiting/WAF chuyên biệt.

Những mục này cần phê duyệt riêng trước khi triển khai.
