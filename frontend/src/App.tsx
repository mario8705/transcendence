import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthConsumer, AuthProvider } from './contexts/AuthContext';
import { router } from './router';
import { AvatarProvider } from './contexts/AvatarContext';
import { SnackbarProvider } from 'notistack';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AvatarProvider>
      <SnackbarProvider>
        <AuthProvider>
          <div className="App">
            <AuthConsumer>
              {
                auth => auth.isLoading ?
                <p>Loading...</p> :
                <RouterProvider router={router} />
              }
            </AuthConsumer>
          </div>
        </AuthProvider>
      </SnackbarProvider>
    </AvatarProvider>
  </QueryClientProvider>
);

export default App;
