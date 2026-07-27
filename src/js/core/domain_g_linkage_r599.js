/**
 * 域G(核心机制/生命周期) 联动增强 R599
 * 选题：域G 生命周期三大零消费 flag 全部打通首事件消费
 *   G→D  g599_shadow_behind    首消费 _everDepressed(needs.js:228 写入·全库零读取)
 *     —— 走出情绪低谷的人向老朋友坦诚，脆弱换来更深的联结（峰终定律：低谷后的回响）
 *   G→C  g599_survivor_lesson  首消费 _everHadIllness(illness.js:150 写入"疾病幸存者"·全库零读取)
 *     —— 病愈后的健康觉醒，学急救与养护知识（损失厌恶：失而复得的健康最被珍视）
 *   G→E  g599_chronic_ledger   首消费 _chronicMonthlyPaid(illness.js:411/420 仅域内月付记账)
 *     —— 慢性病月度账单倒逼记账与财务规划（禀赋效应：为守住现金流而学会算账）
 * 全 || 防御；引用 NPC 严守 rel&&rel.met + applyAffinityChange 铁律；数值 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR599Loaded) return;
  RANDOM_EVENTS._domainGLinkageR599Loaded = true;

  // 遍历找首个已结识 NPC（xiaoli/auntie_lin/master_zhao 仍 TODO，不硬编码 id）
  function firstMetNpcG599(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  function bumpAffinityG599(st, npcId, change, reason) {
    try {
      if (typeof applyAffinityChange === "function") {
        applyAffinityChange(st, npcId, change, reason);
        return true;
      }
    } catch (e) {}
    return false;
  }

  var EVENTS = [
    {
      id: "g599_shadow_behind", phase: "street", _isChainEvent: false, icon: "🌦️",
      title: "走过低谷的人",
      story: "整理旧物时翻到那段最灰暗日子里写的备忘录，你已经很久没有那种窒息感了——{desc}",
      triggers: { minDay: 60, interval: 999, maxRepeats: 1, excludeFlags: ["_g599ShadowDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._everDepressed) return false; // 首消费：曾经历情绪低谷
        if (st.flags._g599ShadowDone) return false;
        var mental = (st.player && st.player.mental) || 0;
        return mental >= 40 && !!firstMetNpcG599(st); // 已缓过来 + 有可倾诉之人
      },
      choices: [
        {
          text: "🗣️ 约老朋友坐坐，聊聊那段日子",
          hint: "好感+6，心情+4",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599ShadowDone = true;
            var nid = firstMetNpcG599(st);
            var bumped = nid ? bumpAffinityG599(st, nid, 6, "你坦诚分享了走出低谷的经历") : false; // [PLACEHOLDER] 好感+6
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER] 心情+4
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                bumped
                  ? "🌦️ '那阵子……真的很难。' 说出口的那一刻，你们之间的什么东西变得更结实了。好感+6，心情+4。"
                  : "🌦️ 你把那段日子讲给自己听，像给旧伤换了次药。心情+4。",
                "success"
              );
          },
        },
        {
          text: "📓 写下来，留给未来的自己",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599ShadowDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER] 心智+5
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📓 你把低谷写成了一页复盘：情绪不是敌人，是信号。心智+5。", "success");
          },
        },
      ],
      text: function (st) {
        return "你想起最难的那段时间——一个人扛，还是讲出来？";
      },
    },
    {
      id: "g599_survivor_lesson", phase: "street", _isChainEvent: false, icon: "🩺",
      title: "病愈之后",
      story: "大病一场好起来之后，你看健康的眼神都不一样了——{desc}",
      triggers: { minDay: 45, interval: 999, maxRepeats: 1, excludeFlags: ["_g599SurvivorDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._everHadIllness) return false; // 首消费：疾病幸存者
        if (st.flags._g599SurvivorDone) return false;
        var ills = (st.status && st.status.illnesses) || st.illnesses || [];
        return !ills.length || ills.length === 0; // 当前无病在身（病愈后的觉醒时刻）
      },
      choices: [
        {
          text: "📖 报名社区急救与养护课",
          hint: "医疗XP+8，健康+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599SurvivorDone = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("medicine", 8); } catch (e) {} } // [PLACEHOLDER] 医疗XP+8
            if (st.status) st.status.health = Math.min(100, (st.status.health || 60) + 2); // [PLACEHOLDER] 健康+2
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🩺 心肺复苏、伤口处理、常用药禁忌……病过一次的人学得格外认真。医疗XP+8，健康+2。", "success");
          },
        },
        {
          text: "🏃 从今天起规律作息",
          hint: "心智+4，心情+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599SurvivorDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER] 心智+4
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER] 心情+3
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏃 早睡、喝水、按时吃饭——最朴素的养生，是病床上想明白的。心智+4，心情+3。", "success");
          },
        },
      ],
      text: function (st) {
        return "捡回来的健康，要怎么守住？";
      },
    },
    {
      id: "g599_chronic_ledger", phase: "street", _isChainEvent: false, icon: "🧾",
      title: "药费账本",
      story: "每月固定的那笔医药开销，逼着你把收支摊开来算——{desc}",
      triggers: { minDay: 90, interval: 999, maxRepeats: 1, excludeFlags: ["_g599ChronicLedgerDone"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._chronicMonthlyPaid) return false; // 首消费：慢性病月付发生过
        if (st.flags._g599ChronicLedgerDone) return false;
        return ((st.resources && st.resources.cash) || 0) >= 300; // 还有余力做规划
      },
      choices: [
        {
          text: "🧾 建一本医疗支出台账",
          hint: "会计XP+6，心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599ChronicLedgerDone = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} } // [PLACEHOLDER] 会计XP+6
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER] 心智+3
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🧾 药费、复诊、交通……分列记清后，你第一次对'长期开销'有了掌控感。会计XP+6，心智+3。", "success");
          },
        },
        {
          text: "💰 设立医疗应急金",
          hint: "现金-500，理财意识觉醒",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g599ChronicLedgerDone = true;
            if (st.resources && (st.resources.cash || 0) >= 500) {
              st.resources.cash -= 500; // [PLACEHOLDER] 划拨应急金500
              if (st.resources.bankBalance !== undefined) st.resources.bankBalance = (st.resources.bankBalance || 0) + 500;
            }
            st.flags._dataInvestorMindset = true; // 复用既有理财意识 flag（多事件消费者）
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💰 你把一笔钱单独存作医疗应急金——'生病不该是财务崩盘的理由。' 理财意识觉醒。", "success");
          },
        },
      ],
      text: function (st) {
        return "长期账单不可怕，可怕的是从没算过。";
      },
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
