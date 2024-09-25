import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryProvider } from './utilities/react-query/QueryProvider.jsx';

createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);
