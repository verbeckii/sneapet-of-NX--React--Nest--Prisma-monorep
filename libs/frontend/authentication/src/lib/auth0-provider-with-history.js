import { useNavigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const environment = process.env;
  const domain = environment.NX_AUTH0_DOMAIN;
  const clientId = environment.NX_AUTH0_CLIENT_ID;
  const audience = environment.NX_AUTH0_AUDIENCE;

  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
Auth0ProviderWithHistory.displayName = 'Auth0ProviderWithHistory';
export {Auth0ProviderWithHistory};