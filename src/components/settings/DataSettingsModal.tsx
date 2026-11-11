import React, { useRef, useState } from 'react';
import { X, HardDrive, Download, Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Project } from '../../types';
import { exportDataAsJSON, isStorageAvailable } from '../../utils/storage';

interface DataSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProject?: Project;
  onRestoreProjects: (importedProjects: Project[]) => void;
  onClearAll: () => void;
}

export const DataSettingsModal: React.FC<DataSettingsModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProject,
  onRestoreProjects,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [storageOk] = useState<boolean>(() => isStorageAvailable());

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        let listToImport: Project[] = [];

        if (Array.isArray(parsed)) {
          listToImport = parsed;
        } else if (parsed && Array.isArray(parsed.projects)) {
          listToImport = parsed.projects;
        } else {
          throw new Error('Unrecognized JSON backup format. Missing projects array.');
        }

        if (listToImport.length === 0) {
          throw new Error('Backup file contains 0 projects.');
        }

        onRestoreProjects(listToImport);
        setImportStatus({
          message: `Successfully restored ${listToImport.length} project(s)!`,
          isError: false,
        });
      } catch (err: any) {
        setImportStatus({
          message: err?.message || 'Invalid JSON file. Please verify file integrity.',
          isError: true,
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Local Data &amp; Guest Mode</h2>
              <p className="text-xs text-slate-500">Manage backups and browser storage</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${storageOk ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Data is stored locally on this device.</span>
              <p className="mt-0.5 text-[11px] text-emerald-800/90 leading-relaxed">
                Your research notes, competitors, questions and validation findings stay safely inside your browser’s localStorage. No remote databases, tracking or cloud servers are used. Note: Local storage does not synchronize across separate browsers or devices.
              </p>
            </div>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-lg border flex items-center gap-2 ${importStatus.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
              {importStatus.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Backup / Export Section */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
              Export &amp; Backup
            </h3>
            <p className="text-slate-600">
              Download your projects as an open standard JSON backup. You can restore this file anytime on any computer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => exportDataAsJSON(projects, false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup All ({projects.length}) Projects</span>
              </button>
              {activeProject && (
                <button
                  onClick={() => exportDataAsJSON(projects, true, activeProject)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Active Project</span>
                </button>
              )}
            </div>
          </div>

          {/* Restore / Import Section */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
              Restore from Backup
            </h3>
            <p className="text-slate-600">
              Load previously exported JSON project files into your browser.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Select JSON Backup File to Restore</span>
            </button>
          </div>

          {/* Reset / Clear Data */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
              Clear Local Storage
            </h3>
            <p className="text-slate-600">
              Permanently remove all saved projects, questions, and feedback from this browser.
            </p>
            <div>
              <button
                onClick={onClearAll}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg border border-red-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Projects &amp; Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
