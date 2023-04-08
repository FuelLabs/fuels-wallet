import { Outlet, Route } from 'react-router-dom';

import { Pages } from '../Core/types';
import { FaucetDialog } from '../Faucet';

import { Home, Receive, NFTs, NFTDetails } from './pages';

export const homeRoutes = (
  <Route path={Pages.wallet()}>
    <Route
      index
      element={
        <>
          <Home />
          <Outlet />
        </>
      }
    />
    <Route path={Pages.faucet()} element={<FaucetDialog />} />
    <Route path={Pages.receive()} element={<Receive />} />
    <Route path={Pages.nfts()} element={<NFTs />} />
    <Route path={Pages.nftDetails()} element={<NFTDetails />} />
  </Route>
);
