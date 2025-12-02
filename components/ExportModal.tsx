import React, { useState } from 'react';
import { X, Copy, CheckCircle, Sparkles, FileText, Loader2 } from 'lucide-react';
import { LogEntry, ExportRange, Language } from '../types';
import { generateWeeklyReport } from '../services/geminiService';
import { getTranslation } from '../services/i18n';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LogEntry[];
  lang: Language;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, entries, lang }) => {
  const [copiedState, setCopiedState] = useState<'none' | 'today' | 'week'>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  
  const t = (key: string) => getTranslation(lang, key);

  if (!isOpen) return null;

  // Helper to filter entries
  const getFilteredEntries = (range: ExportRange) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Calculate start of week (assuming Monday is start)
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const weekStart = new Date(now.setDate(diff)).setHours(0,0,0,0);

    return entries.filter(e => {
      const t = new Date(e.timestamp).getTime();
      if (range === 'today') return t >= todayStart;
      if (range === 'week') return t >= weekStart;
      return false;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Chronological for export
  };

  const handleCopy = (range: ExportRange) => {
    const filtered = getFilteredEntries(range);
    const text = filtered.map(e => {
        const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = new Date(e.timestamp).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US');
        return `[${date} ${time}] ${e.content}`;
    }).join('\n');

    navigator.clipboard.writeText(text || (lang === 'zh' ? "无记录" : "No logs found"));
    setCopiedState(range);
    setTimeout(() => setCopiedState('none'), 2000);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiReport(null);
    const filtered = getFilteredEntries('week'); // Default to weekly report
    const report = await generateWeeklyReport(filtered, lang);
    setAiReport(report);
    setIsGenerating(false);
  };

  const handleCopyAIReport = () => {
      if (aiReport) {
          navigator.clipboard.writeText(aiReport);
          setCopiedState('week'); // reuse state for visual feedback
          setTimeout(() => setCopiedState('none'), 2000);
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('exportTitle')}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          
          {/* Standard Export */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('quickCopy')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleCopy('today')}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-95"
              >
                {copiedState === 'today' ? <CheckCircle className="text-green-500 mb-2" /> : <Copy className="text-gray-600 dark:text-gray-400 mb-2" />}
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('copyToday')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('rawList')}</span>
              </button>

              <button 
                onClick={() => handleCopy('week')}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all active:scale-95"
              >
                 {copiedState === 'week' && !aiReport ? <CheckCircle className="text-green-500 mb-2" /> : <Copy className="text-gray-600 dark:text-gray-400 mb-2" />}
                <span className="font-medium text-gray-900 dark:text-gray-100">{t('copyWeek')}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('rawList')}</span>
              </button>
            </div>
          </div>

          {/* AI Feature */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <Sparkles size={14} className="mr-1 text-purple-500" /> {t('aiAssistant')}
            </h3>
            
            {!aiReport ? (
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                <span>{t('generateReport')}</span>
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto whitespace-pre-wrap border border-gray-200 dark:border-gray-700 font-mono">
                  {aiReport}
                </div>
                <div className="flex space-x-2">
                     <button 
                        onClick={handleCopyAIReport}
                        className="flex-1 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        {t('copyReport')}
                    </button>
                    <button 
                        onClick={() => setAiReport(null)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        {t('back')}
                    </button>
                </div>
              </div>
            )}
             <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">{t('aiDisclaimer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
