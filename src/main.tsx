import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './app/router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/layout/Header/useTheme';
import { IntroAnimation } from './pages/IntroAnimation';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <IntroAnimation>
              <RouterProvider router={router} />
            </IntroAnimation>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  </StrictMode>,
);
