/**
 * 社交Tab渲染 — 合并职场社交系统 + 家庭与生活系统 + NPC关系网（v3.6 P0-1）
 *
 * 包含：
 * 1. 婚恋/家庭板块（原family_tab）
 * 2. 同事关系/职场社交板块（原workplace_social_tab）
 * 3. 社交网络概览摘要
 * 4. NPC关系网可视化（新增）
 */

// ====== NPC关系网渲染 ======
function renderNpcRelationships(state, content) {
  if (!state.relationships) {
    content.innerHTML =
      '<p style="color:var(--text-muted);padding:20px;text-align:center;">👥 NPC关系网加载中...</p>';
    return;
  }

  var html = '<div class="section"><h3>👥 NPC关系网</h3>';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">';
  html +=
    "💡 对某个NPC的好感变化会通过关系网传导给其他人。关系越紧密，传导越强。";
  html += "</p>";

  // NPC关系卡片
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';

  var npcIds = Object.keys(state.relationships);
  for (var i = 0; i < npcIds.length; i++) {
    var npcId = npcIds[i];
    var rel = state.relationships[npcId];
    var affinity = rel ? rel.affinity || 0 : 0;

    // 颜色根据好感度
    var colorClass = "neutral";
    var icon = "👤";
    if (affinity >= 80) {
      colorClass = "high";
      icon = "❤️";
    } else if (affinity >= 60) {
      colorClass = "good";
      icon = "😊";
    } else if (affinity >= 30) {
      colorClass = "friendly";
      icon = "🙂";
    } else if (affinity >= 0) {
      colorClass = "neutral";
      icon = "👤";
    } else if (affinity >= -30) {
      colorClass = "cold";
      icon = "😐";
    } else {
      colorClass = "bad";
      icon = "😠";
    }

    html += '<div class="npc-rel-card npc-rel-' + colorClass + '" style="';
    html +=
      "padding:8px 12px;border-radius:6px;font-size:12px;min-width:100px;";
    html += 'border:1px solid var(--border);background:var(--bg-secondary);">';
    html += '<div style="display:flex;align-items:center;gap:4px;">';
    html += "<span>" + icon + "</span>";
    html +=
      '<span style="font-weight:bold;">' +
      (npcId.replace(/_/g, " ") + "</span>");
    html +=
      '<span style="margin-left:auto;">' + Math.round(affinity) + "</span>";
    html += "</div>";

    // v3.1 ⑥ 社会比较心理抓手：好感≥20 时透露对方月薪，制造羡慕/优越感
    var _npcDef =
      typeof NPCS !== "undefined" &&
      NPCS.find(function (n) {
        return n.id === npcId;
      });
    if (_npcDef && _npcDef.monthlyIncome && affinity >= 20) {
      var _playerSalary =
        (state.corporate &&
          state.corporate.job &&
          state.corporate.job.salary) ||
        (state.career &&
          state.career.currentJob &&
          state.career.currentJob.salary) ||
        0;
      if (_playerSalary > 0) {
        var _diff = _npcDef.monthlyIncome - _playerSalary;
        var _cmpColor = _diff > 0 ? "var(--warning)" : "var(--success)";
        var _cmpIcon = _diff > 0 ? "⬆" : "⬇";
        var _cmpText = _diff > 0 ? "比你高" : "比你低";
        html +=
          '<div style="font-size:10px;color:' +
          _cmpColor +
          ';margin-top:3px;">' +
          "💰 据说月薪 ¥" +
          _npcDef.monthlyIncome.toLocaleString() +
          " · " +
          _cmpText +
          " ¥" +
          Math.abs(_diff).toLocaleString() +
          "</div>";
      }
    }

    // 关系传导信息
    if (rel._propagationLog && rel._propagationLog.length > 0) {
      var lastProp = rel._propagationLog[rel._propagationLog.length - 1];
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">';
      html +=
        "传导: " +
        lastProp.from.replace(/_/g, " ") +
        " (" +
        (lastProp.change > 0 ? "+" : "") +
        lastProp.change.toFixed(1) +
        ")";
      html += "</div>";
    }

    // 衰减信息
    if (rel._lastDecay) {
      html +=
        '<div style="font-size:10px;color:var(--text-warning);margin-top:2px;">';
      html += "⚠ 衰减" + rel._lastDecay.toFixed(1);
      html += "</div>";
    }

    html += "</div>";
  }

  html += "</div>";

  // 关系传导详情
  html +=
    '<div class="section" style="margin-top:16px;"><h4>📜 关系传导日志</h4>';
  html += '<div style="max-height:200px;overflow-y:auto;font-size:11px;">';

  var hasLog = false;
  for (var key in state.relationships) {
    var r = state.relationships[key];
    if (r._propagationLog && r._propagationLog.length > 0) {
      hasLog = true;
      html +=
        '<div style="padding:6px 8px;margin-bottom:4px;background:var(--bg-secondary);border-radius:4px;">';
      html += "<strong>" + key.replace(/_/g, " ") + "</strong>: ";
      for (var j = 0; j < r._propagationLog.length; j++) {
        var log = r._propagationLog[j];
        html +=
          '<span style="color:' +
          (log.change > 0 ? "var(--success)" : "var(--danger)") +
          '">';
        html += log.change > 0 ? "+" : "" + log.change.toFixed(1) + "</span> ";
        html +=
          '<span style="color:var(--text-muted);font-size:10px;">(' +
          log.type +
          ")</span> ";
      }
      html += "</div>";
    }
  }

  if (!hasLog) {
    html +=
      '<p style="color:var(--text-muted);padding:12px;text-align:center;">暂无传导记录。与NPC互动后可能会产生关系传导。</p>';
  }

  html += "</div></div>";

  content.innerHTML = html;
}

// ====== 社交Tab主渲染函数 ======
function renderSocialTab(state, parent) {
  parent.innerHTML = "";

  // ---- 顶部导航：Tab 内子标签 ----
  var subTabs = [
    { id: "social_family", label: "👨‍👩‍👧 家庭生活", icon: "👨‍👩‍👧" },
    { id: "social_workplace", label: "🏢 职场社交", icon: "🏢" },
    { id: "social_npc", label: "👥 NPC关系网", icon: "👥" },
    { id: "social_overview", label: "📊 关系总览", icon: "📊" },
  ];
  var currentSubTab = state._socialSubTab || "social_overview";

  var nav = document.createElement("div");
  nav.style.cssText =
    "display:flex;gap:4px;padding:8px 12px;background:var(--bg-secondary);border-bottom:1px solid var(--border);overflow-x:auto;flex-shrink:0;";
  subTabs.forEach(function (st) {
    var btn = document.createElement("button");
    btn.className = "tab-btn" + (currentSubTab === st.id ? " active" : "");
    btn.style.cssText = "font-size:11px;padding:4px 10px;white-space:nowrap;";
    btn.textContent = st.label;
    btn.onclick = function () {
      state._socialSubTab = st.id;
      renderSocialTab(state, parent);
    };
    nav.appendChild(btn);
  });
  parent.appendChild(nav);

  // ---- 内容区域 ----
  var content = document.createElement("div");
  content.style.cssText = "flex:1;overflow-y:auto;padding:8px;";

  switch (currentSubTab) {
    case "social_family":
      renderSocialFamilyTab(state, content);
      break;
    case "social_workplace":
      renderSocialWorkplaceTab(state, content);
      break;
    case "social_npc":
      renderNpcRelationships(state, content);
      break;
    case "social_overview":
    default:
      renderSocialOverviewTab(state, content);
      break;
  }

  parent.appendChild(content);
}

// ====== 关系总览 ======
function renderSocialOverviewTab(state, content) {
  var html = '<div class="tab-content">';

  // 家庭摘要
  var family = state.family;
  if (family) {
    html += '<div class="section"><h3>👨‍👩‍👧 家庭概况</h3>';
    html += "<div class='card' style='padding:12px;'>";
    if (family.spouse) {
      html +=
        "<p>💑 配偶：" +
        family.spouse.name +
        "（" +
        (family.spouse.typeData?.name || "") +
        "）</p>";
    }
    if (family.children && family.children.length > 0) {
      html += "<p>👶 子女：" + family.children.length + "人</p>";
    }
    if (family.parents) {
      html +=
        "<p>👴 父母：父亲" +
        family.parents.father.age +
        "岁 · 母亲" +
        family.parents.mother.age +
        "岁</p>";
    }
    html += "</div></div>";
  }

  // 同事摘要
  var colleagues = state.corporate?.colleagues?.network;
  if (colleagues && colleagues.length > 0) {
    html += '<div class="section"><h3>🏢 职场关系</h3>';
    html += "<div class='card' style='padding:12px;'>";
    html += "<p>👥 同事数：" + colleagues.length + "人</p>";
    var avgRel = Math.round(
      colleagues.reduce(function (s, c) {
        return s + c.relationship;
      }, 0) / colleagues.length,
    );
    html += "<p>📊 平均好感度：" + avgRel + "</p>";
    var highTrust = colleagues.filter(function (c) {
      return c.relationship >= 60;
    }).length;
    html += "<p>🤝 信任级以上的同事：" + highTrust + "人</p>";
    if (state.corporate?.colleagues?.mentorship) {
      html +=
        "<p>👨‍🏫 导师：" +
        state.corporate.colleagues.mentorship.mentorName +
        "</p>";
    }
    html += "</div></div>";
  }

  // 社交网络建议
  html +=
    '<div class="card" style="padding:12px;background:var(--bg-warning);margin-top:8px;">';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);">💡 人脉就是资源。维护好家庭关系和职场人脉，它们会在关键时刻帮到你。</p>';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">🔹 家庭关系影响心态稳定 · 🔹 职场关系影响晋升和绩效</p>';
  html += "</div>";

  html += "</div>";
  content.innerHTML = html;
}

// ====== 家庭生活子tab ======
function renderSocialFamilyTab(state, parent) {
  if (typeof renderFamilyTab === "function") {
    renderFamilyTab(state, parent);
  } else {
    parent.innerHTML =
      '<p style="color:var(--text-muted);padding:40px;text-align:center;">👨‍👩‍👧 家庭系统加载中...</p>';
  }
}

// ====== 职场社交子tab ======
function renderSocialWorkplaceTab(state, parent) {
  if (typeof renderWorkplaceSocialTab === "function") {
    renderWorkplaceSocialTab(state, parent);
  } else {
    parent.innerHTML =
      '<p style="color:var(--text-muted);padding:40px;text-align:center;">🏢 职场社交系统加载中...</p>';
  }
}
