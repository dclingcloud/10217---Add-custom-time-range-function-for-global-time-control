import React, { useState } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface DualMonthCalendarProps {
  selectedStartDate: string; // YYYY-MM-DD
  selectedEndDate: string;   // YYYY-MM-DD
  targetField: 'start' | 'end';
  onSelectDate: (date: string) => void;
  onApply: () => void;
  onClose: () => void;
}

export const DualMonthCalendar: React.FC<DualMonthCalendarProps> = ({
  selectedStartDate,
  selectedEndDate,
  targetField,
  onSelectDate,
  onApply,
  onClose,
}) => {
  // Parse base year and month from selectedStartDate or 2026-10
  const initialDate = targetField === 'start' ? selectedStartDate : selectedEndDate;
  const [baseYear, setBaseYear] = useState(() => {
    const parts = initialDate.split('-');
    return parts.length === 3 ? parseInt(parts[0], 10) : 2026;
  });
  const [baseMonth, setBaseMonth] = useState(() => {
    const parts = initialDate.split('-');
    return parts.length === 3 ? parseInt(parts[1], 10) : 10;
  });

  const nextMonthYear = baseMonth === 12 ? baseYear + 1 : baseYear;
  const nextMonth = baseMonth === 12 ? 1 : baseMonth + 1;

  const handlePrevYear = () => setBaseYear((y) => y - 1);
  const handleNextYear = () => setBaseYear((y) => y + 1);

  const handlePrevMonth = () => {
    if (baseMonth === 1) {
      setBaseMonth(12);
      setBaseYear((y) => y - 1);
    } else {
      setBaseMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (baseMonth === 12) {
      setBaseMonth(1);
      setBaseYear((y) => y + 1);
    } else {
      setBaseMonth((m) => m + 1);
    }
  };

  // Helper to generate days for a given year and month (1-indexed)
  const getMonthDays = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const days = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthNum = month === 1 ? 12 : month - 1;
      const prevYearNum = month === 1 ? year - 1 : year;
      const dateStr = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        day: dayNum,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Next month days to fill 42 cells (6 rows) or minimum 35 cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthNum = month === 12 ? 1 : month + 1;
      const nextYearNum = month === 12 ? year + 1 : year;
      const dateStr = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const leftMonthDays = getMonthDays(baseYear, baseMonth);
  const rightMonthDays = getMonthDays(nextMonthYear, nextMonth);

  const isDaySelected = (dateStr: string) => {
    return dateStr === (targetField === 'start' ? selectedStartDate : selectedEndDate);
  };

  const isInRange = (dateStr: string) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return dateStr > selectedStartDate && dateStr < selectedEndDate;
  };

  const weekHeaders = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="absolute top-12 left-0 z-50 bg-white border border-[#e5e7eb] shadow-2xl rounded-sm p-4 w-[580px] text-xs text-gray-700 select-none">
      <div className="grid grid-cols-2 gap-6 divide-x divide-gray-100">
        {/* Left Month: baseYear, baseMonth */}
        <div className="pr-3">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevYear}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="上一年"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="上一月"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="font-semibold text-gray-800 text-[13px]">
              {baseYear} {baseMonth} 月
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="下一月"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="下一年"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-1 text-gray-500 font-medium border-b border-gray-100 pb-1">
            {weekHeaders.map((w) => (
              <div key={w} className="py-0.5">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-y-1">
            {leftMonthDays.map((item, idx) => {
              const selected = isDaySelected(item.dateStr);
              const inRange = isInRange(item.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => onSelectDate(item.dateStr)}
                  className={`relative h-7 flex items-center justify-center cursor-pointer transition-colors ${
                    inRange ? 'bg-sky-50' : ''
                  }`}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-[12px] ${
                      selected
                        ? 'bg-[#0091ff] text-white rounded-full font-medium shadow-sm'
                        : item.isCurrentMonth
                        ? 'text-gray-800 hover:bg-gray-100 rounded-full'
                        : 'text-gray-300 hover:bg-gray-50 rounded-full'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Month: nextMonthYear, nextMonth */}
        <div className="pl-3">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevYear}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="上一年"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="上一月"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="font-semibold text-gray-800 text-[13px]">
              {nextMonthYear} {nextMonth} 月
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="下一月"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
                title="下一年"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-1 text-gray-500 font-medium border-b border-gray-100 pb-1">
            {weekHeaders.map((w) => (
              <div key={w} className="py-0.5">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-y-1">
            {rightMonthDays.map((item, idx) => {
              const selected = isDaySelected(item.dateStr);
              const inRange = isInRange(item.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => onSelectDate(item.dateStr)}
                  className={`relative h-7 flex items-center justify-center cursor-pointer transition-colors ${
                    inRange ? 'bg-sky-50' : ''
                  }`}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-[12px] ${
                      selected
                        ? 'bg-[#0091ff] text-white rounded-full font-medium shadow-sm'
                        : item.isCurrentMonth
                        ? 'text-gray-800 hover:bg-gray-100 rounded-full'
                        : 'text-gray-300 hover:bg-gray-50 rounded-full'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Apply button as shown in Image 3 */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer"
        >
          取消
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-6 py-1 text-xs bg-[#0091ff] hover:bg-[#007fe0] text-white rounded font-medium cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          应用
        </button>
      </div>
    </div>
  );
};
