/**
 * Web App runtime bridge (Phase 1)
 *
 * 让第一批数据化城市服务进入旧游戏，不替代 legacy runtime。
 * v3.8+: 从 3 个城市服务扩展到 7 个，新增自动推荐和内容目录摘要。
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
      { id: "events", name: "事件", count: 19, status: "typed" },
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
    state.status = state.status || {};
    state.status.health = Math.min(100, (state.status.health || 100) + amount); // [R620 A类修复] state.player.health死字段→state.status.health
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
      state.flags._firstCheckup = true; // 成就：体检
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

    // 信用报告后续：解锁贷款利率信息（消费点：finance.js calculateLoanCapacity 读 _creditInfoReady 降利率一档）
    if (
      used.credit_report_query > 0 &&
      markFollowUp(meta, "credit_loan_info")
    ) {
      state.flags._creditInfoReady = true;
      StateManager.addMessage(
        "💳 你的信用报告已归档（记录良好）。以后贷款利率可降一档，创业融资额度也会上调。",
        "success",
      );
    }

    // 社保查询后续：累计≥3次激活社保卡（消费点：finance.js 读 _socialCardReady 作贷款信用佐证加成额度）
    if (
      used.social_security_query > 0 &&
      (state.flags._socialCredit || 0) >= 3 &&
      !state.flags._socialCardReady &&
      markFollowUp(meta, "social_card_ready")
    ) {
      state.flags._socialCardReady = true;
      StateManager.addMessage(
        "🏛️ 社保缴纳累计达标，社保卡已激活。以后可作为银行贷款的信用佐证，提升贷款额度。",
        "success",
      );
    }

    // 公积金咨询后续：标记公积金可用（消费点已接：investment.js buyProperty 读 _housingFundAvailable → 公积金利率优惠 5% 抵扣）
    if (
      used.housing_fund_query > 0 &&
      markFollowUp(meta, "housing_fund_ready")
    ) {
      state.flags._housingFundAvailable = true;
      StateManager.addMessage(
        "💰 公积金账户确认可用。未来购房时可走公积金贷款利率（低于商贷）。",
        "info",
      );
    }

    // 体检后续：建立健康基线（消费点已接：illness.js rollDailyIllness 读 medical.healthCheckDone → 大病触发概率×0.5）
    if (
      used.community_health_check > 0 &&
      markFollowUp(meta, "health_baseline")
    ) {
      state.medical = state.medical || {};
      state.medical.healthCheckDone = true;
      state.medical.lastCheckupDay = state.player.day || 0;
      StateManager.addMessage(
        "🏥 体检建立了你的健康基线。日后若出现大病征兆，能更早预警、降低恶化概率。",
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
        var blocked = canPay(state, action);
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
          "</span>" +
          (blocked
            ? '<br><span style="color:var(--danger);">暂不可用：' +
              blocked +
              "</span>"
            : "") +
          "</div>";
      });
      body += "</div>";
    }
    body += "</div>";

    var buttons = actions.map(function (action) {
      var blocked = canPay(state, action);
      return {
        text: action.icon + " " + action.title,
        cls: blocked ? "" : "btn-primary",
        callback: function () {
          if (blocked) {
            StateManager.addMessage("⚠️ " + blocked, "warning");
            return false;
          }
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
      desc: "政务、金融、健康、医疗、旅行等城市公共服务入口。",
      icon: "🏙️",
      category: "生活服务",
      apCost: 0,
      handler: showCityServiceModal,
    });
  }

  // ============================================================
  // TS 事件目录 bridge — 首批城市生存事件（手工同步自 src/app/data/events/index.ts）
  // 转换规则：TS effects[] → legacy apply(st)；TS prerequisites[] → conditions(st)
  // ============================================================
  var WEBAPP_TYPED_EVENTS = [
    {
      id: "webapp_rent_arrears_notice",
      phase: "street",
      icon: "🏚️",
      title: "房租催缴单",
      story:
        "房东把一张红色催缴单塞进门缝，月底之前必须给答复。催缴单上的字很短，却让整间屋子都显得更窄。",
      conditions: function (st) {
        return st.resources.cash < 1200;
      },
      choices: [
        {
          text: "💬 找房东商量宽限",
          hint: "花时间沟通，可能换来几天缓冲",
          apply: function (st) {
            st.player.charm = Math.min(100, (st.player.charm || 20) + 1);
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            StateManager.addMessage(
              "💬 房东嘴上不耐烦，最后还是给了你几天时间。",
              "info",
            );
          },
        },
        {
          text: "💰 先交一部分（¥300）",
          hint: "现金压力变大，但房东态度缓和",
          cost: 300,
          apply: function (st) {
            if (st.resources.cash < 300) {
              StateManager.addMessage(
                "💸 现金不足 ¥300，无法先交部分房租。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 300;
            st.flags._rentTrust = (st.flags._rentTrust || 0) + 1;
            StateManager.addMessage(
              "💰 你把零钱凑成一沓，至少今晚能睡得踏实一点。",
              "success",
            );
          },
        },
        {
          text: "🙈 先拖着",
          hint: "保住现金，但后续风险上升",
          apply: function (st) {
            st.flags._rentArrears = (st.flags._rentArrears || 0) + 1;
            st.needs.happiness = Math.max(0, st.needs.happiness - 8);
            StateManager.addMessage(
              "🙈 你把单子压在杯子下面，心里知道这事不会自己消失。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "webapp_factory_overtime_choice",
      phase: "street",
      icon: "🏭",
      title: "临时加班名额",
      story:
        "主管问谁愿意留下来赶一批急单，钱不多，但今天就结。机器还在响，工位上的人都在看主管手里的名单。",
      choices: [
        {
          text: "💪 留下加班",
          hint: "换现金，也换疲劳",
          apply: function (st) {
            st.resources.cash += 140;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 18);
            st.player.physique = Math.max(0, (st.player.physique || 22) - 1);
            StateManager.addMessage(
              "🏭 你把最后一箱货码好时，天已经黑透。+¥140，体力消耗较大。",
              "success",
            );
          },
        },
        {
          text: "😌 婉拒回去休息",
          hint: "少赚一点，保住状态",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            st.needs.happiness = Math.min(100, st.needs.happiness + 2);
            StateManager.addMessage(
              "😌 你第一次觉得，能按时下班也是一种收入。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_platform_account_ban",
      phase: "street",
      icon: "📱",
      title: "平台账号警告",
      story:
        "兼职平台提示你近期接单异常，继续违规可能封号。手机震了一下，系统通知比催债短信还冷。",
      conditions: function (st) {
        return (st.flags._sideHustleOrders || 0) > 5;
      },
      choices: [
        {
          text: "📋 提交申诉材料",
          hint: "耗费行动力，降低封号风险",
          apply: function (st) {
            st.player.actionPoints = Math.max(
              0,
              (st.player.actionPoints || 0) - 2,
            );
            st.flags._platformTrust = (st.flags._platformTrust || 0) + 1;
            StateManager.addMessage(
              "📋 你把截图和说明一张张传上去，至少留了条后路。行动力-2",
              "info",
            );
          },
        },
        {
          text: "🚀 继续冲单",
          hint: "短期多赚，长期不稳",
          apply: function (st) {
            st.resources.cash += 90;
            st.flags._platformRisk = (st.flags._platformRisk || 0) + 1;
            StateManager.addMessage(
              "🚀 今晚的单很多，+¥90。但风险在悄悄累积...",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "webapp_subway_help_elder",
      phase: "street",
      icon: "🚇",
      title: "地铁口的老人",
      story:
        "一位老人站在闸机前，不知道怎么用手机刷码。人流从你身边擦过去，老人攥着手机显得有点窘迫。",
      choices: [
        {
          text: "🤝 停下来帮忙",
          hint: "花一点时间，获得小小善意",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            st.needs.happiness = Math.min(100, st.needs.happiness + 4);
            st.player.actionPoints = Math.max(
              0,
              (st.player.actionPoints || 0) - 1,
            );
            st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
            StateManager.addMessage(
              "🤝 闸机亮起绿灯时，老人笑着对你点了点头。幸福感+4，名气+1",
              "success",
            );
          },
        },
        {
          text: "🚶 赶时间离开",
          hint: "不耽误行程",
          apply: function (st) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 1);
            StateManager.addMessage(
              "🚶 你挤进人流，心里仍然浮着那个迟疑的背影。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_layoff_rumor",
      phase: "corporate",
      icon: "📉",
      title: "裁员传闻",
      story:
        "茶水间里有人说公司要缩编，名单可能本周就出来。传闻没有署名，却像一阵冷风吹进每个工位。",
      conditions: function (st) {
        return st.player.phase === "corporate";
      },
      choices: [
        {
          text: "📄 更新简历",
          hint: "准备后路，以防万一",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 1,
            );
            st.flags._resumeReady = 1;
            StateManager.addMessage(
              "📄 你把项目经历重新写了一遍，像给自己留下一条出口。智力+1",
              "info",
            );
          },
        },
        {
          text: "💼 主动揽活表现",
          hint: "增加绩效，也增加压力",
          apply: function (st) {
            if (st.player.corporate) {
              st.player.corporate.kpi = Math.min(
                100,
                (st.player.corporate.kpi || 20) + 3,
              );
            }
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
            StateManager.addMessage(
              "💼 你接下了额外任务，电脑屏幕亮到深夜。绩效+3，疲劳+12",
              "warning",
            );
          },
        },
      ],
    },
    // ── 第二批 bridge 事件（2026-06-27 扩充）──────────────────────────────
    {
      id: "webapp_community_volunteer",
      phase: "street",
      icon: "🤝",
      title: "社区志愿者招募",
      story:
        "居委会招人帮忙发通知、登记老人需求，报酬不高。公告栏上的纸被胶带贴得皱皱巴巴，却写着很多人的需求。",
      choices: [
        {
          text: "🤝 参加半天志愿服务",
          hint: "提升名气和幸福感",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.flags._communityService = (st.flags._communityService || 0) + 1;
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            StateManager.addMessage(
              "🤝 你跑了几栋楼，累，但觉得自己和这座城市靠近了一点。名气+2，幸福感+5",
              "success",
            );
          },
        },
        {
          text: "💰 问有没有补贴岗位",
          hint: "争取实际收入",
          apply: function (st) {
            st.resources.cash += 60;
            st.player.charm = Math.min(100, (st.player.charm || 20) + 1);
            StateManager.addMessage(
              "💰 工作人员给你安排了登记补贴岗，+¥60。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "webapp_temp_agency_call",
      phase: "street",
      icon: "📞",
      title: "劳务中介来电",
      story:
        "一家劳务中介说有批临时搬运工名额，日结，但要现在确认。号码是陌生的，语气却很熟练。",
      conditions: function (st) {
        return st.resources.cash < 500;
      },
      choices: [
        {
          text: "💪 立刻答应去",
          hint: "体力换现金，今天就到手",
          apply: function (st) {
            st.resources.cash += 180;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 22);
            st.player.physique = Math.min(100, (st.player.physique || 22) + 1);
            StateManager.addMessage(
              "💪 下午的货很重，但钱打进来的那一刻什么都值了。+¥180",
              "success",
            );
          },
        },
        {
          text: "🤔 先问清楚再决定",
          hint: "避免陷阱，提升意识",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 1,
            );
            st.needs.happiness = Math.min(100, st.needs.happiness + 1);
            StateManager.addMessage(
              "🤔 对方沉默了一秒，然后挂了电话。你记下了号码，以后再说。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_heatwave_survival",
      phase: "street",
      icon: "☀️",
      title: "高温预警",
      story:
        "气温升到 38 度，城中村没有空调，身体开始抗议。城市把所有的热都留在这条街上。",
      conditions: function (st) {
        return (st.flags._housingTier || 0) <= 1;
      },
      choices: [
        {
          text: "🌀 买台电风扇（¥80）",
          hint: "改善居住条件",
          apply: function (st) {
            if (st.resources.cash < 80) {
              StateManager.addMessage(
                "💸 现金不足 ¥80，买不起电风扇。",
                "warning",
              );
              return;
            }
            st.resources.cash -= 80;
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            st.flags._hasFan = 1;
            StateManager.addMessage(
              "🌀 风扇转着，能睡了，虽然还是热，但能睡了。-¥80，疲劳-10",
              "success",
            );
          },
        },
        {
          text: "📚 去图书馆蹭空调",
          hint: "免费避暑，顺便学习",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 1,
            );
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 8);
            st.player.actionPoints = Math.max(
              0,
              (st.player.actionPoints || 0) - 1,
            );
            StateManager.addMessage(
              "📚 图书馆的冷气均匀，书页翻起来都是凉的。智力+1，疲劳-8",
              "info",
            );
          },
        },
        {
          text: "😤 硬撑，省钱优先",
          hint: "保住现金，健康受损",
          apply: function (st) {
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
            st.status.health = Math.max(0, (st.status.health || 80) - 5);
            StateManager.addMessage(
              "😤 夜里出了一身汗，早上起来头有点晕。健康-5",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "webapp_payday_loan_ad",
      phase: "street",
      icon: "💸",
      title: "借贷广告诱惑",
      story:
        "手机弹出贷款广告：「最快5分钟到账，最高5万，免息3天。」屏幕上的数字很大，字体鲜红。",
      conditions: function (st) {
        return st.resources.cash < 300;
      },
      choices: [
        {
          text: "📖 点开看利率条款",
          hint: "了解风险，提升金融意识",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 2,
            );
            st.flags._loanRiskAware = (st.flags._loanRiskAware || 0) + 1;
            StateManager.addMessage(
              "📖 年化利率36%——你把计算器关掉，把广告也关掉了。智力+2",
              "info",
            );
          },
        },
        {
          text: "⚠️ 借一点度过难关（¥500）",
          hint: "解燃眉之急，但利息日积月累",
          apply: function (st) {
            st.resources.cash += 500;
            st.resources.debt = (st.resources.debt || 0) + 600;
            st.needs.happiness = Math.max(0, st.needs.happiness - 5);
            StateManager.addMessage(
              "⚠️ 到账短信来了，+¥500，但债务增加¥600。钱是解药，剂量算错了就是毒。",
              "warning",
            );
          },
        },
        {
          text: "❌ 关掉广告",
          hint: "拒绝高息借贷",
          apply: function (st) {
            st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
            StateManager.addMessage(
              "❌ 你划掉广告，继续数自己还剩多少现金。",
              "info",
            );
          },
        },
      ],
    },
    // ── 第三批 bridge 事件（2026-06-27 同步自 TS 目录）────────────────────
    {
      id: "webapp_medical_bill_argument",
      phase: "street",
      icon: "🧾",
      title: "账单窗口争执",
      story:
        "医院收费窗口前有人因为医保报销比例吵了起来。收费单像一串看不懂的数字，围观的人都沉默了一会儿。",
      choices: [
        {
          text: "📋 顺便咨询自己的医保",
          hint: "获得账单意识",
          apply: function (st) {
            st.flags._costAwareness = (st.flags._costAwareness || 0) + 1;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
            StateManager.addMessage(
              "🧾 窗口工作人员讲得很快，但你终于知道哪些票据要留。",
              "info",
            );
          },
        },
        {
          text: "👴 帮老人看清条目",
          hint: "花时间帮忙，换一点名声",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.player.actionPoints = Math.max(
              0,
              (st.player.actionPoints || 0) - 1,
            );
            StateManager.addMessage(
              "👴 老人连声道谢，你突然理解了账单背后的焦虑。",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "webapp_neighbor_pipe_leak",
      phase: "street",
      icon: "🚰",
      title: "邻居水管漏水",
      story:
        "楼上水管漏了，天花板慢慢洇出一圈灰色水痕。盆接住了水，却接不住你对这间屋子的疲惫。",
      conditions: function (st) {
        return (st.flags._housingTier || 0) <= 2;
      },
      choices: [
        {
          text: "🔧 带工具一起修",
          hint: "维修经验和邻里关系",
          apply: function (st) {
            st.flags._neighborTrust = (st.flags._neighborTrust || 0) + 1;
            StateManager.addMessage(
              "🔧 你们折腾半天，总算把漏点堵住了。邻里关系+1",
              "success",
            );
          },
        },
        {
          text: "📞 叫房东处理",
          hint: "省心，但可能拖延",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            st.flags._landlordRepairCalled =
              (st.flags._landlordRepairCalled || 0) + 1;
            StateManager.addMessage(
              "📞 房东说马上来，电话挂断后走廊又安静下来。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_credit_card_call",
      phase: "corporate",
      icon: "💳",
      title: "信用卡推销电话",
      story:
        "银行客服说你有机会申请一张额度不低的信用卡。电话那头的声音很专业，像在把未来收入提前递给你。",
      conditions: function (st) {
        return (
          st.player.phase === "corporate" && (st.flags._creditChecked || 0) > 0
        );
      },
      choices: [
        {
          text: "📖 问清年费和利息",
          hint: "金融意识提升",
          apply: function (st) {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 20) + 1,
            );
            st.flags._creditKnowledge = (st.flags._creditKnowledge || 0) + 1;
            StateManager.addMessage(
              "📖 你记下几个关键词，决定不让自己被额度牵着走。智力+1",
              "info",
            );
          },
        },
        {
          text: "✅ 立刻申请",
          hint: "获得额度，但诱惑也变多",
          apply: function (st) {
            st.flags._creditCardLimit = (st.flags._creditCardLimit || 0) + 3000;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            StateManager.addMessage(
              "💳 申请通过的短信很快来了，快乐和风险一起到账。额度+¥3000",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "webapp_food_safety_complaint",
      phase: "street",
      icon: "🍢",
      title: "小摊食安投诉",
      story:
        "你听见有人说附近小摊用的油有问题，摊主急得脸色发白。一口热油能养活一个摊位，也可能毁掉几个人的信任。",
      choices: [
        {
          text: "🏛️ 向市场监管投诉",
          hint: "维护规则，可能影响摊主",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
            st.flags._foodSafetyReports =
              (st.flags._foodSafetyReports || 0) + 1;
            StateManager.addMessage(
              "🏛️ 监管人员记下了线索，你知道这不讨喜，但必要。",
              "info",
            );
          },
        },
        {
          text: "🤫 私下提醒摊主",
          hint: "留情面，但承担不确定性",
          apply: function (st) {
            st.player.charm = Math.min(100, (st.player.charm || 20) + 1);
            st.flags._vendorWarnings = (st.flags._vendorWarnings || 0) + 1;
            StateManager.addMessage(
              "🤫 摊主沉默了一会儿，把油桶搬到了你看不见的地方。",
              "warning",
            );
          },
        },
      ],
    },
    {
      id: "webapp_found_shared_bike",
      phase: "street",
      icon: "🚲",
      title: "坏掉的共享单车",
      story:
        "路边一辆共享单车链条掉了，挡在盲道边。车轮歪着，像城市日常里一处没人认领的小麻烦。",
      choices: [
        {
          text: "🔧 顺手修好推开",
          hint: "维修经验，城市熟悉度",
          apply: function (st) {
            st.flags._bikeFixed = (st.flags._bikeFixed || 0) + 1;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            StateManager.addMessage(
              "🔧 链条重新咬住齿轮，你拍了拍手上的黑油。幸福感+2",
              "success",
            );
          },
        },
        {
          text: "🚶 只挪到一边",
          hint: "快速解决挡路",
          apply: function (st) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
            StateManager.addMessage(
              "🚶 至少盲道空出来了，你继续赶路。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_live_stream_collab",
      phase: "corporate",
      icon: "🎥",
      title: "临时直播搭档",
      story:
        "小丽缺一个帮忙试吃的搭档，问你愿不愿意露脸。补光灯一亮，连路边的风都像被收进了镜头。",
      choices: [
        {
          text: "🎬 参与直播",
          hint: "涨名气，也有社交压力",
          apply: function (st) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            StateManager.addMessage(
              "🎬 弹幕刷得很快，你第一次理解什么叫被看见。名气+4，疲劳+8",
              "success",
            );
          },
        },
        {
          text: "🎥 只帮忙拿设备",
          hint: "低调帮忙",
          apply: function (st) {
            st.flags._helpedStreamSetup =
              (st.flags._helpedStreamSetup || 0) + 1;
            StateManager.addMessage(
              "🎥 你把线理顺，小丽冲镜头外比了个感谢的手势。",
              "info",
            );
          },
        },
      ],
    },
    {
      id: "webapp_power_outage_night",
      phase: "street",
      icon: "🕯️",
      title: "突然停电",
      story:
        "晚上八点，整栋楼忽然断电，你手机还剩 12% 的电。黑暗来得毫无预告，手机屏幕是房间里唯一的光。",
      choices: [
        {
          text: "🏪 去便利店充电坐一会儿",
          hint: "花小钱，维持手机续航",
          apply: function (st) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            st.player.actionPoints = Math.max(
              0,
              (st.player.actionPoints || 0) - 1,
            );
            StateManager.addMessage(
              "🏪 便利店的灯很亮，店员没有催你。-¥15，幸福感+3",
              "success",
            );
          },
        },
        {
          text: "😴 干脆早点睡觉",
          hint: "省电省钱，恢复体力",
          apply: function (st) {
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            StateManager.addMessage(
              "😴 黑暗里你很快睡着，梦里不需要电。疲劳-15",
              "info",
            );
          },
        },
        {
          text: "🔌 去走廊检查空开",
          hint: "维修技能有用",
          apply: function (st) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            StateManager.addMessage(
              "🔌 跳闸了。你把闸合上，灯一个接一个重新亮了起来。幸福感+8",
              "success",
            );
          },
        },
      ],
    },
    {
      id: "webapp_workplace_conflict",
      phase: "corporate",
      icon: "😤",
      title: "办公室摩擦",
      story:
        "同事在会议上把你的方案说成了自己的，老板似乎也信了。PPT 里你的名字不见了，却还留着你的逻辑和你的例子。",
      conditions: function (st) {
        return st.player.phase === "corporate";
      },
      choices: [
        {
          text: "🤫 私下找同事谈清楚",
          hint: "直接沟通，考验情商",
          apply: function (st) {
            st.player.charm = Math.min(100, (st.player.charm || 20) + 2);
            StateManager.addMessage(
              "🤫 他承认了，说是「误会」。你知道这种误会不会只有一次。",
              "info",
            );
          },
        },
        {
          text: "📢 下次会议当场澄清",
          hint: "维护权益，有风险也有收获",
          apply: function (st) {
            StateManager.addMessage(
              "📢 老板看了看你，重新翻了翻文件。沉默比掌声更重要。",
              "info",
            );
          },
        },
        {
          text: "😌 算了，留条后路",
          hint: "忍一时，避免正面冲突",
          apply: function (st) {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            st.flags._workplaceGrievance =
              (st.flags._workplaceGrievance || 0) + 1;
            StateManager.addMessage(
              "😌 你把委屈按进肚子里，告诉自己这不是最后一仗。",
              "warning",
            );
          },
        },
      ],
    },
  ];
  /** 将 WEBAPP_TYPED_EVENTS 推入 legacy RANDOM_EVENTS 池（去重，避免重复注册） */
  function registerTypedEventBridge() {
    if (typeof RANDOM_EVENTS === "undefined") return;
    WEBAPP_TYPED_EVENTS.forEach(function (evt) {
      var exists = RANDOM_EVENTS.some(function (e) {
        return e.id === evt.id;
      });
      if (!exists) RANDOM_EVENTS.push(evt);
    });
  }

  // 立即注册（bridge 脚本加载时 events_core.js 已就绪）
  registerTypedEventBridge();

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
      registerTypedEventBridge: registerTypedEventBridge,
      typedEventCount: WEBAPP_TYPED_EVENTS.length,
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
            "TS typed 事件 bridge：19 个城市生存事件已注入随机事件池",
          ],
        },
      ],
    };
  }
})();
