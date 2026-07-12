const fs = require("fs");
const SRC = "src/js/core/cross_system_events.js";
const text = fs.readFileSync(SRC, "utf8");

function findObjStart(text, idPos) {
  // first '{' immediately preceding the id (event object open)
  for (let i = idPos - 1; i >= 0; i--) {
    if (text[i] === "{") return i;
  }
  return -1;
}
function extractObject(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

const ids = [
  "econ_wealth_tax_tier",
  "econ_wealth_tax_tier_corp",
  "econ_market_saturation",
  "price_market_event_alert",
];
const extracted = [];
for (const id of ids) {
  const m = text.indexOf('id: "' + id + '"');
  if (m < 0) {
    console.error("MISSING id", id);
    process.exit(1);
  }
  console.error("id=%s idPos=%d ctx=%j", id, m, text.slice(m - 40, m + 20));
  const s = findObjStart(text, m);
  const obj = extractObject(text, s);
  console.error("id=%s start=%d len=%s", id, s, obj ? obj.length : "NULL");
  extracted.push(obj);
}
if (extracted.some((x) => !x)) {
  console.error("ABORT: some extraction failed");
  process.exit(2);
}
const code = "module.exports = [" + extracted.join(",\n") + "];";
fs.writeFileSync("/tmp/_extracted_evts.js", code);

// ---- MC runner ----
global.StateManager = { addMessage: function () {} };
global.Random = { int: (a, b) => a, chance: () => false };
const events = require("/tmp/_extracted_evts.js");

// seeded RNG
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randState(rng) {
  const r = () => rng();
  return {
    resources: { cash: Math.floor(r() * 20000000) },
    savings: Math.floor(r() * 5000000),
    cityWealth: r() < 0.2 ? 0 : Math.floor(r() * 50000000),
    totalAssets: Math.floor(r() * 20000000),
    player: {
      day: Math.floor(r() * 800),
      phase: r() < 0.5 ? "street" : "corporate",
      mental: Math.floor(r() * 100),
    },
    needs: { happiness: Math.floor(r() * 100) },
    flags:
      r() < 0.3
        ? {
            _econTaxTier: Math.floor(r() * 4),
            _satLastDay: Math.floor(r() * 100),
            _priceAlertId: "",
          }
        : {},
    trade:
      r() < 0.5
        ? {
            marketEvents: [
              {
                id: "water_shortage",
                name: "饮用水短缺",
                goodId: "water",
                priceMod: 1.5,
                remaining: 3,
              },
            ],
          }
        : { marketEvents: [] },
    skills: { repair: { level: Math.floor(r() * 100), xp: 0 } },
    relationships: {},
  };
}

let throws = 0,
  fires = 0,
  total = 0;
const SEEDS = 10,
  DAYS = 500;
for (let s = 0; s < SEEDS; s++) {
  const rng = mulberry32(s * 9973 + 12345);
  for (let d = 0; d < DAYS; d++) {
    const st = randState(rng);
    for (const ev of events) {
      total++;
      try {
        const cond = ev.conditions ? ev.conditions(st) : true;
        if (cond) {
          fires++;
          for (const c of ev.choices || []) {
            if (c.apply) c.apply(st);
          }
        }
      } catch (e) {
        throws++;
        if (throws <= 5) console.error("THROW in", ev.id, ":", e.message);
      }
    }
  }
}
console.log(
  "MC done: seeds=%d days=%d total=%d fires=%d throws=%d",
  SEEDS,
  DAYS,
  total,
  fires,
  throws,
);
console.log(
  throws === 0
    ? "PASS: no exceptions across all synthetic states"
    : "FAIL: exceptions detected",
);
