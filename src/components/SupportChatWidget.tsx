"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
} from "lucide-react";
import { SupportChatMessage } from "@/types";

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "As-salamu alaykum! I am Maya, your CarePen AI guide. I can help you with app navigation, voice dictation, urgency badges, and referral slips.\n\n*(Note: I am a software helper and cannot give medical diagnoses or prescriptions.)*",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    {
      label: "Urgency Triage Colors",
      prompt: "What do the Low (Green), Medium (Amber), and High (Red) urgency badges mean?",
    },
    {
      label: "Using Voice Input",
      prompt: "How does the microphone voice dictation work in Urdu and English?",
    },
    {
      label: "Patient Note Translation",
      prompt: "How can I translate clinical notes into simple Urdu/Roman Urdu for patients?",
    },
    {
      label: "Print Referral Slips",
      prompt: "How do I print or export a clean referral slip with patient metadata?",
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: SupportChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      // Build history for server
      const chatHistory = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reach assistant.");
      }

      const botMsg: SupportChatMessage = {
        id: "msg-bot-" + Date.now(),
        sender: "bot",
        text: data.reply || "I am here to help you use CarePen AI effectively.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: SupportChatMessage = {
        id: "msg-err-" + Date.now(),
        sender: "bot",
        text: "I could not connect to the assistant right now. Please verify that your GEMINI_API_KEY is active.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans" id="support-chat-widget-root">
      {/* Floating Toggle Button when closed */}
      {!isOpen && (
        <button
          id="open-support-chat-btn"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Ask Maya — CarePen App Support & Navigation"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-700 rounded-full animate-pulse" />
          </div>
          <span className="font-bold text-xs hidden sm:inline tracking-tight">
            Ask Maya
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          id="support-chat-modal"
          className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-blue-700 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">Maya</h3>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-teal-100/90 font-medium leading-none mt-0.5">
                  In-App Navigation & Clinical Tool Helper
                </p>
              </div>
            </div>

            <button
              id="close-support-chat-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clinical Guardrail Disclaimer Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-3 py-1.5 text-[10px] text-amber-900 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>App guide only. Not for medical treatment decisions.</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60" id="chat-messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-blue-700 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 font-mono ${
                      msg.sender === "user" ? "text-blue-200 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start items-center text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1">Maya is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
            <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(qp.prompt)}
                className="shrink-0 text-[11px] font-semibold text-slate-600 hover:text-teal-800 bg-slate-100 hover:bg-teal-50 px-2.5 py-1 rounded-full border border-slate-200 hover:border-teal-200 transition-all cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              id="support-chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Maya anything about using CarePen AI..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            />
            <button
              type="submit"
              id="support-chat-submit-btn"
              disabled={loading || !inputMessage.trim()}
              className={`p-2.5 rounded-xl text-white font-bold transition-all cursor-pointer ${
                loading || !inputMessage.trim()
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-teal-700 hover:bg-teal-800 shadow-sm active:scale-95"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
