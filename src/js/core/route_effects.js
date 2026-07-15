/**
 * 三章结局路线游戏效应 — Route Effects
 *
 * 让 story_chapters.js 已记录的 _lifeRoute 产生实际游戏效果。
 * 每条路线有独特的被动加成和周期性专属事件。
 *
 * 设计参考：《大多数》人生路径差异化 / This War of Mine 特质系统
 *
 * 接线：
 *   story_chapters.js 设置 _lifeRoute 后调用 initRouteEffects(state)
 *   daily_pipeline.js 新增 route_effects 步骤调用 tickRouteEffects(state)
 */

(function () {
  "use strict";

  // ====== 路线效应表 ======
  var ROUTE_EFFECTS = {
    entrepreneur: {
      label: "创业之路",
      icon: "🚀",
      effects: {
        _routeStartupCostMod: 0.8, // 创业成本-20%（startup.js 注册费修正乘数）
        _routeEventInterval: 30, // 每30天一次创业路演事件
      },
      eventChance: 0.35,
      events: [
        {
          title: "创业路演邀请",
          story:
            "你收到了一个创业路演邀请函。在投资人面前展示项目，也许能拿到一笔投资意向。",
          choices: [
            {
              text: "准备路演",
              hint: "¥500 材料费，有机会获投资",
              apply: function (st) {
                st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
                var bonus = Random.int(5000, 20000);
                st.resources.cash = (st.resources.cash || 0) + bonus;
                StateManager.addMessage(
                  "💼 路演表现不错，获得 ¥" + bonus + " 投资意向金！",
                  "success",
                );
              },
            },
            {
              text: "去看看但不投钱",
              hint: "了解市场风向",
              apply: function (st) {
                if (typeof getNpcById === "function") {
                  var npc = getNpcById("li_ming");
                  if (npc && st.relationships && st.relationships.li_ming) {
                    st.relationships.li_ming.affinity = Math.min(
                      100,
                      (st.relationships.li_ming.affinity || 0) + 3,
                    );
                  }
                }
                StateManager.addMessage(
                  "📊 在路演现场认识了不少业内人士，眼界打开了。",
                  "info",
                );
              },
            },
            {
              text: "忙，不去",
              hint: "专注当前事业",
              apply: function () {
                StateManager.addMessage(
                  "📅 路演错过了，但你的时间用在了更重要的事情上。",
                  "info",
                );
              },
            },
          ],
        },
      ],
    },
    civil_service: {
      label: "体制之路",
      icon: "🏛️",
      effects: {
        _routeExamBonusMod: 1.25, // 考试概率+25%（civil service exam bonus）
        _routeEventInterval: 45, // 每45天一次体制内福利事件
      },
      eventChance: 0.4,
      events: [
        {
          title: "体制内福利",
          story: "单位发了一笔福利补贴，还有一些内部培训机会。",
          choices: [
            {
              text: "领取福利补贴",
              hint: "获得 ¥3000-5000 补贴",
              apply: function (st) {
                var amt = Random.int(3000, 5000);
                st.resources.cash = (st.resources.cash || 0) + amt;
                StateManager.addMessage(
                  "🎁 福利补贴 ¥" + amt + " 到账，稳定是体制内的底气。",
                  "success",
                );
              },
            },
            {
              text: "参加培训",
              hint: "智力+2 或 能力提升",
              apply: function (st) {
                st.player.intelligence = Math.min(
                  100,
                  (st.player.intelligence || 0) + 2,
                );
                StateManager.addMessage(
                  "📚 参加培训受益匪浅，智力提升了。",
                  "info",
                );
              },
            },
          ],
        },
      ],
    },
    wealth: {
      label: "财富之路",
      icon: "💎",
      effects: {
        _routeStockFeeMod: 0.5, // 股票交易费-50%
        _routeEventInterval: 60, // 每60天一次投资机会事件
      },
      eventChance: 0.45,
      events: [
        {
          title: "投资机会",
          story: "一位投资圈的朋友带来一个内部项目机会，可能需要一笔资金。",
          choices: [
            {
              text: "投资 ¥20,000",
              hint: "高风险高回报",
              apply: function (st) {
                st.resources.cash = Math.max(
                  0,
                  (st.resources.cash || 0) - 20000,
                );
                var result = Random.chance(0.55)
                  ? Random.int(30000, 80000)
                  : -Random.int(5000, 15000);
                st.resources.cash = Math.max(
                  0,
                  (st.resources.cash || 0) + result,
                );
                if (result > 0) {
                  StateManager.addMessage(
                    "📈 投资项目回报 ¥" + result + "！眼光不错！",
                    "success",
                  );
                } else {
                  StateManager.addMessage(
                    "📉 投资项目亏损 ¥" + Math.abs(result) + "，投资有风险。",
                    "danger",
                  );
                }
              },
            },
            {
              text: "投 ¥5,000 试试水",
              hint: "小额试探",
              apply: function (st) {
                st.resources.cash = Math.max(
                  0,
                  (st.resources.cash || 0) - 5000,
                );
                var result = Random.chance(0.6)
                  ? Random.int(6000, 12000)
                  : -Random.int(2000, 6000);
                st.resources.cash = Math.max(
                  0,
                  (st.resources.cash || 0) + result,
                );
                if (result > 0) {
                  StateManager.addMessage(
                    "📈 小赚 ¥" + result + "，聊胜于无。",
                    "success",
                  );
                } else {
                  StateManager.addMessage(
                    "📉 亏了 ¥" + Math.abs(result) + "，还好投得不多。",
                    "warning",
                  );
                }
              },
            },
            {
              text: "不投，保持现金",
              hint: "稳健为主",
              apply: function () {
                StateManager.addMessage("💼 你选择观望，现金为王。", "info");
              },
            },
          ],
        },
      ],
    },
    lying_flat: {
      label: "躺平之路",
      icon: "🛋️",
      effects: {
        _routeFatigueRecoveryMod: 1.3, // 疲劳恢复+30%
        _routeEventInterval: 30, // 每30天躺平专属放松事件
      },
      eventChance: 0.5,
      events: [
        {
          title: "躺平日",
          story:
            "今天阳光很好，你决定彻底放松一天。不需要赶时间，不需要看KPI。",
          choices: [
            {
              text: "去公园晒太阳",
              hint: "心情+10，疲劳-15",
              apply: function (st) {
                st.needs.happiness = Math.min(
                  100,
                  (st.needs.happiness || 0) + 10,
                );
                st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
                StateManager.addMessage(
                  "☀️ 在公园长椅上晒太阳发呆，生活本该如此。",
                  "info",
                );
              },
            },
            {
              text: "在家看剧",
              hint: "心情+8，但费时间",
              apply: function (st) {
                st.needs.happiness = Math.min(
                  100,
                  (st.needs.happiness || 0) + 8,
                );
                if (st.player) st.player.actionPoints = 0;
                StateManager.addMessage("📺 追了一天剧，荒废但快乐。", "info");
              },
            },
            {
              text: "躺平思考人生",
              hint: "心智+1",
              apply: function (st) {
                st.player.mental = Math.min(100, (st.player.mental || 0) + 1);
                st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
                StateManager.addMessage(
                  "🤔 躺着想了很多，想通了也在所不惜。",
                  "info",
                );
              },
            },
          ],
        },
      ],
    },
    open: {
      label: "开放之路",
      icon: "🌟",
      effects: {
        _routeEventInterval: 30, // 每月一次新机遇发现
      },
      eventChance: 0.4,
      events: [
        {
          title: "新机遇发现",
          story: "生活中总是充满意外。今天你遇到了一个从未想过的新机会。",
          choices: [
            {
              text: "抓住机会试试",
              hint: "随机获得收益或技能提升",
              apply: function (st) {
                var outcomes = [
                  function () {
                    var amt = Random.int(2000, 10000);
                    st.resources.cash = (st.resources.cash || 0) + amt;
                    StateManager.addMessage(
                      "💰 抓住机遇，赚了 ¥" + amt + "！",
                      "success",
                    );
                  },
                  function () {
                    st.player.intelligence = Math.min(
                      100,
                      (st.player.intelligence || 0) + 1,
                    );
                    st.player.physique = Math.min(
                      100,
                      (st.player.physique || 0) + 1,
                    );
                    StateManager.addMessage(
                      "💪 新经历让你身体和头脑都得到了锻炼。",
                      "info",
                    );
                  },
                  function () {
                    if (typeof getNpcById === "function") {
                      var npcs = ["li_ming", "zhang_wei", "wang_dami"];
                      var pick = npcs[Random.int(0, npcs.length - 1)];
                      if (st.relationships && st.relationships[pick]) {
                        st.relationships[pick].affinity = Math.min(
                          100,
                          (st.relationships[pick].affinity || 0) + 5,
                        );
                      }
                    }
                    StateManager.addMessage(
                      "🤝 新机会让你认识了一个有趣的人。",
                      "info",
                    );
                  },
                ];
                outcomes[Random.int(0, outcomes.length - 1)]();
              },
            },
            {
              text: "保持观望",
              hint: "安全第一，但不损失什么",
              apply: function () {
                StateManager.addMessage(
                  "👀 你选择先看看情况。机会还在，不一定非要今天做决定。",
                  "info",
                );
              },
            },
          ],
        },
      ],
    },
  };

  // ====== 初始化路线效应 ======

  /**
   * 在 story_chapters.js 设置 _lifeRoute 后调用
   * 将路线对应的 flag 注入 state
   */
  function initRouteEffects(state) {
    var route = state.flags && state.flags._lifeRoute;
    if (!route || !ROUTE_EFFECTS[route]) return;

    var def = ROUTE_EFFECTS[route];
    var eff = def.effects || {};

    // 注入所有效果 flag
    for (var key in eff) {
      if (eff.hasOwnProperty(key)) {
        state.flags[key] = eff[key];
      }
    }

    // 记录路线激活日
    state.flags._routeActiveDay = state.player.day;

    StateManager.addMessage(
      def.icon + " 你选择了「" + def.label + "」——这条路将塑造你今后的生活。",
      "story",
    );
  }

  // ====== 每日路线事件检测 ======

  /**
   * daily_pipeline 步骤：检查是否触发路线专属事件
   */
  function tickRouteEffects(state) {
    var route = state.flags && state.flags._lifeRoute;
    if (!route || !ROUTE_EFFECTS[route]) return;

    // 避免触发当天已有的事件（防止刚选路线就出事件）
    var activeDay = state.flags._routeActiveDay;
    if (activeDay && state.player.day - activeDay < 3) return;

    var def = ROUTE_EFFECTS[route];
    var interval = def.effects._routeEventInterval || 30;
    var eventChance = def.eventChance || 0.35;

    // 计算上次事件触发后的天数
    var lastEventDay = state.flags._lastRouteEventDay || activeDay || 0;
    var daysSince = state.player.day - lastEventDay;

    if (daysSince < interval) return;
    if (!Random.chance(eventChance)) return;

    // 选择事件
    var events = def.events;
    if (!events || events.length === 0) return;
    var evt = events[Random.int(0, events.length - 1)];

    // 记录触发日
    state.flags._lastRouteEventDay = state.player.day;

    // 通过弹窗展示
    if (typeof showEventModal === "function") {
      state._pendingEvent = {
        id: "route_event_" + route,
        icon: def.icon,
        title: evt.title,
        story: evt.story,
        choices: evt.choices,
      };
      setTimeout(function () {
        if (typeof showEventModal === "function") {
          showEventModal(state._pendingEvent);
        }
      }, 100);
    } else {
      StateManager.addMessage(
        def.icon + " " + evt.title + " — " + evt.story,
        "event",
      );
    }
  }

  // ====== 获取路线效应描述（供百科使用） ======
  function getRouteEffectsDesc(route) {
    if (!route || !ROUTE_EFFECTS[route]) return null;
    var def = ROUTE_EFFECTS[route];
    var descs = [];
    var eff = def.effects || {};
    if (eff._routeStartupCostMod)
      descs.push(
        "创业成本-" + Math.round((1 - eff._routeStartupCostMod) * 100) + "%",
      );
    if (eff._routeExamBonusMod)
      descs.push(
        "考试概率+" + Math.round((eff._routeExamBonusMod - 1) * 100) + "%",
      );
    if (eff._routeStockFeeMod)
      descs.push(
        "股票交易费-" + Math.round((1 - eff._routeStockFeeMod) * 100) + "%",
      );
    if (eff._routeFatigueRecoveryMod)
      descs.push(
        "疲劳恢复+" +
          Math.round((eff._routeFatigueRecoveryMod - 1) * 100) +
          "%",
      );
    if (eff._routeEventInterval)
      descs.push("每" + eff._routeEventInterval + "天专属事件");
    return {
      icon: def.icon,
      label: def.label,
      descs: descs,
    };
  }

  // ====== 全局挂载 ======
  if (typeof window !== "undefined") {
    window.ROUTE_EFFECTS = ROUTE_EFFECTS;
    window.initRouteEffects = initRouteEffects;
    window.tickRouteEffects = tickRouteEffects;
    window.getRouteEffectsDesc = getRouteEffectsDesc;
  }
})();
