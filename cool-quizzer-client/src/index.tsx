import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider
        theme={{
            primaryColor: 'cyan',
        }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);