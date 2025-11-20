
import { MessageType, CommandResult } from '../types';
import { registry } from '../commands/index';
import { fileSystem } from './fileSystem/VirtualFileSystem';

export const processCommand = async (input: string): Promise<CommandResult> => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const parts = trimmed.split(/\s+/);
  let args = parts.slice(1);
  const cmdName = parts[0];
  
  // Check for redirection '>'
  let redirectPath: string | null = null;
  const redirectIndex = args.indexOf('>');
  
  if (redirectIndex !== -1) {
      if (redirectIndex < args.length - 1) {
          redirectPath = args[redirectIndex + 1];
          // Remove redirection part from args passed to command
          args = args.slice(0, redirectIndex);
      } else {
          return {
              output: 'Syntax error: expected filename after >',
              type: MessageType.ERROR
          };
      }
  }

  const command = registry[cmdName.toLowerCase()];

  if (!command) {
    return {
      output: `Command not found: ${cmdName}. Type 'help' for valid commands.`,
      type: MessageType.ERROR,
    };
  }

  try {
    const result = await command.handler(args, { registry, fileSystem });
    
    if (redirectPath) {
        // If command produced output, write it to file instead of returning it
        if (result.output && typeof result.output === 'string') {
            try {
                fileSystem.writeFile(redirectPath, result.output);
                return {
                    output: '', // Output consumed by redirection
                    type: MessageType.SYSTEM 
                };
            } catch (fsError) {
                return {
                    output: `Failed to write to ${redirectPath}: ${(fsError as Error).message}`,
                    type: MessageType.ERROR
                };
            }
        } else if (result.output) {
             // If we can't redirect (e.g. react node output), we error
            return {
                output: 'Error: Cannot redirect non-text output',
                type: MessageType.ERROR
            };
        }
    }

    return result;

  } catch (error) {
    return {
      output: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
      type: MessageType.ERROR,
    };
  }
};
