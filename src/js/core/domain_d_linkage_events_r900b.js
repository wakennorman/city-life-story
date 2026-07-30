/**
 * 域D(NPC/社交) 联动增强 R900b — 深审配套：社交网络死链复活后的跨域兑现
 *   D→E  d900b_crisis_pr        舆论危机公关抉择(危机机制首个玩家决策点·损失厌恶)
 *   D→B  d900b_feed_resonance   NPC动态流首事件消费(npcFeeds复活后的情感回响·峰终定律)
 *   D→E/C d900b_fans_ad_offer   兑现wiki"粉丝≥1000可接广告"承诺(+_d898/_d890SocialCapital全库首读·社会比较)
 * 铁律自查: met检查/applyAffinityChange四参/getNpcDisplayName兜底/显式phase/done-flag防重复/||守卫
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR900bLoaded) return;
  RANDOM_EVENTS._domainDLinkageR900bLoaded = true;

  function _gx(k, a) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(k, a); } catch (e) {}
    }
  }
  function _aff(st, nid, amt, reason) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, amt, reason); } catch (e) {}
    }
  }
  function _npcName(nid) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(nid) || "老朋友"; } catch (e) {}
    }
    return "老朋友";
  }
  function _msg(txt, kind) {
    if (typeof StateManager !== "undefined") StateManager.addMessage(txt, kind || "info");
  }

  var EVENTS = [
    // ===== 联动1: D→E 舆论危机公关抉择 — 危机机制复活后的首个玩家决策点 =====
    {
      id: "d900b_crisis_pr",
      phase: "street",
      icon: "📢",
      title: "风暴中心：公关还是硬扛？",
      story: "手机在深夜不停震动。你的名字挂在了同城热议上，评论区已经失控。一家公关公司主动找上门：「我们可以帮你控评、澄清、引导舆论——当然，是收费的。」",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d900bCrisisPrDone) return false;
        if (!st.socialNetwork || !st.socialNetwork["舆论危机"]) return false;
        var c = st.socialNetwork["舆论危机"];
        return c.active === true && (c.severity || 0) >= 35;
      },
      probability: 0.5,
      repeatable: false,
      choices: [
        {
          text: "💰 花钱消灾，请公关团队",
          hint: "现金-4000，危机严重度大减，粉丝止损",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bCrisisPrDone = true;
            var cost = 4000; // [PLACEHOLDER] 公关费用
            if (!st.resources || (st.resources.cash || 0) < cost) {
              _msg("💸 你翻遍账户也凑不齐公关费，只能眼睁睁看着舆论发酵……", "warning");
              return;
            }
            st.resources.cash -= cost;
            if (typeof addDailyTransaction === "function") {
              try { addDailyTransaction(st, "expense", "pr_agency", cost, "舆论危机公关费"); } catch (e) {}
            }
            if (st.socialNetwork && st.socialNetwork["舆论危机"]) {
              var c = st.socialNetwork["舆论危机"];
              c.severity = Math.max(0, (c.severity || 0) - 40); // [PLACEHOLDER] 公关降幅
              c.daysRemaining = Math.min(c.daysRemaining || 0, 2);
            }
            st.flags._d900bHiredPr = true;
            _msg("📢 公关团队连夜发澄清稿、律师函警告。风向渐渐扭转，你保住了大部分粉丝（现金-¥4000，危机严重度-40）。", "success");
          },
        },
        {
          text: "🪨 不花这个钱，硬扛到底",
          hint: "心智-12，但危机过后路人缘反增（名气+3）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bCrisisPrDone = true;
            st.flags._d900bToughedOut = true;
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 12);
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            _msg("🪨 你一条条看完恶评，没删没跑，只发了一句「清者自清」。有人开始佩服你的硬气（心智-12，名气+3）。", "info");
          },
        },
      ],
    },

    // ===== 联动2: D→B NPC动态流首事件消费 — 信息流里的旧时光 =====
    {
      id: "d900b_feed_resonance",
      phase: "street",
      icon: "📱",
      title: "刷到老朋友的动态",
      story: "深夜刷手机，你在动态流里看到一个熟悉的名字。那条平平无奇的日常动态，突然让你想起很多事。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d900bFeedResonanceDone) return false;
        if (!st.socialNetwork || !st.socialNetwork.npcFeeds) return false;
        if (st.socialNetwork.npcFeeds.length < 3) return false; // 动态流已运转数日
        // met铁律: 最新一条动态的NPC必须已认识
        var feed = st.socialNetwork.npcFeeds[0];
        if (!feed || !feed.npcId) return false;
        var rel = st.relationships && st.relationships[feed.npcId];
        return !!(rel && rel.met);
      },
      probability: 0.12,
      repeatable: false,
      choices: [
        {
          text: "💬 认真评论，聊了起来",
          hint: "好感+4，心情+8，社交XP+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bFeedResonanceDone = true;
            var feed = st.socialNetwork && st.socialNetwork.npcFeeds && st.socialNetwork.npcFeeds[0];
            var nid = feed && feed.npcId;
            if (nid) {
              _aff(st, nid, 4, "动态下的真诚互动");
              var rel = st.relationships && st.relationships[nid];
              if (rel) rel._lastInteractionDay = st.player.day;
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            _gx("social", 10);
            _msg("💬 你和" + _npcName(nid) + "在评论区从一条动态聊到了凌晨。有些关系，只是需要一个开口的契机（好感+4，心情+8）。", "success");
          },
        },
        {
          text: "👍 默默点了个赞",
          hint: "好感+1，心情+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bFeedResonanceDone = true;
            var feed = st.socialNetwork && st.socialNetwork.npcFeeds && st.socialNetwork.npcFeeds[0];
            var nid = feed && feed.npcId;
            if (nid) _aff(st, nid, 1, "一个不打扰的赞");
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            _msg("👍 你点了个赞就退出去了。成年人的问候，有时就这么简单（好感+1，心情+2）。", "info");
          },
        },
      ],
    },

    // ===== 联动3: D→E/C 兑现wiki"粉丝≥1000可接广告"承诺 + _d898/_d890SocialCapital全库首读 =====
    {
      id: "d900b_fans_ad_offer",
      phase: "street",
      icon: "🤝",
      title: "私信里的广告报价单",
      story: "一个品牌方发来合作私信：「看了你的账号，调性很合适。一条推广，报价看附件。」你盯着那个数字，心跳快了半拍。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d900bAdOfferDone) return false;
        if (!st.socialNetwork) return false;
        return (st.socialNetwork.playerFans || 0) >= 1000; // wiki承诺: 粉丝≥1000可接广告
      },
      probability: 0.15,
      repeatable: false,
      choices: [
        {
          text: "🤝 接单，认真做好这条推广",
          hint: "现金+粉丝数×2，销售XP+15（量化过社交资本再+20%）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bAdOfferDone = true;
            var fans = (st.socialNetwork && st.socialNetwork.playerFans) || 0;
            var pay = Math.round(fans * 2); // [PLACEHOLDER] 每粉丝¥2一次性报价
            // _d898/_d890SocialCapital 全库首读: 量化过社交资本价值的人，报价谈判更有底气
            if (st.flags._d898SocialCapital || st.flags._d890SocialCapital) {
              pay = Math.round(pay * 1.2);
            }
            if (!isFinite(pay) || pay <= 0) pay = 2000; // 极端值守卫
            st.resources = st.resources || { cash: 0 };
            st.resources.cash = (st.resources.cash || 0) + pay;
            if (typeof addDailyTransaction === "function") {
              try { addDailyTransaction(st, "income", "ad_deal", pay, "品牌推广合作"); } catch (e) {}
            }
            st.flags._d900bAdDealIncome = pay;
            _gx("sales", 15);
            _msg("🤝 推广发出后数据不错，品牌方爽快打款¥" + pay + "。你第一次真切感受到：粉丝真的能变成饭钱（销售XP+15）。", "success");
          },
        },
        {
          text: "🚫 拒绝，不想恰烂钱",
          hint: "名气+4，粉丝+50（路人缘上升）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d900bAdOfferDone = true;
            st.flags._d900bAdRefused = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            if (st.socialNetwork) {
              st.socialNetwork.playerFans = (st.socialNetwork.playerFans || 0) + 50; // [PLACEHOLDER] 拒接涨路人缘
            }
            _msg("🚫 你把聊天记录截图发了动态：「恰饭可以，烂钱不赚。」评论区一片叫好，涨了一波粉（名气+4，粉丝+50）。", "success");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) {
        exists = true;
        break;
      }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
