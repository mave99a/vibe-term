import React from 'react';
import { Terminal } from './components/Terminal';
import { Terminal as TerminalIcon, Minus, Square, X } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-2 md:p-8">
      <div className="w-full max-w-4xl h-[85vh] bg-slate-900 rounded-lg shadow-2xl border border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* Decorative Window Bar */}
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700 select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon size={16} className="text-slate-400" />
            <span className="text-slate-300 text-sm font-medium font-mono">bash — 80x24</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 cursor-pointer transition-colors flex items-center justify-center group">
                <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500 cursor-pointer transition-colors flex items-center justify-center group">
                <Square size={6} className="text-green-900 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 cursor-pointer transition-colors flex items-center justify-center group">
                <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* CRT Scanline Effect Overlay (Subtle) */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

        {/* Terminal Content */}
        <div className="flex-grow relative z-0">
           <Terminal />
        </div>
      </div>
    </div>
  );
};

export default App;