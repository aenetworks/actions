import * as fs from 'fs';
import * as path from 'path';

export const shouldUseYarn = () => {
  return fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
};

export const isLernaRepo = () => {
  return fs.existsSync(path.resolve(process.cwd(), 'lerna.json'));
};
