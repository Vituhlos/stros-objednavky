"use client";

import { useState, useRef, useEffect } from "react";
import type { DepartmentData, OrderRowEnriched, MenuItem } from "@/lib/types";
import { DEPARTMENT_LABELS, DEPARTMENT_ACCENT } from "@/lib/types";

type RowUpdates = Partial<{
  personName: string;
  soupItemId: number | null;
  mainItemId: number | null;
  rollCount: number;
  breadDumplingCount: number;
  potatoDumplingCount: number;
  ketchupCount: number;
  tatarkaCount: number;
  bbqCount: number;
}>;

interface Props {
  data: DepartmentData;
  soups: MenuItem[];
  meals: MenuItem[];
  isSent: boolean;
  onAddRow: () => Promise<number>;
  onUpdateRow: (rowId: number, updates: RowUpdates) => void;
  onDeleteRow: (rowId: number) => void;
}

function RowMenuButton({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="row-menu-wrap" ref={ref}>
      <button
        aria-label="Možnosti"
        className="row-menu-btn"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        type="button"
      >
        ⋮
      </button>
      {open && (
        <div className="row-menu-dropdown">
          <button onClick={() => { setOpen(false); onEdit(); }} type="button">
            Upravit
          </button>
          <button
            className="row-menu-danger"
            onClick={() => { setOpen(false); onDelete(); }}
            type="button"
          >
            Smazat
          </button>
        </div>
      )}
    </div>
  );
}

function OrderEntry({
  row,
  accent,
  isSent,
  onEdit,
  onDelete,
}: {
  row: OrderRowEnriched;
  accent: string;
  isSent: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = row.personName
    ? row.personName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const chips: string[] = [];
  if (row.rollCount > 0) chips.push(`Houska ×${row.rollCount}`);
  if (row.breadDumplingCount > 0) chips.push(`H. kned. ×${row.breadDumplingCount}`);
  if (row.potatoDumplingCount > 0) chips.push(`B. kned. ×${row.potatoDumplingCount}`);
  if (row.ketchupCount > 0) chips.push(`Kečup ×${row.ketchupCount}`);
  if (row.tatarkaCount > 0) chips.push(`Tatarka ×${row.tatarkaCount}`);
  if (row.bbqCount > 0) chips.push(`BBQ ×${row.bbqCount}`);

  return (
    <div
      className={`order-entry${!isSent ? " order-entry--clickable" : ""}`}
      onClick={!isSent ? onEdit : undefined}
    >
      <div className={`order-entry__avatar order-entry__avatar--${accent}`}>{initials}</div>
      <div className="order-entry__body">
        <span className="order-entry__name">{row.personName || "—"}</span>
        <div className="order-entry__meals">
          {row.mainItem && (
            <span className="order-entry__item order-entry__item--main">
              {row.mainItem.code} – {row.mainItem.name}
            </span>
          )}
          {row.soupItem && (
            <span className="order-entry__item order-entry__item--soup">
              {row.soupItem.code} – {row.soupItem.name}
            </span>
          )}
          {!row.mainItem && !row.soupItem && (
            <span className="order-entry__item order-entry__item--empty">Nic nevybráno</span>
          )}
        </div>
        {chips.length > 0 && (
          <div className="order-entry__chips">
            {chips.map((c) => (
              <span className="order-chip" key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>
      <div className="order-entry__price">
        {row.rowPrice > 0 ? `${row.rowPrice} Kč` : "—"}
      </div>
      {!isSent && (
        <div className="order-entry__menu" onClick={(e) => e.stopPropagation()}>
          <RowMenuButton onDelete={onDelete} onEdit={onEdit} />
        </div>
      )}
    </div>
  );
}

function ModalStepper({
  label,
  price,
  value,
  onChange,
}: {
  label: string;
  price: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="modal-stepper">
      <span className="modal-stepper__label">{label}</span>
      <span className="modal-stepper__price">{price} Kč/ks</span>
      <div className="modal-stepper__controls">
        <button
          className="stepper-btn"
          disabled={value <= 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          type="button"
        >
          −
        </button>
        <span className="stepper-count">{value}</span>
        <button
          className="stepper-btn"
          onClick={() => onChange(value + 1)}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}

function OrderEditModal({
  row,
  soups,
  meals,
  isNew,
  onSave,
  onClose,
  onDelete,
}: {
  row: OrderRowEnriched;
  soups: MenuItem[];
  meals: MenuItem[];
  isNew: boolean;
  onSave: (updates: RowUpdates) => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [personName, setPersonName] = useState(row.personName);
  const [soupItemId, setSoupItemId] = useState<number | null>(row.soupItemId);
  const [mainItemId, setMainItemId] = useState<number | null>(row.mainItemId);
  const [rollCount, setRollCount] = useState(row.rollCount);
  const [breadDumplingCount, setBreadDumplingCount] = useState(row.breadDumplingCount);
  const [potatoDumplingCount, setPotatoDumplingCount] = useState(row.potatoDumplingCount);
  const [ketchupCount, setKetchupCount] = useState(row.ketchupCount);
  const [tatarkaCount, setTatarkaCount] = useState(row.tatarkaCount);
  const [bbqCount, setBbqCount] = useState(row.bbqCount);

  const handleCancel = () => {
    if (isNew) onDelete();
    else onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet__header">
          <h3 className="modal-sheet__title">
            {isNew ? "Přidat objednávku" : "Upravit objednávku"}
          </h3>
          <button
            aria-label="Zavřít"
            className="modal-close-btn"
            onClick={handleCancel}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-sheet__body">
          <div className="modal-field">
            <label className="modal-label" htmlFor="modal-name">Jméno</label>
            <input
              autoFocus
              className="modal-input"
              id="modal-name"
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Jméno osoby..."
              type="text"
              value={personName}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="modal-soup">Polévka</label>
            <select
              className="modal-select"
              id="modal-soup"
              onChange={(e) => setSoupItemId(e.target.value ? Number(e.target.value) : null)}
              value={soupItemId ?? ""}
            >
              <option value="">— žádná polévka —</option>
              {soups.map((s) => (
                <option key={s.id} value={s.id}>{s.code} – {s.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label" htmlFor="modal-meal">Jídlo</label>
            <select
              className="modal-select"
              id="modal-meal"
              onChange={(e) => setMainItemId(e.target.value ? Number(e.target.value) : null)}
              value={mainItemId ?? ""}
            >
              <option value="">— žádné jídlo —</option>
              {meals.map((m) => (
                <option key={m.id} value={m.id}>{m.code} – {m.name}</option>
              ))}
            </select>
          </div>

          <div className="modal-extras">
            <p className="modal-label">Přílohy a doplňky</p>
            <ModalStepper label="Houska" onChange={setRollCount} price={5} value={rollCount} />
            <ModalStepper label="Houskový knedlík" onChange={setBreadDumplingCount} price={40} value={breadDumplingCount} />
            <ModalStepper label="Bramborový knedlík" onChange={setPotatoDumplingCount} price={45} value={potatoDumplingCount} />
            <ModalStepper label="Kečup" onChange={setKetchupCount} price={20} value={ketchupCount} />
            <ModalStepper label="Tatarka" onChange={setTatarkaCount} price={20} value={tatarkaCount} />
            <ModalStepper label="BBQ omáčka" onChange={setBbqCount} price={20} value={bbqCount} />
          </div>
        </div>

        <div className="modal-sheet__footer">
          {!isNew && (
            <button
              className="modal-btn modal-btn--danger"
              onClick={onDelete}
              type="button"
            >
              Smazat
            </button>
          )}
          <button
            className="modal-btn modal-btn--secondary"
            onClick={handleCancel}
            type="button"
          >
            Zrušit
          </button>
          <button
            className="modal-btn modal-btn--primary"
            onClick={() =>
              onSave({
                personName,
                soupItemId,
                mainItemId,
                rollCount,
                breadDumplingCount,
                potatoDumplingCount,
                ketchupCount,
                tatarkaCount,
                bbqCount,
              })
            }
            type="button"
          >
            Uložit
          </button>
        </div>
      </div>
    </div>
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
  const [modalState, setModalState] = useState<{ rowId: number; isNew: boolean } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const accent = DEPARTMENT_ACCENT[data.name];
  const label = DEPARTMENT_LABELS[data.name];

  const activeRows = data.rows.filter(
    (r) => r.personName || r.soupItemId || r.mainItemId
  );

  const modalRow = modalState ? (data.rows.find((r) => r.id === modalState.rowId) ?? null) : null;

  const handleAddAndOpen = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      const rowId = await onAddRow();
      setModalState({ rowId, isNew: true });
    } finally {
      setIsAdding(false);
    }
  };

  const handleModalSave = (updates: RowUpdates) => {
    if (!modalState) return;
    onUpdateRow(modalState.rowId, updates);
    setModalState(null);
  };

  const handleModalDelete = () => {
    if (!modalState) return;
    onDeleteRow(modalState.rowId);
    setModalState(null);
  };

  return (
    <>
      <section className={`dept-card dept-card--${accent}`}>
        <header className="dept-card__header">
          <div className="dept-card__title-wrap">
            <span className="dept-card__label">{label}</span>
            <span className="dept-card__count">
              {activeRows.length === 0
                ? "žádné objednávky"
                : `${activeRows.length} ${activeRows.length === 1 ? "objednávka" : activeRows.length < 5 ? "objednávky" : "objednávek"}`}
            </span>
          </div>
          <strong className="dept-card__subtotal">
            {data.subtotal > 0 ? `${data.subtotal} Kč` : "—"}
          </strong>
        </header>

        {activeRows.length === 0 ? (
          <div className="dept-card__empty">Zatím žádné objednávky</div>
        ) : (
          <div className="dept-card__list">
            {activeRows.map((row) => (
              <OrderEntry
                accent={accent}
                isSent={isSent}
                key={row.id}
                onDelete={() => onDeleteRow(row.id)}
                onEdit={() => setModalState({ rowId: row.id, isNew: false })}
                row={row}
              />
            ))}
          </div>
        )}

        {!isSent && (
          <footer className="dept-card__footer">
            <button
              className="order-add-btn"
              disabled={isAdding}
              onClick={handleAddAndOpen}
              type="button"
            >
              {isAdding ? "Přidávám..." : "+ Přidat objednávku"}
            </button>
          </footer>
        )}
      </section>

      {modalRow && (
        <OrderEditModal
          isNew={modalState!.isNew}
          meals={meals}
          onClose={() => setModalState(null)}
          onDelete={handleModalDelete}
          onSave={handleModalSave}
          row={modalRow}
          soups={soups}
        />
      )}
    </>
  );
}
