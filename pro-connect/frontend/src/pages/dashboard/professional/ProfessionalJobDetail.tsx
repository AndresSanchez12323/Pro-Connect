import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { traducirEstado, traducirModalidad } from '../../../lib/i18n';

interface JobDetail {
  id: string;
  status: string;
  scheduledAt: string;
  mode: string;
  onlineLink: string | null;
  travelAddress: string | null;
  service: { name: string; price: number } | null;
  client: { fullName: string; email: string } | null;
}

export default function ProfessionalJobDetail() {
  const { reservationId } = useParams();
  const [item, setItem] = useState<JobDetail | null>(null);

  useEffect(() => {
    void load();
  }, [reservationId]);

  async function load() {
    const { data } = await api.get('/reservations/mine');
    const found = (data as JobDetail[]).find((row) => row.id === reservationId) ?? null;
    setItem(found);
  }

  if (!item) {
    return <div className="minimal-card p-6 text-sm text-gray-500">Trabajo no encontrado.</div>;
  }

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
            <p className="text-white">{item.service?.name ?? 'Servicio'}</p>
          </div>
          <div>
            <p className="text-gray-400">Cliente</p>
            <p className="text-white">{item.client?.fullName ?? 'Cliente'}</p>
            <p className="text-gray-500">{item.client?.email ?? ''}</p>
          </div>
          <div>
            <p className="text-gray-400">Estado</p>
            <p className="text-white">{traducirEstado(item.status)}</p>
          </div>
          <div>
            <p className="text-gray-400">Modalidad</p>
            <p className="text-white">{traducirModalidad(item.mode)}</p>
          </div>
        </div>

        <div className="rounded-md border border-white/10 p-4 bg-black/20 text-sm text-gray-300 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> {new Date(item.scheduledAt).toLocaleString()}
        </div>

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
