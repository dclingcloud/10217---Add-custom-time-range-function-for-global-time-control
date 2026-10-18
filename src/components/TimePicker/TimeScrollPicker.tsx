import React, { useState, useRef, useEffect } from 'react';

interface TimeScrollPickerProps {
  initialStartTime: string; // HH:mm
  initialEndTime: string;   // HH:mm
  onConfirm: (startTime: string, endTime: string, isCrossDay: boolean) => void;
  onCancel: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export const TimeScrollPicker: React.FC<TimeScrollPickerProps> = ({
  initialStartTime,
  initialEndTime,
  onConfirm,
  onCancel,
}) => {
  const [startHour, setStartHour] = useState(() => initialStartTime.split(':')[0] || '09');
  const [startMinute, setStartMinute] = useState(() => initialStartTime.split(':')[1] || '00');

  const [endHour, setEndHour] = useState(() => initialEndTime.split(':')[0] || '11');
  const [endMinute, setEndMinute] = useState(() => initialEndTime.split(':')[1] || '30');

  const startHourRef = useRef<HTMLDivElement>(null);
  const startMinuteRef = useRef<HTMLDivElement>(null);
  const endHourRef = useRef<HTMLDivElement>(null);
  const endMinuteRef = useRef<HTMLDivElement>(null);

  // Check if cross day (e.g. 23:00 - 01:00)
  const isCrossDay = (() => {
    const startVal = parseInt(startHour, 10) * 60 + parseInt(startMinute, 10);
    const endVal = parseInt(endHour, 10) * 60 + parseInt(endMinute, 10);
    return endVal < startVal;
  })();

  const scrollToSelected = (container: HTMLDivElement | null, selectedIndex: number) => {
    if (container) {
      const itemHeight = 30; // height of each line
      container.scrollTop = Math.max(0, selectedIndex * itemHeight - 60);
    }
  };

  useEffect(() => {
    const sHIndex = HOURS.indexOf(startHour);
    const sMIndex = MINUTES.indexOf(startMinute);
    const eHIndex = HOURS.indexOf(endHour);
    const eMIndex = MINUTES.indexOf(endMinute);

    scrollToSelected(startHourRef.current, sHIndex);
    scrollToSelected(startMinuteRef.current, sMIndex);
    scrollToSelected(endHourRef.current, eHIndex);
    scrollToSelected(endMinuteRef.current, eMIndex);
  }, []);

  const handleApply = () => {
    const sTime = `${startHour}:${startMinute}`;
    const eTime = `${endHour}:${endMinute}`;
    onConfirm(sTime, eTime, isCrossDay);
  };

  return (
    <div className="absolute top-[38px] left-0 z-50 bg-white border border-[#e5e7eb] shadow-2xl rounded-[2px] w-[340px] text-xs text-gray-700 select-none animate-in fade-in zoom-in-95 duration-100">
      {/* Top pointing caret */}
      <div className="absolute -top-[6px] left-8 w-3 h-3 bg-white border-t border-l border-[#e5e7eb] transform rotate-45" />

      {/* Cross-day prompt indicator */}
      {isCrossDay && (
        <div className="mx-3 mt-2.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] rounded flex items-center justify-between">
          <span className="font-medium">检测到跨天时段</span>
          <span className="text-[10px] bg-amber-100 px-1 rounded font-mono">
            次日 {endHour}:{endMinute}
          </span>
        </div>
      )}

      {/* Main Dual Picker Columns */}
      <div className="p-3 grid grid-cols-2 gap-4 divide-x divide-gray-100">
        {/* Left Section: 开始时间 */}
        <div className="pr-1">
          <div className="text-center font-medium text-gray-700 mb-2 pb-1 border-b border-gray-100 text-xs">
            开始时间
          </div>
          <div className="relative h-[150px] flex">
            {/* Visual selection lines */}
            <div className="absolute top-[60px] left-0 right-0 h-[30px] border-t border-b border-gray-200 pointer-events-none bg-sky-50/20" />

            {/* Hours list */}
            <div
              ref={startHourRef}
              className="flex-1 overflow-y-auto scrollbar-none text-center py-[60px] space-y-0.5"
              style={{ scrollBehavior: 'smooth' }}
            >
              {HOURS.map((h) => {
                const isSelected = h === startHour;
                return (
                  <div
                    key={h}
                    onClick={() => setStartHour(h)}
                    className={`h-[30px] flex items-center justify-center cursor-pointer transition-colors font-mono text-[13px] ${
                      isSelected
                        ? 'font-bold text-gray-900'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {h}
                  </div>
                );
              })}
            </div>

            {/* Minutes list */}
            <div
              ref={startMinuteRef}
              className="flex-1 overflow-y-auto scrollbar-none text-center py-[60px] space-y-0.5"
              style={{ scrollBehavior: 'smooth' }}
            >
              {MINUTES.map((m) => {
                const isSelected = m === startMinute;
                return (
                  <div
                    key={m}
                    onClick={() => setStartMinute(m)}
                    className={`h-[30px] flex items-center justify-center cursor-pointer transition-colors font-mono text-[13px] ${
                      isSelected
                        ? 'font-bold text-gray-900'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: 结束时间 */}
        <div className="pl-3">
          <div className="text-center font-medium text-gray-700 mb-2 pb-1 border-b border-gray-100 text-xs">
            结束时间 {isCrossDay && <span className="text-amber-600 text-[10px]">(次日)</span>}
          </div>
          <div className="relative h-[150px] flex">
            {/* Visual selection lines */}
            <div className="absolute top-[60px] left-0 right-0 h-[30px] border-t border-b border-gray-200 pointer-events-none bg-sky-50/20" />

            {/* Hours list */}
            <div
              ref={endHourRef}
              className="flex-1 overflow-y-auto scrollbar-none text-center py-[60px] space-y-0.5"
              style={{ scrollBehavior: 'smooth' }}
            >
              {HOURS.map((h) => {
                const isSelected = h === endHour;
                return (
                  <div
                    key={h}
                    onClick={() => setEndHour(h)}
                    className={`h-[30px] flex items-center justify-center cursor-pointer transition-colors font-mono text-[13px] ${
                      isSelected
                        ? 'font-bold text-gray-900'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {h}
                  </div>
                );
              })}
            </div>

            {/* Minutes list */}
            <div
              ref={endMinuteRef}
              className="flex-1 overflow-y-auto scrollbar-none text-center py-[60px] space-y-0.5"
              style={{ scrollBehavior: 'smooth' }}
            >
              {MINUTES.map((m) => {
                const isSelected = m === endMinute;
                return (
                  <div
                    key={m}
                    onClick={() => setEndMinute(m)}
                    className={`h-[30px] flex items-center justify-center cursor-pointer transition-colors font-mono text-[13px] ${
                      isSelected
                        ? 'font-bold text-gray-900'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions matching Image 1 */}
      <div className="py-2 px-3 border-t border-gray-100 flex items-center justify-end space-x-2 bg-[#fafafa]">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-[2px] cursor-pointer"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-1 text-xs bg-[#0091ff] hover:bg-[#007fe0] text-white rounded-[2px] font-medium cursor-pointer shadow-xs active:scale-95 transition-all"
        >
          确定
        </button>
      </div>
    </div>
  );
};
