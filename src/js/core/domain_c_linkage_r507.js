/**
 * 域C(职业/成长) 联动增强 R507
 * 桥接：
 *   C→D  c507_career_network_evolve 职业人脉进化 → 消费 skills+relationships 数据,
 *     社交→"随着职业发展，人脉圈也在变化"的社交进化
 *   C→G  c507_career_burnout_recover 职业倦怠恢复 → 消费 skills+needs 数据,
 *     休息→"累了就歇歇，是为了走更远的路"的恢复叙事
 *   C→B  c507_career_mentor_story 职业导师故事 → 消费 skills+flags 数据,
 *     传承→"那些帮助过你的人"的感恩叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR507Loaded) return;
  RANDOM_EVENTS._domainCLinkageR507Loaded = true;

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
      id: "c507_career_network_evolve", phase: "corporate", _isChainEvent: false, icon: "🔄",
      title: "人脉进化",
      story: "你发现随着职业发展，身边的人也在变化——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_c507NetworkEvolveCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c507NetworkEvolveCooldown);
      },
      choices: [
        { text: "🔄 拓展新人脉", hint: "社交XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507NetworkEvolveCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '你的水平，取决于你身边最常接触的五个人。' 你开始有意识地拓展人脉。社交XP+5,心智+2。", "success");
        }},
        { text: "📇 维护旧人脉", hint: "社交XP+3,好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507NetworkEvolveCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "维护人脉");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你联系了一些老朋友——'虽然现在走的路不同了，但感情还在。' 社交XP+3,好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现随着职业发展，身边的人也在变化——有人离开了你的圈子，有人新加入进来。人脉圈，是职业发展的镜像。";
      }
    },
    {
      id: "c507_career_burnout_recover", phase: "corporate", _isChainEvent: false, icon: "😌",
      title: "倦怠恢复",
      story: "你感觉自己快要 burnout 了——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c507BurnoutRecoverCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c507BurnoutRecoverCooldown);
      },
      choices: [
        { text: "😌 请假休息", hint: "疲劳-5,健康+2,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507BurnoutRecoverCooldown = true;
          if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); }
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 你请了几天假——'什么都不想，好好休息。' 充完电之后，你感觉焕然一新。疲劳-5,健康+2,心情+3。", "success");
        }},
        { text: "🧘 调整心态", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507BurnoutRecoverCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("😌 '工作不是全部，生活才是。' 你调整了心态，不再把工作带回家。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你感觉自己快要 burnout 了——'不想上班、不想回消息、什么都不想做。' 这是身体在告诉你，该休息了。";
      }
    },
    {
      id: "c507_career_mentor_story", phase: "street", _isChainEvent: false, icon: "🙏",
      title: "感恩导师",
      story: "你想起了一位曾经帮助过你的前辈——{desc}",
      triggers: { minDay: 30, interval: 180, maxRepeats: 3, excludeFlags: ["_c507MentorStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c507MentorStoryCooldown);
      },
      choices: [
        { text: "🙏 去感谢TA", hint: "管理XP+4,心情+3,好感+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507MentorStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "感谢当年的帮助");
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 你联系了当年帮过你的前辈——'谢谢您当年的指导，我现在...' 电话那头传来欣慰的笑声。管理XP+4,心情+3,好感+3。", "success");
        }},
        { text: "📝 写封信", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c507MentorStoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙏 你写了一封感谢信——'虽然可能不会寄出去，但写下这些字的时候，心里很温暖。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你想起了一位曾经帮助过你的前辈——'如果没有TA当年的那句话，我可能走不到今天。' 有些人的出现，就是为了改变你的一生。";
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