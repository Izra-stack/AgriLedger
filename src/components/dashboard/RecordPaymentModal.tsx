import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { paymentSchema, PaymentFormValues } from "../../lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFarmers, getTransactions, createPayment } from "../../lib/api";
import { format } from "date-fns";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordPaymentModal({ isOpen, onClose }: RecordPaymentModalProps) {
  const queryClient = useQueryClient();
  const { data: allFarmers = [] } = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  const { data: allTransactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      toast.success("Payment recorded successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to record payment.");
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16)
    }
  });

  const selectedFarmerId = watch("farmerId");
  const selectedTxId = watch("transactionId");
  const currentAmount = watch("amount") || 0;

  // Derive relevant data
  const selectedFarmer = allFarmers.find(f => f.id === selectedFarmerId);
  
  const unpaidTransactions = allTransactions.filter(
    t => t.farmerId === selectedFarmerId && t.status !== 'Paid'
  );

  const totalOutstandingBalance = unpaidTransactions.reduce((sum, tx) => sum + tx.balance, 0);
  
  const selectedTx = unpaidTransactions.find(t => t.id === selectedTxId);

  // Auto-reset transaction when farmer changes
  useEffect(() => {
    setValue("transactionId", "");
  }, [selectedFarmerId, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date().toISOString().slice(0, 16),
        farmerId: "",
        transactionId: "",
        amount: 0
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: PaymentFormValues) => {
    if (selectedTx && data.amount > selectedTx.balance) {
      toast.error(`Amount cannot exceed the remaining balance of ₱${selectedTx.balance.toLocaleString()}`);
      return;
    }

    createMutation.mutate({
      farmer_id: data.farmerId,
      transaction_id: data.transactionId,
      amount: data.amount,
      payment_method: 'CASH',
      notes: data.notes,
      payment_date: new Date(data.date)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting || (Boolean(selectedFarmerId) && unpaidTransactions.length === 0)}
            className="min-w-[140px]"
          >
            {isSubmitting ? "Processing..." : "Record Payment"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Step 1: Select Farmer */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Farmer Name</label>
          <Select
            {...register("farmerId")}
            className={errors.farmerId ? "border-red-500 focus:border-red-500" : ""}
          >
            <option value="">Select a farmer...</option>
            {allFarmers.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.id})
              </option>
            ))}
          </Select>
          {errors.farmerId && <p className="text-red-500 text-xs mt-1">{errors.farmerId.message}</p>}
        </div>

        {/* Selected Farmer Info / Unpaid Transactions */}
        {selectedFarmer && (
          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-5">
            {unpaidTransactions.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500 font-medium">
                No outstanding balance for this farmer.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{selectedFarmer.name}</div>
                    <div className="text-[10px] text-gray-500">{unpaidTransactions.length} unpaid transaction(s)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Outstanding</div>
                    <div className="text-xl font-extrabold text-red-600">₱{totalOutstandingBalance.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Select Transaction to Pay</label>
                  <Select
                    {...register("transactionId")}
                    className={errors.transactionId ? "border-red-500 focus:border-red-500" : ""}
                  >
                    <option value="">Select an outstanding transaction...</option>
                    {unpaidTransactions.map(t => (
                      <option key={t.id} value={t.id}>
                        {format(new Date(t.date), 'MMM dd, yyyy')} - {t.type} (Balance: ₱{t.balance.toLocaleString()})
                      </option>
                    ))}
                  </Select>
                  {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                </div>

                {selectedTx && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Original Amount</div>
                      <div className="text-sm font-bold text-gray-900">₱{selectedTx.amount.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Already Paid</div>
                      <div className="text-sm font-bold text-gray-900">₱{(selectedTx.amount - selectedTx.balance).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Payment Details (Only show if an unpaid transaction is selected) */}
        {selectedTx && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Cash Amount Received (₱)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5000"
                  {...register("amount", {
                    valueAsNumber: true,
                    validate: (val) => val <= selectedTx.balance || 'Cannot exceed remaining balance'
                  })}
                  className={errors.amount ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>
            </div>

            {/* Display Remaining Balance Projection */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center gap-3">
              <Info size={16} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs text-gray-600 font-medium">Balance after payment:</span>
                <span className="text-sm font-bold text-gray-900">
                  ₱{Math.max(0, selectedTx.balance - (currentAmount || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment Date</label>
              <Input
                type="datetime-local"
                {...register("date")}
                className={errors.date ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment Details & Remarks (optional)</label>
              <textarea 
                rows={2}
                placeholder="Specify payment details..." 
                {...register("notes")}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none placeholder:text-gray-400 bg-white"
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
