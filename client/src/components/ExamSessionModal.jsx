import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

export default function ExamSessionModal({ examId, onClose, onExamCompleted }) {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: 'A' | 'B' | 'C' | 'D' }
  const [flagged, setFlagged] = useState({}); // { [qId]: boolean }
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null); // stores server evaluation
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Fetch exam questions
  useEffect(() => {
    let timerId = null;

    const loadExam = async () => {
      try {
        setLoading(true);
        const data = await api.getExamById(examId);
        setExam(data.exam);
        setQuestions(data.questions || []);
        setTimeLeft((data.exam.duration_minutes || 30) * 60);
      } catch (err) {
        console.error('Failed to load exam:', err);
      } finally {
        setLoading(false);
      }
    };

    loadExam();

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [examId]);

  // Countdown Timer
  useEffect(() => {
    if (!exam || results || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [exam, results, timeLeft]);

  const handleSelectOption = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleToggleFlag = (qId) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      setShowConfirmSubmit(false);
      const evalResult = await api.submitExam(examId, {
        answers,
        time_taken_seconds: timeTaken
      });
      setResults(evalResult);

      if (evalResult.passed) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) { }
      }

      if (onExamCompleted) {
        onExamCompleted();
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed. Please check connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-white">Loading Proctored Test Environment...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeCritical = timeLeft < 120; // under 2 minutes

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden select-none">

      {/* Test Engine Header */}
      <div className="bg-[#141414] border-b border-[#2d2d2d] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center font-black text-white text-sm">
            SC
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {exam?.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-[#808080]">
              <span>Category: {exam?.category}</span>
              <span>•</span>
              <span>Pass Criteria: {exam?.passing_marks}/{exam?.total_marks} Marks</span>
            </div>
          </div>
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3">
          {!results && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-bold ${isTimeCritical ? 'bg-[#e50914] text-white animate-pulse' : 'bg-[#2d2d2d] text-white'
              }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#808080] hover:text-white hover:bg-[#2d2d2d] transition-colors"
            title="Exit Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Session Area */}
      {!results ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Left: Question & Answers Panel */}
          <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentQ && (
              <div className="max-w-3xl mx-auto w-full">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between text-xs text-[#808080] mb-4 pb-2 border-b border-[#2d2d2d]">
                  <span className="font-bold text-[#e50914]">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>Marks: +{currentQ.marks || 5}</span>
                    <button
                      onClick={() => handleToggleFlag(currentQ.id)}
                      className={`flex items-center gap-1 text-xs font-medium transition-colors ${flagged[currentQ.id] ? 'text-[#e50914] font-bold' : 'text-[#808080] hover:text-white'
                        }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
                      <span>{flagged[currentQ.id] ? 'Flagged' : 'Flag for Review'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6">
                  {currentQ.question_text}
                </h3>

                {/* Option Cards */}
                <div className="space-y-3 mb-8">
                  {['A', 'B', 'C', 'D'].map(optKey => {
                    const optText = currentQ[`option_${optKey.toLowerCase()}`];
                    const isSelected = answers[currentQ.id] === optKey;

                    return (
                      <div
                        key={optKey}
                        onClick={() => handleSelectOption(currentQ.id, optKey)}
                        className={`p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all flex items-center gap-3.5 ${isSelected
                            ? 'bg-[#222222] border-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                            : 'bg-[#181818] border-[#2d2d2d] text-[#b3b3b3] hover:border-[#5a5a5a] hover:text-white'
                          }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-[#10b981] text-white' : 'bg-[#2d2d2d] text-[#808080]'
                          }`}>
                          {optKey}
                        </div>
                        <span className="leading-snug">{optText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Nav Bar */}
            <div className="max-w-3xl mx-auto w-full pt-4 border-t border-[#2d2d2d] flex items-center justify-between gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded bg-[#2d2d2d] text-white text-xs font-semibold hover:bg-[#414141] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="btn-netflix-primary px-5 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="btn-netflix-primary px-6 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Finish Exam</span>
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Question Navigation Palette */}
          <div className="w-full md:w-72 lg:w-80 bg-[#121212] border-t md:border-t-0 md:border-l border-[#2d2d2d] p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#808080] mb-3">
                Question Palette
              </h4>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#b3b3b3] mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#e50914]"></span>
                  <span>Flagged ({Object.values(flagged).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#2d2d2d]"></span>
                  <span>Unanswered ({questions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full ring-2 ring-[#e50914]"></span>
                  <span>Current</span>
                </div>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isFlagged = !!flagged[q.id];
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg text-xs font-bold transition-all relative ${isCurrent ? 'ring-2 ring-[#e50914] scale-105' : ''
                        } ${isAnswered ? 'bg-emerald-600 text-white' :
                          isFlagged ? 'bg-[#e50914] text-white' :
                            'bg-[#222222] text-[#808080] hover:text-white'
                        }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#e50914] ring-1 ring-black" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Final Submit Button */}
            <div className="pt-4 border-t border-[#2d2d2d] mt-6">
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full btn-netflix-primary py-2.5 text-xs font-bold rounded shadow-lg"
              >
                Submit Exam ({answeredCount}/{questions.length} Attempted)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Exam Results & Question Review Palette */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">

            {/* Result Summary Card */}
            <div className="card-feature-gradient p-6 sm:p-8 rounded-2xl text-center mb-8 relative overflow-hidden">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 ${results.passed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                {results.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{results.passed ? 'PASSED - PLACEMENT QUALIFIED' : 'NEEDS IMPROVEMENT'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Your Score: {results.score} / {results.total_marks}
              </h2>
              <p className="text-lg font-bold text-[#e50914] mb-6">
                {results.percentage}% Aggregate Score
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6 text-xs">
                <div className="p-3 rounded-lg bg-black/50 border border-[#2d2d2d]">
                  <span className="text-[#808080] block">Correct Answers</span>
                  <span className="text-lg font-bold text-emerald-400">{results.correct_count}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-[#2d2d2d]">
                  <span className="text-[#808080] block">Accuracy</span>
                  <span className="text-lg font-bold text-white">
                    {Math.round((results.correct_count / results.total_questions) * 100)}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-[#2d2d2d]">
                  <span className="text-[#808080] block">Time Spent</span>
                  <span className="text-lg font-bold text-white">{formatTimer(results.time_taken_seconds || 0)}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-[#2d2d2d]">
                  <span className="text-[#808080] block">Result Status</span>
                  <span className={`text-lg font-bold ${results.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {results.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setResults(null); setAnswers({}); setTimeLeft((exam?.duration_minutes || 30) * 60); setTimeTaken(0); }}
                  className="px-5 py-2.5 rounded bg-[#2d2d2d] text-white hover:bg-[#414141] text-xs font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn-netflix-primary px-6 py-2.5 text-xs font-bold rounded"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Question-by-Question Review with Explanations */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#e50914]" />
                <span>Detailed Question Review & Explanations</span>
              </h3>

              {results.questions_review?.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border ${q.is_correct ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-rose-950/20 border-rose-800/40'
                    }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#b3b3b3]">Question {idx + 1}</span>
                    <span className={`font-bold flex items-center gap-1 ${q.is_correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {q.is_correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{q.marks_earned} / {q.max_marks} Marks</span>
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mb-3">
                    {q.question_text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className={`p-2.5 rounded border ${q.student_choice === q.correct_option
                        ? 'bg-emerald-900/30 border-emerald-700 text-emerald-200'
                        : 'bg-rose-900/30 border-rose-700 text-rose-200'
                      }`}>
                      <span className="text-[#808080] block text-[10px]">Your Answer:</span>
                      <span className="font-bold">Option {q.student_choice}: {q[`option_${q.student_choice?.toLowerCase()}`] || 'Not Answered'}</span>
                    </div>

                    <div className="p-2.5 rounded border bg-emerald-900/20 border-emerald-700 text-emerald-200">
                      <span className="text-[#808080] block text-[10px]">Correct Answer:</span>
                      <span className="font-bold">Option {q.correct_option}: {q[`option_${q.correct_option?.toLowerCase()}`]}</span>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="p-3 rounded bg-black/60 border border-[#2d2d2d] text-xs text-[#b3b3b3] leading-relaxed">
                      <strong className="text-white block mb-0.5">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#5a5a5a] rounded-xl max-w-sm w-full p-6 text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-[#e50914] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Submit Exam Session?</h3>
            <p className="text-xs text-[#b3b3b3] mb-6">
              You have answered <strong className="text-white">{answeredCount} of {questions.length}</strong> questions.
              Are you ready to submit and calculate your final score?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2 rounded bg-[#2d2d2d] text-white hover:bg-[#414141] text-xs font-semibold"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 py-2 rounded btn-netflix-primary text-xs font-bold"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
