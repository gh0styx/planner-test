import axios from 'axios';
import type { Holiday } from '../types';

const cache = new Map<string, Holiday[]>();

export async function fetchHolidays(year: number, countryCode: string): Promise<Holiday[]> {
  const key = `${year}-${countryCode}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const { data } = await axios.get<Holiday[]>(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  );
  cache.set(key, data);
  return data;
}
