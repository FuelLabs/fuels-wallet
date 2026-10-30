import { Text } from '@fuel-ui/react';
import type { ReactNode } from 'react';

/**
 * Escapes special regex characters in a string to make it safe for use in RegExp constructor
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights matching text within a string by wrapping matches in styled Text components
 * @param text - The text to search within
 * @param query - The search query to highlight (case-insensitive)
 * @returns ReactNode with highlighted matches or the original text if no query
 */
export function highlightText(text: string, query: string): ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        return isMatch ? (
          <Text
            as="span"
            // biome-ignore lint/suspicious/noArrayIndexKey: Static list based on search query, order won't change
            key={index}
            css={{
              backgroundColor: '$intentsWarning3',
              color: '$intentsWarning11',
              fontWeight: '$semibold',
            }}
          >
            {part}
          </Text>
        ) : (
          part
        );
      })}
    </>
  );
}
