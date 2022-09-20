import { BoxCentered, Button } from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import { Layout } from "~/systems/Core";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <Layout title="Fuel Wallet" isPublic>
      <BoxCentered minHS minWS gap="$2" direction="column">
        <Button onPress={() => navigate("/wallet")}>Go to Wallet</Button>
        <Button
          variant="link"
          onPress={() => {
            window.location.href = import.meta.env.VITE_STORYBOOK_URL;
          }}
        >
          Check our Storybook
        </Button>
      </BoxCentered>
    </Layout>
  );
}
