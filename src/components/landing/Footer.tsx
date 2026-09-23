import { useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import TermsModal from "../TermsModal";

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-brand-dark pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="mb-6">
              <img
                src="/agrilogo.png"
                alt="AgriLedger Logo"
                className="h-14 w-auto brightness-0 invert translate-y-2"
              />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Smart, secure farm financial tracking built for agribusinesses,
              farm owners, and agricultural cooperatives. Complete ledger
              sovereignty with zero public exposure.
            </p>
            <div className="flex flex-col gap-2">
              <a className="text-white/90 text-sm hover:text-white transition-colors">
                johnmarklandim@agriledger.ph
              </a>
              <a className="text-white/90 text-sm hover:text-white transition-colors">
                +63 999 999 9999
              </a>
              <span className="text-white/90 text-sm flex items-center gap-2">
                <MapPin className="text-red-500" size={20} />
                <span>Santo Tomas, Davao del Norte</span>
              </span>
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2">
                Overview
              </h4>
              <button
                onClick={() => scrollTo("top")}
                className="text-left text-white/70 hover:text-white text-sm transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo("features")}
                className="text-left text-white/70 hover:text-white text-sm transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("workflow")}
                className="text-left text-white/70 hover:text-white text-sm transition-colors"
              >
                Workflow
              </button>
              <button
                onClick={() => scrollTo("community")}
                className="text-left text-white/70 hover:text-white text-sm transition-colors"
              >
                About Station
              </button>
              <button
                onClick={() => scrollTo("community")}
                className="text-left text-white/70 hover:text-white text-sm transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2">
                Ledger Suite
              </h4>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Farmer Records
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Input Inventory
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Cash Subsidies
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Farm Expenses
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Harvest Earnings
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2">
                Compliance
              </h4>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Farm Guidelines
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Financial Checking
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Fund Records
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Financial Reports
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Record History
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2">
                Security & Portal
              </h4>
              <Link
                to="/login"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Owner Portal
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Data Privacy
              </Link>
              <span className="text-white/50 text-sm" title="Firebase Storage is not enabled in this version">
                File Storage (not enabled)
              </span>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Account Security
              </Link>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Help & Support
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            @ 2026 AgriLedger. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowTerms(true)}
              className="text-white/50 hover:text-white/80 text-xs transition-colors"
            >
              Terms & Privacy Policy
            </button>
            <Link
              to="/"
              className="text-white/50 hover:text-white/80 text-xs transition-colors"
            >
              Security Overview
            </Link>
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setShowTerms(false)}
      />
    </footer>
  );
}
