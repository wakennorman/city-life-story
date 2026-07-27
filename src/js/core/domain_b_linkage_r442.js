/**
 * 域B(事件/叙事) 联动增强 R442
 * 第十七轮循环——新内容开发:小薇(夜市摊主)+夜市
 * 桥接：
 *   B→A  b442_night_market_discovery   夜市发现→数据认知
 *   B→C  b442_xiao_wei_cooking         小薇教烹饪→技能成长
 *   B→G  b442_night_market_vibe        夜市氛围→心情/社交
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR442Loaded) return;
  RANDOM_EVENTS._domainBLinkageR442Loaded = true;

  var EVENTS = [
    {
      id: "b442_night_market_discovery",
      phase: "street",
      _isChainEvent: false,
      icon: "🏮",
      title: "夜市的烟火气",
      story:
        "傍晚时分,你路过一条热闹的街道——夜市开张了!\n\n五颜六色的摊位灯光亮起来,烤串的香气飘满整条街。摊主们热情地招呼着客人,讨价还价声此起彼伏。\n\n你第一次发现,原来这座城市还有这么有烟火气的一面。",
      triggers: { minDay: 30, excludeFlags: ["_nightMarketDiscovered"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🍢 逛一逛,感受夜市氛围",
          hint: "心情+5,置 _nightMarketDiscovered",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._nightMarketDiscovered = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏮 你逛了夜市,感受了城市的烟火气。心情+5。", "success");
          }
        },
        {
          text: "😅 人太多,不想挤",
          hint: "无奖励",
          apply: function (st) {
            if (st) { st.flags = st.flags || {}; st.flags._nightMarketDiscovered = true; }
          }
        }
      ],
      probability: 0.1,
      repeatable: false,
    },
    {
      id: "b442_xiao_wei_cooking",
      phase: "street",
      _isChainEvent: false,
      icon: "👩‍🍳",
      title: "小薇的烹饪课",
      story:
        "你在夜市遇到了小薇,一个年轻活力的摊主。她的烧烤摊前排着长队,香味飘出老远。\n\n\"想学吗?我教你几招,以后自己也能摆摊!\"\n\n她热情地教你调酱料、控火候,你学到了不少实用的烹饪技巧。",
      triggers: { minDay: 50, excludeFlags: ["_xiaoWeiMet"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📝 认真学习烹饪技巧",
          hint: "烹饪XP+12,心情+4,置 _xiaoWeiMet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._xiaoWeiMet = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("cooking", 12); } catch (e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👩‍🍳 你跟小薇学了烹饪技巧——烟火气里藏着真本事。烹饪XP+12,心情+4。", "success");
          }
        },
        {
          text: "😊 随便看看,不麻烦人家",
          hint: "心情+2,置 _xiaoWeiMet",
          apply: function (st) {
            if (st) {
              st.flags = st.flags || {};
              st.flags._xiaoWeiMet = true;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            }
          }
        }
      ],
      probability: 0.07,
      repeatable: false,
    },
    {
      id: "b442_night_market_vibe",
      phase: "street",
      _isChainEvent: false,
      icon: "🌙",
      title: "夜市的温暖",
      story:
        "忙碌了一天,你来到夜市。霓虹灯下,摊主们热情地吆喝着,食客们围坐在一起有说有笑。\n\n你买了一份烤串,坐在路边看着人来人往。这座城市虽然陌生,但此刻你觉得——这里也有家的感觉。",
      triggers: { minDay: 70, excludeFlags: ["_nightMarketVibeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.needs && (st.needs.happiness || 50) < 65;
      },
      choices: [
        {
          text: "💛 感受这份温暖",
          hint: "心情+6,心智+2,置 _nightMarketVibeSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._nightMarketVibeSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌙 夜市的温暖治愈了你——城市也有家的感觉。心情+6,心智+2。", "success");
          }
        },
        {
          text: "😌 安静地吃完回家",
          hint: "心情+3",
          apply: function (st) {
            if (st) {
              st.flags = st.flags || {};
              st.flags._nightMarketVibeSeen = true;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            }
          }
        }
      ],
      probability: 0.08,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
