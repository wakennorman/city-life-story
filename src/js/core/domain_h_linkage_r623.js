/**
 * 域H(Phase2/公司) 联动增强 R623
 * 桥接：
 *   H→A  h623_corp_market_pulse  公司经营脉搏 → 消费 state.startup+state.trade 数据,
 *     公司→"企业家的市场直觉"数据回响
 *   H→D  h623_team_celebration  团队庆功 → 消费 state.startup+state.relationships 数据,
 *     公司→"独乐乐不如众乐乐"社交回响
 *   H→G  h623_founder_life_balance  创始人生活平衡 → 消费 state.startup+state.player+state.needs 数据,
 *     公司→"创业不是全部"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR623Loaded) return;
  RANDOM_EVENTS._domainHLinkageR623Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR623(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "h623_corp_market_pulse", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "企业经营脉搏",
      story: "管理公司让你对市场有了更敏锐的直觉——{desc}",
      triggers: { minDay: 120, interval: 150, maxRepeats: 2, excludeFlags: ["_h623MarketPulseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h623MarketPulseCooldown) return false;
        return st.startup && st.startup.company;
      },
      choices: [
        { text: "📊 把经验用于个人投资", hint: "会计XP+5,置_h623MarketInstinct", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623MarketPulseCooldown = true;
          st.flags._h623MarketInstinct = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '做企业练出的市场嗅觉,是花钱买不来的。' 你把经验用于个人投资。会计XP+5。", "success");
        }},
        { text: "🏢 专注公司本身", hint: "心智+4,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623MarketPulseCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 '专注做好一件事。' 你选择把精力放在公司上。心智+4,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rev = (st.startup && st.startup.company && st.startup.company.revenue) || 0;
        return "管理公司让你对市场有了更敏锐的直觉——公司月营收¥" + rev + ",你开始琢磨这些经验能否用于个人投资。";
      }
    },
    {
      id: "h623_team_celebration", phase: "corporate", _isChainEvent: false, icon: "🎉",
      title: "团队庆功",
      story: "公司完成了一个重要里程碑,是时候庆祝一下了——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_h623CelebrationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h623CelebrationCooldown) return false;
        return st.startup && st.startup.company && (st.startup.company.employees || 0) >= 3;
      },
      choices: [
        { text: "🍻 请团队吃饭", hint: "心情+6,全已结识NPC好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623CelebrationCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          var met = metNpcsR623(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 2, "团队庆功"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '独乐乐不如众乐乐。' 你请团队吃了顿饭,士气大振。心情+6,全NPC好感+2。", "success");
        }},
        { text: "💰 发奖金", hint: "心情+4,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623CelebrationCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '论功行赏,才能持久。' 你给团队发了奖金。心情+4,管理XP+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var empCount = (st.startup && st.startup.company && st.startup.company.employees) || 0;
        return "公司完成了重要里程碑,团队" + empCount + "个人都功不可没——'该庆祝一下了,大家辛苦了!' 你决定怎么庆祝?";
      }
    },
    {
      id: "h623_founder_life_balance", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "创始人的生活平衡",
      story: "创业不是全部,你开始审视自己的生活质量——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 1, excludeFlags: ["_h623LifeBalanceDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h623LifeBalanceDone) return false;
        if (!st.startup || !st.startup.company) return false;
        var happy = (st.needs && st.needs.happiness) || 50;
        var mental = (st.player && st.player.mental) || 50;
        return happy < 50 || mental < 50;
      },
      choices: [
        { text: "🧘 给自己放个假", hint: "心情+10,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623LifeBalanceDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '磨刀不误砍柴工。' 你给自己放了天假,身心恢复。心情+10,心智+5。", "success");
        }},
        { text: "💪 咬咬牙继续", hint: "心智+3,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623LifeBalanceDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '坚持就是胜利。' 你咬牙坚持,公司多赚了¥2000。心智+3,现金+¥2000。", "success");
        }},
        { text: "🤝 找朋友聊聊", hint: "心情+6,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h623LifeBalanceDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          var met = metNpcsR623(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "创业压力倾诉"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '说出来就好多了。' 你找朋友倾诉,心里轻松不少。心情+6,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "创业不是全部——'你有多久没有好好休息了?' 你开始审视自己的生活质量,是时候做出调整了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
