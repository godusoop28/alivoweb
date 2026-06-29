"use client";

import { purchases } from "@/lib/mockData";

export default function AdminPurchases() {
  const totalPaid = purchases.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-alivos-dark">Compras y Pagos</h1>
        <p className="text-slate-500 text-sm mt-1">Historial de transacciones de la plataforma</p>
      </div>

      {/* Mercado Pago info banner */}
      <div className="bg-alivos-light border border-brand-200 rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-alivos-dark mb-1">Integración preparada para Mercado Pago</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cuando el backend esté conectado, los pagos confirmados activarán automáticamente el acceso
            al curso mediante webhook. Los estados de pago y los IDs de transacción se sincronizarán en tiempo real.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total cobrado", value: `$${totalPaid.toLocaleString("es-AR")}`, color: "text-green-600 bg-green-50" },
          { label: "Pagos confirmados", value: purchases.filter((p) => p.status === "paid").length, color: "text-green-600 bg-green-50" },
          { label: "Pendientes", value: purchases.filter((p) => p.status === "pending").length, color: "text-yellow-600 bg-yellow-50" },
          { label: "Fallidos", value: purchases.filter((p) => p.status === "failed").length, color: "text-red-600 bg-red-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`text-2xl font-black mb-1 ${stat.color.split(" ")[0]}`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Purchases table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-alivos-dark">Listado de compras</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            Datos mock — conectar Mercado Pago
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumno</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Curso</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">ID Pago</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-alivos-dark">{purchase.studentName}</p>
                    <p className="text-xs text-slate-500">{purchase.studentEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 hidden sm:table-cell max-w-xs">
                    <p className="truncate">{purchase.courseTitle}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {purchase.paymentId}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">{purchase.date}</td>
                  <td className="px-5 py-4 font-bold text-alivos-dark">
                    ${purchase.amount.toLocaleString("es-AR")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      purchase.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : purchase.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {purchase.status === "paid" ? "Pagado" : purchase.status === "pending" ? "Pendiente" : "Fallido"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
