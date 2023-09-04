import { useFuelTheme } from '@fuel-ui/react';
import { useMachine, useSelector } from '@xstate/react';
import type { ReCAPTCHAProps } from 'react-google-recaptcha';
import type { Maybe } from '~/systems/Core';

import type { CaptchaMachineState } from '../machines';
import { captchaMachine } from '../machines';

const selectors = {
  key: (state: CaptchaMachineState) => state.context.key,
  captcha: (state: CaptchaMachineState) => state.context.captcha,
  needToShow: (state: CaptchaMachineState) => !state.matches('hidden'),
  isFailed: (state: CaptchaMachineState) => state.matches('failed'),
  isLoaded: (state: CaptchaMachineState) =>
    state.matches('loaded') || state.matches('done'),
  isLoading: (state: CaptchaMachineState) =>
    state.matches('checking') ||
    state.matches('waitingLoad') ||
    state.matches('transitioning'),
};

export function useCaptcha() {
  const [, send, service] = useMachine(captchaMachine);
  const key = useSelector(service, selectors.key);
  const captcha = useSelector(service, selectors.captcha);
  const needToShow = useSelector(service, selectors.needToShow);
  const isFailed = useSelector(service, selectors.isFailed);
  const isLoading = useSelector(service, selectors.isLoading);
  const isLoaded = useSelector(service, selectors.isLoaded);
  const { current } = useFuelTheme();

  function setCaptcha(token: Maybe<string>) {
    send('SET_CAPTCHA', { data: token });
  }
  function load() {
    send('LOAD');
  }

  function getProps() {
    return {
      theme: current,
      sitekey: key,
      onChange: setCaptcha,
      asyncScriptOnLoad: load,
    } as ReCAPTCHAProps;
  }

  return {
    needToShow,
    isFailed,
    isLoading,
    isLoaded,
    getProps,
    key,
    value: captcha || undefined,
  };
}
