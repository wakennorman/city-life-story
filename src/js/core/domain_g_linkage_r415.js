/**
 * 域G(核心机制/生命周期) 联动增强 R415
 * 第十七轮循环——把隐藏在needs/weather/travel管线步骤中的数据转化为叙事体验。
 * 桥接：
 *   G→E  g415_needs_invest            需求驱动投资 → 消费 needs+investment 数据,
 *     生活需求→"该花钱满足需求还是投资"的经济决策
 *   G→H  g415_lifecycle_corp          生命周期与公司 → 消费 age+corporate 数据,
 *     人生阶段→"这个阶段该创业还是打工"的职业抉择
 *   G→D  g415_seasonal_social         季节性社交 → 消费 weather+relationships 数据,
 *     季节变化→"换季了,约朋友出来聚聚"的社交触发
 *
 * 严格照 domain_g_linkage_r408.js / r402.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR415Loaded) return;
  RANDOM_EVENTS._domainGLinkageR415Loaded = true;

  var EVENTS = [
    {
      // G→E: 需求驱动投资 — 消费 needs+investment
      id: "g415_needs_invest",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "消费还是投资",
      story:
        "你面临一个选择——{choiceDesc}\n\n{choiceInsight}",
      triggers: { minDay: 65, excludeFlags: ["_g415NeedsCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.needs && st.resources && (st.resources.cash || 0) > 200;
      },
      choices: [
        {
          text: "📈 投资优先,延迟满足",
          hint: "心智+4,accounting XP+3,置 _g415NeedsCooldown(70天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g415NeedsCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("⚖️ 你选择投资优先——延迟满足是投资者最重要的品质。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "🛍️ 先满足生活需求",
          hint: "心情+4,置 _g415NeedsCooldown(70天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g415NeedsCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🛍️ 你选择先满足需求——生活品质是持续奋斗的基础。心情+4。", "success");
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var desc = "手头有¥" + cash.toLocaleString() + ",是满足当前需求还是拿来投资?";
        var insight = "消费带来即时满足,投资带来长期回报,需要找到平衡";
        return "你面临一个选择——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // G→H: 生命周期与公司 — 消费 age+corporate
      id: "g415_lifecycle_corp",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🔄",
      title: "人生阶段与事业",
      story:
        "你站在人生的新阶段——{stageDesc}\n\n{stageInsight}",
      triggers: { minDay: 100, excludeFlags: ["_g415StageCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 在现有基础上深耕",
          hint: "心智+4,management XP+3,置 _g415StageCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g415StageCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🔄 你选择深耕现有事业——专注是成功的关键。心智+4,管理XP+3。", "success");
          }
        },
        {
          text: "🚀 尝试新的事业方向",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var age = st.player.age || 20;
        var desc = age + "岁,在职场已有一定的积累";
        var insight = "是继续深耕,还是尝试新的方向?";
        if (st.player.corporate && st.player.corporate.daysInJob > 200) {
          desc = "在职场耕耘超过200天,你已经积累了丰富的经验";
          insight = "这些经验是继续上升的基石";
        }
        return "你站在人生的新阶段——" + desc + "。\n\n" + insight + "。";
      }
    },
    {
      // G→D: 季节性社交 — 消费 weather+relationships
      id: "g415_seasonal_social",
      phase: "street",
      _isChainEvent: false,
      icon: "🍂",
      title: "换季了,聚一聚",
      story:
        "季节在变换——{seasonDesc}\n\n{socialHint}",
      triggers: { minDay: 50, excludeFlags: ["_g415SeasonCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.relationships && Object.keys(st.relationships).length > 0;
      },
      choices: [
        {
          text: "🤝 约朋友出来聚聚",
          hint: "心情+4,心智+2,置 _g415SeasonCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g415SeasonCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍂 换季了,和朋友聚聚——社交是生活的调味剂。心情+4,心智+2。", "success");
          }
        },
        {
          text: "😌 享受独处的时光",
          hint: "心智+3",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "季节在变换,生活也在继续";
        if (st.weather && st.weather.season) {
          var seasonMap = { spring: "春暖花开,万物复苏", summer: "夏日炎炎,热情似火",
            autumn: "秋高气爽,收获季节", winter: "冬日寒冷,温暖相聚" };
          desc = seasonMap[st.weather.season] || "季节在变换";
        }
        return "季节在变换——" + desc + "。\n\n约朋友出来聚聚,让生活更有温度。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
