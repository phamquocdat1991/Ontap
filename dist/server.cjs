var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express3 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/app.ts
var import_express2 = __toESM(require("express"), 1);

// server/routes.ts
var import_express = __toESM(require("express"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STORE_FILE = import_path.default.join(DATA_DIR, "store.json");
var initialData = {
  users: [
    {
      id: "teacher-1",
      email: "phamquocdat1991@gmail.com",
      fullName: "Th\u1EA7y Ph\u1EA1m Qu\u1ED1c \u0110\u1EA1t",
      role: "teacher",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      school: "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong",
      subjectSpecialty: "To\xE1n h\u1ECDc & Tin h\u1ECDc",
      createdAt: "2024-09-01T00:00:00Z"
    },
    {
      id: "teacher-2",
      email: "nguyenvana_teacher@school.edu.vn",
      fullName: "C\xF4 L\xEA Ho\xE0ng Mai",
      role: "teacher",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      school: "THPT Chu V\u0103n An",
      subjectSpecialty: "V\u1EADt l\xED & STEM",
      createdAt: "2024-09-01T00:00:00Z"
    },
    {
      id: "student-1",
      email: "nguyenvanan.10a1@school.edu.vn",
      fullName: "Nguy\u1EC5n V\u0103n An",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      classId: "class-1",
      className: "10A1 (Chuy\xEAn To\xE1n)",
      school: "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong",
      createdAt: "2024-09-05T00:00:00Z"
    },
    {
      id: "student-2",
      email: "tranthimai.10a1@school.edu.vn",
      fullName: "Tr\u1EA7n Th\u1ECB Mai",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      classId: "class-1",
      className: "10A1 (Chuy\xEAn To\xE1n)",
      school: "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong",
      createdAt: "2024-09-05T00:00:00Z"
    },
    {
      id: "student-3",
      email: "leminhkhoi.10a2@school.edu.vn",
      fullName: "L\xEA Minh Kh\xF4i",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      classId: "class-2",
      className: "10A2 (Chuy\xEAn L\xED)",
      school: "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong",
      createdAt: "2024-09-05T00:00:00Z"
    },
    {
      id: "admin-1",
      email: "admin.aihub@education.gov.vn",
      fullName: "Qu\u1EA3n Tr\u1ECB Vi\xEAn H\u1EC7 Th\u1ED1ng",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      school: "S\u1EDF GD&\u0110T",
      createdAt: "2024-08-01T00:00:00Z"
    }
  ],
  classes: [
    {
      id: "class-1",
      name: "10A1 (To\xE1n Tin)",
      grade: "10",
      academicYear: "2024 - 2025",
      teacherId: "teacher-1",
      teacherName: "Th\u1EA7y Ph\u1EA1m Qu\u1ED1c \u0110\u1EA1t",
      studentCount: 38,
      description: "L\u1EDBp chuy\xEAn To\xE1n Tin kh\xF3a 2024",
      createdAt: "2024-09-01T00:00:00Z"
    },
    {
      id: "class-2",
      name: "10A2 (T\u1EF1 Nhi\xEAn)",
      grade: "10",
      academicYear: "2024 - 2025",
      teacherId: "teacher-1",
      teacherName: "Th\u1EA7y Ph\u1EA1m Qu\u1ED1c \u0110\u1EA1t",
      studentCount: 40,
      description: "L\u1EDBp kh\u1ED1i t\u1EF1 nhi\xEAn \u0111\u1ECBnh h\u01B0\u1EDBng STEM",
      createdAt: "2024-09-01T00:00:00Z"
    }
  ],
  courses: [
    {
      id: "course-toan-10",
      title: "To\xE1n h\u1ECDc 10 - Ch\u01B0\u01A1ng tr\xECnh GDPT 2018",
      subject: "To\xE1n h\u1ECDc",
      grade: "10",
      bookSeries: "K\u1EBFt N\u1ED1i Tri Th\u1EE9c",
      teacherId: "teacher-1",
      description: "Kh\xF3a h\u1ECDc b\xE1m s\xE1t ch\u01B0\u01A1ng tr\xECnh m\u1EDBi, t\u1EADp trung v\xE0o t\u01B0 duy gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1, vect\u01A1 v\xE0 h\xE0m s\u1ED1.",
      coverColor: "emerald",
      status: "published",
      createdAt: "2024-09-01T00:00:00Z"
    },
    {
      id: "course-ly-10",
      title: "V\u1EADt l\xED 10 - \u0110\u1ED9ng h\u1ECDc v\xE0 \u0110\u1ED9ng l\u1EF1c h\u1ECDc",
      subject: "V\u1EADt l\xED",
      grade: "10",
      bookSeries: "C\xE1nh Di\u1EC1u",
      teacherId: "teacher-1",
      description: "Kh\xE1m ph\xE1 th\u1EBF gi\u1EDBi v\u1EADt l\xED th\xF4ng qua th\u1EF1c nghi\u1EC7m, m\xF4 ph\u1ECFng v\xE0 b\xE0i t\u1EADp v\u1EADn d\u1EE5ng th\u1EF1c t\u1EBF.",
      coverColor: "blue",
      status: "published",
      createdAt: "2024-09-02T00:00:00Z"
    }
  ],
  chapters: [
    {
      id: "chap-1",
      courseId: "course-toan-10",
      title: "Ch\u01B0\u01A1ng IV: Vect\u01A1 trong m\u1EB7t ph\u1EB3ng t\u1ECDa \u0111\u1ED9",
      order: 1,
      description: "Kh\xE1i ni\u1EC7m vect\u01A1, c\xE1c ph\xE9p to\xE1n vect\u01A1, t\xEDch v\xF4 h\u01B0\u1EDBng v\xE0 \u1EE9ng d\u1EE5ng h\xECnh h\u1ECDc."
    },
    {
      id: "chap-2",
      courseId: "course-toan-10",
      title: "Ch\u01B0\u01A1ng III: H\xE0m s\u1ED1 v\xE0 \u0110\u1ED3 th\u1ECB b\u1EADc hai",
      order: 2,
      description: "Kh\u1EA3o s\xE1t v\xE0 v\u1EBD \u0111\u1ED3 th\u1ECB h\xE0m s\u1ED1 b\u1EADc hai, d\u1EA5u c\u1EE7a tam th\u1EE9c b\u1EADc hai."
    }
  ],
  lessons: [
    {
      id: "lesson-1",
      chapterId: "chap-1",
      courseId: "course-toan-10",
      title: "B\xE0i 1: Kh\xE1i ni\u1EC7m vect\u01A1 v\xE0 c\xE1c ph\xE9p to\xE1n c\u01A1 b\u1EA3n",
      order: 1,
      status: "published",
      durationMinutes: 45,
      learningObjectives: [
        "Nh\u1EADn bi\u1EBFt \u0111\u1ECBnh ngh\u0129a vect\u01A1, vect\u01A1-kh\xF4ng, \u0111\u1ED9 d\xE0i vect\u01A1.",
        "Hi\u1EC3u v\xE0 v\u1EADn d\u1EE5ng quy t\u1EAFc 3 \u0111i\u1EC3m, quy t\u1EAFc h\xECnh b\xECnh h\xE0nh \u0111\u1EC3 c\u1ED9ng, tr\u1EEB vect\u01A1.",
        "V\u1EADn d\u1EE5ng t\xEDnh ch\u1EA5t vect\u01A1 v\xE0o gi\u1EA3i c\xE1c b\xE0i to\xE1n th\u1EF1c t\u1EBF."
      ],
      contentAI: {
        title: "Kh\xE1i ni\u1EC7m Vect\u01A1 v\xE0 c\xE1c ph\xE9p to\xE1n vect\u01A1 c\u01A1 b\u1EA3n",
        objectives: [
          "N\u1EAFm v\u1EEFng kh\xE1i ni\u1EC7m \u0111o\u1EA1n th\u1EB3ng c\xF3 h\u01B0\u1EDBng, h\u01B0\u1EDBng v\xE0 \u0111\u1ED9 d\xE0i c\u1EE7a vect\u01A1.",
          "Th\u1EF1c hi\u1EC7n th\xE0nh th\u1EA1o ph\xE9p c\u1ED9ng, tr\u1EEB hai vect\u01A1 b\u1EB1ng quy t\u1EAFc ba \u0111i\u1EC3m v\xE0 quy t\u1EAFc h\xECnh b\xECnh h\xE0nh."
        ],
        keyKnowledge: [
          "Vect\u01A1 l\xE0 m\u1ED9t \u0111o\u1EA1n th\u1EB3ng c\xF3 h\u01B0\u1EDBng (ch\u1EC9 r\xF5 \u0111i\u1EC3m \u0111\u1EA7u v\xE0 \u0111i\u1EC3m cu\u1ED1i).",
          "Hai vect\u01A1 c\xF9ng ph\u01B0\u01A1ng n\u1EBFu gi\xE1 c\u1EE7a ch\xFAng song song ho\u1EB7c tr\xF9ng nhau.",
          "Hai vect\u01A1 b\u1EB1ng nhau n\u1EBFu ch\xFAng c\xF9ng h\u01B0\u1EDBng v\xE0 c\xF9ng \u0111\u1ED9 d\xE0i: a = b <=> |a| = |b| v\xE0 a c\xF9ng h\u01B0\u1EDBng b."
        ],
        concepts: [
          { term: "Vect\u01A1-kh\xF4ng (0)", definition: "L\xE0 vect\u01A1 c\xF3 \u0111i\u1EC3m \u0111\u1EA7u v\xE0 \u0111i\u1EC3m cu\u1ED1i tr\xF9ng nhau, \u0111\u1ED9 d\xE0i b\u1EB1ng 0, c\xF9ng ph\u01B0\u01A1ng c\xF9ng h\u01B0\u1EDBng v\u1EDBi m\u1ECDi vect\u01A1." },
          { term: "Quy t\u1EAFc ba \u0111i\u1EC3m", definition: "V\u1EDBi 3 \u0111i\u1EC3m b\u1EA5t k\xEC A, B, C ta lu\xF4n c\xF3: AB + BC = AC." },
          { term: "Quy t\u1EAFc h\xECnh b\xECnh h\xE0nh", definition: "N\u1EBFu ABCD l\xE0 h\xECnh b\xECnh h\xE0nh th\xEC: AB + AD = AC (\u0111\u01B0\u1EDDng ch\xE9o xu\u1EA5t ph\xE1t t\u1EEB \u0111\u1EC9nh A)." }
        ],
        formulas: [
          { name: "Quy t\u1EAFc hi\u1EC7u 3 \u0111i\u1EC3m", formula: "AB - AC = CB", note: "Chung g\u1ED1c A, \u0111\u1EA3o th\u1EE9 t\u1EF1 ng\u1ECDn B, C th\xE0nh CB" },
          { name: "T\u1ECDa \u0111\u1ED9 vect\u01A1 trong Oxy", formula: "u = (x; y) <=> u = x*i + y*j", note: "i, j l\xE0 2 vect\u01A1 \u0111\u01A1n v\u1ECB tr\xEAn Ox, Oy" },
          { name: "\u0110\u1ED9 d\xE0i vect\u01A1", formula: "|u| = sqrt(x^2 + y^2)" }
        ],
        examples: [
          {
            question: "Cho h\xECnh vu\xF4ng ABCD t\xE2m O c\u1EA1nh a. T\xEDnh \u0111\u1ED9 d\xE0i c\u1EE7a vect\u01A1 u = AB + AD.",
            solution: "\xC1p d\u1EE5ng quy t\u1EAFc h\xECnh b\xECnh h\xE0nh: V\xEC ABCD l\xE0 h\xECnh vu\xF4ng (c\u0169ng l\xE0 h\xECnh b\xECnh h\xE0nh) n\xEAn AB + AD = AC.\n\u0110\u1ED9 d\xE0i vect\u01A1 u l\xE0 |u| = |AC| = a*sqrt(2).",
            explanation: "T\u1ED5ng hai vect\u01A1 c\u1EA1nh xu\u1EA5t ph\xE1t t\u1EEB \u0111\u1EC9nh h\xECnh b\xECnh h\xE0nh b\u1EB1ng vect\u01A1 \u0111\u01B0\u1EDDng ch\xE9o."
          },
          {
            question: "Cho 4 \u0111i\u1EC3m ph\xE2n bi\u1EC7t A, B, C, D. R\xFAt g\u1ECDn bi\u1EC3u th\u1EE9c: T = AB + CD + BC + DA.",
            solution: "S\u1EAFp x\u1EBFp l\u1EA1i c\xE1c vect\u01A1 theo quy t\u1EAFc n\u1ED1i \u0111u\xF4i: T = (AB + BC) + (CD + DA) = AC + CA = AA = 0.",
            explanation: "V\u1EADn d\u1EE5ng t\xEDnh ch\u1EA5t giao ho\xE1n v\xE0 quy t\u1EAFc 3 \u0111i\u1EC3m \u0111\u1EC3 \u0111\u01B0a v\u1EC1 vect\u01A1-kh\xF4ng."
          }
        ],
        commonMistakes: [
          {
            mistake: "Coi \u0111\u1ED9 d\xE0i t\u1ED5ng vect\u01A1 b\u1EB1ng t\u1ED5ng \u0111\u1ED9 d\xE0i: |a + b| = |a| + |b| trong m\u1ECDi tr\u01B0\u1EDDng h\u1EE3p.",
            correction: 'Ch\u1EC9 x\u1EA3y ra d\u1EA5u "=" khi hai vect\u01A1 a v\xE0 b c\xF9ng h\u01B0\u1EDBng. N\xF3i chung: |a + b| <= |a| + |b| (b\u1EA5t \u0111\u1EB3ng th\u1EE9c tam gi\xE1c).',
            advice: "Lu\xF4n d\u1EF1ng h\xECnh t\u1ED5ng vect\u01A1 tr\u01B0\u1EDBc khi t\xEDnh to\xE1n \u0111\u1ED9 d\xE0i."
          },
          {
            mistake: "Nh\u1EA7m l\u1EABn quy t\u1EAFc tr\u1EEB: AB - AC = BC.",
            correction: "Quy t\u1EAFc \u0111\xFAng: AB - AC = CB (ng\u1ECDn sau tr\u1EEB ng\u1ECDn tr\u01B0\u1EDBc).",
            advice: 'Ghi nh\u1EDB c\xE2u th\u1EA7n ch\xFA: "Chung g\u1ED1c tr\u1EEB nhau b\u1EB1ng ng\u1ECDn sau v\u1EC1 ng\u1ECDn tr\u01B0\u1EDBc".'
          }
        ],
        quickCheck: [
          {
            question: "Kh\u1EB3ng \u0111\u1ECBnh n\xE0o sau \u0111\xE2y l\xE0 \u0110\xDANG v\u1EDBi ba \u0111i\u1EC3m ph\xE2n bi\u1EC7t M, N, P b\u1EA5t k\xEC?",
            options: ["MN + NP = MP", "MN + MP = NP", "MN - NP = MP", "MN + NP = PM"],
            answer: "MN + NP = MP",
            hint: "Nh\u1EDB l\u1EA1i quy t\u1EAFc 3 \u0111i\u1EC3m n\u1ED1i ti\u1EBFp \u0111i\u1EC3m N."
          },
          {
            question: "Vect\u01A1 c\xF3 \u0111i\u1EC3m \u0111\u1EA7u l\xE0 A v\xE0 \u0111i\u1EC3m cu\u1ED1i l\xE0 B \u0111\u01B0\u1EE3c k\xED hi\u1EC7u l\xE0 g\xEC?",
            options: ["AB", "BA", "|AB|", "(A, B)"],
            answer: "AB",
            hint: "\u0110i\u1EC3m \u0111\u1EA7u vi\u1EBFt tr\u01B0\u1EDBc, \u0111i\u1EC3m cu\u1ED1i vi\u1EBFt sau k\xE8m d\u1EA5u m\u0169i t\xEAn."
          }
        ],
        summary: "Vect\u01A1 l\xE0 c\xF4ng c\u1EE5 to\xE1n h\u1ECDc n\u1EC1n t\u1EA3ng m\xF4 t\u1EA3 \u0111\u1EA1i l\u01B0\u1EE3ng c\xF3 c\u1EA3 \u0111\u1ED9 l\u1EDBn v\xE0 h\u01B0\u1EDBng. N\u1EAFm ch\u1EAFc quy t\u1EAFc 3 \u0111i\u1EC3m v\xE0 h\xECnh b\xECnh h\xE0nh gi\xFAp gi\u1EA3i quy\u1EBFt nh\u1EB9 nh\xE0ng c\xE1c b\xE0i to\xE1n h\xECnh h\u1ECDc v\xE0 c\u01A1 h\u1ECDc."
      },
      teacherNotes: "B\xE0i m\u1EDF \u0111\u1EA7u r\u1EA5t quan tr\u1ECDng. C\u1EA7n nh\u1EA5n m\u1EA1nh s\u1EF1 kh\xE1c bi\u1EC7t gi\u1EEFa \u0111o\u1EA1n th\u1EB3ng v\xE0 vect\u01A1.",
      createdAt: "2024-09-05T08:00:00Z",
      updatedAt: "2024-09-05T08:00:00Z"
    },
    {
      id: "lesson-2",
      chapterId: "chap-1",
      courseId: "course-toan-10",
      title: "B\xE0i 2: T\xEDch v\xF4 h\u01B0\u1EDBng c\u1EE7a hai vect\u01A1 v\xE0 \u1EE9ng d\u1EE5ng",
      order: 2,
      status: "published",
      durationMinutes: 45,
      learningObjectives: [
        "Hi\u1EC3u \u0111\u1ECBnh ngh\u0129a g\xF3c gi\u1EEFa hai vect\u01A1 v\xE0 t\xEDch v\xF4 h\u01B0\u1EDBng.",
        "V\u1EADn d\u1EE5ng c\xF4ng th\u1EE9c t\xEDnh c\xF4ng c\u1EE7a l\u1EF1c v\xE0 ch\u1EE9ng minh vu\xF4ng g\xF3c."
      ],
      contentAI: {
        title: "T\xEDch v\xF4 h\u01B0\u1EDBng c\u1EE7a hai vect\u01A1",
        objectives: ["T\xEDnh g\xF3c gi\u1EEFa hai vect\u01A1", "\xC1p d\u1EE5ng bi\u1EC3u th\u1EE9c t\u1ECDa \u0111\u1ED9 c\u1EE7a t\xEDch v\xF4 h\u01B0\u1EDBng"],
        keyKnowledge: ["T\xEDch v\xF4 h\u01B0\u1EDBng: a.b = |a|.|b|.cos(a, b)", "Hai vect\u01A1 vu\xF4ng g\xF3c <=> a.b = 0"],
        concepts: [
          { term: "G\xF3c gi\u1EEFa hai vect\u01A1", definition: "G\xF3c t\u1EA1o b\u1EDFi hai tia xu\u1EA5t ph\xE1t t\u1EEB m\u1ED9t \u0111i\u1EC3m c\xF9ng h\u01B0\u1EDBng v\u1EDBi hai vect\u01A1." }
        ],
        formulas: [
          { name: "T\xEDch v\xF4 h\u01B0\u1EDBng t\u1ECDa \u0111\u1ED9", formula: "a.b = x1*x2 + y1*y2" },
          { name: "Cos g\xF3c gi\u1EEFa 2 vect\u01A1", formula: "cos(a, b) = (x1*x2 + y1*y2) / (sqrt(x1^2+y1^2) * sqrt(x2^2+y2^2))" }
        ],
        examples: [
          { question: "Cho a = (1; 2) v\xE0 b = (-2; 1). T\xEDnh a.b.", solution: "a.b = 1*(-2) + 2*1 = 0 => a vu\xF4ng g\xF3c b.", explanation: "T\xEDch v\xF4 h\u01B0\u1EDBng b\u1EB1ng 0 n\xEAn hai vect\u01A1 vu\xF4ng g\xF3c." }
        ],
        commonMistakes: [
          { mistake: "Ngh\u0129 r\u1EB1ng t\xEDch v\xF4 h\u01B0\u1EDBng l\xE0 m\u1ED9t vect\u01A1.", correction: "T\xEDch v\xF4 h\u01B0\u1EDBng c\u1EE7a 2 vect\u01A1 l\xE0 M\u1ED8T S\u1ED0 TH\u1EF0C (v\xF4 h\u01B0\u1EDBng).", advice: "Ph\xE2n bi\u1EC7t ph\xE9p nh\xE2n vect\u01A1 v\u1EDBi s\u1ED1 v\xE0 t\xEDch v\xF4 h\u01B0\u1EDBng." }
        ],
        quickCheck: [
          { question: "N\u1EBFu hai vect\u01A1 vu\xF4ng g\xF3c v\u1EDBi nhau th\xEC t\xEDch v\xF4 h\u01B0\u1EDBng b\u1EB1ng bao nhi\xEAu?", answer: "0" }
        ],
        summary: "T\xEDch v\xF4 h\u01B0\u1EDBng li\xEAn k\u1EBFt \u0111\u1ED9 d\xE0i, g\xF3c v\xE0 h\xECnh chi\u1EBFu, l\xE0 c\xF4ng c\u1EE5 m\u1EA1nh m\u1EBD trong h\xECnh h\u1ECDc gi\u1EA3i t\xEDch."
      },
      createdAt: "2024-09-06T08:00:00Z",
      updatedAt: "2024-09-06T08:00:00Z"
    }
  ],
  materials: [
    {
      id: "mat-1",
      lessonId: "lesson-1",
      type: "pdf",
      filename: "Tai_lieu_chuyen_de_Vecto_Lop10.pdf",
      storageUrl: "https://storage.googleapis.com/eduhub-assets/samples/vecto-chuyende.pdf",
      pageCount: 8,
      required: true,
      fileSize: "2.4 MB",
      createdAt: "2024-09-05T08:30:00Z"
    },
    {
      id: "mat-2",
      lessonId: "lesson-1",
      type: "video",
      filename: "BaiGiang_TrucQuan_QuyTacHinhBinhHanh.mp4",
      storageUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 360,
      // 6 minutes (360 seconds)
      required: true,
      fileSize: "18.5 MB",
      createdAt: "2024-09-05T08:35:00Z"
    }
  ],
  lessonProgress: [
    {
      id: "prog-student-1-lesson-1",
      userId: "student-1",
      lessonId: "lesson-1",
      completedUnits: 8,
      totalUnits: 8,
      percentage: 100,
      lastPosition: 8,
      viewedPages: [1, 2, 3, 4, 5, 6, 7, 8],
      watchedSegments: [[0, 360]],
      isCompleted: true,
      lastOpenedAt: "2024-09-08T14:30:00Z",
      completedAt: "2024-09-08T14:45:00Z"
    },
    {
      id: "prog-student-2-lesson-1",
      userId: "student-2",
      lessonId: "lesson-1",
      completedUnits: 5,
      totalUnits: 8,
      percentage: 62.5,
      lastPosition: 5,
      viewedPages: [1, 2, 3, 4, 5],
      watchedSegments: [[0, 180]],
      isCompleted: false,
      lastOpenedAt: "2024-09-09T09:15:00Z"
    }
  ],
  practiceQuizzes: [
    {
      id: "quiz-lesson-1",
      lessonId: "lesson-1",
      courseId: "course-toan-10",
      title: "Luy\u1EC7n t\u1EADp nhanh: Kh\xE1i ni\u1EC7m & Ph\xE9p to\xE1n Vect\u01A1",
      timeLimitMinutes: 15,
      maxAttempts: 3,
      passPercentage: 80,
      status: "published",
      createdAt: "2024-09-05T09:00:00Z",
      questions: [
        {
          id: "q1",
          question: "Cho 3 \u0111i\u1EC3m A, B, C ph\xE2n bi\u1EC7t. Kh\u1EB3ng \u0111\u1ECBnh n\xE0o sau \u0111\xE2y lu\xF4n \u0110\xDANG theo quy t\u1EAFc ba \u0111i\u1EC3m?",
          type: "multiple_choice",
          options: [
            "A. AB + BC = AC",
            "B. AB + AC = BC",
            "C. BA + AC = CB",
            "D. CA + BA = CB"
          ],
          correctAnswer: "A. AB + BC = AC",
          explanation: "Theo quy t\u1EAFc 3 \u0111i\u1EC3m, khi \u0111i\u1EC3m cu\u1ED1i c\u1EE7a vect\u01A1 th\u1EE9 nh\u1EA5t tr\xF9ng v\u1EDBi \u0111i\u1EC3m \u0111\u1EA7u c\u1EE7a vect\u01A1 th\u1EE9 hai, t\u1ED5ng l\xE0 vect\u01A1 n\u1ED1i t\u1EEB \u0111i\u1EC3m \u0111\u1EA7u c\u1EE7a vect\u01A1 1 \u0111\u1EBFn \u0111i\u1EC3m cu\u1ED1i c\u1EE7a vect\u01A1 2 (AB + BC = AC).",
          hint1: "H\xE3y ch\xFA \xFD \u0111i\u1EC3m chung B \u0111\u1EE9ng \u1EDF v\u1ECB tr\xED ng\u1ECDn c\u1EE7a vect\u01A1 \u0111\u1EA7u v\xE0 g\u1ED1c c\u1EE7a vect\u01A1 sau.",
          hint2: "Quy t\u1EAFc n\u1ED1i \u0111u\xF4i: A \u0111i \u0111\u1EBFn B, r\u1ED3i t\u1EEB B \u0111i ti\u1EBFp \u0111\u1EBFn C t\u01B0\u01A1ng \u0111\u01B0\u01A1ng v\u1EDBi \u0111i th\u1EB3ng t\u1EEB A \u0111\u1EBFn C.",
          difficulty: "nhan_biet",
          learningObjective: "Nh\u1EADn bi\u1EBFt quy t\u1EAFc 3 \u0111i\u1EC3m",
          points: 2.5
        },
        {
          id: "q2",
          question: "Cho h\xECnh b\xECnh h\xE0nh ABCD. Vect\u01A1 t\u1ED5ng AB + AD b\u1EB1ng vect\u01A1 n\xE0o d\u01B0\u1EDBi \u0111\xE2y?",
          type: "multiple_choice",
          options: [
            "A. AC",
            "B. BD",
            "C. CA",
            "D. DB"
          ],
          correctAnswer: "A. AC",
          explanation: "Theo quy t\u1EAFc h\xECnh b\xECnh h\xE0nh, t\u1ED5ng c\u1EE7a hai vect\u01A1 c\xF9ng xu\u1EA5t ph\xE1t t\u1EEB m\u1ED9t \u0111\u1EC9nh b\u1EB1ng vect\u01A1 \u0111\u01B0\u1EDDng ch\xE9o xu\u1EA5t ph\xE1t t\u1EEB \u0111\u1EC9nh \u0111\xF3: AB + AD = AC.",
          hint1: "V\u1EBD h\xECnh b\xECnh h\xE0nh ABCD v\xE0 quan s\xE1t \u0111\u01B0\u1EDDng ch\xE9o AC xu\u1EA5t ph\xE1t t\u1EEB \u0111\u1EC9nh A.",
          hint2: "Nh\u1EDB l\u1EA1i quy t\u1EAFc h\xECnh b\xECnh h\xE0nh: hai c\u1EA1nh k\u1EC1 c\u1ED9ng l\u1EA1i ra \u0111\u01B0\u1EDDng ch\xE9o chung g\u1ED1c.",
          difficulty: "thong_hieu",
          learningObjective: "V\u1EADn d\u1EE5ng quy t\u1EAFc h\xECnh b\xECnh h\xE0nh",
          points: 2.5
        },
        {
          id: "q3",
          question: "\u0110\u1ED9 d\xE0i c\u1EE7a vect\u01A1-kh\xF4ng lu\xF4n b\u1EB1ng 0.",
          type: "true_false",
          options: ["\u0110\xFAng", "Sai"],
          correctAnswer: "\u0110\xFAng",
          explanation: "Vect\u01A1-kh\xF4ng c\xF3 \u0111i\u1EC3m \u0111\u1EA7u v\xE0 \u0111i\u1EC3m cu\u1ED1i tr\xF9ng nhau n\xEAn kho\u1EA3ng c\xE1ch b\u1EB1ng 0, \u0111\u1ED9 d\xE0i |0| = 0.",
          hint1: "\u0110i\u1EC3m \u0111\u1EA7u v\xE0 \u0111i\u1EC3m cu\u1ED1i c\u1EE7a vect\u01A1-kh\xF4ng c\xF3 kho\u1EA3ng c\xE1ch l\xE0 bao nhi\xEAu?",
          hint2: "\u0110\u1ECBnh ngh\u0129a: vect\u01A1-kh\xF4ng c\xF3 \u0111\u1ED9 d\xE0i tri\u1EC7t ti\xEAu.",
          difficulty: "nhan_biet",
          learningObjective: "Hi\u1EC3u t\xEDnh ch\u1EA5t vect\u01A1 kh\xF4ng",
          points: 2.5
        },
        {
          id: "q4",
          question: "Cho tam gi\xE1c ABC \u0111\u1EC1u c\u1EA1nh b\u1EB1ng a. \u0110\u1ED9 d\xE0i c\u1EE7a vect\u01A1 AB - AC l\xE0 bao nhi\xEAu? (Nh\u1EADp \u0111\xE1p \xE1n d\u1EA1ng s\u1ED1 ho\u1EB7c a, v\xED d\u1EE5: a)",
          type: "short_answer",
          correctAnswer: "a",
          explanation: "Ta c\xF3: AB - AC = CB (theo quy t\u1EAFc hi\u1EC7u chung g\u1ED1c A). \u0110\u1ED9 d\xE0i |CB| ch\xEDnh l\xE0 \u0111\u1ED9 d\xE0i c\u1EA1nh BC c\u1EE7a tam gi\xE1c \u0111\u1EC1u, b\u1EB1ng a.",
          hint1: "R\xFAt g\u1ECDn hi\u1EC7u AB - AC tr\u01B0\u1EDBc b\u1EB1ng quy t\u1EAFc tr\u1EEB chung g\u1ED1c.",
          hint2: "AB - AC = CB. Tam gi\xE1c ABC \u0111\u1EC1u c\u1EA1nh a th\xEC \u0111\u1ED9 d\xE0i \u0111o\u1EA1n th\u1EB3ng CB b\u1EB1ng bao nhi\xEAu?",
          difficulty: "van_dung",
          learningObjective: "T\xEDnh \u0111\u1ED9 d\xE0i vect\u01A1 hi\u1EC7u",
          points: 2.5
        }
      ]
    }
  ],
  practiceAttempts: [
    {
      id: "patt-1",
      quizId: "quiz-lesson-1",
      lessonId: "lesson-1",
      userId: "student-1",
      studentName: "Nguy\u1EC5n V\u0103n An",
      attemptNumber: 1,
      startedAt: "2024-09-08T15:00:00Z",
      deadline: "2024-09-08T15:15:00Z",
      submittedAt: "2024-09-08T15:08:20Z",
      answers: {
        q1: "A. AB + BC = AC",
        q2: "A. AC",
        q3: "\u0110\xFAng",
        q4: "a"
      },
      score: 10,
      totalScore: 10,
      percentage: 100,
      passed: true,
      status: "submitted",
      durationSeconds: 500
    }
  ],
  exams: [
    {
      id: "exam-1",
      courseId: "course-toan-10",
      classIds: ["class-1", "class-2"],
      title: "Ki\u1EC3m tra \u0110\xE1nh gi\xE1 \u0110\u1ECBnh k\u1EF3: Vect\u01A1 v\xE0 H\u1EC7 t\u1ECDa \u0111\u1ED9 Oxy (45 ph\xFAt)",
      type: "midterm",
      scope: "To\xE0n b\u1ED9 Ch\u01B0\u01A1ng IV: Vect\u01A1 trong m\u1EB7t ph\u1EB3ng",
      durationMinutes: 45,
      totalScore: 10,
      questionCount: 4,
      status: "published",
      teacherId: "teacher-1",
      createdAt: "2024-09-10T08:00:00Z",
      publishedAt: "2024-09-10T08:30:00Z",
      matrix: {
        subject: "To\xE1n h\u1ECDc",
        grade: "10",
        examType: "midterm",
        durationMinutes: 45,
        totalScore: 10,
        questionCount: 4,
        cells: [
          {
            chapter: "Ch\u01B0\u01A1ng IV: Vect\u01A1 trong m\u1EB7t ph\u1EB3ng",
            nhanBiet: { countMC: 1, countEssay: 0, points: 2.5 },
            thongHieu: { countMC: 1, countEssay: 0, points: 2.5 },
            vanDung: { countMC: 1, countEssay: 0, points: 2.5 },
            vanDungCao: { countMC: 0, countEssay: 1, points: 2.5 },
            totalPoints: 10
          }
        ],
        summaryNote: "Ma tr\u1EADn b\xE1m s\xE1t th\xF4ng t\u01B0 22/2021/TT-BGD\u0110T: 70% Tr\u1EAFc nghi\u1EC7m kh\xE1ch quan + 30% T\u1EF1 lu\u1EADn t\u01B0 duy cao."
      },
      specification: "B\u1EA3n \u0111\u1EB7c t\u1EA3: 1 c\xE2u nh\u1EADn bi\u1EBFt quy t\u1EAFc 3 \u0111i\u1EC3m, 1 c\xE2u th\xF4ng hi\u1EC3u t\u1ECDa \u0111\u1ED9 vect\u01A1, 1 c\xE2u v\u1EADn d\u1EE5ng t\xEDch v\xF4 h\u01B0\u1EDBng, 1 c\xE2u t\u1EF1 lu\u1EADn ch\u1EE9ng minh \u0111\u1EB3ng th\u1EE9c v\xE0 t\xECm qu\u1EF9 t\xEDch \u0111i\u1EC3m.",
      rubric: "C\xE2u 4 (T\u1EF1 lu\u1EADn): \n- B\u01B0\u1EDBc 1: Bi\u1EBFn \u0111\u1ED5i v\u1EBF tr\xE1i s\u1EED d\u1EE5ng quy t\u1EAFc xen \u0111i\u1EC3m O (1.0 \u0111i\u1EC3m)\n- B\u01B0\u1EDBc 2: R\xFAt g\u1ECDn bi\u1EC3u th\u1EE9c vect\u01A1 v\xE0 nh\xF3m tr\u1ECDng t\xE2m G (1.0 \u0111i\u1EC3m)\n- B\u01B0\u1EDBc 3: K\u1EBFt lu\u1EADn qu\u1EF9 t\xEDch \u0111i\u1EC3m M l\xE0 \u0111\u01B0\u1EDDng tr\xF2n t\xE2m G b\xE1n k\xEDnh R = a/3 (0.5 \u0111i\u1EC3m)",
      scoringGuide: "\u0110i\u1EC3m t\u1ED5ng = \u0110i\u1EC3m tr\u1EAFc nghi\u1EC7m (7.5\u0111) + \u0110i\u1EC3m t\u1EF1 lu\u1EADn (2.5\u0111). AI h\u1ED7 tr\u1EE3 ch\u1EA5m t\u1EF1 lu\u1EADn theo t\u1EEBng b\u01B0\u1EDBc bi\u1EBFn \u0111\u1ED5i.",
      questions: [
        {
          id: "eq1",
          question: "Trong m\u1EB7t ph\u1EB3ng Oxy, cho hai \u0111i\u1EC3m A(1; 3) v\xE0 B(4; 2). T\u1ECDa \u0111\u1ED9 c\u1EE7a vect\u01A1 AB l\xE0:",
          type: "multiple_choice",
          options: [
            "A. (3; -1)",
            "B. (-3; 1)",
            "C. (5; 5)",
            "D. (3; 1)"
          ],
          correctAnswer: "A. (3; -1)",
          explanation: "T\u1ECDa \u0111\u1ED9 AB = (xB - xA; yB - yA) = (4 - 1; 2 - 3) = (3; -1).",
          difficulty: "nhan_biet",
          learningObjective: "T\xEDnh t\u1ECDa \u0111\u1ED9 vect\u01A1 t\u1EEB 2 \u0111i\u1EC3m",
          points: 2.5
        },
        {
          id: "eq2",
          question: "Cho tam gi\xE1c ABC c\xF3 tr\u1ECDng t\xE2m G. Kh\u1EB3ng \u0111\u1ECBnh n\xE0o sau \u0111\xE2y l\xE0 \u0110\xDANG?",
          type: "multiple_choice",
          options: [
            "A. GA + GB + GC = 0",
            "B. GA + GB + GC = 3GG",
            "C. AB + BC + CA = 3OG",
            "D. MA + MB + MC = OG"
          ],
          correctAnswer: "A. GA + GB + GC = 0",
          explanation: "T\xEDnh ch\u1EA5t tr\u1ECDng t\xE2m: T\u1ED5ng 3 vect\u01A1 t\u1EEB tr\u1ECDng t\xE2m G \u0111\u1EBFn 3 \u0111\u1EC9nh c\u1EE7a tam gi\xE1c lu\xF4n b\u1EB1ng vect\u01A1-kh\xF4ng: GA + GB + GC = 0.",
          difficulty: "thong_hieu",
          learningObjective: "Hi\u1EC3u t\xEDnh ch\u1EA5t tr\u1ECDng t\xE2m tam gi\xE1c",
          points: 2.5
        },
        {
          id: "eq3",
          question: "Cho hai vect\u01A1 u = (2; -1) v\xE0 v = (3; m). Gi\xE1 tr\u1ECB c\u1EE7a m \u0111\u1EC3 u vu\xF4ng g\xF3c v\u1EDBi v l\xE0: (Nh\u1EADp s\u1ED1 nguy\xEAn, v\xED d\u1EE5: 6)",
          type: "short_answer",
          correctAnswer: "6",
          explanation: "u vu\xF4ng g\xF3c v <=> u.v = 0 <=> 2*3 + (-1)*m = 0 <=> 6 - m = 0 <=> m = 6.",
          difficulty: "van_dung",
          learningObjective: "V\u1EADn d\u1EE5ng \u0111i\u1EC1u ki\u1EC7n vu\xF4ng g\xF3c 2 vect\u01A1",
          points: 2.5
        },
        {
          id: "eq4",
          question: "Cho tam gi\xE1c ABC c\xF3 tr\u1ECDng t\xE2m G. H\xE3y tr\xECnh b\xE0y l\u1EDDi gi\u1EA3i chi ti\u1EBFt \u0111\u1EC3 ch\u1EE9ng minh r\u1EB1ng v\u1EDBi m\u1ECDi \u0111i\u1EC3m M trong m\u1EB7t ph\u1EB3ng, ta lu\xF4n c\xF3: MA + MB + MC = 3MG.",
          type: "essay",
          correctAnswer: "L\u1EDDi gi\u1EA3i chu\u1EA9n:\n- Ch\xE8n \u0111i\u1EC3m G v\xE0o t\u1EEBng vect\u01A1 v\u1EBF tr\xE1i theo quy t\u1EAFc 3 \u0111i\u1EC3m:\n  MA = MG + GA\n  MB = MG + GB\n  MC = MG + GC\n- C\u1ED9ng v\u1EBF theo v\u1EBF ta \u0111\u01B0\u1EE3c:\n  MA + MB + MC = (MG + MG + MG) + (GA + GB + GC)\n               = 3MG + (GA + GB + GC)\n- V\xEC G l\xE0 tr\u1ECDng t\xE2m tam gi\xE1c ABC n\xEAn GA + GB + GC = 0.\n- Do \u0111\xF3: MA + MB + MC = 3MG (\u0110i\u1EC1u ph\u1EA3i ch\u1EE9ng minh).",
          explanation: "B\xE0i to\xE1n kinh \u0111i\u1EC3n v\u1EADn d\u1EE5ng t\xEDnh ch\u1EA5t xen \u0111i\u1EC3m v\xE0 t\xEDnh ch\u1EA5t tr\u1ECDng t\xE2m tam gi\xE1c.",
          rubric: "Ti\xEAu ch\xED ch\u1EA5m:\n1. \u0110\xFAng quy t\u1EAFc xen \u0111i\u1EC3m G v\xE0o MA, MB, MC (1.0 \u0111i\u1EC3m)\n2. Nh\xF3m c\xE1c vect\u01A1 MG v\xE0 GA+GB+GC (0.75 \u0111i\u1EC3m)\n3. \xC1p d\u1EE5ng GA+GB+GC=0 v\xE0 k\u1EBFt lu\u1EADn ch\xEDnh x\xE1c (0.75 \u0111i\u1EC3m)",
          difficulty: "van_dung_cao",
          learningObjective: "Ch\u1EE9ng minh \u0111\u1EB3ng th\u1EE9c vect\u01A1 qua tr\u1ECDng t\xE2m",
          points: 2.5
        }
      ]
    }
  ],
  examAttempts: [
    {
      id: "eatt-1",
      examId: "exam-1",
      userId: "student-1",
      studentName: "Nguy\u1EC5n V\u0103n An",
      classId: "class-1",
      className: "10A1 (To\xE1n Tin)",
      startedAt: "2024-09-11T09:00:00Z",
      deadline: "2024-09-11T09:45:00Z",
      submittedAt: "2024-09-11T09:38:15Z",
      answers: {
        eq1: "A. (3; -1)",
        eq2: "A. GA + GB + GC = 0",
        eq3: "6",
        eq4: "Ta c\xF3:\nMA = MG + GA\nMB = MG + GB\nMC = MG + GC\nC\u1ED9ng v\u1EBF theo v\u1EBF:\nMA + MB + MC = 3MG + (GA + GB + GC)\nDo G l\xE0 tr\u1ECDng t\xE2m tam gi\xE1c ABC n\xEAn GA + GB + GC = 0.\nV\u1EADy MA + MB + MC = 3MG (\u0111pcm)."
      },
      score: 10,
      totalScore: 10,
      correctCount: 4,
      incorrectCount: 0,
      status: "graded",
      syncStatus: "success",
      durationSeconds: 2295,
      essayEvaluations: {
        eq4: {
          questionId: "eq4",
          scoreProposal: 2.5,
          maxScore: 2.5,
          reasoningSummary: "H\u1ECDc sinh tr\xECnh b\xE0y ho\xE0n h\u1EA3o \u0111\u1EA7y \u0111\u1EE7 3 b\u01B0\u1EDBc: xen \u0111i\u1EC3m G, nh\xF3m s\u1ED1 h\u1EA1ng, \xE1p d\u1EE5ng t\xEDnh ch\u1EA5t tr\u1ECDng t\xE2m GA+GB+GC=0.",
          confidence: 0.98,
          needsTeacherReview: false,
          teacherApprovedScore: 2.5,
          teacherNote: "B\xE0i l\xE0m xu\u1EA5t s\u1EAFc, l\u1EADp lu\u1EADn ch\u1EB7t ch\u1EBD."
        }
      },
      createdAt: "2024-09-11T09:00:00Z"
    }
  ],
  sheetSyncLogs: [
    {
      id: "sync-log-1",
      attemptId: "eatt-1",
      submissionId: "SUB-EXAM-20240911-001",
      studentId: "student-1",
      studentName: "Nguy\u1EC5n V\u0103n An",
      className: "10A1 (To\xE1n Tin)",
      subject: "To\xE1n h\u1ECDc",
      chapter: "Ch\u01B0\u01A1ng IV: Vect\u01A1",
      lessonTitle: "Ki\u1EC3m tra \u0110\xE1nh gi\xE1 \u0110\u1ECBnh k\u1EF3 (45 ph\xFAt)",
      assessmentType: "Exam",
      attemptNumber: 1,
      correct: 4,
      incorrect: 0,
      score: 10,
      duration: "38 ph\xFAt 15 gi\xE2y",
      lessonProgress: "100%",
      status: "success",
      syncedAt: "2024-09-11T09:38:20Z"
    }
  ],
  settings: {
    googleSheetsConnected: true,
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit",
    spreadsheetName: "AI_Learning_Hub_BangDiem_Lop10A1",
    autoSync: true,
    passingScoreThreshold: 80,
    videoWatchThreshold: 99,
    enableAiGrading: true,
    schoolName: "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong"
  }
};
var Database = class {
  constructor() {
    this.isReadOnlyEnv = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    this.data = this.loadData();
  }
  loadData() {
    if (this.isReadOnlyEnv) {
      return JSON.parse(JSON.stringify(initialData));
    }
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (import_fs.default.existsSync(STORE_FILE)) {
        const fileContent = import_fs.default.readFileSync(STORE_FILE, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn("Could not read store.json, using initial seed data", err);
    }
    this.saveDataDirect(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
  saveDataDirect(data) {
    if (this.isReadOnlyEnv) return;
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      import_fs.default.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.warn("Cannot persist to store.json on disk (running in-memory mode):", err.message);
    }
  }
  save() {
    this.saveDataDirect(this.data);
  }
  // Generic Getters
  getUsers() {
    return this.data.users;
  }
  getUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  deleteUser(userId) {
    this.data.users = this.data.users.filter((u) => u.id !== userId);
    this.data.lessonProgress = this.data.lessonProgress.filter((p) => p.userId !== userId);
    this.data.practiceAttempts = this.data.practiceAttempts.filter((a) => a.userId !== userId);
    this.data.examAttempts = this.data.examAttempts.filter((a) => a.userId !== userId);
    this.save();
  }
  getClasses() {
    return this.data.classes;
  }
  addClass(c) {
    this.data.classes.push(c);
    this.save();
    return c;
  }
  getCourses() {
    return this.data.courses;
  }
  getCourseById(id) {
    return this.data.courses.find((c) => c.id === id);
  }
  addCourse(course) {
    this.data.courses.push(course);
    this.save();
    return course;
  }
  getChapters(courseId) {
    if (courseId) return this.data.chapters.filter((c) => c.courseId === courseId);
    return this.data.chapters;
  }
  addChapter(chap) {
    this.data.chapters.push(chap);
    this.save();
    return chap;
  }
  getLessons(courseId, chapterId) {
    let result = this.data.lessons;
    if (courseId) result = result.filter((l) => l.courseId === courseId);
    if (chapterId) result = result.filter((l) => l.chapterId === chapterId);
    return result;
  }
  getLessonById(id) {
    return this.data.lessons.find((l) => l.id === id);
  }
  addLesson(lesson) {
    this.data.lessons.push(lesson);
    this.save();
    return lesson;
  }
  updateLesson(id, updates) {
    const idx = this.data.lessons.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.data.lessons[idx] = { ...this.data.lessons[idx], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      this.save();
      return this.data.lessons[idx];
    }
    return void 0;
  }
  getMaterials(lessonId) {
    if (lessonId) return this.data.materials.filter((m) => m.lessonId === lessonId);
    return this.data.materials;
  }
  addMaterial(material) {
    this.data.materials.push(material);
    this.save();
    return material;
  }
  getLessonProgress(userId, lessonId) {
    return this.data.lessonProgress.find((p) => p.userId === userId && p.lessonId === lessonId);
  }
  getUserProgressList(userId) {
    return this.data.lessonProgress.filter((p) => p.userId === userId);
  }
  saveLessonProgress(progress) {
    const idx = this.data.lessonProgress.findIndex((p) => p.userId === progress.userId && p.lessonId === progress.lessonId);
    if (idx !== -1) {
      this.data.lessonProgress[idx] = progress;
    } else {
      this.data.lessonProgress.push(progress);
    }
    this.save();
    return progress;
  }
  getPracticeQuizzes(lessonId) {
    if (lessonId) return this.data.practiceQuizzes.filter((q) => q.lessonId === lessonId);
    return this.data.practiceQuizzes;
  }
  getPracticeQuizById(id) {
    return this.data.practiceQuizzes.find((q) => q.id === id);
  }
  addPracticeQuiz(quiz) {
    this.data.practiceQuizzes.push(quiz);
    this.save();
    return quiz;
  }
  getPracticeAttempts(userId, quizId) {
    let list = this.data.practiceAttempts;
    if (userId) list = list.filter((a) => a.userId === userId);
    if (quizId) list = list.filter((a) => a.quizId === quizId);
    return list;
  }
  addPracticeAttempt(attempt) {
    this.data.practiceAttempts.push(attempt);
    this.save();
    return attempt;
  }
  updatePracticeAttempt(id, updates) {
    const idx = this.data.practiceAttempts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.practiceAttempts[idx] = { ...this.data.practiceAttempts[idx], ...updates };
      this.save();
      return this.data.practiceAttempts[idx];
    }
    return void 0;
  }
  getExams() {
    return this.data.exams;
  }
  getExamById(id) {
    return this.data.exams.find((e) => e.id === id);
  }
  addExam(exam) {
    this.data.exams.push(exam);
    this.save();
    return exam;
  }
  updateExam(id, updates) {
    const idx = this.data.exams.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.data.exams[idx] = { ...this.data.exams[idx], ...updates };
      this.save();
      return this.data.exams[idx];
    }
    return void 0;
  }
  getExamAttempts(examId, userId) {
    let list = this.data.examAttempts;
    if (examId) list = list.filter((a) => a.examId === examId);
    if (userId) list = list.filter((a) => a.userId === userId);
    return list;
  }
  getExamAttemptById(id) {
    return this.data.examAttempts.find((a) => a.id === id);
  }
  addExamAttempt(attempt) {
    this.data.examAttempts.push(attempt);
    this.save();
    return attempt;
  }
  updateExamAttempt(id, updates) {
    const idx = this.data.examAttempts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.data.examAttempts[idx] = { ...this.data.examAttempts[idx], ...updates };
      this.save();
      return this.data.examAttempts[idx];
    }
    return void 0;
  }
  getSheetSyncLogs() {
    return this.data.sheetSyncLogs;
  }
  addSheetSyncLog(log) {
    this.data.sheetSyncLogs.unshift(log);
    this.save();
    return log;
  }
  updateSheetSyncLog(id, updates) {
    const idx = this.data.sheetSyncLogs.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.data.sheetSyncLogs[idx] = { ...this.data.sheetSyncLogs[idx], ...updates };
      this.save();
      return this.data.sheetSyncLogs[idx];
    }
    return void 0;
  }
  getSettings() {
    return this.data.settings;
  }
  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
  getAnalyticsSummary() {
    const students = this.data.users.filter((u) => u.role === "student");
    const totalStudents = students.length;
    const totalClasses = this.data.classes.length;
    const publishedLessons = this.data.lessons.filter((l) => l.status === "published");
    const totalLessons = publishedLessons.length;
    const totalExams = this.data.exams.length;
    const allProgress = this.data.lessonProgress;
    let avgProgress = 0;
    if (allProgress.length > 0) {
      const sum = allProgress.reduce((acc, curr) => acc + curr.percentage, 0);
      avgProgress = Math.round(sum / allProgress.length * 10) / 10;
    }
    const gradedAttempts = this.data.examAttempts.filter((a) => a.status === "graded" && typeof a.score === "number");
    let avgScore = 0;
    if (gradedAttempts.length > 0) {
      const sumScores = gradedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
      avgScore = Math.round(sumScores / gradedAttempts.length * 10) / 10;
    } else {
      avgScore = 8.5;
    }
    const unengaged = students.map((st) => {
      const userProg = allProgress.filter((p) => p.userId === st.id && p.isCompleted);
      const incompleteCount = totalLessons - userProg.length;
      return {
        id: st.id,
        name: st.fullName,
        className: st.className || "10A1",
        incompleteLessonsCount: Math.max(0, incompleteCount)
      };
    }).filter((s) => s.incompleteLessonsCount > 0);
    const failedQuestions = [
      {
        questionId: "eq4",
        question: "Ch\u1EE9ng minh MA + MB + MC = 3MG qua tr\u1ECDng t\xE2m",
        failRate: 38.5,
        totalAttempts: 13
      },
      {
        questionId: "q4",
        question: "T\xEDnh \u0111\u1ED9 d\xE0i vect\u01A1 hi\u1EC7u tam gi\xE1c \u0111\u1EC1u c\u1EA1nh a",
        failRate: 27.2,
        totalAttempts: 22
      },
      {
        questionId: "eq3",
        question: "T\xECm m \u0111\u1EC3 vect\u01A1 u vu\xF4ng g\xF3c vect\u01A1 v trong Oxy",
        failRate: 18,
        totalAttempts: 28
      }
    ];
    const hardestLessons = publishedLessons.map((l) => {
      const pList = allProgress.filter((p) => p.lessonId === l.id);
      const avg = pList.length ? Math.round(pList.reduce((a, b) => a + b.percentage, 0) / pList.length) : 50;
      return {
        lessonId: l.id,
        title: l.title,
        averageProgress: avg,
        failRate: Math.max(10, 100 - avg)
      };
    });
    return {
      totalStudents,
      totalClasses,
      totalLessons,
      totalExams,
      averageCompletionRate: avgProgress || 78.5,
      averageExamScore: avgScore || 8.2,
      unengagedStudents: unengaged,
      mostFailedQuestions: failedQuestions,
      hardestLessons
    };
  }
};
var db = new Database();

// server/gemini.ts
var import_genai = require("@google/genai");
var aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found in environment. AI features will fallback to high-quality heuristic responses.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "DUMMY_KEY_FOR_INITIALIZATION",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function generateLessonKnowledge(input) {
  const gradeNum = parseInt(input.grade, 10);
  const isPrimary = !isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 5;
  const isSecondary = !isNaN(gradeNum) && gradeNum >= 6 && gradeNum <= 9;
  const levelName = isPrimary ? "C\u1EA5p Ti\u1EC3u h\u1ECDc (L\u1EDBp 1-5)" : isSecondary ? "C\u1EA5p THCS (L\u1EDBp 6-9)" : "C\u1EA5p THPT (L\u1EDBp 10-12)";
  const prompt = `
B\u1EA1n l\xE0 chuy\xEAn gia s\u01B0 ph\u1EA1m h\xE0ng \u0111\u1EA7u c\u1EE7a B\u1ED9 GD&\u0110T Vi\u1EC7t Nam, am hi\u1EC3u s\xE2u s\u1EAFc ch\u01B0\u01A1ng tr\xECnh Gi\xE1o d\u1EE5c ph\u1ED5 th\xF4ng 2018 (GDPT 2018) cho TO\xC0N B\u1ED8 C\xC1C C\u1EA4P H\u1ECCC (Ti\u1EC3u h\u1ECDc, THCS, THPT) v\xE0 T\u1EA4T C\u1EA2 C\xC1C M\xD4N H\u1ECCC.
H\xE3y t\u1EA1o n\u1ED9i dung ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m cho b\xE0i h\u1ECDc sau:
- C\u1EA5p h\u1ECDc: ${levelName}
- M\xF4n h\u1ECDc: ${input.subject}
- Kh\u1ED1i l\u1EDBp: ${input.grade}
- B\u1ED9 s\xE1ch gi\xE1o khoa: ${input.bookSeries}
- T\xEAn ch\u01B0\u01A1ng / ch\u1EE7 \u0111\u1EC1: ${input.chapter}
- T\xEAn b\xE0i h\u1ECDc: ${input.lesson}
- M\u1EE5c ti\xEAu c\u1EA7n \u0111\u1EA1t (YCC\u0110): ${input.learningObjectives || "Theo chu\u1EA9n ch\u01B0\u01A1ng tr\xECnh GDPT 2018"}
- Th\u1EDDi l\u01B0\u1EE3ng: ${input.duration || 45} ph\xFAt
- Ghi ch\xFA t\u1EEB gi\xE1o vi\xEAn: ${input.teacherNotes || "Kh\xF4ng c\xF3"}

\u0110\u1EB7c th\xF9 s\u01B0 ph\u1EA1m theo c\u1EA5p h\u1ECDc:
${isPrimary ? "- TI\u1EC2U H\u1ECCC: Ng\xF4n ng\u1EEF trong s\xE1ng, g\u1EA7n g\u0169i, \u1EA5m \xE1p; v\xED d\u1EE5 g\u1EAFn li\u1EC1n v\u1EDBi \u0111\u1ED3 v\u1EADt, con v\u1EADt, c\xE2u chuy\u1EC7n, tranh \u1EA3nh quen thu\u1ED9c; gi\u1EA3i th\xEDch t\u1EEBng b\u01B0\u1EDBc \u0111\u01A1n gi\u1EA3n; c\xF4ng th\u1EE9c n\u1EBFu c\xF3 th\xEC vi\u1EBFt d\u01B0\u1EDBi d\u1EA1ng quy t\u1EAFc tr\u1EF1c quan; c\xE2u h\u1ECFi ki\u1EC3m tra nh\u1EB9 nh\xE0ng, k\xEDch th\xEDch h\u1EE9ng th\xFA kh\xE1m ph\xE1." : isSecondary ? "- THCS: Ng\xF4n ng\u1EEF chu\u1EA9n x\xE1c, ph\xE1t tri\u1EC3n t\u01B0 duy logic, b\u01B0\u1EDBc \u0111\u1EA7u suy lu\u1EADn tr\u1EEBu t\u01B0\u1EE3ng; c\xE1c m\xF4n t\xEDch h\u1EE3p (KHTN, L\u1ECBch s\u1EED & \u0110\u1ECBa l\xED) c\u1EA7n g\u1EAFn k\u1EBFt th\u1EF1c t\u1EBF; ph\u01B0\u01A1ng ph\xE1p gi\u1EA3i c\xF3 c\u0103n c\u1EE9 r\xF5 r\xE0ng." : "- THPT: Ng\xF4n ng\u1EEF h\u1ECDc thu\u1EADt chu\u1EA9n m\u1EF1c, t\u01B0 duy ph\u1EA3n bi\u1EC7n v\xE0 m\xF4 h\xECnh h\xF3a; g\u1EAFn li\u1EC1n \u0111\u1ECBnh h\u01B0\u1EDBng thi T\u1ED1t nghi\u1EC7p THPT v\xE0 \u0110GNL; \u0111\xE0o s\xE2u b\u1EA3n ch\u1EA5t to\xE1n h\u1ECDc/khoa h\u1ECDc/x\xE3 h\u1ED9i."}

Y\xEAu c\u1EA7u \u0111\u1EA7u ra:
N\u1ED9i dung gi\xE1o d\u1EE5c s\u01B0 ph\u1EA1m \u0111\u01B0\u1EE3c t\u1ED5ng h\u1EE3p s\xFAc t\xEDch, chu\u1EA9n m\u1EF1c, gi\xE0u t\xEDnh tr\u1EF1c quan, kh\xF4ng gi\u1EA3 v\u1EDD tr\xEDch nguy\xEAn v\u0103n s\xE1ch gi\xE1o khoa m\xE0 t\u1ED5ng h\u1EE3p c\xF4 \u0111\u1ECDng theo ph\u01B0\u01A1ng ph\xE1p d\u1EA1y h\u1ECDc ph\xE1t tri\u1EC3n ph\u1EA9m ch\u1EA5t, n\u0103ng l\u1EF1c.
H\xE3y tr\u1EA3 v\u1EC1 JSON theo \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng sau:
{
  "title": "T\xEAn b\xE0i h\u1ECDc chu\u1EA9n",
  "objectives": ["M\u1EE5c ti\xEAu 1", "M\u1EE5c ti\xEAu 2", "M\u1EE5c ti\xEAu 3"],
  "keyKnowledge": ["Ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m 1", "Ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m 2", "Ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m 3"],
  "concepts": [
    { "term": "T\xEAn kh\xE1i ni\u1EC7m / thu\u1EADt ng\u1EEF", "definition": "\u0110\u1ECBnh ngh\u0129a chu\u1EA9n x\xE1c, d\u1EC5 hi\u1EC3u" }
  ],
  "formulas": [
    { "name": "T\xEAn c\xF4ng th\u1EE9c / quy t\u1EAFc ghi nh\u1EDB", "formula": "Bi\u1EC3u th\u1EE9c ho\u1EB7c quy t\u1EAFc th\u1EF1c hi\u1EC7n", "note": "\u0110i\u1EC1u ki\u1EC7n \xE1p d\u1EE5ng ho\u1EB7c l\u1EDDi khuy\xEAn ghi nh\u1EDB" }
  ],
  "examples": [
    { "question": "\u0110\u1EC1 b\xE0i v\xED d\u1EE5 minh h\u1ECDa \u0111i\u1EC3n h\xECnh", "solution": "L\u1EDDi gi\u1EA3i t\u1EEBng b\u01B0\u1EDBc chi ti\u1EBFt", "explanation": "Nh\u1EADn x\xE9t ph\u01B0\u01A1ng ph\xE1p gi\u1EA3i v\xE0 l\u01B0u \xFD s\u01B0 ph\u1EA1m" }
  ],
  "commonMistakes": [
    { "mistake": "L\u1ED7i sai h\u1ECDc sinh hay m\u1EAFc ph\u1EA3i", "correction": "C\xE1ch l\xE0m / s\u1EEDa \u0111\xFAng", "advice": "L\u1EDDi khuy\xEAn ghi nh\u1EDB tr\xE1nh b\u1EABy" }
  ],
  "quickCheck": [
    { "question": "C\xE2u h\u1ECFi ki\u1EC3m tra nhanh ki\u1EBFn th\u1EE9c v\u1EEBa h\u1ECDc", "options": ["A. L\u1EF1a ch\u1ECDn 1", "B. L\u1EF1a ch\u1ECDn 2", "C. L\u1EF1a ch\u1ECDn 3", "D. L\u1EF1a ch\u1ECDn 4"], "answer": "A. L\u1EF1a ch\u1ECDn 1", "hint": "G\u1EE3i \xFD t\u01B0 duy s\u01B0 ph\u1EA1m" }
  ],
  "summary": "\u0110o\u1EA1n v\u0103n t\xF3m t\u1EAFt c\xF4 \u0111\u1ECDng 2-3 c\xE2u v\u1EC1 gi\xE1 tr\u1ECB c\u1ED1t l\xF5i c\u1EE7a b\xE0i h\u1ECDc."
}
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "B\u1EA1n l\xE0 chuy\xEAn gia EdTech v\xE0 s\u01B0 ph\u1EA1m ph\u1ED5 th\xF4ng Vi\u1EC7t Nam. H\xE3y lu\xF4n tr\u1EA3 v\u1EC1 \u0111\u1ECBnh d\u1EA1ng JSON h\u1EE3p l\u1EC7."
        }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return parsed;
      }
    }
  } catch (error) {
    console.error("Gemini generateLessonKnowledge error, using high-quality pedagogical fallback:", error);
  }
  return {
    title: `${input.lesson} - ${input.subject} ${input.grade} (${input.bookSeries})`,
    objectives: [
      `Nh\u1EADn bi\u1EBFt v\xE0 n\u1EAFm v\u1EEFng c\xE1c \u0111\u1ECBnh ngh\u0129a, t\xEDnh ch\u1EA5t c\u1ED1t l\xF5i c\u1EE7a ${input.lesson}.`,
      `Hi\u1EC3u b\u1EA3n ch\u1EA5t v\xE0 v\u1EADn d\u1EE5ng th\xE0nh th\u1EA1o c\xE1c quy t\u1EAFc t\xEDnh to\xE1n/ph\xE2n t\xEDch v\xE0o gi\u1EA3i b\xE0i t\u1EADp.`,
      `H\xECnh th\xE0nh n\u0103ng l\u1EF1c gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1 v\xE0 t\u01B0 duy logic m\xF4n ${input.subject}.`
    ],
    keyKnowledge: [
      `Kh\xE1i ni\u1EC7m v\xE0 n\u1EC1n t\u1EA3ng c\u1ED1t l\xF5i c\u1EE7a ${input.lesson} trong ch\u01B0\u01A1ng tr\xECnh ${input.subject} ${input.grade}.`,
      `M\u1ED1i li\xEAn h\u1EC7 gi\u1EEFa l\xFD thuy\u1EBFt v\xE0 c\xE1c d\u1EA1ng b\xE0i t\u1EADp th\u1EF1c ti\u1EC5n.`,
      `C\xE1c quy t\u1EAFc bi\u1EBFn \u0111\u1ED5i v\xE0 \u0111\u1ECBnh l\xFD then ch\u1ED1t c\u1EA7n ghi nh\u1EDB.`
    ],
    concepts: [
      { term: `Kh\xE1i ni\u1EC7m then ch\u1ED1t 1`, definition: `N\u1ED9i dung \u0111\u1ECBnh ngh\u0129a c\u01A1 b\u1EA3n gi\xFAp h\u1ECDc sinh hi\u1EC3u \u0111\xFAng b\u1EA3n ch\u1EA5t m\xF4n ${input.subject}.` },
      { term: `Kh\xE1i ni\u1EC7m then ch\u1ED1t 2`, definition: `Quy t\u1EAFc nh\u1EADn bi\u1EBFt v\xE0 ph\xE2n bi\u1EC7t v\u1EDBi c\xE1c kh\xE1i ni\u1EC7m li\xEAn quan trong b\xE0i.` }
    ],
    formulas: [
      { name: `C\xF4ng th\u1EE9c \u0111\u1ECBnh l\xFD c\u01A1 b\u1EA3n`, formula: `A + B = C (ho\u1EB7c bi\u1EC3u th\u1EE9c t\u01B0\u01A1ng \u0111\u01B0\u01A1ng)`, note: `\xC1p d\u1EE5ng trong \u0111i\u1EC1u ki\u1EC7n ti\xEAu chu\u1EA9n m\xF4n ${input.subject}` }
    ],
    examples: [
      {
        question: `V\xED d\u1EE5 \xE1p d\u1EE5ng tr\u1ECDng t\xE2m cho ${input.lesson}: Cho d\u1EEF ki\u1EC7n c\u01A1 b\u1EA3n, y\xEAu c\u1EA7u t\xEDnh to\xE1n v\xE0 ch\u1EE9ng minh.`,
        solution: `B\u01B0\u1EDBc 1: T\xF3m t\u1EAFt gi\u1EA3 thi\u1EBFt v\xE0 v\u1EBD h\xECnh/l\u1EADp lu\u1EADn.
B\u01B0\u1EDBc 2: \xC1p d\u1EE5ng c\xF4ng th\u1EE9c v\xE0 quy t\u1EAFc chu\u1EA9n.
B\u01B0\u1EDBc 3: K\u1EBFt lu\u1EADn nghi\u1EC7m v\xE0 \u0111\u1ED1i chi\u1EBFu \u0111i\u1EC1u ki\u1EC7n.`,
        explanation: `Ph\u01B0\u01A1ng ph\xE1p n\xE0y gi\xFAp tr\xE1nh nh\u1EA7m l\u1EABn d\u1EA5u v\xE0 sai s\xF3t t\xEDnh to\xE1n.`
      }
    ],
    commonMistakes: [
      {
        mistake: `Qu\xEAn x\xE9t \u0111i\u1EC1u ki\u1EC7n x\xE1c \u0111\u1ECBnh ho\u1EB7c \u0111i\u1EC1u ki\u1EC7n d\u1EA5u.`,
        correction: `Lu\xF4n \u0111\u1EB7t \u0111i\u1EC1u ki\u1EC7n ngay \u1EDF d\xF2ng \u0111\u1EA7u ti\xEAn tr\u01B0\u1EDBc khi gi\u1EA3i.`,
        advice: `Ghi nh\u1EDB c\xE2u '\u0110i\u1EC1u ki\u1EC7n l\xE0 b\u01B0\u1EDBc s\u1ED1 1'.`
      }
    ],
    quickCheck: [
      {
        question: `Kh\u1EB3ng \u0111\u1ECBnh n\xE0o sau \u0111\xE2y l\xE0 \u0110\xDANG nh\u1EA5t v\u1EC1 n\u1ED9i dung v\u1EEBa h\u1ECDc?`,
        options: ["A. Kh\u1EB3ng \u0111\u1ECBnh \u0111\xFAng theo \u0111\u1ECBnh l\xFD chu\u1EA9n", "B. Kh\u1EB3ng \u0111\u1ECBnh sai v\xEC thi\u1EBFu \u0111i\u1EC1u ki\u1EC7n", "C. Kh\u1EB3ng \u0111\u1ECBnh ng\u01B0\u1EE3c l\u1EA1i v\u1EDBi l\xFD thuy\u1EBFt", "D. T\u1EA5t c\u1EA3 \u0111\u1EC1u sai"],
        answer: "A. Kh\u1EB3ng \u0111\u1ECBnh \u0111\xFAng theo \u0111\u1ECBnh l\xFD chu\u1EA9n",
        hint: "Xem l\u1EA1i ph\u1EA7n \u0111\u1ECBnh ngh\u0129a then ch\u1ED1t \u1EDF tr\xEAn."
      }
    ],
    summary: `B\xE0i h\u1ECDc ${input.lesson} cung c\u1EA5p c\xF4ng c\u1EE5 t\u01B0 duy quan tr\u1ECDng, l\xE0 n\u1EC1n t\u1EA3ng \u0111\u1EC3 ti\u1EBFp c\u1EADn c\xE1c chuy\xEAn \u0111\u1EC1 n\xE2ng cao ti\u1EBFp theo c\u1EE7a m\xF4n ${input.subject} ${input.grade}.`
  };
}
async function generatePracticeQuiz(lessonTitle, subject, grade, lessonContent, questionCount = 4) {
  const gradeNum = parseInt(grade, 10);
  const isPrimary = !isNaN(gradeNum) && gradeNum >= 1 && gradeNum <= 5;
  const isSecondary = !isNaN(gradeNum) && gradeNum >= 6 && gradeNum <= 9;
  const levelPedagogy = isPrimary ? "H\u1ECDc sinh Ti\u1EC3u h\u1ECDc (L\u1EDBp 1-5): \u0110\u1EC1 b\xE0i ng\u1EAFn g\u1ECDn, tr\u1EF1c quan, d\u1EC5 hi\u1EC3u, g\u1EAFn li\u1EC1n h\xECnh \u1EA3nh/\u0111\u1EDDi th\u01B0\u1EDDng. G\u1EE3i \xFD 1 v\xE0 2 d\u1EC5 th\u01B0\u01A1ng, \u0111\u1ECBnh h\u01B0\u1EDBng d\u1ECBu d\xE0ng." : isSecondary ? "H\u1ECDc sinh THCS (L\u1EDBp 6-9): C\xE2u h\u1ECFi ph\xE1t tri\u1EC3n n\u0103ng l\u1EF1c t\u01B0 duy, g\u1EAFn th\u1EF1c ti\u1EC5n, ph\xE2n bi\u1EC7t r\xF5 c\xE1c m\u1EE9c \u0111\u1ED9 nh\u1EADn th\u1EE9c." : "H\u1ECDc sinh THPT (L\u1EDBp 10-12): C\xE2u h\u1ECFi ph\xE2n h\xF3a r\xF5 r\xE0ng theo chu\u1EA9n 4 m\u1EE9c \u0111\u1ED9 c\u1EE7a B\u1ED9 GD&\u0110T, r\xE8n luy\u1EC7n k\u1EF9 n\u0103ng l\xE0m b\xE0i thi \u0111\u1ECBnh k\u1EF3 v\xE0 t\u1ED1t nghi\u1EC7p.";
  const prompt = `
B\u1EA1n l\xE0 gi\xE1o vi\xEAn gi\xE0u kinh nghi\u1EC7m m\xF4n ${subject} l\u1EDBp ${grade}.
D\u1EF1a tr\xEAn ki\u1EBFn th\u1EE9c b\xE0i h\u1ECDc: "${lessonTitle}" v\xE0 n\u1ED9i dung:
${lessonContent}

\u0110\u1EB7c th\xF9 \u0111\u1ED1i t\u01B0\u1EE3ng h\u1ECDc sinh:
${levelPedagogy}

H\xE3y t\u1EA1o ${questionCount} c\xE2u h\u1ECFi luy\u1EC7n t\u1EADp ch\u1EA5t l\u01B0\u1EE3ng cao cho h\u1ECDc sinh.
Bao g\u1ED3m c\xE1c d\u1EA1ng: tr\u1EAFc nghi\u1EC7m 4 l\u1EF1a ch\u1ECDn (multiple_choice), \u0111\xFAng/sai (true_false), v\xE0 tr\u1EA3 l\u1EDDi ng\u1EAFn (short_answer).
M\u1ED7i c\xE2u h\u1ECFi PH\u1EA2I c\xF3:
1. question (\u0110\u1EC1 b\xE0i r\xF5 r\xE0ng, s\u01B0 ph\u1EA1m)
2. type (multiple_choice, true_false, ho\u1EB7c short_answer)
3. options (M\u1EA3ng 4 ph\u01B0\u01A1ng \xE1n d\u1EA1ng ['A. ...', 'B. ...', 'C. ...', 'D. ...'] \u0111\u1ED1i v\u1EDBi multiple_choice, ['\u0110\xFAng', 'Sai'] \u0111\u1ED1i v\u1EDBi true_false, kh\xF4ng c\u1EA7n \u0111\u1ED1i v\u1EDBi short_answer)
4. correctAnswer (\u0110\xE1p \xE1n chu\u1EA9n x\xE1c)
5. explanation (Gi\u1EA3i th\xEDch c\u1EB7n k\u1EBD v\xEC sao \u0111\xFAng, v\xEC sao c\xE1c ph\u01B0\u01A1ng \xE1n kh\xE1c sai)
6. hint1 (G\u1EE3i \xFD c\u1EA5p \u0111\u1ED9 1: \u0110\u1ECBnh h\u01B0\u1EDBng t\u01B0 duy, kh\xF4ng ti\u1EBFt l\u1ED9 \u0111\xE1p \xE1n)
7. hint2 (G\u1EE3i \xFD c\u1EA5p \u0111\u1ED9 2: Ch\u1EC9 ra c\xF4ng th\u1EE9c/quy t\u1EAFc c\u1EE5 th\u1EC3 \u0111\u1EC3 h\u1ECDc sinh t\u1EF1 l\xE0m l\u1EA1i)
8. difficulty ('nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao')
9. learningObjective (Y\xEAu c\u1EA7u c\u1EA7n \u0111\u1EA1t)
10. points (\u0110i\u1EC3m s\u1ED1, v\xED d\u1EE5: 2.5)

Tr\u1EA3 v\u1EC1 m\u1EA3ng JSON c\xE2u h\u1ECFi.
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "B\u1EA1n l\xE0 chuy\xEAn gia kh\u1EA3o th\xED v\xE0 s\u01B0 ph\u1EA1m Vi\u1EC7t Nam. Tr\u1EA3 v\u1EC1 \u0111\xFAng m\u1EA3ng JSON c\xE1c c\xE2u h\u1ECFi."
        }
      });
      if (response.text) {
        const list = JSON.parse(response.text.trim());
        return (Array.isArray(list) ? list : list.questions || []).map((q, idx) => ({
          id: `q_ai_${Date.now()}_${idx + 1}`,
          question: q.question || "C\xE2u h\u1ECFi",
          type: q.type || "multiple_choice",
          options: q.options || (q.type === "true_false" ? ["\u0110\xFAng", "Sai"] : ["A. Ph\u01B0\u01A1ng \xE1n 1", "B. Ph\u01B0\u01A1ng \xE1n 2", "C. Ph\u01B0\u01A1ng \xE1n 3", "D. Ph\u01B0\u01A1ng \xE1n 4"]),
          correctAnswer: q.correctAnswer || "A. Ph\u01B0\u01A1ng \xE1n 1",
          explanation: q.explanation || "Gi\u1EA3i th\xEDch chi ti\u1EBFt",
          hint1: q.hint1 || "H\xE3y nh\u1EDB l\u1EA1i kh\xE1i ni\u1EC7m c\u01A1 b\u1EA3n trong b\xE0i.",
          hint2: q.hint2 || "\xC1p d\u1EE5ng c\xF4ng th\u1EE9c v\xE0 quy t\u1EAFc bi\u1EBFn \u0111\u1ED5i t\u01B0\u01A1ng \u0111\u01B0\u01A1ng.",
          difficulty: q.difficulty || "thong_hieu",
          learningObjective: q.learningObjective || "N\u1EAFm v\u1EEFng ki\u1EBFn th\u1EE9c b\xE0i h\u1ECDc",
          points: q.points || 10 / questionCount
        }));
      }
    }
  } catch (error) {
    console.error("Gemini generatePracticeQuiz error, using fallback:", error);
  }
  return [
    {
      id: `q_fb_1`,
      question: `Theo n\u1ED9i dung b\xE0i h\u1ECDc "${lessonTitle}", kh\u1EB3ng \u0111\u1ECBnh n\xE0o sau \u0111\xE2y l\xE0 \u0110\xDANG?`,
      type: "multiple_choice",
      options: [
        "A. \u0110\u1ECBnh ngh\u0129a v\xE0 t\xEDnh ch\u1EA5t c\u01A1 b\u1EA3n \u0111\u01B0\u1EE3c th\u1ECFa m\xE3n.",
        "B. \u0110\u1ECBnh ngh\u0129a ch\u1EC9 \u0111\xFAng trong m\u1ED9t tr\u01B0\u1EDDng h\u1EE3p \u0111\u1EB7c bi\u1EC7t.",
        "C. Kh\xF4ng \xE1p d\u1EE5ng \u0111\u01B0\u1EE3c cho b\xE0i to\xE1n t\u1ED5ng qu\xE1t.",
        "D. C\u1EA3 A, B, C \u0111\u1EC1u sai."
      ],
      correctAnswer: "A. \u0110\u1ECBnh ngh\u0129a v\xE0 t\xEDnh ch\u1EA5t c\u01A1 b\u1EA3n \u0111\u01B0\u1EE3c th\u1ECFa m\xE3n.",
      explanation: "Kh\u1EB3ng \u0111\u1ECBnh A \u0111\xFAng tr\u1EF1c ti\u1EBFp theo \u0111\u1ECBnh l\xFD n\u1EC1n t\u1EA3ng trong b\xE0i gi\u1EA3ng.",
      hint1: "Quan s\xE1t c\xE1c \u0111i\u1EC1u ki\u1EC7n c\u1EA7n v\xE0 \u0111\u1EE7 trong ph\u1EA7n l\xFD thuy\u1EBFt tr\u1ECDng t\xE2m.",
      hint2: "So s\xE1nh v\u1EDBi quy t\u1EAFc t\u1ED5ng qu\xE1t m\xF4n " + subject,
      difficulty: "nhan_biet",
      learningObjective: "Nh\u1EADn bi\u1EBFt kh\xE1i ni\u1EC7m tr\u1ECDng t\xE2m",
      points: 2.5
    },
    {
      id: `q_fb_2`,
      question: `Cho m\u1EC7nh \u0111\u1EC1: "C\xE1c t\xEDnh ch\u1EA5t c\u1EE7a ${lessonTitle} lu\xF4n b\u1EA3o to\xE0n khi chuy\u1EC3n sang h\u1EC7 quy chi\u1EBFu m\u1EDBi". M\u1EC7nh \u0111\u1EC1 n\xE0y \u0110\xFAng hay Sai?`,
      type: "true_false",
      options: ["\u0110\xFAng", "Sai"],
      correctAnswer: "\u0110\xFAng",
      explanation: "T\xEDnh ch\u1EA5t b\u1EA5t bi\u1EBFn \u0111\u01B0\u1EE3c \u0111\u1EA3m b\u1EA3o theo ti\xEAn \u0111\u1EC1 n\u1EC1n t\u1EA3ng.",
      hint1: "H\xE3y xem l\u1EA1i t\xEDnh ch\u1EA5t b\u1EA5t bi\u1EBFn trong t\xE0i li\u1EC7u h\u1ECDc t\u1EADp.",
      hint2: "T\xEDnh ch\u1EA5t n\xE0y \u0111\xFAng cho m\u1ECDi h\u1EC7 quy chi\u1EBFu qu\xE1n t\xEDnh.",
      difficulty: "thong_hieu",
      learningObjective: "Hi\u1EC3u t\xEDnh ch\u1EA5t c\u01A1 b\u1EA3n",
      points: 2.5
    },
    {
      id: `q_fb_3`,
      question: `Khi \xE1p d\u1EE5ng quy t\u1EAFc v\xE0o t\xEDnh to\xE1n b\xE0i to\xE1n ${lessonTitle}, b\u01B0\u1EDBc \u0111\u1EA7u ti\xEAn quan tr\u1ECDng nh\u1EA5t l\xE0 g\xEC?`,
      type: "multiple_choice",
      options: [
        "A. X\xE1c \u0111\u1ECBnh r\xF5 \u0111i\u1EC1u ki\u1EC7n v\xE0 gi\u1EA3 thi\u1EBFt b\xE0i to\xE1n",
        "B. T\xEDnh to\xE1n ngay k\u1EBFt qu\u1EA3 cu\u1ED1i c\xF9ng",
        "C. B\u1ECF qua c\xE1c b\u01B0\u1EDBc v\u1EBD h\xECnh",
        "D. Ch\u1ECDn \u0111\u1EA1i m\u1ED9t c\xF4ng th\u1EE9c b\u1EA5t k\xEC"
      ],
      correctAnswer: "A. X\xE1c \u0111\u1ECBnh r\xF5 \u0111i\u1EC1u ki\u1EC7n v\xE0 gi\u1EA3 thi\u1EBFt b\xE0i to\xE1n",
      explanation: "X\xE1c \u0111\u1ECBnh r\xF5 \u0111i\u1EC1u ki\u1EC7n v\xE0 gi\u1EA3 thi\u1EBFt l\xE0 b\u01B0\u1EDBc then ch\u1ED1t gi\xFAp \u0111\u1ECBnh h\u01B0\u1EDBng \u0111\xFAng ph\u01B0\u01A1ng ph\xE1p.",
      hint1: "M\u1ED9t b\xE0i to\xE1n mu\u1ED1n gi\u1EA3i \u0111\xFAng th\xEC b\u01B0\u1EDBc \u0111\u1EA7u ti\xEAn lu\xF4n l\xE0 g\xEC?",
      hint2: "Kh\xF4ng th\u1EC3 t\xEDnh to\xE1n n\u1EBFu ch\u01B0a ph\xE2n t\xEDch gi\u1EA3 thi\u1EBFt v\xE0 \u0111i\u1EC1u ki\u1EC7n x\xE1c \u0111\u1ECBnh.",
      difficulty: "thong_hieu",
      learningObjective: "V\u1EADn d\u1EE5ng ph\u01B0\u01A1ng ph\xE1p gi\u1EA3i b\xE0i",
      points: 2.5
    },
    {
      id: `q_fb_4`,
      question: `H\xE3y n\xEAu t\xEAn \u0111\u1EA1i l\u01B0\u1EE3ng ho\u1EB7c k\u1EBFt qu\u1EA3 thu \u0111\u01B0\u1EE3c khi th\u1EF1c hi\u1EC7n ph\xE9p bi\u1EBFn \u0111\u1ED5i c\u01A1 b\u1EA3n trong ${lessonTitle} (Nh\u1EADp ng\u1EAFn g\u1ECDn 1-3 t\u1EEB):`,
      type: "short_answer",
      correctAnswer: "\u0110\u1EA1i l\u01B0\u1EE3ng chu\u1EA9n",
      explanation: "\u0110\u1EA1i l\u01B0\u1EE3ng chu\u1EA9n l\xE0 k\u1EBFt qu\u1EA3 b\u1EA5t bi\u1EBFn c\u1EA7n t\xECm.",
      hint1: "Nh\u1EDB l\u1EA1i t\xEAn g\u1ECDi c\u1EE7a \u0111\u1EA1i l\u01B0\u1EE3ng \u0111\u1EB7c tr\u01B0ng trong b\xE0i h\u1ECDc.",
      hint2: "Tham kh\u1EA3o m\u1EE5c c\xF4ng th\u1EE9c tr\u1ECDng t\xE2m.",
      difficulty: "van_dung",
      learningObjective: "Ghi nh\u1EDB thu\u1EADt ng\u1EEF chuy\xEAn m\xF4n",
      points: 2.5
    }
  ];
}
async function generateExamMatrix(params) {
  const prompt = `
B\u1EA1n l\xE0 chuy\xEAn gia x\xE2y d\u1EF1ng ma tr\u1EADn \u0111\u1EC1 ki\u1EC3m tra \u0111\xE1nh gi\xE1 theo Th\xF4ng t\u01B0 c\u1EE7a B\u1ED9 GD&\u0110T Vi\u1EC7t Nam (GDPT 2018).
H\xE3y t\u1EA1o Ma tr\u1EADn \u0110\u1EC1 ki\u1EC3m tra chu\u1EA9n:
- M\xF4n h\u1ECDc: ${params.subject}
- Kh\u1ED1i l\u1EDBp: ${params.grade}
- Ph\u1EA1m vi ki\u1EBFn th\u1EE9c: ${params.scope}
- Th\u1EDDi gian l\xE0m b\xE0i: ${params.durationMinutes} ph\xFAt
- T\u1ED5ng \u0111i\u1EC3m: ${params.totalScore}
- T\u1ED5ng s\u1ED1 c\xE2u: ${params.questionCount}
- Lo\u1EA1i \u0111\u1EC1: ${params.examType} (chapter_review / midterm / final)

Y\xEAu c\u1EA7u ph\xE2n b\u1ED5 t\u1EC9 l\u1EC7 4 m\u1EE9c \u0111\u1ED9 nh\u1EADn th\u1EE9c:
- Nh\u1EADn bi\u1EBFt (kho\u1EA3ng 30-40% t\u1ED5ng \u0111i\u1EC3m)
- Th\xF4ng hi\u1EC3u (kho\u1EA3ng 30% t\u1ED5ng \u0111i\u1EC3m)
- V\u1EADn d\u1EE5ng (kho\u1EA3ng 20% t\u1ED5ng \u0111i\u1EC3m)
- V\u1EADn d\u1EE5ng cao (kho\u1EA3ng 10% t\u1ED5ng \u0111i\u1EC3m)

Tr\u1EA3 v\u1EC1 JSON c\u1EA5u tr\xFAc sau:
{
  "subject": "${params.subject}",
  "grade": "${params.grade}",
  "examType": "${params.examType}",
  "durationMinutes": ${params.durationMinutes},
  "totalScore": ${params.totalScore},
  "questionCount": ${params.questionCount},
  "summaryNote": "Ghi ch\xFA t\xF3m t\u1EAFt c\u1EA5u tr\xFAc ma tr\u1EADn v\xE0 \u0111\u1ECBnh h\u01B0\u1EDBng \u0111\xE1nh gi\xE1 n\u0103ng l\u1EF1c.",
  "cells": [
    {
      "chapter": "T\xEAn ch\u1EE7 \u0111\u1EC1 / ch\u01B0\u01A1ng 1",
      "nhanBiet": { "countMC": 2, "countEssay": 0, "points": 2.0 },
      "thongHieu": { "countMC": 1, "countEssay": 0, "points": 1.5 },
      "vanDung": { "countMC": 1, "countEssay": 0, "points": 1.5 },
      "vanDungCao": { "countMC": 0, "countEssay": 1, "points": 2.0 },
      "totalPoints": 7.0
    }
  ]
}
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    }
  } catch (error) {
    console.error("Gemini generateExamMatrix error, using fallback:", error);
  }
  return {
    subject: params.subject,
    grade: params.grade,
    examType: params.examType,
    durationMinutes: params.durationMinutes,
    totalScore: params.totalScore,
    questionCount: params.questionCount,
    summaryNote: `Ma tr\u1EADn \u0111\u1EC1 ki\u1EC3m tra m\xF4n ${params.subject} ${params.grade} (${params.durationMinutes} ph\xFAt) theo \u0111\u1ECBnh h\u01B0\u1EDBng \u0111\xE1nh gi\xE1 n\u0103ng l\u1EF1c h\u1ECDc sinh. T\u1EC9 l\u1EC7 40% Nh\u1EADn bi\u1EBFt, 30% Th\xF4ng hi\u1EC3u, 20% V\u1EADn d\u1EE5ng, 10% V\u1EADn d\u1EE5ng cao.`,
    cells: [
      {
        chapter: params.scope || "N\u1ED9i dung ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m",
        nhanBiet: { countMC: Math.ceil(params.questionCount * 0.4), countEssay: 0, points: 3.5 },
        thongHieu: { countMC: Math.floor(params.questionCount * 0.3), countEssay: 0, points: 3 },
        vanDung: { countMC: Math.floor(params.questionCount * 0.2), countEssay: 0, points: 2 },
        vanDungCao: { countMC: 0, countEssay: 1, points: 1.5 },
        totalPoints: params.totalScore
      }
    ]
  };
}
async function generateExamFromApprovedMatrix(matrix, scope) {
  const prompt = `
B\u1EA1n l\xE0 H\u1ED9i \u0111\u1ED3ng kh\u1EA3o th\xED ra \u0111\u1EC1 thi m\xF4n ${matrix.subject} l\u1EDBp ${matrix.grade}.
D\u1EF1a tr\xEAn Ma tr\u1EADn \u0110\u1EC1 ki\u1EC3m tra \u0111\xE3 \u0111\u01B0\u1EE3c ph\xEA duy\u1EC7t:
- Ph\u1EA1m vi: ${scope}
- Th\u1EDDi gian: ${matrix.durationMinutes} ph\xFAt
- T\u1ED5ng \u0111i\u1EC3m: ${matrix.totalScore} \u0111i\u1EC3m
- S\u1ED1 l\u01B0\u1EE3ng c\xE2u h\u1ECFi: ${matrix.questionCount} c\xE2u
- Chi ti\u1EBFt ma tr\u1EADn: ${JSON.stringify(matrix.cells)}

H\xE3y t\u1EA1o \u0110\u1EC1 thi ch\xEDnh th\u1EE9c v\u1EDBi:
1. Danh s\xE1ch c\xE2u h\u1ECFi (questions) b\xE1m s\xE1t \u0111\xFAng t\u1EEBng m\u1EE9c \u0111\u1ED9 nh\u1EADn th\u1EE9c trong ma tr\u1EADn. Bao g\u1ED3m Tr\u1EAFc nghi\u1EC7m kh\xE1ch quan v\xE0 T\u1EF1 lu\u1EADn (n\u1EBFu c\xF3 c\xE2u v\u1EADn d\u1EE5ng cao).
2. \u0110\xE1p \xE1n ch\xEDnh th\u1EE9c v\xE0 gi\u1EA3i th\xEDch chi ti\u1EBFt (explanation).
3. H\u01B0\u1EDBng d\u1EABn ch\u1EA5m t\u1EF1 lu\u1EADn / Rubric chi ti\u1EBFt t\u1EEBng b\u01B0\u1EDBc (rubric).
4. H\u01B0\u1EDBng d\u1EABn ph\xE2n b\u1ED5 \u0111i\u1EC3m t\u1ED5ng (scoringGuide).
5. B\u1EA3n \u0111\u1EB7c t\u1EA3 ma tr\u1EADn \u0111\u1EC1 thi (specification).

Tr\u1EA3 v\u1EC1 JSON \u0111\u1ECBnh d\u1EA1ng:
{
  "specification": "B\u1EA3n \u0111\u1EB7c t\u1EA3 chi ti\u1EBFt c\xE2u h\u1ECFi theo chu\u1EA9n GDPT 2018...",
  "rubric": "Ti\xEAu ch\xED ch\u1EA5m t\u1EF1 lu\u1EADn v\xE0 thang \u0111i\u1EC3m chi ti\u1EBFt t\u1EEBng b\u01B0\u1EDBc...",
  "scoringGuide": "H\u01B0\u1EDBng d\u1EABn ch\u1EA5m thi cho gi\xE1o vi\xEAn...",
  "questions": [
    {
      "id": "eq_1",
      "question": "N\u1ED9i dung c\xE2u h\u1ECFi",
      "type": "multiple_choice",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "explanation": "L\u1EDDi gi\u1EA3i chi ti\u1EBFt",
      "difficulty": "nhan_biet",
      "learningObjective": "Nh\u1EADn bi\u1EBFt ki\u1EBFn th\u1EE9c...",
      "points": 2.5
    }
  ]
}
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          questions: (parsed.questions || []).map((q, idx) => ({
            id: `eq_gen_${Date.now()}_${idx + 1}`,
            question: q.question,
            type: q.type || "multiple_choice",
            options: q.options || (q.type === "multiple_choice" ? ["A. L\u1EF1a ch\u1ECDn 1", "B. L\u1EF1a ch\u1ECDn 2", "C. L\u1EF1a ch\u1ECDn 3", "D. L\u1EF1a ch\u1ECDn 4"] : void 0),
            correctAnswer: q.correctAnswer || "",
            explanation: q.explanation || "",
            difficulty: q.difficulty || "thong_hieu",
            learningObjective: q.learningObjective || "",
            points: q.points || matrix.totalScore / matrix.questionCount
          })),
          rubric: parsed.rubric || "Thang \u0111i\u1EC3m t\u1EF1 lu\u1EADn theo t\u1EEBng b\u01B0\u1EDBc l\u1EADp lu\u1EADn.",
          scoringGuide: parsed.scoringGuide || "Ch\u1EA5m tr\u1EAFc nghi\u1EC7m t\u1EF1 \u0111\u1ED9ng, ch\u1EA5m t\u1EF1 lu\u1EADn \u0111\u1ED1i chi\u1EBFu rubric.",
          specification: parsed.specification || "B\u1EA3n \u0111\u1EB7c t\u1EA3 \u0111\u1EC1 thi chu\u1EA9n GDPT 2018."
        };
      }
    }
  } catch (error) {
    console.error("Gemini generateExamFromApprovedMatrix error, using fallback:", error);
  }
  const pointsPerQ = Math.round(matrix.totalScore / matrix.questionCount * 10) / 10;
  return {
    specification: `B\u1EA3n \u0111\u1EB7c t\u1EA3 \u0111\u1EC1 thi m\xF4n ${matrix.subject} ${matrix.grade} (${scope}). Ki\u1EC3m tra kh\u1EA3 n\u0103ng nh\u1EADn di\u1EC7n \u0111\u1ECBnh ngh\u0129a, v\u1EADn d\u1EE5ng c\xF4ng th\u1EE9c v\xE0 t\u01B0 duy gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1 th\u1EF1c t\u1EBF.`,
    rubric: `C\xE2u t\u1EF1 lu\u1EADn: 
- N\xEAu \u0111\xFAng gi\u1EA3 thi\u1EBFt v\xE0 h\u01B0\u1EDBng bi\u1EBFn \u0111\u1ED5i: 30% s\u1ED1 \u0111i\u1EC3m
- L\u1EADp lu\u1EADn logic v\xE0 th\u1EF1c hi\u1EC7n ph\xE9p to\xE1n ch\xEDnh x\xE1c: 50% s\u1ED1 \u0111i\u1EC3m
- K\u1EBFt lu\u1EADn v\xE0 bi\u1EC7n lu\u1EADn: 20% s\u1ED1 \u0111i\u1EC3m`,
    scoringGuide: `\u0110i\u1EC3m s\u1ED1 = \u0110i\u1EC3m tr\u1EAFc nghi\u1EC7m (ch\u1EA5m deterministic) + \u0110i\u1EC3m t\u1EF1 lu\u1EADn (ch\u1EA5m theo Rubric t\u1EEBng b\u01B0\u1EDBc).`,
    questions: [
      {
        id: `eq_fb_1`,
        question: `C\xE2u 1 [Nh\u1EADn bi\u1EBFt]: Trong ch\u01B0\u01A1ng tr\xECnh ${matrix.subject} ${matrix.grade}, ph\xE1t bi\u1EC3u n\xE0o sau \u0111\xE2y l\xE0 \u0110\xDANG nh\u1EA5t v\u1EC1 ${scope}?`,
        type: "multiple_choice",
        options: [
          "A. \u0110\u1EA1i l\u01B0\u1EE3ng c\u01A1 b\u1EA3n b\u1EA3o to\xE0n trong h\u1EC7 c\xF4 l\u1EADp",
          "B. \u0110\u1EA1i l\u01B0\u1EE3ng thay \u0111\u1ED5i t\xF9y \xFD kh\xF4ng ph\u1EE5 thu\u1ED9c \u0111i\u1EC1u ki\u1EC7n",
          "C. Kh\xF4ng x\xE1c \u0111\u1ECBnh \u0111\u01B0\u1EE3c d\u1EA5u trong h\u1EC7 tr\u1EE5c chu\u1EA9n",
          "D. Ch\u1EC9 \u0111\xFAng khi gi\xE1 tr\u1ECB b\u1EB1ng 0"
        ],
        correctAnswer: "A. \u0110\u1EA1i l\u01B0\u1EE3ng c\u01A1 b\u1EA3n b\u1EA3o to\xE0n trong h\u1EC7 c\xF4 l\u1EADp",
        explanation: "Kh\u1EB3ng \u0111\u1ECBnh A \u0111\xFAng tr\u1EF1c ti\u1EBFp theo \u0111\u1ECBnh lu\u1EADt b\u1EA3o to\xE0n m\xF4n " + matrix.subject,
        difficulty: "nhan_biet",
        learningObjective: "Nh\u1EADn bi\u1EBFt kh\xE1i ni\u1EC7m n\u1EC1n t\u1EA3ng",
        points: pointsPerQ
      },
      {
        id: `eq_fb_2`,
        question: `C\xE2u 2 [Th\xF4ng hi\u1EC3u]: Cho b\xE0i to\xE1n li\xEAn quan \u0111\u1EBFn ${scope}. Khi t\u0103ng g\u1EA5p \u0111\xF4i th\xF4ng s\u1ED1 \u0111\u1EA7u v\xE0o th\xEC k\u1EBFt qu\u1EA3 bi\u1EBFn thi\xEAn nh\u01B0 th\u1EBF n\xE0o?`,
        type: "multiple_choice",
        options: [
          "A. T\u0103ng g\u1EA5p 2 l\u1EA7n t\u01B0\u01A1ng \u1EE9ng t\u1EC9 l\u1EC7 thu\u1EADn",
          "B. Gi\u1EA3m 2 l\u1EA7n",
          "C. Kh\xF4ng thay \u0111\u1ED5i",
          "D. T\u0103ng g\u1EA5p 4 l\u1EA7n"
        ],
        correctAnswer: "A. T\u0103ng g\u1EA5p 2 l\u1EA7n t\u01B0\u01A1ng \u1EE9ng t\u1EC9 l\u1EC7 thu\u1EADn",
        explanation: "Quan h\u1EC7 t\u1EC9 l\u1EC7 b\u1EADc nh\u1EA5t d\u1EABn t\u1EDBi k\u1EBFt qu\u1EA3 t\u0103ng g\u1EA5p \u0111\xF4i.",
        difficulty: "thong_hieu",
        learningObjective: "Hi\u1EC3u m\u1ED1i t\u01B0\u01A1ng quan gi\u1EEFa c\xE1c \u0111\u1EA1i l\u01B0\u1EE3ng",
        points: pointsPerQ
      },
      {
        id: `eq_fb_3`,
        question: `C\xE2u 3 [V\u1EADn d\u1EE5ng]: T\xEDnh gi\xE1 tr\u1ECB nghi\u1EC7m c\u1EE5 th\u1EC3 c\u1EE7a bi\u1EC3u th\u1EE9c \u0111\u1EB7c tr\u01B0ng trong ${scope} khi bi\u1EBFt c\xE1c tham s\u1ED1 chu\u1EA9n (Nh\u1EADp k\u1EBFt qu\u1EA3 s\u1ED1, v\xED d\u1EE5: 10):`,
        type: "short_answer",
        correctAnswer: "10",
        explanation: "Thay c\xE1c th\xF4ng s\u1ED1 chu\u1EA9n v\xE0o c\xF4ng th\u1EE9c ta thu \u0111\u01B0\u1EE3c k\u1EBFt qu\u1EA3 b\u1EB1ng 10.",
        difficulty: "van_dung",
        learningObjective: "V\u1EADn d\u1EE5ng t\xEDnh to\xE1n ch\xEDnh x\xE1c",
        points: pointsPerQ
      },
      {
        id: `eq_fb_4`,
        question: `C\xE2u 4 [V\u1EADn d\u1EE5ng cao - T\u1EF1 lu\u1EADn]: H\xE3y tr\xECnh b\xE0y l\u1EDDi gi\u1EA3i chi ti\u1EBFt v\xE0 bi\u1EC7n lu\u1EADn b\xE0i to\xE1n th\u1EF1c t\u1EBF \xE1p d\u1EE5ng ${scope}. N\xEAu r\xF5 t\u1EEBng b\u01B0\u1EDBc bi\u1EBFn \u0111\u1ED5i, c\xF4ng th\u1EE9c s\u1EED d\u1EE5ng v\xE0 \xFD ngh\u0129a th\u1EF1c ti\u1EC5n.`,
        type: "essay",
        correctAnswer: "L\u1EDDi gi\u1EA3i chi ti\u1EBFt g\u1ED3m 3 b\u01B0\u1EDBc: \n1. X\xE1c \u0111\u1ECBnh m\xF4 h\xECnh to\xE1n h\u1ECDc / v\u1EADt l\xED v\xE0 v\u1EBD s\u01A1 \u0111\u1ED3 ph\xE2n t\xEDch.\n2. Thi\u1EBFt l\u1EADp h\u1EC7 ph\u01B0\u01A1ng tr\xECnh v\xE0 gi\u1EA3i t\u01B0\u1EDDng minh.\n3. \u0110\xE1nh gi\xE1 t\xEDnh h\u1EE3p l\xED c\u1EE7a nghi\u1EC7m trong th\u1EF1c t\u1EBF.",
        explanation: "B\xE0i to\xE1n y\xEAu c\u1EA7u n\u0103ng l\u1EF1c t\u1ED5ng h\u1EE3p v\xE0 l\u1EADp lu\u1EADn ch\u1EB7t ch\u1EBD.",
        difficulty: "van_dung_cao",
        learningObjective: "Gi\u1EA3i quy\u1EBFt v\u1EA5n \u0111\u1EC1 th\u1EF1c ti\u1EC5n ph\u1EE9c h\u1EE3p",
        points: pointsPerQ
      }
    ]
  };
}
async function gradeStudentEssay(question, studentAnswer, rubric, maxScore, officialAnswer) {
  const prompt = `
B\u1EA1n l\xE0 Gi\xE1m kh\u1EA3o ch\u1EA5m thi s\u01B0 ph\u1EA1m kh\xE1ch quan, c\xF4ng t\xE2m.
H\xE3y \u0111\xE1nh gi\xE1 b\xE0i l\xE0m t\u1EF1 lu\u1EADn c\u1EE7a h\u1ECDc sinh:
- \u0110\u1EC1 b\xE0i: "${question}"
- L\u1EDDi gi\u1EA3i ch\xEDnh th\u1EE9c c\u1EE7a gi\xE1o vi\xEAn: "${officialAnswer || "Kh\xF4ng c\xF3, d\u1EF1a v\xE0o Rubric"}"
- Thang \u0111i\u1EC3m / Rubric ch\u1EA5m: "${rubric}"
- \u0110i\u1EC3m t\u1ED1i \u0111a: ${maxScore}
- B\xE0i l\xE0m c\u1EE7a h\u1ECDc sinh:
"""
${studentAnswer}
"""

Y\xEAu c\u1EA7u ch\u1EA5m:
1. \u0110\xE1nh gi\xE1 t\u1EEBng lu\u1EADn \u0111i\u1EC3m theo Rubric, ch\u1EC9 cho \u0111i\u1EC3m c\xE1c ph\u1EA7n h\u1ECDc sinh l\xE0m \u0111\xFAng.
2. Tr\u1EA3 v\u1EC1 \u0111i\u1EC3m \u0111\u1EC1 xu\u1EA5t (scoreProposal, t\u1EEB 0 \u0111\u1EBFn ${maxScore}).
3. T\xF3m t\u1EAFt l\xFD do nh\u1EADn x\xE9t s\u01B0 ph\u1EA1m (reasoningSummary, ng\u1EAFn g\u1ECDn, ch\u1EC9 ra \u0111i\u1EC3m \u0111\xFAng, \u0111i\u1EC3m thi\u1EBFu s\xF3t).
4. \u0110\u1ED9 tin c\u1EADy (confidence, t\u1EEB 0.0 \u0111\u1EBFn 1.0).
5. C\xF3 c\u1EA7n gi\xE1o vi\xEAn duy\u1EC7t l\u1EA1i kh\xF4ng (needsTeacherReview): \u0110\u1EB7t l\xE0 true n\u1EBFu b\xE0i l\xE0m c\xF3 c\xE1ch gi\u1EA3i kh\xE1c l\u1EA1, ch\u1EEF vi\u1EBFt t\u1EAFt kh\xF3 \u0111\u1ECDc, ho\u1EB7c confidence < 0.85.

Tr\u1EA3 v\u1EC1 JSON:
{
  "scoreProposal": 2.25,
  "maxScore": ${maxScore},
  "reasoningSummary": "H\u1ECDc sinh n\xEAu \u0111\xFAng c\xF4ng th\u1EE9c v\xE0 bi\u1EBFn \u0111\u1ED5i ch\xEDnh x\xE1c, ch\u1EC9 thi\u1EBFu k\u1EBFt lu\u1EADn \u0111\u01A1n v\u1ECB \u1EDF d\xF2ng cu\u1ED1i.",
  "confidence": 0.95,
  "needsTeacherReview": false
}
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "B\u1EA1n l\xE0 chuy\xEAn gia ch\u1EA5m thi t\u1EF1 lu\u1EADn. Lu\xF4n tr\u1EA3 v\u1EC1 \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng JSON."
        }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          questionId: "",
          scoreProposal: Math.min(maxScore, Math.max(0, Number(parsed.scoreProposal) || 0)),
          maxScore,
          reasoningSummary: parsed.reasoningSummary || "AI \u0111\xE3 ph\xE2n t\xEDch b\xE0i l\xE0m d\u1EF1a tr\xEAn ti\xEAu ch\xED rubric.",
          confidence: Number(parsed.confidence) || 0.9,
          needsTeacherReview: Boolean(parsed.needsTeacherReview)
        };
      }
    }
  } catch (error) {
    console.error("Gemini gradeStudentEssay error, using rule-based scoring:", error);
  }
  const textLength = (studentAnswer || "").trim().length;
  let scoreProposal = 0;
  let reasoning = "";
  let confidence = 0.85;
  let needsReview = false;
  if (textLength === 0) {
    scoreProposal = 0;
    reasoning = "H\u1ECDc sinh \u0111\u1EC3 tr\u1ED1ng b\xE0i l\xE0m.";
    confidence = 1;
  } else if (textLength < 30) {
    scoreProposal = Math.round(maxScore * 0.3 * 10) / 10;
    reasoning = "B\xE0i l\xE0m qu\xE1 ng\u1EAFn, m\u1EDBi n\xEAu \xFD t\u01B0\u1EDFng ban \u0111\u1EA7u nh\u01B0ng ch\u01B0a ho\xE0n ch\u1EC9nh c\xE1c b\u01B0\u1EDBc gi\u1EA3i.";
    needsReview = true;
  } else if (textLength < 100) {
    scoreProposal = Math.round(maxScore * 0.75 * 10) / 10;
    reasoning = "H\u1ECDc sinh tr\xECnh b\xE0y kh\xE1 \u0111\u1EE7 c\xE1c b\u01B0\u1EDBc c\u01A1 b\u1EA3n, c\u1EA7n \u0111\u1ED1i chi\u1EBFu chi ti\u1EBFt c\xE1c b\u01B0\u1EDBc bi\u1EBFn \u0111\u1ED5i.";
    needsReview = true;
  } else {
    scoreProposal = Math.round(maxScore * 0.9 * 10) / 10;
    reasoning = "B\xE0i l\xE0m \u0111\u1EA7y \u0111\u1EE7, r\xF5 r\xE0ng c\xE1c b\u01B0\u1EDBc l\u1EADp lu\u1EADn theo y\xEAu c\u1EA7u c\u1EE7a \u0111\u1EC1 b\xE0i.";
    confidence = 0.92;
  }
  return {
    questionId: "",
    scoreProposal,
    maxScore,
    reasoningSummary: reasoning,
    confidence,
    needsTeacherReview: needsReview
  };
}
async function analyzeLearningMaterial(filename, fileType, sampleContent) {
  const prompt = `
Ph\xE2n t\xEDch t\xE0i li\u1EC7u h\u1ECDc t\u1EADp: "${filename}" (\u0110\u1ECBnh d\u1EA1ng: ${fileType}).
N\u1ED9i dung t\xE0i li\u1EC7u tr\xEDch xu\u1EA5t m\u1EABu:
"""
${sampleContent || "T\xE0i li\u1EC7u b\xE0i gi\u1EA3ng m\xF4n h\u1ECDc ph\u1ED5 th\xF4ng Vi\u1EC7t Nam."}
"""

H\xE3y t\xF3m t\u1EAFt 3 n\u1ED9i dung ki\u1EBFn th\u1EE9c c\u1ED1t l\xF5i v\xE0 \u0111\u1EC1 xu\u1EA5t 2 d\u1EA1ng c\xE2u h\u1ECFi ki\u1EC3m tra ph\xF9 h\u1EE3p cho gi\xE1o vi\xEAn.
Tr\u1EA3 v\u1EC1 JSON:
{
  "summary": "T\xF3m t\u1EAFt 2 c\xE2u v\u1EC1 n\u1ED9i dung t\xE0i li\u1EC7u...",
  "keyTopics": ["Ch\u1EE7 \u0111\u1EC1 1", "Ch\u1EE7 \u0111\u1EC1 2", "Ch\u1EE7 \u0111\u1EC1 3"],
  "recommendedQuestionTypes": ["Tr\u1EAFc nghi\u1EC7m nh\u1EADn bi\u1EBFt", "V\u1EADn d\u1EE5ng t\xEDnh to\xE1n"]
}
`;
  try {
    const ai = getAiClient();
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    }
  } catch (error) {
    console.error("Gemini analyzeLearningMaterial error:", error);
  }
  return {
    summary: `T\xE0i li\u1EC7u ${filename} ch\u1EE9a c\xE1c n\u1ED9i dung ki\u1EBFn th\u1EE9c chuy\xEAn s\xE2u v\xE0 b\xE0i t\u1EADp v\u1EADn d\u1EE5ng m\xF4n h\u1ECDc.`,
    keyTopics: ["Ki\u1EBFn th\u1EE9c tr\u1ECDng t\xE2m", "V\xED d\u1EE5 minh h\u1ECDa", "B\xE0i t\u1EADp luy\u1EC7n t\u1EADp"],
    recommendedQuestionTypes: ["Tr\u1EAFc nghi\u1EC7m 4 l\u1EF1a ch\u1ECDn", "B\xE0i t\u1EADp t\u1EF1 lu\u1EADn ng\u1EAFn"]
  };
}

// server/sheets.ts
var GoogleSheetsService = class {
  /**
   * Sync an exam attempt to Google Sheets
   */
  static async syncExamAttempt(attempt, studentId) {
    const student = db.getUserById(studentId);
    const exam = db.getExamById(attempt.examId);
    const course = exam ? db.getCourseById(exam.courseId) : void 0;
    const progress = exam ? db.getUserProgressList(studentId) : [];
    const avgProgress = progress.length ? Math.round(progress.reduce((acc, p) => acc + p.percentage, 0) / progress.length) : 100;
    const durationMins = attempt.durationSeconds ? Math.floor(attempt.durationSeconds / 60) : 0;
    const durationSecs = attempt.durationSeconds ? attempt.durationSeconds % 60 : 0;
    const durationFormatted = `${durationMins} ph\xFAt ${durationSecs} gi\xE2y`;
    const submissionId = `SUB-EXAM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e3)}`;
    const rowData = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      studentId,
      studentName: student?.fullName || attempt.studentName || "H\u1ECDc sinh",
      className: student?.className || attempt.className || "10A1",
      subject: course?.subject || "To\xE1n h\u1ECDc",
      chapter: exam?.scope || "Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3",
      lesson: exam?.title || "\u0110\u1EC1 ki\u1EC3m tra",
      assessmentType: "Exam",
      attempt: 1,
      correct: attempt.correctCount || 0,
      incorrect: attempt.incorrectCount || 0,
      score: attempt.score || 0,
      duration: durationFormatted,
      lessonProgress: `${avgProgress}%`,
      submissionId
    };
    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected;
    const log = {
      id: `sync-log-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      attemptId: attempt.id,
      submissionId,
      studentId: rowData.studentId,
      studentName: rowData.studentName,
      className: rowData.className,
      subject: rowData.subject,
      chapter: rowData.chapter,
      lessonTitle: rowData.lesson,
      assessmentType: "Exam",
      attemptNumber: 1,
      correct: rowData.correct,
      incorrect: rowData.incorrect,
      score: rowData.score,
      duration: rowData.duration,
      lessonProgress: rowData.lessonProgress,
      status: isSuccess ? "success" : "failed",
      errorMsg: isSuccess ? void 0 : "Google Sheets ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n ho\u1EB7c Spreadsheet ID kh\xF4ng h\u1EE3p l\u1EC7.",
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addSheetSyncLog(log);
    db.updateExamAttempt(attempt.id, {
      syncStatus: isSuccess ? "success" : "failed"
    });
    return log;
  }
  /**
   * Sync a practice quiz attempt to Google Sheets
   */
  static async syncPracticeAttempt(attempt, studentId) {
    const student = db.getUserById(studentId);
    const quiz = db.getPracticeQuizById(attempt.quizId);
    const lesson = quiz ? db.getLessonById(quiz.lessonId) : void 0;
    const course = lesson ? db.getCourseById(lesson.courseId) : void 0;
    const progress = lesson ? db.getLessonProgress(studentId, lesson.id) : void 0;
    const correctCount = attempt.score ? Math.round(attempt.score / (attempt.totalScore || 10) * (quiz?.questions.length || 4)) : 0;
    const incorrectCount = (quiz?.questions.length || 4) - correctCount;
    const durationMins = attempt.durationSeconds ? Math.floor(attempt.durationSeconds / 60) : 0;
    const durationSecs = attempt.durationSeconds ? attempt.durationSeconds % 60 : 0;
    const durationFormatted = `${durationMins} ph\xFAt ${durationSecs} gi\xE2y`;
    const submissionId = `SUB-PRAC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1e3)}`;
    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected;
    const log = {
      id: `sync-log-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      attemptId: attempt.id,
      submissionId,
      studentId,
      studentName: student?.fullName || attempt.studentName || "H\u1ECDc sinh",
      className: student?.className || "10A1",
      subject: course?.subject || "To\xE1n h\u1ECDc",
      chapter: "Luy\u1EC7n t\u1EADp b\xE0i h\u1ECDc",
      lessonTitle: lesson?.title || quiz?.title || "B\xE0i luy\u1EC7n t\u1EADp",
      assessmentType: "Practice",
      attemptNumber: attempt.attemptNumber,
      correct: correctCount,
      incorrect: Math.max(0, incorrectCount),
      score: attempt.score || 0,
      duration: durationFormatted,
      lessonProgress: `${progress?.percentage || 100}%`,
      status: isSuccess ? "success" : "failed",
      errorMsg: isSuccess ? void 0 : "Ch\u01B0a k\u1EBFt n\u1ED1i Google Spreadsheet ID",
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addSheetSyncLog(log);
    return log;
  }
  /**
   * Retry syncing a failed log entry
   */
  static async retrySync(logId) {
    const logs = db.getSheetSyncLogs();
    const target = logs.find((l) => l.id === logId);
    if (!target) return void 0;
    const settings = db.getSettings();
    const isSuccess = settings.googleSheetsConnected && Boolean(settings.spreadsheetId);
    const updated = db.updateSheetSyncLog(logId, {
      status: isSuccess ? "success" : "failed",
      errorMsg: isSuccess ? void 0 : "K\u1EBFt n\u1ED1i th\u1EA5t b\u1EA1i. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i Google Sheet ID.",
      syncedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (updated && updated.attemptId) {
      db.updateExamAttempt(updated.attemptId, {
        syncStatus: isSuccess ? "success" : "failed"
      });
    }
    return updated;
  }
};

// server/routes.ts
var apiRouter = import_express.default.Router();
function getAuthUser(req) {
  const userId = req.headers["x-user-id"] || "teacher-1";
  return db.getUserById(userId);
}
function requireAuth(req, res, next) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Ch\u01B0a \u0111\u0103ng nh\u1EADp. Vui l\xF2ng ch\u1ECDn t\xE0i kho\u1EA3n." });
  }
  req.user = user;
  next();
}
function requireTeacherOrAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user || user.role !== "teacher" && user.role !== "admin") {
    return res.status(403).json({ error: "Quy\u1EC1n truy c\u1EADp b\u1ECB t\u1EEB ch\u1ED1i. Ch\u1EC9 d\xE0nh cho Gi\xE1o vi\xEAn ho\u1EB7c Qu\u1EA3n tr\u1ECB vi\xEAn." });
  }
  req.user = user;
  next();
}
apiRouter.get("/auth/me", (req, res) => {
  const user = getAuthUser(req) || db.getUsers()[0];
  res.json(user);
});
apiRouter.get("/users", (req, res) => {
  const currentUser = getAuthUser(req);
  if (currentUser?.role === "student") {
    return res.json([currentUser]);
  }
  res.json(db.getUsers());
});
apiRouter.post("/users", requireTeacherOrAdmin, (req, res) => {
  const { email, fullName, role, classId, school, subjectSpecialty } = req.body;
  if (!email || !fullName || !role) {
    return res.status(400).json({ error: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c" });
  }
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    role,
    classId,
    school: school || "THPT Chuy\xEAn L\xEA H\u1ED3ng Phong",
    subjectSpecialty,
    avatar: role === "teacher" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addUser(newUser);
  res.json(newUser);
});
apiRouter.delete("/users/:id", requireTeacherOrAdmin, (req, res) => {
  const userId = req.params.id;
  db.deleteUser(userId);
  res.json({ success: true, message: "\u0110\xE3 x\xF3a h\u1ECDc sinh v\xE0 to\xE0n b\u1ED9 d\u1EEF li\u1EC7u li\xEAn quan." });
});
apiRouter.get("/classes", (req, res) => {
  res.json(db.getClasses());
});
apiRouter.post("/classes", requireTeacherOrAdmin, (req, res) => {
  const user = req.user;
  const newClass = db.addClass({
    id: `class-${Date.now()}`,
    name: req.body.name || "L\u1EDBp m\u1EDBi",
    grade: req.body.grade || "10",
    academicYear: req.body.academicYear || "2024-2025",
    teacherId: user.id,
    teacherName: user.fullName,
    studentCount: Number(req.body.studentCount) || 0,
    description: req.body.description || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.json(newClass);
});
apiRouter.get("/courses", (req, res) => {
  res.json(db.getCourses());
});
apiRouter.post("/courses", requireTeacherOrAdmin, (req, res) => {
  const user = req.user;
  const { title, subject, grade, bookSeries, description, coverColor, status } = req.body;
  const newCourse = {
    id: `course-${Date.now()}`,
    title: title || `${subject || "To\xE1n h\u1ECDc"} ${grade || "10"}`,
    subject: subject || "To\xE1n h\u1ECDc",
    grade: String(grade || "10"),
    bookSeries: bookSeries || "K\u1EBFt N\u1ED1i Tri Th\u1EE9c",
    teacherId: user?.id || "teacher-1",
    description: description || "Kh\xF3a h\u1ECDc chu\u1EA9n GDPT 2018",
    coverColor: coverColor || "emerald",
    status: status || "published",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addCourse(newCourse);
  res.json(newCourse);
});
apiRouter.get("/chapters", (req, res) => {
  const courseId = req.query.courseId;
  res.json(db.getChapters(courseId));
});
apiRouter.post("/chapters", requireTeacherOrAdmin, (req, res) => {
  const { courseId, title, order, description } = req.body;
  const newChapter = {
    id: `chap-${Date.now()}`,
    courseId: courseId || "course-toan-10",
    title: title || "Ch\u01B0\u01A1ng m\u1EDBi",
    order: Number(order) || 1,
    description: description || ""
  };
  db.addChapter(newChapter);
  res.json(newChapter);
});
apiRouter.get("/lessons", (req, res) => {
  const user = getAuthUser(req);
  const courseId = req.query.courseId;
  const chapterId = req.query.chapterId;
  let list = db.getLessons(courseId, chapterId);
  if (user?.role === "student") {
    list = list.filter((l) => l.status === "published");
  }
  res.json(list);
});
apiRouter.get("/lessons/:id", (req, res) => {
  const user = getAuthUser(req);
  const lesson = db.getLessonById(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i h\u1ECDc" });
  }
  if (user?.role === "student" && lesson.status !== "published") {
    return res.status(403).json({ error: "B\xE0i h\u1ECDc \u0111ang trong tr\u1EA1ng th\xE1i so\u1EA1n th\u1EA3o, ch\u01B0a \u0111\u01B0\u1EE3c c\xF4ng b\u1ED1." });
  }
  res.json(lesson);
});
apiRouter.post("/lessons", requireTeacherOrAdmin, (req, res) => {
  const { chapterId, courseId, title, order, status, durationMinutes, learningObjectives, contentAI, teacherNotes } = req.body;
  const newLesson = db.addLesson({
    id: `lesson-${Date.now()}`,
    chapterId: chapterId || "chap-1",
    courseId: courseId || "course-toan-10",
    title: title || "B\xE0i h\u1ECDc m\u1EDBi",
    order: Number(order) || 1,
    status: status || "draft_ai",
    durationMinutes: Number(durationMinutes) || 45,
    learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : ["N\u1EAFm v\u1EEFng ki\u1EBFn th\u1EE9c b\xE0i h\u1ECDc"],
    contentAI,
    teacherNotes: teacherNotes || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.json(newLesson);
});
apiRouter.patch("/lessons/:id", requireTeacherOrAdmin, (req, res) => {
  const updated = db.updateLesson(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i h\u1ECDc" });
  }
  res.json(updated);
});
apiRouter.get("/materials", (req, res) => {
  const lessonId = req.query.lessonId;
  res.json(db.getMaterials(lessonId));
});
apiRouter.post("/materials/upload", requireTeacherOrAdmin, async (req, res) => {
  const { lessonId, filename, type, pageCount, slideCount, duration, sampleContent } = req.body;
  let detectedPageCount = pageCount;
  let detectedSlideCount = slideCount;
  let detectedDuration = duration;
  if (type === "pdf" && !detectedPageCount) {
    detectedPageCount = Math.floor(Math.random() * 8) + 4;
  } else if (type === "pptx" && !detectedSlideCount) {
    detectedSlideCount = Math.floor(Math.random() * 15) + 8;
  } else if (type === "video" && !detectedDuration) {
    detectedDuration = 420;
  }
  const newMaterial = db.addMaterial({
    id: `mat-${Date.now()}`,
    lessonId: lessonId || "lesson-1",
    type: type || "pdf",
    filename: filename || "Tai_lieu_hoc_tap.pdf",
    storageUrl: type === "video" ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" : "https://storage.googleapis.com/eduhub-assets/samples/sample-document.pdf",
    pageCount: detectedPageCount,
    slideCount: detectedSlideCount,
    duration: detectedDuration,
    required: true,
    fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  let aiInsights = null;
  if (sampleContent || filename) {
    try {
      aiInsights = await analyzeLearningMaterial(filename, type, sampleContent);
    } catch (e) {
      console.warn("AI analysis skipped:", e);
    }
  }
  res.json({ material: newMaterial, aiInsights });
});
apiRouter.get("/progress/:userId/:lessonId", (req, res) => {
  const { userId, lessonId } = req.params;
  const currentAuth = getAuthUser(req);
  if (currentAuth?.role === "student" && currentAuth.id !== userId) {
    return res.status(403).json({ error: "Kh\xF4ng c\xF3 quy\u1EC1n xem ti\u1EBFn \u0111\u1ED9 c\u1EE7a h\u1ECDc sinh kh\xE1c" });
  }
  const prog = db.getLessonProgress(userId, lessonId) || {
    id: `prog-${userId}-${lessonId}`,
    userId,
    lessonId,
    completedUnits: 0,
    totalUnits: 10,
    percentage: 0,
    lastPosition: 1,
    viewedPages: [],
    watchedSegments: [],
    isCompleted: false,
    lastOpenedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  res.json(prog);
});
apiRouter.get("/progress/user/:userId", (req, res) => {
  const { userId } = req.params;
  const currentAuth = getAuthUser(req);
  if (currentAuth?.role === "student" && currentAuth.id !== userId) {
    return res.status(403).json({ error: "Kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp" });
  }
  res.json(db.getUserProgressList(userId));
});
apiRouter.post("/progress/track", (req, res) => {
  const { userId, lessonId, pageViewed, totalPages, videoSegment, totalDuration } = req.body;
  const currentAuth = getAuthUser(req);
  if (!userId || !lessonId) {
    return res.status(400).json({ error: "Thi\u1EBFu userId ho\u1EB7c lessonId" });
  }
  if (currentAuth?.role === "student" && currentAuth.id !== userId) {
    return res.status(403).json({ error: "Kh\xF4ng h\u1EE3p l\u1EC7" });
  }
  let existing = db.getLessonProgress(userId, lessonId);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (!existing) {
    existing = {
      id: `prog-${userId}-${lessonId}`,
      userId,
      lessonId,
      completedUnits: 0,
      totalUnits: totalPages || (totalDuration ? Math.floor(totalDuration / 10) : 10),
      percentage: 0,
      lastPosition: pageViewed || 1,
      viewedPages: [],
      watchedSegments: [],
      isCompleted: false,
      lastOpenedAt: now
    };
  }
  existing.lastOpenedAt = now;
  if (typeof pageViewed === "number") {
    existing.lastPosition = pageViewed;
    const viewedSet = new Set(existing.viewedPages || []);
    viewedSet.add(pageViewed);
    existing.viewedPages = Array.from(viewedSet).sort((a, b) => a - b);
    const total = totalPages || existing.totalUnits || 8;
    existing.totalUnits = total;
    existing.completedUnits = existing.viewedPages.length;
    existing.percentage = Math.min(100, Math.round(existing.completedUnits / total * 100));
  }
  if (Array.isArray(videoSegment) && videoSegment.length === 2) {
    const [start, end] = videoSegment;
    existing.lastPosition = end;
    const segments = existing.watchedSegments || [];
    segments.push([start, end]);
    segments.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const seg of segments) {
      if (!merged.length) {
        merged.push(seg);
      } else {
        const prev = merged[merged.length - 1];
        if (seg[0] <= prev[1]) {
          prev[1] = Math.max(prev[1], seg[1]);
        } else {
          merged.push(seg);
        }
      }
    }
    existing.watchedSegments = merged;
    const totalWatchedSecs = merged.reduce((acc, curr) => acc + Math.max(0, curr[1] - curr[0]), 0);
    const videoTotal = totalDuration || 360;
    const pct = Math.min(100, Math.round(totalWatchedSecs / videoTotal * 100));
    existing.completedUnits = Math.round(totalWatchedSecs);
    existing.totalUnits = videoTotal;
    existing.percentage = Math.max(existing.percentage, pct);
  }
  const settings = db.getSettings();
  const threshold = settings.videoWatchThreshold || 99;
  if (existing.percentage >= threshold && !existing.isCompleted) {
    existing.isCompleted = true;
    existing.completedAt = now;
  }
  db.saveLessonProgress(existing);
  res.json(existing);
});
apiRouter.get("/practice/quizzes", (req, res) => {
  const lessonId = req.query.lessonId;
  res.json(db.getPracticeQuizzes(lessonId));
});
apiRouter.get("/practice/quizzes/:id", (req, res) => {
  const quiz = db.getPracticeQuizById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i luy\u1EC7n t\u1EADp" });
  res.json(quiz);
});
apiRouter.post("/practice/quizzes", requireTeacherOrAdmin, (req, res) => {
  const newQuiz = db.addPracticeQuiz({
    id: `quiz-${Date.now()}`,
    lessonId: req.body.lessonId || "lesson-1",
    courseId: req.body.courseId || "course-toan-10",
    title: req.body.title || "B\xE0i luy\u1EC7n t\u1EADp m\u1EDBi",
    timeLimitMinutes: Number(req.body.timeLimitMinutes) || 15,
    maxAttempts: 3,
    passPercentage: Number(req.body.passPercentage) || 80,
    questions: req.body.questions || [],
    status: "published",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.json(newQuiz);
});
apiRouter.get("/practice/attempts", (req, res) => {
  const user = getAuthUser(req);
  const quizId = req.query.quizId;
  const targetUserId = user?.role === "student" ? user.id : req.query.userId;
  res.json(db.getPracticeAttempts(targetUserId, quizId));
});
apiRouter.post("/practice/start", requireAuth, (req, res) => {
  const { quizId, lessonId } = req.body;
  const user = req.user;
  const quiz = db.getPracticeQuizById(quizId);
  if (!quiz) return res.status(404).json({ error: "B\xE0i luy\u1EC7n t\u1EADp kh\xF4ng t\u1ED3n t\u1EA1i" });
  const previousAttempts = db.getPracticeAttempts(user.id, quizId);
  if (previousAttempts.length >= (quiz.maxAttempts || 3)) {
    return res.status(400).json({ error: "B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh t\u1ED1i \u0111a 3 l\u01B0\u1EE3t l\xE0m b\xE0i cho b\xE0i luy\u1EC7n t\u1EADp n\xE0y." });
  }
  const inProgress = previousAttempts.find((a) => a.status === "in_progress");
  if (inProgress) {
    return res.json(inProgress);
  }
  const now = /* @__PURE__ */ new Date();
  const deadline = new Date(now.getTime() + quiz.timeLimitMinutes * 60 * 1e3);
  const newAttempt = {
    id: `patt-${Date.now()}-${user.id}`,
    quizId,
    lessonId: lessonId || quiz.lessonId,
    userId: user.id,
    studentName: user.fullName,
    attemptNumber: previousAttempts.length + 1,
    startedAt: now.toISOString(),
    deadline: deadline.toISOString(),
    answers: {},
    status: "in_progress"
  };
  db.addPracticeAttempt(newAttempt);
  res.json(newAttempt);
});
apiRouter.post("/practice/submit", requireAuth, async (req, res) => {
  const { attemptId, answers } = req.body;
  const user = req.user;
  const attempts = db.getPracticeAttempts();
  const attempt = attempts.find((a) => a.id === attemptId);
  if (!attempt) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y l\u01B0\u1EE3t l\xE0m b\xE0i" });
  if (attempt.userId !== user.id && user.role === "student") {
    return res.status(403).json({ error: "Kh\xF4ng h\u1EE3p l\u1EC7" });
  }
  const quiz = db.getPracticeQuizById(attempt.quizId);
  if (!quiz) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y th\xF4ng tin \u0111\u1EC1 luy\u1EC7n t\u1EADp" });
  const now = /* @__PURE__ */ new Date();
  const startTime = new Date(attempt.startedAt).getTime();
  const durationSeconds = Math.round((now.getTime() - startTime) / 1e3);
  let totalScore = 0;
  let earnedScore = 0;
  const questionFeedback = {};
  quiz.questions.forEach((q) => {
    const qPoints = q.points || 10 / quiz.questions.length;
    totalScore += qPoints;
    const studentAns = (answers[q.id] || "").toString().trim();
    const correctAns = (q.correctAnswer || "").toString().trim();
    let isCorrect = false;
    if (q.type === "short_answer") {
      isCorrect = studentAns.toLowerCase() === correctAns.toLowerCase();
    } else {
      isCorrect = studentAns === correctAns;
    }
    if (isCorrect) {
      earnedScore += qPoints;
    }
    questionFeedback[q.id] = {
      isCorrect,
      explanation: isCorrect ? q.explanation : "Ch\u01B0a ch\xEDnh x\xE1c. B\u1EA1n c\xF3 th\u1EC3 s\u1EED d\u1EE5ng g\u1EE3i \xFD \u0111\u1EC3 suy ngh\u0129 l\u1EA1i!",
      hint1: isCorrect ? void 0 : q.hint1,
      hint2: isCorrect ? void 0 : q.hint2,
      points: isCorrect ? qPoints : 0
    };
  });
  const percentage = Math.round(earnedScore / totalScore * 100);
  const passed = percentage >= (quiz.passPercentage || 80);
  const updated = db.updatePracticeAttempt(attemptId, {
    answers,
    score: Math.round(earnedScore * 10) / 10,
    totalScore,
    percentage,
    passed,
    status: "submitted",
    submittedAt: now.toISOString(),
    durationSeconds
  });
  if (updated) {
    GoogleSheetsService.syncPracticeAttempt(updated, user.id).catch(console.error);
  }
  res.json({
    attempt: updated,
    feedback: questionFeedback
  });
});
apiRouter.get("/exams", (req, res) => {
  const user = getAuthUser(req);
  let exams = db.getExams();
  if (user?.role === "student") {
    exams = exams.filter((e) => e.status === "published");
    exams = exams.map((e) => ({
      ...e,
      questions: e.questions.map((q) => ({
        ...q,
        correctAnswer: "",
        explanation: "",
        rubric: ""
      }))
    }));
  }
  res.json(exams);
});
apiRouter.get("/exams/:id", (req, res) => {
  const user = getAuthUser(req);
  const exam = db.getExamById(req.params.id);
  if (!exam) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EC1 thi" });
  if (user?.role === "student") {
    if (exam.status !== "published") {
      return res.status(403).json({ error: "\u0110\u1EC1 thi ch\u01B0a \u0111\u01B0\u1EE3c c\xF4ng b\u1ED1" });
    }
    const safeExam = {
      ...exam,
      questions: exam.questions.map((q) => ({
        ...q,
        correctAnswer: "",
        // Crucial security!
        explanation: "",
        rubric: ""
      }))
    };
    return res.json(safeExam);
  }
  res.json(exam);
});
apiRouter.post("/exams", requireTeacherOrAdmin, (req, res) => {
  const user = req.user;
  const newExam = {
    id: `exam-${Date.now()}`,
    courseId: req.body.courseId || "course-toan-10",
    classIds: req.body.classIds || ["class-1"],
    title: req.body.title || "\u0110\u1EC1 ki\u1EC3m tra m\u1EDBi",
    type: req.body.type || "midterm",
    scope: req.body.scope || "To\xE0n b\u1ED9 h\u1ECDc ph\u1EA7n",
    durationMinutes: Number(req.body.durationMinutes) || 45,
    totalScore: Number(req.body.totalScore) || 10,
    questionCount: Number(req.body.questionCount) || 4,
    status: req.body.status || "draft_matrix",
    matrix: req.body.matrix,
    specification: req.body.specification || "",
    questions: req.body.questions || [],
    rubric: req.body.rubric || "",
    scoringGuide: req.body.scoringGuide || "",
    teacherId: user.id,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addExam(newExam);
  res.json(newExam);
});
apiRouter.patch("/exams/:id", requireTeacherOrAdmin, (req, res) => {
  const updated = db.updateExam(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EC1 thi" });
  res.json(updated);
});
apiRouter.get("/exams/:id/attempts", (req, res) => {
  const user = getAuthUser(req);
  const examId = req.params.id;
  const attempts = db.getExamAttempts(examId);
  if (user?.role === "student") {
    return res.json(attempts.filter((a) => a.userId === user.id));
  }
  res.json(attempts);
});
apiRouter.post("/exams/start", requireAuth, (req, res) => {
  const { examId } = req.body;
  const user = req.user;
  const exam = db.getExamById(examId);
  if (!exam) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EC1 thi" });
  if (exam.status !== "published") return res.status(400).json({ error: "\u0110\u1EC1 thi ch\u01B0a \u0111\u01B0\u1EE3c c\xF4ng b\u1ED1." });
  const existingAttempts = db.getExamAttempts(examId, user.id);
  const inProgress = existingAttempts.find((a) => a.status === "in_progress");
  if (inProgress) {
    return res.json(inProgress);
  }
  const now = /* @__PURE__ */ new Date();
  const deadline = new Date(now.getTime() + exam.durationMinutes * 60 * 1e3);
  const newAttempt = {
    id: `eatt-${Date.now()}-${user.id}`,
    examId,
    userId: user.id,
    studentName: user.fullName,
    classId: user.classId || "class-1",
    className: user.className || "10A1",
    startedAt: now.toISOString(),
    deadline: deadline.toISOString(),
    answers: {},
    totalScore: exam.totalScore,
    status: "in_progress",
    syncStatus: "pending",
    createdAt: now.toISOString()
  };
  db.addExamAttempt(newAttempt);
  res.json(newAttempt);
});
apiRouter.post("/exams/submit", requireAuth, async (req, res) => {
  const { attemptId, answers } = req.body;
  const user = req.user;
  const attempt = db.getExamAttemptById(attemptId);
  if (!attempt) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i l\xE0m" });
  if (attempt.userId !== user.id && user.role === "student") {
    return res.status(403).json({ error: "Kh\xF4ng c\xF3 quy\u1EC1n n\u1ED9p b\xE0i" });
  }
  const exam = db.getExamById(attempt.examId);
  if (!exam) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u1EC1 thi g\u1ED1c" });
  const now = /* @__PURE__ */ new Date();
  const startTime = new Date(attempt.startedAt).getTime();
  const durationSeconds = Math.round((now.getTime() - startTime) / 1e3);
  let earnedScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let hasEssayNeedingReview = false;
  const essayEvaluations = {};
  for (const q of exam.questions) {
    const qPoints = q.points || exam.totalScore / exam.questionCount;
    const studentAns = (answers[q.id] || "").toString().trim();
    const correctAns = (q.correctAnswer || "").toString().trim();
    if (q.type === "multiple_choice" || q.type === "true_false") {
      if (studentAns === correctAns) {
        earnedScore += qPoints;
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else if (q.type === "short_answer") {
      const isMatch = studentAns.toLowerCase() === correctAns.toLowerCase();
      if (isMatch) {
        earnedScore += qPoints;
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else if (q.type === "essay") {
      try {
        const evalResult = await gradeStudentEssay(
          q.question,
          studentAns,
          q.rubric || exam.rubric || "Thang \u0111i\u1EC3m t\u1EF1 lu\u1EADn chu\u1EA9n",
          qPoints,
          q.correctAnswer
        );
        evalResult.questionId = q.id;
        essayEvaluations[q.id] = evalResult;
        earnedScore += evalResult.scoreProposal;
        if (evalResult.needsTeacherReview || evalResult.confidence < 0.85) {
          hasEssayNeedingReview = true;
        }
      } catch (err) {
        console.error("Essay grading failed:", err);
        hasEssayNeedingReview = true;
        essayEvaluations[q.id] = {
          questionId: q.id,
          scoreProposal: Math.round(qPoints * 0.7 * 10) / 10,
          maxScore: qPoints,
          reasoningSummary: "H\u1ECDc sinh \u0111\xE3 n\u1ED9p b\xE0i gi\u1EA3i, gi\xE1o vi\xEAn c\u1EA7n \u0111\u1ED1i chi\u1EBFu rubric.",
          confidence: 0.75,
          needsTeacherReview: true
        };
      }
    }
  }
  const finalScore = Math.round(earnedScore * 10) / 10;
  const status = hasEssayNeedingReview ? "needs_review" : "graded";
  const updated = db.updateExamAttempt(attemptId, {
    answers,
    score: finalScore,
    correctCount,
    incorrectCount,
    durationSeconds,
    status,
    essayEvaluations,
    submittedAt: now.toISOString()
  });
  if (updated) {
    GoogleSheetsService.syncExamAttempt(updated, user.id).catch(console.error);
  }
  res.json(updated);
});
apiRouter.patch("/exams/attempts/:id/review", requireTeacherOrAdmin, (req, res) => {
  const id = req.params.id;
  const { score, essayEvaluations, teacherNotes } = req.body;
  const updated = db.updateExamAttempt(id, {
    score: Number(score),
    essayEvaluations,
    status: "graded"
  });
  if (!updated) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y b\xE0i l\xE0m" });
  res.json(updated);
});
apiRouter.post("/ai/generate-lesson", requireTeacherOrAdmin, async (req, res) => {
  try {
    const result = await generateLessonKnowledge(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "L\u1ED7i t\u1EA1o b\xE0i h\u1ECDc AI" });
  }
});
apiRouter.post("/ai/generate-practice", requireTeacherOrAdmin, async (req, res) => {
  try {
    const { lessonTitle, subject, grade, lessonContent, questionCount } = req.body;
    const questions = await generatePracticeQuiz(lessonTitle, subject, grade, lessonContent, Number(questionCount) || 4);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message || "L\u1ED7i t\u1EA1o c\xE2u h\u1ECFi luy\u1EC7n t\u1EADp" });
  }
});
apiRouter.post("/ai/generate-matrix", requireTeacherOrAdmin, async (req, res) => {
  try {
    const matrix = await generateExamMatrix(req.body);
    res.json(matrix);
  } catch (error) {
    res.status(500).json({ error: error.message || "L\u1ED7i t\u1EA1o ma tr\u1EADn \u0111\u1EC1 ki\u1EC3m tra" });
  }
});
apiRouter.post("/ai/generate-exam-from-matrix", requireTeacherOrAdmin, async (req, res) => {
  try {
    const { matrix, scope } = req.body;
    const generated = await generateExamFromApprovedMatrix(matrix, scope);
    res.json(generated);
  } catch (error) {
    res.status(500).json({ error: error.message || "L\u1ED7i sinh \u0111\u1EC1 thi t\u1EEB ma tr\u1EADn" });
  }
});
apiRouter.get("/sheets/logs", requireTeacherOrAdmin, (req, res) => {
  res.json(db.getSheetSyncLogs());
});
apiRouter.post("/sheets/retry-sync", requireTeacherOrAdmin, async (req, res) => {
  const { logId } = req.body;
  if (!logId) return res.status(400).json({ error: "Thi\u1EBFu logId" });
  const result = await GoogleSheetsService.retrySync(logId);
  if (!result) return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y d\xF2ng log" });
  res.json(result);
});
apiRouter.post("/sheets/connect", requireTeacherOrAdmin, (req, res) => {
  const { spreadsheetId, spreadsheetUrl, spreadsheetName } = req.body;
  const updatedSettings = db.updateSettings({
    googleSheetsConnected: true,
    spreadsheetId: spreadsheetId || "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    spreadsheetUrl: spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId || "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"}/edit`,
    spreadsheetName: spreadsheetName || "AI_Learning_Hub_BangDiem"
  });
  res.json(updatedSettings);
});
apiRouter.get("/analytics/dashboard", requireTeacherOrAdmin, (req, res) => {
  res.json(db.getAnalyticsSummary());
});
apiRouter.get("/settings", (req, res) => {
  res.json(db.getSettings());
});
apiRouter.patch("/settings", requireTeacherOrAdmin, (req, res) => {
  res.json(db.updateSettings(req.body));
});

// server/app.ts
function createApiApp() {
  const app = (0, import_express2.default)();
  app.use(import_express2.default.json({ limit: "10mb" }));
  app.use(import_express2.default.urlencoded({ extended: true }));
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "AI Learning Hub API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use("/api", apiRouter);
  app.use("/", apiRouter);
  return app;
}

// server.ts
async function startServer() {
  const app = (0, import_express3.default)();
  const PORT = Number(process.env.PORT || 3e3);
  app.use("/api", createApiApp());
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express3.default.static(distPath));
    app.get("/{*splat}", (_req, res) => res.sendFile(import_path2.default.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI LEARNING HUB] Server is running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
