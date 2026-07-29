/**
 * 域D(NPC/社交) 联动增强 R782 (sensenova-exp 第三轮循环)
 * 桥接：
 *   D→A  d782_social_capital_value 社交资本价值 → 消费 关系+好感数据
 *   D→E  d782_social_invest_network 社交投资圈 → 消费 关系+投资数据
 *   D→G  d782_social_health_boost 社交健康增益 → 消费 关系+健康数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR782Loaded) return;
  RANDOM_EVENTS._domainDLinkageR782Loaded = true;

  var EVENTS = [
    // ====== D→A 社交资本价值 ======
    {
      id: "d782_social_capital_value", phase: "street", _isChainEvent: false, icon: "💎",
      title: "社交资本价值",
      story: "你的人脉网络正在增值——{desc}",
      triggers: { minDay: 420, interval: 600, maxRepeats: 3, excludeFlags: ["_d782SocialCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d782SocialCd) return false;
        return st.player && st.player.day >= 420 && st.relationships;
      },
      choices: [
        {
          text: "📊 评估人脉价值", hint: "智力+12, 魅力+8, 置_d782CapitalValuer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782SocialCd = true;
            st.flags._d782CapitalValuer = true;
            // 计算社交资本数据供A域消费
            var _highAffCount = 0, _totalAff = 0, _npcCount = 0;
            if (st.relationships) {
              for (var _rk in st.relationships) {
                var _r = st.relationships[_rk];
                if (_r && _r.met) {
                  _npcCount++;
                  _totalAff += _r.affinity || 0;
                  if ((_r.affinity || 0) >= 60) _highAffCount++;
                }
              }
            }
            st.flags._d782SocialCapitalScore = _highAffCount;
            st.flags._d782SocialNetworkSize = _npcCount;
            st.flags._d782AvgAffinity = _npcCount > 0 ? Math.round(_totalAff / _npcCount) : 0;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💎 '你的人脉价值：好友" + _highAffCount + "人，平均好感" + st.flags._d782AvgAffinity + "。' 智力+12, 魅力+8。", "info");
            }
          }
        },
        {
          text: "🎯 拓展高质量人脉", hint: "魅力+15, 心智+8, 置_d782CapitalBuilder",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782SocialCd = true;
            st.flags._d782CapitalBuilder = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '人脉的质量比数量更重要。' 魅力+15, 心智+8。", "success");
            }
          }
        }
      ]
    },

    // ====== D→E 社交投资圈 ======
    {
      id: "d782_social_invest_network", phase: "street", _isChainEvent: false, icon: "🏦",
      title: "社交投资圈",
      story: "你的朋友圈里藏着投资机会——{desc}",
      triggers: { minDay: 560, interval: 600, maxRepeats: 3, excludeFlags: ["_d782InvestCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d782InvestCd) return false;
        return st.player && st.player.day >= 560 && st.relationships && st.investment;
      },
      choices: [
        {
          text: "💬 打听投资消息", hint: "智力+12, 魅力+10, 置_d782InvestTipster",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782InvestCd = true;
            st.flags._d782InvestTipster = true;
            // 记录投资社交圈数据供E域消费
            var _wealthyContacts = 0;
            if (st.relationships) {
              for (var _rk in st.relationships) {
                if ((st.relationships[_rk].affinity || 0) >= 70) _wealthyContacts++;
              }
            }
            st.flags._d782InvestSocialCircle = _wealthyContacts;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💬 " + (_wealthyContacts >= 3 ? "你的朋友圈里有不少懂投资的人。' 智力+12, 魅力+10。" : "多交点朋友，投资信息自然来。' 智力+12, 魅力+10。"), "info");
            }
          }
        },
        {
          text: "📈 跟朋友学投资", hint: "智力+15, 会计XP+12, 置_d782InvestLearner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782InvestCd = true;
            st.flags._d782InvestLearner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '跟对人，比什么都重要。' 智力+15, 会计XP+12。", "success");
            }
          }
        }
      ]
    },

    // ====== D→G 社交健康增益 ======
    {
      id: "d782_social_health_boost", phase: "street", _isChainEvent: false, icon: "💚",
      title: "社交健康增益",
      story: "朋友是最好的良药——{desc}",
      triggers: { minDay: 340, interval: 500, maxRepeats: 4, excludeFlags: ["_d782HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._d782HealthCd) return false;
        return st.player && st.player.day >= 340 && st.relationships && st.status && st.needs;
      },
      choices: [
        {
          text: "👫 和朋友聚会", hint: "心情+15, 健康+5, 置_d782SocialGatherer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782HealthCd = true;
            st.flags._d782SocialGatherer = true;
            // 记录社交健康数据供G域消费
            var _friendCount = 0;
            if (st.relationships) {
              for (var _rk in st.relationships) {
                if ((st.relationships[_rk].affinity || 0) >= 50) _friendCount++;
              }
            }
            st.flags._d782SocialHealthFriends = _friendCount;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👫 和朋友在一起，烦恼都忘了。心情+15, 健康+5。", "success");
            }
          }
        },
        {
          text: "☎️ 给老朋友打电话", hint: "心情+12, 心智+8, 置_d782SocialCaller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d782HealthCd = true;
            st.flags._d782SocialCaller = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("☎️ '有些朋友，不联系不代表忘记。' 心情+12, 心智+8。", "info");
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