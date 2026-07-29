/**
 * 域G(核心机制/生命周期) 联动增强 R728 (sensenova-exp 第三轮循环)
 * 桥接：
 *   G→A  g728_health_lifespan 健康寿命追踪 → 消费 健康+年龄数据
 *   G→D  g728_age_social_efficiency 年龄社交效率 → 消费 年龄+关系数据
 *   G→C  g728_age_skill_curve 年龄技能效率 → 消费 年龄+技能数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR728Loaded) return;
  RANDOM_EVENTS._domainGLinkageR728Loaded = true;

  var EVENTS = [
    // ====== G→A 健康寿命追踪 ======
    {
      id: "g728_health_lifespan", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康寿命报告",
      // [全系统自洽修复] 域G R871 A类: story含{desc}占位符但无text()→补text()动态叙述
      story: "健康寿命报告",
      text: function (st) {
        var _age = (st.player && st.player.age) || 20;
        var _health = (st.status && st.status.health) || 100;
        return "你的身体会说话——" + _age + "岁的身体，健康值" + _health + "。每年给自己做一次全面评估，是对未来最好的投资。";
      },
      triggers: { minDay: 365, interval: 365, maxRepeats: 5, excludeFlags: ["_g728HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728HealthCd) return false;
        return st.player && st.player.day >= 365 && st.status && st.needs;
      },
      choices: [
        {
          text: "📋 查看健康寿命评估", hint: "心智+10, 健康意识+1",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _age = st.player && st.player.age || 20;
            var _health = (st.status && st.status.health) || 100;
            var _happiness = (st.needs && st.needs.happiness) || 50;
            // 记录健康寿命数据
            if (!st.flags._healthLifespanRecords) st.flags._healthLifespanRecords = [];
            st.flags._healthLifespanRecords.push({
              age: _age, day: st.player && st.player.day || 0, health: _health, happiness: _happiness
            });
            if (st.flags._healthLifespanRecords.length > 20) st.flags._healthLifespanRecords.shift();
            st.flags._g728HealthCd = true;
            st.flags._g728HealthChecked = true;
            // 根据健康水平给出反馈
            var _msg = "❤️ 健康寿命评估（" + _age + "岁）：健康值" + _health + "，心情" + _happiness + "。";
            if (_health >= 80) _msg += "身体状态良好，继续保持！";
            else if (_health >= 50) _msg += "健康状况一般，需要多关注身体。";
            else _msg += "健康亮红灯，请立即采取行动！";
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage(_msg, _health >= 80 ? "success" : _health >= 50 ? "info" : "danger");
            }
          }
        },
        {
          text: "💪 制定健康改善计划", hint: "心智+12, 体质+8, 置_g728HealthPlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728HealthCd = true;
            st.flags._g728HealthPlanner = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.physique = Math.min(100, (st.player.physique || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 '健康是一生的投资。' 心智+12, 体质+8。", "success");
            }
          }
        }
      ]
    },

    // ====== G→D 年龄社交效率 ======
    {
      id: "g728_age_social_efficiency", phase: "street", _isChainEvent: false, icon: "👥",
      title: "社交圈变迁",
      // [全系统自洽修复] 域G R871 A类: story含{desc}占位符但无text()→补text()动态叙述
      story: "社交圈变迁",
      text: function (st) {
        var _age = (st.player && st.player.age) || 20;
        var _metCount = 0;
        if (st.relationships) { for (var _rid in st.relationships) { var _rr = st.relationships[_rid]; if (_rr && _rr.met) _metCount++; } }
        return "不同年纪，交朋友的方式也不一样——你今年" + _age + "岁，已结识" + _metCount + "位朋友。年轻时靠热情，中年时靠价值，老年时靠真心。";
      },
      triggers: { minDay: 540, interval: 360, maxRepeats: 3, excludeFlags: ["_g728SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728SocialCd) return false;
        return st.player && st.player.day >= 540 && st.relationships;
      },
      choices: [
        {
          text: "🔄 重新审视社交圈", hint: "心智+8, 魅力+6, 置_g728SocialReflect",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _age = st.player && st.player.age || 20;
            st.flags._g728SocialCd = true;
            st.flags._g728SocialReflect = true;
            // 记录年龄社交效率标记（供D域消费）
            if (_age < 25) {
              st.flags._g728AgeSocialBonus = "young";
            } else if (_age < 40) {
              st.flags._g728AgeSocialBonus = "prime";
            } else {
              st.flags._g728AgeSocialBonus = "mature";
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 6);
            }
            if (typeof StateManager !== "undefined") {
              var _stageMsg = _age < 25 ? "年轻时朋友多，真心少。" : _age < 40 ? "人到壮年，社交变为资源交换。" : "年纪渐长，留下的都是真朋友。";
              StateManager.addMessage("👥 " + _stageMsg + " 心智+8, 魅力+6。", "info");
            }
          }
        },
        {
          text: "🤝 主动拓展人脉", hint: "魅力+12, 名气+5, 置_g728Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728SocialCd = true;
            st.flags._g728Networker = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '人脉不是认识多少人，是多少人认可你。' 魅力+12, 名气+5。", "success");
            }
          }
        }
      ]
    },

    // ====== G→C 年龄技能效率 ======
    {
      id: "g728_age_skill_curve", phase: "street", _isChainEvent: false, icon: "📈",
      title: "技能成长曲线",
      // [全系统自洽修复] 域G R871 A类: story含{desc}占位符但无text()→补text()动态叙述
      story: "技能成长曲线",
      text: function (st) {
        var _age = (st.player && st.player.age) || 20;
        var _topSkill = "";
        var _topLv = 0;
        if (st.skills) { for (var _sk in st.skills) { var _sl = st.skills[_sk]; if (_sl && (_sl.level || 0) > _topLv) { _topLv = _sl.level || 0; _topSkill = _sk; } } }
        return "不同年龄，学习效率大不相同——你今年" + _age + "岁，最高技能" + (_topSkill || "无") + "(Lv." + _topLv + ")。青年靠体力，中年靠经验，老年靠智慧。";
      },
      triggers: { minDay: 720, interval: 360, maxRepeats: 3, excludeFlags: ["_g728SkillCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._g728SkillCd) return false;
        return st.player && st.player.day >= 720 && st.skills;
      },
      choices: [
        {
          text: "📊 分析技能成长", hint: "智力+15, 心智+10, 置_g728SkillAnalyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            var _age = st.player && st.player.age || 20;
            st.flags._g728SkillCd = true;
            st.flags._g728SkillAnalyst = true;
            // 记录年龄技能效率标记（供C域消费）
            if (_age < 25) {
              st.flags._g728AgeSkillBonus = "learning";
            } else if (_age < 45) {
              st.flags._g728AgeSkillBonus = "working";
            } else {
              st.flags._g728AgeSkillBonus = "teaching";
            }
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              var _curveMsg = _age < 25 ? "年轻是学东西最快的年纪，别浪费。" : _age < 45 ? "壮年是把技能变现的黄金期。" : "经验是最好的老师，分享出去更有价值。";
              StateManager.addMessage("📈 " + _curveMsg + " 智力+15, 心智+10。", "info");
            }
          }
        },
        {
          text: "🎯 专注核心技能", hint: "智力+18, 专注+1, 置_g728SkillFocused",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g728SkillCd = true;
            st.flags._g728SkillFocused = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '一招鲜，吃遍天。' 智力+18。", "success");
            }
          }
        }
      ]
    }
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
