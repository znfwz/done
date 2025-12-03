export interface LogEntry {
  id: string;
  content: string;
  timestamp: string; // ISO string
}

export interface GroupedLogs {
  [dateString: string]: LogEntry[];
}

export type ExportRange = 'today' | 'week' | 'month' | 'all';

export interface GenerateReportOptions {
  range: ExportRange;
  entries: LogEntry[];
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';
