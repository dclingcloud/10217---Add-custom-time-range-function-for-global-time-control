import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Activity,
  Cloud,
  Server,
  Crosshair,
  Gauge,
  BarChart2,
  Folder,
  Sliders,
  GitBranch,
  Monitor,
  Terminal,
  Layers,
  Search,
  PlusSquare,
  MinusSquare,
  Zap,
  ChevronUp,
} from 'lucide-react';
import { INITIAL_TREE_DATA } from '../data/mockData';
import { TreeNode } from '../types/dashboard';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'link' | 'group'>('link');
  const [mode, setMode] = useState<'classic' | 'catalog'>('classic');
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE_DATA);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('if-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaybackExpanded, setIsPlaybackExpanded] = useState(false);

  const toggleExpand = (nodeId: string) => {
    setTreeData((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        return node;
      })
    );
  };

  return (
    <div className="flex h-full shrink-0 select-none border-r border-[#e5e7eb] bg-white">
      {/* 1. Leftmost Dark Icon Rail matching Image 1 */}
      <div className="w-11 bg-[#1e2330] flex flex-col items-center py-2 text-[#9ca3af] space-y-3.5 shrink-0 z-20">
        <button
          type="button"
          className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded cursor-pointer"
          title="展开导航"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-6 h-[1px] bg-gray-700 my-1" />

        {/* Menu icons matching Image 1 */}
        <button
          type="button"
          className="p-1.5 text-white bg-[#0080ff] rounded cursor-pointer shadow-xs"
          title="流量分析"
        >
          <Activity className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="网络拓扑"
        >
          <GitBranch className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="云平台"
        >
          <Cloud className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="主机与存储"
        >
          <Server className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="虚拟化矩阵"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="探测目标"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="性能仪表盘"
        >
          <Gauge className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="指标统计"
        >
          <BarChart2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="资源目录"
        >
          <Folder className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="参数过滤"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="全息监控屏"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer"
          title="控制台终端"
        >
          <Terminal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Resource Tree Navigator matching Image 1 */}
      <div className="w-[210px] flex flex-col justify-between bg-white text-xs text-gray-700">
        <div>
          {/* Top mode tabs: 链路 / 分析组 */}
          <div className="p-2 border-b border-gray-100 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`px-3 py-1 rounded-[2px] text-xs cursor-pointer transition-colors ${
                activeTab === 'link'
                  ? 'bg-[#0080ff] text-white font-medium shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              链路
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('group')}
              className={`px-3 py-1 rounded-[2px] text-xs cursor-pointer transition-colors ${
                activeTab === 'group'
                  ? 'bg-[#0080ff] text-white font-medium shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              分析组
            </button>
          </div>

          {/* Sub-modes: 经典模式 / 目录模式 */}
          <div className="px-2 pt-2 pb-1.5 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setMode('classic')}
              className={`flex-1 py-1 text-center text-[11px] rounded-[2px] border cursor-pointer transition-colors ${
                mode === 'classic'
                  ? 'border-[#0080ff] text-[#0080ff] font-medium bg-sky-50/50'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              经典模式
            </button>
            <button
              type="button"
              onClick={() => setMode('catalog')}
              className={`flex-1 py-1 text-center text-[11px] rounded-[2px] border cursor-pointer transition-colors ${
                mode === 'catalog'
                  ? 'border-[#0080ff] text-[#0080ff] font-medium bg-sky-50/50'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              目录模式
            </button>
          </div>

          {/* Search box */}
          <div className="px-2 py-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1.5" />
              <input
                type="text"
                placeholder="请输入检索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-white border border-gray-200 rounded-[2px] text-[11px] placeholder-gray-400 focus:outline-none focus:border-[#0080ff]"
              />
            </div>
          </div>

          {/* Tree Node List */}
          <div className="px-1 py-1 overflow-y-auto max-h-[calc(100vh-220px)] space-y-0.5 text-[12px]">
            {treeData.map((node) => {
              const isExpanded = node.expanded;
              return (
                <div key={node.id}>
                  <div
                    onClick={() => toggleExpand(node.id)}
                    className="flex items-center space-x-1.5 py-1 px-1.5 rounded hover:bg-gray-50 cursor-pointer text-gray-700"
                  >
                    {isExpanded ? (
                      <MinusSquare className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    ) : (
                      <PlusSquare className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-[#eab308] shrink-0" />
                    <span className="truncate">{node.label}</span>
                  </div>

                  {/* Children if expanded */}
                  {isExpanded && node.children && (
                    <div className="pl-5 space-y-0.5">
                      {node.children.map((child) => {
                        const isSelected = selectedNodeId === child.id;
                        return (
                          <div
                            key={child.id}
                            onClick={() => setSelectedNodeId(child.id)}
                            className={`flex items-center space-x-1.5 py-1 px-2 rounded-[2px] cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#e6f4ff] text-[#0080ff] font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <PlusSquare className="w-3 h-3 text-gray-400 shrink-0" />
                            <Zap className="w-3 h-3 text-[#0080ff] shrink-0" />
                            <span className="truncate">{child.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: 回放任务 */}
        <div className="p-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 bg-[#fafafa]">
          <span>回放任务</span>
          <button
            type="button"
            onClick={() => setIsPlaybackExpanded(!isPlaybackExpanded)}
            className="text-[#0080ff] hover:underline flex items-center space-x-0.5 cursor-pointer"
          >
            <span>{isPlaybackExpanded ? '收起' : '展开'}</span>
            <ChevronUp
              className={`w-3 h-3 transition-transform ${isPlaybackExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
