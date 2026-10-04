import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { InventoryPage } from './pages/InventoryPage';
import { DashboardPage } from './pages/DashboardPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenCreateWorkOrder={() => setIsCreateOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/"
            element={
              <WorkOrdersPage
                onOpenCreateModal={() => setIsCreateOpen(true)}
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
              />
            }
          />
          <Route
            path="/work-orders"
            element={
              <WorkOrdersPage
                onOpenCreateModal={() => setIsCreateOpen(true)}
                isCreateOpen={isCreateOpen}
                setIsCreateOpen={setIsCreateOpen}
              />
            }
          />
          {(user?.role === 'MANAGER' || user?.role === 'DISPATCHER') && (
            <Route path="/dashboard" element={<DashboardPage />} />
          )}
          {user?.role !== 'CUSTOMER' && (
            <>
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
