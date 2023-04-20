import { useRef } from 'react';
import { ContentLayout, Header } from '@cloudscape-design/components';
import { FrontendSharedComponentsAppLayout } from '@visionarea-admin/frontend/shared/components/app-layout';
import { deviceCreateBreadcrumbs } from './breadcrumbs';
import { FormContent } from './device-detail-form';
import { FrontendSharedComponentsSpinner } from '@visionarea-admin/frontend/shared/components/spinner';
import { useGetCustomerOptionsQuery, useGetStoreOptionsQuery } from '@visionarea-admin/frontend/shared/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@visionarea-admin/frontend/shared/components/notifications';

export const DeviceCreate = () => {
  const appLayout = useRef();
  const { addErrorNotification } = useNotifications();
  const navigate = useNavigate();

  const { isLoading: isLoadingCustomerOptions, data: customerOptions } =
    useGetCustomerOptionsQuery({
      onError: () => {
        addErrorNotification('Errore nella letture delle categorie');
        navigate('/devices');
      },
    });
  const { isLoading: isLoadingStoreOptions, data: storeOptions } =
    useGetStoreOptionsQuery({
      onError: () => {
        addErrorNotification('Errore nella letture delle origini');
        navigate('/devices');
      },
    });

  const isDataLoading = isLoadingCustomerOptions || isLoadingStoreOptions;

  return (
    <FrontendSharedComponentsAppLayout
      ref={appLayout}
      contentType="form"
      activeNavigationHref="/device/create"
      breadcrumbs={deviceCreateBreadcrumbs}
      content={
        isDataLoading ? (
          <FrontendSharedComponentsSpinner />
        ) : (
          <ContentLayout header={<Header variant="h1">New Device</Header>}>
            <FormContent
              customerOptions={customerOptions}
              storeOptions={storeOptions}
            />
          </ContentLayout>
        )
      }
    />
  );
};

export default DeviceCreate;
