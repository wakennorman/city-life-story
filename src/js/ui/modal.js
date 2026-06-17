/**
 * 模态框模块
 *
 * 从 main.js 提取，管理所有弹窗：showModal、存档菜单、银行操作、面试等。
 */

// ====== 模态对话框 ======
function showModal({ title, body, buttons }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";
  box.innerHTML = `
    <h2>${title}</h2>
    <div class="modal-body">${body}</div>
    <div class="modal-actions"></div>
  `;

  const actionsDiv = box.querySelector(".modal-actions");
  for (const btn of buttons) {
    const btnEl = document.createElement("button");
    btnEl.className = "btn " + (btn.cls || "btn-primary");
    btnEl.textContent = btn.text;
    btnEl.addEventListener("click", () => {
      document.body.removeChild(overlay);
      if (btn.callback) btn.callback();
    });
    actionsDiv.appendChild(btnEl);
  }

  overlay.appendChild(box);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  document.body.appendChild(overlay);
}

/** 帮助/教程弹窗 */
function showHelpModal() {
  showModal({
    title: "❓ 游戏帮助 — 城市浮生记",
    body: `
      <div style="max-height:50vh;overflow-y:auto;font-size:12px;line-height:1.6;">
        <h4 style="color:var(--accent);">🏘️ 街头生存阶段</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>初始: ¥2,000现金 + ¥5,500债务（日息0.3%）</li>
          <li>賺钱方式: 废品回收→摆摊→倒卖商品→技术工种</li>
          <li>核心循环: 批发市场低价进货 → 商业区/城中村高价卖出</li>
          <li>每天3个时段（上午/下午/晚上），选择行动消耗1个时段</li>
          <li>到<strong style="color:var(--accent);">城中村</strong>升级住所，到<strong style="color:var(--accent);">批发市场</strong>租仓库</li>
          <li>提升智力到45+，去<strong style="color:var(--accent);">科技园</strong>应聘进入职场</li>
        </ul>
        <h4 style="color:var(--accent);margin-top:12px;">🏢 职场晋升阶段</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>职级: P5→P6→P7→P8→P9→P10（晋升在Q3判定）</li>
          <li>核心行动: 做项目(KPI+)、向上社交(信任+)、学习(能力+)、排查风险</li>
          <li>P7+解锁团队管理，Q2可招聘</li>
          <li>关注发量(勿归零)和风险值(勿满100)</li>
        </ul>
        <h4 style="color:var(--accent);margin-top:12px;">⚠️ 失败条件</h4>
        <ul style="margin-left:16px;color:var(--danger);">
          <li>健康归零 | 债务超¥50,000</li>
          <li>发量归零(过劳) | 尊严归零(崩溃)</li>
          <li>连续8季度绩效C(淘汰) | 风险100%(开除)</li>
          <li>年龄≥35且职级<P8(35岁危机)</li>
        </ul>
        <h4 style="color:var(--accent);margin-top:12px;">🏆 胜利条件</h4>
        <ul style="margin-left:16px;color:var(--success);">
          <li>晋升P10(合伙人) | 累计¥2,000万(财务自由)</li>
        </ul>
        <h4 style="color:var(--accent);margin-top:12px;">💡 实用技巧</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>🗺️ 地图Tab可查看所有地点和快速出行</li>
          <li>📦 交易Tab可比较各城市价格，低买高卖赚差价</li>
          <li>💾 每天结束自动存档，手动存档支持5个槽位</li>
          <li>📜 培训中心考证书可永久提升属性/技能</li>
          <li>🏪 扩展行动包含30+种生存/社交/学习/投资玩</li>
        </ul>
      </div>`,
    buttons: [
      { text: "知道了", cls: "btn-primary", callback: () => {} },
      {
        text: "🔄 重新开始引导",
        cls: "",
        callback: () => {
          if (
            typeof resetTutorial === "function" &&
            typeof startTutorial === "function"
          ) {
            resetTutorial();
            document.querySelector(".modal-overlay")?.remove();
            setTimeout(() => startTutorial(), 200);
          }
        },
      },
    ],
  });
}

function showGameOverModal() {
  const state = StateManager.getState();
  showModal({
    title: "💀 游戏结束",
    body: `
      <p>${state.flags.gameOverReason}</p>
      <table class="stats-summary">
        <tr><td>存活天数</td><td>${state.player.day} 天</td></tr>
        <tr><td>年龄</td><td>${state.player.age} 岁</td></tr>
        <tr><td>现金</td><td>¥${state.resources.cash.toLocaleString()}</td></tr>
        <tr><td>总收入</td><td>¥${state.resources.totalEarned.toLocaleString()}</td></tr>
        <tr><td>债务</td><td>¥${state.resources.debt.toLocaleString()}</td></tr>
      </table>
    `,
    buttons: [
      { text: "重新开始", cls: "btn-primary", callback: () => startNewGame() },
      {
        text: "返回标题",
        cls: "",
        callback: () => {
          location.reload();
        },
      },
    ],
  });
}

function showDepositModal() {
  const state = StateManager.getState();
  showModal({
    title: "🏦 存款",
    body: `<p>当前现金: ¥${state.resources.cash.toLocaleString()}</p>
           <p>银行余额: ¥${state.resources.bankBalance.toLocaleString()}</p>
           <label>存入金额: <input id="deposit-amount" type="number" min="1" max="${state.resources.cash}" value="${state.resources.cash}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "存入全部",
        cls: "btn-success",
        callback: () => {
          const amt = state.resources.cash;
          state.resources.bankBalance += amt;
          state.resources.cash = 0;
          StateManager.addMessage(
            `🏦 存入 ¥${amt.toLocaleString()} 到银行。`,
            "success",
          );
          consumeAP(10);
          renderAll();
        },
      },
    ],
  });
  // 延迟绑定输入框事件
  setTimeout(() => {
    const input = document.getElementById("deposit-amount");
    if (input) {
      input.addEventListener("input", () => {
        const val = parseInt(input.value) || 0;
        // update last button
        const btns = document.querySelectorAll(".modal-actions .btn");
        const lastBtn = btns[btns.length - 1];
        if (lastBtn && !lastBtn.classList.contains("btn-success")) {
          lastBtn.textContent = `存入 ¥${val.toLocaleString()}`;
          lastBtn.onclick = () => {
            const amt = Math.min(val, state.resources.cash);
            state.resources.bankBalance += amt;
            state.resources.cash -= amt;
            StateManager.addMessage(
              `🏦 存入 ¥${amt.toLocaleString()} 到银行。`,
              "success",
            );
            consumeAP(10);
            document.querySelector(".modal-overlay")?.remove();
            renderAll();
          };
        }
      });
    }
  }, 50);
}

function showWithdrawModal() {
  const state = StateManager.getState();
  showModal({
    title: "💰 取款",
    body: `<p>银行余额: ¥${state.resources.bankBalance.toLocaleString()}</p>
           <label>取出金额: <input id="withdraw-amount" type="number" min="1" max="${state.resources.bankBalance}" value="${state.resources.bankBalance}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: `取出全部 ¥${state.resources.bankBalance.toLocaleString()}`,
        cls: "btn-primary",
        callback: () => {
          const amt = state.resources.bankBalance;
          state.resources.cash += amt;
          state.resources.bankBalance = 0;
          StateManager.addMessage(
            `💰 从银行取出 ¥${amt.toLocaleString()}。`,
            "success",
          );
          consumeAP(10);
          renderAll();
        },
      },
    ],
  });
}

function showLoanModal() {
  const state = StateManager.getState();
  const maxLoan = 10000;
  showModal({
    title: "📝 贷款",
    body: `<p>可贷金额: ¥${maxLoan.toLocaleString()}</p>
           <p style="color:var(--danger)">⚠️ 日息 0.3%（复利），请谨慎！</p>
           <p>当前欠款: ¥${state.resources.debt.toLocaleString()}</p>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "贷款 ¥3,000",
        cls: "btn-warning",
        callback: () => {
          state.resources.cash += 3000;
          state.resources.debt += 3000;
          StateManager.addMessage(
            "📝 贷款 ¥3,000，日息0.3%。记得按时还款！",
            "warning",
          );
          renderAll();
        },
      },
      {
        text: "贷款 ¥5,000",
        cls: "btn-warning",
        callback: () => {
          state.resources.cash += 5000;
          state.resources.debt += 5000;
          StateManager.addMessage("📝 贷款 ¥5,000。", "warning");
          renderAll();
        },
      },
    ],
  });
}

function showRepayModal() {
  const state = StateManager.getState();
  const bankDebt = state.resources.bankDebt || 0;
  showModal({
    title: "🏦 还银行贷款",
    body: `<p>当前欠银行: ¥${bankDebt.toLocaleString()}</p>
           <p>现金: ¥${state.resources.cash.toLocaleString()}</p>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "能还多少还多少",
        cls: "btn-primary",
        callback: () => {
          const amt = Math.min(state.resources.cash, bankDebt);
          state.resources.cash -= amt;
          state.resources.bankDebt -= amt;
          state.resources.debt =
            (state.resources.villageDebt || 0) + state.resources.bankDebt;
          StateManager.addMessage(
            `🏦 还银行贷款 ¥${amt.toLocaleString()}。${state.resources.bankDebt > 0 ? `还剩 ¥${state.resources.bankDebt.toLocaleString()}。` : "银行贷款已还清！"}`,
            "success",
          );
          renderAll();
        },
      },
    ],
  });
}

/** 还村长钱的模态框 */
function showRepayVillageModal() {
  const state = StateManager.getState();
  const villageDebt = state.resources.villageDebt || state.resources.debt || 0;
  const interestAccumulated = state.resources.villageDebtInterest || 0;
  showModal({
    title: "🏘️ 还村长钱",
    body: `<p>欠村长: <strong style="color:var(--danger);">¥${villageDebt.toLocaleString()}</strong></p>
           <p>累计利息: ¥${interestAccumulated.toLocaleString()}</p>
           <p style="font-size:11px;color:var(--text-secondary);">日息0.35%复利，早还早轻松！</p>
           <p>现金: <strong>¥${state.resources.cash.toLocaleString()}</strong></p>
           <label>还款金额: <input id="repay-village-amount" type="number" min="1" max="${Math.min(state.resources.cash, villageDebt)}" value="${Math.min(state.resources.cash, villageDebt)}" style="width:100%;padding:8px;margin-top:8px;background:var(--bg-input);border:1px solid var(--border);color:var(--text-primary);border-radius:4px;"></label>`,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text: "还清全部",
        cls: "btn-success",
        callback: () => {
          const amt = Math.min(state.resources.cash, villageDebt);
          state.resources.cash -= amt;
          if (state.resources.villageDebt !== undefined) {
            state.resources.villageDebt -= amt;
            state.resources.debt =
              state.resources.villageDebt + (state.resources.bankDebt || 0);
          } else {
            state.resources.debt -= amt;
          }
          if ((state.resources.villageDebt || state.resources.debt) <= 0) {
            StateManager.addMessage(
              "🎉 终于还清了村长的钱！无债一身轻！",
              "success",
            );
          } else {
            StateManager.addMessage(
              `🏘️ 还了村长 ¥${amt.toLocaleString()}。还剩 ¥${(state.resources.villageDebt || state.resources.debt).toLocaleString()}。`,
              "success",
            );
          }
          renderAll();
        },
      },
    ],
  });
  setTimeout(() => {
    const input = document.getElementById("repay-village-amount");
    if (input) {
      // Allow custom amount via the input
    }
  }, 50);
}

// ====== 存档 / 读档菜单 =====
function showSaveMenu() {
  const allSlots = getAllSlotsWithEmpty();
  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--text-secondary);">选择一个槽位保存当前进度：</p>';
  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  for (const s of allSlots) {
    if (s.slot === "_auto") continue; // 自动存档单独处理
    if (s.empty) {
      bodyHtml += `
        <div class="save-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:var(--accent);">${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">空槽位</span>
          </div>
        </div>`;
    } else {
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      bodyHtml += `
        <div class="save-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:var(--warning);">${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">${s.date}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${s.cash?.toLocaleString()}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
          </div>
          <div style="font-size:10px;color:var(--danger);margin-top:2px;">⚠️ 覆盖后旧存档将丢失</div>
        </div>`;
    }
  }
  bodyHtml += "</div>";

  showModal({
    title: "💾 保存游戏",
    body: bodyHtml,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  // 绑定槽位点击
  setTimeout(() => {
    document.querySelectorAll(".save-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slot = parseInt(card.dataset.slot);
        const existing = getSlotInfo(slot);
        if (existing) {
          // 确认覆盖
          const slotEl = card;
          const oldHtml = slotEl.innerHTML;
          slotEl.innerHTML =
            '<p style="color:var(--warning);text-align:center;padding:10px;">⚠️ 点击确认覆盖此存档</p>';
          slotEl.style.borderColor = "var(--warning)";
          slotEl.onclick = () => {
            document.querySelector(".modal-overlay")?.remove();
            saveGame(slot);
            renderAll();
          };
          setTimeout(() => {
            if (document.querySelector(".modal-overlay")) {
              slotEl.innerHTML = oldHtml;
              slotEl.style.borderColor = "var(--border)";
            }
          }, 3000);
        } else {
          document.querySelector(".modal-overlay")?.remove();
          saveGame(slot);
          renderAll();
        }
      });
    });
  }, 50);
}

function showLoadMenu() {
  const allSlots = getAllSlotsWithEmpty();
  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--text-secondary);">选择一个存档读取（当前进度将丢失）：</p>';
  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  let hasAnySave = false;
  for (const s of allSlots) {
    if (s.empty) {
      bodyHtml += `<div style="padding:8px;margin:4px 0;background:var(--bg-card);border-radius:4px;opacity:0.4;font-size:12px;color:var(--text-muted);">${s.label} — 空</div>`;
    } else {
      hasAnySave = true;
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      bodyHtml += `
        <div class="load-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:border-color 0.15s;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${s.label}</strong>
            <span style="font-size:11px;color:var(--text-muted);">${s.date || ""}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${(s.cash || 0).toLocaleString()}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
            ${s.debt > 0 ? ` | ⚠️ 欠款 ¥${s.debt.toLocaleString()}` : ""}
            ${s.totalEarned > 0 ? ` | 总赚 ¥${s.totalEarned.toLocaleString()}` : ""}
          </div>
          ${s.narrative ? `<div style="font-size:11px;color:#27ae60;margin-top:5px;padding:4px 6px;background:rgba(39,174,96,0.06);border-radius:4px;border-left:2px solid rgba(39,174,96,0.3);">${s.narrative}</div>` : ""}
        </div>`;
    }
  }
  bodyHtml += "</div>";
  if (!hasAnySave) {
    bodyHtml +=
      '<p style="text-align:center;color:var(--text-muted);padding:20px;">还没有任何存档</p>';
  }

  showModal({
    title: "📂 读取存档",
    body: bodyHtml,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      ...(hasAnySave
        ? [
            {
              text: "🗑️ 删除存档",
              cls: "btn-danger",
              callback: () => {
                document.querySelector(".modal-overlay")?.remove();
                showDeleteMenu();
              },
            },
          ]
        : []),
    ],
  });

  // 绑定槽位点击
  setTimeout(() => {
    document.querySelectorAll(".load-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (!gameStarted || confirm("当前进度未保存，确定要读取存档吗？")) {
          document.querySelector(".modal-overlay")?.remove();
          const slot = card.dataset.slot;
          loadExistingGame(slot);
        }
      });
    });
  }, 50);
}

function showDeleteMenu() {
  const allSlots = getAllSlots();
  if (allSlots.length === 0) {
    StateManager.addMessage("📭 没有可删除的存档。", "info");
    return;
  }

  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--danger);">选择要删除的存档（不可恢复）：</p>';
  bodyHtml += '<div style="max-height:300px;overflow-y:auto;">';
  for (const s of allSlots) {
    const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
    bodyHtml += `
      <div class="del-slot-card" data-slot="${s.slot}" style="padding:10px;margin:4px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <strong>${s.label}</strong>
          <span style="font-size:11px;color:var(--text-muted);margin-left:8px;">${s.date}</span>
        </div>
        <span style="font-size:11px;color:var(--text-muted);">${phaseLabel} Day${s.day} ¥${s.cash?.toLocaleString()}</span>
      </div>`;
  }
  bodyHtml += "</div>";

  showModal({
    title: "🗑️ 删除存档",
    body: bodyHtml,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  setTimeout(() => {
    document.querySelectorAll(".del-slot-card").forEach((card) => {
      card.addEventListener("click", () => {
        if (confirm("确定永久删除此存档吗？")) {
          deleteSave(card.dataset.slot);
          document.querySelector(".modal-overlay")?.remove();
          StateManager.addMessage("🗑️ 存档已删除。", "info");
        }
      });
    });
  }, 50);
}

function showInterviewModal() {
  let body =
    '<p style="color:var(--success);">🎉 你的能力获得了多家公司的面试机会！</p>';
  body += "<p>选择一家公司加入：</p>";
  body += '<div style="max-height:300px;overflow-y:auto;">';
  for (const company of COMPANIES) {
    body += `
      <div class="company-card" data-company="${company.id}" style="padding:12px;margin:6px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;cursor:pointer;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--accent);">${company.name}</strong>
          <span style="font-size:11px;color:var(--text-muted);">${company.industry}</span>
        </div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${company.culture}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">
          薪资倍率:${company.salaryMod}x | 风险:${company.riskMod}x | 成长:${company.growthRate}x
        </div>
      </div>`;
  }
  body += "</div>";

  showModal({
    title: "💼 选择公司",
    body,
    buttons: [{ text: "再考虑考虑", cls: "", callback: () => {} }],
  });

  setTimeout(() => {
    document.querySelectorAll(".company-card").forEach((card) => {
      card.onclick = () => {
        document.querySelector(".modal-overlay")?.remove();
        if (typeof enterCorporatePhase === "function")
          enterCorporatePhase(card.dataset.company);
      };
      card.onmouseover = () => {
        card.style.borderColor = "var(--accent)";
      };
      card.onmouseout = () => {
        card.style.borderColor = "var(--border)";
      };
    });
  }, 50);
}

// ====== 装备商店 ======
/** 购买装备：扣钱，添加到 inventory.equipment 或 items */
function buyItemFromShop(itemId) {
  var state = StateManager.getState();
  var item = typeof getItemById === "function" ? getItemById(itemId) : null;
  if (!item) return;
  if (state.resources.cash < item.price) {
    StateManager.addMessage("💸 现金不足，无法购买 " + item.name, "warning");
    return;
  }
  state.resources.cash -= item.price;
  // 装备类（有slot）：放入 equipment 槽位
  if (item.slot) {
    if (!state.inventory.equipment) state.inventory.equipment = {};
    var cur = state.inventory.equipment[item.slot];
    if (cur) {
      StateManager.addMessage(
        "👕 替换了旧的" +
          (typeof getItemById === "function" && getItemById(cur)
            ? getItemById(cur).name
            : cur) +
          "，装备了" +
          item.name,
        "info",
      );
    } else {
      StateManager.addMessage("✅ 购买并装备了：" + item.name, "success");
    }
    state.inventory.equipment[item.slot] = itemId;
  } else {
    // 无slot的道具（教材/自行车等）：放入 items 背包
    if (!state.inventory.items) state.inventory.items = [];
    var existing = state.inventory.items.find(function (i) {
      return i.id === itemId;
    });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      state.inventory.items.push({ id: itemId, qty: 1 });
    }
    StateManager.addMessage("✅ 购买了：" + item.name, "success");
  }
  StateManager.markDirty("all");
  if (typeof renderAll === "function") renderAll();
}

/** 显示装备商店弹窗 */
function showItemShopModal(locationId) {
  var state = StateManager.getState();
  var available = (typeof ITEMS !== "undefined" ? ITEMS : []).filter(
    function (item) {
      return item.buyLocations && item.buyLocations.indexOf(locationId) !== -1;
    },
  );

  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  var box = document.createElement("div");
  box.className = "modal-box";
  box.style.maxWidth = "520px";

  var title = document.createElement("h2");
  title.textContent = "🛍️ 装备商店";
  box.appendChild(title);

  var hint = document.createElement("div");
  hint.style.cssText =
    "font-size:11px;color:var(--text-muted);margin-bottom:12px;";
  hint.textContent =
    "现金：¥" +
    state.resources.cash.toLocaleString() +
    " | 点击购买即可装备或放入背包";
  box.appendChild(hint);

  var grid = document.createElement("div");
  grid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;max-height:55vh;overflow-y:auto;";

  if (available.length === 0) {
    var empty = document.createElement("div");
    empty.style.cssText =
      "color:var(--text-muted);font-size:13px;padding:20px;text-align:center;";
    empty.textContent = "该地点暂无装备出售";
    grid.appendChild(empty);
  } else {
    available.forEach(function (item) {
      var canAfford = state.resources.cash >= item.price;
      // 检查是否已装备
      var equipped =
        state.inventory.equipment &&
        state.inventory.equipment[item.slot] === item.id;
      var card = document.createElement("div");
      card.className = "action-card";
      card.style.cssText =
        "border-left:3px solid " +
        (equipped
          ? "var(--success)"
          : canAfford
            ? "var(--accent)"
            : "var(--border)") +
        ";opacity:" +
        (canAfford ? "1" : "0.6") +
        ";";

      var topRow = document.createElement("div");
      topRow.style.cssText =
        "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;";
      var nameSpan = document.createElement("strong");
      nameSpan.textContent = (item.icon || "") + " " + item.name;
      var priceSpan = document.createElement("span");
      priceSpan.style.cssText = "color:var(--warning);font-size:12px;";
      priceSpan.textContent = "¥" + item.price;
      topRow.appendChild(nameSpan);
      topRow.appendChild(priceSpan);

      var descEl = document.createElement("div");
      descEl.style.cssText =
        "font-size:11px;color:var(--text-muted);margin-bottom:6px;";
      descEl.textContent = item.desc || "";

      var slotEl = document.createElement("div");
      slotEl.style.cssText =
        "font-size:10px;color:var(--text-secondary);margin-bottom:6px;";
      slotEl.textContent = item.slot
        ? "槽位：" + item.slot
        : "道具（放入背包）";

      var btnRow = document.createElement("div");
      if (equipped) {
        var eqLabel = document.createElement("span");
        eqLabel.style.cssText = "font-size:11px;color:var(--success);";
        eqLabel.textContent = "✅ 已装备";
        btnRow.appendChild(eqLabel);
      } else {
        var buyBtn = document.createElement("button");
        buyBtn.className = "btn btn-sm " + (canAfford ? "btn-success" : "");
        buyBtn.textContent = canAfford ? "购买" : "现金不足";
        buyBtn.disabled = !canAfford;
        buyBtn.onclick = function () {
          buyItemFromShop(item.id);
          document.body.removeChild(overlay);
          showItemShopModal(locationId); // 重新打开，刷新状态
        };
        btnRow.appendChild(buyBtn);
      }

      card.appendChild(topRow);
      card.appendChild(descEl);
      card.appendChild(slotEl);
      card.appendChild(btnRow);
      grid.appendChild(card);
    });
  }

  box.appendChild(grid);

  var closeBtn = document.createElement("button");
  closeBtn.className = "btn btn-sm";
  closeBtn.style.cssText = "margin-top:12px;";
  closeBtn.textContent = "关闭";
  closeBtn.onclick = function () {
    document.body.removeChild(overlay);
  };
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  document.body.appendChild(overlay);
}

// ====== 拾荒路线规划模态框 ======
function showScavengeRouteModal() {
  var st = StateManager.getState();
  var loc = st.trade.currentLocation;
  var day = st.player.day;
  var ap = st.player.actionPoints;

  var ROUTES = [
    {
      id: "alley",
      name: "🏘️ 城中村小巷",
      desc: "熟悉的街巷垃圾箱，稳定但没惊喜。有老周指路时收益更好。",
      ap: 15,
      yieldText: "¥2~9",
      risk: "低",
      riskColor: "#4a9e5c",
      available: true,
      lockHint: null,
    },
    {
      id: "depot",
      name: "🏭 废品收购站边缘",
      desc: "收购站后巷偶有未收走的好货，需要爬围栏进去翻找。",
      ap: 22,
      yieldText: "¥8~22",
      risk: "中",
      riskColor: "#e6a817",
      available: day >= 8 || st.player.physique >= 12,
      lockHint: "第8天后 或 体质≥12",
    },
    {
      id: "factory",
      name: "🔧 工业区废料场",
      desc: "工厂废弃零件和边角料，价值不低。需要熟悉工业区地形。",
      ap: 30,
      yieldText: "¥15~45",
      risk: "中高",
      riskColor: "#e67e22",
      available: loc === "factoryZone" || !!st.flags.oldZhouTips,
      lockHint: "在工业区 或 老周(好感≥30)指路",
    },
    {
      id: "zhou_channel",
      name: "⭐ 老周专线",
      desc: "老周的内部渠道，废品站朋友提前留好货，稳定高收益。",
      ap: 25,
      yieldText: "¥25~65",
      risk: "低",
      riskColor: "#4a9e5c",
      available: !!st.flags.oldZhouChannel,
      lockHint: "老周好感≥80（开通高价渠道）",
    },
  ];

  var overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  var box = document.createElement("div");
  box.className = "modal-box";
  box.style.maxWidth = "460px";

  var title = document.createElement("h2");
  title.textContent = "🗺️ 规划拾荒路线";
  box.appendChild(title);

  var hint = document.createElement("div");
  hint.style.cssText =
    "font-size:11px;color:var(--text-muted);margin-bottom:12px;";
  hint.textContent =
    "当前行动力：⚡" + ap + " | 选择路线，不同区域收益和风险各异";
  box.appendChild(hint);

  var cardContainer = document.createElement("div");
  cardContainer.style.cssText =
    "display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto;";

  ROUTES.forEach(function (r) {
    var apInsufficient = ap < r.ap;
    var locked = !r.available;
    var disabled = locked || apInsufficient;

    var card = document.createElement("div");
    card.style.cssText =
      "border:1px solid " +
      (disabled ? "#e0e0e0" : "var(--border)") +
      ";border-radius:8px;padding:10px 12px;" +
      "background:" +
      (disabled ? "#f8f8f8" : "#fff") +
      ";opacity:" +
      (disabled ? "0.65" : "1");

    var headerRow = document.createElement("div");
    headerRow.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;";

    var nameEl = document.createElement("strong");
    nameEl.style.fontSize = "13px";
    nameEl.textContent = r.name;
    headerRow.appendChild(nameEl);

    var apBadge = document.createElement("span");
    apBadge.style.cssText =
      "background:var(--accent);color:#fff;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600;";
    apBadge.textContent = "⚡" + r.ap + "AP";
    card.appendChild(headerRow);
    headerRow.appendChild(apBadge);

    var descEl = document.createElement("div");
    descEl.style.cssText =
      "color:var(--text-secondary);font-size:12px;margin-bottom:6px;line-height:1.4;";
    descEl.textContent = r.desc;
    card.appendChild(descEl);

    var statsRow = document.createElement("div");
    statsRow.style.cssText =
      "display:flex;gap:16px;font-size:12px;margin-bottom:6px;";
    var yieldSpan = document.createElement("span");
    yieldSpan.textContent = "💰 " + r.yieldText;
    var riskSpan = document.createElement("span");
    riskSpan.style.color = r.riskColor;
    riskSpan.textContent = "⚠️ 风险：" + r.risk;
    statsRow.appendChild(yieldSpan);
    statsRow.appendChild(riskSpan);
    card.appendChild(statsRow);

    if (locked && r.lockHint) {
      var lockEl = document.createElement("div");
      lockEl.style.cssText = "color:#e74c3c;font-size:11px;margin-bottom:6px;";
      lockEl.textContent = "🔒 需要：" + r.lockHint;
      card.appendChild(lockEl);
    } else if (apInsufficient) {
      var apWarnEl = document.createElement("div");
      apWarnEl.style.cssText =
        "color:#e67e22;font-size:11px;margin-bottom:6px;";
      apWarnEl.textContent = "⚡ 行动力不足（需要 " + r.ap + "AP）";
      card.appendChild(apWarnEl);
    }

    var btn = document.createElement("button");
    btn.className = "btn btn-sm" + (disabled ? "" : " btn-primary");
    btn.style.cssText =
      "width:100%;margin-top:2px;" +
      (disabled ? "pointer-events:none;cursor:not-allowed;" : "");
    btn.disabled = disabled;
    btn.textContent = disabled
      ? locked
        ? "🔒 未解锁"
        : "⚡ AP不足"
      : "走这条路 →";

    if (!disabled) {
      (function (routeId) {
        btn.addEventListener("click", function () {
          document.body.removeChild(overlay);
          executeScavengeRoute(routeId);
        });
      })(r.id);
    }

    card.appendChild(btn);
    cardContainer.appendChild(card);
  });

  box.appendChild(cardContainer);

  var cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-sm";
  cancelBtn.style.cssText = "margin-top:12px;width:100%;";
  cancelBtn.textContent = "取消";
  cancelBtn.addEventListener("click", function () {
    document.body.removeChild(overlay);
  });
  box.appendChild(cancelBtn);

  overlay.appendChild(box);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) document.body.removeChild(overlay);
  });
  document.body.appendChild(overlay);
}

function executeScavengeRoute(routeId) {
  var st = StateManager.getState();
  var earned = 0;
  var msg = "";
  var hygieneCost = 0;
  var fatigueCost = 0;
  var apCost = 0;
  var msgType = "success";

  if (routeId === "alley") {
    apCost = 15;
    var base = 2 + Math.floor(Math.random() * 8);
    var bonus = 0;
    var bonusNote = "";
    if (st.flags.oldZhouTips) {
      bonus += 5 + Math.floor(Math.random() * 8);
      bonusNote = "（老周教的路线多翻了些）";
    }
    if (st.flags.oldZhouChannel) {
      bonus += 8 + Math.floor(Math.random() * 12);
      bonusNote = "（老周渠道内部价又多赚了点）";
    }
    // 新人保护
    if (st.player.day <= 15) bonus += 5;
    earned = base + bonus;
    hygieneCost = 5;
    fatigueCost = 5;
    msg =
      "🏘️ 城中村小巷翻了一圈，捡到瓶瓶罐罐卖了 ¥" +
      earned +
      bonusNote +
      "，手脏兮兮的。";
  } else if (routeId === "depot") {
    apCost = 22;
    var base2 = 8 + Math.floor(Math.random() * 15);
    earned = base2;
    hygieneCost = 8;
    fatigueCost = 8;
    if (Math.random() < 0.3) {
      var extra = 8 + Math.floor(Math.random() * 11);
      earned += extra;
      msg =
        "🏭 废品收购站边缘翻到好货！废料多卖了 ¥" +
        extra +
        "，一共 ¥" +
        earned +
        "。爬围栏费了点力气。";
    } else {
      msg = "🏭 在废品收购站边缘转了一圈，收获 ¥" + earned + "，今天一般般。";
    }
    if (Math.random() < 0.08) {
      var loss = Math.min(5, earned);
      earned -= loss;
      st.needs.health = Math.max(0, (st.needs.health || 100) - 3);
      st.status.fame = Math.max(0, st.status.fame - 1);
      msg += " 被城管看见了，追赶中丢了 ¥" + loss + "。";
      msgType = "warning";
    }
  } else if (routeId === "factory") {
    apCost = 30;
    var base3 = 15 + Math.floor(Math.random() * 31);
    earned = base3;
    hygieneCost = 10;
    fatigueCost = 12;
    if (Math.random() < 0.4) {
      var extra2 = 10 + Math.floor(Math.random() * 16);
      earned += extra2;
      msg =
        "🔧 工业区废料场收获满满！废金属多卖了 ¥" +
        extra2 +
        "，到手 ¥" +
        earned +
        "。";
    } else {
      msg = "🔧 工业区废料场跑了一圈，卖了 ¥" + earned + "，今天废料不多。";
    }
    if (Math.random() < 0.15) {
      earned = Math.floor(earned * 0.5);
      fatigueCost += 10;
      msg += " 被保安发现吓跑了，东西丢了一半，到手 ¥" + earned + "。";
      msgType = "warning";
    }
  } else if (routeId === "zhou_channel") {
    apCost = 25;
    earned = 25 + Math.floor(Math.random() * 41);
    hygieneCost = 5;
    fatigueCost = 6;
    msg =
      "⭐ 按老周的专线走了一趟，废品站朋友给了内部价，卖了 ¥" +
      earned +
      "，稳稳的！";
  }

  st.resources.cash += earned;
  st.resources.totalEarned += earned;
  st.needs.hygiene = Math.max(0, st.needs.hygiene - hygieneCost);
  st.needs.fatigue = Math.min(100, st.needs.fatigue + fatigueCost);

  StateManager.addMessage(msg, msgType);
  consumeAP(apCost);
}
