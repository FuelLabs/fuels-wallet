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

export type GetUniqueStringProps = {
  desired?: string;
  allValues: Array<string | undefined>;
};

// get unique string adding suffix to desired value if it already exists in allValues
export const getUniqueString = ({
  desired,
  allValues,
}: GetUniqueStringProps): string | undefined => {
  if (!desired) return desired;

  function nextNotRepeated(opt: { value: string; tries?: number }) {
    const { value, tries = 1 } = opt;

    const repeatedAssets = allValues.filter(
      (a) => a && a.trim() === value.trim()
    );

    let notRepeatedField: string;
    if (repeatedAssets[0]) {
      const nextToTry = `${value?.replace(/\(\d+\)?$/, '')} (${tries})`;

      notRepeatedField = nextNotRepeated({
        value: nextToTry,
        tries: tries + 1,
      });
    } else {
      notRepeatedField = value;
    }
    return notRepeatedField;
  }

  return nextNotRepeated({ value: desired });
};
