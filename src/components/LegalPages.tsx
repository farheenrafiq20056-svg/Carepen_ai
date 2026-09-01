"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, FileText, AlertTriangle, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  route: "/privacy" | "/terms";
}

export const LegalPage: React.FC<LegalPageProps> = ({ route }) => {
  const router = useRouter();
  const isPrivacy = route === "/privacy";

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50/50 via-sky-50/30 to-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      id="legal-page-root"
    >
      <Header currentRoute={route} isLoggedIn={false} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-teal-100 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
              {isPrivacy ? <ShieldCheck className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{isPrivacy ? "Medical Data Privacy & Confidentiality" : "Clinical Terms & Disclaimer"}</span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isPrivacy ? "CarePen AI Privacy Policy" : "Terms of Clinical Service"}
            </h1>

            <p className="text-xs text-slate-500">
              Last updated: August 2026 • CarePen AI Healthcare Systems (Pakistan)
            </p>
          </div>

          {isPrivacy ? (
            /* Privacy Content */
            <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Commitment to Patient Confidentiality</h2>
                <p>
                  CarePen AI is engineered with rigorous healthcare data privacy principles. Patient symptoms, transcribed audio recordings, clinical notes, and physician documentation are strictly processed to generate structured medical summaries and are protected with end-to-end security measures.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Data Collection and Usage</h2>
                <p>
                  When a doctor or clinical staff member enters patient symptom intake data:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Data is transmitted securely over HTTPS/TLS to our AI parsing engine.</li>
                  <li>Audio streams captured via the Web Speech API are processed locally or in memory during the encounter.</li>
                  <li>Encounter logs saved by authenticated doctors are stored in isolated, row-level secured database tables accessible only to the authenticated clinician account.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. No Unauthorized Third-Party Selling</h2>
                <p>
                  CarePen AI does not sell, rent, or commercialize protected health information (PHI) or doctor clinical notes to any third-party marketing entities or insurers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">4. Regulatory Standards</h2>
                <p>
                  Our architecture is modeled after internationally recognized HIPAA and GDPR health privacy principles as well as PMDC ethical guidelines for digital medical record management.
                </p>
              </section>
            </div>
          ) : (
            /* Terms Content */
            <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block">Important Medical & Physician Disclaimer</span>
                  <p className="leading-relaxed">
                    CarePen AI is an assistive clinical documentation and triage support software. It is not an autonomous medical practitioner and does not independently diagnose diseases or prescribe treatment.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">1. Physician Verification Responsibility</h2>
                <p>
                  The licensed attending physician or healthcare provider retains full and sole medical responsibility for confirming, reviewing, and approving all clinical notes, triage levels, and patient instructions prior to saving them to an EMR or providing them to a patient.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">2. Intended Use</h2>
                <p>
                  CarePen AI is intended for use in outpatient clinics, triage desks, and hospital departments across Pakistan to expedite clerical scribing and translation. In life-threatening emergencies, standard hospital emergency protocols must always take immediate precedence.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">3. Hackathon Prototype Notice</h2>
                <p>
                  This deployment is part of the Alibaba Cloud AI Hackathon Pakistan 2026. Clinical users are encouraged to test the system in supervised environments and provide feedback to improve multilingual parsing accuracy.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
