#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate updated investment.js with expanded assets, canvas charts, and new sub-tabs."""

import os

JS = r"""/**
 * 投资系统 — 股票 / 比特币 / 贵金属 / 期货基金 / 房地产 / 汽车
 */

const INV_STOCKS = [
  // ---- 股票（13只） ----
  { symbol: "STAR",  name: "星辰科技",   category: "股票", industry: "科技",     basePrice: 120,  volatility: 0.18, trend:  0.005, desc: "AI龙头" },
  { symbol: "BYTE",  name: "字节龙",     category: "股票", industry: "科技",     basePrice: 280,  volatility: 0.16, trend:  0.004, desc: "互联网巨头" },
  { symbol: "GAME",  name: "好玩游戏",   category: "股票", industry: "科技",     basePrice: 45,   volatility: 0.22, trend: -0.003, desc: "游戏股" },
  { symbol: "SAFE",  name: "安信金融",   category: "股票", industry: "金融",     basePrice: 65,   volatility: 0.08, trend:  0.002, desc: "国有大行" },
  { symbol: "BREW",  name: "醉鹅啤酒",   category: "股票", industry: "消费",     basePrice: 35,   volatility: 0.07, trend:  0.001, desc: "国民啤酒" },
  { symbol: "DRUG",  name: "华佗医药",   category: "股票", industry: "医药",     basePrice: 95,   volatility: 0.13, trend:  0.003, desc: "创新药企" },
  { symbol: "OIL",   name: "黑金能源",   category: "股票", industry: "能源",     basePrice: 18,   volatility: 0.15, trend:  0.0,   desc: "油价绑定" },
  { symbol: "ESTATE",name: "万城地产",   category: "股票", industry: "房地产",   basePrice: 8.5,  volatility: 0.2,  trend: -0.008, desc: "行业寒冬" },
  { symbol: "NEV",   name: "新能智行",   category: "股票", industry: "新能源",   basePrice: 160,  volatility: 0.2,  trend:  0.006, desc: "电动汽车龙头" },
  { symbol: "CHIP",  name: "芯原半导体", category: "股票", industry: "科技",     basePrice: 180,  volatility: 0.17, trend:  0.005, desc: "芯片制造" },
  { symbol: "SOLAR", name: "阳光电源",   category: "股票", industry: "新能源",   basePrice: 55,   volatility: 0.14, trend:  0.004, desc: "光伏龙头" },
  { symbol: "AGRI",  name: "中粮集团",   category: "股票", industry: "农业",     basePrice: 12,   volatility: 0.06, trend:  0.001, desc: "粮食安全" },
  { symbol: "MEDIA", name: "星辰传媒",   category: "股票", industry: "传媒",     basePrice: 25,   volatility: 0.11, trend: -0.002, desc: "文娱龙头" },
  // ---- 贵金属 ----
  { symbol: "XAU",   name: "黄金",       category: "贵金属", basePrice: 450,   volatility: 0.04, trend:  0.001, desc: "国际金价/克", unit: "g" },
  { symbol: "XAG",   name: "白银",       category: "贵金属", basePrice: 5.2,   volatility: 0.06, trend:  0.0005,desc: "国际银价/克", unit: "g" },
  // ---- 期货 ----
  { symbol: "CL",    name: "原油期货",   category: "期货",   basePrice: 580,   volatility: 0.12, trend:  0.002, desc: "原油/桶",     unit: "桶" },
  // ---- 基金 ----
  { symbol: "BOND",  name: "国债基金",   category: "基金",   basePrice: 105,   volatility: 0.01, trend:  0.0003,desc: "稳健收益",   unit: "份" },
];

const PROPERTIES = [
  { id: "apt_old",  name: "老破小公寓", type: "住宅",   price: 500000,  appreciation: 0.0003, rent: 1500,  desc: "租售比高" },
  { id: "apt_new",  name: "精装两居室", type: "住宅",   price: 1500000, appreciation: 0.0005, rent: 4000,  desc: "适合自住" },
  { id: "luxury",   name: "江景豪宅",   type: "住宅",   price: 5000000, appreciation: 0.0008, rent: 12000, desc: "身份象征" },
  { id: "shop",     name: "街边商铺",   type: "商铺",   price: 800000,  appreciation: 0.0006, rent: 5000,  desc: "租金稳定" },
  { id: "office",   name: "写字楼单元", type: "写字楼", price: 2000000, appreciation: 0.0004, rent: 8000,  desc: "企业租户多" },
];

const CAR_TYPES = [
  { id: "van",        name: "二手面包车", price: 30000,  depreciation: 0.0008, maintenance: 300,  travelBonus: 5,  desc: "实用之选" },
  { id: "sedan",      name: "家用轿车",   price: 120000, depreciation: 0.0005, maintenance: 800,  travelBonus: 10, desc: "体面省油" },
  { id: "luxury_car", name: "豪华跑车",   price: 500000, depreciation: 0.001,  maintenance: 2000, travelBonus: 15, desc: "倍有面子" },
];

function initInvestment(state) {
  var inv = state.investment;
  if (!inv) return;
  for (var i = 0; i < INV_STOCKS.length; i++) {
    var s = INV_STOCKS[i];
    if (!inv.stockMarket[s.symbol])
      inv.stockMarket[s.symbol] = {
        price: s.basePrice * (0.85 + Math.random() * 0.3),
        history: [],
      };
  }
  if (inv.btcPrice <= 0) inv.btcPrice = 200000;
  if (!inv.btcHistory) inv.btcHistory = [];
  inv.lastTickDay = state.player.day;
}

function tickInvestmentDaily(state) {
  var inv = state.investment;
  if (!inv || inv.lastTickDay >= state.player.day) return;
  inv.lastTickDay = state.player.day;

  // 股票/贵金属/期货/基金每日波动
  for (var i = 0; i < INV_STOCKS.length; i++) {
    var s = INV_STOCKS[i];
    var m = inv.stockMarket[s.symbol];
    if (!m) continue;
    m.price = Math.max(
      0.01,
      m.price * (1 + s.trend + (Math.random() - 0.5) * 2 * s.volatility),
    );
    m.price = Math.round(m.price * 100) / 100;
    m.history.push({ day: state.player.day, price: m.price });
    if (m.history.length > 20) m.history.shift();
  }

  // 比特币
  if (inv.btcPrice > 0) {
    inv.btcFearGreed = Math.max(
      5,
      Math.min(95, (inv.btcFearGreed || 50) + (Math.random() - 0.5) * 10),
    );
    inv.btcPrice = Math.max(
      1000,
      Math.round(
        inv.btcPrice *
          (1 +
            (Math.random() - 0.5) * 0.08 +
            ((inv.btcFearGreed - 50) / 50) * 0.02),
      ),
    );
    if (!inv.btcHistory) inv.btcHistory = [];
    inv.btcHistory.push({ day: state.player.day, price: inv.btcPrice });
    if (inv.btcHistory.length > 30) inv.btcHistory.shift();

    if (state.player.day - inv.btcHalvingDay > 1460) {
      inv.btcHalvingDay = state.player.day;
      inv.btcFearGreed = Math.min(95, inv.btcFearGreed + 20);
      StateManager.addMessage("比特币减半事件！", "event");
    }
  }

  // 房产
  for (var p = 0; p < (inv.properties || []).length; p++) {
    var prop = inv.properties[p];
    prop.currentPrice = Math.round(
      (prop.currentPrice || prop.buyPrice) *
        (1 + prop.appreciation + (Math.random() - 0.5) * 0.002),
    );
    if (state.player.day % 30 === 0) state.resources.cash += prop.rent || 0;
  }

  // 汽车
  for (var c = 0; c < (inv.cars || []).length; c++) {
    var car = inv.cars[c];
    car.currentPrice = Math.round(
      (car.currentPrice || car.buyPrice) * (1 - car.depreciation),
    );
    if (state.player.day % 30 === 0 && state.resources.cash >= car.maintenance)
      state.resources.cash -= car.maintenance;
  }
}

function buyInvStock(symbol, shares) {
  var state = StateManager.getState();
  var inv = state.investment;
  var m = inv.stockMarket[symbol];
  if (!m) return;
  var cost = Math.round(m.price * shares * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  var h = inv.stockHoldings.find(function(s) { return s.symbol === symbol; });
  if (h) {
    var total = h.shares + shares;
    h.avgPrice = Math.round(((h.avgPrice * h.shares + cost) / total) * 100) / 100;
    h.shares = total;
  } else inv.stockHoldings.push({ symbol: symbol, shares: shares, avgPrice: m.price });
  StateManager.addMessage("买入 " + symbol + " " + shares + "股", "success");
}

function sellInvStock(symbol, shares) {
  var state = StateManager.getState();
  var inv = state.investment;
  var h = inv.stockHoldings.find(function(s) { return s.symbol === symbol; });
  if (!h || h.shares < shares) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  var m = inv.stockMarket[symbol];
  var revenue = Math.round(m.price * shares * 100) / 100;
  state.resources.cash += revenue;
  h.shares -= shares;
  if (h.shares <= 0)
    inv.stockHoldings = inv.stockHoldings.filter(function(s) { return s.symbol !== symbol; });
  StateManager.addMessage("卖出 " + symbol + " " + shares + "股", "success");
}

function buyBtc(amount) {
  var state = StateManager.getState();
  var inv = state.investment;
  var cost = Math.round(inv.btcPrice * amount * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  inv.btcHoldings = Math.round((inv.btcHoldings + amount) * 10000) / 10000;
  StateManager.addMessage("买入 " + amount + " BTC", "success");
}

function sellBtc(amount) {
  var state = StateManager.getState();
  var inv = state.investment;
  if (inv.btcHoldings < amount) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  state.resources.cash += Math.round(inv.btcPrice * amount * 100) / 100;
  inv.btcHoldings = Math.round((inv.btcHoldings - amount) * 10000) / 10000;
  StateManager.addMessage("卖出 " + amount + " BTC", "success");
}

function buyProperty(propId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var prop = PROPERTIES.find(function(p) { return p.id === propId; });
  if (!prop) return;
  if (state.resources.cash < prop.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= prop.price;
  inv.properties.push({
    id: prop.id, name: prop.name, type: prop.type,
    appreciation: prop.appreciation, rent: prop.rent,
    buyPrice: prop.price, currentPrice: prop.price, buyDay: state.player.day,
  });
  StateManager.addMessage("购入" + prop.name, "success");
}

function sellProperty(propId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var idx = -1;
  for (var i = 0; i < inv.properties.length; i++) {
    if (inv.properties[i].id === propId) { idx = i; break; }
  }
  if (idx < 0) return;
  var prop = inv.properties[idx];
  var net = prop.currentPrice - Math.round(prop.currentPrice * 0.05);
  state.resources.cash += net;
  inv.properties.splice(idx, 1);
  StateManager.addMessage("出售" + prop.name + " 到手" + net, "success");
}

function buyCar(carId) {
  var state = StateManager.getState();
  var inv = state.investment;
  var car = CAR_TYPES.find(function(c) { return c.id === carId; });
  if (!car) return;
  if (state.resources.cash < car.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= car.price;
  inv.cars.push({
    id: car.id, name: car.name,
    depreciation: car.depreciation, maintenance: car.maintenance,
    travelBonus: car.travelBonus,
    buyPrice: car.price, currentPrice: car.price, buyDay: state.player.day,
  });
  state.player.maxActionPoints = (state.player.maxActionPoints || 100) + car.travelBonus;
  state.player.actionPoints = Math.min(
    state.player.maxActionPoints,
    state.player.actionPoints + car.travelBonus,
  );
  StateManager.addMessage("购入" + car.name + " 行动力上限+" + car.travelBonus, "success");
}

// ============================================================
//  Canvas 涨跌曲线图
// ============================================================
function drawPriceChart(canvasId, priceData, color) {
  var canvas = typeof canvasId === "string" ? document.getElementById(canvasId) : canvasId;
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  var data = (priceData || []).slice(-20);
  if (data.length < 2) {
    ctx.fillStyle = "#999";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("等待数据...", W / 2, H / 2);
    return;
  }

  var prices = [];
  for (var i = 0; i < data.length; i++) prices.push(data[i].price);

  var minP = prices[0], maxP = prices[0];
  for (var i = 1; i < prices.length; i++) {
    if (prices[i] < minP) minP = prices[i];
    if (prices[i] > maxP) maxP = prices[i];
  }
  var range = maxP - minP;
  if (range === 0) range = minP * 0.1 || 1;
  var padT = 4, padB = 4, padL = 4, padR = 4;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;

  // 网格线
  if (ctx.strokeStyle) {
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    for (var i = 0; i < 4; i++) {
      var y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
    }
  }

  // 折线
  var lineColor = color || "#4fc3f7";
  ctx.beginPath();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  var firstX, firstY, lastX, lastY;
  for (var i = 0; i < prices.length; i++) {
    var x = padL + (i / (prices.length - 1)) * chartW;
    var y = padT + chartH - ((prices[i] - minP) / range) * chartH;
    if (i === 0) {
      ctx.moveTo(x, y);
      firstX = x; firstY = y;
    } else {
      ctx.lineTo(x, y);
    }
    if (i === prices.length - 1) { lastX = x; lastY = y; }
  }
  ctx.stroke();

  // 渐变填充
  var grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, lineColor + "30");
  grad.addColorStop(1, lineColor + "02");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(firstX, H - padB);
  for (var i = 0; i < prices.length; i++) {
    var x = padL + (i / (prices.length - 1)) * chartW;
    var y = padT + chartH - ((prices[i] - minP) / range) * chartH;
    if (i === 0) ctx.lineTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(lastX, H - padB);
  ctx.closePath();
  ctx.fill();

  // 当前价格
  var lastPrice = prices[prices.length - 1];
  var prevPrice = prices.length >= 2 ? prices[prices.length - 2] : lastPrice;
  var chg = lastPrice - prevPrice;
  var chgPct = prevPrice !== 0 ? ((chg / prevPrice) * 100).toFixed(2) : "0.00";
  var chgText = (chg >= 0 ? "+" : "") + chgPct + "%";

  ctx.fillStyle = lineColor;
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(lastPrice.toFixed(2), padL + 2, padT + 10);

  ctx.fillStyle = chg >= 0 ? "#4caf50" : "#f44336";
  ctx.font = "9px sans-serif";
  ctx.fillText(chgText, padL + 2, padT + 21);
}

// ============================================================
//  投资主页面渲染
// ============================================================
function renderInvestmentTab(state, parent) {
  var inv = state.investment;
  if (!inv) {
    parent.innerHTML = "<p>投资系统加载中...</p>";
    return;
  }
  if (Object.keys(inv.stockMarket).length === 0 && typeof initInvestment === "function")
    initInvestment(state);

  // 按类别统计资产市值
  var stockVal = 0, preciousVal = 0, futuresVal = 0;
  for (var i = 0; i < inv.stockHoldings.length; i++) {
    var h = inv.stockHoldings[i];
    var def = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === h.symbol) { def = INV_STOCKS[j]; break; }
    }
    if (!def) continue;
    var val = (inv.stockMarket[h.symbol] ? inv.stockMarket[h.symbol].price : 0) * h.shares;
    if (def.category === "股票") stockVal += val;
    else if (def.category === "贵金属") preciousVal += val;
    else if (def.category === "期货" || def.category === "基金") futuresVal += val;
  }
  var btcVal = inv.btcPrice * (inv.btcHoldings || 0);
  var propVal = 0;
  for (var i = 0; i < (inv.properties || []).length; i++)
    propVal += inv.properties[i].currentPrice || inv.properties[i].buyPrice;
  var carVal = 0;
  for (var i = 0; i < (inv.cars || []).length; i++)
    carVal += inv.cars[i].currentPrice || inv.cars[i].buyPrice;
  var totalInv = stockVal + btcVal + preciousVal + futuresVal + propVal + carVal;

  parent.innerHTML = "";
  var cont = document.createElement("div");

  cont.innerHTML =
    '<h3>投资中心 <span style="font-size:12px;color:var(--accent);">总资产 ' +
    totalInv.toLocaleString() +
    "</span></h3>" +
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' +
    summaryCard("股票", stockVal) +
    summaryCard("比特币", btcVal) +
    summaryCard("贵金属", preciousVal) +
    summaryCard("期货基金", futuresVal) +
    summaryCard("房产", propVal) +
    summaryCard("汽车", carVal) +
    "</div>" +
    '<div style="display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap;">' +
    '<button class="btn btn-sm sub-tab active" data-stab="stocks">股票</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="btc">比特币</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="precious">贵金属</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="futures">期货基金</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="re">房产</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="car">汽车</button>' +
    '</div><div id="inv-sub-area"></div>';

  parent.appendChild(cont);

  var renderSub = function(stab) {
    var area = document.getElementById("inv-sub-area");
    if (!area) return;
    area.innerHTML = "";
    if (stab === "stocks") renderStocks(area, inv, state, parent);
    else if (stab === "btc") renderBtc(area, inv, state, parent);
    else if (stab === "precious") renderPrecious(area, inv, state, parent);
    else if (stab === "futures") renderFutures(area, inv, state, parent);
    else if (stab === "re") renderProperties(area, inv);
    else if (stab === "car") renderCars(area, inv);
  };

  setTimeout(function() {
    renderSub("stocks");
    var btns = cont.querySelectorAll(".sub-tab");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        for (var j = 0; j < btns.length; j++) btns[j].classList.remove("active");
        this.classList.add("active");
        renderSub(this.dataset.stab);
      });
    }
  }, 0);
}

// ---- 摘要小卡片 ----
function summaryCard(label, value) {
  return (
    '<div class="action-card" style="flex:1;min-width:90px;text-align:center;padding:6px 4px;">' +
    '<div style="font-size:10px;color:var(--text-muted);">' + label + '</div>' +
    '<strong style="font-size:13px;">' + Math.round(value).toLocaleString() + '</strong>' +
    "</div>"
  );
}

// ---- 子tab渲染：股票 ----
function renderStocks(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  for (var i = 0; i < INV_STOCKS.length; i++) {
    var s = INV_STOCKS[i];
    if (s.category !== "股票") continue;
    var m = inv.stockMarket[s.symbol];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === s.symbol) { h = inv.stockHoldings[j]; break; }
    }
    var chg = m.history.length >= 2 ? m.price - m.history[m.history.length - 2].price : 0;
    var clr = chg >= 0 ? "var(--success)" : "var(--danger)";

    // Canvas ID
    var cid = "chart-" + s.symbol;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
        '<strong>' + s.symbol + ' ' + s.name + '</strong>' +
        '<span style="color:' + clr + '">' + m.price.toFixed(2) + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);">' +
        s.industry + ' | ' + s.desc +
      '</div>' +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
            '持仓' + h.shares + '股 均价' + h.avgPrice.toFixed(2) +
            ' 盈亏<span style="color:' + clr + '">' +
            Math.round((m.price - h.avgPrice) * h.shares) + '</span>' +
          '</div>'
        : "") +
      '<div style="display:flex;gap:3px;margin-top:4px;">' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + s.symbol + '" data-q="10">买10</button>' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + s.symbol + '" data-q="100">买100</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + s.symbol + '" data-q="10">卖10</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + s.symbol + '" data-q="' + (h ? h.shares : 0) + '">全卖</button>' +
      '</div>' +
      '<canvas id="' + cid + '" width="200" height="60" style="width:200px;height:60px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function() {
    // Draw charts
    for (var i = 0; i < INV_STOCKS.length; i++) {
      var s = INV_STOCKS[i];
      if (s.category !== "股票") continue;
      var m = inv.stockMarket[s.symbol];
      if (m) drawPriceChart("chart-" + s.symbol, m.history, "#4fc3f7");
    }
    // Bind buy/sell
    area.querySelectorAll(".ibuy").forEach(function(b) {
      b.onclick = function() {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function(b) {
      b.onclick = function() {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
  }, 0);
}

// ---- 子tab渲染：比特币 ----
function renderBtc(area, inv, state, parent) {
  var btcPrice = inv.btcPrice;
  var hold = inv.btcHoldings || 0;
  var fg = inv.btcFearGreed || 50;
  var fgColor = fg > 60 ? "#f44336" : fg > 40 ? "#ff9800" : "#4caf50";
  var fgLabel = fg > 60 ? "贪婪" : fg > 40 ? "中性" : "恐惧";

  var div = document.createElement("div");
  div.innerHTML =
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
      '<div class="action-card" style="flex:2;min-width:200px;padding:12px;">' +
        '<div style="font-size:12px;color:var(--text-muted);">比特币价格 (BTC/USD)</div>' +
        '<div style="font-size:24px;font-weight:bold;color:var(--accent);">' + btcPrice.toLocaleString() + '</div>' +
        '<div style="font-size:11px;margin-top:4px;">' +
          '持仓: ' + hold.toFixed(4) + ' BTC (市值: ' + Math.round(btcPrice * hold).toLocaleString() + ')' +
        '</div>' +
      '</div>' +
      '<div class="action-card" style="flex:1;min-width:100px;padding:12px;text-align:center;">' +
        '<div style="font-size:12px;color:var(--text-muted);">恐惧贪婪指数</div>' +
        '<div style="font-size:28px;font-weight:bold;color:' + fgColor + ';">' + fg + '</div>' +
        '<div style="font-size:11px;color:' + fgColor + ';">' + fgLabel + '</div>' +
      '</div>' +
    '</div>' +
    '<canvas id="chart-btc" width="300" height="120" style="width:300px;height:120px;margin-top:8px;background:rgba(0,0,0,0.15);border-radius:4px;"></canvas>' +
    '<div style="display:flex;gap:4px;margin-top:8px;">' +
      '<button class="btn btn-sm btn-success" id="btc-buy-0p01">买0.01</button>' +
      '<button class="btn btn-sm btn-success" id="btc-buy-0p1">买0.1</button>' +
      '<button class="btn btn-sm btn-success" id="btc-buy-1">买1</button>' +
      '<button class="btn btn-sm btn-danger" id="btc-sell-0p01">卖0.01</button>' +
      '<button class="btn btn-sm btn-danger" id="btc-sell-0p1">卖0.1</button>' +
      '<button class="btn btn-sm btn-danger" id="btc-sell-all">全卖</button>' +
    '</div>';

  area.appendChild(div);

  setTimeout(function() {
    drawPriceChart("chart-btc", inv.btcHistory || [], "#f7931a");

    var bind = function(id, fn) {
      var el = document.getElementById(id);
      if (el) el.onclick = fn;
    };
    bind("btc-buy-0p01", function() { buyBtc(0.01); renderInvestmentTab(state, parent); });
    bind("btc-buy-0p1", function() { buyBtc(0.1); renderInvestmentTab(state, parent); });
    bind("btc-buy-1", function() { buyBtc(1); renderInvestmentTab(state, parent); });
    bind("btc-sell-0p01", function() { sellBtc(0.01); renderInvestmentTab(state, parent); });
    bind("btc-sell-0p1", function() { sellBtc(0.1); renderInvestmentTab(state, parent); });
    bind("btc-sell-all", function() { sellBtc(hold); renderInvestmentTab(state, parent); });
  }, 0);
}

// ---- 子tab渲染：贵金属 ----
function renderPrecious(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  var metals = ["XAU", "XAG"];
  for (var i = 0; i < metals.length; i++) {
    var sym = metals[i];
    var s = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === sym) { s = INV_STOCKS[j]; break; }
    }
    if (!s) continue;
    var m = inv.stockMarket[sym];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === sym) { h = inv.stockHoldings[j]; break; }
    }
    var chg = m.history.length >= 2 ? m.price - m.history[m.history.length - 2].price : 0;
    var clr = chg >= 0 ? "var(--success)" : "var(--danger)";
    var unit = s.unit || "g";
    var cid = "chart-" + sym;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
        '<strong>' + s.name + ' (' + sym + ')</strong>' +
        '<span style="color:' + clr + '">' + m.price.toFixed(2) + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);">' + s.desc + '</div>' +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
            '持有 ' + h.shares + ' ' + unit + ' 均价' + h.avgPrice.toFixed(2) +
            ' 盈亏<span style="color:' + clr + '">' +
            Math.round((m.price - h.avgPrice) * h.shares) + '</span>' +
          '</div>'
        : "") +
      '<div style="display:flex;gap:3px;margin-top:4px;">' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + sym + '" data-q="10">买10' + unit + '</button>' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + sym + '" data-q="100">买100' + unit + '</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + sym + '" data-q="10">卖10' + unit + '</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + sym + '" data-q="' + (h ? h.shares : 0) + '">全卖</button>' +
      '</div>' +
      '<canvas id="' + cid + '" width="200" height="60" style="width:200px;height:60px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function() {
    for (var i = 0; i < metals.length; i++) {
      var m = inv.stockMarket[metals[i]];
      if (m) drawPriceChart("chart-" + metals[i], m.history, "#ffd54f");
    }
    area.querySelectorAll(".ibuy").forEach(function(b) {
      b.onclick = function() {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function(b) {
      b.onclick = function() {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
  }, 0);
}

// ---- 子tab渲染：期货基金 ----
function renderFutures(area, inv, state, parent) {
  var grid = document.createElement("div");
  grid.className = "action-cards";
  grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(230px,1fr))";

  var items = ["CL", "BOND"];
  for (var i = 0; i < items.length; i++) {
    var sym = items[i];
    var s = null;
    for (var j = 0; j < INV_STOCKS.length; j++) {
      if (INV_STOCKS[j].symbol === sym) { s = INV_STOCKS[j]; break; }
    }
    if (!s) continue;
    var m = inv.stockMarket[sym];
    if (!m) continue;
    var h = null;
    for (var j = 0; j < inv.stockHoldings.length; j++) {
      if (inv.stockHoldings[j].symbol === sym) { h = inv.stockHoldings[j]; break; }
    }
    var chg = m.history.length >= 2 ? m.price - m.history[m.history.length - 2].price : 0;
    var clr = chg >= 0 ? "var(--success)" : "var(--danger)";
    var unit = s.unit || "份";
    var cid = "chart-" + sym;

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
        '<strong>' + s.name + ' (' + sym + ')</strong>' +
        '<span style="color:' + clr + '">' + m.price.toFixed(2) + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);">' + s.desc + '</div>' +
      (h
        ? '<div style="font-size:10px;margin:4px 0;">' +
            '持有 ' + h.shares + ' ' + unit + ' 均价' + h.avgPrice.toFixed(2) +
            ' 盈亏<span style="color:' + clr + '">' +
            Math.round((m.price - h.avgPrice) * h.shares) + '</span>' +
          '</div>'
        : "") +
      '<div style="display:flex;gap:3px;margin-top:4px;">' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + sym + '" data-q="1">买1' + unit + '</button>' +
        '<button class="btn btn-sm btn-success ibuy" data-s="' + sym + '" data-q="10">买10' + unit + '</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + sym + '" data-q="1">卖1' + unit + '</button>' +
        '<button class="btn btn-sm btn-danger isell" data-s="' + sym + '" data-q="' + (h ? h.shares : 0) + '">全卖</button>' +
      '</div>' +
      '<canvas id="' + cid + '" width="200" height="60" style="width:200px;height:60px;margin-top:4px;background:rgba(0,0,0,0.15);border-radius:3px;"></canvas>';
    grid.appendChild(card);
  }

  area.appendChild(grid);

  setTimeout(function() {
    for (var i = 0; i < items.length; i++) {
      var m = inv.stockMarket[items[i]];
      if (m) drawPriceChart("chart-" + items[i], m.history, "#81c784");
    }
    area.querySelectorAll(".ibuy").forEach(function(b) {
      b.onclick = function() {
        buyInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
    area.querySelectorAll(".isell").forEach(function(b) {
      b.onclick = function() {
        sellInvStock(this.dataset.s, parseInt(this.dataset.q));
        renderInvestmentTab(state, parent);
      };
    });
  }, 0);
}

// ---- 子tab渲染：房产 ----
function renderProperties(area, inv) {
  var list = inv.properties || [];
  if (list.length === 0) {
    area.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">尚未购入房产，前往商城购买。</p>';
    return;
  }

  var div = document.createElement("div");
  div.className = "action-cards";

  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var cur = p.currentPrice || p.buyPrice;
    var buyP = p.buyPrice;
    var diff = cur - buyP;
    var pct = ((diff / buyP) * 100).toFixed(1);
    var clr = diff >= 0 ? "var(--success)" : "var(--danger)";

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
        '<strong>' + p.name + '</strong>' +
        '<span style="color:' + clr + '">' + (diff >= 0 ? "+" : "") + pct + '%</span>' +
      '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);">' + (p.type || "") + '</div>' +
      '<div style="font-size:11px;margin:4px 0;">' +
        '买入价: ' + buyP.toLocaleString() +
        ' | 当前估值: ' + cur.toLocaleString() +
      '</div>' +
      '<div style="display:flex;gap:3px;margin-top:4px;">' +
        '<button class="btn btn-sm btn-danger sell-prop" data-id="' + p.id + '">出售</button>' +
      '</div>' +
      '<div style="margin-top:4px;height:6px;background:rgba(0,0,0,0.1);border-radius:3px;overflow:hidden;">' +
        '<div style="height:100%;width:' + Math.min(100, Math.max(0, (cur / buyP) * 100)) + '%;background:' + clr + ';border-radius:3px;"></div>' +
      '</div>';
    div.appendChild(card);
  }

  area.appendChild(div);

  setTimeout(function() {
    area.querySelectorAll(".sell-prop").forEach(function(b) {
      b.onclick = function() {
        sellProperty(this.dataset.id);
        renderInvestmentTab(state, parent);
      };
    });
  }, 0);
}

// ---- 子tab渲染：汽车 ----
function renderCars(area, inv) {
  var list = inv.cars || [];
  if (list.length === 0) {
    area.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">尚未购车，前往商城购买。</p>';
    return;
  }

  var div = document.createElement("div");
  div.className = "action-cards";

  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    var cur = c.currentPrice || c.buyPrice;
    var buyP = c.buyPrice;
    var diff = cur - buyP;
    var pct = ((diff / buyP) * 100).toFixed(1);
    var clr = diff >= 0 ? "var(--success)" : "var(--danger)";

    var card = document.createElement("div");
    card.className = "action-card";
    card.style.borderLeft = "3px solid " + clr;
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;">' +
        '<strong>' + c.name + '</strong>' +
        '<span style="color:' + clr + '">' + (diff >= 0 ? "+" : "") + pct + '%</span>' +
      '</div>' +
      '<div style="font-size:11px;margin:4px 0;">' +
        '买入价: ' + buyP.toLocaleString() +
        ' | 当前估值: ' + cur.toLocaleString() +
        ' | 月维护费: ' + (c.maintenance || 0) +
      '</div>' +
      '<div style="margin-top:4px;height:6px;background:rgba(0,0,0,0.1);border-radius:3px;overflow:hidden;">' +
        '<div style="height:100%;width:' + Math.min(100, Math.max(0, (cur / buyP) * 100)) + '%;background:' + clr + ';border-radius:3px;"></div>' +
      '</div>';
    div.appendChild(card);
  }

  area.appendChild(div);
}
"""

OUTPUT = r"D:\Claude Code+DeepSeekV4\city-life-story\src\js\phase2\investment.js"
BACKUP = OUTPUT.replace(".js", ".bak.js")

def main():
    # Backup original
    if os.path.exists(OUTPUT) and not os.path.exists(BACKUP):
        import shutil
        shutil.copy2(OUTPUT, BACKUP)
        print("Backup created:", BACKUP)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(JS)
    print("Written:", OUTPUT)

if __name__ == "__main__":
    main()