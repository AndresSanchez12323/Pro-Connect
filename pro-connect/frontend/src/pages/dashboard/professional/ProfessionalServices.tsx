import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';
import { getSession } from '../../../lib/session';
import { traducirModalidad } from '../../../lib/i18n';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  mode: string;
  contracts: number;
}

export default function ProfessionalServices() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reputation, setReputation] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    void loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const session = getSession();
      const [servicesRes, reputationRes] = await Promise.all([
        api.get('/services/mine'),
        session?.profile?.id ? api.get(`/reputation/${session.profile.id}`) : Promise.resolve({ data: { average: 0, count: 0 } }),
      ]);
      const data = servicesRes.data;
      setServices((data as ServiceItem[]) ?? []);
      setReputation(reputationRes.data as { average: number; count: number });
    } catch {
      setReputation(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" /> MIS_SERVICIOS
        </h2>
        <Link to="/dashboard/professional/create-service" className="text-xs bg-primary text-black font-bold px-4 py-2 rounded-sm hover:bg-green-400 transition-colors uppercase font-mono w-full sm:w-auto text-center">
          + Nuevo Servicio
        </Link>
      </div>

      <div className="minimal-card p-4 text-xs font-mono text-gray-300">
        Reputacion actual: <span className="text-primary font-bold">{(reputation?.average ?? 0).toFixed(1)}</span> / 5 ({reputation?.count ?? 0} reseñas)
      </div>

      {loading ? (
        <div className="minimal-card p-6 text-gray-500 text-sm font-mono">Cargando servicios...</div>
      ) : services.length === 0 ? (
        <div className="minimal-card p-6 text-gray-500 text-sm font-mono">Aun no has publicado servicios.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.id} className="minimal-card p-5 sm:p-6 border-l-4 border-l-primary/50 group hover:border-l-primary transition-all">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-4">
                <h3 className="text-lg font-bold text-white font-mono break-words">{service.name}</h3>
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20 self-start">ACTIVO</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Modalidad: {traducirModalidad(service.mode)}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t border-white/5 text-xs font-mono text-gray-500">
                <span>{service.contracts} CONTRATOS</span>
                <span className="text-white font-bold">${Number(service.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
