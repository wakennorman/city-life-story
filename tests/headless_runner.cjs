/**
 * 城市浮生记 — 无头游戏运行器
 *
 * 在 Node.js 环境中加载所有游戏脚本，提供最小 DOM/浏览器 API 存根，
 * 使得在不依赖真实浏览器的情况下可以运行游戏逻辑。
 *
 * 用于 Monte Carlo 模拟、平衡测试和自动化验证。
 *
 * 用法:
 *   const runner = require('./headless_runner');
 *   runner.init();                    // 加载所有游戏脚本
 *   const state = runner.createState({ seed: 42 });  // 创建初始状态
 *   runner.advanceDay(state, strategyFn);  // 执行一天
 */

(function () {
  "use strict";

  // ====== 配置 ======
  var PROJECT_ROOT;
  var loaded = false;
  var loadErrors = [];

  // ====== 最小 DOM 存根 ======
  function createMinimalDom() {
    // 最小 style 对象
    var styleHandler = {
      get: function (target, prop) {
        if (prop in target) return target[prop];
        return "";
      },
      set: function (target, prop, val) {
        target[prop] = String(val);
        return true;
      },
    };
    var baseStyle = new Proxy(
      {
        display: "",
        visibility: "",
        opacity: "",
        color: "",
        backgroundColor: "",
        fontSize: "",
        fontWeight: "",
        textAlign: "",
        margin: "",
        marginTop: "",
        marginBottom: "",
        marginLeft: "",
        marginRight: "",
        padding: "",
        paddingTop: "",
        paddingBottom: "",
        paddingLeft: "",
        paddingRight: "",
        border: "",
        borderRadius: "",
        width: "",
        height: "",
        minWidth: "",
        minHeight: "",
        maxWidth: "",
        maxHeight: "",
        position: "",
        top: "",
        left: "",
        right: "",
        bottom: "",
        zIndex: "",
        overflow: "",
        overflowX: "",
        overflowY: "",
        transform: "",
        transition: "",
        animation: "",
        cursor: "",
        flex: "",
        flexDirection: "",
        justifyContent: "",
        alignItems: "",
        gap: "",
        gridTemplateColumns: "",
        whiteSpace: "",
        lineHeight: "",
        background: "",
        backgroundImage: "",
        backgroundSize: "",
        backgroundPosition: "",
        boxShadow: "",
        textShadow: "",
      },
      styleHandler,
    );

    // 最小 classList 存根
    function createClassList() {
      var classes = {};
      return {
        add: function () {
          for (var i = 0; i < arguments.length; i++)
            classes[arguments[i]] = true;
        },
        remove: function () {
          for (var i = 0; i < arguments.length; i++)
            delete classes[arguments[i]];
        },
        toggle: function (c) {
          if (classes[c]) {
            delete classes[c];
            return false;
          }
          classes[c] = true;
          return true;
        },
        contains: function (c) {
          return !!classes[c];
        },
        get length() {
          return Object.keys(classes).length;
        },
        toString: function () {
          return Object.keys(classes).join(" ");
        },
      };
    }

    // 基础元素构造
    function createElement(tag) {
      var el = {
        tagName: (tag || "div").toUpperCase(),
        nodeType: 1,
        style: Object.assign({}, baseStyle),
        classList: createClassList(),
        dataset: {},
        attributes: {},
        children: [],
        parentNode: null,
        nextSibling: null,
        previousSibling: null,
        innerHTML: "",
        textContent: "",
        value: "",
        checked: false,
        disabled: false,
        src: "",
        href: "",
        id: "",
        className: "",
        scrollTop: 0,
        scrollLeft: 0,
        offsetHeight: 0,
        offsetWidth: 0,
        clientHeight: 0,
        clientWidth: 0,
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () {
          return true;
        },
        appendChild: function (child) {
          if (child && typeof child === "object") {
            child.parentNode = el;
            el.children.push(child);
          }
          return child;
        },
        remove: function () {
          // Stub for toast/popup removal
          if (el.parentNode && el.parentNode.removeChild) {
            el.parentNode.removeChild(el);
          }
        },
        removeChild: function (child) {
          var idx = el.children.indexOf(child);
          if (idx >= 0) el.children.splice(idx, 1);
          return child;
        },
        insertBefore: function (newChild, refChild) {
          newChild.parentNode = el;
          var idx = el.children.indexOf(refChild);
          if (idx >= 0) el.children.splice(idx, 0, newChild);
          else el.children.push(newChild);
          return newChild;
        },
        replaceChild: function (newChild, oldChild) {
          var idx = el.children.indexOf(oldChild);
          if (idx >= 0) {
            newChild.parentNode = el;
            el.children[idx] = newChild;
          }
          return oldChild;
        },
        cloneNode: function () {
          return createElement(tag);
        },
        setAttribute: function (k, v) {
          el.attributes[k] = String(v);
          if (k === "id") el.id = String(v);
          if (k === "class") el.className = String(v);
        },
        getAttribute: function (k) {
          return el.attributes[k] || null;
        },
        removeAttribute: function (k) {
          delete el.attributes[k];
        },
        hasAttribute: function (k) {
          return k in el.attributes;
        },
        focus: function () {},
        blur: function () {},
        click: function () {},
        scrollIntoView: function () {},
        getBoundingClientRect: function () {
          return {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
          };
        },
        querySelector: function () {
          return null;
        },
        querySelectorAll: function () {
          return [];
        },
        closest: function () {
          return null;
        },
        matches: function () {
          return false;
        },
      };
      // innerHTML setter
      Object.defineProperty(el, "innerHTML", {
        get: function () {
          return el._innerHTML || "";
        },
        set: function (v) {
          el._innerHTML = String(v);
        },
        configurable: true,
      });
      Object.defineProperty(el, "textContent", {
        get: function () {
          return el._textContent || "";
        },
        set: function (v) {
          el._textContent = String(v);
        },
        configurable: true,
      });
      return el;
    }

    // 元素映射
    var elementMap = {};

    // document 对象
    var doc = {
      createElement: function (tag) {
        return createElement(tag);
      },
      createTextNode: function (text) {
        return {
          nodeType: 3,
          textContent: String(text),
          nodeValue: String(text),
        };
      },
      createDocumentFragment: function () {
        return {
          nodeType: 11,
          children: [],
          appendChild: function (c) {
            this.children.push(c);
            return c;
          },
        };
      },
      getElementById: function (id) {
        return elementMap[id] || null;
      },
      querySelector: function () {
        return null;
      },
      querySelectorAll: function () {
        return [];
      },
      getElementsByClassName: function () {
        return [];
      },
      getElementsByTagName: function () {
        return [];
      },
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return true;
      },
      createEvent: function () {
        return { initEvent: function () {} };
      },
      documentElement: { style: baseStyle },
      body: createElement("body"),
      head: createElement("head"),
      title: "",
      referrer: "",
      URL: "http://localhost/",
      domain: "localhost",
      cookie: "",
      readyState: "complete",
      visibilityState: "visible",
      hidden: false,
      // register element for getElementById
      _registerElement: function (id, el) {
        if (id) elementMap[id] = el;
      },
      _unregisterElement: function (id) {
        delete elementMap[id];
      },
      _clearElements: function () {
        elementMap = {};
      },
    };
    doc.body.ownerDocument = doc;
    doc.head.ownerDocument = doc;

    return doc;
  }

  // ====== 最小 localStorage 存根 ======
  function createLocalStorage() {
    var store = {};
    return {
      _data: store,
      getItem: function (k) {
        return store[k] !== undefined ? String(store[k]) : null;
      },
      setItem: function (k, v) {
        store[k] = String(v);
      },
      removeItem: function (k) {
        delete store[k];
      },
      clear: function () {
        store = {};
        this._data = store;
      },
      get length() {
        return Object.keys(store).length;
      },
      key: function (i) {
        var keys = Object.keys(store);
        return i < keys.length ? keys[i] : null;
      },
    };
  }

  // ====== 设置全局存根 ======
  function setupStubs() {
    var doc = createMinimalDom();
    var ls = createLocalStorage();
    var perfNow = function () {
      var hrt = process.hrtime();
      return hrt[0] * 1000 + hrt[1] / 1000000;
    };

    // 浏览器全局 - 用 try-catch 包裹只读 getter
    var setGlobal = function (key, value) {
      try {
        globalThis[key] = value;
      } catch (e) {
        try {
          Object.defineProperty(globalThis, key, {
            value: value,
            writable: true,
            configurable: true,
          });
        } catch (e2) {}
      }
    };

    setGlobal("window", globalThis);
    setGlobal("self", globalThis);
    setGlobal("document", doc);
    setGlobal("localStorage", ls);
    setGlobal("sessionStorage", createLocalStorage());
    setGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Node.js) HeadlessRunner/1.0",
      platform: process.platform,
      language: "zh-CN",
      languages: ["zh-CN", "en"],
      cookieEnabled: false,
      onLine: true,
      hardwareConcurrency: 4,
      maxTouchPoints: 0,
      vendor: "",
      appVersion: "",
    });
    setGlobal("location", {
      href: "http://localhost/index.html",
      protocol: "http:",
      host: "localhost",
      hostname: "localhost",
      port: "",
      pathname: "/index.html",
      search: "",
      hash: "",
      origin: "http://localhost",
      assign: function () {},
      replace: function () {},
      reload: function () {},
    });
    setGlobal("screen", {
      width: 1920,
      height: 1080,
      availWidth: 1920,
      availHeight: 1040,
      colorDepth: 24,
      pixelDepth: 24,
    });
    setGlobal("history", {
      length: 1,
      back: function () {},
      forward: function () {},
      go: function () {},
      pushState: function () {},
      replaceState: function () {},
    });
    setGlobal("performance", {
      now: perfNow,
      timing: { navigationStart: Date.now() },
      mark: function () {},
      measure: function () {},
      getEntriesByType: function () {
        return [];
      },
    });
    setGlobal("fetch", function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({});
        },
        text: function () {
          return Promise.resolve("");
        },
      });
    });
    setGlobal("matchMedia", function () {
      return {
        matches: false,
        media: "",
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
      };
    });
    // setTimeout: run immediately (no deferred execution in headless)
    globalThis.setTimeout = function (fn) {
      if (typeof fn === "function") {
        try {
          fn();
        } catch (e) {}
      }
      return 0;
    };
    globalThis.clearTimeout = function () {};
    globalThis.setInterval = function () {
      return 0;
    };
    globalThis.clearInterval = function () {};
    globalThis.queueMicrotask = function (fn) {
      if (typeof fn === "function") fn();
    };

    globalThis.HTMLElement = function () {};
    globalThis.HTMLDivElement = function () {};
    globalThis.HTMLSpanElement = function () {};
    globalThis.HTMLButtonElement = function () {};
    globalThis.HTMLInputElement = function () {};
    globalThis.HTMLSelectElement = function () {};
    globalThis.HTMLTextAreaElement = function () {};
    globalThis.HTMLImageElement = function () {};
    globalThis.HTMLAnchorElement = function () {};
    globalThis.HTMLUListElement = function () {};
    globalThis.HTMLLIElement = function () {};
    globalThis.HTMLHeadingElement = function () {};
    globalThis.HTMLParagraphElement = function () {};
    globalThis.HTMLBRElement = function () {};
    globalThis.HTMLTableElement = function () {};
    globalThis.HTMLTableRowElement = function () {};
    globalThis.HTMLTableCellElement = function () {};
    globalThis.HTMLFormElement = function () {};
    globalThis.HTMLLabelElement = function () {};
    globalThis.HTMLCanvasElement = function () {};
    globalThis.Audio = function () {};
    globalThis.Image = function () {};
    globalThis.CustomEvent = function () {};
    globalThis.Event = function () {};
    globalThis.KeyboardEvent = function () {};
    globalThis.MouseEvent = function () {};
    globalThis.TouchEvent = function () {};
    globalThis.PointerEvent = function () {};
    globalThis.WheelEvent = function () {};
    globalThis.XMLHttpRequest = function () {
      return {
        open: function () {},
        send: function () {},
        setRequestHeader: function () {},
        abort: function () {},
        readyState: 4,
        status: 200,
        responseText: "",
        response: "",
        onreadystatechange: null,
        onload: null,
        onerror: null,
      };
    };
    globalThis.WebSocket = function () {
      return {
        send: function () {},
        close: function () {},
        readyState: 3,
      };
    };
    globalThis.__jsErrors = [];
  }

  // ====== UI 函数存根（阻止渲染器报错） ======
  function stubUiFunctions() {
    var noop = function () {};
    var uiFuncs = [
      "renderScreen",
      "renderMainArea",
      "renderSidebar",
      "renderHeader",
      "renderTimeSlot",
      "renderLocationBar",
      "renderStatsStrip",
      "renderGoalStrip",
      "renderActiveNews",
      "renderCurrentTab",
      "renderTradeTab",
      "renderActionTab",
      "renderSkillTab",
      "renderCareerTab",
      "renderInvestmentTab",
      "renderSocialTab",
      "renderMapTab",
      "renderLifeTab",
      "renderStartupTab",
      "renderWikiTab",
      "renderStatusAndLocation",
      "renderCareerOverview",
      "updateAllUI",
      "showModal",
      "showGameOverModal",
      "showVictoryModal",
      "showDailyReport",
      "showInterviewModal",
      "showStartupModal",
      "showEventModal",
      "showCompanyHistory",
      "showHeritageStore",
      "renderDailySummary",
      "renderDailyReport",
      "renderVictory",
      "renderCompanyHistory",
      "renderTutorial",
      "renderDataViz",
      "renderHeritageUI",
      "renderSocialTabUI",
      "renderLifeMemoir",
      "renderDailyQuestUI",
      "renderDailyFocusUI",
      "checkLoseConditions",
      "checkVictoryConditions",
      "setStatBar",
      "addLogMessage",
      "updateSidebar",
      "describeItemEffects",
      "getInvestmentContextLine",
      "renderKLine",
      "renderMarketSentiment",
      "renderCareerDevTab",
      "renderCareerTab",
      "showWikiEntry",
      "populateEncyclopedia",
      "showFavorModal",
      "showTradeModal",
      "showNpcDialog",
      "ensureNpcAffinityEvents",
      "checkNpcSkillUnlocks",
      "rollNpcEncounterOnArrival",
      "rollLocationNpcEncounter",
      "queueRandomEvent",
      "triggerMoralEvent",
      "renderSideHustleUI",
      "renderHustleTab",
      "initTutorial",
      "showScenarioIntro",
      "saveGame",
      "loadGame",
      "autoSave",
      "onClick",
      "onChange",
      "handleAction",
      "renderBirthdayModal",
      "renderNewYearModal",
      "runMechanicsAudit",
      "runNarrativesAudit",
      "generateSaveNarrative",
      "createSnapshot",
      "getLoadMemoryText",
      "showMemoryModal",
      "showEventChainModal",
      "triggerChainEvent",
    ];
    for (var i = 0; i < uiFuncs.length; i++) {
      if (typeof globalThis[uiFuncs[i]] === "undefined") {
        globalThis[uiFuncs[i]] = noop;
      }
    }

    // alert/confirm/prompt 也存根
    globalThis.alert = function (msg) {
      console.log("[HEADLESS] alert:", msg);
    };
    globalThis.confirm = function () {
      return true;
    };
    globalThis.prompt = function () {
      return "";
    };
  }

  // ====== 获取脚本加载顺序 ======
  // P0-4：单一真相源——直接解析 src/index.html 的 <script src>，根除手抄漂移。
  // 解析失败（如 index.html 缺失）才回退到下方内置副本（尽量维护但不再权威）。
  function getScriptOrder(srcDir) {
    try {
      var manifest = require("./lib/script_manifest.cjs");
      var list = manifest.getScriptManifest(srcDir);
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn(
        "[HEADLESS] script_manifest 解析失败，回退内置列表:",
        e.message,
      );
    }
    return getScriptOrderFallback();
  }

  // 内置回退列表（历史手抄副本；仅在无法解析 index.html 时使用）
  function getScriptOrderFallback() {
    return [
      "js/core/random.js",
      "js/core/state.js",
      "js/core/action_sort.js",
      "js/core/sort_utils.js",
      "js/core/finance.js",
      "js/core/save.js",
      "js/core/events_core.js",
      "js/core/events_street_survival.js",
      "js/core/events_street_wealth.js",
      "js/core/events_street_life.js",
      "js/core/events_corp.js",
      "js/core/news_event_bridge.js",
      "js/core/weather.js",
      "js/core/weather_forecast.js",
      "js/core/festivals.js",
      "js/core/dreams.js",
      "js/core/sound.js",
      "js/core/achievements.js",
      "js/core/equipment_quality.js",
      "js/core/cooking.js",
      "js/core/durability.js",
      "js/core/review_improvements.js",
      "js/core/difficulty_system.js",
      "js/core/heritage_coin.js",
      "js/core/illegal_actions.js",
      "js/core/life_ribbon.js",
      "js/core/story_chapters.js",
      "js/core/route_effects.js",
      "js/core/cross_system_events.js",
      "js/core/life_decisions.js",
      "js/core/life_nodes.js",
      "js/core/medical.js",
      "js/core/travel.js",
      "js/core/legal.js",
      "js/core/cross_system_integration.js",
      "js/core/career_path_events.js",
      "js/core/news_system.js",
      "js/core/news_investment_bridge.js",
      "js/core/world_params.js",
      "js/core/world_news_intro.js",
      "js/core/skill_intel.js",
      "js/core/npc_location_bridge.js",
      "js/core/npc_relationships.js",
      "js/core/social_network.js",
      "js/core/enterprise_fate.js",
      "js/core/multi_run_memory.js",
      "js/core/company_spawner.js",
      "js/core/inheritance_chain.js",
      "js/core/skill_tree.js",
      "js/core/equipment_suites.js",
      "js/core/equipment_durability.js",
      "js/core/skill_synergy.js",
      "js/data/startup_events.js",
      "js/data/startup_competition.js",
      "js/data/scenario_start_chains.js",
      "js/data/locations.js",
      "js/data/location_flavor.js",
      "js/data/jobs.js",
      "js/data/goods.js",
      "js/data/items.js",
      "js/data/news.js",
      "js/data/skills.js",
      "js/data/npcs.js",
      "js/data/scenarios.js",
      "js/data/corp.js",
      "js/data/amenities.js",
      "js/data/illnesses.js",
      "js/data/mechanics_registry.js",
      "js/data/narratives_registry.js",
      "js/data/victories_registry.js",
      "js/data/moral_events.js",
      "js/data/crisis35_followups.js",
      "js/data/era_events.js",
      "js/phase1/trade.js",
      "js/phase1/trade_intel.js",
      "js/phase1/needs.js",
      "js/phase1/interactions.js",
      "js/phase1/illness.js",
      "js/phase1/critical.js",
      "js/phase1/skill_bonuses.js",
      "js/phase1/actions_extra.js",
      "js/phase1/daily_pipeline.js",
      "js/phase1/carry.js",
      "js/phase1/pricing.js",
      "js/phase1/reputation.js",
      "js/phase1/npc_event_bridge.js",
      "js/phase1/extra_events.js",
      "js/phase2/perf.js",
      "js/phase2/promo.js",
      "js/phase2/team.js",
      "js/phase2/stock.js",
      "js/phase2/corp_ops.js",
      "js/phase2/investment.js",
      "js/phase2/property_market.js",
      "js/phase2/startup_data.js",
      "js/phase2/startup.js",
      "js/phase2/life_crossroads.js",
      "js/phase2/workplace_social.js",
      "js/phase2/investment_analysis.js",
      "js/phase2/startup_crisis.js",
      "js/phase2/family_life.js",
      "js/phase2/personal_growth.js",
      "js/phase2/side_hustle.js",
      "js/data/side_hustle_events.js",
      "js/components/companyHistory.js",
      "js/ui/data_viz.js",
      "js/ui/render_core.js",
      "js/ui/render_infra.js",
      "js/ui/render.js",
      "js/ui/corp_ui.js",
      "js/ui/modal.js",
      "js/ui/heritage_store.js",
      "js/ui/tutorial.js",
      "js/ui/daily_focus.js",
      "js/ui/victory.js",
      "js/ui/wiki.js",
      "js/ui/daily_report.js",
      "js/ui/social_tab.js",
      "js/ui/career_dev.js",
      "js/ui/life_memoir.js",
      "js/ui/daily_quest.js",
      "js/main.js",
      "js/app_bridge/webapp_runtime_bridge.js",
    ];
  }

  // ====== 构建基础路径 ======
  function getBasePath() {
    // 从 __dirname 推断项目根
    var dir = __dirname;
    // 如果 tests/ 目录存在，回退到 city-life-story/src/
    if (dir.indexOf("tests") >= 0) {
      return dir.replace(/tests$/, "") + "src";
    }
    // 从当前文件位置试探
    var candidate = require("path").join(dir, "..", "city-life-story", "src");
    try {
      require("fs").statSync(candidate);
      return candidate;
    } catch (e) {
      // 尝试同级 src
      return require("path").join(dir, "..", "src");
    }
  }

  // ====== 加载单个脚本 ======
  function loadScript(filePath) {
    var fs = require("fs");
    var vm = require("vm");
    var code = fs.readFileSync(filePath, "utf8");
    // 注意：必须用 vm.runInThisContext 而非 eval() 或 vm.runInNewContext()
    // 因为游戏代码使用 const/let 在顶层声明全局变量（如 const STREET_JOBS = [...]），
    // 这是浏览器 <script> 标签的语义——所有脚本共享同一个全局作用域。
    // eval() 会把 var/const/let 限制在 eval 函数内部作用域，其他脚本看不到。
    // vm.runInThisContext() 保留顶层声明的全局可访问性，与浏览器一致。
    try {
      var savedModule = globalThis.module;
      globalThis.module = undefined;
      vm.runInThisContext(code, { filename: filePath });
      globalThis.module = savedModule;
      return true;
    } catch (err) {
      globalThis.module = savedModule;
      loadErrors.push({ file: filePath, error: err.message, stack: err.stack });
      console.error("[HEADLESS] LOAD ERROR:", filePath, "-", err.message);
      return false;
    }
  }

  // ====== 初始化（加载所有游戏脚本） ======
  function init(opts) {
    opts = opts || {};
    if (loaded) return;

    var path = require("path");
    var srcDir = opts.srcDir || getBasePath();

    console.log("[HEADLESS] 初始化无头运行器");
    console.log("[HEADLESS] 源码目录:", srcDir);

    // 1. 设置存根
    setupStubs();
    stubUiFunctions();

    // 2. 获取脚本顺序
    var scripts = getScriptOrder(srcDir);

    // 3. 逐一加载
    var success = 0;
    var failed = 0;
    for (var i = 0; i < scripts.length; i++) {
      var fullPath = path.join(srcDir, scripts[i]);
      try {
        require("fs").statSync(fullPath);
      } catch (e) {
        console.warn("[HEADLESS] 文件缺失 (跳过):", scripts[i]);
        failed++;
        continue;
      }
      if (loadScript(fullPath)) {
        success++;
      } else {
        failed++;
        if (opts.strict) {
          console.error("[HEADLESS] 严格模式：加载失败中断");
          return false;
        }
      }
    }

    loaded = true;
    console.log(
      "[HEADLESS] 游戏引擎加载完成: %d 成功, %d 失败/跳过, %d 总文件",
      success,
      failed,
      scripts.length,
    );
    if (loadErrors.length > 0) {
      console.warn("[HEADLESS] 加载错误详情:", loadErrors);
    }
    return true;
  }

  // ====== 创建测试状态 ======
  function createState(options) {
    options = options || {};
    if (typeof createDefaultState !== "function") {
      console.error("[HEADLESS] createDefaultState 不可用 — 游戏未正确加载");
      return null;
    }

    // 用种子设置 RNG
    if (options.seed !== undefined) {
      if (typeof Random !== "undefined" && Random.setSeed) {
        Random.setSeed(options.seed);
      }
    }

    // 创建状态
    var state = createDefaultState(options.scenario || "classic");
    if (!state) {
      console.error("[HEADLESS] createDefaultState 返回 null");
      return null;
    }

    // 确保 StateManager 已初始化（headless 模式下无 UI 调用 newGame/importState）
    if (typeof StateManager !== "undefined" && StateManager._state === null) {
      StateManager._state = state;
    }

    // 如果提供了覆盖
    if (options.overrides) {
      for (var key in options.overrides) {
        if (options.overrides.hasOwnProperty(key)) {
          setNested(state, key, options.overrides[key]);
        }
      }
    }

    return state;
  }

  // ====== 辅助：嵌套属性设置 ======
  function setNested(obj, path, value) {
    var parts = path.split(".");
    var current = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }

  // ====== 执行一天 ======
  function advanceDay(state, policyFn) {
    if (!state) {
      throw new Error("[HEADLESS] state 为空");
    }

    // 调用策略函数让玩家做决策
    if (typeof policyFn === "function") {
      policyFn(state);
    }

    // 设置 AP 为 0 触发 endDay
    state.player.actionPoints = 0;
    state.player.timeSlot = "evening";

    // 运行每日管线
    if (typeof runDailyPipeline === "function") {
      try {
        runDailyPipeline(state);
      } catch (err) {
        console.error(
          "[HEADLESS] runDailyPipeline 错误 (Day " + state.player.day + "):",
          err.message,
        );
        // 检查是否为游戏结束
        if (state.flags && (state.flags.gameOver || state.status.health <= 0)) {
          return false; // 死亡
        }
        throw err;
      }
    } else {
      console.error("[HEADLESS] runDailyPipeline 不可用");
      return false;
    }

    // 检查游戏结束条件
    if (state.flags && state.flags.gameOver) {
      return false;
    }
    if (
      state.status &&
      state.status.health !== undefined &&
      state.status.health <= 0
    ) {
      if (state.flags) state.flags.gameOver = true;
      return false;
    }

    return true; // 存活
  }

  // ====== 获取策略函数（模拟玩家决策） ======
  function getStrategy(name) {
    var strategies = {
      // ====== 平衡策略 ======
      balanced: function (state) {
        var ap = state.player.actionPoints;
        var cash = state.resources.cash;
        var needs = state.needs;
        var day = state.player.day;

        // 1. 如果有银行余额，少花现金
        var bank = state.resources.bankBalance || 0;
        var effectiveCash = cash + bank * 0.01;

        // 2. 吃饭（饥饿 < 60 即没吃饱、且有钱才吃；引擎语义：hunger 越大越饱）
        if (needs.hunger < 60 && cash >= 8 && ap >= 10) {
          var cost = 10;
          state.resources.cash = Math.max(0, state.resources.cash - cost);
          state.needs.hunger = Math.min(100, state.needs.hunger + 30);
          state.needs.happiness = Math.min(100, state.needs.happiness + 3);
          ap -= 10;
        }

        // 3. 休息（疲劳 > 70）
        if (needs.fatigue > 70 && ap >= 15) {
          state.needs.fatigue = Math.max(0, state.needs.fatigue - 25);
          state.needs.happiness = Math.min(100, state.needs.happiness + 3);
          ap -= 15;
        }

        // 4. 卫生（hygiene < 50 即脏了、且有钱才洗；引擎语义：hygiene 越大越干净）
        if (needs.hygiene < 50 && cash >= 5 && ap >= 10) {
          state.resources.cash = Math.max(0, state.resources.cash - 5);
          state.needs.hygiene = Math.min(100, state.needs.hygiene + 35);
          ap -= 10;
        }

        // 5. 放松（心情 < 35）
        if (needs.happiness < 35 && ap >= 10) {
          state.needs.happiness = Math.min(100, state.needs.happiness + 15);
          state.needs.fatigue = Math.min(100, state.needs.fatigue + 5);
          ap -= 10;
        }

        // 6. 工作（用剩余 AP 赚钱）
        // 优先选择高薪工作
        if (ap >= 10) {
          var job = findBestAvailableJob(state);
          if (job && typeof doStreetJob === "function") {
            doStreetJob(job);
          } else {
            // fallback: 简单模拟
            var earn = 15 + Math.floor(Math.random() * 20);
            state.resources.cash += earn;
            state.needs.fatigue = Math.min(100, state.needs.fatigue + 8);
            state.needs.hygiene = Math.min(100, state.needs.hygiene + 5);
          }
        }

        state.player.actionPoints = Math.max(0, ap);
      },

      // ====== 拼命策略 ======
      grinder: function (state) {
        var ap = state.player.actionPoints;
        var cash = state.resources.cash;
        var needs = state.needs;

        // 最低限度吃饭（hunger < 40 即快饿了才吃；引擎语义：hunger 越大越饱）
        if (needs.hunger < 40 && cash >= 5 && ap >= 10) {
          state.resources.cash = Math.max(0, state.resources.cash - 5);
          state.needs.hunger = Math.min(100, state.needs.hunger + 20);
          ap -= 10;
        }

        // 所有空闲 AP 都工作
        if (ap >= 10) {
          var job = findHighestPayJob(state);
          if (job && typeof doStreetJob === "function") {
            doStreetJob(job);
          } else {
            var earn = 20 + Math.floor(Math.random() * 15);
            state.resources.cash += earn;
            state.needs.fatigue = Math.min(100, state.needs.fatigue + 12);
            state.needs.hygiene = Math.min(100, state.needs.hygiene + 8);
          }
        }

        state.player.actionPoints = Math.max(0, ap);
      },

      // ====== 技能优先策略 ======
      skiller: function (state) {
        var ap = state.player.actionPoints;
        var cash = state.resources.cash;
        var needs = state.needs;

        // 吃饭（hunger < 60 即没吃饱才吃；引擎语义：hunger 越大越饱）
        if (needs.hunger < 60 && cash >= 8 && ap >= 10) {
          state.resources.cash = Math.max(0, state.resources.cash - 8);
          state.needs.hunger = Math.min(100, state.needs.hunger + 30);
          state.needs.happiness = Math.min(100, state.needs.happiness + 3);
          ap -= 10;
        }

        // 休息（疲劳 > 60）
        if (needs.fatigue > 60 && ap >= 15) {
          state.needs.fatigue = Math.max(0, state.needs.fatigue - 25);
          ap -= 15;
        }

        // 学习技能（每天至少学一次）
        if (ap >= 20 && cash > 0 && needs.fatigue < 70) {
          // 尝试学习 coding 或英语
          if (typeof state.skills !== "undefined") {
            var skillId = "coding";
            var currentLevel = state.skills[skillId]
              ? state.skills[skillId].level
              : 0;
            if (currentLevel >= 20) skillId = "english";
            currentLevel = state.skills[skillId]
              ? state.skills[skillId].level
              : 0;
            if (currentLevel >= 20) skillId = "management";
            currentLevel = state.skills[skillId]
              ? state.skills[skillId].level
              : 0;
            if (currentLevel >= 15) skillId = "accounting";

            // 分配 XP
            if (state.skills[skillId]) {
              state.skills[skillId].xp = (state.skills[skillId].xp || 0) + 5;
              if (state.skills[skillId].xp >= 100) {
                state.skills[skillId].xp = 0;
                state.skills[skillId].level = Math.min(
                  100,
                  (state.skills[skillId].level || 0) + 1,
                );
              }
            }
            ap -= 20;
            state.needs.fatigue = Math.min(100, state.needs.fatigue + 3);
          }
        }

        // 剩余 AP 工作
        if (ap >= 10) {
          var job = findBestAvailableJob(state);
          if (job && typeof doStreetJob === "function") {
            doStreetJob(job);
          } else {
            var earn = 12 + Math.floor(Math.random() * 15);
            state.resources.cash += earn;
            state.needs.fatigue = Math.min(100, state.needs.fatigue + 8);
            state.needs.hygiene = Math.min(100, state.needs.hygiene + 5);
          }
        }

        state.player.actionPoints = Math.max(0, ap);
      },
    };

    return strategies[name] || strategies.balanced;
  }

  // ====== 辅助：找可用工作 ======
  function findBestAvailableJob(state) {
    if (
      typeof STREET_JOBS === "undefined" ||
      typeof checkJobRequirements === "undefined"
    ) {
      return null;
    }
    var best = null;
    var bestPay = 0;
    for (var i = 0; i < STREET_JOBS.length; i++) {
      var job = STREET_JOBS[i];
      // 检查位置匹配和资格
      if (job.location === state.trade.currentLocation || !job.location) {
        var req = checkJobRequirements(job, state);
        if (req === true) {
          // 估算收入
          var pay = typeof job.payCalc === "function" ? job.payCalc(state) : 0;
          if (pay > bestPay) {
            bestPay = pay;
            best = job;
          }
        }
      }
    }
    return best;
  }

  // ====== 辅助：找最高薪工作（不检查位置） ======
  function findHighestPayJob(state) {
    if (typeof STREET_JOBS === "undefined") return null;
    var best = null;
    var bestPay = -1;
    for (var i = 0; i < STREET_JOBS.length; i++) {
      var job = STREET_JOBS[i];
      if (typeof checkJobRequirements === "function") {
        var req = checkJobRequirements(job, state);
        if (req !== true) continue;
      }
      var pay = typeof job.payCalc === "function" ? job.payCalc(state) : 0;
      if (pay > bestPay) {
        bestPay = pay;
        best = job;
      }
    }
    return best;
  }

  // ====== 获取状态快照指标 ======
  function getMetrics(state) {
    return {
      day: state.player.day,
      alive: !state.flags.gameOver && state.status.health > 0,
      cash: state.resources.cash,
      bankBalance: state.resources.bankBalance || 0,
      totalEarned: state.resources.totalEarned || 0,
      debt: (state.resources.debt || 0) + (state.resources.villageDebt || 0),
      totalAssets:
        state.resources.cash +
        (state.resources.bankBalance || 0) -
        (state.resources.debt || 0) -
        (state.resources.villageDebt || 0),
      health: state.status.health,
      housingTier: state.housing ? state.housing.tier : 0,
      needs: {
        hunger: state.needs.hunger,
        fatigue: state.needs.fatigue,
        hygiene: state.needs.hygiene,
        happiness: state.needs.happiness,
      },
      skills: state.skills
        ? Object.keys(state.skills).reduce(function (acc, k) {
            acc[k] = state.skills[k].level;
            return acc;
          }, {})
        : {},
      illnesses: state.status.illnesses ? state.status.illnesses.length : 0,
      injured: state.status.injured || false,
      currentJob: state.employment ? state.employment.currentJob : null,
      phase: state.player.phase,
      emotionalState: state.needs ? state.status.emotionalState : "stable",
    };
  }

  // ====== 导出 ======
  var runner = {
    init: init,
    createState: createState,
    advanceDay: advanceDay,
    getStrategy: getStrategy,
    findBestAvailableJob: findBestAvailableJob,
    findHighestPayJob: findHighestPayJob,
    getMetrics: getMetrics,
    getScriptOrder: getScriptOrder,
    getLoadErrors: function () {
      return loadErrors.slice();
    },
    isLoaded: function () {
      return loaded;
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = runner;
  }

  // 自执行测试（如果直接运行）
  if (typeof require !== "undefined" && require.main === module) {
    console.log("[HEADLESS] 直接运行模式 — 加载游戏引擎...");
    var startTime = Date.now();
    var ok = init({ strict: false });
    if (ok) {
      console.log("[HEADLESS] 加载耗时: %dms", Date.now() - startTime);
      if (loadErrors.length > 0) {
        console.log("[HEADLESS] 加载错误: %d", loadErrors.length);
        // 显示前 10 个
        for (var i = 0; i < Math.min(10, loadErrors.length); i++) {
          console.log(
            "  [%d] %s: %s",
            i + 1,
            loadErrors[i].file,
            loadErrors[i].error,
          );
        }
      }
      console.log(
        "[HEADLESS] Random API:",
        typeof Random !== "undefined" ? "OK" : "MISSING",
      );
      console.log(
        "[HEADLESS] StateManager:",
        typeof StateManager !== "undefined" ? "OK" : "MISSING",
      );
      console.log(
        "[HEADLESS] STREET_JOBS:",
        typeof STREET_JOBS !== "undefined"
          ? STREET_JOBS.length + " jobs"
          : "MISSING",
      );
      console.log(
        "[HEADLESS] runDailyPipeline:",
        typeof runDailyPipeline !== "undefined" ? "OK" : "MISSING",
      );
      console.log(
        "[HEADLESS] doStreetJob:",
        typeof doStreetJob !== "undefined" ? "OK" : "MISSING",
      );
      console.log(
        "[HEADLESS] DAILY_PIPELINE steps:",
        typeof DAILY_PIPELINE !== "undefined"
          ? DAILY_PIPELINE.length
          : "MISSING",
      );
    } else {
      console.log("[HEADLESS] 加载失败");
    }
  }
})();
