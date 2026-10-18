import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Check } from 'lucide-react';
import { CustomTimePreset, TimeRange } from '../../types/dashboard';
import { DEFAULT_CUSTOM_PRESETS, HISTORICAL_QUERIES, QUICK_QUERY_COLUMNS } from '../../data/mockData';
import { DualMonthCalendar } from './DualMonthCalendar';
import { CustomPresetModal } from './CustomPresetModal';

interface TimePickerPopoverProps {
  isOpen: boolean;
  currentRange: TimeRange;
  onApplyRange: (newRange: TimeRange) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'ngpm_custom_time_presets';

export const TimePickerPopover: React.FC<TimePickerPopoverProps> = ({
  isOpen,
  currentRange,
  onApplyRange,
  onClose,
}) => {
  // Draft time values inside the popover
  const [startDate, setStartDate] = useState(currentRange.startDate);
  const [startTime, setStartTime] = useState(currentRange.startTime);
  const [endDate, setEndDate] = useState(currentRange.endDate);
  const [endTime, setEndTime] = useState(currentRange.endTime);

  // Calendar state
  const [calendarTarget, setCalendarTarget] = useState<'start' | 'end' | null>(null);

  // Custom presets state (persisted in localStorage)
  const [presets, setPresets] = useState<CustomTimePreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: CustomTimePreset) => !['preset-1', 'preset-2', 'preset-3'].includes(p.id));
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_CUSTOM_PRESETS;
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isAddPresetModalOpen, setIsAddPresetModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartDate(currentRange.startDate);
      setStartTime(currentRange.startTime);
      setEndDate(currentRange.endDate);
      setEndTime(currentRange.endTime);
      setCalendarTarget(null);
    }
  }, [isOpen, currentRange]);

  const savePresetsToStorage = (updated: CustomTimePreset[]) => {
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddPreset = (newPreset: CustomTimePreset) => {
    const updated = [newPreset, ...presets];
    savePresetsToStorage(updated);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    savePresetsToStorage(updated);
    if (activePresetId === id) setActivePresetId(null);
  };

  const getNextDateStr = (dateStr: string): string => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      d.setDate(d.getDate() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return dateStr;
  };

  const handleApplyPreset = (preset: CustomTimePreset) => {
    setActivePresetId(preset.id);
    const [sH, sM] = preset.startTime.split(':').map(Number);
    const [eH, eM] = preset.endTime.split(':').map(Number);
    const isCross = preset.isCrossDay ?? (eH * 60 + eM < sH * 60 + sM);

    setStartTime(preset.startTime);
    setEndTime(preset.endTime);

    if (isCross) {
      // 跨天情况：开始日期为当前选定日期，结束日期自动顺延为次日
      setEndDate(getNextDateStr(startDate));
    } else {
      // 当日时段：结束日期与开始日期相同
      setEndDate(startDate);
    }
  };

  const handleQuickOptionClick = (label: string) => {
    setActivePresetId(null);
    const baseDate = '2026-10-13';
    setStartDate(baseDate);
    setEndDate(baseDate);

    switch (label) {
      case '1分钟':
        setStartTime('16:24');
        setEndTime('16:25');
        break;
      case '5分钟':
        setStartTime('16:20');
        setEndTime('16:25');
        break;
      case '15分钟':
        setStartTime('16:10');
        setEndTime('16:25');
        break;
      case '30分钟':
        setStartTime('15:55');
        setEndTime('16:25');
        break;
      case '1小时':
        setStartTime('15:25');
        setEndTime('16:25');
        break;
      case '3小时':
        setStartTime('13:25');
        setEndTime('16:25');
        break;
      case '6小时':
        setStartTime('10:25');
        setEndTime('16:25');
        break;
      case '12小时':
        setStartTime('04:25');
        setEndTime('16:25');
        break;
      case '24小时':
        setStartDate('2026-10-12');
        setStartTime('16:25');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '过去1天':
        setStartDate('2026-10-12');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '过去3天':
        setStartDate('2026-10-10');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '过去7天':
        setStartDate('2026-10-06');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '过去14天':
        setStartDate('2026-09-29');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '昨天':
        setStartDate('2026-10-12');
        setStartTime('00:00');
        setEndDate('2026-10-12');
        setEndTime('23:59');
        break;
      case '今天':
        setStartDate('2026-10-13');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '本周':
        setStartDate('2026-10-12');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '上周':
        setStartDate('2026-10-05');
        setStartTime('00:00');
        setEndDate('2026-10-11');
        setEndTime('23:59');
        break;
      case '本月':
        setStartDate('2026-10-01');
        setStartTime('00:00');
        setEndDate('2026-10-13');
        setEndTime('16:25');
        break;
      case '上月':
        setStartDate('2026-09-01');
        setStartTime('00:00');
        setEndDate('2026-09-30');
        setEndTime('23:59');
        break;
      default:
        setStartTime('15:25');
        setEndTime('16:25');
    }
  };

  const handleHistoricalClick = (item: string) => {
    setActivePresetId(null);
    const [startPart, endPart] = item.split(' - ');
    if (startPart && endPart) {
      const [sM, sT] = startPart.trim().split(' ');
      const [eM, eT] = endPart.trim().split(' ');
      if (sM && sT && eM && eT) {
        setStartDate(`2026-${sM}`);
        setStartTime(sT);
        setEndDate(`2026-${eM}`);
        setEndTime(eT);
      }
    }
  };

  const handleConfirm = () => {
    onApplyRange({
      startDate,
      startTime,
      endDate,
      endTime,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute right-0 top-[42px] z-40 bg-white border border-[#d9d9d9] shadow-xl rounded-none w-[890px] text-xs text-gray-700 animate-in fade-in duration-100 select-none">
        {/* Main 3 Columns layout */}
        <div className="p-5 grid grid-cols-12 gap-6 relative">
          {/* Column 1 (Left): 自 / 至 / 自定义时段 (图1红框位置) */}
          <div className="col-span-4 relative border-r border-gray-100 pr-5 flex flex-col justify-between">
            <div>
              {/* Start time row */}
              <div className="mb-3">
                <label className="block text-gray-700 font-normal mb-1.5 text-xs">自</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={startDate}
                    onClick={() => setCalendarTarget(calendarTarget === 'start' ? null : 'start')}
                    className={`w-[120px] px-2.5 py-1.5 border border-gray-300 rounded-[2px] text-xs text-center cursor-pointer transition-colors ${
                      calendarTarget === 'start'
                        ? 'border-[#0091ff] ring-1 ring-[#0091ff] bg-sky-50/40'
                        : 'hover:border-gray-400 bg-white'
                    }`}
                  />
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-[84px] px-2.5 py-1.5 border border-gray-300 rounded-[2px] text-xs text-center font-mono focus:outline-none focus:border-[#0091ff]"
                  />
                </div>
              </div>

              {/* End time row */}
              <div className="mb-4">
                <label className="block text-gray-700 font-normal mb-1.5 text-xs">至</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={endDate}
                    onClick={() => setCalendarTarget(calendarTarget === 'end' ? null : 'end')}
                    className={`w-[120px] px-2.5 py-1.5 border border-gray-300 rounded-[2px] text-xs text-center cursor-pointer transition-colors ${
                      calendarTarget === 'end'
                        ? 'border-[#0091ff] ring-1 ring-[#0091ff] bg-sky-50/40'
                        : 'hover:border-gray-400 bg-white'
                    }`}
                  />
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-[84px] px-2.5 py-1.5 border border-gray-300 rounded-[2px] text-xs text-center font-mono focus:outline-none focus:border-[#0091ff]"
                  />
                </div>
              </div>

              {/* 图1红框位置：自定义时段展示区 */}
              <div className="pt-2 border-t border-dashed border-gray-200 mb-3">
                <div className="mb-2">
                  <span className="text-gray-700 font-medium text-xs">自定义时段</span>
                </div>

                {/* 红框内容区：直接放置自定义时段操作按钮与已配时段列表，去掉"点击新增"和"暂无自定义时段" */}
                <div className="space-y-1.5">
                  {presets.length > 0 && (
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                      {presets.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        const [sH, sM] = preset.startTime.split(':').map(Number);
                        const [eH, eM] = preset.endTime.split(':').map(Number);
                        const isCross = preset.isCrossDay ?? (eH * 60 + eM < sH * 60 + sM);
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleApplyPreset(preset)}
                            className={`group flex items-center justify-between px-2 py-1.5 rounded-[2px] border text-xs cursor-pointer transition-all ${
                              isActive
                                ? 'border-[#0091ff] bg-sky-50 text-[#0091ff]'
                                : 'border-gray-200 hover:border-[#0091ff] hover:bg-sky-50/40 text-gray-700 bg-[#fafafa]'
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-1">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-medium truncate">{preset.name}</span>
                                {isCross && (
                                  <span className="text-[10px] text-amber-700 bg-amber-100/80 border border-amber-300/60 px-1 rounded font-normal shrink-0">
                                    跨天
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono truncate mt-0.5">
                                {preset.startTime} — {preset.endTime} {isCross ? '(次日)' : ''}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 shrink-0">
                              {isActive && <Check className="w-3.5 h-3.5 text-[#0091ff]" />}
                              <button
                                type="button"
                                onClick={(e) => handleDeletePreset(preset.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-0.5 cursor-pointer transition-opacity"
                                title="删除"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 位于红框区域内的新增自定义时段按钮 */}
                  <button
                    type="button"
                    onClick={() => setIsAddPresetModalOpen(true)}
                    className="w-full py-1.5 px-3 border border-dashed border-gray-300 hover:border-[#0091ff] text-gray-600 hover:text-[#0091ff] hover:bg-sky-50/50 rounded-[2px] text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all bg-[#fafafa]"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0091ff]" />
                    <span>新增自定义时段</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notice text */}
            <div className="text-[11px] leading-relaxed text-gray-400 pt-1">
              自定义时间查询：时间段跨度过大会导致查询性能下降，请尽量缩短查询时间。
            </div>

            {/* Dual Calendar Attachment when date input is clicked */}
            {calendarTarget && (
              <DualMonthCalendar
                selectedStartDate={startDate}
                selectedEndDate={endDate}
                targetField={calendarTarget}
                onSelectDate={(d) => {
                  if (calendarTarget === 'start') {
                    setStartDate(d);
                  } else {
                    setEndDate(d);
                  }
                }}
                onApply={() => setCalendarTarget(null)}
                onClose={() => setCalendarTarget(null)}
              />
            )}
          </div>

          {/* Column 2 (Middle): 历史查询 */}
          <div className="col-span-3 border-r border-gray-100 pr-4">
            <h4 className="text-gray-500 font-normal mb-3 text-xs">历史查询</h4>
            <div className="space-y-2">
              {HISTORICAL_QUERIES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleHistoricalClick(item)}
                  className="text-gray-700 hover:text-[#0091ff] hover:bg-sky-50/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors text-[12px] font-normal"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 (Right): 快速查询(最近) */}
          <div className="col-span-5 pl-2">
            <h4 className="text-gray-500 font-normal mb-3 text-xs">快速查询(最近)</h4>
            <div className="grid grid-cols-5 gap-x-2 gap-y-2">
              {QUICK_QUERY_COLUMNS.map((col, cIdx) => (
                <div key={cIdx} className="space-y-2">
                  {col.items.map((item, iIdx) => (
                    <button
                      key={iIdx}
                      type="button"
                      onClick={() => handleQuickOptionClick(item)}
                      className="block w-full text-left text-gray-700 hover:text-[#0091ff] hover:bg-sky-50/60 px-1 py-0.5 rounded cursor-pointer transition-colors text-[12px] whitespace-nowrap"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Button Row matching Image 1: 取消 / 确定 */}
        <div className="py-2.5 px-6 border-t border-gray-100 flex items-center justify-center space-x-4 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-[2px] transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-1.5 text-xs text-white bg-[#0091ff] hover:bg-[#007fe0] rounded-[2px] font-medium transition-colors cursor-pointer shadow-xs"
          >
            确定
          </button>
        </div>
      </div>

      {/* 新增自定义时段弹窗 */}
      <CustomPresetModal
        isOpen={isAddPresetModalOpen}
        onClose={() => setIsAddPresetModalOpen(false)}
        onSavePreset={handleAddPreset}
      />
    </>
  );
};
