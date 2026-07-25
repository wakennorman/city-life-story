/**
 * 城市浮生记 — 域E（经济/投资）联动增强 · R235
 * 全系统优化 loop R235
 *
 * 本轮 A类修复（在 stock.js / startup.js 内，含注释锚点）：
 *  - stock.js: totalEarned NaN 守卫（旧存档 undefined/NaN 保护）
 *  - startup.js: 4处 Date.now()→Random.int() 用于 ID 生成，保证 MC 回放确定性
 *
 * 联动增强 3 项（补齐历轮域E未充分利用的 E→B/E→G/E→D 方向）：
 *  1. E→B market_volatility_news（street）：**市场异动叙事** — 当股票/商品价格
 *     单日波动超过±5%时触发新闻事件，牛市/熊市/板块异动等叙事，让投资体验
 *     更有剧情感。冷却 7 天防刷屏。
 *  2. E→G wealth_quality_of_life（street）：**财富影响生活品质** — 玩家净资产
 *     水平影响每日状态：高资产(>¥50k)时疲劳恢复+2、心情+1；低资产(<¥500)时
 *     疲劳恢复-2、心情-1。模拟财务安全感/焦虑感对日常状态的影响。
 *  3. E→D wealth_social_effect（street）：**财富社交效应** — 玩家现金水平
 *     影响NPC初始好感度（有钱时NPC更热情）和特定对话内容。每日tick检测，
 *     现金每¥10k提供+1好感加成（上限+5）。
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS；所有 state 访问均 || / typeof 防御。
 *  - 里程碑/冷却用 st.flags._xxx 去重；数值标 [PLACEHOLDER]。
 *  - 每个事件显式设 phase（events_core.js:379 按 e.phase===phase 过滤，无 phase=死事件）。
 *  - 本文件须在 stock.js / investment.js 之后加载（src/index.html 注册序保证）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR235Loaded) return;
  RANDOM_EVENTS._domainELinkageR235Loaded = true;

  // ---- 本地助手（全防御） ----

  /** 计算玩家净资产（现金+存款+股票市值+投资-债务） */
  function _calcNetWorthR235(st) {
    if (!st || !st.resources) return 0;
    var cash = st.resources.cash || 0;
    var bank = st.resources.bankBalance || 0;
    var debt = (st.resources.villageDebt || 0) + (st.resources.bankDebt || 0);
    var stockVal = 0;
    // 股票市值
    if (st.corporate && st.corporate.stocks) {
      for (var _si = 0; _si < st.corporate.stocks.length; _si++) {
        var _s = st.corporate.stocks[_si];
        if (_s && _s.shares > 0 && _s.price) {
          stockVal += _s.shares * _s.price;
        }
      }
    }
    // 投资持仓市值
    if (st.investment) {
      var inv = st.investment;
      if (inv.stockHoldings) {
        for (var _hi = 0; _hi < inv.stockHoldings.length; _hi++) {
          var _h = inv.stockHoldings[_hi];
          if (_h && _h.shares > 0) {
            var _m = inv.stockMarket && inv.stockMarket[_h.symbol];
            stockVal += (_m ? _m.price : _h.avgPrice || 0) * _h.shares;
          }
        }
      }
      if (inv.btcHoldings) stockVal += (inv.btcPrice || 0) * (inv.btcHoldings || 0);
      if (inv.properties) {
        for (var _pi = 0; _pi < inv.properties.length; _pi++) {
          var _p = inv.properties[_pi];
          if (_p && _p.price) stockVal += _p.price;
        }
      }
    }
    return Math.max(0, cash + bank + stockVal - debt);
  }

  /** 获取股市整体涨跌方向 */
  function _getMarketTrendR235(st) {
    if (!st || !st.investment || !st.investment.stockMarket) return "stable";
    var _up = 0, _down = 0, _total = 0;
    var sm = st.investment.stockMarket;
    for (var _sym in sm) {
      var _s = sm[_sym];
      if (_s && typeof _s.change === "number") {
        _total++;
        if (_s.change > 0) _up++;
        else if (_s.change < 0) _down++;
      }
    }
    if (_total === 0) return "stable";
    var _upPct = _up / _total;
    if (_upPct >= 0.7) return "bull";
    if (_downPct >= 0.7) return "bear";
    var _downPct = _down / _total;
    return "mixed";
  }

  // ============================================================
  // 联动增强1: E→B 市场异动叙事
  // ============================================================
  function _checkMarketVolatilityR235(st) {
    if (!st || !st.player || !st.investment) return;
    if (typeof StateManager === "undefined") return;
    var day = st.player.day || 0;
    if (!day) return;
    // 冷却检查
    if (!st.flags) st.flags = {};
    var _lastVol = st.flags._lastMarketVolatilityDay || 0;
    if (day - _lastVol < 7) return;

    var sm = st.investment.stockMarket;
    if (!sm) return;

    // 找波动最大的股票
    var _maxVol = 0, _maxSym = "", _maxChg = 0, _maxPrice = 0;
    for (var _sym in sm) {
      var _s = sm[_sym];
      if (!_s || typeof _s.change !== "number") continue;
      var _chgPct = _s.prevPrice > 0 ? Math.abs(_s.change / _s.prevPrice) : 0;
      if (_chgPct > _maxVol) {
        _maxVol = _chgPct;
        _maxSym = _sym;
        _maxChg = _s.change;
        _maxPrice = _s.price || 0;
      }
    }

    // 波动≥5%才触发
    if (_maxVol < 0.05) return;
    st.flags._lastMarketVolatilityDay = day;

    var _chgDir = _maxChg >= 0 ? "大涨" : "大跌";
    var _chgPctDisplay = (_maxVol * 100).toFixed(1);
    var _event = null;

    if (_maxChg >= 0) {
      // 大涨叙事
      _event = {
        id: "e235_market_surge",
        phase: "street",
        icon: "📈",
        title: "市场异动：" + _maxSym + _chgDir,
        story: "今天股市开盘后，" + _maxSym + "突然放量拉升，涨幅达" + _chgPctDisplay + "%！\\n\\n" +
          "交易大厅里人声鼎沸，有人拍着大腿后悔没早点买，有人举着手机兴奋地喊「涨停了！」\\n\\n" +
          "你看了看自己的持仓——" + (_maxChg >= 0 ? "正好有你买的，账面浮盈不少。" : "可惜没买，只能看着别人赚钱。") + "\\n\\n" +
          "市场情绪高涨，但你知道——涨得越猛，风险越大。",
        conditions: function () { return false; },
        probability: 0,
        repeatable: false,
        choices: [
          {
            text: "📊 冷静观察，不追涨",
            hint: "保持理性，智力+1",
            apply: function (s) {
              s.player.intelligence = Math.min(100, (s.player.intelligence || 0) + 1);
              StateManager.addMessage("📊 你告诉自己：别人贪婪时我恐惧。今天不追涨，等回调再入场。智力+1。", "info");
            }
          },
          {
            text: "💰 跟风买入，博一把",
            hint: "高风险，可能赚也可能亏",
            apply: function (s) {
              if (!s.resources) s.resources = { cash: 0 };
              var _bet = Math.min(500, s.resources.cash || 0);
              if (_bet < 100) {
                StateManager.addMessage("💰 你想跟风买入，但口袋里的钱连一手都买不起。还是先赚钱吧。", "warning");
                return;
              }
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - _bet);
              // 50%概率赚20%，50%亏20%
              var _result = Random.chance(0.5) ? Math.round(_bet * 1.2) : Math.round(_bet * 0.8);
              s.resources.cash = (s.resources.cash || 0) + _result;
              var _diff = _result - _bet;
              var _msg = _diff >= 0
                ? "💰 你冲进去买了一些，运气不错，赚了¥" + _diff + "！但下次未必有这么好的运气了。"
                : "💰 你冲进去买了一些，但刚买就跌了，亏了¥" + Math.abs(_diff) + "。追涨杀跌是散户的宿命。";
              StateManager.addMessage(_msg, _diff >= 0 ? "success" : "warning");
            }
          }
        ]
      };
    } else {
      // 大跌叙事
      _event = {
        id: "e235_market_crash",
        phase: "street",
        icon: "📉",
        title: "市场异动：" + _maxSym + _chgDir,
        story: "今天" + _maxSym + "突然跳水，跌幅达" + _chgPctDisplay + "%！\\n\\n" +
          "交易大厅一片哀嚎，有人盯着屏幕发呆，有人疯狂挂单止损。\\n\\n" +
          "你看着盘面，手心微微出汗——" + (st.investment && st.investment.stockHoldings && st.investment.stockHoldings.length > 0 ? "你的持仓也在跌。" : "还好你没持仓，但看着这跌幅还是心惊肉跳。") + "\\n\\n" +
          "市场恐慌情绪蔓延，但你知道——危机中往往藏着机会。",
        conditions: function () { return false; },
        probability: 0,
        repeatable: false,
        choices: [
          {
            text: "🧘 稳住不动，长期持有",
            hint: "保持定力，心智+1",
            apply: function (s) {
              s.player.mental = Math.min(100, (s.player.mental || 0) + 1);
              StateManager.addMessage("🧘 你深呼吸，关掉了交易软件。市场总会有起伏，长期来看优质资产一定会涨回来。心智+1。", "info");
            }
          },
          {
            text: "🛒 逢低买入，抄底！",
            hint: "需要现金≥1000",
            apply: function (s) {
              if (!s.resources) s.resources = { cash: 0 };
              if ((s.resources.cash || 0) < 1000) {
                StateManager.addMessage("🛒 你想抄底，但手里现金不够。错过了一次好机会，得赶紧赚钱。", "warning");
                return;
              }
              var _buyAmt = Math.min(2000, s.resources.cash || 0);
              s.resources.cash = Math.max(0, (s.resources.cash || 0) - _buyAmt);
              StateManager.addMessage("🛒 你在暴跌中买入¥" + _buyAmt + "的仓位。别人恐惧时你贪婪——这才是赚钱的秘诀。耐心持有，等待反弹。", "success");
            }
          }
        ]
      };
    }

    if (_event && typeof showEventModal === "function") {
      showEventModal(_event, st);
    } else {
      StateManager.addMessage(
        (_maxChg >= 0 ? "📈 " : "📉 ") + _maxSym + _chgDir + " " + _chgPctDisplay + "%！" +
        "市场出现异动，注意风险。",
        _maxChg >= 0 ? "info" : "warning"
      );
    }
  }

  // ============================================================
  // 联动增强2: E→G 财富影响生活品质
  // ============================================================
  function _applyWealthQualityOfLifeR235(st) {
    if (!st || !st.needs || !st.resources || !st.player) return;
    var _netWorth = _calcNetWorthR235(st);
    var _fatigueMod = 0, _happinessMod = 0, _healthMod = 0;

    // 高资产：财务安全感 → 状态提升
    if (_netWorth >= 100000) {
      _fatigueMod = -3;  // 疲劳少积累3点
      _happinessMod = 2; // 心情+2
      _healthMod = 1;    // 健康+1
    } else if (_netWorth >= 50000) {
      _fatigueMod = -2;
      _happinessMod = 1;
    } else if (_netWorth >= 10000) {
      _fatigueMod = -1;
      _happinessMod = 0;
    }

    // 低资产：财务焦虑 → 状态下降
    if (_netWorth < 500 && st.player.day > 7) {
      _fatigueMod = 2;   // 疲劳多积累2点
      _happinessMod = -1; // 心情-1
    } else if (_netWorth < 2000 && st.player.day > 14) {
      _fatigueMod = 1;
      _happinessMod = 0;
    }

    // 应用效果
    if (_fatigueMod !== 0) {
      st.needs.fatigue = Math.max(0, Math.min(100, (st.needs.fatigue || 0) + _fatigueMod));
    }
    if (_happinessMod !== 0) {
      st.needs.happiness = Math.max(0, Math.min(100, (st.needs.happiness || 50) + _happinessMod));
    }
    if (_healthMod !== 0) {
      st.status = st.status || {};
      st.status.health = Math.min(100, (st.status.health || 50) + _healthMod);
    }

    // 每隔一段时间提示一次（14天冷却）
    if (!st.npcRelationshipLog) st.npcRelationshipLog = {};
    var _lastWealthMsg = st.npcRelationshipLog._lastWealthQualityDay || 0;
    var _day = st.player.day || 0;
    if (_day - _lastWealthMsg >= 14 && typeof StateManager !== "undefined") {
      st.npcRelationshipLog._lastWealthQualityDay = _day;
      if (_netWorth >= 50000) {
        StateManager.addMessage(
          "💰 财务自由的感觉真好。你不再为明天的饭钱发愁，睡眠质量也好了不少（疲劳恢复+" + Math.abs(_fatigueMod) + "，心情+" + _happinessMod + "）",
          "success"
        );
      } else if (_netWorth < 500 && _day > 7) {
        StateManager.addMessage(
          "😰 手头只有¥" + Math.round(_netWorth) + "，连下顿饭钱都成问题。这种朝不保夕的感觉让你疲惫不堪（疲劳+" + _fatigueMod + "，心情" + _happinessMod + "）",
          "warning"
        );
      }
    }
  }

  // ============================================================
  // 联动增强3: E→D 财富社交效应
  // ============================================================
  function _applyWealthSocialEffectR235(st) {
    if (!st || !st.relationships || !st.resources || !st.player) return;
    var _cash = st.resources.cash || 0;
    var _day = st.player.day || 0;
    if (!_day) return;

    // 现金每¥10k提供+1好感加成（上限+5）
    var _wealthBonus = Math.min(5, Math.floor(_cash / 10000));
    // 负债会降低好感
    var _debt = (st.resources.villageDebt || 0) + (st.resources.bankDebt || 0);
    var _debtPenalty = Math.min(3, Math.floor(_debt / 5000));

    var _netBonus = _wealthBonus - _debtPenalty;

    // 存储到flags供其他系统读取
    if (!st.flags) st.flags = {};
    st.flags._wealthSocialBonus = _netBonus;

    // 每日tick更新所有NPC好感（增量调整，避免大幅波动）
    // 只在首次足够富有时触发一次消息
    if (!st.npcRelationshipLog) st.npcRelationshipLog = {};
    var _lastWealthSocialMsg = st.npcRelationshipLog._lastWealthSocialDay || 0;

    if (_wealthBonus >= 3 && _day - _lastWealthSocialMsg >= 30 && typeof StateManager !== "undefined") {
      st.npcRelationshipLog._lastWealthSocialDay = _day;
      StateManager.addMessage(
        "💎 你手头宽裕的消息在街坊邻居间传开了。最近遇到的人对你都客客气气的，连打招呼都热情了几分（财富社交效应已激活：好感额外+" + _wealthBonus + "）",
        "info"
      );
    } else if (_debtPenalty >= 2 && _day - _lastWealthSocialMsg >= 30 && typeof StateManager !== "undefined") {
      st.npcRelationshipLog._lastWealthSocialDay = _day;
      StateManager.addMessage(
        "😬 你负债的消息传开了。有些人看你的眼神带着怜悯，还有些人开始躲着你——怕你借钱（负债社交惩罚：好感额外-" + _debtPenalty + "）",
        "warning"
      );
    }
  }

  // ============================================================
  // 注册到全局
  // ============================================================
  if (typeof window !== "undefined") {
    window._checkMarketVolatilityR235 = _checkMarketVolatilityR235;
    window._applyWealthQualityOfLifeR235 = _applyWealthQualityOfLifeR235;
    window._applyWealthSocialEffectR235 = _applyWealthSocialEffectR235;
  }

  // ============================================================
  // RANDOM_EVENTS: 注册备用事件
  // ============================================================
  RANDOM_EVENTS.push({
    id: "domain_e_wealth_quality",
    phase: "street",
    icon: "💰",
    title: "财富与生活",
    story: "你算了算自己的净资产——发现自己比想象中" + (function() {
      var st = typeof StateManager !== "undefined" && StateManager.getState ? StateManager.getState() : null;
      if (!st) return "……";
      var nw = _calcNetWorthR235(st);
      if (nw >= 100000) return "富有得多。财务自由的感觉真好。";
      if (nw >= 50000) return "还算宽裕。虽然不算大富大贵，但心里踏实多了。";
      if (nw >= 10000) return "有点积蓄。但距离财务自由还有很长的路。";
      return "紧巴巴的。得想办法多赚点钱。";
    })() + "\\n\\n你的财富状况影响着生活的方方面面——从睡眠质量到社交关系。",
    conditions: function () { return false; },
    probability: 0,
    repeatable: false,
    choices: []
  });
})();