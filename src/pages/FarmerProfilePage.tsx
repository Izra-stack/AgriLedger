import { ArrowLeft, Edit2, Plus, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';

export default function FarmerProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <button 
        onClick={() => navigate('/dashboard/farmers')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8">
        
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF7EF] text-[#0F3D21] text-2xl font-bold flex items-center justify-center">
              JM
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Jose Mendoza</h2>
                <span className="bg-[#EAF7EF] text-[#0F3D21] border border-[#0F3D21]/20 px-2.5 py-1 rounded-full text-[10px] font-bold">Active</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                <span>FRM-001</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><MapPin size={14} /> Brgy. Tibal-og</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>2.5 ha</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>Cavendish Banana</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Edit2 size={16} /> Edit Profile
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#154226] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <Plus size={16} /> New Transaction
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="border-r border-gray-100 pr-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Borrowed</div>
            <div className="text-2xl font-extrabold text-gray-900">₱35,000</div>
            <div className="text-[10px] text-gray-400 mt-1">Current planting cycle</div>
          </div>
          <div className="border-r border-gray-100 pr-6 pl-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paid to Date</div>
            <div className="text-2xl font-extrabold text-gray-900">₱10,000</div>
            <div className="text-[10px] text-gray-400 mt-1">Via deductions</div>
          </div>
          <div className="border-r border-gray-100 pr-6 pl-2">
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Outstanding Balance</div>
            <div className="text-2xl font-extrabold text-red-600">₱25,000</div>
            <div className="text-[10px] text-gray-400 mt-1">Amount to collect</div>
          </div>
          <div className="pl-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Harvest</div>
            <div className="text-2xl font-extrabold text-[#0F3D21]">₱120,000</div>
            <div className="text-[10px] text-gray-400 mt-1">Based on 2.5 ha yield</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-8">
          {['Overview', 'Transactions', 'Payments'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-[#0F3D21] text-[#0F3D21]' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Primary Number</div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" /> +63 917 123 4567
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Secondary Contact</div>
                    <div className="text-sm font-bold text-gray-900">Maria Mendoza (Wife) - +63 918 987 6543</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Farm Details</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Complete Address</div>
                    <div className="text-sm font-bold text-gray-900">Purok 5, Brgy. Tibal-og, Santo Tomas, Davao del Norte</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Farm Lot Number</div>
                    <div className="text-sm font-bold text-gray-900">Lot-882-A</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#EAF7EF] rounded-xl p-6 border border-[#0F3D21]/10 flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-[#0F3D21] uppercase tracking-wider mb-1">Action Required</div>
                <div className="text-sm text-[#0F3D21]/70">Outstanding Balance to Collect upon Harvest</div>
              </div>
              <div className="text-3xl font-extrabold text-[#0F3D21]">₱25,000</div>
            </div>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 pr-4">Date</th>
                  <th className="px-4 py-4">Reference</th>
                  <th className="px-4 py-4">Item / Description</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="pl-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                <tr className="hover:bg-gray-50/50">
                  <td className="py-4 pr-4 text-gray-500">Oct 12, 2024</td>
                  <td className="px-4 py-4 text-gray-500">TRX-1011</td>
                  <td className="px-4 py-4 font-bold text-gray-900">Urea (46-0-0) x 10 bags</td>
                  <td className="px-4 py-4 font-bold text-gray-900">₱12,000.00</td>
                  <td className="pl-4 py-4"><span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Unpaid</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-4 pr-4 text-gray-500">Sep 28, 2024</td>
                  <td className="px-4 py-4 text-gray-500">TRX-0982</td>
                  <td className="px-4 py-4 font-bold text-gray-900">Cash Advance - Labor</td>
                  <td className="px-4 py-4 font-bold text-gray-900">₱13,000.00</td>
                  <td className="pl-4 py-4"><span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Unpaid</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-4 pr-4 text-gray-500">Sep 05, 2024</td>
                  <td className="px-4 py-4 text-gray-500">TRX-0915</td>
                  <td className="px-4 py-4 font-bold text-gray-900">Land Preparation (Tractor)</td>
                  <td className="px-4 py-4 font-bold text-gray-900">₱10,000.00</td>
                  <td className="pl-4 py-4"><span className="bg-[#EAF7EF] text-[#0F3D21] border border-[#0F3D21]/20 px-2.5 py-1 rounded-full text-[10px] font-bold">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 pr-4">Date of Payment</th>
                  <th className="px-4 py-4">Linked Transaction</th>
                  <th className="px-4 py-4">Amount Paid</th>
                  <th className="pl-4 py-4">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                <tr className="hover:bg-gray-50/50">
                  <td className="py-4 pr-4 text-gray-500">Oct 01, 2024</td>
                  <td className="px-4 py-4 text-gray-500 font-medium">TRX-0915</td>
                  <td className="px-4 py-4 font-bold text-[#0F3D21]">₱10,000.00</td>
                  <td className="pl-4 py-4 font-bold text-gray-900">₱25,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
