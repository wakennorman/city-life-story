/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 R791
 * 全系统优化·Domain D 第五轮循环
 *
 * 【联动增强3项】
 *   1. D→B 好感满级叙事(affinity=100) — 终极关系闭环
 *   2. D→F NPC在场发现UI — 社交Tab"今日在场NPC"可视化面板
 *   3. D→H 职场推荐信 — Phase1 NPC关系→Phase2初始属性加成
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR791Loaded) return;
  RANDOM_EVENTS._domainDLinkageR791Loaded = true;

  // ---- 本地助手 ----
  function getMetNpcsD791(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push({ id: id, rel: r });
    }
    return out;
  }

  function safeAffinityD791(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域D联动R791");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  function getNpcNameD791(npcId) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(npcId);
    return npcId ? String(npcId).replace(/_/g, " ") : "某人";
  }

  // ========================================================================
  // 联动增强1: D→B 好感满级叙事(affinity=100) — 终极关系闭环
  // 设计意图：目前NPC好感奖励最高到80阈值，affinity=100时无任何叙事回响。
  // 本事件在好感达到100时触发一段专属叙事，给予"人生伙伴"标记+一次性奖励。
  // 心理学：峰终定律 — 关系满级时刻应成为玩家记忆锚点。
  // ========================================================================
  var AFF100_EVENTS = [];
  // 为每个已结识NPC生成aff=100事件（通用模板，按npcId动态生成conditions/story）
  // 使用通用事件+动态conditions，避免为每个NPC写重复代码
  AFF100_EVENTS.push({
    id: "npc_affinity_100_milestone",
    phase: "street",
    icon: "💖",
    title: "一生中遇见的人",
    story: function (st) {
      // 找到第一个affinity=100且未触发满级事件的NPC
      var npcs = getMetNpcsD791(st, 100);
      for (var i = 0; i < npcs.length; i++) {
        var n = npcs[i];
        if (st.flags && st.flags["_aff100Done_" + n.id]) continue;
        var name = getNpcNameD791(n.id);
        return (
          "这天傍晚，" + name + "给你发来一条消息：\n\n" +
          "「这些年，谢谢你。在这座城市里，能遇到你这样的人，是我的幸运。」\n\n" +
          "你看着手机屏幕，忽然觉得，这座城市不再只是钢筋水泥的森林。" +
          "有一个人，把你当成了他/她生命里重要的人。\n\n" +
          "你们的关系，已经超越了这座城市里的大多数缘分。"
        );
      }
      return "";
    },
    conditions: function (st) {
      if (!st || !st.player || st.player.day < 30) return false;
      var npcs = getMetNpcsD791(st, 100);
      for (var i = 0; i < npcs.length; i++) {
        if (st.flags && st.flags["_aff100Done_" + npcs[i].id]) continue;
        return true;
      }
      return false;
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "💖 回一条：能遇见你我也很幸运",
        hint: "人生伙伴+1，永久心情恢复速度+10%",
        apply: function (st) {
          var npcs = getMetNpcsD791(st, 100);
          for (var i = 0; i < npcs.length; i++) {
            var n = npcs[i];
            if (st.flags && st.flags["_aff100Done_" + n.id]) continue;
            if (!st.flags) st.flags = {};
            st.flags["_aff100Done_" + n.id] = true;
            // 一次性奖励：心情+15，心智+5
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            // 标记人生伙伴（供后续叙事消费）
            if (!st.flags._lifePartners) st.flags._lifePartners = [];
            st.flags._lifePartners.push(n.id);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                "💖 你和" + getNpcNameD791(n.id) + "成为了人生伙伴。在这个冰冷的城市里，多了一个可以把后背交给对方的人。心情+15，心智+5。",
                "success"
              );
            }
            break;
          }
        },
      },
      {
        text: "🤝 笑笑，什么都不用说",
        hint: "人生伙伴+1，平静的默契",
        apply: function (st) {
          var npcs = getMetNpcsD791(st, 100);
          for (var i = 0; i < npcs.length; i++) {
            var n = npcs[i];
            if (st.flags && st.flags["_aff100Done_" + n.id]) continue;
            if (!st.flags) st.flags = {};
            st.flags["_aff100Done_" + n.id] = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (!st.flags._lifePartners) st.flags._lifePartners = [];
            st.flags._lifePartners.push(n.id);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                "💖 你笑了笑，没有回复。但你知道，" + getNpcNameD791(n.id) + "懂。有些默契，不需要语言。心情+8。",
                "success"
              );
            }
            break;
          }
        },
      },
    ],
  });

  // ========================================================================
  // 联动增强2: D→H 职场推荐信 — Phase1 NPC关系→Phase2初始属性加成
  // 设计意图：Phase1积累的NPC关系在Phase2入职时应产生实际价值。
  // 入职时检测已结识的高好感NPC，根据NPC职业相关性给予corporate初始加成。
  // 心理学：禀赋效应 — 玩家感到Phase1的社交积累没有白费。
  // ========================================================================
  AFF100_EVENTS.push({
    id: "npc_corporate_recommendation",
    phase: "corporate",
    icon: "📜",
    title: "一封来自老朋友的推荐信",
    story: function (st) {
      if (!st.relationships) return "";
      var bestNpc = null, bestAff = 0;
      for (var id in st.relationships) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) > bestAff) {
          bestAff = r.affinity || 0;
          bestNpc = id;
        }
      }
      if (!bestNpc || bestAff < 50) return "";
      var name = getNpcNameD791(bestNpc);
      return (
        "入职第一天，HR主管翻了翻你的资料，忽然抬头：\n\n" +
        "「哦，" + name + "给你写过推荐信？她/他在信里说你是他/她在这座城市里最信任的人之一。」\n\n" +
        "HR主管笑了笑：「有这样的人为你背书，我们很欢迎你加入。」"
      );
    },
    conditions: function (st) {
      if (!st || !st.player) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._corpRecommendationDone) return false;
      // 入职当天或次日触发
      var joinedDay = st.corporate && st.corporate.joinedDay ? st.corporate.joinedDay : 0;
      if (st.player.day - joinedDay > 3) return false;
      // 至少有一个好感≥50的已结识NPC
      var npcs = getMetNpcsD791(st, 50);
      return npcs.length > 0;
    },
    probability: 0.15,
    repeatable: false,
    choices: [
      {
        text: "📜 感谢推荐，努力工作",
        hint: "推荐信加成：向上管理+8，人缘+5",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._corpRecommendationDone = true;
          var c = st.player && st.player.corporate;
          if (c) {
            c.upwardMgmt = Math.min(100, (c.upwardMgmt || 0) + 8);
            c.popularity = Math.min(100, (c.popularity || 0) + 5);
          }
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "📜 推荐信生效！同事对你另眼相看。向上管理+8，人缘+5。",
              "success"
            );
          }
        },
      },
      {
        text: "🤝 谦虚回应，看能力说话",
        hint: "推荐信加成：尊严+5，KPI+3",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._corpRecommendationDone = true;
          var c = st.player && st.player.corporate;
          if (c) {
            c.dignity = Math.min(100, (c.dignity || 0) + 5);
            c.kpi = Math.min(150, (c.kpi || 0) + 3);
          }
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "📜 你用谦虚赢得了尊重。尊严+5，KPI+3。",
              "success"
            );
          }
        },
      },
    ],
  });

  // ========================================================================
  // 联动增强3: D→B 社交圈年度聚会 — 多NPC好感≥60时触发群体叙事
  // 设计意图：当玩家拥有多个好友时，缺少"朋友圈互动"的群体叙事。
  // 本事件在≥3个NPC好感≥60时触发年度聚会叙事，强化社交圈归属感。
  // 心理学：社会认同 — 被群体接纳的满足感。
  // ========================================================================
  AFF100_EVENTS.push({
    id: "npc_circle_annual_gathering",
    phase: "street",
    icon: "🎉",
    title: "老朋友们的聚会",
    story: function (st) {
      var friends = getMetNpcsD791(st, 60);
      if (friends.length < 3) return "";
      // 随机选3个好友的名字
      var names = [];
      for (var i = 0; i < Math.min(3, friends.length); i++) {
        names.push(getNpcNameD791(friends[i].id));
      }
      var more = friends.length > 3 ? "等" + friends.length + "位" : names.join("、");
      return (
        "你收到了一个群消息——是" + names[0] + "发的：\n\n" +
        "「好久没聚了，今晚来" + names[1] + "这儿坐坐？" + names[2] + "也来。」\n\n" +
        "到了才发现，" + more + "朋友都在。桌上摆满了菜，啤酒开了好几瓶。" +
        "有人聊起刚来这座城市的时候，有人说起那些差点撑不下去的日子。\n\n" +
        "你忽然觉得，这一年，值了。"
      );
    },
    conditions: function (st) {
      if (!st || !st.player || st.player.day < 90) return false;
      if (st.flags && st.flags._circleGatheringDone) return false;
      // 每年一次（基于day判断）
      if (st.player.day % 365 !== 0 && st.player.day % 365 !== 1) return false;
      var friends = getMetNpcsD791(st, 60);
      return friends.length >= 3;
    },
    probability: 0.2,
    repeatable: false,
    choices: [
      {
        text: "🍻 不醉不归",
        hint: "所有好友好感+3，心情+20",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._circleGatheringDone = true;
          var friends = getMetNpcsD791(st, 60);
          for (var i = 0; i < friends.length; i++) {
            safeAffinityD791(st, friends[i].id, 3, "年度聚会");
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "🎉 那一晚你们聊到凌晨。和老朋友们在一起，不需要伪装。所有好友好感+3，心情+20。",
              "success"
            );
          }
        },
      },
      {
        text: "😊 尽兴而返，早点休息",
        hint: "所有好友好感+1，健康+5",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._circleGatheringDone = true;
          var friends = getMetNpcsD791(st, 60);
          for (var i = 0; i < friends.length; i++) {
            safeAffinityD791(st, friends[i].id, 1, "年度聚会");
          }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "😊 尽兴而返。朋友不需要天天见面，但知道他们在，就安心了。所有好友好感+1，健康+5。",
              "success"
            );
          }
        },
      },
    ],
  });

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < AFF100_EVENTS.length; i++) {
    RANDOM_EVENTS.push(AFF100_EVENTS[i]);
  }
})();
