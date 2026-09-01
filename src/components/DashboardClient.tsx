"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope, HeartPulse, ChevronRight, ClipboardList, RefreshCw,
  AlertCircle, User, Sparkles, Languages, HelpCircle, LogOut,
  ChevronDown, Database, Home, CheckCircle2, Mic, MessageSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ClinicalResult, SavedNote, ScenarioPreset, UserProfile } from "@/types";
import PresetSelector from "@/components/PresetSelector";
import ResultView from "@/components/ResultView";
import NoteHistory from "@/components/NoteHistory";
import TriageTrendsCard from "@/components/TriageTrendsCard";
import { VoiceInputControl } from "@/components/VoiceInputControl";
import { SupportChatWidget } from "@/components/SupportChatWidget";
import { signOutUser, fetchUserNotes, insertNote, deleteNote, reviewNote } from "@/lib/auth-utils";

interface DashboardClientProps {
  initialUser: UserProfile;
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const router = useRouter();
  const currentUser = initialUser;
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Intake Form State
  const [rawInput, setRawInput] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [selectedPresetTitle, setSelectedPresetTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClinicalResult | null>(null);

  // Note History
  const [history, setHistory] = useState<SavedNote[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>();

  // Doctor review / sign-off state for the note currently on screen
  const [reviewedBy, setReviewedBy] = useState<string | null>(null);
  const [reviewedAt, setReviewedAt] = useState<string | null>(null);

  // Load notes on mount
  useEffect(() => {
    fetchUserNotes(currentUser.id).then(setHistory);
  }, [currentUser.id]);

  const navigate = (route: string) => {
    setUserDropdownOpen(false);
    router.push(route);
  };

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setRawInput(preset.text);
    setPatientName(preset.patientName);
    setPatientAge(preset.patientAge);
    setPatientGender(preset.patientGender);
    setSelectedPresetTitle(preset.title);
    setError(null);
  };

  const handleClearInputs = () => {
    setRawInput("");
    setPatientName("");
    setPatientAge("");
    setPatientGender("Male");
    setSelectedPresetTitle("");
    setError(null);
    setResult(null);
    setIsSaved(false);
    setActiveHistoryId(undefined);
    setReviewedBy(null);
    setReviewedAt(null);
  };

  const handleGenerateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim()) {
      setError("Please paste, type, or dictate some patient symptoms or conversation before generating.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setIsSaved(false);
    setActiveHistoryId(undefined);
    setReviewedBy(null);
    setReviewedAt(null);

    try {
      const response = await fetch("/api/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawInput,
          patientName: patientName.trim(),
          patientAge: patientAge.trim(),
          patientGender,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process the patient conversation.");
      setResult(data);

      const newEncounter: SavedNote = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: currentUser.id,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true,
        }),
        rawInput,
        result: data,
        patientName: patientName.trim() || "Anonymous Patient",
        patientAge: patientAge.trim() || "Age N/A",
        patientGender,
      };

      // insertNote returns the real DB id so the doctor sign-off can target this row
      const dbId = await insertNote(newEncounter, currentUser.id);
      const savedEncounter: SavedNote = { ...newEncounter, id: dbId || newEncounter.id };
      setHistory((prev) => [savedEncounter, ...prev.filter((n) => n.id !== savedEncounter.id)]);
      setIsSaved(true);
      setActiveHistoryId(savedEncounter.id);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while communicating with the CarePen AI system.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result) return;
    const newEncounter: SavedNote = {
      id: activeHistoryId || Math.random().toString(36).substring(2, 9),
      user_id: currentUser.id,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
      }),
      rawInput,
      result,
      patientName: patientName.trim() || "Anonymous Patient",
      patientAge: patientAge.trim() || "Age N/A",
      patientGender,
    };
    const dbId = await insertNote(newEncounter, currentUser.id);
    const savedEncounter: SavedNote = { ...newEncounter, id: dbId || newEncounter.id };
    setHistory((prev) => [savedEncounter, ...prev.filter((n) => n.id !== savedEncounter.id)]);
    setIsSaved(true);
    setActiveHistoryId(savedEncounter.id);
  };

  const handleConfirmReview = async (doctorName: string): Promise<boolean> => {
    if (!activeHistoryId) return false;
    const res = await reviewNote(activeHistoryId, doctorName);
    if (!res.reviewedBy || !res.reviewedAt) return false;
    setReviewedBy(res.reviewedBy);
    setReviewedAt(res.reviewedAt);
    setHistory((prev) =>
      prev.map((n) =>
        n.id === activeHistoryId ? { ...n, reviewedBy: res.reviewedBy, reviewedAt: res.reviewedAt } : n
      )
    );
    return true;
  };

  const handleSelectHistoryNote = (note: SavedNote) => {
    setResult(note.result);
    setRawInput(note.rawInput);
    setPatientName(note.patientName || "");
    setPatientAge(note.patientAge || "");
    setPatientGender(note.patientGender || "Male");
    setActiveHistoryId(note.id);
    setIsSaved(true);
    setReviewedBy(note.reviewedBy || null);
    setReviewedAt(note.reviewedAt || null);
    setError(null);
    setSelectedPresetTitle("");
  };

  const handleClearHistory = () => {
    setHistory([]);
    if (activeHistoryId) {
      setIsSaved(false);
      setActiveHistoryId(undefined);
    }
  };

  const handleDeleteHistoryNote = async (id: string) => {
    await deleteNote(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeHistoryId === id) {
      setIsSaved(false);
      setActiveHistoryId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-sky-50/30 to-slate-100 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Stethoscope className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">CarePen AI</span>
                <span className="bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shrink-0 tracking-wider">Clinical Scribe</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-none">AI Assistant for Pakistani Clinics</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-teal-50/80 px-3 py-1.5 rounded-xl border border-teal-200">
              <Languages className="w-3.5 h-3.5 text-teal-700" />
              <span>Voice & Text: Urdu • Roman Urdu • English</span>
            </div>
            <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-bold transition-colors cursor-pointer">
              <Home className="w-3.5 h-3.5" /><span>Landing Page</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2.5 bg-slate-50 hover:bg-teal-50 text-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 transition-all cursor-pointer shadow-2xs">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`}
                  alt={currentUser.fullName || "Doctor"}
                  className="w-7 h-7 rounded-xl object-cover bg-teal-100"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">{currentUser.fullName}</div>
                  <div className="text-[10px] text-teal-700 font-medium leading-none truncate max-w-[140px] mt-0.5">{currentUser.clinicName || currentUser.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-3xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
                    <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-teal-800 font-semibold mt-1">{currentUser.clinicName}</p>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <button onClick={() => navigate("/")} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
                      <Home className="w-3.5 h-3.5 text-slate-400" /><span>Product Landing Page</span>
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer font-bold">
                      <LogOut className="w-3.5 h-3.5" /><span>Sign Out of Workspace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-50/80 via-sky-50/60 to-white rounded-3xl border border-teal-100 shadow-sm p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Clinical Scribe & Triage Intake Console</h2>
                <span className="bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-0.5 rounded-full">{currentUser.clinicName}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Type, paste, or use the <strong>microphone</strong> to dictate patient complaints in{" "}
                <strong className="text-slate-900">Urdu (اردو), Roman Urdu, or English</strong>. CarePen AI extracts clinical indicators, assigns urgency triage tiers, and outputs EHR-ready clinical notes.
              </p>
            </div>
          </div>
        </div>

        {/* Triage Trends — the doctor's own notes from the past 7 days */}
        <TriageTrendsCard userId={currentUser.id} refreshKey={history.length} />

        <PresetSelector onSelectPreset={handleSelectPreset} selectedTitle={selectedPresetTitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-100 text-teal-800 rounded-xl"><HeartPulse className="w-4 h-4" /></div>
                  <h3 className="text-sm font-bold text-slate-800">Patient Intake Terminal</h3>
                </div>
                <button type="button" onClick={handleClearInputs} className="text-xs text-slate-400 hover:text-slate-700 font-bold transition-colors flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /><span>Reset Form</span>
                </button>
              </div>

              <form onSubmit={handleGenerateNote} className="space-y-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-teal-600" /><span>Patient Metadata (Optional)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Patient Name</label>
                      <input type="text" placeholder="e.g., Muhammad Ali" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">Age</label>
                        <input type="text" placeholder="e.g., 4 Years" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600 block">Gender</label>
                        <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full px-2 py-2 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 cursor-pointer font-medium">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Patient Complaint (Voice or Text)</label>
                    <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">Urdu • Roman Urdu • English</span>
                  </div>
                  <VoiceInputControl currentText={rawInput} onTranscriptChange={(newText) => setRawInput(newText)} disabled={loading} />
                  <textarea rows={7} required
                    placeholder={"Type, paste, or click 'Voice Input' above to dictate symptoms...\nE.g., 'Do din se bukhar hai aur jism toot raha hai. Ankhon k peeche shaded dard hai aur ultiyan bhi aa rahi hain.'"}
                    value={rawInput} onChange={(e) => setRawInput(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-2xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600 font-sans leading-relaxed resize-none transition-all shadow-inner" />
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                    <HelpCircle className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>Colloquial Pakistani terms will map directly to standardized medical terms.</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || !rawInput.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-sm transition-all duration-200 cursor-pointer active:scale-95 shadow-md ${
                    loading ? "bg-teal-100 text-teal-800 cursor-not-allowed" : "bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white shadow-teal-500/20"
                  }`}>
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin text-teal-800" /><span>Synthesizing Clinical Note...</span></>
                  ) : (
                    <><Sparkles className="w-4 h-4 text-teal-200" /><span>Generate Clinical Note</span></>
                  )}
                </button>
              </form>
            </div>

            <NoteHistory history={history} onSelectNote={handleSelectHistoryNote} onClearHistory={handleClearHistory} onDeleteNote={handleDeleteHistoryNote} activeId={activeHistoryId} />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">Clinical Analysis Error</h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">{error}</p>
                    <p className="text-[10px] text-rose-500 mt-2">Please check that your GEMINI_API_KEY is configured.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col">
              {loading ? (
                <div className="flex-1 min-h-[420px] bg-white border border-teal-100 rounded-3xl flex flex-col items-center justify-center p-8 space-y-6 text-center shadow-sm">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
                    <Stethoscope className="w-6 h-6 text-teal-600 absolute top-5 left-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-slate-800">Synthesizing Patient Encounter</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">Parsing Pakistani language descriptors, establishing symptom timeline, and structuring clinical EHR note...</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold text-slate-500">
                    <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl">1. Translating Urdu / English</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl">2. Evaluating Triage Severity</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl">3. Formatting EHR Record</span>
                  </div>
                </div>
              ) : result ? (
                <ResultView result={result} patientName={patientName} patientAge={patientAge} patientGender={patientGender} onSave={handleSaveToHistory} isSaved={isSaved} reviewedBy={reviewedBy} reviewedAt={reviewedAt} onConfirmReview={handleConfirmReview} />
              ) : (
                <div className="flex-1 min-h-[420px] bg-white border border-teal-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-4 shadow-xs">
                    <ClipboardList className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-black text-slate-800">Awaiting Patient Intake Details</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">Select a quick preset above or speak/type your patient&apos;s symptoms in the intake console to generate a complete clinical summary.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-md w-full">
                    <div className="p-3.5 bg-teal-50/50 border border-teal-100 rounded-2xl text-left space-y-1">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600" /><span>Urdu & English Voice Scribe</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Continuous speech-to-text dictation handles mixed Urdu and English clinical complaints.</p>
                    </div>
                    <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-2xl text-left space-y-1">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /><span>Urgency Triage & Patient Help</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Automatic Low/Medium/High triage flags and 1-click patient Urdu translation notes.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SupportChatWidget />

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
          <span>&copy; {new Date().getFullYear()} CarePen AI. Designed for clinics and healthcare teams in Pakistan.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="hover:text-teal-700 transition-colors cursor-pointer">Landing Page</button>
            <span>•</span>
            <span className="cursor-help" title="CarePen AI parses clinical languages to support physician charting. Always verify output before committing to EMR.">Clinician Disclaimer</span>
            <span>•</span>
            <span className="font-bold text-slate-500">OPD & Patient Safe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
