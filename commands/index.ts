
import { CommandRegistry } from '../types';
import { echo } from './echo';
import { date } from './date';
import { whoami } from './whoami';
import { clear } from './clear';
import { help } from './help';
import { banner } from './banner';
import { motd } from './motd';
import { ls } from './ls';
import { cd } from './cd';
import { cat } from './cat';
import { md } from './md';
import { rd } from './rd';
import { pwd } from './pwd';
import { tree } from './tree';

// Note: In a full build environment (Vite/Webpack), we could use import.meta.glob
// to automatically scan and register commands. In this browser-native environment,
// we must manually register them to prevent runtime errors.
export const registry: CommandRegistry = {
  echo,
  date,
  whoami,
  clear,
  help,
  banner,
  motd,
  ls,
  cd,
  cat,
  md,
  rd,
  pwd,
  tree,
};
