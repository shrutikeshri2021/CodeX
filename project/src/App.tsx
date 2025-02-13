import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthForm } from '@/components/AuthForm';
import { SignupForm } from '@/components/SignupForm';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return authenticated ? (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen w-full bg-background">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <AuthLayout>
                  <AuthForm />
                </AuthLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthLayout>
                  <SignupForm />
                </AuthLayout>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatInterface />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;