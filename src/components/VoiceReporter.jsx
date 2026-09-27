import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export function extractVoiceFields(text) {
  if (!text || typeof text !== 'string') {
    return { families_updated: null, families_pending: null };
  }

  // Regex patterns: "released for 12 families", "12 families released", "3 pending"
  const releasedMatch = text.match(/released\s+(?:for\s+)?(\d+)\s+families/i) || text.match(/(\d+)\s+families\s+released/i);
  const pendingMatch = text.match(/(\d+)\s+pending/i) || text.match(/pending\s+(\d+)/i);

  const families_updated = releasedMatch ? parseInt(releasedMatch[1], 10) : null;
  const families_pending = pendingMatch ? parseInt(pendingMatch[1], 10) : null;

  return { families_updated, families_pending };
}

export default function VoiceReporter({ projectId }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      } else {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';

        rec.onresult = (event) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          setIsListening(false);
        };

        rec.onerror = () => {
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported || !recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const extracted = extractVoiceFields(transcript);

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200">Voice-Based Field Update (Web Speech API)</h4>
        </div>

        {isSupported ? (
          <button
            id="record-voice-btn"
            onClick={toggleListening}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isListening ? 'Listening...' : 'Record Field Update'}</span>
          </button>
        ) : (
          <div title="Voice input not supported in this browser — try Chrome." className="text-xs text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/50 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 inline" />
            <span>Voice API unsupported in browser</span>
          </div>
        )}
      </div>

      {/* Transcript Text Box */}
      {transcript && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-200 font-mono border border-slate-800">
            "{transcript}"
          </div>

          {/* Extracted Structured Entities */}
          {(extracted.families_updated !== null || extracted.families_pending !== null) && (
            <div className="p-2.5 bg-indigo-950/40 rounded-lg border border-indigo-800/40 text-xs flex items-center space-x-4">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="space-x-3 text-slate-300">
                {extracted.families_updated !== null && (
                  <span>Families updated: <strong className="text-emerald-400">{extracted.families_updated}</strong></span>
                )}
                {extracted.families_pending !== null && (
                  <span>Families pending: <strong className="text-amber-400">{extracted.families_pending}</strong></span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
