import { isValidDomain } from '@bako-id/sdk';
import {
  cssObj,
  Box,
  Input,
  OptionItem,
  Popover,
  Spinner,
  Text,
  Tooltip,
  type InputElementProps,
} from '@fuel-wallet/ui';
import debounce from 'lodash.debounce';
import type React from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const optionRef = useRef<HTMLButtonElement>(null);

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

  const hasSuggestion = !!address && !!domain && status === 'idle';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestion) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      toggleDropdown(true);
      requestAnimationFrame(() => optionRef.current?.focus());
    }
    if (e.key === 'Enter' && isOpenDropdown) {
      e.preventDefault();
      handleSelect(address);
    }
  };

  const showHandle = useMemo(
    () => isName && !!address && status === 'selected',
    [isName, address, status]
  );

  return (
    <Popover
      isOpen={isOpenDropdown && hasSuggestion}
      onOpenChange={toggleDropdown}
    >
      <Popover.Anchor>
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
              onKeyDown={handleKeyDown}
              id="search-address"
              aria-label="Address Input"
              aria-autocomplete="list"
              aria-expanded={isOpenDropdown && hasSuggestion}
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
      </Popover.Anchor>

      <Popover.Content
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement | null;
          if (target?.closest('[aria-label="Address Input"]'))
            e.preventDefault();
        }}
      >
        <OptionItem
          ref={optionRef}
          aria-label={`Send to ${domain}`}
          css={styles.option}
          onClick={() => handleSelect(address!)}
        >
          <NameSystemAvatar resolver={address!}>
            <Box.Flex direction="column" css={styles.optionText}>
              <Text css={styles.domainText} className="domain" fontSize="sm">
                {domain}
              </Text>
              <Text css={styles.addressText} fontSize="xs">
                {shortAddress(address ?? '')}
              </Text>
            </Box.Flex>
          </NameSystemAvatar>
        </OptionItem>
      </Popover.Content>
    </Popover>
  );
});

const styles = {
  option: cssObj({
    py: '$2',
    height: 'auto',
  }),
  optionText: cssObj({
    minWidth: 0,
    gap: '2px',
  }),
  input: cssObj({
    display: 'flex',
    position: 'relative',
    flex: 1,

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
    color: '$textHigh',
  }),
  addressText: cssObj({
    fontFamily: '$mono',
    lineHeight: '$tight',
    color: '$textLow',
  }),
};
