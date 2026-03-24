import { useEffect, useState } from 'react';
import { BarChart, Plus, Bell, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { getSession } from '../../../lib/session';
import { traducirEstado } from '../../../lib/i18n';

interface ProfessionalSummary {
  servicesCount: number;
  activeJobs: number;
  unreadNotifications: number;
  estimatedRevenue: number;
  recentJobs: Array<{
    id: string;
    status: string;
    scheduledAt: string;
    clientName: string;
    serviceName: string;
  }>;
}

export default function ProfessionalOverview() {
  const session = getSession();
  const [summary, setSummary] = useState<ProfessionalSummary | null>(null);

  useEffect(() => {
    void loadSummary();
  }, []);

  async function loadSummary() {
    const { data } = await api.get('/dashboard/professional/summary');
    setSummary(data as ProfessionalSummary);
  }

  return (
    <div className="space-y-6">
      <div className="minimal-card p-6 border border-white/10">
        <h1 className="text-2xl font-semibold text-white mb-1">Panel profesional de {session?.user.fullName ?? 'Profesional'}</h1>
        <p className="text-sm text-gray-400">Gestiona servicios, trabajos y comunicación en módulos separados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/dashboard/professional/services" className="minimal-card p-5 hover:border-primary/40 transition-all">
          <p className="text-xs text-gray-400">Servicios</p>
          <p className="text-2xl font-semibold text-white">{summary?.servicesCount ?? 0}</p>
        </Link>
        <Link to="/dashboard/professional/network" className="minimal-card p-5 hover:border-primary/40 transition-all">
          <p className="text-xs text-gray-400">Trabajos activos</p>
          <p className="text-2xl font-semibold text-white">{summary?.activeJobs ?? 0}</p>
        </Link>
        <Link to="/dashboard/professional/notifications" className="minimal-card p-5 hover:border-primary/40 transition-all">
          <p className="text-xs text-gray-400">No leídas</p>
          <p className="text-2xl font-semibold text-white">{summary?.unreadNotifications ?? 0}</p>
        </Link>
        <div className="minimal-card p-5">
          <p className="text-xs text-gray-400">Ingreso estimado</p>
          <p className="text-2xl font-semibold text-white">${Number(summary?.estimatedRevenue ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/dashboard/professional/create-service" className="minimal-card p-5 flex items-center gap-3 hover:border-primary/40 transition-all">
          <Plus className="w-5 h-5 text-primary" />
          <div>
            <p className="text-white font-medium">Crear nuevo servicio</p>
            <p className="text-xs text-gray-400">Publica una oferta con precio y modalidad</p>
          </div>
        </Link>
        <Link to="/dashboard/professional/settings" className="minimal-card p-5 flex items-center gap-3 hover:border-primary/40 transition-all">
          <BarChart className="w-5 h-5 text-primary" />
          <div>
            <p className="text-white font-medium">Configurar perfil</p>
            <p className="text-xs text-gray-400">Actualiza tus datos visibles en la plataforma</p>
          </div>
        </Link>
      </div>

      <div className="minimal-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Últimos trabajos
          </h2>
          <Link to="/dashboard/professional/network" className="text-xs text-primary hover:underline">Ver todos</Link>
        </div>

        {summary?.recentJobs?.length ? (
          <div className="space-y-2">
            {summary.recentJobs.map((job) => (
              <Link key={job.id} to={`/dashboard/professional/network/${job.id}`} className="block rounded-md border border-white/10 p-3 hover:border-primary/40 transition-colors">
                <p className="text-white text-sm font-medium">{job.serviceName}</p>
                <p className="text-xs text-gray-400">{job.clientName} • {new Date(job.scheduledAt).toLocaleString()}</p>
                <span className="text-[10px] text-gray-500">Estado: {traducirEstado(job.status)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aún no tienes trabajos registrados.</p>
        )}
      </div>

      <div className="minimal-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Bell className="w-4 h-4 text-primary" /> Recordatorio: revisa tus mensajes antes de cada sesión.
        </div>
        <Link to="/dashboard/professional/messages" className="text-xs px-3 py-1 rounded-md border border-primary/30 text-primary hover:bg-primary/10">
          Ir a mensajes
        </Link>
      </div>
    </div>
  );
}
