import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { farmerSchema, FarmerFormValues } from "../../lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFarmer, updateFarmer } from "../../lib/api";

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer?: {
    id: string;
    name: string;
    phone: string;
    location: string;
    status: "Active" | "Inactive";
    area: number;
    commitment: "Cash Assistance" | "Farm Input" | "Both";
    notes?: string;
  } | null;
}

export default function AddFarmerModal({ isOpen, onClose, farmer = null }: AddFarmerModalProps) {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (payload: any) => farmer ? updateFarmer({ id: farmer.id, payload }) : createFarmer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast.success(farmer ? "Farmer updated successfully!" : "Farmer added successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add farmer.");
    }
  });
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      status: "Active",
      commitment: "Both"
    }
  });

  const commitment = watch("commitment");

  useEffect(() => {
    if (isOpen) {
      reset(farmer ? {
        name: farmer.name,
        phone: farmer.phone,
        location: farmer.location,
        status: farmer.status,
        area: farmer.area,
        commitment: farmer.commitment,
        notes: farmer.notes || "",
      } : undefined);
    }
  }, [isOpen, farmer, reset]);

  const onSubmit = (data: FarmerFormValues) => {
    const [first, ...rest] = data.name.trim().split(' ');
    
    createMutation.mutate({
      ...(farmer ? {} : {}),
      first_name: first || 'Unknown',
      last_name: rest.join(' '),
      phone: data.phone,
      address: data.location,
      area: data.area,
      commitment: data.commitment === 'Cash Assistance' ? 'CASH_ASSISTANCE' : data.commitment === 'Farm Input' ? 'FARM_INPUT' : 'BOTH',
      notes: data.notes,
      status: data.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={farmer ? "Edit Farmer" : "Add New Farmer"}
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
            {isSubmitting ? "Saving..." : farmer ? "Save Changes" : "Save Farmer"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <Input
            placeholder="Juan dela Cruz"
            {...register("name")}
            className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Contact Number
          </label>
          <Input
            placeholder="+63 901 200 5120"
            {...register("phone")}
            className={errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Full Address
          </label>
          <Input
            placeholder="House/Building No., Street, Barangay, City, Province"
            {...register("location")}
            className={errors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Total Area (Hectares)
          </label>
          <Input
            type="number"
            step="0.1"
            placeholder="e.g. 2.5"
            {...register("area")}
            className={errors.area ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          />
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Transaction Commitment
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Cash Assistance", "Farm Input", "Both"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("commitment", type as any)}
                className={`w-full rounded-xl px-2 py-3 text-[11px] sm:text-xs font-semibold transition-colors ${
                  commitment === type
                    ? "bg-[#193F2D] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Additional information about the farmer"
            {...register("notes")}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none bg-white"
          />
        </div>
      </form>
    </Modal>
  );
}
