import { useState, createContext, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@visionarea-admin/frontend/shared/api';
import { FrontendSharedComponentsSplashScreen } from '@visionarea-admin/frontend/shared/components/splash-screen';
import { getImagePath } from '@visionarea-admin/frontend/shared/function';

const MeContext = createContext();

const MeProvider = ({ children }) => {
  const [params, setParams] = useState();
  const [me, setMe] = useState();
  const { logout } = useAuth0();

  const { isLoading, error, data } = useQuery(['getMeApi'], () => getMe(), {
    useErrorBoundary: (error) => {
      if (error.response.status === 401 || error.response.status === 403)
        logout({ returnTo: window.location.origin });
    },
  });
  useEffect(() => {
    if (data?.data) {
      setMe(data?.data);
      setParams(data?.data.params);
    }
  }, [data]);
  if (isLoading)
    return (
      <FrontendSharedComponentsSplashScreen
        imgLoader={getImagePath('portal_reloder.gif')}
      />
    );
  if (!me) return null;
  window.userId = me.id;
  return (
    <MeContext.Provider value={{ me, params }}>{children}</MeContext.Provider>
  );
};
const useMe = () => {
  const helpers = useContext(MeContext);
  return helpers;
};
export { MeProvider, MeContext, useMe };
