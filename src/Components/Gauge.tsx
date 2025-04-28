"use client";

import { useEffect, useRef } from "react";

type GaugeProps = {
  coveragePercentage: string;
};

const Gauge = ({ coveragePercentage }: GaugeProps) => {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const percentNumber = parseFloat(coveragePercentage);

  useEffect(() => {
    if (!gaugeRef.current) return;

    // Calculate angle for gauge rotation (180 degree gauge)
    // 0% = -90deg, 100% = 90deg
    const angle = (percentNumber / 100) * 180 - 90;
    gaugeRef.current.style.transform = `rotate(${angle}deg)`;
  }, [percentNumber]);

  const getTextColor = () => {
    if (percentNumber < 40) return "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400";
    if (percentNumber < 75) return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400 dark:from-yellow-400 dark:to-orange-300";
    return "text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 dark:from-green-400 dark:to-emerald-300";
  };

  const getNeedleColor = () => {
    if (percentNumber < 40) return "bg-gradient-to-t from-red-600 to-red-400 dark:from-red-500 dark:to-red-300";
    if (percentNumber < 75) return "bg-gradient-to-t from-yellow-600 to-yellow-400 dark:from-yellow-500 dark:to-yellow-300";
    return "bg-gradient-to-t from-green-600 to-green-400 dark:from-green-500 dark:to-green-300";
  };

  return (
    <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 mx-auto">
      {/* Outer decorative ring with gradient */}
      <div className="absolute inset-0 rounded-full border-8 sm:border-10 md:border-12 border-gray-100 dark:border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
      
      {/* Gauge track with subtle pattern */}
      <div className="absolute inset-2 sm:inset-3 rounded-full border-8 sm:border-10 border-gray-200 dark:border-gray-700 overflow-hidden bg-opacity-50 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        {/* Colored progress background based on percentage */}
        <div 
          className="absolute bottom-0 left-0 w-full origin-bottom-center transform -translate-y-1/2 -translate-x-1/2 left-1/2"
          style={{ 
            height: '200%', 
            width: '200%', 
            borderRadius: '100%',
            background: `conic-gradient(
              transparent ${180 - (percentNumber * 1.8)}deg, 
              rgba(0,0,0,0) ${180 - (percentNumber * 1.8)}deg
            )`
          }}
        ></div>
      </div>
      
      {/* Gauge indicator container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gauge needle with gradient */}
        <div 
          ref={gaugeRef}
          className={`absolute origin-bottom w-1.5 sm:w-2 md:w-2.5 h-1/2 left-1/2 -ml-0.75 sm:-ml-1 md:-ml-1.25 -translate-x-0 rounded-t-full shadow-lg ${getNeedleColor()} transition-transform duration-1000 ease-elastic`}
          style={{ transform: "rotate(-90deg)" }}
        ></div>
      </div>
      
      {/* Center circle with inner glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white dark:bg-gray-800 shadow-[inset_0_0_6px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_0_6px_rgba(255,255,255,0.1)] border-2 border-gray-200 dark:border-gray-700"></div>
      </div>
      
      {/* Percentage text with gradient */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 sm:pt-20 md:pt-24 animate-fadeIn">
        <div className="text-center">
          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getTextColor()}`}>
            {coveragePercentage}%
          </span>
        </div>
      </div>

      {/* Gauge labels with improved styling */}
      <div className="absolute -bottom-8 inset-x-0 flex justify-between text-xs sm:text-sm font-medium">
        <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">0%</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">50%</span>
        <span className="mr-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">100%</span>
      </div>
    </div>
  );
};

export default Gauge;