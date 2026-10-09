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
      <div className="w-full min-w-0 space-y-6">
        <button onClick={() => navigate('/dashboard/farmers')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark">
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <EmptyState title="Farmer not found" description="The farmer you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <button 
        onClick={() => navigate('/dashboard/farmers')}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition-colors"
      >
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <Card className="min-w-0 p-4 sm:p-6 lg:p-8">
        
        {/* Header Profile */}
        <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7EF] text-xl font-bold text-[#0F3D21] sm:h-16 sm:w-16 sm:text-2xl">
              {farmer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="min-w-0 break-words text-xl font-bold text-gray-900 sm:text-2xl">{farmer.name}</h2>
                <Badge variant={farmer.status === 'Active' ? 'success' : 'neutral'}>
                  {farmer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-gray-500 sm:gap-x-4">
                <span className="break-all">Farmer ID: {farmer.farmerCode}</span>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block"></span>
                <span className="flex min-w-0 items-start gap-1 break-words"><MapPin size={14} className="mt-0.5 shrink-0" /> {farmer.location}</span>
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block"></span>
                <span>{farmer.area} ha</span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Button variant="outline" className="w-full sm:flex-1 lg:w-auto lg:flex-none">
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:flex-1 lg:w-auto lg:flex-none">
              <Plus size={16} className="mr-2" /> New Transaction
            </Button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="mb-8 grid grid-cols-1 gap-0 rounded-xl border border-gray-100 p-4 sm:grid-cols-2 sm:gap-y-6 sm:p-6 lg:mb-10 lg:grid-cols-4 lg:gap-6 lg:gap-y-0">
          <div className="border-b border-gray-100 pb-4 sm:border-b-0 sm:border-r sm:pr-6 lg:border-r">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Borrowed</div>
            <div className="text-xl font-extrabold text-gray-900 sm:text-2xl">₱{totalBorrowed.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Current planting cycle</div>
          </div>
          <div className="border-b border-gray-100 py-4 sm:border-b-0 sm:pl-6 sm:pr-0 lg:border-r lg:py-0 lg:pl-0 lg:pr-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paid to Date</div>
            <div className="text-xl font-extrabold text-gray-900 sm:text-2xl">₱{paidToDate.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Via deductions or cash</div>
          </div>
          <div className="border-b border-gray-100 py-4 sm:border-b-0 sm:border-r sm:pl-0 sm:pr-6 lg:py-0">
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Outstanding Balance</div>
            <div className="text-xl font-extrabold text-red-600 sm:text-2xl">₱{outstandingBalance.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Amount to collect</div>
          </div>
          <div className="pt-4 sm:pl-6 lg:pl-0 lg:pt-0">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Harvest</div>
            <div className="text-xl font-extrabold text-[#0F3D21] sm:text-2xl">₱{estimatedHarvest.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-1">Based on {farmer.area} ha yield</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-6 overflow-x-auto border-b border-gray-100 custom-scrollbar sm:gap-8">
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
            <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2">
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
                    <div className="break-words text-sm font-bold text-gray-900">{farmer.notes || "No secondary contact"}</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Farm Details</h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Complete Address</div>
                    <div className="break-words text-sm font-bold text-gray-900">{farmer.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Total Hectares</div>
                    <div className="text-sm font-bold text-gray-900">{farmer.area} ha</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#0F3D21]/10 bg-[#EAF7EF] p-4 sm:flex-row sm:items-center sm:p-6">
              <div>
                <div className="text-xs font-bold text-[#0F3D21] uppercase tracking-wider mb-1">Action Required</div>
                <div className="text-sm text-[#0F3D21]/70">Outstanding Balance to Collect upon Harvest</div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F3D21] sm:text-3xl">₱{outstandingBalance.toLocaleString()}</div>
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
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialFarmer={farmer ? { id: farmer.id, name: farmer.name } : null}
      />
    </div>
  );
}
