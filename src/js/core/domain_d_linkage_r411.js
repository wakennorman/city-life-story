/**
 * 域D(NPC/社交) 联动增强 R411
 * 第十七轮循环——把隐藏在NPC关系衰减/社交圈层/礼物偏好中的数据转化为叙事体验。
 * 桥接：
 *   D→G  d411_social_health_v2      社交健康v2 → 消费 relationships+needs 数据,
 *     社交支持网络→"朋友让生活更美好"的健康回响
 *   D→E  d411_npc_investment_bridge  NPC投资桥接 → 消费 relationships+investment,
 *     高好感NPC→"TA给了投资建议"的经济联动
 *   D→H  d411_corp_culture_npc      公司文化NPC → 消费 relationships+corporate,
 *     同事关系→"职场不只是工作,更是人情"的公司文化叙事
 *
 * 严格照 domain_d_linkage_r405.js / r395.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR411Loaded) return;
  RANDOM_EVENTS._domainDLinkageR411Loaded = true;

  // 取首个高好感NPC
  function firstHighAffNpcR411(st, minAff) {
    minAff = minAff || 35;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) return id;
    }
    return null;
  }

  // 安全好感变更
  function bumpAffinityR411(st, npcId, delta) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, delta); } catch(e) { /* safe */ }
    }
  }

  // 安全NPC中文名
  function npcNameR411(st, npcId) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(npcId) || npcId; } catch(e) { /* safe */ }
    }
    return npcId;
  }

  var EVENTS = [
    {
      // D→G: 社交健康v2 — 消费 relationships+needs
      id: "d411_social_health_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "社交健康",
      story:
        "朋友的存在让生活更美好——{healthSummary}\n\n社交是身心健康的基石。",
      triggers: { minDay: 50, excludeFlags: ["_d411HealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return firstHighAffNpcR411(st, 30) !== null;
      },
      choices: [
        {
          text: "💕 珍惜身边的朋友",
          hint: "心情+5,心智+3,置 _d411HealthCooldown(70天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d411HealthCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💚 朋友让生活更美好——社交是身心健康的基石。心情+5,心智+3。", "success");
          }
        },
        {
          text: "😊 独处也是一种享受",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var count = 0;
        if (st.relationships) {
          for (var id in st.relationships) {
            if (st.relationships[id] && st.relationships[id].met) count++;
          }
        }
        var summary = "你有" + count + "位已结识的朋友";
        if (count >= 5) summary = count + "位朋友构成了你的社交支持网络";
        return "朋友的存在让生活更美好——" + summary + "。\n\n社交是身心健康的基石。";
      }
    },
    {
      // D→E: NPC投资桥接 — 消费 relationships+investment
      id: "d411_npc_investment_bridge",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "朋友的投资建议",
      story:
        "{npcName}跟你聊起了投资——{investBridge}\n\n朋友的投资经验,是最好的实战教材。",
      triggers: { minDay: 80, excludeFlags: ["_d411InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return firstHighAffNpcR411(st, 50) !== null;
      },
      choices: [
        {
          text: "📝 认真听取建议",
          hint: "好感+3,accounting XP+4,置 _d411InvestCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d411InvestCooldown = true;
            var npc = firstHighAffNpcR411(st, 50);
            if (npc) bumpAffinityR411(st, npc, 3);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 4); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你听取了朋友的投资建议——实战经验是最好的教材。好感+3,会计XP+4。", "success");
          }
        },
        {
          text: "😊 投资还是要靠自己研究",
          hint: "好感+1",
          apply: function (st) {
            var npc = firstHighAffNpcR411(st, 50);
            if (npc) bumpAffinityR411(st, npc, 1);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = firstHighAffNpcR411(st, 50);
        if (!npc) return null;
        var npcN = npcNameR411(st, npc);
        var bridge = "投资有风险,需要谨慎对待";
        if (st.investment) {
          var hasInv = (st.investment.stockHoldings && st.investment.stockHoldings.length > 0) ||
                       (st.investment.btcHoldings && st.investment.btcHoldings > 0);
          bridge = hasInv ? "分享了自己的投资经验,让你受益匪浅" : "建议你先从基础学起,了解市场规律";
        }
        return npcN + "跟你聊起了投资——" + bridge + "。\n\n朋友的投资经验,是最好的实战教材。";
      }
    },
    {
      // D→H: 公司文化NPC — 消费 relationships+corporate
      id: "d411_corp_culture_npc",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "职场人情味",
      story:
        "工作中你发现——{corpCulture}\n\n职场不只是工作,更是人情的温暖。",
      triggers: { minDay: 70, excludeFlags: ["_d411CorpCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 珍惜职场中的同事情谊",
          hint: "心情+4,心智+3,置 _d411CorpCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d411CorpCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏢 你珍惜职场同事情谊——人情味让工作更有温度。心情+4,心智+3。", "success");
          }
        },
        {
          text: "😊 保持专业的同事关系",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var culture = "同事之间的互助让工作更有动力";
        if (st.relationships) {
          var workFriends = 0;
          for (var id in st.relationships) {
            var r = st.relationships[id];
            if (r && r.met && (r.affinity || 0) >= 30) workFriends++;
          }
          if (workFriends > 0) culture = workFriends + "位同事成为了你职场中的朋友,互相支持";
        }
        return "工作中你发现——" + culture + "。\n\n职场不只是工作,更是人情的温暖。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
