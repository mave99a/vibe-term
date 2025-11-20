import React from 'react';

export enum MessageType {
  COMMAND = 'COMMAND',
  OUTPUT = 'OUTPUT',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM'
}

export interface TerminalMessage {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  timestamp: number;
}

export interface CommandResult {
  output: React.ReactNode;
  type?: MessageType;
}

export interface CommandContext {
  registry: CommandRegistry;
}

export type CommandHandler = (args: string[], context: CommandContext) => Promise<CommandResult> | CommandResult;

export interface CommandDefinition {
  description: string;
  handler: CommandHandler;
}

export interface CommandRegistry {
  [key: string]: CommandDefinition;
}