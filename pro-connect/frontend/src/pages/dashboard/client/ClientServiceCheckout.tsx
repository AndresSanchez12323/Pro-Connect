import { useMemo, useState } from 'react';
import { ArrowLeft, Play, Shield, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';
import { traducirModalidad } from '../../../lib/i18n';

export default function ClientServiceCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const data = useMemo(() => {
    return {
      professionalId: searchParams.get('professionalId') ?? '',
      serviceId: searchParams.get('serviceId') ?? '',
      professionalName: searchParams.get('professionalName') ?? 'Profesional',
      serviceName: searchParams.get('serviceName') ?? 'Servicio',
      specialty: searchParams.get('specialty') ?? 'Especialidad',
      price: Number(searchParams.get('price') ?? 0),
      mode: (searchParams.get('mode') ?? 'ONLINE') as 'ONLINE' | 'IN_PERSON',
    };
  }, [searchParams]);

  const handleContract = async () => {
    if (!data.professionalId || !data.serviceId || !scheduledAt) {
      setError('Completa fecha/hora y selecciona un servicio valido.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: reservation } = await api.post('/reservations', {
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      navigate(`/dashboard/client/messages?reservationId=${reservation.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo completar la contratacion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/dashboard/client/search" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> CANCELAR
      </Link>

      <div className="minimal-card p-8 border-l-4 border-l-blue-500 max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-2 font-mono uppercase">Confirmar Contratacion</h2>
            <p className="text-gray-400 font-mono text-sm">Contrato inteligente vinculado a reserva</p>
          </div>
          <Shield className="w-12 h-12 text-blue-500 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 font-mono uppercase border-b border-white/5 pb-2">Profesional</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.professionalName}`} alt="Pro" className="w-full h-full rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold font-mono">{data.professionalName}</p>
                <p className="text-xs text-blue-400 font-mono">{data.specialty}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 font-mono uppercase border-b border-white/5 pb-2">Detalles del Servicio</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Servicio Base</span>
                <span className="text-white text-right">{data.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Modalidad</span>
                <span className="text-white text-right">{traducirModalidad(data.mode)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                <span className="text-blue-400 font-bold">TOTAL ESTIMADO</span>
                <span className="text-white font-bold text-right">${data.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs text-gray-400 font-mono block mb-2">FECHA Y HORA DE LA SESION</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:outline-none font-mono"
          />
        </div>

        <div className="bg-black/40 p-4 rounded border border-blue-500/20 mb-8 font-mono text-xs text-gray-400">
          <p className="mb-2">
            <span className="text-blue-400 font-bold">NOTA LEGAL:</span> La reserva se registra en base de datos y habilita canal de mensajes entre cliente y profesional.
          </p>
        </div>

        {error && <p className="text-red-400 text-xs font-mono mb-4">{error}</p>}

        <button
          onClick={() => void handleContract()}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] font-mono flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5 fill-current" /> EJECUTAR CONTRATO</>}
        </button>
      </div>
    </div>
  );
}
