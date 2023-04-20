import { SideNavigation } from '@cloudscape-design/components';
import { useSideNavigation } from 'use-awsui-router';
import { navHeader, navItems } from '@visionarea-admin/frontend/shared/config';

export function FrontendSharedComponentsNavigation({
  activeHref,
  header = navHeader,
  items = navItems,
}) {
  const { handleFollow } = useSideNavigation();
  return <SideNavigation items={items} header={header} activeHref={activeHref} onFollow={handleFollow} />;
}