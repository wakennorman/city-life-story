/**
 * 街道横断面 —— 车流 / 人流 / 道具三方共用的**唯一真源**。
 *
 * ── 为什么必须是一个文件，而不是各自在 actors.js / world.js 里写公式 ──────
 * 这三个系统共享同一条 9~16m 宽的路面，彼此的占位是**互相挤出来的**：
 * 改动其中任何一个的公式，另外两个的合法性就变了。
 * 2026-09-19 实测到的后果：
 *   propsFor 把垃圾桶按"整条路宽"随机撒（world.js 侧一条独立的采样区间），
 *   而 actors.js 侧的车流只知道自己那条 lane 公式 —— 两边从没有对齐过，
 *   于是垃圾桶落在车道中央把车**拦死**（car#1 Δ0.00，1.8s 一动不动）。
 *   这不是"某一处数值写错了"，是"同一个横断面有两份定义"本身必然的结局。
 * 所以：任何"某物占 x 多少"的规则都写在这里，两边 import。
 *
 * ── 横断面（以 slum/lane，roadW 9.5 → half 4.75 为例）────────────────────
 *     车流中心  ±1.15  → 车身半宽 0.89 → 外沿 2.04
 *     行人带    2.20 ~ 2.55（碰撞半径 0.30 → 实际占 1.90 ~ 2.85）
 *     摊位      3.55 ± 0.675 → 2.875 ~ 4.225
 *     电线杆    3.70 ± 0.28 → 3.42 ~ 3.98
 *     电动车    3.85 ~ 4.20
 *     建筑近面  ≥ 4.80
 *   三条必须成立的间隙：
 *     ① 车外沿 2.04 < 行人内沿 2.20（车不压人）
 *     ② 行人外沿 2.85 < 摊位内沿 2.875（人不压摊）
 *     ③ 摊位外沿 4.225 < 路沿 4.75（摊不越界）
 */

export const PED_OUT = 2.2;    // 行人带外沿距路沿的距离
export const PED_W = 0.35;     // 行人带宽度（窄巷里就是这么窄）
export const CAR_HALF = 0.89;  // 车身半宽（与 buildCar 的几何一致）
export const CAR_R = 0.90;     // 车碰撞半径（KIND_R.car，车流避障用这个）
/* 走廊留白：车外沿再往外这么一圈不许有静态碰撞盒。
   不用大值 —— 走廊越宽，路边可放东西的地方越少（窄巷本来就只有 2.4m 富余）。 */
export const CORRIDOR_PAD = 0.15;

/** 车道中心距街心的距离。★ 必须给"路边的摊位/电动车"让出空间 ——
 *  巷弄（half 4.75）两侧各摆 1.35m 的摊位 + 0.9m 的电动车之后，
 *  可通行宽度只剩 ±2.55，而车身半宽 0.89，所以车道中心只能到 1.15。
 *  原来直接用 roadW*0.25 = 2.375，车会**开进摊位里**。 */
export function carLane(roadW, half) {
  return Math.min(roadW * 0.25, Math.max(1.0, half - 3.6));
}

/** 非机动车道：夹在机动车道与路边摊位之间。 */
export function bikeLane(roadW, half) {
  const car = carLane(roadW, half);
  return Math.min(car * 1.5, Math.max(car + 0.3, half - 2.6));
}

/**
 * 人行带 [inner, outer]（|x| 区间）。
 * avenue 有真正的人行道（roadW/2 之外），lane 没有独立人行道，人就贴车道边缘走。
 * 行人走车道中央是明显的失真。
 *
 * ★ 用 layout 名判布局，**不要**拿 half 与 roadW/2 比大小 ——
 *   实测（2026-09-19）那条浮点比较会判错，导致 17 个行人全被放到
 *   |x|≈4.75~4.93 的路沿上（正是"人贴着墙走/穿墙"的观感来源）。
 */
export function pedBandX(layout, roadW, half) {
  if (layout === 'lane' || half <= roadW / 2 + 0.1) {
    /* 巷弄：没有独立人行道 → 贴车道边缘的窄带。 */
    const outer = Math.max(1.1, half - PED_OUT);
    return { inner: Math.max(0.5, outer - PED_W), outer };
  }
  /* 有独立人行道（avenue）或大场地（院区/广场）：沿外沿一条带走。
     ★ 限制带宽 4.2m：院区 half 有 23m，不限制行人会撒满整个院子，
       而"人流"要能看出是**一条流**，散开就没了。
     ★ 必须兜住区间倒置：inner > outer 时随机取值会跑到区间外。 */
  const outer = Math.max(1.4, half - 0.6);
  const inner = Math.max(roadW / 2 + 0.6, outer - 4.2);
  return inner < outer ? { inner, outer } : { inner: Math.max(0.5, outer - PED_W), outer };
}

/**
 * 机动车**实际占用**的 |x| 上限（车流中心 + 车碰撞半径）。
 * 静态碰撞盒越过这条线 = 车物理上会撞上 → 停死。
 * 这是**硬线**：验证断言用这条。
 *
 * ★ half/roadW 取不到就返回 0（不设限），**不要**让 NaN 流出去：
 *   world.js 的采样可能在 layout 函数算出 laneHalf **之前**就被调用
 *   （结构原型里也有散落道具）。NaN 参与比较永远为 false ——
 *   表现为"限制静默失效"，正是本项目最忌讳的那类失败。
 *   宁可返回 0（退化成旧行为），也不要一个看起来在跑、实际没生效的限制。
 */
export function carClearance(layout, roadW, half) {
  if (layout !== 'lane' && layout !== 'avenue') return 0;
  if (!Number.isFinite(half) || !Number.isFinite(roadW)) return 0;
  return carLane(roadW, half) + CAR_R;
}

/**
 * 建造目标线 = 硬线 + 留白。布局按这条线收（world.js 的采样与兜底）。
 *
 * ★ 为什么阈值要分两层，而不是一个数用到底：
 *   窄巷里有些件（比如**转过角**的 10m 高压杆，包围盒半宽能到 1.3m）
 *   在路沿内挤不进留白区，但它的外沿仍**远在车的实际半径之外**，不挡车。
 *   若把断言也压到留白线，就会为 0.02~0.06m 的浮点级差报红 —— 那是假红，
 *   而假红和假绿一样会让人不再相信断言。所以：
 *     建造 → 留白线（尽量远离）；断言 → 硬线（会不会真的撞上）。
 */
export function carCorridor(layout, roadW, half) {
  const c = carClearance(layout, roadW, half);
  return c > 0 ? c + CORRIDOR_PAD : 0;
}

/**
 * 街面件（垃圾桶/垃圾箱/电线杆这类"散落在街上"的物件）的可落点带。
 * 取"走廊外沿"到"路沿内侧"之间 —— 同时满足三条：
 *   ① 不挡车（在走廊之外）  ② 不压门（不到建筑近面）  ③ 行人绕得开。
 * ★ 区间可能倒置（极窄的巷子 + 很宽的车道）：此时退化成"走廊外 0.5m 一条窄带"，
 *   宁可挤一点，也不返回一个空区间让调用方取到区间外的值。
 */
export function roadEdgeBand(corridor, half) {
  const inner = corridor + 0.25;
  const outer = Math.max(inner + 0.5, half - 0.35);
  return { inner, outer };
}
