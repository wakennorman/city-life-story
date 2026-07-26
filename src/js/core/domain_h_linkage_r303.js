/**
 * 域H(Phase2/公司) 联动增强 R303
 * 第六轮循环——公司运营的多维回响，完成8域六轮全覆盖。
 * 桥接：
 *   H→A  company_data_insight       公司→数据洞察（数据/数值·经营分析）
 *   H→B  company_culture_story      公司→文化故事（事件/叙事·企业叙事）
 *   H→G  company_sustainability     公司→可持续发展（核心机制·基业长青）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR303Loaded) return;
  RANDOM_EVENTS._domainHLinkageR303Loaded = true;

  var EVENTS = [
    {
      id: "company_data_insight",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司数据洞察",
      story: "你开始用数据深入理解公司的经营状况——不只是营收和利润，还有客户留存率、员工效率、产品迭代速度。\n\n这些洞察让你发现了一些以前没注意到的经营问题：某个产品线虽然赚钱但增长停滞，某个团队虽然忙碌但产出不高。\n\n你开始用数据「诊断」公司，而不是凭感觉。",
      triggers: { minDay: 300, excludeFlags: ["_companyDataInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 30000;
      },
      choices: [
        {
          text: "📊 用数据诊断公司经营",
          hint: "心智+9，公司声誉+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据诊断公司经营。数据让问题无处遁形。心智+9，声誉+6。", "success");
            }
          },
        },
        {
          text: "🤷 凭经验就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyDataInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭经验就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "company_culture_story",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📖",
      title: "公司文化故事",
      story: "你开始收集公司的文化故事——团队一起熬过难关的故事、客户感谢信背后的故事、员工成长的故事。\n\n这些故事不仅是回忆，也是公司文化的载体。你决定把它们整理成一本「公司文化手册」，让每一个新员工都能感受到这份传承。\n\n「文化不是口号，是故事。」",
      triggers: { minDay: 350, excludeFlags: ["_companyCultureStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 40;
      },
      choices: [
        {
          text: "📖 整理成文化手册",
          hint: "心智+8，公司声誉+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你整理了公司文化手册。文化不是口号，是故事。心智+8，声誉+8。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用记录",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companyCultureStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得文化不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "company_sustainability",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌱",
      title: "公司可持续发展",
      story: "你开始思考公司的「可持续发展」——不仅是财务上的可持续，也是环境和社会责任的可持续。\n\n你决定推行一些「绿色办公」措施：减少纸张使用、鼓励远程办公、支持员工志愿者活动。这些举措虽然短期增加成本，但长期来看提升了公司的品牌价值。\n\n「基业长青不是赚快钱，是创造长期价值。」",
      triggers: { minDay: 400, excludeFlags: ["_companySustainabilitySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 500000;
      },
      choices: [
        {
          text: "🌱 推行绿色办公",
          hint: "心智+10，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilitySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌱 你推行了绿色办公。基业长青不是赚快钱，是创造长期价值。心智+10，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 赚钱更重要",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._companySustainabilitySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得赚钱更重要。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
