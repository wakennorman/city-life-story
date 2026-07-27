/**
 * 域A(数据/数值平衡) 联动增强 R431
 * 设计：激活 trade 子系统三个「已维护但零事件消费」的数据维度（Explore 审计确认）：
 *   state.trade._routeUsage   — phase1/trade.js:311 写入、daily_pipeline 每3天衰减，事件零消费 → 本轮首消费
 *   state.trade._totalSpent   — phase1/trade.js:113 累计进货花费，事件零消费 → 本轮首消费
 *   flags._tradeLearnedInvest — phase1/trade.js:235 写后除自身守卫外零读取（死flag）→ 本轮首消费复活
 * 桥接：
 *   A→D  a431_route_regular    跑熟的路线 → 沿途摊主结缘（守 rel.met 铁律 + applyAffinityChange）
 *   A→E  a431_bulk_buyer_sense 大额进货历练 → 价格周期盘感（复用 _dataInvestorMindset 真实活跃flag）
 *   A→C  a431_ledger_to_career 倒卖悟出的记账习惯 → 职场财务能力（addSkillXp 真实键 accounting）
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR431Loaded) return;
  RANDOM_EVENTS._domainALinkageR431Loaded = true;

  // [全系统自洽修复] 域A 联动辅助：防御性取首个已结识NPC（relationships 可 undefined）
  function firstMetNpcA431(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }
  function bumpAffinityA431(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch (e) {}
    }
  }
  function grantXpA431(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch (e) {} }
  }
  // 熟练路线检测：_routeUsage 任一路线使用度 >= 阈值
  function hotRouteA431(st, minUsage) {
    if (!st || !st.trade || !st.trade._routeUsage) return null;
    for (var rk in st.trade._routeUsage) {
      if ((st.trade._routeUsage[rk] || 0) >= minUsage) return rk;
    }
    return null;
  }

  var EVENTS = [
    {
      // A→D：路线熟练度(_routeUsage 首消费) → 沿途摊主结缘
      id: "a431_route_regular", phase: "street", _isChainEvent: false, icon: "🛵",
      title: "跑熟的路线",
      story: "这条进货路线你已经跑得轻车熟路——{desc}",
      triggers: { minDay: 40, excludeFlags: ["_a431RouteRegularSeen"] },
      conditions: function (st) {
        return !st.gameOver && !!hotRouteA431(st, 3 /* [PLACEHOLDER] 路线使用度阈值 */) && !!firstMetNpcA431(st);
      },
      choices: [
        { text: "🤝 停下来跟熟面孔聊几句", hint: "好感+4,心情+3", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431RouteRegularSeen = true;
          var nid = firstMetNpcA431(st);
          bumpAffinityA431(st, nid, 4 /* [PLACEHOLDER] */, "进货路上常碰面，混成了熟人");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛵 跑熟的路线上全是熟面孔——路是死的，人情是活的。好感+4，心情+3。", "success");
        }},
        { text: "⏱️ 赶时间，点头就走", hint: "无奖励", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431RouteRegularSeen = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "这条进货路线你已经跑得轻车熟路——沿途的摊主都认得你了，有人朝你招手。";
      }
    },
    {
      // A→E：累计进货额(_totalSpent 首消费) → 价格周期盘感
      id: "a431_bulk_buyer_sense", phase: "street", _isChainEvent: false, icon: "📈",
      title: "进货练出的盘感",
      story: "翻着这些日子的进货流水，你忽然咂摸出点门道——{desc}",
      triggers: { minDay: 50, excludeFlags: ["_a431BulkSenseSeen"] },
      conditions: function (st) {
        return !st.gameOver && !!st.trade && (st.trade._totalSpent || 0) >= 8000 /* [PLACEHOLDER] 累计进货额阈值 */;
      },
      choices: [
        { text: "🧠 琢磨价格涨跌的规律", hint: "心智+4,萌生投资意识", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431BulkSenseSeen = true;
          st.flags._dataInvestorMindset = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 上万块的货进出手，你对价格周期有了肌肉记忆——这份盘感，放到投资上也许用得着。心智+4。", "success");
        }},
        { text: "🤷 进货就是进货", hint: "无奖励", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431BulkSenseSeen = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var spent = (st.trade && st.trade._totalSpent) || 0;
        return "翻着这些日子的进货流水，你忽然咂摸出点门道——累计 " + Math.floor(spent) + " 元的真金白银砸下去，什么时候该囤、什么时候该抛，你心里渐渐有谱了。";
      }
    },
    {
      // A→C：倒卖悟性死flag(_tradeLearnedInvest 首消费) → 职场财务能力（跨阶段继承）
      id: "a431_ledger_to_career", phase: "corporate", _isChainEvent: false, icon: "🧾",
      title: "当年的记账本",
      story: "整理旧物时翻出当年倒买倒卖的记账本——{desc}",
      triggers: { minDay: 30, excludeFlags: ["_a431LedgerCareerSeen"] },
      conditions: function (st) {
        return !st.gameOver && !!(st.flags && st.flags._tradeLearnedInvest) && !!(st.corporate && st.corporate.company);
      },
      choices: [
        { text: "💼 把这套账本功夫用到工作上", hint: "会计XP+8,向上评价+2", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431LedgerCareerSeen = true;
          grantXpA431("accounting", 8 /* [PLACEHOLDER] */);
          if (st.player && st.player.corporate) {
            st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧾 街头练出的记账功夫在办公室照样好使——报表做得又快又准，上级看在眼里。会计XP+8。", "success");
        }},
        { text: "📦 收起来，留个纪念", hint: "心情+2", apply: function (st) {
          if (!st) return;
          st.flags = st.flags || {};
          st.flags._a431LedgerCareerSeen = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "整理旧物时翻出当年倒买倒卖的记账本——一笔笔进出记得工工整整。那时练下的数字功夫，如今在职场上依然是你的底气。";
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
