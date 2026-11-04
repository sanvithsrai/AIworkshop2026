const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/admin/dashboard - High-level placement intelligence
router.get('/dashboard', requireAuth, requireRole('faculty'), (req, res) => {
  try {
    const students = db.find('users', u => u.role === 'student');
    const exams = db.find('exams');
    const submissions = db.find('submissions');
    const recruiters = db.find('recruiters');
    const jobs = db.find('jobs');

    const totalStudents = students.length;
    const totalTestsTaken = submissions.length;
    const avgScore = totalTestsTaken > 0
      ? Math.round(submissions.reduce((acc, s) => acc + s.percentage, 0) / totalTestsTaken)
      : 0;

    const passingCount = submissions.filter(s => s.passed).length;
    const passRate = totalTestsTaken > 0 ? Math.round((passingCount / totalTestsTaken) * 100) : 0;

    // Student directory with enriched readiness stats
    const studentList = students.map(s => {
      const userSubs = submissions.filter(sub => sub.user_id === s.id);
      const studentAvg = userSubs.length > 0
        ? Math.round(userSubs.reduce((acc, sub) => acc + sub.percentage, 0) / userSubs.length)
        : 0;

      const readinessScore = Math.min(100, Math.round((s.cgpa * 6.5) + (studentAvg * 0.35)));

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        usn: s.usn || 'N/A',
        branch: s.branch || 'CSE',
        semester: s.semester || 6,
        cgpa: s.cgpa || 8.0,
        testsCompleted: userSubs.length,
        averageScore: studentAvg,
        readinessScore,
        status: readinessScore >= 75 ? 'Placement Ready' : 'Needs Preparation'
      };
    });

    res.json({
      metrics: {
        totalStudents,
        totalTestsTaken,
        avgScore,
        passRate,
        activeRecruiters: recruiters.length,
        verifiedJobsCount: jobs.length,
        highestPackage: '₹47.24 LPA (Belc)',
        averagePackage: '₹6.3 LPA'
      },
      students: studentList
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to compile admin stats.' });
  }
});

module.exports = router;

