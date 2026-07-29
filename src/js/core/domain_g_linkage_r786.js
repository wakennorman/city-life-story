/**
 * 域G(核心机制/生命周期) 联动增强 R786 (sensenova-exp 第三轮循环)
 * 桥接：
 *   G→H  g786_life_stage_corp 生命阶段公司协同 → 消费 年龄+公司数据
 *   G→E  g786_life_wealth_milestone 人生财富里程碑 → 消费 年龄+资产数据
 *   G→C  g786_age_skill_rebalance 年龄技能再平衡 → 消费 年龄+技能数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR786Loaded) return;
  RANDOM_EVENTS._domainGLinkageR786Loaded = true;

  var EVENTS = [
    // ====== G→H 生命阶段公司协同 ======
    {
      id: "g786_life_stage_corp", phase: "corporate", _isChainEvent: false, icon: "🏢",
      title: "生命阶段与公司",
      story: "不同年纪，做公司的思路也不一样——{desc}",
      triggers: { minDay: 680, interval: 700, maxRepeats: 3, excludeFlags: ["_g786CorpCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g786CorpCd) return false;
        return st.player && st.player.day >= 680 && st.startup && st.startup.active;
      },
      choices: [
        {
          text: "📊 评估年龄与公司匹配度", hint: "智力+12, 管理XP+15, 置_g786CorpMatcher",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786CorpCd = true;
            st.flags._g786CorpMatcher = true;
            var _age = st.player && st.player.age || 20;
            // 记录生命阶段公司协同数据供H域消费
            if (_age < 25) st.flags._g786LifeStageCorp = "youth"; // 年轻创业: 高风险高回报
            else if (_age < 40) st.flags._g786LifeStageCorp = "prime"; // 壮年创业: 稳健扩张
            else st.flags._g786LifeStageCorp = "mature"; // 中年创业: 经验优势
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              var _msg = _age < 25 ? "🏢 年轻就是资本，敢闯敢拼。" : _age < 40 ? "🏢 壮年创业，经验和精力兼备。" : "🏢 经验是最好的护城河。";
              StateManager.addMessage(_msg + " 智力+12, 管理XP+15。", "info");
            }
          }
        },
        {
          text: "🎯 制定年龄适配策略", hint: "心智+15, 管理XP+12, 置_g786CorpStrategist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786CorpCd = true;
            st.flags._g786CorpStrategist = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '知天命，尽人事。' 心智+15, 管理XP+12。", "success");
            }
          }
        }
      ]
    },

    // ====== G→E 人生财富里程碑 ======
    {
      id: "g786_life_wealth_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "人生财富里程碑",
      story: "人生过半，财富几何？——{desc}",
      triggers: { minDay: 460, interval: 600, maxRepeats: 3, excludeFlags: ["_g786WealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g786WealthCd) return false;
        return st.player && st.player.day >= 460 && st.resources;
      },
      choices: [
        {
          text: "💰 审视财富状况", hint: "智力+12, 心智+10, 置_g786WealthReviewer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786WealthCd = true;
            st.flags._g786WealthReviewer = true;
            var _age = st.player && st.player.age || 20;
            var _cash = (st.resources && st.resources.cash) || 0;
            var _bank = (st.resources && st.resources.bankBalance) || 0;
            var _totalAssets = _cash + _bank;
            // 按年龄评估财富水平
            var _wealthLevel = "low";
            if (_age >= 40 && _totalAssets >= 500000) _wealthLevel = "high";
            else if (_age >= 30 && _totalAssets >= 200000) _wealthLevel = "mid";
            else if (_totalAssets >= 100000) _wealthLevel = "mid";
            st.flags._g786WealthLevel = _wealthLevel;
            st.flags._g786TotalAssets = _totalAssets;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              var _msg = "💰 " + _age + "岁，总资产¥" + _totalAssets + "。";
              if (_wealthLevel === "high") _msg += "财富自由可期！";
              else if (_wealthLevel === "mid") _msg += "中产水平，继续努力。";
              else _msg += "还需积累，加油！";
              StateManager.addMessage(_msg + " 智力+12, 心智+10。", _wealthLevel === "high" ? "success" : _wealthLevel === "mid" ? "info" : "warning");
            }
          }
        },
        {
          text: "🎯 设定财富目标", hint: "心智+15, 会计XP+10, 置_g786WealthGoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786WealthCd = true;
            st.flags._g786WealthGoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标的人生，不会迷路。' 心智+15, 会计XP+10。", "success");
            }
          }
        }
      ]
    },

    // ====== G→C 年龄技能再平衡 ======
    {
      id: "g786_age_skill_rebalance", phase: "street", _isChainEvent: false, icon: "🔄",
      title: "技能再平衡",
      story: "年龄不是学习的障碍——{desc}",
      triggers: { minDay: 580, interval: 600, maxRepeats: 3, excludeFlags: ["_g786SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g786SkillCd) return false;
        return st.player && st.player.day >= 580 && st.skills;
      },
      choices: [
        {
          text: "📊 评估技能结构", hint: "智力+15, 心智+8, 置_g786SkillEvaluator",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786SkillCd = true;
            st.flags._g786SkillEvaluator = true;
            var _age = st.player && st.player.age || 20;
            // 统计技能分布
            var _skillCount = 0, _totalLevel = 0, _maxLevel = 0;
            if (st.skills) {
              for (var _sk in st.skills) {
                var _lv = st.skills[_sk] && st.skills[_sk].level || 0;
                if (_lv > 0) { _skillCount++; _totalLevel += _lv; }
                if (_lv > _maxLevel) _maxLevel = _lv;
              }
            }
            var _avgLevel = _skillCount > 0 ? Math.round(_totalLevel / _skillCount) : 0;
            st.flags._g786SkillCount = _skillCount;
            st.flags._g786AvgSkillLevel = _avgLevel;
            st.flags._g786MaxSkillLevel = _maxLevel;
            // 按年龄给出技能策略建议
            if (_age < 25) st.flags._g786SkillStrategy = "broad"; // 青年: 广撒网
            else if (_age < 45) st.flags._g786SkillStrategy = "deep"; // 壮年: 深耕耘
            else st.flags._g786SkillStrategy = "teach"; // 中年: 传帮带
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 " + _skillCount + "项技能，平均" + _avgLevel + "级。最高" + _maxLevel + "级。智力+15, 心智+8。", "info");
            }
          }
        },
        {
          text: "📚 学习新技能", hint: "智力+18, 置_g786SkillLearner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g786SkillCd = true;
            st.flags._g786SkillLearner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📚 '活到老，学到老。' 智力+18。", "success");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();