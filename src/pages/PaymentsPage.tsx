import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getPayments, getFarmers, getTransactions } from '../lib/api';
import { downloadCsv } from '../lib/export';
import RecordPaymentModal from '../components/dashboard/RecordPaymentModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';

export default function PaymentsPage() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  
  const { data: payments = [], isLoading: isPaymentsLoading, isError: isPaymentsError } = useQuery({ queryKey: ['payments'], queryFn: getPayments });
  const { data: farmers = [], isLoading: isFarmersLoading, isError: isFarmersError } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const { data: transactions = [], isLoading: isTransactionsLoading, isError: isTransactionsError } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });

  // Derive payment totals from the live payment and transaction queries. This
  // keeps this page independent from the broader dashboard analytics query.
  const totalExpected = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions],
  );
  const collectedAmount = useMemo(
    () => payments.reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  );
  const outstandingBalance = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.balance, 0),
    [transactions],
  );
  
  const fullySettledFarmers = useMemo(() => {
    const farmerBalances = new Map<string, number>();
    farmers.forEach((f: any) => farmerBalances.set(f.id, 0));
    
    transactions.forEach((tx: any) => {
      const current = farmerBalances.get(tx.farmerId) || 0;
      farmerBalances.set(tx.farmerId, current + tx.balance);
    });

    let settledCount = 0;
    farmerBalances.forEach((balance, farmerId) => {
      const hasTransactions = transactions.some((t: any) => t.farmerId === farmerId);
      if (hasTransactions && balance <= 0) {
        settledCount++;
      }
    });
    
    return settledCount;
  }, [farmers, transactions]);

  const enrichedPayments = payments;


  return (
    <div className="space-y-6">
      {(isPaymentsError || isFarmersError || isTransactionsError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load payment summaries. Please refresh and try again.
        </div>
      )}
      {(isPaymentsLoading || isFarmersLoading || isTransactionsLoading) && (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          Loading payment summaries...
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Payments & Collections</h2>
          <p className="text-sm text-gray-500">Track incoming harvest payments and outstanding balances.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => downloadCsv(
            `agriledger-payments-${new Date().toISOString().slice(0, 10)}.csv`,
            ["Date", "Farmer", "Transaction", "Amount", "Total Due", "Method", "Status"],
            payments.map((payment) => [payment.date, payment.farmerName, payment.transactionId, payment.amount, payment.totalDue, payment.method, payment.txStatus]),
          )}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button onClick={() => setIsRecordModalOpen(true)}>
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Expected', amount: `₱${totalExpected.toLocaleString()}`, icon: Wallet, color: 'text-gray-900' },
          { title: 'Collected Amount', amount: `₱${collectedAmount.toLocaleString()}`, icon: ArrowDownRight, color: 'text-[#0F3D21]' },
          { title: 'Outstanding Balance', amount: `₱${outstandingBalance.toLocaleString()}`, icon: ArrowUpRight, color: 'text-red-600' },
          { title: 'Fully Settled Accounts', amount: fullySettledFarmers.toString(), icon: CheckCircle2, color: 'text-[#0F3D21]' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Icon size={16} />
                </div>
              </div>
              <span className={`text-3xl font-extrabold ${stat.color}`}>{stat.amount}</span>
            </Card>
          )
        })}
      </div>

      <Card className="p-8">
        <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Recent Collections</h3>
        
        {enrichedPayments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Date</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Total Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedPayments.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-gray-500">
                    {format(new Date(row.date), 'MMM dd, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">{row.farmerName}</TableCell>
                  <TableCell className="text-gray-600">₱{row.totalDue.toLocaleString()}</TableCell>
                  <TableCell className="font-bold text-[#0F3D21]">₱{row.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-500">{row.method}</TableCell>
                  <TableCell>
                    <Badge variant={row.txStatus === 'Paid' ? 'success' : row.txStatus === 'Partial' ? 'warning' : 'danger'}>
                      {row.txStatus === 'Paid' ? 'Settled' : row.txStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState 
            title="No payments found" 
            description="There are no payments recorded yet." 
          />
        )}
      </Card>
      
      <RecordPaymentModal isOpen={isRecordModalOpen} onClose={() => setIsRecordModalOpen(false)} />
    </div>
  );
}
