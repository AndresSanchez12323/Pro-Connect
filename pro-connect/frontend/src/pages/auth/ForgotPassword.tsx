import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/recover-password/request', { email });
      setMessage(`Código generado. ${data.recoveryCode ? `Código de prueba: ${data.recoveryCode}` : ''}`.trim());
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo generar el código.');
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/recover-password/reset', { email, code, newPassword });
      setMessage(data.message ?? 'Contraseña actualizada.');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo restablecer la contraseña.');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-xl p-5 sm:p-8 space-y-6">
        <h1 className="text-xl font-bold text-white">Recuperar contraseña</h1>

        <form onSubmit={requestCode} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full bg-black/50 border border-white/10 rounded-sm py-3 px-4 text-white"
          />
          <button type="submit" className="w-full py-2 bg-primary text-black rounded-sm font-semibold">
            Solicitar código
          </button>
        </form>

        <form onSubmit={resetPassword} className="space-y-3">
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código recibido"
            className="w-full bg-black/50 border border-white/10 rounded-sm py-3 px-4 text-white"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full bg-black/50 border border-white/10 rounded-sm py-3 px-4 text-white"
          />
          <button type="submit" className="w-full py-2 bg-white text-black rounded-sm font-semibold">
            Restablecer contraseña
          </button>
        </form>

        {message && <p className="text-emerald-400 text-sm">{message}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Link to="/login" className="text-primary text-sm hover:underline inline-block">
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
