import { useState, useEffect } from 'react';
import { Search, Star, ArrowRight, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { traducirModalidad } from '../../lib/i18n';

interface Service {
  id: string;
  name: string;
  price: number | string;
  mode: 'ONLINE' | 'IN_PERSON';
}

interface Professional {
  id: string;
  specialty: string;
  user?: {
    fullName: string;
    email: string;
  };
  services?: Service[];
}

interface ReputationSummary {
  average: number;
  count: number;
}

export default function ServicesView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reputationMap, setReputationMap] = useState<Record<string, ReputationSummary>>({});

  useEffect(() => {
    void handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/professionals/search', {
        params: { specialty: searchTerm },
      });
      const normalized = (data as Professional[]) ?? [];
      setProfessionals(normalized);

      const reputationEntries = await Promise.all(
        normalized.map(async (professional) => {
          try {
            const reputation = await api.get(`/reputation/${professional.id}`);
            const payload = reputation.data as { average: number; count: number };
            return [professional.id, { average: payload.average ?? 0, count: payload.count ?? 0 }] as const;
          } catch {
            return [professional.id, { average: 0, count: 0 }] as const;
          }
        }),
      );

      setReputationMap(Object.fromEntries(reputationEntries));
    } catch {
      setProfessionals([]);
      setReputationMap({});
      setError('No se pudo consultar profesionales en este momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (professional: Professional) => {
    let selectedService = professional.services?.[0];

    if (!selectedService) {
      try {
        const { data } = await api.get(`/professionals/${professional.id}/services`);
        const services = (data as Service[]) ?? [];
        selectedService = services[0];
      } catch {
        selectedService = undefined;
      }
    }

    if (!selectedService) {
      setError('Este profesional aún no tiene servicios publicados para contratar.');
      return;
    }

    const params = new URLSearchParams({
      professionalId: professional.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      professionalName: professional.user?.fullName ?? 'Profesional',
      specialty: professional.specialty,
      price: String(selectedService.price),
      mode: selectedService.mode,
    });

    navigate(`/dashboard/client/checkout?${params.toString()}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="minimal-card p-10 text-center space-y-4 bg-black relative overflow-hidden border-b-4 border-primary/50">
        <div className="absolute top-0 w-full h-full bg-[linear-gradient(to_right,#0f2b15_1px,transparent_1px),linear-gradient(to_bottom,#0f2b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <h2 className="text-3xl font-black text-white relative z-10 font-mono tracking-tighter uppercase mb-2">
          Buscar <span className="text-primary text-shadow-neon">Nodo_Experto</span>
        </h2>

        <div className="relative max-w-xl mx-auto flex items-center z-10 group">
          <Search className="absolute left-4 w-5 h-5 text-primary group-focus-within:animate-pulse" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleSearch()}
            placeholder="Buscar por especialidad, rol o ID de nodo..."
            className="w-full py-4 pl-12 pr-32 bg-black border border-primary/40 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary text-green-400 placeholder-green-800 transition-all font-mono tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.1)]"
          />
          <button
            onClick={() => void handleSearch()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-green-400 text-black rounded-sm text-sm font-bold transition-all shadow-[0_0_10px_var(--color-primary)] font-mono uppercase tracking-wider"
          >
            EJECUTAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error && <div className="text-center py-2 text-red-400 text-xs font-mono">{error}</div>}
        {loading ? (
          <div className="text-center py-10 text-green-500 font-mono">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4 scale-150"></div>
            Inicializando consulta de busqueda...
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-mono">
            No se encontraron profesionales para esta búsqueda.
          </div>
        ) : (
          professionals.map((pro) => {
            const service = pro.services?.[0];
            const reputation = reputationMap[pro.id] ?? { average: 0, count: 0 };
            const rating = reputation.count > 0 ? reputation.average.toFixed(1) : '0.0';
            return (
              <div key={pro.id} className="minimal-card p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-primary/60 hover:bg-black/80 transition-all">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${pro.user?.fullName ?? 'Pro'}`}
                  alt={pro.user?.fullName ?? 'Profesional'}
                  className="w-16 h-16 rounded-sm bg-black border border-primary/30 object-cover shadow-[0_0_10px_rgba(0,255,0,0.1)] group-hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] transition-all grayscale group-hover:grayscale-0"
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                    <h3 className="font-bold text-xl text-gray-200 group-hover:text-primary transition-colors font-mono tracking-tight">{pro.user?.fullName ?? 'Profesional'}</h3>
                    <div className="flex items-center gap-1 text-black bg-primary px-2 py-0.5 rounded-sm text-xs font-bold mt-1 sm:mt-0 shadow-lg font-mono">
                      <Star className="w-3.5 h-3.5 fill-black" />
                      {rating} ({reputation.count})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start text-green-600 font-mono text-xs mb-3">
                    <Code className="w-3 h-3" />
                    <span>{pro.specialty.toUpperCase()}</span>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3 text-[10px] text-gray-500 font-bold font-mono uppercase">
                    <span className="bg-primary/5 px-2 py-1 border border-primary/20 text-primary">{traducirModalidad(service?.mode ?? 'ONLINE')}</span>
                    <span className="bg-primary/5 text-primary px-2 py-1 border border-primary/20 animate-pulse">Disponible_Ahora</span>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:border-none">
                  <span className="text-xl font-bold text-white tracking-tighter font-mono">
                    ${Number(service?.price ?? 0).toLocaleString()} <span className="text-xs text-gray-600 font-normal">/ servicio</span>
                  </span>
                  <button
                    onClick={() => void handleConnect(pro)}
                    className="w-full sm:w-auto px-6 py-2 bg-transparent hover:bg-primary/10 border border-primary text-primary rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
                  >
                    Conectar <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
