import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../../lib/api';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await api.get('/notifications/mine');
    setNotifications((data as NotificationItem[]) ?? []);
  }

  async function markAsRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
    await load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" /> Notificaciones
      </h2>

      {notifications.length === 0 ? (
        <div className="minimal-card p-6 text-sm text-gray-500">No tienes notificaciones todavía.</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="minimal-card p-4 flex gap-3 sm:gap-4 border border-white/10">
              <div className={`p-2 rounded-full h-fit mt-1 ${
                notif.type.includes('CREATED') ? 'bg-green-500/10 text-green-500' :
                notif.type.includes('CANCELLED') ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {notif.type.includes('CREATED') ? <CheckCircle2 className="w-4 h-4" /> :
                 notif.type.includes('CANCELLED') ? <AlertTriangle className="w-4 h-4" /> :
                 <Clock className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3">
                  <h3 className="text-sm font-medium text-white break-words">{notif.title}</h3>
                  <span className="text-[10px] text-gray-500 break-words">{new Date(notif.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1 break-words">{notif.message}</p>
                {!notif.isRead && (
                  <button onClick={() => void markAsRead(notif.id)} className="mt-3 text-xs px-3 py-1 rounded-md border border-primary/30 text-primary hover:bg-primary/10">
                    Marcar como leída
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
