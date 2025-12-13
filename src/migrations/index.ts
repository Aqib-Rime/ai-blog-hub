import * as migration_20251123_152206_init from './20251123_152206_init';
import * as migration_20251213_142449 from './20251213_142449';

export const migrations = [
  {
    up: migration_20251123_152206_init.up,
    down: migration_20251123_152206_init.down,
    name: '20251123_152206_init',
  },
  {
    up: migration_20251213_142449.up,
    down: migration_20251213_142449.down,
    name: '20251213_142449'
  },
];
