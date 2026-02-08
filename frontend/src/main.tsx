import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { store } from './app/store.ts';

/**
 * Main application entry file.
 * It mounts the React application, wraps it in the Redux Provider, and
 * sets up strict mode for development.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap the entire application with the Redux store Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
