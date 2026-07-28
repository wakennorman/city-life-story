/**
 * 域B(事件/叙事) 联动增强 R658b（本窗口，避让并行R658/R659）
 * 选题：events_street_survival.js 三个写-only死flag全库首消费（写入后零读者零回报）：
 *   B→E  b658b_bulk_channel      flags._bulkSupplier(integrity_reward"长期供货合作"置位后零兑现) →
 *     批发渠道真实兑现：进货折扣叙事+首笔渠道收益，诚信经营长期回报闭环
 *   B→C  b658b_liu_crew_callback flags._liuPartner(老刘包工头"入伙"置位后零后续) →
 *     工程队后续叙事：工地技术活收入+repair技能成长，职业-叙事闭环
 *   B→D  b658b_volunteer_echo    flags._communityNetwork(钱包失主"志愿者网络接入"置位后零兑现) →
 *     志愿活动回响：已结识NPC好感回馈(rel&&rel.met+applyAffinityChange铁律)，社交资本闭环
 * 防御：全部 || 守卫；一次性done flag防重复；conditions全false时无叙事断裂（各源事件自身完整）。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR658bLoaded) return;
  RANDOM_EVENTS._domainBLinkageR658bLoaded = true;

  var EVENTS = [
    // ================================================================
    // B→E: 批发渠道兑现 — integrity_reward 承诺的"长期供货关系"首次开花
    // ================================================================
    {
      id: "b658b_bulk_channel",
      phase: "street",
      _isChainEvent: false,
      icon: "📦",
      title: "批发渠道开花结果",
      story:
        "当初跟你谈长期合作的那个批发商打来电话：「兄弟，最近有批好货，给你留了内部价——比市价低两成。做生意这么久，还是跟讲诚信的人合作踏实。」你意识到，当初拒绝假货攒下的信誉，正在变成实打实的渠道优势。",
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._bulkSupplier) return false; // [联动] 首消费 events_street_survival.js:3194 死flag
        if (st.flags._b658bBulkDone) return false;
        return st.player && st.player.phase === "street" && (st.player.day || 0) >= 30;
      },
      repeatable: false,
      choices: [
        {
          text: "📦 吃下这批货转手赚差价",
          hint: "渠道优势变现",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bBulkDone = true;
            var profit = Random.int(200, 450);
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + profit;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            }
            if (typeof addSkillXp === "function") addSkillXp("sales", 8);
            StateManager.addMessage(
              "📦 低价进高价出，净赚¥" + profit + "！诚信换来的渠道就是硬通货。销售经验+8。",
              "success",
            );
          },
        },
        {
          text: "🤝 婉拒，但把渠道介绍给摊友",
          hint: "积累人情与名气",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bBulkDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤝 你把好渠道介绍给了相熟的摊友，圈子里都说你仗义。名气+6，心情+5。",
              "success",
            );
          },
        },
      ],
      weight: 2,
    },

    // ================================================================
    // B→C: 老刘工程队后续 — _liuPartner"入伙"承诺的职业成长兑现
    // ================================================================
    {
      id: "b658b_liu_crew_callback",
      phase: "street",
      _isChainEvent: false,
      icon: "🏗️",
      title: "刘哥工地上的技术活",
      story:
        "刘哥的工程队接了个改造项目，缺人手做水电翻新。他第一个想到你：「跟我干的兄弟，我不会亏待。这活有点技术含量，干完你就是半个师傅了。」",
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._liuPartner) return false; // [联动] 首消费 events_street_survival.js:3400 死flag
        if (st.flags._b658bLiuDone) return false;
        return st.player && st.player.phase === "street" && (st.player.day || 0) >= 70;
      },
      repeatable: false,
      choices: [
        {
          text: "🔧 接活，边干边学",
          hint: "收入+维修技能大涨",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bLiuDone = true;
            var pay = Random.int(350, 600);
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) + pay;
              st.resources.totalEarned = (st.resources.totalEarned || 0) + pay;
            }
            if (typeof addSkillXp === "function") addSkillXp("repair", 15);
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "🔧 三天活干下来，赚了¥" + pay + "，手艺也精进不少。维修经验+15，疲劳+10。",
              "success",
            );
          },
        },
        {
          text: "🙏 这次先不了，帮刘哥介绍个熟人",
          hint: "维系关系不透支体力",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bLiuDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            StateManager.addMessage(
              "🙏 刘哥表示理解：「有合适的活我再叫你。」这份关系还在。名气+3。",
              "info",
            );
          },
        },
      ],
      weight: 2,
    },

    // ================================================================
    // B→D: 志愿网络回响 — _communityNetwork"志愿者组织"承诺的社交兑现
    // ================================================================
    {
      id: "b658b_volunteer_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "🧡",
      title: "社区志愿日",
      story:
        "社区志愿者组织搞了场便民服务日，你去帮了半天忙。没想到现场碰到好几个熟面孔——大家看到你穿着志愿者马甲，眼神里都多了几分敬意。做好事这件事，圈子是会记账的。",
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._communityNetwork) return false; // [联动] 首消费 events_street_survival.js:3696 死flag
        if (st.flags._b658bVolunteerDone) return false;
        return st.player && st.player.phase === "street";
      },
      repeatable: false,
      choices: [
        {
          text: "🧡 全程帮忙到收摊",
          hint: "熟人好感普涨",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bVolunteerDone = true;
            var boosted = 0;
            var rels = st.relationships || {};
            if (typeof applyAffinityChange === "function") {
              for (var npcId in rels) {
                var rel = rels[npcId];
                if (rel && rel.met && boosted < 4) { // 铁律：met检查+封顶4人防失衡
                  applyAffinityChange(st, npcId, 2, "社区志愿日看到你的付出");
                  boosted++;
                }
              }
            }
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            StateManager.addMessage(
              boosted > 0
                ? "🧡 忙了一整天，" + boosted + "位熟人对你刮目相看（好感+2）。名气+4，心情+6。"
                : "🧡 忙了一整天很充实。名气+4，心情+6。",
              "success",
            );
          },
        },
        {
          text: "👋 露个面就走",
          hint: "轻度参与",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._b658bVolunteerDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            StateManager.addMessage("👋 打了个照面帮忙搬了几箱水，心情+2。", "info");
          },
        },
      ],
      weight: 2,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
