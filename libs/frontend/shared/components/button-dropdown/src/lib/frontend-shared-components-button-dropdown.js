import { ButtonDropdown as CSButtonDropdown } from '@cloudscape-design/components';
import { useLink } from 'use-awsui-router';

export const FrontendSharedComponentsButtonDropdown = ({ children, ...props }) => {
  const { handleFollow } = useLink();
  return (
    <CSButtonDropdown onItemFollow={handleFollow} {...props}>
      {children}
    </CSButtonDropdown>
  );
};
