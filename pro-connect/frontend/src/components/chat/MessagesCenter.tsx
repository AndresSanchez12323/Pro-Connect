import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Search, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../../lib/api';
import { getCurrentUserId } from '../../lib/session';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ConversationSummary {
  id: string;
  reservationId: string;
  peer: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  messageCount: number;
  lastMessage: ChatMessage | null;
}

interface ReservationSummary {
  id: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  professional: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  userId: string;
}

interface ConversationRow {
  id: string;
  reservationId: string;
  peer: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  messageCount: number;
  lastMessage: ChatMessage | null;
}

interface ConversationDetail {
  reservationId: string;
  messages: ChatMessage[];
}

export default function MessagesCenter({ title }: { title: string }) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const userId = getCurrentUserId();

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    if (selectedReservationId) {
      void loadHistory(selectedReservationId);
    }
  }, [selectedReservationId]);

  useEffect(() => {
    if (!selectedReservationId) {
      return;
    }

    const socketBase = (api.defaults.baseURL ?? 'http://localhost:3002/api').replace(/\/api\/?$/, '');
    const socket = io(socketBase, {
      transports: ['websocket'],
      extraHeaders: userId ? { 'x-user-id': userId } : undefined,
    });

    socket.emit('joinReservationRoom', { reservationId: selectedReservationId });

    socket.on('chatMessage', (incoming: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incoming.id)) {
          return prev;
        }
        return [...prev, incoming];
      });
      void loadConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedReservationId, userId]);

  async function loadConversations() {
    setLoading(true);
    setError('');

    try {
      const [conversationsRes, reservationsRes] = await Promise.all([
        api.get('/chat/mine'),
        api.get('/reservations/mine'),
      ]);

      const convs = (conversationsRes.data as ConversationSummary[]) ?? [];
      const reservations = (reservationsRes.data as ReservationSummary[]) ?? [];

      const map = new Map<string, ConversationRow>();

      convs.forEach((item) => {
        map.set(item.reservationId, {
          id: item.id,
          reservationId: item.reservationId,
          peer: item.peer,
          messageCount: item.messageCount,
          lastMessage: item.lastMessage,
        });
      });

      reservations.forEach((reservation) => {
        if (!map.has(reservation.id)) {
          const peer = reservation.userId === userId ? reservation.professional : reservation.client;
          map.set(reservation.id, {
            id: `reservation-${reservation.id}`,
            reservationId: reservation.id,
            peer,
            messageCount: 0,
            lastMessage: null,
          });
        }
      });

      const list = [...map.values()];
      setConversations(list);

      const requestedReservationId = searchParams.get('reservationId');
      if (requestedReservationId && list.some((row) => row.reservationId === requestedReservationId)) {
        setSelectedReservationId(requestedReservationId);
      } else if (list.length > 0 && !selectedReservationId) {
        setSelectedReservationId(list[0].reservationId);
      }
    } catch {
      setConversations([]);
      setError('No se pudieron cargar las conversaciones.');
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(reservationId: string) {
    try {
      const { data } = await api.get(`/chat/${reservationId}`);
      const conversation = data as ConversationDetail;
      setMessages(conversation.messages ?? []);
    } catch {
      setMessages([]);
    }
  }

  async function handleSend() {
    if (!selectedReservationId || !text.trim()) {
      return;
    }

    setSending(true);
    setError('');

    try {
      await api.post('/chat/open', { reservationId: selectedReservationId });
      await api.post('/chat/message', {
        reservationId: selectedReservationId,
        content: text.trim(),
      });
      setText('');
      await loadConversations();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  }

  const filteredConversations = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) {
      return conversations;
    }

    return conversations.filter((item) => {
      const fullName = item.peer?.fullName?.toLowerCase() ?? '';
      const email = item.peer?.email?.toLowerCase() ?? '';
      return fullName.includes(normalized) || email.includes(normalized);
    });
  }, [conversations, filter]);

  return (
    <div className="space-y-4 sm:space-y-6 h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-2 sm:mb-6">
        <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" /> {title}
        </h2>
      </div>

      <div className="minimal-card flex-1 flex flex-col md:flex-row overflow-hidden border border-white/5 rounded-sm">
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-black/50 max-h-64 md:max-h-none">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full bg-black border border-white/10 rounded-sm py-2 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-mono"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-xs text-gray-500 font-mono">Aun no tienes conversaciones activas.</div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedReservationId(conversation.reservationId)}
                  className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${conversation.reservationId === selectedReservationId ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-white font-mono">{conversation.peer?.fullName ?? 'Contacto'}</h4>
                    <span className="text-[10px] text-gray-500">{conversation.messageCount}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{conversation.lastMessage?.content ?? 'Sin mensajes'}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-zinc-950/30 min-h-0">
          <div className="p-4 border-b border-white/5 bg-black/40">
            <h4 className="text-sm font-bold text-white font-mono">
              {conversations.find((item) => item.reservationId === selectedReservationId)?.peer?.fullName ?? 'Selecciona una conversación'}
            </h4>
          </div>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-xs text-gray-500 font-mono">No hay mensajes en este chat. Escribe el primero.</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${msg.senderId === userId ? 'bg-primary/10 border-primary/20' : 'bg-zinc-800/50 border-white/5'} p-3 rounded-lg max-w-[88%] sm:max-w-[80%] border`}>
                    <p className="text-xs text-gray-200">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40">
            {error && <p className="text-red-400 text-xs font-mono mb-2">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder="Escribe un mensaje..."
                disabled={!selectedReservationId || sending}
                className="flex-1 bg-black border border-white/10 rounded-sm py-3 px-4 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!selectedReservationId || sending || !text.trim()}
                className="bg-primary hover:bg-green-400 text-black font-bold px-6 py-3 rounded-sm transition-colors text-xs font-mono disabled:opacity-50 w-full sm:w-auto"
              >
                {sending ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
