/**
 * 域G(核心机制/生命周期) 联动增强 R247
 * 背景：场景开局链死flag消费——scenario_start_chains.js写入15个剧本flag，其中R296已消费3个(_hasToolkit/_interviewPassed/_firstJobFound)，
 *   仍有12个全库零消费者：_restaurantConnection/_sleptRoughThreeDays/_triedStall/_stickToNewPath/_tookLanguageClass/_stickToFactory/
 *   _familyFundUsed/_marketResearchDone/_startupDirection/_consultedLawyer/_decidedToStartup/_familyBudgetDone。
 *   玩家开局选择无后果是严重叙事断裂。本轮首次为全部剩余死flag补充消费路径。
 *
 * 桥接：
 *   G→B  scenario_flag_echo           回味那些选择 → 首消费9个剧本死flag→叙事回响，心智+心情
 *   G→D  startup_direction_story      创业方向→人生故事  → 首消费_startupDirection + _consultedLawyer → NPC分享
 *   G→A  market_knowledge_gain         市场知识        → 首消费 _marketResearchDone + _familyFundUsed → accounting XP
 *
 * 严格照 domain_g_linkage_r296.js 已验证范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR247Loaded) return;
  RANDOM_EVENTS._domainGLinkageR247Loaded = true;

  // 取首个已结识NPC id（守met铁律）
  function firstMetNpcR247(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 统计已消费的剧本flag数量
  function countScenarioFlags(st) {
    if (!st || !st.flags) return 0;
    var keys = [
      "_restaurantConnection", "_sleptRoughThreeDays", "_hasToolkit",
      "_triedStall", "_stickToNewPath", "_interviewPassed",
      "_firstJobFound", "_tookLanguageClass", "_stickToFactory",
      "_familyFundUsed", "_marketResearchDone", "_startupDirection",
      "_consultedLawyer", "_decidedToStartup", "_familyBudgetDone"
    ];
    var count = 0;
    for (var i = 0; i < keys.length; i++) {
      if (st.flags[keys[i]]) count++;
    }
    return count;
  }

  // 获取已消费flag名称列表
  function getConsumedFlagNames(st) {
    if (!st || !st.flags) return [];
    var map = {
      _restaurantConnection: "餐厅人脉", _sleptRoughThreeDays: "睡过三天街头",
      _hasToolkit: "随身工具箱", _triedStall: "出摊卖货",
      _stickToNewPath: "另辟蹊径", _interviewPassed: "面试通过",
      _firstJobFound: "找到第一份工", _tookLanguageClass: "学外语",
      _stickToFactory: "坚守工厂", _familyFundUsed: "动用家庭基金",
      _marketResearchDone: "做市场调研", _startupDirection: "确定创业方向",
      _consultedLawyer: "咨询律师", _decidedToStartup: "决定创业",
      _familyBudgetDone: "家庭记账"
    };
    var names = [];
    for (var key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key) && st.flags[key]) {
        names.push(map[key]);
      }
    }
    return names;
  }

  var EVENTS = [
    {
      // G→B: 回味那些选择 — 首次消费9个剧本死flag的叙事回声
      id: "scenario_flag_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "🔙",
      title: "那些选择，都算数",
      // [全系统自洽修复] 域G R871 A类: story含{flagCount}/{flagsList}占位符但无text()→占位符被剥离致乱码,补text()动态叙述
      story: "那些选择，都算数",
      text: function (st) {
        var consumed = getConsumedFlagNames(st);
        var flagStr = consumed.slice(0, 5).join("、");
        return "今天整理旧物，翻出了你刚来这座城市时做过的一些事。" + consumed.length + "件。那些当时觉得只是随便选选的决定——" + (flagStr || "那些过往") + "——原来都在悄悄改变你的路。";
      },
      triggers: { minDay: 90, excludeFlags: ["_scenarioEchoSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var consumed = getConsumedFlagNames(st);
        return consumed.length >= 3; // 至少消费了3个flag才触发
      },
      choices: [
        {
          text: "📝 这些选择让我成了现在的我",
          hint: "心智+5，心情+4,置 _lifeChoicesAcknowledged",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._scenarioEchoSeen = true;
            st.flags._lifeChoicesAcknowledged = true; // 供后续事件消费
            var consumed = getConsumedFlagNames(st);
            var flagStr = consumed.slice(0, 5).join("、");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "📝 你已经走过了" + consumed.length + "条路：" + flagStr + "……每一个选择都不是白费的。心智+5，心情+4。",
                "success"
              );
          }
        },
        {
          text: "😅 过去了就过去了",
          hint: "平静回望，心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._scenarioEchoSeen = true;
            st.flags._lifeChoicesAcknowledged = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😅 你笑了笑就过去了——日子嘛，总是在往前走。心智+3。", "info");
          }
        }
      ]
    },
    {
      // G→D: 创业方向人生故事 — 首消费 _startupDirection + _consultedLawyer
      id: "startup_direction_story",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "创业的那段日子",
      // [全系统自洽修复] 域G R871 A类: story含{dir}占位符但无text()→占位符被剥离致乱码,补text()动态叙述
      story: "创业的那段日子",
      text: function (st) {
        var dir = (st.flags && st.flags._startupDirection) ? st.flags._startupDirection : "创业";
        return "你想起自己当初" + dir + "的方向，还咨询过律师。现在想起来，那条路虽然没走完，但每一步都让你多了些见识。";
      },
      triggers: { minDay: 60, excludeFlags: ["_startupStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags) return false;
        // 需要 _decidedToStartup(true) + (_startupDirection有值 或 _consultedLawyer有值)
        var decided = st.flags._decidedToStartup === true;
        var hasDir = st.flags._startupDirection && typeof st.flags._startupDirection === "string";
        var hasLawyer = st.flags._consultedLawyer === true;
        return !!(decided && (hasDir || hasLawyer));
      },
      choices: [
        {
          text: "🤝 跟朋友聊聊这段经历",
          hint: "NPC好感+5，心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._startupStorySeen = true;
            // 获取创业方向
            var dir = "";
            if (st.flags && st.flags._startupDirection === "tech") dir = "科技创业";
            else if (st.flags && st.flags._startupDirection === "consumer") dir = "消费品";
            else if (st.flags && st.flags._startupDirection === "finance") dir = "金融投资";
            else dir = "做生意";

            if (typeof applyAffinityChange === "function") {
              var npcId = firstMetNpcR247(st);
              if (npcId) {
                try { applyAffinityChange(st, npcId, 5, "创业经历分享"); } catch(e) { /* safe */ }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🤝 你跟朋友聊起当年想" + dir + "的往事——那段日子虽然没成，但学到的东西都用上了。",
                "good"
              );
          }
        },
        {
          text: "💪 下次再试试",
          hint: "置 _entrepreneurialRetry flag",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._startupStorySeen = true;
            st.flags._entrepreneurialRetry = true; // 供H域创业系统消费
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💪 创业虽未成功，但经验宝贵——下次一定能行！", "success");
          }
        }
      ]
    },
    {
      // G→A: 市场知识获取 — 首消费 _marketResearchDone + _familyFundUsed
      id: "market_knowledge_gain",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "市场的门道",
      story:
        "你做过的市场调研和家庭资金规划，让你在城里混得更明白了。这些看似琐碎的学问，其实都是真金白银换来的经验。",
      triggers: { minDay: 60, excludeFlags: ["_marketKnowledgeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags) return false;
        // 需要 _marketResearchDone(true) 或 _familyFundUsed(true)
        return !!(st.flags._marketResearchDone || st.flags._familyFundUsed);
      },
      choices: [
        {
          text: "📚 把经验写成笔记",
          hint: "会计技能XP+8，置 _marketNotesCreated",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._marketKnowledgeSeen = true;
            st.flags._marketNotesCreated = true; // 供A域价格预警消费
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 8); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📚 你把这些年的市场经验写成了笔记。会计+8。", "good");
          }
        },
        {
          text: "🧠 记在心里就够了",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._marketKnowledgeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🧠 你的市场直觉更敏锐了。心智+2。", "info");
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
