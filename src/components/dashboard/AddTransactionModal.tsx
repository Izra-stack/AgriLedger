import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { transactionSchema, TransactionFormValues } from "../../lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFarmers, createTransaction } from "../../lib/api";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const { data: farmers = [] } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success("Transaction recorded successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to record transaction.");
    }
  });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "Fertilizer",
      date: new Date().toISOString().slice(0, 16) // Default to current datetime
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        type: "Fertilizer",
        date: new Date().toISOString().slice(0, 16)
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: TransactionFormValues) => {
    createMutation.mutate({
      farmer_id: data.farmerId,
      type: ({ 'Cash Advance': 'CASH_ASSISTANCE', Fertilizer: 'FERTILIZER', 'Mixed Package': 'MIXED_PACKAGE', Labor: 'LABOR', Seeds: 'SEEDS', Chemicals: 'CHEMICALS' } as Record<string, string>)[data.type],
      amount: data.amount,
      description: data.notes,
      transaction_date: new Date(data.date)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Transaction"
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Farmer
          </label>
          <Select
            {...register("farmerId")}
            className={errors.farmerId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          >
            <option value="">Select a farmer...</option>
            {farmers.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
            ))}
          </Select>
          {errors.farmerId && <p className="text-red-500 text-xs mt-1">{errors.farmerId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Transaction Type
          </label>
          <Select
            {...register("type")}
            className={errors.type ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          >
            <option value="Fertilizer">Fertilizer</option>
            <option value="Cash Advance">Cash Advance</option>
            <option value="Mixed Package">Mixed Package</option>
            <option value="Labor">Labor</option>
            <option value="Seeds">Seeds</option>
            <option value="Chemicals">Chemicals</option>
          </Select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Amount (₱)
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            className={errors.amount ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Date & Time
          </label>
          <Input
            type="datetime-local"
            {...register("date")}
            className={errors.date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Notes / Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Optional details..."
            {...register("notes")}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none bg-white"
          />
        </div>
      </form>
    </Modal>
  );
}
