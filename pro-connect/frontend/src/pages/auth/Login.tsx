import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { saveSession } from '../../lib/session';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveSession(data);
      if (data.user.role === 'PROFESSIONAL') {
        navigate('/dashboard/professional/overview');
      } else {
        navigate('/dashboard/client/overview');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-xl p-5 sm:p-8 shadow-2xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              ProConnect<span className="text-primary">.</span>
            </h1>
          </Link>
          <h2 className="text-xl font-bold text-white mb-2 font-mono">PUERTA_DE_ACCESO</h2>
          <p className="text-gray-500 text-sm">Ingrese sus credenciales para entrar a su panel real.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 ml-1 font-mono tracking-wider">CORREO_ELECTRONICO</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                placeholder="usuario@dominio.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 ml-1 font-mono tracking-wider">CLAVE_DE_ACCESO</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-sm hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(0,255,21,0.2)] flex items-center justify-center gap-2 font-mono tracking-wide"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>AUTENTICAR <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-sm text-gray-500 mb-2">
            <Link to="/forgot-password" className="text-primary hover:text-green-300 font-bold transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:text-green-300 font-bold transition-colors">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
