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

  var npcIds = Object.keys(state.relationships);

  var html = '<div class="section"><h3>👥 NPC关系网</h3>';
  html +=
    '<p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">';
  html +=
    "💡 对某个NPC的好感变化会通过关系网传导给其他人。关系越紧密，传导越强。";
  html += "</p>";

  // [全系统自洽修复] 域F 联动:圈子归属感概览(桥接R8 D域机制→UI化,全守卫)
  var _met = 0,
    _close = 0,
    _sum = 0;
  for (var _k = 0; _k < npcIds.length; _k++) {
    var _rel = state.relationships[npcIds[_k]];
    if (_rel && _rel.met && (_rel.affinity || 0) >= 0) {
      _met++;
      _sum += _rel.affinity || 0;
      if ((_rel.affinity || 0) >= 30) _close++;
    }
  }
  var _avg = _met ? Math.round(_sum / _met) : 0;
  html +=
    '<p style="font-size:12px;color:var(--accent);margin:2px 0 12px;">🏘️ 已结识 ' +
    _met +
    " 位 · 熟络 " +
    _close +
    " 位(好感≥30) · 平均好感 " +
    _avg;
  if (_close >= 3) html += " · 圈子归属感已激活✨(每日+心情)";
  else html += " · 再熟络 " + (3 - _close) + " 位即可激活圈子归属感";
  html += "</p>";

  // NPC关系卡片
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';

  npcIds = Object.keys(state.relationships);
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
    // [自洽修复] 显示NPC中文名而非英文ID
    var _npcDef =
      typeof NPCS !== "undefined" &&
      NPCS.find(function (n) {
        return n.id === npcId;
      });
    var _displayName = _npcDef ? _npcDef.name : npcId.replace(/_/g, " ");
    html += '<span style="font-weight:bold;">' + _displayName + "</span>";
    html +=
      '<span style="margin-left:auto;">' + Math.round(affinity) + "</span>";
    html += "</div>";
    html += "</div>";
    // v3.1 ⑥ 社会比较心理抓手：好感≥20 时透露对方月薪，制造羡慕/优越感
    _npcDef =
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

    // [R30] NPC 拜访按钮 — 点击前往 NPC 当前所在地点并触发互动
    var _npcId = npcId;
    var _loc = "";
    if (typeof getNpcCurrentLocation === "function" && rel.met) {
      _loc = getNpcCurrentLocation(_npcId, state.player.timeSlot || "morning");
    }
    if (_loc) {
      html +=
        '<button class="npc-visit-btn" data-nav-type="location" data-npc-id="' +
        _npcId +
        '" data-nav-target=\'{\"type\":\"location\",\"key\":\"' +
        _loc +
        "\"}'>🚶 拜访</button>";
    }

    html += "</div>";
  }

  html += "</div>";

  // [域D 联动增强] NPC关系矩阵显示
  html += '<div class="section" style="margin-top:16px;"><h4>🔗 NPC关系网</h4>';
  html += '<div style="font-size:11px;display:flex;flex-wrap:wrap;gap:4px;">';
  var _MATRIX =
    typeof NPC_RELATION_MATRIX !== "undefined" ? NPC_RELATION_MATRIX : null;
  if (_MATRIX) {
    var _shownPairs = [];
    var _pairId = 0;
    for (var _n1 in _MATRIX) {
      for (var _n2 in _MATRIX[_n1]) {
        var _pairKey = [_n1, _n2].sort().join("|");
        if (_shownPairs.indexOf(_pairKey) >= 0) continue;
        _shownPairs.push(_pairKey);
        var _relType = _MATRIX[_n1][_n2];
        if (_relType === "neutral") continue;
        var _relColor = "#95A5A6";
        if (_relType === "friendly") _relColor = "#F39C12";
        else if (_relType === "old_acquaintance") _relColor = "#8B8050";
        else if (_relType === "business") _relColor = "#2ECC71";
        else if (_relType === "competitor" || _relType === "strained")
          _relColor = "#E74C3C";
        else if (_relType === "classmate") _relColor = "#3498DB";
        var _n1name = _n1.replace(/_/g, " ");
        var _n2name = _n2.replace(/_/g, " ");
        html +=
          '<span style="padding:3px 8px;border-radius:4px;border:1px solid ' +
          _relColor +
          ";color:" +
          _relColor +
          ';">' +
          _n1name +
          " ↔ " +
          _n2name +
          ' <span style="font-size:9px;">' +
          _relType +
          "</span></span>";
      }
    }
  }
  html += "</div></div>";

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
    { id: "social_network", label: "📱 社交网络", icon: "📱" },
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
    case "social_network":
      renderSocialNetworkTab(state, content);
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

// ====== 社交网络子tab（朋友圈/围脖/网红经济） ======
function renderSocialNetworkTab(state, parent) {
  if (!state.socialNetwork) {
    parent.innerHTML =
      '<p style="color:var(--text-muted);padding:40px;text-align:center;">📱 社交网络初始化中...</p>';
    return;
  }
  var sn = state.socialNetwork;
  var html = '<div class="tab-content">';

  // 网红经济卡片
  var levelNames = {
    none: "无等",
    micro: "微网红",
    medium: "中网红",
    large: "大网红",
    top: "顶流",
  };
  var levelName = levelNames[sn.playerInfluencerLevel] || "无等";
  var income = sn.influencerIncome || 0;
  html += '<div class="section"><h3>🌟 网红经济</h3>';
  html += '<div class="card" style="padding:12px;">';
  html += "<p>👥 粉丝：<strong>" + (sn.playerFans || 0) + "</strong></p>";
  html += "<p>🏅 等级：" + levelName + "</p>";
  html += "<p>💰 日收入：¥" + income + "</p>";
  if (sn.舆论危机 && sn.舆论危机.active) {
    html +=
      '<p style="color:var(--danger);">⚠️ 舆论危机中（严重度' +
      sn.舆论危机.severity +
      "）</p>";
  }
  html += "</div></div>";

  // 围脖热搜
  html += '<div class="section"><h3>🔥 围脖热搜</h3>';
  if (sn.weiboHotlist && sn.weiboHotlist.length > 0) {
    html += '<div class="card" style="padding:8px;">';
    for (var hi = 0; hi < Math.min(5, sn.weiboHotlist.length); hi++) {
      var hot = sn.weiboHotlist[hi];
      html +=
        '<div style="padding:4px 0;border-bottom:1px solid var(--border-light);font-size:11px;">';
      html +=
        '<span style="font-weight:700;color:var(--danger);">#' +
        (hi + 1) +
        "</span> ";
      html += "<span>" + (hot.title || "热门话题") + "</span>";
      html +=
        '<span style="color:var(--text-muted);margin-left:8px;">🔥' +
        (hot.heat || 0) +
        "</span>";
      html += "</div>";
    }
    html += "</div>";
  } else {
    html +=
      '<p style="color:var(--text-muted);font-size:11px;">暂无热搜，每日结算时自动刷新。</p>';
  }
  html += "</div>";

  // 朋友圈动态
  html += '<div class="section"><h3>📝 朋友圈动态</h3>';
  if (sn.posts && sn.posts.length > 0) {
    html += '<div class="card" style="padding:8px;">';
    for (var pi = 0; pi < Math.min(3, sn.posts.length); pi++) {
      var post = sn.posts[pi];
      html +=
        '<div style="padding:6px 0;border-bottom:1px solid var(--border-light);font-size:11px;">';
      html += '<p style="margin:0 0 2px 0;">' + (post.content || "") + "</p>";
      html +=
        '<p style="margin:0;color:var(--text-muted);font-size:10px;">❤️' +
        (post.likes ? post.likes.length : 0) +
        " 💬" +
        (post.comments ? post.comments.length : 0) +
        "</p>";
      html += "</div>";
    }
    html += "</div>";
  } else {
    html +=
      '<p style="color:var(--text-muted);font-size:11px;">暂无朋友圈动态。</p>';
  }
  html += "</div>";

  // NPC动态
  html += '<div class="section"><h3>👤 NPC动态</h3>';
  if (sn.npcFeeds && sn.npcFeeds.length > 0) {
    html += '<div class="card" style="padding:8px;">';
    for (var fi = 0; fi < Math.min(3, sn.npcFeeds.length); fi++) {
      var feed = sn.npcFeeds[fi];
      html += '<div style="padding:4px 0;font-size:11px;">';
      html += '<p style="margin:0;">' + (feed.content || "") + "</p>";
      html += "</div>";
    }
    html += "</div>";
  } else {
    html +=
      '<p style="color:var(--text-muted);font-size:11px;">暂无NPC动态。</p>';
  }
  html += "</div>";

  html += "</div>";
  parent.innerHTML = html;

  // [R30] NPC 拜访按钮事件委托 — 点击后触发拜访互动 + 导航到 NPC 地点
  var _bindVisitBtns = function () {
    var btns = parent.querySelectorAll(".npc-visit-btn");
    for (var bi = 0; bi < btns.length; bi++) {
      (function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var npcId = btn.dataset.npcId;
          if (!npcId || !state.relationships || !state.relationships[npcId])
            return;
          var rel = state.relationships[npcId];
          // 检查是否已拜访过（冷却 7 天）
          if (rel._lastVisit && state.day - rel._lastVisit < 7) {
            var daysLeft = 7 - (state.day - rel._lastVisit);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                "⏳ 你刚拜访过" + npcId + "，再等" + daysLeft + "天吧。",
                "info",
              );
            }
            return;
          }
          // 触发拜访互动（好感+2~5）
          var gain = Random ? (Random.chance(0.5) ? 3 : 5) : 4;
          rel.affinity = Math.min(100, (rel.affinity || 0) + gain);
          rel._lastVisit = state.day;
          var _npcName = "";
          if (typeof NPCS !== "undefined") {
            var _def = NPCS.find(function (n) {
              return n.id === npcId;
            });
            _npcName = _def ? _def.name : npcId;
          } else {
            _npcName = npcId;
          }
          if (typeof StateManager !== "undefined") {
            StateManager.addMessage(
              "🤝 你找到了" + _npcName + "，聊了一会儿天。好感+" + gain + "。",
              "success",
            );
          }
          // 导航到 NPC 所在地点
          if (typeof navigateTo === "function") {
            var _loc = btn.dataset.navTarget;
            try {
              var target = JSON.parse(_loc);
              target.type = "location";
              navigateTo(state, target);
            } catch (err) {
              if (typeof StateManager !== "undefined") {
                StateManager.addMessage("⚠️ 导航失败", "warning");
              }
            }
          }
        });
      })(btns[bi]);
    }
  };
  _bindVisitBtns();
}
