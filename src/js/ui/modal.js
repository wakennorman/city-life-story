/**
 * 模态框模块
 *
 * 从 main.js 提取，管理所有弹窗：showModal、存档菜单、银行操作、面试等。
 */

// ====== 模态对话框 ======
function showModal({ title, body, buttons = [] }) {
  // 先清理旧的 modal-overlay，避免叠加
  const oldOverlay = document.querySelector(".modal-overlay");
  if (oldOverlay) {
    try {
      document.body.removeChild(oldOverlay);
    } catch (e) {
      console.warn("移除旧弹窗失败:", e);
    }
  }

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";

  // 用安全方式构建 HTML，避免模板字符串注入问题
  const titleEl = document.createElement("h2");
  titleEl.textContent = title;
  box.appendChild(titleEl);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "modal-body";
  bodyDiv.style.cssText = "margin:12px 0;font-size:13px;line-height:1.7;color:var(--text-primary);";
  bodyDiv.innerHTML = body; // body 是纯 HTML 字符串，安全
  box.appendChild(bodyDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "modal-actions";
  for (const btn of buttons) {
    const btnEl = document.createElement("button");
    btnEl.className = "btn " + (btn.cls || "btn-primary");
    btnEl.textContent = btn.text;
    // 确保按钮文字始终可见（防止 CSS 覆盖）
    if (btn.cls && btn.cls.includes("btn-primary")) {
      btnEl.style.color = "#fff";
    } else if (btn.cls && btn.cls.includes("btn-secondary")) {
      btnEl.style.color = "var(--text-primary)";
    }
    if (btn._disabled) {
      btnEl.disabled = true;
      btnEl.setAttribute("aria-disabled", "true");
      btnEl.title = btn.disabledReason || "当前条件不足";
    }
    btnEl.addEventListener("click", function (e) {
      e.preventDefault();
      if (btn._disabled) return;
      // 先调用回调，让回调有机会读取弹窗中的元素
      var shouldClose = true;
      if (btn.callback) {
        var ret = btn.callback();
        // 如果回调返回 false，不关闭弹窗
        if (ret === false) {
          shouldClose = false;
        }
      }
      // 默认关闭弹窗（除非回调返回 false）
      if (shouldClose) {
        try {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        } catch (err) {
          // 忽略
        }
      }
    });
    actionsDiv.appendChild(btnEl);
  }
  box.appendChild(actionsDiv);

  overlay.appendChild(box);
  // ponytail: 所有弹窗必须点击按钮关闭，不允许点击外部关闭
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      // 不做任何事——玩家必须点击按钮
    }
  });
  document.body.appendChild(overlay);
}

/** 帮助/教程弹窗 — v3.34 全面更新 */
function showHelpModal() {
  showModal({
    title: "❓ 游戏帮助 — 城市浮生记",
    body: `
      <div style="max-height:50vh;overflow-y:auto;font-size:12px;line-height:1.7;">
        <h4 style="color:var(--accent);">🎭 剧本模式（7个专属人生）</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>🏚️ <b>城市务工者</b>：湘西少年，¥300闯城，弟弟等学费</li>
          <li>🏭 <b>下岗再就业</b>：38岁铁饭碗没了，女儿学费等着</li>
          <li>📚 <b>小镇做题家</b>：全村第一个大学生，¥20000债压身</li>
          <li>🌏 <b>外来打工者</b>：异国他乡，母亲手术费倒计时90天</li>
          <li>💎 <b>二代创业者</b>：¥150000启动金，证明自己不是"败"</li>
          <li>👔 <b>中年危机职场人</b>：P7被裁，房贷¥14500/月</li>
          <li>🎓 <b>应届毕业生</b>：月薪¥4200，算到第三行就停了</li>
          <li>🏖️ 沙盒模式：自由开局 + 百日攒¥5万/逆袭开公司/纯探索</li>
          <li>📊 <b>4档难度</b>：🍵休闲 / ⚖️标准 / 🔥困难 / 💀地狱，影响收入和病率</li>
        </ul>

        <h4 style="color:var(--accent);margin-top:12px;">🗺️ 核心生存循环</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>每天3个时段（上午/下午/晚上），每个行动消耗行动力</li>
          <li>街头：废品回收→摆摊→倒卖商品→技术工种→职场</li>
          <li>商道：批发市场进货 → 商业区/城中村高价卖出赚差价</li>
          <li>职场：42个职位 × 10条路径（IT/金融/教育/物流/餐饮…）</li>
          <li>创业：6大行业×15产品×7轮融资，从共享办公到IPO</li>
          <li>投资：股票/BTC/房产/海外，受世界参数+新闻驱动</li>
        </ul>

        <h4 style="color:var(--accent);margin-top:12px;">🔬 约定式自动归类</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li><b>新增即生效</b>：新地点/工作/NPC/商品/技能/证书 → 自动出现在百科+导航</li>
          <li><b>数据声明即可</b>：加一条 location 数据，百科条目+详情按钮全自动生成</li>
          <li><b>事件触发数据化</b>：声明 conditions/apply 字段，系统自动注册到触发槽</li>
          <li><b>行动自动归类</b>：行动加 category 字段即自动分组显示</li>
          <li>⚡ 开发者添加内容不再需要写胶水代码</li>
        </ul>

        <h4 style="color:var(--accent);margin-top:12px;">📖 游戏百科（15类·最全指南）</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>点击底部 Tab → 📖 百科，查阅全部地点/工作/商品/装备/技能/证书</li>
          <li>居民/NPC 关系网 + 疾病/节日/天气/投资/系统机制/叙事/成就</li>
          <li>每个条目底部有导航按钮，一键前往实地</li>
          <li>💡 玩到不明白的，先去百科查！</li>
        </ul>

        <h4 style="color:var(--accent);margin-top:12px;">🧠 深度系统（350+事件）</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>🏥 <b>医疗</b>：4级疾病×16种，3档医保，门诊→住院→康复</li>
          <li>⚖️ <b>法律</b>：4种案件×4级律师，立案→证据→庭审→判决</li>
          <li>✈️ <b>旅行</b>：5个国内目的地，纪念品+特产+事件</li>
          <li>🎯 <b>人生节点</b>：高考/大学/35岁/退休，属性门槛+分支</li>
          <li>🎭 <b>节日</b>：春节7天事件链+中秋+剁手节等，季节性价格波动</li>
          <li>👥 <b>NPC关系</b>：10+NPC好感系统，解锁隐藏任务+奖励+信息</li>
          <li>🌤️ <b>世界参数</b>：6大行业热度+市场情绪+财富等级，动态反馈闭环</li>
          <li>🤝 <b>副业系统</b>：6类夜间经济（摆摊/代驾/自媒体/社区…），主业冲突机制</li>
          <li>🏅 <b>成就/缎带</b>：50+成就 + 12条人生缎带跨周目收集</li>
        </ul>

        <h4 style="color:var(--accent);margin-top:12px;">💡 新手必备</h4>
        <ul style="margin-left:16px;color:var(--text-secondary);">
          <li>🗺️ 地图Tab查看所有地点和通勤方式（步行/单车/地铁/打车/自驾）</li>
          <li>📦 交易Tab低买高卖赚差价，注意季节/节日价格波动</li>
          <li>📜 培训中心考证书永久提升属性+技能，证书→月薪加成</li>
          <li>💾 每日结束自动存档 + 5个手动存档槽位</li>
          <li>🎯 每日任务+早安仪式+热招提醒，帮你规划每一天</li>
          <li>📊 每日收支报告（峰终定律设计），回顾高光+明日展望</li>
          <li>💊 健康<50立刻去医院！疾病会演化升级</li>
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

  // v3.1：人生缎带判定（游戏失败也记录缎带）
  if (typeof determineLifeRibbon === "function" && !state.flags._lifeRibbon) {
    var result = determineLifeRibbon(state);
    state.flags._lifeRibbon = result.ribbon.id;
    state.flags._lifeRibbonName = result.ribbon.icon + " " + result.ribbon.name;
    if (typeof recordRibbon === "function") {
      var isNew = recordRibbon(result.ribbon.id, result.stats);
      if (isNew) {
        state.flags._newRibbonEarned = true;
      }
    }
  }

  // Phase 3: 记录多周目记忆 + 生成遗产数据
  if (typeof recordPlaythroughEndEnhanced === "function") {
    recordPlaythroughEndEnhanced(state);
  }

  // 计算声誉徽章
  var badges = [];
  if (typeof calculateReputationBadges === "function") {
    badges = calculateReputationBadges(state);
  }

  // 构建遗产数据（供下局继承）
  var inventoryItems = Array.isArray(state.inventory)
    ? state.inventory
    : (state.inventory && state.inventory.items) || [];
  var inheritanceData = {
    badges: badges,
    badgeCount: badges.length,
    relationshipCount: Object.keys(state.relationships || {}).filter(
      function (npcId) {
        var r = state.relationships[npcId];
        return r && r.met && (r.affinity || 0) >= 30;
      },
    ).length,
    itemCount: inventoryItems.filter(function (item) {
      return item.legendary || item.achievement || item.unique;
    }).length,
    dreamProgress: state.flags?._dreamId
      ? {
          dreamId: state.flags._dreamId,
          completedMilestones: state.flags._dreamMilestone || 0,
        }
      : null,
    skillTree: {
      branches: state.skillBranches || {},
      nodes: state.talentNodes || {},
    },
    cashInfo: null, // 将在下面计算
    narrative: "",
    prevState: state, // 完整上局状态
    // v3.0 P2-B-1：3 个新继承字段
    crisisPath:
      typeof inheritCrisisPath === "function" ? inheritCrisisPath(state) : null,
    moralScore:
      typeof inheritMoralScore === "function" ? inheritMoralScore(state) : null,
    peakAffinity:
      typeof inheritPeakAffinity === "function"
        ? inheritPeakAffinity(state)
        : null,
    totalDays: state.player?.day || 0,
  };

  // 计算继承现金
  if (typeof calculateInheritanceCash === "function") {
    inheritanceData.cashInfo = calculateInheritanceCash(state, badges);
  }

  // 生成叙事文案
  if (typeof generateInheritanceNarrative === "function") {
    inheritanceData.narrative = generateInheritanceNarrative(
      state,
      badges,
      inheritanceData.cashInfo,
    );
  }

  // 保存到 localStorage（供下局继承）
  try {
    localStorage.setItem(
      "_lastGameInheritance",
      JSON.stringify(inheritanceData),
    );
  } catch (e) {
    console.error("保存遗产数据失败:", e);
  }

  // v3.0 P2-E-1：发放传承币（持久化到 localStorage，跨周目累积）
  var heritageResult = null;
  if (typeof awardHeritageCoins === "function") {
    heritageResult = awardHeritageCoins(state);
  }

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
      ${badges.length > 0 ? '<p style="margin-top:10px;color:var(--text-secondary);font-size:13px;">🏅 获得 ' + badges.length + " 枚声誉徽章，下局可继承加成</p>" : ""}
      ${heritageResult && heritageResult.earned > 0 ? '<p style="margin-top:8px;color:var(--success);font-size:13px;">🪙 本局获得 <strong>' + heritageResult.earned + "</strong> 枚传承币（累计余额 " + heritageResult.after + "），可在主菜单→传承商店消费解锁下局福利</p>" : ""}
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
  const capacity =
    typeof calculateLoanCapacity === "function"
      ? calculateLoanCapacity(state)
      : {
          maxLoan: 0,
          monthlyRepayment: 0,
          interestRate: 0.003,
          reasons: [],
          canLoan: false,
        };

  // 构建评估因子 HTML
  let reasonsHtml = "";
  if (capacity.reasons && capacity.reasons.length > 0) {
    reasonsHtml =
      '<div style="margin-top:10px;padding:8px;background:rgba(0,0,0,0.15);border-radius:6px;">';
    reasonsHtml +=
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">📋 贷款评估因子：</div>';
    for (const r of capacity.reasons) {
      const icon =
        r.status === "ok"
          ? "✅"
          : r.status === "warn"
            ? "⚠️"
            : r.status === "fail"
              ? "❌"
              : "ℹ️";
      const color =
        r.status === "ok"
          ? "var(--success)"
          : r.status === "warn"
            ? "var(--warning)"
            : r.status === "fail"
              ? "var(--danger)"
              : "var(--text-muted)";
      reasonsHtml += `<div style="font-size:10px;color:${color};margin:2px 0;">${icon} ${r.text}</div>`;
    }
    reasonsHtml += "</div>";
  }

  // 利率说明
  const dailyRatePct = (capacity.interestRate * 100).toFixed(2);
  const annualRatePct = (
    (Math.pow(1 + capacity.interestRate, 365) - 1) *
    100
  ).toFixed(0);

  // 推荐贷款额（可贷额度的 30%，便于分期还款）
  const recommendedLoan = capacity.canLoan
    ? Math.floor((capacity.maxLoan * 0.3) / 1000) * 1000
    : 0;

  let body = "";
  if (!capacity.canLoan) {
    // 不能贷款的情况
    body = `<div style="padding:12px;background:rgba(231,76,60,0.08);border-radius:6px;border-left:3px solid var(--danger);">`;
    body += `<p style="font-size:11px;color:var(--danger);margin:0 0 8px 0;">❌ 银行拒绝贷款</p>`;
    body += `<p style="font-size:10px;color:var(--text-secondary);margin:0;">`;
    const failReasons = capacity.reasons.filter((r) => r.status === "fail");
    body +=
      failReasons.length > 0
        ? failReasons.map((r) => r.text).join("；")
        : "当前条件不满足贷款要求";
    body += `</p></div>`;
    body += reasonsHtml;
  } else {
    // 可贷款
    body = `<div style="display:flex;gap:8px;margin-bottom:10px;">`;
    body += `<div style="flex:1;padding:10px;background:rgba(46,204,113,0.08);border-radius:6px;text-align:center;">`;
    body += `<div style="font-size:10px;color:var(--text-muted);">可贷额度</div>`;
    body += `<div style="font-size:18px;font-weight:bold;color:var(--success);">¥${capacity.maxLoan.toLocaleString()}</div>`;
    body += `</div>`;
    body += `<div style="flex:1;padding:10px;background:rgba(241,196,15,0.08);border-radius:6px;text-align:center;">`;
    body += `<div style="font-size:10px;color:var(--text-muted);">日利率</div>`;
    body += `<div style="font-size:18px;font-weight:bold;color:var(--warning);">${dailyRatePct}%</div>`;
    body += `<div style="font-size:8px;color:var(--text-muted);margin-top:2px;">（年化约 ${annualRatePct}%）</div>`;
    body += `</div>`;
    body += `</div>`;

    body += `<div style="display:flex;gap:8px;margin-bottom:10px;">`;
    body += `<div style="flex:1;padding:8px;background:var(--bg-card);border-radius:6px;">`;
    body += `<div style="font-size:10px;color:var(--text-muted);">建议月供</div>`;
    body += `<div style="font-size:14px;font-weight:bold;">¥${capacity.monthlyRepayment.toLocaleString()}</div>`;
    body += `</div>`;
    body += `<div style="flex:1;padding:8px;background:var(--bg-card);border-radius:6px;">`;
    body += `<div style="font-size:10px;color:var(--text-muted);">最长还款期</div>`;
    body += `<div style="font-size:14px;font-weight:bold;">${capacity.maxMonths} 个月</div>`;
    body += `</div>`;
    body += `</div>`;

    body += `<div style="padding:8px;background:rgba(231,76,60,0.05);border-radius:4px;margin-bottom:8px;">`;
    body += `<p style="font-size:10px;color:var(--danger);margin:0;">⚠️ 日息 ${dailyRatePct}%（复利），年化约 ${annualRatePct}%。这是紧急贷款，利率远高于银行正常贷款，请谨慎使用！</p>`;
    body += `</div>`;

    body += `<div style="margin-bottom:8px;">`;
    body += `<label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">贷款金额：</label>`;
    body += `<input id="loan-amount-input" type="number" min="1000" max="${capacity.maxLoan}" value="${Math.min(recommendedLoan, capacity.maxLoan)}" step="1000" style="width:100%;padding:8px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:14px;">`;
    body += `<div id="loan-amount-hint" style="font-size:10px;margin-top:4px;color:var(--text-muted);">建议贷款 ¥${recommendedLoan.toLocaleString()}（可贷额度的 30%，便于分期还款）</div>`;
    body += `</div>`;

    body += reasonsHtml;
  }

  showModal({
    title: "📝 银行贷款",
    body: body,
    buttons: capacity.canLoan
      ? [
          { text: "取消", cls: "", callback: () => {} },
          {
            text: `贷款 ¥${recommendedLoan.toLocaleString()}`,
            cls: "btn-warning",
            callback: () => {
              if (typeof grantLoan === "function") {
                grantLoan(state, recommendedLoan);
                renderAll();
              }
            },
          },
          {
            text: "自定义金额",
            cls: "btn-primary",
            callback: () => {
              const input = document.getElementById("loan-amount-input");
              const amount = input ? parseInt(input.value) : 0;
              if (typeof grantLoan === "function") {
                grantLoan(state, amount);
                renderAll();
              }
            },
          },
        ]
      : [{ text: "知道了", cls: "", callback: () => {} }],
  });

  // 绑定输入框实时校验
  if (capacity.canLoan) {
    setTimeout(() => {
      const input = document.getElementById("loan-amount-input");
      if (input) {
        input.addEventListener("input", function () {
          const val = parseInt(this.value) || 0;
          const hintEl = document.getElementById("loan-amount-hint");
          const btns = document.querySelectorAll(".modal-actions .btn");

          if (val > capacity.maxLoan) {
            this.style.borderColor = "var(--danger)";
            this.style.borderWidth = "2px";
            if (hintEl)
              hintEl.textContent =
                "❌ 超过可贷额度 ¥" + capacity.maxLoan.toLocaleString();
            if (hintEl) hintEl.style.color = "var(--danger)";
            // 禁用自定义金额按钮
            for (const btn of btns) {
              if (btn.textContent.includes("自定义")) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
              }
            }
          } else if (val > 0) {
            this.style.borderColor = "var(--success)";
            this.style.borderWidth = "2px";
            if (hintEl) hintEl.textContent = "✅ 在可贷额度内";
            if (hintEl) hintEl.style.color = "var(--success)";
            for (const btn of btns) {
              if (btn.textContent.includes("自定义")) {
                btn.disabled = false;
                btn.style.opacity = "1";
              }
            }
          } else {
            this.style.borderColor = "var(--border)";
            this.style.borderWidth = "1px";
            if (hintEl) hintEl.textContent = "请输入贷款金额";
            if (hintEl) hintEl.style.color = "var(--text-muted)";
          }
        });

        // 触发一次校验
        input.dispatchEvent(new Event("input"));
      }
    }, 50);
  }
}

function showRepayModal() {
  const state = StateManager.getState();
  const bankDebt = state.resources.bankDebt || 0;
  const cash = state.resources.cash || 0;

  // 计算已产生利息（简化：日息 × 天数 × 本金）
  let accumulatedInterest = 0;
  let loanDays = 0;
  if (bankDebt > 0 && state.resources.bankDebtDay > 0) {
    loanDays = state.player.day - state.resources.bankDebtDay;
    // 复利计算：本金 × (1 + 日息)^天数 - 本金
    const dailyRate = 0.003;
    accumulatedInterest =
      Math.round(bankDebt * (Math.pow(1 + dailyRate, loanDays) - 1) * 100) /
      100;
  }

  const totalOwed = bankDebt + accumulatedInterest;

  // 构建还款信息
  let body = "";

  // 债务概览
  body += `<div style="display:flex;gap:8px;margin-bottom:10px;">`;
  body += `<div style="flex:1;padding:10px;background:var(--bg-card);border-radius:6px;text-align:center;">`;
  body += `<div style="font-size:10px;color:var(--text-muted);">剩余本金</div>`;
  body += `<div style="font-size:16px;font-weight:bold;color:var(--danger);">¥${bankDebt.toLocaleString()}</div>`;
  body += `</div>`;
  body += `<div style="flex:1;padding:10px;background:var(--bg-card);border-radius:6px;text-align:center;">`;
  body += `<div style="font-size:10px;color:var(--text-muted);">累计利息</div>`;
  body += `<div style="font-size:16px;font-weight:bold;color:var(--warning);">¥${accumulatedInterest.toLocaleString()}</div>`;
  body += `<div style="font-size:8px;color:var(--text-muted);margin-top:2px;">（已产生 ${loanDays} 天）</div>`;
  body += `</div>`;
  body += `<div style="flex:1;padding:10px;background:var(--bg-card);border-radius:6px;text-align:center;">`;
  body += `<div style="font-size:10px;color:var(--text-muted);">当前总欠</div>`;
  body += `<div style="font-size:16px;font-weight:bold;">¥${totalOwed.toLocaleString()}</div>`;
  body += `</div>`;
  body += `</div>`;

  // 还款输入
  body += `<div style="margin-bottom:8px;">`;
  body += `<label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">还款金额：</label>`;
  const maxRepay = Math.min(cash, bankDebt);
  body += `<input id="repay-loan-amount" type="number" min="100" max="${maxRepay}" value="${maxRepay}" step="100" style="width:100%;padding:8px;background:var(--bg-input);border:1px solid var(--border);border-radius:4px;color:var(--text-primary);font-size:14px;">`;
  body += `<div style="font-size:10px;margin-top:4px;color:var(--text-muted);">💡 提前还款无违约金，还完后信贷记录更新 ✅</div>`;
  body += `</div>`;

  // 当前现金
  body += `<p style="font-size:10px;color:var(--text-secondary);margin:6px 0 0 0;">💰 当前现金: ¥${cash.toLocaleString()}${cash < bankDebt ? `（不足以还清全部）` : `（可还清全部 ¥${bankDebt.toLocaleString()}）`}</p>`;

  showModal({
    title: "🏦 偿还银行贷款",
    body: body,
    buttons: [
      { text: "取消", cls: "", callback: () => {} },
      {
        text:
          bankDebt > 0 && cash >= bankDebt
            ? `还清全部 ¥${bankDebt.toLocaleString()}`
            : "能还多少还多少",
        cls: "btn-success",
        callback: () => {
          const repayAmount = bankDebt;
          if (typeof repayLoan === "function") {
            repayLoan(state, repayAmount);
            renderAll();
          }
        },
      },
      {
        text: "确认还款",
        cls: "btn-primary",
        callback: () => {
          const input = document.getElementById("repay-loan-amount");
          const amount = input ? parseInt(input.value) : 0;
          if (typeof repayLoan === "function") {
            repayLoan(state, amount);
            renderAll();
          }
        },
      },
    ],
  });

  // 绑定输入框实时校验
  setTimeout(() => {
    const input = document.getElementById("repay-loan-amount");
    if (input) {
      input.addEventListener("input", function () {
        const val = parseInt(this.value) || 0;
        const confirmBtns = document.querySelectorAll(".modal-actions .btn");

        if (val > maxRepay) {
          this.style.borderColor = "var(--danger)";
          this.style.borderWidth = "2px";
          for (const btn of confirmBtns) {
            if (btn.textContent === "确认还款") {
              btn.disabled = true;
              btn.style.opacity = "0.5";
            }
          }
        } else if (val > 0) {
          this.style.borderColor = "var(--success)";
          this.style.borderWidth = "2px";
          for (const btn of confirmBtns) {
            if (btn.textContent === "确认还款") {
              btn.disabled = false;
              btn.style.opacity = "1";
            }
          }
        } else {
          this.style.borderColor = "var(--border)";
          this.style.borderWidth = "1px";
        }
      });

      // 触发一次校验
      input.dispatchEvent(new Event("input"));
    }
  }, 50);
}

/** 还村长钱的模态框 */
function showRepayVillageModal() {
  const state = StateManager.getState();
  const villageDebt = state.resources.villageDebt || 0;
  if (villageDebt <= 0) {
    StateManager.addMessage("✅ 你并不欠村长钱。", "info");
    return;
  }
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
          if (state.resources.villageDebt <= 0) {
            StateManager.addMessage(
              "🎉 终于还清了村长的钱！无债一身轻！",
              "success",
            );
          } else {
            StateManager.addMessage(
              `🏘️ 还了村长 ¥${amt.toLocaleString()}。还剩 ¥${state.resources.villageDebt.toLocaleString()}。`,
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

  // 获取自动存档信息
  const autoInfo = getSlotInfo("_auto");
  let autoLine = "";
  if (autoInfo) {
    const d = new Date(autoInfo.savedAt);
    autoLine =
      '<div style="padding:8px 12px;margin-bottom:8px;background:rgba(39,174,96,0.06);border:1px solid rgba(39,174,96,0.2);border-radius:6px;font-size:12px;color:var(--text-secondary);display:flex;justify-content:space-between;align-items:center;">' +
      "<span>📅 上次自动存档</span>" +
      '<span style="color:#27ae60;">第<strong>' +
      autoInfo.day +
      "</strong>天 · " +
      d.toLocaleString("zh-CN") +
      "</span>" +
      "</div>";
  }

  let bodyHtml =
    '<p style="margin-bottom:8px;color:var(--text-secondary);">选择一个槽位保存当前进度：</p>';
  bodyHtml += autoLine;
  bodyHtml += '<div style="max-height:400px;overflow-y:auto;">';
  for (const s of allSlots) {
    if (s.slot === "_auto") continue; // 自动存档不可手动覆盖
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
            <strong style="color:var(--warning);">${s.mode ? s.mode + " " : ""}${s.label}</strong>
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
      // 自动存档空槽位不显示
      if (s.slot === "_auto") continue;
      bodyHtml += `<div style="padding:8px;margin:4px 0;background:var(--bg-card);border-radius:4px;opacity:0.4;font-size:12px;color:var(--text-muted);">${s.label} — 空</div>`;
    } else {
      hasAnySave = true;
      const phaseLabel = s.phase === "corporate" ? "🏢" : "🏘️";
      const modeTag = s.mode ? s.mode + " " : "";
      const isAuto = s.slot === "_auto";
      // 自动存档用绿色高亮样式
      const borderColor = isAuto ? "rgba(39,174,96,0.4)" : "var(--border)";
      const bgColor = isAuto ? "rgba(39,174,96,0.04)" : "var(--bg-card)";
      const labelIcon = isAuto ? "🤖 " : "";
      const labelName = isAuto ? "自动存档" : s.label;
      bodyHtml += `
        <div class="load-slot-card" data-slot="${s.slot}" style="padding:12px;margin:4px 0;background:${bgColor};border:1px solid ${borderColor};border-radius:6px;cursor:pointer;transition:border-color 0.15s;${isAuto ? "border-left:3px solid #27ae60;" : ""}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${labelIcon}${modeTag}${labelName}</strong>
            <span style="font-size:11px;color:var(--text-muted);">${s.date || ""}</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:3px;">
            ${phaseLabel} 第${s.day}天 | 年龄${s.age} | 💰 ¥${(s.cash || 0).toLocaleString()}
            ${s.rank ? ` | 🏢 ${s.rank}` : ""}
            ${s.debt > 0 ? ` | ⚠️ 欠款 ¥${s.debt.toLocaleString()}` : ""}
            ${s.totalEarned > 0 ? ` | 总赚 ¥${s.totalEarned.toLocaleString()}` : ""}
          </div>
          ${s.narrative ? `<div style="font-size:11px;color:#27ae60;margin-top:5px;padding:4px 6px;background:rgba(39,174,96,0.06);border-radius:4px;border-left:2px solid rgba(39,174,96,0.3);">${s.narrative}</div>` : ""}
          ${isAuto ? '<div style="font-size:10px;color:#27ae60;margin-top:3px;">↻ 每日自动保存 · 前一日备份可用</div>' : ""}
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
  // 过滤已倒闭公司（多周目系统）
  var available =
    typeof getAvailableCompanies === "function"
      ? getAvailableCompanies()
      : typeof COMPANIES !== "undefined"
        ? COMPANIES
        : [];
  var deceasedList =
    typeof getDeceasedCompanies === "function" ? getDeceasedCompanies() : [];

  // 检查是否还有可选公司
  if (available.length === 0) {
    showModal({
      title: "💼 无公司可选",
      body: '<p style="color:var(--danger);">由于历史原因，所有科技公司都已倒闭……这个世界再也没有大厂可进了。</p><p>也许你更适合走其他路线致富？</p>',
      buttons: [{ text: "回去再想想", cls: "", callback: () => {} }],
    });
    return;
  }

  var hasDeceased = deceasedList.length > 0;
  var body =
    '<p style="color:var(--success);">🎉 你的能力获得了多家公司的面试机会！</p>';
  if (hasDeceased) {
    body +=
      '<p style="font-size:11px;color:var(--text-muted);">📜 <em>前尘往事：有几家公司已在历史中倒闭……</em></p>';
  }
  body += "<p>选择一家公司加入：</p>";
  body += '<div style="max-height:300px;overflow-y:auto;">';
  for (var i = 0; i < available.length; i++) {
    var company = available[i];
    body += buildCompanyCardHtml(company);
  }
  body += "</div>";

  // 显示已倒闭公司回顾
  if (hasDeceased) {
    body +=
      '<div style="margin-top:12px;padding:8px;background:var(--bg-card);border:1px dashed var(--border);border-radius:6px;">';
    body +=
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">⚰️ 已不存在的公司：</div>';
    for (var di = 0; di < deceasedList.length; di++) {
      var dc = deceasedList[di];
      body +=
        '<div style="font-size:10px;color:var(--text-muted);padding:2px 0;">▸ ' +
        dc +
        "</div>";
    }
    body += "</div>";
  }

  showModal({
    title: "💼 选择公司",
    body,
    buttons: [{ text: "再考虑考虑", cls: "", callback: () => {} }],
  });

  setTimeout(function () {
    document.querySelectorAll(".company-card").forEach(function (card) {
      card.onclick = function () {
        document.querySelector(".modal-overlay")?.remove();
        if (typeof enterCorporatePhase === "function")
          enterCorporatePhase(card.dataset.company);
      };
      card.onmouseover = function () {
        card.style.borderColor = "var(--accent)";
      };
      card.onmouseout = function () {
        card.style.borderColor = "var(--border)";
      };
    });
  }, 50);
}

/** 生成公司卡片 HTML */
function buildCompanyCardHtml(company) {
  return (
    '<div class="company-card" data-company="' +
    company.id +
    '" style="padding:12px;margin:6px 0;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;cursor:pointer;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
    '<strong style="color:var(--accent);">' +
    company.name +
    "</strong>" +
    '<span style="font-size:11px;color:var(--text-muted);">' +
    company.industry +
    "</span></div>" +
    '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">' +
    company.culture +
    "</div>" +
    '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">' +
    "薪资倍率:" +
    company.salaryMod +
    "x | 风险:" +
    company.riskMod +
    "x | 成长:" +
    company.growthRate +
    "x</div></div>"
  );
}

// ====== 装备商店 ======
/** 购买装备：扣钱，添加到 inventory.equipment 或 items（支持品质系统） */
function buyItemFromShop(itemId) {
  var state = StateManager.getState();
  var item = typeof getItemById === "function" ? getItemById(itemId) : null;
  if (!item) return;

  // 品质系统：生成带品质的装备实例
  var equippedItem = null;
  if (typeof createEquipmentInstance === "function" && item.slot) {
    equippedItem = createEquipmentInstance(item, "buy");
  }

  // 价格：使用品质价格（如果有）
  var price = equippedItem ? equippedItem.actualPrice : item.price;

  if (state.resources.cash < price) {
    StateManager.addMessage("💸 现金不足，无法购买 " + item.name, "warning");
    return;
  }
  state.resources.cash -= price;
  addDailyTransaction(
    state,
    "expense",
    "shopping",
    price,
    "购买" + (item.icon || "") + item.name,
  );

  // 装备类（有slot）：放入 equipment 槽位（带品质信息，按 slot 键存储实例）
  if (item.slot) {
    if (!state.inventory.equipment) state.inventory.equipment = {};
    if (!state.inventory.equipmentInstances)
      state.inventory.equipmentInstances = {};

    var curInst = getEquippedInstance(state, item.slot);
    if (curInst) {
      var curDef =
        typeof getItemById === "function" ? getItemById(curInst.itemId) : null;
      StateManager.addMessage(
        "👕 替换了旧的" +
          ((curDef && curDef.name) || curInst.itemId) +
          "，装备了" +
          item.name +
          (equippedItem &&
          equippedItem.qualityName &&
          equippedItem.qualityName !== "普通"
            ? "（" +
              (equippedItem.qualityIcon || "") +
              equippedItem.qualityName +
              "品质）"
            : ""),
        "info",
      );
    } else {
      StateManager.addMessage(
        "✅ 购买并装备了：" +
          item.name +
          (equippedItem &&
          equippedItem.qualityName &&
          equippedItem.qualityName !== "普通"
            ? "（" +
              (equippedItem.qualityIcon || "") +
              equippedItem.qualityName +
              "品质）"
            : ""),
        "success",
      );
    }
    state.inventory.equipment[item.slot] = itemId;
    if (equippedItem) {
      state.inventory.equipmentInstances[item.slot] = equippedItem;
    }
    // 初始化耐久度（新装备立即有耐久度）
    if (typeof initEquipmentDurability === "function") {
      initEquipmentDurability(state);
    }
  } else {
    // 无slot的道具：放入 items 背包
    if (!state.inventory.items) state.inventory.items = [];
    var existing = state.inventory.items.find(function (i) {
      return i.id === itemId;
    });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      var itemInstance = { id: itemId, qty: 1 };
      state.inventory.items.push(itemInstance);
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
      // 品质系统预览：计算价格范围（不消耗RNG，只展示理论值）
      var actualPrice = item.price;
      var hasQuality = item.slot && typeof getQualityPriceMult === "function";
      var maxPrice = hasQuality ? Math.round(item.price * 1.5) : item.price;
      var canAfford = state.resources.cash >= actualPrice;
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
      // 显示价格范围（品质系统：品质影响实际价格）
      if (hasQuality && maxPrice > item.price) {
        priceSpan.textContent = "¥" + item.price + "~" + maxPrice;
      } else {
        priceSpan.textContent = "¥" + item.price;
      }
      topRow.appendChild(nameSpan);
      topRow.appendChild(priceSpan);

      var descEl = document.createElement("div");
      descEl.style.cssText =
        "font-size:11px;color:var(--text-muted);margin-bottom:6px;";
      descEl.textContent = item.desc || "";

      var slotEl = document.createElement("div");
      slotEl.style.cssText =
        "font-size:10px;color:var(--text-secondary);margin-bottom:6px;";
      if (item.slot) {
        var slotText = "槽位：" + item.slot;
        if (hasQuality) {
          slotText +=
            ' <span style="color:var(--accent);">◆品质随机（普通70%/优质22%/高档8%）</span>';
        }
        slotEl.innerHTML = slotText;
      } else {
        slotEl.textContent = "道具（放入背包）";
      }

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
    if (e.target === overlay) {
      /* 必须点击按钮关闭 */
    }
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
    apBadge.textContent = "⚡" + r.ap + "行动力";
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
      apWarnEl.textContent = "⚡ 行动力不足（需要 " + r.ap + "行动力）";
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
        : "⚡ 行动力不足"
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
    if (e.target === overlay) {
      /* 必须点击按钮关闭 */
    }
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
    var base = 2 + Random.int(0, 7);
    var bonus = 0;
    var bonusNote = "";
    if (st.flags.oldZhouTips) {
      bonus += 5 + Random.int(0, 7);
      bonusNote = "（老周教的路线多翻了些）";
    }
    if (st.flags.oldZhouChannel) {
      bonus += 8 + Random.int(0, 11);
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
    var base2 = 8 + Random.int(0, 14);
    earned = base2;
    hygieneCost = 8;
    fatigueCost = 8;
    if (Random.chance(0.3)) {
      var extra = 8 + Random.int(0, 10);
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
    if (Random.chance(0.08)) {
      var loss = Math.min(5, earned);
      earned -= loss;
      st.status.health = Math.max(0, (st.status.health || 100) - 3);
      st.player.fame = Math.max(0, st.player.fame - 1);
      msg += " 被城管看见了，追赶中丢了 ¥" + loss + "。";
      msgType = "warning";
    }
  } else if (routeId === "factory") {
    apCost = 30;
    var base3 = 15 + Random.int(0, 30);
    earned = base3;
    hygieneCost = 10;
    fatigueCost = 12;
    if (Random.chance(0.4)) {
      var extra2 = 10 + Random.int(0, 15);
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
    if (Random.chance(0.15)) {
      earned = Math.floor(earned * 0.5);
      fatigueCost += 10;
      msg += " 被保安发现吓跑了，东西丢了一半，到手 ¥" + earned + "。";
      msgType = "warning";
    }
  } else if (routeId === "zhou_channel") {
    apCost = 25;
    earned = 25 + Random.int(0, 40);
    hygieneCost = 5;
    fatigueCost = 6;
    msg =
      "⭐ 按老周的专线走了一趟，废品站朋友给了内部价，卖了 ¥" +
      earned +
      "，稳稳的！";
  }

  st.resources.cash += earned;
  st.resources.totalEarned += earned;
  var routeNames = {
    alley: "城中村小巷",
    depot: "废品收购站",
    factory: "工业区废料场",
    zhou_channel: "老周专线",
  };
  addDailyTransaction(
    st,
    "income",
    "scavenge",
    earned,
    "拾荒 - " + (routeNames[routeId] || "未知路线"),
  );
  st.needs.hygiene = Math.max(0, st.needs.hygiene - hygieneCost);
  st.needs.fatigue = Math.min(100, st.needs.fatigue + fatigueCost);

  // 装备掉落：拾荒偶尔捡到可用装备（捡破烂换钱/自用）
  var dropChance =
    {
      alley: 0.08,
      depot: 0.12,
      factory: 0.15,
      zhou_channel: 0.1,
    }[routeId] || 0;
  if (Random.chance(dropChance)) {
    var SCAVENGE_EQUIPMENT_POOL = [
      "straw_hat",
      "work_gloves",
      "sturdy_shoes",
      "backpack",
    ];
    var dropId =
      SCAVENGE_EQUIPMENT_POOL[
        Random.int(0, SCAVENGE_EQUIPMENT_POOL.length - 1)
      ];
    var dropDef =
      typeof getItemById === "function" ? getItemById(dropId) : null;
    if (
      dropDef &&
      dropDef.slot &&
      typeof createEquipmentInstance === "function"
    ) {
      var dropInst = createEquipmentInstance(dropDef, "loot", {
        qualityWeights:
          typeof QUALITY_WEIGHTS_BY_SOURCE !== "undefined"
            ? QUALITY_WEIGHTS_BY_SOURCE.loot
            : null,
      });
      var dropSlot = dropDef.slot;
      if (!st.inventory.equipment) st.inventory.equipment = {};
      if (!st.inventory.equipmentInstances)
        st.inventory.equipmentInstances = {};
      var curDrop = st.inventory.equipment[dropSlot];
      if (!curDrop) {
        // 槽位空：直接装备
        st.inventory.equipment[dropSlot] = dropId;
        st.inventory.equipmentInstances[dropSlot] = dropInst;
        var dropQ =
          dropInst.qualityName && dropInst.qualityName !== "普通"
            ? "「" + dropInst.qualityName + "」"
            : "";
        msg += " 顺便捡到一副" + dropQ + dropDef.name + "，戴上正合适！";
      } else {
        // 槽位占用：按实际价 50% 折现（捡破烂换钱）
        var sellPrice = Math.floor(
          (dropInst.actualPrice || dropDef.price || 0) * 0.5,
        );
        st.resources.cash += sellPrice;
        st.resources.totalEarned += sellPrice;
        addDailyTransaction(
          st,
          "income",
          "scavenge",
          sellPrice,
          "拾荒卖装备 - " + dropDef.name,
        );
        msg +=
          " 捡到一副" +
          dropDef.name +
          "，但已有同类，转手卖了¥" +
          sellPrice +
          "。";
      }
    }
  }

  StateManager.addMessage(msg, msgType);
  consumeAP(apCost);
  if (typeof renderAll === "function") renderAll();
}

// ====== Phase 2: IPO 审核结果弹窗 ======
function applyIPOResultModal(state, approved) {
  if (typeof processIPOResult === "function") {
    processIPOResult(state, approved);
  }
  renderAll();
}

/** 显示 IPO 审核结果 */
function showIPOResultModal(state) {
  var startup = state.startup;
  var company = startup.company;
  if (!company) return;

  // 简化：50% 通过率
  var approved = Random.chance(0.5);

  showModal({
    title: approved ? "🔔 IPO 审核结果" : "❌ IPO 审核未通过",
    body: approved
      ? "<div style='text-align:center;padding:20px;'>" +
        "<p style='font-size:16px;margin-bottom:16px;'>恭喜你！「" +
        company.name +
        "」IPO 审核通过！</p>" +
        "<p>公司将在港交所/纳斯达克挂牌上市。</p>" +
        "<p style='color:var(--success);margin-top:16px;'>上市溢价：1.5-3 倍估值</p>" +
        "<p>你持有的 " +
        Math.round(company.equity.player) +
        "% 股份将转化为巨额财富！</p>" +
        "<p style='font-size:12px;color:var(--text-muted);margin-top:12px;'>系统正在自动计算上市结果...</p>"
      : "<div style='text-align:center;padding:20px;'>" +
        "<p style='font-size:16px;margin-bottom:16px;'>很遗憾，「" +
        company.name +
        "」IPO 审核未通过。</p>" +
        "<p>原因：公司需要继续经营，达到更高的估值和盈利标准。</p>" +
        "<p style='margin-top:16px;'>你可以继续发展公司，满足条件后再次申请 IPO。</p>" +
        "<p style='font-size:12px;color:var(--text-muted);margin-top:12px;'>当前估值：¥" +
        Math.round(company.valuation).toLocaleString() +
        " | 需要估值：≥¥5 亿</p>",
    buttons: [
      {
        text: approved ? "🎉 知道了" : "💼 继续经营",
        cls: approved ? "btn-success" : "btn-primary",
        callback: function () {
          if (approved) {
            applyIPOResultModal(state, true);
          } else {
            applyIPOResultModal(state, false);
          }
        },
      },
    ],
  });
}

// ====== Phase 2: 收购要约弹窗 ======
function showAcquisitionModal(state) {
  if (typeof getAcquisitionOffer === "function") {
    var offer = getAcquisitionOffer(state);
    if (!offer) {
      StateManager.addMessage("当前没有收购要约", "info");
      return;
    }

    var company = state.startup.company;

    showModal({
      title: "🤝 收购要约",
      body:
        "<div style='padding:10px;'>" +
        "<p><b>收购方</b>：「" +
        offer.acquirerName +
        "」</p>" +
        "<p><b>收购价格</b>：¥" +
        offer.offerValue.toLocaleString() +
        "</p>" +
        "<p><b>你的持股价值</b>：<span style='color:var(--success);font-size:16px;'>¥" +
        offer.playerShareValue.toLocaleString() +
        "</span></p>" +
        "<p><b>公司当前估值</b>：¥" +
        Math.round(company.valuation).toLocaleString() +
        "</p>" +
        "<p style='font-size:12px;color:var(--text-muted);margin-top:12px;'>接受收购后，公司将退出历史舞台，你获得一次性现金回报。</p>" +
        "<p style='font-size:12px;color:var(--text-muted);'>拒绝收购可以继续经营，等待更好的机会或 IPO。</p>" +
        "</div>",
      buttons: [
        {
          text: "❌ 拒绝",
          cls: "",
          callback: function () {
            StateManager.addMessage("拒绝了收购要约，继续经营公司", "info");
            renderAll();
          },
        },
        {
          text: "🤝 接受",
          cls: "btn-warning",
          callback: function () {
            if (typeof acceptAcquisition === "function") {
              var result = acceptAcquisition(state, offer);
              if (result.success) {
                StateManager.addMessage("收购完成！", "success");
              }
            }
            renderAll();
          },
        },
      ],
    });
  }
}

// ====== 摆摊选址建议系统（P1-1 街头特色玩法） ======

/**
 * 获取摆摊地点推荐（考虑天气、节日、周末、客流量等因素）
 */
function getVendingLocationAdvice(state) {
  var loc = state.trade.currentLocation;
  var weather = state.weather;
  var day = state.player.day;
  var isWeekend = day % 7 >= 5; // 简化：每 7 天一个周期，后两天为周末

  // 各地点摆摊收益评估
  var locations = [
    {
      id: "slum",
      name: "城中村",
      baseFootfall: 0.6,
      bestFor: ["food", "daily"],
      weatherMod: 1.0,
      weekendMod: 0.8,
    },
    {
      id: "wholesaleMarket",
      name: "批发市场",
      baseFootfall: 0.9,
      bestFor: ["goods", "food"],
      weatherMod: 0.7,
      weekendMod: 1.2,
    },
    {
      id: "construction",
      name: "建筑工地",
      baseFootfall: 0.5,
      bestFor: ["food"],
      weatherMod: 0.5,
      weekendMod: 0.3,
    },
    {
      id: "factoryZone",
      name: "工业区",
      baseFootfall: 1.0,
      bestFor: ["food", "goods"],
      weatherMod: 0.8,
      weekendMod: 0.4,
    },
    {
      id: "school",
      name: "大学城",
      baseFootfall: 1.2,
      bestFor: ["food", "goods", "snacks"],
      weatherMod: 0.9,
      weekendMod: 1.5,
    },
    {
      id: "commercialDist",
      name: "商业区",
      baseFootfall: 1.8,
      bestFor: ["food", "goods", "electronics", "clothing"],
      weatherMod: 1.0,
      weekendMod: 1.3,
    },
    {
      id: "techPark",
      name: "科技园",
      baseFootfall: 0.7,
      bestFor: ["food", "snacks"],
      weatherMod: 0.8,
      weekendMod: 0.5,
    },
    {
      id: "hospital",
      name: "医院",
      baseFootfall: 0.6,
      bestFor: ["food", "daily"],
      weatherMod: 0.9,
      weekendMod: 0.8,
    },
    {
      id: "park",
      name: "公园",
      baseFootfall: 0.4,
      bestFor: ["food", "snacks"],
      weatherMod: 0.4,
      weekendMod: 1.8,
    },
    {
      id: "trainingCenter",
      name: "培训中心",
      baseFootfall: 0.5,
      bestFor: ["food"],
      weatherMod: 1.0,
      weekendMod: 1.4,
    },
  ];

  // 天气修正
  var weatherMod = 1.0;
  var weatherAdvice = "";
  if (weather) {
    if (
      weather.current === "stormy" ||
      weather.current === "snowy" ||
      weather.current === "typhoon" ||
      weather.current === "sandstorm"
    ) {
      weatherMod = 0.4;
      weatherAdvice = "⚠️ 恶劣天气，室外摆摊客流锐减，建议室内行动或休息";
    } else if (weather.current === "rainy" || weather.current === "plum_rain") {
      weatherMod = 0.7;
      weatherAdvice = "💡 雨天天气，建议去有遮蔽的地方（批发市场/培训中心）";
    } else if (weather.current === "sunny") {
      weatherMod = 1.1;
      weatherAdvice = "☀️ 晴天，室外摆摊最佳时机！";
    } else if (weather.current === "cloudy") {
      weatherMod = 1.0;
    } else if (weather.current === "heatwave") {
      weatherMod = 0.6;
      weatherAdvice = "🥵 高温预警，注意防暑，建议减少户外活动";
    } else if (weather.current === "cold_snap") {
      weatherMod = 0.5;
      weatherAdvice = "🥶 寒潮来袭，注意保暖，建议在室内工作";
    } else if (weather.current === "heavy_smog") {
      weatherMod = 0.6;
      weatherAdvice = "😷 重度雾霾，建议佩戴口罩或室内行动";
    }
  }

  // 节日修正
  var festivalMod = 1.0;
  var festivalAdvice = "";
  // 简化：检查是否在节日期内
  var festivalDays = [20, 21, 22, 23, 24, 25, 26, 27]; // 春节
  if (festivalDays.indexOf(day % 365) >= 0) {
    festivalMod = 1.5;
    festivalAdvice = "🧨 春节期间，客流量大增，建议去商业区/公园！";
  }

  // 计算各地点综合得分
  var scores = locations.map(function (l) {
    var score =
      l.baseFootfall *
      weatherMod *
      (isWeekend ? l.weekendMod : 1.0) *
      festivalMod;
    return { ...l, score: score };
  });

  // 排序
  scores.sort(function (a, b) {
    return b.score - a.score;
  });

  // 生成建议
  var best = scores[0];
  var second = scores[1];
  var third = scores[2];

  return {
    bestLocation: best,
    top3: scores.slice(0, 3),
    weatherAdvice: weatherAdvice,
    festivalAdvice: festivalAdvice,
    isWeekend: isWeekend,
    weatherMod: weatherMod,
    festivalMod: festivalMod,
  };
}

/**
 * 显示摆摊选址建议弹窗
 */
function showVendingLocationAdviceModal() {
  var st = StateManager.getState();
  var advice = getVendingLocationAdvice(st);

  var html = '<div style="font-size:13px;line-height:1.6;">';

  // 天气/节日提示
  if (advice.weatherAdvice) {
    html +=
      '<div style="padding:8px 12px;background:var(--bg-input);border-radius:6px;margin-bottom:12px;">';
    html += advice.weatherAdvice;
    html += "</div>";
  }
  if (advice.festivalAdvice) {
    html +=
      '<div style="padding:8px 12px;background:#fff3cd;border-radius:6px;margin-bottom:12px;color:#856404;">';
    html += advice.festivalAdvice;
    html += "</div>";
  }

  // 最佳地点推荐
  var best = advice.bestLocation;
  html +=
    '<div style="text-align:center;padding:12px;background:linear-gradient(135deg,#4a9e5c20,#4a9e5c10);border-radius:8px;margin-bottom:12px;border:2px solid #4a9e5c;">';
  html +=
    '<div style="font-size:16px;font-weight:700;color:#4a9e5c;">🏆 最佳摆摊地点</div>';
  html += '<div style="font-size:18px;margin-top:6px;">' + best.name + "</div>";
  html +=
    '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">综合得分：' +
    best.score.toFixed(2) +
    "</div>";
  html += "</div>";

  // TOP3 排名
  html +=
    '<h3 style="margin:12px 0 8px;font-size:14px;">📊 今日摆摊地点排名</h3>';
  html += '<div style="display:flex;flex-direction:column;gap:6px;">';

  var medalIcons = ["🥇", "🥈", "🥉"];
  advice.top3.forEach(function (loc, idx) {
    var isBest = idx === 0;
    html +=
      '<div style="display:flex;align-items:center;padding:8px 10px;border-radius:6px;background:' +
      (isBest ? "#4a9e5c15" : "var(--bg-input)") +
      '">';
    html +=
      '<span style="font-size:16px;margin-right:8px;">' +
      medalIcons[idx] +
      "</span>";
    html += '<div style="flex:1;">';
    html += "<strong>" + loc.name + "</strong>";
    html +=
      '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">得分 ' +
      loc.score.toFixed(2) +
      "</span>";
    html += "</div>";
    html +=
      '<span style="font-size:11px;padding:2px 6px;border-radius:4px;background:' +
      (isBest ? "#4a9e5c" : "var(--bg-card)") +
      ";color:" +
      (isBest ? "#fff" : "var(--text-primary)") +
      '">×' +
      loc.score.toFixed(1) +
      "</span>";
    html += "</div>";
  });

  html += "</div>";

  // 小贴士
  html +=
    '<div style="margin-top:12px;padding:10px 12px;background:var(--bg-card);border-radius:6px;font-size:12px;color:var(--text-secondary);">';
  html += "<strong>💡 摆摊小贴士：</strong>";
  html += '<ul style="margin:6px 0 0;padding-left:16px;">';
  html += "<li>晴天/周末是摆摊黄金时间，客流+30%~80%</li>";
  html += "<li>恶劣天气（暴雨/大雪）建议室内行动或休息</li>";
  html += "<li>大学城周末客流暴涨，适合卖零食/小商品</li>";
  html += "<li>商业区客流最大但城管也最多，注意风险</li>";
  html += "<li>工业区午休时间（12:00-13:00）是食品摊黄金时段</li>";
  html += "</ul>";
  html += "</div>";

  html += "</div>";

  showModal({
    title: "🛒 摆摊选址建议",
    body: html,
    buttons: [{ text: "知道了", cls: "btn-primary" }],
  });
}

/**
 * Phase 3: 显示继承摘要弹窗
 * 新游戏开始时展示上局遗产继承详情
 */
function showInheritanceSummaryModal(inheritanceData) {
  if (!inheritanceData) return;

  var badges = inheritanceData.badges || [];
  var cashInfo = inheritanceData.cashInfo;
  var relCount = inheritanceData.relationshipCount || 0;
  var itemCount = inheritanceData.itemCount || 0;
  var dreamProgress = inheritanceData.dreamProgress;
  var skillTree = inheritanceData.skillTree;
  var narrative = inheritanceData.narrative || "";
  var crisisPath = inheritanceData.crisisPath;
  var moralScore = inheritanceData.moralScore;
  var peakAffinity = inheritanceData.peakAffinity;
  var totalDays = inheritanceData.totalDays || 0;

  // 构建徽章HTML
  var badgeHtml = "";
  if (badges.length > 0) {
    badgeHtml = '<div style="margin-bottom:12px;">';
    badgeHtml +=
      '<div style="font-size:14px;font-weight:bold;margin-bottom:6px;color:var(--text-primary);">🏅 声誉徽章</div>';
    badgeHtml += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
    for (var bi = 0; bi < badges.length; bi++) {
      var b = badges[bi];
      badgeHtml +=
        '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:6px 10px;font-size:12px;text-align:center;">';
      badgeHtml +=
        '<div style="font-size:20px;">' + (b.icon || "🏅") + "</div>";
      badgeHtml +=
        '<div style="font-weight:bold;color:var(--text-primary);margin-top:2px;">' +
        b.name +
        "</div>";
      badgeHtml +=
        '<div style="color:var(--text-secondary);font-size:11px;margin-top:1px;">' +
        b.effect +
        "</div>";
      badgeHtml += "</div>";
    }
    badgeHtml += "</div></div>";
  } else {
    badgeHtml =
      '<div style="margin-bottom:12px;color:var(--text-secondary);font-size:13px;">未获得声誉徽章</div>';
  }

  // 构建现金信息
  var cashHtml = "";
  if (cashInfo) {
    cashHtml =
      '<div style="margin-bottom:12px;background:var(--bg-card);border-radius:6px;padding:10px;">';
    cashHtml +=
      '<div style="font-size:14px;font-weight:bold;color:var(--text-primary);margin-bottom:4px;">💰 遗产现金</div>';
    cashHtml += '<div style="font-size:12px;color:var(--text-secondary);">';
    cashHtml += "基础: ¥" + (cashInfo.base || 0).toLocaleString();
    if (cashInfo.bonus > 0) {
      cashHtml +=
        " + 声誉加成: ¥" +
        cashInfo.bonus.toLocaleString() +
        " (+" +
        cashInfo.bonusPercent +
        "%)";
    }
    cashHtml +=
      ' <strong style="color:#4caf50;">= ¥' +
      cashInfo.total.toLocaleString() +
      "</strong>";
    cashHtml += "</div></div>";
  }

  // 构建关系信息
  var relHtml = "";
  if (relCount > 0) {
    relHtml =
      '<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">';
    relHtml += "❤️ 继承了 " + relCount + " 位NPC的旧识关系（好感度衰减保留）";
    relHtml += "</div>";
  }

  // 构建物品信息
  var itemHtml = "";
  if (itemCount > 0) {
    itemHtml =
      '<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">';
    itemHtml += "🎒 继承了 " + itemCount + " 件传奇/成就物品";
    itemHtml += "</div>";
  }

  // 构建梦想进度
  var dreamHtml = "";
  if (dreamProgress) {
    dreamHtml =
      '<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">';
    dreamHtml +=
      "🌟 梦想进度已继承（已完成 " +
      dreamProgress.completedMilestones +
      " 个里程碑）";
    dreamHtml += "</div>";
  }

  // 构建技能树信息
  var skillHtml = "";
  if (skillTree && skillTree.nodes) {
    var activeCount = Object.keys(skillTree.nodes).length;
    if (activeCount > 0) {
      skillHtml =
        '<div style="margin-bottom:12px;font-size:13px;color:var(--text-secondary);">';
      skillHtml += "🎓 继承了 " + activeCount + " 个已激活天赋节点";
      skillHtml += "</div>";
    }
  }

  var crisisPath = inheritanceData.crisisPath;
  var moralScore = inheritanceData.moralScore;
  var peakAffinity = inheritanceData.peakAffinity;
  var totalDays = inheritanceData.totalDays || 0;

  // === 35 岁分水岭路径继承 ===
  var crisisHtml = "";
  if (crisisPath && crisisPath.path) {
    crisisHtml =
      '<div style="margin-bottom:12px;background:var(--bg-card);border-radius:6px;padding:10px;">';
    crisisHtml +=
      '<div style="font-size:13px;font-weight:bold;color:var(--accent);margin-bottom:4px;">📋 上辈子的 35 岁选择</div>';
    crisisHtml += '<div style="font-size:12px;color:var(--text-secondary);">';
    crisisHtml +=
      '<span style="background:var(--bg-input);padding:2px 8px;border-radius:4px;">' +
      crisisPath.label +
      "</span> ";
    crisisHtml += crisisPath.note || "";
    crisisHtml += "</div></div>";
  }

  // === 道德分（前世业力） ===
  var moralHtml = "";
  if (moralScore && moralScore.score !== undefined) {
    var moralColor =
      moralScore.score >= 10
        ? "var(--success)"
        : moralScore.score >= 0
          ? "var(--text-primary)"
          : moralScore.score >= -5
            ? "var(--warning)"
            : "var(--danger)";
    moralHtml =
      '<div style="margin-bottom:12px;background:var(--bg-card);border-radius:6px;padding:10px;">';
    moralHtml +=
      '<div style="font-size:13px;font-weight:bold;color:var(--accent);margin-bottom:4px;">⚖️ 前世业力</div>';
    moralHtml += '<div style="font-size:12px;color:var(--text-secondary);">';
    moralHtml +=
      '善恶净值: <strong style="color:' +
      moralColor +
      ';">' +
      (moralScore.score >= 0 ? "+" : "") +
      moralScore.score +
      "</strong> " +
      "(" +
      moralScore.label +
      ")";
    if (moralScore.good > 0 || moralScore.bad > 0) {
      moralHtml +=
        ' <span style="color:var(--text-muted);">善行' +
        moralScore.good +
        " / 恶行" +
        moralScore.bad +
        "</span>";
    }
    moralHtml += "</div></div>";
  }

  // === NPC 巅峰好感（老熟人） ===
  var peakHtml = "";
  if (peakAffinity && peakAffinity.npcs && peakAffinity.count > 0) {
    peakHtml =
      '<div style="margin-bottom:12px;background:var(--bg-card);border-radius:6px;padding:10px;">';
    peakHtml +=
      '<div style="font-size:13px;font-weight:bold;color:var(--accent);margin-bottom:4px;">👥 老熟人（上局巅峰好感）</div>';
    peakHtml +=
      '<div style="font-size:12px;color:var(--text-secondary);display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">';
    for (var npcId in peakAffinity.npcs) {
      var pa = peakAffinity.npcs[npcId];
      peakHtml +=
        '<span style="background:var(--bg-input);padding:2px 8px;border-radius:4px;">' +
        npcId +
        " ❤️" +
        pa.peakAffinity +
        "</span>";
    }
    peakHtml += "</div></div>";
  }

  // 叙事文案
  var narrativeHtml = "";
  if (narrative) {
    narrativeHtml =
      '<div style="margin:12px 0;padding:10px 12px;background:linear-gradient(135deg, rgba(76,175,80,0.1), rgba(33,150,243,0.1));border-radius:6px;border-left:3px solid #4caf50;font-size:13px;color:var(--text-primary);font-style:italic;">';
    narrativeHtml += narrative;
    narrativeHtml += "</div>";
  }

  var html = "";
  html += '<div class="inheritance-summary">';
  html += narrativeHtml;
  html += badgeHtml;
  html += cashHtml;
  html += relHtml;
  html += itemHtml;
  html += dreamHtml;
  html += skillHtml;
  html += crisisHtml;
  html += moralHtml;
  html += peakHtml;
  // 总存活天数提示
  if (totalDays > 0) {
    html +=
      '<div style="margin-bottom:12px;font-size:12px;color:var(--text-muted);text-align:center;">上局存活 ' +
      totalDays +
      " 天</div>";
  }
  html += "</div>";

  showModal({
    title: "🔄 继承上局遗产",
    body: html,
    buttons: [
      {
        text: "开始新旅程",
        cls: "btn-primary",
        callback: function () {
          // 关闭弹窗，进入游戏
        },
      },
    ],
  });
}
