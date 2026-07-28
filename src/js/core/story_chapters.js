/**
 * 主线章节系统 — 3 章式人生主线
 *
 * 设计参考：Stardew Valley 祖父评价信（Year 3 检查点）
 *           《大多数》阶段递进（街头→立足→选择）
 *           This War of Mine 叙事检查点
 *           BitLife 人生阶段分类
 *
 * 核心理念：开放沙盒游戏缺少"方向感"。本系统在关键时间节点
 * 设置叙事检查点，回顾玩家当前的人生状态，给出方向指引和
 * 阶段性评价，但不强制改变游戏玩法——纯叙事层增强。
 *
 * 三章结构（按天数推进）：
 *   第一章「生存」(第30天) — 你在这座城市活下来了吗？
 *   第二章「立足」(第180天) — 你找到自己的位置了吗？
 *   第三章「选择」(第365天) — 你要过什么样的人生？
 *
 * 每章检查点：
 *   - 弹出不可跳过的叙事弹窗
 *   - 展示当前人生状态摘要
 *   - 给出基于玩家行为的"人生方向"提示
 *   - 记录 chapter flag 供后续叙事引用
 *   - 第三章给出 4 条结局路线预览（创业/体制/出国/躺平）
 */

// ====== 章节定义 ======

var STORY_CHAPTERS = [
  {
    id: "chapter1_survival",
    title: "第一章 · 生存",
    triggerDay: 30,
    flag: "_ch1Done",
    icon: "🏕️",
    intro: "三十天了。你站在城中村的街角，看着人来人往。",
    epilogues: [
      {
        id: "survive_debt",
        condition: function (st) {
          return (st.resources.villageDebt || 0) > 3000;
        },
        text: "村长的债还压在心头。这座城市不会等你，利滚利的数字每天都在涨。",
        hint: "先想办法还债，别让它拖垮你。",
      },
      {
        id: "survive_broke",
        condition: function (st) {
          return (
            (st.resources.cash || 0) < 200 &&
            (st.resources.villageDebt || 0) < 1000
          );
        },
        text: "兜里没几个钱了，但你总算在这座城市站稳了脚跟。活着，就是第一步。",
        hint: "攒点钱，找份稳定的工作。",
      },
      {
        id: "survive_stable",
        condition: function (st) {
          return (
            (st.resources.cash || 0) >= 2000 && (st.needs.hunger || 0) >= 50
          );
        },
        text: "你不再为明天吃什么发愁了。这座城市开始对你露出善意的一面。",
        hint: "是时候想想更长远的事了。",
      },
      {
        id: "survive_emotion",
        condition: function (st) {
          // [全系统自洽修复] 域G 联动增强: 情绪状态影响叙事走向（G→G 深度包装）
          return (
            st.status &&
            st.status.emotionalState &&
            (st.status.emotionalState === "depressed" ||
              st.status.emotionalState === "sad")
          );
        },
        text: "三十天过去了，你发现这座城市不只冷在风里，也冷在心里。但你还在走，这比什么都重要。",
        hint: "找人说说话、吃点好吃的，心情好起来脚步才会轻。",
      },
      {
        id: "survive_career_milestone",
        condition: function (st) {
          var job = st.player.job;
          return job && job !== "unemployed";
        },
        text: "你找到了一份工作，不再是这座城市的旁观者。每天早出晚归，虽然累，但心里踏实。",
        hint: "把本职工作做好，积累技能和资源，为未来铺路。",
      },
      {
        id: "survive_default",
        condition: function () {
          return true;
        },
        text: "三十天，说长不长，说短不短。你还在这里，这本身就是一种胜利。",
        hint: "继续探索这座城市，机会无处不在。",
      },
    ],
  },
  {
    id: "chapter2_foothold",
    title: "第二章 · 立足",
    triggerDay: 180,
    flag: "_ch2Done",
    icon: "🏗️",
    intro: "半年过去了。你开始觉得，这座城市也许真的能容得下你。",
    epilogues: [
      {
        id: "foothold_startup",
        condition: function (st) {
          return st.startup && st.startup.company;
        },
        text: "你创办的公司虽然还在风雨中飘摇，但毕竟是你自己的事业。创业这条路，走上去就没有回头。",
        hint: "把公司做大做强，或者...及时止损？",
      },
      {
        id: "foothold_corporate",
        condition: function (st) {
          return st.player.phase === "corporate" && st.corporate;
        },
        text: "你在职场上混得风生水起，职级一路攀升。但夜深人静时，你偶尔会想：这就是我要的生活吗？",
        hint: "职场之外，还有更广阔的世界。",
      },
      {
        id: "foothold_investor",
        condition: function (st) {
          var inv = st.investment || {};
          var stockVal = 0;
          if (inv.stockHoldings && inv.stockMarket) {
            inv.stockHoldings.forEach(function (h) {
              var m = inv.stockMarket[h.symbol];
              stockVal += (m ? m.price : 0) * (h.shares || 0);
            });
          }
          return stockVal >= 50000;
        },
        text: "你的投资组合已经初具规模。钱生钱的游戏，你已经摸到了门道。",
        hint: "注意风险——市场不会永远只涨不跌。",
      },
      {
        id: "foothold_npc",
        condition: function (st) {
          var count = 0;
          if (st.relationships) {
            for (var id in st.relationships) {
              if ((st.relationships[id].affinity || 0) >= 60) count++;
            }
          }
          return count >= 2;
        },
        text: "你在这座城市交到了真正的朋友。有人脉的城市，才不是异乡。",
        hint: "维系好这些关系，它们会在关键时刻帮你。",
      },
      {
        id: "foothold_health_crisis",
        condition: function (st) {
          // [全系统自洽修复] 域G 联动增强: 健康危机改变立足叙事（G→G，健康子系统联动）
          return ((st.status && st.status.health) || 100) < 30;
        },
        text: "半年了，身体却在报警。你开始懂得：攒的钱再多，身体垮了都是别人的。这座城市教会你的第一件事，是健康。",
        hint: "停下来看看身体，别等它把你逼停。",
      },
      {
        id: "foothold_emotion",
        condition: function (st) {
          // [全系统自洽修复] 域G 联动增强: 快乐状态给立足章节加温度
          return (
            st.status &&
            st.status.emotionalState === "happy" &&
            ((st.needs && st.needs.happiness) || 0) >= 70
          );
        },
        text: "半年了，你发现自己开始笑。不是那种硬撑的笑，是真正觉得日子有盼头的笑。",
        hint: "快乐是一种能力，你已经学会了。",
      },
      {
        id: "foothold_default",
        condition: function () {
          return true;
        },
        text: "半年了。你在这座城市有了自己的节奏——虽然算不上多好，但至少是自己的。",
        hint: "人生的转折点，也许就在下一个路口。",
      },
    ],
  },
  {
    id: "chapter3_choice",
    title: "第三章 · 选择",
    triggerDay: 365,
    flag: "_ch3Done",
    icon: "🌌",
    intro: "一年了。你站在天台上，看着脚下灯火通明的城市。这一年，值吗？",
    epilogues: [
      {
        id: "choice_entrepreneur",
        condition: function (st) {
          return (
            st.startup && st.startup.company && st.startup.company.stage >= 1
          );
        },
        text: "你的公司还在运转。创业这条路，你已经走了很远，也许...该走到底？",
        hint: "继续创业，或寻找新的可能。",
        route: "entrepreneur",
      },
      {
        id: "choice_civil_service",
        condition: function (st) {
          return (
            st.flags._crisis35Path === "exam" || st.flags._passedCivilService
          );
        },
        text: "你选择了考公这条路。体制内的安稳，是多少人梦寐以求的。",
        hint: "铁饭碗在手，但人生不止于此。",
        route: "civil_service",
      },
      {
        id: "choice_wealth",
        condition: function (st) {
          var total =
            (st.resources.cash || 0) + (st.resources.bankBalance || 0);
          return total >= 200000;
        },
        text: "你攒下了一笔可观的财富。有了底气，就有了选择的权利。",
        hint: "财务自由不是终点，而是新的起点。",
        route: "wealth",
      },
      {
        id: "choice_lying_flat",
        condition: function (st) {
          return (
            st.flags._crisis35Path === "lieflat" ||
            ((st.needs && st.needs.fatigue || 0) <= 20 && (st.player.day || 0) >= 365)
          );
        },
        text: "你选择了不那么拼。这座城市教会你：不是所有事都值得拼命。",
        hint: "躺平也是一种智慧。但也许，还能做点什么？",
        route: "lying_flat",
      },
      {
        id: "choice_default",
        condition: function () {
          return true;
        },
        text: "一年了。你还在这座城市，还在寻找答案。也许答案本身并不重要——重要的是，你还在找。",
        hint: "新的一年，新的可能。",
        route: "open",
      },
    ],
  },
];

// ====== 章节检查与触发 ======

/**
 * 每日管线调用：检查是否到了章节触发点
 * 返回 true 表示触发了某个章节（调用方可据此暂停管线）
 */
function checkStoryChapter(state) {
  if (!state.player || !state.player.day) return false;
  if (!state.flags || state.flags.gameOver || state.flags.victory) return false;

  for (var i = 0; i < STORY_CHAPTERS.length; i++) {
    var ch = STORY_CHAPTERS[i];
    if (state.player.day >= ch.triggerDay && !state.flags[ch.flag]) {
      _triggerChapter(state, ch);
      return true;
    }
  }
  return false;
}

/** 触发章节弹窗 */
function _triggerChapter(state, ch) {
  state.flags[ch.flag] = true;
  state.flags._currentStoryChapter = ch.id;

  // [全系统自洽修复] 域G联动: 章节完成→职业资本积累 (G→C 联动,人生节点兑现职场资源)
  // 设计意图: 每完成一个主线章节,玩家对城市的认知/人脉/经验转化为可量化的职业资本
  if (typeof ensureCareerCapital === "function") {
    var cap = ensureCareerCapital(state);
    var _chapterRewards = {
      chapter1_survival: { industryResources: 8, clientLeads: 3 },
      // [全系统自洽修复] 域G A类#1: chapter key不匹配 — chapter2_standing→chapter2_foothold
      chapter2_foothold: { industryResources: 15, clientLeads: 8, reputation: 5 },
      chapter3_choice: { industryResources: 25, clientLeads: 15, reputation: 10, partnerTrust: 5 },
    };
    var _reward = _chapterRewards[ch.id];
    if (_reward) {
      cap.industryResources = (cap.industryResources || 0) + (_reward.industryResources || 0);
      cap.clientLeads = (cap.clientLeads || 0) + (_reward.clientLeads || 0);
      cap.reputation = (cap.reputation || 0) + (_reward.reputation || 0);
      cap.partnerTrust = (cap.partnerTrust || 0) + (_reward.partnerTrust || 0);
      if (typeof clampCareerCapital === "function") clampCareerCapital(cap);
      if (typeof StateManager !== "undefined" && StateManager.addMessage) {
        StateManager.addMessage(
          "📖 完成「" + ch.title + "」，人生阅历转化为职场资源。行业资源+" +
            (_reward.industryResources || 0) + "，客户线索+" + (_reward.clientLeads || 0) +
            ((_reward.reputation || 0) > 0 ? "，声誉+" + _reward.reputation : "") +
            "。",
          "info",
        );
      }
    }
  }

  // 匹配最适合的结语
  var epilogue = ch.epilogues[0];
  for (var i = 0; i < ch.epilogues.length; i++) {
    if (ch.epilogues[i].condition(state)) {
      epilogue = ch.epilogues[i];
      break;
    }
  }

  // 记录选择的路线（第三章），并激活路线效应
  if (ch.id === "chapter3_choice" && epilogue.route) {
    state.flags._lifeRoute = epilogue.route;
    if (typeof initRouteEffects === "function") {
      initRouteEffects(state);
    }
  }

  // 构建弹窗内容
  var content = ch.intro + "\n\n" + epilogue.text + "\n\n💡 " + epilogue.hint;

  // 统计当前人生状态
  var stats = _collectChapterStats(state);
  var statLine =
    "📊 人生状态：第" +
    state.player.day +
    "天 | " +
    (state.player.age || 20) +
    "岁 | 现金¥" +
    (state.resources.cash || 0) +
    " | 名气" +
    (state.player.fame || 0) +
    " | 技能" +
    stats.highSkills +
    "项达标";

  // [全系统自洽修复] 域G A类修复: 使用独立变量 _pendingChapterEvent 避免与管线触发槽（trigger_slot_daily_mid/daily_end）的 _pendingEvent 冲突导致章节弹窗被覆盖
  if (typeof showEventModal === "function") {
    var evt = {
      id: ch.id,
      icon: ch.icon,
      title: ch.title,
      story: content + "\n\n" + statLine,
      choices: [
        {
          text: "继续前行",
          hint: "人生还在继续",
          apply: function (st) {
            StateManager.addMessage(
              ch.icon +
                " " +
                ch.title +
                " — " +
                epilogue.text.substring(0, 30) +
                "...",
              "story",
            );
          },
        },
      ],
    };
    state._pendingChapterEvent = evt;
    state._pendingChapterEventId = ch.id;
    setTimeout(function () {
      var s = StateManager.getState();
      if (s._pendingChapterEvent && s._pendingChapterEventId === ch.id) {
        showEventModal(s._pendingChapterEvent);
      }
    }, 100);
  } else {
    StateManager.addMessage(
      ch.icon + " " + ch.title + " — " + epilogue.text,
      "story",
    );
  }
}

/** 收集章节统计数据 */
function _collectChapterStats(state) {
  var highSkills = 0;
  if (state.skills) {
    for (var k in state.skills) {
      if (state.skills[k] && state.skills[k].level >= 60) highSkills++;
    }
  }
  var npcFriends = 0;
  if (state.relationships) {
    for (var id in state.relationships) {
      if ((state.relationships[id].affinity || 0) >= 50) npcFriends++;
    }
  }
  return {
    highSkills: highSkills,
    npcFriends: npcFriends,
    totalAssets:
      (state.resources.cash || 0) + (state.resources.bankBalance || 0),
  };
}

// ====== 获取章节进度 ======

function getStoryChapterProgress(state) {
  var current = 0;
  var total = STORY_CHAPTERS.length;
  for (var i = 0; i < STORY_CHAPTERS.length; i++) {
    if (state.flags[STORY_CHAPTERS[i].flag]) current++;
  }
  var nextChapter = null;
  for (var i = 0; i < STORY_CHAPTERS.length; i++) {
    if (!state.flags[STORY_CHAPTERS[i].flag]) {
      nextChapter = {
        title: STORY_CHAPTERS[i].title,
        triggerDay: STORY_CHAPTERS[i].triggerDay,
        daysUntil: STORY_CHAPTERS[i].triggerDay - (state.player.day || 0),
      };
      break;
    }
  }
  return {
    current: current,
    total: total,
    nextChapter: nextChapter,
    lifeRoute: state.flags._lifeRoute || null,
  };
}

// ====== 全局挂载 ======
function getStoryChapterChecklist(state) {
  var p = state.player || {};
  var r = state.resources || {};
  var n = state.needs || {};
  var stats = _collectChapterStats(state);
  var day = p.day || 1;
  var totalAssets = (r.cash || 0) + (r.bankBalance || 0);
  // [全系统自洽修复] 域G A类修复: state 中银行贷款字段为 `bankDebt`（见 state.js:66），原字段名 `bankLoan` 不存在→银行债务永不被计入 checklist
  var debt = (r.villageDebt || 0) + (r.fineDebt || 0) + (r.bankDebt || 0);
  var items = [];

  function add(label, done, hint, weight) {
    items.push({
      label: label,
      done: !!done,
      hint: hint,
      weight: weight || 0,
    });
  }

  if (day < 30) {
    add(
      "\u5148\u7a33\u4f4f\u6e29\u9971",
      (n.hunger || 100) >= 45 && (n.fatigue || 0) <= 75,
      "\u9965\u997f\u548c\u75b2\u52b3\u4f1a\u76f4\u63a5\u62d6\u57ae\u884c\u52a8\u6548\u7387\u3002",
      90,
    );
    add(
      "\u6512\u5230\u7b2c\u4e00\u7b14\u7f13\u51b2\u91d1",
      totalAssets >= 1000,
      "\u67091000\u5143\u7f13\u51b2\u540e\uff0c\u4e8b\u4ef6\u548c\u4ea4\u6613\u9009\u62e9\u4f1a\u4ece\u5bb9\u5f88\u591a\u3002",
      70,
    );
    add(
      "\u8ba4\u8bc6\u4e00\u4e2a\u80fd\u5e2e\u5fd9\u7684\u4eba",
      stats.npcFriends >= 1,
      "NPC\u597d\u611f\u4f1a\u89e3\u9501\u5de5\u4f5c\u3001\u6298\u6263\u548c\u5371\u673a\u5e2e\u52a9\u3002",
      55,
    );
  } else if (day < 180) {
    add(
      "\u538b\u4f4e\u9ad8\u606f\u503a\u52a1",
      debt <= 1000,
      "\u6751\u957f\u503a\u548c\u94f6\u884c\u8d37\u6b3e\u4f1a\u6301\u7eed\u4fb5\u8680\u73b0\u91d1\u6d41\u3002",
      88,
    );
    add(
      "\u7ec3\u51fa\u4e00\u95e8\u6838\u5fc3\u6280\u80fd",
      stats.highSkills >= 1,
      "\u6280\u80fd\u8fbe\u523060\u540e\uff0c\u804c\u4e1a\u3001\u4ea4\u6613\u548c\u521b\u4e1a\u90fd\u4f1a\u6709\u66f4\u5f3a\u652f\u6491\u3002",
      72,
    );
    add(
      "\u5efa\u7acb\u57ce\u5e02\u5173\u7cfb\u7f51",
      stats.npcFriends >= 2,
      "\u81f3\u5c11\u4e24\u4e2a\u53ef\u9760\u5173\u7cfb\u80fd\u89e6\u53d1\u66f4\u591a\u8de8\u7cfb\u7edf\u4e8b\u4ef6\u3002",
      60,
    );
  } else if (day < 365) {
    add(
      "\u786e\u5b9a\u4e2d\u671f\u8def\u7ebf",
      !!(state.flags && state.flags._lifeRoute),
      "\u521b\u4e1a\u3001\u804c\u573a\u3001\u6295\u8d44\u3001\u4f53\u5236\u6216\u8eba\u5e73\uff0c\u90fd\u9700\u8981\u5f00\u59cb\u805a\u7126\u3002",
      85,
    );
    add(
      "\u51c6\u5907\u6297\u98ce\u9669\u8d44\u4ea7",
      totalAssets >= 50000,
      "\u540e\u671f\u5371\u673a\u3001\u4e70\u623f\u548c\u521b\u4e1a\u90fd\u9700\u8981\u66f4\u539a\u7684\u73b0\u91d1\u57ab\u3002",
      65,
    );
    add(
      "\u8ba9\u5173\u7cfb\u4ea7\u751f\u5b9e\u9645\u56de\u62a5",
      stats.npcFriends >= 3,
      "\u9ad8\u597d\u611fNPC\u4f1a\u628a\u57ce\u5e02\u8d44\u6e90\u5e26\u5230\u4f60\u8eab\u8fb9\u3002",
      50,
    );
  } else {
    add(
      "\u590d\u76d8\u4eba\u751f\u8def\u7ebf",
      !!(state.flags && state.flags._ch3Done),
      "\u4e00\u5e74\u8282\u70b9\u540e\uff0c\u4e3b\u7ebf\u4f1a\u6839\u636e\u4f60\u7684\u9009\u62e9\u7ed9\u51fa\u65b9\u5411\u53cd\u9988\u3002",
      80,
    );
    add(
      "\u8865\u9f50\u957f\u671f\u77ed\u677f",
      stats.highSkills >= 2,
      "\u540e\u671f\u4e0d\u662f\u53ea\u770b\u94b1\uff0c\u6280\u80fd\u7ec4\u5408\u4f1a\u51b3\u5b9a\u4e0a\u9650\u3002",
      60,
    );
    add(
      "\u7ef4\u6301\u73b0\u91d1\u6d41\u5b89\u5168",
      totalAssets >= Math.max(80000, debt * 3),
      "\u8d44\u4ea7\u548c\u503a\u52a1\u6bd4\u4f8b\u51b3\u5b9a\u4f60\u80fd\u4e0d\u80fd\u625b\u4f4f\u5927\u6ce2\u52a8\u3002",
      55,
    );
  }

  items.sort(function (a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.weight - a.weight;
  });
  return items.slice(0, 3);
}
if (typeof window !== "undefined") {
  window.STORY_CHAPTERS = STORY_CHAPTERS;
  window.checkStoryChapter = checkStoryChapter;
  window.getStoryChapterProgress = getStoryChapterProgress;
  window.getStoryChapterChecklist = getStoryChapterChecklist;
  // [全系统自洽修复] 域G R746b A类#2: 导出年龄叙事兑现函数（定义在文件尾部,函数声明有提升,此处引用安全）
  window.getLifeStageNarrativeEvent = function (age, flags) { return getLifeStageNarrativeEvent(age, flags); };
  window.runLifeStageNarrative = function (state) { return runLifeStageNarrative(state); };
}
// [R720 域G 联动增强 G→B]: 人生阶段叙事事件
function getLifeStageNarrativeEvent(age, flags) {
  if (!age) return null;
  if (age === 18 && flags && !flags._lifeNarrative_18) return "coming_of_age";
  if (age === 20 && flags && !flags._lifeNarrative_20) return "youth_bloom";
  if (age === 25 && flags && !flags._lifeNarrative_25) return "quarter_life";
  if (age === 30 && flags && !flags._lifeNarrative_30) return "thirty_stand";
  if (age === 35 && flags && !flags._lifeNarrative_35) return "mid_career";
  if (age === 40 && flags && !flags._lifeNarrative_40) return "forty_awake";
  if (age === 50 && flags && !flags._lifeNarrative_50) return "fifty_know";
  if (age === 60 && flags && !flags._lifeNarrative_60) return "sixty_ear";
  return null;
}
// [全系统自洽修复] 域G R746b A类#2: getLifeStageNarrativeEvent(R720) 定义后从未被调用/未导出/8个_lifeNarrative_XX flag全库零写入=8个年龄节点叙事恒不触发(pipeline断链)→补兑现函数+接线
var LIFE_STAGE_NARRATIVES_R746B = {
  coming_of_age: { age: 18, icon: "🎓", text: "十八岁了。成年的重量第一次落在肩上——从今天起，每一个选择都要自己负责。" },
  youth_bloom: { age: 20, icon: "🌸", text: "二十岁的城市灯火通明。你一无所有，却拥有最贵的东西：大把的时间和不怕输的勇气。" },
  quarter_life: { age: 25, icon: "🌗", text: "二十五岁，四分之一人生。身边有人结婚、有人升职、有人离开这座城市。你开始明白：人生不是赛跑，是各走各的路。" },
  thirty_stand: { age: 30, icon: "🏔️", text: "三十而立。立的不是房子车子，是心里那杆秤——知道自己要什么，也知道自己不要什么。" },
  mid_career: { age: 35, icon: "⚖️", text: "三十五岁。招聘启事上的年龄线像一道墙，但墙外的人不知道：你手里的经验和人脉，是二十岁的自己拿不出的筹码。" },
  forty_awake: { age: 40, icon: "🕯️", text: "四十不惑。不是没有困惑，是终于学会与困惑共处。健康悄悄变成了最贵的资产。" },
  fifty_know: { age: 50, icon: "🍂", text: "五十知天命。回头看，那些当年以为过不去的坎，都成了故事里的一行字。" },
  sixty_ear: { age: 60, icon: "🌅", text: "六十耳顺。城市还是那座城市，你已经不是当年的你。往后的日子，为自己活。" }
};
function runLifeStageNarrative(state) {
  if (!state || !state.player || !state.player.age) return;
  if (!state.flags) state.flags = {};
  var token = getLifeStageNarrativeEvent(state.player.age, state.flags);
  if (!token) return;
  var n = LIFE_STAGE_NARRATIVES_R746B[token];
  if (!n) return;
  state.flags["_lifeNarrative_" + n.age] = true;
  state.player.mental = Math.min(100, (state.player.mental || 50) + 2);
  if (typeof StateManager !== "undefined" && StateManager.addMessage) {
    StateManager.addMessage(n.icon + " 【" + n.age + "岁】" + n.text + "（心智+2）", "info");
  }
}
