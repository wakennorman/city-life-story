/**
 * 人生节点系统（v3.7 Expansion v1）
 *
 * 人生关键里程碑：高考/大学/35岁危机/退休
 * 每个节点有触发条件（基于年龄+天数+属性），选择影响后续发展
 *
 * 设计参考：BitLife人生阶段 / 中国式家长节点事件 / Stardew Valley年度检查点
 */

// ====== 节点定义 ======
const LIFE_NODES = {
  gaokao: {
    id: "gaokao",
    name: "高考",
    icon: "📝",
    triggerDay: 30, // 相对游戏开始约1个月触发（人生重要关口回闪）
    condition: function (state) {
      return (
        state.player.day >= this.triggerDay &&
        !state.flags._lifeNode_gaokao_done
      );
    },
    choices: [
      {
        text: "全力以赴备考",
        hint: "智力≥60，改变命运的机会",
        apply: "gaokao_excellent",
        attrReq: { intelligence: 60 },
      },
      {
        text: "正常发挥",
        hint: "智力≥40，平平淡淡也是真",
        apply: "gaokao_normal",
        attrReq: { intelligence: 40 },
      },
      {
        text: "直接步入社会",
        hint: "放弃高考，提前闯荡",
        apply: "gaokao_skip",
      },
    ],
  },
  university: {
    id: "university",
    name: "大学抉择",
    icon: "🎓",
    triggerDay: 90,
    condition: function (state) {
      return (
        state.flags._lifeNode_gaokao_done &&
        state.player.day >= this.triggerDay &&
        !state.flags._lifeNode_university_done
      );
    },
    choices: [
      {
        text: "读计算机/金融",
        hint: "智力≥65，技能加成：编程+10 会计+10",
        apply: "uni_tech",
        attrReq: { intelligence: 65 },
      },
      {
        text: "读医学/工程",
        hint: "智力≥55，技能加成：医疗知识+10 维修+10",
        apply: "uni_engineering",
        attrReq: { intelligence: 55 },
      },
      {
        text: "读文科/艺术",
        hint: "智力≥45，技能加成：魅力+10 口才+10",
        apply: "uni_arts",
        attrReq: { intelligence: 45 },
      },
      { text: "放弃大学", hint: "直接工作，节省4年时间", apply: "uni_skip" },
    ],
  },
  career35: {
    id: "career35",
    name: "35岁危机",
    icon: "⚡",
    triggerDay: 180,
    condition: function (state) {
      return (
        state.player.day >= this.triggerDay &&
        state.player.day % 30 === 0 &&
        !state.flags._lifeNode_career35_done
      );
    },
    choices: [
      {
        text: "充电转型",
        hint: "智力≥50，学习新技能迎接变化",
        apply: "c35_transform",
        attrReq: { intelligence: 50 },
      },
      {
        text: "咬牙硬扛",
        hint: "体质≥50，靠资历和经验撑过去",
        apply: "c35_hold",
        attrReq: { physique: 50 },
      },
      { text: "寻找新赛道", hint: "人脉打开新机会", apply: "c35_newpath" },
      { text: "躺平接受", hint: "降低期望，守住现有", apply: "c35_lieflat" },
    ],
  },
  retirement: {
    id: "retirement",
    name: "退休规划",
    icon: "🏖️",
    triggerDay: 365,
    condition: function (state) {
      return (
        state.player.day >= this.triggerDay &&
        !state.flags._lifeNode_retirement_done
      );
    },
    choices: [
      {
        text: "体面退休",
        hint: "存款≥¥500K，安心养老",
        apply: "retire_wealthy",
        attrReq: { cash: 500000 },
      },
      {
        text: "发挥余热",
        hint: "技能≥60，返聘做顾问",
        apply: "retire_advisor",
        attrReq: { skill: 60 },
      },
      {
        text: "退而不休",
        hint: "继续工作直到干不动",
        apply: "retire_continue",
      },
    ],
  },
};

function grantLifeNodeSkillXp(state, skillKey, amount) {
  if (!amount) return;
  if (typeof addSkillXp === "function") {
    addSkillXp(skillKey, amount);
    return;
  }
  state.skills = state.skills || {};
  if (!state.skills[skillKey] || typeof state.skills[skillKey] !== "object") {
    state.skills[skillKey] = { level: 0, xp: 0 };
  }
  state.skills[skillKey].xp = (state.skills[skillKey].xp || 0) + amount;
}

function getHighestLifeNodeSkill(state) {
  var best = 0;
  var skills = state.skills || {};
  for (var key in skills) {
    if (skills[key] && typeof skills[key] === "object") {
      best = Math.max(best, skills[key].level || 0);
    }
  }
  return best;
}

function checkLifeNodeRequirement(state, choice) {
  var req = choice.attrReq;
  if (!req) return { ok: true };
  for (var key in req) {
    var need = req[key];
    var actual = 0;
    if (key === "cash") {
      actual = (state.resources.cash || 0) + (state.resources.bankBalance || 0);
    } else if (key === "skill") {
      actual = getHighestLifeNodeSkill(state);
    } else {
      actual = (state.player && state.player[key]) || 0;
    }
    if (actual < need) {
      return { ok: false, reason: choice.hint || "条件不足" };
    }
  }
  return { ok: true };
}

function showLifeNodeModal(node) {
  if (!node || typeof showModal !== "function") return;
  var state = StateManager.getState();
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>人生走到一个关键节点。这个选择会留下长期影响。</p>" +
    '<ul style="margin-left:16px;color:var(--text-secondary);">';
  for (var i = 0; i < node.choices.length; i++) {
    body +=
      "<li><strong>" +
      node.choices[i].text +
      "</strong><br><span>" +
      (node.choices[i].hint || "") +
      "</span></li>";
  }
  body += "</ul></div>";

  var buttons = node.choices.map(function (choice) {
    var canChoose = checkLifeNodeRequirement(state, choice).ok;
    return {
      text: (canChoose ? "" : "🔒 ") + choice.text,
      cls: canChoose ? "btn-primary" : "",
      callback: function () {
        var fresh = StateManager.getState();
        var check = checkLifeNodeRequirement(fresh, choice);
        if (!check.ok) {
          StateManager.addMessage("⚠️ " + check.reason, "warning");
          return false;
        }
        applyNodeChoice(fresh, node.id, choice.apply);
        StateManager.addMessage(
          node.icon + " " + node.name + "：你选择了「" + choice.text + "」。",
          "success",
        );
        if (typeof renderAll === "function") renderAll();
      },
    };
  });

  showModal({
    title: node.icon + " " + node.name,
    body: body,
    buttons: buttons,
  });
}

// ====== 节点效果应用 ======
function applyNodeChoice(state, nodeId, choiceKey) {
  if (!state.flags) state.flags = {};
  state.flags._lifeNode_choice = choiceKey;

  switch (choiceKey) {
    case "gaokao_excellent":
      state.player.intelligence = Math.min(
        100,
        (state.player.intelligence || 0) + 5,
      );
      state.flags._gaokaoResult = "excellent";
      break;
    case "gaokao_normal":
      state.player.intelligence = Math.min(
        100,
        (state.player.intelligence || 0) + 2,
      );
      state.flags._gaokaoResult = "normal";
      break;
    case "gaokao_skip":
      state.flags._gaokaoResult = "skip";
      break;

    case "uni_tech":
      grantLifeNodeSkillXp(state, "coding", 120);
      grantLifeNodeSkillXp(state, "accounting", 120);
      break;
    case "uni_engineering":
      grantLifeNodeSkillXp(state, "repair", 120);
      break;
    case "uni_arts":
      state.player.charm = Math.min(100, (state.player.charm || 0) + 5);
      grantLifeNodeSkillXp(state, "sales", 80);
      break;
    case "uni_skip":
      state.resources.cash = (state.resources.cash || 0) + 5000;
      break;

    case "c35_transform":
      state.player.intelligence = Math.min(
        100,
        (state.player.intelligence || 0) + 3,
      );
      grantLifeNodeSkillXp(state, "management", 80);
      state.flags._career35Path = "transform";
      break;
    case "c35_hold":
      state.status.health = Math.min(100, (state.status.health || 100) + 5);
      state.flags._career35Path = "hold";
      break;
    case "c35_newpath":
      state.flags._career35Path = "newpath";
      break;
    case "c35_lieflat":
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 10);
      state.flags._career35Path = "lieflat";
      break;

    case "retire_wealthy":
      state.flags._retirementType = "wealthy";
      state.flags._retired = true;
      if (state.career && state.career.currentJob) {
        state.career.pensionBase = state.career.currentJob.salary || 5000;
      } else {
        state.career = state.career || {};
        state.career.pensionBase = 5000;
      }
      state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 20);
      break;
    case "retire_advisor":
      state.flags._retirementType = "advisor";
      state.flags._retired = true;
      if (state.career && state.career.currentJob) {
        state.career.pensionBase = state.career.currentJob.salary || 5000;
      } else {
        state.career = state.career || {};
        state.career.pensionBase = 5000;
      }
      state.resources.cash = (state.resources.cash || 0) + 2000;
      break;
    case "retire_continue":
      state.flags._retirementType = "continue";
      // 退而不休不设 _retired，继续正常工作
      state.flags._lifeNode_retirement_done = true;
      break;
  }
  state.flags["_lifeNode_" + nodeId + "_done"] = true;
  state._pendingLifeNode = null;
}

// ====== 节点检查器（每日管线调用） ======
function checkLifeNodes(state) {
  if (!state.flags) state.flags = {};
  if (state._pendingLifeNode) {
    if (
      typeof document !== "undefined" &&
      !document.querySelector(".modal-overlay")
    ) {
      setTimeout(function () {
        showLifeNodeModal(state._pendingLifeNode);
      }, 80);
    }
    return state._pendingLifeNode;
  }

  var nodes = LIFE_NODES;
  for (var key in nodes) {
    var node = nodes[key];
    if (node.condition(state)) {
      state._pendingLifeNode = node;
      setTimeout(function () {
        showLifeNodeModal(node);
      }, 80);
      return node;
    }
  }
  return null;
}

// ====== 节点状态查询 ======
function getLifeNodeStatus(state) {
  var completed = [];
  var pending = null;
  // [全系统自洽修复] 域G A类修复: 确保 flags 存在避免 node.condition 中直接访问 state.flags 崩溃
  if (!state.flags) state.flags = {};

  for (var key in LIFE_NODES) {
    var node = LIFE_NODES[key];
    var flag = state.flags && state.flags["_lifeNode_" + node.id + "_done"];
    if (flag) {
      completed.push({ id: node.id, name: node.name, icon: node.icon });
    } else if (!pending && node.condition(state)) {
      pending = { id: node.id, name: node.name, icon: node.icon };
    }
  }
  return { completed: completed, pending: pending };
}

// ====== 高考结果叙事 ======
function getGaokaoNarrative(state) {
  var result = state.flags && state.flags._gaokaoResult;
  switch (result) {
    case "excellent":
      return "你以优异成绩考入名校，那是改变命运的一天。";
    case "normal":
      return "你考上了普通大学，平平淡淡才是真。";
    case "skip":
      return "你选择了走入社会，高考成了人生中的一个省略号。";
    default:
      return "";
  }
}

// ====== 全局挂载 ======
if (typeof window !== "undefined") {
  window.LIFE_NODES = LIFE_NODES;
  window.checkLifeNodes = checkLifeNodes;
  window.getLifeNodeStatus = getLifeNodeStatus;
  window.getGaokaoNarrative = getGaokaoNarrative;
  window.applyNodeChoice = applyNodeChoice;
  window.showLifeNodeModal = showLifeNodeModal;

  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.life_nodes = {
    id: "life_nodes",
    name: "人生节点",
    icon: "🎯",
    brief:
      "人生关键节点决定命运走向——高考、大学、35岁危机、退休规划。每个节点带来选择分支，影响后续发展。",
    version: "v1",
    related: [],
    sections: [
      {
        type: "desc",
        content:
          "人生节点系统在关键天数触发里程碑事件，你需要做出影响深远的选择。节点基于游戏天数+属性条件触发，每个节点有2-4个选项。",
      },
      {
        type: "table",
        title: "节点一览",
        headers: ["节点", "触发", "选项数", "影响"],
        rows: [
          ["📝 高考", "Day 30+", "3", "智力加成 + 后续大学触发"],
          ["🎓 大学抉择", "高考后 Day 90+", "4", "专业技能加成 + 属性提升"],
          ["⚡ 35岁危机", "Day 180+ 每月检查", "4", "心态/健康/职业方向选择"],
          ["🏖️ 退休规划", "Day 365+", "3", "晚年生活质量 + 传承影响"],
        ],
      },
      {
        type: "tip",
        content: "不同选择影响多周目继承——你的每个决定都会在未来某天回响。",
      },
    ],
  };

  window.NARRATIVES = window.NARRATIVES || {};
  window.NARRATIVES.gaokao_memory = {
    id: "gaokao_memory",
    name: "高考回忆",
    category: "人生故事",
    title: "📝 高考回忆",
    brief: "每个人心中都有一场高考——或辉煌、或平淡、或遗憾。",
    content: function () {
      var s = typeof StateManager !== "undefined" && StateManager.getState();
      if (!s || !s.flags || !s.flags._gaokaoResult)
        return "🔒 你还没有经历过这段故事。";
      var map = {
        excellent: "你以优异成绩考入名校，全家人为你骄傲。",
        normal: "你考上了一所普通大学，父母说'也不错'。",
        skip: "你放弃了高考，直接走进社会。那天的阳光很好，你头也不回。",
      };
      return map[s.flags._gaokaoResult] || "🔒 你还没有经历过这段故事。";
    },
    version: "v1",
  };
}
