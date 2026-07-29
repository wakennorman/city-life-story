/**
 * NPC 关系链核心引擎 — 「人情江湖」
 *
 * 设计目标：NPC 之间也有自己的关系网，玩家行为会触发蝴蝶效应。
 * 参考：《Stardew Valley》岛民关系 / 《大多数》人情网络
 *
 * ┌─────────────────────────┐
 * │ NPC关系矩阵（13×13双向）│
 * │ aunt_wang ↔ old_zhou    │ ← 旧识（城中村老邻居）
 * │ boss_li ↔ sister_zhang  │ ← 竞争关系（抢活源）
 * │ 赵姐 ↔ boss_li          │ ← 业务关系
 * │ 陈哥 ↔ 老同学阿杰       │ ← 老同学
 * └───────────┬─────────────┘
 *             ↓ 每日传播
 * ┌─────────────────────────┐
 * │ 蝴蝶效应：玩家帮A→得罪B │
 * │ 关系链传导：A热→B升温   │
 * └─────────────────────────┘
 */

// ====== 关系类型定义 ======
// [全系统自洽修复] 域D: 移除死字段 baseAffinityMod(全库零消费者)→简化为 label+color
const RELATION_TYPES = {
  old_acquaintance: { label: "旧识", color: "#8B8050" },
  competitor: { label: "竞争", color: "#C0392B" },
  business: { label: "业务", color: "#2ECC71" },
  classmate: { label: "老同学", color: "#3498DB" },
  friendly: { label: "友善", color: "#F39C12" },
  neutral: { label: "中立", color: "#95A5A6" },
  strained: { label: "紧张", color: "#E74C3C" },
};

// ====== NPC关系矩阵 ======
const NPC_RELATION_MATRIX = {
  aunt_wang: {
    old_zhou: "old_acquaintance",
    boss_li: "neutral",
    sister_zhang: "strained",
    xiao_mei: "friendly",
    chef_chen: "friendly",
    auntie_lin: "friendly",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "friendly",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  old_zhou: {
    aunt_wang: "old_acquaintance",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "friendly",
    chef_chen: "neutral",
    auntie_lin: "friendly",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "friendly",
    ajie: "neutral",
      old_ma: "neutral",
  },
  boss_li: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    sister_zhang: "competitor",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "business",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  sister_zhang: {
    aunt_wang: "strained",
    old_zhou: "neutral",
    boss_li: "competitor",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "business",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  xiao_mei: {
    aunt_wang: "friendly",
    old_zhou: "friendly",
    boss_li: "neutral",
    sister_zhang: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  chef_chen: {
    aunt_wang: "friendly",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    auntie_lin: "friendly",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  auntie_lin: {
    aunt_wang: "friendly",
    old_zhou: "friendly",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "friendly",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  master_zhao: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  xiaoli: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  dr_wang: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  zhaojie: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "business",
    sister_zhang: "business",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  chen_ge: {
    aunt_wang: "neutral",
    old_zhou: "friendly",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    ajie: "neutral",
      old_ma: "neutral",
  },
  ajie: {
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "classmate",
      old_ma: "neutral",
  },
  xiaochen: {
    aunt_wang: "friendly",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "friendly",
    sister_wu: "neutral",
    brother_huang: "friendly",
      old_ma: "neutral",
  },
  // [全系统自洽修复] 域D 联动增强: 3个之前缺失的NPC加入关系矩阵
  uncle_chen_bank: {
    dr_wang: "friendly",
    xiaochen: "friendly",
    boss_li: "neutral",
    aunt_wang: "neutral",
    old_zhou: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
    sister_wu: "neutral",
    brother_huang: "neutral",
      old_ma: "neutral",
  },
  sister_wu: {
    xiaoli: "business",
    sister_zhang: "friendly",
    chef_chen: "neutral",
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    xiao_mei: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "neutral",
    brother_huang: "neutral",
      old_ma: "neutral",
  },
  brother_huang: {
    xiaochen: "friendly",
    aunt_wang: "friendly",
    chen_ge: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "neutral",
    sister_wu: "neutral",
      old_ma: "neutral",
  },
  // [全系统自洽修复] 域D R245 A类: old_ma 已定义但未加入关系矩阵→关系系统永不初始化该NPC
  old_ma: {
    chen_ge: "neutral",
    aunt_wang: "neutral",
    old_zhou: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "neutral",
    sister_wu: "neutral",
    brother_huang: "neutral",
  },
  // [全系统自洽修复] 域D R455 A类: lao_chen(R440新增)已定义但未加入关系矩阵→initNpcRelationships不建条目,关系链/传播/图谱全忽略
  lao_chen: {
    aunt_wang: "friendly",
    old_zhou: "old_acquaintance",
    xiaochen: "friendly",
    chen_ge: "neutral",
    boss_li: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "neutral",
    chef_chen: "neutral",
    auntie_lin: "friendly",
    master_zhao: "neutral",
    xiaoli: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "neutral",
    sister_wu: "neutral",
    brother_huang: "neutral",
    old_ma: "neutral",
    xiao_wei: "neutral",
  },
  // [全系统自洽修复] 域D R455 A类: xiao_wei(R442新增)已定义但未加入关系矩阵→同上
  xiao_wei: {
    chef_chen: "friendly",
    aunt_wang: "friendly",
    boss_li: "business",
    old_zhou: "neutral",
    sister_zhang: "neutral",
    xiao_mei: "friendly",
    auntie_lin: "neutral",
    master_zhao: "neutral",
    xiaoli: "neutral",
    xiaochen: "neutral",
    dr_wang: "neutral",
    zhaojie: "neutral",
    chen_ge: "neutral",
    ajie: "neutral",
    uncle_chen_bank: "neutral",
    sister_wu: "neutral",
    brother_huang: "neutral",
    old_ma: "neutral",
    lao_chen: "neutral",
  },
};

// ====== 关系传播矩阵 ======
const RELATION_PROPAGATION = {
  aunt_wang: {
    old_zhou: 0.3,
    xiao_mei: 0.15,
    chef_chen: 0.1,
    auntie_lin: 0.1,
    xiaochen: 0.1,
  },
  old_zhou: {
    aunt_wang: 0.3,
    xiao_mei: 0.15,
    auntie_lin: 0.1,
    chen_ge: 0.15,
    xiaochen: 0.05,
  },
  boss_li: { sister_zhang: -0.25, zhaojie: 0.15 },
  sister_zhang: { boss_li: -0.25, zhaojie: 0.1 },
  zhaojie: { boss_li: 0.15, sister_zhang: 0.1 },
  xiaochen: { aunt_wang: 0.1, uncle_chen_bank: 0.15, brother_huang: 0.15 },
  dr_wang: { aunt_wang: 0.08, auntie_lin: 0.08, uncle_chen_bank: 0.12 },
  // [全系统自洽修复] 域D 联动增强: 新增NPC传播条目
  uncle_chen_bank: { dr_wang: 0.12, xiaochen: 0.15 },
  sister_wu: { xiaoli: 0.15, sister_zhang: 0.1 },
  brother_huang: { xiaochen: 0.15, aunt_wang: 0.1 },
  // [全系统自洽修复] 域D R245 A类: old_ma 加入关系传播矩阵
  old_ma: { chen_ge: 0.12, boss_li: 0.1, aunt_wang: 0.08 },
  // [全系统自洽修复] 域D R455 A类: 新NPC接入传播矩阵(社区/夜市社交圈口碑扩散)
  lao_chen: { aunt_wang: 0.1, old_zhou: 0.12, xiaochen: 0.08 },
  xiao_wei: { chef_chen: 0.12, aunt_wang: 0.08, xiao_mei: 0.1 },
};

/** 初始化NPC关系状态 */
function initNpcRelationships(state) {
  if (!state.relationships) state.relationships = {};
  var npcIds = Object.keys(NPC_RELATION_MATRIX);
  // [全系统自洽修复] 域G 联动增强2: 基础属性影响NPC初始好感(体质/魅力溢出)
  var _physBonus = Math.max(0, Math.floor(((state.player && state.player.physique) || 22) / 10 - 2));
  var _charmBonus = Math.max(0, Math.floor(((state.player && state.player.charm) || 20) / 10 - 2));
  for (var i = 0; i < npcIds.length; i++) {
    var npcId = npcIds[i];
    if (!state.relationships[npcId]) {
      var _initAff = Math.min(6, _physBonus + _charmBonus);
      state.relationships[npcId] = { affinity: _initAff, met: false };
    }
  }
}

/** 每日NPC关系tick — 蝴蝶效应传播 + 好感衰减 */
function tickNpcRelationships(state) {
  // [全系统自洽修复] 域D R707: state.player 根守卫(防旧存档/异常状态崩溃)
  if (!state || !state.player) return;
  var day = state.player.day;
  if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
  if (!state.npcRelationshipLog.lastPropagationDay) {
    state.npcRelationshipLog.lastPropagationDay = 0;
  }
  if (state.npcRelationshipLog.lastPropagationDay >= day) return;
  state.npcRelationshipLog.lastPropagationDay = day;

  var todayInteractions = state.npcRelationshipLog.dailyInteractions || {};
  var propagated = {};

  // 1. 蝴蝶效应传播
  for (var npcId in todayInteractions) {
    var interaction = todayInteractions[npcId];
    var relationTargets = RELATION_PROPAGATION[npcId];
    if (!relationTargets) continue;

    for (var targetId in relationTargets) {
      if (propagated[targetId]) continue;
      var coeff = relationTargets[targetId];
      // [全系统自洽修复] 域D A类#3: interaction.change 可能 NaN/undefined（旧存档/异常数据），阻断NaN传播
      if (typeof interaction.change !== "number" || !isFinite(interaction.change)) continue;
      var change = interaction.change * coeff;
      applyAffinityChange(state, targetId, change, "关系传导");
      // [全系统自洽修复] 域D 修复:写入_propagationLog(原social_tab.js读取但从不写入→传导日志永远为空)
      if (state.relationships[targetId]) {
        if (!state.relationships[targetId]._propagationLog) state.relationships[targetId]._propagationLog = [];
        state.relationships[targetId]._propagationLog.push({ day: day, change: change, from: npcId });
        if (state.relationships[targetId]._propagationLog.length > 10) state.relationships[targetId]._propagationLog.shift();
      }
      propagated[targetId] = true;
    }
  }
  state.npcRelationshipLog.dailyInteractions = {};

  // [全系统自洽修复] 域D 修复:好感衰减 — 7天无互动开始衰减
  // 原bug：_lastInteractionDay不随衰减更新→每天重复扣（指数级衰减）
  // 修复：用_lastDecayDay追踪上次衰减日，每7天只扣一次
  if (!state.npcRelationshipLog.decayDay)
    state.npcRelationshipLog.decayDay = {};
  for (var _npcId in state.relationships) {
    var _rel = state.relationships[_npcId];
    if (!_rel || !_rel.met || _rel.affinity <= 0) continue;
    var _lastInteraction = _rel._lastInteractionDay || 0;
    var _daysSinceLast = day - _lastInteraction;
    if (_daysSinceLast >= 7) {
      var _decayRate = 0;
      if (_rel.affinity >= 80) _decayRate = 0.2;
      else if (_rel.affinity >= 60) _decayRate = 0.35;
      else if (_rel.affinity >= 30) _decayRate = 0.56;
      else _decayRate = 0.84;
      // 计算自上次衰减后新增的完整7天周期数
      var _lastDecayDay = _rel._lastDecayDay || _lastInteraction;
      var _daysSinceDecay = day - _lastDecayDay;
      var _newPeriods = Math.floor(_daysSinceDecay / 7);
      if (_newPeriods > 0) {
        var _decay = _decayRate * _newPeriods;
        var _oldAff = _rel.affinity;
        _rel.affinity = Math.max(0, _rel.affinity - _decay);
        _rel.affinity = Math.round(_rel.affinity * 10) / 10;
        _rel._lastDecayDay = _lastDecayDay + _newPeriods * 7;
        _rel._lastDecay = _decay;
        // 衰减导致好感等级下降时发消息
        var _oldLabel = getAffinityLabel(_oldAff);
        var _newLabel = getAffinityLabel(_rel.affinity);
        if (_oldLabel !== _newLabel && typeof StateManager !== "undefined") {
          StateManager.addMessage(
            "💔 你与" +
              getNpcDisplayName(_npcId) +
              "的关系变淡了：" +
              _oldLabel +
              " → " +
              _newLabel +
              "。也许该去打个招呼了。",
            "warning",
          );
        }
      }
    }
  }

  // [全系统自洽修复] 域D A类#1:checkNpcRelationEventTriggers 输出无任何消费者→关系事件链永不触发。此处接入每日tick。
  runNpcRelationChainEvents(state, day);
  // [全系统自洽修复] 域D 联动增强3:圈子归属感（D→G，社会比较/归属感→needs.happiness）
  runNpcCircleBelonging(state, day);
  // [全系统自洽修复] 域D A类#2: NPC生日检测→触发小效果（心情+3 + 消息）
  runBirthdayCelebration(state, day);
  // [R233 域D联动增强1] D→B NPC生日叙事深化（生日当天拜访触发带选择的事件）
  if (typeof _checkBirthdayNarrativeR233 === "function") {
    _checkBirthdayNarrativeR233(state);
  }
  // [R233 域D联动增强2] D→G 社交缓冲负面事件（≥3个熟人→负面情绪-25%）
  if (typeof _applySocialBuffR233 === "function") {
    _applySocialBuffR233(state);
  }
  // [全系统自洽修复] 域D R382 联动增强: D→G 高好感NPC提供每日心情恢复(社交圈归属感)
  try {
    var _highAffCount = 0;
    for (var _haId in state.relationships) {
      if (state.relationships[_haId] && state.relationships[_haId].met && (state.relationships[_haId].affinity || 0) >= 60) {
        _highAffCount++;
      }
    }
    if (_highAffCount >= 3 && state.needs) {
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
    }
    if (_highAffCount >= 6 && state.needs) {
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
    }
  } catch (e) {}
  // [R233 域D联动增强3] D→E 熟人投资情报（好感≥60的NPC提供投资建议）
  if (typeof _checkNpcInvestmentTipR233 === "function") {
    _checkNpcInvestmentTipR233(state);
  }
  // [R235 域E联动增强3] E→D 财富社交效应
  if (typeof _applyWealthSocialEffectR235 === "function") {
    _applyWealthSocialEffectR235(state);
  }
  // 域D联动增强(D→G): 社交圈健康恢复 — 每天基于好友数给予被动健康恢复
  try {
    var _hrCount = 0;
    for (var _hrId in state.relationships) {
      var _hr = state.relationships[_hrId];
      if (_hr && _hr.met && (_hr.affinity || 0) >= 40) _hrCount++;
    }
    if (_hrCount >= 3 && state.status) {
      var _hrBonus = Math.min(2, Math.floor(_hrCount / 3));
      if (_hrBonus > 0 && state.status.health < 100) {
        state.status.health = Math.min(100, (state.status.health || 50) + _hrBonus);
      }
    }
    // [全系统自洽修复] 域D R694 联动增强(D→G): 社交疲劳恢复 — 好友(≥40)帮助缓解疲劳
    if (_hrCount >= 2 && state.needs) {
      state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - Math.min(2, _hrCount));
    }
  } catch (e) {}

  // [全系统自洽修复] 域D 联动增强(D→F): NPC关系月报 — 每月初总结社交圈变化
  if (state.player && state.player.day % 30 === 1 && state.relationships) {
    if (!state.flags) state.flags = {};
    if (!state.flags._lastSocialReportDay || state.flags._lastSocialReportDay < state.player.day) {
      state.flags._lastSocialReportDay = state.player.day;
      var _metCount = 0, _friendCount = 0;
      for (var _srId in state.relationships) {
        var _sr = state.relationships[_srId];
        if (_sr && _sr.met) {
          _metCount++;
          if ((_sr.affinity || 0) >= 60) _friendCount++;
        }
      }
      if (_metCount > 0 && typeof StateManager !== "undefined") {
        StateManager.addMessage("📋 社交月报：已结识 " + _metCount + " 人，其中 " + _friendCount + " 位好友。", "info");
      }
    }
  }
  // [全系统自洽修复] 域D 联动增强(D→E): 高收入NPC人脉投资洞察 — 好感≥60的高收入NPC提供市场洞察
  try {
    if (state.relationships && state.player && state.player.day % 30 === 0 && typeof NPCS !== "undefined") {
      var _wealthyContacts = 0;
      for (var _wcId in state.relationships) {
        var _wcRel = state.relationships[_wcId];
        if (_wcRel && _wcRel.met && (_wcRel.affinity || 0) >= 60) {
          var _wcDef = NPCS.find(function(n) { return n && n.id === _wcId; });
          if (_wcDef && (_wcDef.monthlyIncome || 0) >= 15000) {
            _wealthyContacts++;
          }
        }
      }
      if (_wealthyContacts >= 2 && !state.flags._wealthyContactTip) {
        state.flags._wealthyContactTip = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("💼 你认识" + _wealthyContacts + "位高收入的朋友，他们的消费和投资选择或许能给你一些市场启示。", "info");
        }
      }
    }
  } catch (e) {}

  // [R817 域D D→H 联动增强]: 职场人脉推荐 — 高好感NPC在Phase2提供入职推荐
  try {
    if (state.player && state.player.phase === "corporate" && state.flags && state.relationships) {
      var _highAffNpcs = 0;
      for (var _hrId in state.relationships) {
        var _hr = state.relationships[_hrId];
        if (_hr && _hr.met && (_hr.affinity || 0) >= 70) _highAffNpcs++;
      }
      if (_highAffNpcs >= 2 && !state.flags._npcReferralNetwork) {
        state.flags._npcReferralNetwork = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("🤝 你在城市里积累的人脉开始发挥作用了，有" + _highAffNpcs + "位挚友在职场中为你说话。", "success");
        }
      }
    }
  } catch (e) {}

  // [R817 域D D→B 联动增强]: NPC社交叙事 — 好友数量里程碑触发叙事
  try {
    if (state.relationships && state.flags) {
      var _friendCount = 0;
      for (var _fcId in state.relationships) {
        var _fc = state.relationships[_fcId];
        if (_fc && _fc.met && (_fc.affinity || 0) >= 60) _friendCount++;
      }
      if (_friendCount >= 5 && !state.flags._friendCircleNarrative) {
        state.flags._friendCircleNarrative = true;
        if (typeof StateManager !== "undefined") {
          StateManager.addMessage("🎉 你已经有" + _friendCount + "位好友了！在这座城市里，你不再是孤身一人。", "success");
        }
      }
    }
  } catch (e) {}
}

/** [全系统自洽修复] 域D 修复:NPC id→中文名，替代 replace(/_/g," ") 展示的原始 id */
function getNpcDisplayName(npcId) {
  if (typeof NPCS !== "undefined" && NPCS && NPCS.length) {
    for (var i = 0; i < NPCS.length; i++) {
      if (NPCS[i] && NPCS[i].id === npcId) return NPCS[i].name || npcId;
    }
  }
  return npcId ? String(npcId).replace(/_/g, " ") : "某人";
}

/**
 * [全系统自洽修复] 域D 联动增强1&2:关系事件链
 * 消费 checkNpcRelationEventTriggers，产生跨NPC好感传导 + 阵营/圈子叙事。
 * 每对 14 天冷却，避免刷屏；全部字段 || 防御。
 */
function runNpcRelationChainEvents(state, day) {
  if (typeof checkNpcRelationEventTriggers !== "function") return;
  var triggers = checkNpcRelationEventTriggers(state) || [];
  if (!triggers.length || typeof StateManager === "undefined") return;
  if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
  var cd = state.npcRelationshipLog.chainCooldown || {};
  state.npcRelationshipLog.chainCooldown = cd;
  for (var i = 0; i < triggers.length; i++) {
    var t = triggers[i] || {};
    var key = (t.type || "") + ":" + (t.npcA || "") + ":" + (t.npcB || "");
    if ((cd[key] || 0) > day) continue;
    var nA = getNpcDisplayName(t.npcA),
      nB = getNpcDisplayName(t.npcB);
    if (t.type === "triangular_choice") {
      // 阵营张力:同时讨好竞争双方→双方各降[PLACEHOLDER]，逼玩家站队（跨NPC负向传导）
      applyAffinityChange(state, t.npcA, -1, "阵营张力");
      applyAffinityChange(state, t.npcB, -1, "阵营张力");
      StateManager.addMessage(
        "⚖️ " +
          nA +
          "和" +
          nB +
          "是死对头，你俩都熟。有人半开玩笑：\u201c你到底站哪边？\u201d两头讨好，两头都凉了一点（好感各-1）",
        "warning",
      );
      cd[key] = day + 14;
    } else if (t.type === "old_friend_reaction") {
      // 圈子效应:老邻居互相提起你→双方各升[PLACEHOLDER]（跨NPC正向传导）
      applyAffinityChange(state, t.npcA, 1, "圈子效应");
      applyAffinityChange(state, t.npcB, 1, "圈子效应");
      StateManager.addMessage(
        "🤝 " +
          nA +
          "在" +
          nB +
          "面前提起你，都说你是个实在人。老邻居的圈子把你越围越近（好感各+1）",
        "info",
      );
      cd[key] = day + 14;
    } else if (t.type === "business_cooperation") {
      // [全系统自洽修复] 域D A类#4: 业务合作 — A向B推荐你
      applyAffinityChange(state, t.npcA, 1, "业务推荐");
      applyAffinityChange(state, t.npcB, 1, "业务推荐");
      StateManager.addMessage(
        "🤝 " + nA + "向" + nB + "推荐了你：「这小伙子/姑娘靠谱。」好感各+1。",
        "info"
      );
      cd[key] = day + 14;
    } else if (t.type === "classmate_reunion") {
      // [全系统自洽修复] 域D A类#4: 老同学重聚 — 叙旧引出回忆
      applyAffinityChange(state, t.npcA, 2, "同窗叙旧");
      applyAffinityChange(state, t.npcB, 2, "同窗叙旧");
      StateManager.addMessage(
        "🎓 " + nA + "和" + nB + "聊起当年上学的事，笑着摇头：「那时候真简单。」好感各+2。",
        "info"
      );
      cd[key] = day + 14;
    }
  }
}

/**
 * [全系统自洽修复] 域D 联动增强3:圈子归属感
 * 拥有≥3个熟人(affinity≥30)时，每7天一次小幅心情+[PLACEHOLDER]，附归属感叙事。
 */
function runNpcCircleBelonging(state, day) {
  if (!state.relationships || !state.needs) return;
  var circle = 0;
  for (var id in state.relationships) {
    var rel = state.relationships[id];
    if (rel && rel.met && (rel.affinity || 0) >= 30) circle++;
  }
  if (circle < 3) return;
  if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
  var last = state.npcRelationshipLog.lastBelongingDay || 0;
  if (day - last < 7) return;
  state.npcRelationshipLog.lastBelongingDay = day;
  // [全系统自洽修复] 域D 联动增强2: 圈子归属感多状态收益
  state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 2);
  if (state.status) state.status.health = Math.min(100, (state.status.health || 50) + 1);
  state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 1);
  if (typeof StateManager !== "undefined") {
    StateManager.addMessage(
      "🫂 这座城市里，你已经有了 " +
        circle +
        " 个说得上话的人。夜里回到出租屋，不再觉得那么孤单（心情+2，健康+1，疲劳-1）",
      "info",
    );
  }
  // [全系统自洽修复] 域D 联动增强: 信任圈(好感≥60)额外奖励每14天+心情
  var _trusted = 0;
  for (var _tid in state.relationships) {
    var _tr = state.relationships[_tid];
    if (_tr && _tr.met && (_tr.affinity || 0) >= 60) _trusted++;
  }
  if (_trusted >= 2) {
    var _lastTrust = state.npcRelationshipLog.lastTrustedDay || 0;
    if (day - _lastTrust >= 14) {
      state.npcRelationshipLog.lastTrustedDay = day;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + 3);
      if (typeof StateManager !== "undefined") {
        StateManager.addMessage(
          "🤗 你有 " + _trusted + " 位可以托付真心的朋友。在这座城市，你并不孤独（心情+3）",
          "info"
        );
      }
    }
  }
}

/**
 * [全系统自洽修复] 域D A类#2: NPC生日庆祝
 * 每天检测是否有NPC生日（基于 day-of-year），有且已结识则发消息+心情+3。
 * 防刷屏：每个NPC每年只庆祝一次（存 _lastBirthdayCelebratedYear）。
 */
function runBirthdayCelebration(state, day) {
  if (!state.relationships || !state.needs || !state.player) return;
  if (typeof NPCS === "undefined" || !NPCS || !NPCS.length) return;
  var _dayOfYear = ((day - 1) % 365) + 1;
  if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
  var _celebrated = state.npcRelationshipLog._birthdayCelebrated || {};
  state.npcRelationshipLog._birthdayCelebrated = _celebrated;
  var _year = Math.floor((day - 1) / 365) + 1;

  for (var _bi = 0; _bi < NPCS.length; _bi++) {
    var _n = NPCS[_bi];
    if (!_n || !_n.id || !_n.birthday || !_n.name) continue;
    if (_n.birthday !== _dayOfYear) continue;
    var _rel = state.relationships[_n.id];
    if (!_rel || !_rel.met) continue;
    // 今年已庆祝过？跳过
    var _key = _n.id + "_" + _year;
    if (_celebrated[_key]) continue;
    _celebrated[_key] = true;
    // [全系统自洽修复] 域D 联动增强2: 叙事分层 — 好感等级决定奖励丰度
    var _aff = _rel.affinity || 0;
    var _bonusMsg = "";
    var _bonusHappy = 3;
    var _bonusExtra = "";
    if (_aff >= 80) {
      _bonusHappy = 8;
      if (_n.monthlyIncome) { _bonusExtra = "。对方高兴地分享了一些行业经验（心智+2）"; state.player.mental = Math.min(100, (state.player.mental || 0) + 2); }
      else { _bonusExtra = "。挚友的祝福让你们的关系更加深厚（心智+1）"; state.player.mental = Math.min(100, (state.player.mental || 0) + 1); }
    } else if (_aff >= 60) {
      _bonusHappy = 5;
      _bonusExtra = "。对方拉着你聊了好一会儿。";
    } else if (_aff >= 30) {
      _bonusHappy = 3;
      _bonusExtra = "。对方有些意外你还记得。";
    } else {
      _bonusHappy = 2;
      _bonusExtra = "。对方淡淡地笑了笑。";
    }
    state.needs.happiness = Math.min(100, (state.needs.happiness || 0) + _bonusHappy);
    // 好友(≥60)额外送小礼物
    if (_aff >= 60 && state.resources) {
      var _giftVal = 10 + Random.int(0, 40);
      state.resources.cash = (state.resources.cash || 0) + _giftVal;
      _bonusExtra += "还收到了¥" + _giftVal + "的生日回礼。";
    }
    if (typeof StateManager !== "undefined") {
      var _line = _n.birthdayLine || "今天是我生日，没想到你还记得！";
      StateManager.addMessage(
        "🎂 " + _n.name + "（" + (_n.role || "") + "）今天生日！" + _line + _bonusExtra + " 心情+" + _bonusHappy + "。",
        "success"
      );
    }
  }
}

/**
 * [全系统自洽修复] 域D 联动增强1: 生日当天拜访NPC好感双倍
 * 在 applyAffinityChange 中检测：若当天是NPC生日且change>0，则翻倍。
 */
function _getBirthdayBonus(state, npcId, change) {
  if (change <= 0 || !state.player || !state.player.day) return change;
  if (typeof NPCS === "undefined" || !NPCS || !NPCS.length) return change;
  var _dayOfYear = ((state.player.day - 1) % 365) + 1;
  for (var _bi = 0; _bi < NPCS.length; _bi++) {
    var _n = NPCS[_bi];
    if (_n && _n.id === npcId && _n.birthday === _dayOfYear) {
      return change * 2; // 生日当天好感翻倍
    }
  }
  return change;
}
/** 应用NPC好感变化 */
function applyAffinityChange(state, npcId, change, reason) {
  if (!state.relationships) state.relationships = {};
  if (!state.flags) state.flags = {}; // [全系统自洽修复] 域D R691 A类: 防止state.flags未初始化致TypeError
  if (!state.relationships[npcId]) {
    state.relationships[npcId] = { affinity: 0, met: true };
  }
  // [全系统自洽修复] 域D 联动增强1: 生日当天好感翻倍
  var _adjustedChange = _getBirthdayBonus(state, npcId, change);
  var oldAffinity = state.relationships[npcId].affinity;
  var newAffinity = Math.max(-100, Math.min(100, oldAffinity + _adjustedChange));
  state.relationships[npcId].affinity = newAffinity;
  state.relationships[npcId].met = true;

  // [全系统自洽修复] 域D 联动增强(D→B): 首次达到好感里程碑时触发叙事
  if (change > 0 && typeof StateManager !== "undefined") {
    var _npcName = getNpcDisplayName(npcId);
    if (oldAffinity < 60 && newAffinity >= 60 && !state.flags['_affMilestone60_' + npcId]) {
      state.flags['_affMilestone60_' + npcId] = true;
      StateManager.addMessage("💕 你和" + _npcName + "成了好朋友！在这个城市里，多了一个可以交心的人。", "success");
    }
    if (oldAffinity < 80 && newAffinity >= 80 && !state.flags['_affMilestone80_' + npcId]) {
      state.flags['_affMilestone80_' + npcId] = true;
      StateManager.addMessage("❤️ 你和" + _npcName + "成为了挚友！这份情谊是这座城市里最珍贵的财富。", "success");
    }
  }
  // [全系统自洽修复] 域D 联动增强1: 记录最近互动天数（即使change=0也记录，防止衰减系统误判）
  if (state.player && state.player.day) {
    state.relationships[npcId]._lastInteractionDay = state.player.day;
  }

  // [全系统自洽修复] 域D A类#3: 记录每日互动到 npcRelationshipLog，供蝴蝶效应传播系统消费
  if (state.player && state.player.day) {
    if (!state.npcRelationshipLog) state.npcRelationshipLog = {};
    if (!state.npcRelationshipLog.dailyInteractions) {
      state.npcRelationshipLog.dailyInteractions = {};
    }
    var _existing = state.npcRelationshipLog.dailyInteractions[npcId];
    if (_existing) {
      _existing.change += change;
    } else {
      state.npcRelationshipLog.dailyInteractions[npcId] = {
        change: change,
        reason: reason || "互动",
      };
    }
  }

  if (change !== 0 && typeof StateManager !== "undefined") { // [全系统自洽修复] 域D 修复: StateManager守卫（原缺失致管线崩溃）
    var oldLabel = getAffinityLabel(oldAffinity);
    var newLabel = getAffinityLabel(newAffinity);
    if (oldLabel !== newLabel) {
      StateManager.addMessage(
        // [全系统自洽修复] 域D 修复:关系升降级消息显示原始id→改用中文名
        "👥 " +
          getNpcDisplayName(npcId) +
          " 与你的关系： " +
          oldLabel +
          " → " +
          newLabel,
        "info",
      );
    }
  }
}

/** 获取NPC好感度描述 */
function getAffinityLabel(affinity) {
  if (affinity >= 80) return "❤️ 挚友";
  if (affinity >= 60) return "😊 好友";
  if (affinity >= 30) return "🙂 熟人";
  if (affinity >= 0) return "👤 初识";
  if (affinity >= -30) return "😐 冷淡";
  return "😠 厌恶";
}

// [全系统自洽修复] 域D 修复:RELATION_TYPES原死数据,添加辅助函数消费标签/颜色
function getRelationTypeLabel(typeKey) {
  if (RELATION_TYPES[typeKey]) return RELATION_TYPES[typeKey].label;
  return typeKey;
}
function getRelationTypeColor(typeKey) {
  if (RELATION_TYPES[typeKey]) return RELATION_TYPES[typeKey].color;
  return "#95A5A6";
}

/** 检查NPC关系链是否满足事件触发条件 */
function checkNpcRelationEventTriggers(state) {
  var triggers = [];
  var npcIds = Object.keys(NPC_RELATION_MATRIX);

  for (var i = 0; i < npcIds.length; i++) {
    var npcA = npcIds[i];
    var affA =
      (state.relationships[npcA] && state.relationships[npcA].affinity) || 0;
    if (affA < 30) continue;
    // [全系统自洽修复] 域D R455 B类补齐: npcA 同样加 met 守卫(与 npcB 一致,防未结识NPC因初始好感溢出误触发关系链)
    if (!state.relationships[npcA] || !state.relationships[npcA].met) continue;

    var relations = NPC_RELATION_MATRIX[npcA];
    for (var npcB in relations) {
      // [全系统自洽修复] 域D R175 A类: npcB 未检查 met → 可能导致从未结识的NPC意外解锁
      if (!state.relationships[npcB] || !state.relationships[npcB].met) continue;
      var type = relations[npcB];
      var affB =
        (state.relationships[npcB] && state.relationships[npcB].affinity) || 0;

      if (type === "competitor" && affA >= 50 && affB >= 30) {
        triggers.push({
          type: "triangular_choice",
          npcA: npcA,
          npcB: npcB,
          relationType: type,
          thresholdA: 50,
          thresholdB: 30,
        });
      }
      if (type === "old_acquaintance" && affA >= 60 && affB >= 20) {
        triggers.push({
          type: "old_friend_reaction",
          npcA: npcA,
          npcB: npcB,
          relationType: type,
          thresholdA: 60,
          thresholdB: 20,
        });
      }
      // [全系统自洽修复] 域D A类#4: business/classmate 事件类型接入
      if (type === "business" && affA >= 40 && affB >= 30) {
        triggers.push({
          type: "business_cooperation",
          npcA: npcA, npcB: npcB,
          relationType: type,
          thresholdA: 40, thresholdB: 30,
        });
      }
      if (type === "classmate" && affA >= 30 && affB >= 30) {
        triggers.push({
          type: "classmate_reunion",
          npcA: npcA, npcB: npcB,
          relationType: type,
          thresholdA: 30, thresholdB: 30,
        });
      }
    }
  }
  return triggers;
}

// [全系统自洽修复] 域D R389 联动增强(D→C): NPC职业推荐—高好感NPC根据玩家技能推荐职业路径
function getNpcCareerRecommendation(state) {
  if (!state || !state.relationships || !state.player) return null;
  var bestNpc = null, bestAff = 0;
  for (var _rid in state.relationships) {
    var _r = state.relationships[_rid];
    if (_r && _r.met && (_r.affinity || 0) > bestAff) {
      bestAff = _r.affinity;
      bestNpc = _rid;
    }
  }
  if (bestAff < 40 || !bestNpc) return null;
  // 基于玩家最高技能推荐路径
  var topSkill = "", topLevel = 0;
  if (state.skills) {
    for (var _sk in state.skills) {
      var _sl = state.skills[_sk] && state.skills[_sk].level || 0;
      if (_sl > topLevel) { topLevel = _sl; topSkill = _sk; }
    }
  }
  var _pathMap = { coding: "tech", english: "education", accounting: "finance", cooking: "catering", repair: "civil", management: "operations", sales: "sales", medicine: "medical", driving: "logistics", electrician: "civil", welding: "civil" };
  var recPath = _pathMap[topSkill] || null;
  if (!recPath) return null;
  var _npcName = getNpcDisplayName(bestNpc);
  return { npc: bestNpc, npcName: _npcName, affinity: bestAff, recommendedPath: recPath, topSkill: topSkill, topLevel: topLevel };
}

// [全系统自洽修复] 域D R389 联动增强(D→F): 社交关系网络数据—提供可视化数据供UI渲染
function getSocialNetworkGraphData(state) {
  if (!state || !state.relationships) return { nodes: [], edges: [] };
  var nodes = [], edges = [];
  var npcIds = Object.keys(NPC_RELATION_MATRIX);
  // 玩家节点
  nodes.push({ id: "player", label: "你", type: "player", size: 20 });
  // NPC节点
  for (var _ni = 0; _ni < npcIds.length; _ni++) {
    var _nid = npcIds[_ni];
    var _rel = state.relationships[_nid];
    if (!_rel || !_rel.met) continue;
    var _aff = _rel.affinity || 0;
    nodes.push({
      id: _nid,
      label: getNpcDisplayName(_nid),
      type: "npc",
      affinity: _aff,
      size: Math.max(8, Math.min(18, 8 + Math.floor(Math.abs(_aff) / 10))),
      color: _aff >= 60 ? "#4a9e5c" : (_aff >= 30 ? "#f1c40f" : (_aff >= 0 ? "#95a5a6" : "#e74c3c")),
    });
    // 玩家→NPC边
    edges.push({ source: "player", target: _nid, weight: Math.abs(_aff) / 100, label: getAffinityLabel(_aff) });
  }
  // NPC间关系边
  for (var _ni2 = 0; _ni2 < npcIds.length; _ni2++) {
    var _nA = npcIds[_ni2];
    var _rels = NPC_RELATION_MATRIX[_nA];
    if (!_rels) continue;
    for (var _nB in _rels) {
      if (_nA < _nB) continue; // 只加一次(无向图)
      var _relType = _rels[_nB];
      edges.push({ source: _nA, target: _nB, weight: 0.5, label: getRelationTypeLabel(_relType), color: getRelationTypeColor(_relType) });
    }
  }
  return { nodes: nodes, edges: edges };
}

// ====== 百科自更新 ======
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.npc_relationships = {
    id: "npc_relationships",
    name: "NPC关系链",
    icon: "🕸️",
    brief: "NPC之间也有自己的关系网，玩家行为会触发蝴蝶效应",
    version: "1.0.0",
    related: ["mechanics:npc_affinity"],
    sections: [
      {
        kind: "desc",
        text: "NPC不是孤立的个体，他们之间有旧识、竞争、业务、同窗等各种关系。玩家帮助A的同时，可能会间接影响A的关系人B。",
      },
      { kind: "subhead", text: "🔄 关系传播机制" },
      {
        kind: "list",
        items: [
          "每日tick时，玩家与NPC的互动会向该NPC的关系网扩散（传导系数0.1~0.3）",
          "竞争关系传导为负值：帮A→B好感下降",
          "旧识/业务关系传导为正值：帮A→B好感上升",
        ],
      },
    ],
  };
}
// [R717 域D 联动增强 D→G]: 社交支持健康恢复 — 高好感NPC数量决定每日健康恢复加成
function getSocialHealthBonus(state) {
  if (!state || !state.relationships) return 0;
  var closeFriends = 0;
  for (var _rk in state.relationships) {
    var _r = state.relationships[_rk];
    if (_r && _r.met && (_r.affinity || 0) >= 60) closeFriends++;
  }
  return Math.min(5, Math.floor(closeFriends / 3));
}

// [R717 域D 联动增强 D→E]: 社交圈投资情报 — 高好感NPC提供投资建议,降低投资风险
function getSocialInvestmentIntel(state) {
  if (!state || !state.relationships) return 0;
  var intelLevel = 0;
  var intelNpcs = ["boss_li", "zhaojie", "old_zhou", "xiao_mei"];
  for (var _ini = 0; _ini < intelNpcs.length; _ini++) {
    var _rel = state.relationships[intelNpcs[_ini]];
    if (_rel && _rel.met && (_rel.affinity || 0) >= 50) intelLevel++;
  }
  return Math.min(8, intelLevel * 2);
}

// [R717 域D 联动增强 D→C]: 人脉推荐职业 — 通过NPC好感解锁隐藏职业机会
function getNpcReferralJobs(state) {
  if (!state || !state.relationships) return [];
  var referrals = [];
  if (state.relationships.old_zhou && (state.relationships.old_zhou.affinity || 0) >= 70) {
    referrals.push({ jobId: "waste_recycling", bonus: 0.15, source: "old_zhou" });
  }
  if (state.relationships.boss_li && (state.relationships.boss_li.affinity || 0) >= 60) {
    referrals.push({ jobId: "construction_foreman", bonus: 0.1, source: "boss_li" });
  }
  if (state.relationships.xiao_mei && (state.relationships.xiao_mei.affinity || 0) >= 65) {
    referrals.push({ jobId: "elite_tutor", bonus: 0.12, source: "xiao_mei" });
  }
  if (state.relationships.zhaojie && (state.relationships.zhaojie.affinity || 0) >= 60) {
    referrals.push({ jobId: "sales_manager", bonus: 0.1, source: "zhaojie" });
  }
  return referrals;
}


// [R725 第三轮 域D 联动增强 D→F]: NPC关系图谱数据
function getNpcRelationGraphData(state) {
  if (!state || !state.relationships) return [];
  var data = [];
  for (var id in state.relationships) {
    var r = state.relationships[id];
    if (r && r.met) {
      data.push({ id: id, affinity: r.affinity || 0, met: true, daily: r.daily || 0 });
    }
  }
  data.sort(function(a, b) { return b.affinity - a.affinity; });
  return data;
}

// [R725 第三轮 域D 联动增强 D→E]: NPC投资偏好
function getNpcInvestmentStyle(npcId) {
  if (!npcId) return 'balanced';
  var styles = { old_zhou: 'conservative', boss_li: 'aggressive', zhaojie: 'balanced', xiao_mei: 'growth', aunt_wang: 'conservative', sister_zhang: 'value', chef_chen: 'income' };
  return styles[npcId] || 'balanced';
}
