import { MessageType, CommandResult } from '../types';
import { registry } from '../commands/index';

export const processCommand = async (input: string): Promise<CommandResult> => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const [cmdName, ...args] = trimmed.split(/\s+/);
  
  const command = registry[cmdName.toLowerCase()];

  if (!command) {
    return {
      output: `Command not found: ${cmdName}. Type 'help' for valid commands.`,
      type: MessageType.ERROR,
    };
  }

  try {
    return await command.handler(args, { registry });
  } catch (error) {
    return {
      output: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: MessageType.ERROR,
    };
  }
};