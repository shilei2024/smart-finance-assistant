import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './store';
import Router from './router';
import ErrorBoundary from './components/common/ErrorBoundary';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 10 * 60 * 1000, // 10分钟
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
