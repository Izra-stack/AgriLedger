import { X, ChevronDown, Calendar, QrCode, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecordPaymentModal({ isOpen, onClose }: RecordPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Record Payment</h2>
            <p className="text-xs text-gray-400">Post an instant farmer repayment to update outstanding credit.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Farmer */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Farmer</label>
              <div className="relative">
                <input 
                  type="text"
                  list="farmer-recent-list"
                  defaultValue="Rodrigo Dela Cruz"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-white"
                />
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <datalist id="farmer-recent-list">
                  <option value="Rodrigo Dela Cruz" />
                  <option value="Jose Mendoza" />
                  <option value="Vicente O. Magsaysay" />
                </datalist>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-bold transition-colors ${
                    paymentMethod === 'cash' 
                      ? 'bg-[#EAF7EF] border-[#154226] text-[#154226]' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gcash')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-bold transition-colors ${
                    paymentMethod === 'gcash' 
                      ? 'bg-white border-[#154226] text-gray-900' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#007DFE] text-white flex items-center justify-center text-[10px] font-bold">G</div>
                  GCash (QR Pay)
                </button>
              </div>
            </div>

            {/* Dynamic Middle Section based on Payment Method */}
            {paymentMethod === 'cash' ? (
              /* Amount Paid (Cash Mode) */
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-gray-700">Amount Paid (₱)</label>
                  <span className="text-[10px] font-medium text-gray-400">Total balance: ₱34,900.00</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">₱</span>
                  <input 
                    type="text" 
                    placeholder="e.g. 5000" 
                    className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-white"
                  />
                </div>
              </div>
            ) : (
              /* GCash QR Block */
              <div className="border border-blue-200 border-dashed rounded-xl bg-[#F8FAFC] p-5">
                <div className="flex items-start mb-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#007DFE] text-white flex items-center justify-center text-sm font-bold mt-1">G</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">Scan to Pay with GCash</span>
                        <span className="bg-blue-100 text-[#007DFE] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Instant Credit</span>
                      </div>
                      <div className="text-[10px] text-[#007DFE] font-medium">Merchant: AGRILedger - Davao Hub + Ref: #AG-88219</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                    <div className="w-28 h-28 border border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden">
                       <QrCode size={80} className="text-gray-800" strokeWidth={1.5} />
                       {/* Center G logo mock */}
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-6 h-6 bg-white flex items-center justify-center rounded">
                           <div className="w-5 h-5 bg-[#007DFE] text-white flex items-center justify-center text-[10px] font-bold rounded-sm">G</div>
                         </div>
                       </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <Smartphone size={16} className="text-[#007DFE]" /> Scan via GCash App
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                      Have the farmer scan this QR code using their GCash app to complete payment. Funds settle immediately to AGRILedger Trust.
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-1 rounded">REF: REC-2024-8842</span>
                      <span className="bg-[#EAF7EF] text-[#154226] text-[9px] font-bold px-2 py-1 rounded">Auto-verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment For */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment For</label>
              <input 
                type="text" 
                placeholder="e.g. Fertilizer Loan, Cash Assistance..." 
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-white"
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="10/24/2024" 
                  className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark bg-white"
                />
                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Payment Details & Remarks <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea 
                rows={3}
                placeholder="Specify what exactly is being paid for (e.g. Urea fertilizer 6 bags, Land prep cash advance repayment)..." 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none placeholder:text-gray-400"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 flex justify-end gap-3 bg-white">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-white bg-[#154226] hover:bg-opacity-90 rounded-lg transition-colors">
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}
