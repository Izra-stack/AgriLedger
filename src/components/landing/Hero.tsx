import { useState } from "react";
import TermsModal from "../TermsModal";

export default function Hero() {
  const [showTerms, setShowTerms] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center bg-no-repeat pt-20 pb-28 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/homepage.png')" }}
      id="top"
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-[1.15]">
          Smart Financial Tracking
          <br />
          for Your Farm Business
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-10 leading-relaxed font-normal">
          AgriLedger is the all-in-one, secure financial tracking system built
          specifically for agribusinesses, farm owners, and agricultural
          cooperatives. Manage grower ledgers, disburse cash assistance, trace
          input expenditures, and monitor seasonal earnings in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowTerms(true)}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl text-white bg-[#0F3D21] hover:bg-[#14522d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D21] transition-all shadow-md"
          >
            Get Started
          </button>
          <button
            onClick={scrollToFeatures}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-white/30 text-base font-bold rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all shadow-md"
          >
            Learn More
          </button>
        </div>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setShowTerms(false)}
      />
    </section>
  );
}
