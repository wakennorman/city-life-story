/**
 * 域C(职业/成长) 联动增强 R409
 * 第十七轮循环——把隐藏在skill_synergy/career_dev/perf中的数据转化为叙事体验。
 * 桥接：
 *   C→A  c409_synergy_data           连携数据化 → 消费 skillSynergies.dual/triple/theme 数据,
 *     把技能连携状态→"我的技能组合有多强"的数据画像
 *   C→B  c409_career_crossroads      职业十字路口 → 消费 career+age+flags 数据,
 *     职业节点→"站在选择的路口"叙事回响
 *   C→F  c409_perf_viz               绩效可视化 → 消费 perf 评级数据,
 *     把绩效评分→"我的职场表现"UI洞察
 *
 * 严格照 domain_c_linkage_r399.js / r391.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR409Loaded) return;
  RANDOM_EVENTS._domainCLinkageR409Loaded = true;

  // 安全技能经验
  function grantSkillXpR409(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // C→A: 连携数据化 — 消费 skillSynergies.dual/triple/theme
      id: "c409_synergy_data",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "技能连携数据",
      story:
        "你审视自己的技能组合——{synergySummary}\n\n{comboInsight}",
      triggers: { minDay: 60, excludeFlags: ["_c409SynergyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📊 用数据指导技能发展",
          hint: "心智+4,accounting XP+3,置 _c409SynergyCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c409SynergyCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR409("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🔗 你审视了技能连携数据——组合的力量大于单个技能。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "😊 凭直觉发展就好",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var summary = "各项技能正在稳步提升";
        var insight = "技能之间的连携效应会带来额外加成";
        if (typeof getActiveSynergiesCount === "function") {
          try {
            var cnt = getActiveSynergiesCount(st);
            if (cnt > 0) {
              summary = "当前有" + cnt + "个技能连携正在发挥作用";
              insight = "双技能/三技能连携让你的工作能力倍增";
            }
          } catch (e) { /* safe */ }
        }
        return "你审视自己的技能组合——" + summary + "。\n\n" + insight + "。";
      }
    },
    {
      // C→B: 职业十字路口 — 消费 career+age+flags
      id: "c409_career_crossroads",
      phase: "street",
      _isChainEvent: false,
      icon: "🔀",
      title: "职业十字路口",
      story:
        "你站在职业的十字路口——{crossroadsText}\n\n每一个选择,都指向不同的未来。",
      triggers: { minDay: 75, excludeFlags: ["_c409CrossroadsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🤔 认真思考未来的方向",
          hint: "心智+5,置 _c409CrossroadsCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c409CrossroadsCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🔀 你站在职业十字路口——认真思考是做出好选择的前提。心智+5。", "success");
          }
        },
        {
          text: "💪 边走边看,船到桥头自然直",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var text = "继续深耕当前领域,还是尝试新的方向?";
        if (st.career && st.career.history && st.career.history.length > 2) {
          text = "经历过多次职业变动,是时候思考长期方向了";
        }
        return "你站在职业的十字路口——" + text + "。\n\n每一个选择,都指向不同的未来。";
      }
    },
    {
      // C→F: 绩效可视化 — 消费 perf 评级数据
      id: "c409_perf_viz",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "职场表现可视化",
      story:
        "你查看了自己的职场表现数据——{perfViz}\n\n可视化让进步一目了然。",
      triggers: { minDay: 85, excludeFlags: ["_c409PerfVizCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "📈 用数据驱动自我提升",
          hint: "心智+3,management XP+3,置 _c409PerfVizCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c409PerfVizCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            grantSkillXpR409("management", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你用数据审视职场表现——可视化是进步的开始。心智+3,管理XP+3。", "success");
          }
        },
        {
          text: "😅 数据不能代表一切",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var viz = "暂无绩效数据";
        if (corp.perfHistory && corp.perfHistory.length > 0) {
          var recent = corp.perfHistory.slice(-4);
          var grades = [];
          for (var i = 0; i < recent.length; i++) grades.push((recent[i] && recent[i].grade) || "?");
          viz = "近" + recent.length + "次绩效:" + grades.join("/");
        } else if (typeof corp.kpi === "number") {
          viz = "当前KPI:" + corp.kpi + "分";
        }
        return "你查看了自己的职场表现数据——" + viz + "。\n\n可视化让进步一目了然。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
