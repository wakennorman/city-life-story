/**
 * 域H(Phase2/公司) 联动增强 R698
 * 桥接：
 *   H→G  h698_founder_health_v2        创始人健康v2 → 消费 state.startup+state.status,
 *     创业者身心健康
 *   H→A  h698_corp_data_asset_v2      公司数据资产v2 → 消费 state.startup,
 *     公司经营数据价值化
 *   H→D  h698_corp_social_impact       公司社会影响 → 消费 state.startup+state.relationships,
 *     公司对社会的关系影响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR698Loaded) return;
  RANDOM_EVENTS._domainHLinkageR698Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  var EVENTS = [
    {
      id: "h698_founder_health_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💚",
      title: "创业者的健康",
      story: "创业不是以健康为代价",
      triggers: { minDay: 180, interval: 150, maxRepeats: 2, excludeFlags: ["_h698HealthCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h698HealthCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🏃 制定健康计划",
          hint: "健康+6,心智+3,置_h698Fitness",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698HealthCd = true;
            st.flags._h698Fitness = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 身体是革命的本钱,创业者更要爱护自己。健康+6,心智+3。", "success");
            }
          }
        },
        {
          text: "😴 调整作息",
          hint: "健康+4,心情+6,置_h698Sleep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698HealthCd = true;
            st.flags._h698Sleep = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 睡好觉,效率更高。健康+4,心情+6。", "success");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "熬夜赶工,你问自己——'创业是为了更好的生活,还是把生活搭进去了?'";
      }
    },
    {
      id: "h698_corp_data_asset_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司数据资产",
      story: "公司积累的数据是一笔财富",
      triggers: { minDay: 200, interval: 180, maxRepeats: 2, excludeFlags: ["_h698DataCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h698DataCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📈 数据资产化",
          hint: "智力+4,会计XP+5,置_h698Asset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698DataCd = true;
            st.flags._h698Asset = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 数据是新时代的石油。智力+4,会计XP+5。", "success");
            }
          }
        },
        {
          text: "🔒 谨慎保护",
          hint: "心智+5,置_h698Privacy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698DataCd = true;
            st.flags._h698Privacy = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔒 数据安全无小事。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "公司拥有的用户数据、交易记录——'这些数据,是公司的无形资产,也是责任。'";
      }
    },
    {
      id: "h698_corp_social_impact",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "公司的社会影响",
      story: "公司不只是赚钱机器",
      triggers: { minDay: 220, interval: 200, maxRepeats: 1, excludeFlags: ["_h698SocialCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h698SocialCd) return false;
        return hasCompany(st) && st.relationships && st.player && st.player.day >= 220;
      },
      choices: [
        {
          text: "🎉 组织公益活动",
          hint: "社交XP+6,好感+3,置_h698CSR",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698SocialCd = true;
            st.flags._h698CSR = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 企业社会责任,从身边做起。社交XP+6,好感+3。", "success");
            }
          }
        },
        {
          text: "🏢 专注经营",
          hint: "管理XP+5,置_h698Focus",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h698SocialCd = true;
            st.flags._h698Focus = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 做好本职,就是最好的社会责任。管理XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "公司做大了,你开始思考——'除了赚钱,公司还能为社会做什么?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
