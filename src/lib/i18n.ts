import fr from '@/i18n/fr_fr.json';

type NestedKeys<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${string & K}.${NestedKeys<T[K]>}` : K }[keyof T]
  : never;

export type TranslationKey = NestedKeys<typeof fr>;

/**
 * A simple translation utility that currently only supports French.
 * It takes a dot-notated key and returns the corresponding value from fr_fr.json.
 */
export function t(key: TranslationKey): string {
  const keys = key.split('.');
  let result: any = fr;

  for (const k of keys) {
    if (result[k] === undefined) {
      return key; // Fallback to key if not found
    }
    result = result[k];
  }

  return result as string;
}

/**
 * Client-side hook for translations (if needed for reactivity, 
 * although here it's static for now).
 */
export const useTranslation = () => {
  return { t };
};
