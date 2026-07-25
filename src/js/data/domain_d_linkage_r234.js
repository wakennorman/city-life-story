/**
 * 域D联动增强 R234 — NPC/社交 × 跨域桥接
 * [全系统自洽修复] 域D R234: 关系传导/职场社交数据首次被事件消费
 *
 * 2个新事件：
 *   ① D→G: 关系传导回响 — 单NPC好感≥80后触发跨NPC传导叙事(消费_propagationLog,当前0事件覆盖)
 *   ② D→C: 职场贵人 — 同事关系≥60触发职业推荐(消费corporate.colleagues.network,当前0事件覆盖)
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;

  function _npcName(npcId) {
    if (typeof getNpcById === "function") {
      var n = getNpcById(npcId);
      if (n && n.name) return n.name;
    }
    return npcId;
  }

  // ===== ① D→G: 关系传导回响 =====
  // 单NPC好感≥80后,触发跨NPC传导叙事(消费关系传导机制)
  var affinity_propagation_echo = {
    id: "affinity_propagation_echo",
    title: "一封信",
    phase: "street",
    repeatable: false,
    priority: 75,
    conditions: function (st) {
      if (!st || !st.flags || !st.relationships) return false;
      if (st.flags._affinityPropEchoDone) return false;
      // 找好感≥80的NPC,且其有关系传导日志
      for (var k in st.relationships) {
        if (Object.prototype.hasOwnProperty.call(st.relationships, k)) {
          var r = st.relationships[k];
          if (r && r.met === true && (r.affinity || 0) >= 80 && r._propagationLog && r._propagationLog.length > 0) {
            st._propEchoNpc = k;
            return true;
          }
        }
      }
      return false;
    },
    probability: 0.06,
    getStory: function (st) {
      var npcId = st._propEchoNpc;
      var name = _npcName(npcId);
      var L = [];
      L.push("你在街上碰到了" + name + "的一个老朋友。");
      L.push("");
      L.push("'你就是" + name + "经常提起的那个人吧？'");
      L.push("'他总说你这人靠谱。'");
      L.push("");
      L.push("你愣了一下,没想到" + name + "会在背后夸你。");
      L.push("");
      L.push("这座城市就是这样——你对一个人好,总会通过某种方式,传递到另一个人那里。");
      return L.join("\n");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._affinityPropEchoDone = true;
      var npcId = st._propEchoNpc;
      delete st._propEchoNpc;
      if (choiceId === "humble") {
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("😊 你谦虚地笑了笑。好感的传递,比任何回报都珍贵。心情+8,心智+3。", "success");
        }
      } else {
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        if (typeof addSkillXp === "function") addSkillXp("social", 8);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("🤝 你递上一支烟,聊了半晌。人脉XP+8,心情+5。", "success");
        }
      }
    },
    choices: [
      { text: "😊 谦虚回应(心情+8,心智+3)", id: "humble" },
      { text: "🤝 递烟结交(人脉XP+8,心情+5)", id: "connect" },
    ],
    icons: ["📜", "传导"],
  };

  // ===== ② D→C: 职场贵人 =====
  // 同事关系≥60触发职业推荐叙事(消费corporate.colleagues.network)
  var workplace_mentor_referral = {
    id: "workplace_mentor_referral",
    title: "一句推荐",
    phase: "street",
    repeatable: false,
    priority: 78,
    conditions: function (st) {
      if (!st || !st.flags || !st.corporate || !st.corporate.colleagues) return false;
      if (st.flags._workplaceMentorDone) return false;
      var net = st.corporate.colleagues.network;
      if (!Array.isArray(net) || net.length === 0) return false;
      // 找关系≥60的同事
      for (var i = 0; i < net.length; i++) {
        if (net[i] && (net[i].relationship || 0) >= 60) {
          st._mentorColleague = net[i].id || net[i].name;
          return true;
        }
      }
      return false;
    },
    probability: 0.07,
    getStory: function (st) {
      var name = st._mentorColleague || "老同事";
      var L = [];
      L.push("你以前的同事" + name + "突然联系你。");
      L.push("");
      L.push("'我现在在一家公司,正好缺人。你愿意来试试吗?'");
      L.push("");
      L.push("'我跟老板推荐过你,他说可以面试。'");
      L.push("");
      L.push("一个人对你的认可,可能会成为你人生的转折点。");
      return L.join("\n");
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (!st.flags) st.flags = {};
      st.flags._workplaceMentorDone = true;
      delete st._mentorColleague;
      if (choiceId === "accept") {
        // 接受: 置推荐flag + 管理XP + 心情
        st.flags._careerReferral = true;
        if (typeof addSkillXp === "function") addSkillXp("management", 12);
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("💼 你决定去面试。职场推荐已解锁,管理XP+12,心情+8。", "success");
        }
      } else {
        // 拒绝: 心智+5(清醒认知)
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        if (typeof StateManager !== "undefined" && StateManager.addMessage) {
          StateManager.addMessage("🙂 你婉拒了。自己的路,自己选。心智+5。", "info");
        }
      }
    },
    choices: [
      { text: "💼 接受推荐(管理XP+12,推荐flag)", id: "accept" },
      { text: "🙂 婉拒,走自己的路(心智+5)", id: "decline" },
    ],
    icons: ["🤝", "推荐"],
  };

  RANDOM_EVENTS.push(affinity_propagation_echo);
  RANDOM_EVENTS.push(workplace_mentor_referral);

  if (typeof console !== "undefined" && console.log) {
    console.log("[D R234] 2 linkage events registered");
  }
})();
