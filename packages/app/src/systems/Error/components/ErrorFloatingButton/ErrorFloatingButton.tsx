import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton } from '@fuel-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';
import { useReportError } from '~/systems/Error';

export function ErrorFloatingButton() {
  const { errors, hasErrorsToReport } = useReportError();
  const navigate = useNavigate();
  const location = useLocation();
  const hidden =
    !hasErrorsToReport ||
    !errors.length ||
    location.pathname === Pages.errors();

  return (
    <Box css={styles.alertContainer} className={hidden ? '' : 'show'}>
      <IconButton
        css={styles.button}
        intent="error"
        onPress={() => navigate(Pages.errors())}
        aria-label="Click to visualize unreviewed errrors"
        iconSize={20}
        size="sm"
        disabled={hidden}
        data-testid="ErrorFloatingButton"
        icon={Icon.is('AlertTriangle')}
      />
    </Box>
  );
}

const styles = {
  alertContainer: cssObj({
    padding: '$2',
    position: 'fixed',
    bottom: 0,
    right: 25,
    zIndex: '$10',
    borderRadius: '$full',
    transform: 'translateY(50px)',
    transition: 'transform 0.3s ease-in-out',
    '&.show': {
      transform: 'translateY(-20px)',
    },
  }),
  button: cssObj({
    borderRadius: '$full',
    borderWidth: 0,
  }),
};
