import * as migration_20251123_152206_init from './20251123_152206_init';

export const migrations = [
  {
    up: migration_20251123_152206_init.up,
    down: migration_20251123_152206_init.down,
    name: '20251123_152206_init'
  },
];
