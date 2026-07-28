/**
 * 域G(核心机制/生命周期) 联动增强 R632
 * 桥接：
 *   G→A  g632_life_data_portrait  人生数据画像 → 消费 state.player+state.resources 数据,
 *     生命周期→"数据化人生轨迹"的数值回响
 *   G→D  g632_neighborhood_relations  邻里关系 → 消费 state.relationships+state.player 数据,
 *     生命周期→"居住时长影响邻里关系"的社交回响
 *   G→H  g632_life_stage_startup  人生阶段创业 → 消费 state.player.day+state.startup 数据,
 *     生命周期→"不同人生阶段的创业选择"的公司回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR632Loaded) return;
  RANDOM_EVENTS._domainGLinkageR632Loaded = true;

  var EVENTS = [
    // ====== G→A: 人生数据画像 ======
    {
      id: "g632_life_data_portrait", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据人生",
      story: "你看着自己的各项数据,回顾这段城市生活——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 5, excludeFlags: ["_g632DataPortraitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g632DataPortraitCooldown) return false;
        return true;
      },
      choices: [
        { text: "📈 分析成长轨迹", hint: "智力+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632DataPortraitCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '从数据看,我比刚来时强多了。' 你欣慰地看着自己的成长曲线。智力+5,心智+3。", "success");
        }},
        { text: "🎯 设定新目标", hint: "心智+5,所有技能XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632DataPortraitCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.flags) st.flags._lifeGoalSet = true;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '下一个目标:成为这座城市里最棒的自己!' 你充满了动力。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        var cash = (st.resources && st.resources.cash) || 0;
        return "你打开人生数据面板:第" + day + "天,存款¥" + cash.toLocaleString() + "。'数字不会说谎,这就是我在这座城市打拼的成果。'";
      }
    },

    // ====== G→D: 邻里关系 ======
    {
      id: "g632_neighborhood_relations", phase: "street", _isChainEvent: false, icon: "🏘️",
      title: "邻里之间",
      story: "住久了,你和周围的邻居渐渐熟络起来——{desc}",
      triggers: { minDay: 45, interval: 90, maxRepeats: 6, excludeFlags: ["_g632NeighborhoodCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g632NeighborhoodCooldown) return false;
        return true;
      },
      choices: [
        { text: "🤝 帮邻居一个小忙", hint: "好感+8,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632NeighborhoodCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.flags) st.flags._neighborHelpCount = (st.flags._neighborHelpCount || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ '小伙子/姑娘,谢谢你啊!' 邻居的笑容让你心里暖暖的。好感+8,心情+5。", "success");
        }},
        { text: "🍵 串门聊天", hint: "心情+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632NeighborhoodCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏘️ 你端着一杯茶去隔壁串门,和邻居聊起了家常。'远亲不如近邻啊。' 心情+5,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 0;
        return "住在这里已经" + day + "天了,你渐渐认识了周围的邻居。楼下的阿姨会跟你打招呼,小卖部的大爷会给你留货。'这座城市,开始有家的感觉了。'";
      }
    },

    // ====== G→H: 人生阶段创业 ======
    {
      id: "g632_life_stage_startup", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "创业时机",
      story: "你开始思考:现在是不是创业的好时机?——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g632StartupTimingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g632StartupTimingCooldown) return false;
        return (st.resources && st.resources.cash || 0) >= 50000;
      },
      choices: [
        { text: "💡 认真准备创业计划", hint: "智力+5,心智+5,现金-2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632StartupTimingCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '创业不是一时冲动,而是深思熟虑后的选择。' 你花了时间和金钱做市场调研。智力+5,心智+5,现金-2000。", "success");
        }},
        { text: "💰 继续积累资本", hint: "心智+3,储蓄效率+10%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g632StartupTimingCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.flags) st.flags._savingBoost = (st.flags._savingBoost || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 '再等等,等我攒够了钱,一次成功!' 你决定再积累一段时间。心智+3,储蓄效率提升。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var day = st.player.day || 0;
        return "第" + day + "天,存款¥" + cash.toLocaleString() + "。你站在窗前,看着这座城市的灯火。'是时候开创自己的事业了吗?' 一个声音在内心回响。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();