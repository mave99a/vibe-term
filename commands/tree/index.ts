
import { CommandDefinition, MessageType } from '../../types';
import { FileSystemNode } from '../../services/fileSystem/types';

export const tree: CommandDefinition = {
  description: 'List contents of directories in a tree-like format',
  handler: (args, { fileSystem }) => {
    const startPath = args[0] || '.';
    let result = '';
    let dirCount = 0;
    let fileCount = 0;

    // Display the root of the tree
    result += `<span class="text-blue-400 font-bold">${startPath}</span>\n`;

    const traverse = (currentPath: string, prefix: string) => {
        let nodes: FileSystemNode[];
        try {
            nodes = fileSystem.getDirectoryChildren(currentPath);
        } catch (e) {
            // Stop recursion on access error or if not a directory
            return;
        }

        // Sort nodes alphabetically (case-insensitive)
        nodes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        nodes.forEach((node, index) => {
            const isLast = index === nodes.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            
            const displayName = node.type === 'directory' 
                ? `<span class="text-blue-400 font-bold">${node.name}</span>` 
                : node.name;
            
            result += `${prefix}${connector}${displayName}\n`;

            if (node.type === 'directory') {
                dirCount++;
                const childPrefix = isLast ? '    ' : '│   ';
                
                // Build path for the next recursive step
                // Handle absolute/relative path construction carefully
                let nextPath = '';
                if (currentPath === '/') {
                    nextPath = '/' + node.name;
                } else if (currentPath === '.') {
                    nextPath = node.name;
                } else if (currentPath.endsWith('/')) {
                    nextPath = currentPath + node.name;
                } else {
                    nextPath = currentPath + '/' + node.name;
                }

                traverse(nextPath, prefix + childPrefix);
            } else {
                fileCount++;
            }
        });
    };

    try {
        // Validate start path exists
        fileSystem.getDirectoryChildren(startPath);
        
        traverse(startPath, '');
        result += `\n${dirCount} directories, ${fileCount} files`;
        
        return { output: result };
    } catch (e) {
        return { output: (e as Error).message, type: MessageType.ERROR };
    }
  }
};
