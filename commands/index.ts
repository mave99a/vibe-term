import { CommandRegistry } from '../types';
import { echo } from './echo';
import { date } from './date';
import { whoami } from './whoami';
import { clear } from './clear';
import { help } from './help';
import { banner } from './banner';

export const registry: CommandRegistry = {
  echo,
  date,
  whoami,
  clear,
  help,
  banner,
};