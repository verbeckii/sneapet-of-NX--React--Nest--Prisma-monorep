import { Button, SpaceBetween } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { TableHeader } from '@visionarea-admin/frontend/shared/components/table';

export const FullPageHeader = ({
  resourceName = 'Devices',
  createButtonText = 'New device',
  selectedItems,
  onDeleteInit,
  ...props
}) => {
  const navigate = useNavigate();
  const isOnlyOneSelected = selectedItems.length === 1;

  return (
    <TableHeader
      variant="awsui-h1-sticky"
      title={resourceName}
      actionButtons={
        <SpaceBetween size="xs" direction="horizontal">
          <Button
            disabled={!isOnlyOneSelected}
            onClick={() => navigate(`/device/${selectedItems[0].id}`)}
          >
            Edit
          </Button>
          <Button disabled={selectedItems.length === 0} onClick={onDeleteInit}>
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/device/create`)}
          >
            {createButtonText}
          </Button>
        </SpaceBetween>
      }
      {...props}
    />
  );
};
