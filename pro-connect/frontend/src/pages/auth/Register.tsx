import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Briefcase, User, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { saveSession } from '../../lib/session';

type UIRole = 'client' | 'professional';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [role, setRole] = useState<UIRole>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'client' || roleParam === 'professional') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const payload = {
        fullName,
        email,
        password,
        birthDate: birthDate || undefined,
        nationalId: nationalId || undefined,
        phone: phone || undefined,
        role: role === 'professional' ? 'PROFESSIONAL' : 'USER',
        specialty: role === 'professional' ? specialty || 'Generalista' : undefined,
        experience: role === 'professional' ? 0 : undefined,
      };

      const { data } = await api.post('/auth/register', payload);
      saveSession(data);

      if (data.user.role === 'PROFESSIONAL') {
        navigate('/dashboard/professional/overview');
      } else {
        navigate('/dashboard/client/overview');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
        <div className="p-8 bg-zinc-900/50 border-r border-white/5 relative hidden md:block">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
          <Link to="/" className="inline-block mb-12 relative z-10">
            <h1 className="text-xl font-bold tracking-tighter text-white">
              ProConnect<span className="text-primary">.</span>
            </h1>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-6 font-mono leading-tight">
            UNETE A LA <br />
            <span className="text-primary">RED PROFESIONAL</span>
          </h2>

          <div className="space-y-6">
            {[
              'Cuenta real persistida en base de datos.',
              'Contrataciones y mensajes por usuario.',
              'Panel personalizado por rol.',
              'Flujo completo cliente-profesional.',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-400 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500/50" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-8 relative">
          <h2 className="text-xl font-bold text-white mb-6 font-mono text-center md:text-left">CREAR_CUENTA</h2>

          <div className="flex bg-black p-1 rounded-sm border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold font-mono transition-all rounded-sm ${role === 'client' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> CLIENTE
            </button>
            <button
              type="button"
              onClick={() => setRole('professional')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold font-mono transition-all rounded-sm ${role === 'professional' ? 'bg-primary text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}
            >
              <Briefcase className="w-4 h-4" /> PROFESIONAL
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nombre</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Apellido</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Crear Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nacimiento</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Teléfono</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Cédula / Documento</label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
              />
            </div>

            {role === 'professional' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Especialidad</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm font-mono"
                  placeholder="Ej: Desarrollo Backend"
                />
              </div>
            )}

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 font-mono tracking-wide mt-4 ${role === 'client' ? 'bg-white text-black hover:bg-gray-200' : 'bg-primary text-black hover:bg-green-400 shadow-[0_0_15px_rgba(0,255,21,0.2)]'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>CREAR_CUENTA <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-white hover:text-primary font-bold transition-colors">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
