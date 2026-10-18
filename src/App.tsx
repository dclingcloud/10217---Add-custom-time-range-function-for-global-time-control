import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TimelineScrubber } from './components/TimelineScrubber';
import { TrafficChart } from './components/TrafficChart';
import { SessionTable } from './components/SessionTable';
import { TimeRange } from './types/dashboard';

export default function App() {
  const [currentRange, setCurrentRange] = useState<TimeRange>({
    startDate: '2026-10-13',
    startTime: '15:25',
    endDate: '2026-10-13',
    endTime: '16:25',
  });

  const [activeTab, setActiveTab] = useState<'flow' | 'workbench'>('flow');

  const handleApplyRange = (newRange: TimeRange) => {
    setCurrentRange(newRange);
  };

  const handleRefresh = () => {
    // Refresh triggered
    console.log('Query refreshed with range:', currentRange);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5] font-sans antialiased text-gray-800">
      {/* 1. Left Sidebar (Dark Rail + Link Tree) */}
      <div className="flex flex-col h-full shrink-0">
        {/* Top-left Brand Block "NGPM" matching Image 1 */}
        <div className="h-11 bg-[#1e2330] flex items-center px-3.5 border-b border-[#2d3446] select-none shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-white font-extrabold tracking-wider text-[17px] font-mono leading-none">
              NGPM
            </span>
          </div>
        </div>

        {/* Sidebar tree navigator */}
        <div className="flex-1 overflow-hidden">
          <Sidebar />
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header with Navigation tabs, Time Picker & System Controls */}
        <Header
          currentRange={currentRange}
          onApplyRange={handleApplyRange}
          onRefresh={handleRefresh}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dashboard Main Workspace */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-[#f0f2f5]">
          {activeTab === 'flow' ? (
            <div className="flex flex-col flex-1 min-w-[1100px]">
              {/* 24-Hour Timeline Scrubber */}
              <TimelineScrubber
                currentRange={currentRange}
                onRangeChange={handleApplyRange}
              />

              {/* Dual-axis Metric Wave Chart */}
              <TrafficChart />

              {/* TCP Session Data Table with Category Tabs & Action Bar */}
              <SessionTable />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              工作台模块
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
