/**
 * 胜利/成就注册表 (VICTORIES Registry) — 百科自更新源
 *
 * 同 mechanics_registry.js 套路。
 * 关键收益：achievements 条目直接读 ACHIEVEMENTS 数组，
 * 新增成就时百科自动 +1，类别分布也实时反映。
 */

(function () {
  if (typeof window === "undefined") return;
  window.VICTORIES = window.VICTORIES || {};

  // ============================================================
  //  晋升 P10
  // ============================================================
  VICTORIES.v_p10 = {
    id: "v_p10",
    name: "胜利：晋升 P10",
    icon: "🏢",
    brief: "成为合伙人，职场之巅",
    sections: [
      {
        kind: "desc",
        text: "从 P5 一路晋升到 P10（合伙人），成为职场金字塔尖。",
      },
      {
        kind: "list",
        items: [
          "晋升关键：每年 Q3 答辩，KPI/向上管理/能力综合评分",
          "P7+ 解锁团队管理",
          "P5 → P6 → P7 → P8 → P9 → P10，约需 5~8 年",
          "关注：发量（勿归零）、风险（勿满 100）、人缘（勿低于 20）",
        ],
      },
    ],
  };

  // ============================================================
  //  财务自由
  // ============================================================
  VICTORIES.v_wealth = {
    id: "v_wealth",
    name: "胜利：财务自由",
    icon: "💸",
    brief: "累计 ¥2,000 万",
    sections: [
      {
        kind: "desc",
        text: "累计 ¥2,000 万（现金 + 银行 + 投资市值 + 房产 + 汽车）。",
      },
      { kind: "tip", text: "投资 + 经商 + 职场组合，最快约 6~8 年达成。" },
    ],
  };

  // ============================================================
  //  经商大亨
  // ============================================================
  VICTORIES.v_business = {
    id: "v_business",
    name: "胜利：经商大亨",
    icon: "🏪",
    brief: "经商利润 ¥50 万",
    related: ["skills:sales"],
    sections: [
      {
        kind: "desc",
        text: "trade.totalProfit ≥ ¥500,000（街头交易/摆摊累积净利润）。",
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p class="wiki-tip">💡 找准批发地→零售地差价，配合 ' +
            _wkLink("skills", "sales", "销售") +
            " 技能加成。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  城市名人
  // ============================================================
  VICTORIES.v_fame = {
    id: "v_fame",
    name: "胜利：城市名人",
    icon: "🌟",
    brief: "名气达到 100",
    related: ["mechanics:fame_vip"],
    sections: [
      { kind: "desc", text: "名气达到 100。" },
      {
        kind: "tip",
        text: "名人 VIP 行动 + 道德正直选择 + 完成 NPC 委托快速涨名气。",
      },
    ],
  };

  // ============================================================
  //  技能大师
  // ============================================================
  VICTORIES.v_skill = {
    id: "v_skill",
    name: "胜利：技能大师",
    icon: "🥷",
    brief: "全部 10 项技能 80 级",
    sections: [
      { kind: "desc", text: "10 项技能全部达到 Lv.80。" },
      {
        kind: "tip",
        text: "单技能从 0 到 80 约需 200+ 次行动；多技能并行最高效。",
      },
    ],
  };

  // ============================================================
  //  投资天才
  // ============================================================
  VICTORIES.v_invest = {
    id: "v_invest",
    name: "胜利：投资天才",
    icon: "💎",
    brief: "投资资产 ¥1,000 万",
    related: ["narrative:news_cascade"],
    sections: [
      {
        kind: "desc",
        text: "投资资产（股票/虚拟币/期货/基金/房产/贵金属）累计市值 ≥ ¥1,000 万。",
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p class="wiki-tip">💡 抓住 ' +
            _wkLink("narrative", "news_cascade", "新闻级联") +
            " 的 L2 机会，比单一持有更有效。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  失败条件
  // ============================================================
  VICTORIES.fail = {
    id: "fail",
    name: "失败条件",
    icon: "💀",
    brief: "健康/债务/发量/尊严/绩效/年龄危机",
    related: ["narrative:ng_plus"],
    sections: [
      {
        kind: "list",
        items: [
          "❤️ 健康归零",
          "💸 总债务 > ¥50,000 且无力偿还",
          "🦲 发量归零（职场过劳）",
          "😔 尊严归零（职场崩溃）",
          "📉 连续 8 季度绩效 C（淘汰）",
          "⚠️ 风险值 100%（职场被开除）",
          "👴 年龄 ≥ 35 且职级 < P8（35 岁危机）",
        ],
      },
      {
        kind: "html",
        get: function () {
          return (
            '<p class="wiki-tip">💡 失败也可触发 ' +
            _wkLink("narrative", "ng_plus", "新游戏+") +
            " 继承下一周目。</p>"
          );
        },
      },
    ],
  };

  // ============================================================
  //  成就一览 — 直接读 ACHIEVEMENTS（自动同步数量与类别分布）
  // ============================================================
  VICTORIES.achievements = {
    id: "achievements",
    name: "成就一览",
    icon: "🏅",
    brief: "前往成就 Tab 查看完整成就",
    reference: "《Papers Please》隐藏成就的叙事化设计",
    sections: [
      {
        kind: "html",
        get: function () {
          var total =
            typeof ACHIEVEMENTS !== "undefined" && ACHIEVEMENTS.length
              ? ACHIEVEMENTS.length
              : 0;
          return (
            '<p class="wiki-desc">共 <b>' +
            total +
            "</b> 个成就（数据直接从 <code>ACHIEVEMENTS</code> 数组读取）。</p>"
          );
        },
      },
      { kind: "subhead", text: "📋 类别分布（实时统计）" },
      {
        kind: "list",
        items: function () {
          if (typeof ACHIEVEMENTS === "undefined") return [];
          var counts = {};
          var hiddenCount = 0;
          for (var i = 0; i < ACHIEVEMENTS.length; i++) {
            var a = ACHIEVEMENTS[i];
            var c = a.category || "未分类";
            counts[c] = (counts[c] || 0) + 1;
            if (a.hidden) hiddenCount++;
          }
          var out = [];
          var iconMap = {
            人生第一次: "🌅",
            里程碑: "🏆",
            道德档案: "📜",
            隐藏: "🎁",
            未分类: "❓",
          };
          for (var k in counts) {
            if (!counts.hasOwnProperty(k)) continue;
            out.push((iconMap[k] || "•") + " " + k + "：" + counts[k] + " 个");
          }
          if (hiddenCount) out.push("🕵️ 其中隐藏成就 " + hiddenCount + " 个");
          return out;
        },
      },
      {
        kind: "tip",
        text: "切换到 🏅 成就 Tab 查看完整解锁状态与叙事文案。",
      },
    ],
  };
})();
