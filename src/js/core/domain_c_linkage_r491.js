/**
 * 域C(职业/成长) 联动增强 R491
 * 桥接：
 *   C→G  c491_career_health_rhythm 职业健康节奏 → 消费 skills+needs 数据,
 *     工作→"找到工作与生活的平衡点"的健康叙事
 *   C→D  c491_career_colleague_tie 职业同事纽带 → 消费 skills+relationships 数据,
 *     职场→"那些一起加过班的战友"的同事情谊
 *   C→F  c491_skill_badge_ui      技能徽章UI → 消费 skills 数据,
 *     成就→"你的技能徽章"的成就展示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR491Loaded) return;
  RANDOM_EVENTS._domainCLinkageR491Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "c491_career_health_rhythm", phase: "corporate", _isChainEvent: false, icon: "⚖️",
      title: "工作生活平衡",
      story: "你发现最近工作太忙，忽略了生活——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_c491HealthRhythmCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c491HealthRhythmCooldown);
      },
      choices: [
        { text: "⚖️ 调整节奏", hint: "健康+2,疲劳-3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491HealthRhythmCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 3); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你决定以后不加班了——'工作是老板的，身体是自己的。' 健康+2,疲劳-3,心情+2。", "success");
        }},
        { text: "🏃 抽空运动", hint: "健康+2,疲劳+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491HealthRhythmCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⚖️ 你抽空去跑了跑步——虽然累，但出了一身汗之后，整个人都轻松了。健康+2,疲劳+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现最近工作太忙，忽略了生活——连续加班之后，你站在镜子前，看着自己疲惫的脸。";
      }
    },
    {
      id: "c491_career_colleague_tie", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "战友",
      story: "你和同事一起完成了一个艰难的项目——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c491ColleagueTieCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._c491ColleagueTieCooldown);
      },
      choices: [
        { text: "🤝 请团队吃饭", hint: "管理XP+5,团队忠诚+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491ColleagueTieCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 3); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你请团队吃了顿庆功宴——'谢谢大家这段时间的付出！' 酒杯碰撞声中，团队的感情更深了。管理XP+5,团队忠诚+3,心情+2。", "success");
        }},
        { text: "📝 写封感谢信", hint: "管理XP+3,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491ColleagueTieCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你给每位团队成员写了一封感谢信——'虽然只是几句话，但这是我的心意。' 管理XP+3,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你和同事一起完成了一个艰难的项目——'终于搞定了！' 大家击掌相庆。那些一起熬过的夜，成了你们共同的回忆。";
      }
    },
    {
      id: "c491_skill_badge_ui", phase: "corporate", _isChainEvent: false, icon: "🏅",
      title: "技能徽章",
      story: "你发现自己的技能已经达到了一定水平，值得一个徽章——{desc}",
      triggers: { minDay: 35, interval: 90, maxRepeats: 3, excludeFlags: ["_c491SkillBadgeCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c491SkillBadgeCooldown);
      },
      choices: [
        { text: "🏅 展示出来", hint: "管理XP+4,名气+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491SkillBadgeCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏅 你把技能徽章展示在了个人主页上——'这就是我的专业能力。' 管理XP+4,名气+2。", "success");
        }},
        { text: "📈 继续提升", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c491SkillBadgeCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏅 '一个徽章不够，我要集齐所有的。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现自己的技能已经达到了一定水平，值得一个徽章——'我的技能，值得被看见。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();