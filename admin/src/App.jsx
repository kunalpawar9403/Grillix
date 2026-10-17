import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';

function AdminContent() {
  const { adminUser } = useAdmin();

  if (!adminUser || !adminUser.isLoggedIn) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default function App() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
