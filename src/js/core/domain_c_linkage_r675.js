/**
 * 域C(职业/成长) 联动增强 R675
 * 桥接：
 *   C→A  c675_skill_data_value         技能数据价值 → 消费 state.skills+state.trade 数据,
 *     技能等级提升交易数据分析能力
 *   C→F  c675_career_dashboard_v2      职业仪表盘v2 → 消费 state.career+state.employment 数据,
 *     职业发展数据可视化展示
 *   C→H  c675_skill_venture_seed       技能创业种子 → 消费 state.skills+state.corporate 数据,
 *     特定技能组合为创业打基础
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR675Loaded) return;
  RANDOM_EVENTS._domainCLinkageR675Loaded = true;

  // 辅助：获取技能总等级
  function totalSkillLevel(st) {
    if (!st || !st.skills) return 0;
    var total = 0;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number") total += s.level;
    }
    return total;
  }

  // [报告第 57 节] 果实 G4：c675_career_dashboard_v2 的「当前街头工作」
  //
  // 【原条件的两处独立缺陷】
  //   原写法：`st.employment && st.employment.currentJob && (st.employment.completedShifts || {})`
  //     ① 末项 `(x || {})` 是**恒真项** —— 空对象也是 truthy，
  //        所以整条条件实际退化成 `employment && employment.currentJob`；
  //     ② `employment.currentJob` 全库零写入（仅 main.js:4762 初始化为 null），
  //        于是 `&& currentJob` 恒 false → **该事件从未触发过**（死事件）。
  //   同时 text() 读 `currentJob.id` / `currentJob.name`，同样恒 undefined
  //   → 即便触发也只会显示"未知累计0天"。
  //
  // 【真实容器】employment.completedShifts（main.js:4764 doStreetJob 每次上工
  //   写入 completedShifts[job.id]）+ STREET_JOBS（id → 中文名）。
  //   这里把「当前街头工作」定义为**累计上工天数最多的那一份**：
  //   这是仅用现存容器就能得到的、与"回顾成长轨迹"语义最贴近的量。
  //   无任何上工记录 → 返回 null → 不触发。
  //
  // 【为什么不直接补写 employment.currentJob】它的 129 处读取里约 100 处是
  //   「!currentJob → return false（注释写着"检查已就业"）」型门槛，补写会
  //   一次性放开近百个就业类事件。见报告第 57.4 节。
  function topStreetJobC675(st) {
    var cs = st && st.employment && st.employment.completedShifts;
    if (!cs) return null;
    var bestId = null;
    var bestDays = 0;
    for (var id in cs) {
      if (!Object.prototype.hasOwnProperty.call(cs, id)) continue;
      var d = cs[id];
      if (typeof d === "number" && d > bestDays) {
        bestDays = d;
        bestId = id;
      }
    }
    if (!bestId) return null;
    var name = bestId;
    if (typeof STREET_JOBS !== "undefined" && Array.isArray(STREET_JOBS)) {
      for (var i = 0; i < STREET_JOBS.length; i++) {
        if (STREET_JOBS[i] && STREET_JOBS[i].id === bestId) {
          name = STREET_JOBS[i].name || bestId;
          break;
        }
      }
    }
    return { id: bestId, name: name, days: bestDays };
  }

  // 辅助：获取最高技能等级
  function maxSkillLevel(st) {
    if (!st || !st.skills) return 0;
    var max = 0;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > max) max = s.level;
    }
    return max;
  }

  var EVENTS = [
    {
      id: "c675_skill_data_value", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能数据价值",
      story: "你的技能让你在交易中看到了别人看不到的数据——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 2, excludeFlags: ["_c675DataValueCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c675DataValueCooldown) return false;
        var maxLvl = maxSkillLevel(st);
        return maxLvl >= 25 && st.trade && st.trade.totalProfit > 0;
      },
      choices: [
        { text: "📈 深度数据分析", hint: "会计XP+8,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675DataValueCooldown = true;
          st.flags._skillDataAnalysis = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '技能是数据,数据是力量。' 你运用专业技能分析了市场数据。会计XP+8,智力+3。", "success");
        }},
        { text: "🛒 精准交易", hint: "销售XP+5,现金+500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675DataValueCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛒 '数据驱动交易。' 你利用技能洞察完成了精准交易。销售XP+5,现金+¥500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var maxLvl = maxSkillLevel(st);
        var total = totalSkillLevel(st);
        return "你的技能让你在交易中看到了别人看不到的数据——'技能等级总合" + total + ",最高技能Lv." + maxLvl + "。用数据说话,用技能赚钱。'";
      }
    },
    {
      id: "c675_career_dashboard_v2", phase: "street", _isChainEvent: false, icon: "📋",
      title: "职业仪表盘",
      story: "回顾你的职业数据,一条清晰的成长轨迹浮现——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_c675DashCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c675DashCooldown) return false;
        // [报告第 57 节] 果实 G4：原为 `employment && currentJob && (completedShifts || {})`
        //   —— 末项恒真 + currentJob 零写入 → 事件从未触发。改读真实容器。
        return !!topStreetJobC675(st);
      },
      choices: [
        { text: "📊 分析成长轨迹", hint: "管理XP+6,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675DashCooldown = true;
          st.flags._careerDashboardAnalyzed = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '成长需要数据,数据需要复盘。' 你分析了职业成长轨迹。管理XP+6,智力+3。", "success");
        }},
        { text: "🎯 设定新目标", hint: "心智+5,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675DashCooldown = true;
          st.flags._careerNewGoalSet = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '回顾过去,设定目标,持续前进。' 你设定了新的职业目标。心智+5,管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        // [报告第 57 节] 果实 G4：改读真实容器（原读 currentJob.id/.name，恒 undefined）
        var job = topStreetJobC675(st);
        if (!job) return null;
        return "回顾你的职业数据,一条清晰的成长轨迹浮现——'" + job.name + "累计" + job.days + "天,数据会说话。'";
      }
    },
    {
      id: "c675_skill_venture_seed", phase: "corporate", _isChainEvent: false, icon: "🌱",
      title: "技能创业种子",
      story: "你的技能组合让你看到了创业的可能性——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_c675VentureSeedDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c675VentureSeedDone) return false;
        var total = totalSkillLevel(st);
        return total >= 100 && st.corporate && st.corporate.active;
      },
      choices: [
        { text: "🚀 制定创业计划", hint: "管理XP+10,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675VentureSeedDone = true;
          st.flags._skillDrivenVenturePlan = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '技能是创业的种子。' 你制定了基于技能的创业计划。管理XP+10,心智+5。", "success");
        }},
        { text: "💼 积累更多经验", hint: "各技能XP+3,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c675VentureSeedDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          // 给所有技能加少量经验
          if (st.skills) {
            for (var _sk in st.skills) {
              if (st.skills[_sk] && typeof st.skills[_sk].xp === "number") {
                st.skills[_sk].xp = (st.skills[_sk].xp || 0) + 3;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '厚积薄发,技能越强,创业越稳。' 你继续积累经验。各技能XP+3,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var total = totalSkillLevel(st);
        return "你的技能组合让你看到了创业的可能性——'技能总等级" + total + ",是时候让这些技能发挥更大的价值了。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();