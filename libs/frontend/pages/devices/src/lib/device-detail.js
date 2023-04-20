import { useRef } from 'react';
import { ContentLayout, Header } from '@cloudscape-design/components';
import { FrontendSharedComponentsSpinner } from '@visionarea-admin/frontend/shared/components/spinner';
import { FrontendSharedComponentsAppLayout } from '@visionarea-admin/frontend/shared/components/app-layout';
import { useNotifications } from '@visionarea-admin/frontend/shared/components/notifications';
import { deviceDetailBreadcrumb } from './breadcrumbs';
import {
  useGetCustomerOptionsQuery,
  useGetDeviceQuery,
  useGetStoreOptionsQuery,
} from '@visionarea-admin/frontend/shared/api';
import { useParams, useNavigate } from 'react-router-dom';
import { FormContent } from './device-detail-form';

export const DeviceDetail = () => {
  const appLayout = useRef();
  const { id } = useParams();
  const { addErrorNotification } = useNotifications();
  const navigate = useNavigate();
  const { isLoading, data } = useGetDeviceQuery(id, {
    onError: () => {
      addErrorNotification('Edit error: device not found');
      navigate('/devices');
    },
  });

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

  const isDataLoading =
    isLoadingCustomerOptions || isLoadingStoreOptions || isLoading;

  return (
    <FrontendSharedComponentsAppLayout
      ref={appLayout}
      contentType="form"
      activeNavigationHref="/devices"
      breadcrumbs={deviceDetailBreadcrumb(data)}
      content={
        isDataLoading ? (
          <FrontendSharedComponentsSpinner />
        ) : (
          <ContentLayout
            header={<Header variant="h1">{`Edit ${data?.Description || ''}`}</Header>}
          >
            <FormContent
              item={data}
              customerOptions={customerOptions}
              storeOptions={storeOptions}
            />
          </ContentLayout>
        )
      }
    />
  );
};

export default DeviceDetail;
