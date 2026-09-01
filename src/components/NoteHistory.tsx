"use client";

import React, { useState } from "react";
import { SavedNote } from "@/types";
import { Search, Trash2, Calendar, Clipboard, Database, ArrowRight, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase-client";

interface NoteHistoryProps {
  history: SavedNote[];
  onSelectNote: (note: SavedNote) => void;
  onClearHistory: () => void;
  onDeleteNote: (id: string) => void;
  activeId?: string;
}

export default function NoteHistory({
  history,
  onSelectNote,
  onClearHistory,
  onDeleteNote,
  activeId,
}: NoteHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result?.clinicalIntake?.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawInput?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency =
      urgencyFilter === "All" || item.result?.urgency?.flag === urgencyFilter;

    return matchesSearch && matchesUrgency;
  });

  const getUrgencyBadgeStyle = (flag: string) => {
    switch (flag) {
      case "High":
        return "bg-rose-50 border-rose-200 text-rose-700 font-bold";
      case "Medium":
        return "bg-amber-50 border-amber-200 text-amber-700 font-bold";
      default:
        return "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold";
    }
  };

  return (
    <div id="note-history-root" className="bg-white rounded-3xl border border-teal-100/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50/70 via-sky-50/50 to-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
            <Clipboard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight" id="history-header-title">
                Patient Encounter Logs
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
                <Database className="w-2.5 h-2.5" />
                <span>{isSupabaseConfigured ? "Supabase Cloud" : "Cloud Session"}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Saved patient encounter histories ({history.length})
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            id="clear-all-history-btn"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all logged clinical notes from this session?")) {
                onClearHistory();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-slate-50/70 border-b border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-2.5" id="history-controls">
        <div className="relative md:col-span-7">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="history-search-input"
            type="text"
            placeholder="Search logs by patient name, complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs text-slate-700 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div className="md:col-span-5">
          <select
            id="history-urgency-filter"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white text-xs text-slate-700 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-teal-600 focus:border-teal-600 cursor-pointer font-medium"
          >
            <option value="All">All Triage Tiers</option>
            <option value="High">🔴 High Urgency</option>
            <option value="Medium">🟡 Medium Urgency</option>
            <option value="Low">🟢 Low Urgency</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto" id="history-list-container">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className={`p-4 flex items-center justify-between transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-teal-50/60 border-l-4 border-l-teal-600"
                    : "hover:bg-slate-50/80 border-l-4 border-l-transparent"
                }`}
                onClick={() => onSelectNote(item)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                      {item.patientName || "Anonymous Patient"}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({item.patientAge || "?"}, {item.patientGender || "?"})
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getUrgencyBadgeStyle(
                        item.result?.urgency?.flag || "Low"
                      )}`}
                    >
                      {item.result?.urgency?.flag || "Low"}
                    </span>
                    {item.reviewedBy ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 bg-emerald-50 border-emerald-200 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Reviewed
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 bg-amber-50 border-amber-200 text-amber-700">
                        Pending Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 font-medium mb-1">
                    {item.result?.clinicalIntake?.chiefComplaint || "No complaint recorded"}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>

                  {item.reviewedBy && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        Reviewed by{" "}
                        {`Dr. ${item.reviewedBy.replace(/^dr[.\s]\s*/i, "")}`}
                        {item.reviewedAt ? ` — ${item.reviewedAt}` : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(item.id);
                    }}
                    title="Delete log"
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Clipboard className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-500">No matching patient encounter records found.</p>
            <p className="text-[10px] text-slate-400">Notes generated in the intake console will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
