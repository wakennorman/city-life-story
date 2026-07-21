/**
 * 域B 联动增强 — R44 季节变迁·深夜独白 叙事事件
 *
 * 设计意图：填补两个显著的情感叙事空白
 *   1. 季节更替 → 城市生活的时间流逝感（B→G 核心机制）
 *   2. 深夜孤独 → 打工人深夜独白的情绪共鸣（B→G 核心机制）
 *
 * 接入方式：IIFE 注入 RANDOM_EVENTS 统一池
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR44Loaded) return;
  RANDOM_EVENTS._domainBLinkageR44Loaded = true;

  var LINKAGE_EVENTS = [
    // ===== 事件1：季节更替叙事 =====
    // 联动：B(事件/叙事) → G(核心机制/天气季节)
    // 设计意图：季节变化是城市生活的重要时间刻度，让玩家感受城市随时间流逝的质感
    {
      id: "season_change_reflection",
      phase: "street",
      icon: "🍂",
      title: "季节变了",
      story:
        "你走在街上，忽然发现路边的树已经换了一身颜色。空气里的味道也不一样了——不再是之前那种闷热潮湿，而是带着一丝凉意的干燥。\\n\\n这座城市用最安静的方式告诉你：时间在走。你掏出手机看了看日历，发现距离上一次留意季节变化，已经过了很久很久。",
      triggers: {
        minDay: 15,
        excludeFlags: ["_seasonChangeReflectionSeen"],
      },
      conditions: function (st) {
        // 季节变化检测：检查当前季节是否与上次触发时不同
        if (!st.weather || !st.weather.season) return false;
        if (st.flags._lastSeasonChangeSeason === st.weather.season) return false;
        return true;
      },
      probability: 0.05,
      repeatable: true, // 每个季节可以触发一次
      choices: [
        {
          text: "📸 拍张照片，记录这一刻",
          hint: "心智+3，心情+5，记录城市记忆",
          apply: function (st) {
            st.flags._seasonChangeReflectionSeen = true;
            st.flags._lastSeasonChangeSeason = st.weather && st.weather.season;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "📸 你拍下了一张街景。照片里，这座城市正在变脸。等你老了，这些照片会比钱更珍贵。心智+3，心情+5。",
              "success",
            );
          },
        },
        {
          text: "📝 在心里默默记一笔",
          hint: "智力+2，内心坚韧+1",
          apply: function (st) {
            st.flags._seasonChangeReflectionSeen = true;
            st.flags._lastSeasonChangeSeason = st.weather && st.weather.season;
            st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 2);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
            StateManager.addMessage(
              "📝 你继续走路，但把这件事记在了心里。这座城市的时间感，你开始懂了。智力+2，心智+1。",
              "info",
            );
          },
        },
        {
          text: "😐 季节而已，跟我有什么关系",
          hint: "适应也是一种力量",
          apply: function (st) {
            st.flags._seasonChangeReflectionSeen = true;
            st.flags._lastSeasonChangeSeason = st.weather && st.weather.season;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            StateManager.addMessage(
              "😐 你拉紧衣领继续赶路。在这座城市里生存，有时候钝感一点反而更好。心智+3。",
              "info",
            );
          },
        },
      ],
    },

    // ===== 事件2：深夜独白叙事 =====
    // 联动：B(事件/叙事) → G(核心机制/夜间时段+心情)
    // 设计意图：深夜独白是城市打工人最常见的情感场景，填补「孤独感」叙事空白
    {
      id: "late_night_monologue",
      phase: "street",
      icon: "🌙",
      title: "深夜的独白",
      story:
        "夜深了，你躺在床上盯着天花板，窗外偶尔传来几声车鸣。手机屏幕亮了一下又暗了——没有新消息。\\n\\n你想起今天——不，是最近——好像一直是这样。白天忙忙碌碌，晚上一个人躺着。这座城市的灯红酒绿，跟你隔着一堵墙。\\n\\n你翻了个身，脑子里突然冒出一个问题：「我到底在为了什么？」",
      triggers: {
        minDay: 30,
        excludeFlags: ["_lateNightMonologueSeen"],
      },
      conditions: function (st) {
        // 晚间时段 + 心情偏低 + 没有太多社交
        if (st.player.timeSlot !== "evening") return false;
        if ((st.needs.happiness || 50) > 35) return false; // 心情高时不会触发
        // 有亲密社交关系时不会触发（[自洽修复] 域B A类#2: 补 r.met 门控）
        var hasCloseFriend = false;
        if (st.relationships) {
          for (var id in st.relationships) {
            var r = st.relationships[id];
            if (r && r.met === true && r.affinity && r.affinity >= 60) {
              hasCloseFriend = true;
              break;
            }
          }
        }
        if (hasCloseFriend) return false;
        return true;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💪 给自己打气：明天会更好",
          hint: "心智+5，找回动力",
          apply: function (st) {
            st.flags._lateNightMonologueSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "💪 你对着黑暗说了句「加油」。声音在空荡荡的房间里回响，但你感觉比刚才好了一点。心智+5，心情+5。",
              "success",
            );
          },
        },
        {
          text: "📱 刷手机转移注意力",
          hint: "暂时逃避，疲劳+5",
          apply: function (st) {
            st.flags._lateNightMonologueSeen = true;
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
            StateManager.addMessage(
              "📱 你刷了半小时短视频。笑是笑了，但放下手机后，空虚感又涌了上来。疲劳+5。",
              "info",
            );
          },
        },
        {
          text: "🖊️ 写日记把想法倒出来",
          hint: "心智+3，智力+2，自我梳理",
          apply: function (st) {
            st.flags._lateNightMonologueSeen = true;
            st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            st.player.intelligence = Math.min(100, (st.player.intelligence || 0) + 2);
            StateManager.addMessage(
              "🖊️ 你写了三页纸。写完后再看一遍，发现问题其实没那么大，但说出来舒服多了。心智+3，智力+2。",
              "success",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < LINKAGE_EVENTS.length; i++) {
    RANDOM_EVENTS.push(LINKAGE_EVENTS[i]);
  }
})();