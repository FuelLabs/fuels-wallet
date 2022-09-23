import { css } from "@fuel-ui/css";
import {
  FuelLogo,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
} from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import { useLayoutContext } from "./Layout";

export function TopBar() {
  const navigate = useNavigate();
  const { isLoading, title, isHome } = useLayoutContext();
  const isInternal = !isHome;

  return (
    <Flex as="nav" className={style({ isInternal })}>
      <Flex css={{ alignItems: "center", gap: "$5", flex: 1 }}>
        {isInternal ? (
          <>
            <IconButton
              icon={<Icon icon="CaretLeft" color="gray8" />}
              aria-label="Back"
              variant="link"
              css={{ px: "0 !important" }}
              onPress={() => navigate(-1)}
            />
            <Text css={{ fontWeight: "$semibold", color: "$gray12" }}>
              {title}
            </Text>
            {isLoading && <Spinner />}
          </>
        ) : (
          <>
            <FuelLogo size={36} />
            {isLoading && <Spinner />}
          </>
        )}
      </Flex>
      <IconButton
        icon={<Icon icon="Bell" color="gray8" size={24} />}
        aria-label="Activities"
        variant="link"
        css={{ px: "0 !important" }}
      />
      <IconButton
        icon={<Icon icon="List" color="gray8" size={24} />}
        aria-label="Open menu"
        variant="link"
        css={{ px: "0 !important" }}
      />
    </Flex>
  );
}

const style = css({
  alignItems: "center",
  py: "$2",
  px: "$4",
  gap: "$3",
  height: "50px",
  borderTopLeftRadius: "$md",
  borderTopRightRadius: "$md",
  background: "transparent",

  variants: {
    isInternal: {
      true: {
        boxShadow: "$sm",
        background:
          "linear-gradient(268.61deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 87.23%)",
      },
    },
  },

  defaultVariants: {
    isInternal: false,
  },
});
