/*
 * 城市浮生记 — 域H(Phase2/公司) 联动增强 R874
 * 全系统优化·Domain H 第六十六轮循环
 *
 * 【联动增强3项 — H→D 方向(仅4次,历轮最薄弱)】
 *   1. H→D 公司招聘NPCv1 — 公司阶段招聘已结识NPC为核心员工
 *   2. H→D 公司危机时朋友的支持v1 — 公司遇到困难时,已结识NPC提供帮助
 *   3. H→D 公司成功时朋友的态度v1 — 公司取得成就后,朋友的态度变化
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - H→D 核心设计理念：公司不是孤岛,创始人的人脉网络应与公司命运联动——
 *    社会认同+禀赋效应+峰终定律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR874Loaded) return;
  RANDOM_EVENTS._domainHLinkageR874Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 获取最高好感的已结识NPCid */
  function topMetNpcId(state) {
    if (!state || !state.relationships) return null;
    var _best = null, _bestAff = -101;
    for (var _id in state.relationships) {
      if (!Object.prototype.hasOwnProperty.call(state.relationships, _id)) continue;
      var _r = state.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _best = _id; }
    }
    return _best;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: H→D 公司招聘NPCv1 — 公司阶段招聘已结识NPC为核心员工
    // 设计意图：公司扩张时,高好感NPC可以加入公司成为核心员工,
    //   体现"人脉变人才"的正反馈——社会认同+禀赋效应。
    // 触发：corporate阶段 + ≥1个好感≥60的NPC + 公司员工<5人
    // 心理学：社会认同(被朋友信任)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "h874_corp_recruit_npc_v1",
      phase: "corporate",
      icon: "🤝",
      title: "朋友来投奔了",
      story: "公司正在扩张,你需要信得过的人。\n\n一个老朋友找到你——「听说你的公司做得不错,我来跟你干吧,反正那边也没啥前途。」\n\n有朋友来投奔,是信任,也是责任。",
      triggers: { minDay: 80, interval: 200, maxRepeats: 1, excludeFlags: ["_h874RecruitCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h874RecruitCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需有至少1个好感≥60的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 欢迎加入,一起拼",
          hint: "管理XP+18, 朋友好感+10, 置_h874Recruited",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874RecruitCd = true;
            st.flags._h874Recruited = true;
            grantXp("management", 18);
            var _friend = topMetNpcId(st);
            if (_friend && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _friend, 10, "朋友加入公司");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 朋友加入公司——管理XP+18, 朋友好感+10。", "success");
            }
          }
        },
        {
          text: "😅 公司还小,怕委屈了他",
          hint: "心智+10, 置_h874DeclineRecruit",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874RecruitCd = true;
            st.flags._h874DeclineRecruit = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 公司还小,怕委屈了他——心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: H→D 公司危机时朋友的支持v1 — 公司遇到困难时朋友提供帮助
    // 设计意图：公司遇到危机(现金流紧张/员工流失)时,
    //   已结识NPC主动提供帮助——社会支持+峰终定律。
    // 触发：corporate阶段 + 公司现金流<5000 + ≥1个好感≥50的NPC
    // 心理学：社会支持(低谷时的温暖)+峰终定律(危机时刻的记忆)
    // ========================================================================
    {
      id: "h874_corp_crisis_friend_v1",
      phase: "corporate",
      icon: "💚",
      title: "困难时期,朋友伸出了手",
      story: "公司最近遇到了困难,现金流紧张,员工人心惶惶。\n\n这时候,一个老朋友找到了你——「听说你最近不容易,有什么我能帮的？」\n\n患难见真情。",
      triggers: { minDay: 100, interval: 240, maxRepeats: 1, excludeFlags: ["_h874CrisisCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h874CrisisCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需公司现金流紧张
        st.resources = st.resources || {};
        if ((st.resources.cash || 0) >= 5000) return false;
        // 需有至少1个好感≥50的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "💚 接受帮助,铭记在心",
          hint: "社交XP+15, 朋友好感+10, 心情+10, 置_h874AcceptedHelp",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874CrisisCd = true;
            st.flags._h874AcceptedHelp = true;
            grantXp("social", 15);
            var _friend = topMetNpcId(st);
            if (_friend && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _friend, 10, "危机时帮助");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 接受帮助,铭记在心——社交XP+15, 朋友好感+10, 心情+10。", "success");
            }
          }
        },
        {
          text: "😅 自己扛,不麻烦朋友",
          hint: "心智+12, 置_h874SelfReliant",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874CrisisCd = true;
            st.flags._h874SelfReliant = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己扛,不麻烦朋友——心智+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: H→D 公司成功时朋友的态度v1 — 公司取得成就后朋友的态度
    // 设计意图：公司取得重大成就(IPO/大额融资)后,
    //   已结识NPC的态度变化——社会比较+禀赋效应。
    // 触发：corporate阶段 + 公司估值≥100万 + ≥2个已结识NPC
    // 心理学：社会比较(朋友的羡慕/佩服)+禀赋效应(拥有感)
    // ========================================================================
    {
      id: "h874_corp_success_friend_v1",
      phase: "corporate",
      icon: "🏆",
      title: "朋友们听说了你的成就",
      story: "公司最近取得了不小的成就,消息传开了。\n——朋友们提起你时,语气里多了一份佩服。",
      triggers: { minDay: 150, interval: 300, maxRepeats: 1, excludeFlags: ["_h874SuccessCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._h874SuccessCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需公司估值≥100万
        var _valuation = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        if (_valuation < 1000000) return false;
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
          text: "🏆 谦虚感谢,请朋友吃饭",
          hint: "社交XP+20, 所有已结识NPC好感+5, 置_h874Humble",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874SuccessCd = true;
            st.flags._h874Humble = true;
            grantXp("social", 20);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "公司成功");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 谦虚感谢,请朋友吃饭——社交XP+20, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 成就还小,继续努力",
          hint: "心智+12, 管理XP+10, 置_h874KeepGoing",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h874SuccessCd = true;
            st.flags._h874KeepGoing = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 成就还小,继续努力——心智+12, 管理XP+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
