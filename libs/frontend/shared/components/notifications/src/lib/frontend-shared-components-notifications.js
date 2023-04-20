import { Flashbar } from '@cloudscape-design/components';
import { useNotifications } from './context/notification';

export function FrontendSharedComponentsNotifications() {
  const { notifications } = useNotifications();
  return <Flashbar items={notifications} />;
}