/**
 * 域C(职业/成长) 联动增强 R707
 * 桥接：
 *   C→A  c707_skill_market_value      技能市场价值 → 消费 state.player+state.skills,
 *     职业等级提升后获得对商品价格的洞察力
 *   C→D  c707_career_colleague_circle  同事圈层 → 消费 state.career+state.relationships,
 *     职业晋升带来新的社交圈和人际机会
 *   C→G  c707_career_burnout_reflect   职业倦怠反思 → 消费 state.player+state.needs,
 *     长期高压工作触发健康和生活反思
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR707Loaded) return;
  RANDOM_EVENTS._domainCLinkageR707Loaded = true;

  function getJobLevel(st) {
    if (!st || !st.career || !st.career.currentJob) return 0;
    return st.career.currentJob.level || 0;
  }

  function getCareerPath(st) {
    if (!st || !st.career || !st.career.currentJob) return null;
    return st.career.currentJob.path || null;
  }

  function getWorkDays(st) {
    return (st.career && st.career.currentJob && st.career.currentJob.workDays) || 0;
  }

  var EVENTS = [
    // === C→A 技能市场价值：职业洞察影响价格感知 ===
    {
      id: "c707_skill_market_value",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "职业眼光的价值",
      story: "你在职业上积累的经验，让你对市场上的价格有了新的认识——同样的商品，在不同场景下价值截然不同。",
      triggers: { minDay: 60, interval: 120, maxRepeats: 2, excludeFlags: ["_c707MarketCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c707MarketCd) return false;
        return getJobLevel(st) >= 2 && getWorkDays(st) >= 60 && st.player && st.player.day >= 60;
      },
      choices: [
        {
          text: "🧠 运用职业知识分析市场",
          hint: "智力+4,置_c707MarketInsight,交易收益+10%",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707MarketCd = true;
            st.flags._c707MarketInsight = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 你的职业经验让你对市场有了敏锐洞察。智力+4。", "success");
            }
          }
        },
        {
          text: "💰 利用人脉打听折扣渠道",
          hint: "社交XP+6,获得采购折扣",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707MarketCd = true;
            st.flags._c707DiscountChannel = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 你通过职业圈打听到了折扣渠道，以后买东西能省一点了。社交XP+6。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "工作" + getWorkDays(st) + "天后的你，已经不再是那个对价格一无所知的新人了。";
      }
    },
    // === C→D 同事圈层：职业晋升带来社交机会 ===
    {
      id: "c707_career_colleague_circle",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "圈子在扩大",
      story: "随着你在职业上的成长，越来越多的同行开始注意到你。今天的行业交流会上，好几个人主动过来交换联系方式。",
      triggers: { minDay: 90, interval: 150, maxRepeats: 2, excludeFlags: ["_c707NetworkCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c707NetworkCd) return false;
        return getJobLevel(st) >= 3 && getWorkDays(st) >= 90 && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "📇 主动加微信，拓展人脉圈",
          hint: "社交XP+8,魅力+3,置_c707WellConnected",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707NetworkCd = true;
            st.flags._c707WellConnected = true;
            if (st.player) {
              st.player.charisma = Math.min(100, (st.player.charisma || 50) + 3);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            }
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 8); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📇 你的职业人脉圈又扩大了！魅力+3，名声+5，社交XP+8。", "success");
            }
          }
        },
        {
          text: "🤔 先观察，不急着社交",
          hint: "智力+2,置_c707Observant",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707NetworkCd = true;
            st.flags._c707Observant = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤔 你选择先观察，默默记下了几个关键人物的名字。智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "等级" + getJobLevel(st) + "的职业身份，让你在行业里有了更多话语权。";
      }
    },
    // === C→G 职业倦怠反思：高压工作影响健康 ===
    {
      id: "c707_career_burnout_reflect",
      phase: "street",
      _isChainEvent: false,
      icon: "😰",
      title: "高压下的警醒",
      story: "连续多日的高强度工作，今天你突然感到一阵眩晕。同事关切地问你脸色很差，要不要早点回去休息。",
      triggers: { minDay: 120, interval: 180, maxRepeats: 1, excludeFlags: ["_c707BurnoutCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._c707BurnoutCd) return false;
        // 工作超过120天+级别3+以上触发
        return getJobLevel(st) >= 3 && getWorkDays(st) >= 120 && st.player && st.player.day >= 120;
      },
      choices: [
        {
          text: "🏥 请假去检查身体",
          hint: "健康+8,疲劳-15,心情+5,置_c707HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707BurnoutCd = true;
            st.flags._c707HealthFirst = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏥 检查结果显示你只是过度劳累，休息几天就好。健康+8，疲劳-15。", "success");
            }
          }
        },
        {
          text: "💪 咬牙坚持，项目不能停",
          hint: "心智+3,但健康-5,疲劳+10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c707BurnoutCd = true;
            st.flags._c707ToughItOut = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
            }
            if (st.status) st.status.health = Math.max(0, (st.status.health || 100) - 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你咬牙坚持了下来。心智+3，但健康-5，疲劳+10。", "warning");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "工作" + getWorkDays(st) + "天，等级" + getJobLevel(st) + "——你的身体在提醒你：该歇歇了。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();