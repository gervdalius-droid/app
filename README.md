# Dėdės Baldai — programos (app.dedesbaldai.lt)

All workshop and office apps on one address, one sign-in.

| Address | App |
|---|---|
| `/hub/shopfloor/` | Hub — all apps (behind the hub password) |
| `/builder/` | Spintelių kūrėjas |
| `/nesting/` | Nesting |
| `/cad/`, `/cad/draft.html` | Braižyklė, DXF redaktorius |
| `/xxl-fix/` | XXL Fix |
| `/shopflow-app/` | ShopFlow |
| `/offer/` | Pasiūlymai (office) |
| `/hub/crm/` | CRM (office) |
| `/hub/prasymai/` | Prašymai |
| `/hub/workers/` | Darbuotojai (admins) |

Served by GitHub Pages with the custom domain in `CNAME`; DNS at Hostinger:
`CNAME app → gervdalius-droid.github.io`.

This repository is now the place to edit these apps. The old repositories
(`hub`, `builder`, `nesting`, `offer`, `cad`, `xxl-fix`, `shopflow-app`) only
redirect old links here, carrying each device's app settings over once
(`/hub/migrate.html`). Data lives in Supabase (workshop project) — see the
private `db` repository.
