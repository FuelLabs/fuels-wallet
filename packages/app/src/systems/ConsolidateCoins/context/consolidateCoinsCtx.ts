import { createActorContext } from '@xstate/react';
import { consolidateCoinsMachine } from '../machines/consolidateCoinsMachine';

export const ConsolidateCoinsMachineCtx = createActorContext(
  consolidateCoinsMachine
);
