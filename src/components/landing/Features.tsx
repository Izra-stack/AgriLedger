export default function Features() {
  const features = [
    {
      num: '01',
      title: 'Farmer Records',
      desc: 'Centralized record system for all registered farmers, farm locations, hectarage, and status.',
      img: '/farmer.png',
      alt: 'Farmer Records'
    },
    {
      num: '02',
      title: 'Assistance & Inputs',
      desc: 'Record cash assistance and release farm inputs such as seeds, fertilizers, and chemicals seamlessly.',
      img: '/input.png',
      alt: 'Assistance & Inputs'
    },
    {
      num: '03',
      title: 'Payments & Balances',
      desc: 'Track cash collections, partial payments, and calculate current outstanding balances automatically.',
      img: '/payment.png',
      alt: 'Payments & Balances'
    },
    {
      num: '04',
      title: 'Reports',
      desc: 'Generate comprehensive financial summaries, profit calculations, and transaction activity overview.',
      img: '/report.png',
      alt: 'Reports'
    }
  ];

  return (
    <section id="features" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="bg-[#EAF7EF] px-4 py-1.5 rounded-full mb-6">
          <span className="text-[#0F3D21] text-xs font-bold tracking-widest uppercase">System Features</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center tracking-tight mb-4 max-w-3xl leading-tight">
          Everything You Need to Manage Your Farm Business
        </h2>
        
        <p className="text-gray-500 text-lg text-center mb-16 max-w-2xl">
          Simple tools for financial assistance, inputs, payments, balances, and records.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((feat) => (
            <div
              key={feat.num}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all overflow-hidden flex flex-col h-full group"
            >
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                  src={feat.img}
                  alt={feat.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0F3D21] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {feat.num}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
