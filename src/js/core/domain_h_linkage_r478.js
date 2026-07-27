/**
 * 域H(Phase2/公司) 联动增强 R478
 * 桥接：
 *   H→F  h478_corp_culture_wall   公司文化墙 → 消费 corporate 数据,
 *     公司价值观→"我们的文化是什么"的UI展示
 *   H→C  h478_corp_talent_growth  公司人才成长 → 消费 corporate+team 数据,
 *     团队培养→"带出比自己强的人"的领导力
 *   H→B  h478_corp_industry_news  公司行业新闻 → 消费 corporate+rank 数据,
 *     公司动态→"行业里怎么看我们"的叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR478Loaded) return;
  RANDOM_EVENTS._domainHLinkageR478Loaded = true;

  var EVENTS = [
    {
      id: "h478_corp_culture_wall", phase: "corporate", _isChainEvent: false, icon: "🏛️",
      title: "公司文化",
      story: "你决定把公司的价值观和文化整理出来——{desc}",
      triggers: { minDay: 55, interval: 180, maxRepeats: 3, excludeFlags: ["_h478CultureWallCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h478CultureWallCooldown);
      },
      choices: [
        { text: "🏛️ 提炼文化标语", hint: "管理XP+5,公司知名度+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478CultureWallCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏛️ 你提炼了公司的文化标语——'让每个人都能发光。' 这句话后来成了公司的名片。管理XP+5,公司知名度+3。", "success");
        }},
        { text: "📖 编写文化手册", hint: "管理XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478CultureWallCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏛️ 你编写了一本文化手册——'文化不是挂在墙上的标语，而是刻在每个人心里的东西。' 管理XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你决定把公司的价值观和文化整理出来——'我们是谁、我们要去哪里、我们相信什么。' 文化是公司的灵魂。";
      }
    },
    {
      id: "h478_corp_talent_growth", phase: "corporate", _isChainEvent: false, icon: "🌱",
      title: "青出于蓝",
      story: "你发现团队里有个年轻人成长得特别快——{desc}",
      triggers: { minDay: 45, interval: 120, maxRepeats: 3, excludeFlags: ["_h478TalentGrowthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 2) return false;
        return (st.flags && !st.flags._h478TalentGrowthCooldown);
      },
      choices: [
        { text: "🌱 重点培养", hint: "管理XP+5,团队忠诚+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478TalentGrowthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你决定重点培养这个年轻人——'带出比自己强的人，才是真正的领导力。' 管理XP+5,团队忠诚+2。", "success");
        }},
        { text: "🎯 给更多责任", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478TalentGrowthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你给了年轻人更多责任——'我相信你能做到。' 被信任的感觉，是最好的动力。管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现团队里有个年轻人成长得特别快——看着他，你仿佛看到了当年的自己。";
      }
    },
    {
      id: "h478_corp_industry_news", phase: "corporate", _isChainEvent: false, icon: "📰",
      title: "行业声音",
      story: "行业媒体对你们公司做了一篇报道——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_h478IndustryNewsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h478IndustryNewsCooldown);
      },
      choices: [
        { text: "📰 分享给团队", hint: "管理XP+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478IndustryNewsCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你把报道分享给了团队——'看，我们上新闻了！' 办公室里一片欢呼。管理XP+4,心情+3。", "success");
        }},
        { text: "📊 分析报道影响", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h478IndustryNewsCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你分析了报道可能带来的影响——'正面报道应该能带来一些新客户。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "行业媒体对你们公司做了一篇报道——标题写着'这家公司正在改变行业格局'。你看着报道，笑了笑。";
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