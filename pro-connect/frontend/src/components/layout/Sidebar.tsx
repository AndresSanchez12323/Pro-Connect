import { Link, useLocation } from 'react-router-dom';
import { getSession } from '../../lib/session';
import { traducirRol } from '../../lib/i18n';

export default function Sidebar() {
  const session = getSession();
  const location = useLocation();
  const isProfessional = location.pathname.includes('/professional');
  const basePath = isProfessional ? '/dashboard/professional' : '/dashboard/client';

  const shortcuts = isProfessional
    ? [
        { label: 'Servicios', to: `${basePath}/services` },
        { label: 'Nuevo servicio', to: `${basePath}/create-service` },
        { label: 'Trabajos', to: `${basePath}/network` },
        { label: 'Facturas', to: `${basePath}/invoices` },
      ]
    : [
        { label: 'Explorar servicios', to: `${basePath}/search` },
        { label: 'Mis contratos', to: `${basePath}/hiring` },
        { label: 'Mi red', to: `${basePath}/network` },
        { label: 'Facturas', to: `${basePath}/invoices` },
      ];

  return (
    <aside className="sticky top-24 space-y-4">
      <div className="minimal-card p-5 border border-white/10">
        <h2 className="text-white font-semibold">{session?.user.fullName ?? 'Usuario'}</h2>
        <p className="text-xs text-gray-400 mt-1">{session?.user.email ?? ''}</p>
        <p className="text-xs text-primary mt-2">Rol: {traducirRol(session?.user.role ?? 'N/A')}</p>
      </div>

      <div className="minimal-card p-4 border border-white/10">
        <p className="text-sm text-gray-300 mb-3">Accesos rápidos</p>
        <div className="space-y-2">
          {shortcuts.map((item) => (
            <Link key={item.to} to={item.to} className="block text-sm px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
