/**
 * 域G(核心机制/生命周期) 联动增强 R664
 * 桥接：
 *   G→B  g664_life_chapter_event  人生章节事件 → 消费 state.player.day+state.flags 数据,
 *     生命周期→"人生章节触发叙事"的叙事回响
 *   G→E  g664_daily_cost_awareness  日常开销意识 → 消费 state.player.day+state.resources 数据,
 *     生命周期→"时间流逝带来开销变化"的经济回响
 *   G→C  g664_skill_plateau_career  技能瓶颈职业 → 消费 state.skills+state.career 数据,
 *     生命周期→"技能瓶颈触发职业思考"的职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR664Loaded) return;
  RANDOM_EVENTS._domainGLinkageR664Loaded = true;

  var EVENTS = [
    // ====== G→B: 人生章节事件 ======
    {
      id: "g664_life_chapter_event", phase: "street", _isChainEvent: false, icon: "📖",
      title: "人生章节",
      story: "每过一段时间,人生就会翻开新的篇章——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 6, excludeFlags: ["_g664LifeChapterCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g664LifeChapterCooldown) return false;
        return true;
      },
      choices: [
        { text: "📝 总结这一章", hint: "心智+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664LifeChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '这一章,有泪水也有欢笑。' 你回顾着这段时间的经历,心中感慨万千。心智+5,心情+5。", "success");
        }},
        { text: "🎯 规划下一章", hint: "心智+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664LifeChapterCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '下一章,我要写得更好。' 你开始规划未来。心智+5,智力+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        var years = Math.floor(day / 365);
        var months = Math.floor((day % 365) / 30);
        return "第" + day + "天——你在这座城市已经生活了" + (years > 0 ? years + "年零" : "") + months + "个月。'每一段旅程,都是人生的一章。' 你翻开新的一页。";
      }
    },

    // ====== G→E: 日常开销意识 ======
    {
      id: "g664_daily_cost_awareness", phase: "street", _isChainEvent: false, icon: "💸",
      title: "日常开销",
      story: "日复一日的生活,开销在悄悄累积——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 12, excludeFlags: ["_g664DailyCostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g664DailyCostCooldown) return false;
        return true;
      },
      choices: [
        { text: "📊 算算每日开销", hint: "智力+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664DailyCostCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💸 '每天吃饭¥50,房租¥30,交通¥20...不算不知道,一算吓一跳!' 智力+4,心智+2。", "success");
        }},
        { text: "💰 想办法省点", hint: "心智+5,省下¥500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664DailyCostCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 500;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💸 你决定自己做饭代替外卖,每天能省不少钱。'省到就是赚到!' 心智+5,省下¥500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = st.player ? st.player.day : 0;
        return "第" + day + "天了。你发现每天的生活开销虽然不大,但累积起来却是一笔不小的数目。'不知不觉,已经花了这么多钱在日复一日的生活里。'";
      }
    },

    // ====== G→C: 技能瓶颈职业 ======
    {
      id: "g664_skill_plateau_career", phase: "street", _isChainEvent: false, icon: "📈",
      title: "技能瓶颈",
      story: "你发现自己的技能提升越来越慢了——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 5, excludeFlags: ["_g664SkillPlateauCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g664SkillPlateauCooldown) return false;
        if (!st.skills) return false;
        for (var s in st.skills) {
          if (st.skills[s] && st.skills[s].level >= 30) return true;
        }
        return false;
      },
      choices: [
        { text: "🎓 找老师突破瓶颈", hint: "随机技能XP+15,智力+3,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664SkillPlateauCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          var allSkills = ["cooking","repair","sales","coding","accounting","medicine","education","art","electrician","welding","agility","strength","social"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(allSkills), 15); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '瓶颈期需要名师指点。' 你报了一个进阶班。随机技能XP+15,智力+3,现金-500。", "success");
        }},
        { text: "🔄 换个方向", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g664SkillPlateauCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '此路不通,换条路走。' 你决定尝试新的技能方向。心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        var best = "技能", bestLv = 0;
        for (var s in st.skills) {
          if (st.skills[s] && st.skills[s].level > bestLv) { best = s; bestLv = st.skills[s].level; }
        }
        return "你的" + best + "技能达到了Lv." + bestLv + ",但最近感觉提升越来越慢。'技能瓶颈期到了,需要新的突破方法。' 你开始思考下一步。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();