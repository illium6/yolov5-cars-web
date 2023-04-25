import { fileURLToPath } from 'url';
import * as path from 'path';

export const rootPath = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
