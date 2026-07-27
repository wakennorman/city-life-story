/**
 * 域D(NPC/社交) 联动增强 R442
 * 桥接：
 *   D→B  d442_npc_gossip         NPC市井闲谈 → 消费 relationships 数据,
 *     街头巷尾的NPC闲谈→"城市里的小道消息"的叙事风味
 *   D→F  d442_social_insight_v2  社交洞察v2 → 消费 relationships+needs 数据,
 *     NPC关系状态→"谁和你最近走得很近"的社交面板提示
 *   D→H  d442_corp_network_v2    职场人脉v2 → 消费 relationships+corporate 数据,
 *     公司外的社交关系→"人脉就是钱脉"的职场回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR442Loaded) return;
  RANDOM_EVENTS._domainDLinkageR442Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      if (st.relationships[id] && st.relationships[id].met) return id;
    }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }
  function countMetNpcs(st) {
    if (!st || !st.relationships) return 0;
    var n = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met) n++;
    }
    return n;
  }

  var EVENTS = [
    // D→B: NPC市井闲谈 → 城市叙事
    {
      id: "d442_npc_gossip", phase: "street", _isChainEvent: false, icon: "💬",
      title: "街头闲谈",
      story: "路边的熟面孔拉你闲聊了几句——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_d442GossipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (countMetNpcs(st) < 2) return false;
        return (st.flags && !st.flags._d442GossipCooldown);
      },
      choices: [
        { text: "👂 竖起耳朵听", hint: "好感+2,心情+2,城市见闻+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442GossipCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 2, "街头闲聊拉近了距离");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 街头巷尾的闲谈里藏着这座城市的呼吸——谁家孩子考上了大学、哪条街新开了馆子，这些烟火气让你觉得活得真实。好感+2,心情+2,心智+1。", "success");
        }},
        { text: "🙂 笑着敷衍两句", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442GossipCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = countMetNpcs(st);
        return "路边的熟面孔拉你闲聊了几句——在这座城市待久了，认识的人越来越多（" + n + "个熟人），街角巷尾的闲谈里藏着这座城市的呼吸。";
      }
    },
    // D→F: 社交洞察 → UI面板提示
    {
      id: "d442_social_insight_v2", phase: "street", _isChainEvent: false, icon: "👥",
      title: "谁是你的真朋友",
      story: "翻着通讯录，你忽然意识到——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_d442SocialInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (countMetNpcs(st) < 3) return false;
        return (st.flags && !st.flags._d442SocialInsightCooldown);
      },
      choices: [
        { text: "💝 主动联系老朋友", hint: "好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442SocialInsightCooldown = true;
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "主动联系叙旧");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你翻出好久没联系的老朋友，发了条消息——对方秒回。原来有些人，一直在线。好感+3,心情+2。", "success");
        }},
        { text: "🤔 默默翻一遍通讯录", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442SocialInsightCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 你翻着通讯录里一个个名字——有些人已经很久没联系了，但号码还在。社交圈需要经营，就像花园需要浇水。心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = countMetNpcs(st);
        return "翻着通讯录，你忽然意识到——在这座城市你已经认识了" + n + "个人。有些人常联系，有些人只是点头之交。谁是真朋友，你心里有数。";
      }
    },
    // D→H: 职场人脉 → 公司回响
    {
      id: "d442_corp_network_v2", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "人脉即钱脉",
      story: "在行业交流会上，你遇到了几个熟面孔——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_d442CorpNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        if (countMetNpcs(st) < 2) return false;
        return (st.flags && !st.flags._d442CorpNetworkCooldown);
      },
      choices: [
        { text: "📇 交换名片,拓展人脉", hint: "社交XP+5,公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442CorpNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你在交流会上如鱼得水——几张名片换出去，几个微信加进来。这些人在未来的某天，可能就是你最重要的合作伙伴。社交XP+5,公司知名度+2。", "success");
        }},
        { text: "👀 低调观察,伺机而动", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._d442CorpNetworkCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你端着酒杯站在角落，默默观察着行业里的人来人往——谁和谁走得近、谁在找投资、谁在挖人。这些信息，比名片更值钱。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var n = countMetNpcs(st);
        return "在行业交流会上，你遇到了几个熟面孔——在这座城市打拼的日子里认识的" + n + "个人，有些成了朋友，有些成了客户，有些成了你在行业里的人脉资本。";
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