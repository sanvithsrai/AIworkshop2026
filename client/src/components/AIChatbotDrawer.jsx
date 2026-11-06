import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Bot, Send, X, Volume2, Sparkles, User, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export default function AIChatbotDrawer({ isOpen, onClose, onLaunchAdminCall }) {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your SPACE AI Copilot for Sahyadri Placement and Career Portal for Engineers, powered by Gemini. Ask me about Japanese drives (Belc ₹47.24 LPA, IMV), Microsoft OA rounds, Aptitude shortcuts, or click 'Call Admin' to patch a call with placement faculty!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "How do I prepare for Belc Japan (47.24 LPA)?",
    "What is the OA pattern for Microsoft & Cohesity?",
    "Tips for cracking Aptitude Arena speed math?",
    "Patch a call with Placement Office"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    if (query.toLowerCase().includes('call') && (query.toLowerCase().includes('admin') || query.toLowerCase().includes('office'))) {
      onLaunchAdminCall();
      onClose();
      return;
    }

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.slice(1, -1);
      const res = await api.chatAI(query, history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a brief connection delay with the AI service. In general for Sahyadri placements: maintain CGPA >= 7.0, complete the Japanese JLPT N5 tests in the Test Corner for international offers, and practice DSA problems!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text, idx) => {
    if (speakingIdx === idx) {
      window.speechSynthesis?.cancel();
      setSpeakingIdx(null);
      return;
    }

    setSpeakingIdx(idx);

    try {
      // Try ElevenLabs voice API first
      const voiceRes = await api.generateVoice(text.slice(0, 250));
      if (voiceRes.audioUrl) {
        const audio = new Audio(voiceRes.audioUrl);
        audio.onended = () => setSpeakingIdx(null);
        audio.play();
        return;
      }
    } catch (e) {
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setSpeakingIdx(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeakingIdx(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l ${isDark ? 'bg-[#0f0f0f] border-[#262626]' : 'bg-white border-slate-200'
      }`}>

      {/* Header */}
      <div className={`border-b p-4 flex items-center justify-between ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-slate-50 border-slate-200'
        }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>SPACE AI Copilot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                Gemini 2.5
              </span>
            </h3>
            <p className={`text-[10px] ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>Sahyadri Placement & Career Portal for Engineers</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1 rounded-full ${isDark ? 'text-[#808080] hover:text-white hover:bg-[#262626]' : 'text-slate-400 hover:text-black hover:bg-slate-200'
            }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
        {messages.map((msg, idx) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-[#10b981] text-white' : isDark ? 'bg-[#262626] text-[#b3b3b3]' : 'bg-slate-200 text-slate-700'
                }`}>
                {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] p-3 rounded-2xl ${isBot
                  ? isDark ? 'bg-[#181818] border border-[#2d2d2d] text-white' : 'bg-slate-100 border border-slate-200 text-slate-900'
                  : 'bg-[#10b981] text-white font-medium shadow-md'
                }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {isBot && (
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${isDark ? 'border-[#2d2d2d]/60 text-[#808080]' : 'border-slate-200 text-slate-500'
                    }`}>
                    <span>SPACE Placement Advisor</span>
                    <button
                      onClick={() => handleSpeak(msg.content, idx)}
                      className={`hover:text-[#10b981] flex items-center gap-1 ${speakingIdx === idx ? 'text-[#10b981] font-bold animate-pulse' : ''
                        }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{speakingIdx === idx ? 'Playing Audio' : 'Speak'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className={`flex items-center gap-2 text-xs italic py-2 ${isDark ? 'text-[#808080]' : 'text-slate-500'}`}>
            <div className="w-3 h-3 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
            <span>Consulting Sahyadri Placement knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills */}
      <div className={`px-3 py-2 border-t overflow-x-auto no-scrollbar flex items-center gap-1.5 ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-slate-50 border-slate-200'
        }`}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] transition-colors border ${isDark
                ? 'bg-[#1f1f1f] hover:bg-[#282828] text-[#b3b3b3] hover:text-white border-[#333333]'
                : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-black border-slate-300 shadow-sm'
              }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className={`p-3 border-t ${isDark ? 'bg-[#141414] border-[#262626]' : 'bg-slate-50 border-slate-200'
        }`}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about recruiters, Japanese tests, cutoffs..."
            className={`flex-1 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#10b981] border ${isDark ? 'bg-[#0f0f0f] border-[#333333] text-white placeholder-[#808080]' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-[#10b981] text-white hover:bg-[#059669] disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

    </div>
  );
}
