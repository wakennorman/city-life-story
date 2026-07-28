/**
 * 域D(NPC/社交) 联动增强 R678
 * 桥接：
 *   D→C  d678_npc_mentor_career    NPC职业导师 → 消费 state.relationships,
 *     导师NPC给予职业建议,促进职业成长
 *   D→A  d678_friend_market_whisper 朋友市场耳语 → 消费 state.relationships+state.trade,
 *     已结识朋友分享市场价格情报,提升数据感知
 *   D→G  d678_social_wellness        社交健康回响 → 消费 state.relationships+state.needs,
 *     社交活跃提振心情与心理健康
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR678Loaded) return;
  RANDOM_EVENTS._domainDLinkageR678Loaded = true;

  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var cnt = 0;
    for (var k in st.relationships) {
      if (st.relationships[k] && st.relationships[k].met) cnt++;
    }
    return cnt;
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

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  var EVENTS = [
    {
      id: "d678_npc_mentor_career",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "前辈的点拨",
      story: "一位前辈朋友给了你一些职业建议",
      triggers: { minDay: 40, interval: 60, maxRepeats: 3, excludeFlags: ["_d678MentorCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d678MentorCd) return false;
        return metNpcCount(st) >= 2 && st.player && st.player.day >= 40;
      },
      choices: [
        {
          text: "🎓 认真听取",
          hint: "管理XP+6,心智+3,好感+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678MentorCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "职业建议");
            if (typeof StateManager !== "undefined") {
              var name = (typeof getNpcDisplayName === "function") ? getNpcDisplayName(topMetNpc(st)) : "朋友";
              StateManager.addMessage("🎓 " + name + "的一番话让你茅塞顿开。管理XP+6,心智+3。", "success");
            }
          }
        },
        {
          text: "🤔 有自己的想法",
          hint: "智力+4,保持独立判断",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678MentorCd = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤔 你感谢朋友的建议,但决定按自己的方式来。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = topMetNpc(st);
        var name = (typeof getNpcDisplayName === "function" && npc) ? getNpcDisplayName(npc) : "一位朋友";
        return name + "找到你,聊起了职业发展——'我看你最近挺拼的,但有些事不能只靠努力,还得讲方法。'";
      }
    },
    {
      id: "d678_friend_market_whisper",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "朋友的市场耳语",
      story: "一个朋友分享了最近的市场价格观察",
      triggers: { minDay: 50, interval: 75, maxRepeats: 2, excludeFlags: ["_d678MarketCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d678MarketCd) return false;
        return metNpcCount(st) >= 1 && st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "📊 记下价格规律",
          hint: "销售XP+5,智力+2,置_d678PriceSense",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678MarketCd = true;
            st.flags._d678PriceSense = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 1, "市场情报");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你记下了朋友说的价格规律,销售XP+5,智力+2。", "success");
            }
          }
        },
        {
          text: "🗣️ 分享给其他摊友",
          hint: "社交XP+4,置_d678SharedIntel(数据传播)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678MarketCd = true;
            st.flags._d678SharedIntel = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "情报分享");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ 你把情报分享给其他摊友,社交XP+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = topMetNpc(st);
        var name = (typeof getNpcDisplayName === "function" && npc) ? getNpcDisplayName(npc) : "朋友";
        return name + "找到你,聊起了市场——'最近猪肉涨了两成,蔬菜倒是便宜了,听说批发商在囤货。'";
      }
    },
    {
      id: "d678_social_wellness",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "朋友的力量",
      story: "朋友们的陪伴让你感到温暖",
      triggers: { minDay: 30, interval: 45, maxRepeats: 4, excludeFlags: ["_d678WellnessCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d678WellnessCd) return false;
        return metNpcCount(st) >= 3 && st.player && st.player.day >= 30;
      },
      choices: [
        {
          text: "😊 珍惜友情",
          hint: "心情+8,心智+3,健康+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678WellnessCd = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 2);
            bumpAff(st, topMetNpc(st), 1, "社交温暖");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友是最好的良药。心情+8,心智+3,健康+2。", "success");
            }
          }
        },
        {
          text: "🤝 主动联系更多人",
          hint: "结识新朋友机会,智力+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d678WellnessCd = true;
            st.flags._d678ReachOut = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你决定主动联系更多朋友。智力+2,社交网络扩大。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "和" + metNpcCount(st) + "个朋友相处的点点滴滴,汇聚成一股暖流——'在这个城市里,有这些朋友真好。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
