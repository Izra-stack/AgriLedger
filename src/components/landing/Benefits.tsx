import { FileText, ShieldCheck, Zap } from "lucide-react";

export default function Benefits() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 -translate-y-10">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="text-brand-dark mb-4">
          <FileText size={28} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-bold text-brand-dark tracking-wide uppercase mb-3">
          Easy to Track
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider leading-relaxed">
          Organize assistance, inputs, and payments in one place.
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="text-brand-dark mb-4">
          <Zap size={28} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-bold text-brand-dark tracking-wide uppercase mb-3">
          FAST & ACCURATE
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider leading-relaxed">
          Automatically calculate payments and maintain balances.
        </p>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="text-brand-dark mb-4">
          <ShieldCheck size={28} strokeWidth={2.5} />
        </div>
        <h3 className="text-sm font-bold text-brand-dark tracking-wide uppercase mb-3">
          SECURE RECORDS
        </h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider leading-relaxed">
          Keep farmer and transaction information safe and organized.
        </p>
      </div>
    </div>
  );
}
