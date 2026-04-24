"use client";

import Link from "next/link";
import type { PizzaOrderData } from "@/lib/pizza";
import { PIZZA_BOX_FEE } from "@/lib/pizza-utils";
import AppTopBar from "./AppTopBar";

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
  const { order, rows, totalCount, totals } = data;
  const pricePerPizza = totals.pricePerPizza;

  const pizzaCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.pizzaItem) {
      const key = `${r.pizzaItem.code}. ${r.pizzaItem.name}`;
      pizzaCounts.set(key, (pizzaCounts.get(key) ?? 0) + r.count);
    }
  }

  return (
    <div className="v2-shell">
      <AppTopBar />

      {/* ── Infostrip ── */}
      <div className="v2-infostrip">
        <div className="v2-infostrip__facts">
          <Link
            href="/historie"
            style={{ color: "var(--v2-text-muted)", fontSize: "0.88rem", textDecoration: "none" }}
          >
            ← Historie
          </Link>
          <span style={{ fontWeight: 700, color: "var(--v2-text)", fontSize: "0.95rem" }}>
            Pizza {formatDate(order.date)}
          </span>
          {totalCount > 0 && (
            <span className="v2-fact">
              <strong>{totalCount} ks</strong>
              {" · "}
              <strong className="v2-accent">{totals.finalTotal} Kč</strong>
            </span>
          )}
          <span
            className="v2-fact"
            style={{ color: order.status === "sent" ? "var(--v2-green)" : "var(--v2-text-muted)" }}
          >
            {order.status === "sent" ? "Odesláno" : "Koncept"}
            {order.sentAt && ` · ${formatSentAt(order.sentAt)}`}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="v2-content">
        {/* Order rows */}
        <section className="v2-dept">
          <div className="v2-dept__head">
            <div>
              <h2 className="v2-dept__title">Objednávky</h2>
              {totalCount > 0 && (
                <span className="v2-dept__count">
                  {totalCount} ks · {totals.finalTotal} Kč celkem
                  {pricePerPizza > 0 && ` · ${pricePerPizza} Kč/ks`}
                </span>
              )}
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="v2-empty-state">Žádné řádky v objednávce.</div>
          ) : (
            <>
              <div className="v2-pizza-cols-head" aria-hidden>
                <span>#</span>
                <span>Jméno</span>
                <span>Pizza</span>
                <span style={{ textAlign: "center" }}>Ks</span>
                <span style={{ textAlign: "right" }}>Cena</span>
                <span style={{ textAlign: "right" }}>Platí</span>
                <span></span>
              </div>
              <div>
                {rows.map((row, idx) => {
                  const adjustedPrice =
                    row.pizzaItem && pricePerPizza > 0 ? pricePerPizza * row.count : 0;
                  return (
                    <div className="v2-pizza-row" key={row.id}>
                      <span className="v2-pizza-row__num">{idx + 1}</span>
                      <span style={{ fontSize: "0.9rem" }}>{row.personName || "–"}</span>
                      <span style={{ fontSize: "0.9rem" }}>
                        {row.pizzaItem
                          ? `${row.pizzaItem.code}. ${row.pizzaItem.name}`
                          : "–"}
                      </span>
                      <span style={{ textAlign: "center", fontSize: "0.9rem" }}>{row.count}</span>
                      <span className="v2-pizza-price--base">
                        {row.rowPrice > 0 ? `${row.rowPrice} Kč` : "–"}
                      </span>
                      <span className="v2-pizza-price">
                        {adjustedPrice > 0 ? `${adjustedPrice} Kč` : "–"}
                      </span>
                      <span></span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Summary */}
        {(pizzaCounts.size > 0 || totals.finalTotal > 0) && (
          <section className="v2-dept">
            <div className="v2-dept__head">
              <div>
                <h2 className="v2-dept__title">Souhrn</h2>
              </div>
            </div>
            <div className="v2-pizza-summary">
              {pizzaCounts.size > 0 && (
                <div className="v2-pizza-summary__group">
                  <h3>Pizzy</h3>
                  {[...pizzaCounts.entries()].map(([k, v]) => (
                    <p key={k}><strong>{v}×</strong> {k}</p>
                  ))}
                  {totals.finalTotal > 0 && (
                    <div className="v2-pizza-breakdown">
                      <div className="v2-pizza-breakdown__row">
                        <span>Pizzy (ceny)</span>
                        <span>{totals.baseTotal} Kč</span>
                      </div>
                      <div className="v2-pizza-breakdown__row">
                        <span>Krabice ({PIZZA_BOX_FEE} Kč/ks)</span>
                        <span>{totals.boxTotal} Kč</span>
                      </div>
                      {totals.freeCount > 0 && (
                        <div className="v2-pizza-breakdown__row v2-pizza-breakdown__row--discount">
                          <span>3+1 zdarma ({totals.freeCount}× nejlevnější)</span>
                          <span>−{totals.discountAmount} Kč</span>
                        </div>
                      )}
                      {totals.deliveryFee > 0 && (
                        <div className="v2-pizza-breakdown__row">
                          <span>Doprava</span>
                          <span>{totals.deliveryFee} Kč</span>
                        </div>
                      )}
                      {totals.deliveryFee === 0 && totals.finalTotal > 0 && (
                        <div className="v2-pizza-breakdown__row v2-pizza-breakdown__row--discount">
                          <span>Doprava zdarma (≥4 ks)</span>
                          <span>0 Kč</span>
                        </div>
                      )}
                      <div className="v2-pizza-breakdown__row v2-pizza-breakdown__row--total">
                        <span>Celkem</span>
                        <span>{totals.finalTotal} Kč</span>
                      </div>
                      <div className="v2-pizza-breakdown__row v2-pizza-breakdown__row--per">
                        <span>Cena za kus</span>
                        <span>{totals.pricePerPizza} Kč/ks</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
