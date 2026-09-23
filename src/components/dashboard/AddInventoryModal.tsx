import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { inventorySchema, InventoryFormValues } from "../../lib/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItem } from "../../lib/api";

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddInventoryModal({ isOpen, onClose }: AddInventoryModalProps) {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Inventory item added successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to add item.");
    }
  });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      category: "Fertilizer"
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: InventoryFormValues) => {
    createMutation.mutate({
      name: data.name,
      category: data.category,
      unit: "unit",
      quantity: data.stock,
      unit_cost: data.price,
      reorder_level: data.reorderLevel,
      description: data.location, // Mapping location to description
      status: "IN_STOCK"
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Item"
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
            {isSubmitting ? "Saving..." : "Save Item"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Item Name
          </label>
          <Input
            placeholder="e.g. Urea (46-0-0) Pellets"
            {...register("name")}
            className={errors.name ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Category
          </label>
          <Select
            {...register("category")}
            className={errors.category ? "border-red-500 focus:border-red-500" : ""}
          >
            <option value="Fertilizer">Fertilizer</option>
            <option value="Seeds">Seeds</option>
            <option value="Chemicals">Chemicals</option>
            <option value="Equipment">Equipment</option>
          </Select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Initial Stock
            </label>
            <Input
              type="number"
              placeholder="0"
              {...register("stock")}
              className={errors.stock ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Reorder Level
            </label>
            <Input
              type="number"
              placeholder="20"
              {...register("reorderLevel")}
              className={errors.reorderLevel ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.reorderLevel && <p className="text-red-500 text-xs mt-1">{errors.reorderLevel.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Unit Price (₱)
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("price")}
            className={errors.price ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Storage Location
          </label>
          <Input
            placeholder="e.g. Warehouse A, Aisle 2"
            {...register("location")}
            className={errors.location ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
      </form>
    </Modal>
  );
}
