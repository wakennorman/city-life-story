/**
 * 域C(职业/成长) 联动增强 R792b
 * 背景：本轮A类修复4处职业里程碑承诺零兑现(_constructionForeman人脉/_deliveryStationManager站长薪资/
 *       _contentPlatformSigned月保底/_mcnEmployee月薪→daily_pipeline月度兑现)。
 * 联动3项(全部消费本轮深审确认的写-only/零事件消费素材)：
 *  1. c792b_foreman_gratitude    C→D  _constructionForeman 事件层首消费——带过的新工回来道谢(人脉回报闭环,峰终定律)
 *  2. c792b_content_salary_check C→E  _contentSalaryTotal 全库首读——签约收入累计破2万→理财意识觉醒(职业收入→经济决策)
 *  3. c792b_station_pressure     C→G  _deliveryStationManager 事件层首消费——管理20个骑手的成长与代价(晋升的双面性)
 * 设计心理学：峰终定律(被感谢的瞬间)、禀赋效应(自己攒出的签约收入)、损失厌恶(管理压力的取舍)。
 * 防御：全||守卫,NPC须rel&&rel.met,好感走applyAffinityChange四参,getNpcDisplayName兜底,done-flag防重,显式phase:"street"。
 * 数值[PLACEHOLDER]已按同类事件量级校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._c792bLoaded) return;
  RANDOM_EVENTS._c792bLoaded = true;

  // 铁律：NPC引用须met检查——遍历首个已结识NPC
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  function npcCn(id) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(id); if (n) return n; } catch (e) { /* fallback */ }
    }
    return "一位老熟人";
  }

  var EVENTS = [
    {
      // 联动1 C→D: _constructionForeman 事件层首消费——带过的新工回来道谢
      id: "c792b_foreman_gratitude",
      phase: "street",
      _isChainEvent: false,
      icon: "🧤",
      title: "新工的道谢",
      story: "一个你在工地带过的新工找到你，手里拎着两瓶酒。",
      text: function (st) {
        try {
          if (st && st.flags && st.flags._constructionForeman) {
            return "路口有人喊你。回头一看，是当初你在工地带过的那个新工——他现在也带徒弟了。他把两瓶酒塞到你手里：「师傅，当年要不是你教我怎么留孔怎么加固，我早就被工地劝退了。这杯我敬你。」你忽然明白，老李那双手套传下来的东西，不止是活计。";
          }
        } catch (e) { /* fallback */ }
        return "一个你在工地带过的新工找到你道谢，说当年多亏你带他入行。";
      },
      triggers: { minDay: 60, maxRepeats: 1, excludeFlags: ["_c792bForemanThanksDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c792bForemanThanksDone) return false;
        if (!st.flags._constructionForeman) return false; // 须当过工地小头目
        var day = (st.player && st.player.day) || 0;
        return day >= 60;
      },
      choices: [
        {
          text: "🍺 收下酒，跟他喝一顿",
          hint: "心情+8，心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bForemanThanksDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8); // [PLACEHOLDER]
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍺 你们蹲在路边喝到天黑。他说的每一句'谢谢师傅'，都是你职业生涯里最实在的回报。心情+8，心智+3。", "success");
          },
        },
        {
          text: "🤝 把他介绍进自己的人脉圈",
          hint: "社交XP+20，结识的熟人好感+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bForemanThanksDone = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 20); } catch (e) { /* safe */ } } // [PLACEHOLDER]
            var npcId = firstMetNpc(st); // 铁律：met检查
            if (npcId && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npcId, 3, "工地人脉互相引荐"); } catch (e) { /* safe */ } // [PLACEHOLDER]
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤝 你把他拉进了自己的圈子。" + (npcId ? npcCn(npcId) + "也夸你带出来的人靠谱。" : "人脉就是这样一环扣一环攒起来的。") + "社交XP+20。", "success");
          },
        },
      ],
    },
    {
      // 联动2 C→E: _contentSalaryTotal 全库首读——签约收入累计破2万→理财意识觉醒
      id: "c792b_content_salary_check",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "签约收入的账本",
      story: "你翻了翻账本：签约以来的稳定收入，已经悄悄攒下了一笔。",
      text: function (st) {
        try {
          if (st && st.flags && st.flags._contentSalaryTotal) {
            var t = st.flags._contentSalaryTotal;
            return "深夜写完稿，你顺手翻了翻账本——签约以来的月度收入，累计已经有 ¥" + (isFinite(t) ? t.toLocaleString() : "20,000") + " 了。当初纠结要不要签的那个晚上还历历在目，如今这笔稳定的现金流，成了你敢继续写下去的底气。也许，该想想怎么让这笔钱生钱了。";
          }
        } catch (e) { /* fallback */ }
        return "你翻了翻账本，签约以来的稳定收入已经攒下了一笔。也许该想想怎么让钱生钱了。";
      },
      triggers: { minDay: 90, maxRepeats: 1, excludeFlags: ["_c792bSalaryCheckDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c792bSalaryCheckDone) return false;
        var t = st.flags._contentSalaryTotal;
        if (!t || !isFinite(t)) return false; // 须有签约收入(本轮A类修复的月度兑现产物)
        return t >= 20000; // 累计破2万 [PLACEHOLDER]
      },
      choices: [
        {
          text: "🏦 转一半进银行，强制储蓄",
          hint: "现金→存款，心智+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bSalaryCheckDone = true;
            if (st.resources) {
              var cash = st.resources.cash || 0;
              var move = Math.floor(cash / 2);
              if (isFinite(move) && move > 0) {
                st.resources.cash = cash - move;
                st.resources.bankBalance = (st.resources.bankBalance || 0) + move;
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏦 你把一半现金转进了银行。写字的人也要懂钱——稳定收入+强制储蓄，才是抗风险的组合。心智+4。", "success");
          },
        },
        {
          text: "📚 花¥500报个理财课",
          hint: "会计XP+25，为投资打底",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bSalaryCheckDone = true;
            if (st.resources && (st.resources.cash || 0) >= 500) {
              st.resources.cash -= 500; // [PLACEHOLDER]
              if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 25); } catch (e) { /* safe */ } } // [PLACEHOLDER]
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage("📚 你报了理财入门课。搞懂复利那一刻，你意识到稿费只是起点。会计XP+25。", "success");
            } else {
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage("💸 现金不足¥500，课先收藏了。知识不会跑，钱得先攒。", "warning");
            }
          },
        },
      ],
    },
    {
      // 联动3 C→G: _deliveryStationManager 事件层首消费——管理20个骑手的成长与代价
      id: "c792b_station_pressure",
      phase: "street",
      _isChainEvent: false,
      icon: "🛵",
      title: "站长的深夜",
      story: "站里两个骑手吵起来了，一个说单被抢了，一个说系统派的。都在等你裁决。",
      text: "晚上十点，站里两个骑手吵得不可开交——一个咬定好单被同事截了，另一个说是系统派单。二十双眼睛看着你。当骑手的时候，你只要对路况负责；当了站长，你要对人心负责。这就是那¥5500底薪背后真正的价码。",
      triggers: { minDay: 30, maxRepeats: 1, excludeFlags: ["_c792bStationPressureDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c792bStationPressureDone) return false;
        if (!st.flags._deliveryStationManager) return false; // 须当过骑手站长
        return true;
      },
      choices: [
        {
          text: "⚖️ 调出后台记录，公开裁决",
          hint: "管理XP+30，疲劳+8",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bStationPressureDone = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 30); } catch (e) { /* safe */ } } // [PLACEHOLDER]
            if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("⚖️ 你当着所有人调出派单记录，一条条对——系统派的。吵架的两人握手言和，站里从此服你。管理XP+30，疲劳+8。管人比送单累，但你在长本事。", "success");
          },
        },
        {
          text: "🍜 先带他俩去吃宵夜，缓一缓",
          hint: "心情+5，社交XP+15",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c792bStationPressureDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5); // [PLACEHOLDER]
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 15); } catch (e) { /* safe */ } } // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍜 三碗牛肉面下肚，火气全消。他俩不好意思地互相递了根烟。有时候管理不是讲道理，是给台阶。心情+5，社交XP+15。", "success");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
