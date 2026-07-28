/**
 * 域D(NPC/社交) 联动增强 R694
 * 桥接：
 *   D→A  d694_social_capital_value   社交资本价值 → 消费 state.relationships,
 *     人脉网络的经济价值
 *   D→C  d694_npc_referral_network   NPC内推网络 → 消费 state.relationships+state.employment,
 *     朋友推荐工作机会
 *   D→G  d694_friendship_wellness     友谊健康效应 → 消费 state.relationships+state.needs,
 *     友谊对身心健康的积极影响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR694Loaded) return;
  RANDOM_EVENTS._domainDLinkageR694Loaded = true;

  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var cnt = 0;
    for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) cnt++; }
    return cnt;
  }

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -999;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && r.met && typeof r.affinity === "number" && r.affinity > bestAff) {
        bestAff = r.affinity; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "d694_social_capital_value",
      phase: "street",
      _isChainEvent: false,
      icon: "💎",
      title: "社交资本的价值",
      story: "你的人脉网络是一笔无形资产",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_d694ValueCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d694ValueCd) return false;
        return metNpcCount(st) >= 3 && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📊 盘点人脉",
          hint: "管理XP+5,智力+3,置_d694Analyzer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694ValueCd = true;
            st.flags._d694Analyzer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 人脉就是钱脉,盘点社交资本。管理XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🤝 主动维护",
          hint: "社交XP+5,好感+2,置_d694Maintain",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694ValueCd = true;
            st.flags._d694Maintain = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "主动维护");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 关系不维护就会淡,社交XP+5,好感+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "已结识" + metNpcCount(st) + "位朋友——'人脉不是认识多少人,是多少人愿意帮你。'";
      }
    },
    {
      id: "d694_npc_referral_network",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "朋友的内推",
      story: "一个朋友推荐了一个工作机会",
      triggers: { minDay: 60, interval: 80, maxRepeats: 3, excludeFlags: ["_d694ReferCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d694ReferCd) return false;
        return metNpcCount(st) >= 2 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🎯 认真准备面试",
          hint: "管理XP+6,智力+3,好感+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694ReferCd = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "内推机会");
            if (typeof StateManager !== "undefined") {
              var name = (typeof getNpcDisplayName === "function") ? getNpcDisplayName(topMetNpc(st)) : "朋友";
              StateManager.addMessage("💼 " + name + "的内推机会,好好把握!管理XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "🤔 先观望",
          hint: "心智+4,置_d694Wait",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694ReferCd = true;
            st.flags._d694Wait = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤔 机会很多,不急着决定。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = topMetNpc(st);
        var name = (typeof getNpcDisplayName === "function" && npc) ? getNpcDisplayName(npc) : "朋友";
        return name + "找到你:'我那边公司在招人,你要不要试试?'";
      }
    },
    {
      id: "d694_friendship_wellness",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "友谊的健康效应",
      story: "朋友是最好的保健品",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_d694WellCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d694WellCd) return false;
        return metNpcCount(st) >= 2 && st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "😊 珍惜友情",
          hint: "心情+8,健康+3,置_d694Cherish",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694WellCd = true;
            st.flags._d694Cherish = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友是最好的保健品。心情+8,健康+3。", "success");
            }
          }
        },
        {
          text: "📱 约线下见面",
          hint: "社交XP+5,好感+3,置_d694Meet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d694WellCd = true;
            st.flags._d694Meet = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 3, "线下见面");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📱 线上千言,不如线下一次。社交XP+5,好感+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "和" + metNpcCount(st) + "个朋友相处的点滴——'在这个城市里,有人惦记的感觉真好。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
