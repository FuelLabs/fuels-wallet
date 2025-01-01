type EcosystemContractMetadata = {
  id: string;
  name: string;
};

export type EcosystemProject = {
  name: string;
  contracts?: {
    mainnet?: EcosystemContractMetadata[];
  };
  image?: string;
};
