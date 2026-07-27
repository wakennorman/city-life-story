/**
 * 域D(NPC/社交) 联动增强 R455
 * 第二十三轮循环——社交网络系统三大「活跃但零事件消费」维度首消费
 * 桥接：
 *   D→E  d455_fans_micro_fame   playerFans粉丝数全库首事件消费→网红经济引导+现金变现
 *   D→G  d455_crisis_ally       舆论危机全库首事件层消费→高好感NPC公开声援(社交资本兑现)
 *   D→B  d455_npc_feed_comment  npcFeeds NPC动态全库首事件消费→线上互动反哺线下好感
 * 设计原则：全字段||防御；met铁律；applyAffinityChange正规入口；数值[PLACEHOLDER]；
 *          conditions全false时(无社交网络/无粉丝/无危机)不出场,叙事依然自洽。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR455Loaded) return;
  RANDOM_EVENTS._domainDLinkageR455Loaded = true;

  /** 找一位已结识且好感>=minAff的NPC id(遍历relationships,不依赖未实现NPC) */
  function findTrustedNpc(st, minAff) {
    if (!st || !st.relationships) return null;
    var best = null;
    var bestAff = -Infinity;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff && (r.affinity || 0) > bestAff) {
        best = id;
        bestAff = r.affinity || 0;
      }
    }
    return best;
  }

  function displayName(npcId) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(npcId) || npcId; } catch (e) { return npcId; }
    }
    return npcId;
  }

  var EVENTS = [
    // ===== 联动1: D→E playerFans 全库首事件消费——粉丝破百的微网红时刻 =====
    {
      id: "d455_fans_micro_fame",
      phase: "street",
      _isChainEvent: false,
      icon: "📱",
      title: "一百个陌生人的关注",
      story:
        "手机震了一下——你的粉丝数悄悄破了100。\n\n私信箱里躺着一条消息：\"你好,我们是本地一家小商铺,看你账号内容挺接地气,想请你发条推广,报酬从优。\"\n\n一百个粉丝不多,但这是一百个愿意听你说话的陌生人。",
      triggers: { minDay: 20, excludeFlags: ["_d455FansMilestone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.socialNetwork) return false;
        return (st.socialNetwork.playerFans || 0) >= 100; // [PLACEHOLDER] micro网红门槛
      },
      choices: [
        {
          text: "💰 接下这单小推广",
          hint: "现金+,名气+,但少量粉丝觉得变味了",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455FansMilestone = true;
            st.resources = st.resources || { cash: 0 };
            st.resources.cash = (st.resources.cash || 0) + 150; // [PLACEHOLDER]
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3); // [PLACEHOLDER]
            if (st.socialNetwork) {
              st.socialNetwork.playerFans = Math.max(0, (st.socialNetwork.playerFans || 0) - 5); // [PLACEHOLDER] 恰饭掉粉
            }
            if (typeof addDailyTransaction === "function") {
              try { addDailyTransaction(st, "income", "influencer", 150, "粉丝推广收入"); } catch (e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你接下了第一单推广——现金+¥150,名气+3。评论区有人说\"恰饭了\",掉了5个粉丝。流量变现,有得有失。", "success");
          },
        },
        {
          text: "✍️ 婉拒,继续做真实内容",
          hint: "心智+,粉丝稳步增长",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455FansMilestone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (st.socialNetwork) {
              st.socialNetwork.playerFans = (st.socialNetwork.playerFans || 0) + 10; // [PLACEHOLDER] 真实感涨粉
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("✍️ 你婉拒了推广,继续记录真实生活。有粉丝留言:\"就喜欢你这份真实。\"心智+4,粉丝+10。", "success");
          },
        },
      ],
      probability: 0.1,
      repeatable: false,
    },

    // ===== 联动2: D→G 舆论危机全库首事件层消费——高好感NPC公开声援 =====
    {
      id: "d455_crisis_ally",
      phase: "street",
      _isChainEvent: false,
      icon: "🛡️",
      title: "风暴中有人为你说话",
      story:
        "舆论风暴还没过去,你已经两天不敢看手机了。\n\n这时朋友发来一张截图——一位和你走得很近的熟人在自己的账号上公开发声:\"我认识这个人,不是网上说的那样。日子还长,别急着下结论。\"\n\n评论区的风向,悄悄变了一点。",
      triggers: { minDay: 30, excludeFlags: ["_d455CrisisAllySeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.socialNetwork || !st.socialNetwork["舆论危机"]) return false;
        var crisis = st.socialNetwork["舆论危机"];
        if (!crisis.active || (crisis.severity || 0) < 40) return false; // [PLACEHOLDER] 中度以上危机
        return !!findTrustedNpc(st, 60); // met+好感>=60铁律
      },
      choices: [
        {
          text: "🙏 私下郑重道谢",
          hint: "危机缓和,好感+,心情+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455CrisisAllySeen = true;
            var ally = findTrustedNpc(st, 60);
            if (st.socialNetwork && st.socialNetwork["舆论危机"]) {
              var c = st.socialNetwork["舆论危机"];
              c.severity = Math.max(0, (c.severity || 0) - 20); // [PLACEHOLDER] 声援降温
            }
            if (ally && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, ally, 8, "危机中挺身声援"); } catch (e) { /* safe */ }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🙏 你郑重地向" + (ally ? displayName(ally) : "朋友") + "道了谢。患难见真情——舆论热度-20,好感+8,心情+6。", "success");
          },
        },
        {
          text: "😔 沉默,把这份情记在心里",
          hint: "危机小幅缓和,心智+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455CrisisAllySeen = true;
            if (st.socialNetwork && st.socialNetwork["舆论危机"]) {
              var c2 = st.socialNetwork["舆论危机"];
              c2.severity = Math.max(0, (c2.severity || 0) - 10); // [PLACEHOLDER]
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😔 你没有回复,但把这份情记在了心里。有些感激不必说出口。舆论热度-10,心智+3。", "success");
          },
        },
      ],
      probability: 0.15,
      repeatable: false,
    },

    // ===== 联动3: D→B npcFeeds 全库首事件消费——线上动态反哺线下关系 =====
    {
      id: "d455_npc_feed_comment",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "深夜刷到熟人的动态",
      story:
        "深夜睡不着,你随手刷起了朋友圈。\n\n一位熟识的朋友几小时前发了一条动态,配图是一碗热气腾腾的面条:\"忙了一天,总算能吃口热乎的。\"\n\n你的拇指悬在屏幕上——点个赞?还是认真评论两句?",
      triggers: { minDay: 15, excludeFlags: ["_d455FeedCommentSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.socialNetwork || !Array.isArray(st.socialNetwork.npcFeeds)) return false;
        if (st.socialNetwork.npcFeeds.length === 0) return false;
        // 至少有一条动态的作者是已结识NPC(met铁律)
        for (var i = 0; i < st.socialNetwork.npcFeeds.length; i++) {
          var f = st.socialNetwork.npcFeeds[i];
          if (!f || !f.npcId) continue;
          var rel = st.relationships && st.relationships[f.npcId];
          if (rel && rel.met) return true;
        }
        return false;
      },
      choices: [
        {
          text: "💬 认真写一条走心评论",
          hint: "好感+,社交XP+",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455FeedCommentSeen = true;
            // 找到动态作者中已结识的NPC
            var target = null;
            if (st.socialNetwork && Array.isArray(st.socialNetwork.npcFeeds)) {
              for (var i = 0; i < st.socialNetwork.npcFeeds.length; i++) {
                var f = st.socialNetwork.npcFeeds[i];
                if (!f || !f.npcId) continue;
                var rel = st.relationships && st.relationships[f.npcId];
                if (rel && rel.met) { target = f.npcId; break; }
              }
            }
            if (target && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, target, 5, "深夜动态走心评论"); } catch (e) { /* safe */ }
            }
            if (typeof addSkillXp === "function") {
              try { addSkillXp("social", 4); } catch (e) { /* safe */ } // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💬 你认真评论了" + (target ? displayName(target) : "朋友") + "的动态,对方很快回复了一个笑脸。线上的一句话,暖了线下的关系。好感+5,社交XP+4。", "success");
          },
        },
        {
          text: "👍 点个赞就睡",
          hint: "心情+,微量好感",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d455FeedCommentSeen = true;
            var target2 = null;
            if (st.socialNetwork && Array.isArray(st.socialNetwork.npcFeeds)) {
              for (var j = 0; j < st.socialNetwork.npcFeeds.length; j++) {
                var f2 = st.socialNetwork.npcFeeds[j];
                if (!f2 || !f2.npcId) continue;
                var rel2 = st.relationships && st.relationships[f2.npcId];
                if (rel2 && rel2.met) { target2 = f2.npcId; break; }
              }
            }
            if (target2 && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, target2, 1, "动态点赞"); } catch (e) { /* safe */ }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👍 你点了个赞,放下手机。萍水相逢的日子里,一个赞也是一句\"我在\"。心情+2,好感+1。", "success");
          },
        },
      ],
      probability: 0.09,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    var _exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === _e.id) { _exists = true; break; }
    }
    if (!_exists) RANDOM_EVENTS.push(_e);
  }
})();
