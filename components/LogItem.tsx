import React, { useState, useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface LogItemProps {
  entry: LogEntry;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
}

const LogItem: React.FC<LogItemProps> = ({ entry, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entry.content);
  const inputRef = useRef<HTMLInputElement>(null);

  const timeString = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(entry.id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(entry.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div className="group flex items-start space-x-3 py-3 px-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors">
      <div className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1 min-w-[3rem] text-right">
        {timeString}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-500 text-gray-900 dark:text-gray-100"
            />
            <button onClick={handleSave} className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 p-1">
              <Check size={16} />
            </button>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 p-1">
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">
            {entry.content}
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity md:w-16 justify-end">
           <button 
            onClick={() => setIsEditing(true)} 
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => onDelete(entry.id)} 
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LogItem;
