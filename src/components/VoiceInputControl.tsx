"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, AlertCircle, Sparkles, Languages, Check, X } from "lucide-react";

interface VoiceInputControlProps {
  onTranscriptChange: (text: string) => void;
  currentText: string;
  disabled?: boolean;
}

export const VoiceInputControl: React.FC<VoiceInputControlProps> = ({
  onTranscriptChange,
  currentText,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"ur-PK" | "en-US">("ur-PK");
  const [interimText, setInterimText] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang; // 'ur-PK' or 'en-US'

      let accumulated = currentText ? currentText.trim() + " " : "";

      recognition.onstart = () => {
        setIsListening(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((sec) => sec + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let finalSegment = "";
        let interimSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += transcript + " ";
          } else {
            interimSegment += transcript;
          }
        }

        if (finalSegment) {
          accumulated += finalSegment;
          onTranscriptChange(accumulated.trim());
        }
        setInterimText(interimSegment);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser.");
        } else if (event.error === "no-speech") {
          // Ignore silence timeout
        } else {
          setErrorMessage(`Voice input error: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Error starting speech recognition:", err);
      setErrorMessage(err.message || "Failed to access microphone.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        recognitionRef.current.abort();
      }
    }
    setIsListening(false);
    setInterimText("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2" id="voice-input-control-root">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Voice control button */}
        <div className="flex items-center gap-2">
          <button
            id="voice-dictate-btn"
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isListening
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 animate-pulse ring-2 ring-rose-400 ring-offset-1"
                : "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 hover:border-teal-300"
            }`}
            title={isListening ? "Stop Voice Transcription" : "Speak patient symptoms (Urdu / English / Roman Urdu)"}
          >
            {isListening ? (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" />
                  <Mic className="w-4 h-4 relative z-10" />
                </div>
                <span>Listening ({formatTimer(recordingSeconds)}) - Click to Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-600" />
                <span>Voice Input (Urdu / English)</span>
              </>
            )}
          </button>

          {/* Voice Language Selector */}
          <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 text-[11px] font-medium border border-slate-200">
            <button
              type="button"
              id="voice-lang-ur-btn"
              onClick={() => {
                if (isListening) stopListening();
                setSelectedLang("ur-PK");
              }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                selectedLang === "ur-PK"
                  ? "bg-white text-teal-800 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              اردو / Urdu
            </button>
            <button
              type="button"
              id="voice-lang-en-btn"
              onClick={() => {
                if (isListening) stopListening();
                setSelectedLang("en-US");
              }}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                selectedLang === "en-US"
                  ? "bg-white text-teal-800 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English / Mix
            </button>
          </div>
        </div>

        {/* Status prompt */}
        {isListening && (
          <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span className="font-medium text-[11px]">Speak clearly into microphone...</span>
          </div>
        )}
      </div>

      {/* Live Interim Transcript Banner */}
      {isListening && (
        <div
          id="live-voice-interim-card"
          className="p-3 bg-gradient-to-r from-teal-50 via-sky-50 to-blue-50 border border-teal-200 rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
        >
          <Volume2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Live Speech Stream ({selectedLang === "ur-PK" ? "Urdu Pakistan" : "English"})
              </span>
              <span className="text-[10px] text-teal-600 font-mono font-bold">
                {formatTimer(recordingSeconds)}
              </span>
            </div>
            <p className="text-xs text-slate-800 italic min-h-[18px]">
              {interimText ? `"${interimText}..."` : "Listening for voice input..."}
            </p>
          </div>
        </div>
      )}

      {/* Error Callout */}
      {errorMessage && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-relaxed">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-amber-500 hover:text-amber-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
