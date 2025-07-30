// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import { MovieProvider } from './contexts/MovieContext'; // ✅ Add this

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MovieProvider> {/*  Wrap App in MovieProvider */}
          <App />
        </MovieProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
