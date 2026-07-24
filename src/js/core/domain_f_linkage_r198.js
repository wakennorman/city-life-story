/*
 * 城市浮生记 — 域F（UI/UX）联动增强 · R198
 * 全系统优化 loop R198 · 联动增强 3项（2 street + 1 corporate）
 *
 * 背景：域F UI 层经 R19(UI基础)/R183(学历+消息toggle+每日目标终身一次+教程selector)/R186(证书certs死字段+career.currentJob守卫)
 *   三轮加固后，本轮 Explore 子代理对 17 个 UI 文件逐行审计 + 死字段黑名单全库 grep，结论：UI 层 0 确证 A类缺陷，干净。
 *   故本轮域F A类=0（与 R196 pivot 后 clean 域一致），专注跨域联动增强，补齐尚未覆盖的方向：
 *  - F→E（清晰财务面板 → 投资意识，复用 _dataInvestorMindset）
 *  - F→B（生活手账/影像记录 → 事件叙事回望的心智回馈）
 *  - F→H（清爽的路演/周报材料 → 公司经营技能与管理经验）
 *  注：F→A/D/C/G 已在 R19/R186 覆盖，本轮刻意避开以免主题撞车。
 *  id 前缀 f198_ 与 R183/R186 既有 ui_/ui_r186_ 前缀均不冲突。
 *
 * 设计约束（与历轮各域 linkage 一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS（非 ES import），避免改主库既有事件文件。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），故显式设 phase（2 street + 1 corporate）。
 *  - 里程碑/去重用 st.flags._xxxCooldown（conditions 与 apply 双重拦截）。
 *  - 严守域D铁律：本轮回合无 D 向事件，故不涉及 relationships；若未来补 D 向须走 applyAffinityChange。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR198Loaded) return;
  RANDOM_EVENTS._domainFLinkageR198Loaded = true;

  // ---- [PLACEHOLDER] 数值常量（集中标注，便于平衡）----
  var P_FIN_MENTAL = 5; // [PLACEHOLDER] F→E 财务面板清晰后的心智回馈
  var P_SCRAP_MENTAL = 4; // [PLACEHOLDER] F→B 生活手账回望的心智回馈
  var P_SCRAP_HAPPY = 5; // [PLACEHOLDER] F→B 生活手账回望的心情回馈
  var P_DECK_XP = 8; // [PLACEHOLDER] F→H 清爽材料带来的管理/经营XP
  var P_DECK_CASH = 800; // [PLACEHOLDER] F→H 材料增色换来的绩效/资源

  function msgR198(text, kind) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage)
      StateManager.addMessage(text, kind || "info");
  }

  var F_EVENTS_R198 = [
    // ===== F→E：把收支与持仓做成一目了然的财务面板 ↔ 经济/投资（数据可视化→投资意识） =====
    {
      id: "f198_finance_glass",
      title: "把账，摊成一块透明的玻璃",
      desc:
        "你花了一个周末，把银行卡、支付宝、股票账户、房租水电，全归进一张能一眼看完的表。" +
        "等数字排齐的那刻，你忽然看清了：哪笔钱在睡大觉，哪笔在悄悄缩水。\n\n" +
        "「原来不是钱不够，是我从没认真看过它。」你第一次觉得，打理资产没那么吓人。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._f198FinanceGlassCooldown) return false;
        if (!st.resources) return false;
        return true;
      },
      choices: [
        {
          text: "📊 让闲置的现金也去生点息",
          apply: function (st) {
            // E域桥接：财务面板清晰感 → 投资意识（复用历轮 _dataInvestorMindset 标记）
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + P_FIN_MENTAL);
            if (st.flags) {
              st.flags._dataInvestorMindset = true; // 复用 canonical 投资意识 flag
              st.flags._f198FinanceGlassCooldown = true;
            }
            msgR198(
              "看得见钱去哪，才握得住钱。你开始琢磨让闲钱动起来。心智+" +
                P_FIN_MENTAL +
                "。",
              "good",
            );
          },
        },
        {
          text: "🧾 先记着，暂时不折腾",
          apply: function (st) {
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (st.flags) st.flags._f198FinanceGlassCooldown = true;
            msgR198("账记清楚了，心就定了。心智+2。", "info");
          },
        },
      ],
      probability: 0.045,
    },

    // ===== F→B：用手机把市井日常拍成手账 ↔ 事件/叙事（界面记录→人生叙事回望） =====
    {
      id: "f198_life_scrapbook",
      title: "给日子，做个能翻回去的手账",
      desc:
        "你开始随手拍：楼下的豆浆摊、加班后空荡的地铁、台风天窗外的雨。零碎的画面攒进一个相册，" +
        "某天深夜翻看，竟被自己逗笑了——原来那些将就的日子，也有细碎的光。\n\n" +
        "你意识到，记录本身，就是一种把漂泊活成生活的方式。",
      phase: "street",
      triggers: { minDay: 30 },
      conditions: function (st) {
        if (!st || !st.player || !st.needs || !st.flags) return false;
        if (st.flags._f198ScrapbookCooldown) return false;
        return true;
      },
      choices: [
        {
          text: "📸 把这份记录习惯坚持下来",
          apply: function (st) {
            // B域桥接：界面化的生活记录 → 叙事回望的心智/心情回馈（事件域的「人生故事」主题）
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + P_SCRAP_MENTAL);
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + P_SCRAP_HAPPY);
            if (st.flags) {
              st.flags._f198Scrapbook = true; // 生活记录记忆 flag（B域叙事事件可消费）
              st.flags._f198ScrapbookCooldown = true;
            }
            msgR198(
              "会记录的人，从不真正孤独。心智+" +
                P_SCRAP_MENTAL +
                "，心情+" +
                P_SCRAP_HAPPY +
                "。",
              "good",
            );
          },
        },
        {
          text: "📭 偶尔拍拍就好，不刻意",
          apply: function (st) {
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (st.flags) st.flags._f198ScrapbookCooldown = true;
            msgR198("随手一拍也是生活。心情+2。", "info");
          },
        },
      ],
      probability: 0.045,
    },

    // ===== F→H：把路演/周报材料做得清爽有力 ↔ 公司/创业（界面质感→经营技能+资源） =====
    {
      id: "f198_board_deck",
      title: "你的材料，一眼就让人看懂",
      desc:
        "季度复盘前，你没堆页数，而是把杂乱的图表重做成一套清爽的逻辑：问题、数据、动作，三栏分明。" +
        "汇报那天，主管只看了一页就点头：「后面不用讲了，我信你的判断。」\n\n" +
        "你忽然懂了：把复杂的东西讲简单，本身就是一种稀缺的经营能力。",
      phase: "corporate",
      triggers: { minDay: 110 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._f198BoardDeckCooldown) return false;
        // 须处于公司/职场语境（真实字段）
        var inCorp =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        if (!inCorp) return false;
        return true;
      },
      choices: [
        {
          text: "📐 把这套表达方法固化成自己的招牌",
          apply: function (st) {
            // H域桥接：界面/表达质感 → 真实经营/管理技能（management 为公司 KPI 真实技能键）
            if (typeof addSkillXp === "function") addSkillXp("management", P_DECK_XP);
            // 材料增色换来的绩效/资源落袋（state.resources.cash 真实字段）
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + P_DECK_CASH;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.flags) st.flags._f198BoardDeckCooldown = true;
            msgR198(
              "把事讲清楚，比把事做复杂更难。管理经验+" +
                P_DECK_XP +
                "，绩效+" +
                P_DECK_CASH +
                "。",
              "good",
            );
          },
        },
        {
          text: "🙌 这次成了就好，不立招牌",
          apply: function (st) {
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (st.flags) st.flags._f198BoardDeckCooldown = true;
            msgR198("你淡然收起电脑。有些底气，不必张扬。心智+1。", "info");
          },
        },
      ],
      probability: 0.045,
    },
  ];

  for (var i = 0; i < F_EVENTS_R198.length; i++) {
    var evt = F_EVENTS_R198[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions)
      evt.conditions = function () {
        return false;
      };
    RANDOM_EVENTS.push(evt);
  }
})();
