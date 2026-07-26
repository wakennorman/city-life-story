// [全系统自洽修复] 域B R410 修复: 死字段 st.player.health.*(state无此对象,守卫永false压力效果静默失效)->st.personalGrowth.health.*; st.needs.health(needs无health)->st.status.health
/**
 * 跨系统联动事件 — 拆分片段 3/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart3Loaded) return;
  RANDOM_EVENTS._crossPart3Loaded = true;

  RANDOM_EVENTS.push({
    id: "r120_rain_market_vs_park",
    phase: "street",
    icon: "🌧️",
    title: "暴雨突袭",
    story:
      "天空突然暗了下来，紧接着豆大的雨点砸了下来。你看了看周围——如果是在批发市场，货摊上的东西全得湿；如果是在公园，至少能找个亭子躲雨。不同的位置，有不同的应对方式。",
    conditions: function (st) {
      // [自洽修复] 检查暴雨天气 + 在批发市场或公园
      var w = st.weather && st.weather.current;
      var curLoc = st.trade && st.trade.currentLocation;
      var isRainy = w === "rainy" || w === "stormy" || w === "typhoon";
      return (
        st.player.phase === "street" &&
        isRainy &&
        (curLoc === "wholesaleMarket" || curLoc === "park") &&
        !st.flags._rainMarketParkSeen
      );
    },
    probability: 0.05,
    repeatable: true,
    choices: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      var choices = [];
      if (curLoc === "wholesaleMarket") {
        choices.push({
          text: "📦 赶紧收摊保货",
          hint: "花行动力 保住货物",
          apply: function (s) {
            s.flags._rainMarketParkSeen = true;
            s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 15);
            s.needs.hygiene = Math.max(0, (s.needs.hygiene || 30) - 10);
            var saved = Random.int(100, 300);
            s.resources.cash += saved;
            s.resources.totalEarned = (s.resources.totalEarned || 0) + saved;
            StateManager.addMessage(
              "🌧️ 你冒着雨把货全收了，虽然淋成了落汤鸡，但保住了约¥" +
                saved +
                "的货物。疲劳+15，卫生-10。",
              "info",
            );
          },
        });
        choices.push({
          text: "💨 货不要了 跑为上",
          hint: "保人保命",
          apply: function (s) {
            s.flags._rainMarketParkSeen = true;
            s.needs.happiness = Math.max(0, (s.needs.happiness || 20) - 10);
            StateManager.addMessage(
              "🌧️ 你转身就跑，把货留在了市场。损失了一些钱，但至少没淋雨生病。心情-10。",
              "warning",
            );
          },
        });
      } else {
        // park
        choices.push({
          text: "⛺ 找亭子躲雨",
          hint: "安全 心情+3",
          apply: function (s) {
            s.flags._rainMarketParkSeen = true;
            s.needs.happiness = Math.min(100, (s.needs.happiness || 20) + 3);
            s.player.mental = Math.min(100, (s.player.mental || 26) + 2);
            StateManager.addMessage(
              "🌧️ 你找到了公园里的凉亭，坐在里面听雨。雨声让人莫名平静。心情+3，心智+2。",
              "info",
            );
          },
        });
        choices.push({
          text: "🏃 冒雨跑回家",
          hint: "快但会感冒",
          apply: function (s) {
            s.flags._rainMarketParkSeen = true;
            s.status.health = Math.max(0, (s.status.health || 70) - 5);
            s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 10);
            StateManager.addMessage(
              "🌧️ 你冲进雨里拼命跑，到家时全身湿透。健康-5，疲劳+10。感冒风险增加。",
              "warning",
            );
          },
        });
      }
      choices.push({
        text: "😐 找个便利店等雨停",
        hint: "花¥5 买杯热饮",
        cost: 5,
        apply: function (s) {
          s.resources.cash = Math.max(0, (s.resources.cash || 0) - 5); // [全系统自洽修复] 域B 修复:cost扣款缺失
          s.flags._rainMarketParkSeen = true;
          s.needs.happiness = Math.min(100, (s.needs.happiness || 20) + 5);
          StateManager.addMessage(
            "🌧️ 你躲进便利店买了杯热豆浆，看着外面的暴雨发呆。花¥5买了个清净。心情+5。",
            "info",
          );
        },
      });
      return choices;
    },
  });

  // ⑤ 连续低饥饿积累爆发：连续3天hunger<20 → 身体发出警报
  // 设计意图：填补"连续几天某种状态后的积累爆发"空白区
  RANDOM_EVENTS.push({
    id: "r120_hunger_accumulation",
    phase: "street",
    icon: "⚠️",
    title: "身体的账单",
    story:
      "你今天走到半路突然眼前一黑，差点栽倒。你扶着墙缓了好一会儿才回过神来——你已经记不清上一次好好吃顿饭是什么时候了。身体不会骗人，它在跟你算账了。",
    conditions: function (st) {
      // [自洽修复] 检查连续低饥饿天数≥3（flags._habits.lowHungerStreak）
      var habits = st.flags && st.flags._habits;
      return (
        st.player.phase === "street" &&
        ((habits && habits.lowHungerStreak >= 3) ||
          (st.needs && st.needs.hunger < 15)) &&
        !st.flags._hungerAccumulationSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🍜 去吃点好的",
        hint: "花¥30 恢复饱腹+健康",
        apply: function (st) {
          st.flags._hungerAccumulationSeen = true;
          if ((st.resources.cash || 0) >= 30) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 35);
            st.status.health = Math.min(100, (st.status.health || 70) + 5);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 20) + 10);
            StateManager.addMessage(
              "⚠️ 你走进一家小面馆，点了份最大的牛肉面。热气腾腾的面条下肚，整个人活过来了。饱腹+35，健康+5，心情+10，-¥30。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "⚠️ 你想吃点好的，但口袋里连¥30都没有。你只能去便利店买了个最便宜的饭团。",
              "warning",
            );
          }
        },
      },
      {
        text: "🍚 煮碗面将就一下",
        hint: "花¥10 最低成本",
        apply: function (st) {
          st.flags._hungerAccumulationSeen = true;
          if ((st.resources.cash || 0) >= 10) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 20);
            StateManager.addMessage(
              "⚠️ 你回到住处煮了碗方便面。虽然简单，但好歹填饱了肚子。饱腹+20，-¥10。",
              "info",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 20) - 10);
            StateManager.addMessage(
              "⚠️ 你连煮面的钱都没有。只能喝了一口自来水对付。心情-10。",
              "warning",
            );
          }
        },
      },
      {
        text: "💪 忍一忍 还能干",
        hint: "不花钱 但健康受损",
        apply: function (st) {
          st.flags._hungerAccumulationSeen = true;
          st.status.health = Math.max(0, (st.status.health || 70) - 10);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "⚠️ 你咬咬牙继续干活。意志力很强，但身体在抗议。健康-10，疲劳+10，心智+2。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== R10-R19 rebase 补入(30个r10-r19独有事件, 2026-07-10) ======
  RANDOM_EVENTS.push({
    id: "account_mgmt_finance_director",
    phase: "street",
    icon: "💼",
    title: "兼职财务总监",
    story:
      "你既会做账又懂带人，一家刚起步的小公司老板找上门：「我缺个能理顺财务又能管团队的人，兼职也行——来当财务总监？」",
    // conditions：会计 + 管理 双技能协同（技能系统空白区）
    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 会计等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
      if (typeof acc !== "number" || acc < 20) return false; // 检查 会计≥20
      if (typeof mgmt !== "number" || mgmt < 20) return false; // 检查 管理≥20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 30) return false; // 检查 中后期
      if (st.flags && st.flags._financeDirectorSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💼 接下职位",
        hint: "大额现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 1500;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._financeDirectorSeen = true;
          StateManager.addMessage(
            "你接下兼职财务总监，理顺了账目也稳住了团队，当月入账¥1500，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🤝 先当顾问",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 400;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.flags._financeDirectorSeen = true;
          StateManager.addMessage(
            "你先以顾问身份帮他们搭财务框架，拿了¥400咨询费，名声+2。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "aunt_wang_elder_network",
    phase: "street",
    icon: "👵",
    title: "王阿姨的互助网",
    story:
      "王阿姨早把你当自家晚辈，这回她牵线社区老人互助网络：「以后逢年过节帮老人跑腿，阿姨给你攒人情。」",
    // conditions：aunt_wang 深度好感门控（NPC 关系系统）
    conditions: function (st) {
      var rel = st.relationships && st.relationships["aunt_wang"]; // 检查 aunt_wang 关系
      if (!rel || !rel.met) return false; // 检查 已结识
      if (typeof rel.affinity !== "number" || rel.affinity < 80) return false; // 检查 好感>=80
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._auntWangElderSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下互助网",
        hint: "现金+ 名声+ 好感+",
        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];
          st.resources.cash = (st.resources.cash || 0) + 350;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (rel) rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._auntWangElderSeen = true;
          StateManager.addMessage(
            "你接下社区老人互助网，跑腿攒下人情也落袋¥350，名声+5，王阿姨更待见你了。",
            "success",
          );
        },
      },
      {
        text: "🌿 偶尔帮衬",
        hint: "轻量 好感+",
        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];
          if (rel) rel.affinity = Math.min(100, rel.affinity + 8);
          st.flags._auntWangElderSeen = true;
          StateManager.addMessage(
            "你先从偶尔帮衬做起，王阿姨念你的好，好感+8。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "boss_li_referral",
    phase: "street",
    icon: "👷",
    title: "李工头的关照",
    story:
      "你和李工头处得越来越熟。这天他悄悄把你叫到一边：「城东下个月有个大项目，缺个靠谱的带班——我想把你的名报上去，你点个头就行。」",
    // conditions：李工头好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.boss_li; // 检查 李工头关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._bossLiReferralSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下内推",
        hint: "现金+ 名声+ 好感+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          var rel = st.relationships.boss_li;
          rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._bossLiReferralSeen = true;
          StateManager.addMessage(
            "你成了城东项目的带班，工钱涨了一截，李工头拍拍你肩：「好好干。」名声+5，好感+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 先谢过工头",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.boss_li;
          rel.affinity = Math.min(100, rel.affinity + 8);
          st.flags._bossLiReferralSeen = true;
          StateManager.addMessage(
            "你婉拒了，说想再历练历练。李工头反倒更欣赏你的踏实。好感+8。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "brother_huang_subcontract",
    phase: "street",
    icon: "🧱",
    title: "黄哥的转包",
    story:
      "黄哥（brother_huang）的工程队活多接不过来，他拍你肩：「兄弟，这单转包给你，价钱好说。」",
    // conditions：黄哥(brother_huang)好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang; // 检查 黄哥关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._brotherHuangSubSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💪 接转包单",
        hint: "大额现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          var rel = st.relationships.brother_huang;
          rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._brotherHuangSubSeen = true;
          StateManager.addMessage(
            "你接下黄哥转包的活，干得漂亮，他当场结了¥500，说以后活优先给你。名声+5，好感+5。",
            "success",
          );
        },
      },
      {
        text: "🔧 先试小单",
        hint: "低风险 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;
          st.flags._brotherHuangSubSeen = true;
          StateManager.addMessage(
            "你先接了个小转包练手，落袋¥150，跟黄哥也混熟了。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "cash_wealth_advisory",
    phase: "street",
    icon: "💰",
    title: "攒出底气",
    story:
      "你兜里第一次稳稳揣着五千块，理财顾问和邻里都另眼相看：「有点底子了，该让钱生钱。」",
    // conditions：现金充裕阈值（经济系统空白区）
    conditions: function (st) {
      var cash = st.resources && st.resources.cash; // 检查 现金
      if (typeof cash !== "number" || cash < 5000) return false; // 检查 现金>=5000
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._wealthAdvisorySeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "📈 听顾问配置",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 700;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.flags._wealthAdvisorySeen = true;
          StateManager.addMessage(
            "你按顾问建议做了笔小配置，落袋¥700，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🏪 盘个小本生意",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.flags._wealthAdvisorySeen = true;
          StateManager.addMessage(
            "你拿闲钱盘了个小本生意练手，落袋¥300。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "chef_chen_partner",
    phase: "street",
    icon: "🍲",
    title: "陈师傅的秘方",
    story:
      "你和陈师傅在后厨处得投缘。这天他神秘兮兮把你拉到角落：「我那锅老汤底的秘方，想交给你。要不咱合伙盘个档口，你掌勺我管采？」",
    // conditions：陈师傅好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.chef_chen; // 检查 陈师傅关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._chefChenPartnerSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接秘方合伙",
        hint: "现金+ 名声+ 好感+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 250;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          var rel = st.relationships.chef_chen;
          rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._chefChenPartnerSeen = true;
          StateManager.addMessage(
            "你接下秘方，和陈师傅盘下档口，第一锅汤底飘香时，整条街都闻着味来了。名声+4，好感+5。",
            "success",
          );
        },
      },
      {
        text: "📖 先学秘方",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.chef_chen;
          rel.affinity = Math.min(100, rel.affinity + 8);
          st.flags._chefChenPartnerSeen = true;
          StateManager.addMessage(
            "你先跟着陈师傅学秘方，说稳扎稳打。他乐得收你这个徒弟。好感+8。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "driving_coding_dispatch",
    phase: "street",
    icon: "🚚",
    title: "调度小工具",
    story:
      "你既会开车又懂编程，给车队头儿写了个配送调度小工具，路线一优化，空跑少了一大截：「这玩意儿能卖钱。」",
    // conditions：driving + coding 双技能协同（技能系统空白区）
    conditions: function (st) {
      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级
      if (typeof drv !== "number" || drv < 15) return false; // 检查 driving>=15
      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 18) return false; // 检查 中后期
      if (st.flags && st.flags._dispatchSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "💻 卖调度工具",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 450;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "你把调度工具打包卖给几个车队，落袋¥450，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🔧 先给一家试用",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;
          StateManager.addMessage(
            "你先给一家车队免费试用，落袋¥120，口碑慢慢传开。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "driving_management_fleet",
    phase: "street",
    icon: "🚛",
    title: "车队管理",
    story:
      "你既会开车又懂带人，一个快递点老板让你兼管临时车队：「调度和人事你都能扛，省我不少心。」",
    // conditions：driving + management 双技能协同（技能系统空白区）
    conditions: function (st) {
      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级
      if (typeof drv !== "number" || drv < 15) return false; // 检查 driving>=15
      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 management>=15
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 18) return false; // 检查 中后期
      if (st.flags && st.flags._fleetSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🚛 接车队管理",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 550;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._fleetSeen = true;
          StateManager.addMessage(
            "你接手临时车队管理，落袋¥550，名声+5。",
            "success",
          );
        },
      },
      {
        text: "📋 只做调度",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;
          st.flags._fleetSeen = true;
          StateManager.addMessage(
            "你只管排班调度，落袋¥200，不背管理锅。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "driving_sales_auto_vendor",
    phase: "street",
    icon: "🚐",
    title: "面包车车销",
    story:
      "你既会开车又懂卖货，批发市场的熟人怂恿：「弄辆面包车搞车销吧，我给你供货。」",
    // conditions：driving + sales 双技能协同（技能系统空白区）
    conditions: function (st) {
      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级
      if (typeof drv !== "number" || drv < 15) return false; // 检查 driving≥15
      if (typeof sales !== "number" || sales < 15) return false; // 检查 sales≥15
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 15) return false; // 检查 开局半月后
      if (st.flags && st.flags._autoVendorSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🚐 开车出去卖",
        hint: "现金+（日结）",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "你开着面包车沿街叫卖，一天下来入账¥300，名声+3。",
            "success",
          );
        },
      },
      {
        text: "🤔 先试一趟",
        hint: "低风险 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 100;
          StateManager.addMessage(
            "你先拉一车货试卖，落袋¥100，摸清楚了哪片好卖。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "elec_mgmt_engineering_team",
    phase: "street",
    icon: "🔌",
    title: "组工程队",
    story:
      "你既懂电路又能张罗人，几个老乡电工想跟着你干：「你当头，带我们接工程队的活，分红怎么算你定。」",
    // conditions：电工 + 管理 双技能协同（技能系统空白区）
    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 电工等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
      if (typeof elec !== "number" || elec < 20) return false; // 检查 电工≥20
      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 管理≥15
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._elecMgmtTeamSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "👷 组队接工程",
        hint: "大额现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 600;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._elecMgmtTeamSeen = true;
          StateManager.addMessage(
            "你拉起一支电工小队，接下整片新楼盘的预埋活，当月分红¥600，名声+5。",
            "success",
          );
        },
      },
      {
        text: "🔧 先小范围试",
        hint: "低风险 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;
          st.flags._elecMgmtTeamSeen = true;
          StateManager.addMessage(
            "你先带两人接了个小工程练手，落袋¥200，口碑慢慢立起来。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "english_coding_localize",
    phase: "street",
    icon: "🌐",
    title: "双语外包",
    story:
      "你外语好又会写代码，一家小外包公司找你做技术文档本地化和双语脚手架：「这活儿只有你这种又懂码又懂外文的人能干。」",
    // conditions：english + coding 双技能协同（技能系统空白区）
    conditions: function (st) {
      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级
      if (typeof eng !== "number" || eng < 25) return false; // 检查 english>=25
      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._localizeSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "📝 接本地化",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 700;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._localizeSeen = true;
          StateManager.addMessage(
            "你接下技术文档本地化，落袋¥700，名声+5。",
            "success",
          );
        },
      },
      {
        text: "🧩 只做脚手架",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 250;
          st.flags._localizeSeen = true;
          StateManager.addMessage(
            "你只写了双语脚手架模板，落袋¥250，后续按需复用。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "english_mgmt_foreign_manager",
    phase: "street",
    icon: "🌍",
    title: "外企中层",
    story:
      "你英语溜又懂带团队，一家外企的中方负责人找来：「我们缺个能对接总部的中层，你试试？」",
    // conditions：英语 + 管理 双技能协同（技能系统空白区）
    conditions: function (st) {
      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 英语等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
      if (typeof eng !== "number" || eng < 25) return false; // 检查 英语≥25
      if (typeof mgmt !== "number" || mgmt < 20) return false; // 检查 管理≥20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 30) return false; // 检查 中后期
      if (st.flags && st.flags._englishMgmtSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💼 接中层岗",
        hint: "大额现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 1200;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._englishMgmtSeen = true;
          StateManager.addMessage(
            "你接下外企中层，对接总部顺手，当月入账¥1200，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🤝 先当顾问",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.flags._englishMgmtSeen = true;
          StateManager.addMessage(
            "你先以顾问身份帮他们搭对接流程，拿了¥300咨询费，名声+2。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "era_initial_oldtown",
    phase: "street",
    icon: "🏚️",
    title: "老城区的门路",
    story:
      "还在城市草创期，老城区没拆，熟人网络密得很。街坊给你指了条门路：「这片便宜房源多，消息也灵通。」",
    // conditions：时代处于 initial 阶段（时代变迁系统空白区）
    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态
      if (!era) return false; // 检查 已初始化
      if (era.stageId !== "initial") return false; // 检查 早期阶段
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 5) return false; // 检查 开局后
      if (st.flags && st.flags._oldtownSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🏠 盘下便宜房",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.flags._oldtownSeen = true;
          StateManager.addMessage(
            "你顺着门路盘下老城区一间便宜房改作落脚点，落袋¥300，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🗣️ 只做信息贩子",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;
          st.flags._oldtownSeen = true;
          StateManager.addMessage(
            "你只靠灵通消息帮人牵线，落袋¥120，不占本钱。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_charity_hub",
    phase: "street",
    icon: "🤝",
    title: "牵头公益",
    story:
      "你平时仗义疏财、肯帮弱，社区干脆推你牵头互助基金：「你来张罗，大伙都服你。」",
    // conditions：morality 极高（道德系统空白区）
    conditions: function (st) {
      var mor = st.player && st.player.morality; // 检查 道德值
      if (typeof mor !== "number" || mor < 85) return false; // 检查 道德>=85
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._charityHubSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🏘️ 接下互助基金",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 450;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._charityHubSeen = true;
          StateManager.addMessage(
            "你张罗起社区互助基金，落袋管理费¥450，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🌱 纯义务帮忙",
        hint: "轻量 名声+",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 9);
          st.flags._charityHubSeen = true;
          StateManager.addMessage(
            "你分文不取把互助基金跑起来，整片街区都念你的好，名声+9。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_community_entrust",
    phase: "street",
    icon: "🤲",
    title: "街坊的托付",
    story:
      "你平时肯帮人、不坑人，街坊们信得过你。这回张姨要回老家，把店里的钥匙先交你：「帮盯几天，亏不了你。」",
    // conditions：morality 高（道德系统）
    conditions: function (st) {
      var mor = st.player && st.player.morality; // 检查 道德值
      if (typeof mor !== "number" || mor < 80) return false; // 检查 道德>=80
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 15) return false; // 检查 中后期
      if (st.flags && st.flags._communityEntrustSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🗝️ 接下钥匙",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 400;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._communityEntrustSeen = true;
          StateManager.addMessage(
            "你帮张姨盯店几天，赚了辛苦费也攒下口碑，落袋¥400，名声+5。",
            "success",
          );
        },
      },
      {
        text: "🌱 免费帮衬",
        hint: "轻量 名声+",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.flags._communityEntrustSeen = true;
          StateManager.addMessage(
            "你分文不取帮张姨盯完店，整条街都夸你仗义，名声+8。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "needs_fatigue_rest_inn",
    phase: "street",
    icon: "🛏️",
    title: "借个地方歇脚",
    story:
      "你连着几天没睡好，眼皮直打架。巷口小旅馆老板看不过去：「进来躺会儿，按钟点算，便宜。」",
    // conditions：needs.fatigue 高（需求系统空白区）
    conditions: function (st) {
      var fat = st.needs && st.needs.fatigue; // 检查 fatigue 值
      if (typeof fat !== "number" || fat < 85) return false; // 检查 疲惫>=85
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 10) return false; // 检查 开局后
      if (st.flags && st.flags._restInnSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🛏️ 躺两小时",
        hint: "疲惫- 心情+",
        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 50);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.flags._restInnSeen = true;
          StateManager.addMessage(
            "你躺了两小时回过神来，疲惫-50、心情+12。",
            "success",
          );
        },
      },
      {
        text: "☕ 硬撑着喝杯茶",
        hint: "轻量 心情+",
        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._restInnSeen = true;
          StateManager.addMessage(
            "你坐下喝了杯热茶缓了缓，疲惫-20、心情+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "needs_hygiene_public_bath",
    phase: "street",
    icon: "🚿",
    title: "街角澡堂",
    story:
      "你邋遢了好些天，邻居提醒街角开了家平价澡堂加洗衣房：「洗个热水澡，整个人都活过来了。」",
    // conditions：needs.hygiene 低（需求系统空白区）
    conditions: function (st) {
      var hyg = st.needs && st.needs.hygiene; // 检查 hygiene 值
      if (typeof hyg !== "number" || hyg >= 15) return false; // 检查 卫生<15
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 10) return false; // 检查 开局后
      if (st.flags && st.flags._publicBathSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🚿 去洗个澡",
        hint: "卫生+ 心情+ 小额花费",
        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 60);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          st.resources.cash = Math.max(0, st.resources.cash - 20);
          StateManager.addMessage(
            "你泡了个热水澡，浑身舒坦，卫生+60、心情+10，花了¥20。",
            "success",
          );
        },
      },
      {
        text: "🧺 顺便洗衣",
        hint: "卫生+ 更强",
        apply: function (st) {
          st.needs.hygiene = Math.min(100, (st.needs.hygiene || 0) + 80);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.resources.cash = Math.max(0, st.resources.cash - 30);
          StateManager.addMessage(
            "你连人带衣服都洗干净了，卫生+80、心情+5，花了¥30。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "repair_coding_smart_device",
    phase: "street",
    icon: "🔧",
    title: "智能设备 DIY",
    story:
      "你修活利索又懂写代码，琢磨着把废旧设备改造成智能小玩意儿：「这批老机器，加点单片机就能卖钱。」",
    // conditions：repair + coding 双技能协同（技能系统空白区）
    conditions: function (st) {
      var rep = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级
      if (typeof rep !== "number" || rep < 20) return false; // 检查 repair≥20
      if (typeof code !== "number" || code < 25) return false; // 检查 coding≥25
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._smartDeviceSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "💡 改智能设备",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 400;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.flags._smartDeviceSeen = true;
          StateManager.addMessage(
            "你把旧设备改造成智能小装置，挂上二手平台卖出去，入账¥400，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🔬 先打样",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;
          st.flags._smartDeviceSeen = true;
          StateManager.addMessage(
            "你先做了个样品验证思路，落袋¥120，订单慢慢来了。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "reputation_commercial_loan",
    phase: "street",
    icon: "🏦",
    title: "商圈周转",
    story:
      "你在商业区的口碑传到银行客户经理耳朵里，对方主动递来低息周转额度：「你这号老实人，我们愿意扶一把。」",
    // conditions：commercialDist 声望达阈值（声望系统）
    conditions: function (st) {
      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望
      if ((rep || 0) < 60) return false; // 检查 声望>=60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._commercialLoanSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🏦 拿低息周转",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.flags._commercialLoanSeen = true;
          StateManager.addMessage(
            "你拿了笔低息周转金盘活小生意，落袋¥500，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🤝 只代卖不借钱",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;
          st.flags._commercialLoanSeen = true;
          StateManager.addMessage(
            "你只帮熟铺代卖跑量，落袋¥150，稳妥不背债。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "sister_wu_resource",
    phase: "street",
    icon: "🔗",
    title: "吴姐的资源",
    story:
      "你帮过吴姐几次忙，她记在心里。这天她神秘递来一张名片：「我手上有批渠道资源，想不想一起做点事？」",
    // conditions：吴姐(sister_wu)好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu; // 检查 吴姐关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._sisterWuResourceSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接资源合作",
        hint: "现金+ 名声+ 好感+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          var rel = st.relationships.sister_wu;
          rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._sisterWuResourceSeen = true;
          StateManager.addMessage(
            "你跟着吴姐搭上渠道，第一笔资源生意就赚了¥300，她直说没看错人。名声+4，好感+5。",
            "success",
          );
        },
      },
      {
        text: "🙏 先记着人情",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.sister_wu;
          rel.affinity = Math.min(100, rel.affinity + 8);
          st.flags._sisterWuResourceSeen = true;
          StateManager.addMessage(
            "你谢过吴姐，说先把人情记着。她反而更信你靠谱。好感+8。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_backend_system",
    phase: "street",
    icon: "⚙️",
    title: "后端架构",
    story:
      "你点亮了「后端系统」天赋，一家要上量的小公司找你搭服务：「高并发这摊子，只有你镇得住。」",
    // conditions：天赋节点 backend_system 已激活（天赋系统空白区）
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["backend_system"])) return false; // 检查 天赋节点 backend_system
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 27) return false; // 检查 中后期
      if (st.flags && st.flags._backendSystemSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "⚙️ 接后端单",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 950;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._backendSystemSeen = true;
          StateManager.addMessage(
            "你接下首个后端架构，落袋¥950，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🧱 先出脚手架",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 320;
          st.flags._backendSystemSeen = true;
          StateManager.addMessage(
            "你先搭了套后端脚手架，落袋¥320，后续按模板复用。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_cook_mgmt_chain",
    phase: "street",
    icon: "🍜",
    title: "餐饮连锁",
    story:
      "你点亮了「餐饮管理」天赋，街角几家小店盯上你这号能掌勺又能算账的人：「要不要盘个连锁档口，咱一起做？」",
    // conditions：天赋节点 cook_management 已激活，连接 天赋系统 → 连锁经营机会
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["cook_management"])) return false; // 检查 天赋节点 cook_management
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 30) return false; // 检查 中后期
      if (st.flags && st.flags._cookMgmtChainSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🏪 开连锁档口",
        hint: "大额现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 800;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._cookMgmtChainSeen = true;
          StateManager.addMessage(
            "你盘下第一个连锁档口，统一供应链统一招牌，当月入账¥800，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🍳 先直营一家",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.flags._cookMgmtChainSeen = true;
          StateManager.addMessage(
            "你先直营了一家店练手，落袋¥300，名声+3，连锁的事从长计议。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_eng_global_overseas",
    phase: "street",
    icon: "🌍",
    title: "出海项目",
    story:
      "你点亮了「全球化工程」天赋，一家做跨境的小公司找你搭海外节点：「这活儿要吃透多时区多语言，非你不可。」",
    // conditions：天赋节点 eng_global 已激活（天赋系统空白区）
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["eng_global"])) return false; // 检查 天赋节点 eng_global
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 28) return false; // 检查 中后期
      if (st.flags && st.flags._engGlobalSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🌍 接出海单",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 1000;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._engGlobalSeen = true;
          StateManager.addMessage(
            "你接下首个出海项目，落袋¥1000，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🔌 先搭试点",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 350;
          st.flags._engGlobalSeen = true;
          StateManager.addMessage(
            "你先搭了个海外试点节点验证，落袋¥350，后续单子自来。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_frontend_arch",
    phase: "street",
    icon: "🖥️",
    title: "整站搭建",
    story:
      "你点亮了「前端架构」天赋，小老板们找你搭官网、做小程序：「就缺你这种能从头搭起来的人。」",
    // conditions：天赋节点 frontend_arch 已激活（天赋系统空白区）
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["frontend_arch"])) return false; // 检查 天赋节点 frontend_arch
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._frontendArchSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🖥️ 接整站单",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 900;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._frontendArchSeen = true;
          StateManager.addMessage(
            "你接下首个整站搭建，落袋¥900，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🧱 先出模板",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.flags._frontendArchSeen = true;
          StateManager.addMessage(
            "你先做了套可复用模板挂出去，落袋¥300，口碑慢慢起来。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_mod_custom_gig",
    phase: "street",
    icon: "🔧",
    title: "改装接单",
    story:
      "你点亮了「改装定制」天赋，玩家圈和手工圈都盯上你这号能改能造的人：「帮做个定制外设/改装件呗？」",
    // conditions：天赋节点 mod_custom 已激活（天赋系统空白区）
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["mod_custom"])) return false; // 检查 天赋节点 mod_custom
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._modCustomGigSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🛠️ 接定制单",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 600;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._modCustomGigSeen = true;
          StateManager.addMessage(
            "你接下第一单定制改装，落袋¥600，名声+5。",
            "success",
          );
        },
      },
      {
        text: "📦 先出样品",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;
          st.flags._modCustomGigSeen = true;
          StateManager.addMessage(
            "你先做了个样品挂出来，落袋¥200，慢慢有回头客。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_sec_expert",
    phase: "street",
    icon: "🛡️",
    title: "安全加固",
    story:
      "你点亮了「安全专家」天赋，一家被羊毛党折腾的小平台找你做风控：「就缺你这种懂攻防的人。」",
    // conditions：天赋节点 sec_expert 已激活（天赋系统空白区）
    conditions: function (st) {
      if (!(st.talentNodes && st.talentNodes["sec_expert"])) return false; // 检查 天赋节点 sec_expert
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 26) return false; // 检查 中后期
      if (st.flags && st.flags._secExpertSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🛡️ 接风控单",
        hint: "现金+ 名声+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 850;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          st.flags._secExpertSeen = true;
          StateManager.addMessage(
            "你接下首个风控加固，落袋¥850，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🔍 先出审计",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 280;
          st.flags._secExpertSeen = true;
          StateManager.addMessage(
            "你先做了份安全审计模板，落袋¥280，口碑慢慢传开。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weather_heatwave_relief",
    phase: "street",
    icon: "🌞",
    title: "盛夏送水",
    story:
      "连日高温把柏油路面烤得发软，社区志愿者支起免费饮水点：「来喝口水，别中暑。」",
    // conditions：当前天气为 heatwave，连接天气系统 → 社区互助
    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 当前天气
      if (w !== "heatwave") return false; // 检查 高温热浪
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 10) return false; // 检查 开局后
      if (
        st.flags &&
        st.flags._heatwaveReliefDay &&
        st.player.day - st.flags._heatwaveReliefDay < 7
      )
        return false; // 检查 7天冷却
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🚰 喝口水歇脚",
        hint: "心情+",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          st.flags._heatwaveReliefDay = st.player.day;
          StateManager.addMessage(
            "你在饮水点喝着凉水歇了脚，暑气消了些，心情+10。",
            "success",
          );
        },
      },
      {
        text: "🤝 帮着分发",
        hint: "名声+ 心情+",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._heatwaveReliefDay = st.player.day;
          StateManager.addMessage(
            "你顺手帮志愿者分起水来，混了个脸熟，名声+3、心情+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weather_typhoon_mutual_aid",
    phase: "street",
    icon: "🌀",
    title: "台风互助",
    story:
      "台风把整座城吹得东倒西歪。断电断水的街坊凑到一处，志愿者扛来矿泉水和泡面：「先对付一晚，人没事就好。」",
    // conditions：当前天气为 typhoon，连接天气系统 → 邻里互助
    conditions: function (st) {
      var w = st.weather && st.weather.current; // 检查 当前天气
      if (w !== "typhoon") return false; // 检查 台风
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 10) return false; // 检查 开局后
      if (
        st.flags &&
        st.flags._typhoonAidDay &&
        st.player.day - st.flags._typhoonAidDay < 14
      )
        return false; // 检查 14天冷却
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🍜 一起熬过去",
        hint: "心情+ 名声+",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.flags._typhoonAidDay = st.player.day;
          StateManager.addMessage(
            "你和街坊挤在一处熬过台风夜，患难见真情，心情+10、名声+3。",
            "success",
          );
        },
      },
      {
        text: "🤝 帮发物资",
        hint: "名声+",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          st.flags._typhoonAidDay = st.player.day;
          StateManager.addMessage(
            "你帮志愿者把物资分到每家每户，名声+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weld_sales_private_job",
    phase: "street",
    icon: "🔩",
    title: "焊活私单",
    story:
      "你焊得一手漂亮活，又懂怎么跟人谈价。几个工友把私活介绍给你：「这单你报个价，保准客户满意。」",
    // conditions：焊接 + 销售 双技能协同（技能系统空白区）
    conditions: function (st) {
      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 检查 焊接等级
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 检查 销售等级
      if (typeof weld !== "number" || weld < 20) return false; // 检查 焊接≥20
      if (typeof sales !== "number" || sales < 15) return false; // 检查 销售≥15
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 15) return false; // 检查 开局半月后
      if (st.flags && st.flags._weldSalesSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🔧 接私单报价",
        hint: "现金+（佣金）",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 350;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "你报了个实在价，客户痛快拍板。工友直夸你会来事。现金+350，名声+3。",
            "success",
          );
        },
      },
      {
        text: "🤝 只牵线不接",
        hint: "轻量 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 80;
          StateManager.addMessage(
            "你把单子转给相熟的老师傅，抽了点介绍费，人情也攒下了。现金+80。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "xiaomei_roommate_secret",
    phase: "street",
    icon: "🏠",
    title: "小美的合租邀请",
    story:
      "小美跟你混熟了，放学拉你到没人的角落：「我和同学合租的房子空出一个铺位，月租特便宜，但房东不让声张……你要不要搬来？」",
    // conditions：小美好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.xiao_mei; // 检查 小美关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      if ((rel.affinity || 0) < 60) return false; // 检查 好感≥60
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 15) return false; // 检查 开局半月后
      if (st.flags && st.flags._xiaomeiRoommateSeen) return false; // 检查 未触发过
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🏠 搬去合租",
        hint: "月租省 好感+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120; // 省下月租差额
          var rel = st.relationships.xiao_mei;
          rel.affinity = Math.min(100, rel.affinity + 5);
          st.flags._xiaomeiRoommateSeen = true;
          StateManager.addMessage(
            "你搬进小美她们合租的房子，月租一下省下不少，两人关系也更近了。好感+5。",
            "success",
          );
        },
      },
      {
        text: "🙂 再想想",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.xiao_mei;
          rel.affinity = Math.min(100, rel.affinity + 8);
          st.flags._xiaomeiRoommateSeen = true;
          StateManager.addMessage(
            "你谢谢小美想着你，说先考虑考虑。她笑说随时留着铺位。好感+8。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R20-R119 rebase 补入(319个R20-R119联动事件, 2026-07-10) ======
  RANDOM_EVENTS.push({
    id: "accounting_commercial_rep_loan",

    phase: "street",

    icon: "🧾",

    title: "商区信得过的账",

    story:
      "你在商业区攒下好名声，又懂账，钱庄愿意凭你的名头放一笔周转贷，利息还低些。",

    // conditions：accounting 技能 + 商业区声望（技能 ∩ 声望 ∩ 经济）

    conditions: function (st) {
      var ac = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof ac !== "number" || ac < 15) return false; // 检查 accounting>=15

      if (
        typeof (st.reputation && st.reputation.commercialDist) !== "number" ||
        (st.reputation.commercialDist || 0) < 40
      )
        return false; // 检查 商业区声望>=40

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._acctLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🧾 借周转贷",

        hint: "现金+ accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 1);

          st.resources.cash = (st.resources.cash || 0) + 400;

          st.resources.debt = (st.resources.debt || 0) + 400;

          st.flags._acctLoanSeen = true;

          StateManager.addMessage(
            "凭商区名声你借到周转贷，现金+¥400（欠¥400），accounting+1。",

            "success",
          );
        },
      },

      {
        text: "📊 只谈息差",

        hint: "轻量 accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 1);

          st.flags._acctLoanSeen = true;

          StateManager.addMessage(
            "你跟钱庄谈了息差门道，accounting+1。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "accounting_loan_audit",

    phase: "street",

    icon: "🧮",

    title: "陈行长的对账",

    story:
      "你背着银行贷款，陈行长找你理账：「会算账就别糊涂，我帮你对一遍，免得利息吃垮你。」",

    // conditions：accounting 技能 + 有银行贷款 + uncle_chen_bank 已结识（技能系统 + 贷款系统 + NPC 系统）

    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 20) return false; // 检查 accounting>=20

      if (
        typeof st.resources.bankDebt !== "number" ||
        st.resources.bankDebt <= 0
      )
        return false; // 检查 有银行贷款

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._accLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🧮 请陈行长对账",

        hint: "贷款减负 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          st.resources.bankDebt = Math.max(
            0,

            Math.round((st.resources.bankDebt || 0) * 0.95),
          ); // 减免5%本金

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._accLoanSeen = true;

          StateManager.addMessage(
            "陈行长帮你对账减免5%贷款本金，好感+4。",

            "success",
          );
        },
      },

      {
        text: "📒 只自个儿算",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._accLoanSeen = true;

          StateManager.addMessage("你只自己算了笔账，陈行长好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "accounting_sales_bookkeeping",

    phase: "street",

    icon: "📒",

    title: "代账小账房",

    story:
      "你既会算账又能说会道，几个小摊主把糊涂账交你打理：「你帮忙管账，顺带帮我们谈供货价。」",

    // conditions：accounting + sales 双技能协同（技能系统空白区）

    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof acc !== "number" || acc < 20) return false; // 检查 accounting>=20

      if (typeof sale !== "number" || sale < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._bookkeepingSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📒 接代账+谈价",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 440;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._bookkeepingSeen = true;

          StateManager.addMessage(
            "你接下代账顺带帮谈供货价，落袋¥440，名声+4。",

            "success",
          );
        },
      },

      {
        text: "🧮 只做账",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 160;

          st.flags._bookkeepingSeen = true;

          StateManager.addMessage(
            "你只管理账本，落袋¥160，不掺和谈判。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "actionfreq_training_mentor",

    phase: "street",

    icon: "🥋",

    title: "练出来的师徒",

    story:
      "你厨艺练得勤，街口熟识的老师傅看在眼里：「你这股韧劲少见，我收你当半个徒弟，有好处带你。」",

    // conditions：cooking 训练频次高 + cooking 技能（行为统计×技能空白区）

    conditions: function (st) {
      var freq = st.stats && st.stats.trainFreq && st.stats.trainFreq.cooking; // 检查 cooking 训练频次

      if ((freq || 0) < 15) return false; // 检查 训练次数>=15

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 20) return false; // 检查 cooking>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._trainMentorSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🥋 拜师学艺",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 420;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._trainMentorSeen = true;

          StateManager.addMessage(
            "你拜老师傅为师，得真传还接了私活，落袋¥420，名声+4。",

            "success",
          );
        },
      },

      {
        text: "📚 只偷师",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.flags._trainMentorSeen = true;

          StateManager.addMessage(
            "你只在一旁偷师，落袋¥150，不欠人情。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "aunt_wang_cooking_pantry",

    phase: "street",

    icon: "👵",

    title: "王阿姨的食材库",

    story:
      "王阿姨看你常自己下厨，把钥匙塞给你：「楼下小库归你用，缺调料来拿，别外头花冤枉钱。」",

    // conditions：aunt_wang 已结识且好感达标 + cooking 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["aunt_wang"]; // 检查 aunt_wang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 30) return false; // 检查 好感>=30

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 15) return false; // 检查 cooking>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._auntWangPantrySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "👵 用上小库",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          st.resources.cash = (st.resources.cash || 0) + 260;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 王阿姨更待见你

          st.flags._auntWangPantrySeen = true;

          StateManager.addMessage(
            "你用上王阿姨的小库省下开销，落袋¥260，王阿姨好感+5。",

            "success",
          );
        },
      },

      {
        text: "🤝 帮阿姨做饭",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 8); // 王阿姨念你的好

          st.flags._auntWangPantrySeen = true;

          StateManager.addMessage(
            "你反过来帮王阿姨做几顿饭，她念你的好，好感+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "aunt_wang_morality_favor",

    phase: "street",

    icon: "🧶",

    title: "王阿姨的托付",

    story:
      "王阿姨信你是个本分人，把攒的一笔买药钱托你代购。你品行端正，她越发放心。",

    // conditions：aunt_wang 已结识+好感 + 高道德（NPC ∩ 道德系统）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["aunt_wang"]; // 检查 aunt_wang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.player.morality !== "number" || st.player.morality < 55)
        return false; // 检查 高道德

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._awFavorSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🧶 稳妥代办",

        hint: "好感+ 道德+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.player.morality = Math.min(100, st.player.morality + 2);

          st.flags._awFavorSeen = true;

          StateManager.addMessage(
            "你稳妥办妥托付，王阿姨好感+4，道德+2。",

            "success",
          );
        },
      },

      {
        text: "🤝 顺手帮到底",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._awFavorSeen = true;

          StateManager.addMessage("你顺手帮到底，王阿姨好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "bank_english_client",

    phase: "street",

    icon: "🗣️",

    title: "银行里的洋客户",

    story:
      "你在银行办事，碰上个外语磕绊的客户，陈行长朝你招手：「你英语行，帮翻译两句，这单成了有你好处。」",

    // conditions：当前在银行 + english 技能 + uncle_chen_bank 已结识（交易地点系统 + 技能系统 + NPC 系统）

    conditions: function (st) {
      if (st.trade.currentLocation !== "bank") return false; // 检查 当前在银行

      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof eng !== "number" || eng < 15) return false; // 检查 english>=15

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._bankEngSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🗣️ 帮翻译",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          st.resources.cash = (st.resources.cash || 0) + 280;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._bankEngSeen = true;

          StateManager.addMessage(
            "你帮银行翻译促成单，落袋¥280，陈行长好感+4。",

            "success",
          );
        },
      },

      {
        text: "📝 只翻要点",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._bankEngSeen = true;

          StateManager.addMessage("你只翻了要点，陈行长好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "bank_rep_loan_rate",

    phase: "street",

    icon: "🏦",

    title: "银行里的好名声",

    story:
      "你在银行圈子里口碑不赖，陈行长松了口：「你这人靠谱，贷款利息给你抹零点几个点，往后好借好还。」",

    // conditions：银行声望高 + 有银行贷款 + uncle_chen_bank 已结识（声望系统 + 贷款系统 + NPC 系统）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.bank; // 检查 银行声望

      if (typeof rep !== "number" || rep < 40) return false; // 检查 银行声望>=40

      if (
        typeof st.resources.bankDebt !== "number" ||
        st.resources.bankDebt <= 0
      )
        return false; // 检查 有银行贷款

      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._bankRepLoanSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🏦 谈下优惠利率",

        hint: "贷款减负 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          st.resources.dailyInterest = Math.max(
            0.001,

            (st.resources.dailyInterest || 0.0035) - 0.0008,
          ); // 日息优惠

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._bankRepLoanSeen = true;

          StateManager.addMessage(
            "你谈下优惠贷款利率，日息下调，陈行长好感+4。",

            "success",
          );
        },
      },

      {
        text: "📝 只记人情",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["uncle_chen_bank"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._bankRepLoanSeen = true;

          StateManager.addMessage("你只记下这份人情，陈行长好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "boss_li_management_referral",

    phase: "street",

    icon: "💼",

    title: "李总的举荐",

    story:
      "李总看你做事有条理，拍板举荐你进一家正招主管的厂：「管理上的事儿你拿得起来，我这推荐管用。」",

    // conditions：boss_li 已结识且好感达标 + management 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 management>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._bossLiMgmtSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "💼 接举荐岗",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          st.resources.cash = (st.resources.cash || 0) + 460;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 李总更信你

          st.flags._bossLiMgmtSeen = true;

          StateManager.addMessage(
            "你接下李总举荐的管理岗，落袋¥460，名声+5，李总好感+5。",

            "success",
          );
        },
      },

      {
        text: "📋 只做顾问",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 170;

          st.flags._bossLiMgmtSeen = true;

          StateManager.addMessage(
            "你只做外部管理顾问，落袋¥170，不入职。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "brother_huang_coding_gig",

    phase: "street",

    icon: "💻",

    title: "黄哥的外包",

    story:
      "黄哥手里有外包单缺人写码，看你代码利索：「这活儿急，你接了咱俩分，技术到位就行。」",

    // conditions：brother_huang 已结识且好感达标 + coding 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["brother_huang"]; // 检查 brother_huang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof code !== "number" || code < 20) return false; // 检查 coding>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._brotherHuangCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "💻 接外包单",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["brother_huang"];

          st.resources.cash = (st.resources.cash || 0) + 520;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 黄哥更信你

          st.flags._brotherHuangCodeSeen = true;

          StateManager.addMessage(
            "你接下黄哥的外包单，落袋¥520，名声+4，黄哥好感+5。",

            "success",
          );
        },
      },

      {
        text: "📦 只做模块",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 190;

          st.flags._brotherHuangCodeSeen = true;

          StateManager.addMessage(
            "你只认领一个小模块，落袋¥190，不担全责。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "brother_huang_coding_project",

    phase: "street",

    icon: "💻",

    title: "黄哥的代码包",

    story:
      "黄哥手头有个外包项目，知道你写代码有两下子，分了你一截模块，钱不多但稳。",

    // conditions：brother_huang 已结识+好感 + coding 技能（NPC ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["brother_huang"]; // 检查 brother_huang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 20) return false; // 检查 coding>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._bhCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "💻 接下模块",

        hint: "现金+ coding+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 280;

          st.flags._bhCodeSeen = true;

          StateManager.addMessage(
            "你接下黄哥的模块，coding+2，落袋¥280。",

            "success",
          );
        },
      },

      {
        text: "📦 只做边角",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 100;

          st.flags._bhCodeSeen = true;

          StateManager.addMessage("你只做边角活，落袋¥100。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "chef_chen_cooking_referral",

    phase: "street",

    icon: "👨‍🍳",

    title: "陈师傅的引荐",

    story:
      "陈师傅尝过你做的菜，点头认可：「手艺够正，我给你引荐几个酒楼后厨的活儿。」",

    // conditions：chef_chen 已结识且好感达标 + cooking 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 30) return false; // 检查 好感>=30

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 15) return false; // 检查 cooking>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._chefChenCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "👨‍🍳 接后厨活",

        hint: "现金+ 名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["chef_chen"];

          st.resources.cash = (st.resources.cash || 0) + 420;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5); // 陈师傅更待见你

          st.flags._chefChenCookSeen = true;

          StateManager.addMessage(
            "你接下酒楼后厨零活，落袋¥420，名声+4，陈师傅好感+5。",

            "success",
          );
        },
      },

      {
        text: "📋 只学不接",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["chef_chen"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 8); // 陈师傅赏识你上进

          st.flags._chefChenCookSeen = true;

          StateManager.addMessage(
            "你先在陈师傅手下偷师，他赏识你上进，好感+8。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "chef_chen_cooking_tips",

    phase: "street",

    icon: "🍳",

    title: "陈厨的指点",

    story:
      "餐馆陈厨看你爱鼓捣吃的，凑过来指点两招：「火候差一截，调味再大胆点，笨手艺也能成招牌。」",

    // conditions：chef_chen 已结识且好感达标 + cooking 技能（NPC×技能空白区）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 15) return false; // 检查 cooking>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._chefChenTipsSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍳 跟学一招",

        hint: "烹饪+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["chef_chen"];

          if (st.skills && st.skills.cooking)
            st.skills.cooking.level = Math.min(
              100,

              st.skills.cooking.level + 4,
            );

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._chefChenTipsSeen = true;

          StateManager.addMessage(
            "你跟陈厨学了一手，烹饪+4，陈厨好感+4。",

            "success",
          );
        },
      },

      {
        text: "📝 只记笔记",

        hint: "轻量 烹饪+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.level = Math.min(
              100,

              st.skills.cooking.level + 1,
            );

          st.flags._chefChenTipsSeen = true;

          StateManager.addMessage("你只记下要点，烹饪+1，留着以后练。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "chef_chen_management_kitchen",

    phase: "street",

    icon: "👨‍🍳",

    title: "陈厨的后厨",

    story:
      "你正端着厨师饭碗，陈厨见你还会来事儿，让你暂管后厨排班，管得好就给你加薪。",

    // conditions：chef_chen 已结识+好感 + management 技能 + 当前职业为厨师（NPC ∩ 技能 ∩ 职业）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      var man = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级

      if (typeof man !== "number" || man < 15) return false; // 检查 management>=15

      if (!st.employment || !st.employment.currentJob) return false; // 检查 有职业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._ccKitchenSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "👨‍🍳 管起后厨",

        hint: "管理+ 好感+",

        apply: function (st) {
          var s = st.skills.management;

          s.level = Math.min(100, s.level + 2);

          var rel = st.relationships && st.relationships["chef_chen"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._ccKitchenSeen = true;

          StateManager.addMessage(
            "你管起后厨，management+2，陈厨好感+3。",

            "success",
          );
        },
      },

      {
        text: "🍳 只管自己灶",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["chef_chen"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._ccKitchenSeen = true;

          StateManager.addMessage("你只管自己灶，陈厨好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "cloudy_market_day",

    phase: "street",

    icon: "☁️",

    title: "阴天市集",

    story:
      "阴天不晒，集市人潮涌动，摊主们巴不得多个人帮忙看货讲价：「这天逛集的人最多，搭把手多赚点。」",

    // conditions：天气 cloudy + 处于交易地点（天气×交易空白区）

    conditions: function (st) {
      if (st.weather.current !== "cloudy") return false; // 检查 阴天

      if (!(st.trade && st.trade.currentLocation)) return false; // 检查 处于某交易地点

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._cloudyMarketSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "☁️ 帮摊主看货",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 300;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._cloudyMarketSeen = true;

          StateManager.addMessage(
            "你阴天帮摊主看货讲价，落袋¥300，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🛒 只自己逛集",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 110;

          st.flags._cloudyMarketSeen = true;

          StateManager.addMessage(
            "你只趁阴天集市捡漏，落袋¥110，不帮工。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "coding_uncle_chen_bank_automation",

    phase: "street",

    icon: "💻",

    title: "陈叔的自动化活儿",

    story:
      "银行里的陈叔知道你懂代码，托你写个小脚本，把他每月对账的重复活儿自动化了。",

    // conditions：uncle_chen_bank 已结识+好感 + coding 技能（NPC ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["uncle_chen_bank"]; // 检查 uncle_chen_bank 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 15) return false; // 检查 coding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._chenAutoSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "💻 接下私活",

        hint: "现金+ coding+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 300;

          st.flags._chenAutoSeen = true;

          StateManager.addMessage(
            "你给陈叔写了对账脚本，coding+2，落袋¥300。",

            "success",
          );
        },
      },

      {
        text: "📖 只请教门道",

        hint: "轻量 coding+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 1);

          st.flags._chenAutoSeen = true;

          StateManager.addMessage("你跟陈叔聊了银行门道，coding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "commercial_driving_delivery",

    phase: "street",

    icon: "🛵",

    title: "商业区的跑腿",

    story:
      "你在商业区，商户急着送货却叫不到车。你正好会开：「这片区我熟，交给我准到点。」",

    // conditions：当前在商业区 + driving 技能（交易地点系统 + 技能系统）

    conditions: function (st) {
      if (st.trade.currentLocation !== "commercialDist") return false; // 检查 当前在商业区

      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof drv !== "number" || drv < 15) return false; // 检查 driving>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._commDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🛵 接送货",

        hint: "现金+ 技能+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 230;

          if (st.skills && st.skills.driving)
            st.skills.driving.level = Math.min(
              100,

              st.skills.driving.level + 2,
            );

          st.flags._commDriveSeen = true;

          StateManager.addMessage(
            "你在商业区接了送货，落袋¥230，驾驶+2。",

            "success",
          );
        },
      },

      {
        text: "🗺️ 只带个路",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 90;

          st.flags._commDriveSeen = true;

          StateManager.addMessage("你只给商户带了个路，落袋¥90。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "commercial_rep_cooking_fee",

    phase: "street",

    icon: "🥘",

    title: "商业区的摊位费",

    story:
      "你在商业区有点名气，管委会见你做吃的不错，给摆摊费打了折，省下一笔。",

    // conditions：commercialDist 声望 + cooking 技能（声望 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      if (
        typeof (st.reputation && st.reputation.commercialDist) !== "number" ||
        (st.reputation.commercialDist || 0) < 30
      )
        return false; // 检查 商业区声望

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 15) return false; // 检查 cooking>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._commFeeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🥘 领了优惠",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.reputation.commercialDist =
            (st.reputation.commercialDist || 0) + 2;

          st.flags._commFeeSeen = true;

          StateManager.addMessage(
            "你领了摊位费优惠，落袋¥150，商业区声望+2。",

            "success",
          );
        },
      },

      {
        text: "🙏 记着人情",

        hint: "轻量 声望+",

        apply: function (st) {
          st.reputation.commercialDist =
            (st.reputation.commercialDist || 0) + 1;

          st.flags._commFeeSeen = true;

          StateManager.addMessage("你记着管委会人情，商业区声望+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "commercial_rep_stall_fee",

    phase: "street",

    icon: "🏪",

    title: "商业区的摊位费",

    story:
      "你在商业区摆摊小有名气，管摊的大姐少收你一笔占地费：「你货真价实，街坊认，这费我给你免了。」",

    // conditions：商业区声望高 + 摆摊副业（声望系统 + 副业系统）

    conditions: function (st) {
      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望

      if (typeof rep !== "number" || rep < 30) return false; // 检查 商业区声望>=30

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.sideHustle.type !== "stall") return false; // 检查 副业为摆摊

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._commercialStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🏪 接着摆",

        hint: "现金+ 声望+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;

          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 3,
            );

          st.flags._commercialStallSeen = true;

          StateManager.addMessage(
            "你免了占地费继续摆摊，落袋¥200，商业区声望+3。",

            "success",
          );
        },
      },

      {
        text: "🤝 只道谢",

        hint: "轻量 声望+",

        apply: function (st) {
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,

              (st.reputation.commercialDist || 0) + 1,
            );

          st.flags._commercialStallSeen = true;

          StateManager.addMessage("你只向大姐道了谢，商业区声望+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "cooking_chef_chen_mentor",

    phase: "street",

    icon: "👨‍🍳",

    title: "陈厨的厨艺带教",

    story: "你爱鼓捣吃食，陈厨瞧你有点底子，闲时拎你进后厨，手把手教了两招。",

    // conditions：cooking 技能 + chef_chen 已结识+好感（技能 ∩ NPC ∩ 需求）

    conditions: function (st) {
      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 10) return false; // 检查 cooking>=10

      var rel = st.relationships && st.relationships["chef_chen"]; // 检查 chef_chen 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 15) return false; // 检查 好感>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._chenMentorSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "👨‍🍳 跟厨学艺",

        hint: "cooking+ 幸福+",

        apply: function (st) {
          var s = st.skills.cooking;

          s.level = Math.min(100, s.level + 3);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._chenMentorSeen = true;

          StateManager.addMessage(
            "陈厨带教你两手，cooking+3，幸福+5。",

            "success",
          );
        },
      },

      {
        text: "🍳 只蹭饭",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);

          st.flags._chenMentorSeen = true;

          StateManager.addMessage("你只蹭了顿饭，幸福+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "cooking_sales_food_stall",

    phase: "street",

    icon: "🍜",

    title: "吃食摊子",

    story:
      "你做饭有一手，嘴皮子也利索，索性支个小摊卖吃食：「会做又会吆喝，生意差不了。」",

    // conditions：cooking + sales 双技能协同（技能系统空白区）

    conditions: function (st) {
      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof cook !== "number" || cook < 20) return false; // 检查 cooking>=20

      if (typeof sale !== "number" || sale < 20) return false; // 检查 sales>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._foodStallSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🍜 支摊卖吃食",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 400;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._foodStallSeen = true;

          StateManager.addMessage(
            "你支起吃食摊，现做现卖落袋¥400，名声+4。",

            "success",
          );
        },
      },

      {
        text: "🗣️ 只帮人代卖",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.flags._foodStallSeen = true;

          StateManager.addMessage(
            "你只帮熟客代卖拿提成，落袋¥150，不担本钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "decline_electrician_layoff",

    phase: "street",

    icon: "⚡",

    title: "衰退期的电活",

    story:
      "经济走下坡，工程少了，你这电工手艺一时接不到大单，只能接些零散检修糊口。",

    // conditions：衰退期 + electrician 技能（时代变迁 ∩ 技能系统）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "decline") return false; // 检查 衰退期

      var el =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof el !== "number" || el < 15) return false; // 检查 electrician>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._declElecSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "⚡ 接零散检修",

        hint: "现金+ 保手艺",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 140;

          st.flags._declElecSeen = true;

          StateManager.addMessage(
            "衰退期你接零散检修糊口，落袋¥140。",

            "success",
          );
        },
      },

      {
        text: "📚 趁闲练手",

        hint: "轻量 electrician+",

        apply: function (st) {
          var s = st.skills.electrician;

          s.level = Math.min(100, s.level + 2);

          st.flags._declElecSeen = true;

          StateManager.addMessage("你趁闲练手，electrician+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "driving_sister_zhang_delivery",

    phase: "street",

    icon: "🚗",

    title: "张姐的接送单",

    story: "你正开着车跑活，张姐打电话来，问你顺不顺路，帮她捎趟急件。",

    // conditions：开车副业 + sister_zhang 已结识（副业 ∩ NPC ∩ 经济）

    conditions: function (st) {
      if (
        !st.sideHustle ||
        !st.sideHustle.active ||
        st.sideHustle.type !== "driving"
      )
        return false; // 检查 开车副业

      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._zhangDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🚗 顺路捎件",

        hint: "现金+ 好感+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._zhangDriveSeen = true;

          StateManager.addMessage(
            "你顺路帮张姐捎了急件，现金+¥120，张姐好感+2。",

            "success",
          );
        },
      },

      {
        text: "🙅 这趟赶",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._zhangDriveSeen = true;

          StateManager.addMessage("你这趟赶活没接，张姐好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "electrician_coding_home_iot",

    phase: "street",

    icon: "🏠",

    title: "智能家居改装",

    story:
      "你既懂电路又写得了程序，邻居家想搞智能改造：「线路和程序你都通，这活儿非你莫属。」",

    // conditions：electrician + coding 双技能协同（技能系统空白区）

    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof elec !== "number" || elec < 15) return false; // 检查 electrician>=15

      if (typeof code !== "number" || code < 15) return false; // 检查 coding>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._homeIotSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🏠 接智能改装",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 500;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._homeIotSeen = true;

          StateManager.addMessage(
            "你接下整屋智能改造，落袋¥500，名声+5。",

            "success",
          );
        },
      },

      {
        text: "🔌 只做基础布线",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 180;

          st.flags._homeIotSeen = true;

          StateManager.addMessage(
            "你只做基础智能布线，落袋¥180，不碰程序。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "electrician_repair_home_save",

    phase: "street",

    icon: "💡",

    title: "自家电路自己修",

    story:
      "租房的电路老出毛病，你既懂电工又会修，自己上手搞定，省下一笔上门费。",

    // conditions：electrician + repair 技能（技能协同 ∩ 住所）

    conditions: function (st) {
      var el =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 检查 electrician 等级

      if (typeof el !== "number" || el < 10) return false; // 检查 electrician>=10

      var rp = st.skills && st.skills.repair && st.skills.repair.level; // 检查 repair 等级

      if (typeof rp !== "number" || rp < 5) return false; // 检查 repair>=5

      if (!st.housing || st.housing.tier < 1) return false; // [Layer3]

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._elecHomeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "💡 自己动手修",

        hint: "现金+ 幸福+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 90;

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._elecHomeSeen = true;

          StateManager.addMessage(
            "你自修电路省下上门费，现金+¥90，幸福+5。",

            "success",
          );
        },
      },

      {
        text: "🔧 顺手升级",

        hint: "轻量 electrician+",

        apply: function (st) {
          var s = st.skills.electrician;

          s.level = Math.min(100, s.level + 1);

          st.flags._elecHomeSeen = true;

          StateManager.addMessage(
            "你顺手把线路升级了，electrician+1。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "english_sales_export",

    phase: "street",

    icon: "🌐",

    title: "外贸小单",

    story:
      "你英文溜、嘴皮子也利索，一个做外贸的小老板找你帮着跟老外砍价：「既懂外语又会来事，这单你俩谈最稳。」",

    // conditions：english + sales 双技能协同（技能系统空白区）

    conditions: function (st) {
      var eng = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      var sale = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof eng !== "number" || eng < 20) return false; // 检查 english>=20

      if (typeof sale !== "number" || sale < 15) return false; // 检查 sales>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._exportSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🌐 接外贸单",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 460;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);

          st.flags._exportSeen = true;

          StateManager.addMessage(
            "你接下外贸跟单，落袋¥460，名声+4。",

            "success",
          );
        },
      },

      {
        text: "📝 只做翻译",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 170;

          st.flags._exportSeen = true;

          StateManager.addMessage(
            "你只做翻译不掺和谈判，落袋¥170，稳妥。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "english_techpark_trade_deal",

    phase: "street",

    icon: "🌐",

    title: "科技园的英文单",

    story:
      "你在科技园跑货，碰上个外商卡在沟通上，你英语顶上，帮两边撮合成了单。",

    // conditions：english 技能 + 科技园交易地点（技能 ∩ 交易 ∩ 声望）

    conditions: function (st) {
      var en = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof en !== "number" || en < 15) return false; // 检查 english>=15

      if (!st.trade || st.trade.currentLocation !== "techPark") return false; // 检查 科技园

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._techDealSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🌐 撮合成交",

        hint: "现金+ english+ 声望+",

        apply: function (st) {
          var s = st.skills.english;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.reputation)
            st.reputation.techPark = Math.min(
              100,

              (st.reputation.techPark || 0) + 5,
            );

          st.flags._techDealSeen = true;

          StateManager.addMessage(
            "科技园你撮合英文单，english+2，现金+¥260，科技园声望+5。",

            "success",
          );
        },
      },

      {
        text: "🗣️ 只做翻译",

        hint: "轻量 english+",

        apply: function (st) {
          var s = st.skills.english;

          s.level = Math.min(100, s.level + 1);

          st.flags._techDealSeen = true;

          StateManager.addMessage("你只做了翻译，english+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "english_xiao_mei_translate",

    phase: "street",

    icon: "🔤",

    title: "小梅的翻译急单",

    story:
      "小梅接了个外文材料，自己啃不动，知道你英语还行，急吼吼找你搭手翻完。",

    // conditions：xiao_mei 已结识+好感 + english 技能（NPC ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 15) return false; // 检查 好感>=15

      var en = st.skills && st.skills.english && st.skills.english.level; // 检查 english 等级

      if (typeof en !== "number" || en < 15) return false; // 检查 english>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._meiTranslateSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🔤 接下翻译",

        hint: "现金+ english+",

        apply: function (st) {
          var s = st.skills.english;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 220;

          st.flags._meiTranslateSeen = true;

          StateManager.addMessage(
            "你帮小梅翻完急单，english+2，工钱¥220。",

            "success",
          );
        },
      },

      {
        text: "📝 只改关键处",

        hint: "轻量 english+",

        apply: function (st) {
          var s = st.skills.english;

          s.level = Math.min(100, s.level + 1);

          st.flags._meiTranslateSeen = true;

          StateManager.addMessage(
            "你只帮小梅改了关键几处，english+1。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_decline_cash_hoard",

    phase: "street",

    icon: "📉",

    title: "衰退期捂紧钱袋",

    story:
      "经济进了衰退，钱越来越毛。你早有准备，把现钱攥得紧，反倒比旁人踏实。",

    // conditions：衰退期 + 现金偏低（时代 ∩ 经济 ∩ 需求）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "decline") return false; // 检查 衰退期

      if (typeof st.resources.cash !== "number" || (st.resources.cash || 0) >= 500)
        return false; // 检查 现金偏低

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._declineHoardSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📉 稳住别动",

        hint: "幸福+ 现金小+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.resources.cash = (st.resources.cash || 0) + 60;

          st.flags._declineHoardSeen = true;

          StateManager.addMessage(
            "衰退期你捂紧钱袋，幸福+6，省下¥60。",

            "success",
          );
        },
      },

      {
        text: "💡 只复盘",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);

          st.flags._declineHoardSeen = true;

          StateManager.addMessage("你复盘了收支，幸福+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_decline_safety",

    phase: "street",

    icon: "🛡️",

    title: "衰退期的底气",

    story:
      "经济转入衰退，街坊都在叹气，你账户里攒下的积蓄反倒成了底气：「手里有粮，心里不慌。」",

    // conditions：时代处于衰退期 + 现金充裕（时代变迁系统 + 经济系统）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "decline") return false; // 检查 衰退期

      var cash = st.resources && st.resources.cash; // 检查 现金

      if (typeof cash !== "number" || cash < 2000) return false; // 检查 现金>=2000

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 22) return false; // 检查 中后期

      if (st.flags && st.flags._eraDeclineSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🛡️ 守住积蓄",

        hint: "名声+ 心情+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);

          st.flags._eraDeclineSeen = true;

          StateManager.addMessage(
            "你守住积蓄稳过衰退期，名声+3，心情+5。",

            "success",
          );
        },
      },

      {
        text: "💡 抄底准备",

        hint: "轻量 名声+",

        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 1);

          st.flags._eraDeclineSeen = true;

          StateManager.addMessage("你盘算着衰退末期抄底，名声+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_growth_coding_stocks",

    phase: "street",

    icon: "📈",

    title: "成长期的码农投资",

    story:
      "经济进了增长期，科技股热闹。你懂代码，看得懂门道，挑了只票小仓位试水。",

    // conditions：增长期 + coding 技能 + 已有持仓（时代 ∩ 技能 ∩ 投资）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "growth") return false; // 检查 增长期

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 15) return false; // 检查 coding>=15

      if (
        !st.investment ||
        !st.investment.stockHoldings ||
        st.investment.stockHoldings.length <= 0
      )
        return false; // 检查 已有持仓

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._growthCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "📈 小仓位试水",

        hint: "现金- coding+ 投资+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 1);

          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);

          st.flags._growthCodeSeen = true;

          StateManager.addMessage(
            "增长期你小仓位试水，coding+1，投出¥150。",

            "success",
          );
        },
      },

      {
        text: "🔍 只研究",

        hint: "轻量 coding+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 1);

          st.flags._growthCodeSeen = true;

          StateManager.addMessage("你只研究没下手，coding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_growth_invest",

    phase: "street",

    icon: "📈",

    title: "增长期的行情",

    story:
      "经济正处增长期，街上都在聊行情。你手里有几支票，邻居凑过来：「这势头，拿稳了别慌卖。」",

    // conditions：时代处于增长期 + 已持有股票（时代变迁系统 + 投资系统）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "growth") return false; // 检查 增长期

      var holds = st.investment && st.investment.stockHoldings; // 检查 持仓

      if (!holds || !holds.length) return false; // 检查 有股票持仓

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 20) return false; // 检查 中后期

      if (st.flags && st.flags._eraGrowthSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "📈 加仓一把",

        hint: "现金- 长期收益",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300);

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          st.flags._eraGrowthSeen = true;

          StateManager.addMessage(
            "你趁增长期加仓¥300，心情+6，押注后市。",

            "success",
          );
        },
      },

      {
        text: "📊 只观望",

        hint: "轻量 心情+",

        apply: function (st) {
          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);

          st.flags._eraGrowthSeen = true;

          StateManager.addMessage("你只观望没动，心情+2，稳一手。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_growth_property_boom",

    phase: "street",

    icon: "🏗️",

    title: "扩张期的门路",

    story:
      "城市进入扩张期，工地和新区四处冒头，手里有底子的散户也被拉进基建红利：「这波风口，有本钱就能分一杯羹。」",

    // conditions：时代处于 growth 阶段 + 现金充裕（时代×经济空白区）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "growth") return false; // 检查 扩张期

      var cash = st.resources && st.resources.cash; // 检查 现金

      if (typeof cash !== "number" || cash < 3000) return false; // 检查 现金>=3000

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 25) return false; // 检查 中后期

      if (st.flags && st.flags._growthBoomSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🏗️ 跟投基建红利",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 700;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);

          st.flags._growthBoomSeen = true;

          StateManager.addMessage(
            "你搭上扩张期基建红利，落袋¥700，名声+5。",

            "success",
          );
        },
      },

      {
        text: "🧱 只做建材倒手",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 250;

          st.flags._growthBoomSeen = true;

          StateManager.addMessage(
            "你只在建材上倒手赚差价，落袋¥250，不押大本钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_initial_welding_demand",

    phase: "street",

    icon: "🏗️",

    title: "开局催生焊接活",

    story:
      "经济刚起步，处处动工，焊接的小活儿特别多。你手上这门手艺正赶上了行情。",

    // conditions：时代初期 + welding 技能（时代 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "initial") return false; // 检查 初期

      var w = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof w !== "number" || w < 10) return false; // 检查 welding>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 6) return false; // 检查 早期

      if (st.flags && st.flags._initWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🏗️ 接下小活",

        hint: "现金+ welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 200;

          st.flags._initWeldSeen = true;

          StateManager.addMessage(
            "开局焊接小活不断，welding+2，落袋¥200。",

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

          st.flags._initWeldSeen = true;

          StateManager.addMessage("你趁行情多练了手，welding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_mature_invest_skill",

    phase: "street",

    icon: "📅",

    title: "成熟期的稳投",

    story:
      "经济进了成熟期，波动小、红利稳。你懂点账，趁这时候做了笔稳健配置，落袋不慌。",

    // conditions：成熟期 + accounting 技能（时代变迁 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "mature") return false; // 检查 成熟期

      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 accounting 等级

      if (typeof acc !== "number" || acc < 15) return false; // 检查 accounting>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._matureInvSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📅 稳健配置",

        hint: "现金+ accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 260;

          st.flags._matureInvSeen = true;

          StateManager.addMessage(
            "成熟期你稳健配置，accounting+2，落袋¥260。",

            "success",
          );
        },
      },

      {
        text: "📊 只观望",

        hint: "轻量 accounting+",

        apply: function (st) {
          var s = st.skills.accounting;

          s.level = Math.min(100, s.level + 1);

          st.flags._matureInvSeen = true;

          StateManager.addMessage("你只观望门道，accounting+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "era_mature_welding_contract",

    phase: "street",

    icon: "🤝",

    title: "成熟期的焊接包活",

    story:
      "经济稳在成熟期，厂里把一批焊接外包出来。你在商业区有点名号，接下了这单。",

    // conditions：成熟期 + welding 技能 + 商业区声望（时代 ∩ 技能 ∩ 声望 ∩ 经济）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "mature") return false; // 检查 成熟期

      var w = st.skills && st.skills.welding && st.skills.welding.level; // 检查 welding 等级

      if (typeof w !== "number" || w < 10) return false; // 检查 welding>=10

      if (
        typeof (st.reputation && st.reputation.commercialDist) !== "number" ||
        (st.reputation.commercialDist || 0) < 30
      )
        return false; // 检查 商业区声望>=30

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._matureWeldSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "🤝 接下包活",

        hint: "现金+ welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 300;

          st.flags._matureWeldSeen = true;

          StateManager.addMessage(
            "成熟期你接下焊接包活，welding+2，落袋¥300。",

            "success",
          );
        },
      },

      {
        text: "📐 只外包工",

        hint: "轻量 welding+",

        apply: function (st) {
          var s = st.skills.welding;

          s.level = Math.min(100, s.level + 1);

          st.flags._matureWeldSeen = true;

          StateManager.addMessage("你只做外包工，welding+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fame_high_boss",

    phase: "street",

    icon: "🌟",

    title: "李总的高看",

    story:
      "你在街面上有名号，李总特意找你：「早就听说你，名声在外的人靠谱，有个肥差想请你。」",

    // conditions：名声高 + boss_li 已结识且好感达标（名声系统 + NPC 系统）

    conditions: function (st) {
      var fam = st.player && st.player.fame; // 检查 名声

      if (typeof fam !== "number" || fam < 40) return false; // 检查 名声>=40

      var rel = st.relationships && st.relationships["boss_li"]; // 检查 boss_li 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._fameBossSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "🌟 接肥差",

        hint: "现金+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          st.resources.cash = (st.resources.cash || 0) + 450;

          if (rel) rel.affinity = Math.min(100, rel.affinity + 5);

          st.flags._fameBossSeen = true;

          StateManager.addMessage(
            "你接下李总肥差，落袋¥450，李总好感+5。",

            "success",
          );
        },
      },

      {
        text: "📞 只留联系",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["boss_li"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._fameBossSeen = true;

          StateManager.addMessage("你只跟李总留了联系，好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fame_sister_zhang_media",

    phase: "street",

    icon: "📣",

    title: "张记者的专访",

    story:
      "你小有名气，张记者找上门想做个专访。你趁着名头接了采访，顺带带火了手头的营生。",

    // conditions：高名声 + sister_zhang 已结识（名声系统 ∩ NPC ∩ 经济）

    conditions: function (st) {
      if (typeof st.player.fame !== "number" || st.player.fame < 30)
        return false; // 检查 名声

      var rel = st.relationships && st.relationships["sister_zhang"]; // 检查 sister_zhang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 18) return false; // 检查 中后期

      if (st.flags && st.flags._fameMediaSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.02,

    repeatable: false,

    choices: [
      {
        text: "📣 接下专访",

        hint: "名声+ 现金+",

        apply: function (st) {
          st.player.fame = Math.min(100, st.player.fame + 5);

          st.resources.cash = (st.resources.cash || 0) + 150;

          st.flags._fameMediaSeen = true;

          StateManager.addMessage(
            "张记者专访带你涨名气，名声+5，落袋¥150。",

            "success",
          );
        },
      },

      {
        text: "🤫 低调推辞",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["sister_zhang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._fameMediaSeen = true;

          StateManager.addMessage("你低调推辞，张记者好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fatigue_coding_night_oil",

    phase: "street",

    icon: "🌃",

    title: "熬夜敲代码",

    story:
      "你累得眼皮打架，可手头的代码活儿还差一截。硬撑着熬了半宿，总算收了尾。",

    // conditions：高疲劳 + coding 技能（需求 ∩ 技能 ∩ 经济）

    conditions: function (st) {
      if (typeof st.needs.fatigue !== "number" || st.needs.fatigue < 70)
        return false; // 检查 高疲劳

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 10) return false; // 检查 coding>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._nightOilSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🌃 熬完收尾",

        hint: "现金+ coding+ 疲劳+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 2);

          st.resources.cash = (st.resources.cash || 0) + 180;

          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);

          st.flags._nightOilSeen = true;

          StateManager.addMessage(
            "你熬完代码活儿，coding+2，落袋¥180，累上加累。",

            "success",
          );
        },
      },

      {
        text: "😴 明早再说",

        hint: "轻量 疲劳+",

        apply: function (st) {
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);

          st.flags._nightOilSeen = true;

          StateManager.addMessage("你搁下活儿明早再说，疲劳+5。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fatigue_high_drive_rest",

    phase: "street",

    icon: "🥱",

    title: "累到打盹的司机",

    story:
      "你连开大半天的车，眼皮直打架。服务区大姐敲窗：「别硬撑，眯一觉再走，安全要紧。」",

    // conditions：疲惫极高 + driving 技能（需求系统 + 技能系统）

    conditions: function (st) {
      var fat = st.needs && st.needs.fatigue; // 检查 疲惫

      if (typeof fat !== "number" || fat <= 80) return false; // 检查 疲惫>80

      var drv = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof drv !== "number" || drv < 15) return false; // 检查 driving>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._fatigueDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🥱 眯一觉",

        hint: "疲惫- 现金-",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 60); // 住宿

          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 40); // 疲惫缓解

          st.flags._fatigueDriveSeen = true;

          StateManager.addMessage(
            "你眯了一觉，花¥60，疲惫-40，精神回来。",

            "success",
          );
        },
      },

      {
        text: "☕ 只提提神",

        hint: "轻量 疲惫-",

        apply: function (st) {
          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 14); // 疲惫缓解

          st.flags._fatigueDriveSeen = true;

          StateManager.addMessage("你只喝了杯咖啡提神，疲惫-14。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fatigue_high_old_zhou_rest",

    phase: "street",

    icon: "😴",

    title: "老周劝你歇",

    story:
      "你连轴转累得眼皮打架，老周看你这样，硬拉你到阴凉处：「命是自己的，歇会儿。」",

    // conditions：old_zhou 已结识+好感 + 高疲劳（NPC ∩ 需求系统）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.needs.fatigue !== "number" || st.needs.fatigue < 70)
        return false; // 检查 高疲劳

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._fatZhouSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "😴 听劝歇会",

        hint: "疲劳- 好感+",

        apply: function (st) {
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 30);

          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._fatZhouSeen = true;

          StateManager.addMessage(
            "你听劝歇了，疲劳-30，老周好感+2。",

            "success",
          );
        },
      },

      {
        text: "⏳ 再撑撑",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._fatZhouSeen = true;

          StateManager.addMessage("你再撑了撑，老周好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "fatigue_rest_recovery",

    phase: "street",

    icon: "🛏️",

    title: "累垮前的歇脚",

    story:
      "你连轴转累到眼皮打架，巷口小旅店老板看你可怜：「先进来眯一觉，钱不够先记着，身子要紧。」",

    // conditions：疲惫高 + 有现金（需求×事件空白区）

    conditions: function (st) {
      var fat = st.needs && st.needs.fatigue; // 检查 疲惫

      if (typeof fat !== "number" || fat <= 80) return false; // 检查 疲惫>80

      var cash = st.resources && st.resources.cash; // 检查 现金

      if (typeof cash !== "number" || cash >= 200) return false; // [Layer3] 钱不够先记着

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._restRecoverySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🛏️ 开房歇一觉",

        hint: "现金- 疲惫-",

        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 120); // 房费

          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 35); // 疲惫缓解

          st.flags._restRecoverySeen = true;

          StateManager.addMessage(
            "你开房眯了一觉，花¥120，疲惫-35，精神回来不少。",

            "success",
          );
        },
      },

      {
        text: "🪑 只坐会儿",

        hint: "轻量 疲惫-",

        apply: function (st) {
          if (st.needs)
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 12); // 疲惫缓解

          st.flags._restRecoverySeen = true;

          StateManager.addMessage(
            "你只在店门口坐了会儿，疲惫-12，没花钱。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "festival_happiness_aunt",

    phase: "street",

    icon: "🎊",

    title: "过节的热闹",

    story:
      "过节了，街坊凑份子热闹。你心情正好，王阿姨拉你入伙，分了你一屉刚蒸的点心。",

    // conditions：aunt_wang 已结识+好感 + 高幸福（节日 ∩ NPC ∩ 需求系统）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["aunt_wang"]; // 检查 aunt_wang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.needs.happiness !== "number" || st.needs.happiness < 60)
        return false; // 检查 高幸福

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._festAuntSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🎊 入伙热闹",

        hint: "幸福+ 好感+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);

          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._festAuntSeen = true;

          StateManager.addMessage(
            "你入伙过节，幸福感+10，王阿姨好感+3。",

            "success",
          );
        },
      },

      {
        text: "🎁 礼到人不到",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._festAuntSeen = true;

          StateManager.addMessage("你送礼到人未到，王阿姨好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "growth_sales_expand",

    phase: "street",

    icon: "📊",

    title: "增长期的铺子",

    story:
      "经济往上走，街面热闹起来。你正做着自由买卖，会销售的你顺势扩了摊，生意更活。",

    // conditions：增长期 + sales 技能 + 副业进行中（时代变迁 ∩ 技能 ∩ 副业）

    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态

      if (!era) return false; // 检查 已初始化

      if (era.stageId !== "growth") return false; // 检查 增长期

      var sal = st.skills && st.skills.sales && st.skills.sales.level; // 检查 sales 等级

      if (typeof sal !== "number" || sal < 15) return false; // 检查 sales>=15

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 16) return false; // 检查 中后期

      if (st.flags && st.flags._growthSalesSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "📊 扩摊经营",

        hint: "现金+ 口碑+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 220;

          if (st.sideHustle)
            st.sideHustle.reputation = (st.sideHustle.reputation || 0) + 4;

          st.flags._growthSalesSeen = true;

          StateManager.addMessage(
            "增长期你扩摊经营，落袋¥220，副业口碑+4。",

            "success",
          );
        },
      },

      {
        text: "🤝 稳着来",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 80;

          st.flags._growthSalesSeen = true;

          StateManager.addMessage("你稳着经营，落袋¥80。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "happiness_high_drive_roadtrip",

    phase: "street",

    icon: "🚙",

    title: "兜风的好心情",

    story:
      "你连日顺心，心情正佳，便开车出了趟郊游。会开车的你一路顺畅，回来更精神了。",

    // conditions：高幸福 + driving 技能（需求系统 ∩ 技能系统 ∩ 经济）

    conditions: function (st) {
      if (typeof st.needs.happiness !== "number" || st.needs.happiness < 70)
        return false; // 检查 高幸福

      var dr = st.skills && st.skills.driving && st.skills.driving.level; // 检查 driving 等级

      if (typeof dr !== "number" || dr < 15) return false; // 检查 driving>=15

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._happyDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🚙 出郊兜风",

        hint: "幸福+ 现金-",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);

          st.resources.cash = Math.max(0, st.resources.cash - 60);

          st.flags._happyDriveSeen = true;

          StateManager.addMessage(
            "你开车兜风，心情大好，幸福感+8，花了¥60。",

            "success",
          );
        },
      },

      {
        text: "🅿️ 就近散心",

        hint: "轻量 幸福+",

        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);

          st.flags._happyDriveSeen = true;

          StateManager.addMessage("你就近散了散心，幸福感+3。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "happiness_high_xiao_mei",

    phase: "street",

    icon: "😊",

    title: "小梅的聚会",

    story:
      "你这些天心情正好，小梅拉你去街角聚会：「看你乐呵呵的，正好凑个热闹，大伙儿都爱跟你待一块儿。」",

    // conditions：心情高 + xiao_mei 已结识且好感达标（需求系统 + NPC 关系系统）

    conditions: function (st) {
      var hap = st.needs && st.needs.happiness; // 检查 心情

      if (typeof hap !== "number" || hap < 70) return false; // 检查 心情>=70

      var rel = st.relationships && st.relationships["xiao_mei"]; // 检查 xiao_mei 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 25) return false; // 检查 好感>=25

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._happyXiaoMeiSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.025,

    repeatable: false,

    choices: [
      {
        text: "😊 去凑热闹",

        hint: "名声+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 4);

          st.flags._happyXiaoMeiSeen = true;

          StateManager.addMessage(
            "你去了小梅的聚会，名声+3，小梅好感+4。",

            "success",
          );
        },
      },

      {
        text: "🙂 只打个照面",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["xiao_mei"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._happyXiaoMeiSeen = true;

          StateManager.addMessage("你只跟小梅打了个照面，好感+2。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "happiness_low_aunt",

    phase: "street",

    icon: "🤗",

    title: "王姨的暖汤",

    story:
      "你垂头丧气，王姨端来一碗热汤：「人哪能一直顺，喝口热的，明儿又是新的一天。」",

    // conditions：心情极低 + aunt_wang 已结识且好感达标（需求系统 + NPC 关系系统）

    conditions: function (st) {
      var hap = st.needs && st.needs.happiness; // 检查 心情

      if (typeof hap !== "number" || hap >= 30) return false; // 检查 心情<30

      var rel = st.relationships && st.relationships["aunt_wang"]; // 检查 aunt_wang 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._auntHappySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🤗 接下暖汤",

        hint: "心情+ 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (st.needs)
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 18);

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._auntHappySeen = true;

          StateManager.addMessage(
            "你接下王姨的暖汤，心情+18，王姨好感+3。",

            "success",
          );
        },
      },

      {
        text: "🙏 只道谢",

        hint: "轻量 好感+",

        apply: function (st) {
          var rel = st.relationships && st.relationships["aunt_wang"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._auntHappySeen = true;

          StateManager.addMessage("你只向王姨道了谢，王姨好感+1。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "heatwave_coding_blackout",

    phase: "street",

    icon: "🔥",

    title: "热浪断电夜",

    story:
      "热浪把片区电闸烧了，整栋楼黑着。你借着笔记本残电把白天没写完的代码赶完——有这门手艺，停电反成清净。",

    // conditions：heatwave 天气 + coding 技能（天气系统 ∩ 技能系统）

    conditions: function (st) {
      if (st.weather.current !== "heatwave") return false; // 检查 热浪

      var cod = st.skills && st.skills.coding && st.skills.coding.level; // 检查 coding 等级

      if (typeof cod !== "number" || cod < 20) return false; // 检查 coding>=20

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 14) return false; // 检查 中后期

      if (st.flags && st.flags._hwCodeSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "💻 摸黑赶工",

        hint: "coding+ 压力+",

        apply: function (st) {
          var s = st.skills.coding;

          s.level = Math.min(100, s.level + 2);

          st.personalGrowth.health.mental.stress = Math.min(
            100,

            (st.personalGrowth.health.mental.stress || 0) + 6,
          );

          st.flags._hwCodeSeen = true;

          StateManager.addMessage(
            "热浪断电夜你赶完代码，coding+2，精神压力+6。",

            "success",
          );
        },
      },

      {
        text: "🛏️ 早点睡",

        hint: "轻量 压力-",

        apply: function (st) {
          st.personalGrowth.health.mental.stress = Math.max(
            0,

            (st.personalGrowth.health.mental.stress || 0) - 4,
          );

          st.flags._hwCodeSeen = true;

          StateManager.addMessage("你早点歇了，精神压力-4。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "heatwave_driving_delivery",

    phase: "street",

    icon: "🥵",

    title: "热浪跑腿",

    story:
      "热浪滚滚，没人愿出门，外卖单子反而暴涨。你正跑着开车副业，平台催你多接几单：「这天气单子翻倍，多跑多赚。」",

    // conditions：天气 heatwave + 开车副业（天气×职业空白区）

    conditions: function (st) {
      if (st.weather.current !== "heatwave") return false; // 检查 热浪

      if (!(
        st.sideHustle &&
        st.sideHustle.active &&
        st.sideHustle.type === "driving"
      ))
        return false; // 检查 开车副业

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._heatwaveDeliverySeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🥵 多接热浪单",

        hint: "现金+ 名声+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 420;

          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);

          st.flags._heatwaveDeliverySeen = true;

          StateManager.addMessage(
            "你顶着热浪多跑十几单，落袋¥420，名声+3。",

            "success",
          );
        },
      },

      {
        text: "🧊 只跑近单",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;

          st.flags._heatwaveDeliverySeen = true;

          StateManager.addMessage(
            "你只接附近单避暑，落袋¥150，不硬扛。",

            "info",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "heatwave_driving_demand",

    phase: "street",

    icon: "🚕",

    title: "热浪里的活儿",

    story:
      "热浪滚滚，谁都不愿出门，打车跑腿的活儿反而多。你擦把汗：「这天越热，方向盘越烫手也越来钱。」",

    // conditions：热浪 + 副业开车（天气系统 + 副业系统）

    conditions: function (st) {
      if (st.weather.current !== "heatwave") return false; // 检查 热浪

      if (!st.sideHustle || !st.sideHustle.active) return false; // 检查 副业进行中

      if (st.sideHustle.type !== "driving") return false; // 检查 副业为开车

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 10) return false; // 检查 中后期

      if (st.flags && st.flags._heatwaveDriveSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.035,

    repeatable: false,

    choices: [
      {
        text: "🚕 顶热出车",

        hint: "现金+ 疲惫+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 260;

          if (st.needs)
            st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);

          st.flags._heatwaveDriveSeen = true;

          StateManager.addMessage(
            "你顶着热浪出车，落袋¥260，疲惫+10。",

            "success",
          );
        },
      },

      {
        text: "🧊 只接近单",

        hint: "轻量 现金+",

        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 120;

          st.flags._heatwaveDriveSeen = true;

          StateManager.addMessage("你只接就近单，落袋¥120，少受罪。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "hunger_low_cooking_relief",

    phase: "street",

    icon: "🍲",

    title: "饿出来的手艺",

    story:
      "你连着几天吃不饱，反倒逼着自己把做饭手艺练出来了：「饿怕了，不如自己会做，省钱又管饱。」",

    // conditions：饥饱极低 + cooking 技能 + 连续低饥饿习惯（需求系统 + 技能系统 + 习惯系统）

    conditions: function (st) {
      var hun = st.needs && st.needs.hunger; // 检查 饥饱

      if (typeof hun !== "number" || hun >= 25) return false; // 检查 饥饱<25

      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof cook !== "number" || cook < 20) return false; // 检查 cooking>=20

      var habits = st.flags && st.flags._habits; // 检查 习惯容器

      if (!habits || (habits.lowHungerStreak || 0) < 2) return false; // 检查 连续低饥饿>=2天

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 12) return false; // 检查 中后期

      if (st.flags && st.flags._hungerCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.03,

    repeatable: false,

    choices: [
      {
        text: "🍲 练出手艺",

        hint: "技能+ 饥饱+",

        apply: function (st) {
          if (st.skills && st.skills.cooking)
            st.skills.cooking.level = Math.min(
              100,

              st.skills.cooking.level + 4,
            );

          if (st.needs)
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 15);

          st.flags._hungerCookSeen = true;

          StateManager.addMessage(
            "你饿中练出做饭手艺，烹饪+4，饥饱+15。",

            "success",
          );
        },
      },

      {
        text: "🥣 只填肚子",

        hint: "轻量 饥饱+",

        apply: function (st) {
          if (st.needs)
            st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 8);

          st.flags._hungerCookSeen = true;

          StateManager.addMessage("你只凑合填了肚子，饥饱+8。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "hunger_low_cooking_share",

    phase: "street",

    icon: "🍚",

    title: "老周尝你的手艺",

    story:
      "你饿得发慌，下了碗面。老周凑过来尝了一口，夸你手艺行，约你常做给他搭伙食。",

    // conditions：old_zhou 已结识+好感 + 低饥饿 + cooking 技能（NPC ∩ 需求 ∩ 技能）

    conditions: function (st) {
      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      if (typeof rel.affinity !== "number" || rel.affinity < 20) return false; // 检查 好感>=20

      if (typeof st.needs.hunger !== "number" || st.needs.hunger >= 25)
        return false; // 检查 低饥饿

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 10) return false; // 检查 cooking>=10

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 中后期

      if (st.flags && st.flags._hungCookSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.05,

    repeatable: false,

    choices: [
      {
        text: "🍚 做好搭伙",

        hint: "饥饿+ 好感+",

        apply: function (st) {
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 35);

          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 3);

          st.flags._hungCookSeen = true;

          StateManager.addMessage(
            "你下碗面搭伙，饥饿+35，老周好感+3。",

            "success",
          );
        },
      },

      {
        text: "🍜 自己先吃",

        hint: "轻量 饥饿+",

        apply: function (st) {
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 25);

          st.flags._hungCookSeen = true;

          StateManager.addMessage("你自己先吃了，饥饿+25。", "info");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "hunger_old_zhou_home_meal",

    phase: "street",

    icon: "🍚",

    title: "老周家的热饭",

    story: "你饿得前心贴后背，老周瞧见，拉你进屋扒了碗热饭，还夸你手艺见长。",

    // conditions：高饥饿 + old_zhou 已结识 + cooking 技能（需求 ∩ NPC ∩ 技能）

    conditions: function (st) {
      if (typeof st.needs.hunger !== "number" || st.needs.hunger < 65)
        return false; // 检查 高饥饿

      var rel = st.relationships && st.relationships["old_zhou"]; // 检查 old_zhou 关系

      if (!rel || !rel.met) return false; // 检查 已结识

      var ck = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 cooking 等级

      if (typeof ck !== "number" || ck < 5) return false; // 检查 cooking>=5

      if (st.player.phase !== "street") return false; // 检查 街头阶段

      if (st.player.day < 8) return false; // 检查 早期之后

      if (st.flags && st.flags._zhouMealSeen) return false; // 检查 未触发过

      return true;
    },

    probability: 0.04,

    repeatable: false,

    choices: [
      {
        text: "🍚 蹭口热饭",

        hint: "饥饿- 幸福+ 好感+",

        apply: function (st) {
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 30);

          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);

          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 2);

          st.flags._zhouMealSeen = true;

          StateManager.addMessage(
            "老周家热饭下肚，饥饿-30，幸福+6，老周好感+2。",

            "success",
          );
        },
      },

      {
        text: "🍳 回请一手",

        hint: "轻量 cooking+ 好感+",

        apply: function (st) {
          var s = st.skills.cooking;

          s.level = Math.min(100, s.level + 1);

          var rel = st.relationships && st.relationships["old_zhou"];

          if (rel) rel.affinity = Math.min(100, rel.affinity + 1);

          st.flags._zhouMealSeen = true;

          StateManager.addMessage(
            "你回请老周露了手，cooking+1，老周好感+1。",

            "info",
          );
        },
      },
    ],
  });
})();
