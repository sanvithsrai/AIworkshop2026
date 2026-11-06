import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal, Calendar, Trophy, ExternalLink, Globe, Sparkles, Newspaper } from 'lucide-react';

export default function HackathonsSection({ hackathonsData }) {
  const { isDark } = useTheme();
  const hackathons = hackathonsData?.hackathons || [];
  const liveNews = hackathonsData?.liveNews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] text-xs font-bold uppercase mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Competitive Coding & Innovation Arena</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            UPCOMING HACKATHONS
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
            Nearby coastal hackathons, college campus events, and national grand challenges with direct PPI recruitment.
          </p>
        </div>
      </div>

      {/* Featured Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {hackathons.map(hack => (
          <div
            key={hack.id}
            className={`p-6 rounded-2xl flex flex-col justify-between group transition-all ${
              isDark 
                ? 'card-feature-gradient border border-[#5a5a5a]/30 hover:border-[#10b981]' 
                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#10b981]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  hack.category === 'Regional' 
                    ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30' 
                    : 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                }`}>
                  {hack.category} Challenge
                </span>

                <span className={`text-xs font-mono ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  {hack.mode}
                </span>
              </div>

              <h3 className={`text-lg font-black transition-colors mb-1 ${
                isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
              }`}>
                {hack.title}
              </h3>
              <p className={`text-xs mb-4 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                Organized by: <strong className={isDark ? 'text-[#b3b3b3]' : 'text-slate-700'}>{hack.organizer}</strong>
              </p>

              <div className={`grid grid-cols-2 gap-2 p-3 rounded-lg mb-4 text-xs border ${
                isDark ? 'bg-black/40 border-[#2d2d2d]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Dates</span>
                  <span className={`font-semibold flex items-center gap-1 mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{hack.dates}</span>
                  </span>
                </div>
                <div>
                  <span className={`block text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Prize Pool</span>
                  <span className="font-bold text-[#10b981] flex items-center gap-1 mt-0.5">
                    <Trophy className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{hack.prize_pool}</span>
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
                {hack.description}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-[#2d2d2d]' : 'border-slate-200'
            }`}>
              <span className={`text-[11px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                {hack.tags}
              </span>

              <a
                href={hack.registration_link}
                target="_blank"
                rel="noreferrer"
                className="btn-netflix-primary px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5 shadow-md"
              >
                <span className="text-white">Register Now</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Live NewsData.io Feeds Section */}
      {liveNews.length > 0 && (
        <div className={`mt-8 pt-8 border-t ${isDark ? 'border-[#2d2d2d]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-4 h-4 text-[#10b981]" />
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Live Global Hackathon & Tech Feeds
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold uppercase">
              NewsData.io Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveNews.map((news, idx) => (
              <a
                key={news.id || idx}
                href={news.link}
                target="_blank"
                rel="noreferrer"
                className={`p-4 rounded-xl block group border transition-all ${
                  isDark 
                    ? 'card-feature-gradient border-[#2d2d2d] hover:border-[#10b981]' 
                    : 'bg-white border-slate-200 hover:border-[#10b981] shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`text-[10px] mb-1 flex items-center justify-between ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
                  <span>{news.source_id || 'Tech News'}</span>
                  <span>{news.pubDate?.slice(0, 10)}</span>
                </div>
                <h4 className={`text-xs font-bold transition-colors line-clamp-2 mb-2 leading-snug ${
                  isDark ? 'text-white group-hover:text-[#10b981]' : 'text-slate-900 group-hover:text-[#10b981]'
                }`}>
                  {news.title}
                </h4>
                <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-[#808080]' : 'text-slate-600'}`}>
                  {news.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
