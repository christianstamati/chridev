import * as migration_20260923_194102_initial from './20260923_194102_initial';
import * as migration_20260925_122539_localize from './20260925_122539_localize';
import * as migration_20260925_130000_italian from './20260925_130000_italian';
import * as migration_20260925_150000_job_points from './20260925_150000_job_points';

export const migrations = [
  {
    up: migration_20260923_194102_initial.up,
    down: migration_20260923_194102_initial.down,
    name: '20260923_194102_initial',
  },
  {
    up: migration_20260925_122539_localize.up,
    down: migration_20260925_122539_localize.down,
    name: '20260925_122539_localize',
  },
  {
    up: migration_20260925_130000_italian.up,
    down: migration_20260925_130000_italian.down,
    name: '20260925_130000_italian',
  },
  {
    up: migration_20260925_150000_job_points.up,
    down: migration_20260925_150000_job_points.down,
    name: '20260925_150000_job_points',
  },
];
