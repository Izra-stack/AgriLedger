import { Users, Leaf, CreditCard, BarChart3, Check } from 'lucide-react';

export default function Features() {
  const features = [
    {
      num: '01',
      title: 'Farmer Records',
      desc: 'Manage farmer information and records.',
      check: 'Centralized Farmer Records',
      icon: Users
    },
    {
      num: '02',
      title: 'Assistance & Inputs',
      desc: 'Record cash assistance and farm inputs.',
      check: 'Cash Assistance Records',
      icon: Leaf
    },
    {
      num: '03',
      title: 'Payments & Balances',
      desc: 'Track payments and remaining balances.',
      check: 'Input & Credit Tracking',
      icon: CreditCard
    },
    {
      num: '04',
      title: 'Reports',
      desc: 'Generate summaries of transactions and finances.',
      check: 'Payment Records',
      icon: BarChart3
    }
  ];

  return (
    <section id="features" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-brand-light px-4 py-1.5 rounded-full mb-6">
          <span className="text-brand-dark text-xs font-bold tracking-widest uppercase">System Features</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-brand-text text-center tracking-tight mb-4 max-w-2xl leading-tight">
          Everything You Need to Manage Your Farm Business
        </h2>
        
        <p className="text-gray-500 text-lg text-center mb-16">
          Simple tools for financial assistance, inputs, payments, balances, and records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.num} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-3xl font-extrabold text-brand-dark">{feat.num}</span>
                  <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-dark">
                    <Icon size={20} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-brand-text mb-3">
                  {feat.title}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-8">
                  {feat.desc}
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex items-center gap-2">
                  <Check size={16} className="text-brand-dark flex-shrink-0" strokeWidth={3} />
                  <span className="text-sm font-semibold text-brand-text">
                    {feat.check}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
