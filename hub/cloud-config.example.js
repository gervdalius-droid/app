/* Connection for this deployment. Copy to cloud-config.js and fill in.

   Nothing here is a secret in the Supabase sense: the anon key on its own
   reads NOTHING, because the workspaces table is RLS-locked to authenticated
   sessions. The shop password is never stored here, or anywhere in the repo.

   You may not need this file at all. If this browser is already signed in to
   the invoices app, core.js adopts that session — same project, same user —
   and the hub connects with no password and no config.

   coreWorkspace is the hub's OWN row (customers + the document index),
   alongside the rows the other apps already use in the same table. */
window.CLOUD_CONFIG = {
  url:           "https://YOUR-PROJECT.supabase.co",
  key:           "YOUR-ANON-KEY",
  email:         "shopflow@example.lt",
  coreWorkspace: "northwood-crm",
  table:         "workspaces",
};

/* Where each module is served from. The defaults in hub.js match serve.py;
   on GitHub Pages the folder is the repo name, and ShopFlow is published from
   a repo called shopflow-app, so that one needs saying. */
window.HUB_PATHS = {
  offer:    "../offer/",
  shopflow: "../shopflow-app/",
  invoices: "../invoices/",
};
