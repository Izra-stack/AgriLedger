import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Transaction</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Farmer Name or ID</label>
              <input 
                type="text" 
                placeholder="Type farmer name..." 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction Type</label>
              <input 
                type="text" 
                placeholder="e.g. Fertilizer, Cash Advance..." 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount (₱)</label>
              <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reference Number</label>
              <input type="text" placeholder="e.g. TRX-1033" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes / Description</label>
              <textarea rows={2} placeholder="Optional details..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-white bg-[#154226] hover:bg-opacity-90 rounded-lg transition-colors">
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
