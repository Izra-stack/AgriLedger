import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TermsModal from "../TermsModal";

const linkClass =
  "text-left text-sm leading-6 text-white/70 transition-colors hover:text-[#a8ef6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ef6b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b321b]";

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0b321b] px-5 pb-8 pt-16 text-white sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(150px,0.7fr)_minmax(190px,0.9fr)_minmax(210px,0.85fr)] lg:gap-12 xl:gap-16">
          <div className="max-w-md">
            <Link
              to="/"
              aria-label="AgriLedger home"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ef6b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b321b]"
            >
              <img
                src="/agrilogo.png"
                alt="AgriLedger"
                className="mb-7 h-16 w-auto brightness-0 invert sm:h-[4.5rem]"
              />
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              Smart, secure farm financial tracking built for agribusinesses,
              farm owners, and agricultural cooperatives. Complete ledger
              sovereignty with zero public exposure.
            </p>
          </div>

          <nav aria-labelledby="footer-overview-heading">
            <h2
              id="footer-overview-heading"
              className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8ef6b]"
            >
              Overview
            </h2>
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => scrollTo("top")}
                className={linkClass}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollTo("features")}
                className={linkClass}
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollTo("workflow")}
                className={linkClass}
              >
                Workflow
              </button>
              <button
                type="button"
                onClick={() => scrollTo("community")}
                className={linkClass}
              >
                Support
              </button>
            </div>
          </nav>

          <nav aria-labelledby="footer-security-heading">
            <h2
              id="footer-security-heading"
              className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8ef6b]"
            >
              Security &amp; Portal
            </h2>
            <div className="flex flex-col items-start gap-3">
              <Link to="/login" className={linkClass}>
                Directory
              </Link>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className={linkClass}
              >
                Data Privacy
              </button>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className={linkClass}
              >
                Terms &amp; Privacy
              </button>
              <button
                type="button"
                onClick={() => scrollTo("workflow")}
                className={linkClass}
              >
                Security Overview
              </button>
              <button
                type="button"
                onClick={() => scrollTo("community")}
                className={linkClass}
              >
                Help &amp; Support
              </button>
            </div>
          </nav>

          <address
            className="not-italic"
            aria-labelledby="footer-contact-heading"
          >
            <h2
              id="footer-contact-heading"
              className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8ef6b]"
            >
              Contact
            </h2>
            <div className="flex flex-col gap-4 text-sm leading-6 text-white/70">
              <a
                href="mailto:josiecabrera@gmail.com"
                className="flex items-start gap-3 transition-colors hover:text-[#a8ef6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ef6b]"
              >
                <Mail
                  size={18}
                  className="mt-1 shrink-0 text-[#a8ef6b]"
                  aria-hidden="true"
                />
                <span>josiecabrera@gmail.com</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Santo+Tomas%2C+Davao+del+Norte"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-[#a8ef6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ef6b]"
              >
                <MapPin
                  size={18}
                  className="mt-1 shrink-0 text-[#a8ef6b]"
                  aria-hidden="true"
                />
                <span>Santo Tomas, Davao del Norte</span>
              </a>
              <a
                href="tel:+639999999999"
                className="flex items-start gap-3 transition-colors hover:text-[#a8ef6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8ef6b]"
              >
                <Phone
                  size={18}
                  className="mt-1 shrink-0 text-[#a8ef6b]"
                  aria-hidden="true"
                />
                <span>+63 999 999 9999</span>
              </a>
            </div>
          </address>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7 text-xs text-white/45 sm:mt-20">
          <p>@ 2026 AgriLedger. All rights reserved.</p>
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
