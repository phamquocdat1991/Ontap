export interface EducationLevel {
  id: 'primary' | 'secondary' | 'high';
  name: string;
  shortName: string;
  grades: string[];
  description: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  levels: ('primary' | 'secondary' | 'high')[];
  grades: string[];
  category: 'natural' | 'social' | 'languages' | 'technology' | 'arts' | 'skills';
  iconName?: string;
  description?: string;
}

export const EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 'primary',
    name: 'Cấp Tiểu Học',
    shortName: 'Tiểu học (Lớp 1 - 5)',
    grades: ['1', '2', '3', '4', '5'],
    description: 'Giáo dục nền tảng, phát triển ngôn ngữ, tư duy trực quan, kỹ năng tự phục vụ và phẩm chất cốt lõi.'
  },
  {
    id: 'secondary',
    name: 'Cấp THCS (Trung học cơ sở)',
    shortName: 'THCS (Lớp 6 - 9)',
    grades: ['6', '7', '8', '9'],
    description: 'Giáo dục cơ bản, phát triển tư duy logic, trừu tượng, phương pháp tích hợp khoa học và khoa học xã hội.'
  },
  {
    id: 'high',
    name: 'Cấp THPT (Trung học phổ thông)',
    shortName: 'THPT (Lớp 10 - 12)',
    grades: ['10', '11', '12'],
    description: 'Giáo dục định hướng nghề nghiệp, tư duy phản biện, giải quyết vấn đề chuyên sâu, chuẩn bị thi ĐGNL & Tốt nghiệp.'
  }
];

export const ALL_GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export function getLevelByGrade(grade: string): 'primary' | 'secondary' | 'high' {
  const g = parseInt(grade, 10);
  if (g >= 1 && g <= 5) return 'primary';
  if (g >= 6 && g <= 9) return 'secondary';
  return 'high';
}

export function getLevelNameByGrade(grade: string): string {
  const level = getLevelByGrade(grade);
  if (level === 'primary') return 'Tiểu học';
  if (level === 'secondary') return 'THCS';
  return 'THPT';
}

export const ALL_SUBJECTS: SubjectItem[] = [
  // 1. Core / Languages
  {
    id: 'toan',
    name: 'Toán học',
    levels: ['primary', 'secondary', 'high'],
    grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'natural',
    description: 'Hình thành tư duy logic, mô hình hóa toán học, giải quyết vấn đề thực tiễn.'
  },
  {
    id: 'tieng-viet',
    name: 'Tiếng Việt',
    levels: ['primary'],
    grades: ['1', '2', '3', '4', '5'],
    category: 'languages',
    description: 'Phát triển kỹ năng đọc, viết, nói, nghe và cảm thụ văn học thiếu nhi.'
  },
  {
    id: 'ngu-van',
    name: 'Ngữ văn',
    levels: ['secondary', 'high'],
    grades: ['6', '7', '8', '9', '10', '11', '12'],
    category: 'languages',
    description: 'Phát triển năng lực ngôn ngữ, đọc hiểu văn bản, nghị luận văn học và nghị luận xã hội.'
  },
  {
    id: 'tieng-anh',
    name: 'Tiếng Anh',
    levels: ['primary', 'secondary', 'high'],
    grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'languages',
    description: 'Ngoại ngữ giao tiếp chuẩn quốc tế theo khung 6 bậc năng lực ngoại ngữ Việt Nam.'
  },

  // 2. Natural Sciences
  {
    id: 'tn-xh',
    name: 'Tự nhiên và Xã hội',
    levels: ['primary'],
    grades: ['1', '2', '3'],
    category: 'natural',
    description: 'Khám phá con người, sức khỏe, gia đình, nhà trường và môi trường xung quanh.'
  },
  {
    id: 'khoa-hoc',
    name: 'Khoa học',
    levels: ['primary'],
    grades: ['4', '5'],
    category: 'natural',
    description: 'Tìm hiểu chất, năng lượng, thực vật, động vật, nấm, vi khuẩn, con người và sức khỏe.'
  },
  {
    id: 'khtn',
    name: 'Khoa học tự nhiên',
    levels: ['secondary'],
    grades: ['6', '7', '8', '9'],
    category: 'natural',
    description: 'Môn học tích hợp Vật lí, Hóa học và Sinh học cấp THCS theo chuẩn GDPT 2018.'
  },
  {
    id: 'vat-li',
    name: 'Vật lí',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'natural',
    description: 'Quy luật chuyển động, cơ học, nhiệt động lực học, điện từ học, sóng và vật lí hạt nhân.'
  },
  {
    id: 'hoa-hoc',
    name: 'Hóa học',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'natural',
    description: 'Cấu tạo chất, bảng tuần hoàn, phản ứng hóa học, hóa vô cơ và hóa hữu cơ thực tiễn.'
  },
  {
    id: 'sinh-hoc',
    name: 'Sinh học',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'natural',
    description: 'Sinh học tế bào, vi sinh vật, di truyền học, tiến hóa và sinh thái học môi trường.'
  },

  // 3. Social Sciences
  {
    id: 'su-dia-th',
    name: 'Lịch sử và Địa lí (Tiểu học)',
    levels: ['primary'],
    grades: ['4', '5'],
    category: 'social',
    description: 'Tìm hiểu địa phương, các vùng miền Việt Nam và các mốc son lịch sử hào hùng.'
  },
  {
    id: 'su-dia-thcs',
    name: 'Lịch sử và Địa lí (THCS)',
    levels: ['secondary'],
    grades: ['6', '7', '8', '9'],
    category: 'social',
    description: 'Lịch sử thế giới, lịch sử Việt Nam và Địa lí tự nhiên - dân cư - kinh tế.'
  },
  {
    id: 'lich-su',
    name: 'Lịch sử',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'social',
    description: 'Lịch sử văn minh nhân loại, lịch sử Việt Nam cận hiện đại và hội nhập quốc tế.'
  },
  {
    id: 'dia-li',
    name: 'Địa lí',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'social',
    description: 'Địa lí tự nhiên, địa lí kinh tế - xã hội thế giới và các vùng kinh tế Việt Nam.'
  },
  {
    id: 'gdcd',
    name: 'Giáo dục công dân',
    levels: ['secondary'],
    grades: ['6', '7', '8', '9'],
    category: 'social',
    description: 'Đạo đức, kỹ năng sống, quyền và nghĩa vụ công dân theo pháp luật.'
  },
  {
    id: 'gdkt-pl',
    name: 'Giáo dục kinh tế và pháp luật',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'social',
    description: 'Kinh tế thị trường, tài chính cá nhân, hệ thống chính trị và pháp luật Việt Nam.'
  },

  // 4. Technology & Skills
  {
    id: 'tin-hoc',
    name: 'Tin học',
    levels: ['primary', 'secondary', 'high'],
    grades: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'technology',
    description: 'Khoa học máy tính, lập trình Scratch/Python/C++, ứng dụng CNTT và an toàn số.'
  },
  {
    id: 'cong-nghe',
    name: 'Công nghệ',
    levels: ['primary', 'secondary', 'high'],
    grades: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'technology',
    description: 'Thiết kế kỹ thuật, trồng trọt, chăn nuôi, điện tử cơ bản và STEM thực hành.'
  },
  {
    id: 'dao-duc',
    name: 'Đạo đức',
    levels: ['primary'],
    grades: ['1', '2', '3', '4', '5'],
    category: 'skills',
    description: 'Hình thành chuẩn mực hành vi, lòng nhân ái, lễ phép và trách nhiệm bản thân.'
  },
  {
    id: 'gdqp-an',
    name: 'Giáo dục quốc phòng và an ninh',
    levels: ['high'],
    grades: ['10', '11', '12'],
    category: 'skills',
    description: 'Lòng yêu nước, ý thức bảo vệ chủ quyền biên giới, biển đảo và kỹ năng phòng thủ.'
  },
  {
    id: 'hdt-n',
    name: 'Hoạt động trải nghiệm / Hướng nghiệp',
    levels: ['primary', 'secondary', 'high'],
    grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'skills',
    description: 'Rèn luyện kỹ năng mềm, phát triển bản thân, định hướng nghề tương lai.'
  },
  {
    id: 'am-nhac',
    name: 'Âm nhạc',
    levels: ['primary', 'secondary', 'high'],
    grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'arts',
    description: 'Cảm thụ âm nhạc, học hát, nhạc cụ và thẩm mỹ nghệ thuật.'
  },
  {
    id: 'mi-thuat',
    name: 'Mĩ thuật',
    levels: ['primary', 'secondary', 'high'],
    grades: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    category: 'arts',
    description: 'Hội họa, điêu khắc, thiết kế đồ họa và tư duy sáng tạo thị giác.'
  }
];

export const BOOK_SERIES_OPTIONS = [
  'Kết Nối Tri Thức Với Cuộc Sống',
  'Cánh Diều',
  'Chân Trời Sáng Tạo',
  'Cùng Khám Phá',
  'Bộ SGK Chuẩn GDPT 2018'
];

export const BOOK_SERIES = BOOK_SERIES_OPTIONS;

/**
 * Filter subjects available for a given grade level or specific grade
 */
export function getSubjectsForGrade(grade: string): SubjectItem[] {
  return ALL_SUBJECTS.filter(s => s.grades.includes(grade));
}

export const getSubjectsByGrade = getSubjectsForGrade;

export function getSubjectsForLevel(level: 'primary' | 'secondary' | 'high' | 'all'): SubjectItem[] {
  if (level === 'all') return ALL_SUBJECTS;
  return ALL_SUBJECTS.filter(s => s.levels.includes(level));
}

/**
 * Pedagogical chapter & lesson templates by grade and subject
 */
export interface TopicSuggestion {
  subject: string;
  grade: string;
  chapter: string;
  lesson: string;
  objectives: string;
}

export const SAMPLE_TOPIC_PRESETS: TopicSuggestion[] = [
  // --- TIỂU HỌC ---
  {
    subject: 'Toán học',
    grade: '1',
    chapter: 'Chương 1: Các số từ 0 đến 10 và hình học trực quan',
    lesson: 'Phép cộng trong phạm vi 10',
    objectives: 'Học sinh hiểu ý nghĩa phép cộng là gộp lại, đếm thêm, thực hiện thành thạo bảng cộng trong phạm vi 10 bằng que tính và trực quan.'
  },
  {
    subject: 'Tiếng Việt',
    grade: '1',
    chapter: 'Chủ đề: Những bài học đầu tiên',
    lesson: 'Làm quen chữ cái và dấu thanh tiếng Việt',
    objectives: 'Nhận biết chính xác các âm vần, ghép vần cơ bản, phát âm chuẩn và tập viết nét thanh nét đậm.'
  },
  {
    subject: 'Toán học',
    grade: '3',
    chapter: 'Chương 2: Phép nhân và phép chia trong phạm vi 1000',
    lesson: 'Bảng nhân 7 và vận dụng giải toán có lời văn',
    objectives: 'Ghi nhớ bảng nhân 7, áp dụng tính nhẩm nhanh và giải các bài toán thực tế có phép nhân.'
  },
  {
    subject: 'Khoa học',
    grade: '4',
    chapter: 'Chủ đề: Vật chất và năng lượng',
    lesson: 'Nước có những tính chất gì? Vòng tuần hoàn của nước',
    objectives: 'Quan sát thí nghiệm nhận biết tính chất không màu, không mùi, không vị của nước; giải thích được hiện tượng bay hơi và ngưng tụ trong tự nhiên.'
  },
  {
    subject: 'Toán học',
    grade: '5',
    chapter: 'Chương 1: Phân số và Số thập phân',
    lesson: 'Cộng trừ số thập phân và ứng dụng đo đạc thực tế',
    objectives: 'Nắm vững quy tắc đặt tính thẳng cột dấu phẩy, tính toán chính xác và ứng dụng tính diện tích, khối lượng hàng ngày.'
  },

  // --- THCS ---
  {
    subject: 'Khoa học tự nhiên',
    grade: '6',
    chapter: 'Chương 1: Mở đầu về KHTN và các phép đo',
    lesson: 'Đo chiều dài, khối lượng và thời gian',
    objectives: 'Biết cách chọn dụng cụ đo có GHĐ và ĐCNN phù hợp, đọc và ghi kết quả đo đúng quy tắc, xác định sai số cơ bản.'
  },
  {
    subject: 'Toán học',
    grade: '7',
    chapter: 'Chương 3: Góc và đường thẳng song song',
    lesson: 'Dấu hiệu nhận biết hai đường thẳng song song và định lý',
    objectives: 'Chứng minh hai đường thẳng song song qua các cặp góc so le trong, đồng vị; vận dụng tiên đề Ơ-clit.'
  },
  {
    subject: 'Khoa học tự nhiên',
    grade: '8',
    chapter: 'Chủ đề Hóa học: Phản ứng hóa học và Định luật bảo toàn',
    lesson: 'Định luật bảo toàn khối lượng và phương trình hóa học',
    objectives: 'Phát biểu định luật bảo toàn khối lượng, lập phương trình hóa học bằng phương pháp đại số hoặc cân bằng chẵn lẻ.'
  },
  {
    subject: 'Ngữ văn',
    grade: '9',
    chapter: 'Chủ đề: Thơ hiện đại Việt Nam',
    lesson: 'Phân tích thi phẩm Đồng chí (Chính Hữu)',
    objectives: 'Cảm nhận vẻ đẹp chân thực, giản dị của người lính thời kỳ đầu kháng chiến chống Pháp và tình đồng chí keo sơn gắn bó.'
  },

  // --- THPT ---
  {
    subject: 'Toán học',
    grade: '10',
    chapter: 'Chương IV: Vectơ trong mặt phẳng tọa độ Oxy',
    lesson: 'Khái niệm vectơ và các phép toán cộng trừ vectơ',
    objectives: 'Học sinh hiểu được khái niệm đoạn thẳng có hướng, hai vectơ cùng phương cùng hướng, quy tắc ba điểm và hình bình hành.'
  },
  {
    subject: 'Vật lí',
    grade: '10',
    chapter: 'Chương II: Động học chất điểm',
    lesson: 'Chuyển động thẳng biến đổi đều và đồ thị vận tốc',
    objectives: 'Viết phương trình vận tốc và tọa độ, phân biệt chuyển động nhanh dần đều và chậm dần đều, tính quãng đường đi được.'
  },
  {
    subject: 'Hóa học',
    grade: '11',
    chapter: 'Chương 1: Cân bằng hóa học',
    lesson: 'Khái niệm về cân bằng hóa học và nguyên lí Le Chatelier',
    objectives: 'Giải thích trạng thái cân bằng động, dự đoán chiều dịch chuyển cân bằng khi thay đổi nhiệt độ, nồng độ, áp suất.'
  },
  {
    subject: 'Tiếng Anh',
    grade: '11',
    chapter: 'Unit 1: A Long and Healthy Life',
    lesson: 'Grammar: Past Simple vs. Present Perfect with health habits',
    objectives: 'Master the distinction between Past Simple and Present Perfect tenses; discuss lifestyle and healthy dietary habits.'
  },
  {
    subject: 'Vật lí',
    grade: '12',
    chapter: 'Chương 1: Vật lí nhiệt và Khí lí tưởng',
    lesson: 'Phương trình trạng thái của khí lí tưởng (Clapeyron - Mendeleev)',
    objectives: 'Vận dụng định luật Boyle, Charles và phương trình Clapeyron - Mendeleev giải bài toán biến đổi trạng thái của khối khí.'
  },
  {
    subject: 'Tin học',
    grade: '10',
    chapter: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính',
    lesson: 'Lập trình Python: Cấu trúc rẽ nhánh if - else và vòng lặp for',
    objectives: 'Cài đặt thuật toán tìm kiếm số nguyên tố, kiểm tra tính chẵn lẻ và xử lý danh sách mảng dữ liệu.'
  }
];
