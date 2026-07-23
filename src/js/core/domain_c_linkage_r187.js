/*
 * 城市浮生记 — 域C（职业/成长）联动增强 · R187
 * 全系统优化 loop R187 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR187) return;
  RANDOM_EVENTS._domainCLinkageR187 = true;

  // ---- 本地助手 ----

  function corpRankR187(st) {
    if (!st || !st.player || !st.player.corporate) return "P5";
    return st.player.corporate.rank || "P5";
  }

  function rankTierR187(rank) {
    if (!rank) return "junior";
    var m = rank.match(/P(\d+)/);
    if (!m) return "junior";
    var n = parseInt(m[1], 10);
    if (n >= 9) return "leader";
    if (n >= 7) return "senior";
    return "junior";
  }

  function getMetNpcsR187(st, minAff) {
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= (minAff || 0)) out.push(id);
    }
    return out;
  }

  function npcNameR187(id) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(id);
    return id;
  }

  function affinityR187(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C R187联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  function msgR187(text, kind) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage)
      StateManager.addMessage(text, kind || "info");
  }

  var C_EVENTS = [

    // ===== 联动1: C→G 职场倦怠→心理健康危机 =====
    // 设计意图：当玩家长期处于职场高压（低心智+已入职足够久），触发倦怠危机事件，
    //   让职业成长与生命周期/健康系统产生联动，体现"工作消耗人"的现实压力。
    {
      id: "career_burnout_crisis",
      title: "职场倦怠",
      desc: "连续多日的高压工作让你身心俱疲。每天醒来想到又要面对那些KPI和会议，你就感到一阵深深的倦怠。\n\n你开始怀疑：这样拼下去，到底值不值得？",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.flags || !st.player || !st.player.corporate) return false;
        if (st.flags._careerBurnoutCrisisDone) return false;
        // 心智 < 35（心理健康告急）
        var mental = st.player.mental || 50;
        if (mental >= 35) return false;
        // 已入职 ≥ 60 天
        var joinedDay = st.player.corporate.joinedDay || 0;
        var daysEmployed = st.player.day - joinedDay;
        if (daysEmployed < 60) return false;
        return true;
      },
      choices: [
        {
          text: "🛀 请个长假，好好休息调整",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._careerBurnoutCrisisDone = true;
            st.flags._burnoutRestDays = 7;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 30) + 25);
            }
            if (st.status) {
              st.status.health = Math.min(100, (st.status.health || 60) + 10);
            }
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.max(0, (st.player.corporate.kpi || 50) - 15);
            }
            msgR187(
              "🛀 你请了一周长假。远离工作后，心智+25、健康+10。但KPI-15（休息是有代价的）。",
              "warning"
            );
          },
        },
        {
          text: "💪 咬咬牙继续扛",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._careerBurnoutCrisisDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 30) + 5);
            }
            if (st.status) {
              st.status.health = Math.max(0, (st.status.health || 60) - 8);
            }
            msgR187(
              "💪 你选择硬扛。心智+5（意志力），但健康-8。保重身体……",
              "warning"
            );
          },
        },
      ],
    },

    // ===== 联动2: C→D 职业声望→NPC社交反应 =====
    // 设计意图：当玩家晋升到高级职级（P7+），已结识NPC会表达敬佩/羡慕，
    //   让职业成长产生社交反馈，体现"出人头地"的社会认可。
    {
      id: "career_prestige_npc_reaction",
      title: "出人头地",
      desc: "你晋升的消息渐渐传开。曾经熟悉的街坊邻居、老同学开始用不一样的眼光看你——那个曾经也在街头谋生的人，如今已是职场里的体面人了。",
      phase: "corporate",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.flags || !st.player || !st.player.corporate) return false;
        if (st.flags._careerPrestigeReactionDone) return false;
        var tier = rankTierR187(corpRankR187(st));
        if (tier === "junior") return false;
        if (getMetNpcsR187(st, 0).length < 2) return false;
        return true;
      },
      choices: [
        {
          text: "😊 谦虚地说「运气好而已」",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._careerPrestigeReactionDone = true;
            var met = getMetNpcsR187(st, 0);
            for (var i = 0; i < met.length; i++) {
              affinityR187(st, met[i], 2, "谦虚回应职业成就");
            }
            if (st.player) {
              st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            }
            msgR187(
              "😊 你的谦虚让所有人好感+2。道德+3。「运气好而已」——但大家都懂背后的付出。",
              "success"
            );
          },
        },
        {
          text: "🎉 请大家吃饭庆祝",
          apply: function (st) {
            if (!st || !st.flags || !st.resources) return;
            st.flags._careerPrestigeReactionDone = true;
            var cost = 2000;
            if ((st.resources.cash || 0) >= cost) {
              st.resources.cash = (st.resources.cash || 0) - cost;
            }
            var met = getMetNpcsR187(st, 0);
            for (var i = 0; i < met.length; i++) {
              affinityR187(st, met[i], 4, "请客庆祝晋升");
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            msgR187(
              "🎉 你请了一桌好饭。所有NPC好感+4，心情+5。花费¥" + cost + "。值得！",
              "success"
            );
          },
        },
      ],
    },

    // ===== 联动3: C→B 技能顿悟→职业叙事 =====
    // 设计意图：当玩家两个技能同时达到高级（≥60），触发"融会贯通"叙事事件，
    //   让玩家感受到技能组合的力量，同时获得少量双技能XP奖励。
    {
      id: "skill_synergy_enlightenment",
      title: "融会贯通",
      desc: "你在实践中忽然发现，多年积累的不同技能开始产生奇妙的化学反应——会计的严谨让你在投资中避开了陷阱，销售的口才帮你在谈判中争取到更好的条件。\n\n这一刻，你真正体会到了「1+1>2」的含义。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.flags || !st.skills) return false;
        if (st.flags._skillSynergyEnlightenmentDone) return false;
        var highSkills = [];
        for (var sid in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, sid)) continue;
          var sk = st.skills[sid];
          if (sk && typeof sk === "object" && (sk.level || 0) >= 60) {
            highSkills.push(sid);
          }
        }
        if (highSkills.length < 2) return false;
        return true;
      },
      choices: [
        {
          text: "🧠 总结规律，形成方法论",
          apply: function (st) {
            if (!st || !st.flags || !st.skills) return;
            st.flags._skillSynergyEnlightenmentDone = true;
            for (var sid in st.skills) {
              if (!Object.prototype.hasOwnProperty.call(st.skills, sid)) continue;
              var sk = st.skills[sid];
              if (sk && typeof sk === "object" && (sk.level || 0) >= 60) {
                var bonus = 30;
                if (typeof addSkillXp === "function") {
                  addSkillXp(sid, bonus);
                } else {
                  sk.xp = (sk.xp || 0) + bonus;
                }
              }
            }
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            msgR187(
              "🧠 你总结出了一套方法论！所有高级技能XP+30，智力+3。融会贯通的力量。",
              "success"
            );
          },
        },
        {
          text: "🔥 趁热打铁，继续深耕",
          apply: function (st) {
            if (!st || !st.flags || !st.skills) return;
            st.flags._skillSynergyEnlightenmentDone = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            }
            msgR187("🔥 你选择继续实践。智力+5。知识在应用中升华。", "info");
          },
        },
      ],
    },

  ];

  // 注册到 RANDOM_EVENTS
  for (var i = 0; i < C_EVENTS.length; i++) {
    RANDOM_EVENTS.push(C_EVENTS[i]);
  }
})();
