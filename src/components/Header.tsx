"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, ArrowRight, Menu, X } from "lucide-react";

interface HeaderProps {
  currentRoute: string;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  isLoggedIn,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; route: string }[] = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Contact", route: "/contact" },
  ];

  const handleNav = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-2xs"
      id="main-public-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNav("/")}
          id="header-brand-logo"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Stethoscope className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                CarePen AI
              </span>
              <span className="bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Clinical Scribe
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
              AI Assistant for Pakistani Healthcare
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                id={`nav-link-${item.label.toLowerCase()}`}
                onClick={() => handleNav(item.route)}
                className={`transition-colors py-1 cursor-pointer font-medium text-xs sm:text-sm ${
                  isActive
                    ? "text-teal-700 font-bold border-b-2 border-teal-600"
                    : "hover:text-teal-700"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn ? (
            <button
              id="header-cta-dashboard-btn"
              onClick={() => handleNav("/dashboard")}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>Doctor Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                id="header-cta-login-btn"
                onClick={() => handleNav("/login")}
                className={`text-xs sm:text-sm font-bold px-3 py-2 transition-colors cursor-pointer ${
                  currentRoute === "/login" ? "text-teal-700" : "text-slate-700 hover:text-teal-700"
                }`}
              >
                Sign In
              </button>
              <button
                id="header-cta-register-btn"
                onClick={() => handleNav("/register")}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 text-white px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-teal-500/25 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentRoute === item.route
                    ? "bg-teal-50 text-teal-800"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isLoggedIn ? (
              <button
                onClick={() => handleNav("/dashboard")}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-bold"
              >
                <span>Doctor Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav("/login")}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 border border-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav("/register")}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-blue-700 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-500/20"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
