import { getDb } from "./db";
import type { MenuItem, DayCode } from "./types";

const JS_DAY_TO_CODE: Record<number, DayCode> = {
  1: "Po",
  2: "Út",
  3: "St",
  4: "Čt",
  5: "Pá",
};

export function getTodayDayCode(): DayCode | null {
  const day = new Date().getDay();
  return JS_DAY_TO_CODE[day] ?? null;
}

function mapRow(row: Record<string, unknown>): MenuItem {
  return {
    id: row.id as number,
    weekLabel: row.week_label as string | null,
    day: row.day as string,
    type: row.type as "Polévka" | "Jídlo",
    code: row.code as string,
    name: row.name as string,
    price: row.price as number,
  };
}

export function getMenuItemsForDay(day: string): {
  soups: MenuItem[];
  meals: MenuItem[];
} {
  const db = getDb();
  const items = db
    .prepare(
      "SELECT * FROM menu_items WHERE day = ? ORDER BY type DESC, code ASC, id ASC"
    )
    .all(day) as Record<string, unknown>[];
  const mapped = items.map(mapRow);
  return {
    soups: mapped.filter((i) => i.type === "Polévka"),
    meals: mapped.filter((i) => i.type === "Jídlo"),
  };
}

export function getMenuItemById(id: number): MenuItem | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM menu_items WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? mapRow(row) : null;
}

export function getWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
  return `${fmt(monday)}-${fmt(friday)}${friday.getFullYear()}`;
}

const SAMPLE_MENU: Array<{
  day: DayCode;
  type: "Polévka" | "Jídlo";
  code: string;
  name: string;
  price: number;
}> = [
  // Pondělí
  { day: "Po", type: "Polévka", code: "A", name: "Zeleninová s nudlemi", price: 30 },
  { day: "Po", type: "Polévka", code: "B", name: "Hovězí vývar s játrovými knedlíčky", price: 35 },
  { day: "Po", type: "Jídlo", code: "1", name: "Vepřový guláš, houskový knedlík", price: 115 },
  { day: "Po", type: "Jídlo", code: "1", name: "Vepřový guláš, bramborový knedlík", price: 115 },
  { day: "Po", type: "Jídlo", code: "2", name: "Pečené kuře, brambory, šalát", price: 120 },
  { day: "Po", type: "Jídlo", code: "3", name: "Vepřové kotlety s houbovou omáčkou, rýže", price: 125 },
  { day: "Po", type: "Jídlo", code: "5", name: "Čínské vepřové maso s wok zeleninou a nudlemi", price: 130 },
  // Úterý
  { day: "Út", type: "Polévka", code: "A", name: "Boršč", price: 32 },
  { day: "Út", type: "Polévka", code: "B", name: "Hovězí vývar s kořenovou zeleninou", price: 35 },
  { day: "Út", type: "Jídlo", code: "1", name: "Hovězí líčka na víně, bramborová kaše", price: 145 },
  { day: "Út", type: "Jídlo", code: "1", name: "Hovězí líčka na víně, houskový knedlík", price: 145 },
  { day: "Út", type: "Jídlo", code: "2", name: "Kuře na paprice, houskový knedlík", price: 120 },
  { day: "Út", type: "Jídlo", code: "3", name: "Pečená vepřová plec, šalvěj, brambory", price: 125 },
  { day: "Út", type: "Jídlo", code: "9", name: "Smažený kapr, bramborový salát", price: 130 },
  // Středa
  { day: "St", type: "Polévka", code: "A", name: "Gulášová z černého piva", price: 35 },
  { day: "St", type: "Polévka", code: "B", name: "Hovězí vývar s kořenovou zeleninou", price: 35 },
  { day: "St", type: "Jídlo", code: "1", name: "Hovězí španělský ptáček, rýže", price: 125 },
  { day: "St", type: "Jídlo", code: "1", name: "Hovězí španělský ptáček, houskový knedlík", price: 125 },
  { day: "St", type: "Jídlo", code: "2", name: "Konfitované kachní stehno, červené zelí, knedlík", price: 165 },
  { day: "St", type: "Jídlo", code: "3", name: "Zapečené palačinky s pikantní masovou směsí", price: 120 },
  { day: "St", type: "Jídlo", code: "4", name: "Čevapčiči, pita, tzatziky, hranolky", price: 135 },
  { day: "St", type: "Jídlo", code: "5", name: "Pomalu pečená vepřová žebírka, šalát, bagetka", price: 140 },
  { day: "St", type: "Jídlo", code: "9", name: "Vepřová játra na cibulce, rýže", price: 110 },
  // Čtvrtek
  { day: "Čt", type: "Polévka", code: "A", name: "Čočková s uzeným masem", price: 32 },
  { day: "Čt", type: "Polévka", code: "B", name: "Zeleninový vývar s celestýnskými nudlemi", price: 30 },
  { day: "Čt", type: "Jídlo", code: "1", name: "Svíčková na smetaně, houskový knedlík", price: 145 },
  { day: "Čt", type: "Jídlo", code: "2", name: "Smažené rybí filé, tartar, hranolky", price: 130 },
  { day: "Čt", type: "Jídlo", code: "3", name: "Fazolová směs s párkem, chléb", price: 100 },
  { day: "Čt", type: "Jídlo", code: "5", name: "Grilovaný losos, zelenina, rýže", price: 155 },
  // Pátek
  { day: "Pá", type: "Polévka", code: "A", name: "Bramborová se slaninou", price: 30 },
  { day: "Pá", type: "Polévka", code: "B", name: "Hovězí vývar s kořenovou zeleninou", price: 35 },
  { day: "Pá", type: "Jídlo", code: "1", name: "Smažený řízek, bramborový salát", price: 125 },
  { day: "Pá", type: "Jídlo", code: "2", name: "Pečená kachna, zelí, knedlík", price: 155 },
  { day: "Pá", type: "Jídlo", code: "3", name: "Zapečené těstoviny s kuřecím masem", price: 115 },
  { day: "Pá", type: "Jídlo", code: "5", name: "Gyros s tzatziky a pita chlebem", price: 130 },
];

export function getMenuWeekLabel(): string | null {
  const db = getDb();
  const row = db
    .prepare(
      "SELECT week_label FROM menu_items WHERE week_label IS NOT NULL LIMIT 1"
    )
    .get() as { week_label: string } | undefined;
  return row?.week_label ?? null;
}

export function getFullMenu(): Record<
  string,
  { soups: MenuItem[]; meals: MenuItem[] }
> {
  const db = getDb();
  const all = db
    .prepare(
      "SELECT * FROM menu_items ORDER BY day, type DESC, code ASC, id ASC"
    )
    .all() as Record<string, unknown>[];
  const result: Record<string, { soups: MenuItem[]; meals: MenuItem[] }> = {};
  for (const raw of all) {
    const item = mapRow(raw);
    if (!result[item.day]) result[item.day] = { soups: [], meals: [] };
    if (item.type === "Polévka") result[item.day].soups.push(item);
    else result[item.day].meals.push(item);
  }
  return result;
}

export function replaceMenu(
  weekLabel: string,
  items: import("./parse-menu").ParsedMenuItem[]
): void {
  const db = getDb();
  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM menu_items").run();
    const insert = db.prepare(
      "INSERT INTO menu_items (week_label, day, type, code, name, price) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const item of items) {
      const price = item.type === "Polévka" ? 35 : 120;
      insert.run(weekLabel, item.day, item.type, item.code, item.name, price);
    }
  });
  transaction();
}

export function addMenuItem(item: {
  day: string;
  type: "Polévka" | "Jídlo";
  code: string;
  name: string;
  price: number;
}): MenuItem {
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO menu_items (week_label, day, type, code, name, price) VALUES ((SELECT week_label FROM menu_items LIMIT 1), ?, ?, ?, ?, ?)"
    )
    .run(item.day, item.type, item.code, item.name, item.price);
  return mapRow(
    db.prepare("SELECT * FROM menu_items WHERE id = ?").get(result.lastInsertRowid) as Record<string, unknown>
  );
}

export function updateMenuItem(
  id: number,
  updates: Partial<{ code: string; name: string; price: number }>
): MenuItem {
  const db = getDb();
  const fieldMap: Record<string, string> = { code: "code", name: "name", price: "price" };
  const entries = Object.entries(updates).filter(([, v]) => v !== undefined);
  if (entries.length > 0) {
    const setClauses = entries.map(([k]) => `${fieldMap[k]} = ?`).join(", ");
    db.prepare(`UPDATE menu_items SET ${setClauses} WHERE id = ?`).run(
      ...entries.map(([, v]) => v),
      id
    );
  }
  return mapRow(
    db.prepare("SELECT * FROM menu_items WHERE id = ?").get(id) as Record<string, unknown>
  );
}

export function deleteMenuItem(id: number): void {
  getDb().prepare("DELETE FROM menu_items WHERE id = ?").run(id);
}

export function seedMenuIfEmpty(weekLabel: string): void {
  const db = getDb();
  const count = (
    db.prepare("SELECT COUNT(*) as c FROM menu_items").get() as { c: number }
  ).c;
  if (count > 0) return;

  const insert = db.prepare(
    "INSERT INTO menu_items (week_label, day, type, code, name, price) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertMany = db.transaction(() => {
    for (const item of SAMPLE_MENU) {
      insert.run(weekLabel, item.day, item.type, item.code, item.name, item.price);
    }
  });
  insertMany();
}
