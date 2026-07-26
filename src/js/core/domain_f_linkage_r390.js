/**
 * 域F(UI/UX) 联动增强 R390
 * 第十七轮循环——好的界面降低认知负荷，让玩家"看见"自己的人生，从而在
 * 叙事/社交/公司层面留下真实痕迹。设计遵循峰终定律与认知负荷理论：
 * 一次清晰的回顾 = 一个情绪峰值。
 * 桥接：
 *   F→B  ui_r390_progress_review   进度回顾→人生叙事回望（叙事/心智）
 *   F→D  ui_r390_relations_map     关系网整理→主动问候熟人（NPC/社交好感）
 *   F→H  ui_r390_data_pitch        数据看板→季度汇报（公司/经营·管理力变现）
 *
 * 全 || 防御；数值以 [PLACEHOLDER] 标记，待平衡校准。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR390Loaded) return;
  RANDOM_EVENTS._domainFLinkageR390Loaded = true;

  // 找到首个"已结识(met)"的 NPC，严守域D铁律：只读 state.relationships、需 rel.met
  function firstMetNpcR390(st) {
    var rels = st && st.relationships;
    if (!rels || typeof rels !== "object") return null;
    for (var id in rels) {
      if (!Object.prototype.hasOwnProperty.call(rels, id)) continue;
      var rel = rels[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  function npcNameR390(id) {
    if (typeof getNpcDisplayName === "function") {
      try {
        return getNpcDisplayName(id) || id;
      } catch (e) {
        return id;
      }
    }
    return id;
  }

  var EVENTS = [
    {
      // F→B 叙事：把游戏进度/成就页当成人生回望的入口
      id: "ui_r390_progress_review",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "翻看人生进度",
      story:
        "夜深了，你打开了记录自己一路走来的那一页。\n\n" +
        "存款、技能、认识的人、走过的路……密密麻麻，却也一目了然。\n\n" +
        "原来你已经走了这么远。曾经觉得过不去的坎，如今回头看不过是脚下一块石头。\n\n" +
        "「一个人真正的成长，是有一天能平静地翻看自己的过去。」",
      triggers: { minDay: 45, excludeFlags: ["_uiProgressReviewR390Seen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📖 认真回望这一路",
          hint: "心智+[PLACEHOLDER]，幸福+[PLACEHOLDER]，留下回望印记",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiProgressReviewR390Seen = true;
            st.flags._lifeReviewHabit = true; // 供后续叙事事件消费的印记
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "📖 你平静地翻看了自己的过去。原来已经走了这么远。心智+6，幸福+4。",
                "success"
              );
            }
          },
        },
        {
          text: "😴 太累了，明天再看",
          hint: "心智+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiProgressReviewR390Seen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("😴 你合上了那一页，早点休息。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // F→D 社交：整理关系网可视化后，主动给最熟的人发个消息
      id: "ui_r390_relations_map",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "整理关系网",
      story:
        "你把认识的人在脑海里排了排：谁是可以深夜打电话的，谁只是点头之交。\n\n" +
        "整理完才发现，有个人你已经很久没联系了。\n\n" +
        "「关系就像花园，不打理就会荒芜。」你决定主动发条消息过去。",
      triggers: { minDay: 50, excludeFlags: ["_uiRelationsMapR390Seen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        return !!firstMetNpcR390(st); // 至少有一位已结识的人
      },
      choices: [
        {
          text: "💬 主动发个问候",
          hint: "熟人好感+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiRelationsMapR390Seen = true;
            var nid = firstMetNpcR390(st);
            if (nid && typeof applyAffinityChange === "function") {
              try {
                applyAffinityChange(st, nid, 5, "你主动发来问候"); // [PLACEHOLDER]
              } catch (e) {}
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "💬 你给" + npcNameR390(nid) + "发了条问候。关系就像花园，需要打理。好感+5。",
                "success"
              );
            }
          },
        },
        {
          text: "🤔 只是看看，没联系",
          hint: "无变化",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiRelationsMapR390Seen = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤔 你看了看，终究没按下发送键。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // F→H 公司：把杂乱数据整理成一页看板，季度汇报事半功倍
      id: "ui_r390_data_pitch",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "一页看板",
      story:
        "季度汇报在即，你没有堆砌几十页 PPT，而是把最关键的数字压进了一页看板。\n\n" +
        "会上，董事们第一次这么快就抓住了重点。\n\n" +
        "「信息越少，力量越大——前提是你留下的是对的那些。」你的经营视野又清晰了一分。",
      triggers: { minDay: 60, excludeFlags: ["_uiDataPitchR390Seen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var corp = st.corporate;
        var hasCompany = !!(corp && corp.company);
        var isFounder = !!(st.startup && st.startup.company);
        return hasCompany || isFounder;
      },
      choices: [
        {
          text: "📊 打磨这页看板",
          hint: "管理经验+[PLACEHOLDER]，现金+[PLACEHOLDER]，晋升势能+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataPitchR390Seen = true;
            if (typeof addSkillXp === "function") {
              try {
                addSkillXp("management", 10); // [PLACEHOLDER]
              } catch (e) {}
            }
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER]
            }
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) + 3 // [PLACEHOLDER]
              );
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "📊 你的一页看板让董事会抓住了重点。管理经验+10，现金+800，晋升势能+3。",
                "success"
              );
            }
          },
        },
        {
          text: "📚 还是照旧堆材料",
          hint: "管理经验+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataPitchR390Seen = true;
            if (typeof addSkillXp === "function") {
              try {
                addSkillXp("management", 3); // [PLACEHOLDER]
              } catch (e) {}
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你照旧堆了一沓材料，效果平平。管理经验+3。", "info");
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
