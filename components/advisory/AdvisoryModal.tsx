"use client";

import { useEffect, useState } from "react";
import { createAppointment, getAdvisoryAvailability, listProfessionals } from "@/lib/api/courses";
import { getSettings } from "@/lib/api/settings";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { Professional } from "@/lib/api/types";
import Modal from "@/components/ui/Modal";
import LoginModal from "@/components/auth/LoginModal";

interface AdvisoryModalProps {
  onClose: () => void;
}

const FALLBACK_WHATSAPP = "5213329421890";

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Mode = "choose" | "professional" | "schedule";

export default function AdvisoryModal({ onClose }: AdvisoryModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("choose");
  const [showLogin, setShowLogin] = useState(false);
  const [whatsapp, setWhatsapp] = useState(FALLBACK_WHATSAPP);

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    getSettings()
      .then(({ settings }) => {
        if (settings.whatsapp) setWhatsapp(settings.whatsapp.replace(/\D/g, ""));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== "professional") return;
    setLoadingProfessionals(true);
    listProfessionals()
      .then(({ professionals }) => setProfessionals(professionals))
      .catch(() => setProfessionals([]))
      .finally(() => setLoadingProfessionals(false));
  }, [mode]);

  useEffect(() => {
    if (mode !== "schedule" || !selectedProfessional) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAdvisoryAvailability(selectedProfessional.id, date)
      .then(({ slots }) => {
        if (!cancelled) setSlots(slots);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, date, selectedProfessional]);

  const openWhatsapp = (message: string) => {
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const handleDirectWhatsapp = () => {
    openWhatsapp("Hola, me gustaría solicitar un asesoramiento en línea con el equipo de ALIVOS.");
  };

  const handlePickProfessional = (professional: Professional) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedProfessional(professional);
    setMode("schedule");
  };

  const handleBook = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!selectedProfessional || !selectedSlot) return;
    setBooking(true);
    setError(null);
    try {
      const { appointment, purchase, requiresPayment } = await createAppointment({
        professionalId: selectedProfessional.id,
        date,
        time: selectedSlot,
        notes: notes.trim() || undefined,
      });

      if (requiresPayment && purchase?.initPoint) {
        setRedirecting(true);
        window.location.href = purchase.initPoint;
        return;
      }

      setBooked(true);
      openWhatsapp(
        `Hola, agendé una cita de asesoramiento con ${selectedProfessional.name} para el ${appointment.date} a las ${selectedSlot.slice(0, 5)}.${
          notes.trim() ? ` Motivo: ${notes.trim()}` : ""
        }`
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo agendar la cita. Intenta de nuevo.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <Modal title="Solicitar asesoramiento en línea" onClose={onClose} maxWidth="max-w-md">
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {mode === "choose" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">¿Cómo prefieres contactarnos?</p>
          <button
            onClick={() => setMode("professional")}
            className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
          >
            <span className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            <span>
              <span className="block font-semibold text-alivos-dark text-sm">Agendar una cita</span>
              <span className="block text-xs text-slate-500">Elige profesional, día y hora disponible</span>
            </span>
          </button>
          <button
            onClick={handleDirectWhatsapp}
            className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-left"
          >
            <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </span>
            <span>
              <span className="block font-semibold text-alivos-dark text-sm">Ir directo a WhatsApp</span>
              <span className="block text-xs text-slate-500">Chatea con nosotros ahora</span>
            </span>
          </button>
        </div>
      )}

      {mode === "professional" && (
        <div className="space-y-3">
          <button
            onClick={() => setMode("choose")}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            ← Volver
          </button>
          <p className="text-sm text-slate-500">¿Con quién te gustaría agendar?</p>
          {loadingProfessionals ? (
            <p className="text-xs text-slate-400">Cargando profesionales...</p>
          ) : professionals.length === 0 ? (
            <p className="text-xs text-slate-400">
              Todavía no hay profesionales disponibles para agendar en línea. Escríbenos por WhatsApp.
            </p>
          ) : (
            <div className="space-y-2">
              {professionals.map((professional) => (
                <button
                  key={professional.id}
                  onClick={() => handlePickProfessional(professional)}
                  className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-colors text-left"
                >
                  {professional.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={professional.photoUrl}
                      alt={professional.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center shrink-0 text-brand-600 font-bold">
                      {professional.name.charAt(0)}
                    </span>
                  )}
                  <span>
                    <span className="block font-semibold text-alivos-dark text-sm">{professional.name}</span>
                    <span className="block text-xs text-slate-500">{professional.title}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "schedule" && selectedProfessional && !booked && !redirecting && (
        <div className="space-y-4">
          <button
            onClick={() => setMode("professional")}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            ← Cambiar profesional
          </button>
          <p className="text-xs text-slate-500">
            Agendando con <strong className="text-alivos-dark">{selectedProfessional.name}</strong> ({selectedProfessional.title})
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha</label>
            <input
              type="date"
              min={todayIso()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Horarios disponibles</label>
            {loadingSlots ? (
              <p className="text-xs text-slate-400">Cargando disponibilidad...</p>
            ) : slots.length === 0 ? (
              <p className="text-xs text-slate-400">No hay horarios disponibles ese día. Prueba otra fecha.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedSlot === slot
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "border-slate-200 text-slate-600 hover:border-brand-300"
                    }`}
                  >
                    {slot.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Motivo (opcional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              placeholder="Cuéntanos brevemente qué necesitas"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleBook}
            disabled={!selectedSlot || booking}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
          >
            {booking ? "Agendando..." : "Confirmar cita"}
          </button>
        </div>
      )}

      {redirecting && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700">
          Te estamos llevando a Mercado Pago para completar el pago de tu cita...
        </div>
      )}

      {booked && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          ¡Listo! Tu cita quedó registrada para el {date} a las {selectedSlot?.slice(0, 5)}. Nuestro equipo la
          confirmará pronto — también abrimos WhatsApp para que puedas escribirnos directamente.
        </div>
      )}
    </Modal>
  );
}
