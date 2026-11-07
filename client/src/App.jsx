import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { api } from './services/api';

// Components
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ShelfCarousel from './components/ShelfCarousel';
import TestCorner from './components/TestCorner';
import ExamSessionModal from './components/ExamSessionModal';
import PlacementTracker from './components/PlacementTracker';
import NewslettersSection from './components/NewslettersSection';
import JobsPortal from './components/JobsPortal';
import StudyMaterials from './components/StudyMaterials';
import HackathonsSection from './components/HackathonsSection';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import LoginDashboard from './components/LoginDashboard';
import AIChatbotDrawer from './components/AIChatbotDrawer';
import VoiceAgentModal from './components/VoiceAgentModal';
import AdminCallModal from './components/AdminCallModal';
import AuthModal from './components/AuthModal';

import { Play, Sparkles, PhoneCall, Bot, Globe, Award, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';

function MainApp() {
  const { user, isFaculty } = useAuth();
  const { isDark } = useTheme();
  
  // Hash-based navigation with direct tab support
  const [activeTab, setActiveTabState] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['tests', 'recruiters', 'newsletters', 'jobs', 'materials', 'hackathons', 'dashboard', 'login-portal'].includes(hash)) {
        return hash;
      }
    }
    return 'tests';
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['tests', 'recruiters', 'newsletters', 'jobs', 'materials', 'hackathons', 'dashboard', 'login-portal'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [exams, setExams] = useState([]);
  const [recruitersData, setRecruitersData] = useState({ all: [], attended: [], upcoming: [], stats: {} });
  const [newsletters, setNewsletters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [hackathonsData, setHackathonsData] = useState({ hackathons: [], liveNews: [] });
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeExamId, setActiveExamId] = useState(null);
  const [adminCallOpen, setAdminCallOpen] = useState(false);
  const [voiceAgentOpen, setVoiceAgentOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch initial data immediately and concurrently
  const fetchData = () => {
    setLoading(true);
    
    // Critical core data - update immediately
    api.getExams()
      .then(data => { if (Array.isArray(data)) setExams(data); })
      .catch(err => console.error('Failed to load exams:', err))
      .finally(() => setLoading(false));

    api.getRecruiters()
      .then(data => { if (data) setRecruitersData(data); })
      .catch(err => console.error('Failed to load recruiters:', err));

    api.getNewsletters()
      .then(data => { if (Array.isArray(data)) setNewsletters(data); })
      .catch(err => console.error('Failed to load newsletters:', err));

    api.getJobs()
      .then(data => { if (Array.isArray(data)) setJobs(data); })
      .catch(err => console.error('Failed to load jobs:', err));

    api.getMaterials()
      .then(data => { if (Array.isArray(data)) setMaterials(data); })
      .catch(err => console.error('Failed to load materials:', err));

    api.getHackathons()
      .then(data => { if (data) setHackathonsData(data); })
      .catch(err => console.error('Failed to load hackathons:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const demoExams = exams.filter(e => e.is_demo);
  const japaneseExams = exams.filter(e => e.category === 'Japanese');

  return (
    <div className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden selection:bg-[#10b981] selection:text-white transition-colors duration-200 ${
      isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navigation Bar with Official Logo & Theme Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminCall={() => setAdminCallOpen(true)}
        onOpenVoiceAgent={() => setVoiceAgentOpen(true)}
        onOpenChatbot={() => setChatbotOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeTab === 'tests' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              onStartDemoTest={() => setActiveExamId(demoExams[0]?.id || exams[0]?.id || 'exam_demo_01')}
              onExploreJapan={() => setActiveTab('recruiters')}
              onSearchChange={setSearchQuery}
              searchQuery={searchQuery}
              onNavigateToLogin={() => setActiveTab('login-portal')}
              onOpenAdminCall={() => setAdminCallOpen(true)}
            />

            {/* Netflix Infinite Shelf 1: Trending 3 Sample Demo Tests */}
            <ShelfCarousel
              title="Top 3 Sample Demo Tests"
              subtitle="Quick 5-minute diagnostic evaluations with instant score breakdowns"
              badge="Instant Play"
            >
              {demoExams.map((demo, index) => (
                <div
                  key={demo.id}
                  onClick={() => setActiveExamId(demo.id)}
                  className={`min-w-[280px] sm:min-w-[340px] p-5 rounded-2xl cursor-pointer group flex flex-col justify-between relative overflow-hidden shrink-0 transition-all ${
                    isDark 
                      ? 'card-feature-gradient border border-[#5a5a5a]/30' 
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Large Number Overlay (Netflix style 1-3) */}
                  <span className={`absolute -bottom-4 -left-1 text-7xl sm:text-8xl font-black pointer-events-none select-none ${
                    isDark ? 'text-white/5' : 'text-slate-900/5'
                  }`}>
                    {index + 1}
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                        Demo Test #{index + 1}
                      </span>
                      <span className={`text-xs font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                        {demo.duration_minutes}m • {demo.questions_count || 5} Qs
                      </span>
                    </div>

                    <h3 className={`text-base font-bold transition-colors mb-2 line-clamp-2 ${
                      isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                    }`}>
                      {demo.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 mb-4 leading-relaxed font-normal ${
                      isDark ? 'text-[#808080]' : 'text-slate-600'
                    }`}>
                      {demo.description}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-[#2d2d2d]/30' : 'border-slate-200'
                  }`}>
                    <span className={isDark ? 'text-[#808080]' : 'text-slate-500'}>Pass: {demo.passing_marks}/{demo.total_marks} Marks</span>
                    <button className="btn-netflix-primary px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-md">
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span className="text-white">Take Demo</span>
                    </button>
                  </div>
                </div>
              ))}
            </ShelfCarousel>

            {/* Netflix Shelf 2: Sahyadri Japan Connect (Belc & IMV Priority) */}
            <ShelfCarousel
              title="Sahyadri Japan Connect: JLPT N5 & Corporate Etiquette"
              subtitle="Targeting international drives: Belc (₹47.24 LPA), IMV Corporation (₹36.04 LPA), Aisan (₹34.42 LPA)"
              badge="₹47.24 LPA Peak"
              seeAllAction={() => setActiveTab('recruiters')}
            >
              {japaneseExams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => setActiveExamId(exam.id)}
                  className={`min-w-[280px] sm:min-w-[340px] p-5 rounded-2xl cursor-pointer group flex flex-col justify-between relative shrink-0 transition-all ${
                    isDark 
                      ? 'card-feature-gradient border border-[#5a5a5a]/30' 
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                        {exam.subcategory}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>{exam.duration_minutes}m</span>
                    </div>
                    <h3 className={`text-base font-bold transition-colors mb-2 line-clamp-2 ${
                      isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                    }`}>
                      {exam.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 mb-4 ${
                      isDark ? 'text-[#808080]' : 'text-slate-600'
                    }`}>
                      {exam.description}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-[#2d2d2d]/30' : 'border-slate-200'
                  }`}>
                    <span className={`font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>SPACE Japan Module</span>
                    <button className="btn-netflix-primary px-3.5 py-1.5 rounded text-white font-bold text-xs flex items-center gap-1 shadow-md">
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span className="text-white">Start Module</span>
                    </button>
                  </div>
                </div>
              ))}
            </ShelfCarousel>

            {/* Complete Test Corner Grid (All 20 Exams) */}
            <TestCorner
              exams={exams}
              loading={loading}
              onSelectExam={(exam) => setActiveExamId(exam.id)}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 2: Recruiters Pipeline */}
        {activeTab === 'recruiters' && (
          <PlacementTracker recruitersData={recruitersData} />
        )}

        {/* Tab 3: Newsletters */}
        {activeTab === 'newsletters' && (
          <NewslettersSection newsletters={newsletters} onRefresh={fetchData} />
        )}

        {/* Tab 4: Verified Jobs */}
        {activeTab === 'jobs' && (
          <JobsPortal jobs={jobs} onRefresh={fetchData} />
        )}

        {/* Tab 5: Study Materials */}
        {activeTab === 'materials' && (
          <StudyMaterials materials={materials} onRefresh={fetchData} />
        )}

        {/* Tab 6: Hackathons */}
        {activeTab === 'hackathons' && (
          <HackathonsSection hackathonsData={hackathonsData} />
        )}

        {/* Tab 7: Dashboard (Student or Faculty) */}
        {activeTab === 'dashboard' && (
          isFaculty ? (
            <FacultyDashboard
              onOpenCreateExam={() => setActiveTab('tests')}
              onOpenCreateNewsletter={() => setActiveTab('newsletters')}
              onOpenCreateJob={() => setActiveTab('jobs')}
            />
          ) : (
            <StudentDashboard
              onLaunchExam={() => setActiveTab('tests')}
            />
          )
        )}

        {/* Tab 8: Dedicated Student & Faculty Login Dashboard */}
        {activeTab === 'login-portal' && (
          <LoginDashboard
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToTests={() => setActiveTab('tests')}
          />
        )}
      </main>

      {/* Floating AI Chatbot Action Button (Docked bottom-right without blocking content) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setChatbotOpen(true)}
          className="w-12 h-12 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all shadow-[#10b981]/40 border-2 border-white/20"
          title="Open Placement AI Copilot"
          aria-label="Open AI Copilot"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Footer with Official Logo & Links */}
      <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 text-xs select-none transition-colors ${
        isDark ? 'bg-black border-[#2d2d2d] text-[#b3b3b3]' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded bg-white p-0.5 border border-[#10b981]/40 overflow-hidden shrink-0">
                  <img
                    src="/sahyadri-logo.jpg"
                    alt="Sahyadri Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold tracking-wider text-base text-[#10b981]">SAHYADRI COLLEGE OF ENGINEERING & MANAGEMENT</span>
              </div>
              <p className="text-[11px] text-[#808080] leading-relaxed mb-3">
                Autonomous institution affiliated to VTU, Belagavi and approved by AICTE, New Delhi. Accredited by NAAC with 'A' Grade & NBA.
              </p>
              <p className="text-[11px] text-[#808080]">
                Sahyadri Campus, Adyar, Mangaluru, Karnataka - 575007
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-[#10b981] mb-2 uppercase text-[10px] tracking-wider">Placement Cell</h4>
                <ul className="space-y-1.5 text-[#808080]">
                  <li>Prof. Rashmi Bhandary (Dean)</li>
                  <li>Zenken Japanese Connect</li>
                  <li>Aptitude Arena Modules</li>
                  <li>Campus Buzz Archive</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] mb-2 uppercase text-[10px] tracking-wider">Top Recruiters</h4>
                <ul className="space-y-1.5 text-[#808080]">
                  <li>Belc Co. (₹47.24 LPA)</li>
                  <li>Microsoft (₹40.0 LPA)</li>
                  <li>IMV Corp (₹36.04 LPA)</li>
                  <li>Adobe (₹27.7 LPA)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#10b981] mb-2 uppercase text-[10px] tracking-wider">Helpline & Support</h4>
                <ul className="space-y-1.5 text-[#808080]">
                  <li>Phone: +91-824-2277222</li>
                  <li>Email: placements@sahyadri.edu.in</li>
                  <li>Web: <a href="https://sahyadri.edu.in" target="_blank" rel="noreferrer" class="text-white hover:text-[#10b981] underline font-semibold inline-flex items-center gap-1">sahyadri.edu.in <ExternalLink className="w-3 h-3" /></a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2d2d2d]/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#808080]">
            <p>© 2026 Sahyadri College of Engineering & Management. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Exam Session Proctored Modal */}
      {activeExamId && (
        <ExamSessionModal
          examId={activeExamId}
          onClose={() => setActiveExamId(null)}
          onExamCompleted={fetchData}
        />
      )}

      {/* AI Assistant Admin Call Modal */}
      <AdminCallModal
        isOpen={adminCallOpen}
        onClose={() => setAdminCallOpen(false)}
      />

      {/* ElevenLabs Voice Agent Modal */}
      <VoiceAgentModal
        isOpen={voiceAgentOpen}
        onClose={() => setVoiceAgentOpen(false)}
      />

      {/* Placement Chatbot Drawer (Gemini 2.5 Flash) */}
      <AIChatbotDrawer
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        onLaunchAdminCall={() => setAdminCallOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
