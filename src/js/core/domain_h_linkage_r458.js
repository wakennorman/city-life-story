/**
 * 域H(Phase2/公司) 联动增强 R458（第四轮循环）
 * 桥接：
 *   H→F  h458_corp_culture_wall   公司文化墙 → 消费 corporate 数据,
 *     职场阶段→"公司文化可视化"的UI叙事
 *   H→A  h458_corp_efficiency     企业效率洞察 → 消费 corporate+skills 数据,
 *     团队产出→"数据驱动管理"的经济面板
 *   H→D  h458_corp_promotion_party 晋升庆祝 → 消费 corporate+relationships 数据,
 *     晋升→"职场高光时刻"的社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR458Loaded) return;
  RANDOM_EVENTS._domainHLinkageR458Loaded = true;

  var EVENTS = [
    {
      id: "h458_corp_culture_wall", phase: "corporate", _isChainEvent: false, icon: "🎨",
      title: "公司文化",
      story: "你在白板上画下了公司的使命愿景——{desc}",
      triggers: { minDay: 60, interval: 150, maxRepeats: 3, excludeFlags: ["_h458CultureCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if ((st.corporate.level || 1) < 2) return false;
        return (st.flags && !st.flags._h458CultureCooldown);
      },
      choices: [
        { text: "🎯 狼性文化", hint: "KPI+10,团队忠诚-5,风险+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458CultureCooldown = true;
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 10);
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.max(0, (t[i].loyalty || 50) - 5); } }
          if (st.player && st.player.corporate) st.player.corporate.risk = Math.min(100, (st.player.corporate.risk || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你推行狼性文化——'不进步就是退步。' 团队压力大了，但产出高了。KPI+10。", "success");
        }},
        { text: "🏠 家文化", hint: "团队忠诚+10,KPI-3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458CultureCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 10); } }
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.max(0, (st.player.corporate.kpi || 50) - 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 你推行家文化——'公司就是家。' 团队凝聚力强了，但节奏慢了些。团队忠诚+10,心情+5。", "success");
        }},
        { text: "🔬 工程师文化", hint: "能力+5,产出系数+0.1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458CultureCooldown = true;
          if (st.player && st.player.corporate) st.player.corporate.ability = Math.min(100, (st.player.corporate.ability || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔬 你推行工程师文化——'用技术说话。' 团队能力提升了，技术氛围浓厚。能力+5,编程XP+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var company = st.corporate && st.corporate.company;
        var name = company ? company.name : "公司";
        return "你在" + name + "的白板上画下了公司的使命愿景——文化不是口号，是每天的选择。你决定把什么样的基因注入这家公司？";
      }
    },
    {
      id: "h458_corp_efficiency", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "数据驱动",
      story: "你分析了团队的运营数据——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 3, excludeFlags: ["_h458EfficiencyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.corporate.team || st.corporate.team.length === 0) return false;
        return (st.flags && !st.flags._h458EfficiencyCooldown);
      },
      choices: [
        { text: "📈 优化产出最低的人", hint: "平均产出+2,最低者忠诚-15", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458EfficiencyCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t && t.length > 0) {
            var lowest = t[0];
            for (var i = 1; i < t.length; i++) { if ((t[i].productivity || 0) < (lowest.productivity || 0)) lowest = t[i]; }
            if (lowest) { lowest.productivity = (lowest.productivity || 5) + 2; lowest.loyalty = Math.max(0, (lowest.loyalty || 50) - 15); }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你决定优化产出最低的人——数据不会说谎，但人心会痛。平均产出+2。", "warning");
        }},
        { text: "🎓 培训全员技能", hint: "全员工产出+3,现金-5000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458EfficiencyCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].productivity = (t[i].productivity || 5) + 3; } }
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你决定培训全员——'投资于人，回报最大。' 全员工产出+3,花费¥5000。", "success");
        }},
        { text: "🤷 顺其自然", hint: "心智+2,团队忠诚+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458EfficiencyCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 3); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤷 你决定顺其自然——'团队不是机器，需要呼吸的空间。' 心智+2,团队忠诚+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var t = st.corporate && st.corporate.team;
        var n = t ? t.length : 0;
        return "你看着" + n + "个人的团队运营数据——每个人的产出、忠诚、潜力都化作了数字。数据驱动是科学管理，但数字背后是一个个鲜活的人。";
      }
    },
    {
      id: "h458_corp_promotion_party", phase: "corporate", _isChainEvent: false, icon: "🎉",
      title: "晋升之宴",
      story: "你晋升到{rank}的消息传开了——{desc}",
      triggers: { minDay: 100, interval: 200, maxRepeats: 2, excludeFlags: ["_h458PartyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (!st.flags) return false;
        // 仅在晋升次数>=2时触发（已晋升过至少一次）
        return (st.flags._totalPromotions >= 2 && !st.flags._h458PartyCooldown);
      },
      choices: [
        { text: "🍾 大宴宾客", hint: "好感+5(同事),现金-3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458PartyCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
          var npcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
          for (var wi = 0; wi < npcs.length; wi++) {
            if (st.relationships && st.relationships[npcs[wi]] && st.relationships[npcs[wi]].met) {
              if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcs[wi], 5, "晋升庆祝"); } catch(e) {} }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍾 你摆了一桌庆功宴——'一路走来，感谢各位的扶持。' 同事们对你的好感大增。好感+5,花费¥3000。", "success");
        }},
        { text: "🍜 简单吃个面", hint: "心情+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458PartyCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍜 你简单吃了碗面——'晋升只是一个节点，路还长。' 心情+3,心智+2。", "success");
        }},
        { text: "💼 立刻投入工作", hint: "KPI+8,倦怠+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h458PartyCooldown = true;
          if (st.player && st.player.corporate) st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 50) + 8);
          var cap = st.career && st.career.capital;
          if (cap) cap.burnout = Math.min(100, (cap.burnout || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你没有庆祝，直接投入了新岗位的工作——'更高的位置，更大的责任。' KPI+8,倦怠+5。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rank = st.corporate && st.corporate.rank ? st.corporate.rank : "新职级";
        return "你晋升到" + rank + "的消息在办公室传开了——同事们投来羡慕的目光，但你深知，更高的位置意味着更大的责任。怎么庆祝这个高光时刻？";
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
