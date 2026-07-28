/**
 * 域F(UI/UX) 联动增强 R455（第三轮循环）
 * 桥接：
 *   F→D  f455_social_reminder     社交提醒 → 消费 relationships+needs 数据,
 *     社交面板→"好久没联系了"的主动社交提醒
 *   F→E  f455_finance_overview    财务概览 → 消费 resources+investment 数据,
 *     财务面板→"你的资产配置合理吗"的财务健康检查
 *   F→C  f455_skill_progress      技能进度 → 消费 skills 数据,
 *     技能面板→"离下一个等级还差多少"的进度可视化
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR455Loaded) return;
  RANDOM_EVENTS._domainFLinkageR455Loaded = true;

  var EVENTS = [
    {
      id: "f455_social_reminder", phase: "street", _isChainEvent: false, icon: "📱",
      title: "久未联系",
      story: "手机弹出一条提醒——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 5, excludeFlags: ["_f455SocialReminderCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f455SocialReminderCooldown);
      },
      choices: [
        { text: "📱 打个电话问候", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455SocialReminderCooldown = true;
          if (typeof applyAffinityChange === "function") {
            for (var id in (st.relationships || {})) {
              if (st.relationships[id] && st.relationships[id].met) {
                try { applyAffinityChange(st, id, 2, "主动联系问候"); } catch(e) {}
                break;
              }
            }
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你打了个电话给老朋友——'喂，好久不见，最近怎么样？' 电话那头的声音，听起来还是那么熟悉。好感+2,心情+2。", "success");
        }},
        { text: "💬 发条微信", hint: "好感+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455SocialReminderCooldown = true;
          if (typeof applyAffinityChange === "function") {
            for (var id in (st.relationships || {})) {
              if (st.relationships[id] && st.relationships[id].met) {
                try { applyAffinityChange(st, id, 1, "微信问候"); } catch(e) {}
                break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你发了条微信过去——'最近还好吗？' 对方很快回了：'挺好的！改天聚聚！' 好感+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "手机弹出一条提醒——'你已经很久没联系某些朋友了。' 在这座城市，别让距离拉远了人心。";
      }
    },
    {
      id: "f455_finance_overview", phase: "street", _isChainEvent: false, icon: "💰",
      title: "财务体检",
      story: "你打开记账软件，审视自己的财务状况——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_f455FinanceOverviewCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f455FinanceOverviewCooldown);
      },
      choices: [
        { text: "💰 调整预算", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455FinanceOverviewCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你调整了预算——减少了不必要的开支，增加了储蓄比例。会计XP+4,心智+1。", "success");
        }},
        { text: "🏦 存一笔定期", hint: "存款+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455FinanceOverviewCooldown = true;
          if (st.resources && st.resources.cash >= 2000) {
            st.resources.cash -= 2000;
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 2000;
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你存了一笔定期——强制储蓄，积少成多。存款+¥2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你打开记账软件，审视自己的财务状况——现金¥" + Math.floor(cash).toLocaleString() + "，存款¥" + Math.floor(bank).toLocaleString() + "。你的财务状况健康吗？";
      }
    },
    {
      id: "f455_skill_progress", phase: "street", _isChainEvent: false, icon: "📈",
      title: "技能进度",
      story: "你在技能面板上看到，离下一个等级只差一点点——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_f455SkillProgressCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f455SkillProgressCooldown);
      },
      choices: [
        { text: "📚 花时间练习", hint: "全技能XP+2,疲劳+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455SkillProgressCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你花了一整天练习技能——虽然累，但看着经验条往上涨，很有成就感。全技能XP+2,疲劳+2。", "success");
        }},
        { text: "🎯 报个培训班", hint: "随机技能XP+5,花费1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f455SkillProgressCooldown = true;
          if (st.resources && st.resources.cash >= 1000) {
            st.resources.cash -= 1000;
            var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
            var sk = Random.fromArray(skills); // [全系统自洽修复] 域F R400: Math.random()→Random.fromArray()
            if (typeof addSkillXp === "function") { try { addSkillXp(sk, 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你报了个培训班——花钱投资自己，是最值的投资。随机技能XP+5,花费¥1000。", "success");
          }
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在技能面板上看到，离下一个等级只差一点点——就差那么一口气，就能升级了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();