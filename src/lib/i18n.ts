import fr from '@/i18n/fr_fr.json';

/**
 * Recursive type to generate dot-notated translation keys from the JSON structure.
 * Improved to handle symbol keys and strictly return string template literals.
 */
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeys<T[K]>}`
        : `${K}`;
    }[keyof T & (string | number)]
  : string;

export type TranslationKey = NestedKeys<typeof fr>;

/**
 * A simple translation utility that currently only supports French.
 * It takes a dot-notated key and returns the corresponding value from fr_fr.json.
 */
export function t(key: string): string {
  const keys = key.split('.');
  let result: any = fr;

  for (const k of keys) {
    if (result === undefined || result[k] === undefined) {
      return key; // Fallback to key if not found
    }
    result = result[k];
  }

  return typeof result === 'string' ? result : key;
}

/**
 * Client-side hook for translations.
 */
export const useTranslation = () => {
  return { t };
};
