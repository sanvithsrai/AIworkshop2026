import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Users,
  Award,
  Building2,
  Plus,
  Download,
  Search,
  CheckCircle2,
  Trash2,
  FileText,
  FileEdit,
  HelpCircle,
  Check,
  X,
  Filter,
  Layers,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FacultyDashboard({ onOpenCreateExam, onOpenCreateNewsletter, onOpenCreateJob }) {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Active view tab: 'questions' (Question Studio) | 'students' (Student Directory)
  const [activeTab, setActiveTab] = useState('questions');

  // Dashboard metrics & students
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Question Management state
  const [exams, setExams] = useState([]);
  const [selectedExamFilter, setSelectedExamFilter] = useState('All');
  const [questionSearch, setQuestionSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Question Edit / Create Modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null = new, object = edit
  const [formExamId, setFormExamId] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectOption, setFormCorrectOption] = useState('A');
  const [formExplanation, setFormExplanation] = useState('');
  const [formMarks, setFormMarks] = useState(5);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Create New Exam Modal State
  const [newExamModalOpen, setNewExamModalOpen] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamCategory, setNewExamCategory] = useState('Aptitude');
  const [newExamSubcategory, setNewExamSubcategory] = useState('Quantitative');
  const [newExamDescription, setNewExamDescription] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(30);
  const [newExamMarks, setNewExamMarks] = useState(50);
  const [newExamPassing, setNewExamPassing] = useState(25);
  const [newExamDifficulty, setNewExamDifficulty] = useState('Medium');
  const [creatingExam, setCreatingExam] = useState(false);

  // Fetch dashboard stats & exams list
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [adminRes, examsRes] = await Promise.allSettled([
        api.getAdminDashboard(),
        api.getExams()
      ]);
      if (adminRes.status === 'fulfilled') setData(adminRes.value);
      if (examsRes.status === 'fulfilled') {
        const examsList = examsRes.value || [];
        setExams(examsList);
        if (examsList.length > 0 && !formExamId) {
          setFormExamId(examsList[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for management
  const fetchQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const qData = await api.getAdminQuestions(selectedExamFilter === 'All' ? '' : selectedExamFilter);
      setQuestions(qData || []);
    } catch (err) {
      console.error('Failed to load admin questions:', err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedExamFilter]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Open modal to Create New Question
  const handleOpenCreateQuestion = () => {
    setEditingQuestion(null);
    setFormExamId(selectedExamFilter !== 'All' ? selectedExamFilter : (exams[0]?.id || ''));
    setFormQuestionText('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormCorrectOption('A');
    setFormExplanation('');
    setFormMarks(5);
    setQuestionModalOpen(true);
  };

  // Open modal to Edit Existing Question
  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setFormExamId(q.exam_id);
    setFormQuestionText(q.question_text || '');
    setFormOptionA(q.option_a || '');
    setFormOptionB(q.option_b || '');
    setFormOptionC(q.option_c || '');
    setFormOptionD(q.option_d || '');
    setFormCorrectOption(q.correct_option || 'A');
    setFormExplanation(q.explanation || '');
    setFormMarks(q.marks || 5);
    setQuestionModalOpen(true);
  };

  // Save question (Create or Update)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formQuestionText || !formOptionA || !formOptionB || !formExamId) {
      alert('Please fill out the question text, Option A, Option B, and select an exam.');
      return;
    }

    try {
      setSavingQuestion(true);
      const payload = {
        exam_id: formExamId,
        question_text: formQuestionText,
        option_a: formOptionA,
        option_b: formOptionB,
        option_c: formOptionC,
        option_d: formOptionD,
        correct_option: formCorrectOption,
        explanation: formExplanation,
        marks: Number(formMarks) || 5
      };

      if (editingQuestion) {
        await api.updateQuestion(editingQuestion.id, payload);
        showToast('Question modified successfully!');
      } else {
        await api.createQuestion(payload);
        showToast('New MCQ added to the question bank!');
      }

      setQuestionModalOpen(false);
      fetchQuestions();
    } catch (err) {
      alert('Failed to save question: ' + err.message);
    } finally {
      setSavingQuestion(false);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question? This cannot be undone.')) return;
    try {
      await api.deleteQuestion(qId);
      showToast('Question deleted successfully.');
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  // Create new exam
  const handleCreateNewExam = async (e) => {
    e.preventDefault();
    if (!newExamTitle || !newExamCategory) return;

    try {
      setCreatingExam(true);
      await api.createExam({
        title: newExamTitle,
        category: newExamCategory,
        subcategory: newExamSubcategory,
        description: newExamDescription || 'Placement preparation test module.',
        duration_minutes: Number(newExamDuration) || 30,
        total_marks: Number(newExamMarks) || 50,
        passing_marks: Number(newExamPassing) || 25,
        difficulty: newExamDifficulty
      });

      showToast(`Exam "${newExamTitle}" created successfully!`);
      setNewExamModalOpen(false);
      setNewExamTitle('');
      setNewExamDescription('');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to create exam: ' + err.message);
    } finally {
      setCreatingExam(false);
    }
  };

  const metrics = data?.metrics || {};
  const students = data?.students || [];

  const branches = ['All', 'Computer Science & Engineering', 'Information Science', 'Electronics & Communication'];

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.usn.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchBranch = selectedBranch === 'All' || s.branch === selectedBranch;
    return matchSearch && matchBranch;
  });

  const filteredQuestions = questions.filter(q => {
    if (!questionSearch) return true;
    const term = questionSearch.toLowerCase();
    return (
      (q.question_text && q.question_text.toLowerCase().includes(term)) ||
      (q.exam_title && q.exam_title.toLowerCase().includes(term)) ||
      (q.option_a && q.option_a.toLowerCase().includes(term)) ||
      (q.option_b && q.option_b.toLowerCase().includes(term)) ||
      (q.option_c && q.option_c.toLowerCase().includes(term)) ||
      (q.option_d && q.option_d.toLowerCase().includes(term)) ||
      (q.explanation && q.explanation.toLowerCase().includes(term))
    );
  });

  const exportCSV = () => {
    const headers = "Name,USN,Email,Branch,CGPA,TestsCompleted,AvgScore,ReadinessScore,Status\n";
    const rows = filteredStudents.map(s =>
      `"${s.name}","${s.usn}","${s.email}","${s.branch}",${s.cgpa},${s.testsCompleted},${s.averageScore},${s.readinessScore},"${s.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahyadri_placement_students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#10b981] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Faculty Command Center Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl mb-8 border relative overflow-hidden transition-all ${
        isDark ? 'card-feature-gradient border-[#5a5a5a]/40' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center font-black text-2xl text-white shadow-xl shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Faculty Placement Command Center
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Faculty Active
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                Managed by <strong className="text-[#10b981]">Prof. Rashmi Bhandary</strong> (Dean – Career Guidance, Training & Placement Cell)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateQuestion}
              className="btn-netflix-primary px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">+ Add New MCQ</span>
            </button>
            <button
              onClick={() => setNewExamModalOpen(true)}
              className={`px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isDark ? 'bg-[#222222] border-[#333333] text-white hover:bg-[#2d2d2d]' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#10b981]" />
              <span>+ New Exam</span>
            </button>
            <button
              onClick={exportCSV}
              className={`px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isDark ? 'bg-[#222222] border-[#333333] text-white hover:bg-[#2d2d2d]' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t ${
          isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
        }`}>
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Registered Scholars</span>
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{metrics.totalStudents || students.length}</span>
            <span className="text-[10px] text-emerald-500 block mt-0.5 font-medium">Eligible 2026 Batch</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Total MCQs in Bank</span>
            <span className={`text-2xl font-black text-[#10b981]`}>{questions.length || 100}</span>
            <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Across 20 Modules</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Batch Average</span>
            <span className="text-2xl font-black text-[#10b981]">{metrics.avgScore || 0}%</span>
            <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Aptitude & Technical</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] block uppercase font-semibold ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Visiting Pipeline</span>
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{metrics.activeRecruiters || 8}</span>
            <span className={`text-[10px] block mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>250+ Annual Target</span>
          </div>
        </div>
      </div>

      {/* Main Faculty Mode Navigation Tabs */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'questions'
              ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/25'
              : isDark 
                ? 'bg-[#181818] border border-[#2d2d2d] text-[#808080] hover:text-white' 
                : 'bg-white border border-slate-300 text-slate-700 hover:text-black shadow-sm'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>Question Bank Studio (Modify & Create MCQs)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
            {questions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'students'
              ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/25'
              : isDark 
                ? 'bg-[#181818] border border-[#2d2d2d] text-[#808080] hover:text-white' 
                : 'bg-white border border-slate-300 text-slate-700 hover:text-black shadow-sm'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Performance & Readiness Directory</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
            {students.length}
          </span>
        </button>
      </div>

      {/* TAB 1: QUESTION BANK STUDIO (MODIFY & CREATE QUESTIONS) */}
      {activeTab === 'questions' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileEdit className="w-5 h-5 text-[#10b981]" />
                <span>MCQ Question Bank Management Studio</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                Create new questions or modify existing question texts, options, marks, and answer keys.
              </p>
            </div>

            {/* Filter by Exam & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Exam dropdown filter */}
              <div className="w-full sm:w-64">
                <select
                  value={selectedExamFilter}
                  onChange={e => setSelectedExamFilter(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-xs outline-none focus:border-[#10b981] border ${
                    isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="All">All Exams & Modules ({exams.length})</option>
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              {/* Keyword search input */}
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={questionSearch}
                  onChange={e => setQuestionSearch(e.target.value)}
                  placeholder="Search question text / option..."
                  className={`w-full rounded-lg px-3 py-2 pl-8 text-xs outline-none focus:border-[#10b981] border ${
                    isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
              </div>

              <button
                onClick={handleOpenCreateQuestion}
                className="btn-netflix-primary whitespace-nowrap px-3.5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          {questionsLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Loading question bank...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-16 text-center">
              <HelpCircle className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-[#5a5a5a]' : 'text-slate-400'}`} />
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No questions found matching criteria</p>
              <p className={`text-xs mt-1 mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Add a new question to this module or adjust filters.</p>
              <button
                onClick={handleOpenCreateQuestion}
                className="btn-netflix-primary px-4 py-2 text-xs font-bold rounded"
              >
                + Create Question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className={`p-5 rounded-xl border transition-all ${
                    isDark ? 'bg-[#141414] border-[#282828] hover:border-[#383838]' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-full bg-[#10b981] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                        {q.exam_title || 'Mock Test'}
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                        +{q.marks || 5} Marks
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border transition-all ${
                          isDark ? 'bg-[#222222] border-[#333333] text-white hover:bg-[#2d2d2d]' : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                        }`}
                      >
                        <FileEdit className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Edit Question</span>
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4 className={`text-sm font-bold mb-3 leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {q.question_text}
                  </h4>

                  {/* 4 MCQ Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {['A', 'B', 'C', 'D'].map(optKey => {
                      const optText = q[`option_${optKey.toLowerCase()}`];
                      if (!optText) return null;
                      const isCorrect = (q.correct_option || '').toUpperCase() === optKey;

                      return (
                        <div
                          key={optKey}
                          className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                            isCorrect 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold'
                              : isDark ? 'bg-[#181818] border-[#222222] text-[#b3b3b3]' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isCorrect ? 'bg-emerald-500 text-white' : isDark ? 'bg-[#282828] text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {optKey}
                            </span>
                            <span className="truncate">{optText}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-500 shrink-0 ml-2">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation box */}
                  {q.explanation && (
                    <div className={`p-2.5 rounded-lg text-xs border ${
                      isDark ? 'bg-black/30 border-[#222222] text-[#808080]' : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <strong className={isDark ? 'text-[#b3b3b3]' : 'text-slate-800'}>Solution / Key:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY TABLE */}
      {activeTab === 'students' && (
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'card-feature-gradient border-[#5a5a5a]/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Users className="w-5 h-5 text-[#10b981]" />
                <span>Student Performance & Placement Readiness Directory</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                Live ranking based on CGPA and proctored test assessments.
              </p>
            </div>

            {/* Search & Branch Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search USN / Name..."
                  className={`w-full rounded-lg px-3 py-1.5 pl-8 text-xs outline-none focus:border-[#10b981] border ${
                    isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
              </div>

              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className={`rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#10b981] border ${
                  isDark ? 'bg-[#181818] border-[#2d2d2d] text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
              <thead className={`uppercase text-[10px] border-b ${
                isDark ? 'bg-black/60 text-[#808080] border-[#2d2d2d]' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">USN</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Tests Done</th>
                  <th className="py-3 px-4">Avg Score</th>
                  <th className="py-3 px-4">Readiness Index</th>
                  <th className="py-3 px-4">Placement Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#2d2d2d]' : 'divide-slate-200'}`}>
                {filteredStudents.map(student => (
                  <tr key={student.id} className={isDark ? 'hover:bg-white/5 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                    <td className="py-3 px-4">
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.name}</span>
                      <span className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>{student.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#10b981]">
                      {student.usn}
                    </td>
                    <td className={`py-3 px-4 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                      {student.branch}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#10b981]">
                      {student.cgpa}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {student.testsCompleted}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#10b981]">
                      {student.averageScore}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#2d2d2d]' : 'bg-slate-200'}`}>
                          <div
                            className="h-full bg-[#10b981] rounded-full"
                            style={{ width: `${student.readinessScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-[#10b981]">{student.readinessScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${student.readinessScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                        }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT QUESTION MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
          }`}>
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-[#2d2d2d]">
              <div>
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <FileEdit className="w-5 h-5 text-[#10b981]" />
                  <span>{editingQuestion ? 'Modify Existing Question' : 'Create New MCQ Question'}</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  Faculty authoring studio for placement aptitude & technical assessments.
                </p>
              </div>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className={`p-1 rounded-full ${isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              
              {/* Select Exam Module */}
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                  Select Exam Module *
                </label>
                <select
                  required
                  value={formExamId}
                  onChange={e => setFormExamId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>{e.title} ({e.category})</option>
                  ))}
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                  Question Text / Problem Statement *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formQuestionText}
                  onChange={e => setFormQuestionText(e.target.value)}
                  placeholder="e.g. A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?"
                  className={`w-full p-2.5 rounded-lg border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Options A & B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    Option A *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOptionA}
                    onChange={e => setFormOptionA(e.target.value)}
                    placeholder="Choice A..."
                    className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    Option B *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOptionB}
                    onChange={e => setFormOptionB(e.target.value)}
                    placeholder="Choice B..."
                    className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Options C & D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    Option C
                  </label>
                  <input
                    type="text"
                    value={formOptionC}
                    onChange={e => setFormOptionC(e.target.value)}
                    placeholder="Choice C..."
                    className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    Option D
                  </label>
                  <input
                    type="text"
                    value={formOptionD}
                    onChange={e => setFormOptionD(e.target.value)}
                    placeholder="Choice D..."
                    className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Correct Option & Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 text-emerald-500`}>
                    Correct Answer Key *
                  </label>
                  <select
                    value={formCorrectOption}
                    onChange={e => setFormCorrectOption(e.target.value)}
                    className={`w-full p-2 rounded-lg border border-emerald-500/40 text-emerald-500 font-bold outline-none ${
                      isDark ? 'bg-[#1c1c1c]' : 'bg-emerald-50'
                    }`}
                  >
                    <option value="A">Option A is Correct</option>
                    <option value="B">Option B is Correct</option>
                    <option value="C">Option C is Correct</option>
                    <option value="D">Option D is Correct</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    Question Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formMarks}
                    onChange={e => setFormMarks(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                  Detailed Solution & Explanation (Shown after test completion)
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={e => setFormExplanation(e.target.value)}
                  placeholder="e.g. Speed = 60 * (5/18) = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 meters."
                  className={`w-full p-2 rounded-lg border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-[#2d2d2d] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDark ? 'bg-[#222222] text-[#b3b3b3] hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-black'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingQuestion}
                  className="btn-netflix-primary px-5 py-2 rounded-lg font-bold"
                >
                  {savingQuestion ? 'Saving Question...' : (editingQuestion ? 'Update Question' : 'Save Question')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW EXAM MODAL */}
      {newExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-[#2d2d2d]">
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Assessment Exam</h3>
              <button onClick={() => setNewExamModalOpen(false)} className={isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#808080]">Exam Title *</label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={e => setNewExamTitle(e.target.value)}
                  placeholder="e.g. Amazon & Microsoft DSA Diagnostic Test"
                  className={`w-full p-2 rounded border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-[#808080]">Category</label>
                  <select
                    value={newExamCategory}
                    onChange={e => setNewExamCategory(e.target.value)}
                    className={`w-full p-2 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Technical">Technical</option>
                    <option value="Logical">Logical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#808080]">Difficulty</label>
                  <select
                    value={newExamDifficulty}
                    onChange={e => setNewExamDifficulty(e.target.value)}
                    className={`w-full p-2 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-[#808080]">Duration (min)</label>
                  <input
                    type="number"
                    value={newExamDuration}
                    onChange={e => setNewExamDuration(e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#808080]">Total Marks</label>
                  <input
                    type="number"
                    value={newExamMarks}
                    onChange={e => setNewExamMarks(e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#808080]">Pass Marks</label>
                  <input
                    type="number"
                    value={newExamPassing}
                    onChange={e => setNewExamPassing(e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#808080]">Exam Description</label>
                <textarea
                  rows={2}
                  value={newExamDescription}
                  onChange={e => setNewExamDescription(e.target.value)}
                  placeholder="Brief summary of test syllabus..."
                  className={`w-full p-2 rounded border outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#333333] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewExamModalOpen(false)}
                  className={`px-3 py-1.5 rounded ${
                    isDark ? 'bg-[#222222] text-[#808080]' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingExam}
                  className="btn-netflix-primary px-4 py-1.5 rounded font-bold"
                >
                  {creatingExam ? 'Creating...' : 'Create Exam Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
