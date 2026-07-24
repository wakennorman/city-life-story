/**
 * 域E联动增强：正收益验证 + 投资×创业安全网 + 被动收入超越
 * [全系统自洽修复] 域E R176: investment盈利叙事首次被事件消费
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== 事件1: 正收益验证 =====
  var positive_validation = {
    id: "positive_validation",
    title: "\u4f60\u6253\u8d62\u4e86\u5e02\u573a",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags || !st.investment) return false;
      if (st.flags._positiveValidation) return false;
      // [全系统自洽修复] 域B 修复:原读 _lastProfitableTrade(全库无写入点,恒null→死条件),改持股市值>0且组合有正收益
      var inv = st.investment;
      var holds = inv.stockHoldings || [];
      if (holds.length === 0) return false;
      var sm = inv.stockMarket || {};
      var pv = 0;
      for (var i = 0; i < holds.length; i++) {
        var m = sm[holds[i].symbol];
        if (m && isFinite(m.price) && isFinite(holds[i].shares)) pv += m.price * holds[i].shares;
      }
      if (pv <= 0) return false;
      return true;
    },
    probability: 0.05,
    getStory: function (st) {
      // [\u5168\u7cfb\u7edf\u81ea\u6d3d\u4fee\u590d] \u57dfB \u4fee\u590d:\u539f\u5f15\u7528 _lastProfitableTrade(\u4e0d\u5b58\u5728),\u6539\u8bfb\u771f\u5b9e\u6301\u4ed3
      var holds = (st.investment && st.investment.stockHoldings) || [];
      var sm = (st.investment && st.investment.stockMarket) || {};
      var topSymbol = holds[0] && holds[0].symbol;
      var m = topSymbol && sm[topSymbol];
      if (m) return "\u4f60\u73b0\u5728\u6301\u6709" + topSymbol + "\uff0c\u5f53\u524d\u4ef7" + Math.round(m.price) + "\u5143\u3002\n\n\u4f60\u7a81\u7136\u610f\u8bc6\u5230\u2014\u2014\u4f60\u521a\u624d\u505a\u4e86\u4e00\u4e2a\u6b63\u786e\u7684\u51b3\u5b9a\u3002\n\n\u4f60\u6ca1\u6709\u88ab\u9519\u8fc7\uff0c\u4e5f\u6ca1\u6709\u8ddf\u98ce\u3002\u4f60\u5728\u6b63\u786e\u7684\u65f6\u673a\u3001\u4ee5\u6b63\u786e\u7684\u4ef7\u683c\u3001\u5356\u4e86\u6b63\u786e\u7684\u4e1c\u897f\u3002";
      return "\u4f60\u6210\u529f\u5356\u51fa\u4e86\u4e00\u7b14\u6709\u76ca\u7684\u80a1\u7968\u3002";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._positiveValidation = true;
      if (choiceId === "keep_holding") {
        st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
        StateManager.addMessage("\u2705 \u4f60\u9009\u62e9\u4e86\u7406\u6027\u6210\u957f\u3002\u6295\u8d44\u4e0d\u662f\u6253\u724c\uff0c\u662f\u6280\u80fd\u3002\u667a\u529b+2\u3002", "success");
      } else if (choiceId === "bank_deposit") {
        st.resources.cash = (st.resources.cash || 0) + 500;
        StateManager.addMessage("\u2705 \u843d\u889d\u4e3a\u5b89\u3002\u4f60\u628a\u90e8\u5206\u5229\u6da6\u5b58\u8fdb\u4e86\u94f6\u884c\u3002", "info");
      } else {
        st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
        StateManager.addMessage("\u2705 \u4f60\u60f3\u518d\u52a0\u4ed3\u3002\u4f46\u8d2a\u5a6a\u53ef\u80fd\u662f\u4e0b\u4e00\u6b21\u7684\u6559\u8bad\u3002", "warning");
      }
    },
    choices: [
      { text: "\u7ee7\u7eed\u6301\u6709\uff0c\u8ba9\u5229\u6da6\u8dd1", id: "keep_holding" },
      { text: "\u843d\u889d\u4e3a\u5b89\uff0c\u5b58\u94f6\u884c", id: "bank_deposit" },
      { text: "\u518d\u52a0\u4ed3\uff0c\u8d76\u70ed\u6253\u94c1", id: "add_position" },
    ],
    icons: ["\u2705", "\u80a1\u7968"],
  };

  // ===== 事件2: \u6295\u8d44\times\u521b\u4e1a\u5b89\u5168\u7f51 =====
  var invest_startup_safety_net = {
    id: "invest_startup_safety_net",
    title: "\u4f60\u7684\u5e95\u7ebf",
    phase: "corporate",
    repeatable: false,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.startup || !st.startup.company) return false;
      if (st.flags._investStartupSafetyNetDone) return false;
      var inv = st.investment;
      var hasStock = inv && inv.stockHoldings && inv.stockHoldings.length > 0;
      var hasBtc = inv && (inv.btcHoldings || 0) > 0;
      var hasProp = inv && inv.properties && inv.properties.length > 0;
      return hasStock || hasBtc || hasProp;
    },
    probability: 0.1,
    getStory: function (st) {
      var companyName = st.startup.company.name || "\u4f60\u7684\u516c\u53f8";
      return companyName + "\u7684\u73b0\u91d1\u6d41\u7d27\u5f20\u4e86\u3002\u4f60\u6253\u5f00\u6295\u8d44APP\u2014\u2014\u54c7\u54c7\uff0c\u8fd8\u6709\u4e00\u4e9b\u5e95\u5e93\u3002\n\n\u8fd9\u5c31\u662f\u201c\u4e0d\u8981\u628a\u86cb\u74dc\u653e\u5728\u4e00\u4e2a\u7bee\u5b50\u91cc\u201d\u7684\u542b\u4e49\u3002";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._investStartupSafetyNetDone = true;
      if (choiceId === "sell_invest") {
        st.flags._investRebalanced = true;
        st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        StateManager.addMessage("\u4f60\u5356\u4e86\u4e00\u90e8\u5206\u6295\u8d44\u8865\u73b0\u91d1\u6d41\u3002\u8fd9\u4e0d\u662f\u5931\u8d25\u2014\u2014\u662f\u8c03\u6574\u3002", "info");
      } else if (choiceId === "hold_course") {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
        StateManager.addMessage("\u4f60\u51b3\u5b9a\u575a\u6301\u4e0b\u53bb\u3002\u4e0d\u9760\u6295\u8d44\u586b\u5751\u2014\u2014\u8fd9\u662f\u5bf9\u81ea\u5df1\u4fe1\u5ff5\u7684\u6d4b\u8bd5\u3002", "success");
      } else {
        st.flags._lessonDiversification = true;
        st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
        StateManager.addMessage("\u4f60\u53ea\u662f\u8bb0\u4f4f\u4e86\u2014\u2014\u4ece\u6b64\u4ee5\u540e\u4e0d\u518d\u628a\u6240\u6709\u7684\u94b1\u6253\u5728\u4e00\u4e2a\u7bee\u5b50\u91cc\u3002", "hint");
      }
    },
    choices: [
      { text: "\u5356\u90e8\u5206\u6295\u8d44\u8865\u73b0\u91d1\u6d41", id: "sell_invest" },
      { text: "\u575a\u6301\u4e0b\u53bb\uff0c\u4e0d\u9760\u6295\u8d44", id: "hold_course" },
      { text: "\u4ec0\u4e48\u90fd\u4e0d\u505a\uff0c\u5c31\u8bb0\u4f4f\u8fd9\u4e00\u6b21", id: "just_remember" },
    ],
    icons: ["\u4e0b\u7ebf", "\u4e09\u89d2"],
  };

  // ===== 事件3: \u88ab\u52a8\u6536\u5165\u8d85\u8d8a\u4e3b\u52a8\u6536\u5165 =====
  var passive_income_identity = {
    id: "passive_income_identity",
    title: "\u4f60\u4e0d\u518d\u5355\u7eaf\u9760\u5de5\u8d44\u4e86",
    phase: "street",
    repeatable: false,
    priority: 90,
    conditions: function (st) {
      if (!st || !st.flags || !st.investment) return false;
      if (st.flags._passiveIncomeIdentityShift) return false;
      var totalAssets = (st.resources && (st.resources.cash || 0) + (st.resources.bankBalance || 0)) || 0;
      if (totalAssets < 10000) return false;
      return true;
    },
    probability: 0.04,
    getStory: function (st) {
      return "\u4eca\u5929\u53d1\u5de5\u8d44\u7684\u65e5\u5b50\uff0c\u4f60\u60ef\u5e38\u6027\u5730\u6253\u5f00\u6295\u8d44APP\u2014\u2014\u7136\u540e\u5413\u4e86\u4e00\u8def\u3002\n\n\u672c\u6708\u7684\u5229\u606f+\u79df\u91d1+\u80a1\u606f\u603b\u8ba1\u6bd4\u4f60\u4e0a\u73ed\u633a\u591a\u3002\n\n\u4f60\u7a81\u7136\u610f\u8bc6\u5230\u4e00\u4ef6\u5f88\u5fae\u5999\u7684\u4e8b\u60c5\uff1a\u4f60\u4e0d\u518d\u662f'\u9760\u4e00\u4efd\u5de5\u4f5c\u6d3b\u7740\u7684\u4eba'\u4e86\u3002";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      st.flags._passiveIncomeIdentityShift = true;
      st.flags._passiveFree = true;
      if (choiceId === "rest_day") {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        StateManager.addMessage("\u2728 \u7ed9\u81ea\u5df1\u653e\u4e00\u5929\u5047\u3002\u4f60\u503c\u5f97\u3002\u8fd9\u4e0d\u662f\u6684\u5bcc\u2014\u2014\u8fd9\u662f\u5c0f\u786e\u3002", "success");
      } else if (choiceId === "reinvest") {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
        st.flags._reinvestFlag = true;
        StateManager.addMessage("\u2728 \u4f60\u51b3\u5b9a\u7ee7\u7eed\u52a0\u7801\u3002\u8fd9\u4e9b\u94b1\u4e0d\u4f1a\u8ba9\u4f60\u505c\u4e0b\u6765\u3002", "info");
      } else {
        st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        StateManager.addMessage("\u2728 \u4f60\u7528\u8fd9\u7b14\u94b1\u4e70\u4e86\u4e00\u4ef6\u597d\u4e1c\u897f\u3002\u4eb2\u7231\u7684\u4e1c\u897f\uff0c\u4e0d\u662f\u5de5\u5177\u3002", "hint");
      }
    },
    choices: [
      { text: "\u7ed9\u81ea\u5df1\u653e\u4e00\u5929\u5047", id: "rest_day" },
      { text: "\u7ee7\u7eed\u52a0\u7801\u6295\u8d44", id: "reinvest" },
      { text: "\u4e70\u4ef6\u597d\u4e1c\u897f\u5956\u52b1\u81ea\u5df1", id: "buy_gift" },
    ],
    icons: ["\u2728", "\u81ea\u7531"],
  };

  // ===== IIFE\u6ce8\u5165 =====
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(positive_validation, invest_startup_safety_net, passive_income_identity);
  }
})();
