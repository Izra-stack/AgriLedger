import { MapPin } from "lucide-react";

export default function SupportCTA() {
  return (
    <section id="community" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="bg-[#f2faf5] rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center border border-[#d8f2e3] shadow-[0_8px_30px_rgba(0,0,0,0.04)] w-full">
          {/* Soft ambient gradient glows matching reference image */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c6f7de] rounded-full filter blur-3xl opacity-70 pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fef08a]/40 rounded-full filter blur-3xl opacity-80 pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto">
            <span className="text-[#0F3D21] text-[11px] font-extrabold tracking-[0.2em] uppercase mb-6 bg-white/80 border border-[#bcebd0] px-5 py-1.5 rounded-full shadow-sm">
              Agri Support for Farmers
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B2516] tracking-tight mb-8 max-w-3xl leading-[1.15]">
              Need Support for Your Farm?
            </h2>

            <p className="text-base md:text-lg text-gray-600 max-w-3xl mb-12 leading-relaxed font-normal">
              Join other farmers and easily keep track of your farming
              assistance, inputs, and payments. We're here to support you in
              every step of your palay production. Let's build a stronger and
              more prosperous harvest together!
            </p>

            <div className="flex items-center justify-center gap-2.5 text-gray-700">
              <MapPin className="text-black" size={18} />
              <span className="font-semibold text-sm md:text-base text-gray-800">
                Visit us in Santo Tomas for more information about our farming
                assistance and services.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
