/**
 * 域H(Phase2/公司) 联动增强 R512
 * 桥接：
 *   H→D  h512_corp_npc_network  职场NPC人脉网 → 消费 corporate+relationships 数据,
 *     公司→"同事变朋友"的社交深化
 *   H→G  h512_corp_life_balance 工作生活平衡 → 消费 corporate+needs 数据,
 *     公司→"事业与健康"的生命平衡
 *   H→B  h512_corp_milestone_narrative 公司里程碑叙事 → 消费 corporate+startup 数据,
 *     公司→"从一间办公室到行业标杆"的叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR512Loaded) return;
  RANDOM_EVENTS._domainHLinkageR512Loaded = true;

  var EVENTS = [
    {
      id: "h512_corp_npc_network", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "同事变朋友",
      story: "工作中认识的同事，慢慢变成了生活中的朋友——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_h512NpcNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h512NpcNetworkCooldown) return false;
        // 需要至少一个已结识NPC
        var hasNpc = false;
        if (st.relationships) {
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) { hasNpc = true; break; }
          }
        }
        return hasNpc;
      },
      choices: [
        { text: "🤝 约吃饭", hint: "社交XP+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512NpcNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '工作之外，我们也是朋友。' 你约同事吃了顿饭，关系更近了。社交XP+5,心情+5。", "success");
        }},
        { text: "📋 保持职场距离", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512NpcNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '职场归职场。' 你选择保持专业距离。管理XP+3。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "工作中认识的同事，慢慢变成了生活中的朋友——'要不要一起吃个饭？' 你开始思考职场关系的分寸。";
      }
    },
    {
      id: "h512_corp_life_balance", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "工作生活平衡",
      story: "连续的高压工作让你开始反思——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_h512LifeBalanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h512LifeBalanceCooldown) return false;
        // 需要疲劳度较高
        return st.needs && (st.needs.fatigue || 0) >= 30;
      },
      choices: [
        { text: "🏃 去运动", hint: "疲劳-15,健康+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 '身体是革命的本钱。' 你决定每天抽出时间运动。疲劳-15,健康+3。", "success");
        }},
        { text: "😴 多睡觉", hint: "疲劳-10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😴 '今晚早点睡。' 你决定调整作息。疲劳-10。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "连续的高压工作让你开始反思——'我这么拼命，到底是为了什么？' 你需要在事业和健康之间找到平衡。";
      }
    },
    {
      id: "h512_corp_milestone_narrative", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "从一间办公室到行业标杆",
      story: "回顾公司的发展历程——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_h512MilestoneNarrCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h512MilestoneNarrCooldown) return false;
        return st.corporate && st.corporate.company;
      },
      choices: [
        { text: "📖 记录历程", hint: "管理XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512MilestoneNarrCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '从一间小办公室，到今天的规模。' 你把公司的发展历程记录下来。管理XP+5,心智+3。", "success");
        }},
        { text: "🚀 继续前进", hint: "管理XP+3,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h512MilestoneNarrCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这只是开始。' 你选择把目光放在下一个目标上。管理XP+3,现金+¥2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾公司的发展历程——'从一间小办公室，到今天的规模。' 这一路走来的故事，值得被记住。";
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
