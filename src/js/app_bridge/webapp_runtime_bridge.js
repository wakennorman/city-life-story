/**
 * Web App runtime bridge (Phase 1)
 *
 * 让新架构的第一批数据化玩法进入旧游戏，不替代 legacy runtime。
 * v3.8+: 从 3 个城市服务扩展到 7 个，新增自动推荐和 TS 数据目录摘要。
 */
(function () {
  var APP_SAVE_SCHEMA_VERSION = 2;
  var BRIDGE_VERSION = "0.3.0";

  var DATA_CATALOG_SUMMARY = {
    version: "ts-data-phase3",
    totalRecords: 93,
    catalogs: [
      { id: "cityServices", name: "城市服务", count: 7, status: "playable" },
      { id: "lifeNodes", name: "人生节点", count: 4, status: "partial" },
      { id: "events", name: "事件", count: 12, status: "typed" },
      { id: "jobs", name: "职业", count: 12, status: "typed" },
      { id: "locations", name: "地点", count: 14, status: "typed" },
      { id: "items", name: "物品", count: 17, status: "typed" },
      { id: "diseases", name: "疾病", count: 12, status: "typed" },
      { id: "legal", name: "法律案件", count: 7, status: "typed" },
      { id: "travel", name: "旅行目的地", count: 8, status: "partial" },
    ],
  };

  var CITY_SERVICE_ACTIONS = [
    // === 原基础 3 个服务 ===
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

    // === v3.8 新增：金融 ===
    {
      id: "social_security_query",
      title: "社保缴纳查询",
      icon: "🏛️",
      category: "financial",
      locationIds: ["gov_office"],
      cost: 0,
      apCost: 3,
      brief: "查询社保缴纳记录，了解医保/养老/失业累计情况。",
    },
    {
      id: "credit_report_query",
      title: "个人信用报告",
      icon: "📊",
      category: "financial",
      locationIds: ["bank"],
      cost: 20,
      apCost: 3,
      brief: "查询个人征信报告，了解贷款资格和利率信息。",
    },
    {
      id: "housing_fund_query",
      title: "公积金提取咨询",
      icon: "💰",
      category: "financial",
      locationIds: ["gov_office"],
      cost: 0,
      apCost: 2,
      brief: "咨询住房公积金提取条件和流程，为买房做准备。",
    },

    // === v3.8 新增：健康 ===
    {
      id: "community_health_check",
      title: "社区免费体检",
      icon: "🏥",
      category: "health",
      locationIds: ["hospital", "park"],
      cost: 0,
      apCost: 4,
      brief: "社区组织的免费基础体检，了解身体状况。",
    },
  ];

  function ensureWebAppSaveMeta(state) {
    var now = Date.now();
    if (
      !state._webApp ||
      state._webApp.schemaVersion < APP_SAVE_SCHEMA_VERSION
    ) {
      var old = state._webApp || {};
      state._webApp = {
        schemaVersion: APP_SAVE_SCHEMA_VERSION,
        firstMigratedAt: old.firstMigratedAt || now,
        lastMigratedAt: now,
        cityServices: {
          used: (old.cityServices && old.cityServices.used) || {},
          followUps: (old.cityServices && old.cityServices.followUps) || {},
          legalPrep: (old.cityServices && old.cityServices.legalPrep) || 0,
          medicalRefunds:
            (old.cityServices && old.cityServices.medicalRefunds) || 0,
          dayTrips: (old.cityServices && old.cityServices.dayTrips) || 0,
          lastActionDay:
            old.cityServices &&
            typeof old.cityServices.lastActionDay === "number"
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
    if (!state.flags) state.flags = {};
    return state._webApp;
  }

  function currentState() {
    return typeof StateManager !== "undefined" ? StateManager.getState() : null;
  }

  function getAction(actionId) {
    for (var i = 0; i < CITY_SERVICE_ACTIONS.length; i++) {
      if (CITY_SERVICE_ACTIONS[i].id === actionId)
        return CITY_SERVICE_ACTIONS[i];
    }
    return null;
  }

  function canPay(state, action) {
    if ((state.resources.cash || 0) < action.cost) {
      return "现金不足，需要¥" + action.cost;
    }
    if ((state.player.actionPoints || 0) < action.apCost) {
      return "行动力不足，需要" + action.apCost + "行动力";
    }
    return "";
  }

  function getPlayerHealth(state) {
    if (state && state.status && typeof state.status.health === "number") {
      return state.status.health;
    }
    if (state && state.player && typeof state.player.health === "number") {
      return state.player.health;
    }
    return 100;
  }

  function addPlayerHealth(state, amount) {
    if (!state) return;
    if (state.status && typeof state.status.health === "number") {
      state.status.health = Math.min(100, state.status.health + amount);
      return;
    }
    state.player.health = Math.min(100, (state.player.health || 100) + amount);
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
    state.player.actionPoints = Math.max(
      0,
      (state.player.actionPoints || 0) - action.apCost,
    );
    meta.cityServices.used[action.id] =
      (meta.cityServices.used[action.id] || 0) + 1;
    meta.cityServices.lastActionDay = state.player.day || 1;

    // -- 基础 3 个服务 --
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
        var refund = Math.max(
          60,
          Math.min(260, Math.round(baseSpent * 0.06) + 60),
        );
        state.resources.cash += refund;
        meta.cityServices.medicalRefunds += refund;
        StateManager.addMessage(
          "🪪 医保窗口复核成功，追回报销差额¥" + refund + "。",
          "success",
        );
      } else {
        state.medical.consultVoucher = (state.medical.consultVoucher || 0) + 1;
        state.needs.happiness = Math.min(
          100,
          (state.needs.happiness || 50) + 3,
        );
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

      // -- 新增：金融 --
    } else if (action.id === "social_security_query") {
      state.flags._socialCredit = (state.flags._socialCredit || 0) + 1;
      state.player.fame = Math.min(100, (state.player.fame || 0) + 1);
      StateManager.addMessage(
        "🏛️ 工作人员打印了你的社保缴费明细，这几年没白干。",
        "info",
      );
    } else if (action.id === "credit_report_query") {
      state.flags._creditChecked = (state.flags._creditChecked || 0) + 1;
      StateManager.addMessage(
        "📊 征信报告显示你的记录良好。银行愿意给你更好的贷款条件。",
        "success",
      );
    } else if (action.id === "housing_fund_query") {
      state.flags._housingFundChecked =
        (state.flags._housingFundChecked || 0) + 1;
      StateManager.addMessage(
        "💰 你了解了公积金提取政策，发现存的钱比想象中多。",
        "info",
      );

      // -- 新增：健康 --
    } else if (action.id === "community_health_check") {
      state.flags._healthChecked = true;
      addPlayerHealth(state, 2);
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1);
      StateManager.addMessage(
        "🏥 体检结果显示你总体健康，但医生提醒要注意休息和饮食。",
        "info",
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

    // 劳动预检后续
    if (
      used.labor_dispute_precheck > 0 &&
      markFollowUp(meta, "labor_case_confidence")
    ) {
      state.legal.caseConfidence = (state.legal.caseConfidence || 0) + 5;
      state.legal.laborEvidencePrepared = true;
      StateManager.addMessage(
        "📎 昨天整理的劳动材料派上用场了。你把合同、工资流水和聊天记录装进同一个文件夹，法律纠纷底气+5。",
        "info",
      );
    }

    // 医保复核后续
    if (
      used.insurance_bill_review > 0 &&
      markFollowUp(meta, "medical_cost_awareness")
    ) {
      state.medical.costAwareness = (state.medical.costAwareness || 0) + 1;
      state.medical.billingNoteReady = true;
      StateManager.addMessage(
        "🧾 你把医保复核结果记进账本。以后看到检查单和药费明细，不会再只剩一句“怎么这么贵”。",
        "info",
      );
    }

    // 微旅行后续
    if (
      used.weekend_micro_trip > 0 &&
      markFollowUp(meta, "local_familiarity")
    ) {
      state.travel.localFamiliarity = (state.travel.localFamiliarity || 0) + 1;
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 2);
      StateManager.addMessage(
        "🗺️ 昨天的城市漫游留下了路线记忆。你知道哪条巷子便宜、哪班公交不绕路，城市熟悉度+1。",
        "info",
      );
    }

    // 信用报告后续：解锁贷款利率信息
    if (
      used.credit_report_query > 0 &&
      markFollowUp(meta, "credit_loan_info")
    ) {
      StateManager.addMessage(
        "💳 你的信用报告已归档。以后贷款时记得告诉银行你有良好信用记录，利率可以谈。",
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

  /**
   * 基于玩家状态推荐城市服务（v3.8 新增）
   * 返回推荐服务列表，最多 3 条。
   */
  function getRecommendedCityServices(state) {
    if (!state) return [];
    var meta = ensureWebAppSaveMeta(state);
    var recs = [];

    // 健康低→推荐体检
    if (!state.flags._healthChecked && getPlayerHealth(state) < 70) {
      var found = getAction("community_health_check");
      if (found)
        recs.push({
          action: found,
          reason: "你的健康状况不太好，建议去社区做免费体检",
        });
    }

    // 现金充裕且没查过信用→推荐信用报告
    if (!state.flags._creditChecked && (state.resources.cash || 0) > 500) {
      var found = getAction("credit_report_query");
      if (found)
        recs.push({
          action: found,
          reason: "你手头有闲钱，查下征信看看贷款资格",
        });
    }

    // 工作超过 60 天→推荐社保查询
    if (!state.flags._socialCredit && (state.player.day || 0) >= 60) {
      var found = getAction("social_security_query");
      if (found)
        recs.push({
          action: found,
          reason: "你已经打了一段时间工，该查查社保缴纳情况了",
        });
    }

    // 心情低→推荐微旅行
    if (
      (state.needs.happiness || 50) < 40 &&
      (state.resources.cash || 0) >= 180
    ) {
      var found = getAction("weekend_micro_trip");
      if (found)
        recs.push({ action: found, reason: "心情不太好，周末出去走走散散心" });
    }

    return recs.slice(0, 3);
  }

  function getDataCatalogSummary() {
    return {
      version: DATA_CATALOG_SUMMARY.version,
      totalRecords: DATA_CATALOG_SUMMARY.totalRecords,
      catalogs: DATA_CATALOG_SUMMARY.catalogs.slice(),
    };
  }

  function showCityServiceModal() {
    if (typeof showModal !== "function") return;
    var state = currentState();
    if (!state) return;
    ensureWebAppSaveMeta(state);
    var actions = actionsForCurrentLocation(state);
    var body =
      '<div style="font-size:13px;line-height:1.7;">' +
      "<p>城市服务中心集成了政务、金融、健康等公共服务入口。每个服务都会真实影响你的游戏状态。</p>";

    if (actions.length === 0) {
      body +=
        '<p style="color:var(--text-secondary);">当前地点暂无城市服务入口。试试去政府办事大厅、医院、银行或公园。</p>';
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
          '点行动力<br><span style="color:var(--text-secondary);">' +
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
      desc: "Web App 新架构接入的政务/金融/健康/医疗/旅行服务入口。",
      icon: "🏙️",
      category: "生活服务",
      apCost: 0,
      handler: showCityServiceModal,
    });
  }

  if (typeof window !== "undefined") {
    window.WEBAPP_CITY_SERVICE_ACTIONS = CITY_SERVICE_ACTIONS;
    window.WEBAPP_DATA_CATALOG_SUMMARY = DATA_CATALOG_SUMMARY;
    window.addWebAppBridgeActions = addWebAppBridgeActions;
    window.WebAppBridge = {
      version: BRIDGE_VERSION,
      ensureSaveMeta: ensureWebAppSaveMeta,
      showCityServiceModal: showCityServiceModal,
      applyCityService: applyCityService,
      tickCityServices: tickWebAppCityServices,
      getRecommendedCityServices: getRecommendedCityServices,
      getDataCatalogSummary: getDataCatalogSummary,
    };

    window.MECHANICS = window.MECHANICS || {};
    window.MECHANICS.webapp_bridge = {
      id: "webapp_bridge",
      name: "Web App 桥接架构",
      icon: "🏙️",
      brief: "Vite/TypeScript 新架构与旧游戏运行时之间的渐进迁移桥。",
      version: "phase1",
      related: [
        "mechanics:medical_system",
        "mechanics:legal_system",
        "mechanics:travel_system",
      ],
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
            "社保缴纳查询：社会信用资产追踪",
            "个人信用报告：贷款资格与利率信息",
            "公积金提取咨询：住房改善信息",
            "社区免费体检：低成本健康检查和预防",
            "城市服务推荐：基于玩家状态自动推荐",
            "TS 数据目录摘要：事件/职业/地点/物品/疾病/法律/旅行已填充",
          ],
        },
      ],
    };
  }
})();
