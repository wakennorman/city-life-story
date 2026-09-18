/**
 * scene3d · 地点专属形态（变体层）
 *
 * 为什么需要这一层：
 *   仅按 type 生成会导致同类地点雷同 —— 公园 / 寺庙 / 体育馆 / 网吧
 *   全是 recreation，若共用一套模板，玩家一眼看出是「换皮」。
 *   本层为每个地点给出独立的空间组织方式。
 *
 * 新增地点时按需在此加一条；不加则自动退回 sceneSpec.ts 的类型默认形态。
 */

import type { PropSpec, BuildingSpec } from "./types";
import { block, scatter, line, type Ctx, type Generated } from "./kit";

const W = 26; // 地面宽
/* ── 通用小工具 ── */

/** 左右对称摆放（寺庙/法院/政务楼的中轴感） */
function mirrored(
  ctx: Ctx,
  dx: number,
  z: number,
  w: number,
  d: number,
  h: number,
  opts?: Parameters<typeof block>[6]
): BuildingSpec[] {
  return [
    block(ctx, -dx, z, w, d, h, opts),
    block(ctx, dx, z, w, d, h, opts),
  ];
}

/* ══════════════════════════ 休闲类 ══════════════════════════ */

/** 公园：开阔绿地，建筑极少，无围墙 */
const park = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 一座亭子
  buildings.push(block(ctx, -6, -6.4, 3.4, 3.4, 3.2, { roofShape: "hip", accent: true }));
  // 大片绿地
  scatter(ctx, 34, ["tree", "bush"], { x0: -12, x1: 12, z0: -9, z1: 9 }, props);
  // 环形步道感：沿两条横线撒长椅
  line(ctx, 6, "bench", { x: -9, z: -1 }, { x: 9, z: -1 }, props);
  line(ctx, 6, "bench", { x: -9, z: 4 }, { x: 9, z: 4 }, props);
  scatter(ctx, 8, ["flowerbed"], { x0: -10, x1: 10, z0: -3, z1: 6 }, props);
  line(ctx, 5, "lamp", { x: -11, z: 0 }, { x: 11, z: 0 }, props);
  scatter(ctx, 2, ["statue"], { x0: -3, x1: 3, z0: 2, z1: 5 }, props);
  return { buildings, props };
};

/** 娱乐城：霓虹塔楼 + 密集招牌 + 铺装广场 */
const entertainmentPlaza = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 主楼高耸，带外立面招牌
  buildings.push(block(ctx, 0, -8, 11, 7, 15 + ctx.rnd() * 4, { roofShape: "flat", accent: true }));
  buildings.push(block(ctx, -10, -7, 6, 6, 8, { roofShape: "flat", accent: true }));
  buildings.push(block(ctx, 10, -7, 6, 6, 8, { roofShape: "flat", accent: true }));
  // 广场大量广告牌与灯柱
  scatter(ctx, 10, ["billboard", "sign"], { x0: -9, x1: 9, z0: 0, z1: 6 }, props, ctx.pal.accents);
  scatter(ctx, 8, ["lamp"], { x0: -11, x1: 11, z0: -1, z1: 7 }, props);
  scatter(ctx, 6, ["car"], { x0: -10, x1: 10, z0: 6, z1: 9 }, props);
  scatter(ctx, 3, ["bench"], { x0: -6, x1: 6, z0: 2, z1: 5 }, props);
  return { buildings, props };
};

/** 寺庙：中轴对称，山门 + 大殿 + 香炉 */
const temple = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 中轴：山门 → 香炉 → 大殿
  props.push({ kind: "gate", pos: { x: 0, z: 8.6 }, scale: 1.25 });
  buildings.push(block(ctx, 0, -3, 7, 4.6, 5.2, { roofShape: "hip", accent: true }));
  buildings.push(block(ctx, 0, -9, 12, 6.4, 7.4, { roofShape: "hip", accent: true }));
  // 两侧配殿
  for (const b of mirrored(ctx, 8.2, -7.4, 5, 5, 4.4, { roofShape: "hip" })) buildings.push(b);
  // 香炉 + 石灯
  props.push({ kind: "statue", pos: { x: 0, z: 2.6 }, scale: 1.3 });
  line(ctx, 4, "statue", { x: -4.5, z: 1 }, { x: -4.5, z: 6 }, props, { scale: 0.8 });
  line(ctx, 4, "statue", { x: 4.5, z: 1 }, { x: 4.5, z: 6 }, props, { scale: 0.8 });
  line(ctx, 6, "lamp", { x: -3, z: 8 }, { x: 3, z: 8 }, props, { scale: 0.9 });
  // 少量树，保持肃穆
  scatter(ctx, 6, ["tree"], { x0: -11, x1: 11, z0: -11, z1: -1 }, props);
  return { buildings, props };
};

/** 体育馆：大型场馆 + 空旷广场 */
const gym = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 主角：低矮大跨度场馆
  buildings.push(block(ctx, 0, -5.5, 17, 11, 6.5, { roofShape: "hip" }));
  buildings.push(block(ctx, -10.5, -6, 4.4, 5, 3.6, { roofShape: "flat" }));
  buildings.push(block(ctx, 10.5, -6, 4.4, 5, 3.6, { roofShape: "flat" }));
  // 广场：灯柱阵列 + 少量绿化
  line(ctx, 6, "lamp", { x: -11, z: 3 }, { x: 11, z: 3 }, props);
  line(ctx, 6, "lamp", { x: -11, z: 7 }, { x: 11, z: 7 }, props);
  scatter(ctx, 8, ["bench"], { x0: -10, x1: 10, z0: 0, z1: 8 }, props);
  scatter(ctx, 8, ["tree", "bush"], { x0: -12, x1: 12, z0: -9, z1: -2 }, props);
  scatter(ctx, 6, ["car"], { x0: -10, x1: 10, z0: 8, z1: 9.6 }, props);
  return { buildings, props };
};

/** 网吧：临街小店，招牌密集，无绿化 */
const internetCafe = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  for (let i = 0; i < 4; i++) {
    const seg = W / 4;
    const x = -W / 2 + seg * (i + 0.5);
    buildings.push(
      block(ctx, x, -7.4, seg - 0.5, 6, 5.5 + ctx.rnd() * 1.6, { roofShape: "flat", accent: true })
    );
  }
  // 招牌 + 灯箱密集
  scatter(ctx, 12, ["sign", "billboard"], { x0: -11, x1: 11, z0: -3.4, z1: 1.5 }, props, ctx.pal.accents);
  scatter(ctx, 10, ["bike"], { x0: -11, x1: 11, z0: 2, z1: 6 }, props);
  scatter(ctx, 4, ["trash", "crate"], { x0: -10, x1: 10, z0: 4, z1: 7 }, props);
  line(ctx, 4, "lamp", { x: -11, z: 1.5 }, { x: 11, z: 1.5 }, props);
  return { buildings, props };
};

/** 花鸟市场：棚架 + 密集摊位 + 大量绿植 */
const flowerBirdMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 低矮棚顶建筑
  buildings.push(block(ctx, -7, -8, 10, 6, 3.4, { roofShape: "sawtooth" }));
  buildings.push(block(ctx, 7, -8, 10, 6, 3.4, { roofShape: "sawtooth" }));
  // 摊位密布
  scatter(ctx, 16, ["stall"], { x0: -11, x1: 11, z0: -2.5, z1: 4 }, props, ctx.pal.accents);
  // 绿植极多（这是花市）
  scatter(ctx, 22, ["bush", "flowerbed"], { x0: -11, x1: 11, z0: -3, z1: 8 }, props);
  scatter(ctx, 8, ["tree"], { x0: -12, x1: 12, z0: 4, z1: 9 }, props);
  scatter(ctx, 4, ["crate"], { x0: -10, x1: 10, z0: 3, z1: 7 }, props);
  return { buildings, props };
};

/* ══════════════════════════ 商业类 ══════════════════════════ */

/** 批发市场：大跨度仓库 + 货箱 + 货车 */
const wholesaleMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -8.4, 20, 6.4, 5.2, { roofShape: "sawtooth" }));
  buildings.push(block(ctx, -11, 6, 5, 6, 4, { roofShape: "flat" }));
  buildings.push(block(ctx, 11, 6, 5, 6, 4, { roofShape: "flat" }));
  // 大量货箱与货柜
  scatter(ctx, 18, ["crate", "container"], { x0: -11, x1: 11, z0: -3, z1: 4 }, props);
  scatter(ctx, 8, ["car"], { x0: -10, x1: 10, z0: 4, z1: 8.5 }, props);
  scatter(ctx, 5, ["pole"], { x0: -11, x1: 11, z0: -0.5, z1: 0.5 }, props);
  scatter(ctx, 3, ["trash"], { x0: -9, x1: 9, z0: 5, z1: 8 }, props);
  return { buildings, props };
};

/** 商业区：高层塔楼群 + 大广场 + 巨型广告牌 */
const commercialDist = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 三栋高低错落的塔楼
  buildings.push(block(ctx, -8, -8.4, 8, 8, 20 + ctx.rnd() * 6, { roofShape: "flat" }));
  buildings.push(block(ctx, 1, -8, 8, 8, 14 + ctx.rnd() * 5, { roofShape: "flat" }));
  buildings.push(block(ctx, 10, -7.6, 7, 7, 11 + ctx.rnd() * 4, { roofShape: "flat" }));
  // 广场 + 巨幅广告
  scatter(ctx, 8, ["billboard"], { x0: -9, x1: 9, z0: 1, z1: 6 }, props, ctx.pal.accents);
  scatter(ctx, 10, ["lamp"], { x0: -11, x1: 11, z0: -1, z1: 8 }, props);
  scatter(ctx, 10, ["car"], { x0: -10, x1: 10, z0: 6, z1: 9.4 }, props);
  scatter(ctx, 6, ["bush", "flowerbed"], { x0: -10, x1: 10, z0: 2, z1: 5 }, props);
  return { buildings, props };
};

/** 夜市：矮棚摊 + 灯笼 + 极密人流 */
const nightMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 背后是矮楼
  for (let i = 0; i < 4; i++) {
    const seg = W / 4;
    buildings.push(
      block(ctx, -W / 2 + seg * (i + 0.5), -8, seg - 0.6, 5.4, 2.8 + ctx.rnd() * 1.2, {
        roofShape: "flat",
        accent: true,
      })
    );
  }
  // 两排摊位夹出一条街
  line(ctx, 7, "stall", { x: -7, z: -1.5 }, { x: 7, z: -1.5 }, props);
  line(ctx, 7, "stall", { x: -7, z: 3 }, { x: 7, z: 3 }, props);
  scatter(ctx, 10, ["sign"], { x0: -9, x1: 9, z0: -3, z1: 5 }, props, ctx.pal.accents);
  // 灯串
  scatter(ctx, 10, ["lamp"], { x0: -9, x1: 9, z0: -2, z1: 4 }, props);
  scatter(ctx, 6, ["crate", "trash"], { x0: -9, x1: 9, z0: 4.5, z1: 8 }, props);
  scatter(ctx, 5, ["bike"], { x0: -9, x1: 9, z0: 5, z1: 8 }, props);
  return { buildings, props };
};

/** 菜市场：棚顶市场 + 菜筐 */
const vegetableMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -8.2, 18, 6, 3.8, { roofShape: "sawtooth" }));
  buildings.push(block(ctx, -11, 5, 4.6, 5.4, 3.2, { roofShape: "flat" }));
  // 摊位阵列（两行三列）
  for (const z of [-1.5, 2.2]) {
    line(ctx, 5, "stall", { x: -8, z }, { x: 8, z }, props);
  }
  scatter(ctx, 14, ["crate"], { x0: -10, x1: 10, z0: -3, z1: 6 }, props, ["#9a7a52", "#8a6a48", "#7d8a52"]);
  scatter(ctx, 8, ["tree"], { x0: -12, x1: 12, z0: 6, z1: 9 }, props);
  scatter(ctx, 5, ["bike"], { x0: -10, x1: 10, z0: 6, z1: 9 }, props);
  line(ctx, 4, "lamp", { x: -9, z: 0.4 }, { x: 9, z: 0.4 }, props);
  return { buildings, props };
};

/** 二手市场：地摊满地 + 杂货堆积 */
const fleaMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, -8, -8, 9, 5.6, 3.6, { roofShape: "flat" }));
  buildings.push(block(ctx, 6, -8, 9, 5.6, 3.4, { roofShape: "flat" }));
  // 地摊：遍布全场
  scatter(ctx, 18, ["stall"], { x0: -11, x1: 11, z0: -3, z1: 7 }, props, ctx.pal.accents);
  scatter(ctx, 20, ["crate", "trash"], { x0: -11, x1: 11, z0: -2, z1: 8 }, props);
  scatter(ctx, 6, ["bike", "car"], { x0: -10, x1: 10, z0: 6, z1: 9 }, props);
  line(ctx, 3, "lamp", { x: -8, z: 4 }, { x: 8, z: 4 }, props);
  return { buildings, props };
};

/** 汽车城：展厅 + 停车场 */
const autoCity = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 4S 店展厅：玻璃长条
  buildings.push(block(ctx, 0, -8.4, 19, 6.6, 6.4, { roofShape: "flat", accent: true }));
  // 停车场：整齐排列的车（用网格替代随机）
  for (let r = 0; r < 3; r++) {
    line(ctx, 5, "car", { x: -9, z: -1 + r * 2.6 }, { x: 9, z: -1 + r * 2.6 }, props);
  }
  scatter(ctx, 6, ["pole", "lamp"], { x0: -11, x1: 11, z0: -3, z1: 8 }, props);
  scatter(ctx, 4, ["bush", "flowerbed"], { x0: -10, x1: 10, z0: 7, z1: 9 }, props);
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 } });
  return { buildings, props };
};

/* ══════════════════════════ 服务类 ══════════════════════════ */

/** 医院：主楼 + 急诊雨棚 + 救护车通道 */
const hospital = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -8.4, 17, 7, 12 + ctx.rnd() * 3, { roofShape: "flat" }));
  // 裙楼（门诊）
  buildings.push(block(ctx, -10.5, -4, 5, 6, 5.5, { roofShape: "flat", accent: true }));
  buildings.push(block(ctx, 10.5, -4, 5, 6, 5.5, { roofShape: "flat", accent: true }));
  // 急诊通道：救护车 + 雨棚
  scatter(ctx, 3, ["car"], { x0: -3, x1: 3, z0: 2, z1: 4 }, props, ["#b8b4ac"]);
  props.push({ kind: "gate", pos: { x: 0, z: 9.6 } });
  scatter(ctx, 8, ["lamp"], { x0: -10, x1: 10, z0: -1, z1: 7 }, props);
  scatter(ctx, 8, ["tree", "bush"], { x0: -11, x1: 11, z0: 5, z1: 9 }, props);
  scatter(ctx, 6, ["bench"], { x0: -8, x1: 8, z0: 4, z1: 7 }, props);
  return { buildings, props };
};

/** 银行：庄重矮楼 + 柱廊台阶 */
const bank = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -7.6, 14, 7.4, 8.4, { roofShape: "flat", accent: true }));
  for (const b of mirrored(ctx, 9.6, -7, 4.6, 5.4, 5.2, { roofShape: "flat" })) buildings.push(b);
  // 柱廊（用 pole 做立柱）
  line(ctx, 6, "pole", { x: -5.5, z: -3.4 }, { x: 5.5, z: -3.4 }, props, { scale: 0.95 });
  scatter(ctx, 6, ["lamp"], { x0: -9, x1: 9, z0: 1, z1: 6 }, props);
  scatter(ctx, 6, ["bush", "flowerbed"], { x0: -9, x1: 9, z0: 1, z1: 5 }, props);
  scatter(ctx, 5, ["car"], { x0: -9, x1: 9, z0: 6, z1: 9 }, props);
  scatter(ctx, 4, ["bench"], { x0: -5, x1: 5, z0: 2, z1: 5 }, props);
  return { buildings, props };
};

/** 政府办事大厅：严格对称 + 大广场 + 旗杆 */
const govOffice = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 主楼居中，两翼对称
  buildings.push(block(ctx, 0, -8.6, 13, 6.6, 10, { roofShape: "flat", accent: true }));
  for (const b of mirrored(ctx, 9.4, -7.6, 6, 6, 7, { roofShape: "flat" })) buildings.push(b);
  // 旗杆（广场正中）
  props.push({ kind: "pole", pos: { x: 0, z: 2.6 }, scale: 1.35 });
  // 对称灯柱与绿化
  line(ctx, 4, "lamp", { x: -9, z: 0 }, { x: -3, z: 0 }, props);
  line(ctx, 4, "lamp", { x: 3, z: 0 }, { x: 9, z: 0 }, props);
  scatter(ctx, 8, ["flowerbed"], { x0: -9, x1: 9, z0: 3, z1: 7 }, props);
  scatter(ctx, 6, ["tree"], { x0: -11, x1: 11, z0: 4, z1: 9 }, props);
  scatter(ctx, 5, ["car"], { x0: -9, x1: 9, z0: 7.5, z1: 9.4 }, props);
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 }, scale: 1.15 });
  return { buildings, props };
};

/** 法院：庄重对称 + 高台阶 + 石柱 */
const court = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -8.2, 15, 7, 11, { roofShape: "flat" }));
  for (const b of mirrored(ctx, 10, -7.4, 4.6, 5.6, 6, { roofShape: "flat" })) buildings.push(b);
  // 门廊立柱
  line(ctx, 8, "pole", { x: -6.5, z: -3.6 }, { x: 6.5, z: -3.6 }, props, { scale: 1.05 });
  // 阶前对称石座
  line(ctx, 2, "statue", { x: -7, z: 0.5 }, { x: -7, z: 4 }, props, { scale: 1.1 });
  line(ctx, 2, "statue", { x: 7, z: 0.5 }, { x: 7, z: 4 }, props, { scale: 1.1 });
  scatter(ctx, 8, ["tree"], { x0: -12, x1: 12, z0: 5, z1: 9 }, props);
  scatter(ctx, 4, ["car"], { x0: -9, x1: 9, z0: 7, z1: 9 }, props);
  line(ctx, 4, "lamp", { x: -9, z: 3 }, { x: 9, z: 3 }, props);
  return { buildings, props };
};

/** 人才市场：大厅 + 告示板 + 人流密集 */
const jobMarket = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, 0, -8.4, 17, 6.6, 7.6, { roofShape: "flat", accent: true }));
  // 大量告示板（这是人才市场的信息特征）
  scatter(ctx, 12, ["billboard", "sign"], { x0: -10, x1: 10, z0: -1, z1: 6 }, props, ctx.pal.accents);
  // 人流密度高：车与单车多
  scatter(ctx, 10, ["bike"], { x0: -11, x1: 11, z0: 3, z1: 8 }, props);
  scatter(ctx, 6, ["car"], { x0: -10, x1: 10, z0: 6, z1: 9.4 }, props);
  scatter(ctx, 6, ["bench"], { x0: -8, x1: 8, z0: 1, z1: 5 }, props);
  line(ctx, 5, "lamp", { x: -10, z: 5.5 }, { x: 10, z: 5.5 }, props);
  return { buildings, props };
};

/* ══════════════════════════ 住宅类 ══════════════════════════ */

/** 城中村：密矮拥挤，飞线空调，巷道狭窄 */
const slum = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 五列四排，挤到几乎相连
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      const x = -11.2 + c * 5.6;
      const z = -8 + r * 5.4;
      buildings.push(
        block(ctx, x, z, 5.0, 5.0, 5.5 + ctx.rnd() * 4.5, {
          roofShape: "flat",
          accent: ctx.rnd() > 0.5,
        })
      );
    }
  }
  // 巷道：挂在楼面的空调外机与天线
  scatter(ctx, 22, ["ac_unit"], { x0: -12, x1: 12, z0: -9, z1: 9 }, props);
  scatter(ctx, 12, ["antenna"], { x0: -11, x1: 11, z0: -9, z1: 9 }, props);
  scatter(ctx, 14, ["trash", "crate"], { x0: -11, x1: 11, z0: -9, z1: 9 }, props);
  scatter(ctx, 10, ["bike"], { x0: -11, x1: 11, z0: -9, z1: 9 }, props);
  line(ctx, 4, "pole", { x: 0, z: -9.5 }, { x: 0, z: 9.5 }, props);
  return { buildings, props };
};

/** 郊区：疏朗低层 + 院落 + 绿树 */
const suburb = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 散落的独栋
  const spots = [
    [-9, -7], [-2, -8], [5, -7], [11, -6],
    [-10, 2], [-3, 1], [4, 2], [10, 3],
  ];
  for (const [x, z] of spots) {
    buildings.push(
      block(ctx, x, z, 4.6, 4.6, 3.2 + ctx.rnd() * 1.8, { roofShape: "gable", accent: ctx.rnd() > 0.6 })
    );
  }
  scatter(ctx, 22, ["tree", "bush"], { x0: -12, x1: 12, z0: -9, z1: 9 }, props);
  scatter(ctx, 8, ["flowerbed"], { x0: -11, x1: 11, z0: -6, z1: 8 }, props);
  scatter(ctx, 6, ["car", "bike"], { x0: -11, x1: 11, z0: -2, z1: 6 }, props);
  line(ctx, 5, "lamp", { x: -11, z: 6.5 }, { x: 11, z: 6.5 }, props);
  return { buildings, props };
};

/** 高档小区：高楼稀疏 + 围墙 + 中庭绿化 */
const luxuryCommunity = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 三栋高层，间距大
  buildings.push(block(ctx, -8.5, -7, 7, 7, 18 + ctx.rnd() * 5, { roofShape: "flat" }));
  buildings.push(block(ctx, 1, -8, 7, 7, 22 + ctx.rnd() * 5, { roofShape: "flat" }));
  buildings.push(block(ctx, 10, -7, 6.4, 7, 15 + ctx.rnd() * 4, { roofShape: "flat" }));
  buildings.push(block(ctx, 0, 2, 5, 5, 4, { roofShape: "flat", accent: true })); // 会所
  // 围墙（四面）
  props.push({ kind: "fence", pos: { x: 0, z: 9.6 }, scale: 3.0 });
  props.push({ kind: "fence", pos: { x: -12.4, z: 0 }, rotY: Math.PI / 2, scale: 3.0 });
  props.push({ kind: "fence", pos: { x: 12.4, z: 0 }, rotY: Math.PI / 2, scale: 3.0 });
  props.push({ kind: "gate", pos: { x: 0, z: 9.7 }, scale: 1.15 });
  // 中庭：水景感（用花坛替代）+ 绿化
  scatter(ctx, 16, ["tree", "flowerbed"], { x0: -11, x1: 11, z0: 0, z1: 8 }, props);
  scatter(ctx, 8, ["bench"], { x0: -9, x1: 9, z0: 1, z1: 7 }, props);
  line(ctx, 6, "lamp", { x: -10, z: 5 }, { x: 10, z: 5 }, props);
  scatter(ctx, 5, ["car"], { x0: -8, x1: 8, z0: 7.5, z1: 9.4 }, props);
  return { buildings, props };
};

/** 老旧小区：中年份住宅 + 花坛 + 晾衣杆感 */
const oldCommunity = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 六层板楼三排
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const x = -8.6 + c * 8.6;
      const z = -8.4 + r * 8.4;
      buildings.push(
        block(ctx, x, z, 7.4, 5.4, 6 * (0.95 + ctx.rnd() * 0.2), {
          roofShape: "gable",
          accent: ctx.rnd() > 0.7,
        })
      );
    }
  }
  // 楼间：花坛、单车、晾晒杆（用 pole 表现）
  scatter(ctx, 12, ["flowerbed", "bench"], { x0: -11, x1: 11, z0: -3, z1: 4 }, props);
  scatter(ctx, 14, ["bike"], { x0: -11, x1: 11, z0: -2, z1: 6 }, props);
  scatter(ctx, 8, ["tree"], { x0: -11, x1: 11, z0: -4, z1: 6 }, props);
  scatter(ctx, 6, ["ac_unit", "antenna"], { x0: -11, x1: 11, z0: -9, z1: 9 }, props);
  line(ctx, 5, "lamp", { x: -10, z: 0 }, { x: 10, z: 0 }, props);
  return { buildings, props };
};

/* ══════════════════════════ 工业类 ══════════════════════════ */

/** 建筑工地：基坑 + 塔吊 + 围挡 + 渣土 */
const construction = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 在建主体（半成品：只有骨架高度）
  buildings.push(block(ctx, -6, -6, 8, 7, 4.5, { roofShape: "flat" }));
  // 塔吊立柱（细高）
  buildings.push(block(ctx, 6, -4, 1.0, 1.0, 18, { roofShape: "flat", accent: true }));
  // 工棚
  buildings.push(block(ctx, -11, 6, 4.6, 5, 2.8, { roofShape: "gable" }));
  // 基坑：用深色斑块 + 渣土
  props.push({ kind: "container", pos: { x: 3, z: 4 }, color: "#7a6a58" });
  props.push({ kind: "container", pos: { x: 6, z: 6 }, color: "#8a6a48" });
  scatter(ctx, 16, ["crate", "trash", "barrier"], { x0: -10, x1: 10, z0: 0, z1: 7 }, props);
  scatter(ctx, 8, ["barrier"], { x0: -11, x1: 11, z0: 7.5, z1: 8.8 }, props);
  // 围挡
  line(ctx, 6, "fence", { x: -11, z: 9.4 }, { x: 11, z: 9.4 }, props, { scale: 2.6 });
  line(ctx, 5, "pole", { x: -11, z: -2 }, { x: 11, z: -2 }, props);
  return { buildings, props };
};

/** 工业区：厂房 + 烟囱 + 管道 */
const factoryZone = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  buildings.push(block(ctx, -6.5, -7.4, 10, 7, 6.4, { roofShape: "sawtooth" }));
  buildings.push(block(ctx, 6.5, -7.4, 10, 7, 6.4, { roofShape: "sawtooth" }));
  // 烟囱组
  buildings.push(block(ctx, 10.6, 2, 1.5, 1.5, 17, { roofShape: "flat", accent: true }));
  buildings.push(block(ctx, 7.6, 3, 1.5, 1.5, 13, { roofShape: "flat", accent: true }));
  // 管廊：用 pole 连成一线
  line(ctx, 8, "pole", { x: -11, z: 0 }, { x: 5, z: 0 }, props, { scale: 0.8 });
  scatter(ctx, 12, ["container", "crate"], { x0: -10, x1: 4, z0: 2, z1: 8 }, props);
  scatter(ctx, 8, ["car"], { x0: -10, x1: 10, z0: 6.5, z1: 9.4 }, props);
  scatter(ctx, 6, ["barrier", "trash"], { x0: -10, x1: 10, z0: -2, z1: 4 }, props);
  return { buildings, props };
};

/** 物流园区：仓库阵列 + 货柜堆场 + 货车 */
const logisticsPark = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 三座大仓库
  for (let i = 0; i < 3; i++) {
    buildings.push(block(ctx, -9 + i * 9, -7.8, 8, 6.6, 5.4, { roofShape: "sawtooth" }));
  }
  buildings.push(block(ctx, -11, 6, 4.6, 5, 3.4, { roofShape: "flat" }));
  // 货柜堆场：成排堆叠
  for (let r = 0; r < 2; r++) {
    line(ctx, 5, "container", { x: -10, z: -1 + r * 2.2 }, { x: 8, z: -1 + r * 2.2 }, props);
  }
  scatter(ctx, 8, ["car"], { x0: -10, x1: 10, z0: 4, z1: 9 }, props, ["#8a8a86", "#7d7d80", "#94948e"]);
  scatter(ctx, 6, ["crate"], { x0: -10, x1: 10, z0: 2, z1: 7 }, props);
  scatter(ctx, 4, ["pole", "lamp"], { x0: -11, x1: 11, z0: -4, z1: 2 }, props);
  return { buildings, props };
};

/* ══════════════════════════ 教育类 ══════════════════════════ */

/** 培训中心：临街商住楼改的补习班 */
const trainingCenter = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  for (let i = 0; i < 4; i++) {
    const seg = W / 4;
    buildings.push(
      block(ctx, -W / 2 + seg * (i + 0.5), -7.6, seg - 0.5, 6.4, 6 + ctx.rnd() * 2, {
        roofShape: "flat",
        accent: true,
      })
    );
  }
  // 招牌密集（培训机构的特征）
  scatter(ctx, 10, ["sign", "billboard"], { x0: -10, x1: 10, z0: -3.4, z1: 1 }, props, ctx.pal.accents);
  scatter(ctx, 10, ["bike"], { x0: -11, x1: 11, z0: 2, z1: 6 }, props);
  scatter(ctx, 6, ["bench"], { x0: -9, x1: 9, z0: 1, z1: 5 }, props);
  scatter(ctx, 5, ["tree"], { x0: -11, x1: 11, z0: 4, z1: 8 }, props);
  line(ctx, 4, "lamp", { x: -10, z: 1.2 }, { x: 10, z: 1.2 }, props);
  return { buildings, props };
};

/** 图书馆：独立大体量 + 阅前广场 + 安静绿化 */
const library = (ctx: Ctx): Generated => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  // 主馆：横向大体量，带中庭感
  buildings.push(block(ctx, 0, -7.8, 18, 8, 9, { roofShape: "flat", accent: true }));
  buildings.push(block(ctx, -10.5, -1, 4.4, 5, 4.4, { roofShape: "flat" }));
  // 台阶广场 + 对称绿化（安静氛围：树多、车少）
  scatter(ctx, 14, ["tree"], { x0: -12, x1: 12, z0: 1, z1: 9 }, props);
  scatter(ctx, 8, ["bush", "flowerbed"], { x0: -10, x1: 10, z0: 1, z1: 6 }, props);
  scatter(ctx, 8, ["bench"], { x0: -9, x1: 9, z0: 1, z1: 6 }, props);
  line(ctx, 6, "lamp", { x: -10, z: 0 }, { x: 10, z: 0 }, props);
  scatter(ctx, 3, ["bike"], { x0: -8, x1: 8, z0: 7, z1: 9 }, props);
  return { buildings, props };
};

/* ══════════════════════════ 注册表 ══════════════════════════ */

export const VARIANTS: Record<string, (ctx: Ctx) => Generated> = {
  // 休闲
  park,
  entertainment: entertainmentPlaza,
  temple,
  gym,
  internet_cafe: internetCafe,
  flower_bird_market: flowerBirdMarket,
  // 商业
  wholesaleMarket,
  commercialDist,
  night_market: nightMarket,
  vegetable_market: vegetableMarket,
  flea_market: fleaMarket,
  auto_city: autoCity,
  // 服务
  hospital,
  bank,
  gov_office: govOffice,
  court,
  job_market: jobMarket,
  // 住宅
  slum,
  suburb,
  luxury_community: luxuryCommunity,
  old_community: oldCommunity,
  // 工业
  construction,
  factoryZone,
  logistics_park: logisticsPark,
  // 教育
  trainingCenter,
  library,
};
