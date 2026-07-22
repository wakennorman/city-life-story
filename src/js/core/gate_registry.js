/**
 * 门控约定式自动归类系统 — Gate Registry v1.0
 *
 * 为 6 层叙事门控体系（Layer 1-6）提供约定式自动归类与审计。
 * 参考：action_sort.js（约定式自动归类模式）
 *
 * ====== 约定式用法 ======
 *
 * 在事件定义中添加 gateLayers 字段（约定式优先）：
 *
 *   RANDOM_EVENTS.push({
 *     id: "sector_heat_temp_job",
 *     gateLayers: [
 *       { layer: 3, type: "condition", desc: "叙事说'一直在干的活'→必须有工作" }
 *     ],
 *     ...
 *   });
 *
 * 也可在现有 // [LayerN] 注释旁添加同名 gateLayers（渐进式迁移）。
 *
 * ====== 门控类型 ======
 *
 *   condition — conditions 守卫（防叙事穿帮）
 *   apply     — apply 防御（防 NaN/空指针）
 *   narrative — 叙事文本对齐（时间/场景描述）
 *   amount    — 金额缩放（scaleAmount 动态化）
 *   choice    — 选择支均衡（收益/风险/代价匹配）
 *
 * ====== 层定义 ======
 *
 *   Layer 1: 技术层（变量名/NaN/空指针/类型安全）
 *   Layer 2: NPC叙事自洽层（met门控）
 *   Layer 3: 玩家状态自洽层（叙事与实际状态一致）
 *   Layer 4: 时间线逻辑层（时间描述与实际天数对齐）
 *   Layer 5: 经济数值缩放层（金额随玩家阶段浮动）
 *   Layer 6: 选择支博弈均衡层（选项间收益/风险/代价匹配）
 */
(function () {
  "use strict";

  // ====== 1. 层定义 ======
  var GATE_LAYERS = [
    { id: 1, name: "技术层", icon: "🔧", desc: "变量名/NaN/空指针/类型安全" },
    { id: 2, name: "NPC叙事自洽层", icon: "👤", desc: "NPC met门控" },
    { id: 3, name: "玩家状态自洽层", icon: "🎯", desc: "叙事行为与实际状态一致" },
    { id: 4, name: "时间线逻辑层", icon: "⏰", desc: "时间描述与实际天数对齐" },
    { id: 5, name: "经济数值缩放层", icon: "💰", desc: "金额随玩家阶段浮动" },
    { id: 6, name: "选择支博弈均衡层", icon: "⚖️", desc: "选项间收益/风险/代价匹配" },
  ];

  // ====== 2. 门控类型定义 ======
  var GATE_TYPES = {
    condition: { label: "conditions守卫", icon: "🚧", priority: 10 },
    apply: { label: "apply防御", icon: "🛡️", priority: 20 },
    narrative: { label: "叙事文本对齐", icon: "📝", priority: 30 },
    amount: { label: "金额缩放", icon: "💵", priority: 40 },
    choice: { label: "选择支均衡", icon: "⚖️", priority: 50 },
  };
  var GATE_TYPE_KEYS = Object.keys(GATE_TYPES);

  // ====== 3. 门控注册表 ======
  // 结构：{ layerId: { type: [gateDef, ...] } }
  var _registry = {};
  // 快速查找：eventId → gateDef[]
  var _byEventId = {};
  // 文件级统计
  var _fileStats = {};

  // ====== 4. 注册函数 ======

  /**
   * 注册一个门控
   * @param {Object} gateDef - 门控定义
   * @param {number} gateDef.layer - 层号 (1-6)
   * @param {string} gateDef.type - 门控类型 (condition/apply/narrative/amount/choice)
   * @param {string} gateDef.eventId - 关联事件ID
   * @param {string} gateDef.file - 源文件（自动填充）
   * @param {string} gateDef.desc - 描述
   * @param {string} [gateDef.severity] - 严重度 (high/medium/low，可选)
   */
  function registerGate(gateDef) {
    if (!gateDef || !gateDef.layer || !gateDef.type) return;
    var layer = gateDef.layer;
    var type = gateDef.type;
    var eventId = gateDef.eventId || "unknown";

    // 初始化嵌套结构
    if (!_registry[layer]) _registry[layer] = {};
    if (!_registry[layer][type]) _registry[layer][type] = [];

    // 防重复注册
    var existing = _registry[layer][type];
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].eventId === eventId) return;
    }

    // 填充默认值
    gateDef._registeredAt = Date.now();
    existing.push(gateDef);

    // 按 eventId 索引
    if (!_byEventId[eventId]) _byEventId[eventId] = [];
    _byEventId[eventId].push(gateDef);

    // 文件统计
    var file = gateDef.file || "unknown";
    if (!_fileStats[file]) _fileStats[file] = { total: 0, layers: {}, types: {} };
    _fileStats[file].total++;
    _fileStats[file].layers[layer] = (_fileStats[file].layers[layer] || 0) + 1;
    _fileStats[file].types[type] = (_fileStats[file].types[type] || 0) + 1;
  }

  /**
   * 从 RANDOM_EVENTS 自动扫描并注册所有门控
   * 约定式：读取事件定义中的 gateLayers 字段
   * 兼容：读取事件定义中的 conditions 函数（自动推断类型）
   */
  function scanAllGates() {
    if (typeof RANDOM_EVENTS === "undefined") return;

    for (var i = 0; i < RANDOM_EVENTS.length; i++) {
      var ev = RANDOM_EVENTS[i];
      if (!ev || !ev.id) continue;

      // 约定式优先：显式声明 gateLayers 字段
      if (Array.isArray(ev.gateLayers)) {
        for (var g = 0; g < ev.gateLayers.length; g++) {
          var gl = ev.gateLayers[g];
          registerGate({
            layer: gl.layer,
            type: gl.type,
            eventId: ev.id,
            desc: gl.desc || "",
            severity: gl.severity || "medium",
            file: gl.file || _inferFile(ev),
          });
        }
        continue;
      }

      // 兼容性扫描：从 // [LayerN] 注释推断
      // 注意：运行时无法读取注释，但 events_core 中的 evaluateTriggers
      // 可以检查 triggers 对象中的隐含层
      // 此处仅注册显式声明的 gateLayers
    }
  }

  /**
   * 推断事件所属文件（通过调用栈或事件ID前缀）
   * @param {Object} ev - 事件对象
   * @returns {string}
   */
  function _inferFile(ev) {
    if (!ev || !ev.id) return "unknown";
    var id = ev.id;

    // 按 ID 前缀分类
    if (/^med_/.test(id)) return "career_path_events.js";
    if (/^moral_/.test(id)) return "moral_events.js";
    if (/^insider_/.test(id)) return "events_corp.js";
    if (/^corp_/.test(id)) return "events_corp.js";
    if (/^era_/.test(id)) return "era_events.js";
    if (/^startup_/.test(id)) return "startup_events.js";
    if (/^zhou_/.test(id)) return "cross_system_events_part1.js";
    if (/^family_/.test(id)) return "family_events.js";
    if (/^festival_/.test(id)) return "festivals.js";
    if (/^life_/.test(id)) return "lifecycle_linkage_events.js";
    if (/^npc_/.test(id)) return "npc_social_linkage_events.js";
    if (/^chengguan_/.test(id)) return "chengguan_events.js";
    if (/^(sector_|npc_rescue_)/.test(id)) return "cross_system_events.js";
    if (/^community_|^bike_|^live_|^ai_|^stall_|^temple_|^viral_|^delivery_|^ev_|^near_|^gig_|^knowledge_|^shopping_|^p2p_|^sunk_|^consumption_/.test(id))
      return "events_street_life.js";
    if (/^found_wallet_street|^street_|^old_man_|^free_clinic_|^thrift_|^neighbor_|^stranger_/.test(id))
      return "events_street_survival.js";
    if (/^wage_thief_|^honesty_|^wallet_returned_|^labor_|^mental_|^child_|^factory_|^coworker_|^lost_|^lottery_|^village_|^developer_|^property_|^subsidy_|^rider_/.test(id))
      return "events_street_wealth.js";

    return "unknown";
  }

  // ====== 5. 查询API ======

  /**
   * 获取某层的所有门控
   * @param {number} layer - 层号 (1-6)
   * @returns {Object} { type: [gateDef, ...] }
   */
  function getGatesByLayer(layer) {
    return _registry[layer] || {};
  }

  /**
   * 获取某层某类型的门控
   * @param {number} layer - 层号
   * @param {string} type - 门控类型
   * @returns {Array}
   */
  function getGatesByLayerAndType(layer, type) {
    if (!_registry[layer]) return [];
    return _registry[layer][type] || [];
  }

  /**
   * 获取某事件的所有门控
   * @param {string} eventId
   * @returns {Array}
   */
  function getGatesByEvent(eventId) {
    return _byEventId[eventId] || [];
  }

  /**
   * 获取总门控数
   * @returns {number}
   */
  function getTotalGates() {
    var total = 0;
    for (var layer in _registry) {
      for (var type in _registry[layer]) {
        total += _registry[layer][type].length;
      }
    }
    return total;
  }

  /**
   * 获取文件统计
   * @returns {Object}
   */
  function getFileStats() {
    return _fileStats;
  }

  // ====== 6. 审计报告 ======

  /**
   * 运行门控审计 — 生成完整覆盖率报告
   * 调用方式：GateRegistry.runAudit() 或 GateRegistry.runAudit(RANDOM_EVENTS)
   * @param {Array} [events] - 可选，传入事件列表做覆盖度分析
   * @returns {Object} 审计报告
   */
  function runAudit(events) {
    var lines = [];
    lines.push("===== GateRegistry 门控审计 =====");
    lines.push("");

    // 各层统计
    lines.push("--- 按层统计 ---");
    var layerTotals = {};
    for (var li = 0; li < GATE_LAYERS.length; li++) {
      var layerDef = GATE_LAYERS[li];
      var l = layerDef.id;
      var gates = _registry[l] || {};
      var total = 0;
      var typeBreakdown = [];
      for (var t in gates) {
        var count = gates[t].length;
        total += count;
        var typeLabel = GATE_TYPES[t] ? GATE_TYPES[t].icon + GATE_TYPES[t].label : t;
        typeBreakdown.push(typeLabel + "x" + count);
      }
      layerTotals[l] = total;
      lines.push(
        "  " +
          layerDef.icon +
          " Layer " +
          l +
          " " +
          layerDef.name +
          ": " +
          total +
          " 处 [" +
          typeBreakdown.join(", ") +
          "]",
      );
    }

    // 按文件统计
    lines.push("");
    lines.push("--- 按文件统计 ---");
    var sortedFiles = Object.keys(_fileStats).sort();
    for (var fi = 0; fi < sortedFiles.length; fi++) {
      var f = sortedFiles[fi];
      var stat = _fileStats[f];
      var layerDetail = [];
      for (var lk in stat.layers) {
        layerDetail.push("L" + lk + "x" + stat.layers[lk]);
      }
      lines.push("  " + f + ": " + stat.total + " 处 [" + layerDetail.join(", ") + "]");
    }

    // 覆盖度分析（如果传入了事件列表）
    if (events && events.length > 0) {
      lines.push("");
      lines.push("--- 覆盖度分析 ---");
      var gated = 0;
      var ungated = [];
      for (var ei = 0; ei < events.length; ei++) {
        var ev = events[ei];
        if (!ev || !ev.id) continue;
        if (Array.isArray(ev.gateLayers) && ev.gateLayers.length > 0) {
          gated++;
        } else {
          // 仅统计有 conditions 但无 gateLayers 的事件
          if (typeof ev.conditions === "function" || typeof ev.condition === "function") {
            ungated.push(ev.id);
          }
        }
      }
      var coverage = events.length > 0 ? Math.round((gated / events.length) * 100) : 0;
      lines.push(
        "  事件总数: " +
          events.length +
          " | 已声明门控: " +
          gated +
          " (" +
          coverage +
          "%)",
      );
      if (ungated.length > 0) {
        lines.push(
          "  未声明门控但有 conditions 的事件: " + ungated.length + " 个",
        );
        lines.push("    " + ungated.join(", "));
      }
    }

    lines.push("");
    lines.push("===== 审计结束 =====");
    var output = lines.join("\n");
    console.log(output);

    // 返回结构化数据
    return {
      totalGates: getTotalGates(),
      byLayer: layerTotals,
      byFile: _fileStats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 获取门控覆盖率简要报告（用于UI展示）
   * @returns {string}
   */
  function getCoverageSummary() {
    var total = getTotalGates();
    var byLayer = [];
    for (var li = 0; li < GATE_LAYERS.length; li++) {
      var l = GATE_LAYERS[li];
      var count = 0;
      var gates = _registry[l.id] || {};
      for (var t in gates) {
        count += gates[t].length;
      }
      byLayer.push(l.icon + "L" + l.id + ":" + count);
    }
    return "门控总计 " + total + " 处 · " + byLayer.join(" · ");
  }

  // ====== 7. 层定义查询 ======

  /**
   * 获取层定义
   * @param {number} [layerId] - 可选，获取指定层
   * @returns {Array|Object}
   */
  function getLayerDef(layerId) {
    if (layerId) {
      for (var i = 0; i < GATE_LAYERS.length; i++) {
        if (GATE_LAYERS[i].id === layerId) return GATE_LAYERS[i];
      }
      return null;
    }
    return GATE_LAYERS;
  }

  /**
   * 获取门控类型定义
   * @param {string} [typeKey] - 可选，获取指定类型
   * @returns {Object}
   */
  function getGateTypeDef(typeKey) {
    if (typeKey) return GATE_TYPES[typeKey] || null;
    return GATE_TYPES;
  }

  // ====== 8. 全局注册 ======
  window.GateRegistry = {
    // 定义
    LAYERS: GATE_LAYERS,
    TYPES: GATE_TYPES,

    // 注册
    register: registerGate,
    scanAll: scanAllGates,

    // 查询
    getGatesByLayer: getGatesByLayer,
    getGatesByLayerAndType: getGatesByLayerAndType,
    getGatesByEvent: getGatesByEvent,
    getTotalGates: getTotalGates,
    getFileStats: getFileStats,
    getCoverageSummary: getCoverageSummary,

    // 层/类型查询
    getLayerDef: getLayerDef,
    getGateTypeDef: getGateTypeDef,

    // 审计
    runAudit: runAudit,
  };
})();