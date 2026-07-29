const runner = require('./tests/headless_runner.cjs');
runner.init();

// After init, RANDOM_EVENTS should be populated
const evts = (typeof RANDOM_EVENTS !== "undefined") ? RANDOM_EVENTS : (global.RANDOM_EVENTS || []);
console.log("RANDOM_EVENTS total:", evts.length);
const r826 = evts.filter(e => e.id && e.id.indexOf("f826") >= 0);
console.log("f826 events found:", r826.length);
r826.forEach(e => console.log("  -", e.id, "| phase:", e.phase || "?"));

// Also verify r851 (known working) for comparison
const r851 = evts.filter(e => e.id && e.id.indexOf("f851") >= 0);
console.log("f851 events (sanity):", r851.length);
r851.forEach(e => console.log("  -", e.id));
