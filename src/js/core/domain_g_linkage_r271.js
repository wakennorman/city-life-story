/**
 * 域G(核心机制/生命周期) 联动增强 R271
 * pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→A  life_data_accumulation   人生数据→数值回馈（数据/数值·信息沉淀）
 *   G→C  life_skill_milestone      人生节点→技能里程碑（职业/成长·经历变现）
 *   G→E  life_financial_milestone  人生节点→财务里程碑（经济·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR271Loaded) return;
  RANDOM_EVENTS._domainGLinkageR271Loaded = true;

  var EVENTS = [
    {
      id: "life_data_accumulation",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据的积累",
      story: "这些年的生活变成了一串串数字——工作天数、收入支出、健康状况、社交关系。\n\n这些数字看似冰冷，但每一个都对应着一段真实的经历。你开始用数据审视自己的人生，发现了一些以前没注意到的规律。\n\n「数据不会说谎」——但它也不会告诉你所有真相。",
      triggers: { minDay: 180, excludeFlags: ["_lifeDataAccumSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "📊 用数据指导未来决策",
          hint: "心智+7，置数据意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataAccumSeen = true;
            st.flags._dataDrivenDecision = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你开始用数据指导决策。数据是经验的结晶。心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 数据只是参考，感觉更重要",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataAccumSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得数据只是参考。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_skill_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "技能里程碑",
      story: "你的一门技能达到了一个新的里程碑——也许是Lv.50，也许是Lv.70，也许是满级。\n\n这个等级不仅是一个数字，它代表着你在这上面投入的时间和精力。每一次练习、每一次失败、每一次突破，都凝聚在这个数字里。\n\n你值得为自己骄傲。",
      triggers: { minDay: 150, excludeFlags: ["_lifeSkillMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        if (!st.flags || !st.flags._skillMilestones) return false;
        var milestones = st.flags._skillMilestones;
        var count = Object.keys(milestones).length;
        return count >= 2;
      },
      choices: [
        {
          text: "🎯 庆祝这个里程碑",
          hint: "心情+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSkillMilestoneSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你庆祝了技能里程碑。每一个级别都是一段旅程。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤫 继续前进，还有更高目标",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSkillMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你选择继续前进。山外有山。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "life_financial_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财务时间积累",
      story: "你发现，这些年积累的财富不仅仅是数字，更是时间的见证。\n\n第一个¥1000、第一个¥10000、第一个¥100000——每一个里程碑都是一段奋斗的历史。\n\n你开始理解「复利」的真正含义：不只是金钱的复利，也是经验和人脉的复利。",
      triggers: { minDay: 200, excludeFlags: ["_lifeFinMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 100000;
      },
      choices: [
        {
          text: "💰 记录这个里程碑",
          hint: "心情+10，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeFinMilestoneSeen = true;
            st.flags._financialMilestone100k = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你记录了财务里程碑。复利是最强大的力量。心情+10，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续积累",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeFinMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
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
