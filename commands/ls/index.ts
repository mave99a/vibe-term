
import { CommandDefinition, MessageType } from '../../types';

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
};

export const ls: CommandDefinition = {
  description: 'List directory contents. Use -l for long listing.',
  handler: (args, { fileSystem }) => {
    const flags = args.filter(arg => arg.startsWith('-'));
    const paths = args.filter(arg => !arg.startsWith('-'));
    
    const targetPath = paths[0]; 
    const isLong = flags.includes('-l');

    try {
      const nodes = fileSystem.getDirectoryChildren(targetPath);
      
      if (nodes.length === 0) {
        return { output: '(empty)' };
      }

      if (isLong) {
        const lines = nodes.map(node => {
            const perms = node.permissions;
            const links = 1;
            const owner = node.owner;
            const group = node.group;
            const size = node.size.toString().padStart(5);
            const dateStr = formatDate(node.modifiedAt);
            const name = node.type === 'directory' 
                ? `<span class="text-blue-400 font-bold">${node.name}/</span>` 
                : node.name;
            
            return `${perms} ${links} ${owner.padEnd(6)} ${group.padEnd(6)} ${size} ${dateStr} ${name}`;
        });
        return { output: lines.join('\n') };
      }

      // Standard view
      const names = nodes.map(node => {
          if (node.type === 'directory') {
              return `<span class="text-blue-400 font-bold">${node.name}/</span>`;
          }
          return node.name;
      });
      return { output: names.join('  ') };

    } catch (e) {
      return { output: (e as Error).message, type: MessageType.ERROR };
    }
  },
};
