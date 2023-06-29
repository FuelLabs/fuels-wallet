import { cssObj } from '@fuel-ui/css';
import { Box, Button, Grid, Icon, toast } from '@fuel-ui/react';
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
  onChange?: (val: string[]) => void;
  format?: number;
  enableChangeFormat?: boolean;
};

export function Mnemonic({
  value: initialValue = [],
  type,
  onFilled,
  onChange,
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

  async function handleCopy() {
    const val = type === 'read' ? initialValue : value;
    await navigator.clipboard.writeText(val.join(' '));
    toast.success('Seed phrase copied to clipboard');
  }

  function handlePastInput(
    ev: React.ClipboardEvent<HTMLInputElement>,
    idx: number
  ) {
    const text = ev.clipboardData.getData('text/plain');
    const words = text.split(' ');

    // Only allow paste on the first input or
    // if the paste has more than 12 words
    if (idx === 0 || words.length > 11) {
      ev.preventDefault();
      setValue(fillArray(words, format));
    }
  }

  async function handlePaste() {
    const text = await navigator.clipboard.readText();
    setValue(fillArray(text.split(' '), format));
  }

  function handleChange(val: string, idx: number) {
    setValue((oldState) =>
      oldState
        .map((word, i) => (i === idx ? val : word))
        .map(checkMoreThanOneWord)
    );
  }

  function handleChangeFormat(format: number) {
    setFormat(format);
    const newValue = fillArray(value, format);

    setValue(newValue);
  }

  useEffect(() => {
    onChange?.(value);
    if (value.every((word) => Boolean(word.length))) {
      onFilled?.(value);
    }
  }, [value]);

  return (
    <Box css={styles.root}>
      {enableChangeFormat && (
        <Box.Flex css={styles.formatWrapper}>
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
              >{`I have a ${size} words Seed Phrase`}</option>
            ))}
          </select>
        </Box.Flex>
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
                    index={idx}
                    onChange={handleChange}
                    onPaste={handlePastInput}
                  />
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Box.Flex as="footer" css={styles.footer}>
        {type === 'read' ? (
          <Button
            aria-label="Copy button"
            size="sm"
            variant="solid"
            leftIcon={<Icon icon="Copy" color="intentsBase8" />}
            onPress={handleCopy}
          >
            Copy
          </Button>
        ) : (
          <Button
            aria-label="Paste button"
            size="sm"
            variant="solid"
            leftIcon={<Icon icon="Copy" color="intentsBase8" />}
            onPress={handlePaste}
          >
            Paste
          </Button>
        )}
      </Box.Flex>
    </Box>
  );
}

const styles = {
  root: cssObj({
    layer: 'layer-card',
    borderRadius: '$default',
  }),
  formatWrapper: cssObj({
    p: '$3',
    borderBottom: '1px solid $bodyBg',
    gap: '$1',
    alignItems: 'center',
    justifyContent: 'flex-end',

    // TODO: should replace with a <Select> component in fuel-ui
    select: {
      backgroundColor: 'transparent',
      color: '$intentsBase12',
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
      color: '$intentsBase8',
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
      color: '$intentsBase8',
      textAlign: 'right',
    },
    input: {
      padding: 0,
      width: '100%',
      appearance: 'none',
      border: 'none',
      background: 'transparent',
      borderBottom: '1px dashed $border',
      color: '$intentsBase11',

      '&:focus': {
        outline: 'none',
        borderColor: '$intentsBase8',
      },
    },
  }),
  footer: cssObj({
    px: '$3',
    py: '$3',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$4',

    '.fuel_Button': {
      px: '$8',
    },
  }),
};
