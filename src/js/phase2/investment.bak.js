/**
 * 投资系统 — 股票 / 比特币 / 房地产 / 汽车
 */

const INV_STOCKS = [
  {
    symbol: "STAR",
    name: "星辰科技",
    industry: "科技",
    basePrice: 120,
    volatility: 0.18,
    trend: 0.005,
    desc: "AI龙头",
  },
  {
    symbol: "BYTE",
    name: "字节龙",
    industry: "科技",
    basePrice: 280,
    volatility: 0.16,
    trend: 0.004,
    desc: "互联网巨头",
  },
  {
    symbol: "GAME",
    name: "好玩游戏",
    industry: "科技",
    basePrice: 45,
    volatility: 0.22,
    trend: -0.003,
    desc: "游戏股",
  },
  {
    symbol: "SAFE",
    name: "安信金融",
    industry: "金融",
    basePrice: 65,
    volatility: 0.08,
    trend: 0.002,
    desc: "国有大行",
  },
  {
    symbol: "BREW",
    name: "醉鹅啤酒",
    industry: "消费",
    basePrice: 35,
    volatility: 0.07,
    trend: 0.001,
    desc: "国民啤酒",
  },
  {
    symbol: "DRUG",
    name: "华佗医药",
    industry: "医药",
    basePrice: 95,
    volatility: 0.13,
    trend: 0.003,
    desc: "创新药企",
  },
  {
    symbol: "OIL",
    name: "黑金能源",
    industry: "能源",
    basePrice: 18,
    volatility: 0.15,
    trend: 0.0,
    desc: "油价绑定",
  },
  {
    symbol: "ESTATE",
    name: "万城地产",
    industry: "房地产",
    basePrice: 8.5,
    volatility: 0.2,
    trend: -0.008,
    desc: "行业寒冬",
  },
];

const PROPERTIES = [
  {
    id: "apt_old",
    name: "老破小公寓",
    type: "住宅",
    price: 500000,
    appreciation: 0.0003,
    rent: 1500,
    desc: "租售比高",
  },
  {
    id: "apt_new",
    name: "精装两居室",
    type: "住宅",
    price: 1500000,
    appreciation: 0.0005,
    rent: 4000,
    desc: "适合自住",
  },
  {
    id: "luxury",
    name: "江景豪宅",
    type: "住宅",
    price: 5000000,
    appreciation: 0.0008,
    rent: 12000,
    desc: "身份象征",
  },
  {
    id: "shop",
    name: "街边商铺",
    type: "商铺",
    price: 800000,
    appreciation: 0.0006,
    rent: 5000,
    desc: "租金稳定",
  },
  {
    id: "office",
    name: "写字楼单元",
    type: "写字楼",
    price: 2000000,
    appreciation: 0.0004,
    rent: 8000,
    desc: "企业租户多",
  },
];

const CAR_TYPES = [
  {
    id: "van",
    name: "二手面包车",
    price: 30000,
    depreciation: 0.0008,
    maintenance: 300,
    travelBonus: 5,
    desc: "实用之选",
  },
  {
    id: "sedan",
    name: "家用轿车",
    price: 120000,
    depreciation: 0.0005,
    maintenance: 800,
    travelBonus: 10,
    desc: "体面省油",
  },
  {
    id: "luxury_car",
    name: "豪华跑车",
    price: 500000,
    depreciation: 0.001,
    maintenance: 2000,
    travelBonus: 15,
    desc: "倍有面子",
  },
];

function initInvestment(state) {
  const inv = state.investment;
  if (!inv) return;
  for (const s of INV_STOCKS)
    if (!inv.stockMarket[s.symbol])
      inv.stockMarket[s.symbol] = {
        price: s.basePrice * (0.85 + Math.random() * 0.3),
        history: [],
      };
  if (inv.btcPrice <= 0) inv.btcPrice = 200000;
  inv.lastTickDay = state.player.day;
}

function tickInvestmentDaily(state) {
  const inv = state.investment;
  if (!inv || inv.lastTickDay >= state.player.day) return;
  inv.lastTickDay = state.player.day;
  for (const s of INV_STOCKS) {
    const m = inv.stockMarket[s.symbol];
    if (!m) continue;
    m.price = Math.max(
      0.5,
      m.price * (1 + s.trend + (Math.random() - 0.5) * 2 * s.volatility),
    );
    m.price = Math.round(m.price * 100) / 100;
    m.history.push({ day: state.player.day, price: m.price });
    if (m.history.length > 20) m.history.shift();
  }
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
    if (state.player.day - inv.btcHalvingDay > 1460) {
      inv.btcHalvingDay = state.player.day;
      inv.btcFearGreed = Math.min(95, inv.btcFearGreed + 20);
      StateManager.addMessage("比特币减半事件！", "event");
    }
  }
  for (const p of inv.properties || []) {
    p.currentPrice = Math.round(
      (p.currentPrice || p.buyPrice) *
        (1 + p.appreciation + (Math.random() - 0.5) * 0.002),
    );
    if (state.player.day % 30 === 0) state.resources.cash += p.rent || 0;
  }
  for (const c of inv.cars || []) {
    c.currentPrice = Math.round(
      (c.currentPrice || c.buyPrice) * (1 - c.depreciation),
    );
    if (state.player.day % 30 === 0 && state.resources.cash >= c.maintenance)
      state.resources.cash -= c.maintenance;
  }
}

function buyInvStock(symbol, shares) {
  const state = StateManager.getState();
  const inv = state.investment;
  const m = inv.stockMarket[symbol];
  if (!m) return;
  const cost = Math.round(m.price * shares * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  const h = inv.stockHoldings.find((s) => s.symbol === symbol);
  if (h) {
    const total = h.shares + shares;
    h.avgPrice =
      Math.round(((h.avgPrice * h.shares + cost) / total) * 100) / 100;
    h.shares = total;
  } else inv.stockHoldings.push({ symbol, shares, avgPrice: m.price });
  StateManager.addMessage("买入 " + symbol + " " + shares + "股", "success");
}

function sellInvStock(symbol, shares) {
  const state = StateManager.getState();
  const inv = state.investment;
  const h = inv.stockHoldings.find((s) => s.symbol === symbol);
  if (!h || h.shares < shares) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  const m = inv.stockMarket[symbol];
  const revenue = Math.round(m.price * shares * 100) / 100;
  state.resources.cash += revenue;
  h.shares -= shares;
  if (h.shares <= 0)
    inv.stockHoldings = inv.stockHoldings.filter((s) => s.symbol !== symbol);
  StateManager.addMessage("卖出 " + symbol + " " + shares + "股", "success");
}

function buyBtc(amount) {
  const state = StateManager.getState();
  const inv = state.investment;
  const cost = Math.round(inv.btcPrice * amount * 100) / 100;
  if (state.resources.cash < cost) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= cost;
  inv.btcHoldings = Math.round((inv.btcHoldings + amount) * 10000) / 10000;
  StateManager.addMessage("买入 " + amount + " BTC", "success");
}

function sellBtc(amount) {
  const state = StateManager.getState();
  const inv = state.investment;
  if (inv.btcHoldings < amount) {
    StateManager.addMessage("持仓不足", "danger");
    return;
  }
  state.resources.cash += Math.round(inv.btcPrice * amount * 100) / 100;
  inv.btcHoldings = Math.round((inv.btcHoldings - amount) * 10000) / 10000;
  StateManager.addMessage("卖出 " + amount + " BTC", "success");
}

function buyProperty(propId) {
  const state = StateManager.getState();
  const inv = state.investment;
  const prop = PROPERTIES.find((p) => p.id === propId);
  if (!prop) return;
  if (state.resources.cash < prop.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= prop.price;
  inv.properties.push({
    ...prop,
    buyPrice: prop.price,
    currentPrice: prop.price,
    buyDay: state.player.day,
  });
  StateManager.addMessage("购入" + prop.name, "success");
}

function sellProperty(propId) {
  const state = StateManager.getState();
  const inv = state.investment;
  const idx = inv.properties.findIndex((p) => p.id === propId);
  if (idx < 0) return;
  const prop = inv.properties[idx];
  const net = prop.currentPrice - Math.round(prop.currentPrice * 0.05);
  state.resources.cash += net;
  inv.properties.splice(idx, 1);
  StateManager.addMessage("出售" + prop.name + " 到手" + net, "success");
}

function buyCar(carId) {
  const state = StateManager.getState();
  const inv = state.investment;
  const car = CAR_TYPES.find((c) => c.id === carId);
  if (!car) return;
  if (state.resources.cash < car.price) {
    StateManager.addMessage("现金不足", "danger");
    return;
  }
  state.resources.cash -= car.price;
  inv.cars.push({
    ...car,
    buyPrice: car.price,
    currentPrice: car.price,
    buyDay: state.player.day,
  });
  state.player.maxActionPoints =
    (state.player.maxActionPoints || 100) + car.travelBonus;
  state.player.actionPoints = Math.min(
    state.player.maxActionPoints,
    state.player.actionPoints + car.travelBonus,
  );
  StateManager.addMessage(
    "购入" + car.name + " 行动力上限+" + car.travelBonus,
    "success",
  );
}

function renderInvestmentTab(state, parent) {
  const inv = state.investment;
  if (!inv) {
    parent.innerHTML = "<p>投资系统加载中...</p>";
    return;
  }
  if (
    Object.keys(inv.stockMarket).length === 0 &&
    typeof initInvestment === "function"
  )
    initInvestment(state);

  const stockVal = inv.stockHoldings.reduce(
    (s, h) => s + (inv.stockMarket[h.symbol]?.price || 0) * h.shares,
    0,
  );
  const btcVal = inv.btcPrice * inv.btcHoldings;
  const propVal = (inv.properties || []).reduce(
    (s, p) => s + (p.currentPrice || p.buyPrice),
    0,
  );
  const carVal = (inv.cars || []).reduce(
    (s, c) => s + (c.currentPrice || c.buyPrice),
    0,
  );
  const totalInv = stockVal + btcVal + propVal + carVal;

  parent.innerHTML = "";
  const cont = document.createElement("div");
  cont.innerHTML =
    '<h3>投资中心 <span style="font-size:12px;color:var(--accent);">总资产 ' +
    totalInv.toLocaleString() +
    "</span></h3>" +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">' +
    '<div class="action-card" style="flex:1;min-width:100px;text-align:center;padding:8px;"><div style="font-size:10px;color:var(--text-muted);">股票</div><strong>' +
    stockVal.toLocaleString() +
    "</strong></div>" +
    '<div class="action-card" style="flex:1;min-width:100px;text-align:center;padding:8px;"><div style="font-size:10px;color:var(--text-muted);">比特币</div><strong>' +
    btcVal.toLocaleString() +
    "</strong></div>" +
    '<div class="action-card" style="flex:1;min-width:100px;text-align:center;padding:8px;"><div style="font-size:10px;color:var(--text-muted);">房产</div><strong>' +
    propVal.toLocaleString() +
    "</strong></div>" +
    '<div class="action-card" style="flex:1;min-width:100px;text-align:center;padding:8px;"><div style="font-size:10px;color:var(--text-muted);">汽车</div><strong>' +
    carVal.toLocaleString() +
    "</strong></div>" +
    "</div>" +
    '<div style="display:flex;gap:4px;margin-bottom:8px;">' +
    '<button class="btn btn-sm sub-tab active" data-stab="stocks">股票</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="btc">比特币</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="re">房产</button>' +
    '<button class="btn btn-sm sub-tab" data-stab="car">汽车</button>' +
    '</div><div id="inv-sub-area"></div>';
  parent.appendChild(cont);

  const renderSub = function (stab) {
    const area = document.getElementById("inv-sub-area");
    if (!area) return;
    area.innerHTML = "";
    if (stab === "stocks") {
      const grid = document.createElement("div");
      grid.className = "action-cards";
      grid.style.gridTemplateColumns = "repeat(auto-fill,minmax(220px,1fr))";
      for (const s of INV_STOCKS) {
        const m = inv.stockMarket[s.symbol];
        if (!m) continue;
        const h = inv.stockHoldings.find(function (h) {
          return h.symbol === s.symbol;
        });
        const chg =
          m.history.length >= 2
            ? m.price - m.history[m.history.length - 2].price
            : 0;
        const clr = chg >= 0 ? "var(--success)" : "var(--danger)";
        const card = document.createElement("div");
        card.className = "action-card";
        card.style.borderLeft = "3px solid " + clr;
        card.innerHTML =
          '<div style="display:flex;justify-content:space-between;"><strong>' +
          s.symbol +
          " " +
          s.name +
          '</strong><span style="color:' +
          clr +
          '">' +
          m.price.toFixed(2) +
          "</span></div>" +
          '<div style="font-size:10px;color:var(--text-muted);">' +
          s.industry +
          " | " +
          s.desc +
          "</div>" +
          (h
            ? '<div style="font-size:10px;margin:4px 0;">持仓' +
              h.shares +
              "股 均价" +
              h.avgPrice.toFixed(2) +
              ' 盈亏<span style="color:' +
              clr +
              '">' +
              Math.round((m.price - h.avgPrice) * h.shares) +
              "</span></div>"
            : "") +
          '<div style="display:flex;gap:3px;margin-top:4px;">' +
          '<button class="btn btn-sm btn-success ibuy" data-s="' +
          s.symbol +
          '" data-q="10">买10</button>' +
          '<button class="btn btn-sm btn-success ibuy" data-s="' +
          s.symbol +
          '" data-q="100">买100</button>' +
          '<button class="btn btn-sm btn-danger isell" data-s="' +
          s.symbol +
          '" data-q="10">卖10</button>' +
          '<button class="btn btn-sm btn-danger isell" data-s="' +
          s.symbol +
          '" data-q="' +
          (h ? h.shares : 0) +
          '">全卖</button></div>';
        grid.appendChild(card);
      }
      area.appendChild(grid);
      setTimeout(function () {
        area.querySelectorAll(".ibuy").forEach(function (b) {
          b.onclick = function () {
            buyInvStock(b.dataset.s, parseInt(b.dataset.q));
            renderInvestmentTab(state, parent);
          };
        });
        area.querySelectorAll(".isell").forEach(function (b) {
          b.onclick = function () {
            sellInvStock(b.dataset.s, parseInt(b.dataset.q));
            renderInvestmentTab(state, parent);
          };
        });
      }, 0);
    }
  };

  setTimeout(function () {
    renderSub("stocks");
    cont.querySelectorAll(".sub-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        cont.querySelectorAll(".sub-tab").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        renderSub(btn.dataset.stab);
      });
    });
  }, 0);
}
