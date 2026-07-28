/**
 * 域H(Phase2/公司) 联动增强 R682
 * 桥接：
 *   H→G  h682_founder_life_balance  创始人生活平衡 → 消费 state.startup+state.player+state.needs,
 *     创业与生活的平衡反思
 *   H→A  h682_corp_data_legacy      公司数据遗产 → 消费 state.startup+state.resources,
 *     公司经营数据转化为个人数据资产
 *   H→D  h682_corp_culture_social   公司文化社交 → 消费 state.startup+state.relationships,
 *     公司文化影响外部社交关系
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR682Loaded) return;
  RANDOM_EVENTS._domainHLinkageR682Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
  }

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -999;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && r.met && typeof r.affinity === "number" && r.affinity > bestAff) {
        bestAff = r.affinity; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "h682_founder_life_balance",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚖️",
      title: "创始人的生活天平",
      story: "创业不是生活的全部",
      triggers: { minDay: 200, interval: 150, maxRepeats: 2, excludeFlags: ["_h682BalanceCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h682BalanceCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "🌿 给自己放个假",
          hint: "心情+10,健康+5,置_h682Recharge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682BalanceCd = true;
            st.flags._h682Recharge = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌿 休息是为了走更长远的路。心情+10,健康+5。", "success");
            }
          }
        },
        {
          text: "🔥 继续冲刺",
          hint: "管理XP+5,置_h682Hustle",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682BalanceCd = true;
            st.flags._h682Hustle = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 创业就是all in!管理XP+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "每天16小时的工作,你问自己——'创业是为了生活更好,还是把生活搭进去了?'";
      }
    },
    {
      id: "h682_corp_data_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司的数据遗产",
      story: "公司积累的数据是一笔财富",
      triggers: { minDay: 250, interval: 200, maxRepeats: 2, excludeFlags: ["_h682DataCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h682DataCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 250;
      },
      choices: [
        {
          text: "📈 把数据资产化",
          hint: "智力+4,会计XP+5,置_h682DataAsset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682DataCd = true;
            st.flags._h682DataAsset = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 数据是新时代的石油。智力+4,会计XP+5。", "success");
            }
          }
        },
        {
          text: "🔒 谨慎保护",
          hint: "心智+5,置_h682DataPrivacy(风控)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682DataCd = true;
            st.flags._h682DataPrivacy = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔒 数据安全无小事。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "公司拥有的用户数据、交易记录、运营指标——'这些数据,是公司的无形资产,也是责任。'";
      }
    },
    {
      id: "h682_corp_culture_social",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "公司文化的外溢",
      story: "公司的文化影响了你的社交圈",
      triggers: { minDay: 180, interval: 120, maxRepeats: 2, excludeFlags: ["_h682SocialCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h682SocialCd) return false;
        if (!hasCompany(st)) return false;
        return st.relationships && topMetNpc(st) && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🎉 邀请朋友参观公司",
          hint: "好感+3,社交XP+5,置_h682OpenDoor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682SocialCd = true;
            st.flags._h682OpenDoor = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 3, "邀请参观公司");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 朋友来参观,感受到你的成就感。社交XP+5,好感+3。", "success");
            }
          }
        },
        {
          text: "🏢 保持工作和生活分开",
          hint: "心智+4,置_h682Boundary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h682SocialCd = true;
            st.flags._h682Boundary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏢 工作是工作,生活是生活。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = topMetNpc(st);
        var name = (typeof getNpcDisplayName === "function" && npc) ? getNpcDisplayName(npc) : "朋友";
        return name + "说:'听说你开公司了?能不能带我去看看?'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
