/**
 * 域G(核心机制/生命周期) 联动增强 R746b
 * 桥接：
 *   G→E  g746b_pension_planning 养老金理财规划 → _pensionTotal(R746b A类#1新增)首个事件层读取
 *   G→B  g746b_life_narrative_echo 年龄叙事深夜回响 → _lifeNarrative_XX(R746b A类#2复活)首个事件层读取,峰终定律
 *   G→C  g746b_node_choice_legacy 人生选择的复利 → _lifeNode_choice 首个跨文件读取(此前life_nodes自写自读)
 * 设计: 峰终定律(退休回望/深夜回响) + 禀赋效应(养老金是"自己挣来的") + 社会比较(同龄人叙事)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR746bLoaded) return;
  RANDOM_EVENTS._domainGLinkageR746bLoaded = true;

  var EVENTS = [
    {
      // [全系统自洽修复] 域G R746b 联动1 G→E: _pensionTotal 首读——退休后的钱怎么打理
      id: "g746b_pension_planning", phase: "street", _isChainEvent: false, icon: "🏖️",
      title: "养老金的去处",
      story: "退休后的第一笔积蓄躺在账上——{desc}",
      triggers: { minDay: 380, interval: 60, maxRepeats: 1, excludeFlags: ["_g746bPensionCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._g746bPensionCd) return false;
        if (!st.flags._retired) return false;
        return (st.flags._pensionTotal || 0) >= 3000; // [PLACEHOLDER] 至少领过一期养老金
      },
      choices: [
        {
          text: "🏦 稳字当头，存进银行", hint: "养老金转入存款,心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bPensionCd = true;
            st.flags._g746bPensionStyle = "safe";
            var moved = Math.min((st.resources && st.resources.cash) || 0, 3000); // [PLACEHOLDER]
            if (st.resources && moved > 0) {
              st.resources.cash -= moved;
              st.resources.bankBalance = (st.resources.bankBalance || 0) + moved;
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏦 '这个岁数，本金安全比收益率重要。' 转存¥" + moved.toLocaleString() + "，心智+5。", "info");
            }
          }
        },
        {
          text: "🎁 请老朋友们吃顿饭", hint: "花¥500,幸福+12",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bPensionCd = true;
            st.flags._g746bPensionStyle = "share";
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎁 一桌老友，半生故事。'钱是挣不完的，人是聚一次少一次。' 幸福+12。", "success");
            }
          }
        }
      ],
      text: function (st) {
        var total = (st && st.flags && st.flags._pensionTotal) || 0;
        return "账上已累计领到 ¥" + total.toLocaleString() + " 养老金——这是你工作半生挣来的底气。它该去哪？";
      }
    },
    {
      // [全系统自洽修复] 域G R746b 联动2 G→B: _lifeNarrative_XX 首读——年龄叙事的深夜回响(峰终定律)
      id: "g746b_life_narrative_echo", phase: "street", _isChainEvent: false, icon: "🌙",
      title: "深夜的年龄刻度",
      story: "夜深了，白天那句关于年龄的感慨又浮上心头——{desc}",
      triggers: { minDay: 365, interval: 200, maxRepeats: 2, excludeFlags: ["_g746bEchoCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._g746bEchoCd) return false;
        var f = st.flags;
        return !!(f._lifeNarrative_30 || f._lifeNarrative_35 || f._lifeNarrative_40 || f._lifeNarrative_50);
      },
      choices: [
        {
          text: "📔 写下这一页", hint: "心智+8,置_g746bDiarist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bEchoCd = true;
            st.flags._g746bDiarist = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📔 你把这个年纪的心事写进日记。'记下来的，才算真正活过。' 心智+8。", "info");
            }
          }
        },
        {
          text: "😴 睡吧，明天还要生活", hint: "疲劳-10",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bEchoCd = true;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 30) - 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 想再多不如睡个好觉。疲劳-10。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var f = (st && st.flags) || {};
        if (f._lifeNarrative_50) return "五十岁那天的话还在耳边——那些过不去的坎，真的都成了故事。";
        if (f._lifeNarrative_40) return "四十岁的体检单和二十岁的体检单，说的已经不是同一个身体。";
        if (f._lifeNarrative_35) return "三十五岁这道线，别人拿它筛人，你拿它筛掉不重要的事。";
        return "三十而立那晚你想了很久：立的到底是什么？现在似乎有点答案了。";
      }
    },
    {
      // [全系统自洽修复] 域G R746b 联动3 G→C: _lifeNode_choice 首个跨文件读取——人生选择的职业复利
      id: "g746b_node_choice_legacy", phase: "street", _isChainEvent: false, icon: "🧭",
      title: "选择的复利",
      story: "回头看，当年那个人生节点的选择正在悄悄影响今天——{desc}",
      triggers: { minDay: 200, interval: 300, maxRepeats: 1, excludeFlags: ["_g746bLegacyCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || st.flags._g746bLegacyCd) return false;
        return !!st.flags._lifeNode_choice; // 做过任一人生节点选择
      },
      choices: [
        {
          text: "🧭 沿着当年的方向再走一步", hint: "管理技能经验+60",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bLegacyCd = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 60); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🧭 '人生的复利，来自在同一个方向上持续下注。' 管理经验+60。", "success");
            }
          }
        },
        {
          text: "🔍 复盘当年的岔路", hint: "智力+5,心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g746bLegacyCd = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔍 '没选的那条路不必遗憾——你只能活出一种人生，把它活好。' 智力+5,心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        var c = (st && st.flags && st.flags._lifeNode_choice) || "";
        if (c.indexOf("gaokao") === 0) return "高考那年的决定，塑造了你进入社会的姿势。";
        if (c.indexOf("c35") === 0) return "35岁那次抉择之后，你对'稳定'和'冒险'有了自己的定义。";
        if (c.indexOf("retire") === 0) return "退休方式的选择，决定了你如何与后半生相处。";
        return "每一个节点上的选择，都在为今天的你投票。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
