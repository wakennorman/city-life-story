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
  if (!state || !state.relationships) {
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

  // [全系统自洽修复] 域D R245 联动增强(D→G): 社交圈健康回报 — 每3位好感≥30的NPC提供每日心情恢复
  (function() {
    var _metCount = 0;
    for (var _ri = 0; _ri < npcIds.length; _ri++) {
      var _r = state.relationships[npcIds[_ri]];
      if (_r && _r.met && (_r.affinity || 0) >= 30) _metCount++;
    }
    if (_metCount >= 3) {
      var _hpBonus = Math.min(3, Math.floor(_metCount / 3));
      html += '<div style="font-size:11px;color:var(--success);margin:4px 0 8px;">💚 社交温暖：' + _metCount + '位好友环绕，每日心情+' + _hpBonus + '（社交圈越大，心灵越健康）</div>';
    } else {
      html += '<div style="font-size:11px;color:var(--text-muted);margin:4px 0 8px;">💚 再熟络' + (3 - _metCount) + '位NPC(好感≥30)即可激活社交温暖效果，每日心情恢复。</div>';
    }
  })();

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
  // [全系统自洽修复] 域F 联动增强1: 显示今日可拜访NPC数
  (function () {
    var _today = state.player.day;
    var _visitables = 0;
    for (var _ki = 0; _ki < npcIds.length; _ki++) {
      var _rel2 = state.relationships[npcIds[_ki]];
      if (_rel2 && _rel2.met && (_rel2._lastVisit || 0) + 7 <= _today) _visitables++;
    }
    if (_visitables > 0) html += ' · 🚶 ' + _visitables + '位可拜访';
  })();
  html += "</p>";

  // [全系统自洽修复] 域D 联动增强: NPC生日提醒
  (function () {
    if (!state.player || !state.player.day || typeof NPCS === "undefined") return;
    var _today = state.player.day;
    // [全系统自洽修复] 域D A类#1: 生日用 (day-1)%365+1 替代纯 day，支持 year 2+
    var _dayOfYear = ((_today - 1) % 365) + 1;
    var _birthdayNpcs = [];
    for (var _bi = 0; _bi < NPCS.length; _bi++) {
      var _n = NPCS[_bi];
      if (_n && _n.birthday && _n.id && state.relationships && state.relationships[_n.id] && state.relationships[_n.id].met) {
        if (_n.birthday === _dayOfYear) _birthdayNpcs.push(_n);
      }
    }
    if (_birthdayNpcs.length > 0) {
      html += '<div style="background:var(--bg-warning, #fff3cd);border:1px solid var(--border-warning, #ffc107);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">';
      html += "🎂 <strong>今日寿星：</strong>";
      for (var _bni = 0; _bni < _birthdayNpcs.length; _bni++) {
        var _bn = _birthdayNpcs[_bni];
        html += '<span style="margin:0 6px;">' + _bn.name + "（" + _bn.role + "）</span>";
        if (_bni < _birthdayNpcs.length - 1) html += " · ";
      }
      html += '<span style="display:block;font-size:11px;color:var(--text-muted);margin-top:4px;">💡 去拜访TA，会有特别的生日对话哦！</span>';
      html += "</div>";
    }
  })();

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
    // [全系统自洽修复] 域D 联动增强2: 挚友(≥80)特殊标记+奖励提示
    if (affinity >= 80) {
      html += '<span style="margin-left:4px;font-size:9px;background:var(--success);color:#fff;border-radius:3px;padding:1px 5px;">挚友</span>';
    }
    html +=
      '<span style="margin-left:auto;">' + Math.round(affinity) + "</span>";
    // [全系统自洽修复] 域F R390 联动增强(F→D): 好感度色条可视化
    var _barColor = affinity >= 80 ? '#4caf50' : affinity >= 60 ? '#8bc34a' : affinity >= 30 ? '#ffc107' : affinity >= 0 ? '#ff9800' : '#f44336';
    html += '<div style="width:40px;height:4px;background:var(--bg-input);border-radius:2px;margin-left:4px;overflow:hidden;"><div style="width:' + Math.min(100, Math.max(0, affinity)) + '%;height:100%;background:' + _barColor + ';border-radius:2px;"></div></div>';
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
          (_npcDef.monthlyIncome || 0).toLocaleString() +
          " · " +
          _cmpText +
          " ¥" +
          Math.abs(_diff || 0).toLocaleString() +
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
        (_npcDef ? _npcDef.name : lastProp.from.replace(/_/g, " ")) +
        " (" +
        (lastProp.change > 0 ? "+" : "") +
        (lastProp.change || 0).toFixed(1) +
        ")";
      html += "</div>";
    }

    // [全系统自洽修复] 域D 联动增强: 衰减倒计时+引导
    if (rel.met && rel.affinity > 0) {
      var _lastInt = rel._lastInteractionDay || 0;
      var _daysSinceInt = state.player.day - _lastInt;
      if (_daysSinceInt >= 7) {
        // 已进入衰减区间，显示衰减量
        var _decayed = rel._lastDecay || 0;
        html +=
          '<div style="font-size:10px;color:var(--danger);margin-top:2px;">';
        html += "⚠ 已衰减" + _decayed.toFixed(1) + "，快去互动！";
        html += "</div>";
      } else if (_daysSinceInt >= 4) {
        // 即将衰减，倒计时
        var _daysLeftDecay = 7 - _daysSinceInt;
        html +=
          '<div style="font-size:10px;color:var(--warning);margin-top:2px;">';
        html += "⏳ " + _daysLeftDecay + "天后好感将衰减";
        html += "</div>";
      }
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

    // [全系统自洽修复] 域D R245 联动增强(D→C): 高好感NPC提供职业推荐暗示
    if (affinity >= 60 && _npcDef && (_npcDef.role === "工头" || _npcDef.role === "老板" || _npcDef.role === "房东" || _npcDef.role === "工友" || _npcDef.monthlyIncome >= 10000)) {
      html += '<div style="font-size:10px;color:var(--accent);margin-top:4px;">💼 人脉推荐：这位' + _npcDef.name + '在行业内有不错的人脉，或许能帮你推荐工作。</div>';
    }
    // [全系统自洽修复] 域D R245 联动增强(D→E): 高好感NPC提供交易情报提示
    if (affinity >= 30 && _npcDef && _npcDef.tradeInfo && _npcDef.tradeInfo.expertise && _npcDef.tradeInfo.expertise.length > 0) {
      html += '<div style="font-size:10px;color:var(--info);margin-top:2px;">📊 交易情报：' + _npcDef.name + '在' + _npcDef.tradeInfo.expertise.join("、") + '领域有独到见解。</div>';
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
        var _n1Def =
          typeof NPCS !== "undefined" &&
          NPCS.find(function (n) {
            return n.id === _n1;
          });
        var _n2Def =
          typeof NPCS !== "undefined" &&
          NPCS.find(function (n) {
            return n.id === _n2;
          });
        var _n1name = _n1Def ? _n1Def.name : _n1.replace(/_/g, " ");
        var _n2name = _n2Def ? _n2Def.name : _n2.replace(/_/g, " ");
        // 关系类型中文翻译
        var _relLabel = _relType;
        var _relLabelMap = {
          neutral: "中立",
          friendly: "友好",
          old_acquaintance: "老相识",
          business: "商业合作",
          competitor: "竞争对手",
          strained: "紧张",
          classmate: "同学",
        };
        if (_relLabelMap[_relType]) _relLabel = _relLabelMap[_relType];
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
          _relLabel +
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
      var _npDef =
        typeof NPCS !== "undefined" &&
        NPCS.find(function (n) {
          return n.id === key;
        });
      var _npName = _npDef ? _npDef.name : key.replace(/_/g, " ");
      html +=
        '<div style="padding:6px 8px;margin-bottom:4px;background:var(--bg-secondary);border-radius:4px;">';
      html += "<strong>" + _npName + "</strong>: ";
      for (var j = 0; j < r._propagationLog.length; j++) {
        var log = r._propagationLog[j];
        // 传导类型中文翻译
        var _logTypeLabel = log.type;
        var _logTypeMap = {
          propagation: "传导",
          decay: "衰减",
          interaction: "互动",
          gift: "赠送",
          conflict: "冲突",
          help: "帮助",
        };
        if (_logTypeMap[log.type]) _logTypeLabel = _logTypeMap[log.type];
        html +=
          '<span style="color:' +
          (log.change > 0 ? "var(--success)" : "var(--danger)") +
          '">';
        html += log.change > 0 ? "+" : "" + (log.change || 0).toFixed(1) + "</span> ";
        html +=
          '<span style="color:var(--text-muted);font-size:10px;">(' +
          _logTypeLabel +
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
    { id: "social_family", label: "👨‍👩‍👧 家庭生活", icon: "👨‍👩‍👧", title: "👨‍👩‍👧 家庭生活 — 家人关系、家庭事务" },
    { id: "social_workplace", label: "🏢 职场社交", icon: "🏢", title: "🏢 职场社交 — 同事关系、办公室社交" },
    { id: "social_npc", label: "👥 NPC关系网", icon: "👥", title: "👥 NPC关系网 — 查看所有NPC好感度和关系状态" },
    { id: "social_network", label: "📱 社交网络", icon: "📱", title: "📱 社交网络 — 社交圈动态、人脉经营" },
    { id: "social_overview", label: "📊 关系总览", icon: "📊", title: "📊 关系总览 — 社交关系综合概览" },
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
    btn.title = st.title;
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
      // [全系统自洽修复] 域D 修复:social_npc 子Tab触发拜访按钮事件绑定
      setTimeout(function () {
        _bindVisitBtns(state, content);
      }, 0);
      break;
    case "social_network":
      renderSocialNetworkTab(state, content);
      // [全系统自洽修复] 域D: social_network 子Tab也需绑定拜访按钮
      setTimeout(function () {
        _bindVisitBtns(state, content);
      }, 0);
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

  // [全系统自洽修复] 域G 联动增强: 社交Tab显示情绪状态(G→F)
  if (state.status && state.status.emotionalState) {
    var _emoIcons = { depressed: "😢", sad: "😔", stressed: "😰", stable: "😐", happy: "😊", elated: "🌟" };
    var _emoIcon = _emoIcons[state.status.emotionalState] || "😐";
    var _emoDesc = {
      depressed: "情绪低落，社交效果显著下降，建议先休息恢复",
      sad: "心情不太好，社交效果略有下降",
      stressed: "有些焦虑，社交时容易心不在焉",
      stable: "情绪平稳，适合正常社交",
      happy: "心情不错，社交效果有小幅加成",
      elated: "状态极佳！社交效果大幅提升！",
    };
    html += '<div class="section"><h3>😊 当前情绪</h3>';
    html += '<div class="card" style="padding:12px;display:flex;align-items:center;gap:12px;">';
    html += '<span style="font-size:32px;">' + _emoIcon + '</span>';
    html += '<div><div style="font-weight:600;font-size:14px;">' + (typeof getEmotionName === "function" ? getEmotionName(state) : state.status.emotionalState) + '</div>';
    html += '<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">' + (_emoDesc[state.status.emotionalState] || "") + '</div>';
    html += '</div></div></div>';
  }

  // [全系统自洽修复] 域D R382 联动增强: D→F NPC生日提醒(社交Tab显示近期生日的NPC)
  try {
    if (typeof NPCS !== "undefined" && NPCS.length > 0) {
      var _today = state.player && state.player.day;
      var _birthdayNpcs = [];
      for (var _bi = 0; _bi < NPCS.length; _bi++) {
        var _npc = NPCS[_bi];
        if (_npc && _npc.birthday && _npc.id) {
          var _rel = state.relationships && state.relationships[_npc.id];
          if (_rel && _rel.met && _today) {
            // birthday 是相对于游戏天数的偏移值(如45表示第45天)
            if (_today === _npc.birthday) {
              _birthdayNpcs.push({ name: _npc.name || _npc.id, icon: "🎂", id: _npc.id });
            } else if (_today === _npc.birthday - 1) {
              _birthdayNpcs.push({ name: _npc.name || _npc.id, icon: "⏰", id: _npc.id });
            }
          }
        }
      }
      if (_birthdayNpcs.length > 0) {
        html += '<div class="section"><h3>🎂 生日提醒</h3>';
        html += '<div class="card" style="padding:10px;border:1px solid rgba(255,183,77,0.3);background:rgba(255,183,77,0.05);">';
        for (var _bni = 0; _bni < _birthdayNpcs.length; _bni++) {
          var _bn = _birthdayNpcs[_bni];
          var _msg = _bn.icon === "🎂" ? "今天是" + _bn.name + "的生日！去拜访ta送上祝福吧" : _bn.name + "明天过生日，准备一份礼物吧";
          html += '<div style="font-size:12px;margin:2px 0;">' + _bn.icon + " " + _msg + "</div>";
        }
        html += '</div></div>';
      }
    }
  } catch (e) {}

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
        ((family.parents.father && family.parents.father.age) || "?") +
        "岁 · 母亲" +
        ((family.parents.mother && family.parents.mother.age) || "?") +
        "岁</p>";
    }
    html += "</div></div>";
  }

  // P3-2 同龄人进度锚点（社会比较心理）
  html += '<div class="section"><h3>📊 同龄人进度</h3>';
  html += "<div class='card' style='padding:12px;'>";
  // 计算玩家收入
  var playerSalary =
    (state.corporate && state.corporate.job && state.corporate.job.salary) ||
    (state.career && state.career.currentJob && state.career.currentJob.salary) ||
    0;
  // 从 NPC 数据计算平均月收入
  var npcIncomes = [];
  if (typeof NPCS !== "undefined") {
    for (var ni = 0; ni < NPCS.length; ni++) {
      if (NPCS[ni].monthlyIncome) npcIncomes.push(NPCS[ni].monthlyIncome);
    }
  }
  var avgIncome = npcIncomes.length > 0
    ? Math.round(npcIncomes.reduce(function(a,b){return a+b;}, 0) / npcIncomes.length)
    : 0;
  // 同龄进度条
  var pct = avgIncome > 0 ? Math.min(100, Math.round(playerSalary / avgIncome * 100)) : 0;
  html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">';
  html += '<span>你的月收入</span><strong>¥' + playerSalary.toLocaleString() + '</strong>';
  html += '</div>';

  // [全系统自洽修复] 域D 联动增强: D→F 社交关系质量概览 — 显示深交/挚友数量
  (function () {
    if (!state.relationships) return;
    var _total = 0, _close = 0, _intimate = 0;
    for (var _rid in state.relationships) {
      var _r = state.relationships[_rid];
      if (_r && _r.met) {
        _total++;
        var _aff = _r.affinity || 0;
        if (_aff >= 70) _intimate++;
        else if (_aff >= 40) _close++;
      }
    }
    if (_total > 0) {
      html += '<div style="margin-top:8px;padding:8px;background:rgba(74,158,92,0.06);border-radius:6px;font-size:11px;">';
      html += '🤝 社交圈：<strong>' + _total + '</strong>人 · 深交(≥40) <strong>' + (_close + _intimate) + '</strong>人 · 挚友(≥70) <strong>' + _intimate + '</strong>人';
      if (_intimate >= 3) html += ' 🏆 你的社交网络非常稳固！';
      else if (_intimate === 0) html += ' 💡 多拜访NPC培养好感吧';
      html += '</div>';
    }
  })();

  html += '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">';
  html += '<span>同龄人平均</span><strong>¥' + avgIncome.toLocaleString() + '</strong>';
  html += '</div>';
  // 进度条
  html += '<div style="height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden;margin:6px 0;">';
  html += '<div style="height:100%;width:' + pct + '%;background:' + (pct >= 100 ? 'var(--success)' : 'var(--warning)') + ';border-radius:4px;transition:width 0.3s;"></div>';
  html += '</div>';
  if (pct >= 150) html += '<p style="font-size:11px;color:var(--success);">🏆 你已经超越了大多数同龄人！</p>';
  else if (pct >= 100) html += '<p style="font-size:11px;color:var(--success);">👍 你跟上了同龄人的步伐。</p>';
  else if (pct >= 50) html += '<p style="font-size:11px;color:var(--warning);">💪 再加把劲，你可以追上同龄人！</p>';
  else html += '<p style="font-size:11px;color:var(--danger);">📈 差距不小，但别灰心——每天进步一点点。</p>';
  html += "</div></div>";

  // [全系统自洽修复] 域F 联动增强2: 可拜访NPC计数 — 冷却结束可互动的NPC数量
  try {
    var rels = state.relationships || {};
    var visitableCount = 0;
    var totalMet = 0;
    var today = state.player ? state.player.day : 0;
    for (var rid in rels) {
      if (!Object.prototype.hasOwnProperty.call(rels, rid)) continue;
      var r = rels[rid];
      if (!r || !r.met) continue;
      totalMet++;
      // [全系统自洽修复] 域D 修复: 冷却字段名对齐（按钮写_lastVisit，此处读_lastVisitDay→永不同步）
      // 冷却检查：_lastVisit + 7天冷却
      var lastVisit = r._lastVisit || 0;
      if (today - lastVisit >= 7) {
        visitableCount++;
      }
    }
    if (totalMet > 0) {
      html += '<div class="section"><h3>👥 NPC社交</h3>';
      html += "<div class='card' style='padding:12px;'>";
      html += "<p>已结识 <strong>" + totalMet + "</strong> 人 · 可拜访 <strong style='color:var(--success);'>" + visitableCount + "</strong> 人（冷却结束）</p>";
      if (visitableCount > 0) {
        html += '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">💡 去找他们聊聊吧！拜访NPC可以提升好感，解锁加成和事件。</p>';
      }
      html += "</div></div>";
    }
  } catch (e) {
    // 静默：NPC计数不影响主流程
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
      // [全系统自洽修复] 域D 联动增强: NPC动态显示中文名
      var _feedNpcName = "";
      if (feed.npcId && typeof NPCS !== "undefined") {
        var _feedDef = NPCS.find(function (n) {
          return n.id === feed.npcId;
        });
        _feedNpcName = _feedDef ? _feedDef.name + ": " : "";
      }
      html += '<div style="padding:4px 0;font-size:11px;">';
      html +=
        '<p style="margin:0;">' + _feedNpcName + (feed.content || "") + "</p>";
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

  // ====== 公共：NPC 拜访按钮事件绑定（所有子Tab共享） ======
  /** [全系统自洽修复] 域D 修复:将拜访按钮事件绑定提升为模块级公共函数，供所有社交子Tab共用 */
  function _bindVisitBtns(state, parent) {
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
          // 获取NPC中文名（先查，供后续所有消息使用）
          var _npcName = "";
          if (typeof NPCS !== "undefined") {
            var _def = NPCS.find(function (n) {
              return n.id === npcId;
            });
            _npcName = _def ? _def.name : npcId;
          } else {
            _npcName = npcId;
          }
          // 检查冷却（7天）
          if (rel._lastVisit && state.player.day - rel._lastVisit < 7) {
            var daysLeft = 7 - (state.player.day - rel._lastVisit);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(
                "⏳ 你刚拜访过" + _npcName + "，再等" + daysLeft + "天吧。",
                "info",
              );
            }
            return;
          }
          // 触发拜访互动（通过 applyAffinityChange 确保衰减系统识别）
          var gain =
            typeof Random !== "undefined" ? (Random.chance(0.5) ? 3 : 5) : 4;
          if (typeof applyAffinityChange === "function") {
            applyAffinityChange(state, npcId, gain, "拜访");
          } else {
            rel.affinity = Math.min(100, (rel.affinity || 0) + gain);
          }
          rel._lastVisit = state.player.day;
          // [全系统自洽修复] 域D 联动增强: NPC拜访状态加成（根据角色类型给予不同加成）
          (function () {
            if (!state.needs && !state.player) return;
            var _npcRole = "";
            if (typeof NPCS !== "undefined") {
              var _def = NPCS.find(function (n) { return n.id === npcId; });
              if (_def) _npcRole = _def.role || "";
            }
            var _bonusMsg = "";
            if (_npcRole.indexOf("医生") >= 0 || _npcRole.indexOf("健康") >= 0) {
              if (state.status) { state.status.health = Math.min(100, (state.status.health || 50) + 1); _bonusMsg = "健康+1"; }
            } else if (_npcRole.indexOf("厨师") >= 0 || _npcRole.indexOf("菜") >= 0 || _npcRole.indexOf("外卖") >= 0) {
              if (state.needs) { state.needs.hunger = Math.min(100, (state.needs.hunger || 50) + 2); _bonusMsg = "饥饿+2"; }
            } else if (_npcRole.indexOf("中介") >= 0 || _npcRole.indexOf("主播") >= 0 || _npcRole.indexOf("网红") >= 0) {
              if (state.player) { state.player.mental = Math.min(100, (state.player.mental || 50) + 1); _bonusMsg = "心智+1"; }
            } else if (_npcRole.indexOf("工头") >= 0 || _npcRole.indexOf("修车") >= 0 || _npcRole.indexOf("保安") >= 0) {
              if (state.player) { state.player.physique = Math.min(100, (state.player.physique || 50) + 1); _bonusMsg = "体质+1"; }
            } else if (_npcRole.indexOf("情报") >= 0 || _npcRole.indexOf("同学") >= 0) {
              if (state.player) { state.player.intelligence = Math.min(100, (state.player.intelligence || 50) + 1); _bonusMsg = "智力+1"; }
            } else {
              if (state.needs) { state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 1); _bonusMsg = "心情+1"; }
            }
            if (_bonusMsg && typeof StateManager !== "undefined") {
              StateManager.addMessage("✨ 与" + _npcName + "的会面让你感到充实，" + _bonusMsg + "。", "info");
            }
          })();
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
  }
}
