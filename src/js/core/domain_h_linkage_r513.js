/**
 * 域H(Phase2/公司) 联动增强 R513
 * 桥接：
 *   H→F  h513_corp_office_ui     公司办公室UI → 消费 corporate 数据,
 *     办公→"你的办公室长什么样"的办公环境展示
 *   H→C  h513_corp_internship    公司实习计划 → 消费 corporate+team 数据,
 *     新人→"培养下一代"的实习生叙事
 *   H→D  h513_corp_alumni_network 公司校友网络 → 消费 corporate+relationships 数据,
 *     前员工→"前同事也是资源"的前员工网络
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR513Loaded) return;
  RANDOM_EVENTS._domainHLinkageR513Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "h513_corp_office_ui", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "新办公室",
      story: "公司搬进了新办公室——{desc}",
      triggers: { minDay: 50, interval: 180, maxRepeats: 3, excludeFlags: ["_h513OfficeUICooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h513OfficeUICooldown);
      },
      choices: [
        { text: "🏢 精心布置", hint: "管理XP+5,心情+3,公司知名度+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513OfficeUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 '新办公室要有新气象！' 你精心布置了每一个角落。管理XP+5,心情+3,公司知名度+2。", "success");
        }},
        { text: "📋 功能优先", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513OfficeUICooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏢 '实用就好，不搞花里胡哨的。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司搬进了新办公室——'这就是我们的新据点了！' 新的环境，新的开始。";
      }
    },
    {
      id: "h513_corp_internship", phase: "corporate", _isChainEvent: false, icon: "🌱",
      title: "实习生来了",
      story: "公司来了几个实习生——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_h513InternshipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h513InternshipCooldown);
      },
      choices: [
        { text: "🌱 亲自带教", hint: "管理XP+5,社交XP+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513InternshipCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 '看着他们就像看到当年的自己。' 你亲自带教实习生。管理XP+5,社交XP+3,心情+2。", "success");
        }},
        { text: "📋 安排导师", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513InternshipCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你给每个实习生安排了导师——'让他们尽快融入团队。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司来了几个实习生——'大家好，我是新来的实习生！' 年轻的面孔让办公室充满了活力。";
      }
    },
    {
      id: "h513_corp_alumni_network", phase: "corporate", _isChainEvent: false, icon: "🤝",
      title: "前同事会",
      story: "你组织了一场前同事聚会——{desc}",
      triggers: { minDay: 55, interval: 180, maxRepeats: 3, excludeFlags: ["_h513AlumniNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._h513AlumniNetworkCooldown);
      },
      choices: [
        { text: "🤝 好好叙旧", hint: "社交XP+5,好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513AlumniNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "前同事聚会");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '虽然离开了公司，但感情还在。' 前同事聚会，聊的都是回忆。社交XP+5,好感+3,心情+2。", "success");
        }},
        { text: "📇 保持联系", hint: "社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h513AlumniNetworkCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你加了前同事们的联系方式——'以后常联系，说不定还能合作。' 社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你组织了一场前同事聚会——'离开公司后，大家都去了哪里？' 前同事从竞争对手变成了朋友，也变成了资源。";
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