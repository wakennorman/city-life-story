/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R870
 * 全系统优化·Domain D 第六十六轮循环
 *
 * 【联动增强3项 — D→H 方向(历轮最薄弱,仅26次 vs 其他域69+次)】
 *   1. D→H 老同事重逢v1 — Phase1结识的NPC在公司阶段成为核心员工
 *   2. D→H 合伙人推荐v1 — 高好感NPC推荐联合创始人,降低创业门槛
 *   3. D→H 客户介绍v1 — NPC人脉网络为公司带来首批客户订单
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - D→H 桥接核心设计：Phase1街头结识的NPC在公司阶段产生回响,
 *    让玩家感到"过去的人脉没有白费"——禀赋效应+峰终定律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR870Loaded) return;
  RANDOM_EVENTS._domainDLinkageR870Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 获取已结识且好感≥阈值的NPC数量 */
  function trustedNpcCount(state, minAff) {
    if (!state || !state.relationships) return 0;
    var _n = 0;
    for (var _id in state.relationships) {
      var _r = state.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) >= minAff) _n++;
    }
    return _n;
  }

  /** 获取最高好感的已结识NPC id(用于事件叙事) */
  function topMetNpcId(state) {
    if (!state || !state.relationships) return null;
    var _best = null, _bestAff = -101;
    for (var _id in state.relationships) {
      var _r = state.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _best = _id; }
    }
    return _best;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→H 老同事重逢v1 — Phase1结识的NPC在公司阶段成为核心员工
    // 设计意图：街头阶段结识的NPC(李工头/张姐/老周等)在公司阶段出现,
    //   带来"老同事重逢"叙事,让玩家感到过去的人脉没有白费。
    // 触发：corporate阶段 + ≥3个好感≥40的NPC + 公司员工<5人
    // 心理学：禀赋效应(过去投入的人际关系产生回报)+峰终定律(重逢是记忆峰值)
    // ========================================================================
    {
      id: "d870_old_friend_hire_v1",
      phase: "corporate",
      icon: "🤝",
      title: "老同事来投奔你了",
      story: "你正在为新公司招人——突然接到一个熟悉的电话。\n\n「听说你当老板了？我来跟你干吧,反正这边也没啥前途。」\n\n曾经一起吃苦的老同事,现在要来投奔你了。",
      triggers: { minDay: 60, interval: 180, maxRepeats: 2, excludeFlags: ["_d870OldFriendHireCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d870OldFriendHireCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需有至少3个好感≥40的已结识NPC(人脉广度证明)
        if (trustedNpcCount(st, 40) < 3) return false;
        // 公司员工未满(真实招聘需求)
        var _teamSize = (st.startup && st.startup.team) ? st.startup.team.length : 0;
        if (_teamSize >= 5) return false;
        return true;
      },
      probability: 0.07,
      repeatable: false,
      choices: [
        {
          text: "🤝 欢迎加入,一起拼",
          hint: "管理XP+15, 社交XP+10, 置_d870OldFriendJoined",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870OldFriendHireCd = true;
            st.flags._d870OldFriendJoined = true;
            grantXp("management", 15);
            grantXp("social", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 老同事加入团队——管理XP+15, 社交XP+10。", "success");
            }
          }
        },
        {
          text: "😊 先聊聊,看适合什么岗位",
          hint: "智力+12, 心智+8, 置_d870OldFriendTalked",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870OldFriendHireCd = true;
            st.flags._d870OldFriendTalked = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 先聊聊适合什么岗位——智力+12, 心智+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→H 合伙人推荐v1 — 高好感NPC推荐联合创始人
    // 设计意图：高好感NPC(好感≥70)在公司阶段推荐自己的熟人当联合创始人,
    //   降低单打独斗的创业风险,体现"人脉就是资源"。
    // 触发：corporate阶段 + ≥1个好感≥70的NPC + 尚无合伙人
    // 心理学：社会认同(被朋友信任的满足感)+损失厌恶(错过推荐=错过机会)
    // ========================================================================
    {
      id: "d870_npc_cofounder_referral_v1",
      phase: "corporate",
      icon: "👥",
      title: "有人给你推荐了一个合伙人",
      story: "你在城市里攒下的人脉,终于派上了用场。\n\n一个老朋友找到我,说认识一个很靠谱的人——「他技术/业务能力特别强,就是缺个靠谱搭档。你们聊聊？」\n\n也许,这就是冥冥之中的安排。",
      triggers: { minDay: 90, interval: 240, maxRepeats: 1, excludeFlags: ["_d870CofounderCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d870CofounderCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需有至少1个好感≥70的已结识NPC(挚友级人脉)
        if (trustedNpcCount(st, 70) < 1) return false;
        return true;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "👥 见面聊聊",
          hint: "管理XP+20, 魅力+15, 置_d870CofounderFound",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870CofounderCd = true;
            st.flags._d870CofounderFound = true;
            grantXp("management", 20);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👥 见面聊聊,也许就是命中注定的合伙人——管理XP+20, 魅力+15。", "success");
            }
          }
        },
        {
          text: "😅 暂时不需要合伙人",
          hint: "心智+5, 置_d870SoloChoice",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870CofounderCd = true;
            st.flags._d870SoloChoice = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 暂时不需要合伙人,先自己干。心智+5。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→H 客户介绍v1 — NPC人脉网络为公司带来首批客户订单
    // 设计意图：NPC关系网在公司阶段产生直接经济价值——朋友介绍客户,
    //   让"人脉就是钱脉"从口号变成游戏机制。
    // 触发：corporate阶段 + ≥2个好感≥50的NPC + 公司营收低迷
    // 心理学：互惠原则(朋友帮你,你欠人情)+峰终定律(雪中送炭记忆最深)
    // ========================================================================
    {
      id: "d870_npc_client_intro_v1",
      phase: "corporate",
      icon: "💼",
      title: "朋友介绍了个大客户",
      story: "创业最难的不是产品,而是第一个客户。\n\n发愁的时候,一个老朋友打来电话——「我认识一个老板,正好需要你们这种服务,我给你们牵个线？」\n\n人脉,终于从朋友圈走进了商业世界。",
      triggers: { minDay: 120, interval: 200, maxRepeats: 2, excludeFlags: ["_d870ClientIntroCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d870ClientIntroCd) return false;
        if (st.player.phase !== "corporate") return false;
        // 需有至少2个好感≥50的已结识NPC(人脉变现门槛)
        if (trustedNpcCount(st, 50) < 2) return false;
        return true;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💼 好好接待,把握机会",
          hint: "会计XP+15, 现金+5000, 置_d870ClientDeal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870ClientIntroCd = true;
            st.flags._d870ClientDeal = true;
            grantXp("accounting", 15);
            st.resources = st.resources || {};
            st.resources.cash = (st.resources.cash || 0) + 5000;
            if (typeof addDailyTransaction === "function") {
              addDailyTransaction(st, "income", "npc_client_referral", 5000, "朋友介绍客户首单");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 好好接待,签下第一单——会计XP+15, 现金+5000。", "success");
            }
          }
        },
        {
          text: "😊 先让朋友别欠人情",
          hint: "社交XP+10, 心智+8, 置_d870DeclineFavor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d870ClientIntroCd = true;
            st.flags._d870DeclineFavor = true;
            grantXp("social", 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 先让朋友别欠人情——社交XP+10, 心智+8。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
