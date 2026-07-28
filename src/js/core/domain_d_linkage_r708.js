/**
 * 域D(NPC/社交) 联动增强 R708
 * 桥接：
 *   D→A  d708_social_price_tip       社交价格情报 → 消费 state.relationships,
 *     从NPC处获得商品价格波动情报，交易时获得价格优势
 *   D→E  d708_social_invest_circle    社交投资圈 → 消费 state.relationships+state.resources,
 *     社交圈中获取投资机会和理财建议
 *   D→G  d708_social_health_effect    社交健康效应 → 消费 state.relationships+state.needs,
 *     亲密社交关系带来健康加成和心情恢复
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR708Loaded) return;
  RANDOM_EVENTS._domainDLinkageR708Loaded = true;

  function getMetNpcs(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  function pickRandomNpc(st, minAff) {
    var met = getMetNpcs(st, minAff || 0);
    if (!met.length) return null;
    var idx = (typeof Random !== "undefined" && Random.int) ? Random.int(0, met.length - 1) : 0;
    return met[idx];
  }

  function hasCloseFriends(st) {
    var close = getMetNpcs(st, 60);
    return close.length >= 2;
  }

  var EVENTS = [
    // === D→A 社交价格情报：从NPC处获得交易优势 ===
    {
      id: "d708_social_price_tip",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "朋友的消息",
      story: "一位相熟的朋友匆匆找到你，神秘地说：「我刚听说城西的建材市场要涨价了，现在囤还来得及。」\n\n你仔细一想，这消息确实有价值——如果属实，能赚一笔差价。",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_d708PriceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d708PriceCd) return false;
        var npc = pickRandomNpc(st, 30);
        return npc !== null && st.player && st.player.day >= 30;
      },
      choices: [
        {
          text: "📈 信了，赶紧囤货",
          hint: "交易经验+10,随机获得¥500-1500,置_d708PriceInsider",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708PriceCd = true;
            st.flags._d708PriceInsider = true;
            var bonus = (typeof Random !== "undefined" && Random.int) ? Random.int(500, 1500) : 800;
            st.resources.cash = (st.resources.cash || 0) + bonus;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 你趁着价格低点囤了一批货，转手赚了¥" + bonus + "！社交XP+5。", "success");
            }
          }
        },
        {
          text: "🤔 先调查核实再决定",
          hint: "智力+3,交易经验+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708PriceCd = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤔 你谨慎核实了消息，虽然没有大赚一笔，但学到了分辨信息真伪的能力。智力+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = pickRandomNpc(st, 30);
        return "来自" + (npc ? npc.id : "朋友") + "的消息——在这个城市里，人脉就是信息，信息就是金钱。";
      }
    },
    // === D→E 社交投资圈：从社交圈获得投资机会 ===
    {
      id: "d708_social_invest_circle",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "圈子里的机会",
      story: "在一次朋友聚会上，有人聊起了一个投资机会——一个刚起步的本地小品牌正在寻找早期投资人。你知道这种机会可遇不可求，但也伴随着风险。",
      triggers: { minDay: 90, interval: 150, maxRepeats: 2, excludeFlags: ["_d708InvestCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d708InvestCd) return false;
        var npc = pickRandomNpc(st, 40);
        return npc !== null && st.player && st.player.day >= 90 && (st.resources.cash || 0) >= 5000;
      },
      choices: [
        {
          text: "💰 投了！机会难得",
          hint: "投资¥3000,有机会获得高回报,置_d708AngelInvestor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708InvestCd = true;
            st.flags._d708AngelInvestor = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
            // 50%概率获得回报
            var success = (typeof Random !== "undefined" && Random.chance) ? Random.chance(0.5) : (Math.random() < 0.5);
            if (success) {
              var ret = (typeof Random !== "undefined" && Random.int) ? Random.int(5000, 12000) : 7000;
              st.resources.cash = (st.resources.cash || 0) + ret;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + ret;
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("💰 投资大获成功！你投的¥3000变成了¥" + ret + "！人脉就是金钱！", "success");
              }
            } else {
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("💸 投资打了水漂，¥3000打了水漂。高风险高回报，下次要更谨慎。", "warning");
              }
            }
          }
        },
        {
          text: "📊 先做功课，不急于出手",
          hint: "会计XP+8,智力+4,置_d708InvestSavy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708InvestCd = true;
            st.flags._d708InvestSavy = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你花时间研究了那个品牌的财报和行业趋势。会计XP+8，智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "社交圈里" + getMetNpcs(st, 40).length + "个好友——每一个都可能带来改变人生的机会。";
      }
    },
    // === D→G 社交健康效应：高质量社交提升健康 ===
    {
      id: "d708_social_health_effect",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "友情的疗愈",
      story: "最近你发现，每次和真正知心的朋友见面后，整个人都会轻松很多。好像那些压在心头的烦恼，在谈笑间就消散了。\n\n今天，一位老朋友约你出来散步——你决定赴约。",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_d708HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d708HealthCd) return false;
        return hasCloseFriends(st) && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🚶 一起去公园散步聊天",
          hint: "心情+10,疲劳-10,健康+3,置_d708WalkFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708HealthCd = true;
            st.flags._d708WalkFriend = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚶 和老朋友散步聊天，感觉身心都得到了治愈。心情+10，疲劳-10，健康+3。", "success");
            }
          }
        },
        {
          text: "🍵 约在茶馆聊心事",
          hint: "心智+5,心情+8,花费¥50,置_d708TeaFriend",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d708HealthCd = true;
            st.flags._d708TeaFriend = true;
            if ((st.resources.cash || 0) >= 50) {
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🍵 在茶馆里，你第一次对朋友说出了心里话。心智+5，心情+8。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var close = getMetNpcs(st, 60);
        return "在这个城市里，有" + close.length + "个知心朋友——他们是你在异乡最温暖的依靠。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();