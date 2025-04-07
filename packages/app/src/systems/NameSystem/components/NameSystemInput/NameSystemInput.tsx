import { isValidDomain } from '@bako-id/sdk';
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Dropdown,
  Input,
  type InputElementProps,
  Spinner,
  Text,
} from '@fuel-ui/react';
import debounce from 'lodash.debounce';
import type React from 'react';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { shortAddress } from '~/systems/Core';
import { useNameSystemRequest } from '../../hooks';
import { useResolver } from '../../hooks/useResolver';
import { NameSystemAvatar } from '../NameSystemAvatar';

interface NameSystemInputProps extends Omit<InputElementProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onError: (error: string | null) => void;
}

type Status = 'idle' | 'selected';

export const NameSystemInput = forwardRef<
  HTMLInputElement,
  NameSystemInputProps
>(({ onChange, onError, ...props }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const { resolver, isLoading } = useResolver();
  const { isOpenDropdown, toggleDropdown, domain, address, reset, setDomain } =
    useNameSystemRequest();

  const isName = useMemo(() => isValidDomain(inputValue), [inputValue]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const debouncedResolver = useMemo(
    () =>
      debounce(async (name: string) => {
        const address = await resolver(name);
        if (address) {
          onError(null);
          setDomain({ domain: name, address });
        } else {
          onError('No resolver for domain provided');
          reset();
        }
      }, 600),
    [resolver]
  );

  useEffect(() => {
    return () => {
      debouncedResolver.cancel();
    };
  }, [debouncedResolver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (isValidDomain(value)) {
      debouncedResolver(value);
      return;
    }

    onChange(value);
  };

  const handleOpenDropdown = useCallback(() => {
    if (status === 'idle' && address) {
      toggleDropdown(true);
    }
  }, [address, status, toggleDropdown]);

  const handleSelect = useCallback(
    (address: string) => {
      toggleDropdown(false);
      setStatus('selected');
      onChange(address);
    },
    [onChange, toggleDropdown]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleClear = useCallback(() => {
    reset();
    setStatus('idle');
    setInputValue('');
    onChange('');
  }, [onChange]);

  const showHandle = useMemo(
    () => isName && address && status === 'selected',
    [isName, address, status]
  );

  return (
    <Dropdown
      css={styles.root}
      isOpen={isOpenDropdown}
      onOpenChange={toggleDropdown}
      popoverProps={{
        arrowClassName: 'address-arrow',
      }}
    >
      <Dropdown.Trigger asChild>
        <Input size="sm" css={styles.input}>
          {showHandle ? (
            <NameSystemAvatar
              resolver={address!}
              onClear={handleClear}
              className="input-name-system"
            >
              <Box.Flex direction="row" gap={2} align="center">
                <Text css={styles.domain}>{domain}</Text>
                <Text css={styles.text}>{shortAddress(address ?? '')}</Text>
              </Box.Flex>
            </NameSystemAvatar>
          ) : (
            <Input.Field
              onChange={handleChange}
              id="search-address"
              aria-label="Address Input"
              placeholder="Enter a Fuel address"
              ref={ref}
              onClick={handleOpenDropdown}
              {...props}
              value={inputValue}
            />
          )}

          {isLoading && (
            <Input.ElementRight
              css={styles.inputLoader}
              element={<Spinner size={15} />}
            />
          )}
        </Input>
      </Dropdown.Trigger>

      <Dropdown.Menu
        onAction={(key) => handleSelect(key.toString())}
        css={styles.dropdownMenu}
      >
        <Dropdown.MenuItem css={styles.dropdownMenuItem} key={address}>
          <NameSystemAvatar resolver={address!} onSelect={handleSelect}>
            <Box.Flex direction="column">
              <Text css={styles.domain}>{domain}</Text>
              <Text css={styles.text} fontSize="xs">
                {shortAddress(address ?? '')}
              </Text>
            </Box.Flex>
          </NameSystemAvatar>
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
});

const styles = {
  root: cssObj({
    position: 'relative',
    flex: 1,
    display: 'flex',

    '.address-arrow': {
      display: 'none !important',
    },
  }),
  dropdownMenu: cssObj({
    width: 250,
    border: '1px solid $border',
    padding: '$1 0',
  }),
  dropdownMenuItem: cssObj({
    padding: '0 $2',
  }),
  input: cssObj({
    display: 'flex',
    position: 'relative',

    '.input-name-system': {
      padding: '0 $3 !important',
    },
  }),
  inputLoader: cssObj({
    position: 'absolute',
    top: '50%',
    right: '$1',
    transform: 'translateY(-50%)',
    zIndex: 99999,
  }),
  text: cssObj({
    fontFamily: '$sans',
  }),
  domain: cssObj({
    color: '$inputBaseColor !important',
    fontFamily: '$sans',
  }),
};
