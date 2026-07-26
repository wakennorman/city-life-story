/**
 * 域C联动增强 R231 — 职业/成长 × 跨域桥接
 * [全系统自洽修复] 域C R231: 职场晋升/薪水里程碑/职业倦怠数据首次被事件消费
 *
 * 3个新事件：
 *   ① C→D: 晋升同事反应 — 职场晋升后已结识NPC好感变化(消费career.levelId,当前0事件覆盖)
 *   ② C→E: 薪水里程碑 — 月薪首破¥15000触发消费觉醒(消费career.salary,当前0事件覆盖)
 *   ③ C→G: 职业倦怠 — 倦怠值≥70触发健康预警(消费careerCapital.burnout,当前0事件覆盖)
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;

  function _npcName(npcId) {
    if (typeof getNpcById === "function") {
      var n = getNpcById(npcId);
      if (n && n.name) return n.name;
    }
    return npcId;
  }

  function _firstMetNpc(st) {
    if (!st.relationships) return null;
    var best = null, bestAff = -1;
    for (var k in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, k)) {
        var r = st.relationships[k];
        if (r && r.met === true && (r.affinity || 0) > bestAff) {
          bestAff = r.affinity || 0; best = k;
        }
      }
    }
    return best;
  }

  // ===== ① C→D: 晋升同事反应 =====
  // 职场晋升(中级+)后,已结识NPC好感变化
  // 奖励: 首个已结识NPC好感+8 + 心情+5
  var career_promo_npc_reaction = {
    id: "career_promo_npc_reaction",
    title: "办公室的注目",
    phase: "street",
    repeatable: false,
    priority: 82,
    conditions: function (st) {
      if (!st || !st.flags || !st.career || !st.career.currentJob) return false;
      if (st.flags._careerPromoNpcReactDone) return false;
      // 中级及以上(level index >= 1)视为晋升
      var job = st.career.currentJob;
      if (!job.path || !job.levelId) return false;
      var path = (typeof CAREER_PATHS !== "undefined") ? CAREER_PATHS[job.path] : null;
      if (!path || !path.levels) return false;
      var idx = -1;
      for (var i = 0; i < path.levels.length; i++) {
        if (path.levels[i].id === job.levelId) { idx = i; break; }
      }
      if (idx < 1) return false; // 仅初级不触发
      return true;
    },
    probability: 0.85,
    getStory: function (st) {
      var job = st.career.currentJob;
      var name = _firstMetNpc(st);
      var L = [];
      L.push("你晋升为" + (job.levelName || "新职位") + "的消息，不知怎么传开了。");
      L.push("");
      if (name) {
        L.push("街坊" + _npcName(name) + "碰到你，拍了拍你的肩：");
        L.push("'听说你升职了？出息了啊！'");
      } else {
        L.push("连楼下卖煎饼的大姐都多看了你两眼。");
      }
      L.push("");
      L.push("那种被看见的感觉，比工资条上的数字更暖。");
      return L.join("\n");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._careerPromoNpcReactDone = true;
      var npc = _firstMetNpc(st);
      if (choiceId === "treat") {
        // 请客庆祝: 花300元, 好感+8, 心情+10
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);
        if (npc && typeof applyAffinityChange === "function") {
          applyAffinityChange(st, npc, 8, "promo_celebrate");
        }
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("🎉 你请街坊吃了顿饭庆祝升职。好感+8，心情+10。", "success");
        }
      } else {
        // 低调: 好感+4, 心情+5, 存钱
        if (npc && typeof applyAffinityChange === "function") {
          applyAffinityChange(st, npc, 4, "promo_humble");
        }
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("🙂 你谦虚地说'运气好'。好感+4，心情+5。", "info");
        }
      }
    },
    choices: [
      { text: "🎉 请街坊吃顿饭庆祝(花300元)", id: "treat" },
      { text: "🙂 谦虚回应", id: "humble" },
    ],
    icons: ["🏆", "晋升"],
  };

  // ===== ② C→E: 薪水里程碑 =====
  // 月薪首破¥15000触发消费觉醒叙事
  var salary_milestone_awakening = {
    id: "salary_milestone_awakening",
    title: "工资条变了",
    phase: "street",
    repeatable: false,
    priority: 80,
    conditions: function (st) {
      if (!st || !st.flags || !st.career || !st.career.currentJob) return false;
      if (st.flags._salaryMilestoneDone) return false;
      var salary = st.career.currentJob.salary || 0;
      if (salary < 15000) return false; // [PLACEHOLDER] 月薪门槛
      return true;
    },
    probability: 0.9,
    getStory: function (st) {
      var salary = st.career.currentJob.salary || 0;
      var L = [];
      L.push("这个月的工资条上写着：¥" + salary.toLocaleString() + "。");
      L.push("");
      L.push("你盯着那个数字看了很久。");
      L.push("");
      L.push("一万五。一个你以前想都不敢想的数字。");
      L.push("");
      L.push("但奇怪的是，高兴之余，你感到一种新的焦虑——");
      L.push("这笔钱该怎么花？是该犒劳自己，还是该做点更长远的打算？");
      return L.join("\n");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._salaryMilestoneDone = true;
      if (choiceId === "invest") {
        // 投资觉醒: 置投资意识flag + 会计XP
        st.flags._dataInvestorMindset = true;
        if (typeof addSkillXp === "function") addSkillXp("accounting", 10);
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("📈 你决定把一部分钱拿去投资。投资意识觉醒，会计XP+10，心情+5。", "success");
        }
      } else if (choiceId === "save") {
        // 存银行: 现金转存款
        var half = Math.round((st.resources.cash || 0) * 0.3);
        st.resources.cash = (st.resources.cash || 0) - half;
        st.resources.bankBalance = (st.resources.bankBalance || 0) + half;
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("💰 你把30%的现金存进了银行。存款+" + half + "，心智+5。", "info");
        }
      } else {
        // 犒劳自己: 心情+15, 但花1000元
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("🛍️ 你决定好好犒劳自己。花1000元买了心仪已久的东西。心情+15。", "success");
        }
      }
    },
    choices: [
      { text: "📈 拿一部分去投资(投资意识+会计XP)", id: "invest" },
      { text: "💰 存银行(30%现金转存款+心智)", id: "save" },
      { text: "🛍️ 犒劳自己(花1000元,心情+15)", id: "treat_self" },
    ],
    icons: ["💵", "薪水"],
  };

  // ===== ③ C→G: 职业倦怠 =====
  // 倦怠值≥70触发健康预警叙事
  var burnout_health_warning = {
    id: "burnout_health_warning",
    title: "身体在抗议",
    phase: "street",
    repeatable: true,
    priority: 85,
    conditions: function (st) {
      if (!st || !st.flags || !st.career || !st.career.currentJob) return false;
      if (st.flags._burnoutWarningCooldown) {
        if ((st.player.day || 0) - st.flags._burnoutWarningCooldown < 60) return false;
      }
      var cap = st.careerCapital || (typeof ensureCareerCapital === "function" ? ensureCareerCapital(st) : null);
      if (!cap) return false;
      if ((cap.burnout || 0) < 70) return false; // [PLACEHOLDER] 倦怠门槛
      return true;
    },
    probability: 0.08,
    getStory: function (st) {
      var cap = st.careerCapital || {};
      var burnout = Math.round(cap.burnout || 0);
      var L = [];
      L.push("你已经连续高强度工作很久了。");
      L.push("");
      L.push("今天早上醒来，头痛欲裂。镜子里的自己眼圈发黑、脸色蜡黄。");
      L.push("");
      L.push("倦怠值已经到了" + burnout + "。身体在用最直白的语言告诉你：停下来。");
      L.push("");
      L.push("但下个月的房租、还有没还完的债——你停得下来吗？");
      return L.join("\n");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._burnoutWarningCooldown = st.player.day;
      if (choiceId === "rest") {
        // 休息: 倦怠-30, 心情+10, 健康+5
        var cap = st.careerCapital || {};
        cap.burnout = Math.max(0, (cap.burnout || 0) - 30);
        st.careerCapital = cap;
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        // [全系统自洽修复] 域C A类: st.player.health 死字段→st.status.health (健康真实路径)
        if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 5);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("😴 你决定给自己放个假。倦怠-30，心情+10，健康+5。", "success");
        }
      } else {
        // 硬扛: 心智+5, 但健康-8, 道德-3
        // [全系统自洽修复] 域C A类: st.player.health 死字段→st.status.health (健康真实路径)
        if (st.player) {
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
        }
        if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 8);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("💪 你咬咬牙继续干。心智+5，但健康-8，道德-3。", "warning");
        }
      }
    },
    choices: [
      { text: "😴 给自己放个假(倦怠-30,健康+5)", id: "rest" },
      { text: "💪 咬咬牙继续干(心智+5,健康-8)", id: "push" },
    ],
    icons: ["😫", "倦怠"],
  };

  RANDOM_EVENTS.push(career_promo_npc_reaction);
  RANDOM_EVENTS.push(salary_milestone_awakening);
  RANDOM_EVENTS.push(burnout_health_warning);

  if (typeof console !== "undefined" && console.log) {
    console.log("[C R231] 3 linkage events registered");
  }
})();
