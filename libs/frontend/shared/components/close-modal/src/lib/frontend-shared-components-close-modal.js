import {
  Alert,
  Box,
  Button,
  Modal,
  SpaceBetween,
} from '@cloudscape-design/components';

export function FrontendSharedComponentsCloseModal({
  items,
  visible,
  onDiscard,
  onConfirm,
  resourceName,
  descField,
}) {
  const isMultiple = items.length > 1;
  return (
    <Modal
      visible={visible}
      onDismiss={onDiscard}
      header={`Chiusura ${resourceName}`}
      closeAriaLabel="Close dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDiscard}>
              Annulla
            </Button>
            <Button variant="primary" onClick={onConfirm}>
              Chiudi
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {items.length > 0 && (
        <SpaceBetween size="m">
          {isMultiple ? (
            <Box variant="span">
              Vuoi chiudere definitivamente{' '}
              <Box variant="span" fontWeight="bold">
                {items.length} {resourceName}
              </Box>{' '}
              ?
            </Box>
          ) : (
            <Box variant="span">
              Vuoi chiudere definitivamente{' '}
              <Box variant="span" fontWeight="bold">
                {typeof descField === 'function'
                  ? descField(items[0])
                  : items[0][descField]}
              </Box>{' '}
              ?
            </Box>
          )}

          <Alert statusIconAriaLabel="Info">
            Questa operazione è irreversibile.
          </Alert>
        </SpaceBetween>
      )}
    </Modal>
  );
}
