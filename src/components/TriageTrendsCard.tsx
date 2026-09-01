"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3, Sparkles, RefreshCw } from "lucide-react";
import { fetchTriageTrends } from "@/lib/auth-utils";
import type { TriageDayCount } from "@/types";

interface TriageTrendsCardProps {
  userId: string;
  /** Change this value to refetch trends (e.g. history.length after save/delete). */
  refreshKey?: number;
}

// Urgency palette mirrors the triage colors used across the app
const URGENCY_COLORS = {
  Low: "#059669", // emerald-600
  Medium: "#d97706", // amber-600
  High: "#e11d48", // rose-600
};

function TriageTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum: number, p: any) => sum + (p.value || 0), 0);
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs space-y-1">
      <p className="font-bold text-slate-800">
        {label} — {total} note{total === 1 ? "" : "s"}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function TriageTrendsCard({ userId, refreshKey = 0 }: TriageTrendsCardProps) {
  // null = first fetch still in flight; otherwise the 7 zero-filled day buckets
  const [days, setDays] = useState<TriageDayCount[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTriageTrends(userId).then((data) => {
      if (!cancelled) setDays(data);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, refreshKey]);

  const totalNotes =
    days?.reduce((sum, d) => sum + d.Low + d.Medium + d.High, 0) ?? 0;

  return (
    <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden" id="triage-trends-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50/80 via-sky-50/50 to-white px-5 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Triage Trends</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Your own saved notes, grouped by urgency — last 7 days
            </p>
          </div>
        </div>
        {days && totalNotes > 0 && (
          <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide bg-teal-50 text-teal-800 border-teal-200">
            {totalNotes} note{totalNotes === 1 ? "" : "s"} this week
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {days === null ? (
          // First load
          <div className="flex items-center justify-center gap-2 py-12 text-xs font-bold text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>Loading your triage activity…</span>
          </div>
        ) : totalNotes === 0 ? (
          // Friendly empty state
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 text-teal-600" />
            </div>
            <p className="text-sm font-bold text-slate-700">
              Generate a few notes to see your triage trends here.
            </p>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Once you save clinical notes, this chart shows how many you logged each day by urgency level.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={days} margin={{ top: 4, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<TriageTooltip />} cursor={{ fill: "rgba(13, 148, 136, 0.06)" }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, fontWeight: 600, color: "#475569" }}
                  />
                  <Bar dataKey="Low" stackId="urgency" fill={URGENCY_COLORS.Low} name="Low" />
                  <Bar dataKey="Medium" stackId="urgency" fill={URGENCY_COLORS.Medium} name="Medium" />
                  <Bar
                    dataKey="High"
                    stackId="urgency"
                    fill={URGENCY_COLORS.High}
                    name="High"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[11px] text-slate-500 font-semibold mt-3">
              Your triage activity this week
            </p>
          </>
        )}
      </div>
    </div>
  );
}
