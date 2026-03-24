import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import { getSession } from './lib/session';

// Contenedores (Layouts que renderizan Outlet)
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ProfessionalDashboard from './pages/dashboard/ProfessionalDashboard';

// Client Pages
import ClientOverview from './pages/dashboard/client/ClientOverview';
import ClientSearch from './pages/dashboard/client/ClientSearch';
import ClientHiring from './pages/dashboard/client/ClientHiring';
import ClientNetwork from './pages/dashboard/client/ClientNetwork';
import ClientServiceCheckout from './pages/dashboard/client/ClientServiceCheckout';
import ClientMessages from './pages/dashboard/client/ClientMessages';
import ClientReservationDetail from './pages/dashboard/client/ClientReservationDetail';

// Professional Pages
import ProfessionalOverview from './pages/dashboard/professional/ProfessionalOverview';
import ProfessionalServices from './pages/dashboard/professional/ProfessionalServices';
import ProfessionalMessages from './pages/dashboard/professional/ProfessionalMessages';
import ProfessionalNetwork from './pages/dashboard/professional/ProfessionalNetwork';
import ProfessionalCreateService from './pages/dashboard/professional/ProfessionalCreateService';
import ProfessionalJobDetail from './pages/dashboard/professional/ProfessionalJobDetail';

import Notifications from './pages/dashboard/shared/Notifications';
import ProfileSettings from './pages/dashboard/shared/ProfileSettings';
import Invoices from './pages/dashboard/shared/Invoices';

import './App.css';

function RequireAuth({ children, role }: { children: ReactNode; role: 'USER' | 'PROFESSIONAL' }) {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (session.user.role !== role) {
    return <Navigate to={session.user.role === 'PROFESSIONAL' ? '/dashboard/professional/overview' : '/dashboard/client/overview'} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Cliente */}
        <Route path="/dashboard/client" element={<RequireAuth role="USER"><ClientDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ClientOverview />} />
          <Route path="search" element={<ClientSearch />} />
          <Route path="hiring" element={<ClientHiring />} />
          <Route path="hiring/:reservationId" element={<ClientReservationDetail />} />
          <Route path="network" element={<ClientNetwork />} />
          <Route path="checkout" element={<ClientServiceCheckout />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<ClientMessages />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>

        {/* Dashboard Profesional */}
        <Route path="/dashboard/professional" element={<RequireAuth role="PROFESSIONAL"><ProfessionalDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProfessionalOverview />} />
          <Route path="services" element={<ProfessionalServices />} />
          <Route path="create-service" element={<ProfessionalCreateService />} />
          <Route path="messages" element={<ProfessionalMessages />} />
          <Route path="network" element={<ProfessionalNetwork />} />
          <Route path="network/:reservationId" element={<ProfessionalJobDetail />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
