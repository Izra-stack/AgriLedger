import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddFarmerModal from '../components/dashboard/AddFarmerModal';

export default function FarmersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Farmers</h2>
          <p className="text-sm text-gray-500">Manage your network of cooperative farmers and lot owners.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search farmer..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-dark"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#154226] hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            <Plus size={16} /> Add Farmer
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Farmer Name</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Number</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location / Area</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Hectares</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { id: 'FRM-001', name: 'Jose Mendoza', loc: 'Brgy. Tibal-og, Santo Tomas', status: 'Active', area: '2.5 ha' },
              { id: 'FRM-002', name: 'Rodolfo Cruz', loc: 'Brgy. Bobon, Santo Tomas', status: 'Active', area: '3.0 ha' },
              { id: 'FRM-003', name: 'Gloria Pangilinan', loc: 'Brgy. San Miguel, Santo Tomas', status: 'Inactive', area: '1.8 ha' },
              { id: 'FRM-004', name: 'Vicente O. Magsaysay', loc: 'Brgy. Tibal-og, Santo Tomas', status: 'Active', area: '4.2 ha' },
            ].map((farmer) => (
              <tr 
                key={farmer.id} 
                onClick={() => navigate(`/dashboard/farmers/${farmer.id}`)}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAF7EF] text-[#0F3D21] font-bold text-xs flex items-center justify-center">
                      {farmer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                    <span className="font-bold text-gray-900 group-hover:text-[#0F3D21] transition-colors">{farmer.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 font-medium">{farmer.id}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{farmer.loc}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${farmer.status === 'Active' ? 'bg-[#EAF7EF] text-[#0F3D21] border-[#0F3D21]/20' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {farmer.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{farmer.area}</td>
                <td className="px-4 py-4 text-right text-gray-400">
                  <button className="hover:text-gray-900 p-1" onClick={(e) => e.stopPropagation()}><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddFarmerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
