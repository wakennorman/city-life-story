/**
 * 域F(UI/UX) 联动增强 R263
 * UI不仅是界面，还在叙事/社交/经济层面留下痕迹。
 * 桥接：
 *   F→G  ui_life_rhythm          UI打卡→生活习惯化→心情/健康恢复（核心机制·仪式感）
 *   F→D  ui_social_presence      社交形象打理→NPC好感（社交·形象资本）
 *   F→E  ui_finance_clarity      财务面板清晰→投资意识（经济·数据可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR263Loaded) return;
  RANDOM_EVENTS._domainFLinkageR263Loaded = true;

  var EVENTS = [
    {
      id: "ui_life_rhythm",
      phase: "street",
      _isChainEvent: false,
      icon: "🌅",
      title: "生活的节奏",
      story: "你开始习惯在手机上记录每天的生活——吃了什么、花了多少钱、心情怎么样。\n\n这些看似琐碎的数据，慢慢变成了你生活的节奏。你开始知道什么时候该休息、什么时候该冲刺、什么时候该停下来看看自己走了多远。\n\nUI不只是界面，它是你与自己的对话。",
      triggers: { minDay: 60, excludeFlags: ["_uiLifeRhythmSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var total = 0;
        for (var k in st.stats.actionFreq) total += st.stats.actionFreq[k] || 0;
        return total >= 30;
      },
      choices: [
        {
          text: "🌅 继续保持这个节奏",
          hint: "心情+8，健康+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeRhythmSeen = true;
            st.flags._lifeRhythmKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌅 你保持了这个生活的节奏。好习惯是复利。心情+8，健康+3。", "success");
            }
          },
        },
        {
          text: "🤷 记录太累，随心就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeRhythmSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随心就好，不用那么结构化。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // [全系统自洽修复] id 改 f263_ui_social_presence：原 id 与 ui_linkage_events.js
      // 的 ui_social_presence 事件重复（重复事件 ID 检查失败），按 R263 轮次前缀区分。
      id: "f263_ui_social_presence",
      phase: "street",
      _isChainEvent: false,
      icon: "👔",
      title: "社交形象",
      story: "你开始注意自己在别人眼中的形象——不是虚荣，而是尊重。\n\n一件干净的衣服、一个得体的发型、一句恰到好处的问候。这些细节，别人可能不会说，但都记在心里。\n\n你发现，打理形象不是为了取悦别人，而是为了让自己在这个世界里更自在。",
      triggers: { minDay: 90, excludeFlags: ["_uiSocialPresenceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        }
        return metNpcs >= 2;
      },
      choices: [
        {
          text: "👔 打理一下自己的形象",
          hint: "已结识NPC好感+2，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialPresenceSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  applyAffinityChange(st, id, 2, "形象打理");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👔 你打理了一下自己的形象。别人可能不会说，但都记在心里。好感+2，心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 自然就好，不刻意打扮",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiSocialPresenceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得自然就好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "ui_finance_clarity",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财务清晰",
      story: "你第一次把所有的收支、资产、负债整理成一张清晰的表格。\n\n看着这些数字，你突然看清了自己的财务状况——哪里在赚钱、哪里在烧钱、哪里可以优化。\n\n「财务自由」不是有很多钱，而是对自己的钱有掌控感。",
      triggers: { minDay: 120, excludeFlags: ["_uiFinanceClaritySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 3000;
      },
      choices: [
        {
          text: "💰 制定一个理财计划",
          hint: "心智+6，置投资意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceClaritySeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你制定了第一个理财计划。掌控感比金额更重要。心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 知道大概就够了",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiFinanceClaritySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得知道大概就够了。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
