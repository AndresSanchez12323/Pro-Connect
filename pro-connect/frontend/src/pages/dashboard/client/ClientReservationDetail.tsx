import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { api } from '../../../lib/api';
import { traducirEstado, traducirModalidad } from '../../../lib/i18n';

interface ReservationDetail {
  id: string;
  status: string;
  scheduledAt: string;
  mode: string;
  onlineLink: string | null;
  travelAddress: string | null;
  professionalProfileId: string;
  service: { name: string; price: number } | null;
  professional: { fullName: string; email: string } | null;
}

interface ReputationData {
  average: number;
  count: number;
}

export default function ClientReservationDetail() {
  const { reservationId } = useParams();
  const [item, setItem] = useState<ReservationDetail | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [reputation, setReputation] = useState<ReputationData | null>(null);

  useEffect(() => {
    void load();
  }, [reservationId]);

  async function load() {
    try {
      const { data } = await api.get('/reservations/mine');
      const found = (data as ReservationDetail[]).find((row) => row.id === reservationId) ?? null;
      setItem(found);

      if (found?.professionalProfileId) {
        const reputationRes = await api.get(`/reputation/${found.professionalProfileId}`);
        setReputation(reputationRes.data as ReputationData);
      } else {
        setReputation(null);
      }
    } catch {
      setItem(null);
      setReputation(null);
    }
  }

  async function handleGenerateInvoice() {
    if (!item) return;
    setError('');
    setFeedback('');
    try {
      await api.post(`/invoices/generate/${item.id}`);
      setFeedback('Factura generada correctamente. Puedes verla en la sección Facturas.');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo generar la factura.');
    }
  }

  async function handleReviewSubmit(e: FormEvent) {
    e.preventDefault();
    if (!item) return;

    setError('');
    setFeedback('');
    try {
      await api.post('/reviews', {
        professionalId: item.professionalProfileId,
        rating,
        comment,
      });
      setComment('');
      setFeedback('Calificación enviada correctamente.');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar la calificación.');
    }
  }

  if (!item) {
    return <div className="minimal-card p-6 text-sm text-gray-500">Reserva no encontrada.</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/client/hiring" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Volver a contrataciones
      </Link>

      <div className="minimal-card p-6 space-y-4">
        <h1 className="text-xl font-semibold text-white">Detalle de Contrato</h1>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Servicio</p>
            <p className="text-white">{item.service?.name ?? 'Servicio'}</p>
          </div>
          <div>
            <p className="text-gray-400">Profesional</p>
            <p className="text-white">{item.professional?.fullName ?? 'Profesional'}</p>
            <p className="text-gray-500">{item.professional?.email ?? ''}</p>
          </div>
          <div>
            <p className="text-gray-400">Estado</p>
            <p className="text-white">{traducirEstado(item.status)}</p>
          </div>
          <div>
            <p className="text-gray-400">Modalidad</p>
            <p className="text-white">{traducirModalidad(item.mode)}</p>
          </div>
        </div>

        <div className="rounded-md border border-white/10 p-4 bg-black/20 text-sm text-gray-300 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" /> {new Date(item.scheduledAt).toLocaleString()}
        </div>

        {item.onlineLink && (
          <div className="text-sm">
            <p className="text-gray-400">Enlace online</p>
            <p className="text-white break-all">{item.onlineLink}</p>
          </div>
        )}

        {item.travelAddress && (
          <div className="text-sm">
            <p className="text-gray-400">Dirección</p>
            <p className="text-white">{item.travelAddress}</p>
          </div>
        )}

        <div className="border-t border-white/10 pt-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">Facturación</h2>
          <button
            onClick={() => void handleGenerateInvoice()}
            disabled={item.status !== 'CONFIRMED' && item.status !== 'COMPLETED'}
            className="text-xs px-3 py-2 border border-primary/30 text-primary rounded-sm hover:bg-primary/10 disabled:opacity-50"
          >
            Generar factura de esta reserva
          </button>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">Reputación del profesional</h2>
          <p className="text-xs text-gray-400">
            Promedio actual: {reputation ? reputation.average.toFixed(1) : '0.0'} ({reputation?.count ?? 0} reseñas)
          </p>

          {item.status === 'COMPLETED' && (
            <form onSubmit={handleReviewSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Calificación</label>
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="bg-black border border-white/10 rounded-sm px-2 py-1 text-xs text-white"
                >
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                required
                placeholder="Comparte tu experiencia con este profesional"
                className="w-full bg-black border border-white/10 rounded-sm p-2 text-xs text-white min-h-20"
              />
              <button type="submit" className="text-xs px-3 py-2 border border-white/20 text-white rounded-sm hover:bg-white/10">
                Publicar reseña
              </button>
            </form>
          )}
        </div>

        {feedback && <p className="text-xs text-emerald-400">{feedback}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}
