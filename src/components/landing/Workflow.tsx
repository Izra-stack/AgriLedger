import { UserPlus, FileSpreadsheet, ArrowRightLeft, LineChart } from 'lucide-react';

export default function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Add Farmers',
      desc: 'Encode farmer information, parcel details, and emergency contact records.',
      icon: UserPlus
    },
    {
      num: '02',
      title: 'Record Transaction',
      desc: 'Log palay cash disbursements and farm inputs provided to the grower.',
      icon: FileSpreadsheet
    },
    {
      num: '03',
      title: 'Track Payments',
      desc: 'Record palay harvest credits and automatically update outstanding balances.',
      icon: ArrowRightLeft
    },
    {
      num: '04',
      title: 'Generate Reports',
      desc: 'View season summaries, profit margins, and monitor farm performance anytime.',
      icon: LineChart
    }
  ];

  return (
    <section id="workflow" className="bg-brand-dark py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-white/10 px-4 py-1.5 rounded-full mb-6">
          <span className="text-white text-xs font-bold tracking-widest uppercase">Easy 4-Step Workflow</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight mb-4 max-w-2xl leading-tight">
          Streamlined Ledger Management
        </h2>
        
        <p className="text-white/70 text-lg text-center mb-16 max-w-2xl">
          From farmer registration to complete settlement, reports in four simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-[#124b28] rounded-2xl p-8 border border-white/10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-3xl font-extrabold text-white">{step.num}</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Icon size={20} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-white/70 text-sm leading-relaxed flex-grow">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
