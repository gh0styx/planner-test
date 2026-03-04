import { useState, useEffect } from 'react';
import type { Holiday } from '../types';
import { fetchHolidays } from '../api/holidaysApi';

export function useHolidays(year: number, month: number) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [countryCode, setCountryCode] = useState('US');

  useEffect(() => {
    let cancelled = false;

    const yearsToFetch = new Set<number>();
    yearsToFetch.add(year);

    const firstDayMonth = new Date(year, month, 1);
    const startDow = firstDayMonth.getDay();
    if (startDow > 0 && month === 0) yearsToFetch.add(year - 1);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalShown = startDow + daysInMonth;
    if (totalShown < 42 && month === 11) yearsToFetch.add(year + 1);

    Promise.all([...yearsToFetch].map((y) => fetchHolidays(y, countryCode)))
      .then((results) => {
        if (!cancelled) setHolidays(results.flat());
      })
      .catch(() => {
        if (!cancelled) setHolidays([]);
      });

    return () => {
      cancelled = true;
    };
  }, [year, month, countryCode]);

  return { holidays, countryCode, setCountryCode };
}
