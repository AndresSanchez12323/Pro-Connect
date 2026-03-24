import { useState } from 'react';
import { getSession, saveSession } from '../../../lib/session';
import { api } from '../../../lib/api';

export default function ProfileSettings() {
  const session = getSession();
  const [fullName, setFullName] = useState(session?.user.fullName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.patch('/auth/me', { fullName });
      saveSession(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">Configuración de Perfil</h1>
      <form onSubmit={handleSave} className="minimal-card p-6 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nombre completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white"
          />
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-black rounded-md font-medium disabled:opacity-60">
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-emerald-400">Cambios guardados en la base de datos.</p>}
      </form>
    </div>
  );
}
