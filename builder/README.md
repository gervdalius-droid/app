# Spintelių kūrėjas (cabinet builder)

> **Current app: `index.html`** — the redesigned Cabinet Studio (single file, edited directly).
> It includes: Baldai view (all furniture, realistic front and 3D render), right-handed CNC programs
> (no mirroring on the SCM), live drawer front heights, connector editor without size tags + deselect.
> `src/` + `build.py` hold the earlier modular sources; they no longer rebuild this exact file.


Dėdės Baldai workshop tool: enter a cabinet the way the offer app does (size, sections), pick the joinery, and get the part list and CNC programs without the engineer.

**Open it:** `index.html` — one self-contained page, runs in any browser (GitHub Pages serves it from the repo root).

## What it does
- CNC programs follow the SolidWorks → XXL post (step2xxl / SWOOD CAM): every marking (runners, hinge plates, legs, front fixing) is Ø5 × 2 N="L"; cam bolt bores in edges stop at 31.906 and no horizontal bore goes deeper (konfirmat pilots too); holes listed left end, top face by X, right end.
- Each stacked front its own height: type the height of any drawer (or stacked door) front, from the top; the empty ones share what is left.
- More legs: 2–6 legs in a row or one under every partition, 2 or 3 rows; legs move aside so the plate never covers a connector head; plan view and count in the Operations step.
- Front render in the Sections step: drawn from the real parts (sizes, gaps, materials, handles, legs, oven); click a column to edit it.
- Sections step: a front-view column map (contents to scale, back per column) — click a column to edit it at full width; removing a section can be undone.
- Every joint between parts has its own connectors: partition ↔ bottom / top / front rail / back rail, back ↔ partition, standing rail ↔ flat rail, bottom rail ↔ bottom — all editable in the 3D editor.
- Start screen: **＋ Naujas projektas** (name → first cabinet), import from the offer app, an example, and every project saved automatically (open, copy, .json backup, delete).
- **Virtuvė**: the whole kitchen in one view — walls (straight, L, U), every cabinet in place; front of all walls, plan and 3D; drag cabinets along / between walls with snapping to wall ends, corners and neighbours; drag new cabinets in from a palette; width, fill gap, copy, remove right there; overlap and past-the-wall checks.
- Cabinet editor with a step bar (Matmenys → Papildomos) that marks what still needs filling in; a „Paruošta CNC“ check before downloading with Fix links.
- Cabinet settings as in the offer app (app.dedesbaldai.lt/offer), with the same sketch; offer-app JSON exports can be imported.
- Partitions (pertvaros): up to 3 columns with own widths and sections; a back per column — none, plaušas (HDF, nailed on) or solid 18 mm (on the back of the whole cabinet or inside the column). Connectors and hinges meeting from both sides of a partition are moved apart automatically.
- Construction: confirmats / cams + dowels / dowels per joint, top rails (surišimo juostos), back on or inside, fixed shelves, oven supports.
- **Jungtys 3D**: pick up a connector card (with a cutaway picture of the konfirmatas / ekscentrikas / kaištis) and drop it on a joint, move connectors along a joint, drag them off to remove; left and right sides together or separately; full-screen mode for easier dragging.
- Extra operations: leg marks, Blum TANDEM / TANDEMBOX runner marks, TANDEMBOX front fixing, hinge cups and plates, shelf-support holes.
- Separate downloads: every `.XXL` program on its own (from the part list, the part view, per cabinet or all at once — no ZIP needed), the `.xlsm` and `.csv`.
- Output (ZIP): `.XXL` programs for the SCM Startech CN Plus (5 mm long-edge bores as a separate turned program), the ReportLists `.xlsm` filled exactly like the SolidWorks macro DB_PartList v18 (same template, labels, QR codes, pictures — imports into the nesting app), `.csv` and the project `.json`.

## Source
| File | |
|---|---|
| `src/engine.js` | cabinet → panels, holes, edge bores, joints; `.XXL` writer |
| `src/export.js` | project part list, hardware, report input |
| `src/report.js`, `src/report_tpl.js` | ReportLists `.xlsm` on the DB_PartList v18 template (`tpl/`) |
| `src/iso.js` | 3D connector editor |
| `src/room.js` | whole-kitchen editor (plan, front, 3D) |
| `src/art.js`, `src/photos.js` | connector pictures and product photos |
| `src/app.js`, `src/style.css` | the app (LT / EN) |
| `src/sketch.js` | the offer app's cabinet sketch |

Build: `python3 build.py` → `index.html` (and `dist/`). The ReportLists export loads JSZip from cdnjs, so it needs internet; offline a plain list is made.

## Checks (`test/`)
`npm install`, then e.g. `node test/compare_ref.js` (programs vs the verified SWOOD reference), `node test/align_check.js`, `node test/align_mixed.js`, `node test/align_manual.js` (every edge bore meets its face hole, hand-placed and per-side joints), `node test/ops_check2.js`, `node test/align_cols.js` (partitions and backs per column). The `*.py` UI tests use Playwright.

Hand-placed connectors, hinge and shelf-support holes are marked „nepatikrinta" in the app until checked on a real part.
