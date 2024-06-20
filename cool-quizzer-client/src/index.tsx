import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import './index.css';
import App from './App';
import { Input, MantineProvider } from '@mantine/core';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const myTheme = {
    primaryColor: 'cyan',
    components: {
        InputWrapper: Input.Wrapper.extend({
            styles: (theme) => ({
                label: {
                    fontSize: theme.fontSizes.sm,
                    marginBottom: '4px',
                },
            }),
        }),
    },
};

root.render(
    <React.StrictMode>
        <MantineProvider theme={myTheme}>
            <App />
        </MantineProvider>
    </React.StrictMode>
);