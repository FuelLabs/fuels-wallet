import { cssObj } from '@fuel-ui/css';
import { Card, Flex, Icon, List, Text } from '@fuel-ui/react';

export type PermissionCardProps = {
  headerText: string;
  allowed: string[];
  notAllowed: string[];
};
export const PermissionCard = ({
  headerText,
  allowed,
  notAllowed,
}: PermissionCardProps) => {
  return (
    <Card css={styles.connectionDetails}>
      <Card.Header css={styles.cardHeader}>
        <Text css={styles.cardHeaderText}>{headerText}</Text>
      </Card.Header>
      <Card.Body css={styles.permissionCardBody}>
        <Flex direction="column">
          <List icon={Icon.is('Check')} iconColor="accent9">
            {allowed.map((permission) => (
              <List.Item css={styles.listItemAllowed} key={permission}>
                {permission}
              </List.Item>
            ))}
          </List>
          <List icon={Icon.is('X')} iconColor="red10">
            {notAllowed.map((permission) => (
              <List.Item css={styles.listItemDisallowed} key={permission}>
                {permission}
              </List.Item>
            ))}
          </List>
        </Flex>
      </Card.Body>
    </Card>
  );
};

const styles = {
  connectionDetails: cssObj({
    marginTop: '$0',
  }),
  cardHeader: cssObj({
    px: '$3',
    py: '$2',
  }),
  cardHeaderText: cssObj({
    fontSize: '$sm',
    fontWeight: '$bold',
    color: '$gray12',
  }),
  listItemAllowed: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  listItemDisallowed: cssObj({
    fontSize: '$sm',
  }),
  permissionCardBody: cssObj({
    p: '$3',
  }),
};
