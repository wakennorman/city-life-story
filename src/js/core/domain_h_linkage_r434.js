/**
 * 域H(Phase2/公司) 联动增强 R434
 * 桥接：
 *   H→D  h434_team_bonding       公司团队建设 → 消费 corporate.team 数据,
 *     团队凝聚力→"和同事打成一片"的社交回响，加深同事关系
 *   H→B  h434_corp_strategy       公司战略决策 → 消费 corporate.rank+startup 数据,
 *     经营阶段的战略选择→"公司动向"的行业叙事
 *   H→E  h434_corp_profit_invest  公司盈利溢出 → 消费 corporate+resources 数据,
 *     公司盈利→"用公司赚的钱投资"的财务联动
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR434Loaded) return;
  RANDOM_EVENTS._domainHLinkageR434Loaded = true;

  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }
  function teamSize(st) {
    return (st.corporate && st.corporate.team) ? st.corporate.team.length : 0;
  }
  function avgTeamLoyalty(st) {
    var t = st.corporate && st.corporate.team;
    if (!t || t.length === 0) return 0;
    var sum = 0;
    for (var i = 0; i < t.length; i++) sum += (t[i].loyalty || 50);
    return Math.round(sum / t.length);
  }

  var EVENTS = [
    // H→D：团队凝聚力 → 同事社交回响
    {
      id: "h434_team_bonding", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "团队聚餐",
      story: "项目告一段落，你组织团队出去搓了一顿——{desc}",
      triggers: { minDay: 40, interval: 120, maxRepeats: 3, excludeFlags: ["_h434TeamBondingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (teamSize(st) < 2) return false;
        return (st.flags && !st.flags._h434TeamBondingCooldown);
      },
      choices: [
        { text: "🍻 跟大伙儿打成一片", hint: "团队忠诚+2,同事好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434TeamBondingCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 2); } }
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "公司聚餐时聊得来，关系更近了");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 酒过三巡，同事们开始聊起家长里短——你发现这群人不只是同事，更像战友。团队忠诚+2,好感+3,心情+3。", "success");
        }},
        { text: "💼 简单吃两口就撤", hint: "无奖励", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434TeamBondingCooldown = true;
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var ts = teamSize(st);
        return "项目告一段落，你组织团队出去搓了一顿——" + ts + "个人围坐一桌，酒杯碰撞声里，工作群的聊天记录都变得鲜活起来。";
      }
    },
    // H→B：公司战略决策 → 行业叙事
    {
      id: "h434_corp_strategy", phase: "corporate", _isChainEvent: false, icon: "📋",
      title: "战略会议",
      story: "季度战略会上，你们讨论了公司的下一步方向——{desc}",
      triggers: { minDay: 90, interval: 90, maxRepeats: 5, excludeFlags: ["_h434CorpStrategyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.rank) return false;
        return (st.flags && !st.flags._h434CorpStrategyCooldown);
      },
      choices: [
        { text: "📈 全力扩张市场份额", hint: "社交XP+5,公司知名度+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434CorpStrategyCooldown = true;
          grantXp("social", 5); // [全系统自洽修复] 域B R572 修复:grantXp("marketing")非真实技能键(XP静默丢弃)→映射social(营销=社交)
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '先占领市场再谈利润'——这个战略方向在业内引起了讨论。社交XP+5,公司知名度+3。", "success");
        }},
        { text: "🔬 深耕产品研发", hint: "编程XP+5,产品质量+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434CorpStrategyCooldown = true;
          grantXp("coding", 5); // [全系统自洽修复] 域B R572 修复:grantXp("technology")非真实技能键(XP静默丢弃)→映射coding(技术=编程)
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 '产品为王'——你决定把资源砸在研发上。这条路慢，但扎实。编程XP+5。", "success");
        }},
        { text: "🤝 寻求战略合作", hint: "人脉+3,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434CorpStrategyCooldown = true;
          grantXp("social", 3);
          var nid = firstMetNpc(st);
          bumpAffinity(st, nid, 3, "战略合作牵线搭桥");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 你决定走开放合作的路——竞争对手也可以是伙伴。社交XP+3,人脉拓展。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var rank = (st.corporate && st.corporate.rank) || "P5";
        return "季度战略会上，你们讨论了公司的下一步方向——" + rank + "级别的位置，每一个决定都不只是关乎自己，更是团队的前途。";
      }
    },
    // H→E：公司盈利溢出 → 个人投资
    {
      id: "h434_corp_profit_invest", phase: "corporate", _isChainEvent: false, icon: "💹",
      title: "公司分红",
      story: "财务说这个季度公司盈利不错，建议你考虑分红——{desc}",
      triggers: { minDay: 120, interval: 90, maxRepeats: 5, excludeFlags: ["_h434CorpProfitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash >= 50000 && (st.flags && !st.flags._h434CorpProfitCooldown);
      },
      choices: [
        { text: "💰 分红落袋，个人投资", hint: "现金+8000,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434CorpProfitCooldown = true;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 8000;
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 公司盈利分红到账——这笔钱放在个人账户里，可以想想怎么投资了。现金+¥8000,会计XP+3。", "success");
        }},
        { text: "🔄 再投资扩大经营", hint: "公司资金+8000,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h434CorpProfitCooldown = true;
          if (st.corporate && st.corporate.company) {
            st.corporate.company.funds = (st.corporate.company.funds || 0) + 8000;
          }
          grantXp("management", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 你决定把利润全部再投入——公司规模越大，未来的回报才更可观。管理XP+3,公司资金+¥8000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        return "财务说这个季度公司盈利不错，建议你考虑分红——你看了看个人账户余额（¥" + Math.floor(cash) + "），开始盘算这笔钱怎么用最划算。";
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