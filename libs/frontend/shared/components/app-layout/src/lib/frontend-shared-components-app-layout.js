import { forwardRef } from 'react';
import { AppLayout } from '@cloudscape-design/components';
import { FrontendSharedComponentsNotifications } from '@visionarea-admin/frontend/shared/components/notifications';
import { FrontendSharedComponentsTopNavigation } from '@visionarea-admin/frontend/shared/components/top-navigation';
import { FrontendSharedComponentsNavigation } from '@visionarea-admin/frontend/shared/components/navigation';
import { FrontendSharedComponentsBreadcrumbs } from '@visionarea-admin/frontend/shared/components/breadcrumbs';
import { appLayoutLabels } from '@visionarea-admin/frontend/shared/config';

export const FrontendSharedComponentsAppLayout = forwardRef(
  ({ activeNavigationHref, breadcrumbs, ...props }, ref) => {
    return (
      <>
        <FrontendSharedComponentsTopNavigation id="header" />
        <AppLayout
          ref={ref}
          {...props}
          notifications={<FrontendSharedComponentsNotifications />}
          breadcrumbs={<FrontendSharedComponentsBreadcrumbs items={breadcrumbs} />}
          navigation={<FrontendSharedComponentsNavigation activeHref={activeNavigationHref} />}
          headerSelector="#header"
          ariaLabels={appLayoutLabels}
          stickyNotifications={true}
          toolsHide
          onNavigationChange={(event) => {
            if (props.onNavigationChange) {
              props.onNavigationChange(event);
            }
          }}
          onToolsChange={(event) => {
            if (props.onToolsChange) {
              props.onToolsChange(event);
            }
          }}
        />
      </>
    );
  }
);
