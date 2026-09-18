import { X } from "lucide-react";
import { useState } from "react";

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFarmerModal({
  isOpen,
  onClose,
}: AddFarmerModalProps) {
  const [transactionCommitment, setTransactionCommitment] = useState("Both");

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
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Farmer</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto">
          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Juan dela Cruz"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Contact Number
              </label>

              <input
                type="text"
                placeholder="+63 901 200 5120"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Full Address
              </label>

              <input
                type="text"
                placeholder="House/Building No., Street, Barangay, City/Municipality, Province"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>

            {/* Total Area */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Total Area (Hectares)
              </label>

              <input
                type="number"
                step="0.1"
                placeholder="e.g. 2.5"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
              />
            </div>

            {/* Transaction Commitment */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Transaction Commitment
              </label>

              <div className="grid grid-cols-3 gap-4">
                {/* Cash Assistance */}
                <button
                  type="button"
                  onClick={() => setTransactionCommitment("Cash Assistance")}
                  className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    transactionCommitment === "Cash Assistance"
                      ? "bg-[#193F2D] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Cash Assistance
                </button>

                {/* Farm Input */}
                <button
                  type="button"
                  onClick={() => setTransactionCommitment("Farm Input")}
                  className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    transactionCommitment === "Farm Input"
                      ? "bg-[#193F2D] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Farm Input
                </button>

                {/* Both */}
                <button
                  type="button"
                  onClick={() => setTransactionCommitment("Both")}
                  className={`w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    transactionCommitment === "Both"
                      ? "bg-[#193F2D] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Notes
              </label>

              <textarea
                rows={3}
                placeholder="Additional information about the farmer"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#154226] hover:bg-opacity-90 rounded-lg transition-colors"
          >
            Save Farmer
          </button>
        </div>
      </div>
    </div>
  );
}
