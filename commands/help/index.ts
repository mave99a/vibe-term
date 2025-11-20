import { CommandDefinition, MessageType } from '../../types';

export const help: CommandDefinition = {
  description: 'Lists all available commands',
  handler: (args, { registry }) => {
    const helpText = Object.entries(registry)
      .map(([name, cmd]) => `  ${name.padEnd(12)} - ${cmd.description}`)
      .join('\n');
    
    return {
      output: `Available commands:\n${helpText}`,
      type: MessageType.SYSTEM,
    };
  },
};