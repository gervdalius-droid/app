# Hub — one system out of several apps

One shell over the shop's apps, plus the two things none of them had: a
**customer** that all of them share, and a **document index** that ties a
quote to its production order to its invoice.

![Hub](docs/screenshot.png)

**Live:** <https://app.dedesbaldai.lt/hub/>

>  **This is a demo build.** The shell a real workshop runs mounts its live apps; this
>  version ships a fictional company and seeded documents, with no credentials.

## Why this exists

The shop's tools grew one problem at a time — a quote calculator, then production, then
invoicing — so each ended up with its own idea of who a customer was, and nothing connected
a quote to the order it became or the invoice it ended as.

Rather than rewrite three working apps into one, the hub mounts them on a **single origin**
so they can share `localStorage`, and adds the shared customer record and document index
underneath. Each app still runs standalone; the hub is additive.

```
                  ┌──────────────── hub ────────────────┐
                  │  Apžvalga · Klientai · modules      │
                  └───────────────┬─────────────────────┘
                                  │ core.js
                 customers + document index (shared)
                                  │
   ┌──────────────┬───────────────┼───────────────┐
   │              │               │               │
 Offer         ShopFlow        Invoices      (their own state,
 quotes        production      billing        untouched)
```

## Why a hub and not one merged app

Offer and Invoices are single-file apps of 240–280 KB each, and all three
declare colliding top-level globals — `S`, `D`, `L`, `I`, `LANG`, `TABS`.
Concatenating them into one page does not work, and rewriting two monoliths
means nothing ships until the rewrite lands.

They do already share an **origin**: in production every app sits under
`app.dedesbaldai.lt/<app>/`. One origin means one `localStorage`, one
Cache API, and iframes that can see each other. That is enough to behave like
one system without touching what already works.

## What core.js owns

**Customers.** Invoices had the only real customer record — company code, VAT
number, address, the lot — backed by a 233k-entry Lithuanian registry.
ShopFlow stored `order.client` as a plain string; Offer copied a handful of
client fields onto every quote. `core.js` takes Invoices' shape as the shared
one and matches on **company code, then VAT number, then name**, so the same
customer arriving from three apps collapses into one record.

**The document index.** Not the documents — each app keeps those. Only a spine
saying a document exists, who it is for, and what it came from (`fromId`), so
`Core.chain()` can walk quote → order → invoice.

## How concurrent writes are safe

The shared state is one jsonb document in Supabase, and several apps can write
to it. A blind overwrite would silently lose the other app's edit, so:

- every record carries `updatedAt` and a `deleted` tombstone
- merging is **per record**: union by id, newest wins
- pushing is always **pull → merge → put**

Order does not matter, applying the same remote twice changes nothing, and a
device that was offline for a day still merges cleanly. A tombstone is why a
deleted customer does not come back from a device that still holds it.

## Sign-in

The hub reuses the Supabase project, `workspaces` table and shop login the
other apps already use, under its own row (`northwood-crm`) — no new table,
no SQL. And because the origin is shared, `core.js` **adopts an existing
session**: if this browser is already signed in to the invoices app, the hub is
signed in too, and nobody types the shop password twice.

Everything works signed out. The data stays in the browser and syncs when a
connection appears.

## Running it

```sh
python3 serve.py            # http://localhost:8750
```

`serve.py` mounts every app on **one origin**, at the same paths GitHub Pages
uses — running each on its own port breaks the sharing and hides exactly the
bugs that then appear in production:

| path         | folder              |
|--------------|---------------------|
| `/`          | this repo           |
| `/shopflow/` | `~/shopflow`        |
| `/offer/`    | `~/github/offer`    |
| `/invoices/` | `~/github/invoices` |

On GitHub Pages the folder is the repo name, so ShopFlow (published from
`shopflow-app`) needs `window.HUB_PATHS` — see `cloud-config.example.js`.

## Importing what the apps already hold

**Apžvalga → Importuoti iš programų** reads the three apps as they are in this
browser and builds the shared records from them. Customers are matched, not
appended, so importing twice changes nothing. Invoice totals are recomputed
from the lines (discount and per-line VAT included) rather than trusted.

## Tests

Open `/test.html` — 16 assertions, the title is `ALL_PASS` or `HAS_FAIL`.

**One rule if you add tests here:** this page shares an origin with the shop's
real apps, so `localStorage` holds the actual invoice book. Never call
`localStorage.clear()`. `Core.KEY` is pointed at a throwaway key, and app
fixtures are injected through `Hub.scanApps(read)` rather than written.

## Configuration

Copy `cloud-config.example.js` to `cloud-config.js` and fill in the Supabase
URL, anon key and shop email. The anon key is not a secret — the table is
RLS-locked to authenticated sessions, so it reads nothing on its own. The shop
password is never stored in the repo.

You may not need the file at all: on a device already signed in to the invoices
app, the session is adopted and the hub connects with no configuration.

## What is not done yet

- The modules still show their own sign-in gates inside the hub; adopting the
  shared session for ShopFlow and Offer is the next step.
- Nothing yet *creates* the next document — quote → order → invoice is
  recorded when it happens, but the buttons that make it happen are still to
  come.
- Offer and ShopFlow do not yet write to the shared customer; the hub reads
  them on import. Making them read the shared record is what removes the
  duplicate client fields for good.
