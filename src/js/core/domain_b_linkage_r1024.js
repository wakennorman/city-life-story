/**
 * 域B(事件/叙事) 联动增强 R1024
 * — B→E 事件经济洞察 / B→D 事件社交涟漪 / B→F 事件记忆墙
 *
 * 设计意图：在事件触发后，消费事件数据产生跨域影响：
 * 1. 经济类事件累积 → 解锁投资洞察
 * 2. 社交类事件 → NPC关系变化
 * 3. 高频事件参与 → 记忆墙数据积累
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；
 *       done-flag 防重；NPC 一律 met 铁律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR1024Loaded) return;
  RANDOM_EVENTS._domainBLinkageR1024Loaded = true;

  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }

  var EVENTS = [
    // ===== 1. B→E 事件经济洞察 =====
    {
      id: "b1024_event_economic_insight",
      phase: "street",
      icon: "💡",
      title: "从经历中读懂经济规律",
      story: "你经历了太多市场的起起落落——\n\n从最初的倒买倒卖，到后来的大宗交易，再到现在的资产配置。\n\n你发现了一个规律：每一次重大事件，都会在市场上留下痕迹。\n\n暴雨过后，菜价必涨；\n政策出台，某个行业必火；\n大家恐慌时，往往是机会。\n\n这些写在街头的经济学，比任何教科书都真实。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1024EconInsightDone) return false;
        var ecoCount = (st.flags._economicEventCount || 0);
        return ecoCount >= 10 && st.player.day >= 100;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📊 系统化你的投资知识",
          hint: "会计XP+50, 心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024EconInsightDone = true;
            st.flags._b1024EconInsight = true;
            gx("accounting", 50);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            msg("📊 你开始用经济学的眼光看待世界。会计EXP+50，心智+5。", "success");
          },
        },
        {
          text: "📝 记录下这些规律",
          hint: "智力+3, 编程XP+20",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024EconInsightDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            gx("coding", 20);
            msg("📝 你建了一个文档，记录下这些街头智慧。智力+3，编程EXP+20。", "info");
          },
        },
      ],
    },

    // ===== 2. B→D 事件社交涟漪 =====
    {
      id: "b1024_event_social_ripple",
      phase: "street",
      icon: "🔄",
      title: "你的经历在朋友圈传开了",
      story: "好事不出门，坏事传千里。\n\n你在街头摸爬滚打的故事，不知怎么就在朋友圈里传开了。\n\n有人佩服你的勇气，有人觉得你疯了，还有人偷偷来找你取经。\n\n就连平时不怎么联系的老李，都发来消息问你是不是真的赚到钱了。\n\n这个世界就是这样——你做成了，所有人都是你的朋友。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1024SocialRippleDone) return false;
        var totalEarned = (st.resources && st.resources.totalEarned) || 0;
        return totalEarned >= 20000 && st.player.day >= 80;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "🤝 大方分享经验",
          hint: "人缘+5, 心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024SocialRippleDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            // 提升所有已认识NPC的好感
            if (st.relationships) {
              for (var _nid in st.relationships) {
                var _rel = st.relationships[_nid];
                if (_rel && _rel.met && typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _nid, 2, "经历分享");
                }
              }
            }
            msg("🤝 你大方分享了你的经历，朋友们对你的印象更好了。所有NPC好感+2，名气+5。", "success");
          },
        },
        {
          text: "🙂 低调地笑一笑",
          hint: "智力+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024SocialRippleDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 2);
            msg("🙂 你笑了笑，没多说什么。低调的人往往走得更远。智力+2。", "info");
          },
        },
      ],
    },

    // ===== 3. B→F 事件记忆墙 =====
    {
      id: "b1024_event_memory_wall",
      phase: "street",
      icon: "🖼️",
      title: "记忆墙上的新照片",
      story: "你翻着手机相册，看到了这一路走来的点点滴滴——\n\n第一次在批发市场进货时的手忙脚乱，\n第一次赚到钱时的兴奋，\n第一次被人骗时的沮丧，\n第一次给人发工资时的自豪……\n\n这些记忆，就是你的财富。\n\n每一段经历都在你身上留下了痕迹，\n那些杀不死你的，终将使你更强大。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b1024MemoryWallDone) return false;
        var eventCount = (st.flags && st.flags._eventCount) || 0;
        return eventCount >= 20 && st.player.day >= 60;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📖 写一篇日记",
          hint: "所有技能XP+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024MemoryWallDone = true;
            st.flags._b1024MemoryWall = true;
            gx("sales", 10);
            gx("accounting", 10);
            gx("management", 10);
            gx("coding", 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            msg("📖 你写了一篇日记，记录下这一路的感悟。所有技能EXP+10，心智+3。", "success");
          },
        },
        {
          text: "📸 发一条朋友圈",
          hint: "名气+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b1024MemoryWallDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            msg("📸 你发了一条感慨的朋友圈，收到了很多点赞和评论。名气+5。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();