import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton } from '@fuel-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';
import { useReportError } from '~/systems/Error';

export function ErrorFloatingButton() {
  const { errors } = useReportError();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('fsk', location);

  if (!errors.length || location.pathname === Pages.errors()) return null;

  return (
    <Box css={styles.alertContainer}>
      <IconButton
        css={styles.button}
        onPress={() => navigate(Pages.errors())}
        aria-label="Click to visualize unreviewed errrors"
        iconSize={20}
        size="sm"
        icon={<Icon icon="AlertTriangle" color="intentsWarning3" />}
      />
    </Box>
  );
}

const styles = {
  alertContainer: cssObj({
    padding: '$2',
    position: 'absolute',
    bottom: 20,
    right: 25,
    zIndex: '$10',
    borderRadius: '$full',
  }),
  button: cssObj({
    background: '$intentsError9',
    borderRadius: '$full',
  }),
};
