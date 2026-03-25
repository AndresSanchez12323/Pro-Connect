import { useEffect, useState } from 'react';
import { ClipboardList, CalendarDays, Ban } from 'lucide-react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';
import { traducirEstado, traducirModalidad } from '../../../lib/i18n';

interface Job {
  id: string;
  status: string;
  scheduledAt: string;
  mode: string;
  proposedPrice: number | null;
  negotiationMessage: string | null;
  counterOfferPrice: number | null;
  counterOfferMessage: string | null;
  service: {
    name: string;
    price: number;
  } | null;
  client: {
    fullName: string;
    email: string;
  } | null;
}

export default function ProfessionalNetwork() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    void loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    try {
      const { data } = await api.get('/reservations/mine');
      setJobs((data as Job[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(id: string) {
    await api.patch(`/reservations/${id}/cancel`);
    await loadJobs();
  }

  async function respondReservation(id: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER') {
    let counterPrice: number | undefined;
    let counterMessage: string | undefined;

    if (action === 'COUNTER') {
      const priceInput = window.prompt('Ingrese el precio de contraoferta:');
      if (!priceInput) return;
      const parsed = Number(priceInput);
      if (!Number.isFinite(parsed) || parsed <= 0) return;
      counterPrice = parsed;
      counterMessage = window.prompt('Mensaje de negociación (opcional):') ?? undefined;
    }

    await api.patch(`/reservations/${id}/respond`, {
      action,
      counterPrice,
      counterMessage,
    });
    await loadJobs();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-primary" /> TRABAJOS_ASIGNADOS
      </h2>

      {loading ? (
        <div className="minimal-card p-6 text-sm text-gray-500 font-mono">Cargando trabajos...</div>
      ) : jobs.length === 0 ? (
        <div className="minimal-card p-6 text-sm text-gray-500 font-mono">No tienes trabajos asignados por ahora.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="minimal-card p-5 sm:p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase break-words">{job.service?.name ?? 'Servicio'}</h3>
                  <p className="text-xs text-gray-500 font-mono break-words">Cliente: {job.client?.fullName ?? 'Sin nombre'}</p>
                  <p className="text-xs text-gray-500 font-mono break-all">{job.client?.email ?? ''}</p>
                  <div className="mt-2 text-xs text-gray-400 font-mono flex flex-wrap items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> {new Date(job.scheduledAt).toLocaleString()} - {traducirModalidad(job.mode)}
                  </div>
                  {job.negotiationMessage && (
                    <p className="mt-2 text-xs text-amber-300">Oferta del cliente: {job.negotiationMessage}</p>
                  )}
                  {job.proposedPrice && (
                    <p className="text-xs text-amber-300">Precio propuesto cliente: ${job.proposedPrice.toLocaleString()}</p>
                  )}
                  {job.counterOfferPrice && (
                    <p className="text-xs text-sky-300">Contraoferta actual: ${job.counterOfferPrice.toLocaleString()}</p>
                  )}
                </div>

                <div className="text-left md:text-right space-y-2 w-full md:w-auto">
                  <span className="text-[10px] text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded-sm inline-block">{traducirEstado(job.status)}</span>
                  <p className="text-xs text-gray-300 font-mono">${Number(job.service?.price ?? 0).toLocaleString()}</p>
                  <Link to={`/dashboard/professional/network/${job.id}`} className="block text-xs px-3 py-1.5 border border-primary/30 text-primary rounded hover:bg-primary/10 text-center">
                    Ver detalle
                  </Link>
                  {job.status !== 'CANCELLED' && (
                    <button
                      onClick={() => void cancelReservation(job.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-black/50 hover:bg-red-900/30 text-red-400 border border-red-900/30 rounded text-xs transition-colors font-mono"
                    >
                      <Ban className="w-3 h-3" /> CANCELAR
                    </button>
                  )}
                  {job.status === 'PENDING' && (
                    <>
                      <button onClick={() => void respondReservation(job.id, 'ACCEPT')} className="w-full text-xs px-3 py-1.5 border border-green-600 text-green-400 rounded hover:bg-green-900/20">
                        Aceptar oferta
                      </button>
                      <button onClick={() => void respondReservation(job.id, 'COUNTER')} className="w-full text-xs px-3 py-1.5 border border-sky-600 text-sky-400 rounded hover:bg-sky-900/20">
                        Contraofertar
                      </button>
                      <button onClick={() => void respondReservation(job.id, 'REJECT')} className="w-full text-xs px-3 py-1.5 border border-red-600 text-red-400 rounded hover:bg-red-900/20">
                        Rechazar oferta
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
