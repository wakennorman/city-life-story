/**
 * 域B(事件/叙事) 联动增强 R785b（本窗口自动化轮，b后缀避让并行R784/R785小编号轮）
 * 选题依据（域B写-only flag 首消费闭环，全库grep确认零读取）：
 *   B→D  b785b_sharer_echo      分享者的回响 —— _b714Sharer(domain_b_linkage_r715.js:83
 *        R715写入以来全库唯一写入、零读取)首消费：你在互助会分享的经历被人记住,回到你身上。
 *        峰终定律:把玩家的叙事选择变成延迟的社交峰值回报。
 *   B→D/G b785b_listener_return 倾听者的回礼 —— _b714Listener(domain_b_linkage_r715.js:96
 *        写-only)首消费：曾被你倾听的人,在你心智低谷时回来支撑你。互惠原则+损失厌恶缓冲:
 *        低心智期给玩家的不是惩罚而是早期善意的兑现。
 *   B→A/E b785b_anonymous_karma 匿名善举的回声 —— _b722bAnonymousGiver(domain_b_linkage_r722b.js:77
 *        写-only)首消费：匿名"感恩基金"辗转产生涟漪,以口碑与一笔小生意机会回到你身上。
 *        禀赋效应:玩家自己花钱做的善举获得可感知的长尾回报,强化道德抉择的意义感。
 * 防御：全部 || 守卫；NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange(四参)；
 *       显名走 getNpcDisplayName 兜底；心智 st.player.mental；幸福 st.needs.happiness；
 *       现金 st.resources.cash；口碑走 gainReputation(state,locKey,amount,reason) typeof守卫。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR785bLoaded) return;
  RANDOM_EVENTS._domainBLinkageR785bLoaded = true;

  var ECHO_NPCS = ["aunt_wang", "old_zhou", "boss_li", "sister_zhang"]; // 自检修正: sister_hong非真实id(npcs.js无)→sister_zhang

  function metEchoNpcs(st) {
    var out = [];
    if (!st || !st.relationships) return out;
    for (var i = 0; i < ECHO_NPCS.length; i++) {
      var rel = st.relationships[ECHO_NPCS[i]];
      if (rel && rel.met) out.push(ECHO_NPCS[i]);
    }
    return out;
  }

  function npcName(nid) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(nid); if (n) return n; } catch (e) {}
    }
    return "老熟人";
  }

  var EVENTS = [
    // ============ 1. B→D 分享者的回响（_b714Sharer 首消费, street） ============
    {
      id: "b785b_sharer_echo", phase: "street", _isChainEvent: false, icon: "🗣️",
      title: "分享者的回响",
      story: "街角有人叫住你：'你就是那次互助会上分享经历的人吧？你那番话,我记到现在。'",
      triggers: { minDay: 60, maxRepeats: 1, excludeFlags: ["_b785bSharerEcho"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._b714Sharer) return false; // R715分享过经历才有回响
        if (st.flags._b785bSharerEcho) return false;
        return metEchoNpcs(st).length > 0; // 铁律: 至少一位met的NPC在场牵线
      },
      choices: [
        {
          text: "🤝 停下来聊聊近况", hint: "旧识好感+6,心情+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bSharerEcho = true;
            var mets = metEchoNpcs(st);
            for (var i = 0; i < mets.length && i < 2; i++) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, mets[i], 6, "分享者的回响·街头重逢"); } catch (e) {}
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🗣️ 他说那次分享让他撑过了最难的日子。" + npcName(mets[0]) + "在旁边直点头。你忽然觉得,说出来的经历没有白说。旧识好感+6,心情+6。", "success");
            }
          }
        },
        {
          text: "😳 摆摆手匆匆走开", hint: "心智+3(被记住本身就是安慰)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bSharerEcho = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😳 你不太习惯被认出来,但走出老远,嘴角还是翘了起来。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ============ 2. B→D/G 倾听者的回礼（_b714Listener 首消费, street） ============
    {
      id: "b785b_listener_return", phase: "street", _isChainEvent: false, icon: "👂",
      title: "倾听者的回礼",
      story: "最近你状态不太好。有人敲开你的门——是当初那个被你安静听完整个故事的人,手里拎着一袋水果：'这次换我听你说。'",
      triggers: { minDay: 60, maxRepeats: 1, excludeFlags: ["_b785bListenerReturn"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._b714Listener) return false; // R715倾听过他人才有回礼
        if (st.flags._b785bListenerReturn) return false;
        if (!st.player || (st.player.mental || 50) >= 55) return false; // 心智低谷期触发,损失厌恶缓冲
        return true;
      },
      choices: [
        {
          text: "🛋️ 把心里的事说出来", hint: "心智+8,心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bListenerReturn = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👂 你说了很久,他一直没打断——就像当年的你一样。原来倾听真的会传染。心智+8,心情+5。", "success");
            }
          }
        },
        {
          text: "🍎 收下水果,只聊些轻松的", hint: "心智+4,饱食+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bListenerReturn = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🍎 有些安慰不需要语言,一袋水果和半小时闲聊就够了。心智+4,饱食+5。", "info");
            }
          }
        }
      ]
    },

    // ============ 3. B→A/E 匿名善举的回声（_b722bAnonymousGiver 首消费, street） ============
    {
      id: "b785b_anonymous_karma", phase: "street", _isChainEvent: false, icon: "🌱",
      title: "匿名善举的回声",
      story: "社区公告栏贴出一张感谢信：'感谢那位匿名捐出感恩基金的好心人,这笔钱帮三个孩子交上了学费。'没人知道是你——但故事开始在街坊间流传。",
      triggers: { minDay: 220, maxRepeats: 1, excludeFlags: ["_b785bAnonymousKarma"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._b722bAnonymousGiver) return false; // R722b匿名捐过感恩基金
        if (st.flags._b785bAnonymousKarma) return false;
        return true;
      },
      choices: [
        {
          text: "🤫 继续保持匿名", hint: "道德+5,心智+6,社区口碑+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bAnonymousKarma = true;
            if (st.player) {
              st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (typeof gainReputation === "function") {
              try { gainReputation(st, "community_center", 8, "匿名善举的回声"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 你路过公告栏,像个陌生人一样看完那封感谢信,然后笑着走开。有些满足感,只属于自己。道德+5,心智+6,社区口碑+8。", "success");
            }
          }
        },
        {
          text: "💼 顺水推舟,接下街坊介绍的小生意", hint: "现金+800,社区口碑+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b785bAnonymousKarma = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
            if (typeof gainReputation === "function") {
              try { gainReputation(st, "community_center", 4, "善名带来的生意"); } catch (e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '听说这一片有位热心人……'街坊辗转把一单跑腿生意介绍给了你。善意兜兜转转,变成了饭碗。现金+800,社区口碑+4。", "success");
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
