/**
 * 域D联动增强：NPC衰老告别 + 社交支持缓冲
 * [全系统自洽修复] 域D R175: NPC生命周期数据首次被事件消费
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== 事件1: 老周退休 =====
  var npc_zhou_retirement = {
    id: "npc_zhou_retirement",
    title: "\u8001\u5468\u56de\u4e61\u4e86",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags || !st.relationships || !st.player) return false;
      if (st.flags._npcAgingDone) return false;
      if (!st.relationships.old_zhou || !st.relationships.old_zhou.met) return false;
      return (st.player.day || 0) >= 500;
    },
    probability: 0.35,
    getStory: function (st) {
      return "几天没在废品站看到老周那两辆生锈的三轮车了。\n\n后来听王婶说，老周的腿实在撑不住了。七十多岁的人了，干了大半辈子体力活，身体终于告假了。\n\n他儿子从县里来接他回家。临走前，他塞了一把旧钥匙给你：「你年轻，用得上。」";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._npcAgingDone = true;
      if (choiceId === "take_tricycle") {
        st.flags._oldZhouTricycle = true;
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        StateManager.addMessage("\u4f60\u6536\u4e0b\u4e86\u8001\u5468\u7684\u4e09\u8f6e\u8f66\u3002\u867d\u7136\u65e7\u70b9\uff0c\u4f46\u6bd4\u81ea\u5df1\u4e70\u5f3a\u3002\u5fc3\u60c5+8\u3002", "success");
      } else if (choiceId === "scrap") {
        st.resources.cash = (st.resources.cash || 0) + 200;
        st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
        StateManager.addMessage("\u4f60\u628a\u4e09\u8f6e\u8f66\u5356\u4e86\u5e9f\u94c1\u3002\u8001\u5468\u5728\u7535\u8bdd\u91cc\u9ec4\u7740\uff1a\u300c\u4e5f\u662f\uff0c\u65e7\u8f66\u6362\u94b1\u6bd4\u653e\u5728\u5bb6\u91cc\u5f3a\u3002\u300d\u4f60\u5fc3\u91cc\u6709\u70b9\u4e0d\u662f\u54b2\u54b2\u3002", "warning");
      }
    },
    choices: [
      { text: "\u6536\u4e0b\u4e09\u8f6e\u8f66\uff0c\u7ee7\u7eed\u6536\u5e9f\u54c1", id: "take_tricycle" },
      { text: "\u5356\u4e86\u5356\u94c1\u6362\u94b1", id: "scrap" },
    ],
    icons: ["\u8f66", "\u4e61\u6751"],
  };

  // ===== 事件2: \u738b\u5988\u642c\u8d70 =====
  var npc_aunt_wang_moving = {
    id: "npc_aunt_wang_moving",
    title: "\u738b\u5988\u8981\u642c\u8d70\u4e86",
    phase: "street",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags || !st.relationships || !st.player) return false;
      if (st.flags._npcAgingDone) return false;
      if (!st.relationships.aunt_wang || !st.relationships.aunt_wang.met) return false;
      if ((st.relationships.aunt_wang.affinity || 0) < 10) return false;
      return (st.player.day || 0) >= 600;
    },
    probability: 0.25,
    getStory: function (st) {
      return "\u6709\u4e00\u5929\u4f60\u5728\u57ce\u4e2d\u6751\u697c\u9053\u91cc\u53d1\u73b0\u738b\u5988\u5bb6\u95e8\u53e3\u5806\u6ee1\u4e86\u7eb8\u7bb1\u3002\n\n\u5979\u8bf4\uff1a\u300c\u6211\u513f\u5b50\u4ece\u8001\u5bb6\u6765\u4e86\uff0c\u63a5\u6211\u53bb\u57ce\u91cc\u4f4f\u3002\u8fd9\u623f\u5b50\u8001\u4e86\uff0c\u5899\u90fd\u88c2\u4e86\u3002\u300d\n\n\u5979\u7ed9\u4f60\u7559\u4e86\u4e00\u628a\u94a5\u5319\uff1a\u300c\u4ee5\u540e\u6765\u5750\u5750\u3002\u300d";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._npcAgingDone = true;
      if (choiceId === "help_move") {
        st.flags._auntWangRecipe = true;
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        if (st.relationships.aunt_wang) {
          st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 10);
        }
        StateManager.addMessage("\u4f60\u5e2e\u738b\u5988\u6536\u627e\u4e86\u534a\u5929\u3002\u4e34\u4e0a\u8f66\u524d\uff0c\u5979\u585e\u7ed9\u4f60\u4e00\u4e2a\u94c1\u76d2\uff1a\u300c\u8fd9\u662f\u6211\u5a18\u5a18\u4f20\u4e0b\u6765\u7684\u8150\u83dc\u65b9\u5b50\u3002\u300d", "success");
      } else if (choiceId === "call_bye") {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
        if (st.relationships.aunt_wang) {
          st.relationships.aunt_wang.affinity = Math.min(100, (st.relationships.aunt_wang.affinity || 0) + 3);
        }
        StateManager.addMessage("\u4f60\u6253\u4e86\u4e2a\u7535\u8bdd\u9053\u522b\u3002\u5979\u5728\u90a3\u5934\u7b11\uff1a\u300c\u4f60\u8fd9\u5b69\u5b50\u5fc3\u597d\u3002\u300d", "info");
      } else {
        st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
        StateManager.addMessage("\u4f60\u6ca1\u5728\u610f\u3002\u65b0\u623f\u4e1c\u4e0a\u6765\u628a\u623f\u79df\u6da8\u4e86\u4e00\u622a\u3002", "warning");
      }
    },
    choices: [
      { text: "\u5e2e\u5979\u6536\u627e\u4e1c\u897f", id: "help_move" },
      { text: "\u6253\u4e2a\u7535\u8bdd\u9053\u522b", id: "call_bye" },
      { text: "\u968f\u4ed6\u53bb", id: "let_go" },
    ],
    icons: ["\u623f", "\u884c\u674e"],
  };

  // ===== 事件3: \u9648\u5e08\u50a8\u6536\u626e =====
  var npc_chef_chen_retiring = {
    id: "npc_chef_chen_retiring",
    title: "\u9648\u5e08\u50a8\u6700\u540e\u4e00\u6b21\u51fa\u626e",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags || !st.relationships || !st.player) return false;
      if (st.flags._npcAgingDone) return false;
      if (!st.relationships.chef_chen || !st.relationships.chef_chen.met) return false;
      if ((st.relationships.chef_chen.affinity || 0) < 20) return false;
      return (st.player.day || 0) >= 700;
    },
    probability: 0.2,
    getStory: function (st) {
      return "\u5546\u4e1a\u533a\u7684\u591c\u5e02\u65c1\uff0c\u9648\u5e08\u50a8\u7684\u708a\u53f0\u6bd4\u5f80\u5e38\u51dd\u4e86\u5f88\u591a\u4eba\u3002\n\n\u300c\u4eca\u5929\u6536\u626e\u4e86\u3002\u300d\u4ed6\u8bed\u6c14\u5e73\u9759\u3002\n\n\u300c\u516d\u5341\u591a\u4e86\uff0c\u624b\u6296\u4e86\uff0c\u706b\u5927\u4e86\u770b\u4e0d\u4f4f\u3002\u300d\u4ed6\u628a\u4e00\u6761\u67af\u9ec4\u7684\u56f4\u5dfe\u9012\u7ed9\u4f60\uff1a\u300c\u8fd9\u4e2a\uff0c\u9001\u7ed9\u4f60\u3002\u300d";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._npcAgingDone = true;
      if (choiceId === "learn_recipe") {
        st.flags._chefChenRecipe = true;
        if (st.skills && st.skills.cooking) {
          st.skills.cooking.xp = Math.min(1000, (st.skills.cooking.xp || 0) + 100);
        }
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
        if (st.relationships.chef_chen) {
          st.relationships.chef_chen.affinity = Math.min(100, (st.relationships.chef_chen.affinity || 0) + 10);
        }
        StateManager.addMessage("\u9648\u5e08\u50a8\u6559\u4e86\u4f60\u6700\u540e\u4e00\u9053\u83dc\u2014\u2014\u5c0f\u7092\u9ec4\u725b\u8089\u3002\u706b\u5019\u3001\u5200\u5de5\u3001\u8c03\u6599\u7684\u6bd4\u4f8b\u3002\u70f9\u996aXP+100\u3002", "success");
      } else if (choiceId === "buy_meal") {
        var cost = 100;
        if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        StateManager.addMessage("\u4f60\u8bf7\u9648\u5e08\u5403\u4e86\u996d\u3002\u4ed6\u559d\u4e86\u534a\u676f\u767d\u9152\uff0c\u8bb2\u4e86\u8bb2\u4ed6\u5e74\u8f7b\u65f6\u7684\u6545\u4e8b\u3002", "info");
      } else {
        StateManager.addMessage("\u4f60\u8bf4\u4e86\u4e00\u53e5\u300c\u9648\u5e08\u50a8\u518d\u89c1\u3002\u300d\u4ed6\u70b9\u70b9\u5934\u7b11\u4e86\u7b11\u3002", "info");
      }
    },
    choices: [
      { text: "\u60f3\u5b66\u6700\u540e\u4e00\u9053\u83dc", id: "learn_recipe" },
      { text: "\u8bf7\u4ed6\u5403\u996d\u9053\u522b", id: "buy_meal" },
      { text: "\u5c31\u8bf4\u58f0\u518d\u89c1", id: "just_bye" },
    ],
    icons: ["\u7089", "\u56f4\u5dfe"],
  };

  // ===== 事件4: \u793e\u4f1a\u652f\u6301\u7f13\u51b2 =====
  var social_support_intervention = {
    id: "social_support_intervention",
    title: "\u6709\u4eba\u5728\u8eab\u8fb9",
    phase: "street",
    repeatable: false,
    priority: 70,
    conditions: function (st) {
      if (!st || !st.player || !st.needs || !st.relationships) return false;
      if (st.flags._socialSupportTriggered) return false;
      if ((st.needs.happiness || 50) >= 25) return false;
      var anyClose = false;
      for (var _id in st.relationships) {
        var _r = st.relationships[_id];
        if (_r && _r.met && (_r.affinity || 0) >= 30) { anyClose = true; break; }
      }
      return anyClose && (st.player.day || 0) >= 50;
    },
    probability: 0.15,
    getStory: function (st) {
      return "\u4f60\u5fc3\u60c5\u5f88\u5dee\u7684\u4e00\u5929\uff0c\u8d70\u5728\u8857\u4e0a\u89c9\u5f97\u4ec0\u4e48\u90fd\u63d0\u4e0d\u8d77\u52b2\u3002\n\n\u624b\u673a\u9707\u4e86\u4e00\u4e0b\u2014\u2014\u662f\u3010\u67d0\u4e2a\u670b\u53cb\u3011\u7684\u6d88\u606f\uff1a\u300c\u51fa\u6765\u8d70\u8d70\uff1f\u6211\u8bf7\u4f60\u559d\u5976\u8336\u3002\u300d\n\n\u4f60\u4e0d\u60f3\u52a8\u3002\u4f46\u4f60\u8fd8\u662f\u53bb\u4e86\u3002\n\n\u5750\u5728\u5976\u8336\u5e97\u91cc\uff0c\u804a\u4e86\u4e00\u4f1a\u513f\u3002\u7136\u800c\u5947\u602a\u7684\u662f\uff0c\u4f60\u4e0d\u518d\u90a3\u4e48\u96be\u53d7\u4e86\u3002";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._socialSupportTriggered = true;
      st.flags._hasSocialSupport = true;
      var moodGain = 0;
      if (choiceId === "go_out") {
        moodGain = 12;
        st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3);
        StateManager.addMessage("\u670b\u53cb\u62c9\u7740\u4f60\u51fa\u53bb\u4e86\u3002\u4e00\u676f\u5976\u8336\u3001\u4e00\u9635\u98ce\u3001\u4e00\u6bb5\u4e0d\u7b97\u6df1\u7684\u804a\u5929\u3002\u4f46\u90a3\u4e9b\u538b\u7740\u4f60\u7684\u4e1c\u897f\u8f7b\u4e86\u4e00\u70b9\u3002\u5fc3\u60c5+" + moodGain + "\u3002", "info");
      } else if (choiceId === "chat_online") {
        moodGain = 6;
        StateManager.addMessage("\u5728\u624b\u673a\u4e0a\u804a\u4e86\u4e00\u4f1a\u513f\u3002\u6587\u5b57\u6bd4\u8bed\u97f3\u8f7b\u677e\uff0c\u4e0d\u7528\u9762\u5bf9\u9762\u8bf4\u90a3\u4e9b\u6c89\u91cd\u7684\u8bdd\u3002\u5fc3\u60c5+" + moodGain + "\u3002", "info");
      } else {
        st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
        StateManager.addMessage("\u4f60\u62d2\u7edd\u4e86\u9080\u8bf7\uff0c\u628a\u81ea\u5df1\u5173\u5728\u623f\u95f4\u91cc\u3002\u660e\u5929\u4f1a\u597d\u4e00\u70b9\u3002\u5fc3\u60c5-5\u3002", "warning");
      }
      st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + moodGain);
    },
    choices: [
      { text: "\u51fa\u53bb\u8d70\u8d70", id: "go_out" },
      { text: "\u5728\u7ebf\u804a\u51e0\u53e5", id: "chat_online" },
      { text: "\u4e0d\u53bb\uff0c\u60f3\u4e00\u4e2a\u4eba\u5f85\u7740", id: "alone" },
    ],
    icons: ["\u5976\u8336", "\u670b\u53cb"],
  };

  // ===== IIFE\u6ce8\u5165 =====
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(npc_zhou_retirement, npc_aunt_wang_moving, npc_chef_chen_retiring, social_support_intervention);
  }
})();
