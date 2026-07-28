/**
 * 域B(事件/叙事) 联动增强 R244
 * 背景：B域A类修复 — news.js friendly_neighbor 叙事提到"王大婶"但无 conditions met 门控。
 *   此外，B域联动方向有显著缺口：
 *   1) E→B 投资历程零叙事消费（investment.history[] 持续写入但无B域事件消费）；
 *   2) A→B 经济周期/通胀指数缺乏渐进叙事（_eraState.inflationIndex 全库仅8个一次性里程碑消费）。
 * 桥接：
 *   E→B  invest_life_journal         复盘投资账本 → 总盈亏分3档叙事,心智+冷却90天
 *   A→B  era_personal_pulse          感知城市气息变化 → 通胀指数渐进叙事,心智+心情
 *   B→D  npc_long_absence_reunion    NPC久别重逢 → 30天未见的NPC再次出现,好感+心智
 *
 * 严格照 domain_c_linkage_r191.js / domain_c_linkage_r243.js 已验证 IIFE 注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR244Loaded) return;
  RANDOM_EVENTS._domainBLinkageR244Loaded = true;

  // 安全读取总盈亏
  function getTotalProfit(st) {
    if (!st || !st.flags || typeof st.flags._totalInvestmentProfit !== "number") return 0;
    return st.flags._totalInvestmentProfit;
  }

  // 计算已结识NPC数量
  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) count++;
    }
    return count;
  }

  // 获取首个已结识NPC的详细信息
  function getFirstMetNpcDetail(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return { id: id, rel: r };
    }
    return null;
  }

  // 获取NPC中文名
  function getNpcCn(id) {
    var names = {
      aunt_wang: "王婶", boss_li: "李工头", sister_zhang: "张姐", old_zhou: "老周",
      xiao_mei: "小美", chef_chen: "陈师傅", worker_lao_li: "老李", auntie_lin: "林阿姨",
      chen_ge: "陈哥", ajie: "阿杰", old_ma: "老马"
    };
    return names[id] || id;
  }

  // 获取最近一次与某NPC的互动天数
  function lastChatDaysAgo(st, npcId) {
    var flag = "_lastNpcChat_" + npcId;
    if (!st || !st.flags || !st.flags[flag]) return 999; // 从未聊过
    var lastDay = st.flags[flag];
    return Math.max(0, (st.player && st.player.day) - lastDay);
  }

  // 找已结识但超过threshold天没聊天的第一个NPC
  function findLongAbsentNpc(st, threshold) {
    if (!st || !st.relationships) return null;
    threshold = threshold || 30;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (!r || !r.met) continue;
      var days = lastChatDaysAgo(st, id);
      if (days >= threshold) return { id: id, rel: r, days: days };
    }
    return null;
  }

  var EVENTS = [
    {
      // E→B: 投资账本复盘 — 那些年你折腾过的钱，留下了什么
      id: "invest_life_journal",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "复盘你的投资账本",
      story:
        "夜深人静的时候，你突然想翻翻这些年折腾投资留下的痕迹。赚了还是亏了，都不重要了——真正重要的是你对这个世界的理解，是否比刚来这座城市时更深了一些。",
      triggers: { minDay: 60, excludeFlags: ["_investJournalSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.history || st.investment.history.length < 3) return false;
        // 至少有投资历史记录
        if (!st.flags) return false;
        return st.flags._dataInvestorMindset === true; // 至少曾经关注过投资
      },
      choices: [
        {
          text: "📈 亏了的钱买来了教训",
          hint: "心智+5,心情-2,留下反思flag",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._investLesson_loss = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📈 你默默记下了亏钱的教训——'下次别全押一个方向。'心智+5。", "info");
          }
        },
        {
          text: "📉 赚了的钱也留不下",
          hint: "心智+3,put_it_in_place",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._investLesson_win = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📉 赚了也好亏了也好，你知道真正的财富不是账户上的数字。心智+3。", "good");
          }
        },
        {
          text: "😌 还好不亏不赚,继续攒",
          hint: "心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._investLesson_neutral = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😌 不亏不赚也挺好——不急不躁，攒够钱再说。心情+3。", "info");
          }
        }
      ]
    },
    {
      // A→B: 感知城市气息变化 — 通胀的渐进叙事
      id: "era_personal_pulse",
      phase: "street",
      _isChainEvent: false,
      icon: "🌆",
      title: "城市的气息变了",
      story:
        "今天去菜市场，突然发现同样的东西又涨价了。你这才意识到——这座城市的物价已经悄悄变了几个样子。从看不见到切身感受到，原来只需要一天天过日子。",
      triggers: { minDay: 30, excludeFlags: ["_eraPulseInflationNotice"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st || !st._eraState || !st._eraState.inflationIndex) return false;
        var inflation = st._eraState.inflationIndex;
        if (inflation < 1.05) return false; // 通胀还没到可感知程度
        // 按通胀程度分级
        return true;
      },
      choices: [
        {
          text: "🤔 慢慢习惯了",
          hint: "心智+2,平静接受",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._eraPulseInflationNotice = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤔 你慢慢习惯了物价的变化——城市在变,你也得跟着变。心智+2。", "info");
          }
        },
        {
          text: "😤 这还怎么活下去",
          hint: "心情-3,但开始想办法省钱",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._eraPulseInflationNotice = true;
            if (st.flags) st.flags._budgetSense = true; // 标记开始注意省钱
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😤 物价涨得太快了！你得想想办法省着点花。心情-3。", "warning");
          }
        }
      ]
    },
    {
      // B→D: NPC久别重逢 — 认识很久的人突然出现在眼前
      id: "npc_long_absence_reunion",
      phase: "street",
      _isChainEvent: false,
      icon: "👋",
      title: "好久不见",
      story:
        "走在街上，突然看见{npcName}——上次聊天的时候好像还是{days}天前。TA也在城市中奔波，你们各自忙碌，但偶尔碰面的一瞬间，那种熟悉感又回来了。",
      triggers: { minDay: 45, excludeFlags: ["_npcReunionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var absent = findLongAbsentNpc(st, 30); // [PLACEHOLDER]: 30天未见
        return !!absent;
      },
      // [全系统自洽修复] 域C R685b A类: renderStory是渲染层从不调用的死接口(events_core R455后只调text())→story中{npcName}{days}占位符原样泄漏给玩家；改为text()动态叙述+无占位符fallback
      text: function (st) {
        try {
          if (st && st.relationships) {
            var absent = findLongAbsentNpc(st, 30);
            if (absent) {
              var name = getNpcCn(absent.id);
              return "走在街上，突然看见" + name + "——上次聊天的时候好像还是" + absent.days + "天前。TA也在城市中奔波，你们各自忙碌，但偶尔碰面的一瞬间，那种熟悉感又回来了。";
            }
          }
        } catch (e) { /* fallback */ }
        return "走在街上，突然看见一个许久未见的熟人。你们各自忙碌，但偶尔碰面的一瞬间，那种熟悉感又回来了。";
      },
      choices: [
        {
          text: "😊 聊了几句,挺开心的",
          hint: "NPC好感+5,心智+2,心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._npcReunionSeen = true;
            var absent = findLongAbsentNpc(st, 30);
            if (!absent) return;
            // 更新聊天flag防止短时间重复触发
            if (st.flags) st.flags["_lastNpcChat_" + absent.id] = st.player ? st.player.day : 0;
            // 好感回升
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, absent.id, 5, "久别重逢"); } catch(e) { /* safe */ }
            } else if (st.relationships && st.relationships[absent.id]) {
              st.relationships[absent.id].affinity = Math.min(100, (st.relationships[absent.id].affinity || 0) + 5);
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              var name = getNpcCn(absent.id);
              StateManager.addMessage("😊 跟" + name + "聊了几句,虽然好久不见,感觉还是那么亲切。好感+5,心情+3。", "success");
            }
          }
        },
        {
          text: "👋 点头打过招呼就走了",
          hint: "平静维持关系",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._npcReunionSeen = true;
            var absent = findLongAbsentNpc(st, 30);
            if (!absent) return;
            if (st.flags) st.flags["_lastNpcChat_" + absent.id] = st.player ? st.player.day : 0;
            if (typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, absent.id, 2, "点头之交"); } catch(e) { /* safe */ }
            } else if (st.relationships && st.relationships[absent.id]) {
              st.relationships[absent.id].affinity = Math.min(100, (st.relationships[absent.id].affinity || 0) + 2);
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              var name = getNpcCn(absent.id);
              StateManager.addMessage("👋 跟" + name + "点了点头就走——日子嘛,总是这样过的。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
