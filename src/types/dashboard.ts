export interface TimeRange {
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string;   // YYYY-MM-DD
  endTime: string;   // HH:mm
}

export interface CustomTimePreset {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  createdAt: number;
}

export interface SessionRow {
  id: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  appName: string;
  vlan: string;
  traffic: string;
  rate: string;
  packetCount: string;
  avgPacketLength: string;
  zeroWindowCount: number;
  retransCount: number;
  retransRate: string;
  rstClient: number;
  rstServer: number;
  synCount: number;
  synAckCount: number;
}

export interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'interface';
  children?: TreeNode[];
  expanded?: boolean;
}
