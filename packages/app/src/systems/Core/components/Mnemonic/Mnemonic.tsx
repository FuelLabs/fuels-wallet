import { cssObj } from '@fuel-ui/css';
import { Box, Button, Flex, Grid, Icon } from '@fuel-ui/react';
import { MNEMONIC_SIZES } from 'fuels';
import React, { useEffect, useState } from 'react';

import { MnemonicInput } from './MnemonicInput';

const WORDS = import.meta.env.VITE_MNEMONIC_WORDS;

function fillArray(item: string[], format: number) {
  return Array.from({ length: format }).map((_, idx) => item[idx] || '');
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
  format?: number;
  enableChangeFormat?: boolean;
};

export function Mnemonic({
  value: initialValue = [],
  type,
  onFilled,
  format: initialFormat,
  enableChangeFormat,
}: MnemonicProps) {
  const [format, setFormat] = useState(() => {
    if (initialFormat && MNEMONIC_SIZES.includes(initialFormat)) {
      return initialFormat;
    }

    if (initialValue.length && MNEMONIC_SIZES.includes(initialValue.length)) {
      return initialValue.length;
    }

    return WORDS;
  });
  const [value, setValue] = useState<string[]>(() =>
    fillArray(initialValue, format)
  );

  function handlePastInput(ev: React.ClipboardEvent<HTMLInputElement>) {
    const text = ev.clipboardData.getData('text/plain');
    setValue(fillArray(text.split(' '), format));
  }

  async function handlePaste() {
    const text = await navigator.clipboard.readText();
    setValue(fillArray(text.split(' '), format));
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

  function handleChangeFormat(format: number) {
    setFormat(format);
    const newValue = fillArray(value, format);

    setValue(newValue);
    onFilled?.(newValue);
  }

  function handleCopy() {
    const val = type === 'read' ? initialValue : value;
    return navigator.clipboard.writeText(val.join(' '));
  }

  useEffect(() => {
    if (value.every((word) => Boolean(word.length))) {
      onFilled?.(value);
    }
  }, [value]);

  return (
    <Box css={styles.root}>
      {enableChangeFormat && (
        <Flex css={styles.formatWrapper}>
          <select
            aria-label="Select format"
            value={format}
            onChange={(e) => handleChangeFormat(Number(e.target.value))}
          >
            {MNEMONIC_SIZES.map((size) => (
              <option
                key={size}
                value={size}
                aria-label={`${size} words`}
              >{`I have a ${size} words seed phrase`}</option>
            ))}
          </select>
        </Flex>
      )}
      {type === 'read' ? (
        <Grid css={styles.words}>
          {initialValue?.map((word, idx) => (
            <Box as="span" key={idx} css={styles.word} data-idx={idx + 1}>
              {word}
            </Box>
          ))}
        </Grid>
      ) : (
        <Grid css={styles.words}>
          {value.map((_, idx) => {
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
        {type === 'write' ? (
          <Button
            aria-label="Paste button"
            size="sm"
            variant="ghost"
            color="gray"
            leftIcon={<Icon icon="ClipboardText" color="gray8" />}
            onPress={handlePaste}
          >
            Paste
          </Button>
        ) : (
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
  formatWrapper: cssObj({
    p: '$3',
    borderBottom: '1px dashed $gray3',
    gap: '$1',
    alignItems: 'center',
    justifyContent: 'flex-end',

    // TODO: should replace with a <Select> component in fuel-ui
    select: {
      backgroundColor: 'transparent',
      color: '$gray12',
      border: 'none',
      paddingRight: '$1',
      fontSize: '$sm',

      '&:focus-visible': {
        outline: 'none',
      },
    },
  }),
  words: cssObj({
    px: '$3',
    py: '$3',
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
