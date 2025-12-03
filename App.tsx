import React, { useState, useEffect } from 'react';
import { LogEntry, Language, Theme } from './types';
import { 
  loadEntries, 
  saveEntries, 
  loadLanguage, 
  saveLanguage, 
  loadTheme, 
  saveTheme,
  loadApiKey,
  saveApiKey,
  generateId
} from './services/storage';
import { Settings, Download, X, Moon, Sun, Globe, Key, Eye, EyeOff, Check, Database, Upload } from 'lucide-react';
import Timeline from './components/Timeline';
import InputArea from './components/InputArea';
import ExportModal from './components/ExportModal';
import ImportModal from './components/ImportModal';
import { getTranslation } from './services/i18n';

const App: React.FC = () => {
  // Initialize state directly from storage to prevent flash of empty content
  const [entries, setEntries] = useState<LogEntry[]>(() => loadEntries());
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  
  // API Key States
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = (key: string) => getTranslation(lang, key);

  // Persist entries on change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  // Persist settings
  useEffect(() => {
    saveLanguage(lang);
  }, [lang]);

  useEffect(() => {
    saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync temp key when real key changes or settings open
  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey, isSettingsOpen]);

  const saveApiKeyAction = () => {
    saveApiKey(tempKey);
    setApiKey(tempKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const addEntry = (content: string) => {
    const newEntry: LogEntry = {
      id: generateId(),
      content,
      timestamp: new Date().toISOString()
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateEntry = (id: string, newContent: string, newTimestamp?: string) => {
    setEntries(prev => prev.map(e => {
      if (e.id === id) {
        return { 
          ...e, 
          content: newContent,
          timestamp: newTimestamp || e.timestamp 
        };
      }
      return e;
    }));
  };

  const handleImport = (newEntries: LogEntry[]) => {
      setEntries(prev => [...prev, ...newEntries]);
  };

  return (
    <div className={`flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 max-w-3xl mx-auto shadow-2xl border-x border-gray-200 dark:border-gray-800 transition-colors duration-300`}>
      
      {/* Header */}
      <header className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg">
                D.
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Done.</h1>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
            title={t('settings')}
          >
            <Settings size={22} />
          </button>
          <button 
            onClick={() => setIsExportOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={t('export')}
          >
            <Download size={22} />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="absolute top-16 right-4 z-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl w-72 p-4 animate-in fade-in slide-in-from-top-2">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t('settings')}</h3>
             <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
               <X size={16} />
             </button>
           </div>
           
           <div className="space-y-5">
             {/* API Key Section */}
             <div>
               <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-2">
                 <Key size={12} className="mr-1" /> {t('apiKey')}
               </label>
               <div className="relative">
                 <input 
                    type={showKey ? "text" : "password"}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder={t('apiKeyPlaceholder')}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 border-0 rounded-lg px-3 py-2 pr-16 text-sm focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 transition-all"
                 />
                 <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-9 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                 <button 
                    onClick={saveApiKeyAction}
                    className="absolute right-2 top-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    title={t('save')}
                 >
                   {keySaved ? <Check size={16} /> : <Check size={16} className="opacity-0" />}
                 </button>
               </div>
             </div>

             {/* Language Toggle */}
             <div>
               <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-2">
                 <Globe size={12} className="mr-1" /> {t('language')}
               </label>
               <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                 <button 
                   onClick={() => setLang('zh')}
                   className={`flex-1 py-1.5 text-sm rounded-md transition-all ${lang === 'zh' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                 >
                   中文
                 </button>
                 <button 
                   onClick={() => setLang('en')}
                   className={`flex-1 py-1.5 text-sm rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                 >
                   English
                 </button>
               </div>
             </div>

             {/* Theme Toggle */}
             <div>
               <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-2">
                 {theme === 'dark' ? <Moon size={12} className="mr-1" /> : <Sun size={12} className="mr-1" />} {t('theme')}
               </label>
               <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                 <button 
                   onClick={() => setTheme('light')}
                   className={`flex-1 py-1.5 text-sm rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                 >
                   {t('light')}
                 </button>
                 <button 
                   onClick={() => setTheme('dark')}
                   className={`flex-1 py-1.5 text-sm rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                 >
                   {t('dark')}
                 </button>
               </div>
             </div>

             {/* Data Management Section */}
             <div>
               <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center mb-2">
                 <Database size={12} className="mr-1" /> {t('data')}
               </label>
               <button 
                 onClick={() => { setIsSettingsOpen(false); setIsImportOpen(true); }}
                 className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
               >
                 <Upload size={14} />
                 <span>{t('import')}</span>
               </button>
             </div>

           </div>
        </div>
      )}

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 no-scrollbar scroll-smooth">
        <Timeline 
          entries={entries} 
          onDelete={deleteEntry} 
          onUpdate={updateEntry} 
          lang={lang}
        />
        {/* Padding to allow scrolling past bottom content so it's not hidden by input */}
        <div className="h-4" /> 
      </main>

      {/* Sticky Bottom Input */}
      <footer className="flex-none">
        <InputArea onAdd={addEntry} lang={lang} />
      </footer>

      {/* Modals */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        entries={entries} 
        lang={lang}
        apiKey={apiKey}
      />

      <ImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={handleImport}
          lang={lang}
      />

    </div>
  );
};

export default App;