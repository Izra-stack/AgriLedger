import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import RecordPaymentModal from '../components/dashboard/RecordPaymentModal';

export default function PaymentsPage() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Payments & Collections</h2>
          <p className="text-sm text-gray-500">Track incoming harvest payments and outstanding balances.</p>
        </div>
        <button 
          onClick={() => setIsRecordModalOpen(true)}
          className="bg-[#154226] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Expected', amount: '₱1,250,000', icon: Wallet, color: 'text-gray-900' },
          { title: 'Collected This Month', amount: '₱420,500', icon: ArrowDownRight, color: 'text-[#0F3D21]' },
          { title: 'Outstanding Balance', amount: '₱829,500', icon: ArrowUpRight, color: 'text-red-600' },
          { title: 'Fully Settled Accounts', amount: '24', icon: CheckCircle2, color: 'text-[#0F3D21]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Icon size={16} />
                </div>
              </div>
              <span className={`text-3xl font-extrabold ${stat.color}`}>{stat.amount}</span>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8">
        <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Recent Collections</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Farmer</th>
                <th className="px-4 py-4">Total Due</th>
                <th className="px-4 py-4">Amount Paid</th>
                <th className="px-4 py-4">Method</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {[
                { date: 'Oct 24, 2024', name: 'Bienvenido Lumbres', due: '₱28,450.00', paid: '₱10,000.00', method: 'Cash', status: 'Partial' },
                { date: 'Oct 23, 2024', name: 'Rodolfo Cruz', due: '₱22,000.00', paid: '₱22,000.00', method: 'Bank Transfer', status: 'Settled' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-gray-500">{row.date}</td>
                  <td className="px-4 py-4 font-bold text-gray-900">{row.name}</td>
                  <td className="px-4 py-4 text-gray-600">{row.due}</td>
                  <td className="px-4 py-4 font-bold text-[#0F3D21]">{row.paid}</td>
                  <td className="px-4 py-4 text-gray-500">{row.method}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      row.status === 'Settled' ? 'bg-[#EAF7EF] text-[#0F3D21] border-[#0F3D21]/20' : 'bg-[#fefce8] text-[#dfa43a] border-[#dfa43a]/30'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <RecordPaymentModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </div>
  );
}
