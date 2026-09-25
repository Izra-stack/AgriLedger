import { ArrowLeft, Edit2, Plus, Phone, MapPin } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import { useQuery } from '@tanstack/react-query';
import { getFarmers, getTransactions, getPayments } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';
import { format } from 'date-fns';

export default function FarmerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: farmers = [] } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const { data: allTransactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });
  const { data: allPayments = [] } = useQuery({ queryKey: ['payments'], queryFn: getPayments });

  const farmer = farmers.find((f: any) => f.id === id);
  const transactions = allTransactions.filter((t: any) => t.farmerId === id);

  // Derived state
  const farmerPayments = useMemo(() => {
    const txIds = new Set(transactions.map(t => t.id));
    return allPayments.filter(p => txIds.has(p.transactionId));
  }, [allPayments, transactions]);

  const totalBorrowed = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const outstandingBalance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.balance, 0);
  }, [transactions]);

  const paidToDate = totalBorrowed - outstandingBalance;
  
  const estimatedHarvest = (farmer?.area || 0) * 48000;

  if (!farmer) {
    return (
      <div className="space-y-6 max-w-5xl">
        <button onClick={() => navigate('/dashboard/farmers')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark">
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <EmptyState title="Farmer not found" description="The farmer you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <button 
        onClick={() => navigate('/dashboard/farmers')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <Card className="p-4 md:p-8">
        
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF7EF] text-[#0F3D21] text-2xl font-bold flex items-center justify-center shrink-0">
              {farmer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{farmer.name}</h2>
                <Badge variant={farmer.status === 'Active' ? 'success' : 'neutral'}>
                  {farmer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 font-medium">
                <span>{farmer.id}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {farmer.location}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{farmer.area} ha</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none">
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none">
              <Plus size={16} className="mr-2" /> New Transaction
            </Button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 border border-gray-100 rounded-xl p-6">
          <div className="md:border-r border-gray-100 pr-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Borrowed</div>
            <div className="text-2xl font-extrabold text-gray-900">₱{totalBorrowed.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Current planting cycle</div>
          </div>
          <div className="md:border-r border-gray-100 pr-6 pl-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paid to Date</div>
            <div className="text-2xl font-extrabold text-gray-900">₱{paidToDate.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Via deductions or cash</div>
          </div>
          <div className="md:border-r border-gray-100 pr-6 pl-2">
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Outstanding Balance</div>
            <div className="text-2xl font-extrabold text-red-600">₱{outstandingBalance.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Amount to collect</div>
          </div>
          <div className="pl-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Harvest</div>
            <div className="text-2xl font-extrabold text-[#0F3D21]">₱{estimatedHarvest.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Based on {farmer.area} ha yield</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto custom-scrollbar">
          {['Overview', 'Transactions', 'Payments'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
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
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Primary Number</div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" /> {farmer.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Secondary Contact</div>
                    <div className="text-sm font-bold text-gray-900">{farmer.notes || "No secondary contact"}</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Farm Details</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Complete Address</div>
                    <div className="text-sm font-bold text-gray-900">{farmer.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Hectares</div>
                    <div className="text-sm font-bold text-gray-900">{farmer.area} ha</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#EAF7EF] rounded-xl p-6 border border-[#0F3D21]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-xs font-bold text-[#0F3D21] uppercase tracking-wider mb-1">Action Required</div>
                <div className="text-sm text-[#0F3D21]/70">Outstanding Balance to Collect upon Harvest</div>
              </div>
              <div className="text-3xl font-extrabold text-[#0F3D21]">₱{outstandingBalance.toLocaleString()}</div>
            </div>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="animate-in fade-in duration-200">
            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-gray-500">{format(new Date(tx.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell className="font-bold text-gray-900">{tx.type}</TableCell>
                      <TableCell className="font-bold text-gray-900">₱{tx.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'Paid' ? 'success' : tx.status === 'Partial' ? 'warning' : 'danger'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No transactions yet" description="This farmer has no recorded transactions." />
            )}
          </div>
        )}

        {activeTab === 'Payments' && (
          <div className="animate-in fade-in duration-200">
            {farmerPayments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date of Payment</TableHead>
                    <TableHead>Linked Transaction</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Amount Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmerPayments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-gray-500">{format(new Date(payment.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-medium text-gray-500">{payment.transactionId}</TableCell>
                      <TableCell className="text-gray-500">{payment.notes || '-'}</TableCell>
                      <TableCell className="font-bold text-[#0F3D21]">₱{payment.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No payments yet" description="This farmer has no recorded payments." />
            )}
          </div>
        )}

      </Card>
      
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
