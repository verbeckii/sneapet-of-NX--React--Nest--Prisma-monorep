import { useAuth0 } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FrontendSharedComponentsSplashScreen } from '@visionarea-admin/frontend/shared/components/splash-screen';
import { getImagePath } from '@visionarea-admin/frontend/shared/function';
// import { FilterProvider } from '@visionarea-admin/frontend/components/filter-settings';
import {
  AuthProvider,
  MeProvider,
  ProtectedRoute,
} from '@visionarea-admin/frontend/authentication';
import { environment } from '../environments/environment';
import { FrontendSharedComponentsLoginButton } from '@visionarea-admin/frontend/shared/login-button';
import { Route, Routes } from 'react-router-dom';
import { DevicesTable, DeviceCreate, DeviceDetail } from '@visionarea-admin/frontend/pages/devices';
import { NotificationProvider } from '@visionarea-admin/frontend/shared/components/notifications';
import { NotFound } from '@visionarea-admin/frontend/pages/error';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000 * 60,
      refetchInterval: 5 * 1000 * 60,
      refetchIntervalInBackground: true,
    },
  },
});

export function App() {
  const { isLoading, isAuthenticated, error } = useAuth0();

  if (isLoading)
    return (
      <FrontendSharedComponentsSplashScreen
        imgLoader={getImagePath('portal_reloder.gif')}
      />
    );
  if (!isAuthenticated) return <FrontendSharedComponentsLoginButton />;

  return (
    <div className={`h-100`}>
      <AuthProvider>
        {/* <FilterProvider> */}
        <QueryClientProvider client={queryClient}>
          <MeProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<div>hello</div>} />
                <Route
                  path="/devices"
                  element={<ProtectedRoute component={DevicesTable} />}
                />
                <Route
                  path="*"
                  element={<ProtectedRoute component={NotFound} />}
                />
                <Route
                  path="/device/create"
                  element={<ProtectedRoute component={DeviceCreate} />}
                />
                <Route
                  path="/device/:id"
                  element={<ProtectedRoute component={DeviceDetail} />}
                />
              </Routes>
            </NotificationProvider>
          </MeProvider>
          {!environment.production && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
        {/* </FilterProvider> */}
      </AuthProvider>
    </div>
  );
}
export default App;
