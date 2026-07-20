import { useEffect, useState } from 'react';

export function FinalCTA() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const launchDate = new Date('2026-10-01T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      {/* Animated flowing gradient background with smooth transforms */}
      <div className="absolute inset-0">
        {/* Multiple gradient orbs - optimized sizes and blur for mobile */}
        <div className="absolute w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full blur-[40px] md:blur-[120px] bg-gradient-radial-1 gradient-orb-1"></div>
        <div className="absolute w-[450px] md:w-[700px] h-[450px] md:h-[700px] rounded-full blur-[35px] md:blur-[100px] bg-gradient-radial-2 gradient-orb-2"></div>
        <div className="absolute w-[400px] md:w-[900px] h-[400px] md:h-[900px] rounded-full blur-[30px] md:blur-[140px] bg-gradient-radial-3 gradient-orb-3"></div>
        <div className="hidden md:block absolute w-[750px] h-[750px] rounded-full blur-[110px] bg-gradient-radial-4 gradient-orb-4"></div>
        <div className="hidden md:block absolute w-[850px] h-[850px] rounded-full blur-[130px] bg-gradient-radial-5 gradient-orb-5"></div>
        <div className="hidden md:block absolute w-[650px] h-[650px] rounded-full blur-[90px] bg-gradient-radial-6 gradient-orb-6"></div>
        
        <style>{`
          /* Radial gradient backgrounds */
          .bg-gradient-radial-1 {
            background: radial-gradient(circle, rgba(0, 71, 255, 0.6) 0%, rgba(0, 71, 255, 0.3) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          .bg-gradient-radial-2 {
            background: radial-gradient(circle, rgba(0, 150, 255, 0.5) 0%, rgba(0, 100, 200, 0.3) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          .bg-gradient-radial-3 {
            background: radial-gradient(circle, rgba(0, 191, 255, 0.5) 0%, rgba(0, 120, 220, 0.25) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          .bg-gradient-radial-4 {
            background: radial-gradient(circle, rgba(30, 100, 255, 0.45) 0%, rgba(0, 60, 150, 0.3) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          .bg-gradient-radial-5 {
            background: radial-gradient(circle, rgba(0, 180, 255, 0.5) 0%, rgba(0, 50, 120, 0.4) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          .bg-gradient-radial-6 {
            background: radial-gradient(circle, rgba(50, 130, 255, 0.4) 0%, rgba(0, 90, 200, 0.35) 40%, transparent 70%);
            mix-blend-mode: screen;
          }
          
          /* Simplified animations for mobile, full animations for desktop */
          @keyframes floatOrb1 {
            0%, 100% {
              transform: translate3d(-20%, -10%, 0);
            }
            50% {
              transform: translate3d(30%, -5%, 0);
            }
          }
          
          @keyframes floatOrb1Mobile {
            0%, 100% {
              transform: translate3d(0%, 0%, 0);
            }
            50% {
              transform: translate3d(15%, 10%, 0);
            }
          }
          
          @keyframes floatOrb2 {
            0%, 100% {
              transform: translate3d(60%, 30%, 0);
            }
            50% {
              transform: translate3d(20%, 60%, 0);
            }
          }
          
          @keyframes floatOrb2Mobile {
            0%, 100% {
              transform: translate3d(40%, 20%, 0);
            }
            50% {
              transform: translate3d(50%, 40%, 0);
            }
          }
          
          @keyframes floatOrb3 {
            0%, 100% {
              transform: translate3d(40%, 40%, 0);
            }
            50% {
              transform: translate3d(70%, 65%, 0);
            }
          }
          
          @keyframes floatOrb3Mobile {
            0%, 100% {
              transform: translate3d(20%, 30%, 0);
            }
            50% {
              transform: translate3d(60%, 50%, 0);
            }
          }
          
          @keyframes floatOrb4 {
            0%, 100% {
              transform: translate3d(25%, 70%, 0);
            }
            50% {
              transform: translate3d(55%, 30%, 0);
            }
          }
          
          @keyframes floatOrb5 {
            0%, 100% {
              transform: translate3d(75%, 75%, 0);
            }
            50% {
              transform: translate3d(50%, 50%, 0);
            }
          }
          
          @keyframes floatOrb6 {
            0%, 100% {
              transform: translate3d(15%, 55%, 0);
            }
            50% {
              transform: translate3d(45%, 25%, 0);
            }
          }
          
          /* Mobile-optimized animations */
          .gradient-orb-1 {
            animation: floatOrb1Mobile 25s ease-in-out infinite;
            transform: translate3d(0, 0, 0);
          }
          
          .gradient-orb-2 {
            animation: floatOrb2Mobile 30s ease-in-out infinite;
            animation-delay: -8s;
            transform: translate3d(0, 0, 0);
          }
          
          .gradient-orb-3 {
            animation: floatOrb3Mobile 22s ease-in-out infinite;
            animation-delay: -12s;
            transform: translate3d(0, 0, 0);
          }
          
          .gradient-orb-4 {
            animation: floatOrb4 32s ease-in-out infinite;
            animation-delay: -12s;
            transform: translate3d(0, 0, 0);
          }
          
          .gradient-orb-5 {
            animation: floatOrb5 38s ease-in-out infinite;
            animation-delay: -20s;
            transform: translate3d(0, 0, 0);
          }
          
          .gradient-orb-6 {
            animation: floatOrb6 26s ease-in-out infinite;
            animation-delay: -5s;
            transform: translate3d(0, 0, 0);
          }
          
          /* Desktop gets fuller animations */
          @media (min-width: 768px) {
            .gradient-orb-1 {
              animation: floatOrb1 30s ease-in-out infinite;
            }
            
            .gradient-orb-2 {
              animation: floatOrb2 35s ease-in-out infinite;
              animation-delay: -8s;
            }
            
            .gradient-orb-3 {
              animation: floatOrb3 28s ease-in-out infinite;
              animation-delay: -15s;
            }
          }
          
          /* Respect reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            .gradient-orb-1,
            .gradient-orb-2,
            .gradient-orb-3,
            .gradient-orb-4,
            .gradient-orb-5,
            .gradient-orb-6 {
              animation: none !important;
            }
          }
        `}</style>
      </div>
      
      {/* Flowing energy lines background - simplified on mobile */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            {/* Simplified glow filter for better performance */}
            <filter id="energyGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Gradient definitions for color transitions */}
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#0033CC', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#0066FF', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#0033CC', stopOpacity: 0 }} />
            </linearGradient>
            
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FF4500', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF4500', stopOpacity: 0.7 }} />
              <stop offset="100%" style={{ stopColor: '#FF4500', stopOpacity: 0 }} />
            </linearGradient>
            
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#9D4EDD', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#C77DFF', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#9D4EDD', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {/* Reduced to 4 flowing lines for better performance */}
          <g className="animate-energy-flow-1">
            <path 
              d="M 0 25 Q 200 45 400 35 T 800 40 T 1200 30 T 1600 35 T 2000 40 T 2400 35" 
              stroke="url(#blueGradient)" 
              strokeWidth="3" 
              fill="none" 
              filter="url(#energyGlow)"
            />
            <path 
              d="M 2400 25 Q 2600 45 2800 35 T 3200 40 T 3600 30 T 4000 35 T 4400 40 T 4800 35" 
              stroke="url(#blueGradient)" 
              strokeWidth="3" 
              fill="none" 
              filter="url(#energyGlow)"
            />
          </g>
          
          <g className="animate-energy-flow-2">
            <path 
              d="M 0 55 Q 200 35 400 50 T 800 45 T 1200 55 T 1600 50 T 2000 45 T 2400 55" 
              stroke="url(#blueGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
            <path 
              d="M 2400 55 Q 2600 35 2800 50 T 3200 45 T 3600 55 T 4000 50 T 4400 45 T 4800 55" 
              stroke="url(#blueGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
          </g>
          
          <g className="animate-energy-flow-3">
            <path 
              d="M 0 75 Q 200 90 400 80 T 800 85 T 1200 75 T 1600 85 T 2000 80 T 2400 85" 
              stroke="url(#orangeGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
            <path 
              d="M 2400 75 Q 2600 90 2800 80 T 3200 85 T 3600 75 T 4000 85 T 4400 80 T 4800 85" 
              stroke="url(#orangeGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
          </g>
          
          <g className="animate-energy-flow-4">
            <path 
              d="M 0 50 Q 200 65 400 55 T 800 60 T 1200 50 T 1600 60 T 2000 55 T 2400 60" 
              stroke="url(#purpleGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
            <path 
              d="M 2400 50 Q 2600 65 2800 55 T 3200 60 T 3600 50 T 4000 60 T 4400 55 T 4800 60" 
              stroke="url(#purpleGradient)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#energyGlow)"
            />
          </g>
        </svg>
        
        {/* Add CSS animations */}
        <style>{`
          @keyframes energyFlow {
            0% { 
              transform: translate3d(0, 0, 0);
            }
            100% { 
              transform: translate3d(-2400px, 0, 0);
            }
          }
          
          .animate-energy-flow-1 {
            animation: energyFlow 20s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
          }
          .animate-energy-flow-2 {
            animation: energyFlow 25s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
          }
          .animate-energy-flow-3 {
            animation: energyFlow 18s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
          }
          .animate-energy-flow-4 {
            animation: energyFlow 22s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
          }
        `}</style>
        
        {/* Dark overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a2e]/40 to-[#000000]/60"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="mythos-headline-large text-white mb-8">
          Join the Rebellion
        </h2>
        
        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto mb-12">
          {[
            { label: 'Days', value: timeRemaining.days },
            { label: 'Hours', value: timeRemaining.hours },
            { label: 'Minutes', value: timeRemaining.minutes },
            { label: 'Seconds', value: timeRemaining.seconds },
          ].map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 border border-white/20 flex flex-col items-center justify-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mythos-mono text-center">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm lg:text-base text-white/80 mt-1 md:mt-2 text-center">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-white leading-relaxed mb-8">
            Help us rebuild what Big Tech destroyed.<br />
            Local discovery was replaced by pay-to-play algorithms.<br />
            Communities were diluted by global feeds.<br />
            MythOS is rebuilding technology for real cities, real people, and real ownership.
          </p>
          
          <p className="text-sm md:text-base text-white/70">
            The countdown is to <span className="text-white font-semibold">The Network</span> - our local discovery app - and <span className="text-white font-semibold">MythOS Pro</span>, both launching October 1, 2026.
          </p>
        </div>
      </div>
    </section>
  );
}