/**
 * 域C(职业/成长) 联动增强 R515
 * 选题依据：career_dev.js 写入但全库零事件消费的三个真实死 flag 首消费（写后零读经全库 grep 确证）：
 *   C→D  c515_apprentice_report   flags._apprenticeList(带徒事件"给学习清单"分支置位,写后零读)首消费 →
 *     徒弟照着清单学成回访谢师,applyAffinityChange 正反馈+名气,师徒叙事闭环
 *   C→G  c515_health_wakeup_act   flags._highSalaryHealthWarn(高薪透支健康警示置位,写后零读)首消费 →
 *     收到警示后的主动健康管理(体检+作息重构),status.health 回补,警示→行动叙事闭环
 *   C→H  c515_startup_capital_carry flags._startupFromMaxLevel(满级选"下一站创业"置位,承诺"解锁创业资本加成"却零后续)首消费 →
 *     Phase1 职业口碑/人脉在 corporate 阶段兑现为经营优势,跨阶段继承闭环
 * 防御：rel&&rel.met 铁律 / applyAffinityChange 位置参数 / status.health 真实路径 / addSkillXp 真实键(management) /
 *       ||守卫 / 一次性 cooldown flag / conditions 全 false 时不发火叙事仍自洽
 * 数值：[PLACEHOLDER] 基准已按同域历轮(r489/r507)量级填充,待平衡轮统一调参
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR515Loaded) return;
  RANDOM_EVENTS._domainCLinkageR515Loaded = true;

  // 找一个已认识的NPC（遍历 relationships，避免依赖未实现的具名NPC）
  function firstMetNpcC515(st) {
    if (!st || !st.relationships) return null;
    for (var nid in st.relationships) {
      var rel = st.relationships[nid];
      if (rel && rel.met) return nid;
    }
    return null;
  }

  function npcNameC515(st, nid) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(st, nid) || "老熟人"; } catch (e) { return "老熟人"; }
    }
    return "老熟人";
  }

  function bumpAffinityC515(st, nid, amt, reason) {
    if (!nid) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, amt, reason); } catch (e) {}
    }
  }

  var EVENTS = [
    {
      id: "c515_apprentice_report", phase: "street", _isChainEvent: false, icon: "📋",
      title: "清单教出来的徒弟",
      story: "当初你没空手把手教，只给了他一份学习清单——{desc}",
      triggers: { minDay: 90, interval: 90, maxRepeats: 1, excludeFlags: ["_c515ApprenticeReportDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._apprenticeList) return false; // [联动] 首消费 career_dev.js:5524 死flag
        return !st.flags._c515ApprenticeReportDone;
      },
      choices: [
        { text: "🍵 听他讲学习心得", hint: "好感+5,名气+3,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515ApprenticeReportDone = true;
          var nid = firstMetNpcC515(st);
          bumpAffinityC515(st, nid, 5, "徒弟学成谢师，圈子里传为佳话"); // 域D铁律:走applyAffinityChange
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 徒弟把清单上的条目一条条学完了，特地回来谢你——'师父领进门，清单也算门。' 名气+3，心情+4。", "success");
        }},
        { text: "📝 再给他一份进阶清单", hint: "名气+5,传承者口碑", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515ApprenticeReportDone = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 你又整理了一份进阶清单。'愿意把路标画给别人的人，路上不会缺同行者。' 名气+5。", "info");
        }}
      ],
      text: function (st) {
        return "那个拿了你学习清单的年轻人回来了，手里拎着两包水果——'清单上的东西我都学完了，想让您看看。'";
      }
    },
    {
      id: "c515_health_wakeup_act", phase: "street", _isChainEvent: false, icon: "🩺",
      title: "警报之后",
      story: "高薪的代价已经写在体检单的边缘，这一次你决定不再拖——{desc}",
      triggers: { minDay: 60, interval: 60, maxRepeats: 1, excludeFlags: ["_c515HealthActDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._highSalaryHealthWarn) return false; // [联动] 首消费 career_dev.js:5912 死flag
        if (!st.status || (st.status.health || 0) >= 70) return false; // 健康已恢复则不再发火
        return !st.flags._c515HealthActDone;
      },
      choices: [
        { text: "🩺 全面体检+作息重构", hint: "花费¥1500,健康+8,心智+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515HealthActDone = true;
          if (st.resources && (st.resources.cash || 0) >= 1500) st.resources.cash -= 1500;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 8); // 真实路径 status.health
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🩺 体检报告没有想象中糟，但医生的话你记住了——'身体不是成本，是本金。' 健康+8，心智+4。", "success");
        }},
        { text: "⏰ 只调作息不花钱", hint: "健康+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515HealthActDone = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⏰ 你把最晚下班时间写进了日程表——'挣钱的前提是活得够久。' 健康+3。", "info");
        }}
      ],
      text: function (st) {
        var hp = st && st.status ? Math.floor(st.status.health || 0) : 0;
        return "上次那条健康警告一直悬在心头（当前健康 " + hp + "）。高薪买得起很多东西，买不回熬掉的身体。";
      }
    },
    {
      id: "c515_startup_capital_carry", phase: "corporate", _isChainEvent: false, icon: "🧳",
      title: "老本行的红利",
      story: "当年在职业巅峰选择转身创业，那句'职业资本转化为创业优势'今天兑现了——{desc}",
      triggers: { minDay: 120, interval: 120, maxRepeats: 1, excludeFlags: ["_c515StartupCarryDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._startupFromMaxLevel) return false; // [联动] 首消费 career_dev.js:5469 死flag(跨阶段继承)
        return !st.flags._c515StartupCarryDone;
      },
      choices: [
        { text: "🤝 接下老客户的大单", hint: "现金+3000,管理XP+8,向上关系+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515StartupCarryDone = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 3000; /* [PLACEHOLDER]量级参照r489 */
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
          if (st.player) {
            st.player.corporate = st.player.corporate || {};
            st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧳 老东家时期的客户主动找上门——'我们信的不是公司，是你这个人。' 现金+3000，管理XP+8。", "success");
        }},
        { text: "🎓 把老经验写成内训教材", hint: "管理XP+10,团队口碑", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c515StartupCarryDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎓 你把老本行的方法论整理成内训教材——'个人经验变成组织能力，才算真正的传承。' 管理XP+10。", "success");
        }}
      ],
      text: function (st) {
        return "手机响了，是老本行时期的合作方——'听说你自己干了？正好有个项目，非你不可。' 职业生涯攒下的口碑，成了创业路上的第一桶资源。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
