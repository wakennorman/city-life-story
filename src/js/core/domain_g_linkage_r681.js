/**
 * 域G(核心机制/生命周期) 联动增强 R681
 * 桥接：
 *   G→D  g681_life_milestone_social  人生里程碑社交 → 消费 state.player+state.relationships,
 *     人生节点与朋友分享,社交回响
 *   G→A  g681_quantified_self_v2     量化自我v2 → 消费 state.player+state.status+state.needs,
 *     综合数据画像叙事
 *   G→C  g681_life_stage_career       人生阶段职业 → 消费 state.player+state.employment,
 *     年龄节点触发职业反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR681Loaded) return;
  RANDOM_EVENTS._domainGLinkageR681Loaded = true;

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -999;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && r.met && typeof r.affinity === "number" && r.affinity > bestAff) {
        bestAff = r.affinity; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "g681_life_milestone_social",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "人生节点的分享",
      story: "你想把这个人生节点分享给朋友",
      triggers: { minDay: 100, interval: 120, maxRepeats: 3, excludeFlags: ["_g681SocialCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g681SocialCd) return false;
        if (!st.relationships) return false;
        var met = false;
        for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) { met = true; break; } }
        return met && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🎉 告诉好朋友",
          hint: "好感+3,心情+6,置_g681Shared",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681SocialCd = true;
            st.flags._g681Shared = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            bumpAff(st, topMetNpc(st), 3, "分享人生节点");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 快乐因为分享而加倍。心情+6,朋友好感+3。", "success");
            }
          }
        },
        {
          text: "🤫 默默记住",
          hint: "心智+5,置_g681Silent(内省)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681SocialCd = true;
            st.flags._g681Silent = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 有些时刻,独自铭记更珍贵。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "又是一个人生节点——'要是能跟朋友分享这一刻就好了。'";
      }
    },
    {
      id: "g681_quantified_self_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🔬",
      title: "量化自我",
      story: "你开始用数据审视自己的人生",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_g681QuantCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g681QuantCd) return false;
        return st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📊 做健康复盘",
          hint: "健康+3,心智+4,置_g681HealthReview",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681QuantCd = true;
            st.flags._g681HealthReview = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 了解自己,是改变的第一步。健康+3,心智+4。", "success");
            }
          }
        },
        {
          text: "💰 做财务复盘",
          hint: "会计XP+5,智力+3,置_g681FinanceReview",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681QuantCd = true;
            st.flags._g681FinanceReview = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 记账是理财的第一步。会计XP+5,智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var health = (st.status && st.status.health) || 0;
        return "第" + day + "天,健康" + health + "%——'如果人生有仪表盘,现在各项指标如何?'";
      }
    },
    {
      id: "g681_life_stage_career",
      phase: "street",
      _isChainEvent: false,
      icon: "🔄",
      title: "人生阶段的职业反思",
      story: "站在人生节点上,你开始思考职业方向",
      triggers: { minDay: 180, interval: 200, maxRepeats: 2, excludeFlags: ["_g681CareerCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g681CareerCd) return false;
        return st.employment && st.employment.currentJob && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🎯 深耕当前领域",
          hint: "管理XP+6,置_g681DeepDive",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681CareerCd = true;
            st.flags._g681DeepDive = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 慢即是快,深耕出时间壁垒。管理XP+6。", "success");
            }
          }
        },
        {
          text: "🌱 探索新方向",
          hint: "智力+5,社交XP+3,置_g681Explore",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g681CareerCd = true;
            st.flags._g681Explore = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 树挪死人挪活,看看别的可能。智力+5,社交XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var job = st.employment && st.employment.currentJob && st.employment.currentJob.title;
        return "做" + (job ? job : "这份工作") + "已经半年多了——'是该继续深耕,还是看看别的机会?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
