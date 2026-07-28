/**
 * 域E(经济/投资) 联动增强 R738b（本窗口自动化轮，b后缀避让并行R738）
 * 主题：investment.js 每日tick既有产出的三块"写后全库零读取"素材首消费——
 *   1) _portfolioMilestone_100000 flag（R738b前仅investment.js写入防重，无任何事件读取）
 *   2) _portfolioPeakHistory 30日市值曲线（注释自称"供趋势可视化"但全库唯一引用方是写入方自身）
 *   3) _portfolioMilestone_1000000 flag（百万里程碑同样零回响）
 * 桥接：
 *   E→D  e738b_milestone_mentor   10万里程碑→已结识NPC上门请教理财（禀赋效应+社会认同）
 *   E→G  e738b_curve_reflection   30日市值曲线趋势→身心回响（峰终定律:回顾曲线形状而非终点数字）
 *   E→C  e738b_million_gravity    百万里程碑→职场引力（财富改变职业谈判地位,损失厌恶反向:敢冒险）
 * 防御：全部||守卫；NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange；
 *       peakHistory 读取前 Array.isArray；除法前 isFinite+>0；done-flag防重。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR738bLoaded) return;
  RANDOM_EVENTS._domainELinkageR738bLoaded = true;

  function safeAffinity(st, nid, amt, reason) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, amt, reason); } catch (e) {}
    }
  }
  function npcName(nid) {
    if (typeof getNpcDisplayName === "function") {
      try { return getNpcDisplayName(nid) || "老熟人"; } catch (e) {}
    }
    return "老熟人";
  }
  // 取一个已结识NPC（域D铁律: rel && rel.met）
  function pickMetNpc(st) {
    if (!st || !st.relationships) return null;
    var ids = [];
    for (var k in st.relationships) {
      var rel = st.relationships[k];
      if (rel && rel.met) ids.push(k);
    }
    if (ids.length === 0) return null;
    return ids[Math.floor(Math.random() * ids.length)];
  }
  // 安全读取30日市值曲线趋势：返回 {ok, firstV, lastV, ratio}
  function curveTrend(st) {
    var out = { ok: false, firstV: 0, lastV: 0, ratio: 1 };
    if (!st || !st.investment) return out;
    var h = st.investment._portfolioPeakHistory;
    if (!Array.isArray(h) || h.length < 15) return out;
    var first = h[0], last = h[h.length - 1];
    if (!first || !last) return out;
    var fv = first.value, lv = last.value;
    if (!isFinite(fv) || !isFinite(lv) || fv <= 0) return out;
    out.ok = true; out.firstV = fv; out.lastV = lv;
    out.ratio = lv / fv;
    if (!isFinite(out.ratio)) { out.ok = false; out.ratio = 1; }
    return out;
  }

  var EVENTS = [
    {
      // E→D: _portfolioMilestone_100000 首读——10万里程碑的社交回响
      id: "e738b_milestone_mentor", phase: "corporate", _isChainEvent: false, icon: "🍵",
      title: "理财请教",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._portfolioMilestone_100000) return false; // 零读取flag首消费
        if (st.flags._e738bMentorDone) return false;
        if (!pickMetNpc(st)) return false; // 域D铁律:无已结识NPC则不触发
        return true;
      },
      choices: [
        {
          text: "🍵 耐心分享心得", hint: "好感+6,社交XP+8,置_e738bMentorGave",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bMentorDone = true;
            st.flags._e738bMentorGave = true;
            var nid = pickMetNpc(st);
            if (nid) safeAffinity(st, nid, 6, "耐心分享理财心得");
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch (e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🍵 " + (nid ? npcName(nid) : "老熟人") + "听得很认真:'原来你早就在悄悄理财了。' 好感+6,社交XP+8。", "success");
            }
          }
        },
        {
          text: "😶 含糊带过", hint: "守住财不露白,心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bMentorDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😶 财不露白。你笑着把话题岔开了。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var nid = pickMetNpc(st);
        return (nid ? npcName(nid) : "一位老熟人") + "不知从哪听说你投资组合破了10万,拎着水果上门:'教教我呗,我那点存款放银行都快跑不赢菜价了。'";
      }
    },
    {
      // E→G: _portfolioPeakHistory 首读——曲线形状的身心回响（峰终定律）
      id: "e738b_curve_reflection", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "三十天的曲线",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._e738bCurveCd) return false;
        return curveTrend(st).ok; // 内含 Array.isArray + isFinite + >0 守卫
      },
      choices: [
        {
          text: "🧘 接纳波动本身", hint: "心智+7,置_e738bCurveZen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bCurveCd = true;
            st.flags._e738bCurveZen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '曲线会波动,生活还要继续。' 心智+7。", "success");
            }
          }
        },
        {
          text: "📒 记下这条曲线", hint: "会计XP+7,趋势向上再+心情5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bCurveCd = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 7); } catch (e) {} }
            var t = curveTrend(st);
            if (t.ok && t.ratio >= 1.05 && st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
              if (typeof StateManager !== "undefined") StateManager.addMessage("📒 复盘完毕,曲线整体向上。会计XP+7,心情+5。", "success");
            } else if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📒 复盘完毕。亏钱的曲线,也是学费的收据。会计XP+7。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var t = curveTrend(st);
        if (!t.ok) return "深夜,你翻出最近三十天的资产曲线,看了很久。";
        var pct = Math.round((t.ratio - 1) * 100);
        if (pct >= 5) return "深夜复盘:三十天前组合市值¥" + Math.round(t.firstV).toLocaleString() + ",今天¥" + Math.round(t.lastV).toLocaleString() + "(+" + pct + "%)。曲线一路向上,你却提醒自己:别把牛市当本事。";
        if (pct <= -5) return "深夜复盘:三十天前组合市值¥" + Math.round(t.firstV).toLocaleString() + ",今天¥" + Math.round(t.lastV).toLocaleString() + "(" + pct + "%)。曲线向下,你盯着屏幕深吸一口气——账面浮亏,只有卖出才成真。";
        return "深夜复盘:三十天来组合市值在¥" + Math.round(t.lastV).toLocaleString() + "附近横盘。不涨不跌的日子,最考验耐心。";
      }
    },
    {
      // E→C: _portfolioMilestone_1000000 首读——百万资产的职场引力
      id: "e738b_million_gravity", phase: "corporate", _isChainEvent: false, icon: "🧲",
      title: "百万底气",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._portfolioMilestone_1000000) return false; // 零读取flag首消费
        if (st.flags._e738bMillionDone) return false;
        return true;
      },
      choices: [
        {
          text: "🧲 敢谈更高的条件", hint: "管理XP+10,智力+5,置_e738bMillionBold",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bMillionDone = true;
            st.flags._e738bMillionBold = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch (e) {} }
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧲 '不靠这份工资吃饭'的底气,让你在谈判桌上敢开口了。管理XP+10,智力+5。", "success");
            }
          }
        },
        {
          text: "🌱 一切照旧", hint: "平常心,心智+6,心情+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e738bMillionDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🌱 资产是数字,日子是日子。心智+6,心情+4。", "info");
            }
          }
        }
      ],
      text: function () {
        return "投资组合破百万后,你发现自己开会时坐姿都不一样了——不是傲慢,是那种'最坏也饿不死'的松弛。这种底气,要不要用在职业谈判上?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
