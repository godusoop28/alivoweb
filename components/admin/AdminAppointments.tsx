"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Appointment, AppointmentStatus, Professional } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Modal from "@/components/ui/Modal";

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};
const statusColor: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function PaymentBadge({ appointment }: { appointment: Appointment }) {
  if (appointment.amount == null) {
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">Gratis</span>;
  }
  if (appointment.purchaseStatus === "PAID") {
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Pagada</span>;
  }
  if (appointment.purchaseStatus === "FAILED") {
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Pago fallido</span>;
  }
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pago pendiente</span>;
}

const emptyNewForm = { userEmail: "", professionalId: "", date: "", time: "", notes: "" };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState(emptyNewForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.listAppointments(), adminApi.listAdminProfessionals()])
      .then(([appointmentsRes, professionalsRes]) => {
        setAppointments(appointmentsRes.appointments);
        setProfessionals(professionalsRes.professionals);
      })
      .catch(() => setError("No se pudieron cargar las citas."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const applyUpdate = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleStatus = async (id: string, status: "CONFIRMED" | "CANCELLED") => {
    setBusyId(id);
    setError(null);
    try {
      const updated = await adminApi.updateAppointmentStatus(id, status);
      applyUpdate(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar la cita.");
    } finally {
      setBusyId(null);
    }
  };

  const startReschedule = (appointment: Appointment) => {
    setReschedulingId(appointment.id);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time.slice(0, 5));
  };

  const confirmReschedule = async (id: string) => {
    if (!rescheduleDate || !rescheduleTime) return;
    setBusyId(id);
    setError(null);
    try {
      const updated = await adminApi.rescheduleAppointment(id, rescheduleDate, rescheduleTime);
      applyUpdate(updated);
      setReschedulingId(null);
    } catch {
      setError("No se pudo reagendar la cita.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const { appointment } = await adminApi.createAdminAppointment({
        userEmail: newForm.userEmail,
        professionalId: newForm.professionalId,
        date: newForm.date,
        time: newForm.time,
        notes: newForm.notes || undefined,
      });
      setAppointments((prev) => [appointment, ...prev]);
      setShowNewForm(false);
      setNewForm(emptyNewForm);
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : "No se pudo crear la cita.");
    } finally {
      setCreating(false);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-alivos-dark">Citas de asesoramiento</h1>
          <p className="text-slate-500 text-sm mt-1">{pendingCount} citas pendientes por confirmar</p>
        </div>
        <button
          onClick={() => {
            setCreateError(null);
            setNewForm(emptyNewForm);
            setShowNewForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva cita
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {showNewForm && (
        <Modal
          title="Agendar cita a nombre de un usuario"
          onClose={() => setShowNewForm(false)}
          maxWidth="max-w-md"
          footer={
            <>
              <button
                onClick={() => setShowNewForm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newForm.userEmail || !newForm.professionalId || !newForm.date || !newForm.time}
                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {creating ? "Agendando..." : "Agendar cita"}
              </button>
            </>
          }
        >
          {createError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{createError}</div>
          )}
          <p className="text-xs text-slate-500">
            El usuario debe tener una cuenta creada. La cita queda confirmada de inmediato y sin costo.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo del usuario *</label>
            <input
              type="email"
              value={newForm.userEmail}
              onChange={(e) => setNewForm({ ...newForm, userEmail: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="usuario@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Profesional *</label>
            <select
              value={newForm.professionalId}
              onChange={(e) => setNewForm({ ...newForm, professionalId: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
            >
              <option value="">Selecciona un profesional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha *</label>
              <input
                type="date"
                value={newForm.date}
                onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora *</label>
              <input
                type="time"
                value={newForm.time}
                onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Motivo (opcional)</label>
            <textarea
              rows={2}
              value={newForm.notes}
              onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
            />
          </div>
        </Modal>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando citas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Profesional</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha y hora</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Motivo</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Pago</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-alivos-dark">{appointment.studentName}</p>
                      <p className="text-xs text-slate-500">{appointment.studentEmail}</p>
                      {appointment.bookingSource === "ADMIN" && (
                        <span className="text-xs text-brand-600 font-semibold">Agendada por admin</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700 hidden sm:table-cell">
                      {appointment.professionalName || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {reschedulingId === appointment.id ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="date"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
                          />
                          <input
                            type="time"
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            className="border border-slate-200 rounded-lg px-2 py-1 text-xs"
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => confirmReschedule(appointment.id)}
                              disabled={busyId === appointment.id}
                              className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-2 py-1 rounded-lg disabled:opacity-50"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setReschedulingId(null)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700">
                          {new Date(`${appointment.date}T00:00:00`).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {appointment.time.slice(0, 5)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell max-w-xs">
                      <p className="truncate">{appointment.notes || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <PaymentBadge appointment={appointment} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[appointment.status]}`}>
                        {statusLabel[appointment.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {appointment.status !== "CONFIRMED" && (
                          <button
                            onClick={() => handleStatus(appointment.id, "CONFIRMED")}
                            disabled={busyId === appointment.id}
                            className="text-xs font-semibold text-white bg-success-600 hover:bg-success-700 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                        )}
                        {appointment.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatus(appointment.id, "CANCELLED")}
                            disabled={busyId === appointment.id}
                            className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => startReschedule(appointment)}
                          className="text-xs font-semibold text-brand-600 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Reagendar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                      Todavía no hay citas solicitadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
