"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { UserProfile } from "@/types";
import {
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/auth-utils";

interface AuthViewProps {
  mode: "login" | "register";
}

export const AuthView: React.FC<AuthViewProps> = ({ mode }) => {
  const router = useRouter();
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }
        if (user) {
          router.push("/dashboard");
        }
      } else {
        // Register
        if (!fullName.trim()) {
          setErrorMessage("Please enter your full doctor or staff name.");
          setLoading(false);
          return;
        }
        const { user, error } = await signUpWithEmail(email, password, fullName, clinicName);
        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }
        if (user) {
          setSuccessMessage("Account created successfully! Redirecting to clinical workspace...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50/70 via-sky-50/40 to-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans"
      id="auth-view-root"
    >
      {/* Back to landing */}
      <div className="max-w-md w-full mx-auto mb-6">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 transition-colors cursor-pointer bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to CarePen AI</span>
        </button>
      </div>

      <div
        className="max-w-md w-full mx-auto bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden"
        id="auth-card"
      >
        {/* Top Header with Soft Teal Background */}
        <div className="p-8 pb-6 border-b border-teal-100 bg-gradient-to-r from-teal-50/80 via-sky-50/50 to-white text-center space-y-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-700 mx-auto flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Stethoscope className="w-6.5 h-6.5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight" id="auth-heading">
              {isLogin ? "Doctor Workspace Sign In" : "Register Scribe Account"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {isLogin
                ? "Sign in to access your clinical intake console and patient history."
                : "Join doctors and clinic staff across Pakistan streamlining OPD notes."}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id="email-auth-form">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name & Qualifications
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="register-fullname"
                      type="text"
                      required
                      placeholder="e.g., Dr. Kashif Malik, MBBS, FCPS"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Clinic / Hospital Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="register-clinicname"
                      type="text"
                      placeholder="e.g., Al-Shifa Family Clinic, Lahore"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="doctor@clinic.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md shadow-teal-500/20 transition-all active:scale-98 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Scribe Console" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 font-medium">
              {isLogin ? "Don't have an account yet?" : "Already registered?"}{" "}
              <button
                id="switch-auth-mode-btn"
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  router.push(isLogin ? "/register" : "/login");
                }}
                className="font-bold text-teal-700 hover:underline cursor-pointer ml-1"
              >
                {isLogin ? "Create an account" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
