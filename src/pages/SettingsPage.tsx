import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../lib/api';
import { settingsSchema, SettingsFormValues } from '../lib/schemas';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useEffect } from 'react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success("Settings saved successfully!");
    },
    onError: () => toast.error("Failed to save settings.")
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings
  });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl min-h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Settings</h2>
        <p className="text-sm text-gray-500">Configure your cooperative profile and system preferences.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Cooperative Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] font-bold">1</div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Cooperative Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:pl-11">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
                <Input 
                  {...register("businessName")} 
                  className={errors.businessName ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registration Number</label>
                <Input 
                  {...register("registrationNumber")}
                  className={errors.registrationNumber ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Address</label>
                <Input 
                  {...register("address")}
                  className={errors.address ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] font-bold">2</div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:pl-11">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Email</label>
                <Input 
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <Input 
                  {...register("phone")}
                  className={errors.phone ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end md:pl-11">
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="min-w-[140px]"
            >
              <Save size={16} className="mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
