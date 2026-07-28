/**
 * 域H(Phase2/公司) 联动增强 R712b
 * 富矿激活：P1-6/P1-7 大系统字段事件层零引用 → 首消费
 *   H→D  h712b_board_pressure_talk   boardPressureLevel(0-4) 事件层首消费 → 董事会高压下的倾诉/硬扛，联动已见面NPC好感
 *   H→B  h712b_media_spotlight       mediaRelations+sentimentScore 事件层首消费 → 媒体专访叙事，声望与情绪分联动
 *   H→G  h712b_crisis_night          crisisLevel(0-4) 事件层首消费 + _h698Fitness 死flag首读 → 危机深夜的健康分岔
 * 设计：峰终定律(危机夜是记忆峰值)+损失厌恶(压力具象化)。全||防御，rel&&rel.met铁律，done-flag防重。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR712bLoaded) return;
  RANDOM_EVENTS._domainHLinkageR712bLoaded = true;

  function co(st) {
    if (!st || !st.startup || !st.startup.active) return null;
    return st.startup.company || null;
  }

  // firstMetNpc 铁律遍历：只返回已见面NPC
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  function npcName(st, id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(st, id) || "老朋友"; } catch (e) {}
    }
    return "老朋友";
  }

  var EVENTS = [
    {
      id: "h712b_board_pressure_talk",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🪑",
      title: "董事会的阴影",
      story: "压力等级亮起黄灯之后",
      triggers: { minDay: 200, interval: 120, maxRepeats: 2, excludeFlags: ["_h712bBoardTalkDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h712bBoardTalkDone) return false;
        var c = co(st);
        // [联动] boardPressureLevel P1-6大系统字段事件层首消费
        return !!c && (c.boardPressureLevel || 0) >= 2;
      },
      choices: [
        {
          text: "🗣️ 约朋友倾诉一晚",
          hint: "心智+6,好感+4(须已见面),压力具象化",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bBoardTalkDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, nid, 4, "董事会压力下的深夜倾诉"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                nid
                  ? "🍻 和" + npcName(st, nid) + "聊到深夜，董事会的脸不再那么可怕。心智+6，好感+4。"
                  : "🍻 你独自写完了一整页复盘，压力落在纸上就轻了一半。心智+6。",
                "success"
              );
            }
          }
        },
        {
          text: "📊 连夜做KPI冲刺方案",
          hint: "管理XP+8,股东信任+3,心智-4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bBoardTalkDone = true;
            st.flags._h712bSprintPlan = true;
            var c = co(st);
            if (c) c.shareholderTrust = Math.min(100, (c.shareholderTrust || 50) + 3);
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 凌晨三点的方案发进董事群，没人回复，但你知道他们看了。管理XP+8，股东信任+3，心智-4。", "info");
            }
          }
        },
        {
          text: "😤 假装无事发生",
          hint: "心智-6,压力不会自己消失",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bBoardTalkDone = true;
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😤 你关掉了董事会邮件提醒。提醒可以关掉，季度评估关不掉。心智-6。", "warning");
            }
          }
        }
      ],
      text: function (st) {
        var c = co(st);
        var lv = c ? (c.boardPressureLevel || 0) : 2;
        var trust = c ? Math.round(c.shareholderTrust || 50) : 50;
        return "董事会压力等级已经升到 " + lv + " 级，股东信任度 " + trust +
          "%。散会后走廊很长，你听见自己的脚步声——'他们是在给我时间，还是在给我倒计时？'";
      }
    },
    {
      id: "h712b_media_spotlight",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎙️",
      title: "聚光灯下",
      story: "媒体关系度终于变成了一次专访",
      triggers: { minDay: 220, interval: 150, maxRepeats: 2, excludeFlags: ["_h712bSpotlightDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h712bSpotlightDone) return false;
        var c = co(st);
        // [联动] mediaRelations+sentimentScore P1-7公关系统字段事件层首消费
        return !!c && (c.mediaRelations || 0) >= 40 && (c.sentimentScore || 0) > 0;
      },
      choices: [
        {
          text: "🎙️ 接受深度专访",
          hint: "媒体关系+8,情绪分+5,名气+3,社交XP+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bSpotlightDone = true;
            var c = co(st);
            if (c) {
              c.mediaRelations = Math.min(100, (c.mediaRelations || 0) + 8);
              c.sentimentScore = Math.min(100, (c.sentimentScore || 0) + 5);
            }
            if (st.player) st.player.fame = (st.player.fame || 0) + 3;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎙️ 专访标题是《从街头到写字楼》。你妈把链接转发了三个家族群。媒体关系+8，情绪分+5，名气+3。", "success");
            }
          }
        },
        {
          text: "🤫 婉拒，闷声做事",
          hint: "心智+4,媒体关系-3,低调也是策略",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bSpotlightDone = true;
            var c = co(st);
            if (c) c.mediaRelations = Math.max(0, (c.mediaRelations || 0) - 3);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 '公司还小，先把事做好。'记者遗憾地合上本子。心智+4，媒体关系-3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var c = co(st);
        var mr = c ? Math.round(c.mediaRelations || 0) : 40;
        var senti = c ? Math.round(c.sentimentScore || 0) : 0;
        return "一家商业媒体发来专访邀请。你的媒体关系度 " + mr + "，舆论情绪分 " + senti +
          "——公关团队说这是'窗口期'。聚光灯已经架好，问题是你要不要走进去。";
      }
    },
    {
      id: "h712b_crisis_night",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌒",
      title: "危机中的深夜",
      story: "危机等级不只是仪表盘上的数字",
      triggers: { minDay: 200, interval: 100, maxRepeats: 2, excludeFlags: ["_h712bCrisisNightDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._h712bCrisisNightDone) return false;
        var c = co(st);
        // [联动] crisisLevel 危机系统字段事件层首消费
        return !!c && (c.crisisLevel || 0) >= 2;
      },
      choices: [
        {
          text: "🧘 按健康计划扛过去",
          hint: "曾定健康计划(_h698Fitness)则健康+4心智+6,否则心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bCrisisNightDone = true;
            // [联动] _h698Fitness 死flag首读：R698健康计划在危机夜兑现回报(禀赋效应)
            var hasPlan = !!(st.flags && st.flags._h698Fitness);
            if (hasPlan) {
              if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
              if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            } else {
              if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                hasPlan
                  ? "🧘 幸亏当初定了健康计划——晨跑、冥想、十一点睡。危机还在，但你睡得着。健康+4，心智+6。"
                  : "🧘 你试着深呼吸。没有练过的深呼吸，效果打了对折。心智+3。",
                hasPlan ? "success" : "info"
              );
            }
          }
        },
        {
          text: "🚬 咖啡因和烟熬通宵",
          hint: "危机等级-1,健康-5,饮鸩止渴",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bCrisisNightDone = true;
            var c = co(st);
            if (c) c.crisisLevel = Math.max(0, (c.crisisLevel || 0) - 1);
            if (st.status) st.status.health = Math.max(1, (st.status.health || 100) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚬 通宵压下了一波舆情，代价记在体检报告上。危机等级-1，健康-5。", "warning");
            }
          }
        },
        {
          text: "📞 授权团队，自己去睡",
          hint: "管理XP+6,心智+4,信任团队",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h712bCrisisNightDone = true;
            st.flags._h712bDelegated = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📞 '按预案走，明早八点向我汇报。'挂断电话的那一刻，你才算真正当上了CEO。管理XP+6，心智+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        var c = co(st);
        var lv = c ? (c.crisisLevel || 0) : 2;
        return "凌晨一点，危机等级 " + lv + " 级。手机每隔十分钟震一次，公关群里的消息条数比你的心率还快。你盯着天花板——明天的你，需要今晚的你做个决定。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
