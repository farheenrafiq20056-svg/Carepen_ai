import React, { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  Stethoscope,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { insertContactMessage } from "@/lib/auth-utils";
import { isSupabaseConfigured } from "@/lib/supabase-client";

interface ContactPageProps {
  onNavigate: (route: string) => void;
  isLoggedIn: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, isLoggedIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email address, and inquiry message.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedMessage = clinicName.trim()
        ? `[Clinic: ${clinicName.trim()}]\n\n${message}`
        : message;

      const res = await insertContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: formattedMessage,
      });

      if (res.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setClinicName("");
        setMessage("");
      } else {
        setError(res.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-teal-50/50 via-sky-50/30 to-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900"
      id="contact-page-root"
    >
      <Header currentRoute="/contact" isLoggedIn={isLoggedIn} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Profile-Style Hero Block */}
        <section className="bg-white rounded-3xl border border-teal-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-100/40 via-sky-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-800">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Built for Pakistani Clinics — Reach Out for Demos or Feedback</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Get in Touch with the{" "}
              <span className="bg-gradient-to-r from-teal-700 to-blue-700 bg-clip-text text-transparent">
                CarePen AI Team
              </span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Whether you are an OPD physician looking to test CarePen AI in your clinic, a hospital administrator exploring digital health workflows, or interested in collaborating, we'd love to connect.
            </p>
          </div>
        </section>

        {/* Dual Grid: Contact Form & Clinic Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-teal-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">
                Send a Message or Demo Request
              </h2>
              <p className="text-xs text-slate-500">
                Submissions are logged directly to our database. We typically respond within 24 hours.
              </p>
            </div>

            {/* Success Alert */}
            {success && (
              <div
                id="contact-success-alert"
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 animate-in fade-in"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block">
                    Message Received Successfully!
                  </span>
                  <p className="text-emerald-700 leading-relaxed">
                    Thank you for reaching out. We will review your clinic inquiry or feedback and contact you shortly.
                  </p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div
                id="contact-error-alert"
                className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 animate-in fade-in"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold block">Submission Error</span>
                  <p className="text-rose-700 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Full Name *
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    placeholder="Dr. Tariq Mahmood"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Email Address *
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="doctor@hospital.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Clinic, Hospital, or Organization (Optional)
                </label>
                <input
                  id="contact-clinic-input"
                  type="text"
                  placeholder="e.g., Mayo Hospital Lahore / Shaukat Khanum OPD / Private Clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Your Message or Feedback *
                </label>
                <textarea
                  id="contact-message-input"
                  rows={5}
                  required
                  placeholder="Tell us how we can help your clinical team or share your thoughts on the CarePen AI clinical scribe..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600 leading-relaxed resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Information & Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/70 to-white rounded-3xl border border-teal-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-600 text-white rounded-xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Direct Inquiries</h3>
                  <p className="text-[10px] text-slate-500">CarePen AI Healthcare Team</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100">
                  <Mail className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block">General & Clinical Inquiries</span>
                    <a
                      href="mailto:contact@carepen.pk"
                      className="text-teal-700 hover:underline font-semibold"
                    >
                      contact@carepen.pk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100">
                  <Phone className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block">WhatsApp & Clinic Support</span>
                    <span className="text-slate-600 font-medium">+92 300 1234567</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/80 rounded-2xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-700 block">Location Focus</span>
                    <span className="text-slate-600">Islamabad • Lahore • Karachi, Pakistan</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-teal-100/60">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Available for live clinical pilot trials and hospital feedback.</span>
                </div>
              </div>
            </div>

            {/* Quick Sandbox Launch Card */}
            <div className="bg-white rounded-3xl border border-teal-100 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Want to test the scribe immediately?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                You can try our preloaded clinical scenarios in Roman Urdu, Urdu, and English without any setup.
              </p>
              <button
                onClick={() => onNavigate("/dashboard")}
                className="w-full py-2.5 px-3 bg-teal-50 hover:bg-teal-100/80 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-teal-200 transition-all cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
