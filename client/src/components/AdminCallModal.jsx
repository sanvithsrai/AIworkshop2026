import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  X,
  Radio
} from 'lucide-react';

export default function AdminCallModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [callState, setCallState] = useState('idle'); // 'idle' | 'dialing' | 'connected' | 'ended'
  const [queryTopic, setQueryTopic] = useState('Seeking Japanese recruitment drive eligibility details (Belc / IMV)');
  const [callData, setCallData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const sampleTopics = [
    "Seeking Japanese recruitment drive eligibility details (Belc / IMV)",
    "Query regarding Microsoft & Cohesity online assessment cutoff",
    "Japanese Language JLPT N5 training schedule at Sahyadri",
    "Requesting resume verification by Placement Dean"
  ];

  // Call duration counter
  useEffect(() => {
    let timer = null;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Handle progressive transcript steps
  useEffect(() => {
    if (callState === 'connected' && callData?.transcript) {
      const stepTimer = setInterval(() => {
        setActiveStep(prev => {
          if (prev < callData.transcript.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 3500);

      return () => clearInterval(stepTimer);
    }
  }, [callState, callData]);

  const handleStartCall = async () => {
    setCallState('dialing');
    setActiveStep(0);

    try {
      const res = await api.callAdmin({
        query: queryTopic,
        studentName: user?.name || 'Sanvith Rai',
        usn: user?.usn || '4SF22CI048',
        branch: user?.branch || 'CSE'
      });

      setCallData(res);

      // Play voice announcement after brief ringing
      setTimeout(() => {
        setCallState('connected');

        // Play audio synthesized greeting
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            `Connecting you live with the Sahyadri Placement Desk. Student ${user?.name || 'Sanvith'}, your call has been patched through.`
          );
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }, 2500);

    } catch (err) {
      console.error('Call initiation failed:', err);
      setCallState('ended');
    }
  };

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      onClose();
    }, 1200);
  };

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">

        {/* Modal Top Bar */}
        <div className="bg-[#1c1c1c] border-b border-[#2d2d2d] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e50914] flex items-center justify-center text-white shadow-md">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">SPACE Placement Admin Call Assistant</h3>
              <p className="text-[10px] text-[#808080]">Direct Bridge to Sahyadri SPACE Placement Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#808080] hover:text-white hover:bg-[#2d2d2d]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Stage Body */}
        <div className="p-6 flex flex-col items-center justify-center text-center">

          {callState === 'idle' && (
            <div className="w-full">
              <div className="w-16 h-16 rounded-full bg-[#192247] border border-[#5a5a5a] flex items-center justify-center mx-auto mb-4 text-[#e50914] shadow-xl">
                <Building2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-white mb-1">
                Sahyadri Placement & Training Cell
              </h4>
              <p className="text-xs text-[#808080] mb-6">
                Official Helpline: <strong className="text-white">+91-824-2277222</strong> (Prof. Rashmi Bhandary's Office)
              </p>

              <div className="text-left mb-6">
                <label className="text-xs font-semibold text-[#808080] block mb-2">
                  Select or type the topic for the AI Assistant to triage:
                </label>
                <div className="space-y-1.5 mb-3">
                  {sampleTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => setQueryTopic(topic)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${queryTopic === topic
                        ? 'bg-[#e50914]/20 border-[#e50914] text-white font-bold'
                        : 'bg-[#1c1c1c] border-[#2d2d2d] text-[#b3b3b3] hover:text-white'
                        }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={queryTopic}
                  onChange={e => setQueryTopic(e.target.value)}
                  placeholder="Or type custom inquiry..."
                  className="w-full p-2.5 rounded-lg bg-[#181818] border border-[#333333] text-xs text-white outline-none focus:border-[#e50914]"
                />
              </div>

              <button
                onClick={handleStartCall}
                className="w-full btn-netflix-primary py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#e50914]/25"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Administration & Patch Line</span>
              </button>
            </div>
          )}

          {callState === 'dialing' && (
            <div className="py-8">
              <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-30"></span>
                <div className="w-20 h-20 rounded-full bg-[#e50914] flex items-center justify-center shadow-2xl">
                  <PhoneCall className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-white mb-1">
                Dialing Sahyadri Placement Desk...
              </h4>
              <p className="text-xs text-[#808080] font-mono">
                +91-824-2277222 (SPACE Placement Cell, Sahyadri)
              </p>
              <p className="text-[11px] text-[#e50914] mt-4 font-semibold animate-pulse">
                AI Assistant establishing caller triage...
              </p>
            </div>
          )}

          {callState === 'connected' && (
            <div className="w-full">
              {/* Call Active Status Bar */}
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-[#2d2d2d] mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e50914]"></span>
                  </span>
                  <span className="text-[#e50914] font-bold">FORWARDED LIVE</span>
                </div>
                <div className="font-mono text-sm font-bold text-white">
                  {formatCallTime(callDuration)}
                </div>
              </div>

              {/* Sound Wave Animation Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-12 mb-6">
                {[40, 75, 90, 50, 100, 60, 85, 45, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#e50914] rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.4 + (i % 3) * 0.2}s`
                    }}
                  />
                ))}
              </div>

              {/* Live Transcript Stream */}
              <div className="bg-black/50 p-4 rounded-xl border border-[#2d2d2d] text-left max-h-48 overflow-y-auto space-y-3 mb-6 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#808080] block mb-1">
                  Live Conversation Transcript:
                </span>
                {callData?.transcript?.slice(0, activeStep + 1).map((step, idx) => (
                  <div key={idx} className="border-l-2 border-[#e50914] pl-3 py-0.5">
                    <div className="flex items-center justify-between text-[10px] text-[#808080] mb-0.5">
                      <strong className="text-white">{step.speaker}</strong>
                      <span className="font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#b3b3b3] leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* In-Call Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border transition-colors ${isMuted ? 'bg-[#e50914] text-white border-[#e50914]' : 'bg-[#2d2d2d] text-white border-[#5a5a5a] hover:bg-[#414141]'
                    }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleEndCall}
                  className="btn-netflix-primary px-6 py-3 rounded-full text-white font-bold text-xs flex items-center gap-2 shadow-xl"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          )}

          {callState === 'ended' && (
            <div className="py-8">
              <CheckCircle2 className="w-16 h-16 text-[#e50914] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-1">Call Completed</h4>
              <p className="text-xs text-[#808080]">
                Inquiry logged in Placement Admin Desk. Thank you for connecting.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
