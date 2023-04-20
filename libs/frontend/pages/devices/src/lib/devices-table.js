import { useRef, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { FrontendSharedComponentsAppLayout } from '@visionarea-admin/frontend/shared/components/app-layout';
import {
  TableEmptyState,
  TableNoMatchState,
  getFilterCounterText,
} from '@visionarea-admin/frontend/shared/components/table';
import { FrontendSharedComponentsDeleteModal } from '@visionarea-admin/frontend/shared/components/delete-modal';
import {
  useTableDefaultFilter,
  useLocalStorage,
} from '@visionarea-admin/frontend/shared/hooks';
import {
  distributionSelectionLabels,
  paginationLabels,
} from '@visionarea-admin/frontend/shared/config';
import { useNotifications } from '@visionarea-admin/frontend/shared/components/notifications';
import {
  COLUMN_DEFINITIONS,
  FILTERING_PROPERTIES,
  FILTERING_CONSTANTS,
  VISIBLE_CONTENT_OPTIONS,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PREFERENCES,
} from './table-config';
import {
  Table,
  CollectionPreferences,
  Pagination,
  PropertyFilter,
} from '@cloudscape-design/components';
import { FullPageHeader } from './device-header';
import { devicesBreadcrumbs } from './breadcrumbs';
import {
  useGetDevicesQuery,
  useRemoveDevicesMutation,
} from '@visionarea-admin/frontend/shared/api';

function DetailsTable({ defaultQuery }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { addSuccessNotification, addErrorNotification } = useNotifications();
  const [preferences, setPreferences] = useLocalStorage(
    'Categories-Table-Preferences',
    DEFAULT_PREFERENCES
  );

  const { data, isLoading } = useGetDevicesQuery({
    onError: () =>
      addErrorNotification('Error loading devices'),
  });

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    propertyFilterProps,
  } = useCollection(data || [], {
    propertyFiltering: {
      filteringProperties: FILTERING_PROPERTIES,
      empty: <TableEmptyState resourceName="Devices" />,
      noMatch: (
        <TableNoMatchState
          onClearFilter={() => {
            actions.setPropertyFiltering({ tokens: [], operation: 'and' });
          }}
        />
      ),
      defaultQuery,
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });

  const removeCategories = useRemoveDevicesMutation({
    onSuccess: () =>
      addSuccessNotification(
        `${collectionProps.selectedItems.length} Categoria/e cancellate con successo`
      ),
    onError: () => addErrorNotification('Errore nella cancellazione'),
  });

  const onDeleteInit = () => setShowDeleteModal(true);
  const onDeleteDiscard = () => setShowDeleteModal(false);
  const onDeleteConfirm = () => {
    removeCategories.mutate(
      collectionProps.selectedItems.map((item) => item.CatgId)
    );
    setShowDeleteModal(false);
  };

  const isTableLoading = isLoading || removeCategories.isLoading;

  return (
    <>
      <Table
        {...collectionProps}
        stickyHeader={true}
        columnDefinitions={COLUMN_DEFINITIONS}
        visibleColumns={preferences.visibleContent}
        loading={isTableLoading}
        loadingText="Reading the devices..."
        items={items}
        trackBy="id"
        selectionType="multi"
        variant="full-page"
        ariaLabels={distributionSelectionLabels}
        header={
          <FullPageHeader
            selectedItems={collectionProps.selectedItems}
            totalItems={data}
            onDeleteInit={onDeleteInit}
          />
        }
        filter={
          <PropertyFilter
            i18nStrings={FILTERING_CONSTANTS}
            {...propertyFilterProps}
            countText={getFilterCounterText(filteredItemsCount)}
            expandToViewport={true}
          />
        }
        pagination={
          <Pagination
            {...paginationProps}
            ariaLabels={paginationLabels}
            disabled={isTableLoading}
          />
        }
        preferences={
          <CollectionPreferences
            title="Preferences"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            disabled={isTableLoading}
            preferences={preferences}
            onConfirm={({ detail }) => setPreferences(detail)}
            pageSizePreference={{
              title: 'Page size',
              options: PAGE_SIZE_OPTIONS,
            }}
            visibleContentPreference={{
              title: 'Visible columns',
              options: VISIBLE_CONTENT_OPTIONS,
            }}
          />
        }
      />
      <FrontendSharedComponentsDeleteModal
        visible={showDeleteModal}
        onDiscard={onDeleteDiscard}
        onDelete={onDeleteConfirm}
        resourceName="Devices"
        descField="CatgDesc"
        items={collectionProps.selectedItems}
      />
    </>
  );
}

export function DevicesTable() {
  const appLayout = useRef();
  const defaultQuery = useTableDefaultFilter();

  return (
    <FrontendSharedComponentsAppLayout
      ref={appLayout}
      contentType="table"
      activeNavigationHref="/devices"
      breadcrumbs={devicesBreadcrumbs}
      content={<DetailsTable defaultQuery={defaultQuery} />}
    />
  );
}

export default DevicesTable;
