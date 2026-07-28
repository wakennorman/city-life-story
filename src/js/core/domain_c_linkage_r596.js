/**
 * 域C(职业/成长) 联动增强 R596
 * 桥接：
 *   C→D  c596_promotion_celebration  晋升庆祝 → 消费 state.career+state.relationships 数据,
 *     职业→"晋升后朋友的祝贺"的社交回响
 *   C→E  c596_skill_income_invest  技能变现投资 → 消费 state.skills+state.investment 数据,
 *     职业→"技能提升带来投资洞察"的经济回响
 *   C→G  c596_career_milestone_health  职业里程碑健康 → 消费 state.career+state.needs 数据,
 *     职业→"长期高压职业影响健康"的生命周期回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR596Loaded) return;
  RANDOM_EVENTS._domainCLinkageR596Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR596(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  function getJobSkillR596(job) {
    var skillMap = { office_assistant: "accounting", programmer: "coding", teacher: "education", chef: "cooking", driver: "agility", waiter: "social", salesperson: "sales", security_guard: "strength", nurse: "medicine", electrician: "electrician", welder: "welding", repairman: "repair", construction_worker: "strength", street_vending_food: "cooking", street_vending_goods: "sales", courier: "agility", cleaner: "hygiene", busking: "art", tutor: "education", freelancer: "coding" };
    if (!job) return "sales";
    return skillMap[job.id || job.levelId] || "sales";
  }

  var EVENTS = [
    // ====== C→D: 晋升庆祝 ======
    {
      id: "c596_promotion_celebration", phase: "street", _isChainEvent: false, icon: "🎉",
      title: "晋升喜讯",
      story: "你刚刚升职加薪的消息传开了——{desc}",
      triggers: { minDay: 15, interval: 90, maxRepeats: 5, excludeFlags: ["_c596PromotionCelebrationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c596PromotionCelebrationCooldown) return false;
        // 需要有工作且工作天数≥30
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 30;
      },
      choices: [
        { text: "🎊 请朋友们吃饭", hint: "好感+10,心情+8,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596PromotionCelebrationCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          var met = metNpcsR596(st);
          for (var mi = 0; mi < Math.min(met.length, 3); mi++) {
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, met[mi].id, 10, "晋升请客"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '升职了!今晚我请客!' 你和朋友们开怀畅饮,笑声不断。好感+10,心情+8,现金-500。", "success");
        }},
        { text: "📱 发个朋友圈", hint: "名气+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596PromotionCelebrationCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 你发了条朋友圈:'新的开始。' 点赞和祝福纷至沓来。名气+5,心情+3。", "success");
        }},
        { text: "🙏 默默感激", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596PromotionCelebrationCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 你静静地坐在窗前,看着这座城市的灯火。一路走来不容易,但你知道,这只是开始。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.currentJob) return null;
        var jobName = st.career.currentJob.levelName || "新职位";
        var salary = st.career.currentJob.salary || 0;
        return "你升职了!现在是一名" + jobName + ",月薪¥" + salary + "。消息传开后,朋友们纷纷发来祝贺。你打算怎么庆祝?";
      }
    },

    // ====== C→E: 技能变现投资 ======
    {
      id: "c596_skill_income_invest", phase: "street", _isChainEvent: false, icon: "📈",
      title: "技能变现",
      story: "你的专业技能引起了别人的注意——{desc}",
      triggers: { minDay: 45, interval: 60, maxRepeats: 8, excludeFlags: ["_c596SkillIncomeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c596SkillIncomeCooldown) return false;
        // 需要至少有一项技能≥30
        if (!st.skills) return false;
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].level >= 30) return true;
        }
        return false;
      },
      choices: [
        { text: "💼 接私单赚外快", hint: "收入+¥800-1500,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596SkillIncomeCooldown = true;
          var earn = 800 + Random.int(0, 700);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你的技能帮别人解决了问题,赚了¥" + earn.toLocaleString() + "外快。虽然累,但很有成就感。疲劳+10。", "success");
        }},
        { text: "📚 投资自己,报班深造", hint: "随机技能XP+15,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596SkillIncomeCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          var allSkills = ["cooking", "repair", "sales", "coding", "accounting", "medicine", "education", "art", "electrician", "welding", "agility", "strength", "social"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(allSkills), 15); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你报了一个培训班,花¥500。虽然肉疼,但学到的东西是自己的。随机技能XP+15。", "success");
        }},
        { text: "🤝 教别人赚课时费", hint: "收入+¥500,社交+3,名气+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596SkillIncomeCooldown = true;
          var earn = 300 + Random.int(0, 200);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '师父,这个怎么弄?' 你教别人掌握了新技能,赚了¥" + earn.toLocaleString() + "课时费。名气+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var bestSkill = "专业技能";
        var bestLevel = 0;
        if (st.skills) {
          for (var sk in st.skills) {
            if (st.skills[sk] && st.skills[sk].level > bestLevel) {
              bestSkill = sk;
              bestLevel = st.skills[sk].level;
            }
          }
        }
        return "你的" + bestSkill + "技能(Lv." + bestLevel + ")在圈子里小有名气。有人找你帮忙,也有人想跟你学。你的技能,正在变成实实在在的价值。";
      }
    },

    // ====== C→G: 职业里程碑健康 ======
    {
      id: "c596_career_milestone_health", phase: "street", _isChainEvent: false, icon: "⚕️",
      title: "职业健康警示",
      story: "长期的工作让你开始关注身体的变化——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 4, excludeFlags: ["_c596CareerHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c596CareerHealthCooldown) return false;
        if (!st.career || !st.career.currentJob) return false;
        // 需要工作天数≥90天
        return (st.career.currentJob.workDays || 0) >= 90;
      },
      choices: [
        { text: "🏥 做个体检", hint: "健康+10,现金-300,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596CareerHealthCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚕️ 体检结果显示:'整体健康,但需要注意颈椎和腰椎。' 你松了一口气。健康+10,心智+5,现金-300。", "success");
        }},
        { text: "🧘 调整工作节奏", hint: "疲劳-15,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596CareerHealthCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚕️ 你决定不再熬夜加班,每天抽半小时散步。身体是革命的本钱。疲劳-15,心智+3。", "success");
        }},
        { text: "💪 办张健身卡", hint: "健康+8,现金-500,体质XP+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c596CareerHealthCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
          if (typeof addSkillXp === "function") { try { addSkillXp("strength", 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚕️ 你办了一张健身卡。虽然花了不少钱,但想到能拥有更好的身体,心里踏实多了。健康+8,体质XP+10,现金-500。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.currentJob) return null;
        var jobName = st.career.currentJob.levelName || "工作";
        var days = st.career.currentJob.workDays || 0;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return "你已经做了" + days + "天的" + jobName + "了。最近总觉得腰酸背痛,精神状态也不如从前。健康值" + health + ",疲劳度" + fatigue + "。也许是时候关注一下自己的身体了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();