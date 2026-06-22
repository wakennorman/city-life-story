/**
 * 节日系统 — 中国传统节日价格波动与氛围效果
 *
 * 参考 Stardew Valley 节日设计：每个节日改变经济环境，
 * 创造"下个季节我要提前备货"的策略期待感。
 *
 * 节日日历（以 day % 365 计算年内日期）：
 *   春节   day 20-27  (8天)  食品/奢侈品涨价，心情大涨
 *   劳动节 day 120-122 (3天) 电子/服装打折促销
 *   端午节 day 162-164 (3天) 食品略涨，粽子飘香
 *   中秋节 day 256-258 (3天) 食品/礼品涨价，心情大涨
 *   国庆节 day 273-280 (8天) 电子/服装促销，出行高峰
 *
 * 春节7天特殊活动：
 *   除夕(20) - 年夜饭抉择（回家/留下）
 *   初一(21) - 拜年收红包
 *   初二(22) - 回娘家/走亲戚
 *   初三(23) - 赤狗日（休息/学习加成）
 *   初四(24) - 迎财神（投资/经商机会）
 *   初五(25) - 破五开工（工作机会）
 *   初六(26) - 送穷（清理债务机会）
 *
 * 季节性价格波动（春夏秋冬）：
 *   春季(60-151)：电子产品跌（开学清仓），食品涨（春节余波）
 *   夏季(152-243)：饮料/水涨（高温），服装跌（换季清仓）
 *   秋季(244-334)：食品涨（中秋/国庆），电子产品涨（双十一预热）
 *   冬季(335-59)：保暖用品涨，电子产品涨（双十二/年货节预热）
 */

// ====== 春节7天特殊活动 ======
var SPRING_FESTIVAL_EVENTS = [
  {
    dayOffset: 0, // 除夕
    title: "除夕夜：回家还是留下？",
    icon: "🏠",
    desc: "除夕夜，城中村的出租屋里冷冷清清。手机里是爸妈发来的语音：'今年回来吗？'。但回去的路费要¥300，而且回去可能要面对亲戚的盘问。",
    choices: [
      {
        text: "🎫 买票回家 (¥300)",
        hint: "花路费但心情大好",
        cost: 300,
        effect: function (st) {
          if (st.resources.cash < 300)
            return { ok: false, msg: "钱不够买票！" };
          st.resources.cash -= 300;
          st.needs.happiness = Math.min(100, st.needs.happiness + 20);
          st.player.fame = Math.min(100, st.player.fame + 2);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          st.flags._springFestivalHome = true;
          st.flags._springFestivalAchieveHome = true; // 成就：除夕团圆
          return {
            ok: true,
            msg: "买了回家的票！除夕夜和家人团圆，心情+20，疲劳-10。",
          };
        },
      },
      {
        text: "🍜 在城中村自己煮顿年夜饭",
        hint: "省钱但孤独",
        effect: function (st) {
          st.resources.cash -= 30;
          st.needs.hunger = Math.min(100, st.needs.hunger + 30);
          st.needs.happiness = Math.max(0, st.needs.happiness - 5);
          st.flags._springFestivalAlone = true;
          return {
            ok: true,
            msg: "花¥30买了点食材，自己煮了一顿年夜饭。虽然简单，但也算过年。",
          };
        },
      },
      {
        text: "🎲 去网吧通宵打游戏",
        hint: "逃避现实",
        cost: 50,
        effect: function (st) {
          if (st.resources.cash < 50) return { ok: false, msg: "钱不够！" };
          st.resources.cash -= 50;
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          st.player.mental = Math.max(0, st.player.mental - 3);
          return {
            ok: true,
            msg: "去网吧通宵打游戏，暂时忘了烦恼。但明天肯定很累...",
          };
        },
      },
      {
        text: "🥟 去王大婶家蹭年夜饭",
        hint: "需好感≥20",
        effect: function (st) {
          var rel = st.relationships && st.relationships.aunt_wang;
          if (!rel || rel.affinity < 20) {
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            return { ok: false, msg: "和王大婶还不够熟，不好意思去蹭饭。" };
          }
          st.needs.hunger = Math.min(100, st.needs.hunger + 35);
          st.needs.happiness = Math.min(100, st.needs.happiness + 12);
          rel.affinity = Math.min(100, rel.affinity + 3);
          st.flags._springFestivalAlone = false;
          return {
            ok: true,
            msg: "王大婶热情地拉你坐下，桌上摆着饺子和红烧肉。她说：'一个人在外面不容易，来，多吃点！'饥饱+35，心情+12，好感+3。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 1, // 初一
    title: "初一：拜年收红包",
    icon: "🧧",
    desc: "大年初一，街上到处都是拜年的人。你遇到几个老熟人，他们给你发了红包。但同时，你也得给别人发——人情往来。",
    choices: [
      {
        text: "🧧 去给长辈拜年",
        hint: "花小钱赚大钱",
        cost: 100,
        effect: function (st) {
          if (st.resources.cash < 100)
            return { ok: false, msg: "没钱买礼物！" };
          st.resources.cash -= 100;
          // 60% 概率收到更多红包
          if (Random.chance(0.6)) {
            const红包 = Random.int(150, 249);
            st.resources.cash += 红包;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            st.player.fame = Math.min(100, st.player.fame + 2);
            st.flags._springFestivalAchieveRedPacket = true; // 成就：红包达人
            return {
              ok: true,
              msg:
                "给长辈拜年了！收到红包¥" +
                红包 +
                "，净赚¥" +
                (红包 - 100) +
                "！",
            };
          } else {
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            return {
              ok: true,
              msg: "拜年了，但长辈给的红包不多。人情往来，心意到了就好。",
            };
          }
        },
      },
      {
        text: "😴 在家睡懒觉",
        hint: "恢复疲劳",
        effect: function (st) {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 15);
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          return {
            ok: true,
            msg: "大年初一睡懒觉，疲劳-15。过年嘛，休息最重要。",
          };
        },
      },
      {
        text: "🏪 去商业区看看有没有临时工作",
        hint: "过年不打烊",
        effect: function (st) {
          const 找到 = Random.chance(0.4);
          if (找到) {
            const收入 = Random.int(80, 119);
            st.resources.cash += 收入;
            st.resources.totalEarned += 收入;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            return {
              ok: true,
              msg: "商业区有临时促销！赚了¥" + 收入 + "。过年加班费不错。",
            };
          } else {
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            return {
              ok: true,
              msg: "商业区没什么临时工作。大年初一大家都休息，你也歇歇吧。",
            };
          }
        },
      },
      {
        text: "👴 去给老周拜年",
        hint: "老周喜欢热闹",
        effect: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (!rel || rel.affinity < 10) {
            return { ok: false, msg: "你和老周还不熟，冒昧去拜年有点尴尬。" };
          }
          st.resources.cash -= 20;
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          rel.affinity = Math.min(100, rel.affinity + 4);
          return {
            ok: true,
            msg: "老周看到你来拜年，高兴地拿出花生瓜子招待你。他说：'这城里有个人说说话真好。'心情+8，好感+4。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 2, // 初二
    title: "初二：回娘家/走亲戚",
    icon: "👨‍👩‍👧",
    desc: "初二回娘家，街上到处都是带着礼品的年轻人。你遇到几个老同事，他们邀请你一起去走亲戚。",
    choices: [
      {
        text: "🎁 跟同事一起去走亲戚",
        hint: "花礼钱但涨人缘",
        cost: 80,
        effect: function (st) {
          if (st.resources.cash < 80) return { ok: false, msg: "没钱买礼品！" };
          st.resources.cash -= 80;
          st.player.corporate = st.player.corporate || {};
          st.player.corporate.popularity = Math.min(
            100,
            (st.player.corporate.popularity || 30) + 5,
          );
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          return {
            ok: true,
            msg: "和同事一起走亲戚，人缘+5。过年就是用来维护关系的。",
          };
        },
      },
      {
        text: "📱 给老家爸妈打视频电话",
        hint: "远程拜年",
        effect: function (st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          st.player.mental = Math.min(100, st.player.mental + 2);
          return {
            ok: true,
            msg: "给爸妈打了视频电话，聊了半小时。虽然没回家，但心里暖洋洋的。",
          };
        },
      },
      {
        text: "🍜 去馆子吃顿好的",
        hint: "犒劳自己",
        cost: 60,
        effect: function (st) {
          if (st.resources.cash < 60) return { ok: false, msg: "钱不够！" };
          st.resources.cash -= 60;
          st.needs.hunger = Math.min(100, st.needs.hunger + 25);
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          return {
            ok: true,
            msg: "去馆子吃了顿好的，花¥60。过年嘛，犒劳一下自己。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 3, // 初三 赤狗日
    title: "初三：赤狗日（不宜外出）",
    icon: "🔴",
    desc: "初三赤狗日，老话说这天不宜外出拜年。正好可以休息、学习、或者处理一些私事。",
    choices: [
      {
        text: "📚 在家学习技能",
        hint: "学习效率翻倍",
        effect: function (st) {
          const skills = Object.keys(st.skills || {});
          if (skills.length === 0) return { ok: false, msg: "没有技能可学！" };
          const key = skills[0];
          const xp = Random.int(20, 29);
          st.skills[key] = st.skills[key] || { level: 1, xp: 0 };
          st.skills[key].xp += xp;
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
          st.flags._springFestivalAchieveStudy = true; // 成就：赤狗日学霸
          return {
            ok: true,
            msg:
              "赤狗日在家学习《" + key + "》，效率翻倍！技能经验+" + xp + "。",
          };
        },
      },
      {
        text: "😴 睡个懒觉",
        hint: "恢复疲劳",
        effect: function (st) {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 20);
          st.needs.happiness = Math.min(100, st.needs.happiness + 3);
          return {
            ok: true,
            msg: "赤狗日睡懒觉，疲劳-20。这天气不宜外出，休息正好。",
          };
        },
      },
      {
        text: "🧹 整理出租屋",
        hint: "提升卫生",
        effect: function (st) {
          st.needs.hygiene = Math.min(100, st.needs.hygiene + 15);
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          return {
            ok: true,
            msg: "花了一下午整理出租屋，卫生+15。干干净净过个年。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 4, // 初四 迎财神
    title: "初四：迎财神",
    icon: "💰",
    desc: "初四迎财神！老话说这天迎财神最灵。你听说附近有个小庙在办迎财神活动，去拜一拜说不定有好运气。",
    choices: [
      {
        text: "🙏 去庙里拜财神 (香火钱¥50)",
        hint: "花小钱求好运",
        cost: 50,
        effect: function (st) {
          if (st.resources.cash < 50)
            return { ok: false, msg: "钱不够香火钱！" };
          st.resources.cash -= 50;
          st.flags._springFestivalAchieveWorship = true; // 成就：迎财神
          // 30% 概率获得意外之财
          if (Random.chance(0.3)) {
            const 意外 = Random.int(100, 299);
            st.resources.cash += 意外;
            st.needs.happiness = Math.min(100, st.needs.happiness + 10);
            return {
              ok: true,
              msg: "拜了财神！居然捡到了¥" + 意外 + "！财神保佑！",
            };
          } else {
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            st.player.mental = Math.min(100, st.player.mental + 2);
            return {
              ok: true,
              msg: "拜了财神，心里踏实了不少。虽然没捡到钱，但心情好了。",
            };
          }
        },
      },
      {
        text: "📈 研究投资市场",
        hint: "学习理财",
        effect: function (st) {
          st.investment = st.investment || {};
          st.investment.knowledge = Math.min(
            100,
            (st.investment.knowledge || 0) + 5,
          );
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          return {
            ok: true,
            msg: "研究了一下午投资市场，投资知识+5。迎财神不如学理财。",
          };
        },
      },
      {
        text: "🚶 去公园散步",
        hint: "放松心情",
        effect: function (st) {
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
          return {
            ok: true,
            msg: "去公园散了散步，心情+8。迎财神不如迎好心情。",
          };
        },
      },
      {
        text: "🍽️ 去陈师傅店里吃顿好的",
        hint: "需好感≥15",
        effect: function (st) {
          var rel = st.relationships && st.relationships.chef_chen;
          if (!rel || rel.affinity < 15) {
            st.resources.cash -= 40;
            st.needs.hunger = Math.min(100, st.needs.hunger + 30);
            st.needs.happiness = Math.min(100, st.needs.happiness + 5);
            return {
              ok: true,
              msg: "陈师傅的店初四就开了。花¥40吃了顿好饭，饥饱+30。",
            };
          }
          st.resources.cash -= 25;
          st.needs.hunger = Math.min(100, st.needs.hunger + 40);
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          st.player.fame = Math.min(100, st.player.fame + 1);
          rel.affinity = Math.min(100, rel.affinity + 3);
          st.flags._newYearChefMeal = true;
          return {
            ok: true,
            msg: "陈师傅看到你来特别高兴，做了好几个拿手菜，还给你打了折！他说：'过年嘛，吃得开心最重要！'饥饱+40，心情+10，好感+3，名气+1。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 5, // 初五 破五
    title: "初五：破五开工",
    icon: "🔨",
    desc: "初五破五！老话说这天可以'破'掉之前的禁忌，各行各业开始开工。不少公司提前招人，是个找工作的机会。",
    choices: [
      {
        text: "💼 去人才市场找临时工",
        hint: "节日加班费高",
        effect: function (st) {
          const 找到 = Random.chance(0.5);
          if (找到) {
            const收入 = Random.int(100, 149);
            st.resources.cash += 收入;
            st.resources.totalEarned += 收入;
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 12);
            st.flags._springFestivalAchieveWork = true; // 成就：破五开工
            return {
              ok: true,
              msg: "找到临时工！赚了¥" + 收入 + "。破五开工，第一桶金！",
            };
          } else {
            st.needs.happiness = Math.max(0, st.needs.happiness - 3);
            return {
              ok: true,
              msg: "人才市场人很多，没找到合适的。明年再来吧。",
            };
          }
        },
      },
      {
        text: "🏭 去工厂区问问有没有活",
        hint: "体力活好找",
        effect: function (st) {
          const 找到 = Random.chance(0.6);
          if (找到) {
            const收入 = Random.int(80, 109);
            st.resources.cash += 收入;
            st.resources.totalEarned += 收入;
            st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
            st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
            st.flags._springFestivalAchieveWork = true; // 成就：破五开工
            return {
              ok: true,
              msg: "工厂区有临时工！赚了¥" + 收入 + "，体力+1。",
            };
          } else {
            return {
              ok: true,
              msg: "工厂区暂时没招人。破五刚开工，还在筹备中。",
            };
          }
        },
      },
      {
        text: "📚 继续学习/休息",
        hint: "不打工",
        effect: function (st) {
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 10);
          st.needs.happiness = Math.min(100, st.needs.happiness + 2);
          return {
            ok: true,
            msg: "选择继续休息。破五开工是别人的事，你慢慢来。",
          };
        },
      },
      {
        text: "👷 跟李工头去工地看看",
        hint: "需好感≥25",
        effect: function (st) {
          var rel = st.relationships && st.relationships.boss_li;
          if (!rel || rel.affinity < 25) {
            return {
              ok: false,
              msg: "你和李工头还不熟，不太好意思主动找他要活。",
            };
          }
          var报酬 = Random.int(120, 179);
          st.resources.cash += 报酬;
          st.resources.totalEarned += 报酬;
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 15);
          st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
          rel.affinity = Math.min(100, rel.affinity + 3);
          st.flags._springFestivalAchieveWork = true;
          return {
            ok: true,
            msg:
              "李工头看到你来了很意外：'破五就来干活？好样的！'带你去了工地，干了半天赚了¥" +
              报酬 +
              "。体质+1，好感+3。",
          };
        },
      },
    ],
  },
  {
    dayOffset: 6, // 初六 送穷
    title: "初六：送穷神",
    icon: "🗑️",
    desc: "初六送穷神！老话说这天把'穷气'扫出去，一年都能财运亨通。你决定整理一下自己的财务状况，看看有没有可以优化的地方。",
    choices: [
      {
        text: "🧹 大扫除+整理财务",
        hint: "清理负面状态",
        effect: function (st) {
          st.needs.hygiene = Math.min(100, st.needs.hygiene + 10);
          st.needs.fatigue = Math.max(0, st.needs.fatigue - 5);
          // 有机会清理一些负面flag
          if (st.flags._hadMentalCrisis) {
            st.flags._mentalRecoveryDone = true;
            st.player.mental = Math.min(100, st.player.mental + 5);
          }
          st.needs.happiness = Math.min(100, st.needs.happiness + 5);
          return {
            ok: true,
            msg: "大扫除+整理财务，卫生+10，心情+5。送穷神，迎好运！",
          };
        },
      },
      {
        text: "🗑️ 帮老周整理废品站",
        hint: "需好感≥15",
        effect: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (!rel || rel.affinity < 15) {
            return { ok: false, msg: "和老周还不太熟，贸然帮忙有点奇怪。" };
          }
          st.needs.fatigue = Math.min(100, st.needs.fatigue + 10);
          st.player.physique = Math.min(100, (st.player.physique || 20) + 1);
          rel.affinity = Math.min(100, rel.affinity + 5);
          var废品收入 = Random.int(40, 69);
          st.resources.cash += 废品收入;
          st.resources.totalEarned += 废品收入;
          st.flags._springFestivalAlone = false;
          return {
            ok: true,
            msg:
              "老周没想到你会来帮忙。你们一起整理了一上午的废品，他教了你几个挑货的诀窍，最后硬塞给你¥" +
              废品收入 +
              "。体质+1，好感+5。",
          };
        },
      },
      {
        text: "💰 还一部分债务",
        hint: "减轻负担",
        effect: function (st) {
          const debt = st.resources.villageDebt || 0;
          if (debt <= 0) return { ok: false, msg: "没有债务！" };
          const还 = Math.min(st.resources.cash || 0, Math.floor(debt * 0.3));
          if (还 <= 0) return { ok: false, msg: "钱不够还债！" };
          st.resources.cash -= 还;
          st.resources.villageDebt = Math.max(
            0,
            (st.resources.villageDebt || 0) - 还,
          );
          st.resources.debt = Math.max(0, (st.resources.debt || 0) - 还);
          st.needs.happiness = Math.min(100, st.needs.happiness + 8);
          st.player.mental = Math.min(100, st.player.mental + 3);
          st.flags._springFestivalAchievePayDebt = true; // 成就：送穷神
          return {
            ok: true,
            msg:
              "还了¥" + 还 + "的债！送穷神，先送掉一部分债务。心情+8，心智+3。",
          };
        },
      },
      {
        text: "🎉 请朋友吃顿饭",
        hint: "维护关系",
        cost: 80,
        effect: function (st) {
          if (st.resources.cash < 80) return { ok: false, msg: "钱不够！" };
          st.resources.cash -= 80;
          st.needs.happiness = Math.min(100, st.needs.happiness + 10);
          // 提升NPC好感
          if (st.relationships) {
            for (let k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].affinity < 100) {
                st.relationships[k].affinity = Math.min(
                  100,
                  st.relationships[k].affinity + 2,
                );
              }
            }
          }
          return {
            ok: true,
            msg: "请朋友吃了顿饭，花¥80。大家聚在一起送穷神，心情+10，所有NPC好感+2。",
          };
        },
      },
    ],
  },
];

// ====== 季节性价格波动定义 ======
var SEASONAL_PRICE_MODS = {
  spring: {
    electronics: 0.85, // 开学季清仓
    food: 1.15, // 春节余波
    clothing: 0.9, // 冬装清仓
    daily: 1.05,
  },
  summer: {
    water: 1.4, // 高温需求
    drinks: 1.5, // 饮料需求
    clothing: 0.8, // 换季清仓
    electronics: 0.95,
    food: 1.05,
  },
  autumn: {
    food: 1.2, // 中秋/国庆
    luxury: 1.15, // 礼品需求
    electronics: 1.1, // 双十一预热
    clothing: 1.05, // 秋装
    daily: 1.05,
  },
  winter: {
    clothing: 1.2, // 冬装
    daily: 1.1, // 保暖用品
    electronics: 1.15, // 双十二/年货节
    food: 1.1,
    luxury: 1.1,
  },
};

// ====== 节日系统定义 ======
var FESTIVALS = [
  {
    id: "spring_festival",
    name: "春节",
    icon: "🧨",
    startDay: 20,
    duration: 8,
    desc: "阖家团圆，年味十足。年货、食品价格普遍上涨。",
    priceMods: { food: 1.25, luxury: 1.35, daily: 1.15 },
    moodBonus: 8,
    announceTxt:
      "🧨 春节到了！大街挂满红灯笼，鞭炮声此起彼伏。年货、食品价格上涨，但年味十足！提前囤点年货吧。",
  },
  {
    id: "labor_day",
    name: "劳动节",
    icon: "🔨",
    startDay: 120,
    duration: 3,
    desc: "劳动人民的节日，商场促销，人流量大增。",
    priceMods: { electronics: 0.88, clothing: 0.85 },
    moodBonus: 3,
    announceTxt:
      "🔨 劳动节到了！向辛勤劳动的自己致敬。商场促销，电子产品和衣服打折，是补货的好时机。",
  },
  {
    id: "dragon_boat",
    name: "端午节",
    icon: "🐉",
    startDay: 162,
    duration: 3,
    desc: "粽子飘香，龙舟竞渡。食品价格略涨。",
    priceMods: { food: 1.2, daily: 1.05 },
    moodBonus: 5,
    announceTxt:
      "🐉 端午节到了！街头粽子飘香，食品价格略涨。买两包粽子慰劳一下自己！",
  },
  {
    id: "mid_autumn",
    name: "中秋节",
    icon: "🥮",
    startDay: 256,
    duration: 3,
    desc: "月圆人团圆，走亲访友送礼高峰。",
    priceMods: { food: 1.3, luxury: 1.25, daily: 1.1 },
    moodBonus: 8,
    announceTxt:
      "🥮 中秋节到了！月饼香气弥漫街道，食品和奢侈品价格上涨。给王阿姨他们送个月饼，好感+大！",
  },
  {
    id: "national_day",
    name: "国庆节",
    icon: "🎉",
    startDay: 273,
    duration: 8,
    desc: "举国欢庆黄金周，购物旅游双高峰。",
    priceMods: { electronics: 0.88, clothing: 0.85, daily: 1.1 },
    moodBonus: 5,
    announceTxt:
      "🎉 国庆黄金周！全国欢庆，商场大促。电子产品和服装打折，但食品因人流量稍涨。",
  },
  {
    id: "shopping_festival",
    name: "全民剁手节",
    icon: "🛒",
    startDay: 315,
    duration: 2,
    desc: "电商年度最大促销，零售品需求暴增，商业区人流爆炸，摆摊收益翻倍。",
    priceMods: {
      daily: 2.0,
      clothing: 1.9,
      electronics: 1.85,
      food: 1.15,
      luxury: 1.5,
    },
    moodBonus: 6,
    announceTxt:
      "🛒 全民剁手节开始！商业区人山人海，日用品/服装/电子需求暴涨——这是今年摆摊最赚的两天！准备好货了吗？",
  },
];

/** 根据游戏天数获取当前节日（无则返回null） */
function getCurrentFestival(day) {
  var doy = day % 365;
  for (var i = 0; i < FESTIVALS.length; i++) {
    var f = FESTIVALS[i];
    if (doy >= f.startDay && doy < f.startDay + f.duration) return f;
  }
  return null;
}

/** 判断是否处于剁手节余震清仓期（节日结束后3天） */
function isShoppingClearancePeriod(state) {
  return !!(
    state.flags._shoppingClearanceEndDay &&
    state.player.day <= state.flags._shoppingClearanceEndDay
  );
}

/** 获取节日对某商品分类的价格修正乘数（无节日=1.0，清仓期低于1.0） */
function getFestivalPriceMod(state, category) {
  var f = getCurrentFestival(state.player.day);
  if (f && f.priceMods && f.priceMods[category]) return f.priceMods[category];
  // 剁手节余震清仓期：日用品/服装/电子便宜15-25%（买货好时机）
  if (isShoppingClearancePeriod(state)) {
    var clearMods = { daily: 0.82, clothing: 0.78, electronics: 0.8 };
    if (clearMods[category]) return clearMods[category];
  }
  return 1.0;
}

/** 节日分类中文名 */
function getFestivalCategoryName(cat) {
  var names = {
    food: "食品",
    daily: "日用品",
    luxury: "奢侈品",
    electronics: "电子",
    clothing: "服装",
    scrap: "废品",
  };
  return names[cat] || cat;
}

/**
 * 每日节日效果结算 — 加入 DAILY_PIPELINE
 * 节日第一天发布公告；节日期间每日心情加成；
 * 剁手节额外：3天预热公告 + 节日结束后清仓期
 */
function checkFestivalDailyEffects(state) {
  var doy = state.player.day % 365;
  var year = Math.floor(state.player.day / 365);

  // === 剁手节专项：3天预热 + 余震清仓 ===
  var shoppingFest = null;
  for (var si = 0; si < FESTIVALS.length; si++) {
    if (FESTIVALS[si].id === "shopping_festival") {
      shoppingFest = FESTIVALS[si];
      break;
    }
  }
  if (shoppingFest) {
    var daysToFest = shoppingFest.startDay - doy;
    // 预热公告（3天前）
    if (daysToFest === 3) {
      var preKey = "_shopFestPre_y" + year;
      if (!state.flags[preKey]) {
        state.flags[preKey] = true;
        StateManager.addMessage(
          "📦【预热提醒】全民剁手节还有3天！现在去批发市场囤好日用品/服装，节日当天商业区摆摊收益可翻倍！早买早赚。",
          "hint",
        );
      }
    }
    // 节日结束第1天：开启余震清仓期3天
    if (doy === shoppingFest.startDay + shoppingFest.duration) {
      var clearKey = "_shopFestClear_y" + year;
      if (!state.flags[clearKey]) {
        state.flags[clearKey] = true;
        state.flags._shoppingClearanceEndDay = state.player.day + 3;
        // 剁手节期间累计进货成就检查
        var stockupAmount = state.flags._shoppingFestTotalStockup || 0;
        if (stockupAmount >= 5000) {
          state.flags._shoppingFestAchieveStockup = true;
        }
        // 剁手节期间累计利润成就检查
        var festivalProfit = state.flags._shoppingFestTotalProfit || 0;
        if (festivalProfit >= 3000) {
          state.flags._shoppingFestAchieveProfit = true;
        }
        StateManager.addMessage(
          "📉【剁手节余波】消费者买完了，日用品/服装/电子降价15-20%清仓中（还有3天），是囤货低吸的好时机！",
          "info",
        );
      }
    }
  }

  // === 普通节日效果 ===
  var f = getCurrentFestival(state.player.day);
  if (!f) return;

  // 节日第一天公告（每年触发一次）
  if (doy === f.startDay) {
    var flagKey = "_festAnno_" + f.id + "_y" + year;
    if (!state.flags[flagKey]) {
      state.flags[flagKey] = true;
      StateManager.addMessage(f.announceTxt, "event");
    }
  }

  // 节日期间每日心情加成（最多+8）
  if (f.moodBonus > 0) {
    state.needs.happiness = Math.min(
      100,
      (state.needs.happiness || 50) + f.moodBonus,
    );
  }

  // === 节日成就追踪 ===
  // 劳动节：节日第一天标记参与
  if (f.id === "labor_day" && doy === f.startDay) {
    state.flags._laborDayParticipated = true;
  }

  // 中秋节：节日第一天标记参与
  if (f.id === "mid_autumn" && doy === f.startDay) {
    state.flags._midAutumnParticipated = true;
  }

  // 国庆节：节日第一天标记参与
  if (f.id === "national_day" && doy === f.startDay) {
    state.flags._nationalDayParticipated = true;
  }

  // 剁手节：节日第一天标记参与
  if (f.id === "shopping_festival" && doy === f.startDay) {
    state.flags._shoppingFestParticipated = true;
  }
}

/**
 * 节日中秋/春节送礼NPC好感加成
 * 在 showGiftModal 中调用 — 节日期间送礼额外+10好感
 */
function getFestivalGiftBonus() {
  var state = StateManager.getState();
  var f = getCurrentFestival(state.player.day);
  if (!f) return 0;
  if (f.id === "spring_festival" || f.id === "mid_autumn") return 10;
  if (f.id === "dragon_boat" || f.id === "national_day") return 5;
  return 0;
}

/** 获取当前季节 */
function getCurrentSeason(day) {
  var doy = ((day - 1) % 365) + 1;
  if (doy >= 60 && doy <= 151)
    return { id: "spring", name: "春季", icon: "🌸" };
  if (doy >= 152 && doy <= 243)
    return { id: "summer", name: "夏季", icon: "☀️" };
  if (doy >= 244 && doy <= 334)
    return { id: "autumn", name: "秋季", icon: "🍂" };
  return { id: "winter", name: "冬季", icon: "❄️" };
}

/**
 * 节日限定临时工作（节日期间在对应地点出现）
 * pay: 基础收入（每次行动）, apCost: 行动点消耗, intReq: 智力门槛
 */
var FESTIVAL_JOBS = {
  spring_festival: [
    {
      id: "fest_spring_promo",
      name: "年货节推广员",
      icon: "🧨",
      location: "commercialDist",
      pay: 100,
      apCost: 20,
      desc: "过年人流旺，帮年货店招揽顾客，节日加价！",
    },
  ],
  labor_day: [
    {
      id: "fest_labor_promo",
      name: "劳动节促销员",
      icon: "🔨",
      location: "commercialDist",
      pay: 80,
      apCost: 20,
      desc: "商场劳动节大促，协助发传单摆摊台",
    },
  ],
  dragon_boat: [
    {
      id: "fest_zongzi_deliver",
      name: "粽子配送员",
      icon: "🐉",
      location: "slum",
      pay: 70,
      apCost: 15,
      desc: "端午粽子销量大增，帮忙骑车配送",
    },
  ],
  mid_autumn: [
    {
      id: "fest_mooncake_deliver",
      name: "月饼礼盒配送",
      icon: "🥮",
      location: "commercialDist",
      pay: 90,
      apCost: 20,
      desc: "中秋月饼礼盒配送旺季，件数多奖金高",
    },
  ],
  national_day: [
    {
      id: "fest_guide",
      name: "景区导游志愿者",
      icon: "🎉",
      location: "park",
      pay: 120,
      apCost: 25,
      intReq: 20,
      desc: "黄金周游客多，兼职景区向导，需要一定的智力",
    },
  ],
  shopping_festival: [
    {
      id: "fest_shopping_vendor",
      name: "剁手节爆款摊位",
      icon: "🛒",
      location: "commercialDist",
      pay: 280,
      apCost: 25,
      desc: "剁手节商业区人流爆炸！摆摊卖热销品，收益是平时的5倍！",
    },
    {
      id: "fest_shopping_warehouse",
      name: "节日仓库搬运",
      icon: "📦",
      location: "wholesaleMarket",
      pay: 160,
      apCost: 20,
      desc: "双节备货旺季，批发仓库搬运需求激增，轻松赚体力钱",
    },
  ],
};

/** 获取节日NPC专属台词（返回字符串或null） */
function getFestivalNpcLine(npcId, state) {
  var f = getCurrentFestival(state.player.day);
  if (!f) return null;
  if (typeof NPCS === "undefined") return null;
  for (var i = 0; i < NPCS.length; i++) {
    var npc = NPCS[i];
    if (npc.id !== npcId) continue;
    if (!npc.festivalLines) return null;
    var line = npc.festivalLines[f.id];
    return line || null;
  }
  return null;
}

/** 获取节日价格修正说明文本（用于交易界面提示） */
function getFestivalPriceNote(state) {
  // 余震清仓期提示
  if (isShoppingClearancePeriod(state)) {
    var daysLeft2 = state.flags._shoppingClearanceEndDay - state.player.day;
    return (
      "📉 剁手节清仓（还剩" +
      daysLeft2 +
      "天）：日用品-18%, 服装-22%, 电子-20%（进货好时机）"
    );
  }
  var f = getCurrentFestival(state.player.day);
  if (!f || !f.priceMods) return "";
  var doy = state.player.day % 365;
  var daysLeft = f.startDay + f.duration - doy;
  var parts = [];
  Object.keys(f.priceMods).forEach(function (cat) {
    var mod = f.priceMods[cat];
    var pct = Math.round((mod - 1) * 100);
    parts.push(getFestivalCategoryName(cat) + (pct > 0 ? "+" : "") + pct + "%");
  });
  return (
    f.icon + " " + f.name + "（还剩" + daysLeft + "天）：" + parts.join("，")
  );
}

// ====== 春节7天特殊活动调度 ======

/**
 * 获取春节当天的特殊活动（如果当天有）
 * @param {number} dayOffset - 春节内的天偏移（0=除夕，1=初一，...6=初六）
 * @returns {Object|null} 活动定义或null
 */
function getSpringFestivalEvent(dayOffset) {
  for (var i = 0; i < SPRING_FESTIVAL_EVENTS.length; i++) {
    if (SPRING_FESTIVAL_EVENTS[i].dayOffset === dayOffset) {
      return SPRING_FESTIVAL_EVENTS[i];
    }
  }
  return null;
}

/**
 * 检查并触发春节特殊活动
 * 在每日结算时调用（DAILY_PIPELINE）
 */
function checkSpringFestivalEvents(state) {
  var f = getCurrentFestival(state.player.day);
  if (!f || f.id !== "spring_festival") return;

  var doy = state.player.day % 365;
  var dayOffset = doy - f.startDay; // 0-6

  if (dayOffset < 0 || dayOffset > 6) return;

  var year = Math.floor(state.player.day / 365);
  var flagKey = "_springFestEvent_" + dayOffset + "_y" + year;

  if (state.flags[flagKey]) return; // 已触发过

  var eventDef = getSpringFestivalEvent(dayOffset);
  if (!eventDef) return;

  state.flags[flagKey] = true;

  // 调度为待弹事件
  state._pendingEvent = {
    id: "spring_fest_day" + dayOffset,
    phase: state.player.phase,
    icon: eventDef.icon,
    title: eventDef.title,
    story: eventDef.desc,
    choices: eventDef.choices,
    _isSpringFestivalEvent: true,
  };
  state._pendingEventId = "spring_fest_day" + dayOffset;

  // 延迟弹窗
  setTimeout(function () {
    var s = StateManager.getState();
    if (
      s._pendingEvent &&
      s._pendingEventId === "spring_fest_day" + dayOffset
    ) {
      if (typeof showEventModal === "function") {
        showEventModal(s._pendingEvent);
      }
      if (typeof playSound === "function") playSound("event");
    }
  }, 50);

  StateManager.addMessage(
    eventDef.icon + " 【春节第" + (dayOffset + 1) + "天】" + eventDef.title,
    "event",
  );

  // 追踪春节参与天数（用于成就：春节全勤）
  var participatedKey = "_springFestDaysParticipated_y" + year;
  if (!state.flags[participatedKey]) {
    state.flags[participatedKey] = 0;
  }
  state.flags[participatedKey] = Math.min(
    7,
    (state.flags[participatedKey] || 0) + 1,
  );
  if (state.flags[participatedKey] >= 7) {
    state.flags._springFestivalAchieveFullAttendance = true; // 成就：春节全勤
  }
}

// ====== 季节性价格波动 ======

/**
 * 获取当前季节的价格修正
 * @param {Object} state - 游戏状态
 * @returns {Object} 价格修正对象
 */
function getSeasonalPriceMod(state) {
  var season = getCurrentSeason(state.player.day);
  if (!season) return {};
  return SEASONAL_PRICE_MODS[season.id] || {};
}

/**
 * 获取商品分类的综合价格修正（节日 + 季节）
 * @param {Object} state - 游戏状态
 * @param {string} category - 商品分类
 * @returns {number} 综合价格修正乘数
 */
function getCombinedPriceMod(state, category) {
  var mod = 1.0;

  // 节日修正
  var festMod = getFestivalPriceMod(state, category);
  mod *= festMod;

  // 季节修正
  var seasonMod = getSeasonalPriceMod(state)[category];
  if (seasonMod) {
    mod *= seasonMod;
  }

  return mod;
}

/**
 * 获取季节名称
 */
function getSeasonName(day) {
  var season = getCurrentSeason(day);
  return season ? season.name : "冬季";
}

/**
 * 获取季节图标
 */
function getSeasonIcon(day) {
  var season = getCurrentSeason(day);
  return season ? season.icon : "❄️";
}

/**
 * 获取季节描述
 */
function getSeasonDesc(day) {
  var season = getCurrentSeason(day);
  if (!season) return "寒冬腊月";
  var descs = {
    spring: "春暖花开，万物复苏",
    summer: "烈日炎炎，酷暑难耐",
    autumn: "秋高气爽，丹桂飘香",
    winter: "寒风凛冽，岁末年终",
  };
  return descs[season.id] || "";
}

// ====== 节日/季节综合提示 ======

/**
 * 获取当前节日+季节的综合提示文本（用于UI展示）
 */
function getSeasonFestivalTip(state) {
  var season = getCurrentSeason(state.player.day);
  var festival = getCurrentFestival(state.player.day);

  var parts = [];

  if (season) {
    parts.push(
      season.icon + " " + season.name + "：" + getSeasonDesc(state.player.day),
    );
  }

  if (festival) {
    parts.push(
      festival.icon +
        " " +
        festival.name +
        "（还剩" +
        (festival.startDay + festival.duration - (state.player.day % 365)) +
        "天）",
    );
  }

  // 季节性价格提示
  var seasonMods = getSeasonalPriceMod(state);
  var hotBuy = [];
  var hotSell = [];
  for (var cat in seasonMods) {
    var catName = getFestivalCategoryName(cat);
    if (seasonMods[cat] < 0.9) {
      hotBuy.push(catName);
    } else if (seasonMods[cat] > 1.1) {
      hotSell.push(catName);
    }
  }

  if (hotBuy.length > 0) {
    parts.push("💡 进货好时机：" + hotBuy.join("、") + "降价中");
  }
  if (hotSell.length > 0) {
    parts.push("💡 卖出好时机：" + hotSell.join("、") + "涨价中");
  }

  return parts.join(" | ");
}
