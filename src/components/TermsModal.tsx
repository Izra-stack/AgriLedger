import { X } from 'lucide-react';
import { useState } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  const terms = [
    {
      num: '1',
      title: 'Information & Privacy',
      desc: 'AgriLedger stores farmer information, assistance, farm inputs, payments, balances, and transaction records for business monitoring and reporting. Access is limited to authorized users, and users are responsible for keeping information accurate and confidential.'
    },
    {
      num: '2',
      title: 'Responsible Use',
      desc: 'AgriLedger should only be used for legitimate business purposes. Users must not access, alter, or share records without authorization.'
    },
    {
      num: '3',
      title: 'System Limitations',
      desc: 'AgriLedger is a financial and transaction-tracking system and does not directly process online payments, bank transfers, or external loans.'
    },
    {
      num: '4',
      title: 'Acceptance',
      desc: 'By using AgriLedger, users agree to these terms and acknowledge their responsibilities regarding the information stored in the system.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Privacy Policy</h2>
          <p className="text-sm text-gray-600 leading-relaxed pr-6">
            AgriLedger respects the privacy of its farmers and the information recorded in the system. 
            By using AgriLedger, farmers agree to use the system responsibly and protect the 
            confidentiality of farmer and business records.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-2 overflow-y-auto flex-grow space-y-4 custom-scrollbar">
          {terms.map((term) => (
            <div key={term.num} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#EAF7EF] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0F3D21] text-xs font-bold">{term.num}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{term.title}</h3>
              </div>
              <p className="text-gray-500 text-[13px] leading-relaxed pl-9">
                {term.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer / Actions */}
        <div className="p-6 pt-4 flex-shrink-0 border-t border-transparent bg-white">
          <label className="flex items-center gap-3 mb-5 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4 border-2 border-gray-300 rounded-sm appearance-none checked:bg-[#0F3D21] checked:border-[#0F3D21] transition-colors cursor-pointer"
              />
              {isChecked && (
                <svg className="absolute w-3 h-3 text-white left-[2px] top-[2px] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
              By clicking you are accepting the updated AgriLedger Terms & Policy.
            </span>
          </label>
          
          <button 
            onClick={() => {
              if (isChecked) {
                onAccept();
              }
            }}
            disabled={!isChecked}
            className={`w-full py-3.5 rounded-lg font-bold text-white transition-colors ${
              isChecked 
                ? 'bg-[#154226] hover:bg-[#0c2a17]' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Accept
          </button>
        </div>
        
      </div>
    </div>
  );
}
