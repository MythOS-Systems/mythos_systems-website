import { Tilt } from "./ui/tilt";

export function StatsSection() {
  const stats = [
    {
      number: '1 in 6',
      description: 'people worldwide experience loneliness',
      source: 'WHO, 2023',
      gradient: 'from-[#000000] to-[#1A1A1A]',
    },
    {
      number: '44%',
      description: 'of Texas workers are employed by small businesses, which make up 99.8% of all Texas companies - yet they\'re outspent by billion-dollar chains',
      source: 'SBA Texas Small Business Profile, 2025',
      gradient: 'from-[#1A1A1A] to-[#000000]',
    },
    {
      number: '66%',
      description: 'of small businesses spend under $1,000/year on marketing while competing against billion-dollar ad budgets',
      source: 'SBA & Industry Research, 2024',
      gradient: 'from-[#000000] to-[#1A1A1A]',
    },
  ];

  return (
    <section className="py-24 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mythos-headline-large text-white text-center mb-16">
          The Crisis Is Real
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Tilt
              key={index}
              rotationFactor={8}
              isRevese
              style={{
                transformOrigin: 'center center',
              }}
            >
              <div
                className={`relative bg-gradient-to-br ${stat.gradient} rounded-lg p-8 md:p-10 border border-white/10 overflow-hidden min-h-[400px] flex flex-col justify-between`}
              >
                {/* Background pattern - diagonal gradient for all */}
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id={`diag-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
                        <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#diag-${index})`} />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Large number */}
                  <div className="mythos-stat-number text-white mb-6">
                    {stat.number}
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-[#F5F5F0] leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Source */}
                <div className="relative z-10">
                  <p className="text-xs text-[#707070] mythos-mono">
                    {stat.source}
                  </p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}