/**
 * 域G(核心机制/生命周期) 联动增强 R296
 * 第五轮循环——核心机制的"断链资产"复活：死函数与剧本死flag第一次被游戏叙事消费。
 * 桥接：
 *   G→B  g296_weather_survival_wisdom  极端天气→城市观察叙事（复活死函数 getWeatherEnhancedDesc，weather.js:927 全库无调用方）
 *   G→D  g296_toolkit_neighbor_fix     开局工具箱→邻里修理（首消费剧本死flag _hasToolkit，scenario_start_chains.js:167 写入后全库无读取）
 *   G→C  g296_first_job_lookback       第一份工作记忆→职场底气（首消费剧本死flag _interviewPassed/_firstJobFound）
 * 防御：全部 || 守卫；NPC 引用守 rel && rel.met 铁律；好感走 applyAffinityChange；技能XP走 addSkillXp 真实键。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR296Loaded) return;
  RANDOM_EVENTS._domainGLinkageR296Loaded = true;

  // 辅助：找一位已结识且好感最高的 NPC（严守域D铁律：rel && rel.met）
  function firstMetNpcG296(st) {
    if (!st || !st.relationships) return null;
    var bestId = null;
    var bestAff = -1;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met && (rel.affinity || 0) > bestAff) {
        bestAff = rel.affinity || 0;
        bestId = id;
      }
    }
    return bestId;
  }

  var EVENTS = [
    {
      id: "g296_weather_survival_wisdom",
      phase: "street",
      _isChainEvent: false,
      icon: "🌪️",
      title: "读懂天空的人",
      story:
        "极端天气袭城。别人抱怨，你却停下来认真观察——温度、风向、街上行人的反应。\n\n在这座城市摸爬滚打这么久，你已经学会了从天空读出信息：什么天气该囤货，什么天气不宜出门，什么天气反而藏着机会。\n\n这是生活教给你的本事。",
      triggers: { minDay: 30, excludeFlags: ["_weatherWisdomSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.weather || !st.weather.current) return false;
        // 只在极端/恶劣天气触发（与 weather.js 风险倍率表一致的高危天气）
        var harsh = [
          "stormy",
          "snowy",
          "typhoon",
          "sandstorm",
          "heavy_smog",
          "cold_snap",
          "heatwave",
        ];
        return harsh.indexOf(st.weather.current) >= 0;
      },
      choices: [
        {
          text: "🌡️ 仔细记录今天的天气",
          hint: "心智+6，心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._weatherWisdomSeen = true;
            st.flags._weatherReader = true;
            // [全系统自洽修复] 域G 联动:复活死函数 getWeatherEnhancedDesc（全库首个调用方）
            var desc = "";
            if (typeof getWeatherEnhancedDesc === "function") {
              try {
                desc = getWeatherEnhancedDesc(st);
              } catch (e) {
                desc = "";
              }
            }
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 4,
              ); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🌪️ 你在笔记里写下今天的天气" +
                  (desc ? "：" + desc : "") +
                  "。看懂天空，也是生存能力。心智+6，心情+4。",
                "success",
              );
            }
          },
        },
        {
          text: "🏃 赶紧回屋躲着",
          hint: "稳妥为上",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._weatherWisdomSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🏃 你没多想，赶紧找地方避了避。心智+2。",
                "info",
              );
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "g296_toolkit_neighbor_fix",
      phase: "street",
      _isChainEvent: false,
      icon: "🔧",
      title: "工具箱派上用场",
      story:
        "邻居家的水管半夜爆了，急得团团转。你想起自己那套二手工具——当初咬牙买下时，就相信技术工人的家伙不会白置。\n\n你提着工具箱过去，拧阀门、缠生料带、换接头，半小时搞定。\n\n邻居非要塞钱给你。",
      triggers: { minDay: 10, excludeFlags: ["_toolkitFixSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        // 首消费剧本死flag _hasToolkit（scenario_start_chains.js:167 写入后全库无读取方）
        return !!(st.flags && st.flags._hasToolkit);
      },
      choices: [
        {
          text: "💰 收下辛苦钱",
          hint: "现金+150，维修经验",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._toolkitFixSeen = true;
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 150; // [PLACEHOLDER]
            if (typeof addSkillXp === "function") addSkillXp("repair", 8); // [PLACEHOLDER] 真实技能键
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🔧 一套工具救了急。现金+150，维修经验+8。当初买工具的决定没有错。",
                "success",
              );
            }
          },
        },
        {
          text: "🤝 分文不收，交个朋友",
          hint: "邻里情谊更值钱",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._toolkitFixSeen = true;
            st.flags._neighborGoodwill = true;
            if (typeof addSkillXp === "function") addSkillXp("repair", 8); // [PLACEHOLDER]
            // 严守域D铁律：好感传导走 applyAffinityChange，仅对已结识 NPC
            var nid = firstMetNpcG296(st);
            if (nid && typeof applyAffinityChange === "function") {
              try {
                applyAffinityChange(st, nid, 6, "邻里互助的口碑传开了"); // [PLACEHOLDER]
              } catch (e) {}
            }
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              ); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🤝 你摆摆手没收钱。邻里之间的口碑，比一顿饭钱值钱多了。心情+5。",
                "success",
              );
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "g296_first_job_lookback",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "第一份工作的记忆",
      story:
        "加班到深夜，电梯里只剩你一个人。镜面映出的自己，让你忽然想起当年那场面试——紧张到手心冒汗，却硬着头皮把话说完。\n\n从那个连面试都会发抖的新人，到今天能独当一面，这条路你走得不快，但每一步都算数。",
      triggers: { minDay: 120, excludeFlags: ["_firstJobLookbackSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        // 首消费剧本死flag _interviewPassed / _firstJobFound（scenario_start_chains.js 写入后全库无读取方）
        if (!st.flags) return false;
        return !!(st.flags._interviewPassed || st.flags._firstJobFound);
      },
      choices: [
        {
          text: "💪 把这份底气带进明天",
          hint: "心智+7，社交经验",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._firstJobLookbackSeen = true;
            st.flags._careerOriginPride = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 7); // [PLACEHOLDER]
            if (typeof addSkillXp === "function") addSkillXp("social", 8); // [PLACEHOLDER] 真实技能键
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "🏢 你想起了第一份工作的自己。走过的路给了你底气。心智+7，社交经验+8。",
                "success",
              );
            }
          },
        },
        {
          text: "😌 笑笑，按下一楼",
          hint: "心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._firstJobLookbackSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 4,
              ); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage(
                "😌 往事就让它是往事吧。心情+4。",
                "info",
              );
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
