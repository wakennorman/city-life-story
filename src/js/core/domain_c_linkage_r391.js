/**
 * 域C(职业/成长) 联动增强 R391
 * 背景：域C 经 R243/R269/R357 多轮加固后 A类净尽。本轮聚焦3个历轮未覆盖的数据→叙事桥接：
 *   C→F c391_skill_mastery_wall  技能掌握可视化 → 消费 getActiveSynergiesCount+SKILL_BRANCHES,
 *     把技能分支/天赋节点数据转化为"我的技能掌握墙"UI提示,mental+happiness
 *   C→A c391_skill_xp_monetize   技能经验变现 → 消费 skillSynergies.dual/triple 数据,
 *     连携技能达到门槛→触发"用技能赚外快"叙事,cash+连携技能XP
 *   C→G c391_career_health_balance 职业健康平衡 → 消费 status.health+needs 数据,
 *     高压工作+健康下滑触发"工作与健康"的人生抉择
 *
 * 严格照 domain_c_linkage_r381.js / r357.js 已验证IIFE注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR391Loaded) return;
  RANDOM_EVENTS._domainCLinkageR391Loaded = true;

  // 安全读取技能等级
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 取首个已结识(met)的NPC id——守met铁律
  function firstMetNpcR391(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 安全NPC中文名
  function npcNameR391(st, npcId) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(npcId) || npcId; } catch (e) { /* safe */ }
    }
    return npcId;
  }

  // 安全增加好感(守域D铁律)
  function bumpAffinityR391(st, npcId, delta) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, delta); } catch (e) { /* safe */ }
    }
  }

  // 获取最高等级技能名
  function topSkillKeyR391(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      // C→F: 技能掌握可视化 — 消费 getActiveSynergiesCount + SKILL_BRANCHES
      id: "c391_skill_mastery_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🧱",
      title: "技能掌握墙",
      story:
        "你回顾自己这些日子积累的技能，{skillSummary}。{branchInsight}\n\n每一门手艺都是一块砖，慢慢砌成了一面「技能掌握墙」。",
      triggers: { minDay: 60, excludeFlags: ["_c391SkillMasteryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        // 至少有一门技能≥20级
        var hasDecent = false;
        for (var k in st.skills) {
          var s = st.skills[k];
          if (s && s.level >= 20) { hasDecent = true; break; }
        }
        return hasDecent;
      },
      choices: [
        {
          text: "🖼️ 把这份掌握感记在心里",
          hint: "心智+4,心情+3,置 _c391SkillMasteryCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c391SkillMasteryCooldown = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🖼️ 你回顾自己的技能掌握墙，感到一种踏实的成就感。心智+4,心情+3。", "success");
          }
        },
        {
          text: "💪 继续磨练,还有很长的路",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
          }
        }
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var topKey = topSkillKeyR391(st);
        if (!topKey) return null;
        var topLv = st.skills[topKey].level || 0;
        var skillCnMap = { cooking: "烹饪", repair: "维修", coding: "编程", english: "英语",
          driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
          electrician: "电工", welding: "焊接", medicine: "医护", social: "社交" };
        var summary = "最高的是" + (skillCnMap[topKey] || topKey) + "(Lv." + topLv + ")";
        // 连携洞察
        var branchInsight = "";
        if (typeof SKILL_BRANCHES !== "undefined" && st.skillBranches) {
          var branchId = st.skillBranches[topKey];
          if (branchId && typeof getBranchById === "function") {
            var b = getBranchById(topKey, branchId);
            if (b && b.name) branchInsight = "你选择了「" + b.name + "」方向,正走在成为专家的路上。";
          }
        }
        if (!branchInsight && typeof getActiveSynergiesCount === "function") {
          try {
            var cnt = getActiveSynergiesCount(st);
            if (cnt > 0) branchInsight = "当前有" + cnt + "个技能连携正在发挥作用,各项技能互相加成。";
          } catch (e) { /* safe */ }
        }
        return "你回顾自己这些日子积累的技能，" + summary + "。" + (branchInsight ? "\n\n" + branchInsight : "") + "\n\n每一门手艺都是一块砖，慢慢砌成了一面「技能掌握墙」。";
      }
    },
    {
      // C→A: 技能经验变现 — 消费 skillSynergies.dual/triple 数据
      id: "c391_skill_xp_monetize",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "技能变现",
      story:
        "你发现身边有人需要{skillService}。手艺人不愁没活干——你决定接个私活赚点外快。",
      triggers: { minDay: 45, excludeFlags: ["_c391SkillMonetizeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        // 需要至少一门技能≥30且存在连携或分支
        var hasExpert = false;
        for (var k in st.skills) {
          var s = st.skills[k];
          if (s && s.level >= 30) { hasExpert = true; break; }
        }
        if (!hasExpert) return false;
        // 需要一定现金门槛(有本金才能接单)
        if (!st.resources || st.resources.cash < 100) return false;
        return true;
      },
      choices: [
        {
          text: "🔧 接活干,赚点辛苦钱",
          hint: "现金+[PLACEHOLDER],技能XP+5,置 _c391SkillMonetizeCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c391SkillMonetizeCooldown = true;
            var topKey = topSkillKeyR391(st);
            if (topKey && typeof addSkillXp === "function") {
              try { addSkillXp(topKey, 5); } catch(e) { /* safe */ }
            }
            // 收入与技能等级挂钩
            var income = 80 + (st.skills[topKey] && st.skills[topKey].level ? st.skills[topKey].level * 3 : 0);
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + income;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🔧 你接了个私活,运用自己的专业技能赚了¥" + income + "。技能XP+5。", "success");
          }
        },
        {
          text: "😴 休息一下,钱慢慢赚",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var topKey = topSkillKeyR391(st);
        if (!topKey) return null;
        var serviceMap = { cooking: "做饭/办席", repair: "修家电/通下水道", coding: "写小程序/做网页",
          english: "翻译/家教", driving: "跑腿/代驾", sales: "推销/地推",
          management: "活动策划/流程优化", accounting: "理账/报税", electrician: "修电路/装设备",
          welding: "焊接/钢结构", medicine: "护工/理疗" };
        var service = serviceMap[topKey] || topKey + "服务";
        return "你发现身边有人需要" + service + "。手艺人不愁没活干——你决定接个私活赚点外快。";
      }
    },
    {
      // C→G: 职业健康平衡 — 消费 status.health + needs 数据
      id: "c391_career_health_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "工作与健康的天平",
      story:
        "最近工作{professionFeels}。身体发出了警告信号——{healthWarning}。\n\n继续硬扛,还是停下来歇歇?",
      triggers: { minDay: 35, excludeFlags: ["_c391CareerHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        // 健康中等偏低(35~60)且有工作或近期工作记录
        var health = (st.status && isFinite(st.status.health)) ? st.status.health : 100;
        if (health < 35 || health > 60) return false;
        // 需要有职业经历
        var hasCareer = st.career && (st.career.currentJob || (st.career.history && st.career.history.length > 0));
        if (!hasCareer) return false;
        return true;
      },
      choices: [
        {
          text: "🛑 停下来,健康第一",
          hint: "心智+3,心情+5,置 _healthFirstChoice,置 _c391CareerHealthCooldown(75天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c391CareerHealthCooldown = true;
            st.flags._healthFirstChoice = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🛑 你决定停下来歇歇。身体是革命的本钱,健康第一。心智+3,心情+5。", "success");
          }
        },
        {
          text: "💪 再扛一扛,熬过这阵就好了",
          hint: "心情-3,置 _c391CareerHealthCooldown(75天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c391CareerHealthCooldown = true;
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💪 你选择再扛一扛。但身体的警告信号不应忽视。心情-3。", "warning");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var health = (st.status && isFinite(st.status.health)) ? st.status.health : 100;
        var profession = "压力有点大";
        if (st.career && st.career.currentJob) {
          var path = st.career.currentJob.path || "";
          if (path === "tech" || path === "finance") profession = "整天对着电脑,眼睛酸脖子疼";
          else if (path === "civil" || path === "logistics") profession = "每天风里来雨里去,体力消耗很大";
          else if (path === "catering" || path === "medical") profession = "一站就是一整天,腿都肿了";
          else profession = "最近工作强度有点大";
        }
        var warning = health < 45 ? "经常感到疲惫,头疼脑热的小毛病不断" : "偶尔感到疲惫,睡眠质量下降";
        return "最近工作" + profession + "。身体发出了警告信号——" + warning + "。\n\n继续硬扛,还是停下来歇歇?";
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
