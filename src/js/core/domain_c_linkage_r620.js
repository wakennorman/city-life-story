/**
 * 域C(职业/成长) 联动增强 R620
 * 桥接：
 *   C→H  c620_career_corp_synergy  职业资本→公司运营加成 → 消费 state.career+state.skills 数据,
 *     职业积累→"行业资源助力创业"公司回响
 *   C→F  c620_career_milestone_ui  职业里程碑→UI面板反馈 → 消费 state.career+state.player 数据,
 *     职业→"成长可视化"展示回响
 *   C→D  c620_career_social_echo   职业晋升→社交圈回响 → 消费 state.career+state.relationships 数据,
 *     职业→"升职加薪"NPC社交回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR620Loaded) return;
  RANDOM_EVENTS._domainCLinkageR620Loaded = true;

  // 辅助：获取当前职业路径名称
  function _pathNameR620(st) {
    if (!st.career || !st.career.currentJob) return "无";
    var path = CAREER_PATHS && CAREER_PATHS[st.career.currentJob.path];
    return path ? path.icon + " " + path.name : st.career.currentJob.path;
  }

  // 辅助：计算技能总等级
  function _totalSkillLevelR620(st) {
    var total = 0;
    var skills = st.skills || {};
    for (var k in skills) {
      if (skills[k] && typeof skills[k].level === "number") total += skills[k].level;
    }
    return total;
  }

  // 辅助：获取已结识NPC列表
  function _metNpcsR620(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // C→H: 职业资本→公司运营加成
    // 当玩家有固定工作且技能积累到一定程度时，提示创业优势
    // ================================================================
    {
      id: "c620_career_corp_synergy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "职场积累",
      minDay: 60,
      text: function (st) {
        var pathName = _pathNameR620(st);
        var totalSkill = _totalSkillLevelR620(st);
        var cap = (typeof ensureCareerCapital === "function") ? ensureCareerCapital(st) : null;
        var industryRes = cap ? Math.round(cap.industryResources || 0) : 0;
        var clientLeads = cap ? Math.round(cap.clientLeads || 0) : 0;

        if (totalSkill >= 100 && industryRes >= 30) {
          return "你在「" + pathName + "」深耕多年（技能总等级" + totalSkill + "），" +
            "积累了" + industryRes + "点行业资源和" + clientLeads + "条客户线索。" +
            "这些职场资本在创业时可直接转化为公司起步优势——行业资源越多，注册资金减免越多；" +
            "客户线索越多，首月营收加成越高。";
        } else if (totalSkill >= 50) {
          return "你在「" + pathName + "」已经站稳了脚跟（技能总等级" + totalSkill + "）。" +
            "继续积累行业资源和客户线索，未来创业时将获得可观的启动资金减免。";
        }
        return "你在「" + pathName + "」的工作正在积累宝贵的职场资本。" +
          "行业资源、客户线索、职业声誉——这些都将成为你未来创业的基石。";
      },
      choices: [
        { text: "💼 继续深耕职场", next: null },
        { text: "📊 查看创业条件", next: null, handler: function (st) {
          if (typeof showStartupRegisterModal === "function") {
            showStartupRegisterModal();
          } else {
            StateManager.addMessage("🚀 前往「事业发展」查看创业条件", "info");
          }
        }},
      ],
      condition: function (st) {
        return st.career && st.career.currentJob && (st.career.currentJob.workDays || 0) >= 60;
      },
      weight: 1,
    },

    // ================================================================
    // C→F: 职业里程碑→UI面板反馈
    // 在职天数达到特定里程碑时，弹出成就式反馈
    // ================================================================
    {
      id: "c620_career_milestone_ui",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "职业里程碑",
      minDay: 7,
      text: function (st) {
        if (!st.career || !st.career.currentJob) return "你还没有固定工作，找一份工作开始你的职业之旅吧。";
        var wd = st.career.currentJob.workDays || 0;
        var pathName = _pathNameR620(st);
        var perf = st.career.currentJob.performance || 50;
        var salary = st.career.currentJob.salary || 0;

        if (wd >= 365) {
          return "你在「" + pathName + "」已经工作满一周年！在职" + wd + "天，绩效" + perf + "分，月薪¥" + salary.toLocaleString() + "。" +
            "这一年的职场历练让你的技能和心智都得到了质的飞跃。年度考核将至，是争取晋升的好时机。";
        } else if (wd >= 180) {
          return "你在「" + pathName + "」已经工作了半年。在职" + wd + "天，绩效" + perf + "分。" +
            "你已经完全适应了职场节奏，是时候考虑下一步的晋升或跳槽了。";
        } else if (wd >= 90) {
          return "你在「" + pathName + "」已经工作了三个月。在职" + wd + "天，绩效" + perf + "分。" +
            "试用期已过，你已经成为团队中可靠的一员。继续积累业绩，为晋升做准备。";
        } else if (wd >= 30) {
          return "你在「" + pathName + "」满月了！在职" + wd + "天，绩效" + perf + "分。" +
            "你已经基本熟悉了工作流程，接下来可以主动承担更多项目来提升绩效。";
        }
        return "你在「" + pathName + "」开始了新的职业生涯。在职" + wd + "天，绩效" + perf + "分。" +
          "先熟悉工作环境，和同事建立良好关系，为长远发展打基础。";
      },
      choices: [
        { text: "📈 查看晋升条件", next: null, handler: function (st) {
          if (st.career && st.career.currentJob) {
            var nextLevel = typeof getNextCareerLevel === "function" ? getNextCareerLevel(st.career.currentJob.path, st.career.currentJob.levelId) : null;
            if (nextLevel) {
              var reqHtml = typeof renderPromotionReqs === "function" ? renderPromotionReqs(st, st.career.currentJob.path, nextLevel) : "查看事业发展Tab";
              StateManager.addMessage("⬆️ 下一级: " + nextLevel.name + " ¥" + (nextLevel.salary || 0).toLocaleString() + "/月 - " + reqHtml, "info");
            } else {
              StateManager.addMessage("🏆 已到达路径最高级！", "success");
            }
          }
        }},
        { text: "💪 继续努力", next: null },
      ],
      condition: function (st) {
        if (!st.career || !st.career.currentJob) return false;
        var wd = st.career.currentJob.workDays || 0;
        // 在特定里程碑天数触发
        return wd === 7 || wd === 30 || wd === 90 || wd === 180 || wd === 365;
      },
      weight: 2,
    },

    // ================================================================
    // C→D: 职业晋升→社交圈回响
    // 晋升或入职新工作时，已结识NPC会有反应
    // ================================================================
    {
      id: "c620_career_social_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "职场社交圈",
      minDay: 1,
      text: function (st) {
        var npcs = _metNpcsR620(st);
        if (npcs.length === 0) return "你还没有结识任何人，多出去走走认识些朋友吧。";
        if (!st.career || !st.career.currentJob) return "你还没有固定工作，找到工作后，朋友们会为你高兴的。";

        var pathName = _pathNameR620(st);
        var wd = st.career.currentJob.workDays || 0;
        var salary = st.career.currentJob.salary || 0;

        // 根据已结识NPC的数量和好感度，生成不同叙事
        var highAffNpcs = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 40) highAffNpcs++;
        }

        if (highAffNpcs >= 3 && wd >= 90) {
          return "你的朋友们注意到了你在「" + pathName + "」的成就。在职" + wd + "天，月薪¥" + salary.toLocaleString() + "，" +
            "有" + highAffNpcs + "位好友对你的职业发展表示赞赏。他们觉得你越来越靠谱了，愿意向你介绍更多人脉资源。";
        } else if (highAffNpcs >= 1 && wd >= 30) {
          return "你的几位好友听说你在「" + pathName + "」干得不错，都为你感到高兴。" +
            "他们偶尔会向你打听职场见闻，也愿意在你有需要时提供帮助。";
        }
        return "你开始了在「" + pathName + "」的工作，朋友们知道后都表示支持。" +
          "随着你的职业发展，你的社交圈也会越来越广。";
      },
      choices: [
        { text: "🤝 维护关系", next: null, handler: function (st) {
          if (st.needs) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
          StateManager.addMessage("💬 和朋友们聊了聊近况，心情+3", "success");
        }},
        { text: "💼 专注工作", next: null },
      ],
      condition: function (st) {
        if (!st.career || !st.career.currentJob) return false;
        var wd = st.career.currentJob.workDays || 0;
        // 入职第1天和每次晋升后触发（在职天数关键节点）
        return wd === 1 || wd === 30 || wd === 90 || wd === 180;
      },
      weight: 2,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();