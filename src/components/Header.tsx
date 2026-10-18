import React, { useState, useRef, useEffect } from 'react';
import { Clock, Search, RotateCcw, Maximize2, User, ChevronDown, Bookmark, Star } from 'lucide-react';
import { TimeRange, CustomTimePreset } from '../types/dashboard';
import { TimePickerPopover } from './TimePicker/TimePickerPopover';

interface HeaderProps {
  currentRange: TimeRange;
  onApplyRange: (range: TimeRange) => void;
  onRefresh: () => void;
  activeTab: 'flow' | 'workbench';
  onTabChange: (tab: 'flow' | 'workbench') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRange,
  onApplyRange,
  onRefresh,
  activeTab,
  onTabChange,
}) => {
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close time picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
    };

    if (isTimePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTimePickerOpen]);

  const formattedTimeDisplay = `${currentRange.startDate} ${currentRange.startTime}  ~  ${currentRange.endDate} ${currentRange.endTime}`;

  return (
    <header className="h-11 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-3 select-none relative z-30 shrink-0">
      {/* Left side: Navigation Tabs matching Image 1 */}
      <div className="flex items-center space-x-6 h-full">
        <button
          type="button"
          onClick={() => onTabChange('flow')}
          className={`h-full flex items-center text-[13px] px-1 cursor-pointer transition-colors relative ${
            activeTab === 'flow'
              ? 'text-[#0080ff] font-semibold border-b-2 border-[#0080ff]'
              : 'text-gray-700 hover:text-gray-900 font-normal'
          }`}
        >
          流量分析
        </button>
        <button
          type="button"
          onClick={() => onTabChange('workbench')}
          className={`h-full flex items-center text-[13px] px-1 cursor-pointer transition-colors relative ${
            activeTab === 'workbench'
              ? 'text-[#0080ff] font-semibold border-b-2 border-[#0080ff]'
              : 'text-gray-700 hover:text-gray-900 font-normal'
          }`}
        >
          工作台
        </button>
      </div>

      {/* Right side: Time Picker & System Controls matching Image 1 */}
      <div className="flex items-center space-x-3.5">
        {/* Time component trigger matching Image 1 & 2 */}
        <div ref={triggerRef} className="relative flex items-center">
          <div
            onClick={() => setIsTimePickerOpen((prev) => !prev)}
            className="flex items-center border border-[#d9d9d9] hover:border-[#0091ff] rounded-[2px] bg-white text-xs cursor-pointer overflow-hidden transition-all group"
          >
            {/* Clock icon button */}
            <div className="px-2 py-1 text-gray-400 group-hover:text-[#0091ff] border-r border-[#e8e8e8] bg-[#fafafa]">
              <Clock className="w-3.5 h-3.5" />
            </div>

            {/* Time range string display */}
            <div className="px-3 py-1 text-gray-700 font-mono text-[12px] whitespace-nowrap min-w-[290px] text-center">
              {formattedTimeDisplay}
            </div>

            {/* Blue search icon button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="px-2.5 py-1 bg-[#0091ff] hover:bg-[#007fe0] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="按当前时间检索"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            className="ml-1.5 p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-[2px] border border-[#d9d9d9] transition-colors cursor-pointer bg-white"
            title="刷新"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Time Picker Popover (Image 2 + 3 + Custom Feature) */}
          <TimePickerPopover
            isOpen={isTimePickerOpen}
            currentRange={currentRange}
            onApplyRange={(newRange) => {
              onApplyRange(newRange);
            }}
            onClose={() => setIsTimePickerOpen(false)}
          />
        </div>

        {/* Global Search icon */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-800 p-1 cursor-pointer"
          title="搜索"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Fullscreen icon */}
        <button
          type="button"
          className="text-gray-500 hover:text-gray-800 p-1 cursor-pointer"
          title="全屏/缩放"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-1.5 text-gray-700 hover:text-gray-900 cursor-pointer pl-1">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium">admin</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
      </div>
    </header>
  );
};
