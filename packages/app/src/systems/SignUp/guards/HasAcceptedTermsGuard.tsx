import { Navigate, Outlet } from 'react-router-dom';

import { Pages, RouteGuard } from '~/systems/Core';
import { useHasAcceptedTerms } from '~/systems/Core/hooks/useAcceptedTerms';

export function HasAcceptedTermsGuard() {
  const { hasAcceptedTerms } = useHasAcceptedTerms();

  return (
    <RouteGuard
      cond={() => hasAcceptedTerms}
      reject={<Navigate to={Pages.signUpTerms({ action: 'create' })} />}
    >
      <Outlet />
    </RouteGuard>
  );
}
