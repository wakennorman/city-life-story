/**
 * NPC 位置关联系统 — 日常活动轨迹
 *
 * 给每个核心 NPC 定义每日作息日程，玩家在特定时间/地点可遇到他们。
 * 参考 Cart Life（NPC 日程驱动偶遇）+ Stardew Valley（可被找到的角色）
 *
 * 架构：独立 IIFE，暴露 3 个全局函数，集成到 daily_pipeline + npc_event_bridge
 */

(function () {
  "use strict";

  /**
   * 初始化 NPC 位置数据 — 读取 npcs.js 中的 schedule 字段，建立索引
   * @param {object} state - 游戏状态
   */
  function initNpcLocationData(state) {
    if (!state._npcLocationData && typeof NPCS !== "undefined") {
      state._npcLocationData = {};
      for (var i = 0; i < NPCS.length; i++) {
        var npc = NPCS[i];
        if (npc.schedule && npc.id) {
          state._npcLocationData[npc.id] = {
            schedule: npc.schedule,
            homeBase: npc.location || null,
          };
        }
      }
    }
  }

  /**
   * 把游戏 3 时段映射为日程 4 时段（night→evening 兜底）
   */
  function _mapTimeSlot(slot) {
    if (slot === "morning") return "morning";
    if (slot === "afternoon") return "afternoon";
    return "evening"; // evening + night 统一用 evening
  }

  /**
   * 获取 NPC 当前所在位置
   * @param {string} npcId
   * @param {string} timeOfDay - "morning"/"afternoon"/"evening"/"night"
   * @returns {string|null} 地点 key，或 null（未发现该 NPC / 无日程）
   */
  function getNpcCurrentLocation(npcId, timeOfDay) {
    var st = typeof StateManager !== "undefined" ? StateManager.getState() : null;
    if (!st || !st._npcLocationData) return null;
    var rel = st.relationships && st.relationships[npcId];
    if (!rel || !rel.met) return null; // 未发现的 NPC 不暴露位置
    var data = st._npcLocationData[npcId];
    if (!data || !data.schedule) return null;
    var mapped = _mapTimeSlot(timeOfDay);
    return data.schedule[mapped] || data.schedule.evening || data.homeBase;
  }

  /**
   * 每日管线步骤 — 更新 NPC 位置轮换数据
   */
  function tickNpcLocationRotation(state) {
    initNpcLocationData(state);
    // 可以在这里追加少量日志，但保持轻量
  }

  /**
   * 获取当前时段 N 个有日程的 NPC 位置列表
   * @param {object} state
   * @returns {Array<{npcId:string, location:string}>}
   */
  function getActiveNpcLocations(state) {
    initNpcLocationData(state);
    var timeSlot = state.player.timeSlot || "morning";
    var mapped = _mapTimeSlot(timeSlot);
    var results = [];
    var data = state._npcLocationData;
    if (!data) return results;
    for (var npcId in data) {
      if (!data.hasOwnProperty(npcId)) continue;
      var rel = state.relationships && state.relationships[npcId];
      if (!rel || !rel.met) continue;
      var loc = data[npcId].schedule[mapped] || data[npcId].schedule.evening;
      if (loc) results.push({ npcId: npcId, location: loc });
    }
    return results;
  }

  // 暴露全局
  window.initNpcLocationData = initNpcLocationData;
  window.getNpcCurrentLocation = getNpcCurrentLocation;
  window.tickNpcLocationRotation = tickNpcLocationRotation;
  window.getActiveNpcLocations = getActiveNpcLocations;
})();
