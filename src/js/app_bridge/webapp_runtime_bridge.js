/**
 * Web App runtime bridge (Phase 1)
 *
 * 让新架构的第一批数据化玩法进入旧游戏，不替代 legacy runtime。
 */
(function () {
  var APP_SAVE_SCHEMA_VERSION = 2;
  var BRIDGE_VERSION = "0.1.0";

  var CITY_SERVICE_ACTIONS = [
    {
      id: "labor_dispute_precheck",
      title: "劳动争议预检",
      icon: "⚖️",
      category: "legal",
      locationIds: ["gov_office"],
      cost: 120,
      apCost: 5,
      brief: "把欠薪、裁员、合同风险先做一次材料预检。",
    },
    {
      id: "insurance_bill_review",
      title: "医保账单复核",
      icon: "🪪",
      category: "medical",
      locationIds: ["hospital"],
      cost: 30,
      apCost: 3,
      brief: "让医院医保窗口复核治疗账单，已参保时可能追回报销差额。",
    },
    {
      id: "weekend_micro_trip",
      title: "周末城市微旅行",
      icon: "🚌",
      category: "travel",
      locationIds: ["commercialDist", "park"],
      cost: 180,
      apCost: 12,
      brief: "不离开本城，坐一日公交线走完老街、公园和夜市。",
    },
  ];

  function ensureWebAppSaveMeta(state) {
    var now = Date.now();
    if (!state._webApp || state._webApp.schemaVersion < APP_SAVE_SCHEMA_VERSION) {
      var old = state._webApp || {};
      state._webApp = {
        schemaVersion: APP_SAVE_SCHEMA_VERSION,
        firstMigratedAt: old.firstMigratedAt || now,
        lastMigratedAt: now,
        cityServices: {
          used: (old.cityServices && old.cityServices.used) || {},
          followUps: (old.cityServices && old.cityServices.followUps) || {},
          legalPrep: (old.cityServices && old.cityServices.legalPrep) || 0,
          medicalRefunds: (old.cityServices && old.cityServices.medicalRefunds) || 0,
          dayTrips: (old.cityServices && old.cityServices.dayTrips) || 0,
          lastActionDay:
            old.cityServices && typeof old.cityServices.lastActionDay === "number"
              ? old.cityServices.lastActionDay
              : null,
          lastTickDay:
            old.cityServices && typeof old.cityServices.lastTickDay === "number"
              ? old.cityServices.lastTickDay
              : null,
        },
      };
    }
    if (!state.legal) state.legal = {};
    if (!state.medical) state.medical = {};
    if (!state.travel) {
      state.travel = {
        active: false,
        destination: null,
        daysRemaining: 0,
        visitedDestinations: [],
        souvenirs: [],
      };
    }
    return state._webApp;
  }

  function currentState() {
    return typeof StateManager !== "undefined" ? StateManager.getState() : null;
  }

  function getAction(actionId) {
    for (var i = 0; i < CITY_SERVICE_ACTIONS.length; i++) {
      if (CITY_SERVICE_ACTIONS[i].id === actionId) return CITY_SERVICE_ACTIONS[i];
    }
    return null;
  }

  function canPay(state, action) {
    if ((state.resources.cash || 0) < action.cost) {
      return "现金不足，需要¥" + action.cost;
    }
    if ((state.player.actionPoints || 0) < action.apCost) {
      return "行动力不足，需要" + action.apCost + "AP";
    }
    return "";
  }

  function applyCityService(actionId) {
    var action = getAction(actionId);
    var state = currentState();
    if (!action || !state) return false;

    var meta = ensureWebAppSaveMeta(state);
    var loc = state.trade && state.trade.currentLocation;
    if (action.locationIds.indexOf(loc) < 0) {
      StateManager.addMessage("⚠️ 当前地点没有这个城市服务入口。", "warning");
      return false;
    }

    var blocked = canPay(state, action);
    if (blocked) {
      StateManager.addMessage("⚠️ " + blocked, "warning");
      return false;
    }

    state.resources.cash -= action.cost;
    state.player.actionPoints = Math.max(0, (state.player.actionPoints || 0) - action.apCost);
    meta.cityServices.used[action.id] = (meta.cityServices.used[action.id] || 0) + 1;
    meta.cityServices.lastActionDay = state.player.day || 1;

    if (action.id === "labor_dispute_precheck") {
      state.legal.prepScore = (state.legal.prepScore || 0) + 1;
      state.legal.lastPrepDay = state.player.day || 1;
      meta.cityServices.legalPrep += 1;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
      StateManager.addMessage(
        "⚖️ 办事大厅窗口帮你理了一遍材料，劳动争议预检+1。",
        "success",
      );
    } else if (action.id === "insurance_bill_review") {
      state.medical.billingReviews = (state.medical.billingReviews || 0) + 1;
      if (state.medical.insurance) {
        var baseSpent = state.medical.totalMedicalSpent || 0;
        var refund = Math.max(60, Math.min(260, Math.round(baseSpent * 0.06) + 60));
        state.resources.cash += refund;
        meta.cityServices.medicalRefunds += refund;
        StateManager.addMessage("🪪 医保窗口复核成功，追回报销差额¥" + refund + "。", "success");
      } else {
        state.medical.consultVoucher = (state.medical.consultVoucher || 0) + 1;
        state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 3);
        StateManager.addMessage(
          "🪪 你弄清了医保档位，获得一次医保咨询记录。下次别再糊涂看病。",
          "info",
        );
      }
    } else if (action.id === "weekend_micro_trip") {
      state.travel.dayTrips = (state.travel.dayTrips || 0) + 1;
      state.travel.souvenirs = state.travel.souvenirs || [];
      if (state.travel.souvenirs.indexOf("城市漫游手账") < 0) {
        state.travel.souvenirs.push("城市漫游手账");
      }
      meta.cityServices.dayTrips += 1;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 16);
      state.needs.fatigue = Math.max(0, (state.needs.fatigue || 0) - 6);
      StateManager.addMessage(
        "🚌 你在城市里绕了一整圈，带回一本「城市漫游手账」。心情+16，疲劳-6。",
        "success",
      );
    }

    if (typeof renderAll === "function") renderAll();
    return true;
  }

  function markFollowUp(meta, followUpId) {
    if (meta.cityServices.followUps[followUpId]) return false;
    meta.cityServices.followUps[followUpId] = true;
    return true;
  }

  function tickWebAppCityServices(state) {
    if (!state) return;
    var meta = ensureWebAppSaveMeta(state);
    var services = meta.cityServices;
    var day = state.player.day || 1;

    if (services.lastTickDay === day) return;
    services.lastTickDay = day;

    var lastActionDay =
      typeof services.lastActionDay === "number" ? services.lastActionDay : 0;
    if (!lastActionDay || day <= lastActionDay) return;

    var used = services.used || {};
    if (used.labor_dispute_precheck > 0 && markFollowUp(meta, "labor_case_confidence")) {
      state.legal.caseConfidence = (state.legal.caseConfidence || 0) + 5;
      state.legal.laborEvidencePrepared = true;
      StateManager.addMessage(
        "📎 昨天整理的劳动材料派上用场了。你把合同、工资流水和聊天记录装进同一个文件夹，法律纠纷底气+5。",
        "info",
      );
    }

    if (used.insurance_bill_review > 0 && markFollowUp(meta, "medical_cost_awareness")) {
      state.medical.costAwareness = (state.medical.costAwareness || 0) + 1;
      state.medical.billingNoteReady = true;
      StateManager.addMessage(
        "🧾 你把医保复核结果记进账本。以后看到检查单和药费明细，不会再只剩一句“怎么这么贵”。",
        "info",
      );
    }

    if (used.weekend_micro_trip > 0 && markFollowUp(meta, "local_familiarity")) {
      state.travel.localFamiliarity = (state.travel.localFamiliarity || 0) + 1;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
      StateManager.addMessage(
        "🗺️ 昨天的城市漫游留下了路线记忆。你知道哪条巷子便宜、哪班公交不绕路，城市熟悉度+1。",
        "info",
      );
    }
  }

  function actionsForCurrentLocation(state) {
    var loc = state.trade && state.trade.currentLocation;
    return CITY_SERVICE_ACTIONS.filter(function (action) {
      return action.locationIds.indexOf(loc) >= 0;
    });
  }

  function showCityServiceModal() {
    if (typeof showModal !== "function") return;
    var state = currentState();
    if (!state) return;
    ensureWebAppSaveMeta(state);
    var actions = actionsForCurrentLocation(state);
    var body =
      '<div style="font-size:13px;line-height:1.7;">' +
      '<p>这是 Web App 新架构接入的第一批数据化城市服务。它们会真实改变状态，并写入新存档元数据。</p>';

    if (actions.length === 0) {
      body += '<p style="color:var(--text-secondary);">当前地点暂无城市服务入口。</p>';
    } else {
      body += '<div style="display:grid;gap:8px;">';
      actions.forEach(function (action) {
        body +=
          '<div style="padding:8px;border:1px solid var(--border);border-radius:6px;">' +
          "<strong>" +
          action.icon +
          " " +
          action.title +
          "</strong> · ¥" +
          action.cost +
          " · " +
          action.apCost +
          "AP<br><span style=\"color:var(--text-secondary);\">" +
          action.brief +
          "</span></div>";
      });
      body += "</div>";
    }
    body += "</div>";

    var buttons = actions.map(function (action) {
      return {
        text: action.icon + " " + action.title,
        cls: "btn-primary",
        callback: function () {
          return applyCityService(action.id);
        },
      };
    });
    buttons.push({ text: "关闭", cls: "" });

    showModal({ title: "🏙️ 城市服务中心", body: body, buttons: buttons });
  }

  function addWebAppBridgeActions(state, actions) {
    ensureWebAppSaveMeta(state);
    var available = actionsForCurrentLocation(state);
    if (available.length === 0) return;
    actions.push({
      id: "webapp_city_services",
      name: "城市服务中心",
      desc: "Web App 新架构接入的医疗/法律/微旅行服务，会真实改变存档状态。",
      icon: "🏙️",
      category: "生活服务",
      apCost: 0,
      handler: showCityServiceModal,
    });
  }

  if (typeof window !== "undefined") {
    window.WEBAPP_CITY_SERVICE_ACTIONS = CITY_SERVICE_ACTIONS;
    window.addWebAppBridgeActions = addWebAppBridgeActions;
    window.WebAppBridge = {
      version: BRIDGE_VERSION,
      ensureSaveMeta: ensureWebAppSaveMeta,
      showCityServiceModal: showCityServiceModal,
      applyCityService: applyCityService,
      tickCityServices: tickWebAppCityServices,
    };

    window.MECHANICS = window.MECHANICS || {};
    window.MECHANICS.webapp_bridge = {
      id: "webapp_bridge",
      name: "Web App 桥接架构",
      icon: "🏙️",
      brief: "Vite/TypeScript 新架构与旧游戏运行时之间的渐进迁移桥。",
      version: "phase1",
      related: ["mechanics:medical_system", "mechanics:legal_system", "mechanics:travel_system"],
      sections: [
        {
          type: "desc",
          content:
            "第一阶段不替换旧入口，而是通过桥接层把新数据化玩法接入旧行动列表，并写入 _webApp 存档元数据。",
        },
        {
          type: "list",
          title: "当前桥接内容",
          items: [
            "劳动争议预检：法律材料准备",
            "医保账单复核：医疗费用复核/报销差额",
            "周末城市微旅行：低成本旅行和心情恢复",
            "城市服务后续：次日把服务结果沉淀为法律底气、医疗账单意识和城市熟悉度",
          ],
        },
      ],
    };
  }
})();
