import { Provider } from 'fuels';

const providers: {
  [key: string]: Provider;
} = {};

export const getGasConfig = async (provider: Provider) => {
  const chain = await provider.getChain();
  const gasPrice = await provider.getLatestGasPrice();
  const txParameters = chain.consensusParameters.txParameters;
  const feeParameters = chain.consensusParameters.feeParameters;

  return {
    gasLimit: txParameters.maxGasPerTx.div(2),
    gasPrice,
    gasPriceFactor: feeParameters.gasPriceFactor,
  };
};

export const createProvider = async (url: string) => {
  if (providers[url]) {
    return providers[url];
  }

  // Regular expression to match the URL with basic auth credentials
  const regex = /^(https?:\/\/)([^:@]+):([^:@]+)@(.*)$/;
  const match = url.match(regex);

  let username: string | undefined;
  let password: string | undefined;
  let urlNoBasicAuth = url;
  if (match) {
    // Extract username and password from the match
    username = match[2];
    password = match[3];
    // Remove the username and password from the URL
    urlNoBasicAuth = url.replace(`${match[2]}:${match[3]}@`, '');
  }

  // create provider with the URL without basic auth credentials
  providers[url] = await Provider.create(urlNoBasicAuth, {
    requestMiddleware: async (req) => {
      if (req?.headers && username && password) {
        // Add basic auth credentials to the request following browser way
        const auth = `Basic ${btoa(`${username}:${password}`)}`;
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        req.headers['Authorization'] = `${auth}`;
      }
      return req;
    },
  });

  return providers[url];
};
