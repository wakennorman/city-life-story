import * as THREE from 'three';

/* ══ 面部特写相机 ══════════════════════════════════════════════════════════
   2026-09-19 新建。恒稳要「面部特写」。

   ── 为什么这件事必须先有相机，再谈脸好不好 ────────────────────────────────
   默认机位是 dist≈18m / pitch 44° 的等轴测俯视。算一下像素：
     46° 垂直 FOV、900px 高 → 18m 处画面高约 15m，约 60 px/m。
     · 1.72m 的人 ≈ 103px
     · 头（直径 0.21m）≈ 13px
     · 眼睛（0.038m）≈ 2.3px
   → **在默认机位下，"脸做得对不对"根本无法评判**，因为脸只有 13 个像素。
   所以"面部特写"的第一性需求不是画一张更精致的脸贴图，而是
   **一个能站在脸前面 0.6m 的机位**。先有尺子，才谈得上量。

   ── 取景参数是怎么算出来的（不是拍脑袋调的）──────────────────────────────
   人像镜头取 32° 垂直 FOV（默认跟随视角是 46°）：视角越窄，
   透视畸变越小 —— 46° 在 0.6m 处会把鼻子拍成"鱼眼大鼻子"。
   设"头直径占画面高度"的比例为 fill，则
       2R = fill × 2·d·tan(fov/2)        →   d = R / (fill · tan(fov/2))
   取 R=0.105m、fill=0.62、fov=32° → d ≈ 0.591m。
   900px 高时头约占 558px，眼睛约 70px —— 五官是否真的存在，一眼可判。

   ── 三个必须绕开的坑（都是"不报错、只是画面不对"那一类）──────────────────
   ① **near 平面**：bridge 里相机是 `PerspectiveCamera(46, …, 0.5, 250)`，
      near = 0.5m。0.59m 的机位下，脸的前表面离镜头只有 0.59−0.105 = 0.485m
      → **头会被 near 面整片裁掉**，画面里只剩脖子以下。所以特写期间必须把
      near 压到 0.05m，退出时还原（near 直接决定深度精度，不能全局改）。
   ② **遮挡回避的 0.7m 余量**：IsoCamera.clearance 返回
      `Math.max(minH, best - 0.7)`。遮挡回避本意是"别把相机塞进墙里"，
      但它对 0.59m 的肖像机位会算出负值 → 夹到 minH(5.5) 或 0.35，
      头发被裁一半。故特写期间必须关掉 `cam.avoid`。
   ③ **玩家自己的模型**：和 NPC 面对面交谈时，玩家就站在离 NPC 脸 0.6m 处，
      而那正是肖像机位所在 → 镜头会钻进玩家头里，画面里是玩家颅骨内侧。
      所以特写期间隐藏玩家模型（相当于"拍照模式"）。

   ── 与其他机位逻辑的分工（不要重复实现）──────────────────────────────────
   本模块**不自己算相机位置**，只改 IsoCamera 的那几个参数
   （yaw / pitch / dist / lookY / avoid）后交给它的 `apply()` 去摆。
   理由：遮挡回避、边界夹取、pitch→垂直分量的换算都只有那一份实现，
   另起一套必然漂移 —— 而这个项目已经吃过"同一横断面两份定义"的亏
   （见 actors.js 文件头：垃圾桶被撒进车道把车拦死）。

   ── 过渡 ────────────────────────────────────────────────────────────────
   t 从 0 线性推到 1（0.42s），再用 smoothstep 取缓动。
   t=0 时**完全不碰相机**（直接 return），于是"没在特写"这条路径与
   加这个模块之前逐字节一致 —— 不会因为引入了特写而让跟随视角有丝毫变化。
   ────────────────────────────────────────────────────────────────────────── */

const PORTRAIT = {
  fov: 32,       // 垂直视角（人像取窄角，压透视畸变）
  fill: 0.62,    // 头部直径占画面高度的比例
  pitch: 0.055,  // 机位略高于视线（自然的人像俯角）
  side: 0.17,    // 偏离面部正轴的弧度 → 约 9.7° 的微侧脸，纯正脸像证件照
  dur: 0.42,     // 进出过渡时长（秒）
  near: 0.05,    // 特写期间的近裁剪面（见顶注坑①）
};

const _q = new THREE.Quaternion();
const _f = new THREE.Vector3();
const _head = new THREE.Vector3();
const _pt = new THREE.Vector3();
const _aim = new THREE.Vector3();

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/* smoothstep：起止都不"咯噔"一下。线性过渡在两头会有明显的一顿。 */
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/* 角度插值必须走**最短弧**：yaw 从 0.38 到 −1.90 时若直接线性插值，
   会绕远路转 2.28rad；而最短弧只转 −1.52rad。
   走错方向的症状不是报错，是过渡中间镜头**横扫一整圈**（像甩尾）。 */
function lerpAngle(a, b, t) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/**
 * 从各种"目标"里解算出一个可拍的头：世界位置 / 半径 / 朝向。
 *
 * 接受三种写法（按优先级）：
 *   · `{ obj, kind }` —— ActorSystem 里的角色记录（a.obj 是人形组）
 *   · `Object3D`      —— 直接给人形组（检测 `userData.head`）
 *   · `{ x, z, y, r, yaw }` —— 裸坐标（取证脚本/测试用，不依赖场景）
 *
 * ★ 头心与半径从 `userData.head` 读，**不在这里写死 1.60/0.105**：
 *   这两个数属于"人形长什么样"，归 actors.js::buildHuman 所有。
 *   在相机里再写一份，等于同一件事两份定义 —— 以后调身高比例时
 *   相机会悄悄拍偏，而且不报错。
 */
export function headOf(target, opts = {}) {
  const obj = target && target.obj ? target.obj : target;

  /* 裸坐标分支：没有 Object3D 也要能取景（用于断言"取景数学本身对不对"）。 */
  if (!obj || (obj.isObject3D !== true)) {
    if (target && typeof target.x === 'number' && typeof target.z === 'number') {
      return {
        obj: null,
        head: new THREE.Vector3(target.x, target.y != null ? target.y : 1.60, target.z),
        r: opts.r != null ? opts.r : 0.105,
        yaw: opts.yaw != null ? opts.yaw : (target.yaw || 0),
        id: null,
      };
    }
    return null;
  }

  const prof = (obj.userData && obj.userData.head) || null;
  const ly = opts.y != null ? opts.y : (prof ? prof.y : 1.60);
  const lr = opts.r != null ? opts.r : (prof ? prof.r : 0.105);

  /* ★ 必须用**世界**坐标：人形可能被挂在别的组下面
     （例如 buildBike 把骑手挂在摩托组里，那是局部坐标）。
     直接用 obj.position 会把镜头摆到街心去，且不报错。 */
  obj.updateWorldMatrix(true, false);
  obj.getWorldPosition(_head);
  const s = obj.scale ? obj.scale.y : 1;
  _head.y += ly * s;

  /* 朝向也走世界四元数，理由同上。模型静止时面朝局部 +Z
     （约定见 actors.js::buildHuman 与 _updPed），故取 +Z 的世界方向。 */
  obj.getWorldQuaternion(_q);
  _f.set(0, 0, 1).applyQuaternion(_q);
  const yaw = opts.yaw != null ? opts.yaw : Math.atan2(_f.x, _f.z);

  return {
    obj,
    head: _head.clone(),
    r: lr * s,
    yaw,
    id: (obj.userData && (obj.userData.__actorId || obj.userData.npcName)) || null,
  };
}

export class FaceCam {
  /**
   * @param {object} deps
   * @param {THREE.PerspectiveCamera} deps.camera 场景主相机（只改 fov/near，改完还原）
   * @param {object} deps.cam        IsoCamera 实例（只改 yaw/pitch/dist/lookY/avoid）
   * @param {Function} [deps.getPlayer] 返回玩家位置 {x,z}（Vector3 也可）
   * @param {Function} [deps.setHidden] 隐藏/显示玩家模型（true = 隐藏）
   */
  constructor({ camera, cam, getPlayer, setHidden } = {}) {
    this.camera = camera;
    this.cam = cam;
    this.getPlayer = getPlayer || null;
    this.setHidden = setHidden || null;

    this.t = 0;              // 过渡进度 0..1
    this.on = false;         // 是否"要"在特写态
    this.info = null;        // 当前目标头（**每帧重解**，见 _refresh）
    this.saved = null;       // 进入特写前的机位快照
    this._hidden = false;    // 当前是否已隐藏玩家
    this.aimYaw = 0;         // 解算出的目标 yaw（带侧偏）
    this.sideSign = 1;       // 侧偏方向（±1），focus 时定、之后不再变
    this.fill = PORTRAIT.fill;
    this.fov = PORTRAIT.fov;
    this.dist = PORTRAIT.dist;
    /* ★ 保留目标本身（而不是只留一份快照坐标系）——
       理由见 _refresh：项目里的角色是**会走的**。 */
    this.target = null;
    this.opts = {};
  }

  /** 特写是否正在生效（含进出过渡中）。 */
  get active() { return this.on || this.t > 0.0001; }

  /** 供取证/门禁读取的机位读数。**断言要用的量都在这里**。 */
  get debug() {
    const c = this.camera, m = this.cam;
    return {
      active: this.active,
      t: Number(this.t.toFixed(4)),
      id: this.info ? this.info.id : null,
      /* 目标头心的世界坐标。门禁靠它 + 相机位置算"有没有正对头"，
         而不是靠"画面里有没有脸"那种无法自动判定的说法。 */
      headY: this.info ? Number(this.info.head.y.toFixed(4)) : null,
      headX: this.info ? Number(this.info.head.x.toFixed(4)) : null,
      headZ: this.info ? Number(this.info.head.z.toFixed(4)) : null,
      r: this.info ? Number(this.info.r.toFixed(4)) : null,
      /* 相机到头心的**实际**距离。这是最核心的一条：
         默认机位 13~18m、特写 0.59m，"取景错了"（拍成腿）时它也不会异常，
         所以它必须和 headY/相机高度一起看 —— 见 verify-face.cjs 的组合断言。 */
      camDist: this.info ? +c.position.distanceTo(this.info.head).toFixed(4) : null,
      camY: Number(c.position.y.toFixed(4)),
      fov: c.fov,
      near: c.near,
      avoid: !!m.avoid,
      lookY: m.lookY,
      yaw: Number(m.yaw.toFixed(4)),
    };
  }

  /**
   * 进入特写。
   * @param {object} target 角色记录 / Object3D / 裸坐标
   * @param {object} [opts] { y, r, yaw, side, fill }
   * @returns {boolean} 目标可用则 true
   */
  focus(target, opts = {}) {
    const info = headOf(target, opts);
    if (!info) return false;
    this.info = info;
    this.target = target;
    this.opts = opts;

    /* 快照只在"从静止态进入"时打。过渡中途换目标不该把
       已经偏掉的肖像机位当成"原来的机位"存下来，
       否则退出时会回到一个半特写的机位 —— 而且看起来像"相机没归位"。 */
    if (!this.saved) {
      const c = this.cam;
      this.saved = {
        yaw: c.yaw, pitch: c.pitch, dist: c.dist, minH: c.minH,
        lookY: c.lookY, avoid: c.avoid,
        fov: this.camera.fov, near: this.camera.near,
      };
    }

    /* ── 取景解算 ──
       fill / fov 可覆盖：取证脚本要拍"多个头并排"时得留出横向空间。 */
    this.fill = opts.fill != null ? opts.fill : PORTRAIT.fill;
    this.fov = opts.fov != null ? opts.fov : PORTRAIT.fov;
    this.dist = info.r / (this.fill * Math.tan((this.fov / 2) * (Math.PI / 180)));

    /* 微侧脸的偏哪一侧：朝**玩家所在的那一侧**偏。
       纯正脸像证件照；朝固定方向偏，又会出现"玩家从右边过来、
       镜头却从左边切"的别扭感。玩家位置取不到时退回正向。
       ★ 方向只在 focus 时定一次（存成 ±1）：每帧重算的话，
         玩家与目标相对位置一旦跨过面部轴线，镜头会左右横跳。 */
    let side = opts.side != null ? opts.side : PORTRAIT.side;
    const pp = this._playerVec();
    this.sideSign = 1;
    if (pp && side) {
      const fx = Math.sin(info.yaw), fz = Math.cos(info.yaw);
      const rx = fz, rz = -fx;                      // 面右向量
      const lat = (pp.x - info.head.x) * rx + (pp.z - info.head.z) * rz;
      if (lat < 0) this.sideSign = -1;
    }
    this.aimYaw = info.yaw + side * this.sideSign;

    this.on = true;
    return true;
  }

  /**
   * 重新解算目标头。**每帧调用**（只在特写态）。
   *
   * ★★ 为什么不能在 focus() 里解算一次就存着：
   *   项目里的角色是**会走的**。实测（2026-09-19，face-ingame-closeup）：
   *   锁定一个路人后，0.42s 的过渡还没走完，人已经走出取景框 ——
   *   画面里只剩半张脸贴着边缘，下巴被切掉一半。
   *   而所有"取景数学"断言此时**全绿** —— 因为它们量的是
   *   `debug.headX/headY`（那份陈旧的快照），不是屏幕上真正被拍到的那个头。
   *   → 教训：断言必须量"当下真实的那个点"，否则它会为一份过期数据背书。
   */
  _refresh() {
    if (!this.target) return;
    const info = headOf(this.target, this.opts);
    if (!info) return;
    /* 半径可能变（同一个人不会变，但换目标/换缩放会）——
       按同一个 fill 重解距离，保证"头在画面里始终占 fill"这条不变式。 */
    const r = info.r;
    if (r > 1e-4) this.dist = r / (this.fill * Math.tan((this.fov / 2) * (Math.PI / 180)));
    this.info = info;
    this.aimYaw = info.yaw + (this.opts.side != null ? this.opts.side : PORTRAIT.side) * this.sideSign;
  }

  /** 退出特写（平滑回到等轴测跟随机位）。 */
  release() { this.on = false; }

  /** 在特写/跟随之间切换。返回切换后是否处于特写。 */
  toggle(target, opts) {
    if (this.active) { this.release(); return false; }
    return this.focus(target, opts);
  }

  _playerVec() {
    if (!this.getPlayer) return null;
    const p = this.getPlayer();
    return p && typeof p.x === 'number' ? p : null;
  }

  /**
   * 每帧调用（**必须跑在 IsoCamera.update 之后**）。
   * 静止态直接 return，一个字节都不碰相机。
   */
  update(dt) {
    const goal = this.on ? 1 : 0;

    if (this.t === goal && goal === 0) return;   // 静止态：完全透明

    /* 跟踪移动目标：每帧重解头心（见 _refresh 顶注）。
       退出过渡期间也继续跟踪 —— 镜头一边拉开一边跟着人，
       比"拉开时人已经不在画面里"自然得多。 */
    this._refresh();

    const step = (dt || 0) / PORTRAIT.dur;
    this.t = goal > this.t ? Math.min(goal, this.t + step) : Math.max(goal, this.t - step);

    const c = this.cam;

    /* 回到 0：还原快照并交还控制权。
       ★ 必须逐一还原 avoid/near —— 它们是"为了让特写能拍"而临时改的，
         漏还原的后果是**跟随视角从此不带遮挡回避**（相机开始穿墙），
         而画面在开阔处一切正常，只在贴墙时才暴露。 */
    if (this.t <= 0 && !this.on) {
      const s = this.saved;
      this.t = 0;
      if (s) {
        c.yaw = s.yaw; c.pitch = s.pitch; c.dist = s.dist; c.minH = s.minH;
        c.lookY = s.lookY; c.avoid = s.avoid;
        this.camera.fov = s.fov; this.camera.near = s.near;
        this.camera.updateProjectionMatrix();
        this.saved = null;
      }
      /* 玩家模型还原后再 apply 一次，让机位立刻落在还原后的参数上，
         而不是等下一帧的 cam.update（否则会闪一帧半特写的构图）。 */
      this._showPlayer(false);
      const pp = this._playerVec();
      if (pp) { _pt.set(pp.x, pp.y || 0, pp.z); c.cur.copy(_pt); c.apply(_pt); }
      return;
    }

    const e = ease(this.t);

    /* 特写态的两个必需改动（见顶注坑①②）。放在过渡的插值之外：
       它们不是"构图参数"，而是"能不能拍到"的开关，不该被缓动稀释
       （near 若随 e 插值，过渡前半段的头仍会被裁掉）。 */
    c.avoid = e > 0.5 ? false : (this.saved ? this.saved.avoid : true);
    this.camera.near = e > 0.5 ? PORTRAIT.near : (this.saved ? this.saved.near : this.camera.near);

    const s = this.saved || { yaw: c.yaw, pitch: c.pitch, dist: c.dist, lookY: c.lookY, fov: this.camera.fov };
    c.yaw = lerpAngle(s.yaw, this.aimYaw, e);
    c.pitch = lerp(s.pitch, PORTRAIT.pitch, e);
    c.dist = lerp(s.dist, this.dist, e);
    c.lookY = lerp(s.lookY, 0, e);
    this.camera.fov = lerp(s.fov, this.fov, e);
    this.camera.updateProjectionMatrix();

    /* 注视点从玩家身上**平移**到头心。
       为什么必须平移而不是直接跳到头心：t=0 时注视点必须仍在玩家身上，
       否则"进入特写的那一瞬间"整个画面会先弹一下 —— 而这一帧的
       yaw/pitch/dist 都还是跟随视角的值，落点会偏到玩家身后的空中。
       ★ 复用两个模块级向量，不在每帧 new：这是每帧都跑的路径，
         60fps 下每秒 120 次分配会稳定给 GC 添活。 */
    const pp = this._playerVec();
    const from = pp ? _pt.set(pp.x, pp.y || 0, pp.z) : c.cur;
    const aim = _aim.lerpVectors(from, this.info.head, e);
    c.cur.copy(aim);
    c.apply(aim);

    /* 玩家模型在过渡过半后隐藏（见顶注坑③）。用 0.5 而不是 0,
       是为了让"人淡出"和"镜头推近"同步发生，看起来是有意的运镜。 */
    this._showPlayer(e > 0.5);
  }

  _showPlayer(hide) {
    if (!this.setHidden || this._hidden === hide) return;
    this._hidden = hide;
    this.setHidden(hide);
  }
}

export function createFaceCam(deps) { return new FaceCam(deps); }

export { PORTRAIT };
