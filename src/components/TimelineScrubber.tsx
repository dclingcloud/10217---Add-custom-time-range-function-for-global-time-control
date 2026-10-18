import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TimeRange } from '../types/dashboard';

interface TimelineScrubberProps {
  currentRange: TimeRange;
  onRangeChange: (newRange: TimeRange) => void;
}

const HOURS = [
  '00:01', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  '00:00'
];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentRange,
  onRangeChange,
}) => {
  // 15:25 to 16:25 represents approximately ~64.2% to ~68.4% of a 24-hour day
  // (15.416 / 24) * 100 = 64.2%, (16.416 / 24) * 100 = 68.4%
  const startHourFloat = 15 + 25 / 60;
  const endHourFloat = 16 + 25 / 60;
  const leftPercent = (startHourFloat / 24) * 100;
  const widthPercent = ((endHourFloat - startHourFloat) / 24) * 100;

  const handleShiftHours = (deltaHours: number) => {
    // shift start & end
    const [sH, sM] = currentRange.startTime.split(':').map(Number);
    const [eH, eM] = currentRange.endTime.split(':').map(Number);

    const newSH = Math.min(23, Math.max(0, sH + deltaHours));
    const newEH = Math.min(23, Math.max(0, eH + deltaHours));

    onRangeChange({
      ...currentRange,
      startTime: `${String(newSH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`,
      endTime: `${String(newEH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`,
    });
  };

  return (
    <div className="bg-[#f8fafc] border-b border-[#e5e7eb] px-3 py-2 flex items-center space-x-2 select-none text-[11px] text-gray-500">
      {/* Left controls */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          type="button"
          onClick={() => handleShiftHours(-24)}
          className="w-5 h-5 rounded-full bg-gray-400 hover:bg-[#0091ff] text-white flex items-center justify-center cursor-pointer transition-colors"
          title="前一天"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => handleShiftHours(-1)}
          className="w-5 h-5 rounded-full bg-[#0091ff] hover:bg-[#007fe0] text-white flex items-center justify-center cursor-pointer transition-colors"
          title="前一小时"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <span className="font-mono text-gray-700 font-medium px-1 whitespace-nowrap">
          {currentRange.startDate}
        </span>
      </div>

      {/* Middle Track */}
      <div className="flex-1 relative flex flex-col justify-center">
        {/* Scrubber track container */}
        <div className="h-6 w-full bg-[#e8f1fa] border border-[#d2e2f3] relative rounded-[1px] overflow-hidden">
          {/* Subtle 24h background tick lines */}
          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-30">
            {HOURS.map((_, i) => (
              <div key={i} className="h-full w-[1px] bg-blue-300" />
            ))}
          </div>

          {/* Active selection window with handles and mini wave */}
          <div
            className="absolute top-0 bottom-0 bg-[#b9dcff]/70 border-x-2 border-[#0091ff] cursor-grab flex items-center justify-center shadow-xs"
            style={{
              left: `${Math.max(2, Math.min(90, leftPercent))}%`,
              width: `${Math.max(4, widthPercent + 1)}%`,
            }}
          >
            {/* Embedded sparkline curve */}
            <svg
              className="w-full h-full opacity-70"
              viewBox="0 0 100 24"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 18 Q 20 6, 40 14 T 80 8 L 100 22"
                fill="none"
                stroke="#0080ff"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Hour marks */}
        <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1 px-0.5">
          {HOURS.map((h, i) => (
            <span key={i} className="transform -translate-x-1/2">
              {h}
            </span>
          ))}
          <span className="font-medium text-gray-600 pl-1">{currentRange.endDate}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-1 shrink-0">
        <button
          type="button"
          onClick={() => handleShiftHours(1)}
          className="w-5 h-5 rounded-full bg-[#0091ff] hover:bg-[#007fe0] text-white flex items-center justify-center cursor-pointer transition-colors"
          title="后一小时"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={() => handleShiftHours(24)}
          className="w-5 h-5 rounded-full bg-gray-400 hover:bg-[#0091ff] text-white flex items-center justify-center cursor-pointer transition-colors"
          title="后一天"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
