import { useEffect, useMemo, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { traducirEstado } from '../../../lib/i18n';

interface InvoiceItem {
  id: string;
  reservationId: string;
  professionalId: string;
  total: number | string;
  issuedAt: string;
  reservation?: {
    id: string;
    status: string;
    service?: {
      name: string;
      price: number | string;
    };
  };
}

interface ReservationForInvoice {
  id: string;
  status: string;
  service: {
    name: string;
    price: number;
  } | null;
}

export default function Invoices() {
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState('');
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [reservations, setReservations] = useState<ReservationForInvoice[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [invoicesRes, reservationsRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/reservations/mine'),
      ]);
      setInvoices((invoicesRes.data as InvoiceItem[]) ?? []);
      setReservations((reservationsRes.data as ReservationForInvoice[]) ?? []);
    } catch {
      setError('No se pudieron cargar las facturas.');
      setInvoices([]);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  async function generateInvoice(reservationId: string) {
    setGeneratingId(reservationId);
    setError('');
    try {
      await api.post(`/invoices/generate/${reservationId}`);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo generar la factura para esta reserva.');
    } finally {
      setGeneratingId('');
    }
  }

  const invoiceReservationIds = useMemo(() => new Set(invoices.map((invoice) => invoice.reservationId)), [invoices]);

  const availableToGenerate = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          !invoiceReservationIds.has(reservation.id) &&
          (reservation.status === 'CONFIRMED' || reservation.status === 'COMPLETED'),
      ),
    [invoiceReservationIds, reservations],
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" /> FACTURACION
      </h2>

      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

      {loading ? (
        <div className="minimal-card p-6 text-sm text-gray-500 font-mono flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando facturas...
        </div>
      ) : (
        <>
          <div className="minimal-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-white font-mono">Generar factura por reserva</h3>
            {availableToGenerate.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">No hay reservas confirmadas o completadas pendientes por facturar.</p>
            ) : (
              <div className="space-y-2">
                {availableToGenerate.map((reservation) => (
                  <div key={reservation.id} className="flex flex-wrap items-center justify-between gap-3 border border-white/10 p-3 rounded-sm">
                    <div>
                      <p className="text-xs text-white font-mono">{reservation.service?.name ?? 'Servicio'}</p>
                      <p className="text-[11px] text-gray-500 font-mono">Reserva {reservation.id.slice(0, 8)}... · {traducirEstado(reservation.status)}</p>
                    </div>
                    <button
                      onClick={() => void generateInvoice(reservation.id)}
                      disabled={generatingId === reservation.id}
                      className="text-xs px-3 py-2 border border-primary/30 text-primary rounded-sm hover:bg-primary/10 disabled:opacity-50"
                    >
                      {generatingId === reservation.id ? 'Generando...' : 'Generar factura'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="minimal-card p-6">
            <h3 className="text-sm font-bold text-white font-mono mb-3">Historial de facturas</h3>
            {invoices.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">Aun no tienes facturas generadas.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border border-white/10 p-3 rounded-sm">
                    <div className="flex justify-between items-center gap-4">
                      <p className="text-xs text-white font-mono">{invoice.reservation?.service?.name ?? 'Servicio facturado'}</p>
                      <p className="text-sm text-primary font-mono font-bold">${Number(invoice.total).toLocaleString()}</p>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono mt-1">
                      Emitida: {new Date(invoice.issuedAt).toLocaleString()} · Reserva {invoice.reservationId.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
