import { isValidDomain } from '@bako-id/sdk';
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Dropdown,
  Input,
  type InputElementProps,
  Spinner,
  Text,
  Tooltip,
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
  const debouncedResolver = useCallback(
    debounce(async (name: string) => {
      const { address, error } = await resolver(name);
      if (address) {
        onError(null);
        setDomain({ domain: name, address });
      } else {
        onError(error || 'No resolver for domain provided');
        reset();
      }
    }, 600),
    [resolver]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      debouncedResolver.cancel();
      reset();
    };
  }, [debouncedResolver]);

  const handleDomainChange = (domain: string) => {
    const domainWithoutAt = domain.replace('@', '');
    if (isValidDomain(domain) && domainWithoutAt.length > 2) {
      return debouncedResolver(domain);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const isDomain = value.startsWith('@');
    if (isDomain) {
      return handleDomainChange(value);
    }
    if (domain) {
      reset();
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
    () => isName && !!address && status === 'selected',
    [isName, address, status]
  );

  return (
    <Dropdown
      css={styles.root}
      isOpen={isOpenDropdown}
      onOpenChange={toggleDropdown}
      popoverProps={{
        arrowClassName: 'arrow',
        sideOffset: 0,
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
                <Tooltip content={shortAddress(address ?? '')}>
                  <Text css={styles.domainText}>{domain}</Text>
                </Tooltip>
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
              <Text css={styles.domainText} className="domain" fontSize="sm">
                {domain}
              </Text>
              <Text css={styles.domainText}>{shortAddress(address ?? '')}</Text>
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

    '.arrow': {
      display: 'none !important',
    },
  }),
  dropdownMenu: cssObj({
    width: 250,
    padding: '$1 0',
    '.fuel_MenuListItem': {
      px: '$3',
      height: 'auto',
    },
  }),
  dropdownMenuItem: cssObj({
    py: '$1',

    '.domain': {
      marginBottom: '2px',
      color: '$inputBaseColor !important',
    },
  }),
  input: cssObj({
    display: 'flex',
    position: 'relative',

    '.input-name-system': {
      padding: '0 $3 !important',

      '.fuel_Avatar': {
        width: '24px',
        height: '24px',
      },
    },
  }),
  inputLoader: cssObj({
    position: 'absolute',
    top: '50%',
    right: '$1',
    transform: 'translateY(-50%)',
    zIndex: 99999,
  }),
  domainText: cssObj({
    fontFamily: '$sans',
    lineHeight: '$tight',
  }),
};
