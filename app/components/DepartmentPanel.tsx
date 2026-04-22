"use client";

import { useState, useRef } from "react";
import type { DepartmentData, OrderRowEnriched, MenuItem } from "@/lib/types";
import { DEPARTMENT_LABELS, DEPARTMENT_ACCENT } from "@/lib/types";
import { EXTRAS_ROW_FIELDS } from "@/lib/pricing";

interface Props {
  data: DepartmentData;
  soups: MenuItem[];
  meals: MenuItem[];
  isSent: boolean;
  onAddRow: () => void;
  onUpdateRow: (
    rowId: number,
    updates: Partial<{
      personName: string;
      soupItemId: number | null;
      mainItemId: number | null;
      rollCount: number;
      breadDumplingCount: number;
      potatoDumplingCount: number;
      ketchupCount: number;
      tatarkaCount: number;
      bbqCount: number;
    }>
  ) => void;
  onDeleteRow: (rowId: number) => void;
}

function ExtrasPanel({
  row,
  isSent,
  onUpdate,
}: {
  row: OrderRowEnriched;
  isSent: boolean;
  onUpdate: (
    updates: Partial<{
      breadDumplingCount: number;
      potatoDumplingCount: number;
      ketchupCount: number;
      tatarkaCount: number;
      bbqCount: number;
      rollCount: number;
    }>
  ) => void;
}) {
  return (
    <div className="extras-panel">
      {EXTRAS_ROW_FIELDS.map(({ rowKey, label, price }) => {
        const count = row[rowKey] as number;
        return (
          <div className="extras-panel__item" key={rowKey}>
            <span className="extras-panel__label">{label}</span>
            <span className="extras-panel__price">{price} Kč/ks</span>
            <div className="extras-panel__stepper">
              <button
                className="stepper-btn"
                disabled={isSent || count <= 0}
                onClick={() => onUpdate({ [rowKey]: Math.max(0, count - 1) })}
                type="button"
              >
                −
              </button>
              <span className="stepper-count">{count}</span>
              <button
                className="stepper-btn"
                disabled={isSent}
                onClick={() => onUpdate({ [rowKey]: count + 1 })}
                type="button"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderRow({
  row,
  soups,
  meals,
  isSent,
  onUpdate,
  onDelete,
}: {
  row: OrderRowEnriched;
  soups: MenuItem[];
  meals: MenuItem[];
  isSent: boolean;
  onUpdate: (updates: Partial<Parameters<Props["onUpdateRow"]>[1]>) => void;
  onDelete: () => void;
}) {
  const [extrasOpen, setExtrasOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const extrasCount =
    row.breadDumplingCount +
    row.potatoDumplingCount +
    row.ketchupCount +
    row.tatarkaCount +
    row.bbqCount +
    row.rollCount;

  const hasContent =
    row.personName || row.soupItemId || row.mainItemId || extrasCount > 0;

  return (
    <>
      <div
        className={`order-row${hasContent ? " order-row--active" : ""}`}
        data-row-id={row.id}
      >
        <div className="cell cell--person">
          <input
            className="cell-input"
            defaultValue={row.personName}
            disabled={isSent}
            onBlur={(e) => {
              if (e.target.value !== row.personName) {
                onUpdate({ personName: e.target.value });
              }
            }}
            placeholder="Jméno..."
            ref={nameRef}
            type="text"
          />
        </div>

        <div className="cell">
          <select
            className="cell-select"
            disabled={isSent}
            onChange={(e) =>
              onUpdate({
                soupItemId: e.target.value ? Number(e.target.value) : null,
              })
            }
            value={row.soupItemId ?? ""}
          >
            <option value="">— polévka —</option>
            {soups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} – {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="cell cell--center">
          <button
            className={`roll-toggle${row.rollCount > 0 ? " roll-toggle--on" : ""}`}
            disabled={isSent}
            onClick={() => onUpdate({ rollCount: row.rollCount > 0 ? 0 : 1 })}
            title="Houska (5 Kč)"
            type="button"
          >
            {row.rollCount > 0 ? "✓" : "0"}
          </button>
        </div>

        <div className="cell cell--meal">
          <select
            className="cell-select"
            disabled={isSent}
            onChange={(e) =>
              onUpdate({
                mainItemId: e.target.value ? Number(e.target.value) : null,
              })
            }
            value={row.mainItemId ?? ""}
          >
            <option value="">— jídlo —</option>
            {meals.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code} – {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="cell cell--center">
          <button
            className={`extras-toggle${extrasOpen ? " extras-toggle--open" : ""}${extrasCount > 0 ? " extras-toggle--has-items" : ""}`}
            onClick={() => setExtrasOpen((o) => !o)}
            title="Přílohy a doplňky"
            type="button"
          >
            {extrasCount > 0 ? `${extrasCount}×` : "+"}
          </button>
        </div>

        <div className="cell cell--price">
          {row.rowPrice > 0 ? `${row.rowPrice} Kč` : "—"}
        </div>

        <div className="cell cell--action">
          {!isSent && (
            <button
              className="row-delete-btn"
              onClick={onDelete}
              title="Smazat řádek"
              type="button"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {extrasOpen && (
        <div className="extras-row">
          <div className="extras-row__inner">
            <ExtrasPanel isSent={isSent} onUpdate={onUpdate} row={row} />
          </div>
        </div>
      )}
    </>
  );
}

export function DepartmentPanel({
  data,
  soups,
  meals,
  isSent,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
}: Props) {
  const accent = DEPARTMENT_ACCENT[data.name];
  const label = DEPARTMENT_LABELS[data.name];
  const activeRows = data.rows.filter(
    (r) => r.personName || r.soupItemId || r.mainItemId
  ).length;

  return (
    <section className={`department department--${accent}`}>
      <header className="department__header">
        <div>
          <p className="department__eyebrow">Oddělení</p>
          <h2>{label}</h2>
        </div>
        <div className="department__meta">
          <span>{activeRows} aktivních řádků</span>
          <strong>{data.subtotal} Kč</strong>
        </div>
      </header>

      <div className="department__table">
        <div className="department__table-head">
          <span>Jméno</span>
          <span>Polévka</span>
          <span>Houska</span>
          <span>Jídlo</span>
          <span>Přílohy</span>
          <span>Cena</span>
          <span />
        </div>

        {data.rows.map((row) => (
          <OrderRow
            isSent={isSent}
            key={row.id}
            meals={meals}
            onDelete={() => onDeleteRow(row.id)}
            onUpdate={(updates) => onUpdateRow(row.id, updates)}
            row={row}
            soups={soups}
          />
        ))}
      </div>

      {!isSent && (
        <footer className="department__footer">
          <button className="row-add-btn" onClick={onAddRow} type="button">
            + Přidat řádek
          </button>
        </footer>
      )}
    </section>
  );
}
