/**
 * 域F(UI/UX) 联动增强 R599
 * 桥接：
 *   F→D  f599_ui_social_reminder  UI社交提醒 → 消费 relationships+player 数据,
 *     UI→"社交互动提醒"的社交回响
 *   F→G  f599_ui_health_warning  UI健康预警 → 消费 needs+status 数据,
 *     UI→"健康状态可视化预警"的生命回响
 *   F→C  f599_ui_skill_progress  UI技能进度 → 消费 skills 数据,
 *     UI→"技能成长可视化"的职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR599Loaded) return;
  RANDOM_EVENTS._domainFLinkageR599Loaded = true;

  var EVENTS = [
    // ====== F→D: UI社交提醒 ======
    {
      id: "f599_ui_social_reminder", phase: "street", _isChainEvent: false, icon: "📱",
      title: "社交提醒",
      story: "手机弹出提醒——你很久没联系某个朋友了——{desc}",
      triggers: { minDay: 10, interval: 45, maxRepeats: 10, excludeFlags: ["_f599SocialReminderCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f599SocialReminderCooldown) return false;
        if (!st.relationships) return false;
        // 找最近没联系的朋友
        var today = st.player ? st.player.day : 0;
        for (var k in st.relationships) {
          var r = st.relationships[k];
          if (r && r.met && r.affinity >= 30 && r._lastInteractionDay && (today - r._lastInteractionDay) >= 14) {
            return true;
          }
        }
        return false;
      },
      choices: [
        { text: "📞 打个电话问候", hint: "好感+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599SocialReminderCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var today = st.player ? st.player.day : 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && r.affinity >= 30 && r._lastInteractionDay && (today - r._lastInteractionDay) >= 14) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, k, 5, "电话问候"); } catch(e) {}
              }
              break;
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 '喂?好久不见!最近怎么样?' 一个电话,拉近了距离。好感+5,心情+3。", "success");
        }},
        { text: "💬 发条微信", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599SocialReminderCooldown = true;
          var today = st.player ? st.player.day : 0;
          for (var k in (st.relationships || {})) {
            var r = st.relationships[k];
            if (r && r.met && r.affinity >= 30 && r._lastInteractionDay && (today - r._lastInteractionDay) >= 14) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, k, 2, "微信问候"); } catch(e) {}
              }
              break;
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 '最近还好吗?' 一条简单的问候,让友谊保持温度。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var today = st.player ? st.player.day : 0;
        for (var k in (st.relationships || {})) {
          var r = st.relationships[k];
          if (r && r.met && r.affinity >= 30 && r._lastInteractionDay && (today - r._lastInteractionDay) >= 14) {
            var name = (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k;
            return "手机弹出提醒:'你已经" + (today - r._lastInteractionDay) + "天没联系" + name + "了。' 你看着屏幕,有些愧疚。";
          }
        }
        return null;
      }
    },

    // ====== F→G: UI健康预警 ======
    {
      id: "f599_ui_health_warning", phase: "street", _isChainEvent: false, icon: "⚠️",
      title: "健康预警",
      story: "你的身体发出了一些警告信号——{desc}",
      triggers: { minDay: 15, interval: 60, maxRepeats: 8, excludeFlags: ["_f599HealthWarningCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f599HealthWarningCooldown) return false;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return health < 50 || fatigue > 70;
      },
      choices: [
        { text: "🏥 去医院检查", hint: "健康+15,现金-500,疲劳-10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599HealthWarningCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 15);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 医生说你只是太累了,需要休息。'年轻人,身体是革命的本钱啊!' 健康+15,疲劳-10,现金-500。", "success");
        }},
        { text: "😴 好好睡一觉", hint: "疲劳-20,健康+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599HealthWarningCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚠️ 你关掉手机,拉上窗帘,狠狠地睡了一觉。醒来时感觉世界都明亮了。疲劳-20,健康+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return "你的身体发出警告:健康值" + health + ",疲劳度" + fatigue + "。'注意身体,别太拼了。' 也许该休息一下了。";
      }
    },

    // ====== F→C: UI技能进度 ======
    {
      id: "f599_ui_skill_progress", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能成长报告",
      story: "你查看了一下自己的技能成长情况——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 10, excludeFlags: ["_f599SkillProgressCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._f599SkillProgressCooldown) return false;
        if (!st.skills) return false;
        for (var sk in st.skills) {
          if (st.skills[sk] && st.skills[sk].level >= 10) return true;
        }
        return false;
      },
      choices: [
        { text: "🎯 继续练习最强技能", hint: "最强技能XP+10,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599SkillProgressCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var bestSkill = "sales";
          var bestLevel = 0;
          if (st.skills) {
            for (var sk in st.skills) {
              if (st.skills[sk] && st.skills[sk].level > bestLevel) { bestSkill = sk; bestLevel = st.skills[sk].level; }
            }
          }
          if (typeof addSkillXp === "function") { try { addSkillXp(bestSkill, 10); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '熟能生巧,继续加油!' 你的" + bestSkill + "技能又进步了。最强技能XP+10,心智+2。", "success");
        }},
        { text: "📚 补短板练弱项", hint: "最弱技能XP+15,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f599SkillProgressCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var worstSkill = "sales";
          var worstLevel = 999;
          if (st.skills) {
            for (var sk in st.skills) {
              if (st.skills[sk] && st.skills[sk].level < worstLevel) { worstSkill = sk; worstLevel = st.skills[sk].level; }
            }
          }
          if (typeof addSkillXp === "function") { try { addSkillXp(worstSkill, 15); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '木桶能装多少水,取决于最短的那块板。' 你开始恶补弱项。最弱技能XP+15,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var bestSkill = "技能", bestLevel = 0;
        if (st.skills) {
          for (var sk in st.skills) {
            if (st.skills[sk] && st.skills[sk].level > bestLevel) { bestSkill = sk; bestLevel = st.skills[sk].level; }
          }
        }
        return "你打开技能面板,查看自己的成长情况。最强的" + bestSkill + "已经达到Lv." + bestLevel + "了。'进步不错,但还有很长的路要走。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();