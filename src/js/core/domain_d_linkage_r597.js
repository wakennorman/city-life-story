/**
 * 域D(NPC/社交) 联动增强 R597
 * 桥接：
 *   D→C  d597_npc_career_advice  NPC职业建议 → 消费 state.relationships+state.career 数据,
 *     社交→"朋友帮你规划职业"的成长回响
 *   D→E  d597_npc_invest_tip  NPC投资提示 → 消费 state.relationships+state.investment 数据,
 *     社交→"朋友带你赚钱"的经济回响
 *   D→G  d597_social_weekend 周末社交活动 → 消费 state.relationships+state.needs 数据,
 *     社交→"周末和朋友一起"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR597Loaded) return;
  RANDOM_EVENTS._domainDLinkageR597Loaded = true;

  // 辅助：获取已结识且好感≥30的NPC列表
  function metNpcsR597(st, minAff) {
    var out = [];
    var rels = st.relationships || {};
    minAff = minAff || 0;
    for (var k in rels) {
      if (rels[k] && rels[k].met && (rels[k].affinity || 0) >= minAff) {
        out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
      }
    }
    return out;
  }

  var EVENTS = [
    // ====== D→C: NPC职业建议 ======
    {
      id: "d597_npc_career_advice", phase: "street", _isChainEvent: false, icon: "💼",
      title: "朋友的建议",
      story: "一个朋友听说你在找工作,给了你一些建议——{desc}",
      triggers: { minDay: 20, interval: 90, maxRepeats: 5, excludeFlags: ["_d597CareerAdviceCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d597CareerAdviceCooldown) return false;
        var met = metNpcsR597(st, 40);
        return met.length >= 1;
      },
      choices: [
        { text: "🎯 认真听取建议", hint: "智力+3,心智+2,好感+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597CareerAdviceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var met = metNpcsR597(st, 40);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "职业建议"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '我认识一个朋友在XX公司,我可以帮你问问。' 朋友的帮助让你看到了新的职业方向。智力+3,心智+2,好感+5。", "success");
        }},
        { text: "📝 记下来以后参考", hint: "智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597CareerAdviceCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你认真记下了朋友的建议——'这些经验,以后总用得上。' 智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR597(st, 40);
        var name = met.length > 0 ? met[0].name : "一个朋友";
        return name + "听说你在找工作,特地来找你:'我认识一个HR,他们公司在招人,要不要试试?' 你认真考虑着这个建议。";
      }
    },

    // ====== D→E: NPC投资提示 ======
    {
      id: "d597_npc_invest_tip", phase: "street", _isChainEvent: false, icon: "📈",
      title: "内部消息",
      story: "一个在金融圈混的朋友悄悄告诉你一个消息——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_d597InvestTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d597InvestTipCooldown) return false;
        var met = metNpcsR597(st, 60);
        return met.length >= 1 && (st.resources.cash || 0) >= 5000;
      },
      choices: [
        { text: "📈 跟着投一点", hint: "收益¥500-2000,风险现金-2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597InvestTipCooldown = true;
          var invest = Math.min(2000, (st.resources.cash || 0) * 0.3);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - invest);
          // 50%概率赚,50%概率亏
          var win = Random.chance(0.5);
          if (win) {
            var ret = Math.round(invest * Random.float(1.2, 2.0));
            st.resources.cash = (st.resources.cash || 0) + ret;
            if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '信我的没错!' 朋友的消息果然准,你赚了¥" + (ret - invest).toLocaleString() + "! 现金+" + (ret - invest) + "。", "success");
          } else {
            var loss = Math.round(invest * Random.float(0.3, 0.8));
            st.resources.cash = (st.resources.cash || 0) + loss;
            if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '唉,这次失手了...' 投资失利,只收回¥" + loss + "。亏了¥" + (invest - loss) + "。", "warning");
          }
        }},
        { text: "🤔 先观望", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597InvestTipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '内部消息也不一定准,先看看再说。' 你选择保持理性。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR597(st, 60);
        var name = met.length > 0 ? met[0].name : "一个朋友";
        return name + "神秘兮兮地凑过来:'我得到一个内部消息,XX股票要涨!要不要跟一手?' 你犹豫了——这是机会还是陷阱?";
      }
    },

    // ====== D→G: 周末社交活动 ======
    {
      id: "d597_social_weekend", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "周末邀约",
      story: "朋友们约你周末一起出去玩——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 10, excludeFlags: ["_d597WeekendSocialCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d597WeekendSocialCooldown) return false;
        var met = metNpcsR597(st, 20);
        return met.length >= 1;
      },
      choices: [
        { text: "🀄 一起打牌/桌游", hint: "心情+10,疲劳+5,现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597WeekendSocialCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          var met = metNpcsR597(st, 20);
          for (var mi = 0; mi < Math.min(met.length, 2); mi++) {
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, met[mi].id, 3, "周末打牌"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '哈哈哈,你又输了!' 周末和朋友们一起打牌,笑声不断。心情+10,好感+3,现金-200。", "success");
        }},
        { text: "🥾 一起爬山/徒步", hint: "心情+8,健康+5,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597WeekendSocialCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🥾 '山顶的风景真美!' 虽然累得腿都软了,但看到美景的那一刻,一切都值了。心情+8,健康+5,疲劳+10。", "success");
        }},
        { text: "🍜 一起吃饭聊天", hint: "心情+6,饥饿+20,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d597WeekendSocialCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 20);
          var met = metNpcsR597(st, 20);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "周末聚餐"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍜 '这家店我收藏好久了,终于来吃了!' 美食和朋友,是治愈一切疲惫的良药。心情+6,饥饿+20,好感+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR597(st, 20);
        var name = met.length > 0 ? met[0].name : "朋友们";
        return name + "在群里发消息:'周末有空吗?一起出来玩啊!' 你看了看日程表,确实很久没放松了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();