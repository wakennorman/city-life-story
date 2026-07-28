/**
 * 域E(经济/投资) 联动增强 R621
 * 主题：stats.investFreq（{symbol:累计交易股数}）全库首事件消费——
 *   该行为统计自 state.js 定义以来仅被 sort_utils 排序与一处"非空"判断使用，
 *   三大维度（单标的深度/标的广度/交易总量）从未进入叙事层。
 * 桥接：
 *   E→D  e621_heavy_trader_regular   单标的深度：某只股票累计交易股数最高→券商客户经理递名片
 *     （社交抉择：接受人脉 vs 保持独立，met铁律不涉及具体NPC，用通用叙事）
 *   E→C  e621_diversify_lesson       标的广度：交易过≥4只不同股票→分散投资心得变职场复盘方法论
 *   E→G  e621_trade_addiction_check  交易总量：累计交易股数过大→频繁交易自省（心智/压力生命回响）
 * 设计原则：全||防御、conditions全false时叙事仍合理、maxRepeats:1冷却、
 *   skills等级读.level、street×2+corporate×1。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR621Loaded) return;
  RANDOM_EVENTS._domainELinkageR621Loaded = true;

  // 工具：安全取 investFreq 快照（返回 {syms:[], total:0, maxSym:null, maxShares:0}）
  function snapInvestFreq(st) {
    var out = { syms: [], total: 0, maxSym: null, maxShares: 0 };
    if (!st || !st.stats || !st.stats.investFreq) return out;
    var f = st.stats.investFreq;
    for (var k in f) {
      if (!f.hasOwnProperty(k)) continue;
      var v = f[k];
      if (typeof v !== "number" || !isFinite(v) || v <= 0) continue;
      out.syms.push(k);
      out.total += v;
      if (v > out.maxShares) { out.maxShares = v; out.maxSym = k; }
    }
    return out;
  }

  var EVENTS = [
    {
      id: "e621_heavy_trader_regular", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "营业部的熟面孔",
      story: "券商营业部的客户经理认出了你——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 1, excludeFlags: ["_e621HeavyTraderCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e621HeavyTraderCooldown) return false;
        var snap = snapInvestFreq(st);
        // 单标的深度：某只股票累计交易≥300股（多轮买卖的老熟客）
        return snap.maxShares >= 300;
      },
      choices: [
        { text: "🤝 接过名片聊聊", hint: "销售XP+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621HeavyTraderCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch (e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          st.flags._e621BrokerContact = true; // E→D 社交资本沉淀，供后续社交/事件消费
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 客户经理笑着递来名片:'常客了,以后有新股申购额度我先想着您。' 多个人脉多条路。销售XP+5,心情+3。", "success");
        }},
        { text: "🙅 婉拒保持独立", hint: "心智+4,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621HeavyTraderCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙅 '谢谢,我习惯自己做决定。' 不被推销左右,是散户最难得的修养。心智+4,会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        var snap = snapInvestFreq(st);
        var sym = (snap && snap.maxSym) || "那只老股票";
        return "券商营业部的客户经理认出了你——'您在" + sym + "上进进出出好些回了吧？像您这样有想法的客户不多。' 他递来一张名片,眼神里带着职业化的热情。";
      }
    },
    {
      id: "e621_diversify_lesson", phase: "corporate", _isChainEvent: false, icon: "🧺",
      title: "不把鸡蛋放一个篮子",
      story: "整理交易记录时你发现自己的组合已经横跨多个行业——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 1, excludeFlags: ["_e621DiversifyCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e621DiversifyCooldown) return false;
        // 标的广度：交易过≥4只不同股票
        var snap = snapInvestFreq(st);
        return snap.syms.length >= 4;
      },
      choices: [
        { text: "📊 写成复盘方法论", hint: "管理XP+6,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621DiversifyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch (e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你把'分散配置、独立决策'整理成一页方法论,发现它同样适用于工作里的资源分配。管理XP+6,智力+2。", "success");
        }},
        { text: "🧮 复核每笔盈亏", hint: "会计XP+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621DiversifyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} }
          st.flags._dataInvestorMindset = true; // 复用既有数据派心态flag(E域生态)
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧮 你逐笔核对了每只股票的成本与收益,数字不会说谎——纪律比感觉可靠。会计XP+6。", "success");
        }}
      ],
      text: function (st) {
        var snap = snapInvestFreq(st);
        var n = (snap && snap.syms.length) || 4;
        return "整理交易记录时你发现自己的组合已经横跨" + n + "只股票——不知不觉间,你已经从'一把梭'的新手,变成了懂得分散风险的投资者。这份经验,或许不止对钱有用。";
      }
    },
    {
      id: "e621_trade_addiction_check", phase: "street", _isChainEvent: false, icon: "⏳",
      title: "手痒的代价",
      story: "深夜复盘时你数了数自己的交易记录——{desc}",
      triggers: { minDay: 120, interval: 200, maxRepeats: 1, excludeFlags: ["_e621TradeCheckCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e621TradeCheckCooldown) return false;
        // 交易总量：累计交易股数≥1500股（高频进出信号）
        var snap = snapInvestFreq(st);
        return snap.total >= 1500;
      },
      choices: [
        { text: "🧘 给自己设交易冷静期", hint: "心智+5,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621TradeCheckCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          st.flags._e621TradeDiscipline = true; // E→G 自律沉淀，供生命周期/成就层消费
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 '每次下单前,先等24小时。' 你给自己立了规矩。手续费省下的是小钱,守住的是心态。心智+5,心情+2。", "success");
        }},
        { text: "📈 我盘感好,继续做T", hint: "会计XP+4,心智-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e621TradeCheckCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch (e) {} }
          if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你相信自己的盘感,继续高频做T。练出了手速和敏感,也熬出了黑眼圈。会计XP+4,心智-2。", "info");
        }}
      ],
      text: function (st) {
        var snap = snapInvestFreq(st);
        var total = (snap && snap.total) || 1500;
        return "深夜复盘时你数了数自己的交易记录——累计成交已超过" + total + "股。频繁进出的快感背后,是不断被磨掉的手续费和睡眠。你问自己:是我在做交易,还是交易在做我？";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
