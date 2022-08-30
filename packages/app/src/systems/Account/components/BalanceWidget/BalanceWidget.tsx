import { cssObj } from "@fuel-ui/css";
import { Avatar, Box, Flex, Icon, IconButton, Text } from "@fuel-ui/react";
import type { ReactNode } from "react";

import type { Account } from "../../types";

import { BalanceWidgetLoader } from "./BalanceWidgetLoader";

import { shortAddress } from "~/systems/Core";

type BalanceWidgetWrapperProps = {
  children: ReactNode;
};

export function BalanceWidgetWrapper({ children }: BalanceWidgetWrapperProps) {
  return (
    <Box css={styles.balanceWidgetWrapper}>
      <Box css={styles.backgroundShadow}>&nbsp;</Box>
      <Box css={styles.backgroundFront}>&nbsp;</Box>
      <Flex css={styles.contentWrapper}>{children}</Flex>
    </Box>
  );
}

export type BalanceWidgetProps = {
  account: Account;
  isHidden?: boolean;
};

export function BalanceWidget({ account, isHidden }: BalanceWidgetProps) {
  async function handleCopy() {
    await navigator.clipboard.writeText(account.address);
  }

  return (
    <BalanceWidgetWrapper>
      <Flex direction="column" align="center">
        <Avatar
          size="lg"
          name={account.name}
          /**
           * TODO: Need to add Avatar.Generated here when it's done on @fuel-ui
           */
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
        />
        <IconButton
          size="xs"
          variant="ghost"
          color="gray"
          icon={<Icon icon="CaretDown" color="gray8" />}
          aria-label="Expand"
          css={styles.caretDownIcon}
        />
      </Flex>
      <Flex justify="space-between" css={{ flex: "1 0" }}>
        <Flex direction="column" css={{ marginLeft: 14, alignSelf: "center" }}>
          <Flex align="center">
            <Text fontSize="sm" color="gray11" css={{ fontWeight: "bold" }}>
              {shortAddress(account.address)}
            </Text>
            <IconButton
              onPress={handleCopy}
              size="xs"
              variant="link"
              color="gray"
              icon={<Icon icon="Copy" color="gray8" size={18} weight="thin" />}
              aria-label="Copy address"
              css={{ marginLeft: 4 }}
            />
          </Flex>
          <Text
            color={isHidden ? "gray10" : "gray12"}
            fontSize="2xl"
            css={{ fontWeight: "bold" }}
          >
            $&nbsp;{isHidden ? "•••••" : account.balance || "0.00"}
          </Text>
        </Flex>
        <Box css={{ marginRight: 6, marginTop: 8 }}>
          <IconButton
            size="xs"
            variant="link"
            color="gray"
            icon={
              <Icon
                size={18}
                {...(isHidden
                  ? {
                      color: "accent9",
                      icon: "EyeSlash",
                    }
                  : {
                      color: "gray8",
                      icon: "Eye",
                    })}
              />
            }
            aria-label={isHidden ? "Show" : "Hide"}
          />
        </Box>
      </Flex>
    </BalanceWidgetWrapper>
  );
}

BalanceWidget.Loader = BalanceWidgetLoader;

const backgroundCss = {
  position: "absolute",
  width: "100%",
  height: "100%",
  boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.15)",
  transform: "skew(-25deg)",
  borderTopRightRadius: "40px 35px",
  borderBottomRightRadius: "35px 25px",
  borderBottomLeftRadius: "40px 50px",
  borderTopLeftRadius: "10px",
};

const styles = {
  backgroundFront: cssObj({
    ...backgroundCss,
    background:
      "linear-gradient(180deg, #1F1F1F 0%, rgba(28, 30, 31, 0.45) 41.15%)",
    top: 3,
    left: 3,
  }),
  backgroundShadow: cssObj({
    ...backgroundCss,
    background:
      "linear-gradient(180deg, #0F0F0F -9.3%, rgba(18, 20, 20, 0.45) 35.67%)",
    top: 10,
    left: 7,
  }),
  contentWrapper: cssObj({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  }),
  balanceWidgetWrapper: cssObj({
    minHeight: 88,
    position: "relative",
  }),
  caretDownIcon: cssObj({
    marginTop: 8,
    height: "20px !important",
    padding: "0 3px !important",
    borderRadius: 8,
  }),
};
