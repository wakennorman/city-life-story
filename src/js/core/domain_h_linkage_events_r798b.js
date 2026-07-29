/**
 * 域H(Phase2/公司) 联动增强 R798b — 写-only flag 清账轮
 *   H→G  h798b_routine_payoff     _h698Sleep/_h698Focus(R698写-only)首读 → 作息/专注承诺在融资高压期兑现回报
 *   H→E  h798b_sprint_feedback    _h712bSprintPlan(R712b写-only)首读 → 深夜KPI方案被董事会采纳，信任与营收落地
 *   H→D  h798b_delegation_growth  _h712bDelegated(R712b写-only)首读 → 授权文化让团队独当一面，联动已见面NPC
 * 设计：峰终定律(承诺兑现是记忆峰值)+禀赋效应(玩家为自己过去的选择被系统记住而产生拥有感)。
 * 防御：st.startup.active 门控 / 全||守卫 / rel&&rel.met 铁律 / done-flag 防重 / morale typeof number 惰性守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR798bLoaded) return;
  RANDOM_EVENTS._domainHLinkageR798bLoaded = true;

  function co(st) {
    if (!st || !st.startup || !st.startup.active) return null;
    return st.startup.company || null;
  }

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  function npcName(st, id) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(st, id) || "老朋友"; } catch (e) {}
    }
    return "老朋友";
  }

  var EVENTS = [
    // ========================================================================
    // 联动1: H→G — _h698Sleep/_h698Focus 全库首读
    // 设计意图：R698「创始人健康」事件里选择调整作息/专注工作法的玩家，
    // 在融资尽调高压周得到生理与心智回报——承诺兑现，峰终定律。
    // ========================================================================
    {
      id: "h798b_routine_payoff",
      phase: "corporate",
      icon: "🌅",
      title: "尽调周的清晨六点半",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (!st.flags || (!st.flags._h698Sleep && !st.flags._h698Focus)) return false;
        if (st.flags._h798bRoutineDone) return false;
        var c = co(st);
        return !!c && st.player.day >= 200;
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "🌅 保持节奏，稳住这一周",
          hint: "健康+5,心智+6,置_h798bSteadyFounder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bRoutineDone = true;
            st.flags._h798bSteadyFounder = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌅 当年那个「先睡好觉」的决定，在尽调周救了你。健康+5，心智+6。", "success");
            }
          }
        },
        {
          text: "📈 把状态红利押进谈判桌",
          hint: "管理XP+8,心情+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bRoutineDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 投资人熬红了眼，你却思路清晰——好状态本身就是谈判筹码。管理XP+8，心情+4。", "success");
            }
          }
        }
      ],
      text: function (st) {
        var byFocus = st && st.flags && st.flags._h698Focus && !st.flags._h698Sleep;
        return "融资尽调第五天。对面的分析师连续熬了三个通宵，眼神涣散。而你——" +
          (byFocus ? "靠着那套坚持了很久的深度专注工作法" : "靠着当年立下的规律作息") +
          "，每天六点半自然醒，思路清爽得像刚擦过的玻璃。\n\n身体是最诚实的资产负债表，你很早就懂了。";
      }
    },

    // ========================================================================
    // 联动2: H→E — _h712bSprintPlan 全库首读
    // 设计意图：R712b「连夜做KPI冲刺方案」当晚没人回复，此处补上后续——
    // 方案被董事会采纳并落地，股东信任与营收兑现。损失厌恶的反面：付出被看见。
    // ========================================================================
    {
      id: "h798b_sprint_feedback",
      phase: "corporate",
      icon: "📊",
      title: "那份凌晨三点的方案",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (!st.flags || !st.flags._h712bSprintPlan) return false;
        if (st.flags._h798bSprintFbDone) return false;
        var c = co(st);
        return !!c;
      },
      probability: 0.14,
      repeatable: false,
      choices: [
        {
          text: "🙏 归功团队执行",
          hint: "股东信任+5,团队士气+4,心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bSprintFbDone = true;
            var c = co(st);
            if (c) {
              c.shareholderTrust = Math.min(100, (c.shareholderTrust || 50) + 5);
              if (typeof c.morale === "number") c.morale = Math.min(100, c.morale + 4);
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🙏 「方案是我写的，但把它跑通的是团队。」董事们记住了这句话。股东信任+5，心智+4。", "success");
            }
          }
        },
        {
          text: "💼 顺势争取更多授权",
          hint: "股东信任+3,管理XP+10,名气+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bSprintFbDone = true;
            var c = co(st);
            if (c) c.shareholderTrust = Math.min(100, (c.shareholderTrust || 50) + 3);
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 你借着方案落地的东风，拿到了下季度更大的决策权。股东信任+3，管理XP+10，名气+3。", "success");
            }
          }
        }
      ],
      text: function (st) {
        var c = co(st);
        var trust = c ? Math.round(c.shareholderTrust || 50) : 50;
        return "季度董事会上，主席翻开一份文件：「这份KPI冲刺方案，是上季度执行得最彻底的一份。」\n\n你认出来了——那是你凌晨三点发进董事群、当晚没有一个人回复的那份。\n\n原来他们都看了。当前股东信任 " + trust + "。";
      }
    },

    // ========================================================================
    // 联动3: H→D — _h712bDelegated 全库首读
    // 设计意图：R712b危机夜「授权团队自己去睡」的管理风格开花结果——
    // 团队独立平掉一次小型舆情，创始人得以做真正重要的事。联动已见面NPC。
    // ========================================================================
    {
      id: "h798b_delegation_growth",
      phase: "corporate",
      icon: "🤝",
      title: "你不在场，团队赢了",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (!st.flags || !st.flags._h712bDelegated) return false;
        if (st.flags._h798bDelegationDone) return false;
        var c = co(st);
        return !!c && Array.isArray(c.employees) && c.employees.length >= 2;
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "🎉 给团队发个小红包庆功",
          hint: "现金-800,团队士气+6,心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bDelegationDone = true;
            var cost = 800; // [PLACEHOLDER] 庆功红包
            if (st.resources && (st.resources.cash || 0) >= cost) {
              st.resources.cash -= cost;
              var c = co(st);
              if (c && typeof c.morale === "number") c.morale = Math.min(100, c.morale + 6);
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("🎉 红包不大，但「你们自己搞定的」这句话值钱。团队士气+6，心情+5。", "success");
              }
            } else {
              var c2 = co(st);
              if (c2 && typeof c2.morale === "number") c2.morale = Math.min(100, c2.morale + 3);
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("🎉 现金紧张，你在全员群里郑重致谢——心意到了。团队士气+3。", "info");
              }
            }
          }
        },
        {
          text: "🍵 约老朋友喝茶，聊聊放手的艺术",
          hint: "好感+5,心智+5,管理XP+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h798bDelegationDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch (e) {} }
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, nid, 5, "分享放手管理的心得"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                nid
                  ? "🍵 " + npcName(st, nid) + "听完笑了：「你终于学会当老板了。」好感+5，心智+5，管理XP+6。"
                  : "🍵 你在笔记本上写下：管理的尽头是信任。心智+5，管理XP+6。",
                "success"
              );
            }
          }
        }
      ],
      text: function (st) {
        var c = co(st);
        var n = c && Array.isArray(c.employees) ? c.employees.length : 0;
        return "出差第三天，你落地开机，发现公司群里炸过一轮又平息了——一次小型舆情，团队按预案自己处理完了，复盘文档都写好了。\n\n" + n + " 名员工，没有一个打电话给你。\n\n那个危机深夜「授权团队，自己去睡」的决定，今天长成了一支不需要你盯着的队伍。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
