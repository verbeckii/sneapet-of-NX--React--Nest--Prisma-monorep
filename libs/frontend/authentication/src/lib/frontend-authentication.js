import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAuthToken } from '@visionarea-admin/frontend/shared/api';

const AuthContext = createContext();
function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const { getAccessTokenSilently, logout } = useAuth0();
  useEffect(() => {
    const login = async () => {
      const t = await getAccessTokenSilently();
      setAuthToken(t);
      setToken(t);
      // logout({ returnTo: window.location.origin,  })
    };
    login();
  }, [getAccessTokenSilently]);

  if (!token) return null;
  return (
    <AuthContext.Provider value={{ setToken }}>{children}</AuthContext.Provider>
  );
}
const useAuth = () => {
  const helpers = useContext(AuthContext);
  return helpers;
};
AuthProvider.displayName = 'AuthProvider';
useAuth.displayName = 'useAuth';
export { AuthProvider, useAuth };
