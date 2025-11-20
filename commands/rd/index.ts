
import { CommandDefinition, MessageType } from '../../types';

export const rd: CommandDefinition = {
  description: 'Remove directory',
  handler: (args, { fileSystem }) => {
    if (args.length === 0) {
      return { output: 'Usage: rd <directory_name>', type: MessageType.ERROR };
    }

    try {
      fileSystem.removeDirectory(args[0]);
      return { output: `Directory removed: ${args[0]}`, type: MessageType.SYSTEM };
    } catch (e) {
      return { output: (e as Error).message, type: MessageType.ERROR };
    }
  },
};
