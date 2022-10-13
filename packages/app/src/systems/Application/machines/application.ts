import { createApplicationMachine } from '@fuels-wallet/sdk';
import type { InterpreterFrom, StateFrom } from 'xstate';

import { ApplicationService } from '../services';

export const applicationMachine = createApplicationMachine({
  async fetchApplication(_: any, ev: any) {
    console.log('fetchApplication', ev.data.origin);
    const app = await ApplicationService.getApplication(ev.data.origin);
    console.log('return', app);
    return app;
  },
  async addApplication(ctx: any, ev: any) {
    console.log('addApplication', ev);
    return ApplicationService.addApplication({
      data: {
        origin: ctx.application.origin,
        accounts: ev.data,
      },
    });
  },
  async removeApplication(_: any, ev: any) {
    await ApplicationService.removeApplication(ev.data.origin);
    return true;
  },
});

export type ApplicationMachine = typeof applicationMachine;
export type ApplicationMachineService = InterpreterFrom<ApplicationMachine>;
export type ApplicationMachineState = StateFrom<ApplicationMachine>;
