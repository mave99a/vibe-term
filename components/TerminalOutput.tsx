
import React from 'react';
import { TerminalMessage, MessageType } from '../types';
import { PROMPT_HOST, PROMPT_USER, PROMPT_SYMBOL } from '../constants';

interface TerminalOutputProps {
  message: TerminalMessage;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ message }) => {
  const { type, content, cwd } = message;

  if (type === MessageType.COMMAND) {
    // If cwd is stored in the message, use it. Otherwise default to ~
    // We should try to shorten /users/guest to ~ for display if we wanted to be fancy, 
    // but explicit path is fine for now.
    const displayPath = cwd === '/users/guest' ? '~' : (cwd || '~');

    return (
      <div className="flex flex-row items-start mb-1 group">
        <span className="text-green-400 mr-1 font-bold">{PROMPT_USER}@{PROMPT_HOST}</span>
        <span className="text-slate-400 mr-2">:{displayPath}{PROMPT_SYMBOL}</span>
        <span className="text-slate-100 whitespace-pre-wrap break-words flex-1">{content}</span>
      </div>
    );
  }

  let textColor = 'text-slate-300';
  if (type === MessageType.ERROR) textColor = 'text-red-400';
  if (type === MessageType.SYSTEM) textColor = 'text-blue-300';

  // Check if content contains HTML-like strings (for colorized ls output)
  // In a real app we'd use a safer parser or specific component structure.
  // Here we'll do a simple check: if content is string and has <span>, render as HTML
  // Otherwise render as text.
  if (typeof content === 'string' && content.includes('<span')) {
      return (
          <div 
            className={`mb-2 leading-relaxed whitespace-pre-wrap break-words ${textColor}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
      );
  }

  return (
    <div className={`mb-2 leading-relaxed whitespace-pre-wrap break-words ${textColor}`}>
      {content}
    </div>
  );
};
