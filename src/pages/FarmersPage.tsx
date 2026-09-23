import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddFarmerModal from '../components/dashboard/AddFarmerModal';
import { getFarmers, deleteFarmer } from '../lib/api';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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

export default function FarmersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const navigate = useNavigate();
  
  const { data: farmers = [], isLoading } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFarmer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success("Farmer deleted successfully.");
    },
    onError: () => toast.error("Failed to delete farmer.")
  });

  const filteredFarmers = useMemo(() => {
    return farmers.filter(farmer => {
      const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            farmer.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || farmer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, searchQuery, statusFilter]);

  return (
    <Card className="p-4 md:p-8 min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Farmers</h2>
          <p className="text-sm text-gray-500">Manage your network of cooperative farmers and lot owners.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Input 
            icon={<Search size={16} />}
            placeholder="Search farmer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-brand-dark bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none whitespace-nowrap">
              <Plus size={16} className="mr-2" /> Add Farmer
            </Button>
          </div>
        </div>
      </div>

      {filteredFarmers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farmer Name</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Area</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFarmers.map((farmer) => (
              <TableRow 
                key={farmer.id} 
                onClick={() => navigate(`/dashboard/farmers/${farmer.id}`)}
                className="cursor-pointer group"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAF7EF] text-[#0F3D21] font-bold text-xs flex items-center justify-center shrink-0">
                      {farmer.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                    <span className="font-bold text-gray-900 group-hover:text-[#0F3D21] transition-colors line-clamp-1">{farmer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{farmer.id}</TableCell>
                <TableCell className="text-gray-500 line-clamp-1">{farmer.location}</TableCell>
                <TableCell>
                  <Badge variant={farmer.status === 'Active' ? 'success' : 'neutral'}>
                    {farmer.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{farmer.area} ha</TableCell>
                <TableCell className="text-right text-gray-400 relative">
                  <button className="hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors" onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this farmer?")) {
                       // We can call delete mutation here!
                       deleteMutation.mutate(farmer.id);
                    }
                  }}>
                    <span className="text-red-500 text-sm hover:underline">Delete</span>
                  </button>
                  <button className="text-[#0F3D21] text-sm hover:underline ml-3" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFarmer(farmer);
                    setIsAddModalOpen(true);
                  }}>
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState 
          title="No farmers found" 
          description="Try adjusting your search query or filter to find what you're looking for." 
          action={
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}>
              Clear Filters
            </Button>
          }
        />
      )}

      <AddFarmerModal
        isOpen={isAddModalOpen}
        farmer={selectedFarmer}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedFarmer(null);
        }}
      />
    </Card>
  );
}
