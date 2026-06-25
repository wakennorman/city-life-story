/**
 * 传承商店 UI — v3.3 W1-T5
 *
 * 用 showModal 渲染 heritage_coin.js 已定义的 6 项红/绿互斥永久解锁。
 * 数据从 getHeritageShop() / spendHeritageCoin() / HERITAGE_UNLOCKS 全部读现成。
 *
 * 入口：主菜单 / 新游戏前调用 showHeritageStore()
 */

(function () {
  "use strict";

  function _esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] || c;
    });
  }

  function _renderCard(u) {
    var isUnlocked = !!u.unlocked;
    var blocked = !!u.blockedByMutual;
    var canBuy = !isUnlocked && !blocked && !!u.affordable;
    var statusBadge = "";
    if (isUnlocked)
      statusBadge =
        '<span style="color:var(--success);font-weight:bold;">✓ 已解锁</span>';
    else if (blocked)
      statusBadge = '<span style="color:var(--danger);">🔒 与已解锁互斥</span>';
    else if (!u.affordable)
      statusBadge = '<span style="color:var(--text-muted);">币不足</span>';
    else
      statusBadge = '<span style="color:var(--text-secondary);">可解锁</span>';

    var btn = "";
    if (canBuy) {
      btn =
        '<button class="btn btn-sm btn-primary" style="margin-top:6px;" onclick="_heritageBuyItem(\'' +
        _esc(u.id) +
        "')\">🪙 花 " +
        u.cost +
        " 解锁</button>";
    } else if (isUnlocked) {
      btn =
        '<div style="margin-top:6px;color:var(--success);font-size:12px;">已生效</div>';
    } else {
      btn =
        '<div style="margin-top:6px;color:var(--text-muted);font-size:12px;">需 ' +
        u.cost +
        " 币</div>";
    }

    var mutualHint = "";
    if (u.mutualExclusion) {
      mutualHint =
        '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">⚖ 与 [' +
        _esc(u.mutualExclusion) +
        "] 互斥</div>";
    }

    return (
      '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<span style="font-size:28px;">' +
      _esc(u.icon) +
      "</span>" +
      '<div style="flex:1;">' +
      '<div style="font-weight:bold;color:var(--text-primary);">' +
      _esc(u.name) +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-muted);">分支：' +
      _esc(u.branch || "") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div style="font-size:12px;color:var(--text-secondary);margin-top:8px;line-height:1.5;">' +
      _esc(u.desc) +
      "</div>" +
      mutualHint +
      '<div style="margin-top:6px;font-size:12px;">' +
      statusBadge +
      "</div>" +
      btn +
      "</div>"
    );
  }

  function showHeritageStore() {
    if (typeof getHeritageShop !== "function") {
      if (typeof showModal === "function") {
        showModal({
          title: "🏛 传承商店",
          body: "<p>传承币系统尚未加载。</p>",
          buttons: [
            { text: "关闭", cls: "btn-primary", callback: function () {} },
          ],
        });
      }
      return;
    }
    var shop = getHeritageShop();
    var balanceHtml =
      '<div style="background:linear-gradient(135deg,#fff8dc,#ffe7a8);border-radius:8px;padding:10px 14px;margin-bottom:12px;border:1px solid #d4a96a;">' +
      '<div style="font-size:14px;color:#8a5a00;">🪙 当前传承币</div>' +
      '<div style="font-size:24px;font-weight:bold;color:#8a5a00;">' +
      shop.balance +
      "</div>" +
      '<div style="font-size:11px;color:#8a5a00;margin-top:2px;">每周目结束按成就/财富/道德/天数结算</div>' +
      "</div>";

    var grid =
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
    for (var i = 0; i < shop.unlocks.length; i++) {
      grid += _renderCard(shop.unlocks[i]);
    }
    grid += "</div>";

    var note =
      '<div style="margin-top:12px;font-size:11px;color:var(--text-muted);line-height:1.5;">' +
      "⚖ 互斥提示：祖传秘方 / 祖辈教诲 二选一，人脉引荐 / 启动资金 二选一。<br/>" +
      "💡 命格护佑 + 命运骰子可叠加，是高端长线目标。" +
      "</div>";

    showModal({
      title: "🏛 传承商店",
      body: balanceHtml + grid + note,
      buttons: [
        {
          text: "返回",
          cls: "btn-secondary",
          callback: function () {},
        },
      ],
    });
  }

  function _heritageBuyItem(id) {
    if (typeof spendHeritageCoin !== "function") return;
    var r = spendHeritageCoin(id);
    if (typeof StateManager !== "undefined" && StateManager.addMessage) {
      StateManager.addMessage(
        (r.ok ? "✅ " : "⚠️ ") + r.msg,
        r.ok ? "success" : "warning",
      );
    }
    // 重新渲染商店
    showHeritageStore();
  }

  if (typeof window !== "undefined") {
    window.showHeritageStore = showHeritageStore;
    window._heritageBuyItem = _heritageBuyItem;
  }
})();
