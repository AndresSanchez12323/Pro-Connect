import { useState, useEffect } from 'react';
import { Search, Star, ArrowRight, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number | string;
  deliveryDays: number;
  professionalId: string;
  professional?: {
    id: string;
    specialty: string;
    headline?: string;
    user?: {
      fullName: string;
      email: string;
    };
  };
}

interface ReputationSummary {
  average: number;
  count: number;
}

export default function ServicesView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
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
      const { data } = await api.get('/services', {
        params: searchTerm.trim() ? { q: searchTerm.trim() } : undefined,
      });
      const normalized = (data as Service[]) ?? [];
      setServices(normalized);

      const professionalIds = [...new Set(normalized.map((service) => service.professionalId))];
      const reputationEntries = await Promise.all(
        professionalIds.map(async (professionalId) => {
          try {
            const reputation = await api.get(`/reputation/${professionalId}`);
            const payload = reputation.data as { average: number; count: number };
            return [professionalId, { average: payload.average ?? 0, count: payload.count ?? 0 }] as const;
          } catch {
            return [professionalId, { average: 0, count: 0 }] as const;
          }
        }),
      );

      setReputationMap(Object.fromEntries(reputationEntries));
    } catch {
      setServices([]);
      setReputationMap({});
      setError('No se pudieron consultar servicios en este momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (service: Service) => {
    const params = new URLSearchParams({
      professionalId: service.professionalId,
      serviceId: service.id,
      serviceName: service.title,
      professionalName: service.professional?.user?.fullName ?? 'Profesional',
      specialty: service.professional?.specialty ?? 'Servicio profesional',
      price: String(service.price),
      deliveryDays: String(service.deliveryDays),
    });

    navigate(`/dashboard/client/checkout?${params.toString()}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="minimal-card p-5 sm:p-10 text-center space-y-4 bg-black relative overflow-hidden border-b-4 border-primary/50">
        <div className="absolute top-0 w-full h-full bg-[linear-gradient(to_right,#0f2b15_1px,transparent_1px),linear-gradient(to_bottom,#0f2b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <h2 className="text-2xl sm:text-3xl font-black text-white relative z-10 font-mono tracking-tighter uppercase mb-2 break-words">
          Red de <span className="text-primary text-shadow-neon">Servicios</span>
        </h2>

        <div className="relative max-w-xl mx-auto z-10 group">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:animate-pulse" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSearch()}
              placeholder="Buscar por servicio, descripcion o especialidad..."
              className="w-full py-4 pl-12 pr-4 sm:pr-32 bg-black border border-primary/40 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary text-green-400 placeholder-green-800 transition-all font-mono tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            />
            <button
              onClick={() => void handleSearch()}
              className="w-full sm:w-auto mt-3 sm:mt-0 sm:absolute sm:right-2 sm:top-2 sm:bottom-2 px-6 py-2.5 sm:py-0 bg-primary hover:bg-green-400 text-black rounded-sm text-sm font-bold transition-all shadow-[0_0_10px_var(--color-primary)] font-mono uppercase tracking-wider"
            >
              BUSCAR
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {error && <div className="text-center py-2 text-red-400 text-xs font-mono">{error}</div>}
        {loading ? (
          <div className="text-center py-10 text-green-500 font-mono">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4 scale-150"></div>
            Cargando servicios publicados...
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-mono">
            No se encontraron servicios publicados para esta busqueda.
          </div>
        ) : (
          services.map((service) => {
            const professional = service.professional;
            const reputation = reputationMap[service.professionalId] ?? { average: 0, count: 0 };
            const rating = reputation.count > 0 ? reputation.average.toFixed(1) : '0.0';

            return (
              <div key={service.id} className="minimal-card p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start group hover:border-primary/60 hover:bg-black/80 transition-all">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${professional?.user?.fullName ?? 'Pro'}`}
                  alt={professional?.user?.fullName ?? 'Profesional'}
                  className="w-16 h-16 rounded-sm bg-black border border-primary/30 object-cover shadow-[0_0_10px_rgba(0,255,0,0.1)] group-hover:shadow-[0_0_15px_rgba(0,255,0,0.4)] transition-all grayscale group-hover:grayscale-0"
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-1">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-200 group-hover:text-primary transition-colors font-mono tracking-tight break-words">{service.title}</h3>
                    <div className="flex items-center gap-1 text-black bg-primary px-2 py-0.5 rounded-sm text-xs font-bold mt-1 sm:mt-0 shadow-lg font-mono">
                      <Star className="w-3.5 h-3.5 fill-black" />
                      {rating} ({reputation.count})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start text-green-600 font-mono text-xs mb-2">
                    <Code className="w-3 h-3" />
                    <span>{(professional?.specialty ?? 'SERVICIO PROFESIONAL').toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-words">Por {professional?.user?.fullName ?? 'Profesional'}</p>
                  <p className="mt-2 text-sm text-gray-300 break-words">{service.description}</p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3 text-[10px] text-gray-500 font-bold font-mono uppercase">
                    <span className="bg-primary/5 px-2 py-1 border border-primary/20 text-primary">{service.deliveryDays} DIAS</span>
                    <span className="bg-primary/5 text-primary px-2 py-1 border border-primary/20 animate-pulse">Disponible_Ahora</span>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 sm:border-none">
                  <span className="text-xl font-bold text-white tracking-tighter font-mono">
                    ${Number(service.price ?? 0).toLocaleString()} <span className="text-xs text-gray-600 font-normal">/ servicio</span>
                  </span>
                  <button
                    onClick={() => handleConnect(service)}
                    className="w-full sm:w-auto px-6 py-2 bg-transparent hover:bg-primary/10 border border-primary text-primary rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  >
                    Contratar <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
