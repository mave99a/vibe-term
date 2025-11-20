
import { CommandDefinition, MessageType } from '../../types';

export const cat: CommandDefinition = {
  description: 'Concatenate and print files',
  handler: (args, { fileSystem }) => {
    if (args.length === 0) {
      return { output: 'Usage: cat <filename>', type: MessageType.ERROR };
    }
    
    try {
      const content = fileSystem.readFile(args[0]);
      return { output: content };
    } catch (e) {
      return { output: (e as Error).message, type: MessageType.ERROR };
    }
  },
};
