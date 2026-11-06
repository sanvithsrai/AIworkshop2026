import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, ExternalLink, MapPin, Calendar, CheckCircle2, Plus, X, Search, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function JobsPortal({ jobs, onRefresh }) {
  const { user, isFaculty } = useAuth();
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applyingId, setApplyingId] = useState(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [description, setDescription] = useState('');

  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase()) ||
    j.eligibility.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async (job) => {
    try {
      setApplyingId(job.id);
      await api.applyJob(job.id);
      window.open(job.apply_url, '_blank');
      if (onRefresh) onRefresh();
    } catch (err) {
      window.open(job.apply_url, '_blank');
    } finally {
      setApplyingId(null);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.createJob({
        company,
        role,
        ctc,
        location,
        deadline,
        apply_url: applyUrl,
        eligibility,
        description
      });
      setShowCreateModal(false);
      setCompany('');
      setRole('');
      setCtc('');
      setApplyUrl('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to add job: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-bold uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Placement Cell Verified Openings</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            VERIFIED OPPORTUNITIES
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
            Direct authenticated application links from our verified corporate recruitment partners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isFaculty && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-netflix-primary px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="text-white">Post Verified Job</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role (e.g. Microsoft, Belc, Tokyo, SDE)..."
            className={`w-full rounded-lg px-4 py-2.5 pl-10 text-xs focus:border-[#10b981] outline-none border ${
              isDark 
                ? 'bg-[#181818] border-[#2d2d2d] text-white placeholder-[#808080]' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-[#808080]' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className={`p-6 rounded-2xl flex flex-col justify-between group transition-all ${
              isDark 
                ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#10b981]' 
                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#10b981]'
            }`}
          >
            <div>
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-lg font-black transition-colors ${
                      isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                    }`}>
                      {job.company}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase">
                      Verified
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}`}>
                    {job.role}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#10b981] block">
                    {job.ctc}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    {job.type || 'Full Time'}
                  </span>
                </div>
              </div>

              {/* Badges / Specs */}
              <div className={`flex flex-wrap items-center gap-3 text-xs mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>{job.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-rose-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {job.deadline}</span>
                </span>
              </div>

              {/* Eligibility */}
              <div className={`p-3 rounded-lg text-xs mb-4 border ${
                isDark ? 'bg-black/40 border-[#2d2d2d] text-[#b3b3b3]' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <strong className={`block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Eligibility Criteria:</strong>
                {job.eligibility}
              </div>

              {/* Description */}
              <p className={`text-xs line-clamp-2 leading-relaxed mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                {job.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className={`pt-3 border-t flex items-center justify-between ${
              isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
            }`}>
              {job.applied ? (
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied via Sahyadri</span>
                </span>
              ) : (
                <span className={`text-[11px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  Direct Verification Active
                </span>
              )}

              <button
                onClick={() => handleApply(job)}
                disabled={applyingId === job.id}
                className="btn-netflix-primary px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5 shadow-md"
              >
                <span className="text-white">{job.applied ? 'Re-visit Portal' : 'Apply Now'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Job Modal (Faculty) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl ${
            isDark ? 'bg-[#141414] border-[#2d2d2d]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Post Verified Job Opening</h3>
              <button onClick={() => setShowCreateModal(false)} className={isDark ? 'text-[#808080] hover:text-white' : 'text-slate-400 hover:text-black'}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Cohesity, Google, Belc"
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Job Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Software Development Engineer"
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>CTC Package</label>
                  <input
                    type="text"
                    required
                    value={ctc}
                    onChange={e => setCtc(e.target.value)}
                    placeholder="₹24.0 LPA"
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Bengaluru / Tokyo"
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Application URL</label>
                  <input
                    type="url"
                    required
                    value={applyUrl}
                    onChange={e => setApplyUrl(e.target.value)}
                    placeholder="https://..."
                    className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                      isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Eligibility Criteria</label>
                <input
                  type="text"
                  required
                  value={eligibility}
                  onChange={e => setEligibility(e.target.value)}
                  placeholder="B.E CS/IS/EC, CGPA >= 7.5, No backlogs"
                  className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>Job Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key responsibilities and technical expectations..."
                  className={`w-full p-2.5 rounded border focus:border-[#10b981] outline-none ${
                    isDark ? 'bg-[#1c1c1c] border-[#5a5a5a] text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded ${
                    isDark ? 'bg-[#2d2d2d] text-white hover:bg-[#414141]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-netflix-primary px-5 py-2 rounded font-bold"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
