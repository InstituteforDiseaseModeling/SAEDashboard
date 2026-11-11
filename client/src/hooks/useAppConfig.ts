import {useSelector} from 'react-redux';
import {IndicatorMeta, IndicatorConfigMap} from '../components/constTs.tsx';

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

export function useAppConfig(): AppDefaults {
  return useSelector((state: RootState) => state.config.app) || {};
}

export function useIndicatorsConfig(): IndicatorConfigMap {
  return useSelector((state: RootState) => state.config.indicators) || {};
}

export function useIndicatorConfig(indicator: string | null | undefined):
  IndicatorMeta | undefined {
  return useSelector((state: RootState) => indicator ?
    state.config.indicators?.[indicator] : undefined);
}

export function useConfigLoaded(): boolean {
  return useSelector((state: RootState) => state.config.loaded);
}
