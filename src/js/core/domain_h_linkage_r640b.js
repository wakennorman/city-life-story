/**
 * 域H(Phase2/公司) 联动增强 R640b(并行窗口同轮号避让)
 * 桥接（全部消费"只写不读"或"零事件引用"的真实公司字段，形成闭环）：
 *   H→G  h640b_morale_dividend  士气红利 → 消费 company.morale（r602/f631 只写不读的字段首次被读取），
 *     "团队士气"从数字变成有回报的经营资产
 *   H→A  h640b_runway_alarm  跑道警报 → 消费 company.monthsOfRunway/burnRate/cashReserve（真实字段，事件层零引用），
 *     给烧钱速度一个叙事化的財务警醒时刻
 *   H→D  h640b_board_trust_dinner  董事晚宴 → 消费 company.boardMembers/shareholderTrust/shareholderSatisfaction
 *     （P1-6董事会系统建成后事件层零引用），让股东关系可经营
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR640bLoaded) return;
  RANDOM_EVENTS._domainHLinkageR640bLoaded = true;

  var EVENTS = [
    // ====== H→G: 士气红利（morale 字段闭环：r602团建/f631庆祝写入，此处首次消费） ======
    {
      id: "h640b_morale_dividend", phase: "corporate", _isChainEvent: false, icon: "🔥",
      title: "士气红利",
      story: "高涨的团队士气开始产生看得见的回报——{desc}",
      triggers: { minDay: 70, interval: 100, maxRepeats: 4, excludeFlags: ["_h640bMoraleDividendCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._h640bMoraleDividendCooldown) return false;
        var c = st.startup && st.startup.company;
        return !!(c && typeof c.morale === "number" && c.morale >= 70 && c.employees && c.employees.length >= 2);
      },
      choices: [
        { text: "🚀 顺势冲刺新功能", hint: "技术分+5,士气-5,营收+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bMoraleDividendCooldown = true;
          var c = st.startup && st.startup.company;
          if (c) {
            c.technologyScore = Math.min(100, (c.technologyScore || 0) + 5);
            c.morale = Math.max(0, (c.morale || 70) - 5);
            c.revenue = Math.max(0, (c.revenue || 0) + 3000);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 '大家状态正好,冲一把!' 团队自发加班把新功能提前上线,客户反馈热烈。技术分+5,营收+3000,士气小幅回落。", "success");
        }},
        { text: "🌴 给团队放个短假", hint: "士气+10,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bMoraleDividendCooldown = true;
          var c = st.startup && st.startup.company;
          if (c) c.morale = Math.min(100, (c.morale || 70) + 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌴 '状态好更要养,别把火烧完。' 你给团队放了两天假,大家回来后干劲更足。士气+10,心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var c = st.startup && st.startup.company;
        var m = (c && c.morale) || 70;
        return "最近办公室的气氛肉眼可见地好——士气值" + m + "。员工主动留下打磨细节,有人在白板上写满了新点子。这股劲头,是花钱都买不来的资产。你打算怎么用好它?";
      }
    },

    // ====== H→A: 跑道警报（monthsOfRunway/burnRate 事件层首次引用） ======
    {
      id: "h640b_runway_alarm", phase: "corporate", _isChainEvent: false, icon: "⏳",
      title: "跑道警报",
      story: "财务表格上的数字亮起了红灯——{desc}",
      triggers: { minDay: 80, interval: 90, maxRepeats: 5, excludeFlags: ["_h640bRunwayAlarmCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._h640bRunwayAlarmCooldown) return false;
        var c = st.startup && st.startup.company;
        if (!c || typeof c.burnRate !== "number" || !(c.burnRate > 0)) return false;
        var runwayMonths = (c.cashReserve || 0) / c.burnRate;
        return isFinite(runwayMonths) && runwayMonths < 2;
      },
      choices: [
        { text: "✂️ 砍开支降烧钱", hint: "烧钱率-20%,士气-8,声誉-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bRunwayAlarmCooldown = true;
          var c = st.startup && st.startup.company;
          if (c) {
            c.burnRate = Math.max(1000, Math.round((c.burnRate || 10000) * 0.8));
            if (typeof c.morale === "number") c.morale = Math.max(0, c.morale - 8);
            c.reputation = Math.max(0, (c.reputation || 30) - 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("✂️ 你砍掉了零食柜、团建预算和两个外包合同。'活下去比什么都重要。' 烧钱率-20%,士气-8,声誉-3。", "warning");
        }},
        { text: "💰 自掏腰包续命", hint: "个人现金-10000→公司账上+10000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bRunwayAlarmCooldown = true;
          var c = st.startup && st.startup.company;
          var cash = (st.resources && st.resources.cash) || 0;
          var inject = Math.min(10000, cash);
          if (st.resources) st.resources.cash = Math.max(0, cash - inject);
          if (c) c.cashReserve = (c.cashReserve || 0) + inject;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你把个人积蓄¥" + inject.toLocaleString() + "转进了公司账户。'我自己的公司,我不救谁救。' 跑道延长了,但个人风险也上去了。", "warning");
        }},
        { text: "🙏 硬扛等融资", hint: "心智-5,股东信任-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bRunwayAlarmCooldown = true;
          var c = st.startup && st.startup.company;
          if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 5);
          if (c && typeof c.shareholderTrust === "number") c.shareholderTrust = Math.max(0, c.shareholderTrust - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 你决定赌下一轮融资能及时到账。每天睁眼第一件事就是看银行余额,头发一把一把地掉。心智-5,股东信任-3。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var c = st.startup && st.startup.company;
        var burn = (c && c.burnRate) || 0;
        var reserve = (c && c.cashReserve) || 0;
        var months = burn > 0 ? (reserve / burn).toFixed(1) : "?";
        return "账上还有¥" + reserve.toLocaleString() + ",每月烧¥" + burn.toLocaleString() + "——跑道只剩" + months + "个月。CFO(其实就是兼职会计)把报表推到你面前:'老板,该做决定了。'";
      }
    },

    // ====== H→D: 董事晚宴（boardMembers/shareholderTrust P1-6系统事件层首次引用） ======
    {
      id: "h640b_board_trust_dinner", phase: "corporate", _isChainEvent: false, icon: "🍷",
      title: "董事晚宴",
      story: "一场饭局,也是一场没有硝烟的股东关系经营——{desc}",
      triggers: { minDay: 100, interval: 120, maxRepeats: 4, excludeFlags: ["_h640bBoardDinnerCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._h640bBoardDinnerCooldown) return false;
        var c = st.startup && st.startup.company;
        return !!(c && Array.isArray(c.boardMembers) && c.boardMembers.length >= 1);
      },
      choices: [
        { text: "🍷 设宴坦诚相待", hint: "股东信任+6,满意度+4,现金-2500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bBoardDinnerCooldown = true;
          var c = st.startup && st.startup.company;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2500);
          if (c) {
            if (typeof c.shareholderTrust === "number") c.shareholderTrust = Math.min(100, c.shareholderTrust + 6);
            if (typeof c.shareholderSatisfaction === "number") c.shareholderSatisfaction = Math.min(100, c.shareholderSatisfaction + 4);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍷 晚宴上你没有回避问题,把难处和计划都摊开讲。'创始人肯说真话,比什么都值钱。'一位董事举杯。股东信任+6,满意度+4,现金-2500。", "success");
        }},
        { text: "📊 只发季报不赴宴", hint: "省钱,但股东信任-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h640bBoardDinnerCooldown = true;
          var c = st.startup && st.startup.company;
          if (c && typeof c.shareholderTrust === "number") c.shareholderTrust = Math.max(0, c.shareholderTrust - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你以'专注业务'为由婉拒了饭局,只发了一份数据翔实的季报。数字很好,但人情账上,你悄悄扣了分。股东信任-2。", "info");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var c = st.startup && st.startup.company;
        var n = (c && c.boardMembers && c.boardMembers.length) || 1;
        var trust = (c && typeof c.shareholderTrust === "number") ? c.shareholderTrust : 50;
        return "董事会的" + n + "位成员轮流暗示'好久没坐下来聊聊了'。当前股东信任度" + trust + "。在中国做生意,饭桌上谈成的事,常常比会议室里多。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
