
import React from 'react';
import { FileSystemType } from './services/fileSystem/VirtualFileSystem';

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
  cwd?: string; // Snapshot of current directory when message was created
}

export interface CommandResult {
  output: React.ReactNode;
  type?: MessageType;
  nextAction?: (input: string) => Promise<CommandResult> | CommandResult;
}

export interface CommandContext {
  registry: CommandRegistry;
  fileSystem: FileSystemType;
}

export type CommandHandler = (args: string[], context: CommandContext) => Promise<CommandResult> | CommandResult;

export interface CommandDefinition {
  description: string;
  handler: CommandHandler;
}

export interface CommandRegistry {
  [key: string]: CommandDefinition;
}
