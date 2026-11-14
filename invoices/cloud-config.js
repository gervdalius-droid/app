/* Invoices cloud connection — Dėdės Baldai (app.dedesbaldai.lt/invoices/).
   Not secret: the key alone reads nothing. The `workspaces` table answers only
   signed-in office accounts that may open the "invoices" area, and the sign-in
   is the shared office one (name + PIN), so no password lives here. */
window.CLOUD_CONFIG = {
  workshop:  true,
  url:       "https://niveinyzkkwtreeeaziv.supabase.co",
  key:       "sb_publishable_tgzBMZQ-zUkWil0bX75y_A_k6hBt868",
  workspace: "dedes-baldai-invoices",
  table:     "workspaces",
};
