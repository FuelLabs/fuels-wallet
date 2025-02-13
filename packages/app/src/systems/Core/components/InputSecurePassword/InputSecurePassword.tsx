import type { ThemeUtilsCSS } from "@fuel-ui/css";
import { cssObj } from "@fuel-ui/css";
import type { InputPasswordProps } from "@fuel-ui/react";
import { Box, Icon, InputPassword } from "@fuel-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

export type InputSecurePasswordProps = {
  onChangeStrength?: (strength: string) => void;
  onChange?: (e: never) => void;
  onBlur?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  field: ControllerRenderProps<FieldValues, string> & {
    id: string;
  };
  inputProps?: Partial<InputPasswordProps>;
  css?: ThemeUtilsCSS;
};

const calculatePasswordStrength = (password: string): string => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&#^_-]/.test(password)) score += 1;

  if (score <= 1) return "weak";
  if (score === 2) return "average";
  if (score >= 3) return "strong";

  return "weak";
};

export function InputSecurePassword({
  inputProps,
  field,
  onChangeStrength,
  onChange,
  onBlur,
  placeholder = "Type your password",
  ariaLabel = "Your Password",
  css,
}: InputSecurePasswordProps) {
  const [passwordTooltipOpened, setPasswordTooltipOpened] = useState(false);
  const [strength, setStrength] = useState("weak");
  const password = field.value || "";

  useEffect(() => {
    const currentStrength = calculatePasswordStrength(password);
    setStrength(currentStrength);
    onChangeStrength?.(currentStrength);
  }, [password, onChangeStrength]);

  const getStrengthColor = (level: string, index: number) => {
    if (level === "weak") {
      return index === 0 ? "red" : "gray"; 
    }
    if (level === "average") {
      return index === 0 || index === 1 ? "yellow" : "gray"; 
    }
    if (level === "strong") {
      return "green"; 
    }
    return "gray"; // Default to gray for any unexpected case
  };

  return (
    <Box.Stack css={{ ...styles.root, ...css }} gap={0}>
      {/* Input with Strength Indicator */}
      <Box.Flex
        css={styles.indicator}
        align="center"
        gap="$2"
        aria-label="Password strength"
      >
        {/* Password strength lines */}
        <Box css={styles.strengthLines}>
          {[...Array(3)].map((_, index) => (
            <Box
              key={index}
              css={{
                flex: 1,
                height: "4px",
                backgroundColor: getStrengthColor(strength, index),
                borderRadius: "2px",
              }}
            />
          ))}
        </Box>

        {/* Tooltip Wrapper */}
        <Box
          css={styles.tooltipWrapper}
          onMouseEnter={() => setPasswordTooltipOpened(true)}
          onMouseLeave={() => setPasswordTooltipOpened(false)}
        >
          <Icon icon={Icon.is("ExclamationCircle")} color="intentsBase7" />
          {passwordTooltipOpened && (
            <Box css={styles.tooltip}>
              <Box css={styles.tooltipHeader}>
                <strong>
                  {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </strong>
              </Box>
              <Box css={styles.strengthLines}>
                {[...Array(3)].map((_, index) => (
                  <Box
                    key={index}
                    css={{
                      flex: 1,
                      height: "4px",
                      backgroundColor: getStrengthColor(strength, index),
                      borderRadius: "2px",
                    }}
                  />
                ))}
              </Box>

              <Box css={styles.tooltipContent}>
                <p>A secure password should have:</p>
                <ul>
                  <li>{password.length >= 8 ? "✓" : "✗"} Min. 8 characters</li>
                  <li>
                    {/[a-z]/.test(password) && /[A-Z]/.test(password)
                      ? "✓"
                      : "✗"}{" "}
                    Upper & lower case letters
                  </li>
                  <li>{/\d/.test(password) ? "✓" : "✗"} Numbers</li>
                  <li>
                    {/[@$!%*?&#^_-]/.test(password) ? "✓" : "✗"} Special
                    characters
                  </li>
                </ul>
              </Box>
            </Box>
          )}
        </Box>
      </Box.Flex>

      <InputPassword
        {...field}
        {...inputProps}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    position: "relative",
  }),
  indicator: cssObj({
    width: 120,
    alignSelf: "flex-end",
    marginTop: -24,
    marginBottom: "$2",
  }),
  strengthLines: cssObj({
    display: "flex",
    gap: "4px",
    width: "100%",
  }),
  tooltipWrapper: cssObj({
    position: "relative", // Ensure tooltip is positioned relative to this box
    display: "inline-block",
  }),
  tooltip: cssObj({
    position: "absolute",
    top: "28px", // Directly below the "i" icon
    left: "-10px",
    background: "#333",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 100,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    width: "180px",
  }),
  tooltipHeader: cssObj({
    marginBottom: "8px",
    fontWeight: "bold",
  }),
  tooltipContent: cssObj({
    fontSize: "12px",
    lineHeight: "16px",
  }),
};
