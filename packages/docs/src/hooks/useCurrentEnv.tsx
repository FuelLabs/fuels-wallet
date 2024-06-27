import { CURRENT_ENV, Environment } from '../constants';

export function useCurrentEnv(): Environment {
  return Environment[CURRENT_ENV];
}
