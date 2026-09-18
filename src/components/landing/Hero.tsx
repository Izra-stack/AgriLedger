import { useState } from "react";
import TermsModal from "../TermsModal";
import Benefits from "./Benefits";

export default function Hero() {
  const [showTerms, setShowTerms] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="bg-brand-light pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative"
      id="top"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center -translate-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-text tracking-tight mb-6 max-w-4xl leading-[1.15]">
          Smart Financial Tracking
          <br />
          for Your Farm Business
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-10 leading-relaxed">
          AgriLedger is the all-in-one, secure financial tracking system built
          specifically for agribusinesses, farm owners, and agricultural
          cooperatives. Manage grower ledgers, disburse cash assistance, trace
          input expenditures, and monitor seasonal earnings in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
          <button
            onClick={() => setShowTerms(true)}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-brand-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-colors shadow-sm"
          >
            Get Started
          </button>
          <button
            onClick={scrollToFeatures}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-300 text-base font-semibold rounded-lg text-brand-text bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-colors shadow-sm"
          >
            Learn More
          </button>
        </div>

        <Benefits />
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setShowTerms(false)}
      />
    </section>
  );
}
