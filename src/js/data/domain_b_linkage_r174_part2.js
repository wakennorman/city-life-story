/**
 * 域B联动增强 Part 2：破产清算仪式 + 重生启程
 * [全系统自洽修复] 域B R174: startup盈亏首次被事件叙事化
 */
(function () {
  "use strict";
  if (typeof window === "undefined") return;

  // ===== 破产清算仪式 =====
  var bankruptcy_ceremony = {
    id: "bankruptcy_ceremony",
    title: "公司最后一天",
    phase: "corporate",
    repeatable: true,
    priority: 95,
    conditions: function (st) {
      if (!st || !st.startup) return false;
      if (st.startup.active) return false;
      var exitPhase = st.startup.company && st.startup.company.exitPhase;
      if (!exitPhase) return false;
      var day = st.player.day || 0;
      if (day < 180) return false;
      var lastCeremony = st.flags && st.flags._lastBankruptcyCeremonyDay ? st.flags._lastBankruptcyCeremonyDay : 0;
      if (lastCeremony > 0 && (day - lastCeremony) < 365) return false;
      return true;
    },
    probability: 0.08,
    getStory: function (st) {
      var name = st.startup.company ? (st.startup.company.name || "你的公司") : "你的公司";
      var days = st.player.day || 0;
      return "今天是" + name + "挂牌的最后一天。你站在空荡荡的办公室里，\n桌面已经搬空了。从第" + days + "天开始创业到今天，不是一条平坦的路。\n\n电脑还在桌上，屏幕亮着最后的财务报表——你深吸了一口气。";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      var today = st.player.day || 0;
      if (st.flags) st.flags._lastBankruptcyCeremonyDay = today;
      if (choiceId === "review") {
        st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
        st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        st.flags._bankruptcyLessonsLearned = true;
        st.flags._justBankrupt = true;
        StateManager.addMessage("整理文档，复盘经验教训。intelligence+8, mental+5。", "success");
      } else if (choiceId === "drink") {
        st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
        st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
        var rels = st.relationships || {};
        for (var k in rels) {
          if (rels[k] && rels[k].met && rels[k].affinity !== undefined) {
            rels[k].affinity = Math.min(100, (rels[k].affinity || 0) + 3);
          }
        }
        StateManager.addMessage("请留下的同事吃最后一顿饭。fame+3, happiness+5。", "hint");
      } else {
        st.player.happiness = Math.max(0, (st.player.happiness || 50) - 10);
        st.flags._abandonedCompany = true;
        StateManager.addMessage("什么都不带，直接离开。一切归零。", "warning");
      }
      if (typeof scheduleChainEvent === "function") {
        scheduleChainEvent(st, "bankruptcy_rebirth_chapter", 30, "corporate");
      }
    },
    choices: [
      { text: "整理文档，复盘经验教训", id: "review" },
      { text: "请留下的同事吃最后一顿饭", id: "drink" },
      { text: "什么都不带，直接离开", id: "walk_away_empty" },
    ],
    icons: ["公司", "下行"],
  };

  // ===== 重生启程 --- 链式回访 =====
  var bankruptcy_rebirth_chapter = {
    id: "bankruptcy_rebirth_chapter",
    title: "公交车上的广告牌",
    phase: "corporate",
    repeatable: false,
    priority: 85,
    _isChainEvent: true,
    chainId: "rebirth_chapter",
    conditions: function (st) {
      if (!st || !st.flags) return false;
      var lessons = st.flags._bankruptcyLessonsLearned || false;
      var justBankrupt = st.flags._justBankrupt || false;
      if (!lessons && !justBankrupt) return false;
      if (st.flags._rebirthAttempted) return false;
      var lastBanckery = st.flags._lastBankruptcyCeremonyDay ? st.flags._lastBankruptcyCeremonyDay : 0;
      if (lastBanckery <= 0) return false;
      return (st.player.day - lastBanckery) >= 30;
    },
    probability: 0.4,
    getStory: function (st) {
      return "三十天了。今天你在公交车上看到一个广告牌——\n\n每个成功的人，都曾在某条街上迷失过方向。\n\n窗外的城市倒退着流动，你在想：下一次，该往哪开？";
    },
    getText: function (st) { return this.getStory(st); },
    apply: function (st, choiceId) {
      if (!st) return;
      if (choiceId === "retry") {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 10);
        st.player.ability = Math.min(100, (st.player.ability || 50) + 3);
        st.flags._startupRenewed = true;
        st.flags._rebirthAttempted = true;
        if (st.startup) {
          st.startup.active = false;
          st.startup.company = null;
        }
        StateManager.addMessage("再试一次！这次你知道该怎么做了。", "success");
      } else if (choiceId === "find_job") {
        st.player.happiness = Math.min(100, (st.player.happiness || 50) + 5);
        st.flags._rebirthAttempted = true;
        StateManager.addMessage("先找份工作稳定下来。不是逃避——是蓄力。", "hint");
      } else {
        st.player.happiness = Math.max(0, (st.player.happiness || 50) - 8);
        st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
        st.flags._quitEntrepreneurship = true;
        st.flags._rebirthAttempted = true;
        st.flags._enterCorporateReady = true;
        StateManager.addMessage("也许你不适合创业。这不是软弱——有时候承认不适合也是一种勇气。", "warning");
      }
    },
    choices: [
      { text: "再试一次！这次我知道该怎么做了", id: "retry" },
      { text: "先找份工作稳定下来", id: "find_job" },
      { text: "也许我不适合创业", id: "give_up" },
    ],
    icons: ["日出", "公交车"],
  };

  // ===== IIFE注入 =====
  if (typeof RANDOM_EVENTS !== "undefined") {
    RANDOM_EVENTS.push(bankruptcy_ceremony, bankruptcy_rebirth_chapter);
  }
})();
