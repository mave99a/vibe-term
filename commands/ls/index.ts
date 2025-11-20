
import { CommandDefinition, MessageType } from '../../types';

export const ls: CommandDefinition = {
  description: 'List directory contents',
  handler: (args, { fileSystem }) => {
    const path = args[0];
    const items = fileSystem.listDirectory(path);
    
    if (items.length === 0) {
      return { output: '(empty)' };
    }

    // Colorize directories (ending in /)
    const formattedItems = items.map(item => {
        if (item.endsWith('/')) {
            return `<span class="text-blue-400 font-bold">${item}</span>`;
        }
        return item;
    });

    return {
      // Return ReactNode technically, but we are using simple strings usually. 
      // Let's return a joined string, rendering will happen in TerminalOutput. 
      // Wait, types.ts says content is ReactNode. We can return a string or JSX.
      // For simplicity in standard shell output, we join by spaces.
      output: formattedItems.join('  '), 
    };
  },
};
