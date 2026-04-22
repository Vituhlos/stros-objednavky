# STROS Objednávky

Interní webová aplikace pro správu objednávek obědů (LIMA) a pizzy ve firmě STROS – Sedlčanské strojírny, a.s.

Náhrada původního řešení postaveného na Google Sheets + Apps Script. Běží jako jeden Docker kontejner, bez přihlášení.

---

## Funkce

- **Objednávky LIMA** – sdílený objednávkový list rozdělený na tři oddělení (Konstrukce, Dílna, Kanceláře), inline editace, výběr polévky/jídla/příloh
- **Jídelníček** – import z PDF (LIMA), ruční editace položek po dnech
- **Pizza** – sdílený objednávkový list s automatickým ceníkem z pizza-dublovice.cz
- **Odeslání e-mailem** – objednávka se odešle na výchozí příjemce s PDF přílohou pro každé oddělení
- **Historie** – přehled všech odeslaných i rozepsaných objednávek s detailem
- **Nastavení** – SMTP, výchozí příjemce, uzávěrka, PIN ochrana

---

## Technologie

| Vrstva | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Databáze | SQLite přes better-sqlite3 |
| E-mail | nodemailer |
| PDF | pdfkit (export), pdf-parse 1.1.1 (import) |
| Runtime | Node.js 24, Docker |

---

## Spuštění přes Docker

```bash
docker run -d \
  --name stros-objednavky \
  -p 3000:3000 \
  -v /path/to/data:/app/data \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=vas@email.cz \
  -e SMTP_PASS=heslo \
  -e ORDER_EMAIL_TO=prijemce@email.cz \
  -e SETTINGS_PIN=1234 \
  ghcr.io/vituhlos/stros-objednavky:latest
```

Aplikace poběží na `http://localhost:3000`.

### Docker Compose

```yaml
services:
  stros-objednavky:
    image: ghcr.io/vituhlos/stros-objednavky:latest
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
      ORDER_EMAIL_TO: prijemce@email.cz
      SETTINGS_PIN: 1234
```

---

## Proměnné prostředí

| Proměnná | Popis | Výchozí |
|---|---|---|
| `SMTP_HOST` | SMTP server | – |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP uživatel | – |
| `SMTP_PASS` | SMTP heslo | – |
| `SMTP_FROM` | Odesílatel (From) | = SMTP_USER |
| `SMTP_SECURE` | Použít TLS | `false` |
| `ORDER_EMAIL_TO` | Výchozí příjemce objednávky | `jirirytir1992@gmail.com` |
| `SETTINGS_PIN` | PIN pro stránku Nastavení | `1234` |
| `DB_PATH` | Cesta k SQLite souboru | `/app/data/stros.db` |

> SMTP a ostatní nastavení lze změnit také přímo v aplikaci přes `/nastaveni` (chráněno PINem). Hodnoty z DB mají přednost před env proměnnými.

---

## Lokální vývoj

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`. SQLite databáze se vytvoří v `./data/stros.db`.

---

## Sestavení image

```bash
docker build -t stros-objednavky .
```

Nebo použijte předpřipravený image z GitHub Container Registry:

```bash
docker pull ghcr.io/vituhlos/stros-objednavky:latest
```

---

## Unraid

Pro nasazení na Unraid použijte Community Applications template `unraid-template.xml` z tohoto repozitáře, nebo ručně:

- **Repository:** `ghcr.io/vituhlos/stros-objednavky:latest`
- **Port:** `3000`
- **Volume:** `/mnt/user/appdata/stros-objednavky` → `/app/data`
