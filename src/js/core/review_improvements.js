/**
 * Review 改进套件 — P0/P1 综合实现
 *
 * 本模块由 Hermes 全方位评估（2026-06-23）驱动，
 * 把 4 个独立机制打包，避免新建过多文件：
 *
 * 1) [P0-3] 行业热度 → 街头工作收入反馈（关闭世界参数环回路）
 *    问题：行业热度只影响投资/事件权重，对每日 30+ 街头工作毫无作用。
 *    设计：jobs.js 没有 industry 字段，这里维护一份 jobId → sector 映射，
 *    在 doStreetJob 收入阶段乘上 sectorHeat 派生的乘数（±15% 上限）。
 *
 * 2) [P0-4] 中产税：高净值玩家额外支出事件
 *    问题：股票/房产/创业三联击让中后期"赚到就赢"，缺少输得有意思。
 *    设计：每周 7-14 天判定一次"中产税"，触发 1 个临时支出事件；
 *    资产越高，候选事件越重。
 *
 * 3) [P1-1] 35 岁分水岭事件
 *    问题：项目已有"考公/996"事件文本但没真正的年龄危机机制。
 *    设计：街头阶段 35 岁生日当天，触发不可跳过事件，给出 3 条出路。
 *
 * 4) [P1-3] 8 条中国本土动态提示（DYNAMIC_HINTS 扩展）
 *
 * 所有逻辑均为"读 state → 改 state → 留消息"，无副作用、无渲染依赖。
 */

(function () {
  // ========================================================================
  // 1) [P0-3] 行业 → 街头工作映射
  // ========================================================================

  // jobId 前缀 → 关联行业。
  // 命中即取 sectorHeat[sector] 计算乘数：1.0±max15% 收入修正
  var JOB_SECTOR_MAP = {
    // 科技：码农/视频/写作类
    coding: "科技",
    programming: "科技",
    freelance_writing: "科技",
    video_editing: "科技",
    livestream: "消费",
    streamer: "消费",
    // 消费：摆摊/外卖/零售/餐饮
    stall: "消费",
    waiter: "消费",
    sales: "消费",
    cashier: "消费",
    food: "消费",
    cooking: "消费",
    delivery: "消费",
    // 金融：营业员/中介/记账
    bank: "金融",
    accounting: "金融",
    teller: "金融",
    // 房地产：中介/装修/工地
    real_estate: "房地产",
    construction: "房地产",
    decoration: "房地产",
    plumber: "房地产",
    electrician: "房地产",
    welder: "房地产",
    // 医药
    nurse: "医药",
    pharma: "医药",
    medical: "医药",
    // 新能源
    solar: "新能源",
    new_energy: "新能源",
  };

  function _matchSector(jobId) {
    if (!jobId) return null;
    var lower = String(jobId).toLowerCase();
    if (JOB_SECTOR_MAP[lower]) return JOB_SECTOR_MAP[lower];
    var keys = Object.keys(JOB_SECTOR_MAP);
    for (var i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i]) !== -1) return JOB_SECTOR_MAP[keys[i]];
    }
    return null;
  }

  /**
   * 给收入乘以行业热度反馈乘数。
   * 公式：1 + clamp((heat - 1.0) * 0.5, -0.15, +0.15)
   *   - 热度 1.30 → +0.15
   *   - 热度 1.00 → 0
   *   - 热度 0.70 → -0.15
   */
  function getSectorJobIncomeMultiplier(jobId, state) {
    var sector = _matchSector(jobId);
    if (!sector || typeof getSectorHeat !== "function") return 1.0;
    var heat = getSectorHeat(sector);
    if (!heat || heat === 1.0) return 1.0;
    var raw = (heat - 1.0) * 0.5;
    if (raw > 0.15) raw = 0.15;
    if (raw < -0.15) raw = -0.15;
    return 1.0 + raw;
  }

  function getSectorJobIncomeDesc(jobId, state) {
    var sector = _matchSector(jobId);
    if (!sector || typeof getSectorHeat !== "function") return null;
    var heat = getSectorHeat(sector);
    if (!heat) return null;
    if (heat > 1.12) return sector + "行业大热，今日收入水涨船高";
    if (heat < 0.88) return sector + "行业遇冷，单子明显少了";
    return null;
  }

  // ========================================================================
  // 2) [P0-4] 中产税：高净值玩家额外支出事件
  // ========================================================================

  // 触发阈值：总资产（现金+存款+股票市值估算+房产现值估算）≥ threshold
  // 每 7-14 天随机判定一次
  var WEALTH_TAX_EVENTS = [
    {
      id: "wt_property_tax_audit",
      threshold: 300000,
      title: "📋 房产税务核查",
      desc: "房产税试点扩围，社区张贴了告示。你的物业被列入抽查名单。",
      cost: function (totalWealth) {
        return Math.min(15000, Math.floor(totalWealth * 0.012));
      },
      message: "🏠 完成核查并补缴",
    },
    {
      id: "wt_school_donation",
      threshold: 250000,
      title: "🎒 学区赞助费",
      desc: "孩子或亲戚要进重点小学，'家委会'明示需要一笔'教学设备赞助'。",
      cost: function (totalWealth) {
        return Math.min(20000, Math.floor(totalWealth * 0.015));
      },
      message: "💸 你选择了'懂事'地交了赞助费",
    },
    {
      id: "wt_old_classmate_loan",
      threshold: 200000,
      title: "📞 老同学借钱",
      desc: "一个许久未联系的高中同学突然打电话，话题绕半天后开口借 3-5 万周转。",
      cost: function (totalWealth) {
        return Math.min(30000, Math.floor(totalWealth * 0.02));
      },
      message: "🤝 你借了出去（七成借出后大概率收不回）",
      sideEffect: function (s, amt) {
        // 七成概率坏账，三成将来还回（埋一个 fame +/- flag）
        if (Random.chance(0.7)) {
          s.flags._badDebtAmount = (s.flags._badDebtAmount || 0) + amt;
          StateManager.addMessage("💔 这笔钱多半要不回来了", "warning");
        } else {
          s.flags._goodLoanReturn = (s.flags._goodLoanReturn || 0) + amt;
          StateManager.addMessage("📅 对方承诺一年后归还", "info");
        }
      },
    },
    {
      id: "wt_distant_relative",
      threshold: 500000,
      title: "🚪 远房亲戚登门",
      desc: "你不太认识的'表叔'拎着两瓶酒上门，吞吞吐吐说儿子的医药费/婚房首付凑不齐。",
      cost: function (totalWealth) {
        return Math.min(50000, Math.floor(totalWealth * 0.025));
      },
      message: "🙏 你给了对方一些钱，亲戚关系勉强维持",
    },
    {
      id: "wt_management_fee",
      threshold: 400000,
      title: "🏢 物业'特别管理费'",
      desc: "小区业委会通过一项决议：电梯/管道维修启动金，每户按面积摊派。你拿到了第一份账单。",
      cost: function (totalWealth) {
        return Math.min(8000, Math.floor(totalWealth * 0.008));
      },
      message: "📋 你按时缴纳了管理费",
    },
    {
      id: "wt_tax_health_check",
      threshold: 800000,
      title: "🩺 高端体检套餐",
      desc: "中年人体检套餐推销电话一个接一个，加上前段时间睡眠不好——是该去查一查。",
      cost: function (totalWealth) {
        return Math.min(12000, Math.floor(totalWealth * 0.008));
      },
      message: "🏥 你做了一次高端体检",
      sideEffect: function (s) {
        // 概率发现潜在小病小痛
        if (Random.chance(0.35)) {
          StateManager.addMessage(
            "⚠️ 体检报告显示某项指标异常，建议复查",
            "warning",
          );
          s.flags._healthCheckAlert = (s.flags._healthCheckAlert || 0) + 1;
        } else {
          StateManager.addMessage("✅ 体检报告基本正常", "success");
        }
      },
    },
  ];

  function _estimateTotalWealth(state) {
    var r = state.resources || {};
    var inv = state.investment || {};
    var cash = (r.cash || 0) + (r.bankBalance || 0);
    var stockVal = 0;
    if (inv.stockHoldings && inv.stockMarket) {
      inv.stockHoldings.forEach(function (h) {
        var m = inv.stockMarket[h.symbol];
        stockVal += (m ? m.price : 0) * (h.shares || 0);
      });
    }
    var propVal = 0;
    if (inv.properties) {
      inv.properties.forEach(function (p) {
        propVal += p.currentPrice || p.purchasePrice || 0;
      });
    }
    return cash + stockVal + propVal;
  }

  function checkWealthTaxTick(state) {
    if (!state.player || state.player.phase !== "street") return;
    if (state.player.day < 60) return;
    if (state._pendingEvent) return;
    var flags = state.flags || (state.flags = {});
    // 上次判定日
    var lastDay = flags._wealthTaxLastCheckDay || 0;
    var cycle = 7 + Random.int(0, 7); // 7-14 天
    if (state.player.day - lastDay < cycle) return;
    flags._wealthTaxLastCheckDay = state.player.day;

    var wealth = _estimateTotalWealth(state);
    if (wealth < 200000) return;

    // 触发判定：基础 35% 概率
    if (!Random.chance(0.35)) return;

    // 候选事件
    var pool = WEALTH_TAX_EVENTS.filter(function (e) {
      return wealth >= e.threshold && !flags["_wt_done_" + e.id];
    });
    if (pool.length === 0) {
      // 全部触发过 → 重置一轮
      WEALTH_TAX_EVENTS.forEach(function (e) {
        flags["_wt_done_" + e.id] = false;
      });
      pool = WEALTH_TAX_EVENTS.filter(function (e) {
        return wealth >= e.threshold;
      });
      if (pool.length === 0) return;
    }
    var evt = Random.fromArray(pool);
    flags["_wt_done_" + evt.id] = true;

    var amount = evt.cost(wealth);
    showModal({
      title: evt.title,
      body:
        '<p style="line-height:1.7;">' +
        evt.desc +
        '</p><p style="color:var(--text-muted);font-size:12px;">' +
        "预估支出：<strong style='color:var(--danger);'>¥" +
        amount.toLocaleString() +
        "</strong></p>",
      buttons: [
        {
          text: "💸 接受（按规矩办）",
          cls: "btn-primary",
          callback: function () {
            var s = StateManager.getState();
            var actual = Math.min(amount, (s.resources.cash || 0) + (s.resources.bankBalance || 0));
            // 优先扣现金，不够扣存款
            if (s.resources.cash >= actual) {
              s.resources.cash -= actual;
            } else {
              var leftover = actual - s.resources.cash;
              s.resources.cash = 0;
              s.resources.bankBalance = Math.max(
                0,
                (s.resources.bankBalance || 0) - leftover,
              );
            }
            StateManager.addMessage(evt.message + "：-¥" + actual.toLocaleString(), "warning");
            if (evt.sideEffect) evt.sideEffect(s, actual);
            renderAll();
          },
        },
        {
          text: "🚪 拒绝/拖延（可能有后果）",
          cls: "btn-secondary",
          callback: function () {
            var s = StateManager.getState();
            // 拒绝代价：名气/心情
            s.player.fame = Math.max(0, (s.player.fame || 0) - 3);
            s.needs.happiness = Math.max(0, (s.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "你拒绝了。社交关系上有了一道隐形的裂缝。",
              "warning",
            );
            renderAll();
          },
        },
      ],
    });
  }

  // ========================================================================
  // 3) [P1-1] 35 岁分水岭事件
  // ========================================================================

  function check35Crisis(state) {
    if (!state.player) return;
    if (state.player.phase !== "street") return;
    if (state.player.age !== 35) return;
    var flags = state.flags || (state.flags = {});
    if (flags._crisis35Triggered) return;
    if (state._pendingEvent) return;
    flags._crisis35Triggered = true;

    showModal({
      title: "⏳ 35 岁了",
      body:
        '<p style="line-height:1.7;">' +
        "今天你 35 岁了。蛋糕上的蜡烛还没吹，手机已经推送了三条"
        + '"35岁裁员潮"的新闻。' +
        "你看了一眼镜子里的自己——头发没那么茂密，眼角有了细纹。" +
        "<br><br>选一条路走下去吧，未来 10 年的方向就在今天。" +
        "</p>",
      buttons: [
        {
          text: "📚 上岸：备考公务员（智力+5/心情-10）",
          cls: "btn-primary",
          callback: function () {
            var s = StateManager.getState();
            s.player.intelligence = Math.min(100, s.player.intelligence + 5);
            s.needs.happiness = Math.max(0, s.needs.happiness - 10);
            s.flags._crisis35Path = "exam";
            StateManager.addMessage(
              "📖 你买齐了考公教材，把客厅改成了书房。新的人生从书桌开始。",
              "success",
            );
            renderAll();
          },
        },
        {
          text: "💼 转型：再卷一把职场（体质-3/心智+5）",
          cls: "btn-primary",
          callback: function () {
            var s = StateManager.getState();
            s.player.physique = Math.max(1, s.player.physique - 3);
            s.player.mental = Math.min(100, s.player.mental + 5);
            s.flags._crisis35Path = "career";
            StateManager.addMessage(
              "🔥 你删掉了招聘APP里所有30岁以下的过滤器，重新写了简历。",
              "info",
            );
            renderAll();
          },
        },
        {
          text: "🍵 接受：摆烂躺平（疲劳-30/心情+15/名气-5）",
          cls: "btn-secondary",
          callback: function () {
            var s = StateManager.getState();
            s.needs.fatigue = Math.max(0, (s.needs.fatigue || 0) - 30);
            s.needs.happiness = Math.min(100, s.needs.happiness + 15);
            s.player.fame = Math.max(0, (s.player.fame || 0) - 5);
            s.flags._crisis35Path = "lieflat";
            StateManager.addMessage(
              "🍃 你给自己泡了壶茶，告诉自己：人生不必处处是赛跑。",
              "info",
            );
            renderAll();
          },
        },
      ],
    });
  }

  // ========================================================================
  // 4) [P1-3] 扩展动态提示
  // ========================================================================

  var BONUS_HINTS = [
    {
      id: "first_taxi",
      trigger: function (st) {
        return (st.resources.cash || 0) >= 300 && !st.flags._hint_first_taxi;
      },
      message: "💡 提示：现金>300后，打车去远点的地点能省 AP，性价比合适。",
    },
    {
      id: "first_market_dive",
      trigger: function (st) {
        return (
          typeof getSectorHeat === "function" &&
          getSectorHeat("科技") < 0.85 &&
          (st.resources.cash || 0) > 5000 &&
          !st.flags._hint_first_market_dive
        );
      },
      message:
        "📉 行业风向：科技股大跌，技术过硬的工友可能也涨工资困难。投资上反倒是抄底窗口。",
    },
    {
      id: "first_hot_sector",
      trigger: function (st) {
        if (typeof getSectorHeat !== "function") return false;
        var s = ["科技", "消费", "金融", "房地产", "医药", "新能源"];
        for (var i = 0; i < s.length; i++)
          if (getSectorHeat(s[i]) > 1.18) {
            st.flags._hint_first_hot_sector_name = s[i];
            return !st.flags._hint_first_hot_sector;
          }
        return false;
      },
      message:
        "🔥 提示：某行业明显过热。看看股票/创业tab，机会就在风口上。",
    },
    {
      id: "first_rented_house",
      trigger: function (st) {
        return (
          st.housing &&
          st.housing.currentType === "rental" &&
          !st.flags._hint_first_rented_house
        );
      },
      message:
        "🏠 你已经从打地铺升级到租房了。家具/家电对'幸福/疲劳'的恢复速度有质的影响。",
    },
    {
      id: "first_corp_phase",
      trigger: function (st) {
        return (
          st.player.phase === "corporate" && !st.flags._hint_first_corp_phase
        );
      },
      message:
        "💼 欢迎进入职场！7 维属性（发量/尊严/向上管理/KPI/能力/风险/人缘）是新的战场。",
    },
    {
      id: "first_5w",
      trigger: function (st) {
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 50000 && !st.flags._hint_first_5w;
      },
      message:
        "💰 总资产破 5 万。可以考虑👇 三件事：① 还清村长债 ② 买只小盘股 ③ 进货搞批发。",
    },
    {
      id: "first_winter",
      trigger: function (st) {
        return (
          st.weather &&
          (st.weather.season === "winter" || st.weather.season === "冬") &&
          !st.flags._hint_first_winter
        );
      },
      message:
        "❄️ 冬天来了。冷饮摊收入暴跌，热饮/羽绒服却赚钱。注意季节性工作切换。",
    },
    {
      id: "first_npc_max",
      trigger: function (st) {
        if (!st.npcs || !st.npcs.relations) return false;
        var keys = Object.keys(st.npcs.relations);
        for (var i = 0; i < keys.length; i++) {
          if ((st.npcs.relations[keys[i]].friendship || 0) >= 80) {
            return !st.flags._hint_first_npc_max;
          }
        }
        return false;
      },
      message:
        "💞 你和某位 NPC 关系到了 80+。试试和他/她聊天看看是否解锁专属任务。",
    },
  ];

  function _patchDynamicHints() {
    if (typeof window === "undefined") return;
    if (!window.DYNAMIC_HINTS) return;
    var existingIds = window.DYNAMIC_HINTS.map(function (h) {
      return h.id;
    });
    BONUS_HINTS.forEach(function (h) {
      if (existingIds.indexOf(h.id) === -1) {
        window.DYNAMIC_HINTS.push(h);
      }
    });
  }

  // ========================================================================
  // 出口
  // ========================================================================
  if (typeof window !== "undefined") {
    window.getSectorJobIncomeMultiplier = getSectorJobIncomeMultiplier;
    window.getSectorJobIncomeDesc = getSectorJobIncomeDesc;
    window.checkWealthTaxTick = checkWealthTaxTick;
    window.check35Crisis = check35Crisis;
    window.JOB_SECTOR_MAP = JOB_SECTOR_MAP;
    window.WEALTH_TAX_EVENTS = WEALTH_TAX_EVENTS;
    // 延迟挂载动态提示（DYNAMIC_HINTS 可能在 tutorial.js 之后加载）
    setTimeout(_patchDynamicHints, 0);
  }
})();
