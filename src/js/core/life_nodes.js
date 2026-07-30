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
        // 约定式效果：直接内联，替代switch-case
        effect: function (st) {
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.flags._gaokaoResult = "excellent";
        },
      },
      {
        text: "正常发挥",
        hint: "智力≥40，平平淡淡也是真",
        apply: "gaokao_normal",
        attrReq: { intelligence: 40 },
        effect: function (st) {
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 2,
          );
          st.flags._gaokaoResult = "normal";
        },
      },
      {
        text: "直接步入社会",
        hint: "放弃高考，提前闯荡",
        apply: "gaokao_skip",
        effect: function (st) {
          st.flags._gaokaoResult = "skip";
        },
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
        effect: function (st) {
          grantLifeNodeSkillXp(st, "coding", 120);
          grantLifeNodeSkillXp(st, "accounting", 120);
        },
      },
      {
        text: "读医学/工程",
        hint: "智力≥55，技能加成：医疗知识+10 维修+10",
        apply: "uni_engineering",
        attrReq: { intelligence: 55 },
        effect: function (st) {
          grantLifeNodeSkillXp(st, "repair", 120);
        },
      },
      {
        text: "读文科/艺术",
        hint: "智力≥45，技能加成：魅力+10 口才+10",
        apply: "uni_arts",
        attrReq: { intelligence: 45 },
        effect: function (st) {
          st.player.charm = Math.min(100, (st.player.charm || 0) + 5);
          grantLifeNodeSkillXp(st, "sales", 80);
        },
      },
      {
        text: "放弃大学",
        hint: "直接工作，节省4年时间",
        apply: "uni_skip",
        effect: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 5000;
        },
      },
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
        effect: function (st) {
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          grantLifeNodeSkillXp(st, "management", 80);
          st.flags._career35Path = "transform";
        },
      },
      {
        text: "咬牙硬扛",
        hint: "体质≥50，靠资历和经验撑过去",
        apply: "c35_hold",
        attrReq: { physique: 50 },
        effect: function (st) {
          st.status.health = Math.min(100, (st.status.health || 100) + 5);
          st.flags._career35Path = "hold";
        },
      },
      {
        text: "寻找新赛道",
        hint: "人脉打开新机会",
        apply: "c35_newpath",
        effect: function (st) {
          st.flags._career35Path = "newpath";
        },
      },
      {
        text: "躺平接受",
        hint: "降低期望，守住现有",
        apply: "c35_lieflat",
        effect: function (st) {
          // [全系统自洽修复] 域G R520 P1: st.needs 守卫
          if (!st.needs) st.needs = { hunger: 50, fatigue: 30, hygiene: 60, happiness: 50 };
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.flags._career35Path = "lieflat";
        },
      },
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
        effect: function (st) {
          st.flags._retirementType = "wealthy";
          st.flags._retired = true;
          // [全系统自洽修复] 域G A类修复: 行内 effect 使用 st.employment 替代 st.career（R177 修复了 switch-case 兜底但 inline effect 优先级更高）
          var _empJob = (st.employment && st.employment.currentJob) ? st.employment.currentJob : null;
          st.flags._pensionBase = _empJob ? (_empJob.salary || 5000) : 5000;
          // [全系统自洽修复] 域G R520 P1: st.needs 守卫
          if (!st.needs) st.needs = { hunger: 50, fatigue: 30, hygiene: 60, happiness: 50 };
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
        },
      },
      {
        text: "发挥余热",
        hint: "技能≥60，返聘做顾问",
        apply: "retire_advisor",
        attrReq: { skill: 60 },
        effect: function (st) {
          st.flags._retirementType = "advisor";
          st.flags._retired = true;
          // [全系统自洽修复] 域G R894b A类#1: advisor inline effect 漏设 _pensionBase——
          // applyNodeChoice 中 inline effect 优先、switch兜底被跳过(_inlineApplied)，
          // 导致"返聘做顾问"路径 _retired=true 但养老金+顾问费(daily_pipeline:2014块要求
          // _retired&&_pensionBase 双真)永不发放=纯惩罚陷阱→与兜底路径对齐补基数
          var _advEmpJob = (st.employment && st.employment.currentJob) ? st.employment.currentJob : null;
          st.flags._pensionBase = _advEmpJob ? (_advEmpJob.salary || 5000) : 5000;
          var skillXp = Math.min(
            500,
            (st.status && Math.max(0, st.status.health - 30)) * 5 || 200,
          );
          // [全系统自洽修复] 域G R894b A类#2: Object.keys(空对象).reduce 无初始值抛
          // TypeError(被外层try吞掉→advisor全部效果静默丢失)→补 keys.length 守卫
          var _skillKeys = st.skills ? Object.keys(st.skills) : [];
          if (_skillKeys.length > 0) {
            var bestSkill = _skillKeys.reduce(function (a, b) {
              return ((st.skills[a] && st.skills[a].level) || 0) >
                ((st.skills[b] && st.skills[b].level) || 0)
                ? a
                : b;
            });
            if (st.skills[bestSkill])
              st.skills[bestSkill].xp =
                (st.skills[bestSkill].xp || 0) + skillXp;
          }
        },
      },
      {
        text: "退而不休",
        hint: "继续工作直到干不动",
        apply: "retire_continue",
        effect: function (st) {
          st.flags._retirementType = "continue";
          // 退而不休不设 _retired，继续正常工作
          // [全系统自洽修复] 域G R520 P1: st.needs 守卫
          if (!st.needs) st.needs = { hunger: 50, fatigue: 30, hygiene: 60, happiness: 50 };
          if(st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
        },
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
      actual = typeof getHighestLifeNodeSkill === "function" ? getHighestLifeNodeSkill(state) : 0;
    } else {
      actual = (state.player && state.player[key]) || 0;
    }
    if (actual < need) {
      return { ok: false, reason: choice.hint || "条件不足" };
    }
  }
  return { ok: true };
}

/** 详细检查人生节点条件 — 返回每条条件状态 */
function checkLifeNodeRequirementDetailed(state, choice) {
  var req = choice.attrReq;
  if (!req) return [];
  var results = [];
  for (var key in req) {
    var need = req[key];
    var actual = 0;
    if (key === "cash") {
      actual = (state.resources.cash || 0) + (state.resources.bankBalance || 0);
    } else if (key === "skill") {
      actual = typeof getHighestLifeNodeSkill === "function" ? getHighestLifeNodeSkill(state) : 0;
    } else {
      actual = (state.player && state.player[key]) || 0;
    }
    var labelMap = {
      intelligence: "智力",
      mental: "能力",
      physique: "体质",
      agility: "敏捷",
      charm: "魅力",
      cash: "现金",
      skill: "技能等级",
    };
    results.push({
      label: (labelMap[key] || key) + "≥" + need,
      ok: actual >= need,
      current: actual,
      required: need,
    });
  }
  return results;
}

/** 渲染生活节点条件行（✅/❌） */
function _renderLifeCondRows(results) {
  if (typeof ConditionSystem !== "undefined" && ConditionSystem.renderRows) {
    return ConditionSystem.renderRows(results);
  }
  // fallback（旧版兼容）
  if (!results || results.length === 0) return "";
  var html =
    '<div style="font-size:11px;display:flex;flex-direction:column;gap:2px;margin-top:6px;padding:6px;background:rgba(0,0,0,0.08);border-radius:4px;">';
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    html +=
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:1px 4px;">' +
      "<span>" +
      (r.ok ? "✅" : "❌") +
      " " +
      r.label +
      "</span>" +
      '<span style="font-size:10px;color:' +
      (r.ok ? "var(--success)" : "var(--danger)") +
      ';">当前' +
      r.current +
      "</span></div>";
  }
  html += "</div>";
  return html;
}

function showLifeNodeModal(node) {
  if (!node || typeof showModal !== "function") return;
  var state = StateManager.getState();
  var body =
    '<div style="font-size:13px;line-height:1.7;">' +
    "<p>人生走到一个关键节点。这个选择会留下长期影响。</p>" +
    '<ul style="margin-left:16px;color:var(--text-secondary);">';
  for (var i = 0; i < node.choices.length; i++) {
    var choice = node.choices[i];
    var canChoose = checkLifeNodeRequirement(state, choice).ok;
    var choiceDetails = checkLifeNodeRequirementDetailed(state, choice);
    body +=
      "<li><strong>" +
      (canChoose ? "✅ " : "🔒 ") +
      choice.text +
      "</strong><br><span>" +
      (choice.hint || "") +
      "</span>";
    if (choiceDetails.length > 0) {
      body += _renderLifeCondRows(choiceDetails);
    }
    body += "</li>";
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
          // 显示详细条件弹窗 — 使用约定式条件系统
          var detail = checkLifeNodeRequirementDetailed(fresh, choice);
          if (
            detail.length > 0 &&
            typeof ConditionSystem !== "undefined" &&
            ConditionSystem.showModal
          ) {
            ConditionSystem.showModal(detail, {
              title: "❌ 条件不足",
              failText: "提升对应属性后再来尝试",
            });
          } else if (detail.length > 0 && typeof showModal === "function") {
            var detailHtml =
              '<div style="text-align:left;font-size:13px;">' +
              '<p style="margin-bottom:8px;font-weight:bold;">该选项需要以下条件：</p>' +
              '<div style="display:flex;flex-direction:column;gap:2px;">';
            for (var di = 0; di < detail.length; di++) {
              var d = detail[di];
              detailHtml +=
                '<div style="display:flex;justify-content:space-between;padding:3px 4px;border-radius:3px;background:' +
                (d.ok ? "rgba(46,204,113,0.06);" : "rgba(231,76,60,0.06);") +
                '">' +
                "<span>" +
                (d.ok ? "✅" : "❌") +
                " " +
                d.label +
                "</span>" +
                '<span style="color:' +
                (d.ok ? "var(--success)" : "var(--danger)") +
                ';">当前' +
                d.current +
                "</span></div>";
            }
            detailHtml += "</div></div>";
            showModal({
              title: "❌ 条件不足",
              body: detailHtml,
              buttons: [
                {
                  text: "知道了",
                  cls: "btn-primary",
                  callback: function () {
                    return true;
                  },
                },
              ],
            });
          } else {
            StateManager.addMessage(
              "⚠️ " + (check.reason || "条件不足"),
              "warning",
            );
          }
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

  // [全系统自洽修复] 域G A类修复: 不再 return 跳过共享代码（心智+1/NPC关系/flag设置）
  // 用变量标记是否已应用内联效果，switch-case 作为兜底
  var _inlineApplied = false;
  if (LIFE_NODES[nodeId]) {
    var nodeChoices = LIFE_NODES[nodeId].choices || [];
    for (var ci = 0; ci < nodeChoices.length; ci++) {
      if (
        nodeChoices[ci].apply === choiceKey &&
        typeof nodeChoices[ci].effect === "function"
      ) {
        try {
          nodeChoices[ci].effect(state);
        } catch (e) {
          console.warn("lifeNode effect error:", e);
        }
        _inlineApplied = true;
        break; // 跳出循环但继续执行共享代码
      }
    }
  }

  // 旧switch-case兜底（仅当 inline effect 未执行时）
  if (!_inlineApplied) {
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
      // [全系统自洽修复] 域G A类修复: state.status 守卫(防止旧存档崩溃)
      if (state.status) state.status.health = Math.min(100, (state.status.health || 100) + 5);
      state.flags._career35Path = "hold";
      break;
    case "c35_newpath":
      state.flags._career35Path = "newpath";
      break;
    case "c35_lieflat":
      // [全系统自洽修复] 域G A类修复: state.needs 守卫(防止旧存档崩溃)
      if (state.needs) state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 10);
      state.flags._career35Path = "lieflat";
      break;

    // [全系统自洽修复] 域G A类#4: retire_wealthy 退休金基数字段名 — career→employment
    case "retire_wealthy":
      state.flags._retirementType = "wealthy";
      state.flags._retired = true;
      var _empJob = (state.employment && state.employment.currentJob) ? state.employment.currentJob : null;
      state.flags._pensionBase = _empJob ? (_empJob.salary || 5000) : 5000;
      // [全系统自洽修复] 域G A类修复: state.needs 守卫(防止旧存档崩溃)
      if (state.needs) state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 20);
      break;
    case "retire_advisor":
      state.flags._retirementType = "advisor";
      state.flags._retired = true;
      // 退休金基数字段对齐（兜底路径，inline effect 优先）
      var _advJob = (state.employment && state.employment.currentJob) ? state.employment.currentJob : null;
      state.flags._pensionBase = _advJob ? (_advJob.salary || 5000) : 5000;
      state.resources.cash = (state.resources.cash || 0) + 2000;
      break;
    case "retire_continue":
      state.flags._retirementType = "continue";
      // 退而不休不设 _retired，继续正常工作
      state.flags._lifeNode_retirement_done = true;
      break;
    }
  }
  // [全系统自洽修复] 域G 联动增强1: 人生节点完成→永久心智+1（G→A，生命经验沉淀）
  // 仅首次完成时触发（_lifeNode_xxx_done 刚设为 true，在此判断）
  if (nodeId && state.player) {
    state.player.mental = Math.min(100, (state.player.mental || 0) + 1);
    StateManager.addMessage("🧠 人生经历让心智更加成熟（心智+1）", "good");
  }
  // [全系统自洽修复] 域G 联动增强2: 人生节点选择影响NPC关系（G→D，社会关系联动）
  if (state.relationships && nodeId && choiceKey) {
    var npcEffects = {
      gaokao_excellent: { xiao_mei: 3, old_zhou: 2 },
      gaokao_normal: { xiao_mei: 1, old_zhou: 1 },
      gaokao_skip: { xiao_mei: -1, old_zhou: -2 },
      uni_tech: { xiao_mei: 2, old_zhou: 1 },
      uni_engineering: { old_zhou: 3, boss_li: 2 },
      uni_arts: { xiao_mei: 3, lin_xiu: 2 },
      uni_skip: { old_zhou: 1 },
      c35_transform: { xiao_mei: 2, aunt_wang: 1 },
      c35_hold: { boss_li: 2, old_zhou: 2 },
      c35_newpath: { lin_xiu: 3, xiao_mei: 2 },
      c35_lieflat: { xiao_mei: -1, aunt_wang: 1 },
      retire_wealthy: { xiao_mei: 3, old_zhou: 3, aunt_wang: 2 },
      retire_advisor: { boss_li: 3, old_zhou: 2 },
      retire_continue: { boss_li: 2 },
    };
    var effects = npcEffects[choiceKey];
    if (effects) {
      for (var npcId in effects) {
        if (!effects.hasOwnProperty(npcId)) continue;
        if (state.relationships[npcId] && state.relationships[npcId].met) {
          state.relationships[npcId].affinity = Math.min(
            100,
            Math.max(0, (state.relationships[npcId].affinity || 50) + effects[npcId])
          );
        }
      }
    }
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
// [R720 域G 联动增强 G→H]: 年龄与公司阶段
function getLifeStageLabel(age) {
  if (!age || age < 0) return "未知";
  if (age < 18) return "少年期";
  if (age < 25) return "青年期";
  if (age < 35) return "奋斗期";
  if (age < 45) return "成熟期";
  if (age < 55) return "中年期";
  if (age < 65) return "知命期";
  return "老年期";
}

// [R720 域G 联动增强 G→F]: 生命周期进展摘要
function getLifeProgressSummary(state) {
  if (!state || !state.player) return null;
  var p = state.player;
  var age = p.age || 0;
  var day = p.day || 0;
  var milestones = (state.flags && state.flags._lifeMilestones) || [];
  return { age: age, day: day, stage: getLifeStageLabel(age), milestones: milestones.length, progress: Math.min(100, Math.round((day / 365) * 100)) };
}
