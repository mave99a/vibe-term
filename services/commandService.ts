
import { MessageType, CommandResult } from '../types';
import { registry } from '../commands/index';
import { fileSystem } from './fileSystem/VirtualFileSystem';

export const processCommand = async (input: string): Promise<CommandResult> => {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  const parts = trimmed.split(/\s+/);
  let args = parts.slice(1);
  const cmdName = parts[0];
  
  // Check for redirection '>>' or '>'
  let redirectPath: string | null = null;
  let isAppend = false;
  
  // We must check for >> before > because > is a substring of >>
  let redirectIndex = args.indexOf('>>');
  if (redirectIndex !== -1) {
      isAppend = true;
  } else {
      redirectIndex = args.indexOf('>');
  }
  
  if (redirectIndex !== -1) {
      if (redirectIndex < args.length - 1) {
          redirectPath = args[redirectIndex + 1];
          // Remove redirection part from args passed to command
          args = args.slice(0, redirectIndex);
      } else {
          return {
              output: `Syntax error: expected filename after ${isAppend ? '>>' : '>'}`,
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
                // Ensure text ends with newline for better file concatenation behavior
                let contentToWrite = result.output;
                if (!contentToWrite.endsWith('\n')) {
                    contentToWrite += '\n';
                }

                if (isAppend) {
                    fileSystem.appendFile(redirectPath, contentToWrite);
                } else {
                    fileSystem.writeFile(redirectPath, contentToWrite);
                }
                
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
