
import { CommandDefinition, MessageType, CommandResult } from '../../types';
import { STORAGE_KEY_MOTD, INITIAL_WELCOME_MESSAGE } from '../../constants';

const saveMotd = (text: string): CommandResult => {
  try {
    localStorage.setItem(STORAGE_KEY_MOTD, text);
    return {
      output: 'Message of the Day updated successfully.',
      type: MessageType.SYSTEM,
    };
  } catch (e) {
    return {
      output: 'Failed to save Message of the Day.',
      type: MessageType.ERROR,
    };
  }
};

export const motd: CommandDefinition = {
  description: 'Display or edit the Message of the Day. Use -e to edit.',
  handler: (args) => {
    if (args[0] === '-e') {
      // If text is provided as arguments: motd -e New Message
      if (args.length > 1) {
        const newMotd = args.slice(1).join(' ');
        return saveMotd(newMotd);
      }

      // Interactive mode: motd -e
      return {
        output: 'Entering edit mode. Please type the new MOTD below:',
        type: MessageType.SYSTEM,
        nextAction: (input: string) => {
          return saveMotd(input);
        },
      };
    }

    // Display mode
    const currentMotd = localStorage.getItem(STORAGE_KEY_MOTD) || INITIAL_WELCOME_MESSAGE;
    return {
      output: currentMotd,
      type: MessageType.SYSTEM,
    };
  },
};
