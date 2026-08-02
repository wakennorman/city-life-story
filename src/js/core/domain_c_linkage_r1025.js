/**
 * 域C(职业/成长) 联动增强 R1025
 * — C→A 技能市场价值 / C→D 同行社交圈 / C→E 技能投资回报
 *
 * 设计意图：职业成长数据消费到其他域，让玩家感知到职业发展的跨域影响。
 * 1. 技能等级提升 → 影响市场价格感知
 * 2. 职业晋升 → 打开同行社交圈
 * 3. 技能投资 → 提升投资回报率
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；
 *       done-flag 防重；NPC 一律 met 铁律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR1025Loaded) return;
  RANDOM_EVENTS._domainCLinkageR1025Loaded = true;

  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }

  var EVENTS = [
    // ===== 1. C→A 技能市场价值 =====
    {
      id: "c1025_skill_market_value",
      phase: "street",
      icon: "💎",
      title: "你的技能开始值钱了",
      story: "你发现了一件有趣的事——\n\n以前看不懂的「市场行情」，现在渐渐能看出门道了。\n\n编程学得越多，越能理解为什么某些产品卖得贵；\n销售做得越久，越能判断什么东西好卖；\n会计懂了之后，你开始计算每一笔交易的真正成本。\n\n技能不是知识——技能是你看世界的分辨率。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c1025MarketValueDone) return false;
        var totalSkillLevel = 0;
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number") totalSkillLevel += skills[k].level;
        }
        return totalSkillLevel >= 100 && st.player.day >= 70;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📊 用新眼光看市场",
          hint: "智力+5, 会计XP+30",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025MarketValueDone = true;
            st.flags._c1025SkillMarketEye = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 5);
            gx("accounting", 30);
            msg("📊 你开始用技能的眼光分析市场价格。智力+5，会计EXP+30。", "success");
          },
        },
        {
          text: "💪 继续精进技能",
          hint: "所有技能EXP+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025MarketValueDone = true;
            gx("coding", 10);
            gx("sales", 10);
            gx("management", 10);
            gx("accounting", 10);
            msg("💪 你决定继续打磨技能。所有技能EXP+10。", "info");
          },
        },
      ],
    },

    // ===== 2. C→D 同行社交圈 =====
    {
      id: "c1025_peer_network",
      phase: "street",
      icon: "🤝",
      title: "同行圈子找上门",
      story: "你在行业里混了这么久，终于有人注意到你了。\n\n一个同行在群里@了你：「哥们，听说你最近做得不错，周末有个行业聚会，来不来？」\n\n你看了看群成员名单——有供应商、有客户、有竞争对手，还有几个猎头。\n\n这种圈子，以前你挤破头都进不去。现在，有人主动邀请你了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c1025PeerNetworkDone) return false;
        var career = st.career || {};
        var job = career.currentJob;
        if (!job) return false;
        return (job.workDays || 0) >= 120 && st.player.day >= 80;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🎉 去参加聚会",
          hint: "人缘+8, 行业资源+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025PeerNetworkDone = true;
            var cap = typeof ensureCareerCapital === "function" ? ensureCareerCapital(st) : null;
            if (cap) {
              cap.industryResources = Math.min(100, (cap.industryResources || 0) + 5);
              cap.reputation = Math.min(100, (cap.reputation || 0) + 3);
              if (typeof clampCareerCapital === "function") clampCareerCapital(cap);
            }
            // 提升职场NPC好感
            if (st.relationships) {
              var _workNpcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
              for (var _wni = 0; _wni < _workNpcs.length; _wni++) {
                var _rel = st.relationships[_workNpcs[_wni]];
                if (_rel && _rel.met && typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _workNpcs[_wni], 2, "行业聚会");
                }
              }
            }
            msg("🎉 行业聚会认识了不少人！行业资源+5，声誊+3，职场NPC好感+2。", "success");
          },
        },
        {
          text: "📱 先线上聊聊",
          hint: "保守一点",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025PeerNetworkDone = true;
            var cap = typeof ensureCareerCapital === "function" ? ensureCareerCapital(st) : null;
            if (cap) {
              cap.clientLeads = Math.min(100, (cap.clientLeads || 0) + 3);
              if (typeof clampCareerCapital === "function") clampCareerCapital(cap);
            }
            msg("📱 你在群里和大家聊了聊，收获了几个潜在客户线索。", "info");
          },
        },
      ],
    },

    // ===== 3. C→E 技能投资回报 =====
    {
      id: "c1025_skill_investment_return",
      phase: "street",
      icon: "📈",
      title: "技能开始产生复利",
      story: "你算了一笔账——\n\n这一年花在学习上的时间和金钱，到底值不值？\n\n答案让你自己都吃了一惊：\n\n你花在技能培训上的每1块钱，已经赚回了超过10块。\n\n而且这不是终点——技能这个东西，越往后越值钱。\n\n初学时你只能赚辛苦钱，\n精通后你开始赚信息差的钱，\n到了专家级别，你赚的是认知的钱。\n\n这就是技能复利。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c1025SkillReturnDone) return false;
        var totalEarned = (st.resources && st.resources.totalEarned) || 0;
        var totalSkill = 0;
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number") totalSkill += skills[k].level;
        }
        return totalEarned >= 50000 && totalSkill >= 70 && st.player.day >= 100;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📈 加大技能投资",
          hint: "会计XP+50, 管理XP+30",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025SkillReturnDone = true;
            st.flags._c1025SkillInvestor = true;
            gx("accounting", 50);
            gx("management", 30);
            msg("📈 你决定继续投资自己。会计EXP+50，管理EXP+30。", "success");
          },
        },
        {
          text: "📝 分享你的经验",
          hint: "心智+5, 名气+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c1025SkillReturnDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            }
            msg("📝 你把你的经验分享给了更多人。心智+5，名气+5。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();