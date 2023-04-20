import { Box, Button, SpaceBetween } from '@cloudscape-design/components';

export const TableNoMatchState = (props) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>Nessuna Corrispondenza</b>
        <Box variant="p" color="inherit">
          La ricerca non ha prodotto alcun risultato.
        </Box>
      </div>
      <Button onClick={props.onClearFilter}>Pulisci filtro</Button>
    </SpaceBetween>
  </Box>
);

export const TableEmptyState = ({ resourceName }) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>Nessuno/a {resourceName.toLowerCase()}</b>
        <Box variant="p" color="inherit">
          Non c'è nessuno/a {resourceName.toLowerCase()}.
        </Box>
      </div>
      <Button>Inserisci {resourceName.toLowerCase()}</Button>
    </SpaceBetween>
  </Box>
);
