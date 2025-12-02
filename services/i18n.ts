import { Language } from '../types';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    today: "Today",
    yesterday: "Yesterday",
    noLogs: "No logs yet.",
    startTyping: "Type below to start your day.",
    placeholder: "What are you working on?",
    exportTitle: "Export Logs",
    quickCopy: "Quick Copy",
    thisWeek: "This Week",
    rawList: "Raw list",
    aiAssistant: "AI Assistant",
    generateReport: "Generate Weekly Report",
    copyReport: "Copy Report",
    back: "Back",
    aiDisclaimer: "Powered by Gemini 2.5 Flash.",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    delete: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    copied: "Copied!",
    copyToday: "Today",
    copyWeek: "This Week",
    export: "Export",
    appearance: "Appearance"
  },
  zh: {
    today: "今天",
    yesterday: "昨天",
    noLogs: "暂无记录",
    startTyping: "在下方输入以开始记录。",
    placeholder: "在做什么？",
    exportTitle: "导出记录",
    quickCopy: "一键复制",
    thisWeek: "本周",
    rawList: "原始清单",
    aiAssistant: "AI 助手",
    generateReport: "生成周报",
    copyReport: "复制周报",
    back: "返回",
    aiDisclaimer: "由 Gemini 2.5 Flash 提供支持。",
    settings: "设置",
    language: "语言",
    theme: "主题",
    light: "浅色",
    dark: "深色",
    delete: "删除",
    edit: "编辑",
    cancel: "取消",
    save: "保存",
    copied: "已复制",
    copyToday: "复制今日",
    copyWeek: "复制本周",
    export: "导出",
    appearance: "外观"
  }
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang][key] || key;
};
