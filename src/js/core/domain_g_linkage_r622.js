/**
 * 域G(核心机制/生命周期) 联动增强 R622
 * 桥接：
 *   G→A  g622_life_data_legacy  人生数据遗产 → 消费 state.stats+state.player+state.skills 数据,
 *     生命→"数字不会说谎"的数据回响
 *   G→D  g622_anniversary_npc_birthday  NPC生日纪念 → 消费 state.relationships+state.player 数据,
 *     生命→"记得你生日的人"社交回响
 *   G→C  g622_midlife_skill_assessment  中年技能盘点 → 消费 state.skills+state.player 数据,
 *     生命→"人到中年,还有什么牌"职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR622Loaded) return;
  RANDOM_EVENTS._domainGLinkageR622Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR622(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "g622_life_data_legacy", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生的数据画像",
      story: "你回顾这些日子的起起伏伏,发现数字记录了最真实的自己——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_g622DataLegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g622DataLegacyCooldown) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= 150;
      },
      choices: [
        { text: "📈 分析自己的数据", hint: "智力+3,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622DataLegacyCooldown = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '数据不会说谎。' 你分析了自己的成长轨迹,找到了规律。智力+3,心智+3。", "success");
        }},
        { text: "🎯 设定下阶段目标", hint: "心智+5,置_g622NextStageGoal", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622DataLegacyCooldown = true;
          st.flags._g622NextStageGoal = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '看清了现在,才能规划未来。' 你设定了下一阶段的目标。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var totalXp = 0;
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].xp === "number") totalXp += skills[k].xp;
        }
        return "你回顾这" + day + "天的起起伏伏,发现数字记录了最真实的自己——累计获得" + totalXp + "点技能经验,认识了" + metNpcsR622(st).length + "位朋友。你会怎么看待这些数据?";
      }
    },
    {
      id: "g622_anniversary_npc_birthday", phase: "street", _isChainEvent: false, icon: "🎂",
      title: "有人记得你的生日",
      story: "今天是个特别的日子——{desc}",
      triggers: { minDay: 365, interval: 365, maxRepeats: 1, excludeFlags: ["_g622BirthdayDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g622BirthdayDone) return false;
        var day = (st.player && st.player.day) || 0;
        var met = metNpcsR622(st);
        return day >= 365 && met.length >= 3;
      },
      choices: [
        { text: "🎂 请大家吃饭", hint: "心情+8,全已结识NPC好感+2,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622BirthdayDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          var met = metNpcsR622(st);
          if (typeof applyAffinityChange === "function") {
            for (var i = 0; i < met.length; i++) {
              try { applyAffinityChange(st, met[i].id, 2, "生日聚会"); } catch(e) {}
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎂 '谢谢大家记得。' 你请朋友们吃了顿饭,暖意融融。心情+8,全NPC好感+2,现金-¥500。", "success");
        }},
        { text: "🤫 独自安静度过", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622BirthdayDone = true;
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤫 '生日而已,不必声张。' 你安静地度过了一天,内心充盈。心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR622(st);
        var names = [];
        for (var i = 0; i < Math.min(3, met.length); i++) { names.push(met[i].name); }
        return "今天是你来到这座城市的第一个生日。" + names.join("、") + "等人都发来了祝福——'又一年了,你在这座城市还好吗?'";
      }
    },
    {
      id: "g622_midlife_skill_assessment", phase: "street", _isChainEvent: false, icon: "🃏",
      title: "人到中年,还有什么牌",
      story: "回首技能树,你开始认真盘算自己的资本——{desc}",
      triggers: { minDay: 300, interval: 250, maxRepeats: 1, excludeFlags: ["_g622AssessmentDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g622AssessmentDone) return false;
        var skills = st.skills || {};
        var highSkills = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 30) highSkills++;
        }
        return highSkills >= 2;
      },
      choices: [
        { text: "📊 认真盘点", hint: "心智+6,管理XP+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622AssessmentDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '知己知彼,百战不殆。' 你认真盘点了技能资本。心智+6,管理XP+4。", "success");
        }},
        { text: "💪 专攻最强技能", hint: "最高技能XP+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622AssessmentDone = true;
          var skills = st.skills || {};
          var best = null, bestLv = -1;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv > bestLv) { bestLv = lv; best = k; }
          }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 '一招鲜,吃遍天。' 你决定把最强的技能练到极致。最高技能XP+10。", "success");
        }},
        { text: "🔄 学一门新技能", hint: "随机低等级技能XP+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g622AssessmentDone = true;
          var skills = st.skills || {};
          var worst = null, worstLv = 999;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv < worstLv) { worstLv = lv; worst = k; }
          }
          if (worst && typeof addSkillXp === "function") { try { addSkillXp(worst, 8); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '多一条路,多一种可能。' 你决定补足短板。最低技能XP+8。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var skills = st.skills || {};
        var highSkills = [];
        var skillNames = { cooking:"厨艺", repair:"修理", coding:"编程", english:"英语", driving:"驾驶", sales:"销售", management:"管理", accounting:"会计", electrician:"电工", welding:"焊接", medicine:"医术", social:"社交" };
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 30) {
            highSkills.push((skillNames[k] || k) + "(Lv." + skills[k].level + ")");
          }
        }
        return "回首技能树,你已练就" + highSkills.length + "门拿得出手的本事" + (highSkills.length > 0 ? "(" + highSkills.slice(0, 3).join(", ") + ")" : "") + "——'人到中年,你还有什么牌可打?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
