/**
 * 域F(UI/UX) 联动增强 R442
 * 桥接（数值均为 [PLACEHOLDER] 保守占位，可按平衡再调）：
 *   F→D  f442_neglect_reconnect   关系面板"久未联系"提醒 → 消费 rel._lastInteractionDay → 主动重连最疏远的已结识NPC
 *   F→E  f442_asset_allocation     资产配置视图 → 消费 investment.stockHoldings → 提升投资意识(_dataInvestorMindset)
 *   F→H  f442_ops_dashboard        经营仪表盘季度看板 → 需 corporate.company → 用数据汇报换 management XP/奖金/晋升势能
 * 设计意图：把 UI 信息面板(关系网/财务/经营看板)从"只读展示"升级为"驱动行动"，
 *          让玩家每次查看数据都有一次转化为具体收益的抉择，强化峰终体验与信息面板留存价值。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR442Loaded) return;
  RANDOM_EVENTS._domainFLinkageR442Loaded = true;

  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch (e) {} } }
  function bumpAffinityR442(st, npcId, change, reason) {
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, change, reason); return true; } catch (e) {} }
    return false;
  }
  // 找出"最久未联系"的已结识NPC（消费 _lastInteractionDay，守 rel.met 铁律）
  function mostNeglectedNpcR442(st) {
    if (!st || !st.relationships) return null;
    var worstId = null, worstDay = Infinity;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (!rel || !rel.met) continue; // 域D铁律：必须已结识
      var last = (typeof rel._lastInteractionDay === "number") ? rel._lastInteractionDay : 0;
      if (last < worstDay) { worstDay = last; worstId = id; }
    }
    return worstId;
  }

  var EVENTS = [
    {
      // F→D 关系面板"久未联系"提醒：把关系网UI从只读升级为重连驱动
      id: "f442_neglect_reconnect", phase: "street", _isChainEvent: false, icon: "📇",
      title: "久未联系的老友",
      story: "关系网面板顶部标出了一个提醒——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_f442ReconnectCooldown"] },
      conditions: function (st) {
        return !st.gameOver && st.relationships && mostNeglectedNpcR442(st) !== null;
      },
      choices: [
        { text: "📞 主动联系一下", hint: "好感提升，心情+3", apply: function (st) {
          if (!st) return; if (!st.flags) st.flags = {};
          st.flags._f442ReconnectCooldown = true;
          var nid = mostNeglectedNpcR442(st);
          if (nid) bumpAffinityR442(st, nid, 5 /* [PLACEHOLDER] 重连好感 */, "看到关系面板提醒，主动联系了久未见面的朋友");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3 /* [PLACEHOLDER] */);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📇 你按关系面板的提醒联系了久未见面的朋友——关系是需要经营的。好感提升，心情+3。", "success");
        }},
        { text: "🤷 改天再说", hint: "无变化", apply: function (st) { if (st && st.flags) st.flags._f442ReconnectCooldown = true; } }
      ],
      text: function (st) {
        if (!st) return null;
        var nid = mostNeglectedNpcR442(st);
        var name = nid || "某位朋友";
        if (nid && typeof getNpcDisplayName === "function") { try { name = getNpcDisplayName(nid) || nid; } catch (e) {} }
        return "关系网面板顶部标出了一个提醒——你和「" + name + "」已经很久没有联系了。";
      }
    },
    {
      // F→E 资产配置视图：财务面板从只读升级为投资意识养成
      id: "f442_asset_allocation", phase: "street", _isChainEvent: false, icon: "📊",
      title: "资产配置视图",
      story: "你切到财务面板的资产配置视图——{desc}",
      triggers: { minDay: 50, excludeFlags: ["_f442AllocCooldown"] },
      conditions: function (st) {
        return !st.gameOver && st.investment && Array.isArray(st.investment.stockHoldings) && st.investment.stockHoldings.length >= 1;
      },
      choices: [
        { text: "🧭 复盘配置比例", hint: "投资意识+，心智+4", apply: function (st) {
          if (!st) return; if (!st.flags) st.flags = {};
          st.flags._f442AllocCooldown = true;
          st.flags._dataInvestorMindset = true; // 复用既有投资意识 flag
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4 /* [PLACEHOLDER] */);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你复盘了资产配置比例——看清仓位分布，是理性投资的第一步。投资意识增强，心智+4。", "success");
        }},
        { text: "🤷 随便看看", hint: "无奖励", apply: function (st) { if (st && st.flags) st.flags._f442AllocCooldown = true; } }
      ],
      text: function (st) {
        if (!st || !st.investment || !Array.isArray(st.investment.stockHoldings)) return null;
        var n = st.investment.stockHoldings.length;
        var desc = "当前持有" + n + "只标的";
        desc += (n >= 4) ? "，配置较为分散" : "，仓位较集中，注意单一风险";
        return "你切到财务面板的资产配置视图——" + desc + "。";
      }
    },
    {
      // F→H 经营仪表盘：公司季度看板从只读展示升级为汇报变现
      id: "f442_ops_dashboard", phase: "corporate", _isChainEvent: false, icon: "🗂️",
      title: "经营仪表盘",
      story: "你打开公司经营仪表盘，季度看板一目了然——{desc}",
      triggers: { minDay: 80, excludeFlags: ["_f442OpsCooldown"] },
      conditions: function (st) {
        return !st.gameOver && st.corporate && st.corporate.company;
      },
      choices: [
        { text: "📈 用数据做季度汇报", hint: "管理经验+，奖金+，晋升势能+", apply: function (st) {
          if (!st) return; if (!st.flags) st.flags = {};
          st.flags._f442OpsCooldown = true;
          grantXp("management", 8 /* [PLACEHOLDER] */);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500 /* [PLACEHOLDER] 汇报奖金 */;
          if (st.player) {
            if (!st.player.corporate) st.player.corporate = {};
            st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 3 /* [PLACEHOLDER] */);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗂️ 你用仪表盘数据做了一次清晰的季度汇报——数据说话最有说服力。管理经验+8，奖金¥1,500，晋升势能+3。", "success");
        }},
        { text: "🤷 口头汇报即可", hint: "无奖励", apply: function (st) { if (st && st.flags) st.flags._f442OpsCooldown = true; } }
      ],
      text: function (st) {
        if (!st || !st.corporate || !st.corporate.company) return null;
        var name = st.corporate.company.name || "你的公司";
        return "你打开公司经营仪表盘，季度看板一目了然——「" + name + "」的关键指标尽收眼底，是时候把数据讲给上级听了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
