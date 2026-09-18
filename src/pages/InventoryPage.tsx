import { Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import AddInventoryModal from '../components/dashboard/AddInventoryModal';

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory & Supplies</h2>
          <p className="text-sm text-gray-500">Manage warehouse stock, fertilizers, seeds, and farm inputs.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#154226] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex gap-6 border-b border-gray-100 mb-6">
        {['All Items', 'Fertilizers', 'Seeds', 'Chemicals'].map((tab, i) => (
          <button key={i} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${i === 1 ? 'border-[#0F3D21] text-[#0F3D21]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-dark"
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU / Code</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {[
              { name: 'Urea (46-0-0) Pellets', sku: 'FERT-001', cat: 'Fertilizer', stock: 14, max: 100, status: 'Critical', price: '₱1,200.00' },
              { name: 'Complete 14-14-14', sku: 'FERT-002', cat: 'Fertilizer', stock: 22, max: 100, status: 'Low Stock', price: '₱1,500.00' },
              { name: 'Muriate of Potash', sku: 'FERT-003', cat: 'Fertilizer', stock: 85, max: 100, status: 'Good', price: '₱1,100.00' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-500">{item.sku}</td>
                <td className="px-6 py-4 text-gray-500">{item.cat}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 w-40">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${item.status === 'Critical' ? 'bg-red-500' : item.status === 'Low Stock' ? 'bg-[#dfa43a]' : 'bg-[#0F3D21]'}`} 
                        style={{ width: `${(item.stock / item.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8">{item.stock}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    item.status === 'Good' ? 'bg-[#EAF7EF] text-[#0F3D21] border-[#0F3D21]/20' : 
                    item.status === 'Low Stock' ? 'bg-[#fefce8] text-[#dfa43a] border-[#dfa43a]/30' : 
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AddInventoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
