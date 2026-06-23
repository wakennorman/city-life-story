/**
 * 社交Tab渲染 — 合并职场社交系统 + 家庭与生活系统
 *
 * 包含：
 * 1. 婚恋/家庭板块（原family_tab）
 * 2. 同事关系/职场社交板块（原workplace_social_tab）
 * 3. 社交网络概览摘要
 */

// ====== 社交Tab主渲染函数 ======
function renderSocialTab(state, parent) {
  parent.innerHTML = "";

  // ---- 顶部导航：Tab 内子标签 ----
  var subTabs = [
    { id: "social_family", label: "👨‍👩‍👧 家庭生活", icon: "👨‍👩‍👧" },
    { id: "social_workplace", label: "🏢 职场社交", icon: "🏢" },
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
