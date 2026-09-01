"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const router = useRouter();
  const navigate = (route: string) => router.push(route);
  return (
    <footer
      className="bg-white border-t border-slate-200/90 font-sans text-slate-600 mt-auto"
      id="main-public-footer"
    >
      {/* Top Footer with columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand and Hackathon info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Stethoscope className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">
                  CarePen AI
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Pakistan's Multilingual Clinical Scribe
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering healthcare practitioners and OPD clinics across Pakistan with intelligent Urdu, Roman Urdu, and English speech-to-text intake, triage urgency detection, and patient home-care translation.
            </p>

            {/* Clinical Security & Compliance Badge */}
            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-slate-800 block">
                  PMDC & Privacy Aligned
                </span>
                <span className="text-teal-700 font-semibold">
                  Secure & Confidential Clinical Documentation
                </span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Features & AI Scribe
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Clinical Intake Console</span>
                  <span className="bg-teal-100 text-teal-800 text-[9px] px-1.5 py-0.2 rounded-md font-bold">
                    Live
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/register")}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Doctor Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Company & Story
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  id="footer-about-link"
                  onClick={() => navigate("/about")}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  About Mission & Team
                </button>
              </li>
              <li>
                <button
                  id="footer-contact-link"
                  onClick={() => navigate("/contact")}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Contact & Clinic Demos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("clinical-triage")?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Triage Guidelines
                </button>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <span>Built with</span>
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
                  <span>in Pakistan</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  id="footer-privacy-link"
                  onClick={() => navigate("/privacy")}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-terms-link"
                  onClick={() => navigate("/terms")}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block leading-tight">
                  HIPAA & PMDC clinician compliance standards aligned.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>© {new Date().getFullYear()} CarePen AI. All rights reserved. Created for clinics and hospitals across Pakistan.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <button onClick={() => navigate("/privacy")} className="hover:text-teal-700 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => navigate("/terms")} className="hover:text-teal-700 transition-colors">
              Terms
            </button>
            <span>•</span>
            <button onClick={() => navigate("/contact")} className="hover:text-teal-700 transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
