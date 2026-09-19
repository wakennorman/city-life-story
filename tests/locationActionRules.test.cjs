/**
 * 地点行动规则门禁（locations ⇄ LOCATION_ACTION_RULES 一致性）
 *
 * 存在理由 —— 两个已在线上被玩家撞到的缺陷：
 *   ① 「办健身卡锻炼」的门禁地点是 park / commercialDist / entertainment，
 *      **唯独不含它的专有地点 gym（体育馆）** → 在体育馆里点健身，被告知"去公园健身"。
 *   ② 「网吧上网」的门禁地点是 slum / commercialDist / techPark，
 *      而真实地点 id 是 **internet_cafe** → 网吧里用不了网吧行动。
 *
 * 这类缺陷的共同形状：**约束在别处定义，而专有地点被漏掉**。
 * 它不会报错、不会崩、不影响任何数值 —— 只让玩家觉得"这游戏说不通"。
 *
 * 断言设计（每条都配反向对照，防止断言本身恒真）：
 *   A 地点 id 必须真实存在（反向对照：喂一个假 id，检测器必须报出来）
 *   B 行动的专有地点必须在列表里（反向对照：用修复前的旧列表，必须报出来）
 *   C 提示文案不得指向列表外的地点（反向对照：构造矛盾文案，必须报出来）
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOCATIONS_JS = path.join(ROOT, "src/js/data/locations.js");
const ACTIONS_JS = path.join(ROOT, "src/js/phase1/actions_extra.js");

/* ---------------- 提取工具 ---------------- */

/** 从 locations.js 提取顶层地点 id（29 个） */
function loadLocationIds(src) {
  const ids = [];
  const re = /^ {2}([a-zA-Z_][a-zA-Z0-9_]*):\s*\{/gm;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return ids;
}

/**
 * 从 locations.js 提取 id → 中文名 映射。
 *
 * ★ 必须有这张表：hint 文案写的是**中文地名**（"去体育馆、公园…"），
 *   而规则里的 locations 是**英文 id**。拿 id 去比对文案永远匹配不上，
 *   检测器会恒绿 —— 这个盲区正是被本文件的「反向对照」抓出来的。
 */
function loadNameById(src) {
  const map = {};
  const re = /id:\s*"([a-zA-Z_][a-zA-Z0-9_]*)",\s*\n\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) map[m[1]] = m[2];
  return map;
}

/** 从 actions_extra.js 提取 LOCATION_ACTION_RULES 块 */
function loadRulesBlock(src) {
  const start = src.indexOf("var LOCATION_ACTION_RULES");
  if (start < 0) throw new Error("找不到 LOCATION_ACTION_RULES 定义");
  const end = src.indexOf("function getCurrentActionLocation");
  if (end < 0) throw new Error("找不到 LOCATION_ACTION_RULES 块的结束标记");
  return src.slice(start, end);
}

/** 解析规则块（在沙箱里真求值，不做字符串猜测） */
function parseRules(block) {
  const vm = require("vm");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(block + "\n;globalThis.__RULES__ = LOCATION_ACTION_RULES;", sandbox);
  return sandbox.__RULES__;
}

function loadAlias(src) {
  const vm = require("vm");
  const start = src.indexOf("var LOCATION_ACTION_RULE_ALIAS");
  if (start < 0) return {};
  const end = src.indexOf(";", src.indexOf("};", start));
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    src.slice(start, end) + "\n;globalThis.__A__ = LOCATION_ACTION_RULE_ALIAS;",
    sandbox,
  );
  return sandbox.__A__ || {};
}

/* ---------------- 被测数据 ---------------- */

const locSrc = fs.readFileSync(LOCATIONS_JS, "utf8");
const actSrc = fs.readFileSync(ACTIONS_JS, "utf8");

const LOCATION_IDS = loadLocationIds(locSrc);
const NAME_BY_ID = loadNameById(locSrc);
const RULES = parseRules(loadRulesBlock(actSrc));
const ALIAS = loadAlias(actSrc);

/**
 * 判断某条行动是否**在这个列表里漏掉了自己的专有地点**。
 * 抽成纯函数，便于反向对照直接喂坏数据。
 *
 * 依据：行动 id 与地点 id 同名，或别名登记表指明了对应地点。
 * 若两者都推不出专有地点（如 movie → 无同名地点），返回 null 表示不适用。
 */
function findMissingOwnLocation(actionId, locations, aliased) {
  let own = null;
  if (aliased && aliased[actionId]) own = aliased[actionId];
  else if (LOCATION_IDS.indexOf(actionId) >= 0) own = actionId;
  if (!own) return null;
  return locations.map((s) => String(s).trim()).indexOf(own) < 0 ? own : null;
}

/**
 * 提示文案里提到的**中文地名**，是否都在允许列表内。
 *
 * ★ 关键：文案是中文（"去体育馆、公园…"），允许列表是英文 id。
 *   必须先用 NAME_BY_ID 反查标签，再比对 —— 直接拿 id 比对文案会恒绿。
 */
function findContradictingHint(locations, hint, nameById) {
  if (typeof hint !== "string" || !hint) return [];
  const allowedNames = locations.map((s) => {
    const id = String(s).trim();
    return nameById[id] || id;
  });
  const bad = [];
  for (const [id, name] of Object.entries(nameById)) {
    if (name && hint.indexOf(name) >= 0 && allowedNames.indexOf(name) < 0) {
      bad.push(id);
    }
  }
  return bad;
}

/* ---------------- 断言运行器 ---------------- */

let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    const r = fn();
    if (r === true) {
      passed++;
      console.log("  ✅ " + name);
    } else {
      failures.push(name + " — " + r);
      console.log("  ❌ " + name + " — " + r);
    }
  } catch (e) {
    failures.push(name + " — 抛异常: " + e.message);
    console.log("  ❌ " + name + " — 抛异常: " + e.message);
  }
}

/* ---------------- 开跑 ---------------- */

console.log("地点行动规则门禁（locations ⇄ LOCATION_ACTION_RULES）\n");

console.log("① 前置：数据确实取到了（防「样本恒为空」的假绿）");
check("地点 id 数量 > 20", () =>
  LOCATION_IDS.length > 20 ? true : "只取到 " + LOCATION_IDS.length + " 个，提取器可能失效",
);
check("规则数量 > 5", () => {
  const n = Object.keys(RULES).length;
  return n > 5 ? true : "只取到 " + n + " 条规则，提取器可能失效";
});
check("两个专有地点确实存在（gym / internet_cafe）", () => {
  const missing = ["gym", "internet_cafe"].filter((k) => LOCATION_IDS.indexOf(k) < 0);
  return missing.length === 0 ? true : "地点表里没有: " + missing.join(",");
});

console.log("\n② A · 规则里的地点 id 必须真实存在");
check("全部规则的地点均为有效 id", () => {
  const bad = [];
  for (const [aid, rule] of Object.entries(RULES)) {
    for (const l of rule.locations || []) {
      if (LOCATION_IDS.indexOf(String(l).trim()) < 0)
        bad.push(aid + " → " + l);
    }
  }
  return bad.length === 0 ? true : "无效地点 id: " + bad.join(" | ");
});
// 反向对照：检测器必须能报出假 id
check("★ 反向对照：喂假 id，检测器必须报红", () => {
  const fake = { someAction: { locations: ["no_such_place_at_all"] } };
  const bad = [];
  for (const [aid, rule] of Object.entries(fake)) {
    for (const l of rule.locations || []) {
      if (LOCATION_IDS.indexOf(String(l).trim()) < 0) bad.push(aid + " → " + l);
    }
  }
  return bad.length === 1 ? true : "反向对照失灵，检测器没报出假 id";
});

console.log("\n③ B · 行动的专有地点必须被允许（本次修复的核心）");
check("gym（办健身卡锻炼）包含体育馆 gym", () => {
  const miss = findMissingOwnLocation("gym", RULES.gym.locations, ALIAS);
  return miss === null ? true : "漏掉专有地点: " + miss;
});
check("internet_bar（网吧上网）包含网吧 internet_cafe", () => {
  const miss = findMissingOwnLocation("internet_bar", RULES.internet_bar.locations, ALIAS);
  return miss === null ? true : "漏掉专有地点: " + miss;
});
check("全库扫描：不存在任何「漏掉专有地点」的行动", () => {
  const bad = [];
  for (const [aid, rule] of Object.entries(RULES)) {
    const miss = findMissingOwnLocation(aid, rule.locations || [], ALIAS);
    if (miss) bad.push(aid + " 漏 " + miss);
  }
  return bad.length === 0 ? true : bad.join(" | ");
});
// 反向对照：修复前的旧列表必须被判定为「漏」
check("★ 反向对照：修复前的旧 gym 列表必须报红", () => {
  const oldList = ["park", "commercialDist", "entertainment"];
  const miss = findMissingOwnLocation("gym", oldList, ALIAS);
  return miss === "gym" ? true : "反向对照失灵：旧列表没被判出漏地点";
});
check("★ 反向对照：修复前的旧 internet_bar 列表必须报红", () => {
  const oldList = ["slum", "commercialDist", "techPark"];
  const miss = findMissingOwnLocation("internet_bar", oldList, ALIAS);
  return miss === "internet_cafe" ? true : "反向对照失灵：旧列表没被判出漏地点";
});

console.log("\n④ C · 提示文案不得指向允许列表之外的地点");
check("★ 前置：地名表取到了（否则本组断言恒绿）", () => {
  const n = Object.keys(NAME_BY_ID).length;
  return n >= 20 ? true : "只取到 " + n + " 条地名，检测器会恒绿";
});
check("gym 的 hint 不指向列表外地名", () => {
  const bad = findContradictingHint(RULES.gym.locations, RULES.gym.hint, NAME_BY_ID);
  return bad.length === 0 ? true : "文案指向了未允许的地点: " + bad.join(",");
});
check("internet_bar 的 hint 不指向列表外地名", () => {
  const bad = findContradictingHint(
    RULES.internet_bar.locations,
    RULES.internet_bar.hint,
    NAME_BY_ID,
  );
  return bad.length === 0 ? true : "文案指向了未允许的地点: " + bad.join(",");
});
check("全库扫描：没有文案指向未允许的地点", () => {
  const bad = [];
  for (const [aid, rule] of Object.entries(RULES)) {
    const hit = findContradictingHint(rule.locations || [], rule.hint, NAME_BY_ID);
    if (hit.length) bad.push(aid + " → " + hit.join(","));
  }
  return bad.length === 0 ? true : bad.join(" | ");
});
// ★ 真正的反向对照：手工构造一条必然矛盾的文案
check("★ 反向对照：人为矛盾文案必须被报红", () => {
  const bad = findContradictingHint(
    ["park", "commercialDist"],
    "去体育馆、公园或者商业区",
    NAME_BY_ID,
  );
  return bad.length === 1 && bad[0] === "gym"
    ? true
    : "反向对照失灵：矛盾 hint 未被报出（返回 " + JSON.stringify(bad) + "）";
});
// ★ 第二条反向对照：检测器必须能识别"未提及"与"提及但未允许"的区别
check("★ 反向对照：文案未提地名时，不得误报", () => {
  const bad = findContradictingHint(["park"], "去附近的健身场所", NAME_BY_ID);
  return bad.length === 0 ? true : "误报：文案没提地名却报了 " + JSON.stringify(bad);
});

console.log("\n⑤ 别名表自身的一致性");
check("别名表指向的地点 id 必须真实存在", () => {
  const bad = Object.entries(ALIAS).filter(
    ([, v]) => LOCATION_IDS.indexOf(v) < 0,
  );
  return bad.length === 0 ? true : "别名指向无效地点: " + JSON.stringify(bad);
});
check("别名表指向的地点必须在对应规则的 locations 里", () => {
  const bad = [];
  for (const [aid, own] of Object.entries(ALIAS)) {
    const rule = RULES[aid];
    if (!rule) {
      bad.push(aid + " 规则不存在");
      continue;
    }
    if (rule.locations.indexOf(own) < 0) bad.push(aid + " 请求了 " + own + " 但未允许");
  }
  return bad.length === 0 ? true : bad.join(" | ");
});

/* ---------------- 汇总 ---------------- */

console.log("\n════ 结果: " + passed + " 通过 / " + failures.length + " 失败 ════");
if (failures.length) {
  console.log("\n失败明细：");
  failures.forEach((f) => console.log("  · " + f));
  process.exit(1);
}
process.exit(0);
