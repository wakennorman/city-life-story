/**
 * 域H(Phase2/公司) 联动增强 R602
 * 桥接：
 *   H→B  h602_company_milestone_story  公司里程碑叙事 → 消费 state.startup 数据,
 *     公司→"公司成长故事"的叙事回响
 *   H→D  h602_corp_team_bonding  公司团队建设 → 消费 state.corporate+state.relationships 数据,
 *     公司→"团队即家人"的社交回响
 *   H→G  h602_entrepreneur_health  创业者健康警示 → 消费 state.startup+state.status 数据,
 *     公司→"创业者的身体代价"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR602Loaded) return;
  RANDOM_EVENTS._domainHLinkageR602Loaded = true;

  var EVENTS = [
    // ====== H→B: 公司里程碑叙事 ======
    {
      id: "h602_company_milestone_story", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "公司里程碑",
      story: "你的公司达到了一个新的里程碑——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 5, excludeFlags: ["_h602MilestoneStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h602MilestoneStoryCooldown) return false;
        return st.startup && st.startup.company && (st.startup.company.valuation || 0) >= 100000;
      },
      choices: [
        { text: "🎉 开个庆祝会", hint: "团队士气+10,现金-2000,名气+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602MilestoneStoryCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.morale = Math.min(100, (st.startup.company.morale || 50) + 10);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 '为了公司的未来,干杯!' 庆祝会上,大家都很开心。团队士气+10,名气+5,现金-2000。", "success");
        }},
        { text: "📝 写篇文章记录", hint: "心智+5,名气+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602MilestoneStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你写了一篇文章,记录公司从0到1的历程。'创业维艰,但每一步都值得。' 心智+5,名气+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var val = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        var name = (st.startup && st.startup.company && st.startup.company.name) || "你的公司";
        return name + "的估值突破了¥" + val.toLocaleString() + "! 回想当初刚创办时的艰难,现在终于看到了成果。这个里程碑,值得好好纪念。";
      }
    },

    // ====== H→D: 公司团队建设 ======
    {
      id: "h602_corp_team_bonding", phase: "corporate", _isChainEvent: false, icon: "🤗",
      title: "团队建设",
      story: "你的团队提议搞一次团建活动——{desc}",
      triggers: { minDay: 45, interval: 90, maxRepeats: 8, excludeFlags: ["_h602TeamBondingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h602TeamBondingCooldown) return false;
        return st.corporate && st.corporate.colleagues && st.corporate.colleagues.length >= 2;
      },
      choices: [
        { text: "🎳 去玩团建", hint: "团队关系+5,心情+8,现金-1500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602TeamBondingCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1500);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.corporate && st.corporate.colleagues) {
            for (var ci = 0; ci < st.corporate.colleagues.length; ci++) {
              if (st.corporate.colleagues[ci]) {
                st.corporate.colleagues[ci].relationship = Math.min(100, (st.corporate.colleagues[ci].relationship || 50) + 5);
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 '老板大气!' 团建活动让大家玩得很开心,同事之间的关系也更紧密了。团队关系+5,心情+8,现金-1500。", "success");
        }},
        { text: "🍕 点个外卖一起吃饭", hint: "团队关系+3,心情+5,现金-500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602TeamBondingCooldown = true;
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (st.corporate && st.corporate.colleagues) {
            for (var ci = 0; ci < st.corporate.colleagues.length; ci++) {
              if (st.corporate.colleagues[ci]) {
                st.corporate.colleagues[ci].relationship = Math.min(100, (st.corporate.colleagues[ci].relationship || 50) + 3);
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤗 大家围坐在一起吃外卖,聊工作聊生活,气氛很融洽。团队关系+3,心情+5,现金-500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你的团队提议:'老板,咱们好久没团建了,出去玩一次吧!' 你看了看团队的状态,确实需要一些团队建设活动来增强凝聚力。";
      }
    },

    // ====== H→G: 创业者健康警示 ======
    {
      id: "h602_entrepreneur_health", phase: "corporate", _isChainEvent: false, icon: "💊",
      title: "创业者的代价",
      story: "连续的高强度工作让身体发出了警告——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 4, excludeFlags: ["_h602EntrepreneurHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._h602EntrepreneurHealthCooldown) return false;
        if (!st.player) return false;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        var health = (st.status && st.status.health) || 100;
        return (fatigue > 60 || health < 60) && st.startup && st.startup.company;
      },
      choices: [
        { text: "📅 减少工作时长", hint: "疲劳-20,健康+5,公司效率-5%", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602EntrepreneurHealthCooldown = true;
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
          if (st.startup && st.startup.company) {
            st.startup.company.efficiency = Math.max(50, (st.startup.company.efficiency || 100) - 5);
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💊 你决定不再天天熬夜,把工作时间控制在10小时内。虽然效率略有下降,但身体要紧。疲劳-20,健康+5,效率-5%。", "success");
        }},
        { text: "👨‍💼 招个COO分担", hint: "健康+10,现金-3000/月", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602EntrepreneurHealthCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 10);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💊 你招了一个COO来分担管理工作。'专业的事交给专业的人。' 健康+10,现金-3000。", "success");
        }},
        { text: "💪 咬牙坚持", hint: "心智+5,健康-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h602EntrepreneurHealthCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.status) st.status.health = Math.max(0, (st.status.health || 100) - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💊 '创业就没有不累的,咬咬牙就过去了!' 你继续坚持。心智+5,健康-3。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = (st.status && st.status.health) || 100;
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        var val = (st.startup && st.startup.company && st.startup.company.valuation) || 0;
        return "公司估值¥" + val.toLocaleString() + ",但你的健康值只剩" + health + ",疲劳度" + fatigue + "。'创业是场马拉松,不是百米冲刺。' 你开始思考:这样拼下去,值得吗?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();