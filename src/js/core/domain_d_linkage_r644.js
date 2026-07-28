/**
 * 域D(NPC/社交) 联动增强 R644
 * 桥接：
 *   D→A  d644_social_network_value  社交网络价值 → 消费 state.relationships 数据,
 *     社交→"人脉就是钱脉"数据回响
 *   D→B  d644_npc_storyline  NPC故事线 → 消费 state.relationships+state.flags 数据,
 *     社交→"每个人都有自己的故事"叙事回响
 *   D→C  d644_career_referral  职业内推 → 消费 state.relationships+state.skills 数据,
 *     社交→"贵人相助"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR644Loaded) return;
  RANDOM_EVENTS._domainDLinkageR644Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR644(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "d644_social_network_value", phase: "street", _isChainEvent: false, icon: "💎",
      title: "人脉就是钱脉",
      story: "你的人脉网络,是一笔无形的财富——{desc}",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_d644ValueDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d644ValueDone) return false;
        var met = metNpcsR644(st);
        return met.length >= 6;
      },
      choices: [
        { text: "📊 量化人脉", hint: "智力+4,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644ValueDone = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '人脉不是认识多少人,而是能帮多少人。' 你量化了社交资本。智力+4,心智+3。", "success");
        }},
        { text: "🤝 主动维护", hint: "全NPC好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644ValueDone = true;
          var met = metNpcsR644(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 2, "人脉维护"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '关系是要维护的。' 你主动联系了朋友们。全NPC好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR644(st);
        var totalAff = 0;
        for (var i = 0; i < met.length; i++) { totalAff += met[i].affinity; }
        return "你的人脉网络——" + met.length + "位朋友,总好感" + totalAff + "。'人脉就是钱脉,交情就是商机。'";
      }
    },
    {
      id: "d644_npc_storyline", phase: "street", _isChainEvent: false, icon: "📖",
      title: "每个人都有自己的故事",
      story: "你开始深入了解身边朋友的故事——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 2, excludeFlags: ["_d644StoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d644StoryCooldown) return false;
        var met = metNpcsR644(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 50) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "👂 倾听故事", hint: "好感+5,社交XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644StoryCooldown = true;
          var met = metNpcsR644(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "倾听故事"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👂 '每个人都有自己的故事。' 你认真倾听了朋友的故事。好感+5,社交XP+4。", "success");
        }},
        { text: "🤫 尊重隐私", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644StoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '尊重隐私,是交友的基本。' 你选择了尊重。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR644(st);
        return "你开始深入了解身边朋友的故事——'" + (met.length > 0 ? met[0].name : "朋友") + "的故事,让我对TA有了更深的了解。'";
      }
    },
    {
      id: "d644_career_referral", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "贵人相助",
      story: "一位朋友愿意为你的职业前途助力——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 2, excludeFlags: ["_d644ReferralCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._d644ReferralCooldown) return false;
        var met = metNpcsR644(st);
        var highAff = 0;
        for (var i = 0; i < met.length; i++) { if (met[i].affinity >= 70) highAff++; }
        return highAff >= 1;
      },
      choices: [
        { text: "🙏 接受推荐", hint: "管理XP+6,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644ReferralCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          var met = metNpcsR644(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "内推助力"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 '多亏你帮忙。' 你接受了内推,事业更进一步。管理XP+6,好感+3。", "success");
        }},
        { text: "💪 自己闯", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d644ReferralCooldown = true;
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '谢谢好意,我想自己试试。' 你选择自己闯。心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR644(st);
        return "一位朋友愿意为你的职业前途助力——'" + (met.length > 0 ? met[0].name : "朋友") + "说可以帮我递个话,在这座城市里,有人愿意帮你,是最大的幸运。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
