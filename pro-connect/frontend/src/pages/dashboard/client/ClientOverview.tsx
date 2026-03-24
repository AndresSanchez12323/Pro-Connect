import { useEffect, useState } from 'react';
import { Bell, User, Search, Briefcase, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { getSession } from '../../../lib/session';
import { traducirEstado } from '../../../lib/i18n';

interface ClientSummary {
  contractsCount: number;
  unreadNotifications: number;
  recentReservations: Array<{
    id: string;
    status: string;
    scheduledAt: string;
    serviceName: string;
    professionalName: string;
  }>;
}

interface ProfessionalResult {
  id: string;
  specialty: string;
  user?: {
    fullName: string;
  };
}

export default function ClientOverview() {
  const session = getSession();
  const [summary, setSummary] = useState<ClientSummary | null>(null);
  const [recommended, setRecommended] = useState<ProfessionalResult[]>([]);

  useEffect(() => {
    void Promise.all([loadSummary(), loadRecommended()]);
  }, []);

  async function loadSummary() {
    const { data } = await api.get('/dashboard/client/summary');
    setSummary(data as ClientSummary);
  }

  async function loadRecommended() {
    const { data } = await api.get('/professionals/search');
    setRecommended(((data as ProfessionalResult[]) ?? []).slice(0, 3));
  }

  return (
    <div className="space-y-6">
      <div className="minimal-card p-6 border border-white/10">
        <h1 className="text-2xl font-semibold text-white mb-1">Hola, {session?.user.fullName ?? 'Cliente'}</h1>
        <p className="text-sm text-gray-400">Gestiona tus contratos, mensajes y notificaciones desde páginas dedicadas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/client/hiring" className="minimal-card p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
          <div className="p-3 bg-primary/10 rounded-full">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Contratos</h3>
            <p className="text-2xl font-semibold text-white">{summary?.contractsCount ?? 0}</p>
          </div>
        </Link>

        <Link to="/dashboard/client/search" className="minimal-card p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Search className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Explorar</h3>
            <p className="text-2xl font-semibold text-white">{recommended.length}</p>
          </div>
        </Link>

        <Link to="/dashboard/client/notifications" className="minimal-card p-5 flex items-center gap-4 hover:border-primary/40 transition-all">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Bell className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm text-gray-400">No leídas</h3>
            <p className="text-2xl font-semibold text-white">{summary?.unreadNotifications ?? 0}</p>
          </div>
        </Link>
      </div>

      <div className="minimal-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" /> Próximas sesiones
          </h2>
          <Link to="/dashboard/client/hiring" className="text-xs text-primary hover:underline">Ver todo</Link>
        </div>

        {summary?.recentReservations?.length ? (
          <div className="space-y-2">
            {summary.recentReservations.map((item) => (
              <Link key={item.id} to={`/dashboard/client/hiring/${item.id}`} className="block rounded-md border border-white/10 p-3 hover:border-primary/40 transition-colors">
                <p className="text-white text-sm font-medium">{item.serviceName}</p>
                <p className="text-xs text-gray-400">{item.professionalName} • {new Date(item.scheduledAt).toLocaleString()}</p>
                <span className="text-[10px] text-gray-500">Estado: {traducirEstado(item.status)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aún no tienes reservas creadas.</p>
        )}
      </div>

      <div className="minimal-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profesionales recomendados
          </h2>
          <Link to="/dashboard/client/search" className="text-xs text-primary hover:underline">Explorar más</Link>
        </div>

        {recommended.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommended.map((pro) => (
              <div key={pro.id} className="rounded-md border border-white/10 p-4">
                <p className="text-white text-sm font-medium">{pro.user?.fullName ?? 'Profesional'}</p>
                <p className="text-xs text-gray-400">{pro.specialty}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay profesionales disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}
