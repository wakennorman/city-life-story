/**
 * 城市浮生记 — 域G（核心机制/生命周期）联动增强 · R240
 * 全系统优化 loop R240
 *
 * 本轮 A类修复：无（域G所有文件已有完整守卫）
 *
 * 联动增强 3 项（补齐历轮域G未充分利用的 G→B/G→C/G→D 方向）：
 *  1. G→B extreme_weather_narrative（street）：**极端天气叙事** — 当天气为
 *     heatwave/coldwave/storm/snow 时，触发对应的叙事事件，带选择（躲/扛/想办法），
 *    让天气系统不只是数值修正，更是生活体验。
 *  2. G→C health_career_impact（street）：**健康影响职业** — 玩家健康状态
 *    (health/sick/injured) 影响工作收入倍率，并在每日tick中提供健康管理建议。
 *    已有 illness 系统的接入，但缺少UI层面的引导和提醒。
 *  3. G→D life_event_social_echo（street）：**人生事件社交回响** — 当玩家经历
 *     重大人生事件（搬家/买房/重病/创业）时，NPC 会对此做出反应（恭喜/安慰/建议），
 *     让玩家感受到社交圈对人生变化的关注。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重。
 *  - 每个事件显式设 phase。
 *  - 本文件须在 main.js / weather.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR240Loaded) return;
  RANDOM_EVENTS._domainGLinkageR240Loaded = true;

  // ============================================================
  // 联动增强1: G→B 极端天气叙事
  // ============================================================
  function _checkExtremeWeatherNarrativeR240(st) {
    if (!st || !st.weather || !st.player) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!day) return;
    if (!st.flags) st.flags = {};

    var _weather = st.weather.current || "";
    var _isExtreme = false;
    var _eventId = "";
    var _story = "";
    var _icon = "";
    var _title = "";

    if (_weather === "heatwave" && !st.flags._weatherHeatwaveNarrative) {
      _isExtreme = true;
      _eventId = "g240_heatwave";
      _icon = "🌡️";
      _title = "热浪来袭";
      _story = "今天的温度飙到了38度，空气仿佛被烤焦了。\\n\\n" +
        "街上的人少了很多，连树上的知了都有些有气无力。\\n\\n" +
        "你站在屋檐下，看着远处柏油路面上升腾的热浪，感觉呼吸都变得沉重了。\\n\\n" +
        "这种天气出门干活简直是折磨，但不干活又没钱吃饭……";
      st.flags._weatherHeatwaveNarrative = true;
    } else if (_weather === "coldwave" && !st.flags._weatherColdwaveNarrative) {
      _isExtreme = true;
      _eventId = "g240_coldwave";
      _icon = "🥶";
      _title = "寒潮降临";
      _story = "一夜之间，温度骤降到了零下。\\n\\n" +
        "你裹紧了身上唯一一件外套，还是觉得冷风直往骨头里钻。\\n\\n" +
        "路边的水管结了冰，早餐摊的大爷搓着手跺着脚。\\n\\n" +
        "这种天气，能不出门就不出门——但生活不会因为天冷就放过你。";
      st.flags._weatherColdwaveNarrative = true;
    } else if (_weather === "storm" && !st.flags._weatherStormNarrative) {
      _isExtreme = true;
      _eventId = "g240_storm";
      _icon = "⛈️";
      _title = "暴风雨";
      _story = "天空突然暗了下来，豆大的雨点砸在窗户上。\\n\\n" +
        "紧接着就是一声惊雷——整座城市都被笼罩在暴雨之中。\\n\\n" +
        "街上的行人四散奔跑，小贩们手忙脚乱地收摊。\\n\\n" +
        "你站在屋檐下避雨，看着雨水顺着屋檐流成一道水帘。\\n\\n" +
        "这种天气，出行不便，但也意味着——今天没多少人跟你抢活了。";
      st.flags._weatherStormNarrative = true;
    } else if (_weather === "snow" && !st.flags._weatherSnowNarrative) {
      _isExtreme = true;
      _eventId = "g240_snow";
      _icon = "❄️";
      _title = "初雪";
      _story = "天空飘起了雪花，一片一片，慢慢覆盖了整座城市。\\n\\n" +
        "街上有人停下脚步拍照，也有人裹紧大衣行色匆匆。\\n\\n" +
        "雪落在你的肩头，很快就化了。你看着这个被白色覆盖的世界，\\n\\n" +
        "心里有一种说不出的感觉——这座城市在雪中，变得安静了。";
      st.flags._weatherSnowNarrative = true;
    }

    if (!_isExtreme) return;

    var _event = {
      id: _eventId,
      phase: "street",
      icon: _icon,
      title: _title,
      story: _story,
      conditions: function () { return false; },
      probability: 0,
      repeatable: false,
      choices: [
        {
          text: "💪 硬扛着出去干活",
          hint: "收入+20%，但疲劳+10，健康-3",
          apply: function (s) {
            s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 10);
            s.status.health = Math.max(0, (s.status.health || 50) - 3);
            s.flags._weatherWorkBonus = 1.2;
            StateManager.addMessage(
              "💪 你顶着" + (_weather === "heatwave" ? "烈日" : _weather === "coldwave" ? "寒风" : _weather === "storm" ? "暴雨" : "风雪") +
              "出门了。路上行人稀少，但你知道——机会就在这种时候。今天工作收入+20%，但身体付出不小代价。",
              "warning"
            );
          }
        },
        {
          text: "🏠 今天歇一天，躲过去",
          hint: "安全，但今天收入为0",
          apply: function (s) {
            s.flags._weatherRestDay = true;
            s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🏠 你决定今天不出门了。泡了杯热茶，看着窗外" + (_weather === "snow" ? "飘雪" : "风雨") +
              "，心里反而平静了一些。有时候，休息也是战斗的一部分。心情+3。",
              "info"
            );
          }
        },
        {
          text: "🧠 找点室内能干的活",
          hint: "收入减半，但安全",
          apply: function (s) {
            s.flags._weatherIndoorWork = true;
            s.needs.intelligence = Math.min(100, (s.player.intelligence || 0) + 1);
            StateManager.addMessage(
              "🧠 你找了个室内的工作——帮人整理仓库、打扫卫生之类的。虽然钱不多，但至少不用在外面挨冻受热。智力+1。",
              "info"
            );
          }
        }
      ]
    };

    if (typeof showEventModal === "function") {
      showEventModal(_event, st);
    } else {
      StateManager.addMessage(
        _icon + " " + _title + "！" + (_weather === "snow" ? "注意保暖。" : "注意安全。"),
        "warning"
      );
    }
  }

  // ============================================================
  // 联动增强2: G→C 健康影响职业提醒
  // ============================================================
  function _checkHealthCareerAdviceR240(st) {
    if (!st || !st.status || !st.player || !st.flags) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!day) return;

    // 7天冷却
    var _lastAdvice = st.flags._lastHealthCareerAdviceDay || 0;
    if (day - _lastAdvice < 7) return;

    // 只在生病或受伤时触发
    if (!st.status.sick && !st.status.injured) return;

    // 只在有工作时触发（domain C 相关）
    var _hasJob = false;
    if (st.corporate && st.corporate.job) _hasJob = true;
    if (st.career && st.career.currentJob) _hasJob = true;
    if (!_hasJob) return;

    st.flags._lastHealthCareerAdviceDay = day;

    if (st.status.sick && st.status.injured) {
      StateManager.addMessage(
        "🤒🩹 你既生病又受伤，还坚持工作……老板不会因此感动，但你的身体一定会抗议。" +
        "建议：先去医院治疗，身体是革命的本钱。",
        "danger"
      );
    } else if (st.status.sick) {
      StateManager.addMessage(
        "🤒 你生病了还在工作，效率大打折扣。建议去药店买点药或者去医院看看，" +
        "早点恢复才能早点全力投入工作。",
        "warning"
      );
    } else if (st.status.injured) {
      StateManager.addMessage(
        "🩹 你带着伤工作，每动一下都疼。建议去医院处理一下，别让小伤拖成大问题。",
        "warning"
      );
    }
  }

  // ============================================================
  // 联动增强3: G→D 人生事件社交回响
  // ============================================================
  function _checkLifeEventSocialEchoR240(st) {
    if (!st || !st.relationships || !st.flags || !st.player) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!day) return;

    // 检测一系列人生事件标记，看是否有新增的（最近3天内触发）
    var _events = [];
    var _housingTier = st.housing ? st.housing.tier || 0 : 0;

    // 搬家/升级住房
    if (st.flags._housingUpgradedRecently && !st.flags._housingEchoSent) {
      var _upgradeDay = st.flags._housingUpgradedRecently;
      if (typeof _upgradeDay === "number" && day - _upgradeDay <= 3) {
        _events.push({ type: "housing", tier: _housingTier });
        st.flags._housingEchoSent = true;
      }
    }

    // 重病康复
    if (st.flags._recoveredFromIllness && !st.flags._illnessEchoSent) {
      var _recoveryDay = st.flags._recoveredFromIllness;
      if (typeof _recoveryDay === "number" && day - _recoveryDay <= 3) {
        _events.push({ type: "illness" });
        st.flags._illnessEchoSent = true;
      }
    }

    // 创业成功
    if (st.flags._startupLaunched && !st.flags._startupEchoSent) {
      var _launchDay = st.flags._startupLaunched;
      if (typeof _launchDay === "number" && day - _launchDay <= 3) {
        _events.push({ type: "startup" });
        st.flags._startupEchoSent = true;
      }
    }

    if (_events.length === 0) return;

    // 找关系最好的NPC来回应
    var _bestNpcId = "", _bestAff = 0, _bestNpcName = "";
    for (var _rid in st.relationships) {
      var _r = st.relationships[_rid];
      if (_r && _r.met && (_r.affinity || 0) > _bestAff) {
        _bestAff = _r.affinity || 0;
        _bestNpcId = _rid;
      }
    }
    if (!_bestNpcId) return;

    // 获取NPC中文名
    _bestNpcName = _bestNpcId;
    if (typeof NPCS !== "undefined" && NPCS) {
      for (var _ni = 0; _ni < NPCS.length; _ni++) {
        if (NPCS[_ni] && NPCS[_ni].id === _bestNpcId) {
          _bestNpcName = NPCS[_ni].name || _bestNpcId;
          break;
        }
      }
    }

    // 根据事件类型生成不同回应
    for (var _ei = 0; _ei < _events.length; _ei++) {
      var _evt = _events[_ei];
      if (_evt.type === "housing") {
        if (_evt.tier >= 3) {
          StateManager.addMessage(
            "🏠 " + _bestNpcName + "听说你搬了新家，特意跑来看了看：「这房子不错啊！你小子混出头了！」好感+" + Math.min(3, _bestAff * 0.05),
            "success"
          );
        } else {
          StateManager.addMessage(
            "🏠 " + _bestNpcName + "听说你搬家了：「换了地方住？改天我去看看你。」一点小小的关心，让这座城市没那么冰冷。",
            "info"
          );
        }
      } else if (_evt.type === "illness") {
        StateManager.addMessage(
          "❤️ " + _bestNpcName + "听说你前段时间病了，特意过来问候：「现在好点了吗？别太拼了，身体要紧。」有人在意的感觉，真好。",
          "info"
        );
      } else if (_evt.type === "startup") {
        StateManager.addMessage(
          "🚀 " + _bestNpcName + "听说你开了公司，眼睛都亮了：「厉害啊！以后发达了可别忘了老相识！」你笑了笑，心里暖暖的。",
          "success"
        );
      }
    }
  }

  // ============================================================
  // 注册到全局
  // ============================================================
  if (typeof window !== "undefined") {
    window._checkExtremeWeatherNarrativeR240 = _checkExtremeWeatherNarrativeR240;
    window._checkHealthCareerAdviceR240 = _checkHealthCareerAdviceR240;
    window._checkLifeEventSocialEchoR240 = _checkLifeEventSocialEchoR240;
  }

  // ============================================================
  // RANDOM_EVENTS: 注册备用事件
  // ============================================================
  RANDOM_EVENTS.push({
    id: "domain_g_weather_advice",
    phase: "street",
    icon: "🌤️",
    title: "天气与生活",
    story: "天气总在影响着你的每一天——热了、冷了、下雨了、下雪了。\\n\\n但这座城市不会因为天气变化而停下脚步，你也不会。\\n\\n学会与各种天气相处，也是在这座城市生存的一部分。",
    conditions: function () { return false; },
    probability: 0,
    repeatable: false,
    choices: []
  });
})();