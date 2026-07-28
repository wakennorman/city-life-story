/**
 * 域C(职业/成长) 联动增强 R709
 * 桥接：
 *   C→A  c709_career_market_intel       职业市场情报 → 消费 state.skills,
 *     技能等级影响职业市场情报质量
 *   C→D  c709_career_network_boost      职业人脉网络 → 消费 state.player.corporate,
 *     职场晋升带来社交圈扩展
 *   C→G  c709_career_life_balance       职业生涯平衡 → 消费 state.player+state.needs,
 *     高压职业影响生活品质
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR709Loaded) return;
  RANDOM_EVENTS._domainCLinkageR709Loaded = true;

  function getBestSkill(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var s = st.skills[k];
      if (s && typeof s.level === "number" && s.level > bestLv) {
        bestLv = s.level; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "c709_career_market_intel", phase: "street", _isChainEvent: false, icon: "📊",
      title: "职业市场情报",
      story: "你的技能在市场上值多少钱——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 3, excludeFlags: ["_c709IntelCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c709IntelCd) return false;
        return st.skills && st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "📈 提升热门技能", hint: "最高技能XP+8,置_c709HotSkill",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709IntelCd = true;
            st.flags._c709HotSkill = true;
            var best = getBestSkill(st);
            if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 市场需要什么,你就学什么。最高技能XP+8。", "success");
            }
          }
        },
        {
          text: "🔍 研究行业趋势", hint: "智力+5,管理XP+2,置_c709Research",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709IntelCd = true;
            st.flags._c709Research = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 了解行业趋势,才能把握先机。智力+5,管理XP+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var best = getBestSkill(st);
        return "技能'" + (best || "无") + "'——'你的价值,由市场决定。'";
      }
    },
    {
      id: "c709_career_network_boost", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "职场人脉网络",
      story: "晋升不只是能力的认可,也是人脉的扩展——{desc}",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_c709NetCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c709NetCd) return false;
        return st.player && st.player.corporate && st.player.day >= 100;
      },
      choices: [
        {
          text: "🎯 拓展人脉", hint: "社交XP+6,好感+3,置_c709Networking",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709NetCd = true;
            st.flags._c709Networking = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof applyAffinityChange === "function") {
              var npcs = ["boss_li", "xiao_mei", "zhaojie", "old_zhou"];
              for (var _ni = 0; _ni < npcs.length; _ni++) {
                try { applyAffinityChange(st, npcs[_ni], 3, "职场人脉"); } catch(e) {}
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 职场人脉就是你的护城河。社交XP+6,好感+3。", "success");
            }
          }
        },
        {
          text: "📚 提升专业度", hint: "管理XP+5,会计XP+3,置_c709Professional",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709NetCd = true;
            st.flags._c709Professional = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 专业能力是立身之本。管理XP+5,会计XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "'你的网络,就是你的净值。'——职场多年的感悟。";
      }
    },
    {
      id: "c709_career_life_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "工作与生活的平衡",
      story: "拼命工作,还是好好生活——{desc}",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_c709BalanceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c709BalanceCd) return false;
        return st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "🧘 放慢节奏", hint: "健康+4,疲劳-10,置_c709SlowDown",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709BalanceCd = true;
            st.flags._c709SlowDown = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 慢下来,才能走得更远。健康+4,疲劳-10。", "success");
            }
          }
        },
        {
          text: "🔥 继续拼搏", hint: "管理XP+6,疲劳+8,置_c709Hustle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c709BalanceCd = true;
            st.flags._c709Hustle = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 年轻就是用来拼的。管理XP+6,疲劳+8。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return "疲劳" + fatigue + "%——'工作是为了更好的生活,还是为了活着而工作?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();