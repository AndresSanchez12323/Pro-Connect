import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { traducirEstado, traducirModalidad } from '../../../lib/i18n';

interface JobDetail {
  id: string;
  status: string;
  scheduledAt: string;
  mode?: string;
  onlineLink?: string | null;
  travelAddress?: string | null;
  price: number | string;
  terms?: string;
  changesNote?: string | null;
  service: { title?: string; name?: string; price: number | string; deliveryDays?: number } | null;
  client: { fullName: string; email: string } | null;
}

export default function ProfessionalJobDetail() {
  const { reservationId } = useParams();
  const [item, setItem] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void load();
  }, [reservationId]);

  async function load() {
    if (!reservationId) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/contracts/${reservationId}`);
      setItem(data as JobDetail);
    } catch (err: any) {
      setItem(null);
      setError(err?.response?.data?.message ?? 'No se pudo cargar este trabajo.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="minimal-card p-6 text-sm text-gray-500">Cargando trabajo...</div>;
  }

  if (!item) {
    return <div className="minimal-card p-6 text-sm text-gray-500">{error || 'Trabajo no encontrado.'}</div>;
  }

  const serviceName = item.service?.title ?? item.service?.name ?? 'Servicio';

  return (
    <div className="space-y-6">
      <Link to="/dashboard/professional/network" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Volver a trabajos
      </Link>

      <div className="minimal-card p-6 space-y-4">
        <h1 className="text-xl font-semibold text-white">Detalle del Trabajo</h1>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Servicio</p>
            <p className="text-white">{serviceName}</p>
          </div>
          <div>
            <p className="text-gray-400">Cliente</p>
            <p className="text-white">{item.client?.fullName ?? 'Cliente'}</p>
            <p className="text-gray-500">{item.client?.email ?? ''}</p>
          </div>
          <div>
            <p className="text-gray-400">Estado</p>
            <p className="text-white">{traducirEstado(item.status === 'SENT' ? 'PENDING' : item.status)}</p>
          </div>
          <div>
            <p className="text-gray-400">Modalidad</p>
            <p className="text-white">{traducirModalidad(item.mode ?? 'ONLINE')}</p>
          </div>
          <div>
            <p className="text-gray-400">Valor acordado</p>
            <p className="text-white">${Number(item.price).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400">Entrega estimada</p>
            <p className="text-white">{item.service?.deliveryDays ?? 3} dias</p>
          </div>
        </div>

        <div className="rounded-md border border-white/10 p-4 bg-black/20 text-sm text-gray-300 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> {new Date(item.scheduledAt).toLocaleString()}
        </div>

        {item.terms && (
          <div className="text-sm">
            <p className="text-gray-400">Condiciones del cliente</p>
            <p className="text-white break-words">{item.terms}</p>
          </div>
        )}

        {item.changesNote && (
          <div className="text-sm">
            <p className="text-gray-400">Cambios propuestos</p>
            <p className="text-white break-words">{item.changesNote}</p>
          </div>
        )}

        {item.onlineLink && (
          <div className="text-sm">
            <p className="text-gray-400">Enlace online</p>
            <p className="text-white break-all">{item.onlineLink}</p>
          </div>
        )}

        {item.travelAddress && (
          <div className="text-sm">
            <p className="text-gray-400">Dirección</p>
            <p className="text-white">{item.travelAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
}
