/**
 * 域D(NPC/社交) 联动增强 R730b（本窗口自动化轮，b后缀避让并行R730在途）
 * 选题依据（好感奖励写-only flag 首消费闭环——本轮A类审计发现27个零读取奖励flag，
 * 数值承诺型5个已在 jobs.js/illness.js/actions_extra.js 直接兑现，本文件兑现3个"机会承诺型"）：
 *   D→E  d730b_chen_ge_intel      陈哥的内部消息 —— chenGeInfoAccess/chenGeExclusiveInfo/chenGeTrusted
 *        (npcs.js好感60/80/95奖励,写后全库零读取)首读：情报兑现为一笔真实的低买高卖现金机会。
 *        禀赋效应:玩家攒出来的人脉产生看得见的回报。
 *   D→G  d730b_wang_free_checkup  王医生的免费体检 —— wangFreeCheckup(好感80奖励,零读取)首读：
 *        兑现为 medical.healthCheckDone 健康基线(接入illness.js既有消费点→大病触发概率×0.5真实收益)。
 *        峰终定律:高好感的峰值时刻转化为长期机制性保护。
 *   D→E  d730b_zhaojie_renewal    赵姐的改造内幕 —— zhaojieUrbanRenewal(好感80奖励,承诺"避免被动
 *        涨租",零读取)首读：改造消息落地,租房玩家提前锁租省下一笔租金。损失厌恶:把"避免损失"做实。
 * 防御：全部 || 守卫；NPC引用一律 rel && rel.met(域D铁律)；好感走 applyAffinityChange；
 *       显名走 getNpcDisplayName；现金 st.resources.cash；幸福 st.needs.happiness；done-flag防重。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR730bLoaded) return;
  RANDOM_EVENTS._domainDLinkageR730bLoaded = true;

  function npcMet(st, nid) {
    if (!st || !st.relationships) return false;
    var rel = st.relationships[nid];
    return !!(rel && rel.met);
  }

  function npcName(nid, fallback) {
    if (typeof getNpcDisplayName === "function") {
      try { var n = getNpcDisplayName(nid); if (n) return n; } catch (e) {}
    }
    return fallback || "老朋友";
  }

  function addAffinity(st, nid, amt, reason) {
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, nid, amt, reason); } catch (e) {}
    }
  }

  function randInt(lo, hi) {
    if (typeof Random !== "undefined" && Random && typeof Random.int === "function") {
      return Random.int(lo, hi);
    }
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  var EVENTS = [
    // ============ 1. D→E 陈哥的内部消息（好感奖励兑现, street） ============
    {
      id: "d730b_chen_ge_intel", phase: "street", _isChainEvent: false, icon: "🕶️",
      title: "陈哥的内部消息",
      story: "巷口的陈哥朝你招了招手，压低声音说有个路子。",
      triggers: { minDay: 40, maxRepeats: 1, excludeFlags: ["_d730bChenGeIntel"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags) return false;
        if (st.flags._d730bChenGeIntel) return false;
        // 好感奖励flag任一到位（60内部消息/80独家情报/95自己人）才有这条线
        if (!st.flags.chenGeInfoAccess && !st.flags.chenGeExclusiveInfo && !st.flags.chenGeTrusted) return false;
        return npcMet(st, "chen_ge"); // 铁律: met检查
      },
      choices: [
        {
          text: "💰 按陈哥说的干一票", hint: "投入¥200,情报兑现为差价收益",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bChenGeIntel = true;
            st.resources = st.resources || {};
            var cash = st.resources.cash || 0;
            if (cash < 200) {
              StateManager.addMessage("🕶️ 你摸了摸口袋，连¥200本钱都凑不出。" + npcName("chen_ge", "陈哥") + "拍拍你的肩：「下次吧，机会还有。」", "info");
              return;
            }
            // 情报质量随好感奖励层级递进: 信息费已在好感线免除(chenGeTrusted承诺"情报免费+双倍收益")
            var mult = st.flags.chenGeTrusted ? 2.0 : (st.flags.chenGeExclusiveInfo ? 1.5 : 1.0);
            var gain = Math.floor(randInt(150, 300) * mult); // [PLACEHOLDER]基准150-300
            st.resources.cash = cash - 200 + 200 + gain;
            if (typeof st.needs === "object" && st.needs) {
              st.needs.happiness = Math.max(0, Math.min(100, (st.needs.happiness || 50) + 6));
            }
            addAffinity(st, "chen_ge", 3, "一起做成了一票");
            StateManager.addMessage("🕶️ " + npcName("chen_ge", "陈哥") + "的消息真准——低价囤的货当天就出手了，净赚¥" + gain + "！这些年攒下的交情，终于看见了真金白银。", "success");
          }
        },
        {
          text: "🙅 太悬了，不掺和", hint: "谨慎为上,不伤交情",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bChenGeIntel = true;
            StateManager.addMessage("🕶️ 你婉拒了。" + npcName("chen_ge", "陈哥") + "也不恼：「稳当点好，这行水深。」交情还在，机会没了。", "info");
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var trusted = st && st.flags && st.flags.chenGeTrusted;
        return npcName("chen_ge", "陈哥") + "说批发市场那边有批货信息差还没传开，本钱¥200就能跟一手。" + (trusted ? "「你是自己人，这单信息费全免，收益翻倍算你的。」" : "「消息我只告诉信得过的人。」");
      }
    },

    // ============ 2. D→G 王医生的免费体检（好感奖励兑现, street） ============
    {
      id: "d730b_wang_free_checkup", phase: "street", _isChainEvent: false, icon: "🩺",
      title: "王医生的免费体检",
      story: "王医生说过要给你做次免费体检，今天她特地留了个号。",
      triggers: { minDay: 30, maxRepeats: 1, excludeFlags: ["_d730bWangCheckup"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags.wangFreeCheckup) return false; // 好感80奖励写-only首读
        if (st.flags._d730bWangCheckup) return false;
        if (st.medical && st.medical.healthCheckDone) return false; // 已有健康基线则不重复
        return npcMet(st, "dr_wang"); // 铁律: met检查
      },
      choices: [
        {
          text: "🩺 去做体检", hint: "建立健康基线,大病触发概率减半",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bWangCheckup = true;
            st.medical = st.medical || {};
            st.medical.healthCheckDone = true; // 接入illness.js既有消费点(大病概率×0.5)
            st.medical.lastCheckupDay = (st.player && st.player.day) || 0;
            if (st.needs) st.needs.happiness = Math.max(0, Math.min(100, (st.needs.happiness || 50) + 5));
            addAffinity(st, "dr_wang", 2, "接受了她的关心");
            StateManager.addMessage("🩺 " + npcName("dr_wang", "王医生") + "从头到脚给你查了一遍：「整体还行，指标我都记档了，以后有大病征兆能早发现。」健康基线已建立，大病风险显著降低。", "success");
          }
        },
        {
          text: "⏳ 最近太忙，改天再说", hint: "错过这次免费机会",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bWangCheckup = true;
            StateManager.addMessage("🩺 你说改天再来。" + npcName("dr_wang", "王医生") + "叹了口气：「身体的事,别总是改天。」", "info");
          }
        }
      ],
      text: function (st) {
        return npcName("dr_wang", "王医生") + "在诊室门口叫住你：「上次说好的免费体检，今天正好有空位。全套检查，一分钱不收——就当是老朋友的心意。」";
      }
    },

    // ============ 3. D→E 赵姐的改造内幕（好感奖励兑现, street） ============
    {
      id: "d730b_zhaojie_renewal", phase: "street", _isChainEvent: false, icon: "🏗️",
      title: "赵姐的改造内幕",
      story: "中介赵姐发来消息：你住的片区要动了。",
      triggers: { minDay: 60, maxRepeats: 1, excludeFlags: ["_d730bZhaojieRenewal"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags.zhaojieUrbanRenewal) return false; // 好感80奖励写-only首读
        if (st.flags._d730bZhaojieRenewal) return false;
        if (!st.housing || !(st.housing.tier > 0)) return false; // 露宿者无租约,叙事不成立
        return npcMet(st, "zhaojie"); // 铁律: met检查
      },
      choices: [
        {
          text: "📝 听赵姐的，提前锁一年租约", hint: "花¥100手续费,锁租省下涨租差价",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bZhaojieRenewal = true;
            st.resources = st.resources || {};
            var cash = st.resources.cash || 0;
            if (cash < 100) {
              StateManager.addMessage("🏗️ 手续费¥100都拿不出，只能眼睁睁看着机会溜走。" + npcName("zhaojie", "赵姐") + "：「唉，手头宽裕点再找我。」", "info");
              return;
            }
            var saved = randInt(300, 600); // [PLACEHOLDER]锁租省下300-600
            st.resources.cash = cash - 100 + saved;
            if (st.needs) st.needs.happiness = Math.max(0, Math.min(100, (st.needs.happiness || 50) + 6));
            addAffinity(st, "zhaojie", 3, "听了她的内幕建议");
            StateManager.addMessage("🏗️ 改造消息公布后，周边租金应声上涨。多亏" + npcName("zhaojie", "赵姐") + "提前透风，你锁租省下了¥" + saved + "。人脉就是信息差。", "success");
          }
        },
        {
          text: "🤔 消息真假难辨，再看看", hint: "错过锁租窗口",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d730bZhaojieRenewal = true;
            StateManager.addMessage("🏗️ 你没当回事。半个月后改造公告贴出来，房东果然提了租——" + npcName("zhaojie", "赵姐") + "的消息，下次得认真听了。", "info");
          }
        }
      ],
      text: function (st) {
        return npcName("zhaojie", "赵姐") + "神秘兮兮地说：「你住那片列进改造名单了，消息还没公开。现在跟房东签长约锁住租金，等公告一出你就赚了。手续费我只收你¥100。」";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
