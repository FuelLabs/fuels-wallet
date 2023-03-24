import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Grid, Button } from '@fuel-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { MnemonicInput } from '../../../Core/components/Mnemonic/MnemonicInput';

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

export type MnemonicConfirmProps = {
  words?: string[];
  onFilled?: (val: string[]) => void;
  positions?: number[];
  error?: string;
  readOnly?: boolean;
  defaultValue?: string[];
};

export function MnemonicConfirm({
  words = [],
  onFilled,
  positions,
  readOnly,
  defaultValue = fillArray([], 9),
}: MnemonicConfirmProps) {
  const [value, setValue] = useState<string[]>(defaultValue);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(!readOnly);

  const unSelectedWords = useMemo(
    () => words.filter((word) => !value.includes(word)),
    [words, value]
  );

  function handleChange(idx: number) {
    return (val: string) => {
      setCurrentPosition(idx);
      setValue((oldState) =>
        oldState
          .map((word, i) => (i === idx ? val : word))
          .map(checkMoreThanOneWord)
      );
      setIsEditing(true);
    };
  }

  function handleFocus(idx: number) {
    return () => {
      setCurrentPosition(idx);
    };
  }

  function handleConfirmValueClick(val: string) {
    return () => {
      setValue((oldState) =>
        oldState.map((word, i) => (i === Number(currentPosition) ? val : word))
      );
      setIsEditing(true);
      setCurrentPosition((oldState) => Number(oldState) + 1);
    };
  }

  useEffect(() => {
    if (!isEditing) return;
    if (value.every((word) => Boolean(word.length))) {
      onFilled?.(value);
      setIsEditing(false);
    }
  }, [value, isEditing]);

  return (
    <Box css={styles.root}>
      <Grid css={styles.words}>
        {value.map((_, idx) => {
          return (
            <Grid key={idx} css={styles.inputWrapper}>
              <span>{positions?.[idx]}</span>
              <div>
                <MnemonicInput
                  value={value[idx]}
                  onChange={handleChange(idx)}
                  onFocus={handleFocus(idx)}
                />
              </div>
            </Grid>
          );
        })}
      </Grid>

      <Flex as="footer" align="center" gap="$4" css={styles.footer}>
        {unSelectedWords?.map((word) => (
          <Button onPress={handleConfirmValueClick(word)} key={word}>
            {word}
          </Button>
        ))}
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
    flexWrap: 'wrap',
  }),
};
