/**
 * 域A(数据/数值平衡) 联动增强 R525
 * 桥接：
 *   A→B  a525_economic_news_digest 经济新闻摘要 → 消费 goods 数据,
 *     新闻→"一周经济要闻"的叙事摘要
 *   A→D  a525_npc_trade_secret   NPC交易秘诀 → 消费 goods 数据,
 *     经验→"老手教你怎么买卖"的交易智慧
 *   A→C  a525_skill_certification 技能认证 → 消费 skills 数据,
 *     证书→"有证书的技能更值钱"的认证价值
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR525Loaded) return;
  RANDOM_EVENTS._domainALinkageR525Loaded = true;

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
      id: "a525_economic_news_digest", phase: "street", _isChainEvent: false, icon: "📰",
      title: "经济要闻",
      story: "你看了看本周的经济要闻——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_a525NewsDigestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a525NewsDigestCooldown);
      },
      choices: [
        { text: "📰 仔细阅读", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525NewsDigestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 '本周经济要闻：央行宣布降息，XX公司发布新品...' 会计XP+3,心智+2。", "success");
        }},
        { text: "📱 分享给朋友", hint: "心智+1,好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525NewsDigestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "分享经济新闻");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你分享了新闻给朋友——'这条新闻对我们行业有影响。' 心智+1,好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看了看本周的经济要闻——'这周发生了不少事啊。' 了解经济动态，是每个城市人的必修课。";
      }
    },
    {
      id: "a525_npc_trade_secret", phase: "street", _isChainEvent: false, icon: "🤫",
      title: "交易秘诀",
      story: "一个老手跟你分享了交易秘诀——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_a525TradeSecretCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a525TradeSecretCooldown);
      },
      choices: [
        { text: "🤫 认真学习", hint: "贸易XP+5,心智+2,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525TradeSecretCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("trade", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "传授交易秘诀");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '低买高卖谁都会说，但真正的秘诀是...' 贸易XP+5,心智+2,好感+2。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525TradeSecretCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 你默默记下了秘诀——'这些经验，是花钱都买不到的。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个老手跟你分享了交易秘诀——'看好了，我只说一次。' 你竖起耳朵，生怕漏掉一个字。";
      }
    },
    {
      id: "a525_skill_certification", phase: "corporate", _isChainEvent: false, icon: "📜",
      title: "证书的价值",
      story: "你发现有证书的技能在市场上更受欢迎——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_a525CertificationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a525CertificationCooldown);
      },
      choices: [
        { text: "📜 考个证书", hint: "管理XP+5,心智+2,花费2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525CertificationCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (st.resources && st.resources.cash >= 2000) { st.resources.cash -= 2000; }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '考个证书，给自己的技能一个官方认证。' 管理XP+5,心智+2,花费¥2000。", "success");
        }},
        { text: "📈 用作品说话", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a525CertificationCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📜 '证书不如作品有说服力。' 你决定用实际成果证明自己。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现有证书的技能在市场上更受欢迎——'同样的技能，有证书的薪资高30%。' 证书真的那么重要吗？";
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