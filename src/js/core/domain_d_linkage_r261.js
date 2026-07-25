/**
 * 域D(NPC/社交) 联动增强 R261
 * 社交积累的多维回响——好感不仅是数值，还在经济/职业/叙事层面留下痕迹。
 * 桥接：
 *   D→E  npc_investment_network   已结识NPC中有投资者→获得投资机会（经济·社交资本变现）
 *   D→C  npc_career_mentor        NPC好感达标→职业指导→技能XP（职业/成长·师徒传承）
 *   D→B  npc_life_milestone        NPC生日/人生节点→叙事事件（事件/叙事·情感觉醒）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR261Loaded) return;
  RANDOM_EVENTS._domainDLinkageR261Loaded = true;

  function getHighAffinityNpcsD261(st, minAff) {
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
      id: "npc_investment_network",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💼",
      title: "朋友的投资渠道",
      story: "一个老朋友找到你，说他手上有个不错的投资项目，问你要不要一起参与。\n\n「我信得过你的眼光，这个项目我一个人吃不下来，正好拉你一起。」\n\n这是你第一次因为「认识人」而获得投资机会。原来社交圈不仅是聊天的资本，也是赚钱的渠道。",
      triggers: { minDay: 150, excludeFlags: ["_npcInvNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var highNpcs = getHighAffinityNpcsD261(st, 60);
        return highNpcs.length >= 1;
      },
      choices: [
        {
          text: "💰 认真评估后参与",
          hint: "现金-2000，公司声誉+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcInvNetworkSeen = true;
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 3;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你参与了一个朋友介绍的投资项目。现金-2000，公司声誉+3。", "success");
            }
          },
        },
        {
          text: "🤷 先观望一下再说",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcInvNetworkSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得先观望一下更稳妥。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      id: "npc_career_mentor",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "前辈的点拨",
      story: "一个欣赏你本事的前辈找到你，把自己压箱底的经验倾囊相授。\n\n「我看你是块好材料，这些经验我摸索了十年，现在传给你，少走点弯路。」\n\n你突然明白，有些东西书本上学不到，只有「过来人」才愿意教。",
      triggers: { minDay: 100, excludeFlags: ["_npcCareerMentorSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.relationships) return false;
        var highNpcs = getHighAffinityNpcsD261(st, 50);
        if (highNpcs.length < 1) return false;
        var topSkill = 0;
        for (var k in st.skills) {
          var lv = (st.skills[k] && st.skills[k].level) || 0;
          if (lv > topSkill) topSkill = lv;
        }
        return topSkill >= 30;
      },
      choices: [
        {
          text: "🎓 认真记录前辈的经验",
          hint: "最高技能XP+15，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcCareerMentorSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎓 你认真记录了前辈的经验。这是花钱都买不到的东西。技能XP+15，心智+5。", "success");
            }
          },
        },
        {
          text: "🤝 谢谢，但我有自己的节奏",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcCareerMentorSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你谢绝了前辈的好意，选择按自己的节奏来。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "npc_life_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "朋友的生日",
      story: "今天是你的一个朋友的生日。你差点忘了，直到看到朋友圈里的提醒。\n\n你买了一份不算贵但用心挑的礼物，送到对方手上。朋友笑着说：「你居然记得。」\n\n有些关系，不需要天天联系，只需要在重要的日子记得。",
      triggers: { minDay: 60, excludeFlags: ["_npcLifeMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.player) return false;
        if (typeof NPCS === "undefined") return false;
        var dayOfYear = ((st.player.day - 1) % 365) + 1;
        for (var i = 0; i < NPCS.length; i++) {
          var npc = NPCS[i];
          if (npc.birthday === dayOfYear && st.relationships[npc.id] && st.relationships[npc.id].met) {
            return true;
          }
        }
        return false;
      },
      choices: [
        {
          text: "🎂 送一份礼物",
          hint: "NPC好感+8，现金-200，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            if (typeof applyAffinityChange !== "function") return;
            var dayOfYear = ((st.player.day - 1) % 365) + 1;
            for (var i = 0; i < NPCS.length; i++) {
              if (NPCS[i].birthday === dayOfYear && st.relationships[NPCS[i].id] && st.relationships[NPCS[i].id].met) {
                applyAffinityChange(st, NPCS[i].id, 8, "生日祝福");
              }
            }
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            st.flags._npcLifeMilestoneSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎂 你送了一份生日礼物。有些关系，不需要天天联系。好感+8，心情+5。", "success");
            }
          },
        },
        {
          text: "👋 发个祝福消息",
          hint: "NPC好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            if (typeof applyAffinityChange !== "function") return;
            var dayOfYear = ((st.player.day - 1) % 365) + 1;
            for (var i = 0; i < NPCS.length; i++) {
              if (NPCS[i].birthday === dayOfYear && st.relationships[NPCS[i].id] && st.relationships[NPCS[i].id].met) {
                applyAffinityChange(st, NPCS[i].id, 3, "生日祝福");
              }
            }
            st.flags._npcLifeMilestoneSeen = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👋 你发了一条生日祝福。礼轻情意重。好感+3。", "info");
            }
          },
        },
      ],
      probability: 0.7,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
