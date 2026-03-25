import { useEffect, useState } from 'react';
import { Briefcase, CalendarDays } from 'lucide-react';
import { api } from '../../../lib/api';
import { Link } from 'react-router-dom';
import { traducirEstado, traducirModalidad } from '../../../lib/i18n';

interface Reservation {
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
  professional: {
    fullName: string;
    email: string;
  } | null;
}

export default function ClientHiring() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    void loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    try {
      const { data } = await api.get('/reservations/mine');
      setReservations((data as Reservation[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function acceptCounterOffer(id: string) {
    await api.patch(`/reservations/${id}/accept-counter`);
    await loadReservations();
  }

  return (
    <div className="space-y-6">
      <div className="minimal-card p-5 sm:p-10">
        <h2 className="text-lg sm:text-2xl font-bold text-white mb-6 font-mono flex items-center gap-3 break-words">
          <Briefcase className="w-8 h-8 text-primary" />
          REGISTRO_DE_CONTRATACIONES
        </h2>

        {loading ? (
          <div className="h-40 bg-black/30 mt-6 rounded border border-white/5 flex items-center justify-center">
            <span className="text-xs font-mono text-gray-600 animate-pulse">Cargando contratos...</span>
          </div>
        ) : reservations.length === 0 ? (
          <p className="text-gray-500">No tienes contratos activos todavia.</p>
        ) : (
          <div className="space-y-3">
            {reservations.map((item) => (
              <div key={item.id} className="bg-black/40 border border-white/5 p-4 rounded-sm hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div>
                    <Link to={`/dashboard/client/hiring/${item.id}`} className="text-white font-bold font-mono hover:text-primary break-words">
                      {item.service?.name ?? 'Servicio'}
                    </Link>
                    <p className="text-xs text-gray-500 break-words">Con: {item.professional?.fullName ?? 'Profesional'}</p>
                    <p className="text-xs text-gray-500 break-all">{item.professional?.email ?? ''}</p>
                    {item.negotiationMessage && <p className="text-xs text-amber-300 mt-1">Tu mensaje: {item.negotiationMessage}</p>}
                    {item.proposedPrice && <p className="text-xs text-amber-300">Tu oferta: ${item.proposedPrice.toLocaleString()}</p>}
                    {item.counterOfferPrice && <p className="text-xs text-sky-300">Contraoferta profesional: ${item.counterOfferPrice.toLocaleString()}</p>}
                    {item.counterOfferMessage && <p className="text-xs text-sky-300">Nota: {item.counterOfferMessage}</p>}
                  </div>
                  <span className="text-xs font-mono px-2 py-1 border border-primary/20 text-primary bg-primary/5 rounded-sm self-start sm:self-auto">{traducirEstado(item.status)}</span>
                </div>
                <div className="mt-3 text-xs text-gray-400 font-mono flex flex-wrap items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> {new Date(item.scheduledAt).toLocaleString()} - {traducirModalidad(item.mode)}
                </div>
                {item.status === 'PENDING' && item.counterOfferPrice && (
                  <button onClick={() => void acceptCounterOffer(item.id)} className="mt-3 text-xs px-3 py-1.5 border border-green-600 text-green-400 rounded hover:bg-green-900/20">
                    Aceptar contraoferta
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
