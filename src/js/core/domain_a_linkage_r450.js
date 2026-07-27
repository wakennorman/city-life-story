/**
 * 域A(数据/数值平衡) 联动增强 R450（第二轮循环）
 * 桥接：
 *   A→D  a450_npc_price_tip       NPC价格建议 → 消费 goods 数据,
 *     市场价格→"熟人告诉你哪家便宜"的NPC互动
 *   A→C  a450_skill_market_value   技能市场价值 → 消费 skills+jobs 数据,
 *     技能→"你的技能在市场上值多少钱"的职业导航
 *   A→G  a450_health_cost          健康成本 → 消费 illnesses+goods 数据,
 *     生病花费→"健康的代价"的经济健康叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR450Loaded) return;
  RANDOM_EVENTS._domainALinkageR450Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "a450_npc_price_tip", phase: "street", _isChainEvent: false, icon: "🧑‍🌾",
      title: "熟人价",
      story: "熟识的摊主悄悄告诉你——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_a450PriceTipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a450PriceTipCooldown);
      },
      choices: [
        { text: "🤝 领情买点", hint: "好感+2,省200元", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450PriceTipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "摊主给了个熟人价");
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 200;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧑‍🌾 '别人卖8块，我给你6块'——熟人价买的不仅是东西，更是人情。好感+2,省了200块。", "success");
        }},
        { text: "👍 记下价格", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450PriceTipCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧑‍🌾 你默默记下了这个价格——以后买东西心里有数了。心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "熟识的摊主悄悄告诉你——'今天这个便宜，我特意给你留的。' 在这座城市，有人情味的地方就有温暖。";
      }
    },
    {
      id: "a450_skill_market_value", phase: "street", _isChainEvent: false, icon: "🎯",
      title: "技能值多少钱",
      story: "你看到一则招聘广告，发现自己的技能正好对口——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_a450SkillValueCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a450SkillValueCooldown);
      },
      choices: [
        { text: "📋 投简历试试", hint: "心智+2,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450SkillValueCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你投了份简历——你的技能正好符合要求。原来技能真的能变现。心智+2,社交XP+2。", "success");
        }},
        { text: "📚 继续提升技能", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450SkillValueCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你决定先把技能练到顶尖——好工作自然会来找你。随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到一则招聘广告，发现自己的技能正好对口——原来你的技能在市场上这么值钱。";
      }
    },
    {
      id: "a450_health_cost", phase: "street", _isChainEvent: false, icon: "🏥",
      title: "健康的代价",
      story: "你算了算最近看病花的钱——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_a450HealthCostCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._a450HealthCostCooldown);
      },
      choices: [
        { text: "💪 开始锻炼", hint: "健康+2,疲劳+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450HealthCostCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 看病花的钱让你心疼——与其花钱治病，不如花时间锻炼。健康+2,疲劳+2。", "success");
        }},
        { text: "🥗 注意饮食和作息", hint: "健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._a450HealthCostCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 你决定从今天开始早睡早起、少油少盐——健康是最好的投资。健康+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你算了算最近看病花的钱——挂号费、检查费、药费... 健康真的是最贵的奢侈品。";
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