import * as migration_20260923_194102_initial from './20260923_194102_initial';

export const migrations = [
  {
    up: migration_20260923_194102_initial.up,
    down: migration_20260923_194102_initial.down,
    name: '20260923_194102_initial'
  },
];
