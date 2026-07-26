/**
 * 域C(职业/成长) 联动增强 R416
 * 第十七轮循环——把隐藏在skill_tree分支/职业路径/技能连携中的数据转化为叙事体验。
 * 桥接：
 *   C→A  c416_branch_data            分支数据化 → 消费 SKILL_BRANCHES+skillBranches 数据,
 *     把技能分支选择→"我的技能发展方向"的数据画像
 *   C→E  c416_career_invest           职业投资洞察 → 消费 employment+investment 数据,
 *     职业发展→"职业技能如何转化为投资洞察"的经济联动
 *   C→G  c416_skill_health            技能健康收益 → 消费 skills+status.health 数据,
 *     技能提升→"技能让我更健康"的生命周期回响
 *
 * 严格照 domain_c_linkage_r409.js / r399.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR416Loaded) return;
  RANDOM_EVENTS._domainCLinkageR416Loaded = true;

  // 安全技能经验
  function grantSkillXpR416(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // C→A: 分支数据化 — 消费 SKILL_BRANCHES+skillBranches
      id: "c416_branch_data",
      phase: "street",
      _isChainEvent: false,
      icon: "🌳",
      title: "技能发展树",
      story:
        "你审视自己的技能发展路径——{branchDesc}\n\n{branchInsight}",
      triggers: { minDay: 70, excludeFlags: ["_c416BranchCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📊 用数据指导技能发展",
          hint: "心智+4,accounting XP+3,置 _c416BranchCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c416BranchCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR416("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌳 你审视了技能发展树——明确方向是成长的第一步。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "😊 凭兴趣自由发展",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "技能发展正在稳步前进";
        var insight = "选择合适的分支方向,能让技能发挥最大价值";
        if (typeof SKILL_BRANCHES !== "undefined" && st.skillBranches) {
          var chosen = Object.keys(st.skillBranches).length;
          var total = Object.keys(SKILL_BRANCHES).length;
          if (chosen > 0) {
            desc = "你已在" + total + "个技能领域中选择了" + chosen + "个发展方向";
            insight = "每个分支都有独特的发展路径,坚持深耕会有丰厚回报";
          }
        }
        return "你审视自己的技能发展路径——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // C→E: 职业投资洞察 — 消费 employment+investment
      id: "c416_career_invest",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "职业洞察变投资",
      story:
        "你发现职业积累的经验可以指导投资——{investDesc}\n\n职业洞察是最接地气的投资智慧。",
      triggers: { minDay: 85, excludeFlags: ["_c416InvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment) return false;
        return true;
      },
      choices: [
        {
          text: "📝 把职业洞察转化为投资策略",
          hint: "accounting XP+5,心智+3,置 _c416InvestCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c416InvestCooldown = true;
            grantSkillXpR416("accounting", 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💡 你把职业洞察转化为投资策略——行业认知是最有价值的信息。会计XP+5,心智+3。", "success");
          }
        },
        {
          text: "🤷 职业和投资是两码事",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "职业积累的行业认知,能帮助你看清市场趋势";
        if (st.career && st.career.history && st.career.history.length > 0) {
          desc = "多年的职业积累,让你对相关行业有了深刻理解";
        }
        return "你发现职业积累的经验可以指导投资——" + desc + "。\n\n职业洞察是最接地气的投资智慧。";
      }
    },
    {
      // C→G: 技能健康收益 — 消费 skills+status.health
      id: "c416_skill_health",
      phase: "street",
      _isChainEvent: false,
      icon: "💪",
      title: "技能让我更健康",
      story:
        "你发现技能提升与健康有微妙联系——{healthDesc}\n\n{shealthInsight}",
      triggers: { minDay: 60, excludeFlags: ["_c416HealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.skills;
      },
      choices: [
        {
          text: "🌟 技能提升,健康相随",
          hint: "心智+3,心情+4,置 _c416HealthCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c416HealthCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💪 你发现技能提升与健康相伴——成长的快乐是最好的养生。心智+3,心情+4。", "success");
          }
        },
        {
          text: "😅 健康主要靠锻炼",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "技能提升带来的成就感和收入增长,间接促进了身心健康";
        var insight = "全面发展,事业与健康可以兼得";
        if (st.status && typeof st.status.health === "number" && st.status.health < 50) {
          desc = "近期健康下滑,适当减少工作强度,增加休息";
          insight = "健康是1,其他是0,没有健康一切都是空";
        }
        return "你发现技能提升与健康有微妙联系——" + desc + "。\n\n" + insight + "。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
