/**
 * 域A(数据/数值平衡) 联动增强 R571
 * 桥接：
 *   A→H  a571_corp_supply_chain 公司供应链 → 消费 goods 数据,
 *     供应链→"原材料价格波动影响公司"的经营叙事
 *   A→C  a571_skill_cert_value  技能证书价值 → 消费 skills 数据,
 *     证书→"有证书和没证书的薪资差距"的数据分析
 *   A→G  a571_health_data_alerts 健康数据预警 → 消费 goods 数据,
 *     预警→"食品价格与健康数据的关系"的健康预警
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR571Loaded) return;
  RANDOM_EVENTS._domainALinkageR571Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "a571_corp_supply_chain", phase: "corporate", _isChainEvent: false, icon: "🏭",
      title: "供应链",
      story: "原材料价格上涨，影响了公司的成本——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_a571SupplyChainCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._a571SupplyChainCooldown);
      },
      choices: [
        { text: "🏭 优化供应链", hint: "管理XP+5,公司资金+3000,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571SupplyChainCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏭 '原材料涨价了，得找新的供应商。' 管理XP+5,公司资金+¥3000,心智+2。", "success");
        }},
        { text: "📊 成本分析", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571SupplyChainCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏭 '分析成本结构，找出可以优化的环节。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "原材料价格上涨，影响了公司的成本——'供应商说原材料涨价了，我们也要跟着涨。' 供应链，是公司运营的生命线。";
      }
    },
    {
      id: "a571_skill_cert_value", phase: "corporate", _isChainEvent: false, icon: "📜",
      title: "证书价值",
      story: "你发现持有证书的技能薪资更高——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a571CertValueCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a571CertValueCooldown);
      },
      choices: [
        { text: "📜 考证书", hint: "管理XP+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571CertValueCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '有证书的技能，薪资平均高30%。' 你决定考个证书。管理XP+4,心智+2。", "success");
        }},
        { text: "📈 用作品说话", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571CertValueCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '证书不如作品，但敲门砖还是需要的。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现持有证书的技能薪资更高——'同样的技能，有证书的比没证书的高30%。' 证书真的有用。";
      }
    },
    {
      id: "a571_health_data_alerts", phase: "street", _isChainEvent: false, icon: "⚠️",
      title: "健康预警",
      story: "食品价格数据暗示你的健康可能受影响——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a571HealthAlertsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a571HealthAlertsCooldown);
      },
      choices: [
        { text: "⚠️ 注意饮食", hint: "健康+2,花费200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571HealthAlertsCooldown = true;
          if (st.resources && st.resources.cash >= 200) { st.resources.cash -= 200; }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '水果涨价了，但还是要吃，健康更重要。' 健康+2,花费¥200。", "success");
        }},
        { text: "📊 分析数据", hint: "会计XP+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a571HealthAlertsCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ '食品价格涨了，意味着我的饮食质量可能下降。' 会计XP+2,心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "食品价格数据暗示你的健康可能受影响——'蔬菜水果价格连续上涨，这个月饮食支出增加了。' 物价和健康，息息相关。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();