"use client";

import React from "react";
import { ScenarioPreset } from "@/types";
import { SCENARIO_PRESETS } from "@/data/presets";
import { Sparkles, FileText } from "lucide-react";

interface PresetSelectorProps {
  onSelectPreset: (preset: ScenarioPreset) => void;
  selectedTitle?: string;
}

export default function PresetSelector({ onSelectPreset, selectedTitle }: PresetSelectorProps) {
  return (
    <div id="preset-selector-container" className="mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-teal-100 text-teal-800 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" id="sparkles-icon" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 tracking-tight" id="preset-title-label">
            Quick Clinical Test Presets (Roman Urdu / Urdu / English)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Click any case to test instant note generation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" id="presets-grid">
        {SCENARIO_PRESETS.map((preset, index) => {
          const isSelected = selectedTitle === preset.title;
          const badgeColor =
            preset.language === "Urdu"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : preset.language === "Roman Urdu"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-teal-50 text-teal-800 border-teal-200";

          return (
            <button
              key={index}
              id={`preset-button-${index}`}
              onClick={() => onSelectPreset(preset)}
              type="button"
              className={`text-left p-3.5 rounded-2xl border text-xs transition-all duration-200 h-full flex flex-col justify-between cursor-pointer shadow-2xs ${
                isSelected
                  ? "border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-500"
                  : "border-teal-100/90 bg-white hover:border-teal-300 hover:bg-teal-50/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5" id={`preset-header-${index}`}>
                  <span className="font-bold text-slate-900 line-clamp-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-teal-600" />
                    {preset.title.split(":")[1]?.trim() || preset.title}
                  </span>
                  <span
                    id={`preset-lang-badge-${index}`}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase shrink-0 ${badgeColor}`}
                  >
                    {preset.language}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 leading-relaxed italic mb-2.5 text-[11px]" id={`preset-preview-${index}`}>
                  "{preset.preview}"
                </p>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 pt-2 border-t border-slate-100" id={`preset-demographics-${index}`}>
                <span className="text-slate-600">{preset.patientName}</span>
                <span>•</span>
                <span>{preset.patientAge}, {preset.patientGender}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
