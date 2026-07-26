/**
 * 时代变迁事件（v3.6 P0-2）
 *
 * 定义8个时代事件（Day 90/180/270/365/450/540/720/900）
 * 每个事件包含：触发条件、选项、影响（物价/工资/行业热度）
 */

const ERA_EVENTS = [
  // === Day 90: 第一桶金 ===
  {
    id: "era_90",
    day: 90,
    title: "第一桶金",
    icon: "💰",
    story:
      "你在这座城市已经待了三个月。物价开始有了微妙的变化——菜价涨了5%，但你也学会了怎么挑便宜货。\n老周告诉你：「这年头，钱越来越不值钱了。得想办法多赚点。」",
    phase: "street",
    // v3.99d 约定式触发：第90天，仅触发一次
    triggers: {
      minDay: 90,
      excludeFlags: ["_eraEvent_90"],
      relationshipMet: "old_zhou",
    }, // [全系统自洽修复] 域B: 加old_zhou met检查(叙事直呼老周)
    choices: [
      {
        text: "💡 学老周，多囤点耐用品",
        hint: "物价+5%，但获得「精明消费者」徽章",
        apply: function (st) {
          st.flags._eraEvent_90 = true;
          st.flags.preciousConsumerBadge = true;
          if (st._worldParams && st._worldParams.sectorHeat) {
            for (let sector in st._worldParams.sectorHeat) {
              st._worldParams.sectorHeat[sector] *= 1.05;
            }
          }
          StateManager.addMessage(
            "💡 你开始精明消费，学会了对比价格。获得「精明消费者」徽章。物价整体+5%。",
            "success",
          );
        },
      },
      {
        text: "📈 投资点东西抗通胀",
        hint: "需要¥200，获得投资经验",
        cost: 200,
        apply: function (st) {
          st.flags._eraEvent_90 = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (!st.investment) st.investment = {};
          if (!st.investment.history) st.investment.history = [];
          st.investment.history.push({
            day: st.player.day,
            type: "inflation_hedge",
            amount: 200,
          });
          StateManager.addMessage(
            "📈 你花了¥200买了些抗通胀的东西。虽然钱少了，但心里踏实。获得投资经验。",
            "info",
          );
        },
      },
      {
        text: "😌 走一步看一步",
        hint: "无变化",
        apply: function (st) {
          st.flags._eraEvent_90 = true;
          StateManager.addMessage(
            "😌 你决定先不急着做决定。日子还得一天天过。",
            "info",
          );
        },
      },
    ],
  },

  // === Day 180: 行业风口 ===
  {
    id: "era_180",
    day: 180,
    title: "行业风口",
    icon: "🚀",
    story:
      "某个新兴行业突然火爆——短视频/直播/新能源。新闻里全是「风口」「蓝海」「十万加」。\n张姐来找你：「听说你在找工作？我这边有个风口行业的活，日薪¥300，要不要试试？」",
    phase: "street",
    // v3.99d 约定式触发：第180天，需结识张姐，仅触发一次
    triggers: {
      minDay: 180,
      excludeFlags: ["_eraEvent_180"],
      relationshipMet: "sister_zhang",
    },
    choices: [
      {
        text: "🔥 抓住风口！",
        hint: "工资+50%，但需要体力消耗",
        apply: function (st) {
          st.flags._eraEvent_180 = true;
          st.flags.trendJobUnlocked = true;
          if (!st.needs) st.needs = {};
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          StateManager.addMessage(
            "🔥 你进入了风口行业！日薪涨到¥300，但累得够呛。风口不是谁都能抓住的。",
            "success",
          );
        },
      },
      {
        text: "🤔 先调研一下",
        hint: "心智+3，获得行业情报",
        apply: function (st) {
          st.flags._eraEvent_180 = true;
          if (!st.player) st.player = {};
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          if (!st.flags) st.flags = {};
          st.flags.industryIntel = true;
          StateManager.addMessage(
            "🤔 你花时间调研了行业趋势，发现有些风口其实是泡沫。心智+3。",
            "hint",
          );
        },
      },
      {
        text: "🙅 不靠谱，还是干老本行",
        hint: "稳定但错失机会",
        apply: function (st) {
          st.flags._eraEvent_180 = true;
          StateManager.addMessage(
            "🙅 你觉得风口太虚，还是继续干原来的活。稳妥，但也错过了可能的好机会。",
            "info",
          );
        },
      },
    ],
  },

  // === Day 270: 物价飞涨 ===
  {
    id: "era_270",
    day: 270,
    title: "物价飞涨",
    icon: "📈",
    story:
      "通胀开始显现。房租涨了10%，菜价涨了8%。\n王大婶来找你：「孩子，房租得涨涨了，这年头啥都贵。下个月开始¥350一天，行不？」",
    phase: "street",
    // v3.99d 约定式触发：第270天，需结识王大婶，仅触发一次
    triggers: {
      minDay: 270,
      excludeFlags: ["_eraEvent_270"],
      relationshipMet: "aunt_wang",
    },
    choices: [
      {
        text: "😓 接受涨价",
        hint: "房租+¥50/天",
        apply: function (st) {
          st.flags._eraEvent_270 = true;
          if (st.housing) st.housing.rent = (st.housing.rent || 300) + 50;
          StateManager.addMessage(
            "😓 你接受了房租涨价。每个月多花¥1,500。物价涨了，钱包瘪了。",
            "warning",
          );
        },
      },
      {
        text: "🏠 找便宜的房子",
        hint: "消耗行动力，可能找到更便宜的",
        apply: function (st) {
          st.flags._eraEvent_270 = true;
          if (!st.player) st.player = {};
          st.player.actionPoints = Math.max(
            0,
            (st.player.actionPoints || 100) - 20,
          );
          if (st.housing) {
            const newRent = Math.max(200, st.housing.rent - 30);
            st.housing.rent = newRent;
          }
          StateManager.addMessage(
            "🏠 你花了半天找房，找到个便宜点的。房租从¥350降到¥320。",
            "success",
          );
        },
      },
      {
        text: "🤝 跟王大婶商量",
        hint: "需要好感≥40，可能成功",
        apply: function (st) {
          st.flags._eraEvent_270 = true;
          const affinity =
            (st.relationships &&
              st.relationships.aunt_wang &&
              st.relationships.aunt_wang.affinity) ||
            0;
          if (affinity >= 40) {
            if (st.housing) st.housing.rent = (st.housing.rent || 300) + 20;
            StateManager.addMessage(
              "🤝 王大婶看你平时表现不错，房租只涨了¥20。人情有时候比钱管用。",
              "success",
            );
          } else {
            if (st.housing) st.housing.rent = (st.housing.rent || 300) + 50;
            StateManager.addMessage(
              "🤝 王大婶说：「咱俩关系一般，涨价是没办法。」房租涨了¥50。",
              "warning",
            );
          }
        },
      },
    ],
  },

  // === Day 365: 一周年 ===
  {
    id: "era_365",
    day: 365,
    title: "一周年",
    icon: "🎉",
    story:
      "一年过去了。你回头看刚来这座城市时的自己，感慨万千。\n这一年，你经历了什么？失去了什么？又得到了什么？",
    phase: "street",
    // v3.99d 约定式触发：第365天，仅触发一次
    triggers: { minDay: 365, excludeFlags: ["_eraEvent_365"] },
    choices: [
      {
        text: "📝 写一封给自己的信",
        hint: "心情+10，获得「反思者」徽章",
        apply: function (st) {
          st.flags._eraEvent_365 = true;
          if (!st.needs) st.needs = {};
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          st.flags.reflectorBadge = true;
          StateManager.addMessage(
            "📝 你写下了一年的感悟。虽然辛苦，但你发现自己成长了很多。心情+10。",
            "success",
          );
        },
      },
      {
        text: "🎉 庆祝一下！",
        hint: "花费¥100，心情+15",
        cost: 100,
        apply: function (st) {
          st.flags._eraEvent_365 = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (!st.needs) st.needs = {};
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          StateManager.addMessage(
            "🎉 你请自己吃了一顿大餐。一年了，值得庆祝。心情+15。",
            "success",
          );
        },
      },
      {
        text: "😌 平静地接受",
        hint: "心智+5",
        apply: function (st) {
          st.flags._eraEvent_365 = true;
          if (!st.player) st.player = {};
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "😌 你平静地接受了一年的收获与失去。心智+5。",
            "hint",
          );
        },
      },
    ],
  },

  // === Day 450: 行业洗牌 ===
  {
    id: "era_450",
    day: 450,
    title: "行业洗牌",
    icon: "🔄",
    story:
      "某些行业开始整合。小公司倒闭，大公司收购。\n李工头告诉你：「工地那边活少了，老板说项目被大公司接走了。你最近有别的活吗？」",
    phase: "street",
    // v3.99d 约定式触发：第450天，需结识李工头，仅触发一次
    triggers: {
      minDay: 450,
      excludeFlags: ["_eraEvent_450"],
      relationshipMet: "boss_li",
    },
    choices: [
      {
        text: "🔄 转行",
        hint: "解锁新工作类别",
        apply: function (st) {
          st.flags._eraEvent_450 = true;
          st.flags.careerShift = true;
          StateManager.addMessage(
            "🔄 你决定转行。虽然有风险，但不转可能被淘汰。解锁新工作类别。",
            "success",
          );
        },
      },
      {
        text: "💪 坚持原来的行业",
        hint: "稳定但工资可能下降",
        apply: function (st) {
          st.flags._eraEvent_450 = true;
          StateManager.addMessage(
            "💪 你决定坚持原来的行业。虽然活少了，但你相信熬过去会好起来。",
            "info",
          );
        },
      },
      {
        text: "📊 分析形势",
        hint: "心智+5，获得决策建议",
        apply: function (st) {
          st.flags._eraEvent_450 = true;
          if (!st.player) st.player = {};
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "📊 你分析了行业趋势，发现有些方向值得投入。心智+5。",
            "hint",
          );
        },
      },
    ],
  },

  // === Day 540: 消费升级 ===
  {
    id: "era_540",
    day: 540,
    title: "消费升级",
    icon: "✨",
    story:
      "城里人开始追求品质生活。高端消费场所增多，但普通人的日子也没变差。\n小美兴奋地说：「我学姐开了家精品咖啡馆，说是要打造城市生活新体验！」",
    phase: "street",
    // v3.99d 约定式触发：第540天，需结识小美，仅触发一次
    triggers: {
      minDay: 540,
      excludeFlags: ["_eraEvent_540"],
      relationshipMet: "xiao_mei",
    },
    choices: [
      {
        text: "✨ 体验高端消费",
        hint: "花费¥150，心情+10",
        cost: 150,
        apply: function (st) {
          st.flags._eraEvent_540 = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);
          if (!st.needs) st.needs = {};
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          StateManager.addMessage(
            "✨ 你体验了高端消费。虽然贵，但感觉不错。心情+10。",
            "success",
          );
        },
      },
      {
        text: "🤔 观望一下",
        hint: "心智+3",
        apply: function (st) {
          st.flags._eraEvent_540 = true;
          if (!st.player) st.player = {};
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🤔 你觉得高端消费不是必须的，先观望。心智+3。",
            "hint",
          );
        },
      },
      {
        text: "💡 自己开个小店",
        hint: "需要¥500，解锁创业机会",
        cost: 500,
        apply: function (st) {
          st.flags._eraEvent_540 = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
          st.flags.smallBusinessUnlocked = true;
          StateManager.addMessage(
            "💡 你决定自己开个小店。虽然有风险，但这是实现梦想的机会。解锁创业机会。",
            "success",
          );
        },
      },
    ],
  },

  // === Day 720: 两年之痒 ===
  {
    id: "era_720",
    day: 720,
    title: "两年之痒",
    icon: "🤔",
    story:
      "两年了。你开始思考：是继续打工，还是自己单干？\n城市给了你机会，也给了你压力。老周说：「我干了这么多年，攒了点钱。你说，我是不是也该自己干点什么？」",
    phase: "street",
    // v3.99d 约定式触发：第720天，需结识老周，仅触发一次
    triggers: {
      minDay: 720,
      excludeFlags: ["_eraEvent_720"],
      relationshipMet: "old_zhou",
    },
    choices: [
      {
        text: "💼 鼓励老周创业",
        hint: "老周好感+10，获得创业灵感",
        apply: function (st) {
          st.flags._eraEvent_720 = true;
          if (st.relationships && st.relationships.old_zhou) {
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 10,
            );
          }
          st.flags.careerInspiration = true;
          StateManager.addMessage(
            "💼 你鼓励老周创业。他很高兴，说会认真考虑。好感+10。",
            "success",
          );
        },
      },
      {
        text: "🏢 自己考虑创业",
        hint: "需要¥1000，解锁创业Tab",
        cost: 1000,
        apply: function (st) {
          st.flags._eraEvent_720 = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          st.flags.startupUnlocked = true;
          StateManager.addMessage(
            "🏢 你决定认真考虑创业。虽然需要投入，但这是改变命运的机会。解锁创业Tab。",
            "success",
          );
        },
      },
      {
        text: "😌 继续打工",
        hint: "稳定但错失机会",
        apply: function (st) {
          st.flags._eraEvent_720 = true;
          StateManager.addMessage(
            "😌 你觉得创业风险太大，还是继续打工稳妥。",
            "info",
          );
        },
      },
    ],
  },

  // === Day 900: 三年之变 ===
  {
    id: "era_900",
    day: 900,
    title: "三年之变",
    icon: "🌟",
    story:
      "三年。这座城市已经把你塑造成了另一个人。\n你开始有能力影响周围的人。张姐说：「你这两年变化真大，现在好多人都找你咨询怎么在这座城市立足。」",
    phase: "street",
    // v3.99d 约定式触发：第900天，需结识张姐，仅触发一次
    triggers: {
      minDay: 900,
      excludeFlags: ["_eraEvent_900"],
      relationshipMet: "sister_zhang",
    },
    choices: [
      {
        text: "🌟 成为城市影响者",
        hint: "获得「城市影响者」成就，NPC关系传导+20%",
        apply: function (st) {
          st.flags._eraEvent_900 = true;
          st.flags.cityInfluencer = true;
          StateManager.addMessage(
            "🌟 你成为了城市影响者。你的行为能影响更多人。NPC关系传导效果+20%。",
            "success",
          );
        },
      },
      {
        text: "📚 回馈社会",
        hint: "心情+15，道德+5",
        apply: function (st) {
          st.flags._eraEvent_900 = true;
          if (!st.needs) st.needs = {};
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          if (!st.player) st.player = {};
          st.player.morality = Math.min(100, (st.player.morality || 0) + 5);
          StateManager.addMessage(
            "📚 你决定回馈社会，帮助更多刚来这座城市的人。心情+15，道德+5。",
            "success",
          );
        },
      },
      {
        text: "🏠 回家看看",
        hint: "心情+10",
        apply: function (st) {
          st.flags._eraEvent_900 = true;
          if (!st.needs) st.needs = {};
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          StateManager.addMessage(
            "🏠 你决定回家看看。三年的城市生活，让你更珍惜家乡。心情+10。",
            "info",
          );
        },
      },
    ],
  },
];

// 导出
if (typeof window !== "undefined") {
  window.ERA_EVENTS = ERA_EVENTS;
}

// [全系统自洽修复] 域B 修复: 将时代事件注入 RANDOM_EVENTS
// era_transform.js 使用 scheduleChainEvent 调度这些事件，但 checkChainEventQueue
// 只在 RANDOM_EVENTS 中查找 → 如果不注入，8个时代事件永远找不到，成为死代码
// 标记 _isChainEvent:true 防止被 queueRandomEvent 随机抽取（仅通过链式触发）
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._eraEventsLoaded) return;
  RANDOM_EVENTS._eraEventsLoaded = true;
  for (var i = 0; i < ERA_EVENTS.length; i++) {
    var e = ERA_EVENTS[i];
    var conditionsFn = null;
    if (e.id === "era_180") {
      conditionsFn = function (st) {
        if (!st.player || st.player.totalWorkDays < 1) return false; // [Layer3]
        return true;
      };
    } else if (e.id === "era_270") {
      conditionsFn = function (st) {
        if (!st.relationships || !st.relationships.aunt_wang || !st.relationships.aunt_wang.met) return false; // [Layer3]
        return true;
      };
    } else if (e.id === "era_450") {
      conditionsFn = function (st) {
        if (!st.career || !st.career.currentJob) return false; // [Layer3]
        return true;
      };
    } else if (e.id === "era_720") {
      conditionsFn = function (st) {
        if (!st.career || !st.career.currentJob) return false; // [Layer3] 叙事说"是继续打工，还是自己单干"
        return true;
      };
    } else if (e.id === "era_900") {
      conditionsFn = function (st) {
        // [Layer3] 叙事说"现在好多人都找你咨询"，需玩家有一定名气或社交关系
        if ((st.player && st.player.fame < 15) && (!st.relationships || Object.keys(st.relationships).length < 3)) return false;
        return true;
      };
    }
    RANDOM_EVENTS.push({
      id: e.id,
      phase: e.phase || "street",
      icon: e.icon || "📈",
      title: e.title,
      story: e.story,
      triggers: e.triggers,
      choices: e.choices,
      probability: 0,
      repeatable: false,
      _isChainEvent: true,
      conditions: conditionsFn,
    });
  }
})();
