/**
 * 域B(事件/叙事) 联动增强 R594
 * 选题：moral_events.js 三个写-only 道德抉择 flag 首消费（善行有回响，道德叙事闭环）
 *   B→C  b594_elder_job_lead   首消费 _elderJobLead（帮老邻居 R7 写入，零读取）
 *     → 老人牵线社区兼职：善意变成职业机会，销售XP+现金
 *   B→D  b594_scam_stopper_fame 首消费 _stoppedScam（阻止骗局写入，零读取）
 *     → 被拦下的街坊上门道谢：义举换来街坊情谊（守 rel.met 铁律 applyAffinityChange）
 *   B→E  b594_wholesale_channel 首消费 _wholesaleChannelTip（批发渠道情报写入，零读取）
 *     → 用批发商的进货价情报省下一笔钱：情报变现金+会计XP
 * 峰终定律：道德抉择的"延迟回报"制造记忆峰值；损失厌恶：善行不再是纯支出。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR594Loaded) return;
  RANDOM_EVENTS._domainBLinkageR594Loaded = true;

  function firstMetNpcB594(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }
  function bumpAffinityB594(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch (e) {}
    }
  }

  var EVENTS = [
    {
      id: "b594_elder_job_lead", phase: "street", _isChainEvent: false, icon: "👴",
      title: "老人的牵线",
      story: "帮过的老邻居托人带话，社区服务站有份跑腿差事——{desc}",
      triggers: { minDay: 12, interval: 999, maxRepeats: 1, excludeFlags: ["_b594ElderLeadUsed"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._elderJobLead) return false; // 首消费 R7 写-only flag
        return !st.flags._b594ElderLeadUsed;
      },
      choices: [
        { text: "🏃 接下这份差事", hint: "现金+900,销售XP+8,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594ElderLeadUsed = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 900; /* [PLACEHOLDER] */
          if (typeof addSkillXp === "function") { try { addSkillXp("sales", 8); } catch (e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👴 '小伙子人靠得住，这活儿交给他我放心。' 老人的一句话比简历管用。现金+¥900,销售XP+8,心情+4。", "success");
        }},
        { text: "🙏 心领了，让给更需要的人", hint: "心智+5,老人好感+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594ElderLeadUsed = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          var r = st.relationships && st.relationships.elderNeighbor;
          if (r && r.met) bumpAffinityB594(st, "elderNeighbor", 4, "谢绝好意让给他人");
          if (typeof StateManager !== "undefined") StateManager.addMessage("👴 '这孩子，心善。' 你把机会让了出去，心里反而更踏实。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "帮过的老邻居托人带话：社区服务站缺个跑腿的，'我跟站长说了，你人实在。' 当初扶的一把，如今变成了递过来的一只手。";
      }
    },
    {
      id: "b594_scam_stopper_fame", phase: "street", _isChainEvent: false, icon: "🛡️",
      title: "义举的回响",
      story: "被你拦下骗局的街坊上门道谢——{desc}",
      triggers: { minDay: 10, interval: 999, maxRepeats: 1, excludeFlags: ["_b594ScamThanksSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._stoppedScam) return false; // 首消费写-only flag
        if (!firstMetNpcB594(st)) return false; // 守域D铁律:须有已结识NPC
        return !st.flags._b594ScamThanksSeen;
      },
      choices: [
        { text: "🍵 收下谢意坐一会儿", hint: "好感+6,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594ScamThanksSeen = true;
          var nid = firstMetNpcB594(st);
          if (nid) bumpAffinityB594(st, nid, 6, "拦下骗局的义举传开了"); /* [PLACEHOLDER] */
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '那天要不是你，我这养老钱就没了。' 街坊的茶很烫，人心很暖。好感+6,心情+5。", "success");
        }},
        { text: "😅 举手之劳不必挂怀", hint: "名望+3,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594ScamThanksSeen = true;
          if (st.player) {
            st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '谁碰上都会管的。' 话虽这么说，这条街都记住了你。名望+3,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "被你拦下骗局的街坊提着水果上门：'打听了好几天才找到你。' 你那天多问的一句话，保住了别人半辈子的积蓄。";
      }
    },
    {
      id: "b594_wholesale_channel", phase: "street", _isChainEvent: false, icon: "📦",
      title: "渠道的价值",
      story: "你想起批发商透露的进货渠道——{desc}",
      triggers: { minDay: 15, interval: 999, maxRepeats: 1, excludeFlags: ["_b594WholesaleUsed"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._wholesaleChannelTip) return false; // 首消费写-only flag
        if (!st.resources || (st.resources.cash || 0) < 500) return false; // 有本金才谈得上进货
        return !st.flags._b594WholesaleUsed;
      },
      choices: [
        { text: "📦 按情报走一趟进货", hint: "现金+700,会计XP+6", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594WholesaleUsed = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 700; /* [PLACEHOLDER] 差价收益 */
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📦 '同样的货，源头价便宜三成。' 情报变成了实打实的差价。现金+¥700,会计XP+6。", "success");
        }},
        { text: "🤝 把渠道分享给相熟的摊主", hint: "好感+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b594WholesaleUsed = true;
          var nid = firstMetNpcB594(st);
          if (nid) bumpAffinityB594(st, nid, 5, "分享批发渠道情报");
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📦 '这渠道你留着用。' 你把情报送了人情，生意场上多了个盟友。好感+5,心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "整理记账本时你想起批发商那句'源头拿货能省三成'。这条渠道情报一直躺在记忆里，是时候用起来了。";
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
