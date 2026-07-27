/**
 * 域E(经济/投资) 联动增强 R589
 * 选题依据：域E三大写-only/欠消费投资flag首事件消费（此前全库零读取或仅一次性消息）：
 *   E→B  e589_first_stock_anniversary 股龄满月复盘 → 首消费 flags._firstStockDay
 *     (investment.js:1752 写入后全库零读取)，首次买股30天后的反思叙事（峰终定律：给"第一次"补一个记忆锚点）
 *   E→C  e589_confidence_to_raise 底气变现 → 首消费 flags._investCareerConfidence
 *     (investment.js:1415 组合破¥10万仅弹一条消息)，把"职场底气"兑现成真实职业行动（禀赋效应→行动转化）
 *   E→D  e589_wealth_circle_invite 理财请教 → 首消费 flags._investSocialPerception
 *     (investment.js:1428 组合破¥50万仅一次性好感)，熟人上门请教投资的社交抉择（社会比较的双面性）
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR589Loaded) return;
  RANDOM_EVENTS._domainELinkageR589Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }
  function npcName(npcId) {
    if (!npcId) return "一位熟人";
    if (typeof getNpcDisplayName === "function") { try { return getNpcDisplayName(npcId) || "一位熟人"; } catch(e) {} }
    return "一位熟人";
  }

  var EVENTS = [
    {
      id: "e589_first_stock_anniversary", phase: "street", _isChainEvent: false, icon: "🗓️",
      title: "股龄满月",
      story: "你翻到一个月前第一次买股票的交易记录——{desc}",
      triggers: { minDay: 30, interval: 999, maxRepeats: 1, excludeFlags: ["_e589StockAnnivDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e589StockAnnivDone) return false;
        if (!st.flags._firstStockBought) return false;
        var fd = st.flags._firstStockDay;
        if (typeof fd !== "number" || !isFinite(fd)) return false;
        var day = (st.player && st.player.day) || 0;
        return day >= fd + 30;
      },
      choices: [
        { text: "📊 复盘首月操作", hint: "会计XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589StockAnnivDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗓️ '第一个月，赚亏都是学费。把每笔交易的理由写下来，才不会重复犯错。' 会计XP+5,心智+2。", "success");
        }},
        { text: "🎉 纪念一下", hint: "心情+4,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589StockAnnivDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎉 '入市满月，值得纪念——不是为了收益，是为了迈出的那一步。' 心情+4,社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var fd = (st.flags && typeof st.flags._firstStockDay === "number") ? st.flags._firstStockDay : 0;
        var day = (st.player && st.player.day) || 0;
        var span = Math.max(30, day - fd);
        return "你翻到" + span + "天前第一次买股票的交易记录——那时的紧张和兴奋还历历在目。如今再看盘面，你已经淡定多了。";
      }
    },
    {
      id: "e589_confidence_to_raise", phase: "corporate", _isChainEvent: false, icon: "💼",
      title: "底气变现",
      story: "资产给了你底气，是时候把底气变成行动了——{desc}",
      triggers: { minDay: 40, interval: 999, maxRepeats: 1, excludeFlags: ["_e589RaiseTalkDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e589RaiseTalkDone) return false;
        return !!st.flags._investCareerConfidence;
      },
      choices: [
        { text: "🗣️ 约上级谈职业发展", hint: "管理XP+5,销售XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589RaiseTalkDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '有了投资收益托底，谈判时你不再患得患失，条理清晰地摆出了自己的贡献。' 管理XP+5,销售XP+3,心智+2。", "success");
        }},
        { text: "📚 先修炼内功", hint: "会计XP+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589RaiseTalkDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '底气不用急着变现，实力到了机会自然会来。' 会计XP+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "资产给了你底气，是时候把底气变成行动了——'最坏的结果也不过是维持现状，而我已经输得起了。' 你开始认真考虑争取更好的职业条件。";
      }
    },
    {
      id: "e589_wealth_circle_invite", phase: "street", _isChainEvent: false, icon: "🤔",
      title: "理财请教",
      story: "有熟人听说你投资有道，上门请教——{desc}",
      triggers: { minDay: 50, interval: 999, maxRepeats: 1, excludeFlags: ["_e589AdviceAskDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._e589AdviceAskDone) return false;
        if (!st.flags._investSocialPerception) return false;
        return firstMetNpc(st) !== null;
      },
      choices: [
        { text: "☕ 耐心分享方法论", hint: "社交XP+5,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589AdviceAskDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "分享投资方法论");
          if (typeof StateManager !== "undefined") StateManager.addMessage("☕ '我只讲方法不荐股：分散、闲钱、长期。亏得起的钱才能拿来投资。' 对方连连点头。社交XP+5,好感+3。", "success");
        }},
        { text: "🙅 婉拒荐股请求", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._e589AdviceAskDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙅 '荐股这事，赚了别人不会分你，亏了却要怪你一辈子。' 你礼貌地岔开了话题。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var nid = firstMetNpc(st);
        return "有熟人听说你投资有道，上门请教——" + npcName(nid) + "半开玩笑地问：'听说你资产都过50万了？带带我呗，买哪只能赚？'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
