import { Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Settings</h2>
        <p className="text-sm text-gray-500">Configure your cooperative profile and system preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8 space-y-8">
        
        {/* Cooperative Info */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] font-bold">1</div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Cooperative Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
              <input type="text" defaultValue="AgriLedger Cooperative" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registration Number</label>
              <input type="text" defaultValue="CDA-9921-2023" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Address</label>
              <input type="text" defaultValue="Santo Tomas, Davao del Norte" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Contact Info */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] font-bold">2</div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contact Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Email</label>
              <input type="email" defaultValue="admin@agriledger.ph" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input type="text" defaultValue="+63 999 999 9999" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end pl-11">
          <button className="bg-[#154226] hover:bg-opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
