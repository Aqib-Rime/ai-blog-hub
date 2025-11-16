import * as migration_20251116_015111_pgvector_enable from './20251116_015111_pgvector_enable';

export const migrations = [
  {
    up: migration_20251116_015111_pgvector_enable.up,
    down: migration_20251116_015111_pgvector_enable.down,
    name: '20251116_015111_pgvector_enable'
  },
];
