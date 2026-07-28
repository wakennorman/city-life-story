/**
 * 域C(职业/成长) 联动增强 R502
 * 桥接：
 *   C→D  c502_career_mentor_bond  职场师徒情谊 → 消费 skills+corporate+social 数据,
 *     技能→"师傅领进门"的NPC关系深化
 *   C→B  c502_career_milestone_story 职业里程碑叙事 → 消费 skills+job 数据,
 *     技能→"第一次独当一面"的叙事回响
 *   C→G  c502_career_burnout_recovery 职业倦怠恢复 → 消费 skills+needs 数据,
 *     职场→"停下来才能走更远"的健康恢复
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR502Loaded) return;
  RANDOM_EVENTS._domainCLinkageR502Loaded = true;

  var EVENTS = [
    {
      id: "c502_career_mentor_bond", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "师徒情谊",
      story: "你在职场遇到了一位前辈，愿意指点你——{desc}",
      triggers: { minDay: 45, interval: 120, maxRepeats: 3, excludeFlags: ["_c502MentorBondCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        if (!st.flags || st.flags._c502MentorBondCooldown) return false;
        // 需要至少一个已结识NPC
        var hasNpc = false;
        if (st.npcs) {
          for (var k in st.npcs) {
            if (st.npcs[k] && st.npcs[k].met) { hasNpc = true; break; }
          }
        }
        return hasNpc;
      },
      choices: [
        { text: "🤝 虚心请教", hint: "社交XP+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502MentorBondCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '前辈的经验能让我少走很多弯路。' 你虚心请教，收获颇丰。社交XP+5,心智+3。", "success");
        }},
        { text: "📖 自己摸索", hint: "智力+2,随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502MentorBondCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var skills = ["accounting", "management", "coding", "sales", "repair"];
          var sk = Random.fromArray(skills); // [全系统自洽修复] 域C R400: Math.random()→Random.fromArray()
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '有些路还是要自己走。' 你选择独立思考。智力+2,随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在职场遇到了一位前辈，愿意指点你——'年轻人，做事要有章法。' 你决定好好把握这个机会。";
      }
    },
    {
      id: "c502_career_milestone_story", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "第一次独当一面",
      story: "你第一次独立完成了重要任务——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c502MilestoneStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c502MilestoneStoryCooldown);
      },
      choices: [
        { text: "🏆 总结经验", hint: "管理XP+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502MilestoneStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '第一次独当一面，值得好好总结。' 你把经验记录下来。管理XP+5,心情+5。", "success");
        }},
        { text: "🎉 犒劳自己", hint: "心情+8,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502MilestoneStoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '辛苦了这么久，该犒劳一下自己。' 你好好放松了一天。心情+8,现金-¥500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你第一次独立完成了重要任务——'原来我真的可以做到。' 这一刻值得铭记。";
      }
    },
    {
      id: "c502_career_burnout_recovery", phase: "corporate", _isChainEvent: false, icon: "🧘",
      title: "停下来才能走更远",
      story: "连续的高压工作让你感到疲惫——{desc}",
      triggers: { minDay: 60, interval: 150, maxRepeats: 3, excludeFlags: ["_c502BurnoutRecoveryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        if (!st.flags || st.flags._c502BurnoutRecoveryCooldown) return false;
        // 需要倦怠度较高
        var cap = st.corporate && st.corporate.careerCapital;
        return cap && (cap.burnout || 0) >= 40;
      },
      choices: [
        { text: "🧘 休息调整", hint: "疲劳-20,健康+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502BurnoutRecoveryCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '身体是革命的本钱。' 你决定好好休息调整。疲劳-20,健康+5。", "success");
        }},
        { text: "💪 咬牙坚持", hint: "业绩+5,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c502BurnoutRecoveryCooldown = true;
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '再坚持一下，熬过这阵就好了。' 你选择继续拼搏。疲劳+10。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "连续的高压工作让你感到疲惫——'我是不是该停下来休息一下？' 但手头的工作还在催着你。";
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
