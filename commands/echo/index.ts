import { CommandDefinition } from '../../types';

export const echo: CommandDefinition = {
  description: 'Prints the provided arguments to the output',
  handler: (args) => {
    if (args.length === 0) return { output: '' };
    return { output: args.join(' ') };
  },
};