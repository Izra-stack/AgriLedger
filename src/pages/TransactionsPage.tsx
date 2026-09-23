import { Plus, FileText, Download, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../lib/api';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx: any) => {
      const farmerName = tx.farmerName || "";
      const matchesSearch = tx.transactionCode?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            farmerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All" || tx.type === typeFilter;
      const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  return (
    <Card className="p-4 md:p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Transactions</h2>
          <p className="text-sm text-gray-500">Full ledger history of inputs, cash advances, and deductions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none whitespace-nowrap">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 md:flex-none whitespace-nowrap">
            <Plus size={16} className="mr-2" /> New Transaction
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          icon={<Search size={16} />}
          placeholder="Search ref or farmer..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-dark bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Cash Advance">Cash Advance</option>
            <option value="Mixed Package">Mixed Package</option>
            <option value="Labor">Labor</option>
            <option value="Seeds">Seeds</option>
            <option value="Chemicals">Chemicals</option>
          </select>
          <select 
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-brand-dark bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Date / Time</TableHead>
              <TableHead>Farmer Name</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((trx) => (
              <TableRow key={trx.id}>
                <TableCell className="text-gray-500 whitespace-nowrap">
                  {format(new Date(trx.date), 'MMM dd, yyyy h:mm a')}
                </TableCell>
                <TableCell className="font-bold text-gray-900">{trx.farmerName || "—"}</TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" /> {trx.transactionCode || trx.id}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold">
                    {trx.type}
                  </span>
                </TableCell>
                <TableCell className="font-bold text-gray-900">₱{trx.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={trx.status === 'Paid' ? 'success' : trx.status === 'Partial' ? 'warning' : 'danger'}>
                    {trx.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState 
          title="No transactions found" 
          description="Try adjusting your search query or filters." 
          action={
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setTypeFilter("All");
              setStatusFilter("All");
            }}>
              Clear Filters
            </Button>
          }
        />
      )}

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </Card>
  );
}
