/**
 * 域F(UI/UX) 联动增强 R511
 * 桥接：
 *   F→D  f511_social_interaction_ui 社交互动UI → 消费 relationships 数据,
 *     互动→"一键问候"的快捷社交UI
 *   F→G  f511_life_quality_meter  生活品质表 → 消费 needs+status 数据,
 *     品质→"你的生活品质综合评分"的仪表盘
 *   F→E  f511_saving_goal_ui      储蓄目标UI → 消费 resources 数据,
 *     目标→"存钱目标进度条"的UI展示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR511Loaded) return;
  RANDOM_EVENTS._domainFLinkageR511Loaded = true;

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
      id: "f511_social_interaction_ui", phase: "street", _isChainEvent: false, icon: "💬",
      title: "一键问候",
      story: '你看到社交面板上有个"一键问候"按钮——{desc}',
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_f511SocialInteractionCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f511SocialInteractionCooldown);
      },
      choices: [
        { text: "💬 一键问候", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511SocialInteractionCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "一键问候");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你按下一键问候——'早安！今天也要开心哦！' 简单的一句话，却能温暖一整天。好感+1,心情+1。", "success");
        }},
        { text: "✍️ 手动写祝福", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511SocialInteractionCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "用心祝福");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 你亲手写了祝福语——'手写的文字，比机械的问候更有温度。' 好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return '你看到社交面板上有个"一键问候"按钮——要不要试试？ 科技让社交变得更简单，但也更敷衍。';
      }
    },
    {
      id: "f511_life_quality_meter", phase: "street", _isChainEvent: false, icon: "📊",
      title: "生活品质分",
      story: "你查看了一下自己的综合生活品质评分——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_f511QualityMeterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f511QualityMeterCooldown);
      },
      choices: [
        { text: "📊 提升弱项", hint: "健康+1,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511QualityMeterCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '健康分偏低，得多运动了。' 你决定从今天开始改善。健康+1,心情+2。", "success");
        }},
        { text: "📈 保持优势", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511QualityMeterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '你的社交分很高，继续保持！' 发挥优势，比弥补短板更容易。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你查看了一下自己的综合生活品质评分——健康、心情、社交、财务... 每一项都在影响着你的生活品质。";
      }
    },
    {
      id: "f511_saving_goal_ui", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "存钱目标",
      story: "你给自己设定了一个存钱目标——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_f511SavingGoalCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f511SavingGoalCooldown);
      },
      choices: [
        { text: "🎯 存钱", hint: "存款+1000,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511SavingGoalCooldown = true;
          if (st.resources && st.resources.cash >= 1000) {
            st.resources.cash -= 1000;
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 1000;
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你存了1000块——'积少成多，离目标又近了一步。' 存款+¥1000,会计XP+2。", "success");
        }},
        { text: "📊 调整预算", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f511SavingGoalCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你调整了预算——'省下来的钱，就是赚到的。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你给自己设定了一个存钱目标——'今年要存够XX万！' 目标可视化，是实现目标的第一步。";
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