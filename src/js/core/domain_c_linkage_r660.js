/**
 * 域C(职业/成长) 联动增强 R660
 * 桥接：
 *   C→B  c660_career_story_chapter  职业故事章节 → 消费 state.career+state.player 数据,
 *     职业→"职业历程中的故事"的叙事回响
 *   C→E  c660_skill_monetization  技能货币化 → 消费 state.skills+state.resources 数据,
 *     职业→"技能直接变现"的经济回响
 *   C→G  c660_work_life_balance  工作生活平衡 → 消费 state.career+state.needs+state.status 数据,
 *     职业→"长期工作的身心代价"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR660Loaded) return;
  RANDOM_EVENTS._domainCLinkageR660Loaded = true;

  var EVENTS = [
    // ====== C→B: 职业故事章节 ======
    {
      id: "c660_career_story_chapter", phase: "street", _isChainEvent: false, icon: "📖",
      title: "职业故事",
      story: "你回顾自己的职业生涯,发现每一段经历都是一个故事——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 6, excludeFlags: ["_c660CareerStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c660CareerStoryCooldown) return false;
        return st.career && st.career.history && st.career.history.length >= 1;
      },
      choices: [
        { text: "📝 写下这段经历", hint: "心智+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660CareerStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你把自己的职业经历写成了故事。'每一份工作,都是一本书。' 心智+5,心情+3。", "success");
        }},
        { text: "🗣️ 讲给朋友听", hint: "好感+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660CareerStoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 5, "分享职业故事"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '你们知道吗,我当年...' 朋友们听得津津有味。好感+5,心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.history) return null;
        var count = st.career.history.length;
        var last = st.career.history[count - 1];
        var event = (last && last.event) || "一段难忘的经历";
        return "你的职业生涯已经历了" + count + "个重要节点。最近的是:'" + event + "'。'每一段路,都是一种领悟。'";
      }
    },

    // ====== C→E: 技能货币化 ======
    {
      id: "c660_skill_monetization", phase: "street", _isChainEvent: false, icon: "💵",
      title: "技能变现",
      story: "有人愿意为你的技能付费——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_c660SkillMonetizationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c660SkillMonetizationCooldown) return false;
        if (!st.skills) return false;
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].level >= 15) return true;
        }
        return false;
      },
      choices: [
        { text: "💼 接单干活", hint: "收入¥500-2000,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660SkillMonetizationCooldown = true;
          var earn = 500 + Random.int(0, 1500);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💵 '你的活儿干得不错,下次还找你!' 你靠技能赚了¥" + earn.toLocaleString() + "。累并快乐着。疲劳+10。", "success");
        }},
        { text: "🎓 收徒教学", hint: "收入¥300-800,名气+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660SkillMonetizationCooldown = true;
          var earn = 300 + Random.int(0, 500);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + earn;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💵 '师父,这个怎么做?' 你教别人学会了技能,赚了¥" + earn.toLocaleString() + "。名气+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var best = "技能", bestLv = 0;
        for (var s in st.skills) {
          if (st.skills[s] && st.skills[s].level > bestLv) { best = s; bestLv = st.skills[s].level; }
        }
        return "你的" + best + "技能(Lv." + bestLv + ")在圈子里开始有了名气。有人找你干活,也有人想跟你学。'技能,就是最好的货币。'";
      }
    },

    // ====== C→G: 工作生活平衡 ======
    {
      id: "c660_work_life_balance", phase: "street", _isChainEvent: false, icon: "⚖️",
      title: "平衡之道",
      story: "你开始意识到,工作不是生活的全部——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 5, excludeFlags: ["_c660WorkLifeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c660WorkLifeCooldown) return false;
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 60;
      },
      choices: [
        { text: "🏖️ 请一天假", hint: "疲劳-20,心情+10,健康+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660WorkLifeCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你请了一天假,好好休息了一下。'工作永远做不完,但身体是自己的。' 疲劳-20,心情+10,健康+3。", "success");
        }},
        { text: "🎯 提高工作效率", hint: "心智+5,疲劳-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c660WorkLifeCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你优化了工作方法,效率提高了不少。'聪明地工作,比拼命工作更重要。' 心智+5,疲劳-5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.currentJob) return null;
        var days = st.career.currentJob.workDays || 0;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return "你已经连续工作了" + days + "天,健康值" + health + ",疲劳度" + fatigue + "。'再这样下去,身体会垮的。' 你开始思考工作与生活的平衡。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();