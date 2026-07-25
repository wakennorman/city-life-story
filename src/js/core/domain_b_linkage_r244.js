/**
 * 域B(事件/叙事) 联动增强 R244
 * 主题：叙事回响可视化——事件不仅是文字泡，还在UI/社交/经济层面留下可追溯的痕迹。
 * 桥接：
 *   B→F  event_memory_wall       人生第N个事件里程碑 → 事件记录墙UI标记（峰终定律·记忆锚点）
 *   B→D  event_npc_gossip         与已结识NPC聊起共同经历 → 好感升温（禀赋效应·共同记忆）
 *   B→E  event_lucky_streak       连续好运事件触发 → 投资信心flag（心理账户·幸运偏差）
 *
 * 严格照 domain_b_linkage_r190.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   事件历史 st.flags._eventHistory（events_core.js:788 写入）；
 *   NPC 好感走 applyAffinityChange 守 rel.met（域D铁律）；
 *   投资信心 flag _eventLuckyStreak（供经济/投资域门控）；
 *   心情 st.needs.happiness；心智 st.player.mental；现金 st.resources.cash。
 *   数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR244Loaded) return;
  RANDOM_EVENTS._domainBLinkageR244Loaded = true;

  // 取首个已结识(met)且好感达阈值的 NPC id
  function firstMetNpcB244(st, minAff) {
    minAff = minAff || 0;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) return id;
    }
    return null;
  }

  // 安全改好感：走 applyAffinityChange（自动 clamp）
  function safeAffinityB244(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "R244域B联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var EVENTS = [
    {
      // B→F: 人生第N个事件里程碑 → 事件记录墙UI标记（峰终定律·记忆锚点）
      id: "event_memory_wall",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "记忆墙上的一格",
      story:
        "你翻开手机相册，看到一张几个月前的截图——那是你刚来这座城市时第一次赚到¥100的记录。\n\n从那天到现在，你已经经历了不少值得记住的瞬间。有些让你笑，有些让你失眠。每一个都是你在这座城市存在过的证据。\n\n你决定把今天的经历也截个图，存进「人生记忆墙」。",
      triggers: { minDay: 30, excludeFlags: ["_eventMemoryWallSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 至少经历过5个事件（有_eventHistory记录）
        var history = (st.flags && st.flags._eventHistory) || [];
        if (history.length < 5) return false;
        // 每30天最多触发一次
        if (st.flags && st.flags._eventMemoryWallLastDay) {
          var lastDay = st.flags._eventMemoryWallLastDay;
          if ((st.player && st.player.day ? st.player.day : 0) - lastDay < 30) return false;
        }
        return true;
      },
      choices: [
        {
          text: "📸 截图保存这一刻",
          hint: "心智+3，心情+5，记录flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventMemoryWallSeen = true;
            st.flags._eventMemoryWallLastDay = st.player ? st.player.day : 0;
            st.flags._memoryWallKeeper = true; // 标记为记忆墙习惯者
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📸 你截下了今天的画面。记忆墙上又多了一格。心智+3，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 不截图，用心记住就好",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventMemoryWallSeen = true;
            st.flags._eventMemoryWallLastDay = st.player ? st.player.day : 0;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你笑了笑，放下手机。有些事不需要截图，心里记得就好。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // B→D: 与已结识NPC聊起共同经历 → 好感升温（共同记忆）
      id: "event_npc_gossip",
      phase: "street",
      _isChainEvent: false,
      icon: "🗣️",
      title: "你也经历过这种事？",
      story:
        "你在茶馆喝茶，隔壁桌一个熟悉的声音叫住了你。你们聊着聊起，发现彼此都经历过类似的困境——被房东催交租金、在街头被人白眼、加班到凌晨才回家。\n\n「原来你也是这么过来的。」对方感慨道。\n\n共同经历让两个人的距离一下子拉近了不少。",
      triggers: { minDay: 14, excludeFlags: ["_eventNpcGossipSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少一个已结识且好感≥20的NPC
        var npc = firstMetNpcB244(st, 20);
        if (!npc) return false;
        // 需要至少经历过3个事件（有共同话题）
        var history = (st.flags && st.flags._eventHistory) || [];
        if (history.length < 3) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 是啊，咱们都不容易",
          hint: "NPC好感+5，心情+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcGossipSeen = true;
            var npc = firstMetNpcB244(st, 20);
            if (npc) {
              safeAffinityB244(st, npc, 5, "共同经历闲聊");
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你们相视而笑。原来不是只有自己在咬牙坚持。好感+5，心情+3。", "success");
            }
          },
        },
        {
          text: "🍵 喝茶喝茶，不提这些",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventNpcGossipSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🍵 你岔开了话题。有些事，不说比说了更自在。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      // B→E: 连续好运事件触发 → 投资信心flag（心理账户·幸运偏差）
      id: "event_lucky_streak",
      phase: "street",
      _isChainEvent: false,
      icon: "🍀",
      title: "运气来了？",
      story:
        "最近你总觉得运气不错——前几天捡到一笔钱，昨天抽奖又中了，今天买菜还多找了零钱。\n\n「是不是该去试试投资？运气这么旺，说不定能赚一笔。」你心里冒出一个念头。\n\n但你也听过一句话：运气这东西，来无影去无踪。",
      triggers: { minDay: 20, excludeFlags: ["_eventLuckyStreakSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有至少3个正面事件记录（_history中含"success"类型标记）
        var history = (st.flags && st.flags._eventHistory) || [];
        if (history.length < 3) return false;
        // 玩家现金不能太少（有投资本金意识的前提）
        if (!st.resources || (st.resources.cash || 0) < 500) return false;
        return true;
      },
      choices: [
        {
          text: "💰 小试牛刀，拿闲钱试试",
          hint: "置投资信心flag，现金-200",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLuckyStreakSeen = true;
            st.flags._eventLuckyStreak = true; // 投资信心flag（供经济/投资域门控）
            if (st.resources) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你拿出¥200准备试试投资。万一运气真的来了呢？", "info");
            }
          },
        },
        {
          text: "🧊 运气不可靠，省着点花",
          hint: "心智+3，储蓄意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLuckyStreakSeen = true;
            st.flags._savingsDiscipline = true; // 储蓄意识flag
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧊 你冷静下来。运气是假的，存下来的钱才是真的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  // 注入全局事件池
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
