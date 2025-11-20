import { CommandDefinition, MessageType } from '../../types';
import { font } from './font';

const generateBanner = (text: string): string => {
  const height = 5;
  const defaultChar = ['?????', '?   ?', '? ? ?', '?   ?', '?????'];
  
  const lines = text.split('\n');
  let result = '';

  for (const line of lines) {
    const currentRows = Array(height).fill('');
    for (const char of line) {
      const key = char.toLowerCase();
      const charMatrix = font[key] || defaultChar;
      
      for (let i = 0; i < height; i++) {
        currentRows[i] += (charMatrix[i] || '     ') + '  ';
      }
    }
    result += currentRows.join('\n') + '\n';
  }

  return result.trimEnd();
};

export const banner: CommandDefinition = {
  description: 'Displays text as ASCII art',
  handler: (args) => {
    if (args.length === 0) {
      return {
        output: 'Usage: banner <text>',
        type: MessageType.ERROR,
      };
    }
    const text = args.join(' ');
    return {
      output: generateBanner(text),
    };
  },
};