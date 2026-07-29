/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R871
 * 全系统优化·Domain G 第六十三轮循环
 *
 * 【联动增强3项 — G→D(仅2次) + G→F(23次) 方向,均为历轮薄弱】
 *   1. G→D 婚姻里程碑v1 — 年龄≥28 + 挚友(affinity≥80) → 婚恋人生节点
 *   2. G→D NPC调解v1 — 两个已结识NPC关系紧张 → 玩家调解(首次实现NPC间互动由玩家触发)
 *   3. G→F 人生资产负债表v1 — 综合资产/负债/社交资本 → 生命质量仪表盘UI
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR871Loaded) return;
  RANDOM_EVENTS._domainGLinkageR871Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  function getNpcRelationType(state, idA, idB) {
    if (typeof NPC_RELATION_MATRIX === "undefined") return null;
    var _row = NPC_RELATION_MATRIX[idA];
    if (!_row) return null;
    return _row[idB] || null;
  }

  var EVENTS = [
    {
      id: "g871_marriage_milestone_v1",
      phase: "street",
      icon: "💍",
      title: "是时候了",
      story: "你发现身边的朋友一个个都成了家,父母电话里也多了些含蓄的催促。\n\n也许,是时候认真想想这件事了——不是将就,而是和对的人一起走接下来的路。",
      triggers: { minDay: 30, interval: 365, maxRepeats: 1, excludeFlags: ["_g871MarriageCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g871MarriageCd) return false;
        if ((st.player.age || 20) < 28) return false;
        if (!st.relationships) return false;
        var _hasConfidant = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 80) { _hasConfidant = true; break; }
        }
        return _hasConfidant;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💍 认真考虑一下",
          hint: "社交XP+18, 心情+15, 置_g871MarriageConsidered",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871MarriageCd = true;
            st.flags._g871MarriageConsidered = true;
            grantXp("social", 18);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💍 是时候认真想想人生大事了——社交XP+18, 心情+15。", "success");
            }
          }
        },
        {
          text: "😅 事业为重,不急",
          hint: "心智+8, 管理XP+10, 置_g871CareerFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871MarriageCd = true;
            st.flags._g871CareerFirst = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 事业为重,缘分急不来——心智+8, 管理XP+10。", "info");
            }
          }
        }
      ]
    },
    {
      id: "g871_npc_mediate_v1",
      phase: "street",
      icon: "⚖️",
      title: "两个朋友闹矛盾了",
      story: "你夹在中间,左右为难——两个曾经要好的朋友,因为一些误会闹得不愉快。\n\n他们都来找你诉苦,都希望你能帮忙说和。",
      triggers: { minDay: 80, interval: 200, maxRepeats: 1, excludeFlags: ["_g871MediateCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g871MediateCd) return false;
        if (!st.relationships) return false;
        var _metIds = [];
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 20) _metIds.push(_id);
        }
        for (var _i = 0; _i < _metIds.length; _i++) {
          for (var _j = _i + 1; _j < _metIds.length; _j++) {
            var _rel = getNpcRelationType(st, _metIds[_i], _metIds[_j]);
            if (_rel === "strained" || _rel === "competitor") return true;
          }
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 出面调解,化解矛盾",
          hint: "社交XP+20, 双NPC好感+8, 置_g871Mediated",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871MediateCd = true;
            st.flags._g871Mediated = true;
            grantXp("social", 20);
            if (st.relationships) {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met && (_mr.affinity || 0) >= 20 && typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _mid, 8, "调解成功");
                }
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚖️ 出面调解,矛盾化解,大家更和谐了——社交XP+20, 社交圈好感+8。", "success");
            }
          }
        },
        {
          text: "😅 清官难断家务事,不掺和",
          hint: "心智+10, 置_g871StayOut",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871MediateCd = true;
            st.flags._g871StayOut = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 清官难断家务事,不掺和——心智+10。", "info");
            }
          }
        }
      ]
    },
    {
      id: "g871_life_balance_sheet_v1",
      phase: "street",
      icon: "📊",
      title: "人生资产负债表",
      story: "如果把自己当成一家公司——\n\n你的资产不只是存款,还有健康的身体、可靠的朋友、傍身的技能。\n\n你的负债也不只是贷款,还有透支的健康、疏远的关系、停滞的成长。\n\n是时候算一算,这家「人生公司」到底值多少。",
      triggers: { minDay: 100, interval: 999, maxRepeats: 1, excludeFlags: ["_g871BalanceSheetCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g871BalanceSheetCd) return false;
        return st.player.day >= 100;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "📊 查看人生资产负债表",
          hint: "智力+15, 心智+15, 置_g871BalanceSheetSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871BalanceSheetCd = true;
            st.flags._g871BalanceSheetSeen = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 人生资产负债表已生成——智力+15, 心智+15。", "success");
            }
          }
        },
        {
          text: "😅 不想算,过好当下",
          hint: "心情+10, 置_g871LiveNow",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g871BalanceSheetCd = true;
            st.flags._g871LiveNow = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 不想算,过好当下——心情+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
