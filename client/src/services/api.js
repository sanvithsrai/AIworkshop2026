// API service client for Sahyadri Placement Hub

const API_BASE = '/api';

// Retrieve stored token
const getToken = () => localStorage.getItem('sahyadri_auth_token');

// Helper for authenticated fetch
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  googleLogin: (googleData) => request('/auth/google', { method: 'POST', body: JSON.stringify(googleData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Exams
  getExams: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/exams${query ? `?${query}` : ''}`);
  },
  getExamById: (id) => request(`/exams/${id}`),
  submitExam: (id, submission) => request(`/exams/${id}/submit`, { method: 'POST', body: JSON.stringify(submission) }),
  getMyHistory: () => request('/exams/history/my'),
  createExam: (examData) => request('/exams', { method: 'POST', body: JSON.stringify(examData) }),
  deleteExam: (id) => request(`/exams/${id}`, { method: 'DELETE' }),

  // Question Management (Faculty)
  getAdminQuestions: (examId) => request(`/exams/admin/questions${examId ? `?exam_id=${examId}` : ''}`),
  createQuestion: (qData) => request('/exams/questions', { method: 'POST', body: JSON.stringify(qData) }),
  updateQuestion: (qId, qData) => request(`/exams/questions/${qId}`, { method: 'PUT', body: JSON.stringify(qData) }),
  deleteQuestion: (qId) => request(`/exams/questions/${qId}`, { method: 'DELETE' }),

  // Newsletters
  getNewsletters: () => request('/newsletters'),
  getNewsletterById: (id) => request(`/newsletters/${id}`),
  createNewsletter: (nlData) => request('/newsletters', { method: 'POST', body: JSON.stringify(nlData) }),
  deleteNewsletter: (id) => request(`/newsletters/${id}`, { method: 'DELETE' }),

  // Jobs
  getJobs: () => request('/jobs'),
  applyJob: (id) => request(`/jobs/${id}/apply`, { method: 'POST' }),
  createJob: (jobData) => request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),

  // Study Materials
  getMaterials: (category) => request(`/materials${category ? `?category=${category}` : ''}`),
  createMaterial: (data) => request('/materials', { method: 'POST', body: JSON.stringify(data) }),

  // Recruiters
  getRecruiters: () => request('/recruiters'),
  createRecruiter: (data) => request('/recruiters', { method: 'POST', body: JSON.stringify(data) }),

  // Hackathons & Live News
  getHackathons: () => request('/hackathons'),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),

  // AI & Voice
  chatAI: (message, conversationHistory) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message, conversationHistory }) }),
  generateVoice: (text, voiceId) => request('/ai/voice', { method: 'POST', body: JSON.stringify({ text, voiceId }) }),
  callAdmin: (callDetails) => request('/ai/admin-call', { method: 'POST', body: JSON.stringify(callDetails) }),
};

