import { CommandDefinition } from '../../types';

export const whoami: CommandDefinition = {
  description: 'Displays current user',
  handler: () => ({
    output: 'guest',
  }),
};