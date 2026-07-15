/**
 * 跨系统联动事件 — 拆分片段 7/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart7Loaded) return;
  RANDOM_EVENTS._crossPart7Loaded = true;

  RANDOM_EVENTS.push({
    id: "sister_zhang_electrician_favor",

    phase: "street",

    icon: "🔌",

    title: "张姐的电路活",

    story:
      "张姐店里总跳闸，知道你懂电工，招呼你：「妹/兄弟，帮我看看线路，改天我给你介绍大客户。」",

    // conditions：sister_zhang 已结识且好感达标 + electrician 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 30) return false; // 检查 好感>=30

      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof elec !== "number" || elec < 15) return false; // 检查 electrician>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._sisterZhangElecSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🔌 接电路活+引荐",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          st.resources.cash += 400;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 张姐更信任你

          st.flags._sisterZhangElecSeen = true;

          StateManager.addMessage(
            "你帮张姐整好线路还拿到引荐，落袋¥400，名声+4，张姐好感+5。",

            "success",
          );
        },
      },

      {
        text: "🤝 只帮不收钱",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 8); // 张姐念你的情

          st.flags._sisterZhangElecSeen = true;

          StateManager.addMessage(
            "你免费帮张姐排了线路隐患，她记你的情，好感+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "sister_zhang_sales_intro",

    phase: "street",

    icon: "💬",

    title: "张姐的带路",

    story:
      "张姐做销售人脉广，看你会说话，带你去见几个客户：「嘴皮子利就别埋没，我带你跑两单。」",

    // conditions：sister_zhang 已结识且好感达标 + sales 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sale !== "number" || sale < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._sisterZhangIntroSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "💬 跟张姐跑单",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          st.resources.cash += 320;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._sisterZhangIntroSeen = true;

          StateManager.addMessage(
            "你跟张姐跑下两单，落袋¥320，名声+3，张姐好感+4。",

            "success",
          );
        },
      },

      {
        text: "📇 只记人脉",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._sisterZhangIntroSeen = true;

          StateManager.addMessage(
            "你只记下张姐引荐的人脉，张姐好感+2。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "skill_synergy_cook_sales",

    phase: "street",

    icon: "🤝",

    title: "厨艺加吆喝",

    story:
      "你既会做又会卖，摆起熟食摊来一套一套的。厨艺配上嘴皮子，生意比旁人红火。",

    // conditions：cooking 技能 + sales 技能 + 副业进行中（技能协同 ∩ 副业）

    conditions: function (st) {
      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 15) return false; // 检查 cooking>=15

      var sal = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sal !== "number" || sal < 15) return false; // 检查 sales>=15

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._synergySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 开熟食摊",

        hint: "现金+ 口碑+",

        apply: function (st) {
          st.resources.cash += 200;

          if (st.sideHustle)
            st.sideHustle.reputation = (st.sideHustle.reputation || 0) + 4;

          st.flags._synergySeen = true;

          StateManager.addMessage(
            "你开起熟食摊，落袋¥200，副业口碑+4。",

            "success",
          );
        },
      },

      {
        text: "🍱 只做熟客",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 90;

          st.flags._synergySeen = true;

          StateManager.addMessage("你只做熟客生意，落袋¥90。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "slum_rep_old_zhou",

    phase: "street",

    icon: "🤝",

    title: "街坊老周的照应",

    story:
      "你在贫民区人缘好，老周有活儿先想到你：「街坊信你，这差事稳当，你来最合适。」",

    // conditions：贫民区声望高 + old_zhou 已结识且好感达标（声望系统 + NPC 关系系统）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.slum; // 检查 贫民区声望

      if (typeof rep !== "number" || rep < 30) return false; // 检查 贫民区声望>=30

      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._slumRepZhouSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🤝 接下差事",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          st.resources.cash += 240;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._slumRepZhouSeen = true;

          StateManager.addMessage(
            "你接下老周的差事，落袋¥240，老周好感+4。",

            "success",
          );
        },
      },

      {
        text: "🙌 只帮衬",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._slumRepZhouSeen = true;

          StateManager.addMessage("你只帮老周衬了把手，老周好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "slum_repair_gig",

    phase: "street",

    icon: "🛠️",

    title: "贫民区的修修补补",

    story:
      "你在贫民区，谁家家电坏了都来找你：「这片区就你手巧，帮俺修修，钱多少都行。」",

    // conditions：当前在贫民区 + repair 技能（交易地点系统 + 技能系统）

    conditions: function (st) {
      if (st.trade.currentLocation !== "slum") return false; // 检查 当前在贫民区

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 15) return false; // 检查 repair>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._slumRepairSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🛠️ 接修理活",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash += 210;

          if (st.skills && st.skills.repair)
            st.skills.repair.level = Math.min(100, st.skills.repair.level + 2);

          st.flags._slumRepairSeen = true;

          StateManager.addMessage(
            "你在贫民区接了修理活，落袋¥210，修理+2。",

            "success",
          );
        },
      },

      {
        text: "🔧 只紧个急",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.repair)
            st.skills.repair.level = Math.min(100, st.skills.repair.level + 1);

          st.flags._slumRepairSeen = true;

          StateManager.addMessage("你只帮人紧了个急，修理+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stormy_coding_indoor",

    phase: "street",

    icon: "💻",

    title: "暴雨夜的代码",

    story:
      "外头狂风暴雨出不了门，你正好窝在屋里敲代码：「老天爷逼我闭关，正好把活儿干完。」",

    // conditions：暴风雨 + coding 技能（天气系统 + 技能系统）

    conditions: function (st) {
      if (st.weather.current !== "stormy") return false; // 检查 暴风雨

      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._stormyCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "💻 赶完项目",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash += 300;

          if (st.skills && st.skills.coding)
            st.skills.coding.level = Math.min(100, st.skills.coding.level + 3);

          st.flags._stormyCodeSeen = true;

          StateManager.addMessage(
            "你暴雨夜赶完项目，落袋¥300，编程+3。",

            "success",
          );
        },
      },

      {
        text: "📚 只练手",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.coding)
            st.skills.coding.level = Math.min(100, st.skills.coding.level + 1);

          st.flags._stormyCodeSeen = true;

          StateManager.addMessage("你只趁雨练了练手，编程+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stormy_driving_delivery",

    phase: "street",

    icon: "🌧️",

    title: "暴雨代送",

    story:
      "暴雨天没人愿出门，你开着车接起代送的活儿。路滑难走，但会开车的你正好赚这趟辛苦钱。",

    // conditions：stormy 天气 + driving 技能 + 开车副业（天气 ∩ 技能 ∩ 副业）

    conditions: function (st) {
      if (st.weather.current !== "stormy") return false; // 检查 暴雨

      var dr = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof dr !== "number" || dr < 15) return false; // 检查 driving>=15

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 开车副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._stormDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🚗 冒雨出车",

        hint: "现金+ 疲劳+",

        apply: function (st) {
          st.resources.cash += 160;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._stormDriveSeen = true;

          StateManager.addMessage(
            "暴雨天你出车代送，落袋¥160，疲劳+12。",

            "success",
          );
        },
      },

      {
        text: "🏠 歇一天",

        hint: "轻量 疲劳-",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 6);

          st.flags._stormDriveSeen = true;

          StateManager.addMessage("你歇了一天，疲劳-6。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stormy_shelter_community",

    phase: "street",

    icon: "⛈️",

    title: "风暴避难点",

    story:
      "暴雨狂风，城中村低洼处泡了水。你在贫民区口碑不错，街坊自发把你腾出的避难点当主心骨：「有事找你准没错。」",

    // conditions：天气 stormy + 贫民区声望（天气×声望空白区）

    conditions: function (st) {
      if (st.weather.current !== "stormy") return false; // 检查 风暴

      var rep = st.reputation && st.reputation.slum; // 检查 贫民区声望

      if ((rep || 0) < 40) return false; // 检查 声望>=40

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._stormyShelterSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "⛈️ 撑起避难点",

        hint: "现金+ 名声+ 声望+",

        apply: function (st) {
          st.resources.cash += 300;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);

          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 5); // 贫民区声望+

          st.flags._stormyShelterSeen = true;

          StateManager.addMessage(
            "你撑起风暴避难点，落袋¥300，名声+6，贫民区声望+5。",

            "success",
          );
        },
      },

      {
        text: "🤝 只帮邻里",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.slum = Math.min(100, (st.reputation.slum || 0) + 8); // 贫民区声望+

          st.flags._stormyShelterSeen = true;

          StateManager.addMessage(
            "你只帮邻里安置，不收钱，贫民区声望+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_chef_chen_cook_relief",

    phase: "street",

    icon: "🍲",

    title: "陈厨的解压饭",

    story: "你压力正压得慌，陈厨喊你进后厨搭把手，热乎饭菜一下肚，人缓过来了。",

    // conditions：高心理压 + chef_chen 已结识 + cooking 技能（心理 ∩ NPC ∩ 技能）

    conditions: function (st) {
      var st3 = st.player && st.player.health && st.player.health.mental; // 检查 心理

      if (!st3 || typeof st3.stress !== "number" || st3.stress < 50)
        return false; // 检查 高压力

      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 15) return false; // 检查 好感>=15

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 5) return false; // 检查 cooking>=5

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._chenCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🍲 下厨搭手",

        hint: "压力- 幸福+ cooking+",

        apply: function (st) {
          var st3 = st.player.health.mental;

          st3.stress = Math.max(0, st3.stress - 12);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          var s = st.skills.cooking;

          s.level = Math.min(100, s.level + 1);

          st.flags._chenCookSeen = true;

          StateManager.addMessage(
            "陈厨的热饭解压，压力-12，幸福+8，cooking+1。",

            "success",
          );
        },
      },

      {
        text: "🍜 只管吃",

        hint: "轻量 压力- 幸福+",

        apply: function (st) {
          var st3 = st.player.health.mental;

          st3.stress = Math.max(0, st3.stress - 8);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._chenCookSeen = true;

          StateManager.addMessage("你吃着热饭缓了劲，压力-8，幸福+5。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_high_brother_huang",

    phase: "street",

    icon: "🧠",

    title: "黄哥的开解",

    story:
      "你压力大到睡不着，黄哥递根烟：「憋着最伤身，跟哥唠唠，天塌不下来。」",

    // conditions：心理压力大 + brother_huang 已结识且好感达标（心理压力系统 + NPC 关系系统）

    conditions: function (st) {
      var stress =
        st.player.health &&
        st.player.health.mental &&
        st.player.health.mental.stress; // 检查 心理压

      if (typeof stress !== "number" || stress < 60) return false; // 检查 压力>=60

      var rel = st.relationships && st.relationships["brother_huang"]; // 检查 brother_huang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._stressHuangSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🧠 跟黄哥唠",

        hint: "压力- 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["brother_huang"];

          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              (st.player.health.mental.stress || 0) - 25,
            ); // 压力缓解

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._stressHuangSeen = true;

          StateManager.addMessage(
            "你跟黄哥唠完，压力-25，黄哥好感+4。",

            "success",
          );
        },
      },

      {
        text: "🚬 只接根烟",

        hint: "轻量 压力-",

        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,

              (st.player.health.mental.stress || 0) - 10,
            ); // 压力缓解

          st.flags._stressHuangSeen = true;

          StateManager.addMessage("你只接了根烟，压力-10。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_high_sister_zhang_talk",

    phase: "street",

    icon: "💬",

    title: "张姐的开导",

    story:
      "你绷得太紧，精神快炸了。张姐拉你坐下唠了半天，几句话把你心结捋顺了。",

    // conditions：sister_zhang 已结识+好感 + 高精神压力（NPC ∩ 心理系统）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if ((st.player.health.mental.stress || 0) < 60) return false; // 检查 高精神压力

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._stressZSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "💬 听她开导",

        hint: "压力- 好感+",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,

            (st.player.health.mental.stress || 0) - 20,
          );

          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._stressZSeen = true;

          StateManager.addMessage(
            "张姐开导你，精神压力-20，好感+3。",

            "success",
          );
        },
      },

      {
        text: "🙏 记在心里",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._stressZSeen = true;

          StateManager.addMessage("你把话记在心里，张姐好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_high_uncle_chen_finance",

    phase: "street",

    icon: "📈",

    title: "行长的理财方",

    story:
      "你焦虑得睡不着，陈行长递来一份稳健理财方子：「别全压一处，分着来，心就定了。」",

    // conditions：uncle_chen_bank 已结识+好感 + 高精神压力（NPC ∩ 心理 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if ((st.player.health.mental.stress || 0) < 60) return false; // 检查 高精神压力

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._stressBankSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 照方理财",

        hint: "压力- 现金+",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,

            (st.player.health.mental.stress || 0) - 15,
          );

          st.resources.cash += 120;

          st.flags._stressBankSeen = true;

          StateManager.addMessage(
            "你照行长方子理财，精神压力-15，落袋¥120。",

            "success",
          );
        },
      },

      {
        text: "🤝 先聊聊",

        hint: "轻量 压力-",

        apply: function (st) {
          st.player.health.mental.stress = Math.max(
            0,

            (st.player.health.mental.stress || 0) - 8,
          );

          st.flags._stressBankSeen = true;

          StateManager.addMessage("你和行长聊聊，精神压力-8。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_low_xiao_mei_outing",

    phase: "street",

    icon: "🌸",

    title: "小梅的散心约",

    story: "你这阵子心里松快，小梅约你出去转转，两个人沿河走了半下午，挺舒坦。",

    // conditions：低心理压 + xiao_mei 已结识+好感（心理 ∩ NPC ∩ 需求）

    conditions: function (st) {
      var st3 = st.player && st.player.health && st.player.health.mental; // 检查 心理

      if (!st3 || typeof st3.stress !== "number" || st3.stress >= 30)
        return false; // 检查 低压力

      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._meiOutingSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🌸 赴约散心",

        hint: "幸福+ 好感+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          var rel = st.relationships && st.relationships["xiao_mei"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._meiOutingSeen = true;

          StateManager.addMessage(
            "你赴小梅的散心约，幸福+8，小梅好感+2。",

            "success",
          );
        },
      },

      {
        text: "🙇 改天再约",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._meiOutingSeen = true;

          StateManager.addMessage("你改天再约，小梅好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_coding_remote",

    phase: "street",

    icon: "💡",

    title: "远程接单的料",

    story:
      "你点亮了后端系统的天赋，远程接单比别人顺手。一家小公司找外包，你凭这本事拿下长活儿。",

    // conditions：backend_system 天赋 + coding 技能（天赋系统 ∩ 技能系统 ∩ 经济）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["backend_system"])) return false; // 检查 天赋节点 backend_system

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 20) return false; // 检查 coding>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._talentRemoteSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "💡 接下长活",

        hint: "现金+ coding+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 3);

          st.resources.cash += 300;

          st.flags._talentRemoteSeen = true;

          StateManager.addMessage(
            "你凭天赋接下远程长活，coding+3，落袋¥300。",

            "success",
          );
        },
      },

      {
        text: "📝 先试小单",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 90;

          st.flags._talentRemoteSeen = true;

          StateManager.addMessage("你先试了个小单，落袋¥90。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_elec_boss",

    phase: "street",

    icon: "⚡",

    title: "李总的电工单",

    story:
      "你点亮的高压电天赋被李总看中：「会摆弄高压电的人难找，我这摊子正缺你这样的。」",

    // conditions：已点亮高压电天赋 + electrician 技能 + boss_li 已结识（天赋系统 + 技能系统 + NPC 系统）

    conditions: function (st) {
      if (!st.talentNodes || !st.talentNodes["elec_high_voltage"]) return false; // 检查 高压电天赋

      var ele =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof ele !== "number" || ele < 20) return false; // 检查 electrician>=20

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._talentElecSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "⚡ 接李总的单",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          st.resources.cash += 400;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5);

          st.flags._talentElecSeen = true;

          StateManager.addMessage(
            "你接下李总的高压电单，落袋¥400，李总好感+5。",

            "success",
          );
        },
      },

      {
        text: "🔌 只巡个检",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._talentElecSeen = true;

          StateManager.addMessage("你只帮李总巡了个检，李总好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_manage_promote",

    phase: "street",

    icon: "📊",

    title: "管理天赋的晋升",

    story:
      "你点亮的销售管理天赋让老板刮目相看：「会带人又会卖，这小组长给你当，别辜负。」",

    // conditions：已点亮销售管理天赋 + management 技能 + 有工作（天赋系统 + 技能系统 + 就业系统）

    conditions: function (st) {
      if (!st.talentNodes || !st.talentNodes["sales_management"]) return false; // 检查 销售管理天赋

      var man = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof man !== "number" || man < 15) return false; // 检查 management>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已有工作

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._talentManageSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.018,

    repeatable: false,

    choices: [
      {
        text: "📊 当小组长",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 460;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._talentManageSeen = true;

          StateManager.addMessage(
            "你凭管理天赋升小组长，落袋¥460，名声+4。",

            "success",
          );
        },
      },

      {
        text: "📋 只带个头",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._talentManageSeen = true;

          StateManager.addMessage("你只先带了个头，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_manage_team_boss",

    phase: "street",

    icon: "🏅",

    title: "管理天赋的用场",

    story:
      "你点亮了销售管理的天赋，李总正缺个能带人的，看你顺眼，把一支小队交你带。",

    // conditions：sales_management 天赋 + management 技能 + boss_li 已结识（天赋 ∩ 技能 ∩ NPC）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["sales_management"])) return false; // 检查 天赋节点 sales_management

      var man = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof man !== "number" || man < 15) return false; // 检查 management>=15

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._talentManageSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🏅 带队干",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          st.resources.cash += 350;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._talentManageSeen = true;

          StateManager.addMessage(
            "你带起小队，落袋¥350，李总好感+4。",

            "success",
          );
        },
      },

      {
        text: "📋 只出主意",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._talentManageSeen = true;

          StateManager.addMessage("你只给李总出主意，好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_management_team_morale",

    phase: "street",

    icon: "📣",

    title: "带队的士气活",

    story:
      "你点过带队的天赋，手底下人服你。瞅着大家闷，你张罗了场小聚，士气一下就回来了。",

    // conditions：天赋节点 management_crew_lead + 有职业 + 幸福偏低（天赋 ∩ 职业 ∩ 需求）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["management_crew_lead"]))
        return false; // 检查 天赋节点

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (typeof st.needs.happiness !== "number" || st.needs.happiness >= 55)
        return false; // 检查 幸福偏低

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._teamMoraleSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📣 张罗小聚",

        hint: "幸福+ 名声+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);

          st.player.fame = (st.player.fame || 0) + 2;

          st.flags._teamMoraleSeen = true;

          StateManager.addMessage(
            "你张罗小聚提了士气，幸福+10，名声+2。",

            "success",
          );
        },
      },

      {
        text: "🗣️ 只鼓个劲",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._teamMoraleSeen = true;

          StateManager.addMessage("你给大家鼓了劲，幸福+4。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_precision_repair",

    phase: "street",

    icon: "🔬",

    title: "精密维修单",

    story:
      "你点亮了「精密维修」天赋，仪器厂找你修精密设备：「普通师傅不敢拆的，只有你接得住。」",

    // conditions：天赋节点 precision_repair 已激活 + repair 技能（天赋×职业空白区）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["precision_repair"])) return false; // 检查 天赋节点 precision_repair

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 25) return false; // 检查 repair>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 24) return false; // 检查 中后期

      if (st.flags && st.flags._precisionRepairSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🔬 接精密单",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 780;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);

          st.flags._precisionRepairSeen = true;

          StateManager.addMessage(
            "你接下仪器厂精密维修单，落袋¥780，名声+6。",

            "success",
          );
        },
      },

      {
        text: "🛠️ 先评个估",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 260;

          st.flags._precisionRepairSeen = true;

          StateManager.addMessage(
            "你先出份精密设备评估报告，落袋¥260，稳妥。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_sales_career_promote",

    phase: "street",

    icon: "📈",

    title: "销售天赋的提拔",

    story: "你点过销售的天赋，嘴皮子和人缘都到位，老板把你往上提了一档。",

    // conditions：天赋节点 sales_management + 有职业（天赋 ∩ 职业 ∩ 名声）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["sales_management"])) return false; // 检查 天赋节点

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._salesPromoteSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 接下提拔",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 200;

          st.player.fame = (st.player.fame || 0) + 3;

          st.flags._salesPromoteSeen = true;

          StateManager.addMessage(
            "销售天赋让你被提拔，现金+¥200，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🤝 谦让一步",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = (st.player.fame || 0) + 1;

          st.flags._salesPromoteSeen = true;

          StateManager.addMessage("你谦让了一步，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_street_chain_catering",

    phase: "street",

    icon: "🍱",

    title: "美食档口",

    story:
      "你点亮了「美食档口」天赋，固定摊位带来稳定客流，连锁小吃品牌找你谈加盟：「你这口味，开分档正合适。」",

    // conditions：天赋节点 street_chain 已激活 + cooking 技能（天赋×职业空白区）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["street_chain"])) return false; // 检查 天赋节点 street_chain

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 30) return false; // 检查 cooking>=30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 22) return false; // 检查 中后期

      if (st.flags && st.flags._streetChainSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🍱 接加盟档",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 800;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);

          st.flags._streetChainSeen = true;

          StateManager.addMessage(
            "你接下连锁加盟档口，落袋¥800，名声+6。",

            "success",
          );
        },
      },

      {
        text: "📋 先试单品",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 280;

          st.flags._streetChainSeen = true;

          StateManager.addMessage(
            "你先拿招牌单品试水，落袋¥280，稳扎稳打。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_weld_job",

    phase: "street",

    icon: "🔥",

    title: "焊工的天赋",

    story:
      "你点亮的焊接天赋在工地上派上用场，包工头拍板：「手上有活，这岗非你莫属，工钱好说。」",

    // conditions：已点亮精密焊接天赋 + welding 技能 + 有工作（天赋系统 + 技能系统 + 就业系统）

    conditions: function (st) {
      if (!st.talentNodes || !st.talentNodes["precision_welding"]) return false; // 检查 精密焊接天赋

      var wel = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof wel !== "number" || wel < 20) return false; // 检查 welding>=20

      if (!st.employment || !st.employment.currentJob) return false; // 检查 已有工作

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._talentWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🔥 接下焊接岗",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash += 420;

          if (st.skills && st.skills.welding)
            st.skills.welding.level = Math.min(
              100,

              st.skills.welding.level + 3,
            );

          st.flags._talentWeldSeen = true;

          StateManager.addMessage(
            "你凭焊接天赋接下好岗，落袋¥420，焊接+3。",

            "success",
          );
        },
      },

      {
        text: "🛠️ 只做零活",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.welding)
            st.skills.welding.level = Math.min(
              100,

              st.skills.welding.level + 1,
            );

          st.flags._talentWeldSeen = true;

          StateManager.addMessage("你只接了点零活，焊接+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "talent_welding_career",

    phase: "street",

    icon: "🔧",

    title: "焊接老把式的活",

    story: "你点过焊接的巧劲儿，厂里临时缺人，工头点名让你顶上这道焊缝。",

    // conditions：天赋节点 welding_construction_demand + welding 技能 + 有职业（天赋 ∩ 技能 ∩ 职业）

    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["welding_construction_demand"]))
        return false; // 检查 天赋节点

      var w = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof w !== "number" || w < 10) return false; // 检查 welding>=10

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.flags && st.flags._weldCareerSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔧 接下焊缝",

        hint: "现金+ welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 250;

          st.flags._weldCareerSeen = true;

          StateManager.addMessage(
            "你顶上这道焊缝，welding+2，工钱¥250。",

            "success",
          );
        },
      },

      {
        text: "📐 只练手",

        hint: "轻量 welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 1);

          st.flags._weldCareerSeen = true;

          StateManager.addMessage("你借机多练了手，welding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "typhoon_prep_welding",

    phase: "street",

    icon: "🌀",

    title: "台风前的加固",

    story:
      "台风要来，沿街店铺抢着给招牌和雨棚做加固。你手里有焊枪，活儿排到了半夜：「焊结实点，别让风刮飞了。」",

    // conditions：天气 typhoon + welding 技能（天气×职业空白区）

    conditions: function (st) {
      if (st.weather.current !== "typhoon") return false; // 检查 台风

      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof weld !== "number" || weld < 15) return false; // 检查 welding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._typhoonWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🌀 接加固活",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 480;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._typhoonWeldSeen = true;

          StateManager.addMessage(
            "你赶在台风前焊完一排加固，落袋¥480，名声+4。",

            "success",
          );
        },
      },

      {
        text: "🛡️ 只焊关键件",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 170;

          st.flags._typhoonWeldSeen = true;

          StateManager.addMessage(
            "你只焊最关键的几处，落袋¥170，先保安全。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "typhoon_sales_stall",

    phase: "street",

    icon: "🌀",

    title: "台风天的摊子",

    story:
      "台风把街口吹得稀烂，你摆的摊子差点被掀翻。会吆喝的你硬是留住了几个躲雨的客，卖出点零钱。",

    // conditions：typhoon 天气 + 摆摊副业 + sales 技能（天气 ∩ 副业 ∩ 技能）

    conditions: function (st) {
      if (st.weather.current !== "typhoon") return false; // 检查 台风

      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "stall"
      )
        return false; // 检查 摆摊副业进行中

      var sal = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sal !== "number" || sal < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._tyStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 顶风叫卖",

        hint: "现金+ 口碑+",

        apply: function (st) {
          st.resources.cash += 120;

          if (st.sideHustle)
            st.sideHustle.reputation = (st.sideHustle.reputation || 0) + 3;

          st.flags._tyStallSeen = true;

          StateManager.addMessage(
            "台风天你守住摊子，落袋¥120，副业口碑+3。",

            "success",
          );
        },
      },

      {
        text: "🛡️ 收摊保货",

        hint: "轻量 保货",

        apply: function (st) {
          st.flags._tyStallSeen = true;

          StateManager.addMessage("你提前收摊保住了货，没赔。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "uncle_chen_bank_loan_trust",

    phase: "street",

    icon: "🏦",

    title: "陈伯的信任",

    story:
      "你在商业区的口碑传到了银行陈伯耳朵里，他主动放低门槛：「你在商圈人缘好，这笔周转我敢批。」",

    // conditions：uncle_chen_bank 已结识且好感达标 + 商业区声望（NPC×声望空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 30) return false; // 检查 好感>=30

      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望

      if ((rep || 0) < 40) return false; // 检查 声望>=40

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._uncleChenLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🏦 拿信任周转",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          st.resources.cash += 600;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 陈伯更信你

          st.flags._uncleChenLoanSeen = true;

          StateManager.addMessage(
            "你拿了陈伯的信任周转金，落袋¥600，名声+4，陈伯好感+5。",

            "success",
          );
        },
      },

      {
        text: "🤝 只走代卖",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 180;

          st.flags._uncleChenLoanSeen = true;

          StateManager.addMessage(
            "你只帮熟铺代卖跑量，落袋¥180，不背债。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_cloudy_sales_stroll",

    phase: "street",

    icon: "☁️",

    title: "阴天串巷叫卖",

    story: "阴天不大晒，正适合出门。你提着货沿巷子叫卖，路人反倒乐意停下搭话。",

    // conditions：阴天 + sales 技能（天气 ∩ 技能 ∩ 交易）

    conditions: function (st) {
      if (st.weather.current !== "cloudy") return false; // 检查 阴天

      var sa = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sa !== "number" || sa < 10) return false; // 检查 sales>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._cloudyStrollSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "☁️ 沿巷叫卖",

        hint: "现金+ sales+",

        apply: function (st) {
          var s = st.skills.sales;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 160;

          st.flags._cloudyStrollSeen = true;

          StateManager.addMessage(
            "阴天你串巷叫卖，sales+2，落袋¥160。",

            "success",
          );
        },
      },

      {
        text: "💬 只练嘴皮",

        hint: "轻量 sales+",

        apply: function (st) {
          var s = st.skills.sales;

          s.level = Math.min(100, s.level + 1);

          st.flags._cloudyStrollSeen = true;

          StateManager.addMessage("你借机和人练了嘴皮，sales+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_heatwave_water_hustle",

    phase: "street",

    icon: "🔥",

    title: "热浪卖水",

    story:
      "热浪滚滚，路人渴得慌。你批发了箱水沿街卖，懂吆喝，一会儿就出了大半。",

    // conditions：热浪 + sales 技能（天气 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      if (st.weather.current !== "heatwave") return false; // 检查 热浪

      var sa = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sa !== "number" || sa < 10) return false; // 检查 sales>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._heatwaterSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🔥 摆摊卖水",

        hint: "现金+ sales+",

        apply: function (st) {
          var s = st.skills.sales;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 180;

          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 4);

          st.flags._heatwaterSeen = true;

          StateManager.addMessage("热浪你卖水赚了¥180，sales+2。", "success");
        },
      },

      {
        text: "💧 只送邻居",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._heatwaterSeen = true;

          StateManager.addMessage("你给邻居送了水，王阿姨好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_rainy_repair_indoor",

    phase: "street",

    icon: "☔",

    title: "雨天室内修",

    story:
      "下雨出不了外勤，你趁着在工坊里把积下的电器故障一一修好，手艺没荒着。",

    // conditions：rainy 天气 + repair 技能 + 有职业（天气 ∩ 技能 ∩ 职业）

    conditions: function (st) {
      if (st.weather.current !== "rainy") return false; // 检查 雨天

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rep !== "number" || rep < 15) return false; // 检查 repair>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._rainRepairSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "☔ 室内赶修",

        hint: "repair+ 现金+",

        apply: function (st) {
          var s = st.skills.repair;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 130;

          st.flags._rainRepairSeen = true;

          StateManager.addMessage(
            "雨天你室内赶修，repair+2，落袋¥130。",

            "success",
          );
        },
      },

      {
        text: "🔧 只清库存",

        hint: "轻量 repair+",

        apply: function (st) {
          var s = st.skills.repair;

          s.level = Math.min(100, s.level + 1);

          st.flags._rainRepairSeen = true;

          StateManager.addMessage("你只清了库存，repair+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_stormy_shelter_morality",

    phase: "street",

    icon: "⛈️",

    title: "暴雨收留路人",

    story: "暴雨倾盆，你在屋檐下躲雨，见个路人淋得透湿，心一软把人让进棚里。",

    // conditions：暴雨 + 高道德（天气 ∩ 道德 ∩ 需求）

    conditions: function (st) {
      if (st.weather.current !== "stormy") return false; // 检查 暴雨

      if (typeof st.player.morality !== "number" || st.player.morality < 50)
        return false; // 检查 高道德

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._stormShelterSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "⛈️ 让进棚里",

        hint: "道德+ 幸福+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 2);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._stormShelterSeen = true;

          StateManager.addMessage(
            "暴雨里你收留路人，道德+2，幸福+4。",

            "success",
          );
        },
      },

      {
        text: "🙇 只递把伞",

        hint: "轻量 道德+",

        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 0) + 1);

          st.flags._stormShelterSeen = true;

          StateManager.addMessage("你递了把伞，道德+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_sunny_park_mood",

    phase: "street",

    icon: "🌞",

    title: "晴天去晒晒",

    story:
      "连着阴几天，今儿个大太阳。你心情正闷，索性去街心公园晃了圈，晒得人松快。",

    // conditions：晴天 + 幸福偏低（天气 ∩ 需求系统）

    conditions: function (st) {
      if (st.weather.current !== "sunny") return false; // 检查 晴天

      if (typeof st.needs.happiness !== "number" || st.needs.happiness >= 45)
        return false; // 检查 幸福偏低

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._sunnyParkSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🌞 公园散步",

        hint: "幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3);

          st.flags._sunnyParkSeen = true;

          StateManager.addMessage(
            "晴天花园区晃了圈，幸福+10，有点乏但值。",

            "success",
          );
        },
      },

      {
        text: "🪑 晒会儿太阳",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);

          st.flags._sunnyParkSeen = true;

          StateManager.addMessage("你在墙根晒了会儿太阳，幸福+4。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "weather_typhoon_supply_shortage",

    phase: "street",

    icon: "🌀",

    title: "台风断了货",

    story:
      "台风过境，进货的道儿断了，物价往上窜。你手头正好囤了货，趁势出了手。",

    // conditions：台风 + 有交易地点（天气 ∩ 交易 ∩ 经济）

    conditions: function (st) {
      if (st.weather.current !== "typhoon") return false; // 检查 台风

      if (!st.trade || !st.trade.currentLocation) return false; // 检查 有交易地点

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._typhoonShortSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🌀 高价出手",

        hint: "现金+",

        apply: function (st) {
          st.resources.cash += 240;

          st.flags._typhoonShortSeen = true;

          StateManager.addMessage("台风断货你趁势出手，落袋¥240。", "success");
        },
      },

      {
        text: "🤝 匀给邻居",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._typhoonShortSeen = true;

          StateManager.addMessage("你把囤货匀给邻居，王阿姨好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "welding_career_danger_pay",

    phase: "street",

    icon: "🔩",

    title: "高风险焊缝的工钱",

    story: "厂里一道高空焊缝没人敢上，你手艺够硬，咬牙顶了，工钱给得也实在。",

    // conditions：welding 技能 + 有职业（技能 ∩ 职业 ∩ 经济）

    conditions: function (st) {
      var w = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof w !== "number" || w < 15) return false; // 检查 welding>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._weldDangerSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🔩 接下高空焊",

        hint: "现金+ welding+ 疲劳+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash += 320;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._weldDangerSeen = true;

          StateManager.addMessage(
            "你接下高空焊缝，welding+2，工钱¥320，累得够呛。",

            "success",
          );
        },
      },

      {
        text: "🧗 只打辅助",

        hint: "轻量 welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 1);

          st.flags._weldDangerSeen = true;

          StateManager.addMessage("你只给师傅打辅助，welding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "welding_construction_demand",

    phase: "street",

    icon: "🏗️",

    title: "工地上的焊活",

    story:
      "附近工地缺焊工，包工头满街找人。你亮了亮手艺：「这活儿我拿手，点焊探伤都懂。」",

    // conditions：welding 技能 + 副业进行中（技能系统 + 副业系统）

    conditions: function (st) {
      var wel = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof wel !== "number" || wel < 20) return false; // 检查 welding>=20

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._weldDemandSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🏗️ 接焊活",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash += 350;

          if (st.skills && st.skills.welding)
            st.skills.welding.level = Math.min(
              100,

              st.skills.welding.level + 3,
            );

          st.flags._weldDemandSeen = true;

          StateManager.addMessage(
            "你接下工地焊活，落袋¥350，焊接+3。",

            "success",
          );
        },
      },

      {
        text: "🔩 只帮零焊",

        hint: "轻量 技能+",

        apply: function (st) {
          if (st.skills && st.skills.welding)
            st.skills.welding.level = Math.min(
              100,

              st.skills.welding.level + 1,
            );

          st.flags._weldDemandSeen = true;

          StateManager.addMessage("你只帮人零焊了下，焊接+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "welding_repair_machine_shop",

    phase: "street",

    icon: "🔧",

    title: "机修铺子",

    story:
      "你既会焊又会修，巷口报废的机器到你手里总能起死回生，一个老机修铺邀你搭伙：「焊修都通，正缺你这种多面手。」",

    // conditions：welding + repair 双技能协同（技能系统空白区）

    conditions: function (st) {
      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof weld !== "number" || weld < 20) return false; // 检查 welding>=20

      if (typeof rep !== "number" || rep < 15) return false; // 检查 repair>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._machineShopSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🔧 搭伙机修铺",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash += 450;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._machineShopSeen = true;

          StateManager.addMessage(
            "你搭伙机修铺，焊修一把抓落袋¥450，名声+4。",

            "success",
          );
        },
      },

      {
        text: "🛠️ 只接散活",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 160;

          st.flags._machineShopSeen = true;

          StateManager.addMessage(
            "你只接零散焊修活，落袋¥160，时间自由。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "xiao_mei_english_interpret",

    phase: "street",

    icon: "🌐",

    title: "小美的翻译活",

    story:
      "小美带了个外商来，急缺个英语翻译。你英文底子不差，帮着谈成了一单，小美记你人情。",

    // conditions：xiao_mei 已结识+好感 + english 技能（NPC ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      var en = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof en !== "number" || en < 20) return false; // 检查 english>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._xmIntSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🌐 接下翻译",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          st.resources.cash += 260;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._xmIntSeen = true;

          StateManager.addMessage(
            "你帮小美谈成翻译，落袋¥260，小美好感+3。",

            "success",
          );
        },
      },

      {
        text: "🌐 只帮半场",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash += 80;

          st.flags._xmIntSeen = true;

          StateManager.addMessage("你只帮了半场翻译，落袋¥80。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "xiao_mei_english_tutor",

    phase: "street",

    icon: "📚",

    title: "小美的补习班",

    story:
      "小美知道你英文好，拉你给街坊孩子补口语：「你发音地道，孩子们就缺个能聊的，课时费我帮你谈。」",

    // conditions：xiao_mei 已结识且好感达标 + english 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof eng !== "number" || eng < 15) return false; // 检查 english>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 15) return false; // 检查 中后期

      if (st.flags && st.flags._xiaoMeiTutorSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "📚 接补习班",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          st.resources.cash += 380;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 小美更信你

          st.flags._xiaoMeiTutorSeen = true;

          StateManager.addMessage(
            "你接下街坊孩子的口语补习，落袋¥380，名声+4，小美好感+5。",

            "success",
          );
        },
      },

      {
        text: "🎓 只做公益课",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 8); // 小美赏识你

          st.flags._xiaoMeiTutorSeen = true;

          StateManager.addMessage(
            "你只开免费公益口语角，小美赏识你，好感+8。",

            "info",
          );
        },
      },
    ],
  });

  // ==== NPC 关系矩阵深度互动 ====

  // 事件1：王婶×张姐紧张调解
  // [自洽修复] conditions 校验：王婶已认识(met)、张姐已认识(met)、好感≥30
  RANDOM_EVENTS.push({
    id: "npc_wang_zhang_mediation",
    phase: "street",
    icon: "🤝",
    title: "街坊矛盾",
    story:
      "你路过巷口时听到争执声。王婶涨红了脸：「这块地我摆了三年了！」张姐不甘示弱：「城管都划线了，写的是公共区域！」\n\n旁边卖水果的大叔小声告诉你：王婶和张姐为了巷口摆摊的位置吵了一上午了，谁也不让谁。",
    conditions: function (st) {
      var rel = st.relationships; // 检查 relationships 对象
      if (!rel) return false;
      var wang = rel["aunt_wang"]; // 检查王婶关系
      var zhang = rel["sister_zhang"]; // 检查张姐关系
      if (!wang || !zhang) return false;
      if (!wang.met || !zhang.met) return false; // 两人都认识
      if ((wang.affinity || 0) < 30 || (zhang.affinity || 0) < 30) return false; // 好感≥30
      if (st.player.day < 20) return false; // 中期开始
      if (st.flags && st.flags._wangZhangMediation) return false; // 一次性
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 劝两人各退一步",
        hint: "各好感+8，心智+2",
        apply: function (st) {
          var rel = st.relationships;
          if (rel && rel["aunt_wang"])
            rel["aunt_wang"].affinity = Math.min(
              100,
              (rel["aunt_wang"].affinity || 0) + 8,
            );
          if (rel && rel["sister_zhang"])
            rel["sister_zhang"].affinity = Math.min(
              100,
              (rel["sister_zhang"].affinity || 0) + 8,
            );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 2,
          );
          st.flags._wangZhangMediation = true;
          st.flags._auntZhangMediated = true;
          StateManager.addMessage(
            "你两头说和，提议轮班摆：一人上午一人下午。两人勉强同意，各好感+8。",
            "success",
          );
          if (typeof scheduleChainEvent === "function") {
            scheduleChainEvent(st, "aunt_zhang_payoff", 30, "street");
          }
        },
      },
      {
        text: "🤔 帮王婶说话",
        hint: "王婶好感+12，张姐-6",
        apply: function (st) {
          var rel = st.relationships;
          if (rel && rel["aunt_wang"])
            rel["aunt_wang"].affinity = Math.min(
              100,
              (rel["aunt_wang"].affinity || 0) + 12,
            );
          if (rel && rel["sister_zhang"])
            rel["sister_zhang"].affinity = Math.max(
              0,
              (rel["sister_zhang"].affinity || 0) - 6,
            );
          st.flags._wangZhangMediation = true;
          StateManager.addMessage(
            "你帮王婶说话，张姐气得瞪了你一眼走了。王婶感激你，好感+12。",
            "success",
          );
        },
      },
      {
        text: "🤷 卖水果大叔说得对",
        hint: "回避问题，各好感+0",
        apply: function (st) {
          st.flags._wangZhangMediation = true;
          StateManager.addMessage(
            "你打了个哈哈，借口有事溜了。两边都觉得你不靠谱。关系无变化。",
            "info",
          );
        },
      },
    ],
  });

  // 事件2：老周牵头社区聚餐（多NPC联动）
  // [自洽修复] conditions 校验：老周已认识、好感≥40
  RANDOM_EVENTS.push({
    id: "npc_community_gathering",
    phase: "street",
    icon: "🍲",
    title: "巷口百家宴",
    story:
      "老周拎着两瓶白酒挨家挨户敲门：「今晚巷口摆百家宴，都来啊！」\n\n你探头一看，王婶端了锅红烧肉，陈师傅拎着半扇排骨，阿黄牵着孙女在摆凳子。老周冲你喊：「愣着干啥，去帮张姐搬桌子！」",
    conditions: function (st) {
      var rel = st.relationships;
      if (!rel) return false;
      var zhou = rel["old_zhou"];
      if (!zhou || !zhou.met) return false; // 认识老周
      if ((zhou.affinity || 0) < 40) return false; // 老周好感≥40
      if (st.player.day < 30) return false; // 中后期
      if (st.player.day > 365) return false; // 不超过一年
      if (
        st.flags &&
        (st.flags._communityGatheringDone || st.flags._rNpcCommunityGathering)
      )
        return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🍲 热心帮忙张罗",
        hint: "多NPC好感+5~8",
        apply: function (st) {
          var rel = st.relationships;
          var targets = [
            "old_zhou",
            "aunt_wang",
            "chef_chen",
            "sister_zhang",
            "ah_huang",
          ];
          for (var i = 0; i < targets.length; i++) {
            var r = rel && rel[targets[i]];
            if (r && r.met) r.affinity = Math.min(100, (r.affinity || 0) + 5);
          }
          if (rel && rel["old_zhou"])
            rel["old_zhou"].affinity = Math.min(
              100,
              (rel["old_zhou"].affinity || 0) + 8,
            );
          st.player.happiness = Math.min(100, (st.player.happiness || 0) + 8);
          st.flags._communityGatheringDone = true;
          StateManager.addMessage(
            "你端菜、搬桌子、陪小孩玩。百家宴热热闹闹，老周拍你肩膀：「好小子！」多NPC好感+5~8。",
            "success",
          );
        },
      },
      {
        text: "🥟 露一手厨艺",
        hint: "魅力+3，陈师傅好感+10",
        apply: function (st) {
          var rel = st.relationships;
          st.player.charm = Math.min(100, (st.player.charm || 0) + 3);
          if (rel && rel["chef_chen"])
            rel["chef_chen"].affinity = Math.min(
              100,
              (rel["chef_chen"].affinity || 0) + 10,
            );
          if (rel && rel["old_zhou"])
            rel["old_zhou"].affinity = Math.min(
              100,
              (rel["old_zhou"].affinity || 0) + 5,
            );
          st.flags._communityGatheringDone = true;
          StateManager.addMessage(
            "你做了道拿手菜，陈师傅尝了直点头：「有点意思！」魅力+3，陈师傅好感+10。",
            "success",
          );
        },
      },
      {
        text: "🍺 带两瓶酒加入",
        hint: "心情+5，老周好感+5",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);
          st.player.happiness = Math.min(100, (st.player.happiness || 0) + 5);
          var rel = st.relationships;
          if (rel && rel["old_zhou"])
            rel["old_zhou"].affinity = Math.min(
              100,
              (rel["old_zhou"].affinity || 0) + 5,
            );
          st.flags._communityGatheringDone = true;
          StateManager.addMessage(
            "你带了酒过去，和大家喝了几杯。老周说你够意思。心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // 事件3：李工头×陈哥合作契机
  // [自洽修复] conditions 校验：两人都认识、好感≥20
  RANDOM_EVENTS.push({
    id: "npc_li_chen_cooperation",
    phase: "street",
    icon: "🏗️",
    title: "工地缺人手",
    story:
      "李工头在工地上急得团团转：「这批钢筋今天必须卸完，但搬运工临时跑了仨！」\n\n他刚要打电话叫人，瞥见陈哥从外面路过。李工头犹豫了一下——他跟陈哥不太熟，但陈哥手下有几个兄弟闲着。",
    conditions: function (st) {
      var rel = st.relationships;
      if (!rel) return false;
      var li = rel["boss_li"];
      var chen = rel["chen_ge"];
      if (!li || !chen) return false;
      if (!li.met || !chen.met) return false; // 两人都认识
      if ((li.affinity || 0) < 20 || (chen.affinity || 0) < 20) return false; // 好感≥20
      if (st.player.day < 35) return false; // 中期
      if (st.flags && st.flags._liChenCooperation) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "💡 撮合他俩合作",
        hint: "各好感+10，名声+3",
        apply: function (st) {
          var rel = st.relationships;
          if (rel && rel["boss_li"])
            rel["boss_li"].affinity = Math.min(
              100,
              (rel["boss_li"].affinity || 0) + 10,
            );
          if (rel && rel["chen_ge"])
            rel["chen_ge"].affinity = Math.min(
              100,
              (rel["chen_ge"].affinity || 0) + 10,
            );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.flags._liChenCooperation = true;
          StateManager.addMessage(
            "你主动牵线，陈哥马上喊来三个人把活干了。李工头松了一大口气，各好感+10。",
            "success",
          );
        },
      },
      {
        text: "👷 自己顶上",
        hint: "体力+15，现金+120",
        apply: function (st) {
          st.resources.cash += 120;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          var rel = st.relationships;
          if (rel && rel["boss_li"])
            rel["boss_li"].affinity = Math.min(
              100,
              (rel["boss_li"].affinity || 0) + 8,
            );
          st.flags._liChenCooperation = true;
          StateManager.addMessage(
            "你撸起袖子自己干，搬了一下午钢筋，赚了¥120。李工头觉得你这人实在，好感+8。",
            "success",
          );
        },
      },
      {
        text: "📢 当中间人赚点",
        hint: "现金+80，好感+3",
        apply: function (st) {
          st.resources.cash += 80;
          var rel = st.relationships;
          if (rel && rel["boss_li"])
            rel["boss_li"].affinity = Math.min(
              100,
              (rel["boss_li"].affinity || 0) + 3,
            );
          if (rel && rel["chen_ge"])
            rel["chen_ge"].affinity = Math.min(
              100,
              (rel["chen_ge"].affinity || 0) + 3,
            );
          st.flags._liChenCooperation = true;
          StateManager.addMessage(
            "你替李工头传话，谈好了搬运费，自己赚了¥80中介费。两边都还算满意。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.77 — 联动空白区填充（5个新事件）
  // 设计理念：填补长期积累、天气×地点组合、NPC极致好感、道德分叉、多技能协同五大空白
  // ====================================================================

  // 联动1：长期行动积累 → 老手特遇
  // 设计意图：玩家累计某种行动≥50次后，遇到"行家被认出来"的专属事件
  // 联动系统：stats.actionFreq + phase + relationships
  RANDOM_EVENTS.push({
    id: "veteran_action_recognition",
    phase: "street",
    icon: "⭐",
    title: "老手被认出来了",
    story:
      "你在常去的地点办事时，有人突然认出了你：「你就是那个……做了这么多年XX的老手吧？」\n\n对方眼里带着尊重——在这座城市里，长期积累的经验本身就是一笔财富。",
    // [自洽修复] conditions 新增：actionFreq 检查，累计行动≥50次
    conditions: function (st) {
      if (st.player.day < 60) return false;
      var freq = st.stats && st.stats.actionFreq ? st.stats.actionFreq : {};
      var maxFreq = 0;
      for (var k in freq) {
        if (freq[k] > maxFreq) maxFreq = freq[k];
      }
      if (maxFreq < 50) return false;
      var rel = st.relationships;
      var hasAnyRel = false;
      if (rel) {
        for (var r in rel) {
          if (rel[r] && rel[r].met) {
            hasAnyRel = true;
            break;
          }
        }
      }
      return hasAnyRel;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "😊 谦虚回应，多聊几句",
        hint: "好感+5，人脉扩展",
        apply: function (st) {
          st.flags._veteranRecognized = true;
          var rel = st.relationships;
          if (rel) {
            for (var r in rel) {
              if (rel[r] && rel[r].met) {
                rel[r].affinity = Math.min(100, (rel[r].affinity || 0) + 3);
              }
            }
          }
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "😊 你笑了笑说「还行，做了几年而已。」对方也笑了：「几年都不容易。」你心里暖暖的。心智+3，心情+10。",
            "success",
          );
        },
      },
      {
        text: "🤝 交换联系方式，积累人脉",
        hint: "名气+3，解锁后续机会",
        apply: function (st) {
          st.flags._veteranRecognized = true;
          st.flags._veteranNetwork = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          StateManager.addMessage(
            "🤝 你们互换了微信。对方说「以后有活儿互相介绍。」名气+3，心智+2，人脉网络+1。",
            "success",
          );
        },
      },
      {
        text: "😐 淡淡一笑，继续忙自己的",
        hint: "无变化",
        apply: function (st) {
          st.flags._veteranRecognized = true;
          StateManager.addMessage(
            "😐 你点点头没多说，继续忙自己的事。有些人不值得你停下脚步。",
            "info",
          );
        },
      },
    ],
  });

  // 联动2：天气×地点组合情境事件
  // 设计意图：同样的极端天气在不同地点产生完全不同的叙事体验
  // 联动系统：weather + trade.currentLocation + phase
  RANDOM_EVENTS.push({
    id: "weather_location_typhoon",
    phase: "street",
    icon: "🌀",
    title: "台风天的抉择",
    story:
      "台风预警拉响了——预计明天就有强风暴雨。你看了看自己所在的位置，心里盘算着接下来的安排。",
    // [自洽修复] conditions 新增：台风天气 + 地点检查
    conditions: function (st) {
      if (st.weather && st.weather.current !== "typhoon") return false;
      if (st.player.phase !== "street") return false;
      var loc = st.trade && st.trade.currentLocation;
      if (!loc || !["market", "construction", "slum"].includes(loc))
        return false;
      if (st.flags && st.flags._typhoonChoiceSeen) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🏠 赶紧回家躲台风",
        hint: "安全，但可能损失今日收入",
        apply: function (st) {
          st.flags._typhoonChoiceSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.status.health = Math.min(100, (st.status.health || 70) + 3);
          var loc = st.trade && st.trade.currentLocation;
          var lostIncome = 0;
          if (loc === "construction") lostIncome = Random.int(80, 150);
          else if (loc === "market") lostIncome = Random.int(50, 100);
          else lostIncome = Random.int(30, 60);
          StateManager.addMessage(
            "🏠 你决定安全第一，赶紧往家赶。虽然今天少赚了¥" +
              lostIncome +
              "，但台风天在外面太危险了。心情+5，健康+3。",
            "info",
          );
        },
      },
      {
        text: "💪 留下来，抢在最后关头多干一票",
        hint: "高风险高回报",
        apply: function (st) {
          st.flags._typhoonChoiceSeen = true;
          if (Random.chance(0.4)) {
            var earn = Random.int(200, 500);
            st.resources.cash += earn;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
            st.status.health = Math.max(0, (st.status.health || 70) - 10);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 25);
            StateManager.addMessage(
              "💪 你顶住了最后的风雨，多干了一票赚了¥" +
                earn +
                "。但浑身湿透，健康-10，疲劳+25。",
              "success",
            );
          } else {
            st.status.health = Math.max(0, (st.status.health || 70) - 15);
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 30);
            StateManager.addMessage(
              "💪 台风比你想象的更猛——你被吹倒在了路边，浑身是伤。健康-15，疲劳+30。这票亏大了。",
              "danger",
            );
          }
        },
      },
      {
        text: "📱 帮邻居们一起加固店铺",
        hint: "社交+10，获得邻里好感",
        apply: function (st) {
          st.flags._typhoonChoiceSeen = true;
          var rel = st.relationships;
          if (rel) {
            for (var r in rel) {
              if (rel[r] && rel[r].met) {
                rel[r].affinity = Math.min(100, (rel[r].affinity || 0) + 8);
              }
            }
          }
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "📱 你挨家挨户帮邻居加固棚子、搬东西。虽然没赚钱，但邻里关系更近了。心智+5，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // 联动3：NPC极致好感（≥80）→ 意外发现
  // 设计意图：与NPC关系极深后，对方会主动分享一个隐藏资源/机会
  // 联动系统：relationships + affinity >= 80
  RANDOM_EVENTS.push({
    id: "deep_bond_secret_resource",
    phase: "street",
    icon: "🔑",
    title: "知己的秘密",
    story:
      "你和一位相识已久的朋友深夜喝酒，对方突然压低声音说：「有件事我一直没告诉别人，但我觉得你应该知道。」\n\nTa 从口袋里掏出一张名片——那是一个你从未听说过的机会。",
    // [自洽修复] conditions 新增：任意NPC affinity >= 80
    conditions: function (st) {
      if (st.player.day < 45) return false;
      var rel = st.relationships;
      if (!rel) return false;
      for (var r in rel) {
        if (rel[r] && rel[r].met && (rel[r].affinity || 0) >= 80) {
          return true;
        }
      }
      return false;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🔑 接过资源，深表感谢",
        hint: "获得隐藏机会",
        apply: function (st) {
          st.flags._deepBondResource = true;
          var bestRel = null;
          var bestAff = 0;
          for (var r in st.relationships) {
            if (st.relationships[r] && st.relationships[r].met) {
              var a = st.relationships[r].affinity || 0;
              if (a > bestAff) {
                bestAff = a;
                bestRel = r;
              }
            }
          }
          if (bestRel) {
            st.relationships[bestRel].affinity = Math.min(
              100,
              (st.relationships[bestRel].affinity || 0) + 5,
            );
          }
          var rewards = [
            { type: "cash", value: Random.int(300, 800), msg: "现金" },
            { type: "info", value: "market", msg: "市场情报" },
            { type: "network", value: "contact", msg: "人脉" },
          ];
          var reward = rewards[Random.int(0, 2)];
          if (reward.type === "cash") {
            st.resources.cash += reward.value;
            st.resources.totalEarned =
              (st.resources.totalEarned || 0) + reward.value;
            StateManager.addMessage(
              "🔑 「这是我的一点心意。」你收到了" +
                reward.msg +
                "，价值¥" +
                reward.value +
                "。",
              "success",
            );
          } else if (reward.type === "info") {
            st.player.intelligence = Math.min(
              100,
              (st.player.intelligence || 0) + 3,
            );
            StateManager.addMessage(
              "🔑 对方告诉你一个行业内幕消息——某个批发市场下周会有大批低价货。智力+3，获得市场情报。",
              "success",
            );
          } else {
            st.flags._extendedNetwork = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "🔑 对方把你介绍给了一个关键人物——「以后有事找他，说是我的朋友就行。」名气+5，人脉扩展。",
              "success",
            );
          }
        },
      },
      {
        text: "🙏 婉拒，不想欠人情",
        hint: "好感+3，保持纯粹",
        apply: function (st) {
          st.flags._deepBondResource = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          StateManager.addMessage(
            "🙏 「心意领了，但东西你拿回去。」对方愣了一下，然后笑了：「你这人，真是……」道德+2，好感+3。",
            "info",
          );
        },
      },
    ],
  });

  // 联动4：道德极端 → 人设分叉事件
  // 设计意图：同一个情境，高道德和低道德玩家面临完全不同的叙事分支
  // 联动系统：morality + phase + flags
  RANDOM_EVENTS.push({
    id: "moral_extreme_choice_fork",
    phase: "street",
    icon: "⚖️",
    title: "十字路口的人性",
    story:
      "你在街角看到一个老人摔倒在地，周围行人匆匆，没人停下来。\n\n你的手机刚好开着录像——这是一个拍视频博流量的好机会，也是一个伸出援手的时刻。",
    // [自洽修复] conditions 新增：道德值极端检查（≤20 或 ≥80）
    conditions: function (st) {
      if (st.player.day < 30) return false;
      var mor = st.player.morality || 50;
      if (mor > 20 && mor < 80) return false;
      if (st.flags && st.flags._moralForkSeen) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🤲 立刻扶起老人",
        hint: "道德+5，健康-3",
        apply: function (st) {
          st.flags._moralForkSeen = true;
          var mor = st.player.morality || 50;
          if (mor >= 80) {
            st.player.morality = Math.min(100, mor + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            StateManager.addMessage(
              "🤲 你毫不犹豫地跑过去扶起老人。老人颤抖着说谢谢，你帮他打了120。虽然自己摔着了，但心里很踏实。心情+15，心智+5，道德+5。",
              "success",
            );
          } else {
            st.player.morality = Math.min(100, mor + 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🤲 你扶起老人，心里想着「做个样子也好。」老人谢谢你，你摆摆手走了。道德+3，心情+5。",
              "info",
            );
          }
        },
      },
      {
        text: "📱 拍视频发抖音",
        hint: "流量+10，道德-5",
        apply: function (st) {
          st.flags._moralForkSeen = true;
          var mor = st.player.morality || 50;
          if (mor <= 20) {
            st.player.morality = Math.max(0, mor - 5);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            var earn = Random.int(200, 500);
            st.resources.cash += earn;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "📱 你举起手机录下了全过程，配文「街头冷漠」发了出去。视频火了，点赞破万，平台打赏¥" +
                earn +
                "。道德-5，名气+8。",
              "warning",
            );
          } else {
            st.player.morality = Math.max(0, mor - 3);
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            var earn = Random.int(100, 300);
            st.resources.cash += earn;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "📱 你最终还是举起了手机——「至少有人看到这件事，可能会帮忙。」视频获得了¥" +
                earn +
                "打赏。道德-3，名气+5。",
              "info",
            );
          }
        },
      },
      {
        text: "🚶 假装没看见走开",
        hint: "无变化",
        apply: function (st) {
          st.flags._moralForkSeen = true;
          var mor = st.player.morality || 50;
          if (mor <= 20) {
            st.player.morality = Math.max(0, mor - 2);
            StateManager.addMessage("🚶 你快步走开了。道德-2。", "warning");
          } else {
            st.player.morality = Math.max(0, mor - 1);
            StateManager.addMessage(
              "🚶 你犹豫了一下，最终没敢停下来。道德-1。",
              "info",
            );
          }
        },
      },
    ],
  });

  // 联动5：多技能协同 → 跨界机会
  // 设计意图：拥有3+技能达到30级的玩家，遇到跨界整合机会
  // 联动系统：skills level + phase
  RANDOM_EVENTS.push({
    id: "multi_skill_cross_domain",
    phase: "street",
    icon: "🔗",
    title: "跨界的机会",
    story:
      "有人找到你，说听说你什么都会一点——「能不能帮我做一个组合方案？我一个人搞不定这么多东西。」\n\n你想了想，确实，你掌握的技能比大多数人都多。",
    // [自洽修复] conditions 新增：多技能协同检查（≥3个技能达到30级以上）
    conditions: function (st) {
      if (st.player.day < 90) return false;
      var skills = st.skills || {};
      var qualified = 0;
      for (var sk in skills) {
        if (skills[sk] && (skills[sk].level || 0) >= 30) {
          qualified++;
        }
      }
      return qualified >= 3;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下这个综合项目",
        hint: "多技能XP+20，收入¥300-800",
        apply: function (st) {
          st.flags._multiSkillProject = true;
          var income = Random.int(300, 800);
          st.resources.cash += income;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + income;
          var skills = st.skills || {};
          var topSkills = [];
          for (var sk in skills) {
            if (skills[sk] && (skills[sk].level || 0) >= 30) {
              topSkills.push({ name: sk, level: skills[sk].level || 0 });
            }
          }
          topSkills.sort(function (a, b) {
            return b.level - a.level;
          });
          var xpText = "";
          for (var i = 0; i < Math.min(3, topSkills.length); i++) {
            skills[topSkills[i].name].xp = Math.min(
              1000,
              (skills[topSkills[i].name].xp || 0) + 20,
            );
            xpText += topSkills[i].name + "XP+20 ";
          }
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🤝 你接下了这个综合项目，发挥了自己的多面手优势。赚了¥" +
              income +
              "。" +
              xpText.trim() +
              "，心智+5，心情+10。",
            "success",
          );
        },
      },
      {
        text: "📋 推荐给别人，赚介绍费",
        hint: "现金+150，人脉+3",
        apply: function (st) {
          st.flags._multiSkillProject = true;
          st.resources.cash += 150;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 150;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📋 你把这个项目介绍给了更专业的人，自己赚了¥150的介绍费。名气+3，心情+5。",
            "info",
          );
        },
      },
      {
        text: "🚫 不感兴趣，专注本职",
        hint: "无变化",
        apply: function (st) {
          st.flags._multiSkillProject = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🚫 你婉拒了。觉得还是专注自己的主业比较好。心情+3。",
            "info",
          );
        },
      },
    ],
  });

  // ==== 财富里程碑叙事（P2空白区填充）====

  // 财富50万里程碑
  RANDOM_EVENTS.push({
    id: "wealth_500k_milestone",
    phase: "street",
    icon: "💎",
    title: "五十万里程碑",
    story:
      "你算了一笔账——银行卡里的、手头的现金、零零散散的投资，加起来竟然有五十万了。\n\n你盯着手机上的数字看了很久。三年前你刚来这座城市时兜里只有几百块，现在居然攒下了半百万。你想起城中村那个漏雨的隔间，想起在工地搬砖时磨出血的手掌。\n\n窗外的城市依旧车水马龙，但你知道，有些东西已经不一样了。",
    conditions: function (st) {
      if (st.player.day < 60) return false;
      if (st.flags && st.flags._wealth500kSeen) return false;
      var cash = st.resources && st.resources.cash;
      if (typeof cash !== "number") cash = 0;
      var bank = st.resources && st.resources.bankBalance;
      if (typeof bank !== "number") bank = 0;
      var total = cash + bank;
      if (total < 500000) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🏦 存起来吃利息",
        hint: "银行利息效率提升",
        apply: function (st) {
          st.flags._wealth500kSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "💎 你把大部分钱存了定期。银行卡里的数字看起来很踏实。心情+10。",
            "success",
          );
        },
      },
      {
        text: "📈 拿出来投资",
        hint: "投资机会解锁",
        apply: function (st) {
          st.flags._wealth500kSeen = true;
          st.flags._wealth500kInvestor = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 50) + 5,
          );
          // [全系统自洽修复] 域B 修复:st.needs.intelligence→st.player.intelligence（needs系统无intelligence字段）
          StateManager.addMessage(
            "📈 你开始认真研究理财和投资。五十万的本金，够做一些以前不敢想的事了。心智+5。",
            "info",
          );
        },
      },
      {
        text: "🏠 考虑付个首付",
        hint: "购房思路解锁",
        apply: function (st) {
          st.flags._wealth500kSeen = true;
          st.flags._wealth500kHomeBuyer = true;
          StateManager.addMessage(
            "🏠 你算了算首付——在这个城市够偏远一点的两居室了。你第一次觉得'在这座城市安家'不是梦。",
            "info",
          );
        },
      },
    ],
  });

  // 财富100万里程碑
  RANDOM_EVENTS.push({
    id: "wealth_1m_milestone",
    phase: "street",
    icon: "👑",
    title: "百万俱乐部",
    story:
      "你的个人资产突破了七位数。\n\n你坐在咖啡厅里，看着手机银行APP上的数字——1,000,000+。没有中彩票，没有继承遗产，纯粹是一块一块、一单一单攒出来的。\n\n服务员问你要不要续杯，你愣了一下。以前你从不敢在咖啡厅续杯。你说「好」。这一刻，你觉得自己真正在这座城市立住了脚跟。",
    conditions: function (st) {
      if (st.player.day < 120) return false;
      if (st.flags && st.flags._wealth1mSeen) return false;
      var cash = st.resources && st.resources.cash;
      if (typeof cash !== "number") cash = 0;
      var bank = st.resources && st.resources.bankBalance;
      if (typeof bank !== "number") bank = 0;
      var total = cash + bank;
      if (total < 1000000) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "💰 规划长远财务",
        hint: "智力+5，理财效率提升",
        apply: function (st) {
          st.flags._wealth1mSeen = true;
          st.flags._wealth1mFinanciallyPlanned = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          StateManager.addMessage(
            "💰 你找了一个理财顾问做规划。百万俱乐部门槛跨过了，下一步是让钱生钱。智力+5。",
            "success",
          );
        },
      },
      {
        text: "🎯 继续拼一拼",
        hint: "动力+5，设定更高目标",
        apply: function (st) {
          st.flags._wealth1mSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          StateManager.addMessage(
            "🎯 你给自己倒了杯水，对着窗外的城市说：'下一个目标，一千万。' 动力满满，心情+15。",
            "success",
          );
        },
      },
      {
        text: "✈️ 奖励自己一趟旅行",
        hint: "心情+20，花掉¥20,000",
        cost: 20000,
        apply: function (st) {
          st.flags._wealth1mSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20000);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
          st.needs.health = Math.min(100, (st.needs.health || 50) + 5);
          StateManager.addMessage(
            "✈️ 你请了一周假，去云南转了转。第一次不为省钱而旅行。回来时整个人都舒展了。心情+20，健康+5。",
            "success",
          );
        },
      },
    ],
  });

  // ==== 季节叙事深化（R34空白区）====

  // 酷暑求生 — 夏季极端高温事件
  // [自洽修复] conditions 校验：weather.season==="summer" + weather.current 温度相关
  RANDOM_EVENTS.push({
    id: "summer_heat_escape",
    phase: "street",
    icon: "🌡️",
    title: "酷暑难耐",
    story:
      "手机推送了高温红色预警：今日最高气温40°C。\n\n你走出门，热浪扑面而来，柏油路烤得发软。建筑工地上几个工友还在顶着太阳干活，身上的工服湿了又干、干了又湿。\n\n巷口卖冰粉的大妈今天加价了——她说冰粉都卖断货了，进货价涨了三成。",
    conditions: function (st) {
      if (!st.weather) return false;
      var season = st.weather.season; // 检查季节
      if (season !== "summer") return false;
      var temp = st.weather.temperature; // 检查温度
      if (typeof temp === "number" && temp < 35) return false;
      if (!st.weather.current) return false;
      var hotWeathers = ["sunny", "hot", "heatwave", "extreme_heat"];
      if (hotWeathers.indexOf(st.weather.current) === -1) return false;
      if (st.flags && st.flags._summerHeatEventSeen) return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🧊 买冰粉消暑",
        hint: "心情+5，花¥10",
        cost: 10,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.needs.health = Math.min(100, (st.needs.health || 50) + 2);
          st.flags._summerHeatEventSeen = true;
          StateManager.addMessage(
            "🧊 你买了碗冰粉，冰冰凉凉的感觉让人活过来了。心情+5。",
            "info",
          );
        },
      },
      {
        text: "💪 趁高温接室外活",
        hint: "体力+15，收入×1.3",
        apply: function (st) {
          var bonus = Random.int(40, 100);
          st.resources.cash += bonus;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          st.needs.health = Math.max(0, (st.needs.health || 50) - 3);
          st.flags._summerHeatEventSeen = true;
          StateManager.addMessage(
            "💪 你顶着烈日干了半天活，赚了¥" +
              bonus +
              "。但皮肤晒得发疼，健康-3。",
            "warning",
          );
        },
      },
      {
        text: "🏠 在家躲高温",
        hint: "避过最热时段",
        apply: function (st) {
          st.needs.health = Math.min(100, (st.needs.health || 50) + 3);
          st.flags._summerHeatEventSeen = true;
          StateManager.addMessage(
            "🏠 你决定今天不出门，在家吹风扇、看书、睡午觉。健康+3。",
            "info",
          );
        },
      },
    ],
  });

  // 技能双峰 — 两个技能同时达到50级
  // [自洽修复] conditions 校验：skills 对象存在，至少2个技能 level≥50
  RANDOM_EVENTS.push({
    id: "skill_dual_mastery",
    phase: "street",
    icon: "🏆",
    title: "技能双冠",
    story:
      "你查了一下自己的技能面板，忽然发现有两项技能都突破了50级大关——你现在是真正的双料熟手了。\n\n巷口的老陈头看见你，啧啧称奇：「你小子，现在什么都能干了？我听说城东那家新开的综合维修店正在招合伙师傅，月薪开到八千。」\n\n你心里一动——以前你只有一个技能的时候，没人正眼瞧你。现在不一样了。",
    conditions: function (st) {
      if (!st.skills || st.player.day < 45) return false;
      var count = 0;
      for (var key in st.skills) {
        var sk = st.skills[key];
        if (sk && typeof sk.level === "number" && sk.level >= 50) count++;
        if (count >= 2) break;
      }
      if (count < 2) return false;
      if (st.flags && st.flags._skillDualMasterySeen) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🎯 去城东维修店看看",
        hint: "现金+300，名声+5",
        apply: function (st) {
          st.resources.cash += 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._skillDualMasterySeen = true;
          StateManager.addMessage(
            "🎯 你去城东谈了谈，老板当场拍板要你。你接了第一单，赚了¥300。名声+5。",
            "success",
          );
        },
      },
      {
        text: "💡 继续打磨第三个技能",
        hint: "智力+3，技能积累加速",
        apply: function (st) {
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          st.flags._skillDualMasterySeen = true;
          StateManager.addMessage(
            "💡 你没有被眼前的机会冲昏头脑。你制定了新的学习计划，要成为三面手。智力+3。",
            "info",
          );
        },
      },
      {
        text: "😌 骄傲一下，给自己放半天假",
        hint: "心情+10",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.flags._skillDualMasterySeen = true;
          StateManager.addMessage(
            "😌 你给自己买了瓶啤酒，坐在巷口看夕阳。这么久以来，你第一次觉得自己是个有本事的人。心情+10。",
            "success",
          );
        },
      },
    ],
  });

  // ==== R36 新联动事件 ====

  // 1. 陈师傅厨艺比赛 — cooking技能+chef_chen NPC联动
  // [自洽修复] conditions 校验：chef_chen已认识、好感≥30、cooking技能≥15
  RANDOM_EVENTS.push({
    id: "npc_chef_chen_competition",
    phase: "street",
    icon: "🍳",
    title: "厨艺大赛帮手",
    story:
      "陈师傅拎着围裙急匆匆来找你：「街道办搞了个厨艺大赛，头奖¥2,000！我报了名，但一个人忙不过来——你来给我打下手，赢了分你一半！」\n\n他信心满满地拍了拍你的肩：「你的基本功我见过，够用。」",
    conditions: function (st) {
      var rel = st.relationships && st.relationships["chef_chen"];
      if (!rel || !rel.met) return false;
      if ((rel.affinity || 0) < 30) return false;
      var cook = st.skills && st.skills.cooking;
      if (!cook || (cook.level || 0) < 15) return false;
      if (st.flags && st.flags._chefCompetitionSeen) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🔪 好！给他打下手",
        hint: "厨艺xp+50，现金分¥1,000",
        apply: function (st) {
          st.flags._chefCompetitionSeen = true;
          var skill = st.skills && st.skills.cooking;
          if (skill) skill.xp = (skill.xp || 0) + 50;
          st.resources.cash += 1000;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 1000;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          var rel = st.relationships && st.relationships["chef_chen"];
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 8);
          StateManager.addMessage(
            "🔪 你给陈师傅打了一整天下手，他拿了冠军！分了¥1,000，名声+3，陈师傅好感+8。",
            "success",
          );
        },
      },
      {
        text: "🙋 让我来做主厨",
        hint: "厨艺xp+80，名声+5，但可能砸锅",
        apply: function (st) {
          st.flags._chefCompetitionSeen = true;
          var skill = st.skills && st.skills.cooking;
          var level = skill ? skill.level || 0 : 0;
          if (level >= 40) {
            if (skill) skill.xp = (skill.xp || 0) + 80;
            st.resources.cash += 1800;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + 1800;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            StateManager.addMessage(
              "🙋 你掌勺做了三道菜，评委赞不绝口！奖金¥1,800，名声+5。",
              "success",
            );
          } else {
            st.player.fame = Math.max(0, (st.player.fame || 0) - 2);
            if (skill) skill.xp = (skill.xp || 0) + 20;
            StateManager.addMessage(
              "🙋 你高估了自己——菜做得一般，陈师傅只好救场。没拿奖，名声-2。",
              "warning",
            );
          }
        },
      },
      {
        text: "⛔ 今天没空",
        hint: "陈师傅失望，好感-5",
        apply: function (st) {
          st.flags._chefCompetitionSeen = true;
          var rel = st.relationships && st.relationships["chef_chen"];
          if (rel) rel.affinity = Math.max(0, (rel.affinity || 0) - 5);
          StateManager.addMessage(
            "⛔ 你婉拒了，陈师傅有点失望地自己去了。好感-5。",
            "info",
          );
        },
      },
    ],
  });

  // 2. 早高峰奇遇 — 时间槽×NPC×地点事件
  // [自洽修复] conditions 校验：timeSlot==="morning" 且 体力不过低
  RANDOM_EVENTS.push({
    id: "morning_rush_encounter",
    phase: "street",
    icon: "🚇",
    title: "早高峰偶遇",
    story:
      "早高峰的地铁站人挤人。你被推着往前走的时候，忽然看见一个熟悉的身影——是之前打过交道的一位熟人，正被人群挤得东倒西歪，手里的早餐洒了一身。\n\n对方也看见了你，尴尬地笑了笑。",
    conditions: function (st) {
      if (st.player.timeSlot !== "morning") return false;
      if ((st.needs.fatigue || 0) > 85) return false;
      // 至少要认识一个NPC
      var rel = st.relationships;
      if (!rel) return false;
      var known = Object.keys(rel).filter(function (k) {
        return rel[k] && rel[k].met;
      });
      if (known.length < 1) return false;
      if (st.flags && st.flags._morningRushSeen) return false;
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🤝 帮忙擦一下",
        hint: "随机熟人好感+8",
        apply: function (st) {
          st.flags._morningRushSeen = true;
          // 找一个已认识的NPC随机加好感
          var rel = st.relationships;
          var known = Object.keys(rel).filter(function (k) {
            return rel[k] && rel[k].met;
          });
          if (known.length > 0) {
            var chosen = known[Math.floor(Random.random() * known.length)];
            rel[chosen].affinity = Math.min(
              100,
              (rel[chosen].affinity || 0) + 8,
            );
            StateManager.addMessage(
              "🤝 你帮对方擦了衣服，聊了一路。对方挺感激的，好感+8。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🤝 你帮陌生人擦了衣服，对方连声道谢。心情好了一些。",
              "info",
            );
          }
        },
      },
      {
        text: "😅 假装没看见",
        hint: "无变化",
        apply: function (st) {
          st.flags._morningRushSeen = true;
          StateManager.addMessage(
            "😅 你低下头假装看手机，被人群挤进了车厢。有些尴尬，但避免了麻烦。",
            "info",
          );
        },
      },
      {
        text: "☕ 请对方喝杯咖啡",
        hint: "现金-15，好感+12",
        cost: 15,
        apply: function (st) {
          st.flags._morningRushSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15);
          var rel = st.relationships;
          var known = Object.keys(rel).filter(function (k) {
            return rel[k] && rel[k].met;
          });
          if (known.length > 0) {
            var chosen = known[Math.floor(Random.random() * known.length)];
            rel[chosen].affinity = Math.min(
              100,
              (rel[chosen].affinity || 0) + 12,
            );
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "☕ 你请对方喝了杯咖啡，聊了几句近况。人情世故就是这么攒起来的。好感+12。",
            "success",
          );
        },
      },
    ],
  });

  // 3. 学历升级·导师引荐 — education+NPC联动
  // [自洽修复] conditions 校验：education≥1且未满3、至少认识一个高好感NPC
  RANDOM_EVENTS.push({
    id: "education_npc_mentorship",
    phase: "street",
    icon: "🎓",
    title: "有人推荐你深造",
    story:
      "一个你经常打交道的街坊找到你，说有个在职进修的机会——本市的成人教育学院开了个「城市管理与社会服务」专业，毕业发大专文凭，学费可以分期付。\n\n「我觉得你挺适合的，」对方认真地说，「你在这座城市混了这么久，差的不是能力，是那张纸。」",
    conditions: function (st) {
      if (!st.relationships) return false;
      var edu = st.player.education;
      if (typeof edu !== "number" || edu < 0 || edu >= 3) return false;
      // 至少有一个NPC好感≥50
      var rel = st.relationships;
      var hasHighAffinity = Object.keys(rel).some(function (k) {
        return rel[k] && rel[k].met && (rel[k].affinity || 0) >= 50;
      });
      if (!hasHighAffinity) return false;
      if (st.player.day < 60) return false;
      if (st.flags && st.flags._eduMentorshipSeen) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "📚 报名进修（¥2,000分期）",
        hint: "教育+1，智力+8，名声+5",
        cost: 2000,
        apply: function (st) {
          st.flags._eduMentorshipSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          st.player.education = Math.min(3, (st.player.education || 0) + 1);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 8,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._eduMentorEnrolled = true;
          StateManager.addMessage(
            "📚 你报名了在职进修，花了¥2,000。教育+1，智力+8，名声+5。那张纸，你要拿到手。",
            "success",
          );
        },
      },
      {
        text: "🕒 先了解，以后再说",
        hint: "了解信息，心智+3",
        apply: function (st) {
          st.flags._eduMentorshipSeen = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          StateManager.addMessage(
            "🕒 你要了招生简章，仔细看了看。心里有了数。心智+3。",
            "info",
          );
        },
      },
      {
        text: "😤 我不需要那张纸",
        hint: "无变化",
        apply: function (st) {
          st.flags._eduMentorshipSeen = true;
          StateManager.addMessage(
            "😤 你谢绝了对方的好意。你觉得能力比学历重要——但心里还是有些不安。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.77 新增事件注册完毕
  // ====================================================================

  // ====================================================================
  // v3.80 财富天花板 + 多周目继承彩蛋（loop R37）
  // ====================================================================

  // R37-① ¥1000万里程碑 — 城市传奇（财富天花板叙事）
  RANDOM_EVENTS.push({
    id: "wealth_10m_milestone",
    phase: "any",
    icon: "🏆",
    title: "城市传奇",
    story:
      "你最后一次核算资产的时候，数字跳过了一个你从未设想过的门槛——一千万。\n\n不是账面上的。是真实的：银行存款、投资账户、手里的房产，全部折算下来，超过了一千万。\n\n你想起第一天来这个城市，兜里揣着几百块，站在火车站广场上不知道该往哪走。那个站在广场上茫然的人，和今天的你，住在同一座城市里，却像是两个世界的人。\n\n你没有庆祝，没有发朋友圈。只是打开窗户，让夜风吹进来，站了很久。",
    conditions: function (st) {
      if (st.flags._10mMilestoneDone) return false;
      var total =
        (st.player.cash || 0) +
        (st.bankBalance || 0) +
        (st.investment && st.investment.portfolio
          ? Object.values(st.investment.portfolio).reduce(function (s, h) {
              return s + (h.shares || 0) * (h.avgCost || 0);
            }, 0)
          : 0);
      return total >= 10000000;
    },
    probability: 1.0,
    repeatable: false,
    choices: [
      {
        text: "🌃 站在窗边，想了很久",
        hint: "峰终记忆·名声+20·心情+30",
        apply: function (st) {
          st.flags._10mMilestoneDone = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 30);
          StateManager.addMessage(
            "🏆 你站在窗边，让夜风吹了很久。一千万。这个数字不再是别人的故事。名声+20，心情+30。",
            "success",
          );
        },
      },
      {
        text: "📞 给家里打了个电话",
        hint: "亲情回归·家庭关系+15·心情+20",
        apply: function (st) {
          st.flags._10mMilestoneDone = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
          if (st.family) {
            st.family.parentRelation = Math.min(
              100,
              (st.family.parentRelation || 50) + 15,
            );
          }
          StateManager.addMessage(
            "📞 电话那头，妈妈说「你好好的就行」。你没说钱的事，只说挺好的。名声+10，心情+20，亲情+15。",
            "success",
          );
        },
      },
      {
        text: "🎯 立刻制定下一个目标",
        hint: "继续前行·智力+5·解锁亿万旗帜",
        apply: function (st) {
          st.flags._10mMilestoneDone = true;
          st.flags._targeting100m = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 5,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          StateManager.addMessage(
            "🎯 你在笔记本上写下：下一个目标，一个亿。智力+5，心情+15。目标已设定。",
            "success",
          );
        },
      },
    ],
  });

  // R37-② 多周目熟悉的陌生人 — NPC认出你（继承好感触发）
  RANDOM_EVENTS.push({
    id: "ng_plus_familiar_face",
    phase: "street",
    icon: "🔮",
    title: "似乎在哪见过你",
    story:
      "你走进一家小摊前，摊主突然抬起头多看了你一眼。\n\n「你这张脸……」他停顿了一下，「奇怪，我明明没见过你，但总感觉认识很久了。你之前住在这附近吗？」\n\n你愣住了。这个问题你说不清楚——这辈子你确实是第一次来，但有什么东西说不清道不明地存在于你们之间。",
    conditions: function (st) {
      if (st.flags._ngFamiliarFaceDone) return false;
      if (!st.inheritanceBonuses) return false;
      if (!(st.inheritanceBonuses.npcInitialAffinity >= 5)) return false;
      if (st.player.day < 3) return false;
      return true;
    },
    probability: 0.8,
    repeatable: false,
    choices: [
      {
        text: "😊 「也许是有缘分吧」",
        hint: "所有已认识NPC好感+5·道德+2",
        apply: function (st) {
          st.flags._ngFamiliarFaceDone = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          if (st.relationships) {
            Object.keys(st.relationships).forEach(function (k) {
              if (st.relationships[k] && st.relationships[k].met) {
                st.relationships[k].affinity = Math.min(
                  100,
                  (st.relationships[k].affinity || 0) + 5,
                );
              }
            });
          }
          StateManager.addMessage(
            "🔮 你笑了笑说「也许是有缘分吧」。摊主也笑了，比以前更自在。所有认识的人好感+5，道德+2。",
            "success",
          );
        },
      },
      {
        text: "🤔 「我也说不清楚……」",
        hint: "获得跨生命感悟·心智+3",
        apply: function (st) {
          st.flags._ngFamiliarFaceDone = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          StateManager.addMessage(
            "🔮 你也说不清楚。像是某种无法解释的记忆在心里浮现。心智+3。你觉得这辈子会不一样。",
            "info",
          );
        },
      },
    ],
  });

  // R37-③ 多周目遗产礼物 — 上辈子的好意这辈子回来了
  RANDOM_EVENTS.push({
    id: "ng_plus_heritage_gift",
    phase: "street",
    icon: "🎁",
    title: "说不清的好运",
    story:
      "你路过巷口的时候，一个老大爷叫住了你。\n\n「小伙子，是你吗？我记得你之前帮过我……对，就是你这个眼神。」\n\n你不知道他在说什么，因为这辈子你根本没见过他。但老人坚持要给你一个红包，说是报恩。你推辞不过，最终收下了。",
    conditions: function (st) {
      if (st.flags._ngHeritageGiftDone) return false;
      if (!st.inheritanceBonuses) return false;
      var hadGoodBadges =
        st.inheritanceBonuses.moralEventRate ||
        (st.inheritanceBonuses.npcInitialAffinity || 0) >= 10;
      if (!hadGoodBadges) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "🎁 收下，感谢老人",
        hint: "¥200~¥800·道德+5",
        apply: function (st) {
          st.flags._ngHeritageGiftDone = true;
          var bonus = 200 + Math.floor((((st.player.day || 1) * 17) % 7) * 100);
          st.player.cash = (st.player.cash || 0) + bonus;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          StateManager.addMessage(
            "🎁 你收下了红包，里面有¥" +
              bonus +
              "。老人说：「好人有好报。」道德+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 推辞——我真的没帮过你",
        hint: "道德+8·心情+10",
        apply: function (st) {
          st.flags._ngHeritageGiftDone = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🙏 你执意推辞了。老人楞了一下，然后笑着说：「你这孩子，跟上辈子一样倔。」道德+8，心情+10。",
            "success",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.80 loop R37 注册完毕（3个事件：¥1000万里程碑/多周目熟人/多周目遗产礼物）
  // ====================================================================

  // ====================================================================
  // v3.81 loop R38 学历里程碑 + 住房里程碑 + 连续疲劳爆发 + 道德极端分叉
  // ====================================================================

  // R38-① 学历里程碑 — 大专→本科毕业典礼
  // 设计意图：学历升级是长期投入的回报，毕业典礼提供峰终记忆
  // 联动系统：education + player.day + housing.tier
  RANDOM_EVENTS.push({
    id: "education_graduation_ceremony",
    phase: "street",
    icon: "🎓",
    title: "毕业典礼",
    story:
      "成人教育学院发来短信：「尊敬的学员，您的毕业论文已通过答辩，请于本周六参加毕业典礼。」\n\n你盯着那条短信看了很久。三年前你还在城中村漏雨的隔间里刷夜刷题，今天你居然真的要毕业了。\n\n典礼很简单——一个简陋的会议室、几张塑料椅、院长念了半小时的致辞。但当校长把证书递到你手里时，你感觉到纸张的重量。",
    conditions: function (st) {
      if (st.player.day < 60) return false;
      if (st.flags && st.flags._graduationCeremonySeen) return false;
      // 检查education升级：从0→1或1→2
      var edu = st.player.education || 0;
      if (edu < 1) return false;
      return true;
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "📸 认真拍几张照片",
        hint: "心情+15，智力+3",
        apply: function (st) {
          st.flags._graduationCeremonySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 3,
          );
          StateManager.addMessage(
            "🎓 你在毕业典礼上拍了三张照片——一张和校长握手、一张和同学们的大合照、一张自己拿着证书的自拍。三年前的那个刷题少年，终于有了凭证。心情+15，智力+3。",
            "success",
          );
        },
      },
      {
        text: "🍜 请同学吃顿饭",
        hint: "现金-¥200，心情+10",
        cost: 200,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._graduationCeremonySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🍜 你请几个同学吃了顿火锅。大家聊起当年的苦日子，有人哭了，有人笑了。心情+10。",
            "success",
          );
        },
      },
      {
        text: "🚶 悄悄走掉，不参加了",
        hint: "错过仪式感",
        apply: function (st) {
          st.flags._graduationCeremonySeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          StateManager.addMessage(
            "🚶 你选了个借口溜了。证书收到了，但总觉得少了点什么。可能是一群人一起哭一起笑的冲动。心情-8。",
            "warning",
          );
        },
      },
    ],
  });

  // R38-② 住房等级里程碑 — 首次搬入一居室（从合租到独立）
  // 设计意图：住房升级是底层玩家的重要里程碑，需要情感叙事
  // 联动系统：housing.tier + player.day + cash
  RANDOM_EVENTS.push({
    id: "housing_tier_one_room",
    phase: "street",
    icon: "🏠",
    title: "自己的房间",
    story:
      "你终于签了一居室的合同——不再是合租的一个床位，也不再是隔断间里的一扇小门。\n\n钥匙插进锁孔的那一刻，你推开门。三十平米，一室一厅，卫生间能洗澡，厨房能煮面。虽然很小，但这是你在这座城市第一个完全属于自己的空间。\n\n你坐在地板上看了一会儿阳光从窗户照进来。",
    conditions: function (st) {
      if (st.player.day < 30) return false;
      if (st.flags && st.flags._housingOneRoomSeen) return false;
      // 检查是否刚搬入一居室（tier从<3升到3）
      if (!st.housing) return false;
      var tier = st.housing.tier || 0;
      // 首次达到一居室
      if (tier >= 3 && st.flags._housingTierReached < 3) {
        st.flags._housingTierReached = 3;
        return true;
      }
      // 或者tier刚升到3
      if (tier === 3 && !st.flags._housingOneRoomSeen) {
        return true;
      }
      return false;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🛋️ 慢慢布置自己的小窝",
        hint: "心情+15，卫生+10",
        apply: function (st) {
          st.flags._housingOneRoomSeen = true;
          st.flags._housingTierReached = Math.max(
            st.flags._housingTierReached || 0,
            3,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 10);
          StateManager.addMessage(
            "🏠 你花了两天时间布置这个小窝——一张桌子、一把椅子、一个书架。虽然简陋，但每一样东西都是你选的。心情+15，卫生+10。",
            "success",
          );
        },
      },
      {
        text: "📦 先住下来再说，以后慢慢添",
        hint: "先安顿，心情+5",
        apply: function (st) {
          st.flags._housingOneRoomSeen = true;
          st.flags._housingTierReached = Math.max(
            st.flags._housingTierReached || 0,
            3,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📦 你先把行李搬进来，铺了张床垫就睡了。明天再去买桌椅。心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // R38-③ 连续疲劳爆发 — 过劳晕倒
  // 设计意图：高疲劳持续多天后强制触发健康危机，让疲劳系统有真实后果
  // 联动系统：needs.fatigue + flags._habits.highFatigueStreak + housing.tier
  RANDOM_EVENTS.push({
    id: "fatigue_breakdown_collapse",
    phase: "street",
    icon: "💥",
    title: "倒下的一瞬间",
    story:
      "你在搬东西的时候突然眼前一黑，整个人失去了知觉。\n\n醒来时发现自己躺在出租屋的床上，头痛欲裂。邻居说你已经晕了快两个小时了。你记不清自己连续多少天没好好休息了——大概是从上周开始的？\n\n身体在用最极端的方式告诉你：不能再这样了。",
    conditions: function (st) {
      if (st.player.day < 15) return false;
      if (st.flags && st.flags._fatigueBreakdownSeen) return false;
      // 连续3天高疲劳
      var habits = st.flags && st.flags._habits;
      if (!habits || (habits.highFatigueStreak || 0) < 3) return false;
      // 当前疲劳仍高
      if ((st.needs.fatigue || 0) < 80) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🏥 去医院检查",
        hint: "¥300-500，健康+20，强制休息3天",
        apply: function (st) {
          st.flags._fatigueBreakdownSeen = true;
          st.flags._forcedRestDays = 3;
          st.flags._habits.highFatigueStreak = 0;
          var cost = Random.int(300, 500);
          if (st.resources.cash >= cost) {
            st.resources.cash -= cost;
          } else {
            st.resources.debt =
              (st.resources.debt || 0) + (cost - (st.resources.cash || 0));
            st.resources.cash = 0;
          }
          st.status.health = Math.min(100, (st.status.health || 50) + 20);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 40);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🏥 医生说你这是严重过劳，再晚送来可能出大事。打了营养液，开了药，花了¥" +
              cost +
              "。强制休息了三天，健康+20，疲劳-40，心智+5。你发誓再也不这样了。",
            "warning",
          );
        },
      },
      {
        text: "😴 在家躺着休息",
        hint: "免费，健康+10，疲劳-25",
        apply: function (st) {
          st.flags._fatigueBreakdownSeen = true;
          st.flags._forcedRestDays = 2;
          st.flags._habits.highFatigueStreak = 0;
          st.status.health = Math.min(100, (st.status.health || 50) + 10);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 25);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "😴 你关了手机，拉上窗帘躺了两天。除了外卖没人打扰。醒来时虽然还没完全恢复，但至少知道该放慢节奏了。健康+10，疲劳-25，心情+5。",
            "info",
          );
        },
      },
      {
        text: "💪 休息一下继续干",
        hint: "健康-15，疲劳-10，可能埋下疾病隐患",
        apply: function (st) {
          st.flags._fatigueBreakdownSeen = true;
          st.status.health = Math.max(0, (st.status.health || 50) - 15);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
          st.player.mental = Math.max(0, (st.player.mental || 0) - 5);
          StateManager.addMessage(
            "💪 你睡了半天就起来了。身体还在抗议，但你告诉自己没事。健康-15，疲劳-10。你知道自己在透支，但有时候没有选择。",
            "danger",
          );
        },
      },
    ],
  });

  // R38-④ 道德极端分叉 — 高道德者的城市共鸣 vs 低道德者的孤立
  // 设计意图：同一个城市事件，高道德玩家获得善意回报，低道德玩家遭遇冷漠反噬
  // 联动系统：morality + phase + housing.tier
  RANDOM_EVENTS.push({
    id: "moral_extreme_city_resonance",
    phase: "street",
    icon: "🌆",
    title: "城市的温度",
    story:
      "今天下班回家的路上，你经过一条小巷。巷口有个小孩子在哭——他的气球被树枝卡住了，够不着。\n\n你停下脚步。周围有几个路人也在看，但没有人动。",
    conditions: function (st) {
      if (st.player.day < 10) return false;
      if (st.flags && st.flags._moralCityResonanceSeen) return false;
      // 道德极端值：≥80（高道德）或 ≤20（低道德）
      var mor = st.player.morality || 50;
      if (mor > 20 && mor < 80) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: function (st) {
      var mor = st.player.morality || 50;
      if (mor >= 80) {
        // 高道德：主动帮助
        return [
          {
            text: "🎈 帮小孩拿下气球",
            hint: "道德+5，心情+15，可能获得意外回报",
            apply: function (s) {
              s.flags._moralCityResonanceSeen = true;
              s.player.morality = Math.min(100, (s.player.morality || 50) + 5);
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 15);
              // 小概率获得回报
              if (Random.chance(0.4)) {
                var reward = Random.int(20, 80);
                s.resources.cash += reward;
                s.resources.totalEarned =
                  (s.resources.totalEarned || 0) + reward;
                StateManager.addMessage(
                  "🎈 你踮起脚尖，好不容易把气球取了下来。小孩不哭了，笑得特别开心。他妈妈走过来塞给你¥" +
                    reward +
                    "：「谢谢你，今天是我儿子最开心的一天。」道德+5，心情+15，意外获得¥" +
                    reward +
                    "。这座城市偶尔也会给你温暖的回馈。",
                  "success",
                );
              } else {
                StateManager.addMessage(
                  "🎈 你踮起脚尖，好不容易把气球取了下来。小孩不哭了，笑得特别开心。他妈妈连声道谢。道德+5，心情+15。有时候一件小事就足够了。",
                  "success",
                );
              }
            },
          },
          {
            text: "📱 教小孩自己想办法",
            hint: "心智+3，耐心教导",
            apply: function (s) {
              s.flags._moralCityResonanceSeen = true;
              s.player.mental = Math.min(100, (s.player.mental || 0) + 3);
              s.player.morality = Math.min(100, (s.player.morality || 50) + 2);
              StateManager.addMessage(
                "📱 你蹲下来教小孩怎么够——先找根长棍子，再慢慢挑。小孩学会了，自己把气球弄了下来。心智+3，道德+2。",
                "info",
              );
            },
          },
        ];
      }
      // 低道德：冷漠旁观
      return [
        {
          text: "🚶 走开，不关我事",
          hint: "冷漠，心情-5",
          apply: function (s) {
            s.flags._moralCityResonanceSeen = true;
            s.player.morality = Math.max(0, (s.player.morality || 50) - 2);
            s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
            StateManager.addMessage(
              "🚶 你走了过去。身后小孩的哭声越来越小——不知道是被妈妈抱走了，还是哭累了。道德-2，心情-5。",
              "warning",
            );
          },
        },
        {
          text: "📱 拍个视频发网上",
          hint: "道德-3，但可能获得流量",
          apply: function (s) {
            s.flags._moralCityResonanceSeen = true;
            s.player.morality = Math.max(0, (s.player.morality || 50) - 3);
            s.player.fame = Math.min(100, (s.player.fame || 0) + 2);
            var earn = Random.int(10, 50);
            s.resources.cash += earn;
            s.resources.totalEarned = (s.resources.totalEarned || 0) + earn;
            StateManager.addMessage(
              "📱 你拍了个视频发了出去：「街头冷漠——小孩够不到气球没人帮。」有人评论说「这城市太凉了」。赚了¥" +
                earn +
                "，但心里有点堵。名气+2，道德-3。",
              "warning",
            );
          },
        },
      ];
    },
  });

  // ====================================================================
  // v3.81 loop R38 注册完毕（4个事件：学历毕业/住房一居室/过劳晕倒/道德分叉）
  // ====================================================================
  // ====== v3.82 loop R39 注册：累积状态爆发 / 电工+管理双技能 / 高温×批发市场声望 ======

  // 累积状态爆发：flags._habits.stomach_inflammationCount（由每日管线累积，>=3 触发）
  RANDOM_EVENTS.push({
    id: "habit_stomach_breakout",
    phase: "street",
    icon: "🤢",
    title: "老胃病又犯了",
    story:
      "连日对付着吃、饥一顿饱一顿，你的胃终于抗议了。\n" +
      "半夜里一阵绞痛把你惊醒，冷汗直冒，你蜷在床上想：这身子骨，到底还能撑多久？",
    conditions: function (st) {
      // 累积状态爆发：stomach_inflammationCount≥3（由每日管线累积）
      if (st.player.day < 15) return false;
      if (
        !st.flags ||
        !st.flags._habits ||
        (st.flags._habits.stomach_inflammationCount || 0) < 3
      )
        return false;
      if (!st.status || (st.status.health || 70) >= 60) return false;
      if (st.flags._habitStomachBreakoutSeen) return false;
      return true;
    },
    probability: 0.2,
    repeatable: false,
    choices: [
      {
        text: "🏥 挂号做个胃镜",
        hint: "¥600-1000，健康恢复+12",
        apply: function (st) {
          st.flags._habitStomachBreakoutSeen = true;
          var cost = Random.int(600, 1000);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          st.status.health = Math.min(100, (st.status.health || 50) + 12);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);
          if (st.flags && st.flags._habits) {
            st.flags._habits.stomach_inflammationCount = 0;
          }
          StateManager.addMessage(
            "🏥 胃镜做了，医生说是慢性胃炎，开了药。你花了¥" +
              cost +
              "，但至少知道该怎么养了。健康+12，饥饿+15。",
            "info",
          );
        },
      },
      {
        text: "💊 药店随便买点胃药硬扛",
        hint: "¥80，健康+3，但炎症累积+1",
        apply: function (st) {
          st.flags._habitStomachBreakoutSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 80);
          st.status.health = Math.min(100, (st.status.health || 50) + 3);
          st.player.mental = Math.max(0, (st.player.mental || 20) - 4);
          if (st.flags && st.flags._habits) {
            st.flags._habits.stomach_inflammationCount =
              (st.flags._habits.stomach_inflammationCount || 0) + 1;
          }
          StateManager.addMessage(
            "💊 你买了盒最便宜的胃药，权当心理安慰。疼是压下去了，可根子没除。健康+3，心智-4，炎症再累积。",
            "warning",
          );
        },
      },
      {
        text: "🍲 自己熬锅小米粥养胃",
        hint: "¥40，健康+6（烹饪≥10则+10）",
        apply: function (st) {
          st.flags._habitStomachBreakoutSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 40);
          var cook =
            (st.skills && st.skills.cooking && st.skills.cooking.level) || 0;
          var gain = cook >= 10 ? 10 : 6;
          st.status.health = Math.min(100, (st.status.health || 50) + gain);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
          if (cook >= 10 && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 10;
          }
          StateManager.addMessage(
            "🍲 你慢火熬了锅小米粥，一口一口喝下去，胃里总算有了暖意。" +
              (cook >= 10 ? "手艺没白练，恢复得更好。" : "") +
              "健康+" +
              gain +
              "，饥饿+20" +
              (cook >= 10 ? "，烹饪经验+10。" : "。"),
            "success",
          );
        },
      },
    ],
  });

  // 双技能协同：电工(electrician) + 管理(management)，连接技能系统 → 高客单工程承包
  RANDOM_EVENTS.push({
    id: "elec_mgmt_contract",
    phase: "street",
    icon: "🔧",
    title: "街道办的改造工程",
    story:
      "街道办的老主任在小区里见过你干活——既会接线又会张罗。\n" +
      "「老旧小区电路改造，正缺个既懂技术又能带人的。你干不干？带个小工程队，预算归你控。」",
    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 电工技能等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 管理技能等级
      return (
        typeof elec === "number" &&
        elec >= 20 &&
        typeof mgmt === "number" &&
        mgmt >= 15 &&
        !st.flags._elecMgmtContractSeen
      );
    },
    probability: 0.016,
    repeatable: false,
    choices: [
      {
        text: "🔧 接下工程队",
        hint: "大额现金+，名声+",
        apply: function (st) {
          st.flags._elecMgmtContractSeen = true;
          var fee = 4200;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 9);
          if (st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 40;
          if (st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 35;
          StateManager.addMessage(
            "🔧 你带着三五个兄弟把整片老楼的线路理顺了，验收一次过。街道办挺满意，结了¥" +
              fee +
              "，名声+9，电工与管理经验双涨。",
            "success",
          );
        },
      },
      {
        text: "📋 只当技术顾问",
        hint: "现金+，风险更小",
        apply: function (st) {
          st.flags._elecMgmtContractSeen = true;
          var fee = 1600;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          if (st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 20;
          StateManager.addMessage(
            "📋 你嫌带队伍太操心，只做技术把关。拿了¥" +
              fee +
              "顾问费，名声+3，电工经验+20。",
            "info",
          );
        },
      },
    ],
  });

  // 天气×地点×声望：heatwave（真实天气id） + reputation.wholesaleMarket（按地点key）联动
  RANDOM_EVENTS.push({
    id: "weather_heatwave_market",
    phase: "street",
    icon: "🌞",
    title: "热浪里的生意",
    story:
      "气象台连发高温红色预警，整座城市像扣在蒸笼里。\n" +
      "批发市场的冰饮、风扇、藿香正气水被抢空——而你因为平时守规矩、口碑好，档口老板特意给你留了货。",
    conditions: function (st) {
      if (!st.weather || st.weather.current !== "heatwave") return false;
      if (!st.reputation || typeof st.reputation.wholesaleMarket !== "number")
        return false;
      if (st.reputation.wholesaleMarket < 30) return false;
      if (st.flags._weatherHeatwaveMarketSeen) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🧊 囤一批冰饮倒卖",
        hint: "现金+，但高温下健康-",
        apply: function (st) {
          st.flags._weatherHeatwaveMarketSeen = true;
          var earn = Random.int(800, 1600);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.status.health = Math.max(0, (st.status.health || 70) - 6);
          StateManager.addMessage(
            "🧊 你顶着烈日一趟趟搬货，冰饮半天售罄，净赚¥" +
              earn +
              "。钱是落袋了，人也被晒脱了层皮。健康-6。",
            "success",
          );
        },
      },
      {
        text: "💧 给邻里免费送水",
        hint: "名声+，心情+，现金小损",
        apply: function (st) {
          st.flags._weatherHeatwaveMarketSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "💧 你把留的货分给楼下独居老人和小孩，没赚反贴了¥200。\n" +
              "有人拍了照发到业主群，夸你是「这条街最暖的人」。名声+6，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // ====== v3.1 联动扩充（空白区：双技能协同 / 技能门槛专业视角） ======
  // 设计意图：补齐双技能矩阵（cooking+accounting / driving+management）与
  // 「技能门槛专业视角」类事件——只有技能达到专业门槛才会触发的内行视角叙事。

  // ① 双技能协同：cooking ≥20 ∩ accounting ≥15 → 餐饮核算（掌勺+对账）
  RANDOM_EVENTS.push({
    id: "cook_account_consult",
    phase: "street",
    icon: "🍳",
    title: "饭馆老板的糊涂账",
    story:
      "巷口新开的小饭馆生意不差，老板却总算不清是赚是赔。\n" +
      "他听人夸你「菜做得好，账也算得清」，特意来问：「能不能既帮我掌两勺、再把这堆单子对一对？」",
    conditions: function (st) {
      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 厨艺等级
      var acct =
        st.skills && st.skills.accounting && st.skills.accounting.level; // 会计等级
      return (
        typeof cook === "number" &&
        cook >= 20 &&
        typeof acct === "number" &&
        acct >= 15 &&
        !st.flags._cookAccountConsultSeen
      );
    },
    probability: 0.014,
    repeatable: false,
    choices: [
      {
        text: "🍳 掌勺又对账",
        hint: "现金+，厨艺/会计双经验+",
        apply: function (st) {
          st.flags._cookAccountConsultSeen = true;
          var fee = 1900;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          if (st.skills.cooking)
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 30;
          if (st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 30;
          StateManager.addMessage(
            "🍳 你白天颠勺、晚上对账，把三个月的糊涂账理成了清清爽爽的报表。\n" +
              "老板拍板留你长期合作，结了¥" +
              fee +
              "，厨艺与会计经验双涨。",
            "success",
          );
        },
      },
      {
        text: "📒 只做成本核算顾问",
        hint: "现金+，风险更小",
        apply: function (st) {
          st.flags._cookAccountConsultSeen = true;
          var fee = 900;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          if (st.skills.accounting)
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 20;
          StateManager.addMessage(
            "📒 你嫌守着灶台太累，只帮他把成本结构算清楚。\n" +
              "拿了¥" +
              fee +
              "顾问费，老板连说「原来肉价一涨就亏在这」，会计经验+20。",
            "info",
          );
        },
      },
    ],
  });

  // ② 双技能协同：driving ≥20 ∩ management ≥15 → 车队调度（开车+排班）
  RANDOM_EVENTS.push({
    id: "drive_mgmt_fleet",
    phase: "street",
    icon: "🚚",
    title: "同城货运的调度缺口",
    story:
      "一家做同城急送的小公司最近单子暴涨，却总在排班上乱套——车跑空趟、客户催爆。\n" +
      "老板翻了翻你的简历：「又会开车、又懂带人排活，这活儿你最合适。来帮我管管车队？」",
    conditions: function (st) {
      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 驾驶等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 管理等级
      return (
        typeof drv === "number" &&
        drv >= 20 &&
        typeof mgmt === "number" &&
        mgmt >= 15 &&
        !st.flags._driveMgmtFleetSeen
      );
    },
    probability: 0.014,
    repeatable: false,
    choices: [
      {
        text: "🚚 接下车队调度",
        hint: "现金+，驾驶/管理双经验+",
        apply: function (st) {
          st.flags._driveMgmtFleetSeen = true;
          var fee = 2600;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          if (st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 30;
          if (st.skills.management)
            st.skills.management.xp = (st.skills.management.xp || 0) + 30;
          StateManager.addMessage(
            "🚚 你把空趟率压到最低，客户投诉少了一大半。\n" +
              "老板爽快结了¥" +
              fee +
              "，驾驶与管理经验双涨。",
            "success",
          );
        },
      },
      {
        text: "🛣️ 只当全职司机",
        hint: "现金+，体力消耗大",
        apply: function (st) {
          st.flags._driveMgmtFleetSeen = true;
          var fee = 1400;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
          if (st.skills.driving)
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 20;
          StateManager.addMessage(
            "🛣️ 你嫌管人麻烦，只接了全职司机的活儿，天天跑城西到城东。\n" +
              "落了¥" +
              fee +
              "，人累得够呛（疲劳+12），驾驶经验+20。",
            "info",
          );
        },
      },
    ],
  });

  // ③ 技能门槛专业视角：electrician ≥30 → 一眼看穿电路隐患（内行视角叙事）
  RANDOM_EVENTS.push({
    id: "pro_view_electrician",
    phase: "street",
    icon: "💡",
    title: "老化的电线",
    story:
      "路过一家老商铺，你下意识抬头扫了眼配电箱——铝线接铜端子、绝缘层发脆、负载明显超了。\n" +
      "这在行内人眼里就是颗定时炸弹：再这么用下去，夏天一高负荷准出事。\n" +
      "老板正埋头理货，浑然不觉头顶的风险。",
    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 电工等级
      return (
        typeof elec === "number" &&
        elec >= 30 &&
        !st.flags._proViewElectricianSeen
      );
    },
    probability: 0.018,
    repeatable: false,
    choices: [
      {
        text: "🆓 免费提醒，防患未然",
        hint: "名声+，心情+，无现金",
        apply: function (st) {
          st.flags._proViewElectricianSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
          StateManager.addMessage(
            "💡 你拉住老板把隐患一条条说清，他当场冒了冷汗，连夜找人整改。\n" +
              "后来整条街都在传「那个懂电的小伙子救了一铺子」。名声+5，心情+6。",
            "success",
          );
        },
      },
      {
        text: "🔧 接下整改工程",
        hint: "现金+，电工经验+",
        apply: function (st) {
          st.flags._proViewElectricianSeen = true;
          var fee = 1500;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          if (st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 35;
          StateManager.addMessage(
            "🔧 老板二话不说把整改包给你。你重排了线路、换了端子，隐患彻底清零。\n" +
              "结了¥" +
              fee +
              "，电工经验+35，街坊都记住了你这号技术人。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 健康康复叙事事件（R37 新增） ======
  // 设计意图：填补"16种疾病5大类但康复叙事为零"的空白
  // 核心逻辑：每个事件检测「曾经病过/濒危 + 现已康复」的双态条件

  // ① 从危到安：经历过health危机（<30）后恢复到正常水平的顿悟时刻
  // 设计心理学：峰终定律（"熬过来了"的峰值记忆）· 损失厌恶（回望危险的后怕驱动）
  RANDOM_EVENTS.push({
    id: "recovery_brink_relief",
    phase: "street",
    icon: "🌅",
    title: "从危到安",
    story:
      "你站在出租屋的窗前，阳光照进来，暖洋洋的。\n一个月前你差点以为自己撑不过去了——身体垮到连下床都费劲，脑子里想的最多的是「要是倒在这里了，谁会第一个发现」。\n\n现在你站在这，虽然屋子还是那个破屋子，口袋还是那么瘪，但阳光照在手上的温度是真实的。你慢慢握了握拳头，有力气。\n\n楼下早餐摊的香味飘上来。你突然觉得饿了一一这种感觉，很久没有过了。",
    conditions: function (st) {
      // [自洽修复] 曾经触发过health危机（<30），现在恢复到健康线以上
      if (!st.flags._healthCrisisSeen) return false;
      if (st.player.phase !== "street") return false;
      if ((st.status.health || 50) < 55) return false;
      // 不处于严重疾病中（没有severity≥3的活跃疾病）
      if (st.status.illnesses && st.status.illnesses.length > 0) {
        for (var i = 0; i < st.status.illnesses.length; i++) {
          var illData = getIllnessData(st.status.illnesses[i]);
          if (illData && illData.severity >= 3) return false;
        }
      }
      if (st.flags._recoveryBrinkSeen) return false;
      return st.player.day >= 25;
    },
    probability: 0.15,
    repeatable: false,
    choices: [
      {
        text: "🥣 下楼好好吃一顿早餐",
        hint: "健康+ 心情+",
        apply: function (st) {
          st.flags._recoveryBrinkSeen = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 6);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 25);
          StateManager.addMessage(
            "🌅 你下楼吃了一碗热腾腾的豆浆油条。老板娘笑着说「哟，今天气色不错啊！」你心里一暖，活着真好。健康+6，心情+10。",
            "success",
          );
        },
      },
      {
        text: "📝 给未来的自己写封信",
        hint: "心智+ 记录这一刻",
        apply: function (st) {
          st.flags._recoveryBrinkSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 5);
          StateManager.addMessage(
            "🌅 你撕了张纸，写了几句话：『某某年某月某日，我差点倒下，但我没倒。』你把纸条夹进书里。心智+5。",
            "success",
          );
        },
      },
      {
        text: "💪 出门走走，感受一下城市",
        hint: "体力+ 心情+",
        apply: function (st) {
          st.flags._recoveryBrinkSeen = true;
          st.player.physique = Math.min(100, (st.player.physique || 22) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          StateManager.addMessage(
            "🌅 你沿着街走了很久。路边的猫在晒太阳，早餐摊冒着热气，卖菜的大妈在吆喝。这座城市还是老样子，但你看着它，觉得有点不一样了。体质+2，心情+6。",
            "success",
          );
        },
      },
    ],
  });

  // ② 康复后的那碗汤：NPC邻居/朋友在你病愈后送上关怀
  // 设计心理学：社会支持（低谷中的温暖）· 禀赋效应（好感关系产生回报）
  RANDOM_EVENTS.push({
    id: "recovery_warm_soup",
    phase: "street",
    icon: "🍲",
    title: "康复后的那碗汤",
    story:
      "你刚缓过来没多久，门就被敲响了。\n\n打开门，王大婶端着一碗热腾腾的鸡汤站在门口，围裙上还沾着油渍：\n「听说你前阵子病得不轻？年轻人一个人在外面，别硬撑。这汤我炖了一上午，趁热喝。」\n\n你愣了一下——你们平时也就见面打个招呼的交情。她放下汤就走了，临走又回头说了句：\n「碗不用急着还。」",
    conditions: function (st) {
      // [自洽修复] 曾经病过 + 现在健康恢复 + 必须认识王大婶
      if (!st.flags._everSick) return false;
      if (st.player.phase !== "street") return false;
      if ((st.status.health || 50) < 60) return false;
      // 没有活跃疾病
      if (st.status.illnesses && st.status.illnesses.length > 0) return false;
      // [自洽修复] 必须认识王大婶（叙事中有她亲自端汤）
      if (!st.relationships?.aunt_wang?.met) return false;
      if (st.flags._recoverySoupSeen) return false;
      return st.player.day >= 15;
    },
    probability: 0.12,
    repeatable: false,
    choices: [
      {
        text: "🍵 趁热喝掉，晚点去还碗",
        hint: "心情+ 好感+",
        apply: function (st) {
          st.flags._recoverySoupSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          st.status.health = Math.min(100, (st.status.health || 0) + 3);
          if (st.relationships && st.relationships.aunt_wang) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 5,
            );
          }
          StateManager.addMessage(
            "🍲 鸡汤很浓，里面还放了枸杞和红枣。你喝得鼻子有点酸——在这座城市，第一次有人给你炖汤。心情+12，健康+3，王大婶好感+5。",
            "success",
          );
        },
      },
      {
        text: "🥟 买点水果送回去",
        hint: "花¥20，人情加深",
        apply: function (st) {
          st.flags._recoverySoupSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (st.relationships && st.relationships.aunt_wang) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 8,
            );
          }
          StateManager.addMessage(
            "🍲 你买了点水果去还碗。王大婶嗔怪道「你这孩子，花这钱干啥！」但看得出她很高兴。她留你坐下聊了会天，说了些她年轻时在外地打工的往事。心情+8，名声+2，王大婶好感+8。",
            "success",
          );
        },
      },
      {
        text: "😐 客气道谢，关上门自己待着",
        hint: "保持距离",
        apply: function (st) {
          st.flags._recoverySoupSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 3);
          if (st.relationships && st.relationships.aunt_wang) {
            st.relationships.aunt_wang.affinity = Math.min(
              100,
              (st.relationships.aunt_wang.affinity || 0) + 2,
            );
          }
          StateManager.addMessage(
            "🍲 你道了谢，关上门慢慢喝完汤。汤很暖，但你习惯了独来独往。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ③ 病房奇遇：住院期间遇到病友，结下特殊情谊（同病相怜）
  // 设计心理学：社会比较（"别人比我更苦/更坚强"）· 峰终定律（低谷中的相遇成为记忆锚点）
  RANDOM_EVENTS.push({
    id: "recovery_ward_coincidence",
    phase: "street",
    icon: "🏥",
    title: "病房奇遇",
    story:
      "你想起在医院那几天。隔壁床是个四十多岁的中年男人，做了个大手术，家里没人陪护，每天自己举着输液瓶去上厕所。\n\n你俩有一搭没一搭地聊天。他说他是干装修的，干了二十年，腰不行了，这次是工伤。他手机屏保是他女儿的照片，今年高考。\n\n「考上了重点大学，一年的学费顶我半年工钱。但再难也得供啊，是不是？」\n\n出院那天他塞给你一张纸条，上面写了个电话号码：「兄弟，以后有啥装修的活，找我。给你打折。」",
    conditions: function (st) {
      // [自洽修复] 经历过健康危机（health < 30 或重病）且已恢复 + 遇到过NPC
      if (!st.flags._healthCrisisSeen && !st.flags._everSick) return false;
      if (st.player.phase !== "street") return false;
      if ((st.status.health || 50) < 60) return false;
      if (st.flags._recoveryWardSeen) return false;
      var hasMetNpc = false;
      if (st.relationships) {
        for (var r2 in st.relationships) {
          if (st.relationships[r2] && st.relationships[r2].met) {
            hasMetNpc = true;
            break;
          }
        }
      }
      if (!hasMetNpc) return false;
      return st.player.day >= 35;
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "📞 存下号码，以后联系",
        hint: "人脉+ 获得装修折扣渠道",
        apply: function (st) {
          st.flags._recoveryWardSeen = true;
          st.flags._recoveryContractorContact = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 4);
          StateManager.addMessage(
            "🏥 你存下了电话号码，备注名写了「装修老哥·病房认识的」。你想起他手机屏保上的笑脸——为女儿拼命的人，值得敬重。心智+4，名声+2，以后装修/修房有折扣渠道。",
            "success",
          );
        },
      },
      {
        text: "📱 加个微信，偶尔问候",
        hint: "社交+ 保持联系",
        apply: function (st) {
          st.flags._recoveryWardSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          StateManager.addMessage(
            "🏥 你们加了好友。他的朋友圈三天可见，最新一条是女儿的录取通知书照片，配文「值了」。你默默点了个赞。心情+6，心智+2。",
            "success",
          );
        },
      },
      {
        text: "🙏 祝他好运，各自珍重",
        hint: "放下，继续自己的路",
        apply: function (st) {
          st.flags._recoveryWardSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 3);
          StateManager.addMessage(
            "🏥 你们没有留联系方式。但你知道，这世上某个角落，有个为女儿拼命的装修师傅在好好活着。这就够了。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ④ 康复决心：病愈后立flag开始运动/养生的转折仪式
  // 设计心理学：损失厌恶（不想再经历一次）· 新起点效应（病愈作为"重新做人"的心理锚点）
  RANDOM_EVENTS.push({
    id: "recovery_exercise_resolution",
    phase: "street",
    icon: "🏃",
    title: "康复的决心",
    story:
      "你生了一场病后，第一次认真打量自己：镜子里的那个人脸色苍白、身形消瘦，眼下挂着两团乌青。\n\n你想起前几天躺在床上时想的事——要是早点注意身体，是不是就不会躺在那了？\n\n「不能再这样了。」你对自己说。\n\n虽然现在手头还是紧，日子还是难，但至少有一件事是现在就能开始做的。",
    conditions: function (st) {
      // [自洽修复] 曾经病过/濒危 + 现在健康恢复正常 + 时间足够长（已过急性期）
      if (!st.flags._everSick && !st.flags._healthCrisisSeen) return false;
      if (st.player.phase !== "street") return false;
      if ((st.status.health || 50) < 55) return false;
      if (st.flags._recoveryExerciseSeen) return false;
      return st.player.day >= 40;
    },
    probability: 0.1,
    repeatable: false,
    choices: [
      {
        text: "🏃 每天早起跑步15分钟",
        hint: "体质+ 健康+ 养成习惯",
        apply: function (st) {
          st.flags._recoveryExerciseSeen = true;
          st.flags._recoveryRunningHabit = true;
          st.player.physique = Math.min(100, (st.player.physique || 22) + 3);
          st.status.health = Math.min(100, (st.status.health || 0) + 4);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🏃 第二天一早你就爬起来跑了15分钟——虽然跑了一半就开始喘，但跑完后的那种畅快感很久没有过了。体质+3，健康+4，心情+5。获得「晨跑习惯」加成：每日健康恢复+1。",
            "success",
          );
        },
      },
      {
        text: "🥗 改善饮食，少油少盐",
        hint: "健康+ 减少生病概率",
        apply: function (st) {
          st.flags._recoveryExerciseSeen = true;
          st.flags._recoveryDietHabit = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 3);
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "🥗 你开始注意吃的东西了——早上不再是干啃馒头，好歹加个鸡蛋。晚上也尽量自己做，少点外卖。健康+3，饱腹+5，心智+2。获得「健康饮食」加成：垃圾食品致病概率-15%。",
            "success",
          );
        },
      },
      {
        text: "🕐 调整作息，不熬夜了",
        hint: "疲劳恢复+ 失眠概率降低",
        apply: function (st) {
          st.flags._recoveryExerciseSeen = true;
          st.flags._recoverySleepHabit = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 2);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 3);
          StateManager.addMessage(
            "🕐 你试着11点前上床。第一晚翻来覆去到一点才睡着，但第二天醒来确实没那么累了。心智+3，健康+2。获得「规律作息」加成：每日疲劳恢复+5%。",
            "info",
          );
        },
      },
    ],
  });

  // ⑤ 街头老中医：亚健康状态遇到义诊老中医，给予养生点拨
  // 设计心理学：权威效应（长者建言）· 禀赋效应（获得养生知识等于获得可积累的健康资本）
  RANDOM_EVENTS.push({
    id: "recovery_herbalist_wisdom",
    phase: "street",
    icon: "🌿",
    title: "街头老中医",
    story:
      "菜市场拐角处，一个白发老人支了张折叠桌，桌上摆着「免费义诊」的牌子。旁边围了几个人，老人正在给一个大姐把脉。\n\n你本想路过——但你最近确实总觉得累，也说不上哪不舒服，就是整个人像生锈了一样。\n\n老人抬头看见你，笑了笑：\n「小伙子，脸色不太好啊。来，坐下，不要钱。我看你印堂发暗、眼下浮肿——是不是经常熬夜、吃饭不准点？」",
    conditions: function (st) {
      // [自洽修复] 长期处于亚健康状态（健康中等水平） + 曾经病过
      if (!st.flags._everSick && !st.flags._healthCrisisSeen) return false;
      if (st.player.phase !== "street") return false;
      var h = st.status.health || 50;
      if (h < 40 || h > 68) return false; // 太健康或太差都不触发
      if (st.flags._recoveryHerbalSeen) return false;
      return st.player.day >= 25;
    },
    probability: 0.09,
    repeatable: false,
    choices: [
      {
        text: "🖐️ 坐下让老人把脉",
        hint: "健康知识+ 心智+",
        apply: function (st) {
          st.flags._recoveryHerbalSeen = true;
          st.flags._recoveryHerbalAdvice = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 4);
          StateManager.addMessage(
            "🌿 老人把了把脉，又看了看你的舌苔，沉吟片刻：\n「脾胃虚弱、气血不足。年轻人，你这不是大病——但你这样耗下去，三五年后就是大病了。」\n他开了个方子：山药、红枣、枸杞，每天煮水喝。又嘱咐你少喝冰的、晚上11点前睡。\n你记在心里。健康+5，心智+4。获得「养生知识」：健康自然恢复速度+0.5/天。",
            "success",
          );
        },
      },
      {
        text: "💊 问能不能治本",
        hint: "花¥30买点中药试试",
        apply: function (st) {
          st.flags._recoveryHerbalSeen = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
          st.status.health = Math.min(100, (st.status.health || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "🌿 老人给你抓了三副药：「先吃一周。一周后要是觉得有劲儿了，再来找我调方子。」\n你付了¥30，拎着一兜草药回家。晚上熬了喝，苦是真苦，但喝完身上暖洋洋的。健康+8，心智+2。",
            "success",
          );
        },
      },
      {
        text: "🙏 道谢离开，自己注意",
        hint: "心意领了",
        apply: function (st) {
          st.flags._recoveryHerbalSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "🌿 你道了谢。老人摆摆手：「没事，注意身体。身体是1，其他都是后面的0。没有1，再多0都没用。」\n这话你听过很多遍，但这次听进去了。心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R39 四季叙事深化 — 春·倒春寒 ======
  // 设计意图：春季不仅有就业机会，也有"倒春寒"的健康挑战
  // 设计心理学：损失厌恶（不买衣服→健康扣减，驱动玩家采取措施）
  RANDOM_EVENTS.push({
    id: "spring_chill_snap",
    phase: "street",
    icon: "🌬️",
    title: "倒春寒",
    story:
      "前两天还阳光明媚，今天突然降温十几度。\n\n你缩着脖子走在街上，风灌进衣领像刀子割。路边的桃花被风吹落了一地，粉色的花瓣在泥水里打转。\n\n早餐摊的大姐搓着手说：「这鬼天气，春天比冬天还冷。小伙子穿这么少，不怕感冒啊？」",
    conditions: function (st) {
      if (!st.weather || st.weather.season !== "spring") return false;
      if (st.flags && st.flags._springChillSeen) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🧥 买件外套御寒",
        hint: "花¥50，健康+5",
        cost: 50,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._springChillSeen = true;
          st.status.health = Math.min(100, (st.status.health || 50) + 5);
          StateManager.addMessage(
            "🌬️ 你在路边摊花¥50买了件外套套上。虽然不太好看，但暖和多了。健康+5。",
            "success",
          );
        },
      },
      {
        text: "🔥 喝碗热汤暖身子",
        hint: "花¥15，饱腹+ 心情+",
        cost: 15,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 15); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._springChillSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 50) - 15);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          st.status.health = Math.min(100, (st.status.health || 50) + 2);
          StateManager.addMessage(
            "🌬️ 一碗热腾腾的胡辣汤下肚，整个人活过来了。饱腹-15，心情+5，健康+2。",
            "success",
          );
        },
      },
      {
        text: "💪 硬扛，省点钱",
        hint: "健康-3",
        apply: function (st) {
          st.flags._springChillSeen = true;
          st.status.health = Math.max(0, (st.status.health || 50) - 3);
          StateManager.addMessage(
            "🌬️ 你咬着牙扛过去了。风灌进领口的时候你不禁打了个哆嗦。省了几十块，但身体有点发冷。健康-3。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== R39 四季叙事深化 — 夏·夏夜纳凉 ======
  // 设计意图：夏天不只是热和夜市，还有邻里纳凉的温情社交
  // 设计心理学：社会支持（邻里互动缓解压力）· 归属感
  RANDOM_EVENTS.push({
    id: "summer_night_cooling",
    phase: "street",
    icon: "🌙",
    title: "夏夜纳凉",
    story:
      "太阳落山后，白天的热浪还没散尽。城中村的居民们搬着小板凳出来了——有人拎着西瓜、有人端着凉茶、有人摇着蒲扇。\n\n巷子里闹哄哄的，小孩追来追去，大人们聊着天。王婶看见你，招呼道：「过来坐！今天买了西瓜，冰镇过的！」\n\n晚风吹过来，带着一点凉意和栀子花的香气。",
    conditions: function (st) {
      if (!st.weather || st.weather.season !== "summer") return false;
      if (st.flags && st.flags._summerNightCoolingSeen) return false;
      if (st.player.day < 10) return false;
      // [自洽修复] 王婶在叙事中主动招呼，必须见过王婶
      if (!st.relationships?.aunt_wang?.met) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🍉 坐下吃西瓜聊天",
        hint: "心情++ 邻里好感+",
        apply: function (st) {
          st.flags._summerNightCoolingSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          var npcs = st.relationships || {};
          for (var id in npcs) {
            if (npcs[id].met && (npcs[id].affinity || 0) >= 10) {
              npcs[id].affinity = Math.min(100, (npcs[id].affinity || 0) + 2);
            }
          }
          StateManager.addMessage(
            "🍉 你坐在小板凳上，啃着冰西瓜听大家唠嗑。有人说起了当年刚来这城市的糗事，笑得你肚子疼。心情+12，疲劳-5，邻里好感+2。",
            "success",
          );
        },
      },
      {
        text: "🎸 回去自己待着",
        hint: "独处 心智+4",
        apply: function (st) {
          st.flags._summerNightCoolingSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          StateManager.addMessage(
            "🎸 你婉拒了邀请，回屋躺在凉席上听外面的热闹。蝉鸣、笑声、晚风——这个夏天的夜晚，你一个人也很自在。心智+4。",
            "info",
          );
        },
      },
      {
        text: "🧊 帮大家切西瓜跑腿",
        hint: "名声+3 心情+",
        apply: function (st) {
          st.flags._summerNightCoolingSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🧊 你帮着切西瓜、搬凳子、给老人倒茶。大家说你这小伙子不错。名声+3，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // ====== R39 四季叙事深化 — 秋·秋雨寄思 ======
  // 设计意图：秋天不只有丰收，还有雨天的乡愁与家庭连结
  // 设计心理学：峰终定律·情感锚点——雨天打电话的温暖记忆
  RANDOM_EVENTS.push({
    id: "autumn_rain_homesickness",
    phase: "street",
    icon: "🌧️",
    title: "秋雨寄思",
    story:
      "淅淅沥沥的秋雨下了一整天，街上的人少了，店铺早早关了门。\n\n你站在屋檐下躲雨，看着雨滴打在路面的水洼里，一圈一圈地荡开。空气中带着泥土和枯叶的味道。\n\n手机屏幕亮了——是家里发来的消息：「天冷了，多穿点衣服。」\n\n你忽然想起，已经很久没有回过家了。",
    conditions: function (st) {
      if (!st.weather) return false;
      if (st.weather.season !== "autumn") return false;
      var rainy = ["rainy", "stormy", "plum_rain"];
      if (rainy.indexOf(st.weather.current) === -1) return false;
      if (st.flags && st.flags._autumnRainHomesickSeen) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📞 给家里打个电话",
        hint: "花¥5话费，心情+ 道德+",
        cost: 5,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._autumnRainHomesickSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "📞 你拨通了家里的电话。妈妈接的，唠叨了十分钟——问吃得怎么样、睡得怎么样、有没有对象。你听着听着笑了。挂了电话，雨好像小了一些。心情+8，道德+3，心智+3。",
            "success",
          );
        },
      },
      {
        text: "✍️ 写封信寄回去",
        hint: "纸质家书 心智+6",
        apply: function (st) {
          st.flags._autumnRainHomesickSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          StateManager.addMessage(
            "✍️ 你买了信封和信纸，坐在昏暗的灯光下一笔一划地写。写了好几张纸——从最近的生活写到对未来的打算。有些话电话里说不出口，但写在纸上就容易了。心智+6，心情+6。",
            "success",
          );
        },
      },
      {
        text: "😤 不想了，干活去",
        hint: "化思念为动力 现金+",
        apply: function (st) {
          st.flags._autumnRainHomesickSeen = true;
          var earn = Random.int(50, 100);
          st.resources.cash += earn;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          StateManager.addMessage(
            "😤 你甩了甩头，把思念压进心底，冒雨出去干活了。忙起来就不想家了。赚了¥" +
              earn +
              "，疲劳+10。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R39 四季叙事深化 — 冬·冬日围炉 ======
  // 设计意图：冬天不止严寒求生，也有炉火旁的人间温暖
  // 设计心理学：社会支持·峰终定律（寒冬中的温暖记忆锚点）
  RANDOM_EVENTS.push({
    id: "winter_hearth_gathering",
    phase: "street",
    icon: "🔥",
    title: "冬日围炉",
    story:
      "气温降到了零下，冷得骨头都在疼。你匆匆走在街上，忽然闻到一阵香味——是烤红薯和热汤的味道。\n\n巷口的老周在店门口生了个铁炉子，炉膛里木柴烧得噼啪响。几个邻居围着炉子坐着，手里捧着热茶或红薯，有一搭没一搭地聊天。\n\n老周看见你，招招手：「进来暖和暖和，不收钱。」",
    conditions: function (st) {
      if (!st.weather || st.weather.season !== "winter") return false;
      if (st.flags && st.flags._winterHearthSeen) return false;
      if (st.player.day < 10) return false;
      var cold = (st.weather.temperature || 10) < 5;
      if (!cold) return false;
      // [自洽修复] 老周在叙事中招呼你烤火，必须见过老周
      if (!st.relationships?.old_zhou?.met) return false;
      return true;
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🪵 坐下来一起烤火",
        hint: "心情++ 健康+ 老周好感+",
        apply: function (st) {
          st.flags._winterHearthSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          st.status.health = Math.min(100, (st.status.health || 50) + 4);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          if (st.relationships && st.relationships.old_zhou) {
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 5,
            );
          }
          StateManager.addMessage(
            "🔥 你坐了下来。老周递过来一个烤红薯，你剥开皮，热气腾腾的香甜味扑鼻而来。炉火烧得脸发烫，但心里更暖。心情+10，健康+4，疲劳-5，老周好感+5。",
            "success",
          );
        },
      },
      {
        text: "🍠 买几个红薯带走",
        hint: "花¥10，饱腹+ 健康+",
        cost: 10,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._winterHearthSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 50) - 20);
          st.status.health = Math.min(100, (st.status.health || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🍠 你买了几个烤红薯揣在兜里，热乎乎地烫手。走在路上掰开一个，金黄的瓤冒着热气——冬天的幸福有时候就是这么简单。饱腹-20，健康+2，心情+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 道谢，继续赶路",
        hint: "独行 心智+4",
        apply: function (st) {
          st.flags._winterHearthSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          StateManager.addMessage(
            "🔥 你摆摆手说还有事。老周往你手里塞了个热红薯：「拿着，路上暖和暖和。」你走出巷口回头看了一眼——炉火在冬夜里像一盏小灯。心智+4。",
            "info",
          );
        },
      },
    ],
  });

  // ====================================================================
  // v3.81 loop R40: 冬季叙事×2 + Corporate专属×2（填补最大空白区）
  // ====================================================================

  // R40-① 冬季寒潮生存 — 冬天的街头工作（winter季节×需求系统）
  RANDOM_EVENTS.push({
    id: "winter_cold_street_grind",
    phase: "street",
    icon: "❄️",
    title: "冬天的苦活",
    story:
      "今天格外冷。手指冻得发麻，连拿工具都困难。路过的行人裹紧大衣匆匆而过，没人多看你一眼。\n\n你停下来对着手呵了口气。这座城市冬天不停歇，你也没有资格停歇。只是这一刻，你想起了老家灶台上的火，想起妈妈总说冬天不能饿着。\n\n你没有灶台。你有的，只有还剩下的行动力，和一整个冬天。",
    conditions: function (st) {
      if (st.flags._winterColdGrindSeen) return false;
      if (!st.weather || st.weather.season !== "winter") return false;
      if ((st.player.day || 0) < 10) return false;
      return true;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🔥 咬牙继续干，加一把劲",
        hint: "当日收入+20%·疲劳+10·禀赋效应",
        apply: function (st) {
          st.flags._winterColdGrindSeen = true;
          st.flags._winterWorkerBadge = true;
          st.needs.energy = Math.max(0, (st.needs.energy || 50) - 10);
          var bonus = Math.floor((st.player.cash || 0) * 0.0 + 50);
          st.player.cash = (st.player.cash || 0) + bonus;
          st.player.physique = Math.min(100, (st.player.physique || 0) + 2);
          StateManager.addMessage(
            "❄️ 你咬着牙把今天的活干完了。手指一整天都没暖过来，但账上多了¥" +
              bonus +
              "。体质+2，疲劳+10。",
            "success",
          );
        },
      },
      {
        text: "🍵 去馆子喝碗热汤暖暖身",
        hint: "花¥15·卫生+10·心情+10·恢复状态",
        apply: function (st) {
          st.flags._winterColdGrindSeen = true;
          if ((st.player.cash || 0) >= 15) {
            st.player.cash -= 15;
            st.needs.hygiene = Math.min(100, (st.needs.hygiene || 50) + 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            StateManager.addMessage(
              "🍵 你花¥15喝了碗热汤面。从胃一路暖到心里去了。卫生+10，心情+10。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🍵 摸了摸口袋——不够，只能继续熬着。",
              "warning",
            );
          }
        },
      },
      {
        text: "🏠 今天少干一点，早点回家",
        hint: "保存体力·疲劳-15·损失厌恶",
        apply: function (st) {
          st.flags._winterColdGrindSeen = true;
          st.needs.energy = Math.min(100, (st.needs.energy || 50) + 15);
          StateManager.addMessage(
            "🏠 你早早收了摊，今天算了。有时候保存体力本身就是一种工作。疲劳-15。",
            "info",
          );
        },
      },
    ],
  });

  // R40-② 年末倒计时 — 冬季×day≥330的年终反思
})();
