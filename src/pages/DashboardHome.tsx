import { Wallet, Users, ArrowRightLeft, Activity, Plus, FileCheck, UserPlus } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import RecordPaymentModal from '../components/dashboard/RecordPaymentModal';
import AddFarmerModal from '../components/dashboard/AddFarmerModal';
import { getFarmers, getTransactions, getInventory } from '../lib/api';
import { Badge } from '../components/ui/Badge';

export default function DashboardHome() {
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);

  const navigate = useNavigate();

  const { data: farmers = [] } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });
  const { data: inventory = [] } = useQuery({ queryKey: ['inventory'], queryFn: getInventory });

  const activeFarmersCount = useMemo(() => farmers.filter(f => f.status === 'Active').length, [farmers]);

  const totalCashAdvances = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'Cash Advance' && tx.status !== 'Paid')
      .reduce((sum, tx) => sum + tx.balance, 0);
  }, [transactions]);

  const fertilizerDispersedValue = useMemo(() => {
    return transactions
      .filter(tx => tx.type === 'Fertilizer')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const estYieldReturn = useMemo(() => {
    return farmers.reduce((sum, f) => sum + (f.area * 48000), 0);
  }, [farmers]);

  const recentTransactions = useMemo(() => {
    return transactions
      .map(tx => ({
        ...tx,
        farmerName: farmers.find(f => f.id === tx.farmerId)?.name || "Unknown Farmer",
        location: farmers.find(f => f.id === tx.farmerId)?.location || "Unknown Location"
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions, farmers]);

  const highBalanceFarmers = useMemo(() => {
    const balances = new Map<string, number>();
    transactions.forEach(tx => {
      if (tx.status !== 'Paid') {
        const current = balances.get(tx.farmerId) || 0;
        balances.set(tx.farmerId, current + tx.balance);
      }
    });

    return Array.from(balances.entries())
      .map(([id, balance]) => {
        const farmer = farmers.find(f => f.id === id);
        return {
          id,
          name: farmer?.name || "Unknown",
          location: farmer?.location || "",
          area: farmer?.area || 0,
          balance
        };
      })
      .filter(f => f.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 3);
  }, [transactions, farmers]);

  const lowStockItems = useMemo(() => {
    return inventory
      .filter(item => item.stock <= item.reorderLevel)
      .sort((a, b) => (a.stock / a.reorderLevel) - (b.stock / b.reorderLevel))
      .slice(0, 3);
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0F3D21] rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
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
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsAddTxModalOpen(true)}
            className="w-full sm:w-auto bg-[#a0d2b4] hover:bg-[#8bc5a1] text-[#0F3D21] font-bold px-4 py-2.5 rounded-lg text-sm flex justify-center items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> New Transaction
          </button>
          <button 
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold px-4 py-2.5 rounded-lg text-sm flex justify-center items-center gap-2 transition-colors whitespace-nowrap"
          >
            <FileCheck size={16} /> Record Payment
          </button>
          <button 
            onClick={() => setIsAddFarmerModalOpen(true)}
            className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold px-4 py-2.5 rounded-lg text-sm flex justify-center items-center gap-2 transition-colors whitespace-nowrap"
          >
            <UserPlus size={16} /> Add Farmer
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Active Farmers</span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-extrabold text-gray-900">{activeFarmersCount}</span>
            <div className="text-xs text-[#0F3D21] font-bold mt-1 flex items-center gap-1">of {farmers.length} total farmers</div>
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
            <span className="text-3xl font-extrabold text-gray-900">₱{totalCashAdvances.toLocaleString()}</span>
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
            <span className="text-3xl font-extrabold text-gray-900">₱{fertilizerDispersedValue.toLocaleString()}</span>
            <div className="text-xs text-gray-400 mt-1">Total ledger value</div>
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
            <span className="text-3xl font-extrabold">₱{estYieldReturn.toLocaleString()}</span>
            <div className="text-xs text-[#a0d2b4] font-bold mt-1">Expected upon harvest collection</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Transactions */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Recent Transactions</h3>
            <button onClick={() => navigate('/dashboard/transactions')} className="text-xs font-bold text-[#0F3D21] hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date / Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-xs">{format(new Date(tx.date), 'MMM dd, h:mm a')}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 line-clamp-1">{tx.farmerName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₱{tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₱{tx.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.status === 'Paid' ? 'success' : tx.status === 'Partial' ? 'warning' : 'danger'}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No transactions recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-gray-100 mt-auto text-center">
            <span className="text-xs text-gray-400">Showing latest {recentTransactions.length} of {transactions.length} total transactions</span>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="flex flex-col gap-6">
          
          {/* Priority Follow-Up */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Priority Follow-up</h4>
                <h3 className="text-sm font-bold text-gray-900">High Outstanding Balances</h3>
              </div>
              {highBalanceFarmers.length > 0 && <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>}
            </div>

            <div className="space-y-4 mb-6">
              {highBalanceFarmers.length > 0 ? highBalanceFarmers.map(farmer => (
                <div key={farmer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                      {farmer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">{farmer.name}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1">{farmer.location} • {farmer.area} ha</div>
                      <div className="text-[10px] font-bold text-gray-900 mt-0.5">₱{farmer.balance.toLocaleString()} <span className="text-gray-400 font-normal">due</span></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsRecordPaymentModalOpen(true);
                      // In a real app we might pre-fill the modal with this farmer's transaction
                    }}
                    className="border border-[#0F3D21]/20 text-[#0F3D21] hover:bg-[#EAF7EF] px-3 py-1 rounded-full text-[10px] font-bold transition-colors"
                  >
                    Collect
                  </button>
                </div>
              )) : (
                <div className="text-sm text-gray-500 text-center py-4">All farmers are settled.</div>
              )}
            </div>
            
            {highBalanceFarmers.length > 0 && (
              <button onClick={() => navigate('/dashboard/farmers')} className="w-full mt-auto bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg transition-colors border border-gray-100">
                View All Farmers Directory
              </button>
            )}
          </div>

          {/* Warehouse Monitor */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Warehouse Monitor</h4>
                <h3 className="text-sm font-bold text-gray-900">Stock Level Indicator</h3>
              </div>
              {lowStockItems.length > 0 && (
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold border border-red-100">Action Needed</span>
              )}
            </div>

            <div className="space-y-5">
              {lowStockItems.length > 0 ? lowStockItems.map(item => {
                const isCritical = item.stock <= item.reorderLevel * 0.5;
                const percentage = Math.min((item.stock / (item.reorderLevel * 2)) * 100, 100);
                
                return (
                  <div key={item.id}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-gray-900">{item.name}</span>
                      <span className={`text-[10px] font-bold ${isCritical ? 'text-red-500' : 'text-[#dfa43a]'}`}>
                        {item.stock} left
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-[#dfa43a]'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-400">Safety min: {item.reorderLevel}</span>
                      <span className={`font-bold ${isCritical ? 'text-red-500' : 'text-[#dfa43a]'}`}>
                        {isCritical ? 'Critical' : 'Reorder Soon'}
                      </span>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-sm text-gray-500 text-center py-4">All stock levels are optimal.</div>
              )}
            </div>

            <button 
              onClick={() => navigate('/dashboard/inventory')}
              className="mt-auto pt-6 text-[#0F3D21] text-xs font-bold hover:underline flex items-center justify-center gap-1 w-full"
            >
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
