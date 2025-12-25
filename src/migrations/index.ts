import * as migration_20251123_152206_init from './20251123_152206_init';
import * as migration_20251213_142449 from './20251213_142449';
import * as migration_20251225_034259 from './20251225_034259';

export const migrations = [
  {
    up: migration_20251123_152206_init.up,
    down: migration_20251123_152206_init.down,
    name: '20251123_152206_init',
  },
  {
    up: migration_20251213_142449.up,
    down: migration_20251213_142449.down,
    name: '20251213_142449',
  },
  {
    up: migration_20251225_034259.up,
    down: migration_20251225_034259.down,
    name: '20251225_034259'
  },
];
