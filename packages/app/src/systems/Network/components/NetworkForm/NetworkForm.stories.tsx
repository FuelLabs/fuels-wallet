import { Box } from "@fuel-ui/react";

import { useNetworkForm } from "../../hooks";

import { NetworkForm } from "./NetworkForm";

export default {
  component: NetworkForm,
  title: "Network/components/NetworkForm",
};

export const Usage = () => {
  const form = useNetworkForm();
  return (
    <Box css={{ width: 320 }}>
      <NetworkForm {...form} />
    </Box>
  );
};

export const WithValues = () => {
  const form = useNetworkForm({
    defaultValues: {
      name: "Localhost",
      url: "http://localhost:4000",
    },
  });
  return (
    <Box css={{ width: 320 }}>
      <NetworkForm {...form} />
    </Box>
  );
};
