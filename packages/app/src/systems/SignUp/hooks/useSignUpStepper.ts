import { useNavigate } from 'react-router-dom';

import { STORAGE_KEY } from '../components/SignUpProvider';
import { SignUpType } from '../machines/signUpMachine';

import { Pages, Storage } from '~/systems/Core';

export function useSignUpStepper() {
  const navigate = useNavigate();
  const isCreate = Storage.getItem(STORAGE_KEY) === SignUpType.create;
  const steps = isCreate ? 4 : 3;

  function handleChangeStep(step: number) {
    if (isCreate && step === 1) {
      navigate(Pages.signUpTerms({ action: 'create' }));
    }
    if (isCreate && (step === 2 || step === 3)) {
      navigate(Pages.signUpCreateWallet());
    }
    if (!isCreate && step === 1) {
      navigate(Pages.signUpTerms({ action: 'recover' }));
    }
    if (!isCreate && (step === 2 || step === 3)) {
      navigate(Pages.signUpRecoverWallet());
    }
  }

  return {
    steps,
    handleChangeStep,
  };
}
