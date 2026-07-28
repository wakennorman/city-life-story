/**
 * 域G(核心机制/生命周期) 联动增强 R663
 * 桥接：
 *   G→E  g663_daily_expense_awareness  日常开支意识 → 消费 state.resources+state.player 数据,
 *     生命→"每天花多少钱"经济回响
 *   G→D  g663_seasonal_social_rhythm  季节社交节奏 → 消费 state.player+state.relationships 数据,
 *     生命→"四季更替中的社交"社交回响
 *   G→F  g663_life_quality_index  生活品质指数 → 消费 state.needs+state.status+state.player 数据,
 *     生命→"生活质量综合评分"UI回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR663Loaded) return;
  RANDOM_EVENTS._domainGLinkageR663Loaded = true;

  function metNpcsR663(st) {
    var out = []; var rels = st.relationships || {};
    for (var k in rels) { if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 }); }
    return out;
  }

  var EVENTS = [
    {
      id: "g663_daily_expense_awareness", phase: "street", _isChainEvent: false, icon: "💰",
      title: "日常开支", triggers: { minDay: 7 },
      story: function(st) {
        var day = st.player && st.player.day || 1;
        var totalEarned = st.resources && st.resources.totalEarned || 0;
        var cash = st.resources && st.resources.cash || 0;
        var dailyAvg = Math.round(totalEarned / Math.max(1, day));
        var spent = totalEarned - cash;
        var dailySpend = Math.round(spent / Math.max(1, day));
        if (day < 7) return "你刚来这座城市不久，先熟悉环境，慢慢就会知道每天的开销了。";
        return "你在这座城市生活了" + day + "天，累计赚了¥" + totalEarned.toLocaleString() + "，日均收入¥" + dailyAvg + "。" + "日均开支约¥" + dailySpend + "，" + (dailySpend > dailyAvg * 0.8 ? "开支偏高，建议适当控制。" : "开支控制在合理范围内。") + "记账是理财的第一步。";
      },
      choices: [
        { text: "📝 开始记账", apply: function(st) { st.flags=st.flags||{}; st.flags._g663_budget=(st.flags._g663_budget||0)+1; StateManager.addMessage("📝 开始记录每日开支", "info"); }},
        { text: "💰 查看资产", apply: function(st) { StateManager.addMessage("💰 现金¥" + ((st.resources&&st.resources.cash)||0).toLocaleString(), "info"); }},
      ],
      conditions: function(st) { return st.resources && st.resources.totalEarned > 0; },
      weight: 1,
    },
    {
      id: "g663_seasonal_social_rhythm", phase: "street", _isChainEvent: false, icon: "🌸",
      title: "季节社交", triggers: { minDay: 10 },
      story: function(st) {
        var npcs = metNpcsR663(st); if (npcs.length === 0) return "你还没有朋友，试着走出去认识些人。";
        var day = st.player && st.player.day || 1;
        var season = (day % 120 < 30) ? "春" : (day % 120 < 60) ? "夏" : (day % 120 < 90) ? "秋" : "冬";
        var seasonTips = { "春": "春天适合踏青和户外活动", "夏": "夏天可以约朋友吃夜宵", "秋": "秋天适合一起喝茶赏景", "冬": "冬天约个火锅最暖心" };
        return "现在是" + season + "天，你认识" + npcs.length + "位朋友。" + seasonTips[season] + "。" + "约朋友出来聚聚，维护关系的同时也能放松心情。";
      },
      choices: [
        { text: "🌸 约朋友", apply: function(st) { if(st.needs) st.needs.happiness=Math.min(100,(st.needs.happiness||50)+5); StateManager.addMessage("🌸 约朋友出来聚了聚，心情+5", "success"); }},
        { text: "🍵 独处", apply: function(st) { if(st.player) st.player.mental=Math.min(100,(st.player.mental||50)+2); StateManager.addMessage("🍵 享受独处时光，心智+2", "success"); }},
      ],
      conditions: function(st) { var npcs = metNpcsR663(st); return npcs.length >= 1; },
      weight: 1,
    },
    {
      id: "g663_life_quality_index", phase: "street", _isChainEvent: false, icon: "📊",
      title: "生活质量", triggers: { minDay: 14 },
      story: function(st) {
        var h = st.status && st.status.health || 100; var ha = st.needs && st.needs.happiness || 50; var f = st.needs && st.needs.fullness || 50; var fa = st.needs && st.needs.fatigue || 0; var hy = st.needs && st.needs.hygiene || 50; var m = st.player && st.player.mental || 50;
        var score = 0; score += (h >= 80 ? 20 : h >= 50 ? 10 : 0); score += (ha >= 60 ? 20 : ha >= 30 ? 10 : 0); score += (f >= 60 ? 15 : f >= 30 ? 8 : 0); score += (fa <= 30 ? 15 : fa <= 60 ? 8 : 0); score += (hy >= 60 ? 15 : hy >= 30 ? 8 : 0); score += (m >= 60 ? 15 : m >= 30 ? 8 : 0);
        var grade = score >= 80 ? "优秀" : score >= 60 ? "良好" : score >= 40 ? "一般" : "需要改善";
        return "生活质量综合评分：" + score + "/100（" + grade + "）<br>健康" + Math.round(h) + " 心情" + Math.round(ha) + " 饱食" + Math.round(f) + "<br>疲劳" + Math.round(fa) + " 卫生" + Math.round(hy) + " 心智" + Math.round(m) + "<br>" + (score < 60 ? "有几项指标偏低，需要注意调整。" : "继续保持良好的生活习惯。");
      },
      choices: [
        { text: "🛌 休息", apply: function(st) { if(st.needs) st.needs.fatigue=Math.max(0,(st.needs.fatigue||0)-20); StateManager.addMessage("🛌 休息了一下，疲劳-20", "success"); }},
        { text: "🚿 打理", apply: function(st) { if(st.needs) st.needs.hygiene=Math.min(100,(st.needs.hygiene||50)+15); StateManager.addMessage("🚿 打理了一下个人卫生，卫生+15", "success"); }},
      ],
      conditions: function(st) { return st.needs && (st.needs.happiness !== undefined); },
      weight: 1,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();