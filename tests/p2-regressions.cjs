const assert = require('assert');

console.log('[TEST] Running p2-regressions.cjs...');

// 1. Test Exam Scoring Engine (Deterministic MCQ/TrueFalse/ShortAnswer vs Essay)
function gradeAssessment(questions, studentAnswers) {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let hasEssay = false;

  for (const q of questions) {
    const studentAns = (studentAnswers[q.id] || '').trim();
    if (q.type === 'essay') {
      hasEssay = true;
      continue;
    }

    const expected = (q.correctAnswer || '').trim();
    const isCorrect = studentAns.toLowerCase() === expected.toLowerCase();
    if (isCorrect) {
      score += (q.points || 0);
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  return {
    score: Math.round(score * 10) / 10,
    correctCount,
    incorrectCount,
    status: hasEssay ? 'submitted' : 'graded'
  };
}

const mockExamQuestions = [
  { id: 'q1', type: 'multiple_choice', correctAnswer: 'A. AC', points: 2.5 },
  { id: 'q2', type: 'true_false', correctAnswer: 'Đúng', points: 2.5 },
  { id: 'q3', type: 'short_answer', correctAnswer: '10', points: 2.5 },
  { id: 'q4', type: 'essay', points: 2.5 }
];

const studentAns1 = { q1: 'A. AC', q2: 'Đúng', q3: '10', q4: 'My essay answer' };
const res1 = gradeAssessment(mockExamQuestions, studentAns1);

assert.strictEqual(res1.score, 7.5, 'Deterministic score for 3 correct items should be 7.5');
assert.strictEqual(res1.correctCount, 3, 'Correct count should be 3');
assert.strictEqual(res1.status, 'submitted', 'Exam with essay should remain submitted awaiting teacher review');

const studentAns2 = { q1: 'A. AC', q2: 'Sai', q3: '10', q4: 'Essay' };
const res2 = gradeAssessment(mockExamQuestions, studentAns2);
assert.strictEqual(res2.score, 5.0, '1 incorrect question should deduce score appropriately');
assert.strictEqual(res2.incorrectCount, 1, 'Incorrect count should be 1');

// 2. Test JSON Validation Schema for AI-generated Lessons
function validateLessonContentAI(content) {
  if (!content || typeof content !== 'object') return false;
  if (typeof content.title !== 'string' || !content.title) return false;
  if (!Array.isArray(content.objectives) || content.objectives.length === 0) return false;
  if (!Array.isArray(content.keyKnowledge) || content.keyKnowledge.length === 0) return false;
  return true;
}

const validAIContent = {
  title: 'Vectơ trong mặt phẳng',
  objectives: ['Mục tiêu 1', 'Mục tiêu 2'],
  keyKnowledge: ['Kiến thức 1'],
  concepts: [{ term: 'Vectơ', definition: 'Đoạn thẳng có hướng' }]
};

const invalidAIContent = {
  title: '',
  objectives: []
};

assert.strictEqual(validateLessonContentAI(validAIContent), true, 'Valid lesson content AI passes validation');
assert.strictEqual(validateLessonContentAI(invalidAIContent), false, 'Empty lesson content AI is rejected');
assert.strictEqual(validateLessonContentAI(null), false, 'Null lesson content AI is rejected');

console.log('[PASS] p2-regressions.cjs completed successfully with 2 suites passed.');
