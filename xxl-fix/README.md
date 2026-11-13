# XXL Ašių taisyklė — a 90° rotation that removes a daily manual fix

**Rotates SWOOD CAM `.XXL` part programs so the long side runs along the machine's X axis.**
For an SCM Startech CN Plus. Drop the file in, download the fixed one.

![XXL fixer](docs/screenshot.png)

> 🇱🇹 Lietuviškas aprašymas: [README.lt.md](README.lt.md)

## The problem

SWOOD exports a part in the orientation it has in the *model*, not the orientation the
*machine* accepts. Example — `DESINE_SPORTO_RUBINE_LENKTAS_1OP.XXL`:

```
H DX=684 DY=2200 DZ=18 ...        <-- DY 2200 mm doesn't fit the Y travel
```

So somebody turns it by hand. Every time.

## Don't assume the rule — prove it

Before automating this I parsed **1,284 programs that had actually been cut on this machine**:

| | value |
|---|---|
| largest `DX` used | **2746 mm** |
| largest `DY` used | **1015 mm** |
| programs where `DY > DX` | 125 (9.7 %) — all of them fit within Y |
| programs with `DY > 1300` | **0** |

Y is the short axis, and nothing real has ever needed more than 1015 mm of it. `DY=2200` is
physically impossible, so rotating it is not a heuristic — it's the only valid output. That's
what made it safe to do automatically.

## What it does

Four steps, one screen:

1. **Drop** a `.XXL` file. If the part is lying across the axes (`DY > DX`) it is **rotated
   immediately** — that's the whole point of opening it.
2. **See it** — 2D drawing of the panel with every drilling and routing operation placed, plus
   a 3D view. Click a hole to nudge or skip it.
3. **Check** — the operations list shows what will be written and what will be dropped.
4. **Download** the corrected program.

It rewrites the header, rotates every operation's coordinates, remaps the face/edge codes and
arc directions, and stamps the file so you can tell a fixed program from an original.

Also handles thickness override and edge/routing operations, with fixtures covering SWOOD and
Maestro output.

## STEP → program

**`⬆ STEP → programa`** (or drop `.STEP` files on the page) reads the STEP export of one or
more panels in the browser and recognises bores, grooves/LED channels and through contours
exactly as step2xxl v2.14 does — same 1OP / turned-over 2OP / 90°-rotated programs, same
lines. Grooves up to 6 mm wide (neon-flex LED) are cut with the saw blade (T=82, 3.2 mm kerf,
passes from wall to wall, always from high X to low X, run out past an open end like SWOOD CAM,
stopping with the kerf at a closed end — the rounded bottom left there is finished by hand);
grooves 6–15 mm wide are refused, not routed with the 15.5 mm cutter. The reviewer sees each program on a drawing, can switch groups off, sees in red what
the machine cannot do, and approves: download or write straight to the machine folder.
Verified byte-for-byte against step2xxl.py on 21 real panels and 10 test panels
(`fixtures/step`, references in `fixtures/step2xxl-ref`, including `SAW_*` saw-groove panels). Beyond step2xxl: inner through
cut-outs and through holes larger than any drill are routed (step2xxl skips them).

## Make a part by hand

**`＋ Nauja detalė`** (top right) opens a part builder, so the workshop can make a program
without the engineer or SolidWorks: set the panel size, add holes (Ø5/8/15/35, blind or
through), shelf-pin rows, hinge cups, edge holes, grooves, LED grooves cut with the saw
(4–6 mm wide, along X, through or stopping inside the panel), corner notches, cut-outs and round
holes, position each one **from the edge it was measured from**, drag it on the drawing, and
download or send the programs straight to the machine.

It writes exactly what step2xxl writes (same lines, same face numbering, `_1OP`/`_2OP`/`_3OP`)
and follows the same machine rules: underside work goes to a turned-over 2OP, Ø5 in a long edge
to a 90°-rotated program, routing always leaves 2 mm, ramps in instead of plunging and never
goes more than 20 mm outside the panel. Invalid parts can't be downloaded; every check says
why in plain Lithuanian.

## Run it

```bash
python3 serve.py          # http://localhost:8748/
```

Tests: <http://localhost:8748/test.html> — **429 checks** against real `.XXL` fixtures in
[`fixtures/`](fixtures) (SWOOD portrait/edges, Maestro arcs/edges/routing).

There's a `windows/` folder with a double-click launcher for the shop PC, because the person
using this shouldn't have to know what a terminal is.

## Built with

Vanilla JavaScript, HTML Canvas, no dependencies, no build step. ~3,300 lines.
