import React from 'react';
import './styles/index.css';
import App from './App';
import ReactDOM from 'react-dom/client';
import { rootCertificates } from 'tls';




const root = ReactDOM.createRoot(document.getElementById('root')!);


root.render(
    <React.StrictMode>
            <App />
    </React.StrictMode>,
);

