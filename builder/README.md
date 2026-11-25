# Spintelių kūrėjas (app.dedesbaldai.lt/builder/)

**`index.html` here is a built file — do not edit it.** It is made from the `design` repository
(github.com/gervdalius-droid/design): the same engine and saving as before, with the new interface on top.

To change the builder: work in a checkout of `design` (its `src/`, tests in `test/ui/`), then

    python3 tools/deploy.py /path/to/this/repository

writes `builder/index.html` here; commit and push this repository to publish. The same page is also served for trying
out at gervdalius-droid.github.io/design/.

| File | |
|---|---|
| `index.html` | the built page (everything inline except the scripts below) |
| `workshop-auth.js`, `cloud.js`, `locks.js` | sign-in, cloud saving, one editor per project — this site's own, loaded by the page; `design` keeps copies to test against |
| `/hub/shared/notices.js`, `project-lock.js`, `back.js` | loaded from the hub, as before |

The previous builder — the single-file page that was edited by hand, with its `src/`, `test/`, `tpl/` and `ref/` —
is kept unchanged in `/builder-old/` and still opens at app.dedesbaldai.lt/builder-old/. Both use the same saved
projects (same browser storage, same cloud); the old one does not know a project marked as produced is locked.
`offer/render-src/build.py` bundles the 3D viewer from a builder page: give it `builder-old/index.html`.
