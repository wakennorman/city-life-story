/**
 * 社交Tab渲染 — 合并职场社交系统 + 家庭与生活系统 + NPC关系网（v3.6 P0-1）
 *
 * 包含：
 * 1. 婚恋/家庭板块（原family_tab）
 * 2. 同事关系/职场社交板块（原workplace_social_tab）
 * 3. 社交网络概览摘要
 * 4. NPC关系网可视化（新增）
 */

// ====== NPC中文名查找 ======
function getNpcChineseName(npcId) {
  if (typeof NPCS !== "undefined" && Array.isArray(NPCS)) {
    var found = NPCS.find(function (n) {
      return n.id === npcId;
    });
    if (found && found.name) return found.name;
  }
  // 兜底：英文ID转中文
  var nameMap = {
    aunt_wang: "王大婶",
    boss_li: "李工头",
    sister_zhang: "张姐",
    old_zhou: "老周",
    xiao_mei: "小美",
    chef_chen: "陈师傅",
    auntie_lin: "林阿姨",
    master_zhao: "赵师傅",
    xiaoli: "小丽",
    dr_wang: "王医生",
    zhaojie: "赵姐",
    chen_ge: "陈哥",
    ajie: "阿杰",
    uncle_chen_bank: "老陈",
  };
  return nameMap[npcId] || npcId.replace(/_/g, " ");
}

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

    // 获取NPC中文名
    var npcDisplayName = getNpcChineseName(npcId);

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
    html += '<span style="font-weight:bold;">' + npcDisplayName + "</span>";
    html +=
      '<span style="margin-left:auto;">' + Math.round(affinity) + "</span>";
    html += "</div>";

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

    // 对话记录（最近 3 条）
    if (rel.interactionHistory && rel.interactionHistory.length > 0) {
      var hist = rel.interactionHistory.slice(-3);
      html +=
        '<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);">';
      html +=
        '<div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">💬 最近对话</div>';
      for (var hi = 0; hi < hist.length; hi++) {
        var h = hist[hi];
        html +=
          '<div style="font-size:10px;line-height:1.4;color:var(--text-secondary);">';
        html += "第" + h.day + "天 · ";
        if (h.delta > 0)
          html += '<span style="color:var(--success);">+' + h.delta + "</span>";
        else if (h.delta < 0)
          html += '<span style="color:var(--danger);">' + h.delta + "</span>";
        else html += '<span style="color:var(--text-muted);">0</span>';
        html += " " + h.message + "</div>";
      }
      html += "</div>";
    }

    // 深入聊天按钮
    html += '<div style="margin-top:6px;">';
    html +=
      '<button class="btn btn-sm btn-primary" style="font-size:10px;padding:2px 8px;" data-npc-chat="' +
      npcId +
      '">💬 聊天 (2AP)</button>';
    html += "</div>";

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

  // 绑定深入聊天按钮事件
  var chatBtns = content.querySelectorAll("[data-npc-chat]");
  for (var cb = 0; cb < chatBtns.length; cb++) {
    (function (btn) {
      btn.onclick = function () {
        var npcId = btn.getAttribute("data-npc-chat");
        if (typeof chatWithNpc === "function") {
          var state =
            typeof StateManager !== "undefined"
              ? StateManager.getState()
              : null;
          if (state) {
            chatWithNpc(npcId, state);
            renderNpcRelationships(state, content);
          }
        } else {
          StateManager.addMessage("聊天功能暂不可用。", "warning");
        }
      };
    })(chatBtns[cb]);
  }
}

// ====== 社交Tab主渲染函数 ======
function renderSocialTab(state, parent) {
  parent.innerHTML = "";

  // ---- 顶部导航：Tab 内子标签 ----
  var subTabs = [
    { id: "social_family", label: "👨‍👩‍👧 家庭生活", icon: "👨‍👩‍👧" },
    { id: "social_workplace", label: "🏢 职场社交", icon: "🏢" },
    { id: "social_network", label: "📱 社交网络", icon: "📱" },
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
    case "social_network":
      renderSocialNetworkTab(state, content);
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

function socialNetworkEscape(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSocialNetworkTab(state, content) {
  if (typeof ensureSocialNetworkState === "function") {
    ensureSocialNetworkState(state);
  } else if (!state.socialNetwork) {
    state.socialNetwork = {
      posts: [],
      weiboHotlist: [],
      npcFeeds: [],
      playerFans: 0,
    };
  }
  var sn = state.socialNetwork;
  var incomeInfo =
    typeof calculateInfluencerIncome === "function"
      ? calculateInfluencerIncome(state)
      : {
          level: sn.playerInfluencerLevel || "none",
          income: sn.influencerIncome || 0,
        };

  // 网红等级中文映射
  var LEVEL_CN = {
    none: "无",
    micro: "萌芽网红",
    medium: "中型网红",
    large: "大型网红",
    top: "顶级网红",
  };
  var levelLabel = LEVEL_CN[incomeInfo.level] || incomeInfo.level;

  var html = '<div class="tab-content">';
  html += '<div class="section"><h3>📱 社交网络</h3>';
  html +=
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:10px;">';
  html +=
    '<div class="card" style="padding:10px;"><div style="font-size:11px;color:var(--text-muted);">粉丝</div><strong>' +
    (sn.playerFans || 0).toLocaleString() +
    "</strong></div>";
  html +=
    '<div class="card" style="padding:10px;"><div style="font-size:11px;color:var(--text-muted);">网红等级</div><strong>' +
    socialNetworkEscape(levelLabel) +
    "</strong></div>";
  html +=
    '<div class="card" style="padding:10px;"><div style="font-size:11px;color:var(--text-muted);">日收入</div><strong>¥' +
    Math.round(incomeInfo.income || 0).toLocaleString() +
    "</strong></div>";
  html +=
    '<div class="card" style="padding:10px;"><div style="font-size:11px;color:var(--text-muted);">舆论</div><strong>' +
    (sn.舆论危机 && sn.舆论危机.active ? "危机中" : "平稳") +
    "</strong></div>";
  html += "</div>";
  html +=
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">';
  html +=
    '<button class="btn btn-sm btn-primary sn-post-btn">✍️ 发朋友圈</button>';
  html += '<button class="btn btn-sm sn-refresh-btn">🔥 刷新热搜</button>';
  html += "</div>";

  if (sn.舆论危机 && sn.舆论危机.active) {
    html +=
      '<div class="card" style="padding:10px;margin-bottom:10px;border-left:3px solid var(--danger);">';
    html +=
      '<strong>⚠️ 舆论危机</strong><div style="font-size:12px;color:var(--text-muted);">严重度 ' +
      sn.舆论危机.severity +
      "，剩余 " +
      sn.舆论危机.daysRemaining +
      " 天</div>";
    html += "</div>";
  }

  html += '<div class="section"><h4>💬 朋友圈</h4>';
  var posts = sn.posts || [];
  if (posts.length === 0) {
    html += '<p style="color:var(--text-muted);">还没有发布过朋友圈。</p>';
  } else {
    for (var p = 0; p < Math.min(posts.length, 5); p++) {
      var post = posts[p];
      html += '<div class="card" style="padding:10px;margin:6px 0;">';
      html +=
        '<div style="font-size:12px;">' +
        socialNetworkEscape(post.content) +
        "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:6px;">第' +
        post.postedDay +
        "天 · " +
        socialNetworkEscape(post.visibility) +
        " · 👍 " +
        (post.likes ? post.likes.length : 0) +
        "</div>";
      html += "</div>";
    }
  }
  html += "</div>";

  html += '<div class="section"><h4>👥 NPC动态</h4>';
  var feeds = sn.npcFeeds || [];
  if (feeds.length === 0) {
    html += '<p style="color:var(--text-muted);">暂无 NPC 动态。</p>';
  } else {
    for (var f = 0; f < Math.min(feeds.length, 5); f++) {
      var feed = feeds[f];
      var npc =
        typeof getNpcById === "function" ? getNpcById(feed.npcId) : null;
      html += '<div class="card" style="padding:10px;margin:6px 0;">';
      html +=
        "<strong>" +
        socialNetworkEscape(npc ? npc.name : feed.npcId) +
        "</strong>";
      html +=
        '<div style="font-size:12px;margin-top:4px;">' +
        socialNetworkEscape(feed.content) +
        "</div>";
      html +=
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">第' +
        feed.postedDay +
        "天 · " +
        socialNetworkEscape(feed.type || "daily") +
        "</div>";
      html += "</div>";
    }
  }
  html += "</div>";

  html += '<div class="section"><h4>🔥 围脖热搜</h4>';
  var hotlist = sn.weiboHotlist || [];
  if (hotlist.length === 0) {
    html += '<p style="color:var(--text-muted);">还没有刷新热搜。</p>';
  } else {
    for (var h = 0; h < Math.min(hotlist.length, 10); h++) {
      var hot = hotlist[h];
      html +=
        '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px;">';
      html +=
        '<span style="width:24px;color:var(--accent);font-weight:bold;">#' +
        hot.rank +
        "</span>";
      html +=
        '<span style="flex:1;">' + socialNetworkEscape(hot.title) + "</span>";
      html +=
        '<span style="color:var(--text-muted);">' +
        socialNetworkEscape(hot.category) +
        " · " +
        Math.round((hot.heat || 0) / 10000) +
        "万热度</span>";
      html += "</div>";
    }
  }
  html += "</div></div></div>";
  content.innerHTML = html;

  var postBtn = content.querySelector(".sn-post-btn");
  if (postBtn) {
    postBtn.onclick = function () {
      var text = prompt("写点什么发到朋友圈：", "今天也在努力生活。");
      if (!text) return;
      var result = postToMoments(state, text, [], "public");
      if (result && result.ok === false) {
        StateManager.addMessage(result.message, "warning");
      } else {
        StateManager.addMessage("📱 朋友圈发布成功。", "success");
      }
      renderSocialNetworkTab(state, content);
      if (typeof renderAll === "function") renderAll();
    };
  }
  var refreshBtn = content.querySelector(".sn-refresh-btn");
  if (refreshBtn) {
    refreshBtn.onclick = function () {
      if (typeof refreshWeiboHotlist === "function") {
        refreshWeiboHotlist(state);
        StateManager.addMessage("🔥 围脖热搜已刷新。", "info");
      }
      renderSocialNetworkTab(state, content);
    };
  }
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
