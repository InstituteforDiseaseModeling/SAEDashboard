import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';

/**
 * Keeps the main and comparison map filter bars the same height.
 * Each bar reports the natural height of its filters; every bar reads back the tallest.
 */
const FilterBarHeightContext = createContext(null);

export const FilterBarHeightProvider = ({children}) => {
  const [heights, setHeights] = useState({});

  const report = useCallback((id, height) => {
    setHeights((prev) => (prev[id] === height ? prev : {...prev, [id]: height}));
  }, []);

  const maxHeight = useMemo(() => Math.max(0, ...Object.values(heights)), [heights]);
  const value = useMemo(() => ({report, maxHeight}), [report, maxHeight]);

  return (
    <FilterBarHeightContext.Provider value={value}>
      {children}
    </FilterBarHeightContext.Provider>
  );
};

FilterBarHeightProvider.propTypes = {
  children: PropTypes.node,
};

/**
 * Report the height of `ref`'s element under `id` and return the tallest reported height.
 * A hidden element reports 0, so it does not affect the visible bar.
 * Returns 0 when used outside a FilterBarHeightProvider.
 * @param {string} id - unique key for this bar
 * @param {React.RefObject<HTMLElement>} ref - element whose height is measured
 * @return {number} tallest height across bars, in px
 */
export const useSyncedFilterBarHeight = (id, ref) => {
  const ctx = useContext(FilterBarHeightContext);
  const report = ctx?.report;

  useEffect(() => {
    const el = ref.current;
    if (!report || !el) return undefined;
    const observer = new ResizeObserver(() => report(id, el.offsetHeight));
    observer.observe(el);
    return () => {
      observer.disconnect();
      report(id, 0);
    };
  }, [report, id]);

  return ctx ? ctx.maxHeight : 0;
};
