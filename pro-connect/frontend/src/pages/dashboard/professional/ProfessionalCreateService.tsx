import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function ProfessionalCreateService() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.post('/services', {
        title: name,
        description,
        price: Math.max(1, Math.round(Number(price || 0))),
        deliveryDays: Math.max(1, Math.round(Number(deliveryDays || 1))),
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
              <label className="text-sm font-bold text-gray-400 font-mono">DIAS ESTIMADOS</label>
              <input
                type="number"
                min="1"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className="w-full bg-black/50 border border-white/10 p-3 rounded-sm text-white focus:border-primary focus:outline-none font-mono"
                required
              />
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
