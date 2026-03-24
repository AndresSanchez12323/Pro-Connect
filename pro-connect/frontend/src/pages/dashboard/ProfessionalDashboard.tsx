import DashboardLayout from '../../components/layout/DashboardLayout';
import { Outlet } from 'react-router-dom';

export default function ProfessionalDashboard() {
  return (
    <DashboardLayout>
        <Outlet />
    </DashboardLayout>
  );
}
