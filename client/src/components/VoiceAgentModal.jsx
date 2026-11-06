import React, { useState, useRef } from 'react';
import { Volume2, Mic, MicOff, Play, Square, X, Sparkles, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function VoiceAgentModal({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('Welcome to Sahyadri Placement and Career Portal for Engineers (SPACE). How can I guide your preparation today?');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef(null);

  const sampleVoicePrompts = [
    "Tell me about the Belc Japan 47 LPA placement process.",
    "What are the best tips to clear aptitude round in 30 minutes?",
    "Which companies are visiting Sahyadri campus next month?"
  ];

  const handleSpeak = async (customText) => {
    const textToSpeak = customText || inputText;
    if (!textToSpeak.trim()) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.generateVoice(textToSpeak.slice(0, 280));

      if (res.audioUrl) {
        const audio = new Audio(res.audioUrl);
        audioRef.current = audio;
        setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        audio.play();
      } else {
        throw new Error('No audio returned');
      }
    } catch (err) {
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSpeak(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-[#1c1c1c] border-b border-[#2d2d2d] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>SPACE Voice Agent</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold uppercase">
                  ElevenLabs
                </span>
              </h3>
              <p className="text-[10px] text-[#808080]">Sahyadri Placement & Career Portal for Engineers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#808080] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer & Controls */}
        <div className="p-6 flex flex-col items-center text-center">

          {/* Animated Glowing Ring & Visualizer */}
          <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#222222] via-[#10b981] to-transparent ${isPlaying ? 'animate-spin' : ''
              } opacity-50 blur-lg`} />
            <div className="relative w-24 h-24 rounded-full bg-black border-2 border-[#10b981] flex items-center justify-center shadow-2xl">
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  {[20, 35, 50, 30, 45].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#10b981] rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDuration: `${0.3 + i * 0.1}s` }}
                    />
                  ))}
                </div>
              ) : (
                <Volume2 className="w-10 h-10 text-[#10b981]" />
              )}
            </div>
          </div>

          <p className="text-xs text-[#b3b3b3] mb-4">
            {isPlaying ? 'Playing ElevenLabs Audio Stream...' : 'Type or speak your placement question'}
          </p>

          {/* Quick Voice Questions */}
          <div className="space-y-1.5 w-full mb-4 text-left">
            {sampleVoicePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => { setInputText(p); handleSpeak(p); }}
                className="w-full text-left p-2 rounded-lg bg-[#1c1c1c] hover:bg-[#10b981]/15 border border-[#2d2d2d] hover:border-[#10b981]/40 text-[11px] text-[#b3b3b3] hover:text-white transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Text Input */}
          <textarea
            rows={2}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-[#181818] border border-[#333333] text-xs text-white outline-none focus:border-[#10b981] mb-4"
            placeholder="Type text for ElevenLabs voice generation..."
          />

          {/* Actions */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${isListening ? 'bg-[#10b981] text-white border-[#10b981] animate-pulse' : 'bg-[#2d2d2d] text-white border-[#5a5a5a] hover:bg-[#10b981]'
                }`}
              title="Voice Input (Mic)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleSpeak()}
              disabled={loading}
              className="flex-1 btn-netflix-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Synthesizing Voice...</span>
              ) : isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Speech</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Speak via ElevenLabs</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
