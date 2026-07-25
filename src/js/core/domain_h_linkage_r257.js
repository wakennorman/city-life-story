/**
 * 域H(Phase2/公司) 联动增强 R257
 * 公司运营的多维回响——公司不仅是赚钱机器，还在叙事/UI/创始人身心层面留下痕迹。
 * 桥接：
 *   H→F  company_culture_showcase   公司文化设定→UI展示公司文化卡片（UI/UX展示成就感）
 *   H→G  founder_work_life_balance  公司高压→创始人个人健康/心情受损（核心机制·身心平衡）
 *   H→B  company_milestone_history  公司里程碑→叙事历史书记载（事件/叙事·历史感）
 *
 * 严格照 domain_h_linkage_r193.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   公司 st.startup.company（含 culture/valuation/reputation）；
 *   健康 st.status.health；心情 st.needs.happiness；心智 st.player.mental；
 *   标志 _companyCultureShowcaseSeen / _founderWLBSeen / _companyMilestoneHistorySeen（去重）。
 *   数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR257Loaded) return;
  RANDOM_EVENTS._domainHLinkageR257Loaded = true;

  var EVENTS = [
    {
      // H→F: 公司文化设定→UI展示公司文化卡片（UI/UX展示成就感）
      id: "company_culture_showcase",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "公司文化成型",
      story:
        "你的公司从最初的几个人，慢慢有了自己的风格。同事们开始用「我们就是这样做事的」来描述你们——这是文化成型的标志。\n\n有人把公司的价值观写进了招聘JD，有人把团队照片挂在了办公室墙上。你意识到，你创造的不仅是一家公司，而是一种做事的方式。",
      triggers: { minDay: 180, excludeFlags: ["_companyCultureShowcaseSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        // 需要设定了公司文化
        if (!st.startup.company.culture) return false;
        // 需要至少3个团队规模
        if (!st.startup.company.team || st.startup.company.team.length < 3) return false;
        return true;
      },
      choices: [
        {
          text: "🏛️ 把文化写进公司手册",
          hint: "公司声誉+5，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureShowcaseSeen = true;
            st.flags._companyCultureManual = true; // 解锁文化手册flag（供UI展示）
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你把公司文化写进了手册。这是公司从「做买卖」到「做企业」的标志。公司声誉+5，心智+5。", "success");
            }
          },
        },
        {
          text: "🤫 文化不用写出来，做出来就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureShowcaseSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得文化是做出来的，不是写出来的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // H→G: 公司高压→创始人个人健康/心情受损（核心机制·身心平衡）
      id: "founder_work_life_balance",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚖️",
      title: "天平倾斜",
      story:
        "公司最近压力很大——业绩目标、团队管理、资金周转，所有事情都压在你头上。\n\n你开始失眠，开始忽略身体的抗议。镜子里的自己，眼睛下面挂着青黑。\n\n公司重要，但你也很重要。这个道理，你以前不懂，现在开始懂了。",
      triggers: { minDay: 120, excludeFlags: ["_founderWLBSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        if (!st.status || !st.needs) return false;
        // 公司风险高或估值下跌
        var company = st.startup.company;
        var highStress = (company.risk || 0) > 60 || (company.burnRate || 0) > 5000;
        if (!highStress) return false;
        // 创始人健康已经受到影响
        if ((st.status.health || 100) > 60 && (st.needs.happiness || 50) > 40) return false;
        return true;
      },
      choices: [
        {
          text: "🧘 给自己放一天假",
          hint: "健康+10，心情+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderWLBSeen = true;
            st.flags._founderHealthAwareness = true;
            if (st.status) {
              st.status.health = Math.min(100, (st.status.health || 50) + 10);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧘 你给自己放了一天假。健康+10，心情+8。公司重要，但你也很重要。", "success");
            }
          },
        },
        {
          text: "💊 吃片药继续扛",
          hint: "健康-3，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderWLBSeen = true;
            if (st.status) {
              st.status.health = Math.max(0, (st.status.health || 50) - 3);
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你咬牙扛住了。但身体记住了这一次。健康-3，心智+3。", "warning");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      // H→B: 公司里程碑→叙事历史书记载（事件/叙事·历史感）
      id: "company_milestone_history",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "值得记住的一天",
      story:
        "今天，你的公司达成了一个重要的里程碑。\n\n也许是估值首次破百万，也许是签下了最大的单笔合同，也许是团队人数突破了某个数字。\n\n你拿出笔记本，把今天记了下来。不是为了炫耀，而是为了在未来的某一天，当你怀疑自己的选择时，可以翻回这一页，告诉自己：「我已经走了这么远。」",
      triggers: { minDay: 150, excludeFlags: ["_companyMilestoneHistorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var company = st.startup.company;
        // 需要达到某个里程碑条件
        var milestone = (company.valuation || 0) >= 100000 ||
                        (company.reputation || 0) >= 50 ||
                        (company.revenue || 0) >= 50000 ||
                        (company.team && company.team.length >= 5);
        return milestone;
      },
      choices: [
        {
          text: "📖 写进公司历史书",
          hint: "心智+6，公司声誉+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyMilestoneHistorySeen = true;
            st.flags._companyHistoryBook = true; // 解锁公司历史书flag（供UI展示）
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 3;
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你把今天写进了公司历史书。这些记录，是比现金更珍贵的资产。心智+6，公司声誉+3。", "success");
            }
          },
        },
        {
          text: "🤫 记在心里就好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyMilestoneHistorySeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得不需要形式化，记在心里就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  // 注入全局事件池
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
