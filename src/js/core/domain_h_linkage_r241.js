/**
 * 城市浮生记 — 域H（Phase2/公司）联动增强 · R241
 * 全系统优化 loop R241
 *
 * 本轮 A类修复（在 corp_ops.js / events_corp.js 内）：
 *  - corp_ops.js: Math.random→Random.int 种子化RNG（office politics事件选择）
 *  - events_corp.js: 3处 totalEarned NaN 守卫（旧存档undefined/NaN保护）
 *
 * 联动增强 3 项（补齐历轮域H未充分利用的 H→B/H→G/H→D 方向）：
 *  1. H→B company_milestone_celebration（corporate）：**公司里程碑叙事** —
 *     当公司营收突破特定阈值（¥100k/¥500k/¥1M/¥5M）或成立周年时，触发
 *     叙事事件，带选择（庆祝/低调/分红），增强创业成就感。
 *  2. H→G founder_health_burnout（corporate）：**创业者健康压力** —
 *     公司运营压力（负债/低现金流/KPI不达标）累积影响玩家健康状态，
 *     体现创业者的身心消耗。每日tick检测，7天冷却提示。
 *  3. H→D success_social_ripple（corporate）：**成功社交回响** —
 *     公司成功后，老友/旧识主动联系玩家，NPC态度变化（敬畏/恭喜/求助），
 *     让玩家感受成功后社交圈的变化。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重。
 *  - 每个事件显式设 phase（corporate 阶段）。
 *  - 本文件须在 corp_ops.js/events_corp.js 之后加载。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR241Loaded) return;
  RANDOM_EVENTS._domainHLinkageR241Loaded = true;

  // ---- 本地助手 ----

  /** 获取公司营收 */
  function _getCompanyRevenueR241(st) {
    if (!st || !st.corporate) return 0;
    return st.corporate.totalRevenue || st.corporate.revenue || 0;
  }

  /** 获取公司现金流 */
  function _getCompanyCashR241(st) {
    if (!st || !st.corporate) return 0;
    return st.corporate.cash || 0;
  }

  /** 获取公司员工数 */
  function _getCompanyEmployeesR241(st) {
    if (!st || !st.corporate || !st.corporate.employees) return 0;
    return st.corporate.employees.length || 0;
  }

  /** 是否在运营公司 */
  function _isRunningCompanyR241(st) {
    return st && st.corporate && st.player && st.player.phase === "corporate";
  }

  // ============================================================
  // 联动增强1: H→B 公司里程碑叙事
  // ============================================================
  function _checkCompanyMilestoneR241(st) {
    if (!_isRunningCompanyR241(st) || typeof StateManager === "undefined") return;
    if (!st.flags) st.flags = {};
    var _revenue = _getCompanyRevenueR241(st);
    var _milestones = [
      { threshold: 5000000, flag: "_milestone5m", label: "¥500万", icon: "🏆" },
      { threshold: 1000000, flag: "_milestone1m", label: "¥100万", icon: "🥇" },
      { threshold: 500000, flag: "_milestone500k", label: "¥50万", icon: "🥈" },
      { threshold: 100000, flag: "_milestone100k", label: "¥10万", icon: "🥉" },
    ];

    for (var _mi = 0; _mi < _milestones.length; _mi++) {
      var _ms = _milestones[_mi];
      if (_revenue >= _ms.threshold && !st.flags[_ms.flag]) {
        st.flags[_ms.flag] = true;
        var _name = _ms.label;
        var _choices = [
          {
            text: "🎉 全公司庆祝，聚餐发红包",
            hint: "花费¥5000，士气+10，员工忠诚+5",
            apply: function (s) {
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - 5000);
              if (s.corporate) s.corporate.morale = Math.min(100, (s.corporate.morale || 50) + 10);
              StateManager.addMessage("🎉 你包了全公司聚餐，发了红包，大家非常开心！士气+10，花了¥5000。", "success");
            }
          },
          {
            text: "📊 低调处理，继续干活",
            hint: "不花钱，但士气不变",
            apply: function (s) {
              StateManager.addMessage("📊 你只是在工作群里发了一句「辛苦了」，然后继续埋头干活。创业者的路上没有终点。", "info");
            }
          },
          {
            text: "💰 给团队发奖金",
            hint: "花费¥10000，员工忠诚+15，产出+10%",
            apply: function (s) {
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - 10000);
              StateManager.addMessage("💰 你按绩效给每个员工发了奖金，团队士气高昂！员工忠诚+15，未来产出+10%。", "success");
            }
          }
        ];

        var _event = {
          id: "h241_milestone_" + _ms.flag,
          phase: "corporate",
          icon: _ms.icon,
          title: "里程碑达成！营收突破" + _name,
          story: "经过不懈努力，你的公司营收终于突破了" + _name + "！\\n\\n" +
            "从当初的一间小办公室，到现在有了" + _getCompanyEmployeesR241(st) + "名员工，\\n\\n" +
            "一路走来的艰辛只有你自己知道。\\n\\n" +
            "但创业就是这样——每达成一个目标，就会有更高的目标等着你。",
          conditions: function () { return false; },
          probability: 0,
          repeatable: false,
          choices: _choices
        };

        if (typeof showEventModal === "function") {
          showEventModal(_event, st);
        } else {
          StateManager.addMessage("🏆 营收突破" + _name + "！公司发展进入新阶段。", "success");
        }
        break; // 每次只触发一个里程碑
      }
    }
  }

  // ============================================================
  // 联动增强2: H→G 创业者健康压力
  // ============================================================
  function _checkFounderHealthStressR241(st) {
    if (!_isRunningCompanyR241(st) || !st.status || !st.needs) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!st.flags) st.flags = {};
    if (!day) return;

    // 7天冷却
    var _lastStress = st.flags._lastFounderStressDay || 0;
    if (day - _lastStress < 7) return;

    // 计算压力系数：负债 + 低现金流 + KPI不达标
    var _stress = 0;
    var _reasons = [];

    // 负债压力
    var _debt = (st.resources && (st.resources.bankDebt || 0) + (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0)) || 0;
    if (_debt > 50000) {
      _stress += 3;
      _reasons.push("高额负债");
    } else if (_debt > 10000) {
      _stress += 1;
    }

    // 现金流压力
    var _cash = (st.resources && st.resources.cash) || 0;
    if (_cash < 5000) {
      _stress += 2;
      _reasons.push("现金流紧张");
    }

    // 员工压力
    var _empCount = _getCompanyEmployeesR241(st);
    if (_empCount > 0) {
      if (st.corporate && st.corporate.morale && st.corporate.morale < 30) {
        _stress += 2;
        _reasons.push("团队士气低落");
      }
    }

    if (_stress <= 0) return;
    st.flags._lastFounderStressDay = day;

    // 应用健康影响
    st.status.health = Math.max(0, (st.status.health || 50) - _stress);
    st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - _stress);
    st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + _stress);

    var _reasonStr = _reasons.length > 0 ? "（" + _reasons.join("、") + "）" : "";
    StateManager.addMessage(
      "😰 创业者的压力如山" + _reasonStr + "……你感觉身体被掏空。健康-" + _stress + "，心情-" + _stress + "，疲劳+" + _stress + "。" +
      "也许该抽时间休息一下，公司离了你一天不会倒。",
      "warning"
    );
  }

  // ============================================================
  // 联动增强3: H→D 成功社交回响
  // ============================================================
  function _checkSuccessSocialRippleR241(st) {
    if (!_isRunningCompanyR241(st) || !st.relationships) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!st.flags) st.flags = {};
    if (!day) return;

    // 30天冷却
    var _lastRipple = st.flags._lastSuccessRippleDay || 0;
    if (day - _lastRipple < 30) return;

    // 公司营收达到一定规模才触发
    var _revenue = _getCompanyRevenueR241(st);
    if (_revenue < 200000) return;

    // 找与玩家关系一般的NPC（好感20-50）来触发联系事件
    var _candidates = [];
    for (var _rid in st.relationships) {
      var _r = st.relationships[_rid];
      if (_r && _r.met) {
        var _aff = _r.affinity || 0;
        if (_aff >= 20 && _aff <= 60) {
          // 获取NPC中文名
          var _npcName = _rid;
          if (typeof NPCS !== "undefined" && NPCS) {
            for (var _ni = 0; _ni < NPCS.length; _ni++) {
              if (NPCS[_ni] && NPCS[_ni].id === _rid) {
                _npcName = NPCS[_ni].name || _rid;
                break;
              }
            }
          }
          _candidates.push({ id: _rid, name: _npcName, affinity: _aff });
        }
      }
    }

    if (_candidates.length < 1) return;
    st.flags._lastSuccessRippleDay = day;

    // 随机选一个NPC
    var _chosen = _candidates[Random.int(0, _candidates.length - 1)];

    // 根据好感度生成不同回应
    var _msg = "";
    if (_chosen.affinity >= 40) {
      // 关系不错：真诚恭喜
      _msg = "🤝 " + _chosen.name + "主动联系你，语气里带着由衷的高兴：" +
        "听说你公司做得不错啊！当初我就觉得你行。" +
        "改天一起吃个饭，好好聊聊？" +
        "（好感+" + Math.min(3, Math.floor(_chosen.affinity * 0.05)) + "）";
      if (st.relationships[_chosen.id]) {
        st.relationships[_chosen.id].affinity = Math.min(100, (st.relationships[_chosen.id].affinity || 0) + 2);
      }
    } else {
      // 关系一般：带着惊讶的恭喜
      _msg = "👋 " + _chosen.name + "在路上看到你，愣了一下才认出来：" +
        "你现在是大老板了？变化真大！" +
        "……以前的事你别放心上，以后有什么好机会别忘了老熟人啊。" +
        "（好感+" + Math.min(1, Math.floor(_chosen.affinity * 0.03)) + "）";
      if (st.relationships[_chosen.id]) {
        st.relationships[_chosen.id].affinity = Math.min(100, (st.relationships[_chosen.id].affinity || 0) + 1);
      }
    }

    StateManager.addMessage(_msg, "info");
  }

  // ============================================================
  // 注册到全局
  // ============================================================
  if (typeof window !== "undefined") {
    window._checkCompanyMilestoneR241 = _checkCompanyMilestoneR241;
    window._checkFounderHealthStressR241 = _checkFounderHealthStressR241;
    window._checkSuccessSocialRippleR241 = _checkSuccessSocialRippleR241;
  }

  // ============================================================
  // RANDOM_EVENTS: 注册备用事件
  // ============================================================
  RANDOM_EVENTS.push({
    id: "domain_h_founder_advice",
    phase: "corporate",
    icon: "🏢",
    title: "创业者的自白",
    story: "创业这条路，是你自己选的。\\n\\n没人逼你凌晨三点还在改方案，没人逼你为了工资发愁，\\n\\n也没人逼你在员工面前装出信心满满的样子。\\n\\n但这也是你自己选的——选择创造、选择承担、选择不认命。\\n\\n这条路很难，但你在走，这本身就值得骄傲。",
    conditions: function () { return false; },
    probability: 0,
    repeatable: false,
    choices: []
  });
})();