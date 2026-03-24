import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { api } from '../../../lib/api';
import { traducirEstado } from '../../../lib/i18n';

interface Reservation {
  id: string;
  professional: { fullName: string; email: string } | null;
  service: { name: string } | null;
  status: string;
}

export default function ClientNetwork() {
  const [rows, setRows] = useState<Reservation[]>([]);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await api.get('/reservations/mine');
    setRows((data as Reservation[]) ?? []);
  }

  const contacts = useMemo(() => {
    const map = new Map<string, Reservation>();
    rows.forEach((r) => {
      const key = r.professional?.email ?? r.id;
      if (!map.has(key)) map.set(key, r);
    });
    return [...map.values()];
  }, [rows]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" /> Mi Red Profesional
      </h2>

      {contacts.length === 0 ? (
        <div className="minimal-card p-6 text-sm text-gray-500">Aún no tienes contactos. Crea tu primera reserva para empezar.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((item) => (
            <div key={item.id} className="minimal-card p-5 space-y-3">
              <div>
                <p className="text-white font-medium">{item.professional?.fullName ?? 'Profesional'}</p>
                <p className="text-xs text-gray-400">{item.professional?.email ?? ''}</p>
              </div>
              <p className="text-xs text-gray-400">Servicio: {item.service?.name ?? 'Servicio'}</p>
              <div className="flex gap-2">
                <Link to={`/dashboard/client/hiring/${item.id}`} className="text-xs px-3 py-1 border border-primary/30 text-primary rounded-md hover:bg-primary/10">
                  Ver contrato
                </Link>
                <Link to="/dashboard/client/messages" className="text-xs px-3 py-1 border border-white/20 text-white rounded-md hover:bg-white/5">
                  Mensajes
                </Link>
              </div>
              <span className="inline-block text-[10px] text-gray-400">Estado: {traducirEstado(item.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
