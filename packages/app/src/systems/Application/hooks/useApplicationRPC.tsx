import { useEffect } from 'react';

import type { ApplicationMachineService } from '../machines';
import { ApplicationRPC } from '../services/appRPC';

export function useApplicationRPC(
  applicationService: ApplicationMachineService
) {
  useEffect(() => {
    // eslint-disable-next-line no-new
    new ApplicationRPC(applicationService);
  }, [applicationService]);
}
