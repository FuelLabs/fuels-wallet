import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Grid, Button, Stack, Alert } from '@fuel-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { MnemonicInput } from '../../../Core/components/Mnemonic/MnemonicInput';
import { Header } from '../Header';

import { ImageLoader, relativeUrl } from '~/systems/Core';

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
  onNext: () => void;
  onCancel: () => void;
  positions?: number[];
  readOnly?: boolean;
  defaultValue?: string[];
  isLoading?: boolean;
  canProceed?: boolean;
  error?: string | boolean;
};

export function MnemonicConfirm({
  words = [],
  onFilled,
  onNext,
  onCancel,
  positions,
  readOnly,
  defaultValue = fillArray([], 9),
  error,
  canProceed,
  isLoading,
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
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
      />
      <Header
        title="Confirm your Recovery Phrase"
        subtitle="Enter the correct word for each position"
      />
      <Stack gap="$3" css={{ width: 400 }}>
        {error && (
          <Alert css={{ fontSize: '$sm', py: '$2' }} status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <Box css={styles.root}>
          <Grid css={styles.words}>
            {value.map((_, idx) => {
              return (
                <Grid key={idx} css={styles.inputWrapper}>
                  <span aria-label="position">{positions?.[idx]}</span>
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
      </Stack>
      <Flex gap="$4">
        <Button
          color="gray"
          variant="ghost"
          css={{ width: 130 }}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="accent"
          css={{ width: 130 }}
          onPress={onNext}
          isLoading={isLoading}
          isDisabled={!canProceed}
        >
          Next
        </Button>
      </Flex>
    </Stack>
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
