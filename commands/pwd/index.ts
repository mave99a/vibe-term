import { CommandDefinition } from '../../types';

export const pwd: CommandDefinition = {
  description: 'Print name of current/working directory',
  handler: (_, { fileSystem }) => {
    return {
      output: fileSystem.getCwd(),
    };
  },
};
