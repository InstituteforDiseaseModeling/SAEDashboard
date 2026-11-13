import {useSelector} from 'react-redux';
import {IndicatorConfigMap} from '../components/constTs.tsx';

interface AppDefaults {
  title?: string;
  disableAdmin2?: boolean;
  defaultYear?: number;
  defaultRegion?: string;
  defaultCountry?: string;
  defaultIndicator?: string;
  defaultComparisonIndicator?: string;
  indicatorGroups?: string[];
}

interface RootState {
  config: {
    app: AppDefaults | null;
    indicators: IndicatorConfigMap | null;
    loaded: boolean;
  };
}

/**
 * Read the app-level configuration from the store.
 * @return {AppDefaults} App configuration, or an empty object.
 */
export function useAppConfig(): AppDefaults {
  return useSelector((state: RootState) => state.config.app) || {};
}

/**
 * Read the configuration of all indicators from the store.
 * @return {IndicatorConfigMap} Indicator configuration by id.
 */
export function useIndicatorsConfig(): IndicatorConfigMap {
  return useSelector((state: RootState) => state.config.indicators) || {};
}

/**
 * Read the configuration of one indicator from the store.
 * @param {string} indicator
 * @return {IndicatorMeta|undefined} Indicator configuration, if any.
 */
export function useIndicatorConfig(indicator: string | null | undefined):
  IndicatorMeta | undefined {
  return useSelector((state: RootState) => indicator ?
    state.config.indicators?.[indicator] : undefined);
}

/**
 * Whether the configuration has been loaded.
 * @return {boolean} True once config is loaded.
 */
export function useConfigLoaded(): boolean {
  return useSelector((state: RootState) => state.config.loaded);
}
