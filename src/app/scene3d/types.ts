/**
 * scene3d · 3D 场景描述层类型定义
 *
 * 设计原则（CoC 约定式归类）：
 *   地点数据里已有 `type` 与 `wealthTier`，这两项足以推导出场景形态。
 *   新增地点无需写任何 3D 代码 —— 只要 type 落在已知枚举内，
 *   场景生成器会自动为其产出一个场景。
 *
 * 分三层：
 *   Location(游戏数据) --sceneSpec.ts--> SceneSpec(纯描述) --builder.ts--> THREE.Group
 *   SceneSpec 是纯数据，不含 three 依赖，可序列化、可测试、可缓存。
 */

/** 场景类型 —— 与 src/js/data/locations.js 的 `type` 字段一一对应 */
export type SceneType =
  | "residential" // 住宅：城中村 / 郊区 / 高档小区 / 老旧小区
  | "commercial" // 商业：批发市场 / 商业区 / 夜市 / 菜市场 …
  | "industrial" // 工业：工地 / 工业区 / 物流园区
  | "institutional" // 机构：大学城
  | "corporate" // 企业：科技园
  | "service" // 政务办事：医院 / 银行 / 政府 / 法院 / 人才市场
  | "recreation" // 休闲：公园 / 娱乐城 / 寺庙 / 体育馆 / 网吧 …
  | "public" // 公共：社区中心
  | "education"; // 教育：培训中心 / 图书馆

/** 富裕等级，直接取自地点数据 */
export type WealthTier = 1 | 2 | 3;

export interface Vec2 {
  x: number;
  z: number;
}

export interface WindowsSpec {
  rows: number;
  cols: number;
  color: string;
  /** 亮灯比例 0–1，夜间氛围用；白天场景取 0 或很低 */
  lit?: number;
}

export interface BuildingSpec {
  pos: Vec2;
  /** 宽(x) / 深(z) / 高(y) */
  size: { w: number; d: number; h: number };
  /** 楼体主色 */
  body: string;
  /** 屋顶色 */
  roof: string;
  roofShape?: "flat" | "gable" | "hip" | "sawtooth";
  windows?: WindowsSpec;
  /** 局部点缀色（招牌、门头、雨棚等） */
  accent?: string;
  /** 轻微旋转，打散规整感 */
  rotY?: number;
}

export type PropKind =
  | "tree"
  | "bush"
  | "pole"
  | "lamp"
  | "sign"
  | "stall"
  | "crate"
  | "barrier"
  | "car"
  | "bike"
  | "bench"
  | "fence"
  | "container"
  | "ac_unit"
  | "antenna"
  | "trash"
  | "flowerbed"
  | "statue"
  | "gate"
  | "billboard";

export interface PropSpec {
  kind: PropKind;
  pos: Vec2;
  rotY?: number;
  scale?: number;
  /** 覆盖默认配色 */
  color?: string;
}

export interface GroundSpec {
  size: { w: number; d: number };
  /** 地面基色 */
  base: string;
  /** 纵向道路：中心 x 与宽度 */
  road?: { x: number; w: number; color: string };
  curb?: string;
  /** 铺装斑块（广场砖 / 泥地 / 草地），用于打破大面积纯色 */
  patches?: Array<{ pos: Vec2; w: number; d: number; color: string }>;
}

export interface SceneSpec {
  /** 对应 Location.id */
  id: string;
  name: string;
  type: SceneType;
  wealthTier: WealthTier;
  /** 人流密度，影响道具/路人数量 */
  footfall: number;
  ground: GroundSpec;
  buildings: BuildingSpec[];
  props: PropSpec[];
  /** 天空与雾色（决定整体色调） */
  sky: string;
  fog: { color: string; near: number; far: number };
  /** 等轴相机参数 */
  camera: { distance: number; height: number; yaw: number };
  /** 光照强度 0–1，贫民区偏暗 */
  lightIntensity: number;
}

/** 行动热点 —— 复用 Location.availableActions，在场景中定位一个可点区域 */
export interface HotspotSpec {
  actionId: string;
  label: string;
  apCost: number;
  /** 世界坐标 */
  pos: Vec2;
  /** 屏幕投影后的 DOM 定位由 hotspots.ts 计算 */
}

/** 可执行行动 —— 热点渲染所需的最小信息 */
export interface ActionInfo {
  id: string;
  name: string;
  apCost: number;
}

export interface LocationLike {
  id: string;
  name: string;
  type?: string;
  wealthTier?: number;
  footfall?: number;
  desc?: string;
  /** 旧版字段：职业 id 列表，名称需经 ActionRegistry 解析 */
  jobs?: string[];
  /** 新版字段（src/app/data/locations） */
  availableActions?: ActionInfo[];
}
