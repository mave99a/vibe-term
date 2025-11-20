import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { TerminalMessage, MessageType } from '../types';
import { INITIAL_WELCOME_MESSAGE, PROMPT_HOST, PROMPT_USER, PROMPT_SYMBOL } from '../constants';
import { TerminalOutput } from './TerminalOutput';
import { processCommand } from '../services/commandService';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalMessage[]>([
    {
      id: 'init',
      type: MessageType.SYSTEM,
      content: INITIAL_WELCOME_MESSAGE,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on input
  useEffect(() => {
    const handleFocus = () => inputRef.current?.focus();
    document.addEventListener('click', handleFocus);
    return () => document.removeEventListener('click', handleFocus);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      const cmd = input.trim();
      
      // Add command to UI history
      const commandMessage: TerminalMessage = {
        id: Date.now().toString() + '-cmd',
        type: MessageType.COMMAND,
        content: input,
        timestamp: Date.now(),
      };

      setHistory((prev) => [...prev, commandMessage]);
      setInput('');
      setHistoryIndex(-1);

      if (cmd) {
        setCommandHistory((prev) => [cmd, ...prev]);
        
        if (cmd.toLowerCase() === 'clear') {
            // Slight delay to show the command was typed before clearing
            setTimeout(() => {
                setHistory([]);
            }, 100);
            return;
        }

        setIsProcessing(true);
        
        // Simulate processing delay for realism
        // In a real app with Gemini, this await would be the API call
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        const result = await processCommand(cmd);
        
        const responseMessage: TerminalMessage = {
          id: Date.now().toString() + '-res',
          type: result.type || MessageType.OUTPUT,
          content: result.output,
          timestamp: Date.now(),
        };

        setHistory((prev) => [...prev, responseMessage]);
        setIsProcessing(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col p-4 overflow-y-auto font-mono text-sm md:text-base" 
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-grow">
        {history.map((msg) => (
          <TerminalOutput key={msg.id} message={msg} />
        ))}
      </div>

      <div className="flex flex-row items-center mt-2">
        <span className="text-green-400 mr-1 font-bold hidden md:inline">{PROMPT_USER}@{PROMPT_HOST}</span>
        <span className="text-slate-400 mr-2 hidden md:inline">:~{PROMPT_SYMBOL}</span>
        <span className="text-green-400 mr-1 font-bold md:hidden">{PROMPT_SYMBOL}</span>
        
        <div className="relative flex-grow">
          {/* The visible input mirroring the hidden input for styling if needed, 
              but standard input with no outline works best for accessibility */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent border-none outline-none text-slate-100 placeholder-slate-700 caret-transparent"
          />
          {/* Custom Blinking Cursor Block */}
          <div 
            className="absolute top-0 left-0 pointer-events-none whitespace-pre select-none flex"
            aria-hidden="true"
          >
            <span className="text-transparent opacity-0">{input}</span>
            <span className="w-2.5 h-5 bg-slate-300 animate-blink inline-block ml-[1px] align-middle"></span>
          </div>
        </div>
      </div>
      
      <div ref={bottomRef} />
    </div>
  );
};