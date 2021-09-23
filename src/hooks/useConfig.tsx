import Config from '../types/Config';
import { useSelector } from 'react-redux';
import { RootState } from '../state';

export const useConfig = (
  compare?: (prev: Config, next: Config) => boolean,
): Config =>
  useSelector((state: RootState) => {
    const { config } = state;
    return {
      ...config,
      locales: config.locales || [],
      routes: config.routes || [],
    };
  }, compare);
