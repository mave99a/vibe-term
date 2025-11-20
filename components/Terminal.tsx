
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { TerminalMessage, MessageType, CommandResult } from '../types';
import { INITIAL_WELCOME_MESSAGE, PROMPT_HOST, PROMPT_USER, PROMPT_SYMBOL, STORAGE_KEY_MOTD } from '../constants';
import { TerminalOutput } from './TerminalOutput';
import { processCommand } from '../services/commandService';
import { fileSystem } from '../services/fileSystem/VirtualFileSystem';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalMessage[]>(() => {
    // Initialize with stored MOTD if available
    const storedMotd = localStorage.getItem(STORAGE_KEY_MOTD);
    return [{
      id: 'init',
      type: MessageType.SYSTEM,
      content: storedMotd || INITIAL_WELCOME_MESSAGE,
      timestamp: Date.now(),
      cwd: fileSystem.getCwd(),
    }];
  });
  
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  // Local state to force re-render when file system changes (like cd)
  const [currentPath, setCurrentPath] = useState(fileSystem.getCwd());
  
  // Holds the continuation function for interactive commands
  const [activeCommand, setActiveCommand] = useState<((input: string) => Promise<CommandResult> | CommandResult) | null>(null);
  
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
      
      // Snapshot current path BEFORE execution for the command log
      const pathAtCommand = fileSystem.getCwd();

      // Add user input to UI history
      const commandMessage: TerminalMessage = {
        id: Date.now().toString() + '-cmd',
        type: MessageType.COMMAND,
        content: input, // Preserve exact input (spaces, etc)
        timestamp: Date.now(),
        cwd: pathAtCommand,
      };

      setHistory((prev) => [...prev, commandMessage]);
      setInput('');
      setHistoryIndex(-1);

      if (cmd || activeCommand) { // Process if there is input OR if we are waiting for input (even empty)
        setCommandHistory((prev) => [input, ...prev]);
        
        // Special case for clear command, ONLY if not in interactive mode
        if (!activeCommand && cmd.toLowerCase() === 'clear') {
            setTimeout(() => {
                setHistory([]);
            }, 100);
            return;
        }

        setIsProcessing(true);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 50)); 
          
          let result: CommandResult;

          if (activeCommand) {
            result = await activeCommand(input);
          } else {
            result = await processCommand(cmd);
          }
          
          const responseMessage: TerminalMessage = {
            id: Date.now().toString() + '-res',
            type: result.type || MessageType.OUTPUT,
            content: result.output,
            timestamp: Date.now(),
            cwd: fileSystem.getCwd(), // Not strictly necessary for output but good for consistency
          };

          setHistory((prev) => [...prev, responseMessage]);
          
          if (result.nextAction) {
            setActiveCommand(() => result.nextAction);
          } else {
            setActiveCommand(null);
          }
          
          // Update current path state for the input prompt
          setCurrentPath(fileSystem.getCwd());

        } catch (error) {
          setHistory((prev) => [...prev, {
            id: Date.now().toString() + '-err',
            type: MessageType.ERROR,
            content: 'An unexpected error occurred.',
            timestamp: Date.now(),
            cwd: pathAtCommand
          }]);
          setActiveCommand(null);
        } finally {
          setIsProcessing(false);
        }
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

  const displayPath = currentPath === '/users/guest' ? '~' : currentPath;

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
        {!activeCommand && (
          <>
            <span className="text-green-400 mr-1 font-bold hidden md:inline">{PROMPT_USER}@{PROMPT_HOST}</span>
            <span className="text-slate-400 mr-2 hidden md:inline">:{displayPath}{PROMPT_SYMBOL}</span>
            <span className="text-green-400 mr-1 font-bold md:hidden">{PROMPT_SYMBOL}</span>
          </>
        )}
        {activeCommand && (
          <span className="text-yellow-400 mr-2 font-bold">{'>'}</span>
        )}
        
        <div className="relative flex-grow">
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
