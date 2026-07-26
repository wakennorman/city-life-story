/**
 * 域G(核心机制/生命周期) 联动增强 R391
 * 第十七轮循环——时间的积累不仅推进状态机，也在社交/职业/公司层面沉淀出"人生资历"。
 * 桥接：
 *   G→D  life_community_roots_r391    在城市扎根久了→主动维系老邻里（守 rel.met 铁律，applyAffinityChange）
 *   G→C  life_career_marathon_r391    职业长跑沉淀→经验转化为管理心得（addSkillXp management，真实键）
 *   G→H  life_founder_retrospect_r391 创始人回望创业路→格局沉淀（management XP + upward，条件 corporate/startup 存在）
 *
 * 全事件：显式 phase、|| 防御、[PLACEHOLDER] 数值占位、id 唯一(g_r391_ 前缀)。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR391Loaded) return;
  RANDOM_EVENTS._domainGLinkageR391Loaded = true;

  // 取首个"已结识"的 NPC（严守域D铁律：rel && rel.met）
  function firstMetNpcR391(st) {
    var rels = st && st.relationships;
    if (!rels || typeof rels !== "object") return null;
    for (var id in rels) {
      if (!Object.prototype.hasOwnProperty.call(rels, id)) continue;
      var rel = rels[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  // 安全好感变更：优先走 applyAffinityChange(state, npcId, change, reason)
  function bumpAffinityR391(st, npcId, change, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "");
      return;
    }
    // 兜底：直接写（仅在 applyAffinityChange 不可用时）
    var rel = st.relationships && st.relationships[npcId];
    if (rel && rel.met) {
      rel.affinity = Math.max(0, Math.min(100, (rel.affinity || 0) + change));
    }
  }

  // 安全技能经验：addSkillXp(skillKey, amount) 读全局 state，假键静默丢弃
  function grantSkillXpR391(key, amount) {
    if (typeof addSkillXp === "function") {
      addSkillXp(key, amount);
    }
  }

  var EVENTS = [
    {
      // ---- G→D：核心机制(时间积累)→社交(老邻里维系) ----
      id: "g_r391_life_community_roots",
      phase: "street",
      _isChainEvent: false,
      icon: "🏘️",
      title: "扎根这座城",
      story: "不知不觉，你在这座城市已经住了很久。\n\n楼下小店的老板会跟你点头，隔壁的邻居见面会打招呼——你不再是那个刚来时谁都不认识的外乡人。\n\n你想，是时候主动去维系这些一点点攒下来的关系了。\n\n「城市很大，但真正让你觉得踏实的，是那几张熟悉的面孔。」",
      triggers: { minDay: 40, excludeFlags: ["_lifeCommunityRootsR391Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var dayOk = !!(st.player && (st.player.day || 0) >= 40);
        return dayOk && !!firstMetNpcR391(st);
      },
      choices: [
        {
          text: "🏘️ 主动串门维系老邻里",
          hint: "老熟人好感提升，心情回暖",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCommunityRootsR391Seen = true;
            st.flags._communityRooted = true; // || 防御可读 flag
            var npcId = firstMetNpcR391(st);
            bumpAffinityR391(st, npcId, /* [PLACEHOLDER] */ 6, "扎根社区·主动维系老邻里");
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + /* [PLACEHOLDER] */ 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + /* [PLACEHOLDER] */ 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏘️ 你主动维系了老邻里的关系。这座城市，你已经扎下了根。好感提升，心情+5。", "success");
            }
          },
        },
        {
          text: "🚶 顺其自然",
          hint: "心情+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCommunityRootsR391Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + /* [PLACEHOLDER] */ 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🚶 你选择顺其自然。缘分到了自然会亲近。心情+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // ---- G→C：核心机制(职业长跑)→职业成长(经验沉淀为管理心得) ----
      id: "g_r391_life_career_marathon",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🎓",
      title: "职业长跑",
      story: "回头看，你在职业这条路上已经跑了很长一段。\n\n从最初的手忙脚乱，到如今能沉住气把事情一件件理清——那些踩过的坑、扛过的活，都变成了你身上看不见的功夫。\n\n有人问你诀窍，你笑了笑：「哪有什么诀窍，都是日子一天天熬出来的经验。」\n\n经验，正在悄悄沉淀成一种叫「管理」的心得。",
      triggers: { minDay: 90, excludeFlags: ["_lifeCareerMarathonR391Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && (st.player.day || 0) >= 90);
      },
      choices: [
        {
          text: "🎓 把经验梳理成方法",
          hint: "管理经验提升，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMarathonR391Seen = true;
            st.flags._careerMarathonWisdom = true;
            grantSkillXpR391("management", /* [PLACEHOLDER] */ 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + /* [PLACEHOLDER] */ 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎓 你把多年经验梳理成了方法论。经验沉淀成管理心得。管理经验+8，心智+4。", "success");
            }
          },
        },
        {
          text: "☕ 埋头继续干",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMarathonR391Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + /* [PLACEHOLDER] */ 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("☕ 你埋头继续干。经验会在不知不觉中沉淀。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // ---- G→H：核心机制(创业生命周期)→公司(创始人格局沉淀) ----
      id: "g_r391_life_founder_retrospect",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "创始人的回望",
      story: "夜深了，办公室只剩你一个人。\n\n你翻着这一路走来的记录：第一笔订单、第一次发薪、第一次熬过危机……创业从来不是一条直线，而是无数个坎连成的路。\n\n回望走过的每一步，你忽然对「格局」这两个字有了新的理解——它不是喊出来的，是熬出来的。\n\n「能走到今天，靠的不是运气，是把每一个坎都当成台阶。」",
      triggers: { minDay: 60, excludeFlags: ["_lifeFounderRetrospectR391Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var hasCorp = !!(st.corporate && st.corporate.company);
        var hasStartup = !!(st.startup && st.startup.company);
        return hasCorp || hasStartup;
      },
      choices: [
        {
          text: "🏛️ 沉淀经营格局",
          hint: "管理经验提升，进取心增强，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeFounderRetrospectR391Seen = true;
            st.flags._founderRetrospected = true;
            grantSkillXpR391("management", /* [PLACEHOLDER] */ 10);
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + /* [PLACEHOLDER] */ 4);
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + /* [PLACEHOLDER] */ 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你回望了创业路，沉淀出经营格局。管理经验+10，进取心增强，心智+4。", "success");
            }
          },
        },
        {
          text: "🌙 收拾东西回家",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeFounderRetrospectR391Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + /* [PLACEHOLDER] */ 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌙 你收拾东西回家了。路还长，明天继续。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
