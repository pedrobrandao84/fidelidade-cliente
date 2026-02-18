import { createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { appTheme } from '../styles/theme';

const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => undefined });
export const useToast = () => useContext(ToastContext);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ToastContext.Provider value={{ showToast: setMessage }}>{children}</ToastContext.Provider>
        <Snackbar open={!!message} autoHideDuration={2400} onClose={() => setMessage('')} message={message} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
