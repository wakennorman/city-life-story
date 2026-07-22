/**
 * 域F联动增强：情绪轨迹面板 + AP消耗明细
 * [全系统自洽修复] 域F R178: emotion/AP首次获得专属UI入口
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== 情绪轨迹渲染 =====
  function renderEmotionSnapshot(state, container) {
    if (!state || !state.player || !state.needs) return "";
    var happy = state.needs.happiness || 50;
    var emoClass = happy >= 75 ? "happy" : happy >= 55 ? "stable" : happy >= 35 ? "stressed" : "sad";
    var emoEmoji = happy >= 85 ? "🌟" : happy >= 75 ? "😊" : happy >= 55 ? "😐" : happy >= 35 ? "😰" : "😢";
    var emoLabel = happy >= 85 ? "振奋" : happy >= 75 ? "幸福" : happy >= 55 ? "平静" : happy >= 35 ? "焦虑" : "低落";
    var desc = "";
    if (happy >= 80) desc = "你现在状态很好！适合做需要创造力的事。";
    else if (happy >= 60) desc = "状态还不错，保持下去。";
    else if (happy >= 40) desc = "最近压力有点大，记得适当放松。";
    else desc = "心情很低落的时候，允许自己休息一天也没关系。";
    return '<div id="emotion-snapshot"' + (container ? ' style="margin-bottom:8px;"' : "") + '>' +
      '<div style="font-size:12px;font-weight:bold;margin-bottom:4px;">' + emoEmoji + ' 当前情绪 · ' + emoLabel + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">' + desc + '</div>' +
      '<div class="emotion-bar" style="height:4px;border-radius:2px;background:var(--bg-input);overflow:hidden;">' +
        '<div class="emotion-bar-fill" style="height:100%;width:' + happy + '%;background:' +
          (happy >= 75 ? 'var(--success)' : happy >= 55 ? 'var(--accent)' : 'var(--danger)') + '"></div></div></div>';
  }

  // ===== AP消耗明细渲染 =====
  function renderApBreakdown(state, container) {
    if (!state || !state.player || !state.flags) return "";
    var actions = state.flags._todayActions || [];
    var totalSpent = actions.reduce(function(s, a) { return s + (a.apCost || 0); }, 0);
    var maxAP = state.player.maxActionPoints || 20;
    var remaining = Math.max(0, maxAP - totalSpent);
    var efficiency = totalSpent > 0 ? Math.round((actions.reduce(function(s, a) { return s + (a.profit || 0); }, 0) / totalSpent)) : 0;
    var html = '<div id="ap-breakdown" style="font-size:11px;padding:6px;background:var(--bg-card);border-radius:6px;margin-bottom:8px;">' +
      '<div style="font-weight:bold;margin-bottom:4px;">⚡ 今日AP · ' + remaining + '/' + maxAP + ' 剩余</div>';
    if (actions.length > 0) {
      html += '<div style="color:var(--text-muted);margin-bottom:4px;">消耗明细：</div>';
      for (var i = 0; i < Math.min(actions.length, 5); i++) {
        var a = actions[i];
        html += '<span style="display:inline-block;padding:2px 4px;margin:1px;background:var(--bg-input);border-radius:3px;font-size:10px;">' +
          (a.name || "行动") + ' ' + (a.profit ? '¥' + a.profit : '') + ' [' + (a.apCost || 0) + 'AP]</span> ';
      }
      if (actions.length > 5) html += '<span style="color:var(--text-muted);">+' + (actions.length - 5) + '更多</span>';
    }
    html += '<div style="margin-top:4px;color:var(--text-muted);">累计: ' + totalSpent + 'AP / ' + maxAP + 'AP (' + Math.round(totalSpent/maxAP*100) + '%) | 效率: ¥' + efficiency + '/AP</div>' +
      '</div>';
    return html;
  }

  // ===== IIFE注入: 将情绪和AP面板注册到渲染流程 =====
  if (typeof TAB_RENDERERS !== "undefined") {
    // 在个人成长Tab追加情绪快照
    var origPG = typeof window.renderMergedPersonalGrowthTab === "function" ? window.renderMergedPersonalGrowthTab : null;
    if (origPG) {
      window.renderMergedPersonalGrowthTab = function(state, content) {
        var result = origPG(state, content);
        // 在内容末尾追加情绪面板
        if (result && typeof result === "string") {
          result += renderEmotionSnapshot(state);
        }
        return result || result; // pass-through
      };
    }
    // 在事业发展Tab追加AP明细
    var origCD = typeof window.renderCareerDevTab === "function" ? window.renderCareerDevTab : null;
    if (origCD) {
      window.renderCareerDevTab = function(state, content) {
        var result = origCD(state, content);
        if (result && typeof result === "string") {
          // 在Tab开头插入AP明细
          result = renderApBreakdown(state) + result;
        }
        return result || result;
      };
    }
  }

  // ===== 全局工具函数导出 =====
  if (typeof window !== "undefined") {
    window.renderEmotionSnapshot = renderEmotionSnapshot;
    window.renderApBreakdown = renderApBreakdown;
  }
})();
