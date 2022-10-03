import { Pages, PublicRoute } from '~/systems/Core';

export const CRXPublicRoute = () => (
  <PublicRoute redirect={Pages.signUpWalletCreated()} />
);
