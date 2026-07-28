/**
 * 域B(事件/叙事) 联动增强 R700
 * 桥接：
 *   B→G  b700_story_life_stage      故事人生阶段 → 消费 state.flags._eventHistory+state.player 数据,
 *     叙事→"事件构成人生阶段"生命回响
 *   B→H  b700_story_corp_seed       故事公司种子 → 消费 state.flags._eventHistory+state.corporate 数据,
 *     叙事→"故事中的商机"公司回响
 */
// [全系统自洽修复] 域B R722b B类: story{desc}占位符tooltip泄漏->干净回退句(text()仍为主叙述)
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR700Loaded) return;
  RANDOM_EVENTS._domainBLinkageR700Loaded = true;

  var EVENTS = [
    {
      id: "b700_story_life_stage", phase: "street", _isChainEvent: false, icon: "📖",
      title: "事件构成人生阶段",
      story: "回顾这些事件,你发现它们构成了你的人生舞台。",
      triggers: { minDay: 150, interval: 250, maxRepeats: 2, excludeFlags: ["_b700StageCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b700StageCooldown) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 20;
      },
      choices: [
        { text: "📝 总结阶段", hint: "心智+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b700StageCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 '每个阶段都有独特的意义。' 心智+5,智力+3。", "success");
        }},
        { text: "🎯 规划新阶段", hint: "管理XP+5,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b700StageCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '规划下一个阶段,让人生更精彩。' 管理XP+5,心智+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "回顾这些事件,你发现它们构成了你的人生舞台——'经历了" + hist.length + "次事件,每一个事件都是人生舞台的一幕。'";
      }
    },
    {
      id: "b700_story_corp_seed", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "故事中的商机",
      story: "你的经历中藏着创业的灵感。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_b700CorpSeedDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b700CorpSeedDone) return false;
        var hist = st.flags._eventHistory || [];
        return hist.length >= 30 && !(st.corporate && st.corporate.active);
      },
      choices: [
        { text: "💡 记录创业想法", hint: "心智+5,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b700CorpSeedDone = true;
          st.flags._storyCorpSeedRecorded = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '经历是最好的创业导师。' 心智+5,管理XP+4。", "success");
        }},
        { text: "🤝 找人合伙", hint: "社交XP+6,现金+1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b700CorpSeedDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1000;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '好的合伙人是成功的一半。' 社交XP+6,现金+¥1000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var hist = st.flags._eventHistory || [];
        return "你的经历中藏着创业的灵感——'经历了" + hist.length + "次事件,每一次经历都可能成为创业的种子。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
