/**
 * 域C(职业/成长) 联动增强 R489
 * 选题依据：career_dev.js 写入但全库零事件消费的三个真实 flag 首消费：
 *   C→E  c489_salary_alloc        flags._highSalaryInvestor(月薪≥2万时置位,写后零读)首消费 →
 *     高薪职场人的第一次资产配置复盘,置 _dataInvestorMindset(真实活跃flag)
 *   C→D  c489_burnout_share       flags._burnoutSurvivor(倦怠从高位恢复到≤20时置位,仅成就读)首事件消费 →
 *     倦怠幸存者向好友分享经历,applyAffinityChange 正反馈
 *   C→G  c489_occu_health_wakeup  flags._hasOccupationalDisease(职业病触发置位,仅成就读)首事件消费 →
 *     职业病确诊后的健康觉醒,职业代价→健康管理叙事闭环
 * 防御：met检查 / status.health真实路径 / addSkillXp真实键(accounting/medicine) / ||守卫 / 一次性cooldown flag
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR489Loaded) return;
  RANDOM_EVENTS._domainCLinkageR489Loaded = true;

  // 找一个已认识且好感≥30的NPC（遍历 relationships，避免依赖未实现的具名NPC）
  function findCloseNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = 29;
    for (var nid in st.relationships) {
      var rel = st.relationships[nid];
      if (rel && rel.met && (rel.affinity || 0) > bestAff) {
        bestAff = rel.affinity || 0;
        best = nid;
      }
    }
    return best;
  }

  function npcName(st, nid) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(st, nid) || "朋友"; } catch (e) { return "朋友"; }
    }
    return "朋友";
  }

  var EVENTS = [
    {
      id: "c489_salary_alloc", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "高薪之后",
      story: "月薪上了两万之后，你第一次认真思考：钱该往哪儿放？——{desc}",
      triggers: { minDay: 100, interval: 90, maxRepeats: 2, excludeFlags: ["_c489SalaryAllocDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._highSalaryInvestor) return false; // [联动] 首消费 career_dev.js 写入的死flag
        if (!st.resources || (st.resources.bankBalance || 0) < 10000) return false;
        return !st.flags._c489SalaryAllocDone;
      },
      choices: [
        { text: "📈 建立数据化投资框架", hint: "投资心态觉醒,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489SalaryAllocDone = true;
          st.flags._dataInvestorMindset = true; // C→E: 接入投资域真实活跃flag
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你把收入按比例拆成应急金、稳健仓和风险仓——'工资是本金，纪律是复利。' 数据化投资心态觉醒，会计XP+2。", "success");
        }},
        { text: "🛡️ 先存半年应急金", hint: "心智+3,存款习惯", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489SalaryAllocDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ 你决定先把半年生活费存进银行——'先立于不败之地，再谈进攻。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        var bank = st && st.resources ? Math.floor(st.resources.bankBalance || 0) : 0;
        return "高薪给了你底气，账上已有 ¥" + bank.toLocaleString() + "。工资到账只是开始，让钱流向哪里才是本事。";
      }
    },
    {
      id: "c489_burnout_share", phase: "street", _isChainEvent: false, icon: "🕯️",
      title: "走出倦怠的人",
      story: "你曾经被职业倦怠压得喘不过气，如今终于走了出来——{desc}",
      triggers: { minDay: 80, interval: 80, maxRepeats: 2, excludeFlags: ["_c489BurnoutShareDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._burnoutSurvivor) return false; // [联动] 首事件消费(此前仅成就读)
        if (!findCloseNpc(st)) return false; // met+好感≥30守卫
        return !st.flags._c489BurnoutShareDone;
      },
      choices: [
        { text: "☕ 约TA聊聊这段经历", hint: "好感提升,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489BurnoutShareDone = true;
          var nid = findCloseNpc(st);
          if (nid && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, nid, 5, "分享走出倦怠的经历"); } catch (e) {}
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☕ 你和" + npcName(st, nid) + "聊了那段最难的日子——'说出来的那一刻，它就不再是包袱了。' 好感+5,心智+2。", "success");
        }},
        { text: "📝 写成匿名帖子", hint: "名气+3,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489BurnoutShareDone = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📝 你把经历写成帖子发了出去，评论区很多人说'这就是我'——'你熬过的夜，照亮了别人的路。' 名气+3,心情+3。", "success");
        }}
      ],
      text: function (st) {
        var nid = findCloseNpc(st);
        return "从倦怠低谷爬出来之后，你总觉得该做点什么。" + (nid ? npcName(st, nid) + "最近似乎也在被工作消耗着。" : "也许你的经历能帮到别人。");
      }
    },
    {
      id: "c489_occu_health_wakeup", phase: "street", _isChainEvent: false, icon: "🩺",
      title: "职业的代价",
      story: "体检报告上的那一行字，是这些年拼命工作留下的印记——{desc}",
      triggers: { minDay: 120, interval: 100, maxRepeats: 2, excludeFlags: ["_c489OccuHealthDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._hasOccupationalDisease) return false; // [联动] 首事件消费(此前仅成就读)
        if (!st.status || (st.status.health || 70) >= 70) return false; // 真实路径 status.health
        return !st.flags._c489OccuHealthDone;
      },
      choices: [
        { text: "🏥 系统性康复计划", hint: "现金-800,健康+8,医术XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489OccuHealthDone = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 8);
          if (typeof addSkillXp === "function") { try { addSkillXp("medicine", 2); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 你制定了康复计划：理疗+作息+复查——'身体记着你欠它的每一笔账。' 现金-800,健康+8,医术XP+2。", "success");
        }},
        { text: "⚖️ 调整工作强度", hint: "健康+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c489OccuHealthDone = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你开始拒绝无意义的消耗，把健康排进日程表——'工作是马拉松，不是百米冲刺。' 健康+4,心智+2。", "success");
        }}
      ],
      text: function (st) {
        var hp = st && st.status ? Math.floor(st.status.health || 0) : 0;
        return "职业病确诊后，你的健康值只剩 " + hp + "。医生说：'再这么干下去，赚的钱都得还给医院。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
