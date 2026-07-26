/**
 * 域C(职业/成长) 联动增强 R306
 * 第七轮循环——把「沉默的成长档案」变成故事。
 * 桥接：
 *   C→D  c306_promotion_mentor   首个消费死flag _careerPromotionCount（career_dev.js:3179 写入后全库无读取）→ 晋升老将被后辈请教（守 rel.met + applyAffinityChange 铁律）
 *   C→E  c306_ledger_sideline    首个事件引用「财务自由」连携 _synergy_accounting_investment → 帮街坊做账理财变现 + 投资意识
 *   C→A  c306_handy_life         首个事件引用「家庭全能」连携 _synergy_cooking_repair → 生活自理红利（省钱+幸福+健康）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR306Loaded) return;
  RANDOM_EVENTS._domainCLinkageR306Loaded = true;

  // 防御辅助：找首个已结识 NPC（严守域D铁律：rel && rel.met）
  function firstMetNpcC306(st) {
    if (!st || !st.relationships) return null;
    for (var nid in st.relationships) {
      var rel = st.relationships[nid];
      if (rel && rel.met && (rel.affinity || 0) >= 20) return nid;
    }
    return null;
  }

  // 防御辅助：好感变更一律走 applyAffinityChange
  function bumpAffinityC306(st, nid, delta, msg) {
    if (!nid) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, delta, msg); } catch (e) {}
    }
  }

  var EVENTS = [
    {
      id: "c306_promotion_mentor",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🪜",
      title: "晋升老将的经验之谈",
      story: "你已经不止一次在晋升答辩里胜出。茶水间里，一位相熟的朋友半开玩笑地问你：「教教我呗，你到底是怎么一路升上来的？」\n\n你想了想，把这些年踩过的坑、熬过的夜、学会闭嘴和学会开口的时机，掰开揉碎讲给对方听。\n\n讲完你才发现——原来自己已经攒下了一部「晋升方法论」。",
      triggers: { minDay: 120, excludeFlags: ["_c306PromotionMentorSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || (st.flags._careerPromotionCount || 0) < 2) return false; // 首个消费死flag
        return !!firstMetNpcC306(st);
      },
      choices: [
        {
          text: "🪜 倾囊相授，不藏私",
          hint: "熟络朋友好感+[PLACEHOLDER:6]，心智+[PLACEHOLDER:5]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306PromotionMentorSeen = true;
            var nid = firstMetNpcC306(st);
            bumpAffinityC306(st, nid, 6, "你把晋升心得倾囊相授，对方由衷佩服。");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🪜 你把" + ((st.flags._careerPromotionCount || 0)) + "次晋升踩过的坑讲成了方法论，朋友受益匪浅。心智+5。", "success");
            }
          },
        },
        {
          text: "🤐 核心心得留一手",
          hint: "心智+[PLACEHOLDER:2]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306PromotionMentorSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤐 你只讲了通用套路，核心心得留了一手。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "c306_ledger_sideline",
      phase: "street",
      _isChainEvent: false,
      icon: "🧾",
      title: "「财务自由」连携：账本外快",
      story: "街口小卖部的老板娘听说你「懂会计又会投资」，抱着一摞皱巴巴的流水单来找你：「帮我看看，这店到底是赚是亏？剩下的钱放哪儿合适？」\n\n你把进销存理成三张表，又按风险给她排了个理财顺序。老板娘看着清清楚楚的账目，当场塞给你一个红包。\n\n钱生钱的手艺，原来在街头也吃香。",
      triggers: { minDay: 90, excludeFlags: ["_c306LedgerSidelineSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._synergy_accounting_investment) return false; // 首个事件引用该连携
        return !!(st.resources);
      },
      choices: [
        {
          text: "🧾 收下红包，再留个理财建议",
          hint: "现金+[PLACEHOLDER:1500]，投资意识觉醒",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306LedgerSidelineSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500;
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 8); } catch (e) {}
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧾 三张表理清一家店。现金+1500，会计经验+8，你对「钱生钱」的理解更深了。", "success");
            }
          },
        },
        {
          text: "🤝 分文不取，攒个人情",
          hint: "心情+[PLACEHOLDER:6]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306LedgerSidelineSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你分文不取，老板娘记下了这个人情。心情+6。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "c306_handy_life",
      phase: "street",
      _isChainEvent: false,
      icon: "🧰",
      title: "「家庭全能」连携：日子越过越顺手",
      story: "水龙头漏了，你十分钟拧好；晚饭想吃什么，自己下厨比外卖便宜一半还好吃。\n\n算下来这个月光「自己动手」就省了一笔钱——更重要的是，屋子里飘着饭菜香、家什件件顺手，这种把日子握在自己手里的踏实感，是花钱买不来的。",
      triggers: { minDay: 60, excludeFlags: ["_c306HandyLifeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || !st.flags._synergy_cooking_repair) return false; // 首个事件引用该连携
        return !!(st.needs && st.status);
      },
      choices: [
        {
          text: "🧰 继续保持自己动手的习惯",
          hint: "现金+[PLACEHOLDER:400]（省下的开销），心情+[PLACEHOLDER:6]，健康+[PLACEHOLDER:3]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306HandyLifeSeen = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 400;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧰 会做饭又会修东西，这个月省下400块，日子越过越顺手。心情+6，健康+3。", "success");
            }
          },
        },
        {
          text: "🛵 偶尔还是想点外卖偷个懒",
          hint: "心情+[PLACEHOLDER:3]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._c306HandyLifeSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🛵 偶尔偷懒也是生活的一部分。心情+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
