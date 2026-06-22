/**
 * 机制注册表 (MECHANICS Registry) — 百科自更新源
 *
 * 设计目标：
 *   每个游戏机制一份结构化条目；新增/调参一处改动，百科自动反映。
 *
 * 用法（推荐顺序）：
 *   1) 机制实现文件（如 phase1/critical.js）末尾追加：
 *        window.MECHANICS = window.MECHANICS || {};
 *        MECHANICS.<id> = { ...schema };
 *      —— 让"实现 + 文档"住在同一文件，调阈值时百科一并更新。
 *   2) 跨文件 / 纯说明性机制（如 ap、stat_link）放在本文件下方。
 *
 * Schema：
 *   MECHANICS[id] = {
 *     id:       string                  // 必填，与 _wikiState.entryId 对齐
 *     name:     string                  // 列表名 / 详情 H2
 *     icon:     string                  // emoji，可选
 *     brief:    string                  // 列表副标题（一行）
 *     version:  string                  // 'v1.1.0' → 自动 "新增" 徽章，可选
 *     reference: string                 // 灵感来源（《XX》），可选
 *     related:  string[]                // ['mechanics:illness_system','amenities:*']
 *     sections: Section[]               // 顺序渲染
 *   }
 *
 *   Section.kind:
 *     'desc'     { text: string | (state)=>string }
 *     'subhead'  { text: string }
 *     'list'     { items: string[] | {html:string}[] | (state)=>... }
 *     'tip'      { text: string | (state)=>string }
 *     'table'    { headers: string[], rows: any[][] | (state)=>... }
 *     'html'     { get: (state)=>string }   // 转义入口；务必自行 _wkE
 *
 *   item 为字符串 → 自动转义；为 {html: '...'} → 原样输出（用于嵌入 _wkLink）。
 *
 * 渲染入口：renderMechanicEntry(state, id) ── 在 wiki.js 内定义。
 */

(function () {
  if (typeof window === "undefined") return;
  window.MECHANICS = window.MECHANICS || {};

  // ============================================================
  //  ap — 行动力系统（跨文件、放在注册表）
  // ============================================================
  MECHANICS.ap = {
    id: "ap",
    name: "行动力 (AP)",
    icon: "⚡",
    brief: "100 AP/天，倍率系统，低 AP 预警",
    sections: [
      {
        kind: "desc",
        text: "每天 100 AP（满）。所有行动消耗对应 AP（卡片右下显示），AP 耗尽自动 endDay。",
      },
      { kind: "subhead", text: "📊 关键规则" },
      {
        kind: "list",
        items: [
          "大多数街头工作 ⚡15~38 AP",
          "训练技能、做饭、洗澡 ⚡10~15 AP",
          "跨地点出行 ⚡15 AP（驾驶 ≥20 级减免）",
          "极端状态（饿晕/过劳/病危）会跳过当天",
          "AP ≤ 20 时顶部和侧栏闪烁预警",
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            "<h3>🔢 AP 倍率</h3>" +
            "<p>实际 AP 消耗 = 基础 × 倍率（保底 0.5×，封顶 2.5×）。详见 " +
            _wkLink("mechanics", "stat_link", "状态互联") +
            "。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  stat_link — 状态互联（多米诺）
  // ============================================================
  MECHANICS.stat_link = {
    id: "stat_link",
    name: "状态互联",
    icon: "🔗",
    brief: "饥饿/疲劳/心情多米诺，AP 倍率",
    reference: "《这是我的战争》《模拟人生》",
    related: ["mechanics:ap", "mechanics:critical_needs"],
    sections: [
      {
        kind: "desc",
        text: "一个状态崩塌引发连锁反应。",
      },
      { kind: "subhead", text: "🍞 状态多米诺（每日结算）" },
      {
        kind: "list",
        items: [
          "饥饿 < 30 → +5 疲劳/天",
          "饥饿 < 15 → +8 疲劳/天 + 心情 -5/天",
          "疲劳 > 70 → 心情 -3/天",
          "疲劳 > 85 → 心情 -5/天 + 卫生 -3/天",
          "卫生 < 20 → 心情 -3/天",
          "心情 < 20 → 睡眠效率 ×0.5",
          "生病 → +8 疲劳/天 + 心情 -5",
        ],
      },
      { kind: "subhead", text: "📊 状态 → 属性修正（实时）" },
      {
        kind: "desc",
        text: "例如：饥饿 < 15 → 体质 ×0.85, 敏捷 ×0.75；健康 < 30 → 全维度打折。详见侧边栏「实际有效值」。",
      },
      { kind: "subhead", text: "⚡ AP 倍率加成" },
      {
        kind: "list",
        items: [
          "疲劳 70~85 +0.20；85~95 +0.45；>95 +0.80",
          "饥饿 < 20 +0.30；< 10 +0.50",
          "生病 +0.50，受伤 +0.30",
          "极端天气 +0.15~0.20",
          "敏捷 > 50 -0.10；> 75 -0.20（最大减免）",
        ],
      },
    ],
  };

  // 简单技能名映射（仅在 wiki 需要中文化）
  var _SKILL_LABEL = {
    cooking: "烹饪",
    sales: "销售",
    repair: "维修",
    english: "英语",
    driving: "驾驶",
    coding: "编程",
    management: "管理",
    accounting: "会计",
    electrician: "电工",
    welding: "焊接",
  };

  // ============================================================
  //  synergy — 技能协同
  //  数据源：phase1/skill_bonuses.js 的 SKILL_SYNERGIES（不重复定义）
  // ============================================================
  MECHANICS.synergy = {
    id: "synergy",
    name: "技能协同",
    icon: "🔀",
    brief: "若干技能组合达门槛 → 相关工作收入加成",
    related: ["skills:cooking", "mechanics:streak"],
    sections: [
      {
        kind: "desc",
        text: "两个技能同时达到门槛时，相关工作收入持续提升。",
      },
      {
        kind: "subhead",
        text: "📋 协同组合（直接读 SKILL_SYNERGIES 数组）",
      },
      {
        kind: "list",
        items: function () {
          if (typeof SKILL_SYNERGIES === "undefined") return [];
          return SKILL_SYNERGIES.map(function (s) {
            var reqHtml = Object.keys(s.skills || {})
              .map(function (k) {
                return (
                  _wkLink("skills", k, _SKILL_LABEL[k] || k) +
                  " ≥Lv." +
                  s.skills[k]
                );
              })
              .join(" + ");
            var pct =
              typeof s.jobBonus === "number"
                ? " → +" + Math.round(s.jobBonus * 100) + "%"
                : "";
            return {
              html: "<b>" + _wkE(s.label || s.id) + "</b>：" + reqHtml + pct,
            };
          });
        },
      },
      {
        kind: "tip",
        text: "多个协同可叠加。在 📚 技能 Tab 底部可查看激活情况。",
      },
    ],
  };

  // ============================================================
  //  streak — 熟练工连击
  //  数据源：main.js 内联阶梯（未来若抽出常量，将自动反映）
  // ============================================================
  MECHANICS.streak = {
    id: "streak",
    name: "熟练工连击",
    icon: "🔥",
    brief: "连续 3/5/7 天同一工作 +5%/+10%/+15%",
    sections: [
      {
        kind: "desc",
        text: "连续 N 天做同一份工作，习得熟练度，收入递增。",
      },
      { kind: "subhead", text: "📊 加成阶梯" },
      {
        kind: "list",
        items: ["连续 3 天 → +5%", "连续 5 天 → +10%", "连续 7 天 → +15%"],
      },
      {
        kind: "tip",
        text: "中断当天就归零。在工作卡片下方的 tag 行可看到连击状态。",
      },
    ],
  };

  // ============================================================
  //  cooking_system — 烹饪系统
  // ============================================================
  MECHANICS.cooking_system = {
    id: "cooking_system",
    name: "烹饪系统",
    icon: "🍳",
    brief: "食材 → 菜品；烹饪技能Lv.1-10；菜品提供临时Buff",
    version: "1.2.0",
    reference: "《Stardew Valley》《模拟人生》",
    related: ["items:ingredients", "mechanics:inventory"],
    sections: [
      {
        kind: "desc",
        text: "通过烹饪将食材转化为菜品，获得饱食恢复和临时效果。烹饪技能随烹饪次数提升，解锁更多食谱。",
      },
      { kind: "subhead", text: "📊 食材分类" },
      {
        kind: "list",
        items: [
          "主食类：大米、面粉、面条、土豆",
          "蔬菜类：青菜、白菜、萝卜、番茄、黄瓜",
          "肉类：猪肉、牛肉、鸡肉、鱼",
          "调料类：盐、酱油、油、糖、辣椒",
          "蛋奶类：鸡蛋、牛奶",
        ],
      },
      { kind: "subhead", text: "🔄 食材保鲜" },
      {
        kind: "list",
        items: [
          "常温：按食材标注的天数",
          "冰箱（自住房）：+5天",
          "冷冻（自住房）：+15天",
        ],
      },
      { kind: "subhead", text: "📈 烹饪技能" },
      {
        kind: "list",
        items: [
          "Lv.1：初始食谱（白米饭、番茄炒蛋等）",
          "Lv.2-5：家常菜（红烧牛肉、鸡汤等）",
          "Lv.6-8：高级料理（海鲜粥、火锅等）",
          "Lv.9-10：满汉全席/人生盛宴（全属性Buff）",
        ],
      },
      { kind: "subhead", text: "💡 提示" },
      {
        kind: "tip",
        text: "在家做饭（amenity）会消耗食材。烹饪技能越高，解锁的食谱越强力。",
      },
    ],
  };

  // ============================================================
  //  critical_needs — 状态危机系统
  // ============================================================
  MECHANICS.critical_needs = {
    id: "critical_needs",
    name: "状态危机系统",
    icon: "⚠️",
    brief: "饥饱/疲劳/卫生/心情低于阈值时强制选择，延期按阶梯式累积惩罚",
    reference: "《大多数》",
    related: ["amenities:*", "mechanics:illness_system"],
    sections: [
      {
        kind: "desc",
        text: "四大状态（饥饱/疲劳/卫生/心情）跌破阈值时，游戏强制玩家做出选择，而非任你慢慢死。",
      },
      { kind: "subhead", text: "📉 触发阈值" },
      {
        kind: "list",
        items: [
          "🍚 饥饱 ≤ 12 — 再不吃要饿晕",
          "😴 疲劳 ≥ 88 — 累得快倒下",
          "🛁 卫生 ≤ 10 — 脏到要生病",
          "😊 心情 ≤ 10 — 抑郁到崩溃",
        ],
      },
      { kind: "subhead", text: "🪟 弹窗选项" },
      {
        kind: "html",
        get: function () {
          return (
            "<p>系统列出周边最近的 3 个对应类型 " +
            _wkLink("amenities", null, "恢复点") +
            "（含旅行 AP），玩家可：</p>" +
            '<ul class="wiki-list">' +
            "<li><strong>立即去 XX</strong>：自动旅行 + 消费 + 补充状态</li>" +
            "<li><strong>后续自己再去</strong>：标记延期，今天结束时若仍未恢复，按阶梯式惩罚累积后果</li>" +
            "</ul>"
          );
        },
      },
      {
        kind: "subhead",
        text: "📊 延期惩罚阶梯（1.2 起改为阶梯式，非随机掷骰）",
      },
      {
        kind: "list",
        items: [
          "🍚 <strong>饥饱</strong>：第1次健康-3 / 第2次健康-8+概率肠胃炎 / 第3次饿晕（健康-15） / 第4次+送医急救",
          "😴 <strong>疲劳</strong>：第1次疲劳+5 / 第2次疲劳+15+概率过劳/失眠 / 第3次过劳晕倒 / 第4次+强制住院",
          "🛁 <strong>卫生</strong>：第1次心情-3 / 第2次概率患病+名气-1 / 第3次强制患病 / 第4次+多重感染",
          "😊 <strong>心情</strong>：第1次心情-5+疲劳+10 / 第2次心情-10+抑郁计数+3 / 第3次整夜失眠 / 第4次+概率重度抑郁",
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            "<p>详见 " +
            _wkLink("mechanics", "illness_system", "疾病系统") +
            "。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  illness_system — 疾病系统
  // ============================================================
  MECHANICS.illness_system = {
    id: "illness_system",
    name: "疾病系统",
    icon: "🤒",
    brief: "长期不良习惯 → 命名疾病；药店/医院两档治疗",
    related: ["illnesses:*", "mechanics:critical_needs"],
    sections: [
      {
        kind: "desc",
        text: "长期不良习惯 → 命名疾病。每种病有触发条件、症状、治疗方式，可同时患多种。",
      },
      { kind: "subhead", text: "📊 习惯追踪器" },
      {
        kind: "desc",
        text: "每日结算时根据 needs 更新计数器：",
      },
      {
        kind: "list",
        items: [
          "junkFoodMeals：累计垃圾食品次数",
          "lowHungerStreak：连续饥饱 <25 天数",
          "lowHygieneStreak：连续卫生 <30 天数",
          "lowHappinessStreak：连续心情 <20 天数",
          "highFatigueStreak：连续疲劳 >80 天数",
          "lateNightActions：累计夜生活次数",
        ],
      },
      { kind: "subhead", text: "💊 治疗" },
      {
        kind: "desc",
        text: '去医院找"看病"行动，每种病有两档：',
      },
      {
        kind: "list",
        items: [
          "药店：便宜，标记 treated=true，自然康复时间减半",
          "医院：贵，立即康复",
          "慢性病（高血压）：必须按月持续付费才不发作",
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            "<p>查看具体病种：" +
            _wkLink("illnesses", null, "疾病图鉴") +
            "。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  city_pulse — 城市脉搏联动
  // ============================================================
  MECHANICS.city_pulse = {
    id: "city_pulse",
    name: "城市脉搏",
    icon: "🌆",
    brief: "新闻 → 地点客流/工作收入实时联动",
    sections: [
      {
        kind: "desc",
        text: "活跃新闻派生为地点客流量、工作收入倍率和今日建议。新闻不再只是文字，而是“今天最优行动是什么”。",
      },
      { kind: "subhead", text: "📋 主要规则（10+ 种）" },
      {
        kind: "list",
        items: [
          "🚨 城管严查 → 摆摊客流 -35%，外卖 +8%",
          "🛵 平台补贴 → 外卖骑手 +25%，餐饮摊 -8%",
          "🏚️ 旧改施工 → 工地/清运/维修需求暴涨",
          "🤖 AI 热潮 → 科技园数据/客服/写作 +12~18%",
          "🤒 流感高峰 → 医院护工 +35%，餐饮 -8%",
          "🎒 开学旺季 → 大学城快递/家教 +18%",
          "📈 通胀压力 → 批发周转/银行储蓄相对受益",
        ],
      },
      {
        kind: "tip",
        text: "在行动卡的 payTags 行可看到今天哪些维度在影响收入。",
      },
    ],
  };

  // ============================================================
  //  intel — 街头情报网
  // ============================================================
  MECHANICS.intel = {
    id: "intel",
    name: "街头情报网",
    icon: "📡",
    brief: "高好感 NPC 提前透露新闻",
    related: ["mechanics:npc_affinity"],
    sections: [
      {
        kind: "desc",
        text: "高好感 NPC 会向你透露即将发生的新闻，让你提前布局。",
      },
      { kind: "subhead", text: "📋 工作流" },
      {
        kind: "list",
        items: [
          "NPC 好感 ≥30 → 解锁「向 TA 打听消息」行动",
          "不同 NPC 提供不同情报：王大婶（旧改/房产）、李工头（工地）、张姐（平台补贴）、老周（科技/废品）、小美（科技股/AI）、陈师傅（餐饮/医疗）",
          "情报写入 _pendingIntelNews，N 天后兑现成真实新闻",
          "心智越高，情报可信度展示越精确",
        ],
      },
      {
        kind: "tip",
        text: "信息差 = 钱。提前几天买入相关投资资产可大幅获利。",
      },
    ],
  };

  // ============================================================
  //  history — 历史声誉系统
  // ============================================================
  MECHANICS.history = {
    id: "history",
    name: "历史声誉",
    icon: "📜",
    brief: "道德选择 7 种 flag 长期影响",
    sections: [
      {
        kind: "desc",
        text: "道德选择不只是当下加减分，而是 7 种长期 flag 持续影响游戏。",
      },
      { kind: "subhead", text: "📋 道德 flag 列表" },
      {
        kind: "list",
        items: [
          "💼 _walletKarmaGood：还回钱包 → 幸运 +5（避免某些坏事件）",
          "🤝 _helpedCoworker：帮过工友 → 工作收入 ×1.03",
          "🛡️ _refusedFakeGoods：拒绝假货 → 进货 9.8 折",
          "⚖️ _foughtWageTheft：维权欠薪 → 工作收入 ×1.04",
          "✨ _honestyCompound：综合声誉 → ×1.06 + 9.4 折 + 名声标签",
          "🚩 _laborOrganizer：劳工组织者 → 工作收入 ×1.08 + 好感 +2",
          "📋 _hasBusinessLicense：拿到执照 → 工作收入 ×1.10",
        ],
      },
      { kind: "tip", text: "侧边栏会动态显示已获声誉徽章。" },
    ],
  };

  // ============================================================
  //  edu — 学历系统
  // ============================================================
  MECHANICS.edu = {
    id: "edu",
    name: "学历系统",
    icon: "🎓",
    brief: "大专 → 本科 → 研究生",
    related: ["jobs:tutoring"],
    sections: [
      {
        kind: "desc",
        text: "大专（默认）→ 本科（自考）→ 研究生。学历是某些工作和职场入职的硬门槛。",
      },
      { kind: "subhead", text: "📋 自考流程" },
      {
        kind: "list",
        items: [
          "📖 备考（⚡20 AP）：每次 +1 学习点，需要积累一定点数才能考试",
          "📝 参加考试（⚡30 AP）：通过率 = 40% + mental×0.4% + intelligence×0.1%",
          "🎓 考过 6 次 → 在培训中心申请本科认证（需⚡30AP）",
        ],
      },
      { kind: "subhead", text: "📊 学历影响的工作" },
      {
        kind: "html",
        get: function () {
          return (
            "<p>如：" +
            _wkLink("jobs", "tutoring", "家教") +
            " 需本科；科技园 4 个白领工作需本科起。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  dream — 梦想追踪系统
  // ============================================================
  MECHANICS.dream = {
    id: "dream",
    name: "梦想追踪",
    icon: "💭",
    brief: "5 类目标 × 5 里程碑",
    sections: [
      {
        kind: "desc",
        text: "5 类人生目标 × 5 个里程碑，每达成一个会触发专属叙事文本。",
      },
      { kind: "subhead", text: "📋 5 类梦想" },
      {
        kind: "list",
        items: [
          "🍜 开一家餐馆（烹饪/存款/合规）",
          "🏠 买一套房（首付/房贷/还清）",
          "✈️ 出国看世界（英语/护照/启程）",
          "💰 投资达人（首笔/百万/千万）",
          "🌟 城市名人（名气/曝光/影响力）",
        ],
      },
      {
        kind: "tip",
        text: "在街头阶段使用「确立人生目标」行动设定梦想；侧边栏显示当前进度。",
      },
    ],
  };

  // ============================================================
  //  festival_link — 节日联动机制
  // ============================================================
  MECHANICS.festival_link = {
    id: "festival_link",
    name: "节日联动",
    icon: "🎉",
    brief: "价格修正/限定工作/NPC 台词",
    related: ["festivals:*"],
    sections: [
      {
        kind: "desc",
        text: "6 个节日全方位影响游戏：价格 / 工作 / NPC 台词 / 心情 / 摆摊客流。",
      },
      { kind: "subhead", text: "📋 联动维度" },
      {
        kind: "list",
        items: [
          "💰 价格修正：食品/奢侈品节日涨，电子/服装促销期降",
          "🎪 限定工作：年货推广员/月饼配送/景区导游等",
          "👥 NPC 节日台词：6 个 NPC × 5 个节日 = 30 条专属台词",
          "😊 心情加成：每日 +3~8",
          "🛒 客流量：剁手节 ×2.5，国庆 ×1.3",
        ],
      },
      { kind: "tip", text: "节日开始前 3 天会公告，可提前囤货/换工作。" },
    ],
  };

  // ============================================================
  //  weather_link — 天气联动机制（天气深化系统 v2）
  // ============================================================
  MECHANICS.weather_link = {
    id: "weather_link",
    name: "天气联动",
    icon: "☂️",
    brief: "13种天气全方位影响：收入/疲劳/心情/AP/旅行/疾病",
    sections: [
      {
        kind: "desc",
        text: "天气深化系统 v2：极端天气持续多天、3天天气预报、温度体感、舒适度、旅行AP修正、天气诱发疾病。",
      },
      { kind: "subhead", text: "📊 普通天气影响" },
      {
        kind: "list",
        items: [
          "☀️ 晴天：室外 ×1.0，心情 +5，客流量高",
          "⛅ 多云：室外 ×0.95，客流量稍降",
          "🌧️ 小雨：室外 ×0.75，疲劳 +8，心情 -5，客流量↓",
          "⛈️ 暴雨：室外 ×0.40，疲劳 +15，旅行AP×1.25",
          "🌬️ 大风：室外 ×0.80，疲劳 +5，心情 -3",
          "❄️ 下雪：室外 ×0.30，疲劳 +10，旅行AP×1.5",
          "🌫️ 雾霾：室外 ×0.85，疲劳 +3，心情 -5，旅行AP×1.3",
        ],
      },
      { kind: "subhead", text: "🔥 极端天气（持续多天）" },
      {
        kind: "list",
        items: [
          "🥵 高温预警：持续3-5天，疲劳+10，旅行AP×1.1，中暑风险↑",
          "🥶 寒潮：持续2-3天，室外×0.5，旅行AP×1.15，感冒风险↑",
          "😷 重度雾霾：持续2-3天，健康-2，旅行AP×1.35，呼吸道疾病↑",
          "🌀 台风：持续1-2天，室外停工，旅行AP×2.0，安全风险",
          "🌪️ 沙尘暴：持续1-2天，健康-3，旅行AP×1.5，呼吸道疾病↑",
          "🌧️ 梅雨季：持续3-5天，疲劳+8/天，食物易发霉，旅行AP×1.1",
        ],
      },
      { kind: "subhead", text: "📅 天气预报" },
      {
        kind: "desc",
        text: "每日生成未来3天天气预报：第1天准确率85%、第2天65%、第3天45%。极端天气持续期内预报偏向继续持续。",
      },
      { kind: "subhead", text: "🏥 天气诱发疾病" },
      {
        kind: "desc",
        text: "极端天气有概率诱发对应疾病。健康越低、体质越差的角色风险越高（最高翻3倍），高体质几乎免疫。",
      },
      { kind: "subhead", text: "🌍 地点×天气联动" },
      {
        kind: "desc",
        text: "不同地点对天气抗性不同：有遮蔽地点雨天客流量影响小、开阔地点大风雨雪影响大。",
      },
    ],
  };

  // ============================================================
  //  npc_affinity — NPC 好感度系统
  // ============================================================
  MECHANICS.npc_affinity = {
    id: "npc_affinity",
    name: "NPC 好感",
    icon: "💕",
    brief: "30/60/80 阈值奖励 + 委托 + 深度任务",
    reference: "《Stardew Valley》",
    sections: [
      {
        kind: "desc",
        text: "每位 NPC 有 30/60/80 三档奖励 + 委托 + 深度任务。",
      },
      { kind: "subhead", text: "📋 阈值奖励" },
      {
        kind: "list",
        items: [
          "30（熟人）：解锁特殊对话 + 小福利（带饭/废品 tips/提点工作）",
          "60（好友）：独家资源（房租折扣/秘密渠道/猎头）",
          "80（挚友）：稀有机会（介绍奖金/秘方/支教/天使投资）",
        ],
      },
      { kind: "subhead", text: "📜 委托 vs 深度任务" },
      {
        kind: "list",
        items: [
          "📜 委托（好感 ≥30）：每个 NPC 一个一次性任务，奖励中等",
          "💌 深度任务（好感 ≥70）：叙事性更强的人生选择，奖励大",
        ],
      },
      { kind: "tip", text: "投其所好礼物 +15 好感，生日 ×2，节日 +5~10。" },
    ],
  };

  // ============================================================
  //  vending_footfall — 摆摊客流量综合修正
  // ============================================================
  MECHANICS.vending_footfall = {
    id: "vending_footfall",
    name: "摆摊客流",
    icon: "🛒",
    brief: "位置×天气×节日×周末综合修正",
    related: ["weather:*", "festivals:*"],
    sections: [
      { kind: "desc", text: "摆摊收入 ∝ 基础客流 × 天气 × 节日 × 周末。" },
      { kind: "subhead", text: "📊 影响因素" },
      {
        kind: "list",
        items: [
          "📍 地点基础客流：商业区 1.8（最高）→ 银行 0.4（最低）",
          "☀️ 天气：晴天/暴雨差异巨大",
          "🎉 节日：国庆 ×1.3，剁手节 ×2.5",
          "📅 周末：商业区/公园 +20% 客流",
        ],
      },
      { kind: "tip", text: "行动卡片上显示客流星级（⭐⭐⭐~⭐⭐⭐⭐⭐）。" },
    ],
  };

  // ============================================================
  //  fame_vip — 名气 VIP 行动系统
  // ============================================================
  MECHANICS.fame_vip = {
    id: "fame_vip",
    name: "名气 VIP",
    icon: "⭐",
    brief: "高名气解锁 5 种特殊行动",
    sections: [
      { kind: "desc", text: "高名气解锁 5 种特殊行动（每天限 1 次）：" },
      {
        kind: "list",
        items: [
          "商业区 fame ≥25：本地名人效应（¥50+fame×1.2+随机）",
          "公园 fame ≥20：粉丝认出你（心情 +20）",
          "培训中心 fame ≥40：名人专属指导课（属性 +3）",
          "医院 fame ≥35：VIP 就诊通道（健康 +25）",
          "科技园 fame ≥50：科技论坛演讲（¥200+fame×2.5）",
        ],
      },
      {
        kind: "tip",
        text: "可通过参加 NPC 委托/达成成就/解决重大事件提升名气。",
      },
    ],
  };

  // ============================================================
  //  skill_tree — 技能天赋树
  // ============================================================
  MECHANICS.skill_tree = {
    id: "skill_tree",
    name: "技能天赋树",
    icon: "🌳",
    brief: "30级分支选择、天赋节点激活、职场联动",
    reference: "《中国式家长》",
    sections: [
      {
        kind: "desc",
        text: "每项技能达到 Lv.30 后可选择 2~3 个发展方向，每个分支内嵌 3 个天赋节点。",
      },
      { kind: "subhead", text: "📋 分支选择" },
      {
        kind: "list",
        items: [
          "技能达 Lv.30 后，在技能 Tab 点击「选择发展方向」按钮",
          "每技能有 2~3 个方向可选（编程有前端/后端/安全 3 方向，其余为 2 方向）",
          "选择需消耗 ⚡15AP + ¥200",
          "已选分支可切换（⚡30AP + ¥500），切换后旧天赋节点重置",
        ],
      },
      { kind: "subhead", text: "⭐ 天赋节点" },
      {
        kind: "list",
        items: [
          "每个分支有 3 个天赋节点，分别于 Lv.10 / Lv.25 / Lv.50 解锁",
          "节点有前置依赖，须先激活前置节点才能激活后续",
          "激活消耗 ⚡20~35AP + ¥300~¥1600（节点越深越贵）",
          "效果包括：技能 XP+25%、工作收入加成、新工作解锁、被动收入等",
        ],
      },
      { kind: "subhead", text: "🏢 职场联动" },
      {
        kind: "list",
        items: [
          "编程→后端/前端：晋升 P7 时能力要求 -5（天赋节点额外叠加 -10）",
          "管理→战略规划：晋升 P8 时向上管理要求 -5（叠加 -10）",
          "管理→团队管理：晋升 P8 时人缘要求 -5（叠加 -10）",
        ],
      },
      { kind: "subhead", text: "📊 分支加成总览" },
      {
        kind: "list",
        items: [
          "家常大厨：餐饮收入+25%，食材成本-15%",
          "街头美食家：摆摊收入+30%，客流量+18%",
          "精密维修：维修收入+25%，解锁精密仪器维修",
          "改装达人：装备效果+20%，解锁改装工作",
          "前端开发：能力加成+30%，解锁网页设计",
          "后端架构：能力加成+50%，解锁服务器运维（晋升最优）",
          "安全攻防：职场风险-30%，解锁安全审计",
          "商务英语：外语收入+30%，解锁外贸工作",
          "翻译达人：翻译收入+25%，解锁文档翻译",
          "客运驾驶：AP减免翻倍，解锁出租车",
          "货运驾驶：物流收入+30%，解锁跟车助理",
          "门店销售：折扣上限25%，解锁导购",
          "商务谈判：溢价上限25%，解锁采购",
          "团队管理：向上管理+50%，团队规模+2",
          "战略规划：向上管理+50%，晋升最优",
          "税务会计：存款利率翻倍，解锁税务工作",
          "审计风控：风险-30%，解锁审计工作",
          "强电工程：工厂加成翻倍，解锁工厂电工",
          "弱电智能：智能家居收入+25%，解锁网络布线",
          "结构焊接：建筑加成+50%，解锁钢结构",
          "精密焊接：精密焊接收入+30%，解锁电子焊接",
        ],
      },
    ],
  };

  // ============================================================
  //  enterprise_fate — 企业命运系统
  // ============================================================
  MECHANICS.enterprise_fate = {
    id: "enterprise_fate",
    name: "企业命运系统",
    icon: "🏭",
    brief: "公司生命周期/命运事件/零和博弈/行业传导",
    sections: [
      {
        kind: "desc",
        text: "城市中的企业并非静止不变。你投资、就职过的公司会随时间成长、合并或倒闭，形成动态的商业世界。",
      },
      { kind: "subhead", text: "📊 生命周期阶段" },
      {
        kind: "list",
        items: [
          "🚀 初创期：高增长高风险，市场份额快速积累",
          "📈 成长期：高速成长，市场情绪高涨",
          "🏛️ 成熟期：稳定经营，创新放缓",
          "📉 衰退期：市场份额萎缩，人才开始流失",
          "💀 濒死期：面临破产或收购",
        ],
      },
      { kind: "subhead", text: "🎲 命运事件" },
      {
        kind: "list",
        items: [
          "🦈 市场份额被蚕食：成长期公司互相争夺",
          "🚀 新产品爆发：高产品分公司引爆市场",
          "📰 丑闻曝光：管理层丑闻引发信任危机",
          "🤝 收购/合并：强势公司吞并弱势",
          "📋 行业政策利好：同板块公司集体走强",
          "👑 创始人回归：衰退期公司起死回生",
          "💸 资金链断裂：濒死公司裁员自救",
          "🔔 IPO上市：成长期公司成功挂牌",
          "👋 人才流失：核心研发团队集体离职",
          "⚖️ 专利诉讼战：高产品分公司互相攻击",
        ],
      },
      { kind: "subhead", text: "🔗 零和博弈" },
      {
        kind: "desc",
        text: "总市场份额有上限（80%），一家公司增长时从其他公司按比例抽取份额。这不是各自漂移，而是真正的竞争。",
      },
      { kind: "subhead", text: "🔗 行业传导" },
      {
        kind: "desc",
        text: "同板块公司一个出事时，其他受到温和影响。例如：某AI公司丑闻曝光，整个AI/大模型板块受到波及。",
      },
      { kind: "subhead", text: "💡 玩家影响" },
      {
        kind: "desc",
        text: "就职公司的 KPI/能力表现、持有股票数量，都会影响公司命运事件的权重和结果。",
      },
    ],
  };

  // ============================================================
  //  startup_system — 创业系统
  // ============================================================
  MECHANICS.startup_system = {
    id: "startup_system",
    name: "创业系统",
    icon: "💼",
    brief: "注册公司→招聘→融资→IPO/收购/破产",
    related: ["mechanics:enterprise_fate"],
    sections: [
      {
        kind: "desc",
        text: "当你在街头/职场积累足够资源，可以注册公司开启创业之路。创业与职场并行，可同时打工+创业。",
      },
      { kind: "subhead", text: "📋 触发条件" },
      {
        kind: "list",
        items: [
          "街头阶段：💰 注册费 ¥50,000（不限阶段）",
          "职场阶段：📊 各剧本推荐储备不同",
        ],
      },
      { kind: "subhead", text: "📊 三阶段模型" },
      {
        kind: "list",
        items: [
          "种子期：注册（¥50k启动资金）→ 开发MVP产品 → 找联合创始人 → 种子轮融资",
          "成长期：招聘团队 → A轮/B轮融资 → 市场扩张 → 产品迭代",
          "退出期：IPO上市 / 被收购 / 破产清算",
        ],
      },
      { kind: "subhead", text: "👥 员工系统" },
      {
        kind: "list",
        items: [
          "6类员工：工程师(¥15k)、设计师(¥12k)、销售(¥10k)、市场(¥12k)、运营(¥8k)、财务(¥10k)",
          "忠诚度系统：现金流为负时忠诚度下降，低于20%可能离职",
          "每个员工分配0.5%期权",
        ],
      },
      { kind: "subhead", text: "💰 融资轮次" },
      {
        kind: "list",
        items: [
          "种子轮：¥50万上限，出让10-20%股权",
          "A轮：¥300万上限，出让15-25%股权，需估值≥¥300万",
          "B轮：¥1000万上限，出让10-20%股权，需估值≥¥1500万",
          "C轮：¥3000万上限，出让5-15%股权，需估值≥¥5000万",
        ],
      },
      { kind: "subhead", text: "🚀 退出方式" },
      {
        kind: "list",
        items: [
          "IPO：估值最高，需估值≥¥5亿 + B轮 + 连续盈利，上市溢价1.5-3倍",
          "收购：快速变现，大企业出价0.8-1.4倍估值",
          "破产：Runway≤0时触发，资产回收30%，声誉受损",
        ],
      },
      { kind: "subhead", text: "🔗 与企业命运联动" },
      {
        kind: "desc",
        text: "你创业的公司进入企业命运系统，与其他公司同场竞争，参与零和博弈、行业传导、合并事件。",
      },
    ],
  };

  // ============================================================
  //  insider_trading — 内幕交易风险
  // ============================================================
  MECHANICS.insider_trading = {
    id: "insider_trading",
    name: "内幕交易风险",
    icon: "🔍",
    brief: "风声期交易→季末审查→罚款禁入",
    sections: [
      {
        kind: "desc",
        text: "就职公司的命运事件触发前3-5天，可通过日常行动获知风声。利用风声提前交易可获利，但季末有合规审查风险。",
      },
      { kind: "subhead", text: "👂 风声感知渠道" },
      {
        kind: "list",
        items: [
          "工作表现：KPI>80 或 能力>70 时听到风声（+8~20%可信度）",
          "向上社交：职场行动获得内幕线索（+10~25%，每季度限2次）",
          "NPC对话：高好感度NPC透露消息（+8~20%）",
          "新闻蛛丝马迹：L1/L2新闻含关键词（+4~10%）",
          "行业报告：看手机-行业报告（+3~8%，每周限1次）",
        ],
      },
      { kind: "subhead", text: "⚖️ 合规审查" },
      {
        kind: "list",
        items: [
          "季末自动触发审查",
          "检查风声期+事件窗口内的异常交易",
          "获利越高，审查概率越高（10%~70%）",
          "触发后：罚款1-3倍获利 + 交易禁入30-180天",
        ],
      },
      { kind: "subhead", text: "💸 处罚梯度" },
      {
        kind: "list",
        items: [
          "< ¥5万：罚款1倍，禁入30天",
          "¥5-20万：罚款1.5倍，禁入60天",
          "¥20-50万：罚款2倍，禁入90天",
          "≥ ¥50万：罚款3倍，禁入180天 + 声誉-30",
        ],
      },
      { kind: "subhead", text: "💡 策略建议" },
      {
        kind: "list",
        items: [
          "风声可信度<50%时谨慎交易",
          "多渠道验证提升可信度",
          "获利控制在¥5万以内降低审查概率",
          "分散交易降低风险",
        ],
      },
    ],
  };

  // ============================================================
  //  inventory — 背包/物品/装备系统
  // ============================================================
  MECHANICS.inventory = {
    id: "inventory",
    name: "背包与物品",
    icon: "🎒",
    brief: "物品/装备管理、库存容量、装备效果系统",
    related: ["items:ingredients", "equipment:*"],
    sections: [
      {
        kind: "desc",
        text: "你的背包携带所有物品，包括食材、装备、药品、材料等。装备提供属性加成和特殊效果。",
      },
      { kind: "subhead", text: "📋 基本规则" },
      {
        kind: "list",
        items: [
          "背包容量有限（默认 20 格），可通过特定装备扩容",
          "装备栏分武器/防具/饰品/特殊 4 个槽位",
          "每件装备有耐久度，归零后效果减半",
          "食材有时效性，过期自动变质丢弃",
        ],
      },
      { kind: "tip", text: "在 📦 背包 Tab 可查看所有物品，点击可查看详情。" },
    ],
  };

  // ============================================================
  //  investment — 投资系统（股票/房产/加密货币）
  // ============================================================
  MECHANICS.investment = {
    id: "investment",
    name: "综合投资系统",
    icon: "💰",
    brief: "股票、房产、加密货币多市场投资，支持做空/杠杆",
    related: [
      "mechanics:stock",
      "mechanics:property_market",
      "mechanics:investment_analysis",
    ],
    sections: [
      {
        kind: "desc",
        text: "全品类投资平台。支持股票、加密货币、房地产三大市场，每种市场有独立的行情引擎和风险特征。",
      },
      { kind: "subhead", text: "📊 市场概览" },
      {
        kind: "list",
        items: [
          "📈 股市：多家上市公司，支持做空，可 2 倍杠杆",
          "🏠 楼市：房产价格随市场周期波动，不再固定增值",
          "₿ 加密货币：高波动性，支持做空，3 倍杠杆",
        ],
      },
      {
        kind: "tip",
        text: "市场联动：新闻事件可能同时影响多个市场。例如楼市调控同时影响房产和地产股。",
      },
    ],
  };

  // ============================================================
  //  stock — 股票市场系统
  // ============================================================
  MECHANICS.stock = {
    id: "stock",
    name: "股票市场",
    icon: "📈",
    brief: "K线图、技术指标、多空双向、2倍杠杆、行业板块",
    related: ["mechanics:investment", "mechanics:enterprise_fate"],
    sections: [
      {
        kind: "desc",
        text: "模拟真实的股票交易体验。每只股票对应一家城市中的公司，股价受公司业绩、行业热度、新闻事件等多维因素影响。",
      },
      { kind: "subhead", text: "📋 交易规则" },
      {
        kind: "list",
        items: [
          "📊 K 线图：日 K 线，7 日均线，涨跌绿色/红色",
          "🔼 做多/🔽 做空：双向交易，做空需支付利息",
          "⚡ 杠杆：最高 2 倍杠杆，强平线 80%",
          "📋 交易费用：买入 0.1%，卖出 0.1%（印花税）",
        ],
      },
      {
        kind: "tip",
        text: "某些新闻只影响特定行业板块。关注行业新闻可以预判股价走势。",
      },
    ],
  };

  // ============================================================
  //  corp_ops — 公司运营系统
  // ============================================================
  MECHANICS.corp_ops = {
    id: "corp_ops",
    name: "公司运营",
    icon: "🏢",
    brief: "日常运营管理、KPI 考核、决策审批、会议管理",
    related: ["mechanics:perf", "mechanics:promo", "mechanics:startup_system"],
    sections: [
      {
        kind: "desc",
        text: "职场生活的核心。每天的工作内容包括处理任务、参加会议、管理项目、完成 KPI。你的表现直接影响晋升和收入。",
      },
      { kind: "subhead", text: "📋 日常运营" },
      {
        kind: "list",
        items: [
          "📋 每日任务：处理工作事项，获得绩效点数",
          "📊 KPI 考核：月度/季度目标，影响绩效评级",
          "🤝 团队协作：参与项目，提升团队贡献度",
          "📈 向上管理：与上级的有效沟通影响晋升速度",
        ],
      },
      {
        kind: "tip",
        text: "工作效率受属性和技能影响。提高编程或管理技能可提升任务完成速度。",
      },
    ],
  };

  // ============================================================
  //  perf — 绩效系统
  // ============================================================
  MECHANICS.perf = {
    id: "perf",
    name: "绩效系统",
    icon: "📊",
    brief: "月度/季度绩效评审、S/A/B/C/D 评级、奖金/晋升挂钩",
    related: ["mechanics:corp_ops", "mechanics:promo"],
    sections: [
      {
        kind: "desc",
        text: "每季度一次的绩效评审决定你的奖金和晋升资格。绩效评级从 S+（卓越）到 D（不合格）共 6 档。",
      },
      { kind: "subhead", text: "📊 评级等级" },
      {
        kind: "list",
        items: [
          "S+（传奇）：全公司前 1%，奖金 5 倍",
          "S（杰出）：前 10%，奖金 2 倍",
          "A（优秀）：前 30%，奖金 1.5 倍",
          "B（良好）：前 60%，奖金 1.0 倍",
          "C（需改进）：后 20%，奖金 0.5 倍",
          "D（不合格）：后 5%，无奖金",
        ],
      },
      {
        kind: "tip",
        text: "连续两次 C 或一次 D 可能触发 PIP（绩效改进计划），长期不达标会被辞退。",
      },
    ],
  };

  // ============================================================
  //  promo — 晋升系统
  // ============================================================
  MECHANICS.promo = {
    id: "promo",
    name: "晋升系统",
    icon: "🎯",
    brief: "P5-P8 职级体系、晋升条件、能力要求、跨级晋升",
    related: ["mechanics:perf", "mechanics:corp_ops"],
    sections: [
      {
        kind: "desc",
        text: "职场晋升路径：P5（初级）→ P6（高级）→ P7（专家/组长）→ P8（总监）。每次晋升需要满足绩效、能力和工龄三重条件。",
      },
      { kind: "subhead", text: "📋 晋升条件" },
      {
        kind: "list",
        items: [
          "P5→P6：P6+ 绩效，工龄 ≥60 天，能力 ≥40，向上管理 ≥25",
          "P6→P7：P7+ 绩效，工龄 ≥120 天，能力 ≥65，向上管理 ≥40",
          "P7→P8：S 级绩效，工龄 ≥240 天，能力 ≥85，向上管理 ≥60",
          "P8（总监）：统管一个部门，解锁董事会议",
        ],
      },
      {
        kind: "tip",
        text: "向上管理属性很重要。只埋头干活不沟通，晋升会比别人慢得多。",
      },
    ],
  };

  // ============================================================
  //  new_game_plus — 多周目继承
  // ============================================================
  MECHANICS.new_game_plus = {
    id: "new_game_plus",
    name: "多周目继承",
    icon: "♻️",
    brief: "上局遗产→新局继承，声誉徽章/关系/物品/技能/现金加成",
    related: ["mechanics:scenario_mode"],
    sections: [
      {
        kind: "desc",
        text: "每局游戏结束后，根据你的表现生成「遗产清单」。新游戏开始时可以选择继承部分遗产，让你的每一局都在积累城市记忆。",
      },
      { kind: "subhead", text: "📋 可继承内容" },
      {
        kind: "list",
        items: [
          "🎖️ 声誉徽章：道德选择的永久记录（9 种）",
          "🤝 关系网：高好感 NPC 保留初始好感",
          "🎒 特殊物品：某些稀有装备可继承",
          "💭 梦想成就：已实现的梦想标记",
          "💰 现金加成：上局资产的 5%-10%",
        ],
      },
      {
        kind: "tip",
        text: "开局时的继承摘要弹窗会显示「那时候你…」的叙事回忆，让每一局都有故事感。",
      },
    ],
  };

  // ============================================================
  //  skill_intel — 技能情报系统
  // ============================================================
  MECHANICS.skill_intel = {
    id: "skill_intel",
    name: "技能情报",
    icon: "🔍",
    brief: "会计/烹饪/维修/驾驶/编程 5 个技能各 3 档价格价值信息可见度",
    related: ["mechanics:skill_tree", "mechanics:trade_intel"],
    sections: [
      {
        kind: "desc",
        text: "延续交易情报（销售技能门控价格对比）的模式，为会计、烹饪、维修、驾驶、编程 5 个技能增加「信息可见度」门槛。技能等级越高，看到的市场/财务/物品信息越丰富。",
      },
      { kind: "subhead", text: "📋 5 大技能情报一览" },
      {
        kind: "list",
        items: [
          "🧾 会计 Lv.20+：侧边栏显示日收支明细 / Lv.40+：投资回报率 / Lv.60+：闲钱理财提示",
          "🍳 烹饪 Lv.20+：食谱食材成本估算 / Lv.40+：在家做 vs 外卖性价比 / Lv.60+：食材价格波动",
          "🔧 维修 Lv.20+：装备品质评级 / Lv.40+：月维护成本 / Lv.60+：二手估值",
          "🚗 驾驶 Lv.20+：路线 AP 成本明细 / Lv.40+：配送费合理性 / Lv.60+：路线建议",
          "💻 编程 Lv.20+：外包工时估算 / Lv.40+：报价合理性评价 / Lv.60+：后续维护成本",
        ],
      },
      {
        kind: "tip",
        text: "这些情报面板默认隐藏在 action-card 的 price-preview 区域，技能达标后自动浮现。不需要额外操作。",
      },
    ],
  };

  // ============================================================
  //  main — 主循环/人生模拟核心
  // ============================================================
  MECHANICS.main = {
    id: "main",
    name: "人生模拟核心",
    icon: "🌟",
    brief: "日循环结算、属性系统、AP 行动力、需求与状态管理",
    reference: "《大多数》《中国式家长》",
    related: [
      "mechanics:ap",
      "mechanics:critical_needs",
      "mechanics:stat_link",
    ],
    sections: [
      {
        kind: "desc",
        text: "游戏的核心循环：每天 100 AP，选择行动→消耗 AP→结算状态→进入下一天。所有系统都挂载在这个主循环之上。",
      },
      { kind: "subhead", text: "📋 核心机制" },
      {
        kind: "list",
        items: [
          "🔵 每天 100 AP，不同行动消耗不同 AP",
          "📊 五大核心属性：体质/敏捷/心智/智力/魅力",
          "🍞 四大需求：饥饱/疲劳/心情/卫生",
          "🤒 健康系统：不良习惯积累→命名疾病",
          "🔥 熟练工连击：连续同工作获得收入加成",
        ],
      },
      {
        kind: "tip",
        text: "需求和状态会互相影响（多米诺效应），维持平衡比单点极限更重要。",
      },
    ],
  };

  // ============================================================
  //  action_habits — 行动习惯分布
  // ============================================================
  MECHANICS.action_habits = {
    id: "action_habits",
    name: "行动习惯分布",
    icon: "📊",
    brief: "查看你的行动偏好统计 — 各分类/各行动的点击频次排行",
    related: ["mechanics:ap"],
    sections: [
      {
        kind: "desc",
        text: "系统自动记录每次行动点击，按分类和具体行动统计使用频次。了解自己的游戏习惯，优化每日 AP 分配。",
      },
      {
        kind: "html",
        get: function (state) {
          if (!state || !state.stats || !state.stats.actionFreq) {
            return '<p class="wiki-desc" style="color:var(--text-muted);">暂无数据 — 开始游戏后会自动记录你的行动习惯。</p>';
          }
          var freq = state.stats.actionFreq;
          var totalClicks = 0;
          var catTotals = {};
          var catActions = {};
          var allActions =
            typeof getAvailableActions === "function"
              ? getAvailableActions(state)
              : [];

          // 按分类汇总
          for (var aid in freq) {
            if (!freq.hasOwnProperty(aid)) continue;
            var count = freq[aid];
            if (count <= 0) continue;
            totalClicks += count;

            var cat =
              typeof ActionSort !== "undefined" && ActionSort.getActionCategory
                ? ActionSort.getActionCategory(aid)
                : "other";
            if (!catTotals[cat]) {
              catTotals[cat] = 0;
              catActions[cat] = [];
            }
            catTotals[cat] += count;
            catActions[cat].push({ id: aid, count: count });
          }

          if (totalClicks <= 0) {
            return '<p class="wiki-desc" style="color:var(--text-muted);">暂无行动记录 — 开始行动后会自动统计。</p>';
          }

          // 分类名称映射
          var catNames = {};
          if (typeof ActionSort !== "undefined" && ActionSort.CATEGORIES) {
            for (var _ci = 0; _ci < ActionSort.CATEGORIES.length; _ci++) {
              catNames[ActionSort.CATEGORIES[_ci].id] =
                ActionSort.CATEGORIES[_ci].icon +
                " " +
                ActionSort.CATEGORIES[_ci].name;
            }
          }
          catNames["other"] = "📌 其他";

          // 分类排序（按使用量降序）
          var catList = Object.keys(catTotals).sort(function (a, b) {
            return catTotals[b] - catTotals[a];
          });

          // Action ID → 友好名称映射
          var nameMap = {};
          for (var _i = 0; _i < allActions.length; _i++) {
            if (allActions[_i] && allActions[_i].id) {
              nameMap[allActions[_i].id] =
                allActions[_i].icon +
                " " +
                (allActions[_i].name || allActions[_i].id);
            }
          }

          var html = "";
          html +=
            '<p class="wiki-desc" style="margin-bottom:12px;">📊 累计行动 <strong>' +
            totalClicks +
            "</strong> 次</p>";

          // === 按分类柱状图 ===
          html += "<h3>📊 按分类统计</h3>";
          html +=
            '<div style="display:flex;flex-direction:column;gap:6px;padding:8px 0;">';
          var maxCat = catTotals[catList[0]] || 1;
          for (var _j = 0; _j < catList.length; _j++) {
            var cid = catList[_j];
            var ccount = catTotals[cid];
            var pct = Math.round((ccount / totalClicks) * 100);
            var barW = Math.round((ccount / maxCat) * 100);
            var barColor = _getCatColor(cid);
            html +=
              '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">' +
              '<span style="width:100px;text-align:right;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
              _wkE(catNames[cid] || cid) +
              "</span>" +
              '<div style="flex:1;height:18px;background:rgba(255,255,255,0.04);border-radius:3px;overflow:hidden;position:relative;">' +
              '<div style="height:100%;width:' +
              barW +
              "%;background:" +
              barColor +
              ';border-radius:3px;transition:width 0.3s;"></div>' +
              "</div>" +
              '<span style="width:50px;text-align:right;color:var(--text-muted);font-size:11px;">' +
              ccount +
              " (" +
              pct +
              "%)</span>" +
              "</div>";
          }
          html += "</div>";

          // === 各分类 Top-5 行动 ===
          html += '<h3 style="margin-top:16px;">🏆 各分类热门行动</h3>';
          for (var _k = 0; _k < catList.length; _k++) {
            var cid2 = catList[_k];
            var acts = catActions[cid2] || [];
            acts.sort(function (a, b) {
              return b.count - a.count;
            });
            var topN = acts.slice(0, 5);
            var subMax = topN[0] ? topN[0].count : 1;
            html +=
              '<div style="margin-bottom:8px;padding:6px 8px;background:rgba(255,255,255,0.02);border-radius:4px;">' +
              '<div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:4px;">' +
              _wkE(catNames[cid2] || cid2) +
              ' <span style="font-weight:400;color:var(--text-muted);">(' +
              catTotals[cid2] +
              " 次)</span></div>";
            for (var _m = 0; _m < topN.length; _m++) {
              var act = topN[_m];
              var actName = nameMap[act.id] || act.id;
              var subPct = Math.round((act.count / subMax) * 100);
              html +=
                '<div style="display:flex;align-items:center;gap:6px;font-size:11px;padding:1px 0;">' +
                '<span style="width:120px;text-align:right;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
                _wkE(actName) +
                "</span>" +
                '<div style="flex:1;height:12px;background:rgba(255,255,255,0.03);border-radius:2px;overflow:hidden;">' +
                '<div style="height:100%;width:' +
                subPct +
                "%;background:" +
                _getCatColor(cid2) +
                ';opacity:0.6;border-radius:2px;"></div>' +
                "</div>" +
                '<span style="width:30px;text-align:right;color:var(--text-muted);font-size:10px;">' +
                act.count +
                "</span>" +
                "</div>";
            }
            html += "</div>";
          }

          return html;
        },
      },
    ],
  };

  // 分类颜色辅助（供 action_habits 使用）
  function _getCatColor(catId) {
    var colors = {
      survival: "var(--danger, #d9534f)",
      work: "var(--accent, #00b4d8)",
      appliance: "var(--warning, #f39c12)",
      shopping: "var(--success, #27ae60)",
      education: "var(--info, #3498db)",
      social: "var(--purple, #8e77d9)",
      finance: "var(--gold, #d4a017)",
      career: "var(--primary, #4a9e5c)",
    };
    return colors[catId] || "var(--text-muted, #99958e)";
  }

  // ============================================================
  //  sort_system — 分类排序系统
  // ============================================================
  MECHANICS.sort_system = {
    id: "sort_system",
    name: "分类排序系统",
    icon: "🔀",
    brief: "所有可点击选项列表的智能排序规则 — 分类优先、频次辅助",
    related: ["mechanics:action_habits", "mechanics:ap"],
    sections: [
      {
        kind: "desc",
        text: "游戏中有多个可点击选项列表（行动、商品、技能、股票等），随着内容增多，合理的排序顺序至关重要。采用「分类优先、频次辅助」混合策略：先按自然分类分组，同类内高频使用的条目靠前。",
      },
      {
        kind: "subhead",
        text: "📋 适用列表一览",
      },
      {
        kind: "list",
        items: [
          "行动选项（已启用）：生存必需→赚钱谋生→地点服务→购物装备→学习提升→社交休闲→金融理财→职业发展，同频次优先，低AP优先",
          "交易商品（已启用）：食品→日用品→服装→电子→奢侈品→废品，同频次优先，低价优先",
          "技能训练（已启用）：实用型→学术型→体能型，同频次优先，等级优先",
          "股票市场（已启用）：科技→新能源→消费→金融→房地产→医药，同频次优先，低价优先",
        ],
      },
      {
        kind: "tip",
        text: "多买/卖你常交易的商品，它们会自动浮到列表前部！技能训练同理，常练的技能自动靠前。",
      },
      {
        kind: "subhead",
        text: "📐 排序层级（5层）",
      },
      {
        kind: "list",
        items: [
          "第1层 — 分类固定顺序：关键分类先显示（如食物优先于奢侈品）",
          "第2层 — 同类默认优先级：特定条目置顶（如水在大米之前）",
          "第3层 — 交互频次：你最常操作的条目优先",
          "第4层 — 消耗/价格：低AP/低价格优先显示",
          "第5层 — 名称拼音：最终稳定兜底",
        ],
      },
      {
        kind: "subhead",
        text: "🔍 如何判断一个新列表是否适用",
      },
      {
        kind: "list",
        items: [
          "以可点击卡片/按钮网格渲染（非纯展示）",
          "条目有唯一字符串 ID",
          "条目数 > 5",
          "有分类依据（category / type / industry 等字段，或可按规则分组）",
          "玩家与该列表多轮次多次交互",
        ],
      },
      {
        kind: "desc",
        text: "未来新增内容后，只要满足以上条件，开发时即可通过 SortUtils.registerListType() 注册并启用。",
      },
    ],
  };

  // ============================================================
  //  自检：列出未命中的引用，给开发者一个早期警告
  // ============================================================
  // 暴露为全局，main.js 启动后调用一次
  window.runMechanicsAudit = function () {
    var problems = [];
    var hints = []; // 跨注册表引用未迁移条目 → 仅提示，不报错
    var totals = {};

    // 三类注册表共用同一套 schema → 共用一份审计
    function _auditOne(label, registry) {
      if (typeof registry !== "object" || !registry) return;
      totals[label] = Object.keys(registry).length;
      for (var id in registry) {
        if (!registry.hasOwnProperty(id)) continue;
        var m = registry[id];
        if (m.id !== id) {
          problems.push(
            "[" + label + ":" + id + "] m.id 与 key 不一致：" + m.id,
          );
        }
        if (!m.name || !m.brief) {
          problems.push("[" + label + ":" + id + "] 缺少 name/brief");
        }
        if (m.related) {
          for (var i = 0; i < m.related.length; i++) {
            var ref = m.related[i];
            var parts = ref.split(":");
            var cat = parts[0],
              rid = parts[1];
            if (!cat) {
              problems.push(
                "[" + label + ":" + id + "] related 格式不对：" + ref,
              );
              continue;
            }
            if (!rid || rid === "*") continue;
            // 跨注册表引用：能在对应注册表找到则 OK；否则记 hint
            // （旧 _wikiDetailMechanic pages 字典里的条目尚未迁移，跳转仍可工作）
            var ok = true;
            if (cat === "mechanics") {
              ok = typeof MECHANICS === "object" && !!MECHANICS[rid];
            } else if (cat === "narrative") {
              ok = typeof NARRATIVES === "object" && !!NARRATIVES[rid];
            } else if (cat === "victory") {
              ok = typeof VICTORIES === "object" && !!VICTORIES[rid];
            }
            if (!ok) {
              hints.push(
                "[" +
                  label +
                  ":" +
                  id +
                  "] related → " +
                  ref +
                  "（未在注册表，可能仍在旧 pages 字典）",
              );
            }
          }
        }
      }
    }

    _auditOne("MECHANICS", typeof MECHANICS !== "undefined" ? MECHANICS : null);
    _auditOne(
      "NARRATIVES",
      typeof NARRATIVES !== "undefined" ? NARRATIVES : null,
    );
    _auditOne("VICTORIES", typeof VICTORIES !== "undefined" ? VICTORIES : null);

    if (typeof console === "undefined") return;
    var summary = Object.keys(totals)
      .map(function (k) {
        return k + " " + totals[k];
      })
      .join(" / ");
    if (problems.length) {
      console.warn(
        "[wiki-audit] " +
          problems.length +
          " 个问题（" +
          summary +
          "）：\n  " +
          problems.join("\n  "),
      );
    } else {
      console.log("[wiki-audit] ✅ " + summary + "，无问题");
    }
    if (hints.length) {
      console.log(
        "[wiki-audit] ℹ️ " +
          hints.length +
          " 条 related 指向旧条目（迁移完后会消失）：\n  " +
          hints.join("\n  "),
      );
    }
  };
  // 别名（main.js 已用 runMechanicsAudit）
  window.runWikiAudit = window.runMechanicsAudit;
})();
