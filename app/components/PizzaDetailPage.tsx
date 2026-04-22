"use client";

import Link from "next/link";
import type { PizzaOrderData } from "@/lib/pizza";
import AppSidebar from "./AppSidebar";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function formatSentAt(iso: string | null): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleString("cs-CZ", {
    timeZone: "Europe/Prague",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PizzaDetailPage({ data }: { data: PizzaOrderData }) {
  const { order, rows, totalPrice, totalCount } = data;

  return (
    <main className="app-shell">
      <AppSidebar />

      <section className="main-stage">
        <header className="hero">
          <div className="hero__topline">
            <Link href="/historie" style={{ color: "rgba(248,243,234,0.7)", fontSize: "0.9rem" }}>
              ← Zpět na historii
            </Link>
          </div>
          <div className="hero__content">
            <div>
              <p className="hero__eyebrow">Archiv – pizza</p>
              <h2>Pizza {formatDate(order.date)}</h2>
              <p className="hero__description">
                Stav: <strong>{order.status === "sent" ? "Odesláno" : "Koncept"}</strong>
                {order.sentAt && <> · Odesláno: {formatSentAt(order.sentAt)}</>}
              </p>
            </div>
            <div className="hero__actions">
              <div className="status-card">
                <span className="status-card__label">Celkem kusů</span>
                <strong className="status--draft">{totalCount}</strong>
              </div>
              <div className="status-card">
                <span className="status-card__label">Celková cena</span>
                <strong className="status--draft">{totalPrice} Kč</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="history-wrap" style={{ marginTop: "1.5rem" }}>
          {rows.length === 0 ? (
            <div className="menu-empty">Žádné řádky v objednávce.</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jméno</th>
                  <th>Pizza</th>
                  <th>Ks</th>
                  <th>Cena</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="history-td--meta">{i + 1}</td>
                    <td className="history-td--date">{row.personName || "–"}</td>
                    <td className="history-td--meta">
                      {row.pizzaItem ? `${row.pizzaItem.code}. ${row.pizzaItem.name}` : "–"}
                    </td>
                    <td className="history-td--meta">{row.count}</td>
                    <td className="history-td--meta">{row.rowPrice} Kč</td>
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
