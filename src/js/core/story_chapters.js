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
          if (st.npcRelations) {
            for (var id in st.npcRelations) {
              if ((st.npcRelations[id].affinity || 0) >= 60) count++;
            }
          }
          return count >= 2;
        },
        text: "你在这座城市交到了真正的朋友。有人脉的城市，才不是异乡。",
        hint: "维系好这些关系，它们会在关键时刻帮你。",
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
            ((st.needs.fatigue || 0) <= 20 && (st.player.day || 0) >= 365)
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
  if (state.flags.gameOver || state.flags.victory) return false;

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

  // 使用现有的弹窗系统
  if (typeof showEventModal === "function") {
    state._pendingEvent = {
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
    setTimeout(function () {
      showEventModal();
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
  if (state.npcRelations) {
    for (var id in state.npcRelations) {
      if ((state.npcRelations[id].affinity || 0) >= 50) npcFriends++;
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
if (typeof window !== "undefined") {
  window.STORY_CHAPTERS = STORY_CHAPTERS;
  window.checkStoryChapter = checkStoryChapter;
  window.getStoryChapterProgress = getStoryChapterProgress;
}
