import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFarmers, getInventory, createTransaction } from "../../lib/api";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const { data: farmers = [] } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const { data: inventory = [] } = useQuery({ queryKey: ['inventory'], queryFn: getInventory });

  const [transactionCategory, setTransactionCategory] = useState<"CASH_ASSISTANCE" | "FARM_INPUT">("CASH_ASSISTANCE");
  const [selectedFarmerInput, setSelectedFarmerInput] = useState("");
  
  // Cash Assistance state
  const [cashAmount, setCashAmount] = useState<number | "">("");
  const [purpose, setPurpose] = useState("");
  
  // Farm Input state
  const [inputCategory, setInputCategory] = useState<string>("Fertilizer");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [releaseQuantity, setReleaseQuantity] = useState<number | "">("");
  
  // Shared state
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");

  // Filter inventory by category
  const filteredInventoryItems = useMemo(() => {
    return inventory.filter((item: any) => {
      const cat = item.category?.toLowerCase();
      const targetCat = inputCategory.toLowerCase();
      if (targetCat === "chemical" || targetCat === "chemicals") {
        return cat === "chemical" || cat === "chemicals";
      }
      if (targetCat === "pesticide" || targetCat === "pesticides") {
        return cat === "pesticide" || cat === "pesticides";
      }
      return cat === targetCat;
    });
  }, [inventory, inputCategory]);

  const selectedItem = useMemo(() => {
    return inventory.find((i: any) => i.id === selectedItemId) || null;
  }, [inventory, selectedItemId]);

  const calculatedTotalValue = useMemo(() => {
    if (transactionCategory === "FARM_INPUT" && selectedItem && typeof releaseQuantity === "number") {
      return selectedItem.price * releaseQuantity;
    }
    return 0;
  }, [transactionCategory, selectedItem, releaseQuantity]);

  // Reset item selection when category changes
  useEffect(() => {
    setSelectedItemId("");
    setReleaseQuantity("");
  }, [inputCategory]);

  useEffect(() => {
    if (isOpen) {
      setTransactionCategory("CASH_ASSISTANCE");
      setSelectedFarmerInput("");
      setCashAmount("");
      setPurpose("");
      setInputCategory("Fertilizer");
      setSelectedItemId("");
      setReleaseQuantity("");
      setDate(new Date().toISOString().slice(0, 16));
      setNotes("");
    }
  }, [isOpen]);

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAnalytics'] });
      toast.success("Transaction recorded successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to record transaction.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetFarmer = farmers.find(
      f => f.name.toLowerCase() === selectedFarmerInput.trim().toLowerCase() ||
           f.id === selectedFarmerInput ||
           f.farmerCode?.toLowerCase() === selectedFarmerInput.trim().toLowerCase()
    );

    if (!targetFarmer) {
      toast.error("Please select a valid farmer from the list.");
      return;
    }

    if (transactionCategory === "CASH_ASSISTANCE") {
      const amountNum = Number(cashAmount);
      if (!cashAmount || amountNum <= 0) {
        toast.error("Please enter a valid cash amount greater than zero.");
        return;
      }

      createMutation.mutate({
        farmer_id: targetFarmer.id,
        type: "CASH_ASSISTANCE",
        amount: amountNum,
        description: purpose ? `Purpose: ${purpose}${notes ? ` | ${notes}` : ''}` : notes || "Cash Assistance",
        transaction_date: new Date(date)
      });
    } else {
      // Farm Input
      if (!selectedItem) {
        toast.error("Please select an item from inventory.");
        return;
      }

      const qtyNum = Number(releaseQuantity);
      if (!releaseQuantity || qtyNum <= 0) {
        toast.error("Please enter a valid release quantity greater than zero.");
        return;
      }

      if (qtyNum > selectedItem.stock) {
        toast.error(`Quantity released (${qtyNum}) cannot exceed available stock (${selectedItem.stock}).`);
        return;
      }

      const totalVal = calculatedTotalValue;

      createMutation.mutate({
        farmer_id: targetFarmer.id,
        inventory_item_id: selectedItem.id,
        type: inputCategory.toUpperCase().replace(/\s+/g, '_'),
        quantity: qtyNum,
        unit_price: selectedItem.price,
        amount: totalVal,
        description: `Released ${qtyNum} ${selectedItem.name}${notes ? ` | ${notes}` : ''}`,
        transaction_date: new Date(date)
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Transaction"
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createMutation.isPending}
            className="min-w-[120px]"
          >
            {createMutation.isPending ? "Saving..." : "Save Transaction"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction System Switcher */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Transaction System Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTransactionCategory("CASH_ASSISTANCE")}
              className={`w-full py-3 px-3 rounded-xl text-xs font-bold transition-all border ${
                transactionCategory === "CASH_ASSISTANCE"
                  ? "bg-[#0F3D21] text-white border-[#0F3D21] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Cash Assistance
            </button>
            <button
              type="button"
              onClick={() => setTransactionCategory("FARM_INPUT")}
              className={`w-full py-3 px-3 rounded-xl text-xs font-bold transition-all border ${
                transactionCategory === "FARM_INPUT"
                  ? "bg-[#0F3D21] text-white border-[#0F3D21] shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Farm Input
            </button>
          </div>
        </div>

        {/* Farmer Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Farmer Name
          </label>
          <Input
            list="farmers-list"
            placeholder="Type or select farmer..."
            value={selectedFarmerInput}
            onChange={(e) => setSelectedFarmerInput(e.target.value)}
            required
          />
          <datalist id="farmers-list">
            {farmers.map((f: any) => (
              <option key={f.id} value={f.name}>
                {f.farmerCode ? `${f.farmerCode}` : ''} {f.location ? `- ${f.location}` : ''}
              </option>
            ))}
          </datalist>
        </div>

        {/* CASH ASSISTANCE WORKFLOW */}
        {transactionCategory === "CASH_ASSISTANCE" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Cash Amount (₱)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value === "" ? "" : Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Purpose / Reason
              </label>
              <Input
                placeholder="e.g. Emergency medical assistance, land prep, equipment repair"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </>
        )}

        {/* FARM INPUT WORKFLOW */}
        {transactionCategory === "FARM_INPUT" && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Input Category
              </label>
              <Select
                value={inputCategory}
                onChange={(e) => setInputCategory(e.target.value)}
              >
                <option value="Fertilizer">Fertilizer</option>
                <option value="Seeds">Seeds</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Pesticides">Pesticides</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Inventory Item
              </label>
              <Select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">Select item from inventory...</option>
                {filteredInventoryItems.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — Available: {item.stock} {item.unit || 'units'} (₱{item.price.toLocaleString()}/unit)
                  </option>
                ))}
              </Select>
            </div>

            {selectedItem && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">{selectedItem.name}</span>
                  <span className="text-emerald-700">Unit Price: ₱{selectedItem.price.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-900 block">In Stock: {selectedItem.stock}</span>
                  <span className="text-emerald-700">SKU: {selectedItem.sku}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Quantity Released
              </label>
              <Input
                type="number"
                step="1"
                min="1"
                max={selectedItem ? selectedItem.stock : undefined}
                placeholder="Enter quantity to release..."
                value={releaseQuantity}
                onChange={(e) => setReleaseQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={!selectedItem}
                required
              />
              {selectedItem && typeof releaseQuantity === "number" && releaseQuantity > selectedItem.stock && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                  ⚠️ Quantity exceeds available stock ({selectedItem.stock})
                </p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Calculated Total Value:</span>
              <span className="text-xl font-extrabold text-[#0F3D21]">
                ₱{calculatedTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </>
        )}

        {/* SHARED FIELDS */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Date & Time
          </label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Notes / Remarks (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none bg-white"
          />
        </div>
      </form>
    </Modal>
  );
}

