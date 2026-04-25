# Objednávky

Firemní webová aplikace pro správu objednávek obědů a pizzy. Běží jako jeden Docker kontejner, bez přihlášení — přístup je omezený sítí.

---

## Funkce

### Objednávky obědů
- Sdílený objednávkový list rozdělený na oddělení (plně konfigurovatelná správa oddělení)
- Výběr polévky, hlavního jídla, příloh a doplňků s automatickým výpočtem ceny
- Inline editace přímo v tabulce, druhá polévka, extra jídla s počtem porcí
- Uzávěrka v nastavitelný čas — správce odešle objednávku ručně nebo automaticky
- **Auto-odesílání** — nastavitelný čas, dny v týdnu, minimální počet objednávek; přeskočí zavřené dny (detekce z PDF jídelníčku)
- Real-time synchronizace přes SSE — změny ostatních se zobrazí okamžitě bez obnovení stránky

### Jídelníček
- Import z PDF — automaticky rozpozná polévky a jídla podle dnů v týdnu
- Ruční přidávání a úprava položek
- Správa aktuálního i příštího týdne

### Pizza
- Sdílený objednávkový list s ceníkem načteným automaticky ze stránek pizzerie
- Automatický výpočet ceny za celou objednávku

### E-mail a PDF
- Odeslání objednávky e-mailem s PDF přílohou pro každé oddělení zvlášť
- Konfigurovatelní příjemci, volitelný extra e-mail při každém odeslání
- Test SMTP připojení přímo z nastavení

### Historie a audit
- Přehled všech odeslaných i rozepsaných objednávek s detailem
- **Audit log** — záznamy o přidání/smazání řádků, odeslání, znovuotevření a auto-odeslání

### Nastavení (chráněno PINem)
- SMTP, příjemci, uzávěrka, ceny polévky/jídla/příloh
- Auto-odesílání — zapnutí, čas, dny v týdnu, minimální počet objednávek
- **Správa oddělení** — přidat, přejmenovat, změnit barvu, přeuspořádat, smazat
- Záloha databáze (JSON export všech dat)
- Zobrazení audit logu

---

## Technologie

| Vrstva | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Databáze | SQLite (better-sqlite3) |
| E-mail | nodemailer |
| PDF export | pdfkit |
| PDF import | pdf-parse |
| Scheduler | node-cron |
| Runtime | Node.js 24, Docker |

---

## Spuštění přes Docker

```bash
docker run -d \
  --name objednavky \
  -p 3000:3000 \
  -v /path/to/data:/app/data \
  -e SMTP_HOST=smtp.gmail.com \
  -e SMTP_PORT=587 \
  -e SMTP_USER=vas@email.cz \
  -e SMTP_PASS=heslo \
  -e ORDER_EMAIL_TO=prijemce@email.cz \
  -e SETTINGS_PIN=1234 \
  ghcr.io/vituhlos/objednavky-jidla:latest
```

Aplikace poběží na `http://localhost:3000`.

### Docker Compose

```yaml
services:
  objednavky:
    image: ghcr.io/vituhlos/objednavky-jidla:latest
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
| `ORDER_EMAIL_TO` | Výchozí příjemce objednávky | – |
| `SETTINGS_PIN` | PIN pro stránku Nastavení | `1234` |
| `DB_PATH` | Cesta k SQLite souboru | `/app/data/db.sqlite` |

> Všechna nastavení lze změnit také přímo v aplikaci přes `/nastaveni` (chráněno PINem). Hodnoty uložené v aplikaci mají přednost před env proměnnými.

---

## Lokální vývoj

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`. SQLite databáze se vytvoří automaticky v `./data/`.

---

## Sestavení image

```bash
docker build -t objednavky .
```
