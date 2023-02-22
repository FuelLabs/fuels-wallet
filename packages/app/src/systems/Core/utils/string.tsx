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
  return value || '';
}

export const uniqueId = (size: number = 13) =>
  Math.random().toString(16).slice(2).slice(0, size);

export const truncate = (str: string, length: number = 30) => {
  if (str.length > length) {
    return `${str.substring(0, length)}...`;
  }
  return str;
};
