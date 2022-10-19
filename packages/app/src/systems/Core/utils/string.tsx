export function getWordsFromValue(value?: string | string[]) {
  if (!Array.isArray(value)) {
    return value?.split(' ');
  }
  return value;
}

export function getPhraseFromValue(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.join(' ');
  }
  return value;
}

export const uniqueId = () => Math.random().toString(16).slice(2);
