<div align="center">

# Kantýna

**Firemní systém pro správu objednávek obědů a pizzy**

[![Docker](https://img.shields.io/badge/Docker-ghcr.io-0ea5e9?style=flat-square&logo=docker&logoColor=white)](https://ghcr.io/vituhlos/objednavky-jidla)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003b57?style=flat-square&logo=sqlite)](https://github.com/WiseLibs/better-sqlite3)
[![Branch](https://img.shields.io/badge/větev-v4--beta-f59e0b?style=flat-square)](#)

</div>

---

## Co je Kantýna

Webová aplikace pro týmy, které si každý den objednávají obědy z firemní kantýny. Jeden Docker kontejner, SQLite databáze, žádná externí závislost. V4 přináší **uživatelské účty** — každý si spravuje svůj řádek objednávky sám, nikdo jiný do něj nezasahuje.

---

## Funkce

### Objednávky obědů

- Sdílený objednávkový list rozdělený na oddělení (plně konfigurovatelná správa)
- Výběr polévky, hlavního jídla, příloh a doplňků — automatický výpočet ceny
- Druhá polévka, extra jídla, počet porcí
- **Real-time synchronizace přes SSE** — změny ostatních se zobrazí okamžitě
- Uzávěrka v nastavitelný čas s živým odpočtem a barevným upozorněním
- Ruční i **automatické odeslání** (nastavitelný čas, dny v týdnu, minimální počet)

### Jídelníček

- Import přímo z PDF — automaticky rozpozná polévky a jídla podle dnů v týdnu
- Ruční přidávání a úprava položek
- Uzavření konkrétního dne (např. státní svátek)

### Pizza

- Sdílený objednávkový list s ceníkem načteným automaticky ze stránek pizzerie
- Automatický výpočet ceny

### E-mail a PDF

- Odeslání objednávky e-mailem s PDF přílohou pro každé oddělení zvlášť
- Konfigurovatelní příjemci, extra CC e-mail při každém odeslání
- Test SMTP přímo z nastavení

### Uživatelské účty _(novinka v4)_

- Registrace s e-mailem, jménem a heslem
- Každý uživatel edituje jen svůj řádek objednávky
- Admin může editovat kohokoliv a spravovat účty (role, aktivace)
- První registrovaný uživatel dostane automaticky roli admin
- Sessions v SQLite, hesla hashovaná pomocí scrypt

### Nastavení a správa

- Chráněno PINem — SMTP, příjemci, ceny, uzávěrka, auto-odesílání
- Správa oddělení (přidat, přejmenovat, barva, pořadí, smazat)
- Záloha a obnova dat (JSON export/import)
- Audit log všech změn

---

## Technologie

| Vrstva | Technologie |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| UI | React 19, Tailwind CSS 4 |
| Databáze | SQLite — better-sqlite3 |
| Autentizace | Sessions v SQLite, scrypt (Node.js crypto) |
| E-mail | nodemailer |
| PDF export | pdfkit |
| PDF import | pdf-parse |
| Scheduler | node-cron |
| Real-time | Server-Sent Events (SSE) |
| Runtime | Node.js 24, Docker |

---

## Spuštění

### Docker (doporučeno)

```bash
docker run -d \
  --name kantyna \
  -p 3000:3000 \
  -v /path/to/data:/app/data \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=vas@email.cz \
  -e SMTP_PASS=heslo \
  -e ORDER_EMAIL_TO=prijemce@firma.cz \
  -e SETTINGS_PIN=1234 \
  ghcr.io/vituhlos/objednavky-jidla:v4-beta
```

Aplikace poběží na `http://localhost:3000`. Při prvním spuštění se vytvoří databáze a zobrazí se stránka pro registraci — první účet dostane automaticky roli **admin**.

### Docker Compose

```yaml
services:
  kantyna:
    image: ghcr.io/vituhlos/objednavky-jidla:v4-beta
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      SMTP_HOST: smtp.gmail.com
      SMTP_PORT: 587
      SMTP_USER: vas@email.cz
      SMTP_PASS: heslo
      ORDER_EMAIL_TO: prijemce@firma.cz
      SETTINGS_PIN: 1234
```

---

## Proměnné prostředí

| Proměnná | Popis | Výchozí |
|---|---|---|
| `SMTP_HOST` | SMTP server | — |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP uživatel | — |
| `SMTP_PASS` | SMTP heslo | — |
| `SMTP_FROM` | Odesílatel (From) | = SMTP_USER |
| `SMTP_SECURE` | Použít TLS | `false` |
| `ORDER_EMAIL_TO` | Výchozí příjemce objednávky | — |
| `SETTINGS_PIN` | PIN pro stránku Nastavení | `1234` |
| `DB_PATH` | Cesta k SQLite souboru | `/app/data/stros.db` |

> Nastavení lze měnit také přímo v aplikaci přes `/nastaveni` (chráněno PINem). Hodnoty uložené v aplikaci mají přednost před env proměnnými.

---

## Lokální vývoj

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`. SQLite databáze se vytvoří automaticky v `./data/`.

```bash
# Sestavení Docker image
docker build -t kantyna .
```

---

## Větve

| Větev | Tag | Popis |
|---|---|---|
| `main` | `latest` | Stabilní produkční verze |
| `v4` | `v4-beta` | Uživatelské účty a autentizace |

---

<div align="center">
<sub>Interní nástroj · SQLite · jeden kontejner · žádná cloud závislost</sub>
</div>
