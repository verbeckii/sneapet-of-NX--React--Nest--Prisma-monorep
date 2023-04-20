import { BreadcrumbGroup } from '@cloudscape-design/components';
import { useBreadcrumbGroup } from 'use-awsui-router';

export const FrontendSharedComponentsBreadcrumbs = ({ items }) => {
  const { handleFollow } = useBreadcrumbGroup();
  return <BreadcrumbGroup items={items} onFollow={handleFollow} />;
};
