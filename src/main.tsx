import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router/Router'
import { StyledEngineProvider } from '@mui/material/styles'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { login } from './store/authSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const loadUserFromLocalStorage = () => {
  const authData = localStorage.getItem('authData');
  if (authData) {
    const parsedData = JSON.parse(authData);
    store.dispatch(login(parsedData));
  }
};

loadUserFromLocalStorage();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyledEngineProvider injectFirst>
          <Router />
        </StyledEngineProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>,
)