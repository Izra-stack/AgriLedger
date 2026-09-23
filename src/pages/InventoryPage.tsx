import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import AddInventoryModal from '../components/dashboard/AddInventoryModal';
import EditInventoryModal from '../components/dashboard/EditInventoryModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventory, deleteInventoryItem as deleteInventoryItemApi } from '../lib/api';
import { InventoryItem } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { toast } from 'sonner';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/Table';

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('All Items');
  
  const queryClient = useQueryClient();
  const { data: inventory = [], isLoading } = useQuery({ queryKey: ['inventory'], queryFn: getInventory });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Item deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete item");
    }
  });

  const categories = ['All Items', 'Fertilizer', 'Seeds', 'Chemicals'];

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeTab === 'All Items' || item.category === activeTab;
      
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchQuery, activeTab]);

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  return (
    <Card className="p-4 md:p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Inventory & Supplies</h2>
          <p className="text-sm text-gray-500">Manage warehouse stock, fertilizers, seeds, and farm inputs.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Item
        </Button>
      </div>

      <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto custom-scrollbar">
        {categories.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-[#0F3D21] text-[#0F3D21]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Input 
          icon={<Search size={16} />}
          placeholder="Search inventory or SKU..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72"
        />
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter size={18} className="mr-2" /> Filter
        </Button>
      </div>

      <div className="overflow-x-auto">
        {filteredInventory.length > 0 ? (
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Item Name</TableHead>
                <TableHead>SKU / Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                // Calculate status based on stock vs reorderLevel
                const isCritical = item.stock <= item.reorderLevel * 0.5;
                const isLowStock = item.stock <= item.reorderLevel && !isCritical;
                const isGood = item.stock > item.reorderLevel;

                const status = isCritical ? 'Critical' : isLowStock ? 'Low Stock' : 'Good';
                
                // Max scale for the progress bar
                const maxScale = Math.max(item.stock, item.reorderLevel * 2, 100);
                const percentage = Math.min((item.stock / maxScale) * 100, 100);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-gray-900">{item.name}</TableCell>
                    <TableCell className="text-gray-500">{item.sku}</TableCell>
                    <TableCell className="text-gray-500">{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 w-40">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${
                              isCritical ? 'bg-red-500' : 
                              isLowStock ? 'bg-[#dfa43a]' : 
                              'bg-[#0F3D21]'
                            }`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8">{item.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isGood ? 'success' : isLowStock ? 'warning' : 'danger'}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-gray-400 hover:text-brand-dark hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState 
            title="No items found" 
            description="Try adjusting your search query or category tab." 
            action={
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setActiveTab("All Items");
              }}>
                Clear Filters
              </Button>
            }
          />
        )}
      </div>

      <AddInventoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      <EditInventoryModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }} 
        item={selectedItem} 
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Inventory Item"
        description={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone.`}
        confirmText="Delete Item"
        variant="danger"
      />
    </Card>
  );
}
