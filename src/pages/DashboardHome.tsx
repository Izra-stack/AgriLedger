import { Wallet, Users, ArrowRightLeft, Activity, Plus, FileCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import RecordPaymentModal from '../components/dashboard/RecordPaymentModal';
import AddFarmerModal from '../components/dashboard/AddFarmerModal';

export default function DashboardHome() {
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0F3D21] rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 text-[#a0d2b4] text-xs font-bold uppercase tracking-widest mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a0d2b4]"></div>
            Wet Season Harvest Active
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Maayong adlaw, Owner!</h2>
          <p className="text-white/70 text-sm max-w-lg leading-relaxed">
            Here is your financial and producer overview for Santo Tomas buying stations and partner farm lots.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            onClick={() => setIsAddTxModalOpen(true)}
            className="bg-[#a0d2b4] hover:bg-[#8bc5a1] text-[#0F3D21] font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> New Transaction
          </button>
          <button 
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <FileCheck size={16} /> Record Payment
          </button>
          <button 
            onClick={() => setIsAddFarmerModalOpen(true)}
            className="bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <UserPlus size={16} /> Add Farmer
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Active Farmers</span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-extrabold text-gray-900">142</span>
            <div className="text-xs text-[#0F3D21] font-bold mt-1 flex items-center gap-1">+12 this month</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cash Advances</span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-extrabold text-gray-900">₱450.5k</span>
            <div className="text-xs text-gray-400 mt-1">Outstanding receivables</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fertilizer Dispersed</span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <ArrowRightLeft size={16} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-extrabold text-gray-900">1,240 <span className="text-sm text-gray-500 font-medium">bags</span></span>
            <div className="text-xs text-[#dfa43a] font-bold mt-1">20% remaining in stock</div>
          </div>
        </div>

        <div className="bg-[#154226] p-6 rounded-2xl shadow-sm border border-[#0F3D21] flex flex-col text-white">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-brand-light/70 uppercase tracking-wider">Est. Yield Return</span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Activity size={16} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-extrabold">₱2.4M</span>
            <div className="text-xs text-[#a0d2b4] font-bold mt-1">Expected upon harvest collection</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent Transactions</h3>
            <button className="text-xs font-bold text-[#0F3D21] hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date / Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">Oct 24, 9:20 AM</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Bienvenido Lumbres</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">Brgy. Tibal-og</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Fertilizer</span></td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱12,000.00</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱28,450.00</td>
                  <td className="px-6 py-4"><span className="bg-[#EAF7EF] text-[#0F3D21] border border-[#0F3D21]/20 px-2.5 py-1 rounded-full text-[10px] font-bold">Paid</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">Oct 23, 2:15 PM</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Gloria Pangilinan</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">Brgy. San Miguel</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Cash Advance</span></td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱19,000.00</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱10,000.00</td>
                  <td className="px-6 py-4"><span className="bg-[#fefce8] text-[#dfa43a] border border-[#dfa43a]/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Partial</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 text-xs">Oct 23, 4:10 PM</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Vicente O. Magsaysay</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">Brgy. Tibal-og (Purok 5)</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">Mixed Package</span></td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱32,000.00</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₱32,000.00</td>
                  <td className="px-6 py-4"><span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">Unpaid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 mt-auto text-center">
            <span className="text-xs text-gray-400">Showing 3 of 124 transactions recorded this week</span>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Priority Follow-Up */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Priority Follow-up</h4>
                <h3 className="text-sm font-bold text-gray-900">High Outstanding Balances</h3>
              </div>
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">BL</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Bienvenido Lumbres</div>
                    <div className="text-[10px] text-gray-400">Brgy. Tibal-og • 2.5 ha</div>
                    <div className="text-[10px] font-bold text-gray-900 mt-0.5">₱28,450.00 <span className="text-gray-400 font-normal">due</span></div>
                  </div>
                </div>
                <button className="border border-[#0F3D21]/20 text-[#0F3D21] hover:bg-[#EAF7EF] px-3 py-1 rounded-full text-[10px] font-bold transition-colors">Collect</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">RC</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Rodolfo Cruz</div>
                    <div className="text-[10px] text-gray-400">Brgy. Bobon • 3.0 ha</div>
                    <div className="text-[10px] font-bold text-gray-900 mt-0.5">₱22,000.00 <span className="text-gray-400 font-normal">due</span></div>
                  </div>
                </div>
                <button className="border border-[#0F3D21]/20 text-[#0F3D21] hover:bg-[#EAF7EF] px-3 py-1 rounded-full text-[10px] font-bold transition-colors">Collect</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">GP</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Gloria Pangilinan</div>
                    <div className="text-[10px] text-gray-400">Brgy. San Miguel • 1.8 ha</div>
                    <div className="text-[10px] font-bold text-gray-900 mt-0.5">₱19,300.00 <span className="text-gray-400 font-normal">due</span></div>
                  </div>
                </div>
                <button className="border border-[#0F3D21]/20 text-[#0F3D21] hover:bg-[#EAF7EF] px-3 py-1 rounded-full text-[10px] font-bold transition-colors">Collect</button>
              </div>
            </div>
            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg transition-colors border border-gray-100">
              View All 86 Pending Accounts
            </button>
          </div>

          {/* Warehouse Monitor */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Warehouse Monitor</h4>
                <h3 className="text-sm font-bold text-gray-900">Stock Level Indicator</h3>
              </div>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold border border-red-100">Action Needed</span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-gray-900">Urea (46-0-0) Pellets</span>
                  <span className="text-[10px] font-bold text-red-500">14 bags left</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-400">Safety min: 50 bags</span>
                  <span className="text-red-500 font-bold">Critical</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-gray-900">Complete 14-14-14 Fertilizer</span>
                  <span className="text-[10px] font-bold text-[#dfa43a]">22 bags left</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                  <div className="bg-[#dfa43a] h-1.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-400">Safety min: 50 bags</span>
                  <span className="text-[#dfa43a] font-bold">Reorder Soon</span>
                </div>
              </div>
            </div>

            <button className="mt-auto pt-6 text-[#0F3D21] text-xs font-bold hover:underline flex items-center justify-center gap-1 w-full">
              Manage Stock & Supplier Orders <ArrowRightLeft size={12} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Render Modals at Root Level */}
      <AddTransactionModal isOpen={isAddTxModalOpen} onClose={() => setIsAddTxModalOpen(false)} />
      <RecordPaymentModal isOpen={isRecordPaymentModalOpen} onClose={() => setIsRecordPaymentModalOpen(false)} />
      <AddFarmerModal isOpen={isAddFarmerModalOpen} onClose={() => setIsAddFarmerModalOpen(false)} />
    </div>
  );
}
