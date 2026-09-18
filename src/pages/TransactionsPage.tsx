import { Plus, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Transactions</h2>
          <p className="text-sm text-gray-500">Full ledger history of inputs, cash advances, and deductions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#154226] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <Plus size={16} /> New Transaction
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-dark bg-white">
          <option>All Types</option>
          <option>Fertilizer</option>
          <option>Cash Advance</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-dark bg-white">
          <option>All Status</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date / Time</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Farmer Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {[
              { date: 'Oct 23, 2024 4:10 PM', name: 'John Mark M. Landim', ref: 'TRX-1029', type: 'Fertilizer', amount: '₱12,000.00', status: 'Paid' },
              { date: 'Oct 23, 2024 2:30 PM', name: 'Jhon Doe J. Ramon', ref: 'TRX-1030', type: 'Cash Advance', amount: '₱19,000.00', status: 'Partial' },
              { date: 'Oct 22, 2024 9:15 AM', name: 'Vicente O. Magsaysay', ref: 'TRX-1031', type: 'Mixed Package', amount: '₱32,000.00', status: 'Unpaid' },
              { date: 'Oct 22, 2024 8:00 AM', name: 'Rodolfo Cruz', ref: 'TRX-1032', type: 'Fertilizer', amount: '₱8,500.00', status: 'Paid' },
            ].map((trx, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{trx.name}</td>
                <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" /> {trx.ref}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">{trx.type}</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{trx.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    trx.status === 'Paid' ? 'bg-[#EAF7EF] text-[#0F3D21] border-[#0F3D21]/20' : 
                    trx.status === 'Partial' ? 'bg-[#fefce8] text-[#dfa43a] border-[#dfa43a]/30' : 
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
