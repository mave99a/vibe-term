import { CommandDefinition, MessageType } from '../../types';

export const clear: CommandDefinition = {
  description: 'Clears the terminal screen',
  handler: () => ({ output: '', type: MessageType.SYSTEM }),
};