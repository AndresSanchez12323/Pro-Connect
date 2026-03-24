import { Bell, Home, MessageSquare, Search, User, Briefcase, Settings, LogOut, ReceiptText } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clearSession, getSession } from '../../lib/session';
import { api } from '../../lib/api';
import { traducirRol } from '../../lib/i18n';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const isProfessional = location.pathname.includes('/professional');
  const basePath = isProfessional ? '/dashboard/professional' : '/dashboard/client';
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const navItems = [
    { id: 'overview', icon: Home, label: 'Inicio', path: `${basePath}/overview` },
    { id: 'network', icon: User, label: isProfessional ? 'Trabajos' : 'Mi red', path: `${basePath}/network` },
    { id: 'services', icon: Briefcase, label: 'Servicios', path: isProfessional ? `${basePath}/services` : `${basePath}/hiring` },
    { id: 'invoices', icon: ReceiptText, label: 'Facturas', path: `${basePath}/invoices` },
    { id: 'messages', icon: MessageSquare, label: 'Mensajes', path: `${basePath}/messages` },
    { id: 'notifications', icon: Bell, label: 'Notificaciones', path: `${basePath}/notifications` },
    { id: 'search', icon: Search, label: 'Explorar', path: `${basePath}/search`, hidden: isProfessional },
    { id: 'settings', icon: Settings, label: 'Ajustes', path: `${basePath}/settings` },
  ].filter((item) => !item.hidden);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  useEffect(() => {
    let active = true;

    async function loadBadges() {
      if (!session?.user.id) {
        return;
      }

      try {
        const { data } = await api.get('/notifications/mine');
        if (!active) return;
        const notifications = (data as Array<{ type: string; isRead: boolean }>) ?? [];
        setUnreadNotifications(notifications.filter((item) => !item.isRead).length);
        setUnreadMessages(notifications.filter((item) => !item.isRead && item.type === 'NEW_CHAT_MESSAGE').length);
      } catch {
        if (!active) return;
        setUnreadMessages(0);
        setUnreadNotifications(0);
      }
    }

    void loadBadges();
    const interval = setInterval(() => {
      void loadBadges();
    }, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [session?.user.id]);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to={`${basePath}/overview`} className="text-xl font-semibold text-white hover:text-primary transition-colors">
            ProConnect
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1 justify-center overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                    isActive ? 'bg-primary/15 text-primary border border-primary/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="relative inline-flex">
                    <item.icon className="w-4 h-4" />
                    {item.id === 'messages' && unreadMessages > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                        {unreadMessages}
                      </span>
                    )}
                    {item.id === 'notifications' && unreadNotifications > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-black text-[10px] leading-4 text-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-gray-100 leading-none">{session?.user.fullName ?? 'Usuario'}</p>
              <p className="text-[11px] text-gray-400 mt-1">{traducirRol(session?.user.role ?? 'VISITANTE')}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-300 hover:text-primary transition-colors p-2 rounded-md hover:bg-white/5" title="Cerrar sesión">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
