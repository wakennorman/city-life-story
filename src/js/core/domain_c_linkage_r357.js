/**
 * 域C(职业/成长) 联动增强 R357
 * 第十三轮循环——技能积累的多维回响。
 * 桥接：
 *   C→E  career_investment_mastery    职业→投资洞察（经济·技能变现）
 *   C→G  career_health_awakening      职业→健康觉醒（核心机制·身心平衡）
 *   C→D  career_mentorship_legacy     职业→师徒传承（NPC/社交·技能传递）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR357Loaded) return;
  RANDOM_EVENTS._domainCLinkageR357Loaded = true;

  // 获取角色总技能等级之和
  function totalSkillLevels(st) {
    if (!st || !st.skills) return 0;
    var sum = 0;
    for (var k in st.skills) {
      if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
        sum += (st.skills[k].level || 0);
      }
    }
    return sum;
  }

  // 获取最高技能等级
  function maxSkillLevel(st) {
    if (!st || !st.skills) return 0;
    var maxLv = 0;
    for (var k in st.skills) {
      if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
        maxLv = Math.max(maxLv, st.skills[k].level || 0);
      }
    }
    return maxLv;
  }

  var EVENTS = [
    {
      // C→E: 职业技能→投资洞察（经济·技能变现）
      // 当玩家的综合技能等级达到阈值时，解锁投资洞察
      id: "career_investment_mastery",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "技能就是投资眼光",
      story: "你坐在电脑前，看着股票行情。以前你只觉得这些数字是随机的涨跌，但现在——在经历了多年的职业磨练后——你开始看出一些门道。\n\n会计技能让你看懂财报，管理经验让你判断公司战略，销售直觉让你感知市场情绪……那些你以为是工作技能的东西，其实都是投资的底层能力。\n\n「原来，我一直在为这一天积累。」",
      triggers: { minDay: 120, excludeFlags: ["_careerInvestmentMasterySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 总技能等级 ≥ 30 且至少有1个技能 ≥ 8 级
        if (totalSkillLevels(st) < 30) return false;
        if (maxSkillLevel(st) < 8) return false;
        // 需要有一定的投资经验（至少买过股票/基金）
        if (!st.flags || !st.flags._hasInvested) return false;
        return true;
      },
      choices: [
        {
          text: "📈 用技能分析市场，精准投资",
          hint: "投资回报+20%(持续7天)，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvestmentMasterySeen = true;
            // 设置投资洞察flag（供经济域读取）
            st.flags._investmentInsightActive = true;
            st.flags._investmentInsightDay = st.player ? st.player.day : 0;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你运用多年的职业技能分析市场，找到了被低估的标的。投资回报+20%持续7天。心智+6。", "success");
            }
          },
        },
        {
          text: "📚 继续学习，再等等",
          hint: "心智+4，稳扎稳打",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerInvestmentMasterySeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你决定再学习一段时间再出手。知识和耐心都是投资的一部分。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // C→G: 职业倦怠→健康觉醒（核心机制·身心平衡）
      // 当玩家职业工作时间长但健康/心情低下时触发
      id: "career_health_awakening",
      phase: "street",
      _isChainEvent: false,
      icon: "🏥",
      title: "身体的警告",
      story: "今天早上你醒来的时候，发现自己的手在发抖。\n\n不是第一次了。最近几个月，你总是头痛、失眠、胃不舒服。你一直以为是工作太忙，扛过去就好。\n\n但今天，你看着镜子里自己苍白的脸，突然意识到——你一直在透支未来的健康，来支付现在的账单。\n\n「不能再这样下去了。」你对自己说。",
      triggers: { minDay: 90, excludeFlags: ["_careerHealthAwakeningSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有一份工作且工作时间足够长
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        if ((job.workDays || 0) < 120) return false;
        // 健康 < 50 或 心情 < 40
        var lowHealth = (st.status && st.status.health || 100) < 50;
        var lowMood = (st.needs && st.needs.happiness || 50) < 40;
        return lowHealth || lowMood;
      },
      choices: [
        {
          text: "🏥 去医院做全面检查，调整作息",
          hint: "健康+15，心情+10，疲劳-10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthAwakeningSeen = true;
            if (st.status) {
              st.status.health = Math.min(100, (st.status.health || 50) + 15);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏥 医生说你来得及时。你开始调整作息，感觉身体在慢慢恢复。健康+15，心情+10，疲劳-10。", "success");
            }
          },
        },
        {
          text: "💊 买点药，继续扛",
          hint: "心智+3，但治标不治本",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerHealthAwakeningSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💊 你买了点药，告诉自己扛过去就好了。但你知道，有些账迟早要还。心智+3。", "warning");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // C→D: 职业成就→师徒传承（NPC/社交·技能传递）
      // 当玩家在某个职业达到高成就时，可以指导相关NPC
      id: "career_mentorship_legacy",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "薪火相传",
      story: "一个年轻人拦住你，有些腼腆地问：「听说您在「+ (function(){try{var cp=window.StateManager&&StateManager.getState();if(cp&&cp.career&&cp.career.currentJob)return cp.career.currentJob.title||'这一行';return'这一行'}catch(e){return'这一行'}})() +」做了很久？能不能教教我？」\n\n你看着对方热切的眼神，想起了多年前的自己——也是这样满怀期待地踏入这个行业，跌跌撞撞走到今天。\n\n「也许，把经验传下去，也是一种成就。」",
      triggers: { minDay: 60, excludeFlags: ["_careerMentorshipLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        // 至少工作 200 天，且最高技能等级 ≥ 7
        if ((job.workDays || 0) < 200) return false;
        if (maxSkillLevel(st) < 7) return false;
        // 需要有至少一个已结识的NPC
        if (!st.relationships) return false;
        var hasMet = false;
        for (var id in st.relationships) {
          if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
            if (st.relationships[id] && st.relationships[id].met) {
              hasMet = true;
              break;
            }
          }
        }
        return hasMet;
      },
      choices: [
        {
          text: "🎓 收下这个徒弟，传授经验",
          hint: "心智+5，心情+8，NPC好感+5，flag师徒传承",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerMentorshipLegacySeen = true;
            st.flags._hasApprentice = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            // 找第一个已结识NPC提升好感
            if (st.relationships) {
              for (var id in st.relationships) {
                if (Object.prototype.hasOwnProperty.call(st.relationships, id) && st.relationships[id] && st.relationships[id].met) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, id, 5, "师徒传承");
                  } else {
                    st.relationships[id].affinity = (st.relationships[id].affinity || 0) + 5;
                  }
                  break;
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎓 你收下了这个徒弟。把经验传下去的感觉，比想象中更充实。心智+5，心情+8。", "success");
            }
          },
        },
        {
          text: "📝 推荐几本书，让他自学",
          hint: "心智+3，授人以渔",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerMentorshipLegacySeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你推荐了几本入门书。有些路，终究要自己走一遍。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();