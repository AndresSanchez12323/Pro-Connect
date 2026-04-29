import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { getSession } from '../../../lib/session';

export default function ProfessionalCreateService() {
  const navigate = useNavigate();
  const session = getSession();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mode, setMode] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.profile?.id) {
      setError('No se encontro el perfil profesional activo.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/services', {
        professionalId: session.profile.id,
        name: `${name} - ${description}`,
        price: Math.max(1, Math.round(Number(price || 0))),
        mode,
      });
      navigate('/dashboard/professional/services');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear el servicio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/dashboard/professional/services" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> VOLVER
      </Link>

      <div className="minimal-card p-5 sm:p-8 border-l-4 border-l-primary">
        <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase">Crear Nuevo Servicio</h2>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 font-mono">TITULO DEL SERVICIO</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-primary focus:outline-none font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 font-mono">DESCRIPCION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-primary focus:outline-none font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 font-mono">PRECIO</label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-primary focus:outline-none font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 font-mono">MODALIDAD</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'ONLINE' | 'IN_PERSON')}
                className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-primary focus:outline-none font-mono"
              >
                <option value="ONLINE">EN LINEA</option>
                <option value="IN_PERSON">PRESENCIAL</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <div className="pt-4">
            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-primary text-black font-bold rounded-sm hover:bg-green-400 transition-all font-mono disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> PUBLICAR SERVICIO</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
