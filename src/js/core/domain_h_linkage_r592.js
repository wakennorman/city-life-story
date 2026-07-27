/**
 * 域H(Phase2/公司) 联动增强 R592
 * 桥接：
 *   H→G  h592_corp_life_balance  公司生活平衡 → 消费 corporate+needs 数据,
 *     公司→"事业与健康"的生命回响
 *   H→C  h592_corp_career_growth  公司职业成长 → 消费 corporate+skills 数据,
 *     公司→"做项目积累职业资本"的职业回响
 *   H→B  h592_corp_milestone_narrative 公司里程碑叙事 → 消费 corporate 数据,
 *     公司→"从一间办公室到行业标杆"的叙事回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR592Loaded) return;
  RANDOM_EVENTS._domainHLinkageR592Loaded = true;

  var EVENTS = [
    {
      id: "h592_corp_life_balance", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "事业与健康",
      story: "连续的高压工作让你开始反思——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_h592LifeBalanceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h592LifeBalanceCooldown) return false;
        return st.needs && (st.needs.fatigue || 0) >= 40;
      },
      choices: [
        { text: "🧘 休息调整", hint: "疲劳-20,健康+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '身体是革命的本钱。' 你决定好好休息调整。疲劳-20,健康+5。", "success");
        }},
        { text: "💪 咬牙坚持", hint: "业绩+5,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592LifeBalanceCooldown = true;
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ '再坚持一下，熬过这阵就好了。' 你选择继续拼搏。疲劳+10。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "连续的高压工作让你开始反思——'我是不是该停下来休息一下？' 但手头的工作还在催着你。";
      }
    },
    {
      id: "h592_corp_career_growth", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "做项目积累职业资本",
      story: "你开始思考如何通过项目积累职业资本——{desc}",
      triggers: { minDay: 50, interval: 100, maxRepeats: 3, excludeFlags: ["_h592CareerGrowthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h592CareerGrowthCooldown) return false;
        return st.corporate && st.corporate.company;
      },
      choices: [
        { text: "💼 主动承担", hint: "管理XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592CareerGrowthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '多做项目多积累。' 你主动承担了更多工作。管理XP+5。", "success");
        }},
        { text: "📚 学习新技能", hint: "随机技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592CareerGrowthCooldown = true;
          var skills = ["coding", "sales", "accounting", "management", "cooking", "repair"];
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '学无止境。' " + sk + "XP+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始思考如何通过项目积累职业资本——'项目是最好的成长机会。' 你开始主动寻找机会。";
      }
    },
    {
      id: "h592_corp_milestone_narrative", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "从一间办公室到行业标杆",
      story: "回顾公司的发展历程——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_h592MilestoneNarrCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h592MilestoneNarrCooldown) return false;
        return st.corporate && st.corporate.company;
      },
      choices: [
        { text: "📖 记录历程", hint: "管理XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592MilestoneNarrCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '从一间小办公室，到今天的规模。' 你把公司的发展历程记录下来。管理XP+5,心智+3。", "success");
        }},
        { text: "🚀 继续前进", hint: "管理XP+3,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h592MilestoneNarrCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '这只是开始。' 你选择把目光放在下一个目标上。管理XP+3,现金+¥2000。", "success");
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
