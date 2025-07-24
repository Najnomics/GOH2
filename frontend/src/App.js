import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import { Layout } from './components/common/Layout';

// Pages
import Swap from './pages/Swap';
import Analytics from './pages/Analytics';

// Styles
import './styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-2xl text-gray-600">History Page - Coming Soon</div>
              </div>
            } />
            <Route path="/settings" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-2xl text-gray-600">Settings Page - Coming Soon</div>
              </div>
            } />
          </Routes>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                maxWidth: '500px'
              },
              success: {
                style: {
                  background: '#10b981',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                style: {
                  background: '#6366f1',
                },
              },
            }}
          />
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;