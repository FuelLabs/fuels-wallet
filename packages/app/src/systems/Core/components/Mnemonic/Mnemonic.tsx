import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, Grid, Icon } from '@fuel-ui/react';
import React, { useEffect, useState } from 'react';

import { MnemonicInput } from './MnemonicInput';

const WORDS = import.meta.env.VITE_MNEMONIC_WORDS;
const BLANK_ARR = Array.from({ length: WORDS }).map(() => '');

function fillArray(arr: string[], item: string[]) {
  return arr.map((_, idx) => item[idx] || '');
}

function checkMoreThanOneWord(word: string) {
  if (word.split(' ').length > 1) {
    const first = word.split(' ')[0];
    const half = first.slice(0, first.length / 2);
    return `${half}${half}` === first ? half : first;
  }
  return word;
}

export type MnemonicProps = {
  type: 'read' | 'write';
  value?: string[];
  onFilled?: (val: string[]) => void;
};

export function Mnemonic({
  value: initialValue,
  type,
  onFilled,
}: MnemonicProps) {
  const [value, setValue] = useState<string[]>(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      return fillArray(BLANK_ARR, initialValue);
    }
    return BLANK_ARR;
  });

  async function handleCopy() {
    await navigator.clipboard.writeText(value.join(' '));
  }

  function handlePastInput(ev: React.ClipboardEvent<HTMLInputElement>) {
    const text = ev.clipboardData.getData('text/plain');
    setValue((old) => fillArray(old, text.split(' ')));
  }

  async function handlePast() {
    const text = await navigator.clipboard.readText();
    setValue((old) => fillArray(old, text.split(' ')));
  }

  function handleChange(idx: number) {
    return (val: string) => {
      setValue((oldState) =>
        oldState
          .map((word, i) => (i === idx ? val : word))
          .map(checkMoreThanOneWord)
      );
    };
  }

  useEffect(() => {
    if (value.every((word) => Boolean(word.length))) {
      onFilled?.(value);
    }
  }, [value]);

  return (
    <Box css={styles.root}>
      {type === 'read' ? (
        <Grid css={styles.words}>
          {value.map((word, idx) => (
            <Box as="span" key={idx} css={styles.word} data-idx={idx + 1}>
              {word}
            </Box>
          ))}
        </Grid>
      ) : (
        <Grid css={styles.words}>
          {BLANK_ARR.map((_, idx) => {
            return (
              <Grid key={idx} css={styles.inputWrapper}>
                <span>{idx + 1}</span>
                <div>
                  <MnemonicInput
                    value={value[idx]}
                    onChange={handleChange(idx)}
                    onPaste={handlePastInput}
                  />
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Flex as="footer" align="center" gap="$4" css={styles.footer}>
        {type === 'read' ? (
          <Button
            aria-label="Copy button"
            size="sm"
            variant="ghost"
            color="gray"
            leftIcon={<Icon icon="Copy" color="gray8" />}
            onPress={handleCopy}
          >
            Copy
          </Button>
        ) : (
          <Button
            aria-label="Paste button"
            size="sm"
            variant="ghost"
            color="gray"
            leftIcon={<Icon icon="ClipboardText" color="gray8" />}
            onPress={handlePast}
          >
            Paste
          </Button>
        )}
      </Flex>
    </Box>
  );
}

const styles = {
  root: cssObj({
    background: '$gray1',
    border: '1px dashed $gray3',
    borderRadius: '$lg',
  }),
  words: cssObj({
    px: '$3',
    py: '$3',
    mb: '$3',
    borderBottom: '1px dashed $gray3',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gridColumnGap: '$4',
    gridRowGap: '$2',
  }),
  word: cssObj({
    position: 'relative',
    fontFamily: '"Source Code Pro", monospace',
    fontSize: '$sm',

    '&::before': {
      w: '14px',
      textAlign: 'right',
      display: 'inline-block',
      content: 'attr(data-idx)',
      color: '$gray8',
      mr: '$2',
    },
  }),
  inputWrapper: cssObj({
    boxSizing: 'border-box',
    gridTemplateColumns: '14px 1fr',
    gridColumnGap: '8px',

    '&, input': {
      fontFamily: '"Source Code Pro", monospace',
      fontSize: '$sm',
    },
    span: {
      color: '$gray8',
      textAlign: 'right',
    },
    input: {
      padding: 0,
      width: '100%',
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      borderBottom: '1px dashed $gray10',
      color: '$gray11',

      '&:focus': {
        outline: 'none',
        borderColor: '$gray8',
      },
    },
  }),
  footer: cssObj({
    px: '$3',
    pb: '$3',
    boxSizing: 'border-box',

    button: {
      width: '100%',
    },
  }),
};
