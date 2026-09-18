import { TrendingUp, TrendingDown, DollarSign, Activity, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Financial summaries and cooperative performance metrics.</p>
        </div>
        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium bg-white">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', amount: '₱4,250,000', icon: TrendingUp, color: 'text-[#0F3D21]' },
          { title: 'Total Expenses', amount: '₱1,120,500', icon: TrendingDown, color: 'text-red-600' },
          { title: 'Net Profit', amount: '₱3,129,500', icon: DollarSign, color: 'text-[#0F3D21]' },
          { title: 'Avg Margin', amount: '24.5%', icon: Activity, color: 'text-gray-900' },
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
        <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Seasonal Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                <th className="px-6 py-4">Season / Period</th>
                <th className="px-6 py-4">Total Harvest (kg)</th>
                <th className="px-6 py-4">Gross Sales</th>
                <th className="px-6 py-4">Input Costs</th>
                <th className="px-6 py-4">Net Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {[
                { period: 'Wet Season 2024', harvest: '124,500', sales: '₱2,100,000', costs: '₱650,000', net: '₱1,450,000' },
                { period: 'Dry Season 2024', harvest: '98,200', sales: '₱1,850,000', costs: '₱420,500', net: '₱1,429,500' },
                { period: 'Wet Season 2023', harvest: '115,000', sales: '₱1,950,000', costs: '₱580,000', net: '₱1,370,000' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">{row.period}</td>
                  <td className="px-6 py-4 text-gray-600">{row.harvest}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{row.sales}</td>
                  <td className="px-6 py-4 text-red-600 font-medium">{row.costs}</td>
                  <td className="px-6 py-4 font-bold text-[#0F3D21]">{row.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
