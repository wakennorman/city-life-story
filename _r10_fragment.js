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
    var mgmt = st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
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
        st.resources.cash += 1500;
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
        st.resources.cash += 400;
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
        st.resources.cash += 350;
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
        st.resources.cash += 300;
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
        st.resources.cash += 500;
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
        st.resources.cash += 150;
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
        st.resources.cash += 700;
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
        st.resources.cash += 300;
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
        st.resources.cash += 250;
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
        st.resources.cash += 450;
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
        st.resources.cash += 120;
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
    var mgmt = st.skills && st.skills.management && st.skills.management.level; // 检查 management 等级
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
        st.resources.cash += 550;
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
        st.resources.cash += 200;
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
        st.resources.cash += 300;
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
        st.resources.cash += 100;
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
    var mgmt = st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
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
        st.resources.cash += 600;
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
        st.resources.cash += 200;
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
        st.resources.cash += 700;
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
        st.resources.cash += 250;
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
    var mgmt = st.skills && st.skills.management && st.skills.management.level; // 检查 管理等级
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
        st.resources.cash += 1200;
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
        st.resources.cash += 300;
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
        st.resources.cash += 300;
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
        st.resources.cash += 120;
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
        st.resources.cash += 450;
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
        st.resources.cash += 400;
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
        st.resources.cash += 400;
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
        st.resources.cash += 120;
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
        st.resources.cash += 500;
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
        st.resources.cash += 150;
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
        st.resources.cash += 300;
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
        st.resources.cash += 950;
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
        st.resources.cash += 320;
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
        st.resources.cash += 800;
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
        st.resources.cash += 300;
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
        st.resources.cash += 1000;
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
        st.resources.cash += 350;
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
        st.resources.cash += 900;
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
        st.resources.cash += 300;
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
        st.resources.cash += 600;
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
        st.resources.cash += 200;
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
        st.resources.cash += 850;
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
        st.resources.cash += 280;
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
        st.resources.cash += 350;
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
        st.resources.cash += 80;
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
        st.resources.cash += 120; // 省下月租差额
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
