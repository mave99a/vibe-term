
import { CommandDefinition, MessageType } from '../../types';

export const cd: CommandDefinition = {
  description: 'Change the shell working directory',
  handler: (args, { fileSystem }) => {
    const path = args[0] || '/users/guest'; // Default to home if no arg
    
    try {
      fileSystem.changeDirectory(path);
      return { output: '' };
    } catch (e) {
      return { output: (e as Error).message, type: MessageType.ERROR };
    }
  },
};
