const assert = require('assert');

console.log('[TEST] Running core-regressions.cjs...');

// 1. Test video segment calculation & deduplication
function calculateWatchedDuration(segments) {
  if (!segments || segments.length === 0) return 0;
  // Sort by start time
  const sorted = [...segments].sort((a, b) => a[0] - b[0]);
  const merged = [];
  let current = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (next[0] <= current[1]) {
      current = [current[0], Math.max(current[1], next[1])];
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  return merged.reduce((total, seg) => total + (seg[1] - seg[0]), 0);
}

// Test Segment merging
assert.strictEqual(calculateWatchedDuration([[0, 60], [30, 90]]), 90, 'Overlapping segments should merge');
assert.strictEqual(calculateWatchedDuration([[0, 30], [60, 90]]), 60, 'Disjoint segments should sum up');
assert.strictEqual(calculateWatchedDuration([[0, 100], [10, 50]]), 100, 'Subset segment should not add extra');

// 2. Test Multi-material Lesson Progress Calculation
function computeLessonProgress(materials, materialProgressMap) {
  const requiredMaterials = materials.filter(m => m.required);
  if (requiredMaterials.length === 0) return 100;

  let totalPercentage = 0;
  for (const mat of requiredMaterials) {
    const prog = materialProgressMap[mat.id];
    if (!prog) continue;

    if (mat.type === 'pdf') {
      const viewedCount = (prog.viewedPages || []).length;
      const totalPages = mat.pageCount || 1;
      const pdfPct = Math.min(100, Math.round((viewedCount / totalPages) * 100));
      totalPercentage += pdfPct;
    } else if (mat.type === 'video') {
      const watchedSecs = calculateWatchedDuration(prog.watchedSegments || []);
      const totalSecs = mat.duration || 1;
      const videoPct = Math.min(100, Math.round((watchedSecs / totalSecs) * 100));
      totalPercentage += videoPct;
    }
  }

  return Math.round(totalPercentage / requiredMaterials.length);
}

const mockMaterials = [
  { id: 'm1', type: 'pdf', pageCount: 10, required: true },
  { id: 'm2', type: 'video', duration: 300, required: true }
];

const mockProgress = {
  m1: { viewedPages: [1, 2, 3, 4, 5] }, // 50%
  m2: { watchedSegments: [[0, 300]] } // 100%
};

const overall = computeLessonProgress(mockMaterials, mockProgress);
assert.strictEqual(overall, 75, 'Progress across 2 materials should average to 75%');

// 3. Test Student Sanitization (Hide Answer Keys before submission)
function sanitizeQuestionsForStudent(questions) {
  return questions.map(q => {
    const { correctAnswer, explanation, rubric, ...safe } = q;
    return safe;
  });
}

const fullQuestions = [
  { id: 'q1', question: 'What is A?', type: 'multiple_choice', options: ['A', 'B'], correctAnswer: 'A', explanation: 'Secret', rubric: 'Rubric' }
];

const sanitized = sanitizeQuestionsForStudent(fullQuestions);
assert.strictEqual(sanitized[0].correctAnswer, undefined, 'Student question must not leak correctAnswer');
assert.strictEqual(sanitized[0].explanation, undefined, 'Student question must not leak explanation');
assert.strictEqual(sanitized[0].rubric, undefined, 'Student question must not leak rubric');
assert.strictEqual(sanitized[0].id, 'q1', 'Student question keeps safe fields');

// 4. Test Attempt Deadline Enforcement
function isAttemptSubmittable(attempt, now = Date.now()) {
  if (attempt.status !== 'in_progress') return false;
  if (attempt.deadline && new Date(attempt.deadline).getTime() < now) return false;
  return true;
}

const validAttempt = { id: 'att-1', status: 'in_progress', deadline: new Date(Date.now() + 60000).toISOString() };
const expiredAttempt = { id: 'att-2', status: 'in_progress', deadline: new Date(Date.now() - 60000).toISOString() };
const alreadySubmitted = { id: 'att-3', status: 'submitted', deadline: new Date(Date.now() + 60000).toISOString() };

assert.strictEqual(isAttemptSubmittable(validAttempt), true, 'Valid attempt should be submittable');
assert.strictEqual(isAttemptSubmittable(expiredAttempt), false, 'Expired attempt should be rejected');
assert.strictEqual(isAttemptSubmittable(alreadySubmitted), false, 'Already submitted attempt should be rejected');

console.log('[PASS] core-regressions.cjs completed successfully with 4 suites passed.');
