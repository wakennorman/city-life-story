/**
 * 域A(数据/数值平衡) 联动增强 R770b — 高价住房 effects/extraFeatures 死数据兑现层
 * 背景（A类审计）：HOUSING_TIERS tier5别墅(¥50000)/tier6豪宅(¥200000) 的 effects 四键
 *   (healthRecovery/skillStudyBonus/npcVisitBonus/fameGain) 与 extraFeatures
 *   (canHostNPC/party/garden/view/staff) 此前全库零应用器——玩家花大钱买房，承诺全部静默失效。
 * 接线分工：
 *   skillStudyBonus  → main.js addSkillXp 单点接线（本轮 A类修复#2a）
 *   healthRecovery   → 本文件包装 runDailyPipeline 每日兑现（daily_pipeline 并行在途不碰，走包装全局函数铁律）
 *   npcVisitBonus    → a770b_mansion_party 事件层首消费（A→D）
 *   fameGain         → a770b_view_interview 事件层首消费（A→B/G）
 * 联动（禀赋效应+社会比较+峰终定律）：
 *   A→C  a770b_villa_study      别墅书房夜读——skillStudyBonus 叙事层兑现（XP走main.js接线自然放大）
 *   A→D  a770b_mansion_party    豪宅家宴——canHostNPC/party 死数据首兑现，npcVisitBonus 放大好感
 *   A→B/G a770b_view_interview  江景专访——view:"panoramic"/fameGain 死数据首兑现，写 player.fame 真实字段
 * 防御：met铁律 / done-flag+冷却防重 / ||守卫 / applyAffinityChange四参 / getNpcDisplayName兜底 / 显式phase:"street" / wrapper保存_orig绝不自引用
 */
(function () {
  "use strict";

  // ===== 接线1: healthRecovery 每日兑现（包装 runDailyPipeline，非自引用wrapper） =====
  // [全系统自洽修复] 域A R770b 修复: HOUSING_TIERS tier5/6 effects.healthRecovery(别墅+5/豪宅+10每日健康恢复)全库零应用器→包装每日管线单点兑现
  if (typeof window !== "undefined" && typeof window.runDailyPipeline === "function" && !window._a770bPipelineWrapped) {
    window._a770bPipelineWrapped = true;
    var _origRunDailyPipeline = window.runDailyPipeline;
    window.runDailyPipeline = function (state) {
      var ret = _origRunDailyPipeline.apply(this, arguments);
      try {
        if (state && state.housing && state.status && typeof state.status.health === "number") {
          var _tier = state.housing.tier || 0;
          var _house = (typeof HOUSING_TIERS !== "undefined" && HOUSING_TIERS[_tier]) || null;
          var _rec = _house && _house.effects && _house.effects.healthRecovery;
          if (typeof _rec === "number" && isFinite(_rec) && _rec > 0) {
            var _day = (state.player && state.player.day) || 0;
            state.flags = state.flags || {};
            if (state.flags._a770bHealthRecDay !== _day) {
              state.flags._a770bHealthRecDay = _day;
              var _before = state.status.health;
              state.status.health = Math.min(100, _before + Math.min(20, _rec));
              if (!state.flags._a770bHealthRecNotified && state.status.health > _before) {
                state.flags._a770bHealthRecNotified = true;
                if (typeof StateManager !== "undefined" && StateManager.addMessage) {
                  StateManager.addMessage("🏡 住进" + (_house.name || "好房子") + "后，安静的环境让你休息得更好——每日健康+" + Math.min(20, _rec) + "（住所环境加成已生效）。", "success");
                }
              }
            }
          }
        }
      } catch (e) {}
      return ret;
    };
  }

  // ===== 联动事件 3 项 =====
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR770bLoaded) return;
  RANDOM_EVENTS._domainALinkageR770bLoaded = true;

  function _npcName(id, fallback) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(id); if (n) return n; } catch (e) {}
    }
    return fallback;
  }
  function _tier(st) {
    return (st && st.housing && st.housing.tier) || 0;
  }
  function _houseOf(st) {
    var t = _tier(st);
    return (typeof HOUSING_TIERS !== "undefined" && HOUSING_TIERS[t]) || null;
  }
  function _metNpcIds(st, max) {
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var rel = st.relationships[id];
      if (rel && rel.met) {
        out.push(id);
        if (out.length >= max) break;
      }
    }
    return out;
  }

  var EVENTS = [
    {
      id: "a770b_villa_study",
      phase: "street",
      icon: "📖",
      title: "书房的深夜",
      story: "别墅的书房安静得能听见笔尖划过纸面的声音。落地灯下，这个专属空间让你的学习效率明显更高——这是当初买房时置业顾问反复强调的卖点，现在你信了。",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (_tier(st) < 5) return false;
        var h = _houseOf(st);
        if (!h || !h.effects || !h.effects.skillStudyBonus) return false;
        var day = (st.player && st.player.day) || 0;
        if (st.flags && st.flags._a770bStudyCd && day - st.flags._a770bStudyCd < 14) return false;
        return true;
      },
      choices: [
        {
          text: "📊 研读管理案例",
          hint: "管理XP+12（书房环境加成自动生效）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a770bStudyCd = (st.player && st.player.day) || 0;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 12); } catch (e) {} }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 书房夜读收获颇丰。管理XP+12（含住所学习加成），心智+2。", "success");
            }
          },
        },
        {
          text: "💻 钻研技术文档",
          hint: "编程XP+12（书房环境加成自动生效）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a770bStudyCd = (st.player && st.player.day) || 0;
            if (typeof addSkillXp === "function") { try { addSkillXp("coding", 12); } catch (e) {} }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💻 技术文档啃完一章。编程XP+12（含住所学习加成），心智+2。", "success");
            }
          },
        },
        {
          text: "🛏️ 今晚只想休息",
          hint: "疲劳-5",
          apply: function (st) {
            if (!st) return;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🛏️ 你合上书，在书房的躺椅上小憩。疲劳-5。", "info");
            }
          },
        },
      ],
    },
    {
      id: "a770b_mansion_party",
      phase: "street",
      icon: "🥂",
      title: "顶层豪宅的家宴",
      story: "270度江景在落地窗外铺开。豪宅的会客厅从交房那天起就没真正用过——今晚，你想请几位老朋友来坐坐。管家已经把餐具摆好了。",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (_tier(st) < 6) return false;
        if (!st.resources || (st.resources.cash || 0) < 800) return false;
        if (_metNpcIds(st, 1).length < 1) return false;
        var day = (st.player && st.player.day) || 0;
        if (st.flags && st.flags._a770bPartyCd && day - st.flags._a770bPartyCd < 30) return false;
        return true;
      },
      choices: [
        {
          text: "🥂 办一场家宴（¥800）",
          hint: "至多3位旧识好感提升（豪宅接待加成放大），名声+3，心情+8",
          apply: function (st) {
            if (!st || !st.resources) return;
            st.flags = st.flags || {};
            st.flags._a770bPartyCd = (st.player && st.player.day) || 0;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800);
            var h = _houseOf(st);
            // [全系统自洽修复] 域A R770b: effects.npcVisitBonus(豪宅+20%接待加成)与extraFeatures.canHostNPC/party全库零消费→此处首兑现
            var bonus = (h && h.effects && typeof h.effects.npcVisitBonus === "number" && isFinite(h.effects.npcVisitBonus)) ? h.effects.npcVisitBonus : 0;
            var aff = Math.round(4 * (1 + Math.max(0, Math.min(0.5, bonus))));
            var guests = _metNpcIds(st, 3);
            var names = [];
            for (var i = 0; i < guests.length; i++) {
              if (typeof applyAffinityChange === "function") {
                try { applyAffinityChange(st, guests[i], aff, "豪宅家宴款待"); } catch (e) {}
              }
              names.push(_npcName(guests[i], "老朋友"));
            }
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🥂 " + names.join("、") + "在江景前举杯。宾主尽欢，好感各+" + aff + "（含豪宅接待加成），名声+3，心情+8。", "success");
            }
          },
        },
        {
          text: "🤫 还是喜欢清静",
          hint: "无变化",
          apply: function (st) {
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 你独自看了会儿江景。热闹是他们的。", "info");
            }
          },
        },
      ],
    },
    {
      id: "a770b_view_interview",
      phase: "street",
      icon: "📺",
      title: "江景窗前的专访",
      story: "一家本地媒体联系你：想做一期城市奋斗者的专题，希望把镜头架在你那扇著名的270度江景窗前。「您的故事配这个背景，太有说服力了。」",
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (_tier(st) < 6) return false;
        if (!st.player || (st.player.fame || 0) < 30) return false;
        if (st.flags && st.flags._a770bInterviewDone) return false;
        return true;
      },
      choices: [
        {
          text: "📺 接受专访",
          hint: "名声提升（豪宅曝光加成放大），心情+6",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a770bInterviewDone = true;
            var h = _houseOf(st);
            // [全系统自洽修复] 域A R770b: effects.fameGain(豪宅名声获取+10%)与extraFeatures.view:"panoramic"全库零消费→此处首兑现
            var fg = (h && h.effects && typeof h.effects.fameGain === "number" && isFinite(h.effects.fameGain)) ? h.effects.fameGain : 0;
            var gain = Math.round(6 * (1 + Math.max(0, Math.min(0.5, fg))));
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + gain);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📺 节目播出后，不少人认出了那扇江景窗。名声+" + gain + "（含豪宅曝光加成），心情+6。", "success");
            }
          },
        },
        {
          text: "🚪 婉拒曝光",
          hint: "心智+3（低调的安全感）",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a770bInterviewDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚪 你礼貌地拒绝了。财不露白，心智+3。", "info");
            }
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
  if (typeof console !== "undefined" && console.log) {
    console.log("[A R770b] 3 housing-effects linkage events registered");
  }
})();
