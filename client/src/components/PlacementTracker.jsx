import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Building2, Calendar, DollarSign, Users, Award, ExternalLink, CheckCircle, Clock } from 'lucide-react';

export default function PlacementTracker({ recruitersData }) {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState('All'); // 'All' | 'Attended' | 'Upcoming'

  const allRecruiters = recruitersData?.all || [];
  const stats = recruitersData?.stats || {};

  const filtered = allRecruiters.filter(r => {
    if (filter === 'Attended') return r.status === 'Attended';
    if (filter === 'Upcoming') return r.status === 'Upcoming' || r.status === 'Ongoing';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-xs font-bold uppercase mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Recruitment Pipeline</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            RECRUITMENT CORNER
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
            Real-time tracking of 250+ annual visiting recruiters: offers rolled out and upcoming campus drives.
          </p>
        </div>

        {/* Status Filter Buttons (Red) */}
        <div className={`flex p-1 rounded-lg border self-start md:self-auto ${isDark ? 'bg-[#161616] border-[#2d2d2d]' : 'bg-slate-100 border-slate-200'
          }`}>
          {['All', 'Attended', 'Upcoming'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${filter === tab
                  ? 'bg-[#e50914] text-white shadow'
                  : isDark ? 'text-[#808080] hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {tab === 'All' ? 'All Companies' : tab === 'Attended' ? 'Drives Completed' : 'Yet to Attend'}
            </button>
          ))}
        </div>
      </div>

      {/* Recruiter Highlights Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
          <span className={`text-xs block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Companies Attended</span>
          <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalVisited || 6}</span>
          <span className="text-[11px] text-emerald-500 mt-0.5 block font-medium">Drives Completed</span>
        </div>
        <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
          <span className={`text-xs block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Upcoming / Ongoing</span>
          <span className="text-2xl font-black text-[#e50914]">{stats.upcomingCount || 2}</span>
          <span className={`text-[11px] mt-0.5 block ${isDark ? 'text-[#b3b3b3]' : 'text-slate-500'}`}>Scheduled Soon</span>
        </div>
        <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
          <span className={`text-xs block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Highest International</span>
          <span className="text-2xl font-black text-[#e50914]">47.24 LPA</span>
          <span className={`text-[11px] mt-0.5 block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Belc Co., Ltd. (Japan)</span>
        </div>
        <div className={isDark ? 'card-feature-gradient p-4 rounded-xl' : 'bg-white border border-slate-200 p-4 rounded-xl shadow-sm'}>
          <span className={`text-xs block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Average Package</span>
          <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>6.3 LPA</span>
          <span className={`text-[11px] mt-0.5 block ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>SPACE Placement Avg</span>
        </div>
      </div>

      {/* Recruiters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(company => {
          const isAttended = company.status === 'Attended';
          const isOngoing = company.status === 'Ongoing';

          return (
            <div
              key={company.id}
              className={`p-5 rounded-2xl flex flex-col justify-between group transition-all ${isDark
                  ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#e50914]'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#e50914]'
                }`}
            >
              <div>
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded flex items-center gap-1 ${isAttended
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      : isOngoing
                        ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                        : 'bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/30'
                    }`}>
                    {isAttended ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{company.status}</span>
                  </span>

                  <span className={`text-xs font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                    {company.visit_date}
                  </span>
                </div>

                {/* Company Name & Sector */}
                <h3 className={`text-lg font-bold transition-colors mb-1 ${isDark ? 'text-white group-hover:text-[#e50914]' : 'text-slate-900 group-hover:text-[#e50914]'
                  }`}>
                  {company.name}
                </h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  {company.sector}
                </p>

                {/* Key Metrics */}
                <div className={`grid grid-cols-2 gap-2 p-3 rounded-lg mb-4 text-xs border ${isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Peak Offer</span>
                    <span className="font-bold text-[#e50914] text-sm">{company.highest_package}</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Offers Made</span>
                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {company.offers_made > 0 ? `${company.offers_made} Placed` : 'Drives Soon'}
                    </span>
                  </div>
                </div>

                {/* Eligibility & Roles */}
                <div className={`space-y-1.5 text-xs mb-4 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
                  <div>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>Roles:</strong> {company.roles_offered}
                  </div>
                  <div>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>Eligibility:</strong> {company.eligibility}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className={`pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
                }`}>
                <span className={isDark ? 'text-[#808080]' : 'text-slate-500'}>Drive Coord: Placement Cell</span>
                <span className="text-[#e50914] font-bold flex items-center gap-1 group-hover:underline cursor-pointer">
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
