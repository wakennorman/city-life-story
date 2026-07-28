/**
 * 域C(职业/成长) 联动增强 R685b
 * 背景：本轮A类修复6处story占位符泄漏(career_dev/r243/r244/r245/r246 renderStory死接口→text())。
 * 联动3项(全部消费写-only/零事件消费素材)：
 *  1. c685b_legacy_anniversary  C→G  _legacyProjectDay 全库首消费——遗产项目一周年回望(时间戳深挖,生命周期叙事)
 *  2. c685b_trainer_milestone   C→E  _trainerIncomeTotal 事件层首消费——培训班累计收入里程碑(职业被动收入→经济决策)
 *  3. c685b_data_consult        C→E/D _skillDataAnalysis 全库首消费——数据分析能力变现(技能→现金/人脉)
 * 设计心理学：峰终定律(周年/里程碑锚点)、禀赋效应(自己攒出的培训班)、社会比较(能力被人看见)。
 * 防御：全||守卫,NPC须rel&&rel.met,好感走applyAffinityChange,done-flag防重。数值[PLACEHOLDER]已按同类事件量级校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._c685bLoaded) return;
  RANDOM_EVENTS._c685bLoaded = true;

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
      // 联动1 C→G: _legacyProjectDay 全库首消费——遗产项目一周年回望
      id: "c685b_legacy_anniversary",
      phase: "street",
      _isChainEvent: false,
      icon: "🗓️",
      title: "项目一周年",
      story: "日历提醒你：那个'改变行业的项目'启动整整一年了。",
      text: function (st) {
        try {
          if (st && st.flags && st.flags._legacyProjectDay) {
            var d = ((st.player && st.player.day) || 0) - st.flags._legacyProjectDay;
            return "日历弹出一条提醒：距离你接下那个'改变行业的项目'，已经过去" + d + "天了。无论结局如何，那个决定本身，已经成为你职业生涯里最重的一笔。你想起当时的忐忑、熬过的夜、扛过的压力——那些都变成了今天的你。";
          }
        } catch (e) { /* fallback */ }
        return "日历弹出一条提醒：距离你接下那个'改变行业的项目'，已经过去一年了。那个决定本身，已经成为你职业生涯里最重的一笔。";
      },
      triggers: { minDay: 400, maxRepeats: 1, excludeFlags: ["_c685bLegacyAnnivDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c685bLegacyAnnivDone) return false;
        if (!st.flags._legacyProjectDay) return false; // 须接过项目
        if (st.flags._careerLegacyDueDay) return false; // 项目须已结算(90天期已过)
        var day = (st.player && st.player.day) || 0;
        return day >= st.flags._legacyProjectDay + 365; // 启动满一周年
      },
      choices: [
        {
          text: "🍷 给自己倒一杯，敬那个决定",
          hint: "心智+5，心情+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bLegacyAnnivDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍷 你举杯敬了敬一年前那个敢拍板的自己。成败之外，敢选择本身就是成长。心智+5，心情+4。", "success");
          },
        },
        {
          text: "📝 把这一年的复盘写下来",
          hint: "管理XP+8，智力+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bLegacyAnnivDone = true;
            st.flags._legacyRetroWritten = true; // 沉淀素材：复盘笔记(供后续域B/F消费)
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); // [PLACEHOLDER]
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) { /* safe */ } } // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📝 你把项目一整年的得失写成了复盘笔记。经验只有沉淀下来才是资产。管理XP+8，智力+2。", "success");
          },
        },
      ],
    },
    {
      // 联动2 C→E: _trainerIncomeTotal 事件层首消费——培训班累计收入里程碑
      id: "c685b_trainer_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🏫",
      title: "培训班的第一桶金",
      story: "算了算培训班的账，累计收入已经很可观了。",
      text: function (st) {
        try {
          if (st && st.flags && st.flags._trainerIncomeTotal) {
            return "晚上盘账，你发现培训班的累计学费收入已经有¥" + st.flags._trainerIncomeTotal + "。从当初咬牙掏出前期投入，到现在稳定的现金流——这门'教人手艺'的生意，是你用职业积累一点点攒出来的。接下来这笔钱怎么用？";
          }
        } catch (e) { /* fallback */ }
        return "晚上盘账，你发现培训班的累计学费收入已经相当可观。这门'教人手艺'的生意，是你用职业积累一点点攒出来的。接下来这笔钱怎么用？";
      },
      triggers: { minDay: 60, maxRepeats: 1, excludeFlags: ["_c685bTrainerMilestoneDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c685bTrainerMilestoneDone) return false;
        if (!st.flags._skillMasterTrainer) return false; // 须已开班
        return (st.flags._trainerIncomeTotal || 0) >= 5000; // [PLACEHOLDER] 累计收入里程碑
      },
      choices: [
        {
          text: "📣 拿出一部分打广告，扩大口碑",
          hint: "花费¥1500，置口碑flag，名气+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bTrainerMilestoneDone = true;
            var cost = Math.min(1500, (st.resources && st.resources.cash) || 0); // [PLACEHOLDER] 防负数
            if (st.resources) st.resources.cash = (st.resources.cash || 0) - cost;
            st.flags._trainerReputation = true; // 沉淀素材：培训班口碑(供后续扩班/域D消费)
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📣 你花¥" + cost + "在本地生活号投了软文，培训班的口碑传开了。名气+5。", "success");
          },
        },
        {
          text: "🏦 稳妥起见，转进银行存起来",
          hint: "现金¥2000转存款，心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bTrainerMilestoneDone = true;
            var amt = Math.min(2000, (st.resources && st.resources.cash) || 0); // [PLACEHOLDER] 防负数
            if (st.resources) {
              st.resources.cash = (st.resources.cash || 0) - amt;
              st.resources.bankBalance = (st.resources.bankBalance || 0) + amt;
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏦 你把¥" + amt + "转进了银行。细水长流，稳字当头。心智+3。", "info");
          },
        },
      ],
    },
    {
      // 联动3 C→E/D: _skillDataAnalysis 全库首消费——数据分析能力变现
      id: "c685b_data_consult",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "有人为你的分析买单",
      story: "你做数据分析的事被人知道了，有人想付费咨询。",
      text: function (st) {
        return "你之前用专业技能做市场数据分析的事，不知怎么在圈子里传开了。一个做小生意的老板辗转找到你：'听说你会看数据？帮我看看我这店的账，该不该换品类——我付咨询费。'";
      },
      triggers: { minDay: 90, maxRepeats: 1, excludeFlags: ["_c685bDataConsultDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._c685bDataConsultDone) return false;
        return !!st.flags._skillDataAnalysis; // 须做过深度数据分析(r675)
      },
      choices: [
        {
          text: "💰 接单，认真做份分析报告",
          hint: "现金+800，会计XP+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bDataConsultDone = true;
            st.flags._dataConsultant = true; // 沉淀素材：数据咨询副业(供后续域E/H消费)
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800; // [PLACEHOLDER]
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch (e) { /* safe */ } } // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你熬了一晚做出分析报告，老板看完直拍大腿。咨询费¥800到手——原来技能真的能变现。会计XP+10。", "success");
          },
        },
        {
          text: "🤝 免费帮忙，交个朋友",
          hint: "结识的熟人好感+4，心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c685bDataConsultDone = true;
            var npcId = firstMetNpc(st); // 铁律：met检查
            if (npcId && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npcId, 4, "免费数据咨询"); } catch (e) { /* safe */ } // [PLACEHOLDER]
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤝 你没收钱，只说'交个朋友'。" + (npcId ? npcCn(npcId) + "听说后也对你刮目相看。" : "这份人情，日后总会有回响。") + "心情+3。", "success");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
