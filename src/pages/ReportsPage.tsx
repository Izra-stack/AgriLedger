import { TrendingUp, TrendingDown, DollarSign, Activity, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getDashboardAnalytics } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

export default function ReportsPage() {
  const { data: summary } = useQuery({ queryKey: ['dashboardSummary'], queryFn: getDashboardSummary });
  const { data: analytics } = useQuery({ queryKey: ['dashboardAnalytics'], queryFn: getDashboardAnalytics });

  // Stats Calculation
  const totalLedgerValue = summary?.totalLedgerValue || 0;
  const totalOutstanding = summary?.totalOutstanding || 0;
  const totalCollected = summary?.totalCollected || 0;
  const collectionRate = summary?.collectionRate ? Number(summary.collectionRate).toFixed(1) : "0.0";

  // Chart Data
  const monthlyCollections = analytics?.monthlyCollections || [];
  
  // Format the backend names (e.g. FERTILIZER -> Fertilizer)
  const transactionTypesData = (analytics?.transactionTypesData || []).map((t: any) => ({
    name: t.name === 'CASH_ASSISTANCE' ? 'Cash Advance' : t.name === 'FERTILIZER' ? 'Fertilizer' : 'Other',
    value: t.value
  }));

  const COLORS = ['#0F3D21', '#195B31', '#dfa43a', '#FCD34D', '#A3E635'];

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Financial summaries, collection trends, and distribution metrics.</p>
        </div>
        <Button variant="outline" className="bg-white">
          <Download size={16} className="mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Ledger Value', amount: `₱${totalLedgerValue.toLocaleString()}`, icon: TrendingUp, color: 'text-[#0F3D21]' },
          { title: 'Total Collected', amount: `₱${totalCollected.toLocaleString()}`, icon: DollarSign, color: 'text-[#0F3D21]' },
          { title: 'Outstanding Balance', amount: `₱${totalOutstanding.toLocaleString()}`, icon: TrendingDown, color: 'text-red-600' },
          { title: 'Collection Rate', amount: `${collectionRate}%`, icon: Activity, color: 'text-gray-900' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Monthly Collections</h3>
          <div className="flex-1 min-h-0">
            {monthlyCollections.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCollections} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(val: number) => `₱${val.toLocaleString()}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, 'Collected']}
                  />
                  <Bar dataKey="amount" fill="#0F3D21" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No collection data available.</div>
            )}
          </div>
        </Card>

        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Disbursement by Type (Value)</h3>
          <div className="flex-1 min-h-0">
            {transactionTypesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionTypesData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {transactionTypesData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value: string) => <span className="text-xs font-medium text-gray-700 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No transaction data available.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
