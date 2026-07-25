/**
 * 域D(NPC/社交) 联动增强 R268
 * 社交积累的多维回响——好感不仅是数值，还在健康/经济/叙事层面留下痕迹。
 * 桥接：
 *   D→G  social_health_benefit   社交支持→健康恢复（核心机制·心理韧性）
 *   D→E  npc_business_partner    NPC→商业合伙（经济·社交资本变现）
 *   D→B  npc_story_arc           NPC关系→叙事弧线（事件/叙事·人物深度）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR268Loaded) return;
  RANDOM_EVENTS._domainDLinkageR268Loaded = true;

  function getHighAffinityNpcsD268(st, minAff) {
    minAff = minAff || 50;
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push({ id: id, aff: r.affinity || 0 });
    }
    out.sort(function (a, b) { return b.aff - a.aff; });
    return out;
  }

  var EVENTS = [
    {
      id: "social_health_benefit",
      phase: "street",
      _isChainEvent: false,
      icon: "❤️",
      title: "社交的治愈力",
      story: "最近身体不太好，但朋友们的关心让你恢复得比预期快。\n\n有人给你送饭，有人陪你说话，有人只是默默陪你坐一会儿。\n\n你突然明白，社交不只是利益交换，它也是治愈的力量。",
      triggers: { minDay: 150, excludeFlags: ["_socialHealthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.status) return false;
        if ((st.status.health || 100) > 70) return false;
        var highNpcs = getHighAffinityNpcsD268(st, 40);
        return highNpcs.length >= 2;
      },
      choices: [
        {
          text: "❤️ 感谢朋友的陪伴",
          hint: "健康+10，NPC好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialHealthSeen = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (typeof applyAffinityChange === "function") {
              var npcs = getHighAffinityNpcsD268(st, 40);
              for (var i = 0; i < Math.min(3, npcs.length); i++) {
                applyAffinityChange(st, npcs[i].id, 3, "社交治愈");
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("❤️ 你感谢了朋友的陪伴。社交是治愈的力量。健康+10，好感+3。", "success");
            }
          },
        },
        {
          text: "🤫 不想麻烦别人",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialHealthSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你不想麻烦别人。独立，是一种选择。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "npc_business_partner",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "朋友变合伙人",
      story: "一个老朋友找到你，想一起做生意。\n\n「我出资金，你出技术，咱们一起干。」\n\n你犹豫了。朋友变合伙人，是亲密还是风险？但你也知道，有些机会只有信任的人才能一起抓住。",
      triggers: { minDay: 200, excludeFlags: ["_npcBusinessPartnerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var highNpcs = getHighAffinityNpcsD268(st, 70);
        return highNpcs.length >= 1;
      },
      choices: [
        {
          text: "🤝 接受合伙邀请",
          hint: "现金+5000，公司声誉+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcBusinessPartnerSeen = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 5000;
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你接受了朋友的合伙邀请。信任是最大的资本。现金+5000，声誉+5。", "success");
            }
          },
        },
        {
          text: "🤷 朋友归朋友，生意归生意",
          hint: "心智+4，NPC好感-5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcBusinessPartnerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            var npcs = getHighAffinityNpcsD268(st, 70);
            if (npcs.length > 0 && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, npcs[0].id, -5, "拒绝合伙");
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你婉拒了合伙邀请。朋友归朋友，生意归生意。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "npc_story_arc",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "NPC的故事线",
      story: "你和某个NPC的关系越来越深，开始了解TA的完整故事——TA的过去、TA的梦想、TA的遗憾。\n\n你发现，每个NPC都有自己的弧线，不只是你人生的配角。他们是自己故事的主角。",
      triggers: { minDay: 250, excludeFlags: ["_npcStoryArcSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var veryHighNpcs = getHighAffinityNpcsD268(st, 80);
        return veryHighNpcs.length >= 1;
      },
      choices: [
        {
          text: "📖 认真倾听TA的故事",
          hint: "NPC好感+10，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcStoryArcSeen = true;
            if (typeof applyAffinityChange === "function") {
              var npcs = getHighAffinityNpcsD268(st, 80);
              if (npcs.length > 0) applyAffinityChange(st, npcs[0].id, 10, "深度了解");
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你认真倾听了TA的故事。每个人都有自己的弧线。好感+10，心智+8。", "success");
            }
          },
        },
        {
          text: "👋 保持适当的距离",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcStoryArcSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你选择保持适当的距离。亲疏有度，是一种智慧。心智+4。", "info");
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
