import React from 'react';
import { TerminalMessage, MessageType } from '../types';
import { PROMPT_HOST, PROMPT_USER, PROMPT_SYMBOL } from '../constants';

interface TerminalOutputProps {
  message: TerminalMessage;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ message }) => {
  const { type, content } = message;

  if (type === MessageType.COMMAND) {
    return (
      <div className="flex flex-row items-start mb-1 group">
        <span className="text-green-400 mr-1 font-bold">{PROMPT_USER}@{PROMPT_HOST}</span>
        <span className="text-slate-400 mr-2">:~{PROMPT_SYMBOL}</span>
        <span className="text-slate-100 whitespace-pre-wrap break-words flex-1">{content}</span>
      </div>
    );
  }

  let textColor = 'text-slate-300';
  if (type === MessageType.ERROR) textColor = 'text-red-400';
  if (type === MessageType.SYSTEM) textColor = 'text-blue-300';

  return (
    <div className={`mb-2 leading-relaxed whitespace-pre-wrap break-words ${textColor}`}>
      {content}
    </div>
  );
};