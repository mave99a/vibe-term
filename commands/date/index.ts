import { CommandDefinition } from '../../types';

export const date: CommandDefinition = {
  description: 'Displays the current date and time',
  handler: () => ({
    output: new Date().toString(),
  }),
};