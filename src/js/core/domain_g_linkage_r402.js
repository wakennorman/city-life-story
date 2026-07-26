/**
 * 域G(核心机制/生命周期) 联动增强 R402
 * 第十七轮循环——把隐藏在life_nodes/story_chapters/travel中的数据转化为叙事体验。
 * 桥接：
 *   G→A  g402_life_data_viz       人生数据可视化 → 消费 life_nodes+story_chapters 数据,
 *     把人生节点选择+故事章节转化为"我的人生轨迹"数据画像
 *   G→B  g402_story_echo          故事回响 → 消费 _eventHistory+flags 数据,
 *     过往事件→"那些故事如何塑造了我"的叙事回响
 *   G→D  g402_travel_social       旅行社交 → 消费 travel+relationships 数据,
 *     旅行经历→"在路上遇到的人"社交叙事
 *
 * 严格照 domain_g_linkage_r391.js / r377.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR402Loaded) return;
  RANDOM_EVENTS._domainGLinkageR402Loaded = true;

  var EVENTS = [
    {
      // G→A: 人生数据可视化 — 消费 life_nodes+story_chapters
      id: "g402_life_data_viz",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生轨迹",
      story:
        "你回顾自己的人生轨迹——{lifeSummary}\n\n每一个选择都指向了现在的你。",
      triggers: { minDay: 100, excludeFlags: ["_g402LifeDataCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 数据让我更了解自己",
          hint: "心智+4,心情+3,置 _g402LifeDataCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g402LifeDataCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你回顾了自己的人生轨迹——数据是理解自己的镜子。心智+4,心情+3。", "success");
          }
        },
        {
          text: "💪 活在当下,不必回顾",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var day = st.player.day || 1;
        var age = st.player.age || 20;
        var summary = "来到这座城市第" + day + "天," + age + "岁";
        if (st.flags && st.flags._eventHistory) {
          summary += ",经历了" + st.flags._eventHistory.length + "个重要事件";
        }
        return "你回顾自己的人生轨迹——" + summary + "。\n\n每一个选择都指向了现在的你。";
      }
    },
    {
      // G→B: 故事回响 — 消费 _eventHistory+flags
      id: "g402_story_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "故事回响",
      story:
        "你想起那些经历过的故事——{storyEcho}\n\n{echoInsight}",
      triggers: { minDay: 80, excludeFlags: ["_g402StoryEchoCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "📝 写下这些故事",
          hint: "心智+5,置 _g402StoryEchoCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g402StoryEchoCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📖 你写下那些故事——记录是为了更好地前行。心智+5。", "success");
          }
        },
        {
          text: "😊 让故事留在心里",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var history = (st.flags && st.flags._eventHistory) || [];
        var echo = "每一个选择、每一次邂逅,都成为了你的一部分";
        var insight = "故事不会消失,它们化作了你前行的力量";
        if (history.length >= 20) {
          echo = "无数的故事交织成了你丰富的人生";
          insight = "你是自己故事的作者,下一章正待书写";
        }
        return "你想起那些经历过的故事——" + echo + "。\n\n" + insight + "。";
      }
    },
    {
      // G→D: 旅行社交 — 消费 travel+relationships
      id: "g402_travel_social",
      phase: "street",
      _isChainEvent: false,
      icon: "🧳",
      title: "旅途中的缘分",
      story:
        "你想起旅途中遇到的人——{travelSocial}\n\n世界很大,缘分很美。",
      triggers: { minDay: 70, excludeFlags: ["_g402TravelCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有旅行记录或社交关系
        var hasTravel = st.travel && st.travel.visited && st.travel.visited.length > 0;
        var hasRels = st.relationships && Object.keys(st.relationships).length > 0;
        return hasTravel || hasRels;
      },
      choices: [
        {
          text: "💌 联系一下旅途中的朋友",
          hint: "心智+3,心情+4,置 _g402TravelCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g402TravelCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🧳 你联系了旅途中的朋友——距离割不断真正的缘分。心智+3,心情+4。", "success");
          }
        },
        {
          text: "😌 美好的回忆就够了",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var social = "那些在路上相遇的面孔,有些成为了朋友";
        if (st.travel && st.travel.visited && st.travel.visited.length > 0) {
          social = "你已走过" + st.travel.visited.length + "个地方,每段旅程都有故事";
        }
        return "你想起旅途中遇到的人——" + social + "。\n\n世界很大,缘分很美。";
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
