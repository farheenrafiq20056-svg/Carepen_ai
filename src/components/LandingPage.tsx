import React, { useState } from "react";
import {
  Stethoscope,
  Sparkles,
  ArrowRight,
  Languages,
  ShieldCheck,
  Zap,
  FileText,
  Printer,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Building2,
  Users,
  Clock,
  ExternalLink,
  Mic,
  HeartHandshake,
  BadgeCheck,
  UserCheck,
  Check,
  Star,
  PlayCircle,
  Award,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LandingPageProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  isLoggedIn,
  onQuickDemo,
}) => {
  const [activeMockIndex, setActiveMockIndex] = useState(0);

  const mockSamples = [
    {
      lang: "Roman Urdu",
      input: "Doctor sb, 3 din se tez bukhar hai aur jism toot raha hai. Ankhon k peeche shaded dard hai aur ultiyan bhi aa rahi hain.",
      badge: "High Urgency",
      badgeColor: "bg-rose-500 text-white",
      reason: "High-grade fever with retro-orbital pain and vomiting is suspicious for acute Dengue/severe infection.",
      note: "Pt presents with 3-day history of acute high-grade fever, severe myalgia, retro-orbital headache, and emesis. Recommended urgent CBC, Dengue NS1 antigen test, and oral rehydration therapy.",
    },
    {
      lang: "Urdu (اردو)",
      input: "ڈاکٹر صاحب، کل شام سے سینے میں شدید دباؤ محسوس ہو رہا ہے اور بائیں بازو میں درد جا رہا ہے، سانس لینے میں بھی تنگی ہے۔",
      badge: "High Urgency",
      badgeColor: "bg-rose-500 text-white",
      reason: "Acute retrosternal chest pressure radiating to left arm with dyspnea requires immediate ECG and cardiac workup.",
      note: "Urgent: Pt reports acute retrosternal chest pressure radiating to left arm accompanied by dyspnea since yesterday evening. Immediate 12-lead ECG, cardiac enzymes, and emergency room transfer indicated.",
    },
    {
      lang: "English / Mix",
      input: "2-year old baby with loose stools 6 times since morning, not feeding well and mild fever 100 F.",
      badge: "Medium Urgency",
      badgeColor: "bg-amber-500 text-white",
      reason: "Pediatric gastroenteritis with reduced oral intake requires close hydration monitoring.",
      note: "Pediatric pt presenting with acute gastroenteritis (6 loose stools in past 12h) and low-grade pyrexia (100°F). Poor oral intake noted. Plan: ORS zinc supplementation, hydration assessment.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50/40 via-sky-50/30 to-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      id="landing-page-root"
    >
      <Header currentRoute="/" isLoggedIn={isLoggedIn} />

      {/* Hero Section: Profile-Style with Supporting Visual Card & Overlapping CTA */}
      <section
        className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-teal-50/70 via-sky-50/40 to-slate-50/60"
        id="hero-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
                <Languages className="w-3.5 h-3.5 text-teal-700" />
                <span>Urdu, Roman Urdu & English Voice Clinical Scribe</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Instant clinical scribe notes & triage for busy Pakistani clinics.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Paste or speak messy patient complaints in{" "}
                <span className="font-bold text-teal-900">
                  Urdu (اردو), Roman Urdu, or English
                </span>
                . CarePen AI extracts key symptoms, assigns urgency triage tiers, and drafts standardized EHR-ready clinical notes in seconds.
              </p>

              {/* Primary Action Row with Overlapping CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="hero-cta-launch-dashboard"
                  onClick={() => onNavigate(isLoggedIn ? "/dashboard" : "/register")}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl text-base font-extrabold shadow-xl shadow-teal-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5" />
                  <span>Launch Scribe Console</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </button>

                <button
                  id="hero-cta-quick-demo"
                  onClick={onQuickDemo}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-4 rounded-2xl text-base font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <PlayCircle className="w-5 h-5 text-teal-600" />
                  <span>Try Demo Sandbox</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Web Speech Voice Input</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Patient Urdu Explanations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>1-Click Referral Slips</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Profile-Style Clinical Professional Hero Card */}
            <div className="lg:col-span-5 relative" id="hero-profile-container">
              {/* Main Profile Card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-teal-100/90 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl -z-10" />

                {/* Profile Header */}
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-lg">Dr. Ayesha Malik</h3>
                      <BadgeCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Consultant Physician • OPD Lead</p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active CarePen Scribe User</span>
                    </div>
                  </div>
                </div>

                {/* Stat pills */}
                <div className="grid grid-cols-2 gap-3 py-4">
                  <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100/80">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      Consultation Time
                    </span>
                    <span className="text-lg font-black text-slate-900">70% Faster</span>
                  </div>
                  <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100/80">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                      Supported Dialects
                    </span>
                    <span className="text-lg font-black text-slate-900">Urdu & English</span>
                  </div>
                </div>

                {/* Mini Live Scribe Preview Card inside Hero */}
                <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs space-y-2 font-mono shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-teal-400">
                    <div className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                      <span>Voice Transcribing...</span>
                    </div>
                    <span className="bg-rose-500/20 text-rose-300 px-2 py-0.2 rounded font-sans font-bold">
                      Urdu Dictation
                    </span>
                  </div>
                  <p className="text-slate-200 italic font-sans text-xs">
                    "Patient ko 3 din se bukhar aur shadeed sar dard hai..."
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Auto-Triage: High Urgency</span>
                    <span className="text-teal-400">✓ Scribe Note Ready</span>
                  </div>
                </div>

                {/* Overlapping Floating CTA Chip */}
                <button
                  onClick={() => onNavigate(isLoggedIn ? "/dashboard" : "/register")}
                  className="mt-4 w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Patient Intake in Urdu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mockup Section in Soft Blue Block */}
      <section className="py-16 bg-gradient-to-b from-sky-50/60 via-blue-50/40 to-white border-y border-sky-100" id="hero-mockup-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Live Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              See CarePen in action with multilingual intake
            </h2>
          </div>

          <div className="bg-slate-900 p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-800 max-w-5xl mx-auto">
            {/* Window chrome */}
            <div className="px-4 py-2 bg-slate-950 rounded-2xl flex items-center justify-between border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 ml-2 font-mono">carepen.ai/console</span>
              </div>
              <span className="text-[11px] text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-800 font-mono">
                Multilingual Model: Gemini 3.5 Flash
              </span>
            </div>

            {/* Sample Tab Selectors */}
            <div className="flex items-center gap-2 px-2 py-1 mb-3 overflow-x-auto">
              {mockSamples.map((sample, idx) => (
                <button
                  key={idx}
                  id={`hero-mock-tab-${idx}`}
                  onClick={() => setActiveMockIndex(idx)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeMockIndex === idx
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Sample {idx + 1}: {sample.lang}
                </button>
              ))}
            </div>

            {/* Mock Scribe Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-950 rounded-2xl">
              {/* Left: Input */}
              <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                    <span>PATIENT COMPLAINT:</span>
                    <span className="text-teal-400 font-bold">{mockSamples[activeMockIndex].lang}</span>
                  </div>
                  <p className="text-sm text-slate-200 font-sans italic leading-relaxed">
                    "{mockSamples[activeMockIndex].input}"
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs text-teal-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-time clinical symptom parser</span>
                </div>
              </div>

              {/* Right: Output */}
              <div className="md:col-span-7 bg-white text-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      CarePen Clinical EHR Note
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${mockSamples[activeMockIndex].badgeColor}`}>
                      {mockSamples[activeMockIndex].badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {mockSamples[activeMockIndex].note}
                  </p>
                  <div className="text-[11px] text-slate-600 bg-teal-50 border border-teal-200 p-2.5 rounded-xl">
                    <strong className="text-teal-900 font-bold">Triage Rationale: </strong>
                    {mockSamples[activeMockIndex].reason}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Standardized ICD/EHR Shorthand</span>
                  <span className="text-teal-700 font-bold">1-Click Copy & Print</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Rounded Card Grids & Icon+Label Combos */}
      <section className="py-20 bg-teal-50/50 border-b border-teal-100" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for high-volume Pakistani OPD clinics.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Eliminate transcription lag, miscommunications, and paperwork overhead during high-volume OPD consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="features-grid">
            {/* Feature 1 */}
            <div className="bg-white border border-teal-100/90 rounded-3xl p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Voice Speech Dictation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Hands-free speech dictation for doctors and nurses in Urdu, English, and Roman Urdu with real-time continuous transcription.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-teal-100/90 rounded-3xl p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Urgency & Triage Badges
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Automated triage categorization (Low, Medium, High) with clinical rationale to flag urgent complications like Dengue shock or cardiac ischemia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-teal-100/90 rounded-3xl p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Patient Urdu Translations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Converts complex doctor notes into simplified, compassionate Roman Urdu and Urdu script with clear home care and emergency advice.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-teal-100/90 rounded-3xl p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                1-Click Referral Slips
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Generate clean, printable referral and prescription slips with patient demographics, triage badges, and diagnostic notes instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Specialties / Department-Style Listing */}
      <section className="py-20 bg-sky-50/40 border-b border-sky-100" id="departments">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Specialties & Protocols
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pre-tuned for common clinical cases in Pakistan
            </h2>
            <p className="text-slate-600 text-sm">
              Tested against primary care, infectious disease, pediatrics, and cardiology OPD workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-2xs flex items-start gap-4">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Infectious Diseases & Dengue</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identifies viral prodromes, malaria patterns, typhoid, and dengue warning signs (retro-orbital ache, petechiae, platelet drops).
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-2xs flex items-start gap-4">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Pediatrics & Dehydration</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Triage child diarrhea, acute gastroenteritis, pneumonia signs, and hydration monitoring with weight and age considerations.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-2xs flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Cardio-Respiratory Red Flags</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-priority triage for angina, left-arm radiation, acute dyspnea, and hypertensive urgencies with immediate ECG guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section in Soft Pastel Background */}
      <section className="py-20 bg-gradient-to-b from-teal-50/40 via-sky-50/30 to-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              3-Step Clinical Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              From raw voice or text to structured records in seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="steps-grid">
            {/* Step 1 */}
            <div className="bg-white border border-teal-100 rounded-3xl p-7 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Speak or Type Patient Story
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click the microphone or type colloquial patient complaints in English, Urdu (اردو), or Roman Urdu.
              </p>
              <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-100 text-[11px] font-mono text-teal-900">
                "3 din se bukhar aur ultiyan hain..."
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-teal-100 rounded-3xl p-7 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI Generates Structured Note
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                CarePen isolates chief complaint, symptom list, assigns triage urgency badge, and creates a concise EHR paragraph.
              </p>
              <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-[11px] font-mono text-sky-900">
                Chief Complaint: Acute Febrile Illness with Emesis
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-teal-100 rounded-3xl p-7 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Copy, Translate & Print
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Copy into clinic software, generate simple Urdu home care instructions for the patient, or print a referral slip.
              </p>
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-[11px] font-mono text-emerald-900">
                ✓ Copied to Clipboard • Translated to Urdu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Block */}
      <section className="py-16 bg-gradient-to-r from-teal-800 to-blue-900 text-white" id="clinical-triage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-200 text-xs font-bold border border-teal-700/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Empowering Healthcare Providers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Designed for OPD speed, clarity, and patient safety.
              </h2>
              <p className="text-sm text-teal-100/90 leading-relaxed">
                CarePen AI eliminates paperwork friction so doctors can invest more face-to-face attention into patient examination and care.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                id="cta-bottom-start"
                onClick={() => onNavigate(isLoggedIn ? "/dashboard" : "/register")}
                className="bg-white hover:bg-teal-50 text-teal-950 font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
