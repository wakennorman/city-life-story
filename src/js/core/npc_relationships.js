/**
 * NPC 关系网系统（v3.6 P0-1）
 *
 * 定义 NPC 之间的相互关系（亲戚/前同事/恩怨等），以及关系对好感度的传导效应。
 * 蝴蝶效应：对 A NPC 的行为会影响 B NPC 的好感（通过关系链传导）。
 *
 * 设计参考：《Stardew Valley》NPC 关系网 / 《大多数》人际网络
 */

(function () {
  // ====== NPC 关系网定义 ======
  const NPC_RELATIONSHIPS = [
    // 王大婶 ↔ 老周：城中村邻居
    { from: "aunt_wang", to: "old_zhou", type: "neighbor", typeName: "邻居", baseWeight: 0.15 },
    { from: "old_zhou", to: "aunt_wang", type: "neighbor", typeName: "邻居", baseWeight: 0.15 },
    // 李工头 ↔ 张姐：前同事
    { from: "boss_li", to: "sister_zhang", type: "former_colleague", typeName: "前同事", baseWeight: 0.20 },
    { from: "sister_zhang", to: "boss_li", type: "former_colleague", typeName: "前同事", baseWeight: 0.20 },
    // 王大婶 ↔ 张姐：远亲
    { from: "aunt_wang", to: "sister_zhang", type: "family", typeName: "远亲", baseWeight: 0.25 },
    { from: "sister_zhang", to: "aunt_wang", type: "family", typeName: "远亲", baseWeight: 0.25 },
    // 老周 ↔ 陈师傅：熟识
    { from: "old_zhou", to: "chef_chen", type: "neighbor", typeName: "熟识", baseWeight: 0.10 },
    { from: "chef_chen", to: "old_zhou", type: "neighbor", typeName: "熟识", baseWeight: 0.10 },
    // 小美 ↔ 张姐：前后辈
    { from: "xiaoli", to: "sister_zhang", type: "mentor", typeName: "前辈", baseWeight: 0.18 },
    { from: "sister_zhang", to: "xiaoli", type: "mentor", typeName: "后辈", baseWeight: 0.12 },
    // 李工头 ↔ 老周：同行
    { from: "boss_li", to: "old_zhou", type: "rival", typeName: "同行", baseWeight: 0.08 },
    { from: "old_zhou", to: "boss_li", type: "rival", typeName: "同行", baseWeight: 0.08 },
  ];

  const PLAYER_NPC_RELATIONS = {
    aunt_wang: { type: "landlord", typeName: "房东", baseAffinity: 0 },
    boss_li: { type: "employer", typeName: "雇佣", baseAffinity: 0 },
    sister_zhang: { type: "agent", typeName: "中介", baseAffinity: 0 },
    old_zhou: { type: "neighbor", typeName: "邻居", baseAffinity: 0 },
    xiao_mei: { type: "friend", typeName: "朋友", baseAffinity: 0 },
    chef_chen: { type: "mentor", typeName: "师傅", baseAffinity: 0 },
    auntie_lin: { type: "vendor", typeName: "摊主", baseAffinity: 0 },
    master_zhao: { type: "service", typeName: "服务", baseAffinity: 0 },
    xiaoli: { type: "acquaintance", typeName: "认识", baseAffinity: 0 },
    dr_wang: { type: "service", typeName: "医生", baseAffinity: 0 },
  };

  const AFFINITY_PROPAGATION = {
    positive: { multiplier: 0.3, maxChange: 5 },
    negative: { multiplier: 0.5, maxChange: 8 },
    gift: { family: 0.4, former_colleague: 0.25, neighbor: 0.15, mentor: 0.2, rival: -0.1 },
  };

  const AFFINITY_DECAY = {
    dailyRate: 0.02,
    minAffinity: -100,
    maxAffinity: 100,
    decayModifier: { family: 0.5, mentor: 0.6, former_colleague: 0.8, neighbor: 1.0, rival: 1.2 },
  };

  function npcRelationshipsTick(state) {
    if (!state.relationships) return;
    for (const npcId of Object.keys(state.relationships)) {
      const rel = state.relationships[npcId];
      if (!rel || typeof rel.affinity !== "number") continue;
      const npcRelDef = PLAYER_NPC_RELATIONS[npcId];
      const decayMod = npcRelDef ? AFFINITY_DECAY.decayModifier[npcRelDef.type] || 1.0 : 1.0;
      const decayAmount = Math.max(0.01, rel.affinity * AFFINITY_DECAY.dailyRate * decayMod);
      if (rel.affinity > 0) {
        rel.affinity = Math.max(AFFINITY_DECAY.minAffinity, rel.affinity - decayAmount);
      } else if (rel.affinity < 0) {
        rel.affinity = Math.min(AFFINITY_DECAY.maxAffinity, rel.affinity + decayAmount * 0.5);
      }
      if (Math.abs(decayAmount) > 0.5) {
        rel._lastDecay = decayAmount;
        rel._decayDate = state.day;
      }
    }
    if (state._pendingRelationshipEffects) {
      for (const effect of state._pendingRelationshipEffects) {
        applyRelationshipEffect(effect, state);
      }
      state._pendingRelationshipEffects = [];
    }
  }

  function applyRelationshipEffect(effect, state) {
    const { fromNpcId, toNpcId, changeType, baseChange, reason } = effect;
    const relation = NPC_RELATIONSHIPS.find(r => r.from === fromNpcId && r.to === toNpcId);
    if (!relation) return;
    const config = changeType === "positive" ? AFFINITY_PROPAGATION.positive : AFFINITY_PROPAGATION.negative;
    let changeAmount = baseChange * relation.baseWeight * config.multiplier;
    changeAmount = Math.max(-config.maxChange, Math.min(config.maxChange, changeAmount));
    if (!state.relationships[toNpcId]) state.relationships[toNpcId] = { affinity: 0, met: true };
    const oldAffinity = state.relationships[toNpcId].affinity;
    state.relationships[toNpcId].affinity = Math.max(AFFINITY_DECAY.minAffinity, Math.min(AFFINITY_DECAY.maxAffinity, oldAffinity + changeAmount));
    if (!state.relationships[toNpcId]._propagationLog) state.relationships[toNpcId]._propagationLog = [];
    state.relationships[toNpcId]._propagationLog.push({ date: state.day, from: fromNpcId, change: changeAmount, reason, type: relation.typeName });
    if (state.relationships[toNpcId]._propagationLog.length > 10) state.relationships[toNpcId]._propagationLog.shift();
  }

  function triggerRelationshipPropagation(fromNpcId, affinityChange, reason, state) {
    if (!state._pendingRelationshipEffects) state._pendingRelationshipEffects = [];
    const changeType = affinityChange >= 0 ? "positive" : "negative";
    for (const relation of NPC_RELATIONSHIPS) {
      if (relation.from === fromNpcId) {
        state._pendingRelationshipEffects.push({ fromNpcId, toNpcId: relation.to, changeType, baseChange: Math.abs(affinityChange), reason: reason || `通过${relation.typeName}关系传导` });
      }
    }
  }

  function getRelationshipEffect(npcId, state) {
    const rel = state.relationships?.[npcId];
    if (!rel) return { affinity: 0, effects: [] };
    const effects = [];
    const affinity = rel.affinity || 0;
    if (affinity >= 80) effects.push({ type: "favor", label: "挚友加成", desc: "该 NPC 会主动提供帮助" });
    else if (affinity >= 60) effects.push({ type: "trust", label: "信任加成", desc: "该 NPC 更乐意分享信息" });
    else if (affinity >= 30) effects.push({ type: "acquaintance", label: "熟人加成", desc: "该 NPC 偶尔会介绍机会" });
    else if (affinity < 0) effects.push({ type: "hostile", label: "关系冷淡", desc: "该 NPC 对你的态度消极" });
    if (rel._propagationLog && rel._propagationLog.length > 0) {
      const last = rel._propagationLog[rel._propagationLog.length - 1];
      effects.push({ type: "propagation", label: "关系传导", desc: `来自${last.from}的影响（${last.change > 0 ? "+" : ""}${last.change.toFixed(1)}）` });
    }
    return { affinity, effects };
  }

  function getRelationshipBetween(npcId1, npcId2) {
    return NPC_RELATIONSHIPS.find(r => r.from === npcId1 && r.to === npcId2) || null;
  }

  function getRelationshipsForNpc(npcId) {
    return NPC_RELATIONSHIPS.filter(r => r.from === npcId || r.to === npcId);
  }

  function initNpcRelationships(state) {
    if (!state.relationships) state.relationships = {};
    for (const npcId of Object.keys(PLAYER_NPC_RELATIONS)) {
      if (!state.relationships[npcId]) {
        state.relationships[npcId] = { affinity: PLAYER_NPC_RELATIONS[npcId].baseAffinity, met: false };
      }
    }
    state._npcRelationships = {};
    state._pendingRelationshipEffects = [];
  }

  if (typeof window !== "undefined") {
    window.NPC_RELATIONSHIPS = NPC_RELATIONSHIPS;
    window.npcRelationships = { init: initNpcRelationships, tick: npcRelationshipsTick, triggerPropagation, getEffect: getRelationshipEffect, getBetween: getRelationshipBetween, getForNpc: getRelationshipsForNpc };
  }
})();
