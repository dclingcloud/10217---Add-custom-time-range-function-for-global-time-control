import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CustomTimePreset } from '../../types/dashboard';
import { TimeScrollPicker } from './TimeScrollPicker';

interface CustomPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreset: (preset: CustomTimePreset) => void;
}

export const CustomPresetModal: React.FC<CustomPresetModalProps> = ({
  isOpen,
  onClose,
  onSavePreset,
}) => {
  const [name, setName] = useState('工作时间');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:30');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleTimeConfirm = (sTime: string, eTime: string) => {
    setStartTime(sTime);
    setEndTime(eTime);
    setIsPickerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPreset: CustomTimePreset = {
      id: `preset-${Date.now()}`,
      name: name.trim(),
      startTime,
      endTime,
      createdAt: Date.now(),
    };

    onSavePreset(newPreset);
    onClose();
    setName('工作时间');
    setStartTime('09:00');
    setEndTime('11:30');
    setIsPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-[2px] shadow-2xl border border-gray-200 w-[420px] text-xs text-gray-700 relative animate-in fade-in duration-100">
        {/* Header matching enterprise style */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#f8fafc]">
          <h3 className="font-semibold text-gray-800 text-[13px]">新增自定义时段</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 relative">
          <div>
            <label className="block text-gray-700 font-normal mb-1.5">时段配置名称</label>
            <input
              type="text"
              required
              placeholder="例如：工作时间、晨间巡检、业务低峰"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-[2px] text-xs focus:outline-none focus:border-[#0091ff] focus:ring-1 focus:ring-[#0091ff]"
            />
          </div>

          {/* Time range slot selector */}
          <div className="relative">
            <div className="mb-1.5">
              <label className="text-gray-700 font-normal">时段选择</label>
            </div>

            {/* Clean full-width input box */}
            <div
              onClick={() => setIsPickerOpen((prev) => !prev)}
              className={`w-full px-3 py-2 border rounded-[2px] cursor-pointer transition-all flex items-center justify-between text-xs font-mono bg-white select-none ${
                isPickerOpen
                  ? 'border-[#0091ff] ring-2 ring-[#0091ff]/20'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 text-sm">{startTime}</span>
                <span className="text-gray-400 font-normal">—</span>
                <span className="font-semibold text-gray-900 text-sm">{endTime}</span>
              </div>
              <span className="text-[11px] text-gray-400 font-sans">点击选择时段 ▾</span>
            </div>

            {/* 常用时段快捷选择（去掉了跨天时段） */}
            <div className="flex items-center space-x-2 mt-2.5">
              <span className="text-[11px] text-gray-500 font-medium shrink-0">常用:</span>
              <button
                type="button"
                onClick={() => {
                  setStartTime('09:00');
                  setEndTime('11:30');
                }}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  startTime === '09:00' && endTime === '11:30'
                    ? 'border-[#0091ff] bg-sky-50 text-[#0091ff] font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                09:00 - 11:30
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartTime('13:00');
                  setEndTime('15:00');
                }}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  startTime === '13:00' && endTime === '15:00'
                    ? 'border-[#0091ff] bg-sky-50 text-[#0091ff] font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                13:00 - 15:00
              </button>
            </div>

            {/* Time Scroll Picker Popover */}
            {isPickerOpen && (
              <TimeScrollPicker
                initialStartTime={startTime}
                initialEndTime={endTime}
                onConfirm={handleTimeConfirm}
                onCancel={() => setIsPickerOpen(false)}
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-[2px] cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-1 text-xs bg-[#0091ff] hover:bg-[#007fe0] text-white rounded-[2px] font-medium cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              确定保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
