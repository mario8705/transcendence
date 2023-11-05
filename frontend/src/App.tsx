import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthConsumer, AuthProvider } from './contexts/AuthContext';
import { router } from './router';

import Navigation from './components/Navigation/Navigation';

import './App.css';
import SocketContextComponent from './components/Socket/Context/Component';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
