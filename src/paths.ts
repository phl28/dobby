import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// This file compiles to dist/paths.js, so `here` is the dist/ dir.
const here = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(here, '..');
export const BIN_PATH = path.join(REPO_ROOT, 'bin', 'dobby.js');
