export default function Workflow() {
  const steps = [
    {
      num: '01',
      title: 'Add Farmers',
      desc: 'Register and manage farmer information.'
    },
    {
      num: '02',
      title: 'Record Transactions',
      desc: 'Track cash assistance, inputs, and farm-related transactions.'
    },
    {
      num: '03',
      title: 'Track Payments',
      desc: 'Monitor payments, balances, and outstanding amounts.'
    },
    {
      num: '04',
      title: 'Generate Reports',
      desc: 'Review financial summaries and farm-business activity.'
    }
  ];

  return (
    <section
      id="workflow"
      className="relative bg-cover bg-center bg-no-repeat py-32 sm:py-36 md:py-40 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/workflow.png')" }}
    >
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-[#0F3D21]/85 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
          <span className="text-[#a0d2b4] text-xs font-bold tracking-widest uppercase">
            Easy 4-Step Workflow
          </span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight mb-4 max-w-3xl leading-tight">
          Streamlined Ledger Management
        </h2>
        
        <p className="text-white/80 text-lg text-center mb-16 max-w-2xl">
          From farmer registration to complete settlement, reports in four simple steps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/15 hover:border-white/30 transition-all flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-3xl font-black text-[#a0d2b4]">{step.num}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-white/80 text-sm leading-relaxed flex-grow">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
