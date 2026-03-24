import { Link } from 'react-router-dom';
import { Network, Briefcase, Zap, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-sans">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-2">
            <Network className="w-8 h-8 text-primary" />
            ProConnect<span className="text-primary">.</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 rounded-sm text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all font-mono">
              INICIAR SESIÓN
            </Link>
            <Link to="/register" className="px-6 py-2 rounded-sm bg-primary text-black text-sm font-bold hover:bg-green-400 transition-all font-mono tracking-wide shadow-[0_0_15px_rgba(0,255,21,0.3)]">
              REGISTRARSE
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,21,0.1),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest font-mono">
              SISTEMA_LISTO_V2.0
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
              CONECTA CON <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600 text-shadow-neon">TALENTO DE ÉLITE</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
              La red neuronal para profesionales de próxima generación. Contrata expertos de primer nivel o monetiza tus habilidades en un ecosistema descentralizado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Link to="/register?role=client" className="group px-8 py-4 bg-primary text-black font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(0,255,21,0.4)]">
                 <Zap className="w-5 h-5 fill-black" />
                 CONTRATAR EXPERTOS
               </Link>
               <Link to="/register?role=professional" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/40 transition-all">
                 <Briefcase className="w-5 h-5 text-primary" />
                 OFRECER SERVICIOS
               </Link>
            </div>
          </div>
          
          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-xl blur-3xl opacity-50"></div>
             <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                      <div className="h-40 bg-zinc-900/50 rounded-lg border border-white/5 p-4 flex flex-col justify-end">
                         <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mb-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                         </div>
                         <div className="h-2 w-20 bg-white/10 rounded mb-2"></div>
                         <div className="h-2 w-12 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-24 bg-zinc-900/50 rounded-lg border border-white/5"></div>
                   </div>
                   <div className="space-y-4 pt-8">
                      <div className="h-24 bg-zinc-900/50 rounded-lg border border-white/5"></div>
                      <div className="h-40 bg-gradient-to-b from-primary/10 to-transparent rounded-lg border border-primary/20 p-4 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_var(--color-primary)]"></div>
                         <div className="mt-auto">
                            <div className="text-2xl font-bold font-mono text-white mb-1">98%</div>
                            <div className="text-xs text-primary font-mono tracking-widest">TASA_DE_ÉXITO</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
