import { withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>...Loading...</div>,
  });
  return <Component />;
};
ProtectedRoute.displayName = 'ProtectedRoute';
export { ProtectedRoute };
