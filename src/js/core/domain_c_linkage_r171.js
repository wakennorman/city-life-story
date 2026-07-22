/**
 * 域C(职业/成长) 联动增强 R171
 * 桥接：C内部(技能连携里程碑引导) / C→D(前辈指点的职业联动)
 * 严格照 events_corp.js / domain_h_linkage_r170.js 已验证 IIFE 注入范式：
 *   phase:"street"、RANDOM_EVENTS 守卫、conditions 全字段防御、gameOver 闸门。
 * 引擎不自动扣 cost（仅禁用按钮），数值标 [PLACEHOLDER]，待平衡。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._careerLinkR171Loaded) return;
  RANDOM_EVENTS._careerLinkR171Loaded = true;

  // 统计当前已激活的连携数量（dual/triple/theme 三表）
  function _activeSynergyCount(st) {
    var ss = st && st.skillSynergies;
    if (!ss) return 0;
    var n = 0;
    n += (ss.dual && Object.keys(ss.dual).length) || 0;
    n += (ss.triple && Object.keys(ss.triple).length) || 0;
    n += (ss.theme && Object.keys(ss.theme).length) || 0;
    return n;
  }

  // 找出玩家等级最高的技能 key（用于前辈带练奖励）
  function _topSkillKey(st) {
    if (!st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > bestLv) { bestLv = lv; best = k; }
    }
    return best;
  }

  // 是否已结识任意一位可请教的职场前辈
  function _metAnyMentor(st) {
    var rel = st && st.relationships;
    if (!rel) return false;
    return !!(
      (rel.boss_li && rel.boss_li.met) ||
      (rel.xiao_mei && rel.xiao_mei.met) ||
      (rel.sister_zhang && rel.sister_zhang.met) ||
      (rel.chef_chen && rel.chef_chen.met) ||
      (rel.old_zhou && rel.old_zhou.met)
    );
  }

  var EVENTS = [
    {
      // —— C内部 + C→F引导：技能连携里程碑 ——
      id: "career_synergy_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "技能连携的质变",
      story:
        "当你把几门手艺都磨到一定火候，奇妙的事发生了——它们开始互相加成。你忽然懂了：单点突破不如组合拳。去『技能』页看看自己的连携版图，或许能打开新思路。",
      triggers: { minDay: 20, excludeFlags: ["_synergyMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false; // [Layer4-L4A] 死亡/破产后不再触发
        return _activeSynergyCount(st) >= 2;
      },
      choices: [
        {
          text: "🔗 研究连携版图",
          hint: "幸福感+，并收到技能页引导",
          apply: function (st) {
            st.flags._synergyMilestoneSeen = true;
            if (!st.needs) st.needs = {};
            if (!st.resources) st.resources = {};
            // [PLACEHOLDER] 连携红利：小额现金 + 幸福感（待平衡）
            st.resources.cash = (st.resources.cash || 0) + 80;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🔗 你点开技能页，连携的脉络一目了然，练级的劲头更足了。",
                "success",
              );
          },
        },
        {
          text: "📚 先记在心里",
          hint: "稳妥，无额外收益",
          apply: function (st) {
            st.flags._synergyMilestoneSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "📚 你把连携的组合记在心里，打算之后慢慢琢磨。",
                "info",
              );
          },
        },
      ],
    },
    {
      // —— C→D联动：前辈指点的职业成长 ——
      id: "career_mentor_path",
      phase: "street",
      _isChainEvent: false,
      icon: "🧑‍🏫",
      title: "前辈的指点",
      story:
        "你某一门手艺已经小有所成，身边结识的前辈看在眼里。『年轻人，光埋头练不行，得有人带你看看路。』他/她愿意抽空指点你几条职场门道。",
      triggers: { minDay: 15, excludeFlags: ["_mentorPathSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        // 至少一门技能≥40（有可指点之处）
        var top = _topSkillKey(st);
        if (top === null) return false;
        var topLv = (st.skills[top] && st.skills[top].level) || 0;
        if (topLv < 40) return false;
        return _metAnyMentor(st);
      },
      choices: [
        {
          text: "🧑‍🏫 虚心讨教",
          hint: "幸福感+，并加深与前辈的关系",
          apply: function (st) {
            st.flags._mentorPathSeen = true;
            if (!st.needs) st.needs = {};
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            // 给已结识的前辈加一点好感（复用既有 applyAffinityChange，需守卫）
            if (typeof applyAffinityChange === "function") {
              var rel = st.relationships;
              if (rel.boss_li && rel.boss_li.met)
                applyAffinityChange(st, "boss_li", 3, "向前辈讨教");
              else if (rel.xiao_mei && rel.xiao_mei.met)
                applyAffinityChange(st, "xiao_mei", 3, "向前辈讨教");
              else if (rel.sister_zhang && rel.sister_zhang.met)
                applyAffinityChange(st, "sister_zhang", 3, "向前辈讨教");
              else if (rel.chef_chen && rel.chef_chen.met)
                applyAffinityChange(st, "chef_chen", 3, "向前辈讨教");
              else if (rel.old_zhou && rel.old_zhou.met)
                applyAffinityChange(st, "old_zhou", 3, "向前辈讨教");
            }
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🧑‍🏫 前辈三言两语点破了你卡了许久的瓶颈，手艺又精进了。",
                "success",
              );
          },
        },
        {
          text: "🤔 自己琢磨",
          hint: "独立，但错失一次提点",
          apply: function (st) {
            st.flags._mentorPathSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🤔 你谢过前辈的好意，决定还是自己慢慢悟。",
                "info",
              );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
