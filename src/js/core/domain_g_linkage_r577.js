/**
 * 域G(核心机制/生命周期) 联动增强 R577
 * 选题：域G 三大写-only/欠消费核心机制 flag 全库首事件消费闭环（配套 A1 事件经济影响追踪复活）。
 *   G→D  g577_fresh_look_confidence  首消费 _hairStyleBoost(actions_extra.js:356 写-only 死flag→NPC赞新造型好感)
 *   G→E  g577_era_ride              首消费 _eraState.stageId(growth/mature 经济扩张期→投资信心+本金)
 *   G→A  g577_eventwise_acumen       首消费 _eventEconomicImpact(A1 修复后 recordEventToHistory 实时累积→经济敏锐度)
 * 全字段 || 防御；conditions 全 false 时事件静默不发火，机制仍自洽。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR577Loaded) return;
  RANDOM_EVENTS._domainGLinkageR577Loaded = true;

  // 本地助手：取第一个已结识 NPC（域D铁律：只读 relationships / rel.met 守卫）
  function firstMetNpcR577(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  var EVENTS = [
    // G→D：发型/造型焕新 → 街坊夸赞（消费 _hairStyleBoost，actions_extra.js:356 写-only 死flag）
    {
      id: "g577_fresh_look_confidence",
      phase: "street",
      _isChainEvent: false,
      icon: "💇",
      title: "新造型，被看见了",
      story: "你刚换了发型（或是试了次形象改造），镜子里的人精神了不少。\n\n出门买早饭，常给你留热包子的摊主多看了两眼：「哎，今天精神嘛，像换了个人。」\n\n一句随口的夸奖，把你这几天的小心思照单全收了。",
      triggers: { minDay: 20, interval: 140, maxRepeats: 3, excludeFlags: ["_g577FreshLookCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!(st.flags && st.flags._hairStyleBoost > 0)) return false;
        if (!(st.flags._hairStyleLastDay && st.player && st.player.day)) return false;
        if ((st.player.day - st.flags._hairStyleLastDay) > 20) return false; // 仅造型新鲜期内
        return !!firstMetNpcR577(st);
      },
      choices: [
        {
          text: "😊 笑着应下，心里美滋滋",
          hint: "好感+5，心情+4",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577FreshLookCooldown = true;
            var nid = firstMetNpcR577(st);
            if (nid && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, nid, 5, "新造型获赞");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💇 被在意的人看见，是种很具体的幸福。你和「" + (nid || "熟人") + "」的关系更近了。好感+5，心情+4。", "success");
            }
          },
        },
        {
          text: "🙈 有点不好意思地摸摸头",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577FreshLookCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🙈 你讪讪地摸了摸头，却把这句夸奖偷偷记了一整天。心情+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: true,
    },

    // G→E：经济扩张期顺风 → 投资信心（消费 _eraState.stageId=growth/mature）
    {
      id: "g577_era_ride",
      phase: "street",
      _isChainEvent: false,
      icon: "🌊",
      title: "顺风的日子",
      story: "你翻看城市新闻：新兴行业在招人，街角新店一家接一家开张。时代变迁系统维护的阶段显示，眼下正是一个扩张期。\n\n钱在流动，机会在冒头。有人恐慌，有人贪婪——而你忽然觉得，或许该让闲钱去接一点时代的水花。",
      triggers: { minDay: 180, interval: 200, maxRepeats: 3, excludeFlags: ["_g577EraRideCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var stage = st._eraState && st._eraState.stageId;
        if (stage !== "growth" && stage !== "mature") return false;
        if (st.flags && st.flags._g577EraRideCooldown) return false;
        return ((st.resources && st.resources.cash) || 0) >= 500;
      },
      choices: [
        {
          text: "💡 顺势布局，闲钱不躺着",
          hint: "投资意识觉醒 · 现金+600 · 心智+4",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577EraRideCooldown = true;
            st.flags._dataInvestorMindset = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 600; // [PLACEHOLDER]
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌊 你没 all-in，只是把一部分闲钱放进了对的方向。时代给的贝塔，你接住了一点点。现金+600，心智+4。", "success");
            }
          },
        },
        {
          text: "🛡️ 风向未明，先观望",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577EraRideCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🛡️ 你见过太多风口变陷阱。不急着下注，也是一种纪律。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: true,
    },

    // G→A：历经多起经济相关事件 → 经济敏锐度（消费 _eventEconomicImpact，A1 修复后实时累积）
    {
      id: "g577_eventwise_acumen",
      phase: "street",
      _isChainEvent: false,
      icon: "🧠",
      title: "看得懂这座城的钱流向了哪",
      story: "保健品骗局、团购压价、废品涨价、通胀预期……你亲历过不少牵动钱包的事件。\n\n不知不觉，你不再是那个看到「内幕消息」就心跳加速的新人。你开始能嗅出哪阵风里带着机会，哪阵风里藏着镰刀。",
      triggers: { minDay: 60, interval: 160, maxRepeats: 2, excludeFlags: ["_g577EventwiseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!(st.flags && st.flags._eventEconomicImpact)) return false;
        var n = 0;
        try { n = Object.keys(st.flags._eventEconomicImpact).length; } catch (e) {}
        if (n < 3) return false; // 至少亲历 3 起经济相关事件
        return !(st.flags._g577EventwiseCooldown);
      },
      choices: [
        {
          text: "📚 把经验提炼成判断框架",
          hint: "智力+5，心智+4，心情+3",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577EventwiseCooldown = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 5); // [PLACEHOLDER]
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧠 「看不懂的钱流向，就是别人收割你的方向。」你把自己的踩坑史归纳成几条铁律。智力+5，心智+4，心情+3。", "success");
            }
          },
        },
        {
          text: "🤫 道理懂，但懒得总结",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return; st.flags = st.flags || {};
            st.flags._g577EventwiseCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你心里有数，就是懒得写下来。经验在，框架没成型。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: true,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
