"use client";

import type { OrderSummary } from "@/lib/orders";
import Link from "next/link";
import AppSidebar from "./AppSidebar";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function formatSentAt(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }) + " " + d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage({ orders }: { orders: OrderSummary[] }) {
  const today = new Date().toLocaleDateString("cs-CZ", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const sentCount = orders.filter((o) => o.status === "sent").length;

  return (
    <main className="app-shell">
      <AppSidebar />

      <section className="main-stage">
        <header className="hero">
          <div className="hero__topline">
            <span className="hero__stamp">STROS operations</span>
            <span>{today}</span>
          </div>
          <div className="hero__content">
            <div>
              <p className="hero__eyebrow">Archiv</p>
              <h2>Historie objednávek</h2>
              <p className="hero__description">
                Přehled všech objednávek v systému. Kliknutím na řádek zobrazíte
                detail.
              </p>
            </div>
            <div className="hero__actions">
              <div className="status-card">
                <span className="status-card__label">Odeslaných objednávek</span>
                <strong className="status--draft">{sentCount}</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="history-wrap">
          {orders.length === 0 ? (
            <div className="menu-empty">Zatím žádné objednávky v databázi.</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Stav</th>
                  <th>Odesláno</th>
                  <th>Řádků</th>
                  <th>Doplňkový e-mail</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={order.status === "sent" ? "history-row--sent" : ""}>
                    <td className="history-td--date">{formatDate(order.date)}</td>
                    <td>
                      <span className={`history-badge history-badge--${order.status}`}>
                        {order.status === "sent" ? "Odesláno" : "Koncept"}
                      </span>
                    </td>
                    <td className="history-td--meta">{formatSentAt(order.sentAt)}</td>
                    <td className="history-td--meta">{order.rowCount}</td>
                    <td className="history-td--meta">{order.extraEmail ?? "–"}</td>
                    <td>
                      <Link className="history-detail-link" href={`/historie/${order.id}`}>
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
