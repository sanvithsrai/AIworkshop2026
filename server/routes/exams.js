const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

// GET /api/exams - List all exams (with optional category filter)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, subcategory, demo } = req.query;

    let exams = db.find('exams', e => {
      let match = true;
      if (category && category !== 'All') {
        match = match && e.category.toLowerCase() === category.toLowerCase();
      }
      if (subcategory) {
        match = match && e.subcategory.toLowerCase() === subcategory.toLowerCase();
      }
      if (demo === 'true') {
        match = match && e.is_demo === true;
      }
      return match;
    });

    // Attach questions count and user submission status
    const userId = req.user ? req.user.id : null;
    const userSubmissions = userId ? db.find('submissions', s => s.user_id === userId) : [];

    const enrichedExams = exams.map(exam => {
      const qCount = db.count('questions', q => q.exam_id === exam.id);
      const userAttempts = userSubmissions.filter(s => s.exam_id === exam.id);
      const bestScore = userAttempts.length > 0
        ? Math.max(...userAttempts.map(s => s.percentage))
        : null;

      return {
        ...exam,
        questions_count: qCount || 5,
        attempted: userAttempts.length > 0,
        best_score: bestScore,
        attempts_count: userAttempts.length
      };
    });

    res.json(enrichedExams);
  } catch (err) {
    console.error('Fetch exams error:', err);
    res.status(500).json({ error: 'Failed to load exams list.' });
  }
});

// GET /api/exams/:id - Get specific exam with questions
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const exam = db.findOne('exams', e => e.id === id);

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const questions = db.find('questions', q => q.exam_id === id)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      .map(q => {
        // Hide correct option during the test session
        const { correct_option, explanation, ...clientQuestion } = q;
        return clientQuestion;
      });

    res.json({
      exam,
      questions
    });
  } catch (err) {
    console.error('Fetch exam detail error:', err);
    res.status(500).json({ error: 'Failed to load exam details.' });
  }
});

// POST /api/exams/:id/submit - Submit exam answers and calculate results
router.post('/:id/submit', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { answers = {}, time_taken_seconds = 0 } = req.body;

    const exam = db.findOne('exams', e => e.id === id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found.' });
    }

    const allQuestions = db.find('questions', q => q.exam_id === id);

    let earnedMarks = 0;
    let totalPossibleMarks = 0;
    let correctCount = 0;

    const questionResults = allQuestions.map(q => {
      const qMarks = q.marks || 5;
      totalPossibleMarks += qMarks;

      const studentChoice = answers[q.id];
      const isCorrect = studentChoice && studentChoice.toUpperCase() === q.correct_option.toUpperCase();

      if (isCorrect) {
        earnedMarks += qMarks;
        correctCount++;
      }

      return {
        id: q.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        student_choice: studentChoice || 'Unattempted',
        correct_option: q.correct_option,
        is_correct: !!isCorrect,
        explanation: q.explanation,
        marks_earned: isCorrect ? qMarks : 0,
        max_marks: qMarks
      };
    });

    const percentage = totalPossibleMarks > 0
      ? Math.round((earnedMarks / totalPossibleMarks) * 100)
      : 0;

    const passed = earnedMarks >= (exam.passing_marks || Math.round(totalPossibleMarks * 0.5));

    // Save submission record if user is authenticated
    let submissionRecord = null;
    const userId = req.user ? req.user.id : 'usr_guest_demo';

    submissionRecord = db.insert('submissions', {
      user_id: userId,
      exam_id: id,
      exam_title: exam.title,
      category: exam.category,
      score: earnedMarks,
      total_marks: totalPossibleMarks,
      percentage,
      passed,
      time_taken_seconds,
      correct_count: correctCount,
      total_questions: allQuestions.length
    });

    res.json({
      message: 'Exam submitted successfully',
      submission_id: submissionRecord.id,
      score: earnedMarks,
      total_marks: totalPossibleMarks,
      percentage,
      passed,
      correct_count: correctCount,
      total_questions: allQuestions.length,
      time_taken_seconds,
      questions_review: questionResults
    });
  } catch (err) {
    console.error('Submit exam error:', err);
    res.status(500).json({ error: 'Failed to process exam submission.' });
  }
});

// GET /api/exams/history/my - Get user test attempt history
router.get('/history/my', requireAuth, (req, res) => {
  try {
    const submissions = db.find('submissions', s => s.user_id === req.user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(submissions);
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch test history.' });
  }
});

// POST /api/exams - Create new exam (Faculty only)
router.post('/', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { title, category, subcategory, description, duration_minutes, total_marks, passing_marks, difficulty, questions = [] } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required.' });
    }

    const newExam = db.insert('exams', {
      title,
      category,
      subcategory: subcategory || 'General',
      description: description || 'Placement preparation test module.',
      duration_minutes: Number(duration_minutes) || 30,
      total_marks: Number(total_marks) || 50,
      passing_marks: Number(passing_marks) || 25,
      difficulty: difficulty || 'Medium',
      is_demo: false,
      banner_gradient: 'linear-gradient(149deg, #192247, #210e17)',
      created_by: req.user.name
    });

    // Add provided questions
    questions.forEach((q, idx) => {
      db.insert('questions', {
        exam_id: newExam.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option || 'A',
        explanation: q.explanation || 'Verified answer key.',
        marks: Number(q.marks) || 5,
        order_index: idx + 1
      });
    });

    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (err) {
    console.error('Create exam error:', err);
    res.status(500).json({ error: 'Failed to create exam.' });
  }
});

// GET /api/exams/admin/questions - Get questions with answers for Faculty management
router.get('/admin/questions', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { exam_id } = req.query;
    let questions = db.find('questions', q => {
      if (exam_id && exam_id !== 'All') {
        return q.exam_id === exam_id;
      }
      return true;
    });

    // Attach exam title for convenience
    const exams = db.find('exams');
    const examMap = {};
    exams.forEach(e => { examMap[e.id] = e.title; });

    const enriched = questions.map(q => ({
      ...q,
      exam_title: examMap[q.exam_id] || 'General Module'
    })).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    res.json(enriched);
  } catch (err) {
    console.error('Fetch admin questions error:', err);
    res.status(500).json({ error: 'Failed to load questions.' });
  }
});

// POST /api/exams/questions - Create a question for an exam (Faculty only)
router.post('/questions', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, marks } = req.body;

    if (!exam_id || !question_text || !option_a || !option_b) {
      return res.status(400).json({ error: 'Exam ID, question text, option A, and option B are required.' });
    }

    const exam = db.findOne('exams', e => e.id === exam_id);
    if (!exam) {
      return res.status(404).json({ error: 'Selected exam does not exist.' });
    }

    const count = db.count('questions', q => q.exam_id === exam_id);

    const newQuestion = db.insert('questions', {
      exam_id,
      question_text: question_text.trim(),
      option_a: option_a.trim(),
      option_b: option_b.trim(),
      option_c: option_c ? option_c.trim() : '',
      option_d: option_d ? option_d.trim() : '',
      correct_option: (correct_option || 'A').toUpperCase().trim(),
      explanation: explanation ? explanation.trim() : 'Verified by faculty.',
      marks: Number(marks) || 5,
      order_index: count + 1
    });

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (err) {
    console.error('Create question error:', err);
    res.status(500).json({ error: 'Failed to create question.' });
  }
});

// PUT /api/exams/questions/:id - Modify an existing question (Faculty only)
router.put('/questions/:id', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { id } = req.params;
    const { exam_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, marks } = req.body;

    const existing = db.findOne('questions', q => q.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const updated = db.update('questions', id, {
      ...(exam_id && { exam_id }),
      ...(question_text && { question_text: question_text.trim() }),
      ...(option_a && { option_a: option_a.trim() }),
      ...(option_b && { option_b: option_b.trim() }),
      ...(option_c !== undefined && { option_c: option_c.trim() }),
      ...(option_d !== undefined && { option_d: option_d.trim() }),
      ...(correct_option && { correct_option: correct_option.toUpperCase().trim() }),
      ...(explanation !== undefined && { explanation: explanation.trim() }),
      ...(marks && { marks: Number(marks) })
    });

    res.json({
      message: 'Question updated successfully',
      question: updated
    });
  } catch (err) {
    console.error('Update question error:', err);
    res.status(500).json({ error: 'Failed to update question.' });
  }
});

// DELETE /api/exams/questions/:id - Delete a question (Faculty only)
router.delete('/questions/:id', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('questions', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ error: 'Failed to delete question.' });
  }
});

// DELETE /api/exams/:id - Delete exam (Faculty only)
router.delete('/:id', requireAuth, requireRole('faculty'), (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('exams', id);
  if (!deleted) return res.status(404).json({ error: 'Exam not found' });
  res.json({ message: 'Exam deleted successfully.' });
});

module.exports = router;

