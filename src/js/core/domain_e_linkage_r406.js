/**
 * 域E(经济/投资) 联动增强 R406
 * 第十八轮循环——投资系统三个"活跃但零叙事消费"字段的首次消费：
 *   E→G  e406_fear_greed_mirror    贪恐镜子 → 首个消费 investment.btcFearGreed 极值(≥80贪婪/≤20恐惧)，
 *     币市情绪极端时的逆向定力叙事（峰终定律：极值时刻做记忆锚点），mental+
 *   E→A  e406_policy_pulse         政策风向 → 首个消费 investment._propertyPolicyTightness(楼市政策冲击衰减场)，
 *     把纯数值场转化为"读懂政策"的认知回报叙事，mental+happiness
 *   E→C  e406_trade_journal_review 交易日志复盘 → 首个叙事消费 investment.tradeLog(≥8笔)，
 *     复盘交易流水→会计经验（职业-经济联动），addSkillXp("accounting")
 *
 * 严格照 domain_e_linkage_r396.js / r383.js 已验证 IIFE 注入范式。
 * 所有数值 [PLACEHOLDER] 占位，全 || 防御，phase 显式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR406Loaded) return;
  RANDOM_EVENTS._domainELinkageR406Loaded = true;

  // 安全技能经验（addSkillXp 全局读 state，签名 (skillKey, amount)）
  function grantSkillXpR406(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  function safeMsgR406(text, tone) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      try { StateManager.addMessage(text, tone || "info"); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // E→G: 贪恐镜子 — 首个消费 btcFearGreed 极值（此前仅UI展示，无事件门控）
      id: "e406_fear_greed_mirror",
      phase: "street",
      _isChainEvent: false,
      icon: "🪞",
      title: "贪婪与恐惧的镜子",
      story:
        "深夜刷币价，屏幕上的「贪恐指数」正停在一个罕见的极端读数。\n\n" +
        "群里有人梭哈，有人割肉清仓。你握着手里那点币，忽然意识到：这个数字照出的不是市场，是人心——也包括你自己的。",
      triggers: { minDay: 50, excludeFlags: ["_e406FearGreedSeen"] }, // [PLACEHOLDER] 冷却
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        if (!((inv.btcHoldings || 0) > 0)) return false; // 须真实持币
        var fg = inv.btcFearGreed;
        if (typeof fg !== "number" || !isFinite(fg)) return false;
        return fg >= 80 || fg <= 20; // [PLACEHOLDER] 极值门槛
      },
      choices: [
        {
          text: "🧘 反着人群的方向想一想",
          hint: "逆向定力：心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406FearGreedSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            safeMsgR406("🪞 「别人贪婪我恐惧，别人恐惧我贪婪。」你合上手机，心里反而踏实了。心智+5。", "success");
          }
        },
        {
          text: "🎢 跟着情绪走一把",
          hint: "追涨杀跌：心情-2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406FearGreedSeen = true;
            if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2); // [PLACEHOLDER]
            safeMsgR406("🎢 你跟着群里的情绪操作了一把，事后越想越不安。心情-2。", "warning");
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var fg = Math.round(st.investment.btcFearGreed || 50);
        var mood = fg >= 80 ? "极度贪婪（" + fg + "）——群里全在喊「冲」" : "极度恐惧（" + fg + "）——群里一片哀嚎";
        return "贪恐指数：" + mood + "。\n\n你握着手里的币，这个数字照出的不只是市场，还有你自己的心。";
      }
    },
    {
      // E→A: 政策风向 — 首个消费 _propertyPolicyTightness（此前仅静默驱动房价）
      id: "e406_policy_pulse",
      phase: "street",
      _isChainEvent: false,
      icon: "📰",
      title: "楼市政策的风向",
      story:
        "早点摊上，两个中介模样的人正在争论最近的楼市新政。\n\n" +
        "你想起自己关注的那几个楼盘，价格曲线确实和新闻里的政策节奏对得上。原来数字背后是有风向的。",
      triggers: { minDay: 80, excludeFlags: ["_e406PolicyPulseSeen"] }, // [PLACEHOLDER] 冷却
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        var t = inv._propertyPolicyTightness;
        if (typeof t !== "number" || !isFinite(t)) return false;
        return Math.abs(t) >= 0.05; // [PLACEHOLDER] 政策冲击仍在衰减期内
      },
      choices: [
        {
          text: "🔍 把政策和价格曲线对照着看",
          hint: "读懂风向：心智+4，心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406PolicyPulseSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
            safeMsgR406("📰 你把近期政策和房价走势对照着捋了一遍，看懂了风向的人不慌。心智+4，心情+3。", "success");
          }
        },
        {
          text: "🍜 埋头吃完这碗面",
          hint: "无奖励",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406PolicyPulseSeen = true;
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var t = st.investment._propertyPolicyTightness || 0;
        var dir = t > 0 ? "收紧——中介说「最近不好卖了」" : "放松——中介说「窗口期，该出手了」";
        return "楼市政策正在" + dir + "。\n\n你想起自己关注的那几个楼盘，价格节奏确实和政策风向对得上。";
      }
    },
    {
      // E→C: 交易日志复盘 — 首个叙事消费 tradeLog（此前仅UI流水展示）
      id: "e406_trade_journal_review",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📒",
      title: "交易流水的复盘夜",
      story:
        "周末夜里，你把自己的交易流水从头到尾导了出来。\n\n" +
        "一笔一笔看下去：哪些是深思熟虑，哪些是冲动手滑，白纸黑字骗不了人。做账的功夫，就是这么一笔笔练出来的。",
      triggers: { minDay: 100, excludeFlags: ["_e406JournalReviewed"] }, // [PLACEHOLDER] 冷却
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var inv = st.investment;
        if (!inv) return false;
        var log = inv.tradeLog;
        return Array.isArray(log) && log.length >= 8; // [PLACEHOLDER] 至少8笔真实交易
      },
      choices: [
        {
          text: "📒 逐笔复盘，做一份自己的账",
          hint: "会计经验+8，心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406JournalReviewed = true;
            grantSkillXpR406("accounting", 8); // [PLACEHOLDER] 真实技能键
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            safeMsgR406("📒 你把每笔交易的动机和结果都记了下来，这份账比任何教程都值钱。会计经验+8，心智+4。", "success");
          }
        },
        {
          text: "🛏️ 过去的就让它过去",
          hint: "无奖励",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e406JournalReviewed = true;
          }
        }
      ],
      text: function (st) {
        if (!st || !st.investment) return null;
        var n = Array.isArray(st.investment.tradeLog) ? st.investment.tradeLog.length : 0;
        return "你导出了自己的全部交易流水，一共 " + n + " 笔。\n\n一笔一笔看下去：哪些是深思熟虑，哪些是冲动手滑，白纸黑字骗不了人。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS（id 去重防御）
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
