
import '@vitejs/plugin-react/preamble';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for Android PWA installability and offline support
serviceWorkerRegistration.register({
  onSuccess: () => console.log('Rabt is ready for offline play!'),
  onUpdate: () => console.log('New content available, refresh to update.')
});
