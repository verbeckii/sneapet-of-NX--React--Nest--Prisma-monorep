import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithHistory } from '@visionarea-admin/frontend/authentication';
import App from './app/app';
import 'bootstrap/dist/css/bootstrap.css';
import '@cloudscape-design/global-styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </BrowserRouter>
);
