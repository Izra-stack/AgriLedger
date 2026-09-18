import { MapPin } from 'lucide-react';

export default function SupportCTA() {
  return (
    <section id="community" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-brand-soft rounded-3xl p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d0f5e1] rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fefce8] rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-brand-dark text-[11px] font-extrabold tracking-[0.2em] uppercase mb-6">
              Agri Support for Farmers
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text tracking-tight mb-8 max-w-2xl leading-[1.15]">
              Need Support for Your Farm?
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mb-12 leading-relaxed">
              Join other farmers and easily keep track of your farming assistance, inputs, and payments. We're here to support you in every step of your palay production. Let's build a stronger and more prosperous harvest together!
            </p>
            
            <div className="flex items-center gap-3">
              <MapPin className="text-red-500" size={24} />
              <span className="text-brand-dark font-medium text-sm md:text-base">
                Visit us in Santo Tomas for more information about our farming assistance and services.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
