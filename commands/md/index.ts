
import { CommandDefinition, MessageType } from '../../types';

export const md: CommandDefinition = {
  description: 'Make directory',
  handler: (args, { fileSystem }) => {
    if (args.length === 0) {
      return { output: 'Usage: md <directory_name>', type: MessageType.ERROR };
    }

    try {
      fileSystem.makeDirectory(args[0]);
      return { output: `Directory created: ${args[0]}`, type: MessageType.SYSTEM };
    } catch (e) {
      return { output: (e as Error).message, type: MessageType.ERROR };
    }
  },
};
