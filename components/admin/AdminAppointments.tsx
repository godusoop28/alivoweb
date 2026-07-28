"use client";

import { useEffect, useState } from "react";
import * as adminApi from "@/lib/api/admin";
import { Appointment, AppointmentStatus } from "@/lib/api/types";

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

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  const load = () => {
    setLoading(true);
    adminApi
      .listAppointments()
      .then(({ appointments }) => setAppointments(appointments))
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
    } catch {
      setError("No se pudo actualizar la cita.");
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

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Citas de asesoramiento</h1>
        <p className="text-slate-500 text-sm mt-1">{pendingCount} citas pendientes por confirmar</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
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
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha y hora</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Motivo</th>
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
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">
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
