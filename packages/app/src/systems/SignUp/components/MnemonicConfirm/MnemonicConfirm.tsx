import { cssObj } from '@fuel-ui/css';
import { Box, Flex, Grid, Button, Stack, Alert, Icon } from '@fuel-ui/react';
import { useEffect, useState } from 'react';

import { MnemonicInput } from '../../../Core/components/Mnemonic/MnemonicInput';
import { Header } from '../Header';

import { ImageLoader, relativeUrl } from '~/systems/Core';

function fillArrayWithEmptyStrings(length: number) {
  return Array.from({ length }, () => '');
}

export type MnemonicConfirmProps = {
  mnemonicLength?: number;
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
  mnemonicLength = 24,
  words = [],
  onFilled,
  onNext,
  onCancel,
  positions = [],
  readOnly,
  error,
  canProceed,
  isLoading,
}: MnemonicConfirmProps) {
  const [value, setValue] = useState<string[]>(
    fillArrayWithEmptyStrings(mnemonicLength)
  );

  function handleChange(idx: number) {
    return (val: string) => {
      setValue((oldState) =>
        oldState.map((word, i) => (i === idx ? val : word))
      );
    };
  }
  function handleClear(idx: number) {
    return () => {
      setValue((oldState) =>
        oldState.map((word, i) => (i === idx ? '' : word))
      );
    };
  }

  function shouldConfirmPosition(idx: number) {
    return positions.includes(idx + 1);
  }

  useEffect(() => {
    if (positions.length === 0) return;
    setValue((oldState) =>
      oldState.map((_, idx) => {
        return shouldConfirmPosition(idx) ? '' : words[idx] || '';
      })
    );
  }, [words, positions]);

  useEffect(() => {
    if (readOnly) return;
    if (value.every((word) => Boolean(word.length))) {
      onFilled?.(value);
    }
  }, [value]);

  return (
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
        alt="Signup Illustration"
      />
      <Header
        title="Confirm your Recovery Phrase"
        subtitle="Fill in the missing words to confirm your recovery phrase."
      />
      <Stack gap="$3" css={styles.wrapper}>
        {error && (
          <Alert css={styles.alert} status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <Box css={styles.root}>
          <Grid css={styles.words}>
            {value.map((word, idx) => (
              <Grid key={idx} css={styles.inputWrapper}>
                <span aria-label="position">{idx + 1}</span>
                <div>
                  <MnemonicInput
                    value={word}
                    onChange={handleChange(idx)}
                    readOnly={!shouldConfirmPosition(idx)}
                  />
                </div>
                {shouldConfirmPosition(idx) && value[idx].length > 0 && (
                  <Icon
                    css={styles.clearButton}
                    inline
                    icon="XCircle"
                    onClick={handleClear(idx)}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
      <Flex gap="$4">
        <Button
          color="gray"
          variant="ghost"
          css={styles.buttons}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="accent"
          css={styles.buttons}
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
  wrapper: cssObj({
    width: 400,
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
  alert: cssObj({
    fontSize: '$sm',
    py: '$2',
  }),
  buttons: cssObj({
    width: 130,
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
    gridTemplateColumns: '14px 1fr 14px',
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
        borderColor: '$accent11',
      },
    },
  }),
  footer: cssObj({
    px: '$3',
    pb: '$3',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
  }),
  clearButton: cssObj({
    cursor: 'pointer',
  }),
};
