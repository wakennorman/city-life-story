/**
 * 经济/投资域联动增强事件 — 域 E（经济/投资）跨域桥接
 *
 * 设计意图（全系统优化·循环 R11 · 域E）：
 *   投资/股票/房产/财富税等经济系统长期"算而不显"——
 *   economy_v3.1、investment.js、property_market.js 的数值从不进入叙事。
 *   本文件补 3 个跨域桥接事件，把"钱"变成玩家能感知、能抉择的人生片段：
 *     ① bull_market_tea_party  — E→D（经济→社交）：牛市里与已结识 NPC 分享收益，好感+，社会比较
 *     ② asset_milestone_reflection — E→G（经济→核心/人生）：资产跨过里程碑，峰终定律式自我肯定
 *     ③ colleague_invest_club  — E→C（经济→职业）：职场期同事理财饭局，职场声誉/道德抉择
 *
 * 接入方式：与 insider_trading_events.js 相同的 IIFE 注入 RANDOM_EVENTS 模式
 * 全部字段 || 防御；数值标 [PLACEHOLDER]，待 playtest 调参。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._economyLinkageLoaded) return;
  RANDOM_EVENTS._economyLinkageLoaded = true;

  // ====== 工具: 估算玩家总资产（现金+存款+房产+车辆+股票市值+比特币）======
  function estimateTotalAssets(st) {
    var cash = (st.resources && st.resources.cash) || 0;
    var bank = (st.resources && st.resources.bankBalance) || 0;
    var total = cash + bank;
    var inv = st.investment;
    if (!inv) return total;
    if (inv.properties) {
      for (var i = 0; i < inv.properties.length; i++) {
        var p = inv.properties[i];
        total += p.currentPrice || p.buyPrice || 0;
      }
    }
    if (inv.cars) {
      for (var c = 0; c < inv.cars.length; c++) {
        var car = inv.cars[c];
        total += car.currentPrice || car.buyPrice || 0;
      }
    }
    if (inv.stockHoldings && inv.stockMarket) {
      for (var s = 0; s < inv.stockHoldings.length; s++) {
        var h = inv.stockHoldings[s];
        var m = inv.stockMarket[h.symbol];
        if (m && m.price) total += m.price * (h.shares || 0);
      }
    }
    if (inv.btcHoldings > 0 && inv.btcPrice > 0) {
      total += inv.btcHoldings * inv.btcPrice;
    }
    return total;
  }

  // ====== 工具: 选取好感最高的已结识 NPC id（守卫遍历）======
  function pickClosestMetNpc(st) {
    var rels = st.relationships || {};
    var bestId = null;
    var bestAff = -1;
    Object.keys(rels).forEach(function (k) {
      var r = rels[k];
      if (r && r.met && (r.affinity || 0) > bestAff) {
        bestAff = r.affinity || 0;
        bestId = k;
      }
    });
    return bestId;
  }

  var ECON_EVENTS = [
    // ===== ① E→D：牛市茶话会（经济收益溢出到社交）=====
    {
      id: "bull_market_tea_party",
      phase: "street",
      icon: "📈",
      title: "牛市里的茶话会",
      story:
        "你的账户这个月红了。不是大红，是那种让人踏实的小红——攒了几年的定投终于开始冒头。\n\n傍晚你溜达到常去的茶馆，老位置还空着。手机里几个已读不回的消息，是平时一起吐槽生活的朋友。\n\n你忽然想：赚了钱，第一反应不该是截图发朋友圈，而是约人喝杯茶。",
      triggers: { minDay: 120, excludeFlags: ["_bullTeaParty"] },
      conditions: function (st) {
        var inv = st.investment;
        if (!inv) return false;
        var holds =
          (inv.stockHoldings && inv.stockHoldings.length > 0) ||
          inv.btcHoldings > 0;
        if (!holds) return false;
        var rels = st.relationships || {};
        var hasFriend = Object.keys(rels).some(function (k) {
          var r = rels[k];
          return r && r.met && (r.affinity || 0) >= 20;
        });
        return hasFriend;
      },
      probability: 0.04, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍵 约朋友喝茶，聊聊这段行情",
          hint: "好感+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            var npcId = pickClosestMetNpc(st);
            if (npcId && typeof applyAffinityChange === "function") {
              applyAffinityChange(
                st,
                npcId,
                3 /*[PLACEHOLDER] 好感增益*/,
                "牛市茶话会",
              );
            }
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 6 /*[PLACEHOLDER] 心情增益*/,
            );
            StateManager.addMessage(
              "🍵 你约了朋友喝茶，把这段行情的得失摊开聊了聊。分享让喜悦翻了倍。心情+6。",
              "success",
            );
          },
        },
        {
          text: "🤫 闷声发大财",
          hint: "心情小幅+，不惊动关系网",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "🤫 你没声张，只是默默记下了这笔收益。财不外露。心情+3。",
              "info",
            );
          },
        },
        {
          text: "💡 顺手给朋友推荐了只票",
          hint: "道德-[PLACEHOLDER]，社交风险",
          apply: function (st) {
            st.flags._bullTeaParty = true;
            st.player.morality = Math.max(
              0,
              (st.player.morality || 50) - 2 /*[PLACEHOLDER] 道德代价*/,
            );
            StateManager.addMessage(
              "💡 你给朋友推荐了持仓里的一只票。万一看错，这人情可就欠下了。道德-2。",
              "warning",
            );
          },
        },
      ],
    },

    // ===== ② E→G：资产里程碑（经济成就→人生峰终反思）=====
    {
      id: "asset_milestone_reflection",
      phase: "street",
      icon: "🏆",
      title: "资产里程碑",
      story:
        "今晚你破天荒翻了翻资产总览：现金、存款、那套小房子、几只票、还有早年间囤的比特币——加在一起，数字第一次让你自己都有点意外。\n\n你想起刚进城那年，兜里只剩三百块，在火车站广场坐了一夜。\n\n钱不是目的。但钱替你挡掉了很多深夜的恐慌。",
      triggers: { minDay: 60, excludeFlags: ["_assetMilestone"] },
      conditions: function (st) {
        var total = estimateTotalAssets(st);
        // [PLACEHOLDER] 阈值对齐 economy_v3.1 富豪税档（¥1000万），此处取"小有积蓄"档，待调参
        return (
          total >= 500000 /*[PLACEHOLDER] 资产里程碑阈值*/ &&
          (st.player.day || 0) > 60
        );
      },
      probability: 0.06, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🏆 停下来，给自己一个肯定",
          hint: "心情+[PLACEHOLDER]，心智+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._assetMilestone = true;
            st.needs.happiness = Math.min(
              100,
              (st.needs.happiness || 50) + 10 /*[PLACEHOLDER] 心情增益*/,
            );
            st.player.mental = Math.min(
              100,
              (st.player.mental || 50) + 5 /*[PLACEHOLDER] 心智增益*/,
            );
            StateManager.addMessage(
              "🏆 你给自己倒了杯酒，没发朋友圈，只是对着窗外的灯笑了笑。这一路，值了。心情+10，心智+5。",
              "success",
            );
          },
        },
        {
          text: "📊 复盘这段路",
          hint: "心智+[PLACEHOLDER]，标记税务意识",
          apply: function (st) {
            st.flags._assetMilestone = true;
            st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            st.flags._taxPlanning = true;
            StateManager.addMessage(
              "📊 你把这几年的取舍在脑子里过了一遍：哪些赌对了，哪些差点翻车。复盘让人清醒。心智+8。",
              "info",
            );
          },
        },
        {
          text: "🚀 这只是起点，继续冲刺",
          hint: "轻量，保持冲劲",
          apply: function (st) {
            st.flags._assetMilestone = true;
            StateManager.addMessage(
              "🚀 你关掉资产页面，把目标往上挪了一格。下一个里程碑，还在前面。",
              "info",
            );
          },
        },
      ],
    },

    // ===== ③ E→C：同事理财饭局（经济×职业，职场期专属）=====
    {
      id: "colleague_invest_club",
      phase: "corporate",
      icon: "💼",
      title: "同事的理财饭局",
      story:
        "周五下班，同组的老周神秘兮兮地戳你：「晚上有空没？几个同事小聚，顺便聊聊……你懂的，最近那点行情。」\n\n包厢里坐着四五个熟人，手机都亮着自选股页面。有人晒收益，有人吐槽被套。\n\n老周夹了口菜：「在写字楼里，会干活是基本功，懂点钱路才踏实。你平时看着挺有想法的，怎么看后市？」",
      triggers: { minDay: 200, excludeFlags: ["_colleagueInvestClub"] },
      conditions: function (st) {
        if (!st.player || st.player.phase !== "corporate") return false;
        var inv = st.investment;
        if (!inv) return false;
        var holds =
          (inv.stockHoldings && inv.stockHoldings.length > 0) ||
          inv.btcHoldings > 0;
        return holds;
      },
      probability: 0.05, // [PLACEHOLDER] 触发率待 playtest
      repeatable: false,
      choices: [
        {
          text: "🍻 参加饭局，交换投资情报",
          hint: "职场声誉+[PLACEHOLDER]，心情+[PLACEHOLDER]",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            if (st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) +
                  4 /*[PLACEHOLDER] 职场声誉增益*/,
              );
            }
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🍻 你去了饭局，几个同事越聊越投缘。信息差就是机会差——职场里多一条财路，也多一分底气。职场声誉+4，心情+5。",
              "success",
            );
          },
        },
        {
          text: "📵 推掉，专心把手头项目做好",
          hint: "道德+[PLACEHOLDER]，稳健",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            st.player.morality = Math.min(
              100,
              (st.player.morality || 50) + 3 /*[PLACEHOLDER] 道德增益*/,
            );
            StateManager.addMessage(
              "📵 你婉拒了：「最近项目紧，先搞钱（工资）要紧。」老周笑了笑没强求。道德+3。",
              "info",
            );
          },
        },
        {
          text: "💡 拉同事一起研究公司期权",
          hint: "职场声誉+[PLACEHOLDER]（更高），深度绑定",
          apply: function (st) {
            st.flags._colleagueInvestClub = true;
            if (st.player.corporate) {
              st.player.corporate.upward = Math.min(
                100,
                (st.player.corporate.upward || 50) +
                  8 /*[PLACEHOLDER] 职场声誉增益（深）*/,
              );
            }
            st.flags._equityTalkActive = true;
            StateManager.addMessage(
              "💡 你把话题引到公司期权上，几个人当场算起账来。懂行权、懂套现，是职场人的另一门必修课。职场声誉+8。",
              "success",
            );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < ECON_EVENTS.length; i++) {
    RANDOM_EVENTS.push(ECON_EVENTS[i]);
  }
})();
