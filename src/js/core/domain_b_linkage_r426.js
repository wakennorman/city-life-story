/**
 * 域B(事件/叙事) 联动增强 R426
 * 背景：personalGrowth.image{style,skincare,fitness,plastic} 四维仅 render.js 展示 + personal_growth_events 写入，
 *       全库无任何事件以其为触发条件（零消费）。本轮为 style/plastic/fitness 各接入首个叙事消费者。
 * 桥接：
 *   B→D  b426_style_notice     形象穿搭 → 已met NPC 好感（image.style/skincare 首消费）
 *   B→G  b426_plastic_mirror   整容后的自我认同叙事（image.plastic 首消费）
 *   B→E  b426_gym_invest_chat  健身房投资闲聊（image.fitness × stockHoldings 交叉）
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR426Loaded) return;
  RANDOM_EVENTS._domainBLinkageR426Loaded = true;

  // 取一个已 met 的 NPC id（防御：relationships 可 undefined）
  function pickMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = [];
    for (var nid in st.relationships) {
      var rel = st.relationships[nid];
      if (rel && rel.met) ids.push(nid);
    }
    if (!ids.length) return null;
    return Random.fromArray(ids); // [全系统自洽修复] 域B R400: Math.random()→Random.fromArray()种子化随机
  }
  function npcName(nid) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(nid); } catch (e) {}
    }
    return "熟人";
  }

  var EVENTS = [
    {
      id: "b426_style_notice", phase: "street", _isChainEvent: false, icon: "🧥",
      title: "被注意到的穿搭",
      story: "你的形象经营开始被身边人注意——{desc}",
      triggers: { minDay: 40, excludeFlags: ["_b426StyleNoticeCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var img = st.personalGrowth && st.personalGrowth.image;
        if (!img) return false;
        // [PLACEHOLDER] 穿搭或护肤任一维度 ≥50 视为"形象有经营"
        if (((img.style || 0) < 50) && ((img.skincare || 0) < 50)) return false;
        return !!pickMetNpc(st);
      },
      choices: [
        { text: "😊 大方道谢，聊聊心得", hint: "对方好感↑，幸福+4", apply: function (st) {
          if (!st) return; st.flags._b426StyleNoticeCooldown = true;
          var nid = pickMetNpc(st);
          if (nid && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, nid, 3, "形象好感"); } catch (e) {} // [PLACEHOLDER] 好感+3
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧥 " + (nid ? npcName(nid) : "熟人") + "夸你最近状态很好——用心经营的形象，别人是看得见的。", "success");
        }},
        { text: "😅 摆摆手岔开话题", hint: "无变化", apply: function (st) {
          if (st && st.flags) st.flags._b426StyleNoticeCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var img = st.personalGrowth && st.personalGrowth.image;
        if (!img) return null;
        var dim = (img.style || 0) >= (img.skincare || 0) ? "穿搭" : "气色";
        return "路上偶遇熟人，对方上下打量了你一番：『最近" + dim + "不一样了啊。』";
      }
    },
    {
      id: "b426_plastic_mirror", phase: "street", _isChainEvent: false, icon: "🪞",
      title: "镜子里的自己",
      story: "整容之后，你在镜子前停留了很久——{desc}",
      triggers: { minDay: 50, excludeFlags: ["_b426PlasticMirrorSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var img = st.personalGrowth && st.personalGrowth.image;
        if (!img) return false;
        return (img.plastic || 0) >= 20; // [PLACEHOLDER] 有过整容投入
      },
      choices: [
        { text: "🪞 接纳它——这也是我的选择", hint: "心智+5，幸福+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b426PlasticMirrorSeen = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🪞 你和镜子里的自己和解了——改变外表是选择，接纳自己是能力。心智+5。", "success");
        }},
        { text: "😔 越看越陌生", hint: "心智-3，开启自我认同支线flag", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b426PlasticMirrorSeen = true;
          st.flags._b426IdentityDoubt = true; // B→G: 自我认同动摇，供后续生命节点/叙事读取
          if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😔 镜子里的人很好看，但你一时认不出那是谁。也许需要一点时间。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var img = st.personalGrowth && st.personalGrowth.image;
        if (!img || (img.plastic || 0) < 20) return null;
        return "手术恢复期过去了。深夜洗漱时，你在镜子前停了很久——那张更符合审美的脸，是你想要的样子吗？";
      }
    },
    {
      id: "b426_gym_invest_chat", phase: "street", _isChainEvent: false, icon: "🏋️",
      title: "健身房的投资闲聊",
      story: "撸铁间隙，你听到了一段有意思的对话——{desc}",
      triggers: { minDay: 60, excludeFlags: ["_b426GymInvestCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var img = st.personalGrowth && st.personalGrowth.image;
        if (!img || (img.fitness || 0) < 55) return false; // [PLACEHOLDER] 健身习惯已养成
        var inv = st.investment;
        return !!(inv && Array.isArray(inv.stockHoldings) && inv.stockHoldings.length > 0);
      },
      choices: [
        { text: "🧠 只听思路，不抄作业", hint: "心智+4，理性投资者心态", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b426GymInvestCooldown = true;
          st.flags._b426GymInvestInsight = true; // B→E: 场外信息素养flag，供投资域叙事读取
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏋️ 你把对话当成免费的思维碰撞——别人的代码你抄不来，但思路可以借。心智+4。", "success");
        }},
        { text: "📱 掏出手机想跟单", hint: "幸福+2，但冲动交易倾向", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b426GymInvestCooldown = true;
          st.flags._b426GymFomoUrge = true; // B→E: FOMO倾向flag，供投资域风险事件读取
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你差点当场下单——健身房练的是肌肉，考验的却是心态。", "warning");
        }}
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var n = Array.isArray(st.investment.stockHoldings) ? st.investment.stockHoldings.length : 0;
        if (n <= 0) return null;
        return "隔壁卧推架的两个人聊得火热，说的正是你持有的板块。你手里攥着" + n + "只持仓，耳朵不由自主竖了起来。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) { if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; } }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
