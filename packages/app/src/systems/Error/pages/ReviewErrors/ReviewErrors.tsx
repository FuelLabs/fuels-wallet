import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportErrors } from '~/systems/Error/pages/ReportErrors';

export function ReviewErrors() {
  const navigation = useNavigate();

  const onRestore = useCallback(() => {
    navigation(-1);
  }, [navigation]);

  return <ReportErrors onRestore={onRestore} />;
}
