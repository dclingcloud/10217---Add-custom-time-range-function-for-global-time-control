import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Filter,
  Layers,
  ChevronDown,
  Bot,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Activity,
  ListFilter,
} from 'lucide-react';
import { INITIAL_SESSION_ROWS } from '../data/mockData';
import { SessionRow } from '../types/dashboard';

const CATEGORY_TABS = [
  { id: 'summary', label: '概要信息' },
  { id: 'vlan', label: 'VLAN' },
  { id: 'site', label: '站点 ☷' },
  { id: 'app', label: '应用' },
  { id: 'host', label: '主机 ☷' },
  { id: 'ip_session', label: 'IP会话 ☷' },
  { id: 'server_access', label: '服务器访问' },
  { id: 'tcp_session', label: 'TCP会话 ☷', active: true },
  { id: 'udp_session', label: 'UDP会话 ☷' },
  { id: 'server_tuple', label: '服务器二元组' },
  { id: 'port', label: '端口' },
];

export const SessionTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tcp_session');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('100条/页');
  const [gotoPage, setGotoPage] = useState('1');

  const rows = INITIAL_SESSION_ROWS;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(rows.map((r) => r.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedRowIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRowIds(next);
  };

  return (
    <div className="bg-white flex flex-col select-none text-xs text-gray-700">
      {/* 1. Category Sub-tabs matching Image 1 */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-white text-[12px]">
        <div className="flex items-center space-x-3 text-gray-600 overflow-x-auto">
          {CATEGORY_TABS.map((tab, idx) => {
            const isSelected = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                {idx > 0 && <span className="text-gray-300">·</span>}
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer whitespace-nowrap transition-colors flex items-center space-x-1 ${
                    isSelected
                      ? 'text-[#0080ff] font-semibold'
                      : 'hover:text-[#0080ff] text-gray-700'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0080ff]" />}
                  <span>{tab.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 text-gray-500 shrink-0">
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <span>☷ 模式</span>
          </button>
        </div>
      </div>

      {/* 2. Action Toolbar matching Image 1 */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between bg-[#fafbfc]">
        {/* Left Action Buttons */}
        <div className="flex items-center space-x-2.5 text-gray-700 text-[11px] overflow-x-auto">
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>快速解码</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>数据包下载</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>回溯分析</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>精确过滤</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>选择KPI</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>逐包分析</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>对象监测</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-1 hover:text-[#0080ff] cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>全息会话关联</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            <span>菜单</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Right Search & Filter */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1 text-gray-600 hover:text-[#0080ff] cursor-pointer text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#0080ff]" />
            <span>时间桶</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1.5" />
            <input
              type="text"
              placeholder="搜索当前IP、主机名或端口"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-0.5 w-[200px] border border-gray-300 rounded-[2px] text-[11px] placeholder-gray-400 focus:outline-none focus:border-[#0080ff] bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. The Data Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead className="bg-[#f5f7fa] text-gray-600 border-b border-gray-200">
            <tr>
              <th className="py-2 px-2.5 w-7 text-center">
                <input
                  type="checkbox"
                  checked={selectedRowIds.size === rows.length && rows.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#0080ff] cursor-pointer"
                />
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>源IP</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>源端口</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>目的IP</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>目的端口</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-center">分析</th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>应用名称</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap">
                <span className="flex items-center space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>VLAN</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>流量</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>速率</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>数据包数</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>平均包长</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>零窗口包数</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>重传包数</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>重传率</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>RST包数-客户端</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>RST包数-服务器</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>SYN包数</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
              <th className="py-2 px-2 font-medium whitespace-nowrap text-right">
                <span className="flex items-center justify-end space-x-0.5 cursor-pointer hover:text-gray-900">
                  <span>SYN-ACK包数</span>
                  <ArrowUpDown className="w-2.5 h-2.5 text-gray-400" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono">
            {rows.map((row) => {
              const isChecked = selectedRowIds.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={`hover:bg-[#f0f7ff] transition-colors ${
                    isChecked ? 'bg-[#e6f4ff]/40' : ''
                  }`}
                >
                  <td className="py-1.5 px-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectRow(row.id)}
                      className="rounded border-gray-300 text-[#0080ff] cursor-pointer"
                    />
                  </td>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#0080ff] hover:underline cursor-pointer">
                    {row.srcIp}
                  </td>
                  <td className="py-1.5 px-2 text-[#0080ff] hover:underline cursor-pointer">
                    {row.srcPort}
                  </td>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#0080ff] hover:underline cursor-pointer">
                    {row.dstIp}
                  </td>
                  <td className="py-1.5 px-2 text-[#0080ff] hover:underline cursor-pointer">
                    {row.dstPort}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full bg-[#e6f4ff] hover:bg-[#bae0ff] text-[#0080ff] inline-flex items-center justify-center cursor-pointer transition-colors"
                      title="探针逐包回放"
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="py-1.5 px-2 font-sans text-gray-700">{row.appName}</td>
                  <td className="py-1.5 px-2 font-sans text-gray-600 whitespace-nowrap">
                    {row.vlan}
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-800 font-medium whitespace-nowrap">
                    {row.traffic}
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-700 whitespace-nowrap">
                    {row.rate}
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.packetCount}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.avgPacketLength}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.zeroWindowCount}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.retransCount}</td>
                  <td
                    className={`py-1.5 px-2 text-right font-medium ${
                      row.retransRate.includes('59') || row.retransRate.includes('88') || row.retransRate.includes('91')
                        ? 'text-red-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {row.retransRate}
                  </td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.rstClient}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.rstServer}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.synCount}</td>
                  <td className="py-1.5 px-2 text-right text-gray-700">{row.synAckCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Table Footer & Pagination matching Image 1 */}
      <div className="px-4 py-2.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 bg-white">
        <div>
          本页记录从1到100 总数 <span className="font-semibold text-gray-700">2037931</span>条
        </div>

        <div className="flex items-center space-x-2">
          {/* Page size select */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="border border-gray-300 rounded-[2px] px-2 py-0.5 text-xs text-gray-700 bg-white focus:outline-none"
          >
            <option value="100条/页">100条/页</option>
            <option value="50条/页">50条/页</option>
            <option value="200条/页">200条/页</option>
          </select>

          {/* Page buttons */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="p-1 border border-gray-300 rounded-[2px] text-gray-400 hover:text-gray-700 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`w-5 h-5 rounded-[2px] flex items-center justify-center font-medium cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#0091ff] text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className="w-5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(4)}
              className="w-5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              4
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(5)}
              className="w-5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              5
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(6)}
              className="w-5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              6
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              type="button"
              onClick={() => setCurrentPage(20380)}
              className="px-1.5 h-5 rounded-[2px] border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 cursor-pointer font-mono"
            >
              20380
            </button>
            <button
              type="button"
              className="p-1 border border-gray-300 rounded-[2px] text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Goto page */}
          <div className="flex items-center space-x-1 pl-2">
            <span>前往</span>
            <input
              type="text"
              value={gotoPage}
              onChange={(e) => setGotoPage(e.target.value)}
              className="w-8 px-1 py-0.5 border border-gray-300 rounded-[2px] text-center text-xs font-mono"
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};
