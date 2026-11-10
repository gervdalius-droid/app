// Web Worker that runs the WASM bin-packing engine off the main thread, so the
// UI (and the loading spinner) stays responsive while the WASM solves.
import init, { run_lbf_bpp } from './nestasm.js';

let ready = false;
async function ensure(){ if(!ready){ await init(); ready = true; } }

// Signal readiness once the wasm is initialised.
ensure()
  .then(() => self.postMessage({ type: 'ready' }))
  .catch((e) => self.postMessage({ type: 'error', msg: 'init: ' + ((e && e.message) || e) }));

self.onmessage = async (e) => {
  const d = e.data;
  if (!d || d.type !== 'solve') return;
  // The id is echoed back: the search loop fires one solve after another, and a
  // reply that arrives after its caller gave up (cancel, timeout) must not be
  // mistaken for the answer to the next question.
  const id = d.id;
  try {
    await ensure();
    // run_lbf_bpp(instanceJSON, seed, min_separation) -> ExtBPSolution JSON string
    // The seed steers LBF's placement sampling: same instance, different seed,
    // measurably different packing. That is what the multi-start search spends
    // its time budget on.
    const json = run_lbf_bpp(d.inst, BigInt(d.seed == null ? 1 : d.seed), d.kerf);
    self.postMessage({ type: 'result', id, json });
  } catch (err) {
    self.postMessage({ type: 'error', id, msg: String((err && err.message) || err) });
  }
};
