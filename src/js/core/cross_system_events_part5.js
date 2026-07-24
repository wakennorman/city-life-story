/**
 * 跨系统联动事件 — 拆分片段 5/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart5Loaded) return;
  RANDOM_EVENTS._crossPart5Loaded = true;

  RANDOM_EVENTS.push({
    id: "l20_r82_skill_english_job",

    phase: "street",

    icon: "🌐",

    title: "外贸岗的机会",

    story: "单位来了笔涉外业务，主管扫了眼花名册：「谁英语还行？上来顶一下。」",

    // conditions：英语技能 + 已就业（技能×职业空白区）

    conditions: function (st) {
      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 英语等级

      if (typeof eng !== "number" || eng < 20) return false; // 检查 english>=20

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已就业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._r82EngJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🌐 顶上去",

        hint: "现金+ 英语+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 25;

          if (st.relationships && st.relationships.boss_li) {
            if (!st.relationships.boss_li.met)
              st.relationships.boss_li = { affinity: 0, met: true };

            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 3,
            );
          }

          st.flags._r82EngJob = true;

          StateManager.addMessage(
            "你顶下涉外业务，落袋¥260，主管更器重你。",

            "success",
          );
        },
      },

      {
        text: "🙅 怕出岔",

        hint: "轻量 英语+",

        apply: function (st) {
          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 12;

          st.flags._r82EngJob = true;

          StateManager.addMessage(
            "你怕出岔子婉拒了，私下把英语又练了练。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r82_talent_sidehustle",

    phase: "street",

    icon: "📦",

    title: "带队做副业",

    story: "你点亮了带队管理的天赋，副业里招呼起几个帮手，效率一下子上来了。",

    // conditions：已激活带队管理天赋 + 副业进行中（天赋×副业空白区）

    conditions: function (st) {
      if (!st.talentNodes || !st.talentNodes["management_crew_lead"])
        return false; // 检查 天赋节点

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._r82TalSh) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "📦 扩副业规模",

        hint: "现金+ 副业口碑+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          if (st.sideHustle)
            st.sideHustle.reputation = Math.min(
              100,

              (st.sideHustle.reputation || 0) + 6,
            );

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._r82TalSh = true;

          StateManager.addMessage(
            "你带队扩了副业规模，落袋¥240，口碑涨，人也累。",

            "success",
          );
        },
      },

      {
        text: "🤝 稳着带",

        hint: "轻量 副业口碑+",

        apply: function (st) {
          if (st.sideHustle)
            st.sideHustle.reputation = Math.min(
              100,

              (st.sideHustle.reputation || 0) + 3,
            );

          st.flags._r82TalSh = true;

          StateManager.addMessage("你稳着带队，副业口碑慢慢涨了起来。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r83_era_mature_sidehustle",

    phase: "street",

    icon: "📈",

    title: "成熟期的副业盘",

    story: "经济迈入成熟期，你的副业也稳了下来，每月进项成了定数。",

    // conditions：成熟期 + 副业进行中（时代×副业空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era || era.stageId !== "mature") return false; // 检查 成熟期

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 后期

      if (st.flags && st.flags._r83MatureSh) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "📈 稳住盘",

        hint: "现金+ 副业口碑+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          if (st.sideHustle)
            st.sideHustle.reputation = Math.min(
              100,

              (st.sideHustle.reputation || 0) + 5,
            );

          st.flags._r83MatureSh = true;

          StateManager.addMessage(
            "成熟期里你稳住副业盘，落袋¥280，进项更稳。",

            "success",
          );
        },
      },

      {
        text: "🛡️ 落袋为安",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          st.flags._r83MatureSh = true;

          StateManager.addMessage("你落袋为安，先收了¥160，谨慎为上。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r83_rep_slum_needs",

    phase: "street",

    icon: "🍲",

    title: "贫民区的互助灶",

    story: "你在贫民区人缘好，街坊支起互助灶，喊你一块儿搭把手、分口热饭。",

    // conditions：贫民区声望 + 饥饿低（声望×需求空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.slum || 0) < 20) return false; // 检查 贫民区声望>=20

      var hun = st.needs && st.needs.hunger; // 检查 饥饿

      if (typeof hun !== "number" || hun >= 30) return false; // 检查 饥饿<30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r83SlumNeeds) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🍲 搭把手",

        hint: "饥饿+ 贫民区声望+ 好感+",

        apply: function (st) {
          if (st.needs)
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 30);

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 3);

          st.flags._r83SlumNeeds = true;

          StateManager.addMessage(
            "你搭了把手，吃饱了，贫民区里更有人缘。",

            "success",
          );
        },
      },

      {
        text: "🙏 沾个光",

        hint: "轻量 饥饿+",

        apply: function (st) {
          if (st.needs)
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 18);

          st.flags._r83SlumNeeds = true;

          StateManager.addMessage(
            "你不好意思白吃，只盛了半碗，也暖了胃。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r83_skill_management_npc",

    phase: "street",

    icon: "🤝",

    title: "黄哥的合伙邀约",

    story: "黄哥看你办事有条理：「兄弟，你这管理脑子，咱俩搭伙干票大的？」",

    // conditions：管理技能 + 已结识黄哥（技能×NPC空白区）

    conditions: function (st) {
      var mg = st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级

      if (typeof mg !== "number" || mg < 15) return false; // 检查 management>=15

      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._r83MgNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🤝 搭伙干",

        hint: "现金+ 好感+ 管理+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 5,
            );

          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 20;

          st.flags._r83MgNpc = true;

          StateManager.addMessage(
            "你与黄哥搭伙，落袋¥300，管理也更老练。",

            "success",
          );
        },
      },

      {
        text: "🙅 再看看",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 2,
            );

          st.flags._r83MgNpc = true;

          StateManager.addMessage("你谢过黄哥，说再看看，他笑着点头。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r84_npc_oldzhou_morality",

    phase: "street",

    icon: "🤝",

    title: "老周的托付",

    story:
      "老周信你为人，把一桩要紧又体面的差事托付给你：「这活儿，我只放心你。」",

    // conditions：已结识老周且好感 + 道德达标（NPC×道德空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 20) return false; // 检查 好感>=20

      if ((st.player.morality || 0) < 40) return false; // 检查 道德>=40

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._r84OzMor) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🤝 接下托付",

        hint: "现金+ 好感+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 5,
            );

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._r84OzMor = true;

          StateManager.addMessage(
            "你接下老周的托付，落袋¥280，名声也跟着好。",

            "success",
          );
        },
      },

      {
        text: "🙏 慎重些",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 2,
            );

          st.flags._r84OzMor = true;

          StateManager.addMessage("你先慎重打听了下，老周更信你稳重。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r84_skill_coding_rep",

    phase: "street",

    icon: "🖥️",

    title: "开源圈的认可",

    story: "你在科技园攒下的口碑传开了，开源圈有人邀你共建项目，署名权都给你。",

    // conditions：编程技能 + 科技园声望（技能×声望空白区）

    conditions: function (st) {
      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 编程等级

      if (typeof cod !== "number" || cod < 25) return false; // 检查 coding>=25

      if (!st.reputation || (st.reputation.techPark || 0) < 25) return false; // 检查 科技园声望>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 后期

      if (st.flags && st.flags._r84CodeRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🖥️ 接共建",

        hint: "现金+ 编程+ 科技园声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 5,
            );

          st.flags._r84CodeRep = true;

          StateManager.addMessage(
            "你接下共建，落袋¥320，在圈里更受认可。",

            "success",
          );
        },
      },

      {
        text: "🙅 精力有限",

        hint: "轻量 科技园声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 2,
            );

          st.flags._r84CodeRep = true;

          StateManager.addMessage("你精力有限婉拒了，但口碑仍在涨。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r84_weather_stormy_npc",

    phase: "street",

    icon: "🌧️",

    title: "陈厨厨房进水",

    story: "暴雨灌进陈厨的厨房，他着急喊你：「快搭把手，别让灶台泡了！」",

    // conditions：暴雨天气 + 已结识陈厨且好感（天气×NPC空白区）

    conditions: function (st) {
      if (st.weather && st.weather.current !== "stormy") return false; // 检查 暴雨

      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 15) return false; // 检查 好感>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._r84StormNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🌧️ 帮陈厨挡水",

        hint: "好感+ 厨艺+ 现金+",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 6,
            );

          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;

          st.resources.cash = (st.resources.cash || 0) + 80;

          st.flags._r84StormNpc = true;

          StateManager.addMessage(
            "你帮陈厨挡住进水，他连谢带塞给你¥80，厨艺也没落下。",

            "success",
          );
        },
      },

      {
        text: "🙇 量力而行",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 2,
            );

          st.flags._r84StormNpc = true;

          StateManager.addMessage("你量力帮了把手，陈厨记下了这份情。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r85_npc_sisterwu_needs",

    phase: "street",

    icon: "🍢",

    title: "吴姐的宵夜",

    story:
      "吴姐看你一整天闷着脸，二话不说拉你去吃宵夜：「活着就得有点乐子，别跟自己过不去。」",

    // conditions：已结识吴姐且好感达标 + 心情低落（NPC×需求空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 15) return false; // 检查 好感>=15

      if ((st.needs.happiness || 0) >= 40) return false; // 检查 心情偏低

      if (st.flags && st.flags._r85SwNeed) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍢 跟着去",

        hint: "心情+ 好感+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 14);

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 3,
            );

          st.flags._r85SwNeed = true;

          StateManager.addMessage(
            "一顿宵夜下肚，你松了口气，跟吴姐也更亲近了。",

            "success",
          );
        },
      },

      {
        text: "🙏 婉拒好意",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 1,
            );

          st.flags._r85SwNeed = true;

          StateManager.addMessage(
            "你婉拒了，但记下了吴姐这份热乎劲儿。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r85_skill_coding_elec",

    phase: "street",

    icon: "💡",

    title: "智能改造接私活",

    story:
      "你拿编程逻辑配上电工手艺，给出租屋装了套智能温控，邻里看了都来打听谁干的。",

    // conditions：编程+电工双技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.coding && st.skills.coding.level >= 3))
        return false; // 检查 编程≥3

      if (!(
        st.skills &&
        st.skills.electrician &&
        st.skills.electrician.level >= 1
      ))
        return false; // 检查 电工≥1

      if (st.flags && st.flags._r85CodeElec) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下私活",

        hint: "现金+ 编程+ 电工+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 20;

          if (st.skills && st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 15;

          st.flags._r85CodeElec = true;

          StateManager.addMessage(
            "你接下几单智能改造，落袋¥220，手艺也更精了。",

            "success",
          );
        },
      },

      {
        text: "🏠 先顾自己",

        hint: "轻量 心情+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.flags._r85CodeElec = true;

          StateManager.addMessage("你先把自家弄舒坦，住着顺心不少。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r85_weather_heat_drive",

    phase: "street",

    icon: "🚕",

    title: "热浪跑车忙",

    story: "热浪滚滚，街上没人想走路，打车需求暴涨，你跑车副业忙得脚不沾地。",

    // conditions：热浪天气 + 跑车副业进行中（天气×副业空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "heatwave") return false; // 检查 热浪

      if (!(
        st.sideHustle &&
        st.sideHustle.active &&
        st.sideHustle.type === "driving"
      ))
        return false; // 检查 跑车副业

      if (st.flags && st.flags._r85HeatDrive) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔥 趁热加单",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 18);

          st.flags._r85HeatDrive = true;

          StateManager.addMessage(
            "你趁着热浪多跑几单，进账¥160，人也累瘫了。",

            "success",
          );
        },
      },

      {
        text: "🛑 见好就收",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 90;

          st.flags._r85HeatDrive = true;

          StateManager.addMessage(
            "你跑够本就收，落袋¥90，没把自己累坏。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r86_era_growth_mgmt",

    phase: "street",

    icon: "📈",

    title: "扩张期牵头",

    story:
      "经济踏入扩张期，管理人才正吃香，你凭着攒下的管理本事被相中，牵头一个小项目。",

    // conditions：时代为扩张期 + 管理技能达标（时代×技能空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 时代已初始化

      if (era.stageId !== "growth") return false; // 检查 扩张期

      if (!(
        st.skills &&
        st.skills.management &&
        st.skills.management.level >= 2
      ))
        return false; // 检查 管理≥2

      if (st.flags && st.flags._r86EraMgmt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📋 接下项目",

        hint: "现金+ 名声+ 管理+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 18;

          st.flags._r86EraMgmt = true;

          StateManager.addMessage(
            "你牵头项目成了事，落袋¥200，名声和管理都涨了。",

            "success",
          );
        },
      },

      {
        text: "🐢 缓一缓",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._r86EraMgmt = true;

          StateManager.addMessage(
            "你先缓着，但这次露脸还是让人记住了你。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r86_rep_bank_loan",

    phase: "street",

    icon: "🏦",

    title: "银行优待",

    story: "你在银行圈口碑不赖，这回办贷款，经理痛快给了你一笔优惠利率。",

    // conditions：银行声望达标（声望×贷款空白区）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.bank; // 检查 银行声望

      if ((rep || 0) < 20) return false; // 检查 声望>=20

      if (st.flags && st.flags._r86RepLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💰 借低息款",

        hint: "现金+ 负债+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;

          st.resources.bankDebt = (st.resources.bankDebt || 0) + 500;

          st.flags._r86RepLoan = true;

          StateManager.addMessage(
            "你用银行优待借到低息¥500，手头一下宽裕了。",

            "success",
          );
        },
      },

      {
        text: "🙅 暂不借",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 2);

          st.flags._r86RepLoan = true;

          StateManager.addMessage("你这回没借，但银行更认你的信誉了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r86_talent_weld_job",

    phase: "street",

    icon: "🔥",

    title: "焊接天赋救急",

    story:
      "工厂主业赶上一批急活，你早先点亮的焊接天赋正好派上用场，工头对你另眼相看。",

    // conditions：已激活焊接天赋 + 有主业在身（天赋×职业空白区）

    conditions: function (st) {
      var hasWeld =
        st.talentNodes &&
        Object.keys(st.talentNodes).some(function (k) {
          return k.indexOf("weld") >= 0;
        }); // 检查 焊接天赋

      if (!hasWeld) return false; // 检查 天赋已点亮

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r86WeldJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🛠 顶上去",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          if (
            st.employment &&
            st.employment.currentJob &&
            st.employment.currentJob.reputation !== undefined
          )
            st.employment.currentJob.reputation = Math.min(
              100,

              (st.employment.currentJob.reputation || 0) + 5,
            );

          st.flags._r86WeldJob = true;

          StateManager.addMessage(
            "你顶下急活，工头记了功，还多拿了¥150。",

            "success",
          );
        },
      },

      {
        text: "🤝 带新人",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r86WeldJob = true;

          StateManager.addMessage(
            "你带着新人把活儿啃下来，落了个好名声。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r87_morality_rep",

    phase: "street",

    icon: "🌟",

    title: "厚道人的生意",

    story: "你平日厚道，商业区里渐渐有了名号，这回有桩踏实买卖主动找上门。",

    // conditions：道德达标 + 商业区声望达标（道德×声望空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 60) return false; // 检查 道德>=60

      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望

      if ((rep || 0) < 15) return false; // 检查 声望>=15

      if (st.flags && st.flags._r87MorRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🤝 接下买卖",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 240;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 4,
            );

          st.flags._r87MorRep = true;

          StateManager.addMessage(
            "厚道救了你一回，这桩买卖落袋¥240，商业区名号更响。",

            "success",
          );
        },
      },

      {
        text: "🙏 让利邻里",

        hint: "轻量 声望+ 名声+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 3,
            );

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r87MorRep = true;

          StateManager.addMessage(
            "你把赚头让了些给邻里，声望名声都涨了。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r87_needs_fatigue_career",

    phase: "street",

    icon: "😪",

    title: "累垮的主业",

    story: "连轴转的主业把你熬得够呛，今天眼皮直打架，活儿都快拿不稳了。",

    // conditions：疲劳度高 + 有主业在身（需求×职业空白区）

    conditions: function (st) {
      if ((st.needs.fatigue || 0) < 70) return false; // 检查 疲劳>=70

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r87FatCareer) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "😴 请半天假",

        hint: "疲劳- 现金-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60);

          st.flags._r87FatCareer = true;

          StateManager.addMessage(
            "你咬牙请了半天假，缓过劲来，少挣了¥60。",

            "info",
          );
        },
      },

      {
        text: "💪 硬扛",

        hint: "轻量 现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 80;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._r87FatCareer = true;

          StateManager.addMessage("你硬扛下来多挣¥80，人却更累了。", "success");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r87_skill_english_npc",

    phase: "street",

    icon: "🗣",

    title: "小美的翻译活",

    story: "小美接了笔涉外活儿卡在英文上，得知你英语不错，红着脸来请你搭把手。",

    // conditions：英语技能达标 + 已结识小美（技能×NPC空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.english && st.skills.english.level >= 3))
        return false; // 检查 英语≥3

      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.flags && st.flags._r87EnNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🗣 帮她翻",

        hint: "现金+ 好感+ 英语+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 130;

          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 5,
            );

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 15;

          st.flags._r87EnNpc = true;

          StateManager.addMessage(
            "你帮小美翻完材料，她千恩万谢，还塞给你¥130。",

            "success",
          );
        },
      },

      {
        text: "🤝 顺手教她",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 3,
            );

          st.flags._r87EnNpc = true;

          StateManager.addMessage(
            "你没接钱，反倒教了她几句，小美更服你。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r88_era_decline_cash",

    phase: "street",

    icon: "📉",

    title: "衰退期紧日子",

    story: "经济滑入衰退，钱越来越毛，你兜里本就不宽裕，这月更是紧巴巴。",

    // conditions：时代为衰退期 + 现金偏低（时代×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 时代已初始化

      if (era.stageId !== "decline") return false; // 检查 衰退期

      if ((st.resources.cash || 0) >= 300) return false; // 检查 现金偏低

      if (st.flags && st.flags._r88DeclineCash) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🪙 开源节流",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._r88DeclineCash = true;

          StateManager.addMessage(
            "衰退里你抠着花、勤着挣，攒下¥120，名声没掉。",

            "success",
          );
        },
      },

      {
        text: "😣 叹口气",

        hint: "轻量 心情-",

        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);

          st.flags._r88DeclineCash = true;

          StateManager.addMessage(
            "你对着空钱包叹了口气，心里有点发毛。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r88_npc_oldzhou_weather",

    phase: "street",

    icon: "☔",

    title: "老周雨中搭手",

    story: "下雨天，老周在屋檐下正发愁货物淋湿，一眼瞧见你，招手让你搭把手。",

    // conditions：已结识老周 + 雨天（NPC×天气空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "rainy") return false; // 检查 雨天

      if (st.flags && st.flags._r88OzRain) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "☔ 帮老周搬",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 90;

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 4,
            );

          st.flags._r88OzRain = true;

          StateManager.addMessage(
            "你和老周把货抢进屋，他塞给你¥90，好感也涨了。",

            "success",
          );
        },
      },

      {
        text: "🤝 聊两句",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 2,
            );

          st.flags._r88OzRain = true;

          StateManager.addMessage(
            "你陪老周在檐下聊了会儿，雨停了人情也近了。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r88_skill_sales_location",

    phase: "street",

    icon: "🛒",

    title: "商圈里的嘴皮子",

    story:
      "你在商业区溜达，凭着过硬的推销本事，三两句话帮摊主清了批压箱底的货。",

    // conditions：销售技能达标 + 身处商业区（技能×地点空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.sales && st.skills.sales.level >= 2))
        return false; // 检查 销售≥2

      if (!(st.trade && st.trade.currentLocation === "commercialDist"))
        return false; // 检查 商业区

      if (st.flags && st.flags._r88SalesLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🛒 抽成",

        hint: "现金+ 销售+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 140;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;

          st.flags._r88SalesLoc = true;

          StateManager.addMessage(
            "你帮摊主清货抽成¥140，嘴皮子也更利索了。",

            "success",
          );
        },
      },

      {
        text: "🤝 换人情",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 3,
            );

          st.flags._r88SalesLoc = true;

          StateManager.addMessage(
            "你没要钱，换了摊主一个人情，商圈里有了口碑。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r89_actionfreq_career",

    phase: "street",

    icon: "📊",

    title: "熟手被点名",

    story: "你日复一日地干，手法早成了熟手，这回主管直接点名让你带班。",

    // conditions：行为频次累计达标 + 有主业（行为频次×职业空白区）

    conditions: function (st) {
      var af = st.stats && st.stats.actionFreq; // 检查 行为频次

      var total = 0;

      if (af) for (var k in af) total += af[k]; // 累加 各动作点击

      if (total < 40) return false; // 检查 累计>=40

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r89AfCareer) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "👔 带班",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r89AfCareer = true;

          StateManager.addMessage(
            "你带班顺手，多挣¥160，主管也高看你一眼。",

            "success",
          );
        },
      },

      {
        text: "🙆 推给同伴",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships) {
            var ids = ["boss_li", "old_zhou", "sister_wu"];

            for (var i = 0; i < ids.length; i++) {
              var r = st.relationships[ids[i]];

              if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 2);
            }
          }

          st.flags._r89AfCareer = true;

          StateManager.addMessage(
            "你把机会让给同伴，几个相熟的人更念你的好。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r89_npc_auntwang_morality",

    phase: "street",

    icon: "🧶",

    title: "王姨的托付",

    story:
      "王姨信你是个实诚孩子，把攒的一桩体面差事悄悄托付给你，嘱你别糊弄人。",

    // conditions：已结识王姨 + 道德达标（NPC×道德空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.aunt_wang; // 检查 王姨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if ((st.player.morality || 0) < 50) return false; // 检查 道德>=50

      if (st.flags && st.flags._r89AwMor) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🧶 接下差事",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 170;

          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 4,
            );

          st.flags._r89AwMor = true;

          StateManager.addMessage(
            "你接下王姨的差事，落袋¥170，她直夸你靠谱。",

            "success",
          );
        },
      },

      {
        text: "🙏 量力而行",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 2,
            );

          st.flags._r89AwMor = true;

          StateManager.addMessage(
            "你掂量着接了半桩，王姨反而更信你稳当。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r89_skill_repair_needs",

    phase: "street",

    icon: "🔧",

    title: "脏乱里的巧手",

    story:
      "屋里乱得下不去脚，你凭着修理手艺把坏掉的物件一一拾掇好，环境利索了人也舒坦。",

    // conditions：修理技能达标 + 卫生偏低（技能×需求空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.repair && st.skills.repair.level >= 2))
        return false; // 检查 修理≥2

      if ((st.needs.hygiene || 0) >= 40) return false; // 检查 卫生偏低

      if (st.flags && st.flags._r89RepNeed) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔧 大扫除收拾",

        hint: "卫生+ 修理+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 30);

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;

          st.flags._r89RepNeed = true;

          StateManager.addMessage(
            "你拾掇完屋子，卫生好转，手艺也没荒废。",

            "success",
          );
        },
      },

      {
        text: "🪣 先凑合",

        hint: "轻量 卫生+",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 10);

          st.flags._r89RepNeed = true;

          StateManager.addMessage("你随便收拾了两下，总比之前强点。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r90_rep_slum_needs",

    phase: "street",

    icon: "🍚",

    title: "贫民区的饭",

    story: "你在贫民区口碑好，街坊看你饿着肚子，硬塞给你一碗热饭。",

    // conditions：贫民区声望达标 + 饥饿偏低（声望×需求空白区）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.slum; // 检查 贫民区声望

      if ((rep || 0) < 15) return false; // 检查 声望>=15

      if ((st.needs.hunger || 0) >= 50) return false; // 检查 饥饿偏低

      if (st.flags && st.flags._r90RepSlum) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍚 接着饭",

        hint: "饥饿+ 声望+",

        apply: function (st) {
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 35);

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 2);

          st.flags._r90RepSlum = true;

          StateManager.addMessage(
            "你接过街坊的热饭，肚子饱了，贫民区更认你。",

            "success",
          );
        },
      },

      {
        text: "🤝 回请街坊",

        hint: "轻量 声望+ 现金-",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 4);

          st.flags._r90RepSlum = true;

          StateManager.addMessage(
            "你掏¥40回请街坊，贫民区声望涨了一截。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r90_talent_coding_freelance",

    phase: "street",

    icon: "💻",

    title: "代码副业接单",

    story: "你点亮的那枚编程天赋，这回在接私单的副业里直接变出了真金白银。",

    // conditions：已激活编程天赋 + 自由职业副业进行中（天赋×副业空白区）

    conditions: function (st) {
      var hasCod =
        st.talentNodes &&
        Object.keys(st.talentNodes).some(function (k) {
          return k.indexOf("cod") >= 0;
        }); // 检查 编程天赋

      if (!hasCod) return false; // 检查 天赋已点亮

      if (!(
        st.sideHustle &&
        st.sideHustle.active &&
        st.sideHustle.type === "freelance"
      ))
        return false; // 检查 自由职业副业

      if (st.flags && st.flags._r90CodFree) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💻 多接一单",

        hint: "现金+ 编程+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 20;

          st.flags._r90CodFree = true;

          StateManager.addMessage(
            "你用天赋多接一单，落袋¥200，代码手感更熟。",

            "success",
          );
        },
      },

      {
        text: "🛡 稳着来",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.flags._r90CodFree = true;

          StateManager.addMessage("你没贪多，稳稳接了单，落袋¥120。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r90_weather_storm_npc",

    phase: "street",

    icon: "⛈️",

    title: "黄哥风暴夜",

    story: "暴风雨夜里，黄哥的摊子眼看要被掀翻，他扯着嗓子喊你搭把手。",

    // conditions：暴雨/风暴天气 + 已结识黄哥（天气×NPC空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "stormy" && w !== "typhoon") return false; // 检查 风暴/台风

      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (st.flags && st.flags._r90StormNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⛈ 冲出去帮",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 110;

          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 5,
            );

          st.flags._r90StormNpc = true;

          StateManager.addMessage(
            "你和黄哥死死压住摊子，他塞给你¥110，从此当你是过命的。",

            "success",
          );
        },
      },

      {
        text: "🤝 递根绳",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 2,
            );

          st.flags._r90StormNpc = true;

          StateManager.addMessage(
            "你递了根绳就躲雨，黄哥记下了这份意。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r91_morality_loan",

    phase: "street",

    icon: "🤝",

    title: "清白人的信用",

    story: "你向来厚道、从不赖账，银行查你信贷记录干干净净，主动给你提了额度。",

    // conditions：道德达标 + 无银行贷款负债（道德×贷款空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 60) return false; // 检查 道德>=60

      if ((st.resources.bankDebt || 0) > 0) return false; // 检查 无负债

      if (st.flags && st.flags._r91MorLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏦 提额度",

        hint: "名声+ 信用+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r91MorLoan = true;

          StateManager.addMessage(
            "银行给你提了信用额度，清白人的名声又涨了。",

            "success",
          );
        },
      },

      {
        text: "🙅 不借贷",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._r91MorLoan = true;

          StateManager.addMessage(
            "你本分度日不碰借贷，信用反而更牢靠。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r91_npc_chefchen_skill",

    phase: "street",

    icon: "🍳",

    title: "陈厨的点拨",

    story: "陈厨看你做饭有几分底子，乐得收你当个编外徒弟，手把手点拨两招。",

    // conditions：已结识陈厨 + 烹饪技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!(st.skills && st.skills.cooking && st.skills.cooking.level >= 2))
        return false; // 检查 烹饪≥2

      if (st.flags && st.flags._r91CcSkill) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍳 拜师学艺",

        hint: "烹饪+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 4,
            );

          st.flags._r91CcSkill = true;

          StateManager.addMessage(
            "陈厨倾囊相授，你厨艺大涨，师徒情也更厚。",

            "success",
          );
        },
      },

      {
        text: "🤝 搭把手",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 2,
            );

          st.flags._r91CcSkill = true;

          StateManager.addMessage(
            "你给陈厨搭了把手，他记下了你的勤快。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r91_skill_accounting_era",

    phase: "street",

    icon: "📒",

    title: "通胀里的账房",

    story: "物价飞涨的通胀期，懂账的你被请去帮小铺子理清楚一笔糊涂账。",

    // conditions：会计技能达标 + 通胀指数高（技能×时代空白区）

    conditions: function (st) {
      if (!(
        st.skills &&
        st.skills.accounting &&
        st.skills.accounting.level >= 2
      ))
        return false; // 检查 会计≥2

      var era = st._eraState; // 检查 时代状态

      if (
        !era ||
        typeof era.inflationIndex !== "number" ||
        era.inflationIndex < 1.3
      )
        return false; // 检查 通胀>=1.3

      if (st.flags && st.flags._r91AccEra) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📒 理清账",

        hint: "现金+ 会计+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          if (st.skills && st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 18;

          st.flags._r91AccEra = true;

          StateManager.addMessage(
            "你帮铺子理清通胀下的糊涂账，落袋¥180，算盘更精。",

            "success",
          );
        },
      },

      {
        text: "🤝 教老板算",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r91AccEra = true;

          StateManager.addMessage(
            "你没接钱，反倒教老板算账，落了个好名声。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r92_npc_bossli_fame",

    phase: "street",

    icon: "💼",

    title: "李总的赏识",

    story: "你在圈子里名声渐起，李总听人提起过你，这回特意递来话，想拢你入伙。",

    // conditions：已结识李总 + 名声达标（NPC×名声空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李总关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((st.player.fame || 0) < 20) return false; // 检查 名声>=20

      if (st.flags && st.flags._r92BlFame) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💼 应下邀约",

        hint: "现金+ 好感+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 5,
            );

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r92BlFame = true;

          StateManager.addMessage(
            "你应下李总邀约，落袋¥220，关系名声都更稳。",

            "success",
          );
        },
      },

      {
        text: "🤝 先观望",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 2,
            );

          st.flags._r92BlFame = true;

          StateManager.addMessage("你婉转观望，李总倒更看重你的沉稳。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r92_skill_welding_location",

    phase: "street",

    icon: "⚙️",

    title: "科技园的活计",

    story: "你在科技园晃悠，凭着一手焊接绝活，被临时拉去救了台卡壳的设备。",

    // conditions：焊接技能达标 + 身处科技园（技能×地点空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.welding && st.skills.welding.level >= 2))
        return false; // 检查 焊接≥2

      if (!(st.trade && st.trade.currentLocation === "techPark")) return false; // 检查 科技园

      if (st.flags && st.flags._r92WeldLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⚙ 接下抢修",

        hint: "现金+ 焊接+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 190;

          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 18;

          st.flags._r92WeldLoc = true;

          StateManager.addMessage(
            "你抢修好设备，落袋¥190，焊接手感更老道。",

            "success",
          );
        },
      },

      {
        text: "🤝 顺手教人",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r92WeldLoc = true;

          StateManager.addMessage("你顺手教了技术员两招，落了好名声。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r92_weather_typhoon_job",

    phase: "street",

    icon: "🌀",

    title: "台风天的班",

    story: "台风天，主业那边缺人手顶班，你硬着头皮去了，工钱给的是平时的双倍。",

    // conditions：台风天气 + 有主业在身（天气×职业空白区）

    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "typhoon" && w !== "stormy") return false; // 检查 台风/风暴

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r92TyJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌀 顶班",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 22);

          st.flags._r92TyJob = true;

          StateManager.addMessage(
            "你顶下台风天的班，拿双倍¥260，人累得够呛。",

            "success",
          );
        },
      },

      {
        text: "🏠 请假保命",

        hint: "轻量 疲劳-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);

          st.flags._r92TyJob = true;

          StateManager.addMessage("你台风天请了假躲在家，安全第一。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r93_era_mature_sales",

    phase: "street",

    icon: "🛍",

    title: "成熟期好买卖",

    story: "经济迈入成熟期，市面红火，你凭推销本事在热闹里做成了一笔好生意。",

    // conditions：时代为成熟期 + 销售技能达标（时代×技能空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 时代已初始化

      if (era.stageId !== "mature") return false; // 检查 成熟期

      if (!(st.skills && st.skills.sales && st.skills.sales.level >= 2))
        return false; // 检查 销售≥2

      if (st.flags && st.flags._r93MatSales) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🛍 做成生意",

        hint: "现金+ 销售+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 230;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 18;

          st.flags._r93MatSales = true;

          StateManager.addMessage(
            "成熟期的好买卖让你落袋¥230，嘴皮子更利。",

            "success",
          );
        },
      },

      {
        text: "🤝 帮衬邻里",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 3,
            );

          st.flags._r93MatSales = true;

          StateManager.addMessage(
            "你顺手帮衬了邻里生意，商业区口碑涨了。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r93_needs_happiness_npc",

    phase: "street",

    icon: "🫂",

    title: "张姐的开解",

    story:
      "你连着几天打不起精神，张姐瞧在眼里，拉你到一旁絮叨了阵子，把你逗乐了。",

    // conditions：心情低落 + 已结识张姐（需求×NPC空白区）

    conditions: function (st) {
      if ((st.needs.happiness || 0) >= 35) return false; // 检查 心情偏低

      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (st.flags && st.flags._r93HzNpc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🫂 听她絮叨",

        hint: "心情+ 好感+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 16);

          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 3,
            );

          st.flags._r93HzNpc = true;

          StateManager.addMessage(
            "张姐几句话把你逗乐，心情松快了，也觉着她亲。",

            "success",
          );
        },
      },

      {
        text: "🙏 笑笑收下",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 1,
            );

          st.flags._r93HzNpc = true;

          StateManager.addMessage("你笑着应了，张姐的关心你记下了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r93_talent_mgmt_career",

    phase: "street",

    icon: "🧠",

    title: "管理天赋上位",

    story: "你点亮的管理天赋在主业团队里显了形，上司破格让你牵头带个小队。",

    // conditions：已激活管理天赋 + 有主业在身（天赋×职业空白区）

    conditions: function (st) {
      var hasMgmt =
        st.talentNodes &&
        Object.keys(st.talentNodes).some(function (k) {
          return k.indexOf("mgmt") >= 0 || k.indexOf("manage") >= 0;
        }); // 检查 管理天赋

      if (!hasMgmt) return false; // 检查 天赋已点亮

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r93MgmtJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🧠 带小队",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 210;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._r93MgmtJob = true;

          StateManager.addMessage(
            "你带小队打出名堂，落袋¥210，上司越发倚重你。",

            "success",
          );
        },
      },

      {
        text: "🤝 让功同伴",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships) {
            var ids = ["boss_li", "sister_zhang", "sister_wu"];

            for (var i = 0; i < ids.length; i++) {
              var r = st.relationships[ids[i]];

              if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 2);
            }
          }

          st.flags._r93MgmtJob = true;

          StateManager.addMessage("你把功劳让给同伴，几个人都更服你。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r94_morality_fame_event",

    phase: "street",

    icon: "🌈",

    title: "厚道出了名",

    story: "你一贯厚道，街头巷尾都传你的好，这回干脆有人慕名找上门来结交。",

    // conditions：道德达标 + 名声达标（道德×名声空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 60) return false; // 检查 道德>=60

      if ((st.player.fame || 0) < 30) return false; // 检查 名声>=30

      if (st.flags && st.flags._r94MorFame) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌈 结交贵人",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          if (st.relationships) {
            var ids = ["sister_zhang", "old_zhou", "aunt_wang"];

            for (var i = 0; i < ids.length; i++) {
              var r = st.relationships[ids[i]];

              if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 2);
            }
          }

          st.flags._r94MorFame = true;

          StateManager.addMessage(
            "厚道出了名，贵人找上门，落袋¥260，名声人缘双收。",

            "success",
          );
        },
      },

      {
        text: "🤝 低调处之",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._r94MorFame = true;

          StateManager.addMessage("你低调应下，名声却已悄悄涨了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r94_npc_xiaomei_weather",

    phase: "street",

    icon: "⛅",

    title: "小美阴天邀约",

    story: "阴天里小美喊你陪她去挑点零碎物件，说两个人逛着才不冷清。",

    // conditions：已结识小美 + 阴天（NPC×天气空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      var w = st.weather && st.weather.current; // 检查 天气

      if (w !== "cloudy") return false; // 检查 阴天

      if (st.flags && st.flags._r94XmWeather) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⛅ 陪她逛",

        hint: "心情+ 好感+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);

          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 4,
            );

          st.flags._r94XmWeather = true;

          StateManager.addMessage(
            "你陪小美挑完零碎，阴天也不闷了，俩人更亲近。",

            "success",
          );
        },
      },

      {
        text: "🙏 改天吧",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 1,
            );

          st.flags._r94XmWeather = true;

          StateManager.addMessage("你约了改天，小美也没见怪。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l20_r94_skill_driving_rep",

    phase: "street",

    icon: "🚗",

    title: "老司机的口碑",

    story:
      "你开车稳当出了名，银行圈里有人点名要雇你跑趟长途接送，顺带结下交情。",

    // conditions：驾驶技能达标 + 银行声望达标（技能×声望空白区）

    conditions: function (st) {
      if (!(st.skills && st.skills.driving && st.skills.driving.level >= 2))
        return false; // 检查 驾驶≥2

      var rep = st.reputation && st.reputation.bank; // 检查 银行声望

      if ((rep || 0) < 15) return false; // 检查 声望>=15

      if (st.flags && st.flags._r94DriveRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚗 接长途",

        hint: "现金+ 声望+ 驾驶+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 3);

          if (st.skills && st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 15;

          st.flags._r94DriveRep = true;

          StateManager.addMessage(
            "你跑完长途接送，落袋¥200，银行圈口碑更稳。",

            "success",
          );
        },
      },

      {
        text: "🤝 捎带熟人",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships) {
            var ids = ["uncle_chen_bank", "sister_wu", "xiao_mei"];

            for (var i = 0; i < ids.length; i++) {
              var r = st.relationships[ids[i]];

              if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 2);
            }
          }

          st.flags._r94DriveRep = true;

          StateManager.addMessage("你顺路捎了几个熟人，人情攒得更厚。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r100_brotherhuang_location",

    phase: "street",

    icon: "🏭",

    title: "厂区遇黄哥",

    story: "你在厂区晃荡，撞见黄哥正发愁一批货没人搬，见你闲着，眼睛一亮。",

    // conditions：已结识黄哥且好感达标 + 身处厂区（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.trade || st.trade.currentLocation !== "factoryZone") return false; // 检查 厂区

      if (st.flags && st.flags._r100BhLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏭 搭手搬货",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 170;

          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 3,
            );

          st.flags._r100BhLoc = true;

          StateManager.addMessage(
            "你帮黄哥搬完货，落袋¥170，他直拍你肩膀。",

            "success",
          );
        },
      },

      {
        text: "🤝 帮衬两句",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.brother_huang)
            st.relationships.brother_huang.affinity = Math.min(
              100,

              st.relationships.brother_huang.affinity + 1,
            );

          st.flags._r100BhLoc = true;

          StateManager.addMessage("你帮黄哥张罗了两句，人情攒下了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r100_era_initial_learn",

    phase: "street",

    icon: "🌱",

    title: "开局学艺时",

    story:
      "城里还一片生疏，你正值两手空空，倒也正经是个埋头学艺、攒本钱的好时候。",

    // conditions：时代初期 + 技能尚浅（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "initial") return false; // 检查 初期

      if (!st.skills) return false;

      var total = 0;

      for (var k in st.skills) {
        if (st.skills[k] && st.skills[k].level) total += st.skills[k].level;
      }

      if (total >= 20) return false; // 检查 技能尚浅

      if (st.flags && st.flags._r100EraInit) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌱 埋头学艺",

        hint: "经验+ 现金-",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 20;

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);

          st.flags._r100EraInit = true;

          StateManager.addMessage(
            "开局你闷头学艺，花¥20添了家什，底子慢慢厚了。",

            "success",
          );
        },
      },

      {
        text: "👀 先观望",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 10;

          st.flags._r100EraInit = true;

          StateManager.addMessage("你先观望行情，顺手捡了点门道。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r100_morality_donate",

    phase: "street",

    icon: "🕊️",

    title: "心软的一次",

    story:
      "你手头宽裕，见着落难的人，想起自己最难时也有人拉过一把，便动了帮一把的念头。",

    // conditions：道德达标 + 现金充裕（道德×事件空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 70) return false; // 检查 道德>=70

      if ((st.resources.cash || 0) < 200) return false; // 检查 现金>=200

      if (st.flags && st.flags._r100MorDon) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🕊️ 帮一把",

        hint: "现金- 道德+ 名声+",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);

          st.player.morality = Math.min(100, (st.player.morality || 0) + 2);

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._r100MorDon = true;

          StateManager.addMessage(
            "你掏¥150帮了落难人，心里踏实，名声也跟着涨。",

            "success",
          );
        },
      },

      {
        text: "🙏 量力而行",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 1);

          st.flags._r100MorDon = true;

          StateManager.addMessage("你量力递了点零钱，善心未减。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r100_stormy_welding",

    phase: "street",

    icon: "⚡",

    title: "风雨里焊花",

    story:
      "暴风雨里厂房漏了雨，老师傅点名要会电焊的你顶上，蓝汪汪的焊花在雨幕里直闪。",

    // conditions：暴风雨天气 + 焊接技能达标（天气×技能空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "stormy") return false; // 检查 暴风雨

      if (
        !st.skills ||
        ((st.skills.welding && st.skills.welding.level) || 0) < 15
      )
        return false; // 检查 焊接>=15

      if (st.flags && st.flags._r100StormWeld) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "⚡ 冒雨焊上",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 230;

          st.skills.welding.xp = (st.skills.welding.xp || 0) + 35;

          st.flags._r100StormWeld = true;

          StateManager.addMessage(
            "风雨里你焊完漏点，落袋¥230，手上功夫更稳。",

            "success",
          );
        },
      },

      {
        text: "🛡️ 等雨小些",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.welding.xp = (st.skills.welding.xp || 0) + 12;

          st.flags._r100StormWeld = true;

          StateManager.addMessage("你等雨势稍歇再动手，慢工出细活。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r100_talent_driving",

    phase: "street",

    icon: "🚗",

    title: "天赋车感",

    story: "你点通了驾驶一道的天赋，方向盘在手里格外听话，跑起车来又快又稳。",

    // conditions：已激活天赋 + 驾驶副业（天赋×副业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 驾驶副业

      if (st.flags && st.flags._r100TalentDrv) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🚗 多接几单",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 250;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 14);

          st.flags._r100TalentDrv = true;

          StateManager.addMessage(
            "天赋车感让你多跑几单，落袋¥250，人也乏了些。",

            "success",
          );
        },
      },

      {
        text: "🛣️ 跑长途",

        hint: "轻量 现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r100TalentDrv = true;

          StateManager.addMessage(
            "你跑了一趟长途，落袋¥150，路上还攒了点名气。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r101_coding_freelance",

    phase: "street",

    icon: "💻",

    title: "自由接单",

    story: "你编程底子够厚，便在闲时挂出自由接单的牌子，键盘一敲就是进项。",

    // conditions：编程技能达标 + 自由职业副业（技能×副业空白区）

    conditions: function (st) {
      if (
        !st.skills ||
        ((st.skills.coding && st.skills.coding.level) || 0) < 20
      )
        return false; // 检查 编程>=20

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "freelance"
      )
        return false; // 检查 自由职业副业

      if (st.flags && st.flags._r101CodeFree) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💻 接个整包",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          st.skills.coding.xp = (st.skills.coding.xp || 0) + 40;

          st.flags._r101CodeFree = true;

          StateManager.addMessage(
            "你接下整包活儿，落袋¥300，代码更利落了。",

            "success",
          );
        },
      },

      {
        text: "🧩 只做散件",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.coding.xp = (st.skills.coding.xp || 0) + 18;

          st.flags._r101CodeFree = true;

          StateManager.addMessage("你只挑散件做，慢工细活，不贪多。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r101_era_decline_cash",

    phase: "street",

    icon: "🪙",

    title: "紧巴的日子",

    story:
      "景气一路往下掉，钱越来越不经花，你攥着兜里那点零钱，盘算着哪样能省。",

    // conditions：时代衰退期 + 现金偏低（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "decline") return false; // 检查 衰退期

      if ((st.resources.cash || 0) >= 150) return false; // 检查 现金<150

      if (st.flags && st.flags._r101EraDecCash) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🪙 紧着花",

        hint: "轻量 现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 70;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r101EraDecCash = true;

          StateManager.addMessage(
            "衰退年里你处处省着，意外攒下¥70，邻居夸你会过。",

            "success",
          );
        },
      },

      {
        text: "🔎 寻活补缺",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;

          st.flags._r101EraDecCash = true;

          StateManager.addMessage("你四处寻摸零活补缺，嘴皮子也练了。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r101_hygiene_low",

    phase: "street",

    icon: "🧼",

    title: "一身味儿",

    story: "你连着几天没顾上洗漱，身上泛起味儿，旁人靠近你都下意识退半步。",

    // conditions：卫生偏低（需求×事件空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.hygiene || 0) >= 30) return false; // 检查 卫生<30

      if (st.flags && st.flags._r101Hyg) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "🧼 好好洗个澡",

        hint: "卫生+ 现金-",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 35);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);

          st.flags._r101Hyg = true;

          StateManager.addMessage(
            "你花¥15冲了个热水澡，人清爽了，腰杆也直了。",

            "success",
          );
        },
      },

      {
        text: "🌬️ 凑合遮味",

        hint: "轻量 卫生+ 名声-",

        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 10);

          st.player.fame = Math.max(0, (st.player.fame || 0) - 2);

          st.flags._r101Hyg = true;

          StateManager.addMessage(
            "你喷了点东西遮味，可名声还是掉了些。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r101_sisterzhang_rep",

    phase: "street",

    icon: "👚",

    title: "张姐的照应",

    story:
      "你在贫民区攒下的好名气传到了张姐耳朵里，她找你搭把手，说信得过你这人。",

    // conditions：已结识张姐且好感达标 + 贫民区声望达标（NPC×声望空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.reputation || (st.reputation.slum || 0) < 20) return false; // 检查 贫民区声望>=20

      if (st.flags && st.flags._r101SzRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "👚 搭手张姐",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 3,
            );

          st.flags._r101SzRep = true;

          StateManager.addMessage(
            "你帮了张姐，落袋¥160，她越发信你。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙旧",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_zhang)
            st.relationships.sister_zhang.affinity = Math.min(
              100,

              st.relationships.sister_zhang.affinity + 1,
            );

          st.flags._r101SzRep = true;

          StateManager.addMessage("你陪张姐叙了叙旧，情谊比买卖金贵。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r101_welding_job",

    phase: "street",

    icon: "🔥",

    title: "焊工上位",

    story:
      "你点通了焊接天赋，又在厂里磨出手艺，老师傅干脆把要紧的活儿交你独当一面。",

    // conditions：已激活天赋 + 有主业 + 焊接达标（天赋×职业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (
        !st.skills ||
        ((st.skills.welding && st.skills.welding.level) || 0) < 10
      )
        return false; // 检查 焊接>=10

      if (st.flags && st.flags._r101WeldJob) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔥 独挑大梁",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 270;

          st.skills.welding.xp = (st.skills.welding.xp || 0) + 35;

          st.flags._r101WeldJob = true;

          StateManager.addMessage(
            "天赋加手艺让你独挑大梁，落袋¥270，焊花里见真章。",

            "success",
          );
        },
      },

      {
        text: "🤫 闷头精进",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.welding.xp = (st.skills.welding.xp || 0) + 18;

          st.flags._r101WeldJob = true;

          StateManager.addMessage(
            "你闷头把焊接磨得更精，不声不响攒本事。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r102_cloudy_mood",

    phase: "street",

    icon: "☁️",

    title: "阴天的闷",

    story: "连着阴天，不见日头，你心里也跟着发闷，干什么都提不起十分精神。",

    // conditions：阴天 + 心情偏低（天气×需求空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "cloudy") return false; // 检查 阴天

      if (!st.needs || (st.needs.happiness || 0) >= 40) return false; // 检查 心情<40

      if (st.flags && st.flags._r102Cloud) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "☁️ 出门透透气",

        hint: "心情+ 现金-",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 25);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);

          st.flags._r102Cloud = true;

          StateManager.addMessage(
            "你花了¥20出门遛了圈，阴霾散了些。",

            "success",
          );
        },
      },

      {
        text: "🏠 窝着发呆",

        hint: "轻量 心情+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          st.flags._r102Cloud = true;

          StateManager.addMessage(
            "你窝在屋里发了会儿呆，竟也松了口气。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r102_mgmt_career",

    phase: "street",

    icon: "📋",

    title: "管事的人",

    story: "你管理上道了，工头试着把一摊子事交你张罗，说正缺个能统揽的人。",

    // conditions：管理技能达标 + 有主业（技能×职业空白区）

    conditions: function (st) {
      if (
        !st.skills ||
        ((st.skills.management && st.skills.management.level) || 0) < 15
      )
        return false; // 检查 管理>=15

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r102Mgmt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📋 接手张罗",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 250;

          st.skills.management.xp = (st.skills.management.xp || 0) + 35;

          st.flags._r102Mgmt = true;

          StateManager.addMessage(
            "你接手一摊子事，落袋¥250，管人越发有谱。",

            "success",
          );
        },
      },

      {
        text: "🤝 帮衬不挑头",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.management.xp = (st.skills.management.xp || 0) + 16;

          st.flags._r102Mgmt = true;

          StateManager.addMessage("你只帮衬不挑头，稳稳攒着管理经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r102_rep_commercial",

    phase: "street",

    icon: "🏬",

    title: "商圈的信",

    story: "你在商圈攒下的信誉让摊位主肯赊你一批货，说信你这人不会赖账。",

    // conditions：商圈声望达标 + 现金充裕（声望×地点空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.commercialDist || 0) < 30)
        return false; // 检查 商圈声望>=30

      if ((st.resources.cash || 0) < 100) return false; // 检查 现金>=100

      if (st.flags && st.flags._r102RepComm) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏬 赊货倒卖",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 4,
            );

          st.flags._r102RepComm = true;

          StateManager.addMessage(
            "凭商圈信誉你赊货倒卖，落袋¥220，名声更硬。",

            "success",
          );
        },
      },

      {
        text: "🤝 只借不卖",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 2,
            );

          st.flags._r102RepComm = true;

          StateManager.addMessage(
            "你只借了点本钱，守信用，商圈里更立得住。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r102_sales_english",

    phase: "street",

    icon: "🗣️",

    title: "双语叫卖",

    story: "你既会吆喝又懂点外语，碰上外国客人竟能对答两句，摊前一下围了人。",

    // conditions：销售 + 英语双技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!st.skills) return false;

      if (((st.skills.sales && st.skills.sales.level) || 0) < 10) return false; // 检查 销售>=10

      if (((st.skills.english && st.skills.english.level) || 0) < 10)
        return false; // 检查 英语>=10

      if (st.flags && st.flags._r102SalesEng) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 双语揽客",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.skills.sales.xp = (st.skills.sales.xp || 0) + 20;

          st.skills.english.xp = (st.skills.english.xp || 0) + 20;

          st.flags._r102SalesEng = true;

          StateManager.addMessage(
            "双语叫卖引来了客，落袋¥200，两门手艺都长了。",

            "success",
          );
        },
      },

      {
        text: "🙂 只练不卖",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.english.xp = (st.skills.english.xp || 0) + 10;

          st.flags._r102SalesEng = true;

          StateManager.addMessage(
            "你拿外国客人练了练口语，没急着卖货。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r102_unclechen_bank",

    phase: "street",

    icon: "🏦",

    title: "陈叔的引路",

    story: "银行里的陈叔看重你在商圈的信用，悄悄引你走了条低息周转的门路。",

    // conditions：已结识陈叔且好感达标 + 银行声望达标（NPC×声望空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.uncle_chen_bank; // 检查 陈叔关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.reputation || (st.reputation.bank || 0) < 20) return false; // 检查 银行声望>=20

      if (st.flags && st.flags._r102UcBank) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏦 走这路周转",

        hint: "现金+ 债务+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;

          st.resources.debt = (st.resources.debt || 0) + 500;

          st.flags._r102UcBank = true;

          StateManager.addMessage(
            "陈叔引的低息门路让你周转¥500，记得按时还。",

            "success",
          );
        },
      },

      {
        text: "🤝 记着人情",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.bank = Math.min(100, (st.reputation.bank || 0) + 3);

          st.flags._r102UcBank = true;

          StateManager.addMessage(
            "你谢过陈叔，把这份人情记在心里，银行声望又涨。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r103_morality_volunteer",

    phase: "street",

    icon: "🤲",

    title: "街坊的义工",

    story: "社区招呼人义务帮孤老搬煤，你想着平日受人照拂，便卷起袖子去了。",

    // conditions：道德达标（道德×事件空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) < 60) return false; // 检查 道德>=60

      if (st.flags && st.flags._r103MorVol) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🤲 爽快应下",

        hint: "道德+ 心情+ 现金-",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);

          st.flags._r103MorVol = true;

          StateManager.addMessage(
            "你帮孤老搬完煤，花了¥20路费，心里却暖。",

            "success",
          );
        },
      },

      {
        text: "🕊️ 量力相助",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 1);

          st.flags._r103MorVol = true;

          StateManager.addMessage("你搭了把手就走，善念未减。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r103_sales_stall",

    phase: "street",

    icon: "🛒",

    title: "摊前要价",

    story: "你支起小摊，凭着一张利嘴把寻常物件说出了门道，路人忍不住驻足掏钱。",

    // conditions：销售技能达标 + 摆摊副业（技能×副业空白区）

    conditions: function (st) {
      if (!st.skills || ((st.skills.sales && st.skills.sales.level) || 0) < 10)
        return false; // 检查 销售>=10

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "stall"
      )
        return false; // 检查 摆摊副业

      if (st.flags && st.flags._r103SalesStall) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🛒 吆喝揽客",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 190;

          st.skills.sales.xp = (st.skills.sales.xp || 0) + 25;

          st.flags._r103SalesStall = true;

          StateManager.addMessage(
            "你摊前一阵吆喝，落袋¥190，嘴皮子更利了。",

            "success",
          );
        },
      },

      {
        text: "🤫 闷声卖",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.sales.xp = (st.skills.sales.xp || 0) + 12;

          st.flags._r103SalesStall = true;

          StateManager.addMessage("你闷声摆摊，不吆喝也出了几件。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r103_sunny_mood",

    phase: "street",

    icon: "🌞",

    title: "晴天的懒",

    story:
      "难得放晴，你却不知怎的高兴不起来，只想赖在墙根晒晒太阳，什么都不想干。",

    // conditions：晴天 + 心情偏低（天气×需求空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "sunny") return false; // 检查 晴天

      if (!st.needs || (st.needs.happiness || 0) >= 40) return false; // 检查 心情<40

      if (st.flags && st.flags._r103Sunny) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌞 晒着发呆",

        hint: "心情+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 20);

          st.flags._r103Sunny = true;

          StateManager.addMessage(
            "你赖在墙根晒了会儿太阳，心里的阴翳淡了。",

            "success",
          );
        },
      },

      {
        text: "🚶 散散步",

        hint: "轻量 心情+ 疲劳+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 6);

          st.flags._r103Sunny = true;

          StateManager.addMessage(
            "你顺着街散步，腿脚酸了，心情却松快。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r103_talent_stall",

    phase: "street",

    icon: "🎯",

    title: "摊上天赋",

    story:
      "你点通了摆摊一道的天赋，怎么陈列、怎么吆喝都摸到了门道，小摊生意旺起来。",

    // conditions：已激活天赋 + 摆摊副业（天赋×副业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "stall"
      )
        return false; // 检查 摆摊副业

      if (st.flags && st.flags._r103TalentStall) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🎯 趁势多卖",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 230;

          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 20;

          st.flags._r103TalentStall = true;

          StateManager.addMessage(
            "天赋加持下小摊旺了，落袋¥230，买卖更有谱。",

            "success",
          );
        },
      },

      {
        text: "🧊 稳着来",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.sales)
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 10;

          st.flags._r103TalentStall = true;

          StateManager.addMessage("你稳着出摊，天赋的红利慢慢攒。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r103_xiaomei_english",

    phase: "street",

    icon: "💄",

    title: "小美的外语角",

    story: "小美见你外语还行，拉你陪她练口语，顺带教你怎么用外语跟客人套近乎。",

    // conditions：已结识小美且好感达标 + 英语技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.english && st.skills.english.level) || 0) < 10
      )
        return false; // 检查 英语>=10

      if (st.flags && st.flags._r103XmEng) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💄 陪练口语",

        hint: "经验+ 好感+",

        apply: function (st) {
          st.skills.english.xp = (st.skills.english.xp || 0) + 25;

          if (st.relationships && st.relationships.xiao_mei)
            st.relationships.xiao_mei.affinity = Math.min(
              100,

              st.relationships.xiao_mei.affinity + 2,
            );

          st.flags._r103XmEng = true;

          StateManager.addMessage(
            "陪小美练了口语，英语涨了，两人也更熟。",

            "success",
          );
        },
      },

      {
        text: "📝 只学不练",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.english.xp = (st.skills.english.xp || 0) + 10;

          st.flags._r103XmEng = true;

          StateManager.addMessage("你光听小美讲，自己没开口，先记着。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r104_chefchen_location",

    phase: "street",

    icon: "🍜",

    title: "食街遇陈厨",

    story:
      "你在食街晃悠，正撞见陈厨蹲在摊前尝味儿，招手喊你过去品鉴他新琢磨的汤底。",

    // conditions：已结识陈厨且好感达标 + 身处食街（NPC×地点空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈厨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (!st.trade || st.trade.currentLocation !== "entertainment")
        return false; // 检查 食街

      if (st.flags && st.flags._r104CcLoc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍜 品鉴学艺",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 3,
            );

          st.flags._r104CcLoc = true;

          StateManager.addMessage(
            "你品了陈厨的汤底，厨艺涨了，两人更投缘。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.chef_chen)
            st.relationships.chef_chen.affinity = Math.min(
              100,

              st.relationships.chef_chen.affinity + 1,
            );

          st.flags._r104CcLoc = true;

          StateManager.addMessage("你陪陈厨聊了会儿，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r104_era_mature_invest",

    phase: "street",

    icon: "💹",

    title: "鼎盛期落子",

    story: "城里正鼎盛，有门路的人劝你把闲钱投进去，说这年景里钱生钱最划算。",

    // conditions：时代成熟期 + 现金充裕（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "mature") return false; // 检查 成熟期

      if ((st.resources.cash || 0) < 300) return false; // 检查 现金>=300

      if (st.flags && st.flags._r104EraInv) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💹 投一笔",

        hint: "现金+ 风险+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 350;

          st.resources.invested = (st.resources.invested || 0) + 300;

          st.flags._r104EraInv = true;

          StateManager.addMessage(
            "鼎盛年里你落子一投，落袋¥350，账面更好看了。",

            "success",
          );
        },
      },

      {
        text: "🧊 观望再说",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r104EraInv = true;

          StateManager.addMessage(
            "你没急着投，稳着看行情，落得个审慎名声。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r104_rep_techpark_freelance",

    phase: "street",

    icon: "🖥️",

    title: "科技园的外包",

    story:
      "你在科技园攒下的口碑引来外包单，对方点名要你这号靠得住的freelancer。",

    // conditions：科技园声望达标 + 自由职业副业（声望×副业空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.techPark || 0) < 30) return false; // 检查 科技园声望>=30

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "freelance"
      )
        return false; // 检查 自由职业副业

      if (st.flags && st.flags._r104TpFree) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🖥️ 接外包单",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 330;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 4,
            );

          st.flags._r104TpFree = true;

          StateManager.addMessage(
            "科技园外包单到手，落袋¥330，口碑更硬。",

            "success",
          );
        },
      },

      {
        text: "🤝 谈长期",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 2,
            );

          st.flags._r104TpFree = true;

          StateManager.addMessage(
            "你试着谈长期合作，对方记下了你这名号。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r104_stress_event",

    phase: "street",

    icon: "😣",

    title: "绷太紧了",

    story: "连着紧绷了好些天，你后半夜睁着眼睡不着，太阳穴一跳一跳地疼。",

    // conditions：心理压力偏高（心理压力×事件空白区）

    conditions: function (st) {
      if (!st.player || !st.player.health || !st.player.health.mental)
        return false; // 检查 心理结构存在

      if ((st.player.health.mental.stress || 0) <= 60) return false; // 检查 压力>60

      if (st.flags && st.flags._r104Stress) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "😣 给自己放空",

        hint: "压力- 现金-",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,

            (st.player.health.mental.stress || 0) - 30,
          );

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);

          st.flags._r104Stress = true;

          StateManager.addMessage(
            "你花¥30给自己放了空，心理压力下去一大截。",

            "success",
          );
        },
      },

      {
        text: "🚬 硬撑过去",

        hint: "轻量 压力- 健康-",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,

            (st.player.health.mental.stress || 0) - 10,
          );

          st.status.health = Math.max(0, (st.status.health || 0) - 4);

          st.flags._r104Stress = true;

          StateManager.addMessage(
            "你硬撑着过了这阵，压力轻了点，身子却更虚。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r104_talent_english_job",

    phase: "street",

    icon: "🌐",

    title: "外语天赋上位",

    story:
      "你点通了外语一道的天赋，谈吐间自然带出底气，老板把对外的差事放心交给你。",

    // conditions：已激活天赋 + 有主业 + 英语达标（天赋×职业空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (
        !st.skills ||
        ((st.skills.english && st.skills.english.level) || 0) < 15
      )
        return false; // 检查 英语>=15

      if (st.flags && st.flags._r104TalentEng) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌐 接对外差事",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          st.skills.english.xp = (st.skills.english.xp || 0) + 35;

          st.flags._r104TalentEng = true;

          StateManager.addMessage(
            "天赋加外语让你挑起对外差事，落袋¥280，口语更溜。",

            "success",
          );
        },
      },

      {
        text: "🤫 闷头做",

        hint: "轻量 经验+",

        apply: function (st) {
          st.skills.english.xp = (st.skills.english.xp || 0) + 18;

          st.flags._r104TalentEng = true;

          StateManager.addMessage(
            "你闷头把活干漂亮，天赋的红利慢慢显。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r105_oldzhou_welding",

    phase: "street",

    icon: "🔧",

    title: "老周的焊活",

    story:
      "废品站的老周看你焊得有模有样，凑过来指点你电流该调多大，省料又牢靠。",

    // conditions：已结识老周且好感达标 + 焊接技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou; // 检查 老周关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.welding && st.skills.welding.level) || 0) < 10
      )
        return false; // 检查 焊接>=10

      if (st.flags && st.flags._r105OzWeld) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🔧 讨教手法",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.welding)
            st.skills.welding.xp = (st.skills.welding.xp || 0) + 25;

          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 2,
            );

          st.flags._r105OzWeld = true;

          StateManager.addMessage(
            "老周点拨了焊活门道，手艺涨了，两人也更热络。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.old_zhou)
            st.relationships.old_zhou.affinity = Math.min(
              100,

              st.relationships.old_zhou.affinity + 1,
            );

          st.flags._r105OzWeld = true;

          StateManager.addMessage("你陪老周闲扯了会儿，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r105_rainy_cooking",

    phase: "street",

    icon: "🌧️",

    title: "雨天的灶火",

    story:
      "外头下着雨，你躲进棚子里支起小灶，热汤下肚，连日淋雨的寒意散了大半。",

    // conditions：雨天 + 烹饪技能达标（天气×技能空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "rainy") return false; // 检查 雨天

      if (
        !st.skills ||
        ((st.skills.cooking && st.skills.cooking.level) || 0) < 10
      )
        return false; // 检查 烹饪>=10

      if (st.flags && st.flags._r105RainCook) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌧️ 煮一锅热汤",

        hint: "饥饿- 心情+",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 25);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          st.flags._r105RainCook = true;

          StateManager.addMessage(
            "雨天一锅热汤下肚，饥寒都退了，心里也暖。",

            "success",
          );
        },
      },

      {
        text: "🍲 留着明天吃",

        hint: "轻量 饥饿-",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 14);

          st.flags._r105RainCook = true;

          StateManager.addMessage(
            "你多煮了些，封好留到明天，省下一顿饭钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r105_rep_loan_bank",

    phase: "street",

    icon: "🏦",

    title: "银行的熟人贷",

    story:
      "你在银行攒下的口碑让信贷员主动松了口，说凭你的名头能走一笔利息更低的周转贷。",

    // conditions：银行声望达标（声望×贷款空白区）

    conditions: function (st) {
      if (!st.reputation || (st.reputation.bank || 0) < 30) return false; // 检查 银行声望>=30

      if (st.flags && st.flags._r105RepLoan) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🏦 走低息贷",

        hint: "现金+ 债务+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 600;

          st.resources.bankDebt = (st.resources.bankDebt || 0) + 600;

          st.resources.bankDebtDay = st.player.day;

          st.flags._r105RepLoan = true;

          StateManager.addMessage(
            "凭银行口碑走了笔低息周转贷，到手¥600，记得按时还。",

            "success",
          );
        },
      },

      {
        text: "🤝 先不借",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r105RepLoan = true;

          StateManager.addMessage("你婉拒了，落得个不赖账的好名声。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r106_heatwave_labor",

    phase: "street",

    icon: "🥵",

    title: "热浪下的活儿",

    story: "连日热浪，你顶着日头在外头奔活，汗珠子砸在地上，工资没多拿几分。",

    // conditions：热浪天气 + 有主业（天气×职业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "heatwave") return false; // 检查 热浪

      if (!(st.employment && st.employment.currentJob)) return false; // 检查 有主业

      if (st.flags && st.flags._r106Heat) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🥵 硬扛挣工钱",

        hint: "现金+ 健康-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.status.health = Math.max(0, (st.status.health || 0) - 6);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._r106Heat = true;

          StateManager.addMessage(
            "你顶着热浪干完活，落袋¥120，身子却脱了层皮。",

            "success",
          );
        },
      },

      {
        text: "🌳 躲晌歇会儿",

        hint: "轻量 健康+ 疲劳-",

        apply: function (st) {
          st.status.health = Math.min(100, (st.status.health || 0) + 4);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) - 8);

          st.flags._r106Heat = true;

          StateManager.addMessage(
            "你找了处荫凉歇晌，缓过劲儿来，没硬扛。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r106_sisterwu_accounting",

    phase: "street",

    icon: "📒",

    title: "吴姐的账本",

    story:
      "吴姐看你核账总出错，挪到旁边教你怎么用借贷勾稽把小买卖的流水理清楚。",

    // conditions：已结识吴姐且好感达标 + 会计技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.accounting && st.skills.accounting.level) || 0) < 10
      )
        return false; // 检查 会计>=10

      if (st.flags && st.flags._r106SwAcc) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📒 学理账",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 25;

          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 2,
            );

          st.flags._r106SwAcc = true;

          StateManager.addMessage(
            "吴姐教了勾稽理账，算盘更精了，两人也更近。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.sister_wu)
            st.relationships.sister_wu.affinity = Math.min(
              100,

              st.relationships.sister_wu.affinity + 1,
            );

          st.flags._r106SwAcc = true;

          StateManager.addMessage("你陪吴姐聊了会儿，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r106_talent_repair_job",

    phase: "street",

    icon: "🛠️",

    title: "修理天赋上岗",

    story:
      "你点通了修理一道的天赋，手到病除，老板把设备维护的活儿一股脑交给你。",

    // conditions：已激活天赋 + 修理技能达标（天赋×技能空白区）

    conditions: function (st) {
      if (!st.talentNodes || Object.keys(st.talentNodes).length === 0)
        return false; // 检查 已激活天赋

      if (
        !st.skills ||
        ((st.skills.repair && st.skills.repair.level) || 0) < 15
      )
        return false; // 检查 修理>=15

      if (st.flags && st.flags._r106TalentRep) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🛠️ 接维护活",

        hint: "现金+ 经验+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;

          st.flags._r106TalentRep = true;

          StateManager.addMessage(
            "天赋加持下维护活干得利落，落袋¥260，手艺更稳。",

            "success",
          );
        },
      },

      {
        text: "🧊 稳着来",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;

          st.flags._r106TalentRep = true;

          StateManager.addMessage("你稳着接活，天赋的红利慢慢攒。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r107_coding_english",

    phase: "street",

    icon: "💻",

    title: "码里带词",

    story:
      "你接了个对外的活儿，英文文档和代码一起啃，磕磕绊绊竟也把接口调通了。",

    // conditions：编程技能达标 + 英语技能达标（技能×技能空白区）

    conditions: function (st) {
      if (!st.skills) return false; // 检查 技能结构

      if (((st.skills.coding && st.skills.coding.level) || 0) < 10)
        return false; // 检查 编程>=10

      if (((st.skills.english && st.skills.english.level) || 0) < 10)
        return false; // 检查 英语>=10

      if (st.flags && st.flags._r107CodeEng) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💻 啃下接口",

        hint: "经验+ 现金+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 25;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 20;

          st.resources.cash = (st.resources.cash || 0) + 150;

          st.flags._r107CodeEng = true;

          StateManager.addMessage(
            "你码里带词把接口调通，落袋¥150，双语手艺都涨。",

            "success",
          );
        },
      },

      {
        text: "📝 只练不接",

        hint: "轻量 经验+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 12;

          if (st.skills && st.skills.english)
            st.skills.english.xp = (st.skills.english.xp || 0) + 10;

          st.flags._r107CodeEng = true;

          StateManager.addMessage("你对着文档练手，没接活也攒了经验。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r107_morality_low_shady",

    phase: "street",

    icon: "🕶️",

    title: "灰差事",

    story:
      "有人递来个来路不明的活儿，油水不小，你心里那点底线早就松了，不由得多看了两眼。",

    // conditions：道德偏低（道德×事件空白区）

    conditions: function (st) {
      if ((st.player.morality || 0) >= 30) return false; // 检查 道德<30

      if (st.flags && st.flags._r107Shady) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "🕶️ 接这活儿",

        hint: "现金+ 道德- 名声-",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          st.player.morality = Math.max(0, (st.player.morality || 0) - 5);

          st.player.fame = Math.max(0, (st.player.fame || 0) - 3);

          st.flags._r107Shady = true;

          StateManager.addMessage(
            "你接了灰差事，落袋¥300，名声带了点灰。",

            "success",
          );
        },
      },

      {
        text: "🚫 摆手拒绝",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 3);

          st.flags._r107Shady = true;

          StateManager.addMessage("你摆了手，底线的灰没再往下掉。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r107_stormy_driving",

    phase: "street",

    icon: "🌩️",

    title: "暴雨里开车",

    story: "暴雨砸得挡风玻璃噼啪响，你握着方向盘跑单，路上积水差点让车打了滑。",

    // conditions：暴雨天气 + 开车副业（天气×职业空白区）

    conditions: function (st) {
      if (!st.weather || st.weather.current !== "stormy") return false; // 检查 暴雨

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 开车副业

      if (st.flags && st.flags._r107Storm) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🌩️ 冒雨跑完单",

        hint: "现金+ 风险+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          st.status.health = Math.max(0, (st.status.health || 0) - 5);

          st.flags._r107Storm = true;

          StateManager.addMessage(
            "暴雨里你跑完单，落袋¥200，惊出一身冷汗。",

            "success",
          );
        },
      },

      {
        text: "🅿️ 靠边歇着",

        hint: "轻量 健康+",

        apply: function (st) {
          st.status.health = Math.min(100, (st.status.health || 0) + 3);

          st.flags._r107Storm = true;

          StateManager.addMessage("你把车靠边等雨小，稳妥没出岔子。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r108_bossli_management",

    phase: "street",

    icon: "💼",

    title: "李总的带人经",

    story: "李总看你带人有点散，点拨你怎么把一摊子人拢成一股绳，省得各自为政。",

    // conditions：已结识李总且好感达标 + 管理技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李总关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.management && st.skills.management.level) || 0) < 10
      )
        return false; // 检查 管理>=10

      if (st.flags && st.flags._r108BlMgmt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "💼 学带人",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 25;

          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 2,
            );

          st.flags._r108BlMgmt = true;

          StateManager.addMessage(
            "李总教了带人经，管理涨了，两人也更投缘。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.boss_li)
            st.relationships.boss_li.affinity = Math.min(
              100,

              st.relationships.boss_li.affinity + 1,
            );

          st.flags._r108BlMgmt = true;

          StateManager.addMessage("你陪李总闲聊，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r108_era_decline_debt",

    phase: "street",

    icon: "📉",

    title: "萧条里的债",

    story:
      "城里入了萧条，钱紧得厉害，债主上门催得勤，你盘算着怎么把窟窿先补上。",

    // conditions：时代衰退期 + 有欠款（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "decline") return false; // 检查 衰退期

      if ((st.resources.debt || 0) <= 0 && (st.resources.bankDebt || 0) <= 0)
        return false; // 检查 有欠款

      if (st.flags && st.flags._r108EraDebt) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📉 先还一截",

        hint: "债务- 现金-",

        apply: function (st) {
          var pay = Math.min(st.resources.cash || 0, 200);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - pay);

          st.resources.debt = Math.max(0, (st.resources.debt || 0) - pay);

          st.flags._r108EraDebt = true;

          StateManager.addMessage(
            "萧条里你先还了¥" + pay + "的债，窟窿小了一圈。",

            "success",
          );
        },
      },

      {
        text: "🤝 拖一拖",

        hint: "轻量 名声-",

        apply: function (st) {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 2);

          st.flags._r108EraDebt = true;

          StateManager.addMessage(
            "你先拖着没还，债主嘟囔两句，名声落了点。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r108_fatigue_high_rest",

    phase: "street",

    icon: "🥱",

    title: "累到睁不开眼",

    story: "你连轴转了几天，站着都能打盹，眼皮沉得像挂了秤砣，实在撑不住了。",

    // conditions：疲劳偏高（需求×事件空白区）

    conditions: function (st) {
      if (!st.needs || (st.needs.fatigue || 0) < 80) return false; // 检查 疲劳>=80

      if (st.flags && st.flags._r108Fatigue) return false; // 检查 未触发过

      return true;
    },

    probability: 0.35,

    repeatable: false,

    choices: [
      {
        text: "🥱 倒头就睡",

        hint: "疲劳- 现金-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 40);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);

          st.flags._r108Fatigue = true;

          StateManager.addMessage(
            "你花¥20找了处能躺的地方，睡醒 fatigue 下去一大截。",

            "success",
          );
        },
      },

      {
        text: "☕ 硬熬过去",

        hint: "轻量 疲劳- 健康-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);

          st.status.health = Math.max(0, (st.status.health || 0) - 4);

          st.flags._r108Fatigue = true;

          StateManager.addMessage(
            "你硬熬着过了这阵，疲劳轻了点，身子却更虚。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r109_auntwang_cooking",

    phase: "street",

    icon: "🍲",

    title: "王姨的拿手菜",

    story:
      "王姨看你做饭凑合，拉你进厨房教她那道拿手菜，说饿肚子的人更该好好吃饭。",

    // conditions：已结识王姨且好感达标 + 烹饪技能达标（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships.aunt_wang; // 检查 王姨关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if ((rel.affinity || 0) < 10) return false; // 检查 好感>=10

      if (
        !st.skills ||
        ((st.skills.cooking && st.skills.cooking.level) || 0) < 10
      )
        return false; // 检查 烹饪>=10

      if (st.flags && st.flags._r109AwCook) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "🍲 学做拿手菜",

        hint: "经验+ 好感+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 25;

          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 2,
            );

          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 20);

          st.flags._r109AwCook = true;

          StateManager.addMessage(
            "王姨教了拿手菜，厨艺涨了，肚子也填饱了。",

            "success",
          );
        },
      },

      {
        text: "🤝 只叙不学",

        hint: "轻量 好感+",

        apply: function (st) {
          if (st.relationships && st.relationships.aunt_wang)
            st.relationships.aunt_wang.affinity = Math.min(
              100,

              st.relationships.aunt_wang.affinity + 1,
            );

          st.flags._r109AwCook = true;

          StateManager.addMessage("你陪王姨唠了会儿，情分又近一层。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "l21_r109_growth_invest",

    phase: "street",

    icon: "📈",

    title: "增长期的风口",

    story: "城里正往上走，你盯盘面盯得勤，琢磨着趁这股劲把闲钱投进看好的行当。",

    // conditions：时代增长期 + 有投资行为（时代×经济空白区）

    conditions: function (st) {
      if (!st._eraState) return false; // 检查 时代已初始化

      if (st._eraState.stageId !== "growth") return false; // 检查 增长期

      if (
        !st.stats ||
        !st.stats.investFreq ||
        Object.keys(st.stats.investFreq).length === 0
      )
        return false; // 检查 有投资

      if (st.flags && st.flags._r109GrowthInv) return false; // 检查 未触发过

      return true;
    },

    probability: 0.3,

    repeatable: false,

    choices: [
      {
        text: "📈 加一仓",

        hint: "现金+ 风险+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;

          st.resources.invested = (st.resources.invested || 0) + 200;

          st.flags._r109GrowthInv = true;

          StateManager.addMessage(
            "增长期里你加了一仓，落袋¥280，账面更好看。",

            "success",
          );
        },
      },

      {
        text: "🧊 看看再说",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);

          st.flags._r109GrowthInv = true;

          StateManager.addMessage(
            "你没急着加仓，稳妥看走势，落个审慎名声。",

            "info",
          );
        },
      },
    ],
  });
})();
