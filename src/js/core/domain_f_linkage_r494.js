/**
 * 域F(UI/UX) 联动增强 R494
 * 桥接：
 *   F→G  f494_life_comfort_check  生活舒适度检查 → 消费 needs+status 数据,
 *     状态面板→"你过得怎么样"的综合舒适度评估
 *   F→D  f494_social_connect_btn  社交连接按钮 → 消费 relationships 数据,
 *     社交面板→"一键联系"的快捷社交
 *   F→E  f494_asset_net_worth    资产净值看板 → 消费 resources+investment 数据,
 *     财务面板→"你的真实身价"的净资产计算
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR494Loaded) return;
  RANDOM_EVENTS._domainFLinkageR494Loaded = true;

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
      id: "f494_life_comfort_check", phase: "street", _isChainEvent: false, icon: "🏠",
      title: "生活舒适度",
      story: "你环顾四周，评估了一下自己的生活状态——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_f494ComfortCheckCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f494ComfortCheckCooldown);
      },
      choices: [
        { text: "🏠 改善居住环境", hint: "心情+3,健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494ComfortCheckCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 你决定把房间好好收拾一下——'环境好了，心情也好了。' 心情+3,健康+1。", "success");
        }},
        { text: "📋 列个提升计划", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494ComfortCheckCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 你列出了提升生活品质的计划——'一个月改善一个方面，生活总会变好的。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你环顾四周，评估了一下自己的生活状态——衣食住行，方方面面。生活品质不只是钱的问题，更是态度的问题。";
      }
    },
    {
      id: "f494_social_connect_btn", phase: "street", _isChainEvent: false, icon: "📞",
      title: "一键联系",
      story: "你拿起手机，想给某个朋友打个电话——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_f494SocialConnectCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var nid = firstMetNpc(st);
        return !!nid && (st.flags && !st.flags._f494SocialConnectCooldown);
      },
      choices: [
        { text: "📞 打过去", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494SocialConnectCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "主动联系");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📞 '喂？好久不见！' 电话那头传来熟悉的声音——有些朋友，不管多久没联系，声音还是那么亲切。好感+2,心情+2。", "success");
        }},
        { text: "💬 发消息", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494SocialConnectCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "发消息问候");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📞 你发了条消息——'最近怎么样？' 虽然简单，但至少让朋友知道你还在想着TA。好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你拿起手机，想给某个朋友打个电话——通讯录里翻了一遍，却不知道该打给谁。在这座城市，朋友很多，真心的有几个？";
      }
    },
    {
      id: "f494_asset_net_worth", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "真实身价",
      story: "你算了算自己的总资产——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_f494NetWorthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f494NetWorthCooldown);
      },
      choices: [
        { text: "💰 算清楚", hint: "会计XP+5,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494NetWorthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你把所有资产加起来算了一遍——'原来我已经有这个身价了。' 会计XP+5,心智+1。", "success");
        }},
        { text: "📈 设定财务目标", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f494NetWorthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你设定了下一个财务目标——'今年要达到XX万！' 有了目标，才有动力。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你算了算自己的总资产——现金¥" + Math.floor(cash).toLocaleString() + "，存款¥" + Math.floor(bank).toLocaleString() + "，加上其他投资...";
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