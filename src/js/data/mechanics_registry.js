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
