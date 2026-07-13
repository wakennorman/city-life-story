/**
 * 核心机制/生命周期域联动增强事件 — 域 G（核心机制/生命周期）跨域桥接
 *
 * 设计意图（全系统优化·循环 R12 · 域G）：
 *   游戏的时间轴很长（数十载、年关、退休、身后），但"人生节点"长期只作为
 *   数值跳变（age++ / corpYear++）而缺乏叙事回响。本文件补 3 个跨域桥接事件，
 *   把"时间流过"变成玩家能感知、能抉择的人生片段：
 *     ① life_city_anniversary   — G→D（人生→社交）：每满一年，与已结识 NPC 的年度相聚
 *     ② life_work_anniversary   — G→C（人生→职业）：入职每满一年，职场成长的仪式感
 *     ③ life_estate_planning     — G→E（人生→经济）：中年后资产传承/公益的抉择
 *
 * 接入方式：与 economy_linkage_events.js 相同的 IIFE 注入 RANDOM_EVENTS 模式
 * 全部字段 || 防御；数值标 [PLACEHOLDER]，待 playtest 调参。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._lifecycleLinkageLoaded) return;
  RANDOM_EVENTS._lifecycleLinkageLoaded = true;

  // ====== 工具: 估算玩家总资产（现金+存款+房产+车辆+股票市值+比特币）======
  function estimateTotalAssets(st) {
    var cash = (st.resources && st.resources.cash) || 0;
    var bank = (st.resources && st.resources.bankBalance) || 0;
    var total = cash + bank;
    var inv = st.investment;
    if (!inv) return total;
    if (inv.properties) {
      for (var i = 0; i < inv.properties.length; i++) {
        var p = inv.properties[i];
        total += p.currentPrice || p.buyPrice || 0;
      }
    }
    if (inv.cars) {
      for (var c = 0; c < inv.cars.length; c++) {
        var car = inv.cars[c];
        total += car.currentPrice || car.buyPrice || 0;
      }
    }
    if (inv.stockHoldings && inv.stockMarket) {
      for (var s = 0; s < inv.stockHoldings.length; s++) {
        var h = inv.stockHoldings[s];
        var m = inv.stockMarket[h.symbol];
        if (m && m.price) total += m.price * (h.shares || 0);
      }
    }
    if (inv.btcHoldings > 0 && inv.btcPrice > 0) {
      total += inv.btcHoldings * inv.btcPrice;
    }
    return total;
  }

  // ====== 工具: 选取好感最高的已结识 NPC id（守卫遍历）======
  function pickClosestMetNpc(st) {
    var rels = st.relationships || {};
    var bestId = null;
    var bestAff = -1;
    Object.keys(rels).forEach(function (k) {
      var r = rels[k];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = k;
      }
    });
    return bestId;
  }

  // ====== 工具: 安全好感增减（优先 applyAffinityChange，否则自建 relationships 条目）======
  function safeAffinity(st, npcId, change, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "人生节点事件");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { affinity: 0, met: true };
    var rel = st.relationships[npcId];
    rel.affinity = (rel.affinity || 0) + change;
    if (rel.affinity > 100) rel.affinity = 100;
    if (rel.affinity < -100) rel.affinity = -100;
    rel.met = true;
  }

  var LIFE_EVENTS = [
    // ===== ① G→D：城中周年（人生节点→社交回响）=====
    {
      id: "life_city_anniversary",
      phase: "street",
      icon: "🗓️",
      title: "又一年，城中",
      story:
        "今天翻手机日历，忽然意识到：你来这座城，整整一年了。\n\n从火车站广场那个兜里只剩三百块的夜晚，到如今有了熟悉的早餐摊、常去的茶馆、几个能随时发消息的人——城市不再只是钢筋水泥，而是一本慢慢写满的通讯录。\n\n你想起这一年里帮过你、也被你帮过的人。",
      triggers: { minDay: 365, excludeFlags: ["_cityAnnivDone"] },
      conditions: function (st) {
        var day = (st.player && st.player.day) || 0;
        if (day < 365) return false;
        var yearMark = Math.floor(day / 365);
        // 每满一整年触发一次：记录已达成的周年数，避免每年反复弹
        if (((st.flags && st.flags._cityAnnivYear) || 0) >= yearMark)
          return false;
        var rels = st.relationships || {};
        var hasMet = Object.keys(rels).some(function (k) {
          var r = rels[k];
          return r && r.met;
        });
        return hasMet;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "📞 约最好的一位熟人小聚",
          hint: "好感+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            var yearMark = Math.floor((st.player.day || 0) / 365);
            if (st.flags) st.flags._cityAnnivYear = yearMark;
            var npcId = pickClosestMetNpc(st);
            safeAffinity(
              st,
              npcId,
              6 /*[PLACEHOLDER] 好感增益*/,
              "城中周年小聚",
            );
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 8 /*[PLACEHOLDER] 心情增益*/,
            );
            StateManager.addMessage(
              "📞 你拨通了那个最熟的号码，约了顿饭。一年了，值得为这座城、为这段关系举杯。好感+6，心情+8。",
              "success",
            );
          },
        },
        {
          text: "🌆 独自走走，和这座城待一会儿",
          hint: "心智+[PLACEHOLDER]，安静自省",
          apply: function (st) {
            var yearMark = Math.floor((st.player.day || 0) / 365);
            if (st.flags) st.flags._cityAnnivYear = yearMark;
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 5 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "🌆 你没约人，只是沿着熟悉的街走了很久。一年前你不敢停下，如今你愿意为自己慢下来。心智+5。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ② G→C：职场周年（人生节点→职业仪式感）=====
    {
      id: "life_work_anniversary",
      phase: "corporate",
      icon: "💼",
      title: "入职周年",
      story:
        "工位上那盆绿萝又长高了一截。HR 的系统推送了一条提醒：你入职满 " +
        (0 + 1) +
        " 年。\n\n你想起第一年手忙脚乱对需求、被导师拎去谈话的下午；如今你也能给新人讲清楚门道了。\n\n职场不是终点，是另一段人生的刻度尺。",
      triggers: { minDay: 1, excludeFlags: ["_workAnnivDone"] },
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        var cy = st.player.corpYear || 0;
        if (cy < 1) return false;
        if (((st.flags && st.flags._lastWorkAnnivYear) || 0) >= cy)
          return false;
        return true;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍻 组个小局，和组里同事庆祝",
          hint: "职场声誉+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            if (st.flags) st.flags._lastWorkAnnivYear = st.player.corpYear || 0;
            if (st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) +
                  5 /*[PLACEHOLDER] 职场声誉增益*/,
              );
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            StateManager.addMessage(
              "🍻 你张罗了顿饭，组里几个人难得卸下工牌聊生活。一年了，有人记得你的成长，你也记得他们的。职场声誉+5，心情+6。",
              "success",
            );
          },
        },
        {
          text: "📝 安静复盘这一年",
          hint: "心智+[PLACEHOLDER]，沉淀",
          apply: function (st) {
            if (st.flags) st.flags._lastWorkAnnivYear = st.player.corpYear || 0;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            StateManager.addMessage(
              "📝 你没声张，只是把这一年的得失在文档里理了一遍：哪些事做成了，哪些坑别再踩。复盘让人踏实。心智+8。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ③ G→E：世代资产（人生节点→经济传承）=====
    {
      id: "life_estate_planning",
      phase: "street",
      icon: "🏛️",
      title: "人到中年，身后之事",
      story:
        "体检报告摊在桌上，各项指标还算平稳，但医生那句「这个年纪要注意了」让你第一次认真想：万一。\n\n你攒下的房子、票子、那点比特币，若是哪天自己顾不上，该交给谁、怎么交？\n\n这不是晦气，是把辛苦半生换来的东西，安放进一个稳妥的结局。",
      triggers: { minDay: 1, excludeFlags: ["_estatePlanDone"] },
      conditions: function (st) {
        if (!st.flags || st.flags._estatePlanDone) return false;
        var age = (st.player && st.player.age) || 0;
        if (age < 40 /*[PLACEHOLDER] 触发年龄阈值待调参*/) return false;
        var total = estimateTotalAssets(st);
        if (total < 500000 /*[PLACEHOLDER] 资产门槛待调参*/) return false;
        return true;
      },
      probability: 0.04, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "📜 立下继承与安排",
          hint: "心智+[PLACEHOLDER]，标记家庭传承",
          apply: function (st) {
            if (st.flags) st.flags._estatePlanDone = true;
            if (st.family) st.family._estatePlanned = true;
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 6 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "📜 你找了天傍晚，把继承安排和几笔重要资产交代清楚。想通了身后事，眼前反倒更轻了。心智+6。",
              "success",
            );
          },
        },
        {
          text: "🤝 划拨一笔做公益捐赠",
          hint: "道德+[PLACEHOLDER]，心智+[PLACEHOLDER]",
          apply: function (st) {
            if (st.flags) st.flags._estatePlanDone = true;
            st.player.morality = Math.min(
              100,
              (st.player.morality || 50) + 5 /*[PLACEHOLDER] 道德增益*/,
            );
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            StateManager.addMessage(
              "🤝 你决定划拨一笔，留给更需要的陌生人。钱离开了手，意义却留了下来。道德+5，心智+3。",
              "info",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < LIFE_EVENTS.length; i++) {
    RANDOM_EVENTS.push(LIFE_EVENTS[i]);
  }
})();
