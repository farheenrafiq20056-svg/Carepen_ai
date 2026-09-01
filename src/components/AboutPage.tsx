import React from "react";
import {
  Stethoscope,
  Award,
  Globe2,
  HeartPulse,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  FileCheck,
  Languages,
  CheckCircle2,
  Cpu,
  HeartHandshake,
  Lightbulb,
  Building,
  Target,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface AboutPageProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, isLoggedIn }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50/50 via-sky-50/30 to-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      id="about-page-root"
    >
      <Header currentRoute="/about" isLoggedIn={isLoggedIn} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Profile-Style Hero Section */}
        <section className="bg-white rounded-3xl border border-teal-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-100/50 via-sky-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Generation Clinical AI for Pakistani Healthcare</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Reinventing Clinical Documentation for{" "}
              <span className="bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
                Pakistani Healthcare
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              CarePen AI was founded with a singular purpose: to bridge the linguistic and administrative gap between busy doctors and millions of patients in Pakistan's outpatient departments through localized, intelligent clinical scribing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate("/dashboard")}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-md shadow-teal-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>Try Intake Scribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("/contact")}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Request Clinic Demo</span>
              </button>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="space-y-8" id="the-problem-section">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              The Reality on the Ground
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              The Overburdened OPD Crisis in Pakistan
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Public and private clinics in cities like Karachi, Lahore, Peshawar, and Islamabad handle extreme patient volumes under severe time constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">80–120 Patients per Shift</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctors typically have only 2–4 minutes per outpatient encounter. Juggling handwritten paper slips and manual notes causes severe physician fatigue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multilingual Linguistic Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients communicate in Urdu, Roman Urdu, or regional dialects, while clinical charts require formal English medical terminology and standardized coding.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Patient Comprehension Loss</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discharge and medication slips written in English medical jargon are often misunderstood by patients, leading to poor treatment adherence and preventable complications.
              </p>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="bg-gradient-to-r from-teal-50/80 via-sky-50/60 to-white rounded-3xl border border-teal-100 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
              The CarePen AI Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Engineered Specifically for Pakistan's Workflow
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              CarePen AI is not a generic US-centric transcription tool. It is architected from the ground up for Pakistani clinical colloquialisms, dual-language voice dictation, and instant EMR summarization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
              <div className="p-2 bg-teal-50 rounded-xl text-teal-700 w-fit">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Urdu & Roman Urdu NLP</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Parses terms like <em>"chhati mein dabao"</em> or <em>"sir ghoom raha hai"</em> directly to cardiac pressure and vertigo.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
              <div className="p-2 bg-sky-50 rounded-xl text-sky-700 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Real-Time Speech Intake</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Doctors or clinic triage staff can speak freely while examining patients, transcribing spoken symptoms in seconds.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-700 w-fit">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Urgency Triage Protocol</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Flags high-risk clinical conditions (e.g. dengue warning signs, acute coronary syndromes) instantly with clinical reasons.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-2">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-700 w-fit">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Patient-Friendly Care Slips</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                One-click Roman Urdu and Urdu explanation translation with audio speech playback and downloadable printable PDFs.
              </p>
            </div>
          </div>
        </section>

        {/* Technology & Architecture Section */}
        <section className="bg-white rounded-3xl border border-teal-100 p-8 sm:p-10 shadow-sm relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>Modern Clinical Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                High-Performance Infrastructure for Healthcare
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Engineered to handle high-throughput outpatient volume with low latency, robust clinical data isolation, and seamless physician workflow integration.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Platform Standard
              </span>
              <div className="text-sm font-extrabold text-teal-800">
                PMDC & HIPAA Aligned
              </div>
              <div className="text-[10px] text-slate-500">
                Clinician-in-the-Loop Protocol
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>Cloud-Scale Architecture</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Designed to run with ultra-low latency, supporting distributed rural BHUs (Basic Health Units) and major tertiary hospitals alike.
              </p>
            </div>

            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Multimodal Generative Models</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Combines speech recognition, structured JSON clinical parsing, translation models, and client-side PDF synthesis in a cohesive workflow.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Data Privacy by Design</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Doctor-controlled encrypted encounter logs with row-level security and local encrypted session fallbacks.
              </p>
            </div>
          </div>
        </section>

        {/* Solo Builder / Team Section */}
        <section className="bg-gradient-to-r from-teal-50/80 via-white to-sky-50/60 rounded-3xl border border-teal-100 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-teal-600 via-teal-700 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-teal-500/20 p-2">
                <Stethoscope className="w-14 h-14" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border border-teal-200 text-[10px] font-bold text-teal-800 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>Solo Builder</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  The Vision Behind The Project
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Built by a Solo Engineer for Real Pakistani Clinics
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                CarePen AI was conceived and crafted as an independent passion project. Having witnessed firsthand the extreme doctor-patient ratios and administrative burdens in Pakistani hospitals, I set out to build a lightweight, frictionless, and clinically rigorous tool that saves physicians hours every week and ensures patients never leave the clinic confused.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <Target className="w-3.5 h-3.5 text-teal-600" />
                  <span>Mission: Accessible AI for Public Health</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Free & Open Prototype</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-teal-700 via-teal-800 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to streamline your clinic intake?
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
              Experience instant multilingual voice dictation, clinical note generation, and PDF report creation today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("/dashboard")}
              className="bg-white text-teal-900 hover:bg-teal-50 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Launch Scribe Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("/contact")}
              className="bg-teal-800/80 hover:bg-teal-800 text-white border border-teal-500/50 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <span>Contact for Hospital Deployments</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
