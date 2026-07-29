/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R879
 * 全系统优化·Domain G 第六十四轮循环
 *
 * 【联动增强3项 — G→D 方向(仅3次,历轮最薄弱)】
 *   1. G→D 婚姻里程碑影响社交圈v1 — 结婚后朋友关系变化
 *   2. G→D 退休后朋友关系变化v1 — 退休后社交圈重构
 *   3. G→D 生病时朋友的探望v1 — 健康危机时朋友的支持
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - G→D 核心设计理念：生命周期节点应触发社交回响,
 *    让玩家感到"人生阶段变化影响了我的社交圈"——峰终定律+社会支持。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR879Loaded) return;
  RANDOM_EVENTS._domainGLinkageR879Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→D 婚姻里程碑影响社交圈v1
    // 设计意图：结婚后,社交圈发生变化——有些朋友疏远了,有些更亲密了——
    //    峰终定律+社会认同。
    // 触发：年龄≥28 + ≥3个已结识NPC
    // 心理学：峰终定律(婚姻是人生峰值记忆)+社会认同(被朋友祝福)
    // ========================================================================
    {
      id: "g879_marriage_social_impact_v1",
      phase: "street",
      icon: "💍",
      title: "结婚后,朋友圈变了",
      story: "成家之后,你的社交圈悄然发生了变化——有些朋友联系少了,有些因为共同经历更亲密了。\n\n人生的每个阶段,都会重新筛选身边的人。",
      triggers: { minDay: 100, interval: 240, maxRepeats: 1, excludeFlags: ["_g879MarriageSocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g879MarriageSocialCd) return false;
        // 需年龄≥28(婚姻节点门槛)
        if ((st.player.age || 20) < 28) return false;
        // 需有至少3个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 3;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💍 主动维护老朋友",
          hint: "社交XP+18, 所有已结识NPC好感+4, 置_g879Maintain",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879MarriageSocialCd = true;
            st.flags._g879Maintain = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 4, "婚姻后维护");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💍 主动维护老朋友——社交XP+18, 所有朋友好感+4。", "success");
            }
          }
        },
        {
          text: "😅 顺其自然,不刻意",
          hint: "心智+10, 置_g879LetItBe",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879MarriageSocialCd = true;
            st.flags._g879LetItBe = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 顺其自然——心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→D 退休后朋友关系变化v1
    // 设计意图：退休后,社交圈重构——同事关系淡化,老朋友更珍贵——
    //    峰终定律+社会支持。
    // 触发：年龄≥55 + ≥2个已结识NPC
    // 心理学：峰终定律(退休是人生转折点)+社会支持(老朋友珍贵)
    // ========================================================================
    {
      id: "g879_retirement_social_v1",
      phase: "street",
      icon: "🌅",
      title: "退休后,老朋友更珍贵了",
      story: "退休之后,职场上的应酬少了,反而有了更多时间陪陪老朋友。\n\n年轻时一起奋斗的人,现在成了最珍贵的财富。",
      triggers: { minDay: 150, interval: 300, maxRepeats: 1, excludeFlags: ["_g879RetireSocialCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g879RetireSocialCd) return false;
        // 需年龄≥55(退休节点门槛)
        if ((st.player.age || 20) < 55) return false;
        // 需有至少2个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 2;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🌅 约老朋友聚聚",
          hint: "社交XP+20, 所有已结识NPC好感+6, 置_g879Reunite",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879RetireSocialCd = true;
            st.flags._g879Reunite = true;
            grantXp("social", 20);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 6, "退休聚会");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌅 约老朋友聚聚——社交XP+20, 所有朋友好感+6。", "success");
            }
          }
        },
        {
          text: "😅 享受清静,不想热闹",
          hint: "心智+12, 置_g879Quiet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879RetireSocialCd = true;
            st.flags._g879Quiet = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 享受清静——心智+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→D 生病时朋友的探望v1
    // 设计意图：健康危机时,朋友的主动探望——社会支持+峰终定律。
    // 触发：健康<30 + ≥1个好感≥50的NPC
    // 心理学：社会支持(低谷时的温暖)+峰终定律(危机时刻的记忆)
    // ========================================================================
    {
      id: "g879_illness_friend_visit_v1",
      phase: "street",
      icon: "🏥",
      title: "生病时,朋友来看你了",
      story: "身体不舒服,躺在床上发愁。\n——朋友们听说了,有的送粥,有的陪诊,有的只是默默帮你买了菜放在门口。\n\n患难见真情。",
      triggers: { minDay: 80, interval: 200, maxRepeats: 1, excludeFlags: ["_g879IllnessVisitCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g879IllnessVisitCd) return false;
        // 需健康<30(健康危机)
        if (!st.status || (st.status.health || 50) >= 30) return false;
        // 需有至少1个好感≥50的已结识NPC
        if (!st.relationships) return false;
        var _hasCloseFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) { _hasCloseFriend = true; break; }
        }
        return _hasCloseFriend;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🏥 感谢朋友的探望",
          hint: "社交XP+15, 朋友好感+10, 健康+5, 置_g879Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879IllnessVisitCd = true;
            st.flags._g879Thankful = true;
            grantXp("social", 15);
            // 找到最高好感NPC并提升
            var _bestNpc = null, _bestAff = -1;
            if (st.relationships) {
              for (var _id in st.relationships) {
                var _r = st.relationships[_id];
                if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _bestNpc = _id; }
              }
            }
            if (_bestNpc && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _bestNpc, 10, "生病探望");
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 感谢朋友的探望——社交XP+15, 朋友好感+10, 健康+5。", "success");
            }
          }
        },
        {
          text: "😅 不想麻烦朋友",
          hint: "心智+10, 置_g879NoTrouble",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g879IllnessVisitCd = true;
            st.flags._g879NoTrouble = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 不想麻烦朋友——心智+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
