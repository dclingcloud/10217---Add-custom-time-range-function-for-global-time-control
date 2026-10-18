import React, { useState } from 'react';
import {
  ChevronDown,
  Filter,
  Clock,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  Sliders,
  BarChart,
  Eye,
} from 'lucide-react';

export const TrafficChart: React.FC = () => {
  const [precision, setPrecision] = useState('分钟');
  const [refreshFrequency, setRefreshFrequency] = useState(false);
  const [showBaseline, setShowBaseline] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const timeTicks = [
    '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
    '16:00', '16:05', '16:10', '16:15', '16:20'
  ];

  // SVG coordinates for a 1000 x 200 viewport
  // Green wave line points
  const greenPoints = [
    [0, 110], [50, 80], [90, 85], [140, 120], [180, 115],
    [220, 45], [260, 105], [300, 115], [350, 130], [400, 120],
    [450, 85], [500, 85], [550, 115], [600, 95], [650, 85],
    [700, 110], [750, 90], [800, 120], [850, 80], [900, 105],
    [950, 95], [1000, 190]
  ];

  // Cyan wave line points
  const cyanPoints = [
    [0, 75], [60, 90], [120, 70], [180, 80], [240, 95],
    [300, 80], [360, 60], [420, 75], [480, 100], [540, 65],
    [600, 85], [660, 75], [720, 105], [780, 90], [840, 70],
    [900, 85], [950, 75], [1000, 90]
  ];

  // Orange bottom line
  const orangePoints = [
    [0, 185], [150, 180], [300, 185], [450, 182], [600, 183],
    [750, 185], [900, 182], [1000, 185]
  ];

  const makeSmoothPath = (pts: number[][]) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };

  const greenLinePath = makeSmoothPath(greenPoints);
  const greenAreaPath = `${greenLinePath} L 1000 200 L 0 200 Z`;

  const cyanLinePath = makeSmoothPath(cyanPoints);
  const cyanAreaPath = `${cyanLinePath} L 1000 200 L 0 200 Z`;

  const orangeLinePath = makeSmoothPath(orangePoints);

  return (
    <div className="bg-white border-b border-[#e5e7eb] select-none text-xs text-gray-700">
      {/* Chart Top Control Bar */}
      <div className="px-4 py-1.5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 cursor-pointer hover:text-[#0080ff] transition-colors">
            <span className="font-medium text-gray-800">指标图表</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </div>
          <div className="h-3 w-[1px] bg-gray-200" />
          <button
            type="button"
            className="flex items-center space-x-1 text-gray-600 hover:text-[#0080ff] cursor-pointer"
          >
            <Filter className="w-3 h-3 text-[#0080ff]" />
            <span>过滤</span>
          </button>
        </div>

        <div className="flex items-center space-x-4 text-gray-500">
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
          >
            <Clock className="w-3 h-3" />
            <span>历史</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-1 hover:text-gray-800 cursor-pointer"
          >
            <span>收起</span>
            <ChevronUp
              className={`w-3 h-3 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Sub Control Bar matching Image 1 */}
          <div className="px-4 py-1.5 flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-50 bg-[#fafafa]/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span>数据精度</span>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs text-gray-700 focus:outline-none"
                >
                  <option value="分钟">分钟</option>
                  <option value="秒">秒</option>
                  <option value="小时">小时</option>
                </select>
              </div>

              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={refreshFrequency}
                  onChange={(e) => setRefreshFrequency(e.target.checked)}
                  className="rounded border-gray-300 text-[#0080ff]"
                />
                <span>刷新频率</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowBaseline(!showBaseline)}
                className={`flex items-center space-x-0.5 cursor-pointer hover:text-[#0080ff] ${
                  showBaseline ? 'text-[#0080ff]' : ''
                }`}
              >
                <span>基线</span>
                <HelpCircle className="w-3 h-3 text-gray-400" />
              </button>
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
              >
                <TrendingUp className="w-3 h-3" />
                <span>峰值</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>自定义指标</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
              >
                <BarChart className="w-3 h-3" />
                <span>图表转换</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
              >
                <Eye className="w-3 h-3 text-[#0080ff]" />
                <span>流量概览</span>
              </button>
            </div>
          </div>

          {/* Chart Canvas Area with Dual Y-Axes */}
          <div className="relative px-8 pt-3 pb-2 h-[210px] w-full">
            {/* Left Y-axis label */}
            <div className="absolute left-2 top-2 text-[10px] text-gray-400">流量 (GB)</div>
            {/* Left Y-axis ticks */}
            <div className="absolute left-3 top-8 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-mono">
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>

            {/* Right Y-axis label */}
            <div className="absolute right-2 top-2 text-[10px] text-gray-400">时间 (ms)</div>
            {/* Right Y-axis ticks */}
            <div className="absolute right-3 top-8 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-mono text-right">
              <span>650</span>
              <span>520</span>
              <span>390</span>
              <span>260</span>
              <span>130</span>
              <span>0</span>
            </div>

            {/* Chart SVG */}
            <div className="w-full h-full relative pl-6 pr-6">
              <svg
                viewBox="0 0 1000 200"
                preserveAspectRatio="none"
                className="w-full h-[160px] overflow-visible"
              >
                <defs>
                  {/* Green area gradient */}
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.45" />
                    <stop offset="60%" stopColor="#86efac" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Cyan area gradient */}
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal subtle grid lines */}
                <line x1="0" y1="10" x2="1000" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="70" x2="1000" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="130" x2="1000" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="190" x2="1000" y2="190" stroke="#e2e8f0" strokeWidth="1" />

                {/* Cyan Wave Fill & Stroke */}
                <path d={cyanAreaPath} fill="url(#cyanGrad)" />
                <path
                  d={cyanLinePath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Green Wave Fill & Stroke */}
                <path d={greenAreaPath} fill="url(#greenGrad)" />
                <path
                  d={greenLinePath}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Orange baseline */}
                <path
                  d={orangeLinePath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Interactive cursor line if hovered */}
                {hoverIndex !== null && (
                  <line
                    x1={hoverIndex * 100}
                    y1="10"
                    x2={hoverIndex * 100}
                    y2="190"
                    stroke="#0080ff"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}
              </svg>

              {/* X-axis time marks matching Image 1 */}
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1 pt-0.5 border-t border-gray-100">
                {timeTicks.map((t, idx) => (
                  <span
                    key={t}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className="cursor-pointer hover:text-[#0080ff] transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
