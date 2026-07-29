/**
 * 域C(职业/成长) 联动增强 R779 (sensenova-exp 第三轮循环)
 * 桥接：
 *   C→D  c779_career_social_network 职场人脉深化 → 消费 职业+关系数据
 *   C→E  c779_skill_investment 技能变现投资 → 消费 技能+投资数据
 *   C→G  c779_career_workload_health 职业负荷健康 → 消费 职业+健康数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR779Loaded) return;
  RANDOM_EVENTS._domainCLinkageR779Loaded = true;

  var EVENTS = [
    // ====== C→D 职场人脉深化 ======
    {
      id: "c779_career_social_network", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "职场人脉网络",
      story: "你的职业经历正在织一张关系网——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_c779SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c779SocialCd) return false;
        return st.player && st.player.day >= 500 && st.player.job;
      },
      choices: [
        {
          text: "📇 整理职场人脉", hint: "魅力+12, 心智+8, 置_c779Networker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779SocialCd = true;
            st.flags._c779Networker = true;
            // 记录职场人脉数据供D域消费
            var _jobTitle = st.player.job || "unknown";
            st.flags._c779LastJobNetwork = _jobTitle;
            if (!st.flags._careerSocialNetworks) st.flags._careerSocialNetworks = [];
            st.flags._careerSocialNetworks.push({
              day: st.player && st.player.day || 0,
              job: _jobTitle
            });
            if (st.flags._careerSocialNetworks.length > 10) st.flags._careerSocialNetworks.shift();
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 '职场人脉是隐形的晋升阶梯。' 魅力+12, 心智+8。", "info");
            }
          }
        },
        {
          text: "💼 参加行业交流", hint: "魅力+15, 管理XP+10, 置_c779IndustryMeet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779SocialCd = true;
            st.flags._c779IndustryMeet = true;
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 '行业交流是最好的学习方式。' 魅力+15, 管理XP+10。", "success");
            }
          }
        }
      ]
    },

    // ====== C→E 技能变现投资 ======
    {
      id: "c779_skill_investment", phase: "street", _isChainEvent: false, icon: "💰",
      title: "技能变现投资",
      story: "你的技能可以变成钱——{desc}",
      triggers: { minDay: 620, interval: 600, maxRepeats: 3, excludeFlags: ["_c779SkillInvestCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c779SkillInvestCd) return false;
        return st.player && st.player.day >= 620 && st.skills;
      },
      choices: [
        {
          text: "📊 评估技能价值", hint: "智力+15, 会计XP+15, 置_c779SkillValuer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779SkillInvestCd = true;
            st.flags._c779SkillValuer = true;
            // 计算技能估值供E域消费
            var _topSkill = 0, _topSkillName = "none";
            if (st.skills) {
              for (var _sk in st.skills) {
                var _lv = st.skills[_sk] && st.skills[_sk].level || 0;
                if (_lv > _topSkill) { _topSkill = _lv; _topSkillName = _sk; }
              }
            }
            st.flags._c779TopSkillValue = _topSkill;
            st.flags._c779TopSkillName = _topSkillName;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '你的技能值多少钱？' 智力+15, 会计XP+15。", "info");
            }
          }
        },
        {
          text: "💡 寻找变现渠道", hint: "智力+18, 置_c779SkillMonetizer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779SkillInvestCd = true;
            st.flags._c779SkillMonetizer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '把技能变成收入，是成年人最体面的活法。' 智力+18。", "success");
            }
          }
        }
      ]
    },

    // ====== C→G 职业负荷健康 ======
    {
      id: "c779_career_workload_health", phase: "street", _isChainEvent: false, icon: "⚕️",
      title: "职业负荷健康",
      story: "工作不是全部，身体才是本钱——{desc}",
      triggers: { minDay: 740, interval: 600, maxRepeats: 3, excludeFlags: ["_c779HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._c779HealthCd) return false;
        return st.player && st.player.day >= 740 && st.player.job && st.status && st.needs;
      },
      choices: [
        {
          text: "🏥 做职业健康检查", hint: "健康+12, 心智+10, 置_c779HealthChecked",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779HealthCd = true;
            st.flags._c779HealthChecked = true;
            // 记录职业健康数据供G域消费
            var _fatigue = (st.needs && st.needs.fatigue) || 0;
            st.flags._c779LastWorkFatigue = _fatigue;
            if (_fatigue > 70) {
              st.flags._c779HighFatigueWarning = true;
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              var _msg = _fatigue > 70 ? "⚕️ 疲劳值偏高(" + _fatigue + ")，建议休息！" : "⚕️ 身体状况良好。";
              StateManager.addMessage(_msg + " 健康+12, 心智+10。", _fatigue > 70 ? "warning" : "success");
            }
          }
        },
        {
          text: "🧘 调整工作节奏", hint: "疲劳-20, 心情+10, 置_c779PaceSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c779HealthCd = true;
            st.flags._c779PaceSetter = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧘 '工作重要，但命更重要。' 疲劳-20, 心情+10。", "success");
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