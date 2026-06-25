/**
 * 世界叙事注册表 (NARRATIVES Registry) — 百科自更新源
 *
 * 同 mechanics_registry.js 套路：每条世界事件链/系统叙事一份结构化条目，
 * 渲染走 wiki.js 的 _renderWikiEntry 通用渲染器。
 *
 * 新增叙事：本文件追加 NARRATIVES.<id> = {...} 即可，无需碰 wiki.js。
 */

(function () {
  if (typeof window === "undefined") return;
  window.NARRATIVES = window.NARRATIVES || {};

  // ============================================================
  //  四层新闻生态
  // ============================================================
  NARRATIVES.news_4layer = {
    id: "news_4layer",
    name: "四层新闻生态",
    icon: "📰",
    brief: "L1 国际/L2 国内/L3 城市/L4 街头",
    related: ["mechanics:city_pulse", "narrative:news_cascade"],
    sections: [
      {
        kind: "desc",
        text: "新闻是世界与玩家对话的主渠道，从宏观到微观完整传导。",
      },
      {
        kind: "table",
        headers: ["层级", "类型", "频率", "影响"],
        rows: [
          [
            "L1 国际",
            "地缘冲突/制裁/科技封锁",
            "15~30 天",
            "大宗商品/股市板块",
          ],
          [
            "L2 国内",
            "行业整顿/楼市调控/最低工资",
            "10~20 天",
            "工作收入/房产/职位开放",
          ],
          [
            "L3 城市",
            "拆迁/地铁/招商/节日季",
            "5~10 天",
            "地点客流/摆摊 heat/特定商品需求",
          ],
          [
            "L4 街头",
            "邻里纠纷/八卦/工友传言",
            "1~3 天",
            "NPC 好感/局部价格扰动",
          ],
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p class="wiki-tip">💡 通过 ' +
            _wkLink("mechanics", "city_pulse", "城市脉搏") +
            " 系统，新闻实时影响行动收益。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  新闻级联
  // ============================================================
  NARRATIVES.news_cascade = {
    id: "news_cascade",
    name: "新闻级联",
    icon: "🪜",
    brief: "L1 → L2 滚雪球（10 个事件）",
    related: ["narrative:news_4layer"],
    sections: [
      {
        kind: "desc",
        text: "10 个重大宏观事件会在 N 天后产生连锁后续：",
      },
      {
        kind: "list",
        items: [
          "📉 降息 → 楼市回暖（5 天后）",
          "📈 加息 → 楼市降温（5 天后）",
          "🌍 地缘危机 → 黄金/石油持续上涨（3 天后）",
          "🤖 AI 热潮 → 算力短缺溢价（4 天后）",
          "💎 加密牛市 → 山寨币轮动（3 天后）",
          "📉 加密崩盘 → 杠杆爆仓潮（2 天后）",
          "⚡ 能源危机 → 制造业成本上行（5 天后）",
          "🔥 黑天鹅 → 全市场恐慌（7 天后）",
          "💥 贸易战 → 国产替代崛起（10 天后）",
          "🛵 平台补贴大战 → 骑手寒冬（8 天后）",
        ],
      },
      {
        kind: "tip",
        text: "提前预判 L2 后续，可以在投资市场上获得超额收益。",
      },
    ],
  };

  // ============================================================
  //  有梗世界事件
  // ============================================================
  NARRATIVES.world_events = {
    id: "world_events",
    name: "有梗世界事件",
    icon: "🎬",
    brief: "5 条事件链（补贴大战/收购反噬/黑马冲击/创始人回购/政策套利）",
    related: ["narrative:event_real_estate", "narrative:event_workplace"],
    sections: [
      {
        kind: "desc",
        text: "5 条多阶段事件链，每条都是一个完整的商业/人生故事。",
      },
      { kind: "subhead", text: "📺 事件清单" },
      {
        kind: "list",
        items: [
          { html: "<b>🛒 网约车补贴大战</b>：临时工种收入暴增→骤降→平台合并" },
          {
            html: "<b>💼 收购反噬</b>：花 ¥80k 收购茶饮 → 经营难 → 被星巴超连锁低价吞掉",
          },
          {
            html: "<b>🐎 行业黑马冲击</b>：深耕 30 天后新模式来袭，All-in 转型 vs 副业 vs 坚守",
          },
          {
            html: "<b>🔁 创始人回购</b>：被 VC 清洗 → 屈辱期 → 老朋友凑钱买回主导权",
          },
          {
            html: "<b>🪟 政策套利窗口</b>：科技园扩建/摊贩持证/餐饮卫生评级，提前消息差",
          },
        ],
      },
      {
        kind: "tip",
        text: "每条事件链需要不同的前置（NPC 好感/天数/资产/职级），多周目可触达不同结局。",
      },
    ],
  };

  // ============================================================
  //  道德困境
  // ============================================================
  NARRATIVES.moral = {
    id: "moral",
    name: "道德困境",
    icon: "⚖️",
    brief: "无绝对正确选项，长期影响声誉",
    reference: "《这是我的战争》",
    related: ["mechanics:history"],
    sections: [
      {
        kind: "desc",
        text: '道德选择没有"绝对正确"，只有代价不同。',
      },
      { kind: "subhead", text: "📋 5+ 经典两难" },
      {
        kind: "list",
        items: [
          "👶 巷子里的孩子（买饭/给钱/装没看见）",
          "🔥 工厂火警（冲进去/打 119/往后退）",
          "📁 工友的秘密（偷偷留证/告诉他/假装没见）",
          "👴 迷路老人（送过去/叫顺风车/指路走了）",
          "🎫 地上的彩票（去兑奖/等人来找）",
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p class="wiki-tip">💡 选择会设置 ' +
            _wkLink("mechanics", "history", "道德 flag") +
            "，长期影响后续事件触发与声誉。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  新游戏+
  // ============================================================
  NARRATIVES.ng_plus = {
    id: "ng_plus",
    name: "新游戏+ 继承",
    icon: "🆕",
    brief: "多周目积累：起始现金/技能/属性",
    sections: [
      {
        kind: "desc",
        text: '胜利或失败后，可选择"新游戏+"继承部分进度。',
      },
      { kind: "subhead", text: "📋 继承内容" },
      {
        kind: "list",
        items: [
          "💰 起始现金：总收入 × 1%（上限 ¥5,000）",
          "🎯 最高技能：水平 × 20%（上限 Lv.20）",
          "📊 最高属性：+10%（最多 +5）",
        ],
      },
      { kind: "tip", text: "让多周目有累积感和新鲜感。" },
    ],
  };

  // ============================================================
  //  事件链：房地产赌局
  // ============================================================
  NARRATIVES.event_real_estate = {
    id: "event_real_estate",
    name: "房地产赌局",
    icon: "🏗️",
    brief: "烂尾传闻→内幕赌局→成功/失败分支",
    related: ["narrative:world_events"],
    sections: [
      {
        kind: "desc",
        text: '参考现实房地产暴雷事件，一条关于"信息不对称"和"赌局抉择"的链式事件。',
      },
      { kind: "subhead", text: "📋 事件流程" },
      {
        kind: "list",
        items: [
          {
            html: "<strong>L1 楼盘烂尾传闻</strong>：城中村听到工友议论，开发商资金链断裂",
          },
          {
            html: "<strong>L2 内幕消息赌局</strong>：前财务透露项目将被低价收购，邀请你参与股票赌局",
          },
          {
            html: "<strong>L3a 成功分支</strong>：收购消息公布，股票暴涨 → 财不外露，被陌生人盯上",
          },
          {
            html: "<strong>L3b 失败分支</strong>：消息是假的 → 钱打水漂，村长债务雪上加霜",
          },
        ],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "全押（¥2000）：60% 概率赚 ¥500~2000，40% 概率全损",
          "小试（¥500）：60% 概率赚 ¥200~700，风险可控",
          "拒绝：获得声誉徽章加成，但错过短期暴利",
        ],
      },
      {
        kind: "tip",
        text: "拒绝内幕交易是道德选择，长期来看声誉徽章会带来稳定加成。",
      },
    ],
  };

  // ============================================================
  //  事件链：内幕交易
  // ============================================================
  NARRATIVES.event_insider = {
    id: "event_insider",
    name: "内幕交易",
    icon: "👂",
    brief: "投资风声→验证→灰色交易→监管调查",
    related: ["mechanics:insider_trading"],
    sections: [
      {
        kind: "desc",
        text: "职场阶段的灰色地带抉择，参考瑞幸咖啡/康美药业等真实案例。",
      },
      { kind: "subhead", text: "📋 事件流程" },
      {
        kind: "list",
        items: [
          {
            html: "<strong>L1 投资圈风声</strong>：茶水间听到创业公司融资消息",
          },
          {
            html: "<strong>L2 验证结果</strong>：确认消息属实，可通过场外期权参与（灰色地带）",
          },
          {
            html: "<strong>L3a 成功分支</strong>：合作如期宣布，股价大涨 → 监管调查，需选择应对策略",
          },
          {
            html: "<strong>L3b 失败分支</strong>：消息是假的 → 钱没了，提供者消失，可能卷入骗局",
          },
        ],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "全仓（¥3000）：70% 概率赚 ¥1000~3000，但成功后面临监管调查",
          "小仓（¥1000）：70% 概率赚 ¥300~900，风险较低",
          "拒绝：安全，获得声誉徽章加成",
          "监管调查阶段：主动说明 > 装不知道 > 销毁记录（风险递减）",
        ],
      },
      {
        kind: "tip",
        text: "⚠️ 内幕交易是违法行为，游戏中提供选择但不鼓励。拒绝是最稳妥的策略。",
      },
    ],
  };

  // ============================================================
  //  事件链：职场陷阱
  // ============================================================
  NARRATIVES.event_workplace = {
    id: "event_workplace",
    name: "职场陷阱",
    icon: "😡",
    brief: "背锅甩锅→穿小鞋/谣言→跳槽/晋升抉择",
    sections: [
      {
        kind: "desc",
        text: '参考大厂甩锅文化和办公室政治，一条关于"尊严 vs 生存"的链式事件。',
      },
      { kind: "subhead", text: "📋 事件流程" },
      {
        kind: "list",
        items: [
          {
            html: "<strong>L1 项目出 bug 被甩锅</strong>：老板点名批评，但你手上有邮件证据",
          },
          {
            html: "<strong>L2a 老板记仇分支</strong>（举证/反驳成功）：核心项目被转走，边缘任务穿小鞋",
          },
          {
            html: "<strong>L2b 同事谣言分支</strong>（忍气吞声）：办公室流言蜚语，同事疏远",
          },
          {
            html: "<strong>L3 猎头 offer</strong>：高薪跳槽 vs 内部晋升 vs 拖延决策",
          },
        ],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "L1 选择：举证（看向上管理+能力）/ 忍气（尊严-15但向上管理+5）/ 硬刚（看能力）",
          "L2a 应对：把边缘项目做出彩（看能力+智力）/ 找 HR（看人缘）/ 准备跳槽",
          "L2b 应对：公开澄清（看人缘）/ 用业绩证明 / 保持沉默（尊严-8）",
          "L3 抉择：跳槽（高薪但清零）/ 留下（晋升但尊严受损）",
        ],
      },
      {
        kind: "tip",
        text: "职场中尊严和 KPI 往往不可兼得，选择取决于你的长期目标。",
      },
    ],
  };
  // ============================================================
  //  春节七天乐
  // ============================================================
  NARRATIVES.spring_festival_event = {
    id: "spring_festival_event",
    name: "春节七天乐",
    icon: "🧨",
    brief: "除夕→初六，连续7天特殊事件链，每天一个抉择",
    sections: [
      {
        kind: "desc",
        text: "每年春节（第20-27天），连续7天触发特殊事件链，每天一个道德/生存抉择。",
      },
      { kind: "subhead", text: "📋 事件流程" },
      {
        kind: "list",
        items: [
          "🏠 除夕：回家还是留下？路费¥300换心情+20，或独自在城中村煮年夜饭",
          "🧧 初一：拜年收红包。花礼钱博更大红包，或在家睡懒觉",
          "👨‍👩‍👧 初二：回娘家/走亲戚。维护人缘 vs 远程视频 vs 下馆子",
          "🔴 初三：赤狗日（不宜外出）。在家学习效率翻倍 / 睡懒觉 / 整理出租屋",
          "💰 初四：迎财神。拜财神博意外之财（30%概率）/ 研究投资 / 散步",
          "🔨 初五：破五开工。找临时工 / 工厂区问活 / 继续休息",
          "🗑️ 初六：送穷神。大扫除 / 还债 / 请朋友吃饭",
        ],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "除夕回家：心情+20 + 疲劳-10，但花¥300（适合现金充裕时）",
          "初三学习：技能经验翻倍，适合有技能可提升的玩家",
          "初四拜财神：30%概率意外之财¥100-300，但香火钱¥50",
          "初六还债：可还掉30%的村长/村债，减轻长期负担",
        ],
      },
      {
        kind: "tip",
        text: "春节事件每年只触发一次，通过弹窗进度条可看到当前是第几天（共7天）。事件选项含资源消耗和属性影响，选择需谨慎。",
      },
    ],
  };

  // ============================================================
  //  公司历史书
  // ============================================================
  NARRATIVES.company_history = {
    id: "company_history",
    name: "公司历史书",
    icon: "📖",
    brief: "记录企业命运变迁：里程碑时间线 + 事件档案",
    related: ["mechanics:enterprise_fate"],
    sections: [
      {
        kind: "desc",
        text: "企业命运系统的核心组件：记录城市中每家公司的完整历史，从创立到IPO或倒闭，形成动态的商业世界。",
      },
      { kind: "subhead", text: "📋 功能入口" },
      {
        kind: "list",
        items: [
          {
            html: "在 🏭 企业命运 Tab 中，点击任意公司的 <strong>「📖 查看公司历史书」</strong> 按钮",
          },
          "弹窗展示该公司的完整历史档案",
        ],
      },
      { kind: "subhead", text: "📋 展示内容" },
      {
        kind: "list",
        items: [
          "基本信息：创始人、CEO特质、企业文化、CEO传记",
          "当前状态：健康度、市场份额、股价、事件总数",
          "里程碑时间线：公司成立、IPO上市、裁员潮、倒闭等关键节点",
          "命运事件记录：产品发布、收购、危机、转型等事件档案",
        ],
      },
      { kind: "subhead", text: "🎨 颜色标记" },
      {
        kind: "list",
        items: [
          {
            html: '<span style="color:#4caf50">🟢 绿色</span>：IPO上市 / 成长里程碑',
          },
          {
            html: '<span style="color:#e74c3c">🔴 红色</span>：倒闭 / 危机事件',
          },
          { html: '<span style="color:#ff9800">🟡 黄色</span>：并购 / 转型' },
          { html: '<span style="color:#4fc3f7">🔵 蓝色</span>：常规事件' },
        ],
      },
      { kind: "subhead", text: "💡 策略价值" },
      {
        kind: "list",
        items: [
          "了解公司历史有助于投资决策（健康度+趋势判断）",
          "就职前了解公司文化，判断是否适合自己",
          "多周目继承：已倒闭公司的历史依然可查",
        ],
      },
      {
        kind: "tip",
        text: "只有就职过或购买过股票的公司才会解锁详情，否则显示模糊信息。",
      },
    ],
  };

  // ============================================================
  //  节日成就
  // ============================================================
  NARRATIVES.festival_achievements = {
    id: "festival_achievements",
    name: "节日成就",
    icon: "🎭",
    brief: "春节/劳动节/中秋/国庆/剁手节专属成就",
    sections: [
      {
        kind: "desc",
        text: "参与城市节日活动解锁专属成就，记录你在每个节日里的选择和经历。",
      },
      { kind: "subhead", text: "🧨 春节成就（除夕→初六）" },
      {
        kind: "list",
        items: [
          "🏠 除夕团圆：除夕夜买票回家，与家人团圆",
          "🧧 红包达人：大年初一去拜年，收到红包净赚",
          "📚 赤狗日学霸：初三赤狗日选择在家学习技能",
          "💰 迎财神：初四去庙里拜财神，求好运",
          "🔨 破五开工：初五选择找临时工开工",
          "🗑️ 送穷神：初六选择还债，减轻财务负担",
          "🧨 春节全勤：春节7天全部参与事件",
        ],
      },
      { kind: "subhead", text: "🛒 剁手节成就" },
      {
        kind: "list",
        items: [
          "📦 剁手节进货王：剁手节期间累计进货超过¥5000",
          "🛒 剁手节清空购物车：剁手节期间通过摆摊赚取超过¥3000",
        ],
      },
      { kind: "subhead", text: "🔨 劳动节成就" },
      {
        kind: "list",
        items: ["🔨 劳动节加班王：劳动节当天选择工作（节日促销员）"],
      },
      { kind: "subhead", text: "🥮 中秋节成就" },
      {
        kind: "list",
        items: ["🥮 月圆人团圆：中秋节当天给NPC送礼"],
      },
      { kind: "subhead", text: "🎉 国庆节成就" },
      {
        kind: "list",
        items: ["🎉 黄金周导游：国庆节当天在公园做导游志愿者工作"],
      },
      { kind: "subhead", text: "🎭 节日综合成就" },
      {
        kind: "list",
        items: ["🎭 节日达人：参与过至少3个不同节日的活动"],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "春节成就需逐天参与，建议提前准备现金（回家¥300、拜年¥100、拜财神¥50）",
          "剁手节：预热期（3天前）去批发市场囤货，节日当天去商业区摆摊",
          "中秋节：提前准备月饼等礼品，节日当天找NPC送礼",
          "劳动节/国庆节：节日限定工作收入高，适合缺钱时选择",
        ],
      },
      {
        kind: "tip",
        text: "节日成就每年只触发一次，错过要等下一年。成就解锁后永久记录在成就档案中。",
      },
    ],
  };

  // ====== [v3.3 W1-T6] 前世记忆 ======
  function _getCurState() {
    try {
      return typeof StateManager !== "undefined" && StateManager.getState
        ? StateManager.getState()
        : null;
    } catch (e) {
      return null;
    }
  }
  function _pastLifeSections() {
    var s = _getCurState();
    var f = (s && s.flags) || {};
    var pathLabel = {
      grind: "再卷职场",
      civil: "备考公",
      lie_flat: "摆烂躺平",
      exam: "备考公",
      career: "再卷职场",
      lieflat: "摆烂躺平",
    };
    var path = f._prevCrisis35Path || f._crisis35Path;
    var moralScore =
      typeof f._prevMoralScore === "number" ? f._prevMoralScore : null;
    var peakAffMap = f._prevPeakAffinity || {};
    var ribbons = [];
    try {
      if (typeof getCollectedRibbons === "function") {
        ribbons = getCollectedRibbons() || [];
      }
    } catch (e) {}
    var coinBal = 0,
      unlocks = [];
    try {
      if (typeof getHeritageBalance === "function")
        coinBal = getHeritageBalance() || 0;
      if (typeof getHeritageShop === "function") {
        var sh = getHeritageShop();
        unlocks = (sh.unlocks || []).filter(function (u) {
          return u.unlocked;
        });
      }
    } catch (e) {}

    var lines = [];
    if (path) {
      lines.push(
        "🌗 35 岁那年，你选择了——【" +
          (pathLabel[path] || path) +
          "】。这条路在你身上留下了痕迹。",
      );
    } else {
      lines.push("🌗 你还未跨过 35 岁的分水岭，或上一世没留下选择的记录。");
    }
    if (moralScore !== null) {
      var ml =
        moralScore >= 10
          ? "前世善人，业力正向"
          : moralScore >= 0
            ? "前世清白，无功无过"
            : moralScore >= -5
              ? "前世小恶，欠了点债"
              : "前世恶人，业力反噬";
      lines.push("⚖ 前世道德净分：" + moralScore + "（" + ml + "）");
    }
    var peakCount = Object.keys(peakAffMap).length;
    if (peakCount > 0) {
      lines.push(
        "❤ 上一世你与 " +
          peakCount +
          " 位 NPC 建立过深厚情谊（好感曾≥50），他们这一世会记得你的脸。",
      );
    }
    var ribbonNames = (ribbons || []).slice(0, 6).map(function (r) {
      return (r.icon || "🎀") + " " + (r.name || r.id);
    });
    if (ribbonNames.length > 0) {
      lines.push(
        "🎗 已收集人生缎带：" +
          ribbonNames.join("、") +
          (ribbons.length > 6 ? " 等" : ""),
      );
    }
    lines.push("🪙 累计传承币：" + coinBal + "（在主菜单→传承商店消费）");
    if (unlocks.length > 0) {
      lines.push(
        "🏛 已解锁传承：" +
          unlocks
            .map(function (u) {
              return (u.icon || "") + u.name;
            })
            .join("、"),
      );
    }

    return [
      {
        kind: "desc",
        text: "前世的记忆不是直接传给你，而是化作血脉里的某种倾向、某些熟悉的脸孔、和命运暗中的偏袒。这一页记录的，是你前世留下的痕迹。",
      },
      { kind: "subhead", text: "📜 前世的印记" },
      { kind: "list", items: lines },
      {
        kind: "tip",
        text: "传承机制涉及：35岁路径加成、道德净分→幸运、NPC老熟人解锁、人生缎带、传承币与红/绿互斥解锁。重开新档时全部自动结算。",
      },
    ];
  }
  NARRATIVES.past_life = {
    id: "past_life",
    name: "前世记忆",
    icon: "🕯",
    brief: "上一周目你留下的痕迹——选择、道德、人情、缎带。",
    version: "v3.3",
    related: ["mechanics:heritage_coin", "narratives:life_ribbon"],
    sections: _pastLifeSections,
  };
})();
