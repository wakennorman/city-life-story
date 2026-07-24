/**
 * 跨系统联动事件 — 拆分片段 2/8（原 cross_system_events.js 机械拆分，行为不变）
 * 仅含自包含的 RANDOM_EVENTS.push 语句；顺序无关（事件选择走 phase 过滤+概率）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._crossPart2Loaded) return;
  RANDOM_EVENTS._crossPart2Loaded = true;

  RANDOM_EVENTS.push({
    id: "npc_sister_wu_first_meet",
    phase: "street",
    icon: "💇",
    title: "美容院的吴姐",
    story:
      "你在商业区闲逛，经过一家美容院时，一个打扮精致的中年女人推门出来，上下打量了你一眼：\n\n「小伙子/小姑娘，找工作不？我看你形象不错，我店里正缺个前台兼助理，工资日结，包培训。要不要进来聊聊？」\n\n她递过来一张名片——「吴姐美容·形象设计」。",
    // [自洽新增] conditions：在商业区 + day≥10 + 未结识吴姐
    conditions: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        st.player.day >= 10 &&
        curLoc === "commercialDist" &&
        (!st.relationships ||
          !st.relationships.sister_wu ||
          !st.relationships.sister_wu.met)
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "📋 进去聊聊工作机会",
        hint: "结识吴姐，好感+8",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.sister_wu) {
            st.relationships.sister_wu = { affinity: 0, met: true };
          }
          st.relationships.sister_wu.met = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 8,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          st.flags._sisterWuMetDay = st.player.day;
          StateManager.addMessage(
            "💇 你跟着吴姐进了美容院。店里装修不错，吴姐说前台月薪¥2800+提成。结识吴姐（美容院老板），好感+8，心情+6。",
            "success",
          );
        },
      },
      {
        text: "😊 收下名片，以后有需要再来",
        hint: "结识吴姐，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.sister_wu) {
            st.relationships.sister_wu = { affinity: 0, met: true };
          }
          st.relationships.sister_wu.met = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 5,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          st.flags._sisterWuMetDay = st.player.day;
          StateManager.addMessage(
            "😊 你收下名片。吴姐笑着说「随时来找我」。结识吴姐，好感+5，名气+2。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件58：阿黄的急招配送员（快递站相遇）-----
  // 设计意图：在商业区/科技园触发，建立阿黄「配送站长」的人设
  RANDOM_EVENTS.push({
    id: "npc_brother_huang_first_meet",
    phase: "street",
    icon: "📦",
    title: "快递站缺人手",
    story:
      "你经过一个快递站点，门口堆满了包裹。一个满头大汗的中年男人冲出来叫住你：\n\n「兄弟！你是不是来找工作的？我这边今天爆仓了，缺人分拣和配送，日结¥200，干到晚上八点，管一顿饭！会骑电动车就行！」\n\n他指了指旁边的电动车：「不会骑也没事，我让人带你跑一单试试。」",
    // [自洽新增] conditions：在商业区 + day≥15 + 未结识阿黄
    conditions: function (st) {
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        (curLoc === "commercialDist" || curLoc === "techPark") &&
        (!st.relationships ||
          !st.relationships.brother_huang ||
          !st.relationships.brother_huang.met)
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🏃 干！今天就开始",
        hint: "日结¥200，结识阿黄",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.brother_huang) {
            st.relationships.brother_huang = { affinity: 0, met: true };
          }
          st.relationships.brother_huang.met = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 10,
          );
          st.resources.cash = (st.resources.cash || 0) + 200;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 200;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          st.flags._brotherHuangMetDay = st.player.day;
          StateManager.addMessage(
            "📦 你换上工服开始分拣包裹，干到晚上八点腰酸背痛。但¥200到手，阿黄拍拍你的肩说「明天继续来！」结识阿黄（快递站长），好感+10。",
            "success",
          );
        },
      },
      {
        text: "📱 加个微信，改天来",
        hint: "结识阿黄，好感+5",
        apply: function (st) {
          if (!st.relationships) st.relationships = {};
          if (!st.relationships.brother_huang) {
            st.relationships.brother_huang = { affinity: 0, met: true };
          }
          st.relationships.brother_huang.met = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 5,
          );
          st.flags._brotherHuangMetDay = st.player.day;
          StateManager.addMessage(
            "📱 你加了阿黄微信。他说「缺人手的时候我给你发消息」。结识阿黄，好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54b NPC链式后续事件（吴姐回访/阿黄内部消息）======

  // ----- 事件59：吴姐的美容展代班机会（相遇4天后）-----
  // 设计意图：让吴姐的相识不止于名片交换，产生实际工作机会
  RANDOM_EVENTS.push({
    id: "npc_sister_wu_followup",
    _isChainEvent: false,
    phase: "street",
    icon: "💄",
    title: "吴姐的邀请",
    story:
      "手机响了，是上次在美容院遇到的吴姐打来的：\n\n「喂，小XX吗？我这边周末有个美容展，我店里忙不过来，想请你来帮忙站台发传单和引导客人。一天¥180，管午饭，你要是能来我教你点美容知识。来不来？」\n\n旁边传来美容院仪器的嗡嗡声，听起来确实忙。",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_wu;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        !st.flags._sisterWuFollowupSeen &&
        st.player.day >= (st.flags._sisterWuMetDay || 0) + 4
      );
    },
    probability: 0.5, // 条件精确触发
    repeatable: false,
    choices: [
      {
        text: "✅ 去！发传单我也会",
        hint: "日薪¥180，结识展会人脉",
        apply: function (st) {
          st.flags._sisterWuFollowupSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 180;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 180;
          addDailyTransaction(st, "income", "temp_job", 180, "吴姐美容展代班");
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 12);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 8,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "💄 你在美容展站了一天，发了几百张传单。吴姐教你认了几种美容仪器，还介绍了个客户给你认识。日薪¥180到账，名气+3，吴姐好感+8。",
            "success",
          );
        },
      },
      {
        text: "🙅 周末有安排了，下次吧",
        hint: "婉拒，好感不减",
        apply: function (st) {
          st.flags._sisterWuFollowupSeen = true;
          st.relationships.sister_wu.affinity = Math.min(
            100,
            (st.relationships.sister_wu.affinity || 0) + 2,
          );
          StateManager.addMessage(
            "🙅 你说周末有事去不了。吴姐说「没关系，下次有机会再叫你」。好感+2。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件60：阿黄的内部派件消息（结识3天后）-----
  // 设计意图：阿黄给玩家提供内部消息，建立信任关系
  RANDOM_EVENTS.push({
    id: "npc_brother_huang_followup",
    _isChainEvent: false,
    phase: "street",
    icon: "📬",
    title: "阿黄的内部消息",
    story:
      "阿黄突然给你发了条微信：「兄弟，跟你透个底——下个月平台要调整配送费规则，听说单价会涨，但考核更严了。趁现在还没变，多跑几单把数据做漂亮，到时候你评级高，单价涨得更多。」\n\n这个信息说明阿黄是真的把你当自己人了。",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.brother_huang;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        (rel.affinity || 0) >= 5 &&
        !st.flags._brotherHuangTipSeen &&
        st.player.day >= (st.flags._brotherHuangMetDay || 0) + 3
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "👍 谢谢黄哥！这几天多跑几单",
        hint: "未来配送收入+15%",
        apply: function (st) {
          st.flags._brotherHuangTipSeen = true;
          st.flags._huangDeliveryBonus = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 8,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 2,
          );
          StateManager.addMessage(
            "👍 你回了个「收到」，然后这几天每天多跑了几单。月底一看评级果然上去了，配送单价+15%。阿黄好感+8，智力+2。",
            "success",
          );
        },
      },
      {
        text: "📝 记下来了，改天请你吃饭",
        hint: "好感+5，信息已收到",
        apply: function (st) {
          st.flags._brotherHuangTipSeen = true;
          st.relationships.brother_huang.affinity = Math.min(
            100,
            (st.relationships.brother_huang.affinity || 0) + 5,
          );
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 10) + 1,
          );
          StateManager.addMessage(
            "📝 你把这事记在心里。阿黄说「好，记着你欠我一顿饭」。好感+5，智力+1。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件61：老陈的内部消息（结识5天后）-----
  // 设计意图：老陈给玩家透露银行招聘信息，建立长期人脉价值
  RANDOM_EVENTS.push({
    id: "npc_uncle_chen_followup",
    phase: "street",
    icon: "🏦",
    title: "老陈的消息",
    story:
      "你路过银行时，老陈冲你招了招手，压低声音说：\n\n「我听说下个月分行要招两个大堂助理，工资¥3500起步，五险一金齐全。我看你人实在，要是感兴趣我帮你递份简历进去。」\n\n他拍了拍你的肩膀：「这机会难得，内部招聘，外面不挂网。」",
    conditions: function (st) {
      var rel = st.relationships && st.relationships.uncle_chen_bank;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        (rel.affinity || 0) >= 5 &&
        !st.flags._uncleChenFollowupSeen &&
        st.player.day >= (st.flags._uncleChenMetDay || 0) + 5
      );
    },
    probability: 0.5,
    repeatable: false,
    choices: [
      {
        text: "📋 太谢谢了！我准备简历",
        hint: "未来银行职位候选资格",
        apply: function (st) {
          st.flags._uncleChenFollowupSeen = true;
          st.flags._chenBankJobLead = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 10,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📋 老陈摆摆手：「简历给我就行，我帮你递到人事科。能不能成看你自己了，但至少能进面试。」老陈好感+10，心情+8，名气+3。",
            "success",
          );
        },
      },
      {
        text: "🙏 谢谢陈叔，我暂时还不考虑",
        hint: "婉拒，好感+5",
        apply: function (st) {
          st.flags._uncleChenFollowupSeen = true;
          st.relationships.uncle_chen_bank.affinity = Math.min(
            100,
            (st.relationships.uncle_chen_bank.affinity || 0) + 5,
          );
          StateManager.addMessage(
            "🙏 老陈点点头：「行，那等你想来了跟我说一声就行。」老陈好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件62：下雪天的温暖（snowy 天气事件）-----
  // 设计意图：填补 snowy 天气的零事件覆盖，让每种天气都有对应的叙事回响
  RANDOM_EVENTS.push({
    id: "snowy_day_warmth",
    phase: "street",
    icon: "❄️",
    title: "下雪了",
    story:
      "窗外飘起了雪花，街上行人匆匆。你呼出一口白气，看着雪花落在手心里融化。\n\n街角卖红薯的大爷今天早早就收摊了，他走之前冲你喊了一声：\n\n「小伙子，天冷别在外面晃了，早点回去吧！」",
    // [自洽新增] conditions：下雪天气 + day≥5
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.weather &&
        st.weather.current === "snowy" &&
        st.player.day >= 5 &&
        !st.flags._snowyDaySeen
      );
    },
    probability: 0.08,
    repeatable: false,
    choices: [
      {
        text: "🍠 买个烤红薯暖暖手（¥10）",
        hint: "心情+8，饥饱+10",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          if ((st.resources.cash || 0) >= 10) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 10);
          }
          st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 10);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🍠 红薯又甜又烫，捂在手里整个人都暖和了。心情+8，饥饱+10。",
            "success",
          );
        },
      },
      {
        text: "📸 拍张雪景发朋友圈",
        hint: "名气+3，记录这一刻",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📸 你拍了张雪景发到朋友圈。老家的朋友留言说「真好看」，城里的朋友说「冻死了」。名气+3，心情+5。",
            "info",
          );
        },
      },
      {
        text: "🏃 趁人少赶紧出门干活",
        hint: "体力活收入稍高，耗更多体力",
        apply: function (st) {
          st.flags._snowyDaySeen = true;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "🏃 你裹紧外套出了门。雪天路上人少，但活还是要干。疲劳+5，心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // ----- 事件63：大风天的意外收获（windy 天气事件）-----
  // 设计意图：填补 windy 天气的零事件覆盖，完成全部天气类型的叙事闭环
  RANDOM_EVENTS.push({
    id: "windy_day_finding",
    phase: "street",
    icon: "🌬️",
    title: "大风天",
    story:
      "今天风特别大，街上的塑料袋和纸屑在空中乱飞。你眯着眼睛走在路上，突然看到一张废纸被吹到脚边——上面印着什么。\n\n捡起来一看，是一张被风吹散的招聘传单，地址就在附近。风太大，你差点没抓住它。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.weather &&
        st.weather.current === "windy" &&
        st.player.day >= 3 &&
        !st.flags._windyDaySeen
      );
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "📋 看看传单上的招聘信息",
        hint: "可能发现工作机会",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.flags._windyJobLead = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if ((st.resources.cash || 0) < 500) {
            st.resources.cash = (st.resources.cash || 0) + 50;
            addDailyTransaction(
              st,
              "income",
              "job_income",
              50,
              "大风天的意外发现",
            );
          }
          StateManager.addMessage(
            "🌬️ 传单上写着附近一家餐馆招杂工，工资日结。你拍了张照记下地址。心情+5。也许这阵风是来给你送机会的。",
            "success",
          );
        },
      },
      {
        text: "🏃 赶紧找个地方躲风",
        hint: "保护健康",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🏃 你躲进一家便利店避风。买了瓶热饮，隔着玻璃看外面的落叶被吹得打转。疲劳-5，心情+3。",
            "info",
          );
        },
      },
      {
        text: "😤 顶着风继续干活",
        hint: "收入略低但坚持",
        apply: function (st) {
          st.flags._windyDaySeen = true;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😤 你裹紧了外套继续干活。风大到有时候站不稳，但今天不能白过。疲劳+8，心情-3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.53: 休眠NPC激活事件 — 王医生/赵师傅（填补0事件空白） ======

  // === 事件1：dr_wang — 医院的超出诊疗费帮扶 ===
  // 【设计意图】王医生是医院NPC但零事件。让他在玩家健康垂危时提供医疗帮扶
  RANDOM_EVENTS.push({
    id: "dr_wang_free_clinic",
    phase: "street",
    icon: "🩺",
    title: "王医生的免费门诊",
    story:
      "你到医院做检查，发现挂号窗口前排着长队。" +
      "正在这时，一个穿白大褂的中年医生推门出来看到你：「脸色不太好，进来我看看。」\n" +
      "他把你领进诊室，仔细问了你的症状，眉头皱了皱：" +
      "「你是不是很久没吃过像样的饭了？肝火旺，脾胃虚。」",
    conditions: function (st) {
      // [自洽修复] st.needs.health 不存在（state.needs 无 health 字段），改为 st.status.health
      var health = st.status ? st.status.health || 100 : 100;
      var fatigue = st.needs ? st.needs.fatigue || 0 : 0;
      return st.player && st.player.day > 10 && health < 60 && fatigue > 40;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🙏 谢谢医生，听您的建议",
        hint: "健康+10，开便宜药",
        apply: function (st) {
          // [自洽修复] st.needs.health → st.status.health
          var health = st.status.health || 50;
          st.status.health = Math.min(100, health + 10);
          if ((st.resources.cash || 0) >= 30) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
            // 温和消炎+调理，健康再加5
            st.status.health = Math.min(100, (st.status.health || 50) + 5);
            addDailyTransaction(
              st,
              "expense",
              "medical",
              30,
              "王医生开的便宜药",
            );
          }
          // 建立王医生关系
          if (!st.relationships.dr_wang)
            st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.affinity = Math.min(
            100,
            (st.relationships.dr_wang.affinity || 0) + 5,
          );
          st.relationships.dr_wang.met = true;
          StateManager.addMessage(
            "🩺 王医生给你开了¥30的药，叮嘱你注意饮食规律。健康+15。医者仁心。",
            "success",
          );
        },
      },
      {
        text: "😅 我没事，就是没钱看病",
        hint: "只说实情，好感+3",
        apply: function (st) {
          if (!st.relationships.dr_wang)
            st.relationships.dr_wang = { affinity: 0, met: true };
          st.relationships.dr_wang.affinity = Math.min(
            100,
            (st.relationships.dr_wang.affinity || 0) + 3,
          );
          st.relationships.dr_wang.met = true;
          st.status.health = Math.min(100, (st.status.health || 50) + 3);
          StateManager.addMessage(
            "😅 王医生笑了笑：「没钱更要保重身体，生病更烧钱。」\n他给你倒了杯热水，「免费热水总能喝。」健康+3。",
            "info",
          );
        },
      },
    ],
  });

  // === 事件2：master_zhao — 工厂区修车铺的招工 ===
  // 【设计意图】赵师傅是工厂区修车铺但零事件。让有修理技能的玩家获得工作线索
  RANDOM_EVENTS.push({
    id: "master_zhao_tool_help",
    phase: "street",
    icon: "🔧",
    title: "赵师傅的维修摊",
    story:
      "路过工厂区修车铺时，你看见一个满手油污的中年师傅正在对着一台发动机发愁。" +
      "他抬头看见你：「小伙子/姑娘，你会不会修车？这发动机异响，我耳朵不行了听不出来。」\n" +
      "铺子门口摆着几辆修了一半的电动车，地上散落着扳手和螺丝。",
    conditions: function (st) {
      // [自洽修复] conditions 新增 repair.skill 检查，赵师傅是修车铺老板
      return (
        st.player &&
        st.player.day > 15 &&
        st.skills &&
        st.skills.repair &&
        st.skills.repair.level >= 5
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🔧 我来听听——好像是轴承问题",
        hint: "修理≥20效果最佳",
        apply: function (st) {
          if (!st.relationships.master_zhao)
            st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.affinity = Math.min(
            100,
            (st.relationships.master_zhao.affinity || 0) + 8,
          );
          st.relationships.master_zhao.met = true;
          var repairLevel = st.skills.repair ? st.skills.repair.level || 0 : 0;
          if (repairLevel >= 20) {
            st.resources.cash = (st.resources.cash || 0) + 80;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + 80;
            addDailyTransaction(
              st,
              "income",
              "repair_help",
              80,
              "赵师傅修车帮工",
            );
            if (st.skills.repair)
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 40;
            StateManager.addMessage(
              "🔧 你听出发动机异响来自左轴承。赵师傅一拍大腿：「对上了！」\n他塞给你¥80，说以后有空来帮忙。好感+8，修理经验+40。",
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (st.skills.repair)
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
            StateManager.addMessage(
              "🔧 你不太确定是哪里的问题，但赵师傅说你愿意帮忙的心意不错。\n他简单教了你几个听异响的技巧。好感+8，修理经验+15。",
              "info",
            );
          }
        },
      },
      {
        text: "🔩 帮您递工具打下手",
        hint: "修理XP+15",
        apply: function (st) {
          if (!st.relationships.master_zhao)
            st.relationships.master_zhao = { affinity: 0, met: true };
          st.relationships.master_zhao.affinity = Math.min(
            100,
            (st.relationships.master_zhao.affinity || 0) + 5,
          );
          st.relationships.master_zhao.met = true;
          if (st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 15;
          StateManager.addMessage(
            "🔩 你帮赵师傅递工具、扶发动机，虽然没直接上手修，但也学到了不少。\n修理经验+15。赵师傅说：「下次有空再来！」",
            "info",
          );
        },
      },
      {
        text: "🙅 不好意思，我赶时间",
        hint: "无变化",
        apply: function (st) {
          StateManager.addMessage(
            "🙅 赵师傅摆摆手：「没事，我自己再研究研究。」\n你继续赶路，心里想着下次有空再帮忙。",
            "info",
          );
        },
      },
    ],
  });

  // === 事件3：xiaoli — 科技园网红的内容合作邀请 ===
  // 【设计意图】小丽是科技园网红但事件引用为0。连接fame+名气系统+sideHustle
  RANDOM_EVENTS.push({
    id: "xiaoli_content_collab",
    phase: "street",
    icon: "📱",
    title: "小丽的合作邀请",
    story:
      "小丽急匆匆跑来找你：「救命！我接了个品牌合作，今天要拍一条探店视频。" +
      "但我一个人搞不定——需要个人帮忙举打光灯和提词！」\n" +
      "她递给你一台便携补光灯：「就两小时，完事请你吃饭！」",
    conditions: function (st) {
      // 小丽NPC已触发过或玩家fame≥5有一定社交影响力
      return (
        st.player &&
        st.player.day > 20 &&
        ((st.player.fame || 0) >= 5 ||
          (st.skills && st.skills.sales && st.skills.sales.level >= 10))
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "📱 帮你拍！我正好有空",
        hint: "收入+名气+社交",
        apply: function (st) {
          if (!st.relationships.xiaoli)
            st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.affinity = Math.min(
            100,
            (st.relationships.xiaoli.affinity || 0) + 8,
          );
          st.relationships.xiaoli.met = true;
          var pay = Random.int(60, 120);
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + pay;
          addDailyTransaction(
            st,
            "income",
            "content_collab",
            pay,
            "小丽拍摄帮工",
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📱 你帮小丽举了两小时补光灯，视频拍得很顺利。\n小丽请你吃了碗牛肉面，还把你介绍给她的粉丝群。收入¥" +
              pay +
              "，声望+3。",
            "success",
          );
        },
      },
      {
        text: "💡 我帮你联系专业摄影师",
        hint: "好感+5",
        apply: function (st) {
          if (!st.relationships.xiaoli)
            st.relationships.xiaoli = { affinity: 0, met: true };
          st.relationships.xiaoli.affinity = Math.min(
            100,
            (st.relationships.xiaoli.affinity || 0) + 5,
          );
          st.relationships.xiaoli.met = true;
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;
          }
          StateManager.addMessage(
            "💡 你帮小丽联系到业余摄影爱好者群里的一个人。\n小丽感激地说「谢啦！下次请你喝奶茶！」好感+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：连续工作社区认可 ======
  // 【设计意图】填补工作连击系统（v3.25）的叙事空白——50天连续工作应产生叙事回响
  RANDOM_EVENTS.push({
    id: "work_streak_community_recognition",
    phase: "street",
    icon: "🏅",
    title: "老面孔",
    story:
      "你回过头想想，已经连续在这座城市里忙了快两个月没断过。" +
      "早餐摊大姐往你碗里多加了勺肉：「天天看你准时来，比闹钟还准。」" +
      "旁边的大爷接话：「年轻人能吃苦，这城里就有你一口饭。」" +
      "你不知道该说什么，低头扒完了那碗面。",
    conditions: function (st) {
      var streaks = st.flags && st.flags._jobStreaks;
      var maxStreak = 0;
      if (streaks) {
        for (var k in streaks) {
          var rec = streaks[k];
          var c =
            rec && typeof rec === "object"
              ? rec.count || 0
              : typeof rec === "number"
                ? rec
                : 0;
          if (c > maxStreak) maxStreak = c;
        }
      }
      return (
        st.player.phase === "street" &&
        maxStreak >= 50 &&
        !st.flags._workStreakRecognitionSeen
      );
    },
    probability: 0.1,
    repeatable: false,
    choices: [
      {
        text: "😌 心里一暖——坚持是值得的",
        hint: "心情+12，心智+3",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🏅 你吃完那碗面，觉得今天的活格外有劲。心情+12，心智+3。这座城市开始认识你了。",
            "success",
          );
        },
      },
      {
        text: "💪 这才哪到哪，我还要往上走",
        hint: "心智+5，激励",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "💪 你谢过大姐，心里默默定了个小目标。心智+5，名气+3。这座城市会记住你的名字的。",
            "success",
          );
        },
      },
      {
        text: "😐 习惯了，没什么特别的",
        hint: "适应也是一种成长",
        apply: function (st) {
          st.flags._workStreakRecognitionSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 2);
          StateManager.addMessage(
            "😐 你摆摆手，照常吃完去干活。适应意味着成长——你已经在不知不觉中变强了。心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：技能组合精通 ======
  // 【设计意图】填补多技能协同的叙事空白——修理+电工都≥20级的玩家应获得"双料师傅"认可
  RANDOM_EVENTS.push({
    id: "skill_mastery_side_opportunity",
    phase: "street",
    icon: "⚡",
    title: "双料师傅",
    story:
      "你在工厂区帮人修好了一台机器，旁边一个设备商老板看了全程。" +
      "他递了根烟：「小伙子，你不仅会修，还懂电路——这种双料师傅我们正缺。」" +
      "他掏出名片：「我们有个小区水电维护的兼职，月结¥1200，每周去两次就够。有空来试试？」",
    conditions: function (st) {
      var rep = st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
      var elec =
        st.skills && st.skills.electrician
          ? st.skills.electrician.level || 0
          : 0;
      return (
        st.player.phase === "street" &&
        rep >= 20 &&
        elec >= 20 &&
        st.player.day >= 40 &&
        !st.flags._skillMasteryOppSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "✅ 接下兼职！技多不压身",
        hint: "月入¥1200固定副业",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          st.flags._skillMasterySideJob = true;
          if (!st.sideHustle) st.sideHustle = {};
          st.sideHustle.type = "freelance";
          st.resources.cash = (st.resources.cash || 0) + 600;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 600;
          if (st.skills.repair)
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 30;
          if (st.skills.electrician)
            st.skills.electrician.xp = (st.skills.electrician.xp || 0) + 30;
          StateManager.addMessage(
            "⚡ 你接了小区水电维护的活。双料师傅走到哪里都有人要，预付¥600到手！修理和电工经验各+30。",
            "success",
          );
        },
      },
      {
        text: "🤔 先留下名片，考虑考虑",
        hint: "保留机会",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          st.flags._skillMasteryKeptCard = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "⚡ 你收好名片。双料师傅不愁没活干——你知道自己值什么价。心智+3。",
            "info",
          );
        },
      },
      {
        text: "🙏 婉拒了，我现在够忙了",
        hint: "专注现有工作",
        apply: function (st) {
          st.flags._skillMasteryOppSeen = true;
          StateManager.addMessage(
            "🙏 你谢过老板，说现在手上的活已经够忙了。他点头：「有技术的人，什么时候想干都行。」",
            "info",
          );
        },
      },
    ],
  });

  // ====== v3.54 新增：住房升级里程碑叙事 ======
  // 【设计意图】填补住所升级的叙事空白——从露宿→合租或合租→单间应有情感回响
  RANDOM_EVENTS.push({
    id: "housing_tier_milestone_reflection",
    phase: "street",
    icon: "🏠",
    title: "一扇属于自己的门",
    story:
      "搬进新住处好几天了，你才真正有时间打量这间屋子。" +
      "墙上有上一任租客留下的贴纸，窗外能看到街道。" +
      "最重要的是——这扇门可以从里面锁上。" +
      "你坐在床沿上，突然意识到自己在这座城市里，终于有了一小块属于自己的地方。",
    conditions: function (st) {
      var tier = st.housing && st.housing.tier;
      return (
        st.player.phase === "street" &&
        tier >= 2 &&
        st.player.day >= 20 &&
        !st.flags._housingMilestoneSeen
      );
    },
    probability: 0.15,
    repeatable: false,
    choices: [
      {
        text: "🏠 给家里打个电话报平安",
        hint: "心情+15，家庭关系+",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🏠 电话那头，妈妈说「找个稳定的住处就好，别太亏待自己」。心情+15，心智+5。不管走多远，家永远是后盾。",
            "success",
          );
        },
      },
      {
        text: "📝 拍张照发朋友圈",
        hint: "记录这一刻",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "📝 你拍了张窗外的街景发出去。老家的朋友点了赞，城里的工友调侃你「混好了」。心情+8，名气+2。",
            "success",
          );
        },
      },
      {
        text: "😶 没什么了不起的，继续赶路",
        hint: "不骄不躁，心智+",
        apply: function (st) {
          st.flags._housingMilestoneSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 0) + 4);
          StateManager.addMessage(
            "😶 你收起感概，把钥匙挂好。这才哪到哪——你要的远不止一个单间。心智+4。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 联动事件恢复（v3.59/v3.60 自洽审计 + 联动事件，从重构中还原）======
  RANDOM_EVENTS.push({
    id: "morality_wallet_honest",
    phase: "street",
    icon: "👛",
    title: "捡到钱包",
    story:
      "你在巷口捡到一个钱包，里面夹着¥800现金和一张写满字迹的身份证。\n" +
      "失主大概急疯了——你摸出手机，犹豫了一瞬。",
    // conditions：高道德玩家（人设分叉·诚信侧），与 low 侧互斥
    conditions: function (st) {
      // 检查玩家道德值是否达到诚信门槛
      var m = st.player && st.player.morality;
      return typeof m === "number" && m >= 70;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "📞 按身份证地址找失主",
        hint: "道德+，声望+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "📞 你辗转联系上失主，是个外地打工的姑娘。她红着眼眶要塞给你¥100谢礼，你没收。道德+5，声望+4。",
            "success",
          );
        },
      },
      {
        text: "🏢 交到派出所",
        hint: "稳妥，道德+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage(
            "🏢 你把钱包交到辖区派出所，民警登记时多看了你一眼：「现在这样的人不多了。」道德+3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_wallet_keep",
    phase: "street",
    icon: "💰",
    title: "捡到钱包",
    story:
      "你在巷口捡到一个钱包，里面夹着¥800现金和一张身份证。\n" +
      "四下无人——这钱够你撑过这个月了。你心跳加快，手指攥紧了皮夹。",
    // conditions：低道德玩家（人设分叉·利己侧），与 high 侧互斥
    conditions: function (st) {
      // 检查玩家道德值是否跌破利己门槛
      var m = st.player && st.player.morality;
      return typeof m === "number" && m <= 30;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "😏 现金拿走，证件扔了",
        hint: "现金+，道德-",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 800;
          st.resources.totalEarned += 800;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 8);
          StateManager.addMessage(
            "😏 你抽走¥800，把空钱包连同身份证扔进垃圾桶。当晚睡得不太踏实。现金+¥800，道德-8。",
            "warning",
          );
        },
      },
      {
        text: "🤔 留着，但有点不安",
        hint: "折中，道德微-",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 800;
          st.resources.totalEarned += 800;
          st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
          StateManager.addMessage(
            "🤔 你留下了钱，却总想起那张身份证。现金+¥800，但心里堵得慌，心情-5，道德-3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "hunger_streak_neighbor_meal",
    phase: "street",
    icon: "🍚",
    title: "邻居的一碗饭",
    story:
      "你连着几天没正经吃过饭，在路边蹲着时眼前一阵发黑。\n" +
      "卖煎饼的摊主老姐头探出头：「小伙子，看你脸色不对，这俩煎饼叔请了。」",
    // conditions：低饥饿连续天数达到爆发阈值（flags._habits.lowHungerStreak）
    conditions: function (st) {
      // 检查连续饥饿天数是否≥3
      var streak =
        st.flags && st.flags._habits && st.flags._habits.lowHungerStreak;
      return (streak || 0) >= 3 && st.player.phase === "street";
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🍚 接过煎饼，道谢",
        hint: "饱食+，心情+",
        apply: function (st) {
          st.needs.hunger = Math.min(100, (st.needs.hunger || 0) + 40);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "🍚 你接过还烫手的煎饼，狼吞虎咽。一股暖意从胃里升起来。饱食+40，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🙅 倔强推辞",
        hint: "自尊，但更虚",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 5);
          StateManager.addMessage(
            "🙅 你逞强推了，转身却腿一软。有些尊严，是空肚子撑不起的。心情+3，疲劳+5。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "coding_scam_spot",
    phase: "street",
    icon: "💻",
    title: "刷单短信",
    story:
      "手机弹出一条短信：「亲，刷单返利轻松日入500，加微信xxx领任务」。\n" +
      "你扫了一眼那个仿冒得拙劣的链接结构——跳转域名、伪造备案号——立刻断定是钓鱼。",
    // conditions：编程技能达到专业视角门槛（能识别骗局）
    conditions: function (st) {
      // 检查 coding 技能等级是否解锁「识骗」视角
      var lvl = st.skills && st.skills.coding && st.skills.coding.level;
      return (lvl || 0) >= 40;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🚫 举报并拉黑",
        hint: "道德+，技能+",
        apply: function (st) {
          st.player.morality = Math.min(100, (st.player.morality || 50) + 4);
          if (st.skills && st.skills.coding) {
            st.skills.coding.xp = (st.skills.coding.xp || 0) + 20;
          }
          StateManager.addMessage(
            "🚫 你顺手把号码举报到反诈平台，顺带给家里群发了提醒。技能+20xp，道德+4。",
            "success",
          );
        },
      },
      {
        text: "🕵️ 反向试探骗子",
        hint: "冒险，可能反被坑",
        apply: function (st) {
          if (Random.chance(0.5)) {
            st.resources.cash = (st.resources.cash || 0) + 100;
            if (st.skills && st.skills.coding) {
              st.skills.coding.xp = (st.skills.coding.xp || 0) + 30;
            }
            StateManager.addMessage(
              "🕵️ 你用脚本反查到骗子服务器漏洞，顺手薅了¥100「学费」。技能+30xp，现金+¥100。",
              "event",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🕵️ 你刚试探两下就被对方拉黑，还差点中了木马。没赚到，反而后怕。心情-5。",
              "warning",
            );
          }
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "xiaoli_brand_deal",
    phase: "street",
    icon: "🤝",
    title: "小丽的品牌单",
    story:
      "小丽发来语音：「有个国货护肤品牌找长期代运营，我推荐了你。\n" +
      "他们要的不只是剪辑，是懂内容的人。报酬按月¥3000-5000，你接不接？」",
    // conditions：已结识小丽且好感达到深度合作门槛（联动 relationships 系统）
    conditions: function (st) {
      // 检查是否已结识小丽且好感≥60
      var rel = st.relationships && st.relationships.xiaoli;
      return !!(rel && rel.met && (rel.affinity || 0) >= 60);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "✅ 接下长期代运营",
        hint: "稳定月入+声望",
        apply: function (st) {
          st.flags._xiaoliBrandDeal = true;
          var pay = Random.int(3000, 5000);
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.resources.totalEarned += pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          if (st.relationships.xiaoli) {
            st.relationships.xiaoli.affinity = Math.min(
              100,
              st.relationships.xiaoli.affinity + 5,
            );
          }
          StateManager.addMessage(
            "✅ 你和品牌签了月框。第一笔¥" +
              pay +
              "到账，小丽在群里@你：「靠谱！」声望+6，好感+5。",
            "success",
          );
        },
      },
      {
        text: "🤝 先接一单试试",
        hint: "低风险试探",
        apply: function (st) {
          st.flags._xiaoliBrandTrial = true;
          var pay2 = Random.int(800, 1500);
          st.resources.cash = (st.resources.cash || 0) + pay2;
          st.resources.totalEarned += pay2;
          StateManager.addMessage(
            "🤝 你接了试单，交付后品牌方挺满意。先赚¥" + pay2 + "，看看后续。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "bank_vip_treatment",
    phase: "street",
    icon: "🏦",
    title: "VIP客户室",
    story:
      "你走进银行办业务，大堂经理看了一眼你的叫号单，忽然压低声音：\n" +
      "「先生/女士，您在我们行的日均存款已超过¥5000，可以进VIP室办理。」\n" +
      "你被请进一间有沙发和饮水机的小房间。客户经理递上一张名片：\n" +
      "「我们有一款新出的VIP理财，年化4.2%，额度有限。另外您的信用记录可以申请¥30,000以内的消费贷，利率优惠。」",
    conditions: function (st) {
      // 在银行且存款≥5000（达标VIP门槛）
      var bankBalance = st.resources && st.resources.bankBalance;
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 20 &&
        (bankBalance || 0) >= 5000 &&
        !st.flags._bankVipSeen
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💰 买¥5000理财（年化4.2%）",
        hint: "30天后增值，中风险",
        cost: 5000,
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.flags._bankVipInvested = true;
          st.flags._bankVipDay = st.player.day;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 5000);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          StateManager.addMessage(
            "💰 你买了¥5000的VIP理财，30天后本息共计¥5210到账。\n" +
              "客户经理笑着说：「有眼光。」心情+5。",
            "success",
          );
        },
      },
      {
        text: "📋 了解一下贷款额度",
        hint: "信用记录+，了解贷款条件",
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.flags._bankVipLoanKnown = true;
          st.player.mental = Math.min(100, (st.player.mental || 20) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "📋 客户经理详细解释了贷款条件：¥30,000以内，月息0.45%，随借随还。\n" +
              "你心里有底了——缺钱的时候知道该找谁。心智+2，心情+3。",
            "info",
          );
        },
      },
      {
        text: "🚶 存钱只是为了安全，不搞这些",
        hint: "保守，但心里踏实",
        apply: function (st) {
          st.flags._bankVipSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "🚶 你谢过经理，在普通窗口办完业务就走了。\n" +
              "VIP室里的沙发确实舒服——但你知道，真正的安全感来自于卡里的数字，而不是理财产品的承诺。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "regular_customer_discount",
    phase: "street",
    icon: "🛒",
    title: "老主顾的优待",
    story:
      "你走进那家经常光顾的小店，老板抬头看见你，熟稔地招呼：\n" +
      "「又来啦？今天新到了一批好货，我给你留着呢。」\n" +
      "他压低声音：「其他人我卖¥15，你给¥10就行——老主顾了。」\n" +
      "你经常来这儿买东西，老板都认得你了。",
    conditions: function (st) {
      // 检查 trade 行动频次是否≥10（在任何地点累计购买）
      var freq = st.stats && st.stats.actionFreq;
      var totalTrade = 0;
      if (freq) {
        for (var k in freq) {
          // 累加所有交易类行动（buy/start_business/food_stall等）
          if (k.indexOf("buy") >= 0 || k.indexOf("trade") >= 0) {
            totalTrade += freq[k] || 0;
          }
        }
      }
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        totalTrade >= 10 &&
        !st.flags._regularDiscountSeen
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "👍 谢了老板！那我多买点",
        hint: "打折购物，好感+",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 10;
          }
          StateManager.addMessage(
            "👍 你多挑了几样东西，老板果然按¥10算了。\n" +
              "走的时候他还塞了一把葱：「拿回去下面吃！」声望+2，心情+8，销售经验+10。",
            "success",
          );
        },
      },
      {
        text: "🙏 老板记着账，月底一起结",
        hint: "赊账，月底自动扣",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.flags._regularCredit = true;
          st.flags._regularCreditDay = st.player.day;
          StateManager.addMessage(
            "🙏 老板爽快答应：「行，月底再说。你常来，我信得过。」\n" +
              "在这座城市，能被一个人信任的感觉真好。",
            "info",
          );
        },
      },
      {
        text: "😊 跟老板聊几句再走",
        hint: "好感+，可能获得情报",
        apply: function (st) {
          st.flags._regularDiscountSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 1);
          if (Random.chance(0.3)) {
            st.flags._regularShopTip = true;
            StateManager.addMessage(
              "😊 你跟老板聊了会儿天，他无意中透露：「听说对面那条街要开夜市了，\n" +
                "摊位费前三个月免费。」这可能是个机会！心情+5，心智+1。",
              "event",
            );
          } else {
            StateManager.addMessage(
              "😊 你跟老板聊了会儿天，才知道他也是外地来的，在这条街干了八年。\n" +
                "他说：「这城市啊，待久了就是家了。」心情+5。",
              "info",
            );
          }
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "skill_synergy_restaurant_offer",
    phase: "street",
    icon: "🍳",
    title: "老板想合伙",
    story:
      "你常去的那家小炒店里，老板老黄端着两杯茶坐下来。\n" +
      "「我观察你很久了——你懂吃，又会跟客人聊天。我这家店生意一直不错，但一个人撑太累了。」\n" +
      "他压低声音：「我在对面街看中一个铺面，想开分店。你出手艺+管店，我出钱+供应链，五五分。」",
    conditions: function (st) {
      // 烹饪≥20 且 销售≥10 → 双重门槛协同
      var cooking = st.skills && st.skills.cooking && st.skills.cooking.level;
      var sales = st.skills && st.skills.sales && st.skills.sales.level;
      return (
        st.player &&
        st.player.phase === "street" &&
        st.player.day >= 30 &&
        (cooking || 0) >= 20 &&
        (sales || 0) >= 10 &&
        !st.flags._skillSynergyRestaurantSeen
      );
    },
    probability: 0.015,
    repeatable: false,
    choices: [
      {
        text: "🤝 接受合伙！我来管店",
        hint: "获得稳定分红+技能成长",
        apply: function (st) {
          st.flags._skillSynergyRestaurantSeen = true;
          st.flags._restaurantPartner = true;
          var invest = 3000;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - invest);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 5);
          // 烹饪和销售技能同步成长
          if (st.skills && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 40;
          }
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 30;
          }
          StateManager.addMessage(
            "🤝 你出了¥" +
              invest +
              "当押金，正式成为合伙人。\n" +
              "老黄拍着你肩膀：「我看人不会错。」声望+8，心智+5，烹饪经验+40，销售经验+30。",
            "success",
          );
        },
      },
      {
        text: "😅 我经验还不够，怕拖累你",
        hint: "婉拒，技能仍获认可",
        apply: function (st) {
          st.flags._skillSynergyRestaurantSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
          if (st.skills && st.skills.cooking) {
            st.skills.cooking.xp = (st.skills.cooking.xp || 0) + 15;
          }
          StateManager.addMessage(
            "😅 你诚实地说自己还欠火候。老黄点点头：「有自知之明的人，迟早能成事。」\n烹饪经验+15，心情+8，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 工业区事件 ======
  RANDOM_EVENTS.push({
    id: "factory_night_shift_offer",
    phase: "street",
    icon: "🏭",
    title: "夜班加急单",
    story:
      "工业区的一家电子厂接了个大单，工头在路边招临时夜班工。「一晚¥300，干到天亮，明天休息——但今晚不能走神，出了次品扣钱。」你远远看到厂里灯火通明，流水线已经开动了。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "factoryZone" &&
        st.player.day >= 5 &&
        !st.flags._factoryNightShiftSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "💪 接下夜班",
        hint: "¥300，但疲劳+20",
        apply: function (st) {
          st.flags._factoryNightShiftSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 300;
          st.resources.totalEarned += 300;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          var bonus = Random.chance(0.3);
          if (bonus) {
            st.resources.cash = (st.resources.cash || 0) + 100;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            StateManager.addMessage(
              "🏭 一晚上没出次品，工头多给了¥100奖金！但天亮了，你累得眼皮打架。\n+¥400，疲劳+20。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🏭 熬了一整夜，腰酸背痛，挣了¥300。回家的路上腿都在抖。\n+¥300，疲劳+20，心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "🏃 算了，不冒这个险",
        hint: "保重身体",
        apply: function (st) {
          st.flags._factoryNightShiftSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🏃 你摆摆手走了。身体是革命的本钱，不差这一晚。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 医院事件 ======
  RANDOM_EVENTS.push({
    id: "hospital_cheap_medicine_offer",
    phase: "street",
    icon: "💊",
    title: "药贩子推销",
    story:
      "医院门口，一个穿白大褂的中年男人拦住你，压低声音说：「医院里同款药，外面卖一半价。消炎药、降压药、感冒药——要什么有什么，保证正品。」他掀开手里的塑料袋一角，露出几盒药。你注意到包装上的字有些模糊。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "hospital" &&
        st.player.day >= 10 &&
        !st.flags._hospitalCheapMedicineSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🛒 买几盒备着",
        hint: "¥50，但可能是假药",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          if ((st.resources.cash || 0) >= 50) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50);
            var fake = Random.chance(0.4);
            if (fake) {
              st.flags._boughtFakeMedicine = true;
              st.needs.health = Math.max(0, (st.needs.health || 50) - 5);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
              StateManager.addMessage(
                "💊 回家打开一看，药片颜色不对，闻着有股怪味——假药！\n健康-5，心情-8。¥50打了水漂。",
                "danger",
              );
            } else {
              st.flags._hasCheapMedicine = true;
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 3,
              );
              StateManager.addMessage(
                "💊 药看样子是真的，比医院便宜一半。省了钱，心里踏实了点。\n心情+3。",
                "success",
              );
            }
          } else {
            StateManager.addMessage(
              "💊 翻遍口袋，连¥50都凑不齐。你尴尬地走开了。",
              "warning",
            );
          }
        },
      },
      {
        text: "🚫 不买，举报他",
        hint: "正义感+卫生",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🚫 你瞪了他一眼：「再卖假药我报警了。」他缩了缩脖子，快步溜走了。\n道德+5，心情+5。",
            "success",
          );
        },
      },
      {
        text: "😞 我连¥50都拿不出来",
        hint: "自嘲",
        apply: function (st) {
          st.flags._hospitalCheapMedicineSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "😞 你苦笑了一下，连假药都买不起的感觉，真不好受。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== 娱乐城事件 ======
  RANDOM_EVENTS.push({
    id: "entertainment_talent_scout",
    phase: "street",
    icon: "🎤",
    title: "星探搭讪",
    story:
      "娱乐城三楼KTV走廊里，一个戴着金链子的男人叫住你：「小姑娘/小伙子，形象不错啊！我是天娱传媒的经纪人，最近在找新人拍短视频。签约就有保底¥5000，火了还能分红。要不要试试？」他递过来一张名片，公司名字你从没听说过。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "entertainment" &&
        st.player.day >= 15 &&
        (st.player.charm || 0) >= 30 &&
        !st.flags._entertainmentScoutSeen
      );
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🎭 签了试试",
        hint: "有机会但风险高",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          var success = Random.chance(0.3 + (st.player.charm || 0) * 0.005);
          if (success) {
            st.resources.cash = (st.resources.cash || 0) + 5000;
            st.resources.totalEarned += 5000;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            StateManager.addMessage(
              "🎭 居然真的火了！一条短视频播放量破百万，公司立马给了签约费。\n+¥5000，名气+10，心情+15！",
              "success",
            );
          } else {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
            st.player.mental = Math.max(0, (st.player.mental || 20) - 5);
            StateManager.addMessage(
              "🎭 拍了三条视频，数据惨淡。公司说你不适合，扣了¥500'培训费'。\n-¥500，心情-10，心智-5。果然是个坑。",
              "danger",
            );
          }
        },
      },
      {
        text: "🤔 先加个微信观望",
        hint: "留条后路",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          st.flags._hasScoutContact = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🤔 你加了微信。名片上写着'天娱传媒——让每个人发光'。先看看吧，不急着跳坑。",
            "info",
          );
        },
      },
      {
        text: "🚶 不了，骗子太多",
        hint: "谨慎",
        apply: function (st) {
          st.flags._entertainmentScoutSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 20) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          StateManager.addMessage(
            "🚶 你摆摆手走了。娱乐城里的星探，十个有九个是骗子，不赌这个运气。\n心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 菜市场事件 ======
  RANDOM_EVENTS.push({
    id: "vegetable_market_clearance_deal",
    phase: "street",
    icon: "🥬",
    title: "收摊大甩卖",
    story:
      "菜市场快收摊了，一个菜贩子喊住你：「剩下的菜便宜卖了，这一堆¥20全拿走！都是早上刚到的，放一晚上明天就不新鲜了。」你看了看，一堆菜够吃三四天，但有些叶子已经蔫了。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "vegetable_market" &&
        st.player.day >= 5 &&
        !st.flags._vegeClearanceSeen
      );
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🛍️ 买了！省一笔是一笔",
        hint: "¥20，可能不新鲜",
        apply: function (st) {
          st.flags._vegeClearanceSeen = true;
          if ((st.resources.cash || 0) >= 20) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 20);
            st.needs.hunger = Math.min(100, (st.needs.hunger || 50) + 25);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            var bad = Random.chance(0.25);
            if (bad) {
              st.needs.health = Math.max(0, (st.needs.health || 50) - 3);
              StateManager.addMessage(
                "🥬 回去发现蔫了的叶子不能吃，扔了一半。不过剩下的还算划算。\n饥饿+25，健康-3（吃了不新鲜的），心情+5。",
                "warning",
              );
            } else {
              StateManager.addMessage(
                "🥬 挑拣了一下，大部分都还能吃！够顶三四天了。\n饥饿+25，心情+5。绝对值！",
                "success",
              );
            }
          } else {
            StateManager.addMessage(
              "🥬 翻遍口袋只有几块钱，连¥20都拿不出来……",
              "warning",
            );
          }
        },
      },
      {
        text: "🚫 不买了，不新鲜",
        hint: "健康第一",
        apply: function (st) {
          st.flags._vegeClearanceSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          if (st.player.morality) {
            st.player.morality = Math.min(100, st.player.morality + 2);
          }
          StateManager.addMessage(
            "🚫 你摇了摇头。省钱是省钱，吃坏肚子不值当。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 郊区事件 ======
  RANDOM_EVENTS.push({
    id: "suburb_storm_shelter",
    phase: "street",
    icon: "🌆",
    title: "暴雨中的庇护",
    story:
      "郊区的小路上，天色突然暗了下来。豆大的雨点砸下来，你环顾四周，最近的公交站还在几百米外。不远处一户人家的门开着，门廊下一位老奶奶朝你招手：「快进来躲躲，这雨一时半会儿停不了。」屋里飘出热茶的香气。",
    // [自洽修复] conditions 新增：天气=雨/暴雨才触发（叙事为暴雨庇护，晴天触发不合理）
    conditions: function (st) {
      if (
        !st.weather ||
        (st.weather.current !== "rainy" && st.weather.current !== "stormy")
      )
        return false;
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "suburb" &&
        st.player.day >= 3 &&
        !st.flags._suburbStormShelterSeen
      );
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🏠 进屋躲雨，谢谢老人家",
        hint: "健康+2，心情+3，休息恢复",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.min(100, (st.needs.health || 50) + 2);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
          StateManager.addMessage(
            "🌆 老奶奶给你倒了杯热茶，还拿出自家腌的萝卜干。「年轻人一个人在城里不容易，注意身体啊。」雨停后你道谢离开，心里暖暖的。\n健康+2，心情+3，疲劳-5。",
            "success",
          );
        },
      },
      {
        text: "🌳 在树下躲到雨小",
        hint: "免费，但淋湿了",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.max(0, (st.needs.health || 50) - 1);
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 50) - 5);
          StateManager.addMessage(
            "🌳 你在树下缩着身子等雨小，衣服湿了大半。风一吹，冷得直哆嗦。\n健康-1，卫生-5。",
            "warning",
          );
        },
      },
      {
        text: "🚶 冒雨跑回公交站",
        hint: "省时间，但全身湿透",
        apply: function (st) {
          st.flags._suburbStormShelterSeen = true;
          st.needs.health = Math.max(0, (st.needs.health || 50) - 3);
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 50) - 10);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 3);
          StateManager.addMessage(
            "🚶 你冒雨跑到公交站，全身湿透了。车上的人都不自觉地离你远了一点。\n健康-3，卫生-10，心情-3。",
            "danger",
          );
        },
      },
    ],
  });

  // ====== 政府办事大厅事件 ======
  RANDOM_EVENTS.push({
    id: "gov_office_tout_encounter",
    phase: "street",
    icon: "🏛️",
    title: "办证黄牛",
    story:
      "政府办事大厅门口，一个穿花衬衫的中年女人凑过来，压低声音说：「办身份证？社保？护照？我认识里面的主任，半天就能出证。你自己排队至少三天，还得跑好几趟。」她晃了晃手机，屏幕上显示着几张办证成功的照片。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "gov_office" &&
        st.player.day >= 5 &&
        !st.flags._govOfficeToutSeen
      );
    },
    probability: 0.035,
    repeatable: true,
    choices: [
      {
        text: "💸 花¥100找黄牛",
        hint: "快捷方便，但助长不正之风",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          if ((st.resources.cash || 0) >= 100) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
            st.player.morality = Math.max(0, (st.player.morality || 50) - 3);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage(
              "💸 你给了¥100，中年女人打了个电话，半小时后果然有人带你办完了。虽然方便，但总觉得哪里不对。\n现金-¥100，道德-3，心情+3。",
              "warning",
            );
          } else {
            StateManager.addMessage(
              "💸 你翻了翻口袋——¥100都拿不出来。女人翻了个白眼走开了。",
              "warning",
            );
          }
        },
      },
      {
        text: "📋 自己排队办理",
        hint: "免费，但耗费时间",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "📋 你排了一上午队，终于办完了。虽然折腾，但省下了¥100，心里踏实。\n道德+2，心情-2。",
            "info",
          );
        },
      },
      {
        text: "📱 偷偷拍下证据举报",
        hint: "维护正义，但有风险",
        apply: function (st) {
          st.flags._govOfficeToutSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📱 你偷偷拍了照片，走到大厅内找到值班人员举报。不一会儿，保安出来把那个女人带走了。周围几个办事的人朝你投来赞许的目光。\n道德+5，心情+5。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 培训中心事件 ======
  RANDOM_EVENTS.push({
    id: "training_cert_scam",
    phase: "street",
    icon: "📚",
    title: "包就业培训班",
    story:
      "培训中心大厅里，一个穿西装的销售热情地拦住你：「小伙子来得正好！我们和政府合作的'IT就业班'，三个月包教会，结业推荐就业，月薪起步¥8000！现在报名只要¥2000，下个月就涨价了。」他手里拿着一叠宣传单，上面印着几个所谓成功学员的案例。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        st.trade &&
        st.trade.currentLocation === "trainingCenter" &&
        st.player.day >= 10 &&
        !st.flags._trainingCertScamSeen
      );
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🔍 要求查看政府认证文件",
        hint: "谨慎核实，避免上当",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          st.player.ability = Math.min(100, (st.player.ability || 50) + 1);
          StateManager.addMessage(
            "🔍 你要求看政府批文和认证资质。销售支支吾吾，翻了半天只拿出一张过期的培训许可证。你明白了——这班根本不正规。\n道德+2，心智+1。",
            "success",
          );
        },
      },
      {
        text: "💰 报名试试",
        hint: "¥2000，可能学到东西，也可能被骗",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          if ((st.resources.cash || 0) >= 2000) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
            var legit = Random.chance(0.3);
            if (legit) {
              st.player.ability = Math.min(100, (st.player.ability || 50) + 5);
              st.player.knowledge = Math.min(
                100,
                (st.player.knowledge || 50) + 5,
              );
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 8,
              );
              StateManager.addMessage(
                "💰 培训了三个月，虽然不像宣传的那么神，但确实学到了一些基础技能。\n现金-¥2000，能力+5，知识+5，心情+8。",
                "success",
              );
            } else {
              st.player.morality = Math.max(0, (st.player.morality || 50) - 2);
              st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 10);
              StateManager.addMessage(
                "💰 上了几节课才发现，教的都是网上免费的公开课内容，所谓的'包就业'也只是一份月薪¥3000的销售岗位名单。\n现金-¥2000，道德-2，心情-10。",
                "danger",
              );
            }
          } else {
            StateManager.addMessage(
              "💰 你看了看钱包——¥2000可不是小数目。还是先攒够钱再说吧。",
              "warning",
            );
          }
        },
      },
      {
        text: "🚶 礼貌拒绝，转身离开",
        hint: "省钱省心",
        apply: function (st) {
          st.flags._trainingCertScamSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 1);
          StateManager.addMessage(
            "🚶 「我再考虑考虑。」你走出培训中心，外面的空气新鲜多了。\n道德+1。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "talent_cook_management_class",
    phase: "street",
    icon: "🍳",
    title: "社区厨艺课邀约",
    story:
      "你拿手的那几道家常菜在街坊间早有口碑。\n" +
      "社区活动中心的干事找上门：「周末能不能来带一节厨艺体验课？按课时结算。」",
    // conditions：已点亮「厨艺管理」天赋节点，连接天赋系统 → 社区副业经济
    conditions: function (st) {
      return !!(st.talentNodes && st.talentNodes["cook_management"]);
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "🍳 接下厨艺体验课",
        hint: "现金+，心情+，名声+",
        apply: function (st) {
          var pay = 600;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🍳 你带了一节「家常红烧肉」体验课，十几个邻居边学边尝。结课费¥" +
              pay +
              "，心情+8，名声+3。",
            "success",
          );
        },
      },
      {
        text: "📅 先排到下个月",
        hint: "留余地",
        apply: function (st) {
          StateManager.addMessage(
            "📅 你答应下个月再排课，干事留了联系方式。天赋没白点。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [自洽修复] 原 skill_writing_column 引用了不存在的 skills.writing（state.js 技能表无 writing）
    // → 改为 skills.english（真实存在），双语内容创作角度，仍连接 技能→名声/稿费经济
    id: "skill_english_column",
    phase: "street",
    icon: "✍️",
    title: "双语专栏约稿",
    story:
      "你常把城市里的小人物写进随笔，英语底子让你能翻些外刊对照着写。\n" +
      "一家本地生活号编辑私信你：「想不想开个双语专栏？按篇付稿费，涉外稿另加¥300。」",
    // conditions：英语技能达到一定等级，连接技能系统 → 名声 / 稿费经济
    conditions: function (st) {
      var lvl = st.skills && st.skills.english && st.skills.english.level;
      return typeof lvl === "number" && lvl >= 30;
    },
    probability: 0.025,
    repeatable: true,
    choices: [
      {
        text: "✍️ 开专栏，先写一篇",
        hint: "现金+，名声+",
        apply: function (st) {
          var pay = 800;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          StateManager.addMessage(
            "✍️ 你写了篇《城中村理发师的老剃刀》（中英对照），发出去一夜破万阅读。稿费¥" +
              pay +
              "，名声+6。",
            "success",
          );
        },
      },
      {
        text: "🤔 婉拒，保持自由",
        hint: "不绑定",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你回绝了专栏，但留了编辑联系方式——写作仍是你的私人出口。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "npc_oldzhou_toolloan",
    phase: "street",
    icon: "🔧",
    title: "老周的私藏工具",
    story:
      "老周看你总在鼓捣些小修小补，某天拍拍你肩：\n" +
      "「这套德国扳手我年轻时用，你拿去使。别跟我客气。」",
    // conditions：老周已结识且好感足够高，连接 NPC 深度好感 → 实物资源（A类守卫）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou;
      return !!(rel && rel.met && (rel.affinity || 0) >= 55);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🔧 收下，记在心里",
        hint: "好感+，心情+",
        apply: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          StateManager.addMessage(
            "🔧 你接过了那套沉甸甸的扳手。老周咧嘴一笑，好感+3，心情+4。",
            "success",
          );
        },
      },
      {
        text: "🙏 先借急用就还",
        hint: "灵活",
        apply: function (st) {
          var rel = st.relationships && st.relationships.old_zhou;
          if (rel) rel.affinity = Math.min(100, (rel.affinity || 0) + 1);
          StateManager.addMessage(
            "🙏 你说「急用就借，用完就还」，老周爽快应了。手头多了套趁手工具，好感+1。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "morality_extreme_blacklist",
    phase: "street",
    icon: "⚠️",
    title: "旧账找上门",
    story:
      "你早年耍过的那些心眼，终于有了回响。\n" +
      "一个你坑过的熟人托人放话：「这人办事不地道，以后活儿别给他。」",
    // conditions：道德跌破极低门槛，极端利己的长期回响（与 high 侧形成闭环）
    conditions: function (st) {
      var m = st.player && st.player.morality;
      return typeof m === "number" && m <= 15;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🕊️ 主动登门道歉赔钱",
        hint: "现金-，道德+，但声誉难回",
        apply: function (st) {
          var cost = 1500;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - cost);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 8);
          st.player.fame = Math.max(0, (st.player.fame || 0) - 5);
          StateManager.addMessage(
            "🕊️ 你上门赔了¥" +
              cost +
              "，对方冷笑收下。道德+8，但名声-5——信用的裂痕没那么好补。",
            "danger",
          );
        },
      },
      {
        text: "🙈 装作没事",
        hint: "躲一时",
        apply: function (st) {
          st.player.fame = Math.max(0, (st.player.fame || 0) - 3);
          StateManager.addMessage(
            "🙈 你假装没听见风声。名声-3，有些门从此对你关上了。",
            "warning",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weather_rainy_umbrella",
    phase: "street",
    icon: "🌧️",
    title: "雨里的一把伞",
    story:
      "突如其来的雨把整条街浇透。你缩在屋檐下，旁边也有人正发愁。\n" +
      "对方递来半边伞：「顺路，一起走？」",
    // conditions：当前天气为雨天，连接天气系统 → 偶遇 / 心情
    conditions: function (st) {
      return !!(st.weather && st.weather.current === "rainy");
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🌂 接下半边伞",
        hint: "心情+，可能结识",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          StateManager.addMessage(
            "🌂 你们挤在一把伞下走了两条街，聊得意外投机。心情+6。",
            "success",
          );
        },
      },
      {
        text: "🏃 冒雨冲回去",
        hint: "省事但狼狈",
        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 2);
          StateManager.addMessage(
            "🏃 你摆摆手冲进雨里，到家时浑身湿透。心情-2。",
            "warning",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "fame_high_interview",
    phase: "street",
    icon: "🎤",
    title: "本地媒体的采访",
    story:
      "你在街坊里攒下的好名声，引来了城里生活周刊的记者。\n" +
      "「我们想做个『普通人的城市故事』专栏，能聊聊你吗？」",
    // conditions：名声达到较高门槛，累积状态爆发 → 曝光机会
    conditions: function (st) {
      var f = st.player && st.player.fame;
      return typeof f === "number" && f >= 60;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🎤 答应采访",
        hint: "名声+，现金+",
        apply: function (st) {
          var pay = 1000;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          StateManager.addMessage(
            "🎤 采访登出来，配了张你在巷口笑的照片。稿费¥" +
              pay +
              "，名声+8，连菜市场阿姨都认得你了。",
            "success",
          );
        },
      },
      {
        text: "🤫 婉拒出镜",
        hint: "低调",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "🤫 你谢绝了出镜，但记者写了篇匿名小稿。名声+2。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] 声望系统 ↔ 职业/收入：副业口碑达阈值后，老客户主动回头
    id: "reputation_high_callup",
    phase: "street",
    icon: "🌟",
    title: "口碑带来的回头客",
    story:
      "你在这一带做了不少活，街坊都认得你这个人。\n" +
      "今天一家小超市老板专门找上门：「听说你靠谱，以后我店的杂活都包给你，长期算。」",
    // conditions：副业口碑（按地点）达到阈值，连接 reputation 系统 → 稳定收入机会
    conditions: function (st) {
      var rep = st.reputation;
      if (!rep) return false;
      // 任一常去地点口碑≥50 即视为积累了可信度
      var ok =
        (rep.slum || 0) >= 50 ||
        (rep.commercialDist || 0) >= 50 ||
        (rep.bank || 0) >= 50 ||
        (rep.wholesaleMarket || 0) >= 50;
      return !!ok;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 接下长期活",
        hint: "解锁稳定副业收入",
        apply: function (st) {
          st.flags.repLongTermGig = true;
          var bonus = 400 + Random.int(0, 199);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🤝 你和超市签了长期杂活合同，首月预支¥" +
              bonus +
              "。口碑终于变成了真金白银。",
            "success",
          );
        },
      },
      {
        text: "🙇 先试一单看看",
        hint: "低风险",
        apply: function (st) {
          var bonus = 150 + Random.int(0, 99);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🙇 你接了第一单，老板挺满意，塞给你¥" + bonus + "。口碑路还能走。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] 技能协同：编程 + 英语 → 独立开发副业（技能系统内部交叉）
    id: "indie_dev_side_project",
    phase: "street",
    icon: "💻",
    title: "独立开发的小项目",
    story:
      "你既会写代码，英语也还过得去，能直接读英文文档和海外教程。\n" +
      "一个想法在脑子里转了很久——做个小工具，放到海外平台上去卖。",
    // conditions：编程与英语双门槛，连接 skills 系统 → 被动收入 / 名声
    conditions: function (st) {
      var codeLv = st.skills && st.skills.coding && st.skills.coding.level;
      var engLv = st.skills && st.skills.english && st.skills.english.level;
      return (
        typeof codeLv === "number" &&
        codeLv >= 30 &&
        typeof engLv === "number" &&
        engLv >= 25
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🚀 花两周做出来上架",
        hint: "前期投入，潜在被动收入",
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 600);
          st.flags.indieDevLaunched = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "🚀 你熬了两周把小工具做出来，挂上平台。头月分成不多，但这是第一条睡后收入。现金-¥600，名声+5。",
            "success",
          );
        },
      },
      {
        text: "📝 先写个免费版试水",
        hint: "零成本攒口碑",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📝 你先发了个免费版，几天攒了几十个用户。口碑比钱重要，名声+3。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    // [联动] NPC 深层好感（挚友级 ≥80）：老周把更私密的人脉托付给你
    id: "oldzhou_80_legacy",
    phase: "street",
    icon: "🤝",
    title: "老周的托付",
    story:
      "老周把你当自家后生看。这天他神秘兮兮把你拉到一边：\n" +
      "「我干废品这行，有些门道外人进不来。我信你，带你认识城西回收站的老周明——他手里有正经渠道。」",
    // conditions：老周 old_zhou 已结识且好感达挚友级（≥80），连接 relationships 系统 → 高价回收渠道
    conditions: function (st) {
      var rel = st.relationships && st.relationships.old_zhou;
      return !!(rel && rel.met && (rel.affinity || 0) >= 80);
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🏭 跟他去见老周明",
        hint: "解锁高价回收渠道",
        apply: function (st) {
          st.flags.oldZhouMingChannel = true;
          var bonus = 300 + Random.int(0, 199);
          st.resources.cash = (st.resources.cash || 0) + bonus;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
          StateManager.addMessage(
            "🏭 老周明是个爽快人，当场让你走他的渠道，废铁价每斤多三毛。临走塞你¥" +
              bonus +
              "「拿去喝茶」。废品回收收益永久提升。",
            "success",
          );
        },
      },
      {
        text: "🙏 先记在心里",
        hint: "稳一手",
        apply: function (st) {
          st.flags.oldZhouMingIntro = true;
          StateManager.addMessage(
            "🙏 你谢过老周，把这份人情记在心里。以后随时能去找老周明。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "repair_mgmt_outsource",
    phase: "street",
    icon: "🔧",
    title: "维修外包队",
    story:
      "你修活利索，又懂点排班记账，街角几家小店老板合计着：\n" +
      "「要不你牵头，接周边的零散维修？我们帮你派单。」",
    // conditions：维修技能 + 管理技能 双门槛，连接技能系统 → 副业/团队经济
    conditions: function (st) {
      var repair = st.skills && st.skills.repair && st.skills.repair.level; // 维修技能等级
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 管理技能等级
      return (
        typeof repair === "number" &&
        repair >= 25 &&
        typeof mgmt === "number" &&
        mgmt >= 15
      );
    },
    probability: 0.02,
    repeatable: true,
    choices: [
      {
        text: "🔧 牵头接单",
        hint: "稳定副业+",
        apply: function (st) {
          var cut = 1200;
          st.resources.cash = (st.resources.cash || 0) + cut;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "🔧 你拉起一支三人的社区维修小队，当月净分账¥" + cut + "，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🤔 先不揽活",
        hint: "不绑定",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你谢过老板们，觉得现在一个人接单更自由。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "weld_elec_retrofit",
    phase: "street",
    icon: "⚡",
    title: "设备改造单",
    story:
      "一家小厂的旧生产线总出故障，厂长听说你既会焊又会电工：\n" +
      "「能不能给咱们做个自动化小改造？预算好说。」",
    // conditions：焊接技能 + 电工技能 双门槛，连接技能系统 → 高客单改造
    conditions: function (st) {
      var weld = st.skills && st.skills.welding && st.skills.welding.level; // 焊接技能等级
      var elec =
        st.skills && st.skills.electrician && st.skills.electrician.level; // 电工技能等级
      return (
        typeof weld === "number" &&
        weld >= 20 &&
        typeof elec === "number" &&
        elec >= 15
      );
    },
    probability: 0.018,
    repeatable: false,
    choices: [
      {
        text: "⚡ 接下改造",
        hint: "大额现金+",
        apply: function (st) {
          var fee = 3500;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          StateManager.addMessage(
            "⚡ 改造一次调试成功，厂长很满意，当场结了¥" + fee + "，名声+8。",
            "success",
          );
        },
      },
      {
        text: "🤔 量力而行",
        hint: "风险规避",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你评估后接了个小模块，没贪大——稳妥落袋。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "account_sales_invoice",
    phase: "street",
    icon: "🧾",
    title: "代记账客户",
    story:
      "你帮朋友理过几次账，口碑传开，几个摆摊和开小店的找上门：\n" +
      "「我们不懂报税，你代记账不？按月付。」",
    // conditions：会计技能 + 销售技能 双门槛，连接技能系统 → 稳定代账客户
    conditions: function (st) {
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 会计技能等级
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 销售技能等级（懂客户）
      return (
        typeof acc === "number" &&
        acc >= 20 &&
        typeof sales === "number" &&
        sales >= 10
      );
    },
    probability: 0.022,
    repeatable: true,
    choices: [
      {
        text: "🧾 接代账",
        hint: "月入稳定+",
        apply: function (st) {
          var monthly = 900;
          st.resources.cash = (st.resources.cash || 0) + monthly;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🧾 你接下 3 家代账，当月入账¥" + monthly + "，名声+3。",
            "success",
          );
        },
      },
      {
        text: "🤔 先试一家",
        hint: "低风险",
        apply: function (st) {
          StateManager.addMessage(
            "🤔 你先接了一家练手，口碑稳了再扩。",
            "info",
          );
        },
      },
    ],
  });

  // [联动 R7] 需求阈值爆发：现金濒临枯竭 → 社区零工互助
  RANDOM_EVENTS.push({
    id: "cash_low_community_gig",
    phase: "street",
    icon: "🪙",
    title: "邻里零工",
    story:
      "房租和饭钱快见底了，你在业主群里随口问了句有没有零活。\n" +
      "楼下的便利店老板和快递驿站先后找来：『有空帮个忙不？按次结。』",
    // conditions：现金阈值触发——危机转化为互助契机，连接 经济系统 → 社区互助/微收入
    conditions: function (st) {
      var cash = st.resources && st.resources.cash; // 现金（元）
      return typeof cash === "number" && cash <= 200;
    },
    probability: 0.05,
    repeatable: true,
    choices: [
      {
        text: "🪙 接零工",
        hint: "现金+（小额）",
        apply: function (st) {
          var pay = 260;
          st.resources.cash = (st.resources.cash || 0) + pay;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "🪙 你帮便利店理了两小时货、替驿站分了趟件，当天进账¥" +
              pay +
              "，名声+2。",
            "success",
          );
        },
      },
      {
        text: "😶 先缓缓",
        hint: "不接活",
        apply: function (st) {
          StateManager.addMessage("你婉拒了，想先缓口气。", "info");
        },
      },
    ],
  });

  // [联动 R7] 双技能协同：销售 + 英语 → 外贸跟单/选品顾问
  RANDOM_EVENTS.push({
    id: "sales_english_trade",
    phase: "street",
    icon: "🌐",
    title: "外贸跟单",
    story:
      "一家做跨境小商品的公司缺个既懂客户又过得硬英语的跟单。\n" +
      "猎头刷到你的履历：「能不能兼着帮我们跟几票单？」",
    // conditions：销售技能 + 英语技能 双门槛，连接 技能系统 → 跨境副业
    conditions: function (st) {
      var sales = st.skills && st.skills.sales && st.skills.sales.level; // 销售技能等级
      var eng = st.skills && st.skills.english && st.skills.english.level; // 英语技能等级
      return (
        typeof sales === "number" &&
        sales >= 15 &&
        typeof eng === "number" &&
        eng >= 25
      );
    },
    probability: 0.02,
    repeatable: true,
    choices: [
      {
        text: "🌐 接跟单",
        hint: "现金+（佣金）/名声+",
        apply: function (st) {
          var fee = 1100;
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "🌐 你跟下了两票小单，拿到佣金¥" + fee + "，名声+4。",
            "success",
          );
        },
      },
      {
        text: "🙅 暂时不接",
        hint: "不接",
        apply: function (st) {
          StateManager.addMessage("你婉拒了，手头事够多了。", "info");
        },
      },
    ],
  });

  // [联动 R7] 天赋系统扩展：sales_management 天赋节点 → 大客户资源
  RANDOM_EVENTS.push({
    id: "talent_sales_management_client",
    phase: "street",
    icon: "💼",
    title: "大客户介绍",
    story:
      "你拿下「销售管理」天赋后，圈子里开始有人把你当能扛盘的人。\n" +
      "一位老客户牵线：「有个大单，我觉得你能接，要不要聊聊？」",
    // conditions：天赋节点 sales_management 已激活，连接 天赋系统 → 高价值客户
    conditions: function (st) {
      return !!(st.talentNodes && st.talentNodes["sales_management"]);
    },
    probability: 0.018,
    repeatable: true,
    choices: [
      {
        text: "💼 接大单",
        hint: "现金+（大额）/名声+",
        apply: function (st) {
          var retainer = 2600;
          st.resources.cash = (st.resources.cash || 0) + retainer;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 7);
          StateManager.addMessage(
            "💼 你谈下了这笔年框，预付¥" + retainer + "，名声+7。",
            "success",
          );
        },
      },
      {
        text: "🤝 先认识人",
        hint: "只建联不接单",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "你先吃了顿饭认识人，暂未接单，名声+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R8 联动事件（指令二：空白区填充）======
  RANDOM_EVENTS.push({
    id: "mood_low_letter_home",
    phase: "street",
    icon: "📞",
    title: "夜里的家",
    story:
      "出租屋的灯坏了半边，你躺在漆黑里刷到老家同学的动态——人家孩子都会叫爸爸了。胃里空空的，不是饿，是想家。手机相册自动弹出去年过年的全家福。",
    // conditions：极低心情阈值爆发（除饥饿外的 needs 阈值空白区）
    conditions: function (st) {
      if (!st.needs) return false; // 检查 needs 系统存在
      if (!st.housing || st.housing.tier < 1) return false; // [Layer3]
      if ((st.needs.happiness || 100) >= 15) return false; // 检查 心情值<15（极低）
      if (st.player.phase !== "street") return false; // 检查 仅在街头阶段
      if (st.player.day < 7) return false; // 检查 开局几天后
      if (
        st.flags &&
        st.flags._moodLowLetterDay && // 检查 30天冷却
        st.player.day - st.flags._moodLowLetterDay < 30
      )
        return false;
      return true;
    },
    probability: 0.05,
    repeatable: true,
    choices: [
      {
        text: "📞 给家里打个电话",
        hint: "心情+,花钱-",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 30);
          st.flags._moodLowLetterDay = st.player.day;
          StateManager.addMessage(
            "📞 你拨通了家里的电话，妈在那头絮叨，你鼻头一酸，但胸口松了。",
          );
        },
      },
      {
        text: "✍️ 写一封长信",
        hint: "心情+,省钱",
        apply: function (st) {
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 6);
          st.flags._moodLowLetterDay = st.player.day;
          StateManager.addMessage(
            "✍️ 你打开备忘录写了很久，没发出去，但写完后睡得比往常沉。",
          );
        },
      },
      {
        text: "🌃 一个人闷着",
        hint: "省钱,心情-",
        apply: function (st) {
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 2);
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 3;
          StateManager.addMessage(
            "🌃 你把手机扣在桌上，盯着天花板。有些情绪，只能自己消化。",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "cooking_accounting_catering",
    phase: "street",
    icon: "🍱",
    title: "盒饭生意",
    story:
      "楼下便利店老板娘尝了你带的午饭，眼睛一亮：「你这手艺能开店了！我店门口让你摆个盒饭摊行不？」你脑子立刻算起毛利、损耗和人手——这你熟。",
    // conditions：cooking + accounting 双技能协同（餐饮记账空白区）
    conditions: function (st) {
      var cook = st.skills && st.skills.cooking && st.skills.cooking.level; // 检查 烹饪技能
      var acc = st.skills && st.skills.accounting && st.skills.accounting.level; // 检查 会计技能
      if (typeof cook !== "number" || cook < 30) return false; // 检查 烹饪≥30
      if (typeof acc !== "number" || acc < 20) return false; // 检查 会计≥20
      if (st.player.phase !== "street") return false; // 检查 街头阶段
      if (st.player.day < 20) return false; // 检查 中后期
      if (st.flags && st.flags._cateringBizOn) return false; // 检查 未已开启
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "🍱 接下长期盒饭单",
        hint: "稳定收入+,耗时+",
        apply: function (st) {
          var earn = Random.int(180, 320);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._cateringBizOn = true;
          StateManager.addMessage(
            "🍱 你算清每盒饭毛利后接下了单，便利店门口多了你的保温箱。",
          );
        },
      },
      {
        text: "🤝 只偶尔帮衬",
        hint: "轻量练手",
        apply: function (st) {
          var earn = Random.int(40, 90);
          st.resources.cash = (st.resources.cash || 0) + earn;
          StateManager.addMessage("🤝 你偶尔帮老板娘做几顿，权当练手赚零花。");
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "coding_management_product",
    phase: "street",
    icon: "👥",
    title: "组队接外包",
    story:
      "前同事发来一单外包：一个小程序，工期紧、预算还行。你技术够啃下来，但一个人熬不起。忽然想到——你不是也能张罗人吗？",
    // conditions：coding + management 双技能协同（带小团队接单空白区）
    conditions: function (st) {
      var code = st.skills && st.skills.coding && st.skills.coding.level; // 检查 编程技能
      var mgmt =
        st.skills && st.skills.management && st.skills.management.level; // 检查 管理技能
      if (typeof code !== "number" || code < 30) return false; // 检查 编程≥30
      if (typeof mgmt !== "number" || mgmt < 15) return false; // 检查 管理≥15
      if (st.player.day < 25) return false; // 检查 中后期
      if (st.flags && st.flags._codingTeamDone) return false; // 检查 未做过
      return true;
    },
    probability: 0.022,
    repeatable: false,
    choices: [
      {
        text: "👥 拉小队接下",
        hint: "大收入+,压力+",
        apply: function (st) {
          var earn = Random.int(900, 1600);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 10;
          st.flags._codingTeamDone = true;
          StateManager.addMessage(
            "👥 你拉了两个靠谱朋友组队，把外包单啃下来了，账户厚了一截。",
          );
        },
      },
      {
        text: "💻 自己 solo 做",
        hint: "收入中,压力小",
        apply: function (st) {
          var earn = Random.int(350, 600);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          StateManager.addMessage(
            "💻 你一个人熬了几个通宵把外包做完了，钱不多但落袋为安。",
          );
        },
      },
    ],
  });
  RANDOM_EVENTS.push({
    id: "stress_high_breakdown",
    phase: "street",
    icon: "⚡",
    title: "临界点",
    story:
      "连续的高压把人磨钝了。你开始在地铁上走神，对同事一点就着，半夜睁眼到三点。镜子里的自己，眼窝深得吓人。身体在拉警报。",
    // conditions：stress 心理健康阈值（health.mental.stress 空白区）
    conditions: function (st) {
      var stress =
        st.player && st.player.health && st.player.health.mental
          ? st.player.health.mental.stress
          : 0; // 检查 心理压力值
      if (stress < 80) return false; // 检查 压力≥80（临界）
      if (st.player.day < 15) return false; // 检查 中后期
      if (
        st.flags &&
        st.flags._stressBreakdownDay && // 检查 60天冷却
        st.player.day - st.flags._stressBreakdownDay < 60
      )
        return false;
      return true;
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "🏖️ 请几天假缓一缓",
        hint: "压力-,收入-",
        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress = Math.max(
              0,
              st.player.health.mental.stress - 25,
            );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.flags._stressBreakdownDay = st.player.day;
          StateManager.addMessage(
            "🏖️ 你关掉手机睡了两天，醒来觉得世界没那么糟。",
          );
        },
      },
      {
        text: "⚡ 硬扛过去",
        hint: "收入保,健康-",
        apply: function (st) {
          if (st.player.health && st.player.health.mental)
            st.player.health.mental.stress =
              (st.player.health.mental.stress || 0) + 5;
          if (st.player.health && st.player.health.physical)
            st.player.health.physical.score = Math.max(
              0,
              st.player.health.physical.score - 8,
            );
          st.flags._stressBreakdownDay = st.player.day;
          StateManager.addMessage(
            "⚡ 你继续连轴转，直到某天在地铁上眼前一黑。",
          );
        },
      },
    ],
  });
  // ====== R9 联动事件（空白区填充：时代变迁/NPCD深度好感/双技能/声望高阶）======
  RANDOM_EVENTS.push({
    id: "era_inflation_rent_hike",
    phase: "street",
    icon: "📈",
    title: "通胀下的涨租",
    story:
      "物价一年比一年高。房东贴出通知：下月房租上调一成。菜场大妈念叨「钱越来越不经花了」，你捏着钱包发愁。",
    // conditions：时代变迁进入中后期（物价/工资明显变化），联动 era_transform 系统
    conditions: function (st) {
      var era = st._eraState; // 检查 时代状态是否已初始化
      if (!era) return false;
      return era.stageId === "mature" || era.stageId === "decline"; // 检查 中后期阶段（约1.5年后）
    },
    probability: 0.04,
    repeatable: true,
    choices: [
      {
        text: "💰 咬牙续租",
        hint: "现金- 安稳+",
        apply: function (st) {
          var hike = Math.round((st.resources.cash || 0) * 0.06); // 涨租差价
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - hike);
          StateManager.addMessage(
            "你补齐了涨租的差价，总算没流落街头。",
            "info",
          );
        },
      },
      {
        text: "📦 搬去城郊",
        hint: "现金+ 通勤累",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 80; // 省下月租
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 10);
          StateManager.addMessage(
            "你搬到城郊更便宜的床位，每月省下一笔，但通勤更累了。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "sister_zhang_market_tip",
    phase: "street",
    icon: "🤝",
    title: "张姐的内推",
    story:
      "张姐神秘兮兮把你拉到一边：「商业区有个黄金摊位空出来了，我帮你递个话？」她眼里是真心想拉你一把。",
    // conditions：张姐好感积累后的意外发现（NPC 关系空白区）
    conditions: function (st) {
      var rel = st.relationships && st.relationships.sister_zhang; // 检查 张姐关系对象
      if (!rel || !rel.met) return false; // 检查 已结识
      return (rel.affinity || 0) >= 60; // 检查 好感≥60
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙌 接下人情",
        hint: "声望+ 现金+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 200;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          var rel = st.relationships.sister_zhang;
          rel.affinity = Math.min(100, rel.affinity + 5);
          StateManager.addMessage(
            "张姐真帮你递了话，你拿到商业区临时摊位资格，名声也涨了。",
            "info",
          );
        },
      },
      {
        text: "🙏 先记着",
        hint: "好感+ 无消耗",
        apply: function (st) {
          var rel = st.relationships.sister_zhang;
          rel.affinity = Math.min(100, rel.affinity + 8);
          StateManager.addMessage(
            "你婉拒了，说等站稳再说。张姐反倒更欣赏你的稳重。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "electrician_coding_smart_home",
    phase: "street",
    icon: "💡",
    title: "智能家居改装",
    story:
      "邻居看你既懂电路又玩得转代码，凑过来问：「能不能帮我把老房子改成手机遥控灯？给你算工钱。」",
    // conditions：电工+编程双技能协同（技能系统空白区）
    conditions: function (st) {
      var elec =
        st.skills && st.skills.electrician ? st.skills.electrician.level : 0; // 检查 电工等级
      var code = st.skills && st.skills.coding ? st.skills.coding.level : 0; // 检查 编程等级
      return elec >= 20 && code >= 20; // 检查 双技能均≥20
    },
    probability: 0.03,
    repeatable: true,
    choices: [
      {
        text: "🔧 接单改装",
        hint: "现金+ 电工xp+",
        apply: function (st) {
          st.resources.cash = (st.resources.cash || 0) + 150;
          if (st.skills.electrician) st.skills.electrician.xp += 25;
          StateManager.addMessage(
            "你用继电器加单片机把灯连进手机，邻居直呼神奇，工钱到手。",
            "info",
          );
        },
      },
      {
        text: "📚 教他自己弄",
        hint: "声望+ 无消耗",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          StateManager.addMessage(
            "你甩给他一份教程和零件清单，他后来真鼓捣出来了，逢人夸你。",
            "info",
          );
        },
      },
    ],
  });

  RANDOM_EVENTS.push({
    id: "reputation_top_influencer",
    phase: "street",
    icon: "🌟",
    title: "商圈红人",
    story:
      "商业区里越来越多的人认得你——店员喊你「常客」，摊主留你最爱的位置。你成了这片街区隐形的「自己人」。",
    // conditions：声望系统高阶分叉（reputation 按地点 key 存，非标量）
    conditions: function (st) {
      var rep = st.reputation && st.reputation.commercialDist; // 检查 商业区声望
      return (rep || 0) >= 80; // 检查 声望≥80（顶阶）
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 牵头邻里互助",
        hint: "声望+ 好感扩散",
        apply: function (st) {
          st.player.fame = Math.min(100, (st.player.fame || 0) + 6);
          if (st.reputation)
            st.reputation.commercialDist = Math.min(
              100,
              (st.reputation.commercialDist || 0) + 3,
            );
          StateManager.addMessage(
            "你张罗起邻里互助群，整片街区的商家都买你的账。",
            "info",
          );
        },
      },
      {
        text: "🙂 低调保持",
        hint: "无消耗 稳",
        apply: function (st) {
          StateManager.addMessage(
            "你笑着摆摆手，继续做个被记得脸熟的人。",
            "info",
          );
        },
      },
    ],
  });

  // ====== 空白区填充：4个新联动事件（v3.20 新增）======
  // 场景1：技能成长兑现 — 修理技能≥40 → 修理铺合作邀请
  RANDOM_EVENTS.push({
    id: "repair_workshop_offer",
    phase: "street",
    icon: "🔧",
    title: "修理铺的邀请",
    story:
      "你在街边修了一个下午的小物件，手法越来越熟练。这时，街角的\u201C老王修理铺\u201D老板老王走过来拍了拍你的肩：\u201C小伙子，手艺不错啊。我这铺子最近忙不过来，缺个帮手——你要是愿意，我给你固定工价，还能学老本行。\u201D\n\n老王把铺子里的账本翻给你看：活不缺，就是人手不够。",
    conditions: function (st) {
      if (!st.skills) return false;
      var repair = st.skills.repair || 0;
      if (repair < 40) return false;
      if (st.flags._repairWorkshopSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🔧 答应合作，每周固定三天",
        hint: "稳定收入 + 技能提升",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          var baseIncome = Random.int(200, 400);
          st.resources.cash = (st.resources.cash || 0) + baseIncome;
          st.resources.totalEarned += baseIncome;
          st.skills.repair = Math.min(100, (st.skills.repair || 40) + 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          StateManager.addMessage(
            "🔧 你每周帮老王修三天物件，周入¥" +
              baseIncome +
              "，修理技能+5。手艺有了去处。",
            "success",
          );
        },
      },
      {
        text: "💰 谈更高的工价",
        hint: "风险：可能谈崩",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          if (Random.chance(0.4)) {
            var highIncome = Random.int(300, 600);
            st.resources.cash = (st.resources.cash || 0) + highIncome;
            st.resources.totalEarned += highIncome;
            StateManager.addMessage(
              "💰 你开口要价高一些，老王犹豫了一下答应了。周入¥" +
                highIncome +
                "，比预期更好。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💰 你报的价老王摇头了，说再想想。合作暂时搁置了。",
              "info",
            );
          }
        },
      },
      {
        text: "🙋 婉拒，想自己单干",
        hint: "维持现状",
        apply: function (st) {
          st.flags._repairWorkshopSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 3);
          StateManager.addMessage(
            "🙋 你说想自己干。老王点点头，给了你张名片：「有需要了再来。」",
            "info",
          );
        },
      },
    ],
  });

  // 场景2：状态积累爆发 — 饥饿≥3天 → 好心人请喝热汤
  RANDOM_EVENTS.push({
    id: "hunger_warm_meal_kindness",
    phase: "street",
    icon: "🍲",
    title: "一碗热汤",
    story:
      "你已经三天没好好吃顿饭了，肚子咕咕叫，浑身发冷。路过一家小面馆，老板娘看你面色不好，二话不说盛了一碗热汤推到你面前：「先暖暖身子，这顿算我的。」\n\n热汤下肚，你感觉胃里终于有了温度。这种被人照顾的感觉，太久没体会过了。",
    conditions: function (st) {
      if (!st.needs) return false;
      var hungerStreak = st.needs._hungerStreak || 0;
      var hunger = st.needs.hunger || 0;
      if (hunger < 70 && hungerStreak < 3) return false;
      if (st.flags._hungerMealSeen) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 收下热汤，真诚道谢",
        hint: "心情+15，饥饿大幅缓解",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 60);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
          StateManager.addMessage(
            "🙏 你端起碗，热汤顺着喉咙流下去。好久没被人这样照顾过了。饥饿-60，心情+15。",
            "success",
          );
        },
      },
      {
        text: "😢 默默吃完，留句话",
        hint: "心情+10，留下温暖",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 50);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 10);
          StateManager.addMessage(
            "😢 你安静地吃完，在桌上留了张纸条：「谢谢，等我发财了一定还。」老板娘笑着收下了。",
            "info",
          );
        },
      },
      {
        text: "😔 不好意思，还是不要",
        hint: "保持尊严，但状态依旧",
        apply: function (st) {
          st.flags._hungerMealSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 2);
          StateManager.addMessage(
            "😔 你摇摇头，不想欠人情。老板娘看着你走远，眼里有担忧。",
            "info",
          );
        },
      },
    ],
  });

  // 场景3：天气×位置组合 — 暴雨/大雾 + 批发市场 → 雨中同行
  RANDOM_EVENTS.push({
    id: "rainy_wholesale_umbrella",
    phase: "street",
    icon: "☂️",
    title: "同撑一把伞",
    story:
      "雨突然大了起来，你刚走进批发市场的顶棚避雨，迎面走来一个提着大包小包的中年男人，浑身湿透。他看了看你，递过手里唯一的伞：「兄弟，一起走？路不远，前面路口就到家了。」\n\n这把伞只够遮两个人。",
    conditions: function (st) {
      var isBadWeather =
        st.weather &&
        (st.weather.current === "stormy" ||
          st.weather.current === "heavy_rain" ||
          st.weather.current === "foggy");
      var atMarket = st.trade && st.trade.currentLocation === "wholesaleMarket";
      if (!isBadWeather || !atMarket) return false;
      if (st.flags._rainyUmbrellaSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🤝 同撑一把伞同行",
        hint: "心情+12，陌生人的温暖",
        apply: function (st) {
          st.flags._rainyUmbrellaSeen = true;
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 5);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          StateManager.addMessage(
            "🤝 你们并肩走在雨里，聊了几句闲天。到路口时他摆摆手就走了，你才发现自己不知道他姓什么。心情+12。",
            "success",
          );
        },
      },
      {
        text: "🏠 自己找个地方躲雨",
        hint: "不欠人情",
        apply: function (st) {
          st.flags._rainyUmbrellaSeen = true;
          st.needs.hygiene = Math.max(0, (st.needs.hygiene || 0) - 8);
          StateManager.addMessage(
            "🏠 你婉拒了，自己找个屋檐下躲雨。雨下了好久，浑身还是湿了大半。卫生-8。",
            "info",
          );
        },
      },
    ],
  });

  // 场景4：道德×债务极端分叉 — 高额债务 + 道德<30 → 借钱困境
  RANDOM_EVENTS.push({
    id: "moral_debt_dilemma",
    phase: "street",
    icon: "💸",
    title: "借还是不借",
    story:
      "街头巷尾的债务压力越来越大，你手头紧得发颤。这时你遇到一个老熟人——曾经帮过你的张师傅，他现在生意不行了，开口向你借钱：「兄弟，就借我500，我下个月一定还。」\n\n可是你自己欠债如山，根本没有多余的钱。张师傅的眼里满是焦急。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.zhang_shi_fu || !st.relationships.zhang_shi_fu.met) return false; // [Layer3]
      var morality = st.player.morality || 50;
      var debt = st.resources.totalDebt || 0;
      if (morality >= 30) return false;
      if (debt < 1000) return false;
      if (st.flags._moralDebtSeen) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💰 硬凑出500借给他",
        hint: "借钱给别人，自己更紧",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          var borrow = Math.min(500, st.resources.cash || 0);
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - borrow);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.morality = Math.max(0, (st.player.morality || 30) + 3);
          StateManager.addMessage(
            "💰 你把¥" +
              borrow +
              "塞给张师傅，自己剩下的钱只够撑两天。但看着他松了一口气的样子，你心里也不好受。道德+3。",
            "warning",
          );
        },
      },
      {
        text: "😒 直接拒绝——我没钱",
        hint: "现实选择，无消耗",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
          StateManager.addMessage(
            "😒 你实话实说：「兄弟，我比你更惨。」张师傅沉默了一下，拍拍你肩膀走了。心情-5。",
            "info",
          );
        },
      },
      {
        text: "🤔 帮他想别的办法",
        hint: "推荐工作，两全其美",
        apply: function (st) {
          st.flags._moralDebtSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🤔 你说：「我认识个工地招人，明天可以去试试。」张师傅眼睛亮了，握了握你的手。心智+3，心情+8。",
            "success",
          );
        },
      },
    ],
  });

  // ====== 医疗系统联动：王医生相关事件 ======
  RANDOM_EVENTS.push({
    id: "dr_wang_health_warning",
    phase: "street",
    icon: "🏥",
    title: "医生的忠告",
    story:
      "你捂着肚子从医院走廊出来，正好碰上王医生。他看你脸色发青，皱了皱眉：「又没好好吃饭？跟你说过多少次了，胃病不是闹着玩的。过来，我给你开点药，别再拖了。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.dr_wang) return false;
      if (!st.relationships.dr_wang.met) return false;
      if (!st.needs) return false;
      var health = st.needs.health || 100;
      if (health > 50) return false;
      if (st.flags._drWangWarningSeen) return false;
      if (st.player.day < 10) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢医生，我注意",
        hint: "health+10",
        apply: function (st) {
          st.flags._drWangWarningSeen = true;
          st.needs.health = Math.min(100, (st.needs.health || 0) + 10);
          st.relationships.dr_wang.affinity = Math.min(
            100,
            st.relationships.dr_wang.affinity + 3,
          );
          StateManager.addMessage(
            "🙏 王医生给你开了一周的胃药，叮嘱按时吃。健康+10。",
            "success",
          );
        },
      },
      {
        text: "💰 我没事，不用开药",
        hint: "省药费，没效果",
        apply: function (st) {
          st.flags._drWangWarningSeen = true;
          st.relationships.dr_wang.affinity = Math.max(
            -100,
            st.relationships.dr_wang.affinity - 2,
          );
          StateManager.addMessage(
            "💰 你说没事，王医生摇摇头走开了。好感-2。",
            "warning",
          );
        },
      },
    ],
  });

  // 王医生的医疗人脉 — 好感≥40时推荐便宜诊所
  RANDOM_EVENTS.push({
    id: "dr_wang_clinic_referral",
    phase: "street",
    icon: "📋",
    title: "便宜诊所推荐",
    story:
      "王医生下班时叫住你：「城东新开了家社区诊所，收费便宜设备也新。我跟那边主任打过招呼了，你去报我名字能打八折。」\n\n他把地址写在处方笺上递过来，又补充道：「小病去那看就行，别动不动往大医院跑，贵。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.dr_wang) return false;
      if (!st.relationships.dr_wang.met) return false;
      if ((st.relationships.dr_wang.affinity || 0) < 40) return false;
      if (st.flags._drWangClinicReferral) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢，我去看看",
        hint: "医疗费用-20%持续30天",
        apply: function (st) {
          st.flags._drWangClinicReferral = true;
          st.flags.wangClinicDiscount = true;
          if (!st._clinicDiscountDays) st._clinicDiscountDays = 0;
          st._clinicDiscountDays = Math.max(st._clinicDiscountDays, 30);
          StateManager.addMessage(
            "📋 你收下地址，下次看病可以省一笔。医疗费用-20%，持续30天。",
            "success",
          );
        },
      },
      {
        text: "📱 记下来，以后再说",
        hint: "保留机会",
        apply: function (st) {
          st.flags._drWangClinicReferral = true;
          StateManager.addMessage(
            "📱 你把地址拍下来存好。王医生拍拍你：「别硬扛，该看就看。」",
            "info",
          );
        },
      },
    ],
  });

  // ================================================================
  // 空白区填充 Batch 2：5个新联动事件（v3.21 新增）
  // 场景5：债务清零 → 轻装上阵（重大人生转折）
  // 场景6：技能50+ 职业尊严 → 社会认可事件
  // 场景7：季节×住所×天气三重联动 → 寒冬庇护
  // 场景8：连续多天同一行动 → 肌肉记忆/习惯事件
  // 场景9：父母生日/节日关怀 → 家庭系统联动
  // ================================================================

  // 场景5：债务清零 — 轻装上阵
  // 设计意图：还清债务是游戏中最重要的里程碑之一，但目前缺少庆祝/反思事件
  RANDOM_EVENTS.push({
    id: "debt_freed_light_step",
    phase: "street",
    icon: "🎉",
    title: "终于还清了",
    story:
      "你打开手机银行，看到最后一个还款通知：「您的贷款已全部结清。」\n\n你站在路边愣了很久。从第一天被催债短信吓醒，到现在终于一身轻松——这笔钱花掉了你整整大半年的收入。\n\n街边的早餐摊飘来香味，你忽然觉得今天的阳光格外好。",
    // [自洽新增] conditions：债务清零 + 之前有还款记录 + 游戏≥30天
    conditions: function (st) {
      var debt = st.resources.debt || 0;
      if (debt > 0) return false;
      if (!st.flags._paidOffAnyDebt) return false;
      if (st.flags._debtFreedSeen) return false;
      if (st.player.day < 30) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🍜 吃顿好的庆祝一下",
        hint: "花¥200犒劳自己",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          if ((st.resources.cash || 0) >= 200) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 20);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10);
            StateManager.addMessage(
              "🍜 你走进一家平时舍不得去的餐馆，点了两个菜一瓶饮料。吃饱喝足走出门，感觉整个人都轻了。心情+20，疲劳-10。",
              "success",
            );
          } else {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
            StateManager.addMessage(
              "🍜 你想吃顿好的庆祝，但口袋里只剩几十块。算了，明天再补。心情+8。",
              "info",
            );
          }
        },
      },
      {
        text: "📞 给家里打个电话",
        hint: "报喜不报忧",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "📞 你拨通了家里的电话。妈问最近怎么样，你说「挺好的，一切都好」——这是你第一次可以说这句真话。心情+15，心智+5。",
            "success",
          );
        },
      },
      {
        text: "💪 继续攒钱，目标更远",
        hint: "稳扎稳打",
        apply: function (st) {
          st.flags._debtFreedSeen = true;
          st.flags._paidOffAnyDebt = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "💪 你深吸一口气，把手机放回口袋。没有庆祝，没有停顿——下一步是攒第一笔存款。心态稳了，路就长了。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // 场景6：技能50+ → 职业尊严（社会认可）
  // 设计意图：玩家在某技能上投入大量时间后，获得来自社会的正向反馈
  // 这是禀赋效应的叙事体现——玩家对自己培养的技能产生情感依附
  RANDOM_EVENTS.push({
    id: "skill_milestone_recognition",
    phase: "street",
    icon: "⭐",
    title: "高手的名号",
    story:
      "你在街上修东西的事传开了。今天有个穿西装的人走过来，递上一张名片：「听说你这儿什么都能修？我公司设备老坏，能不能请你去看看？一个月¥3000，兼职。」\n\n你看了看名片上的公司名——居然是个正经企业。",
    // [自洽新增] conditions：任一技能≥50 且 街头阶段
    conditions: function (st) {
      if (st.player.phase !== "street") return false;
      if (st.flags._skillMilestoneSeen) return false;
      if (st.player.day < 40) return false;
      if (!st.skills) return false;
      if (!st.skills.repair || st.skills.repair.level < 50) return false; // [Layer3]
      var skilledSkills = [];
      for (var sk in st.skills) {
        if (st.skills[sk] && st.skills[sk].level >= 50) {
          skilledSkills.push(sk);
        }
      }
      if (skilledSkills.length === 0) return false;
      st._skillMilestoneTrigger = skilledSkills[0];
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 接了这份兼职",
        hint: "月收入+3000",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.flags._monthlySkilledGig = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "⭐ 你接下了这份兼职。技能" +
              (st._skillMilestoneTrigger || "修理") +
              "达到专业水平，开始获得市场认可。名气+5，心情+12。",
            "success",
          );
        },
      },
      {
        text: "📋 先了解工作内容再决定",
        hint: "谨慎起见",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "📋 你接过名片仔细看了看。技能" +
              (st._skillMilestoneTrigger || "修理") +
              "确实练出来了，但兼职也得看合不合适。心智+3。",
            "info",
          );
        },
      },
      {
        text: "🙋 谢谢，但想自己开店",
        hint: "志向更大",
        apply: function (st) {
          st.flags._skillMilestoneSeen = true;
          st.flags._skillMilestoneSkill = st._skillMilestoneTrigger || "repair";
          st.flags._wantOwnShop = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 8);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🙋 你说想自己开店。西装男愣了一下，笑了：「有野心是好事。」技能" +
              (st._skillMilestoneTrigger || "修理") +
              "的自信在你心里种下了种子。心智+5。",
            "success",
          );
        },
      },
    ],
  });

  // 场景7：季节×住所×天气三重联动 → 寒冬庇护
  // 设计意图：寒冬天气下，不同住所条件的玩家体验完全不同
  // 露宿=生死考验，合租=勉强过关，独居以上=舒适享受
  RANDOM_EVENTS.push({
    id: "cold_snap_winter_shelter", // [自洽修复] 原 id 与规范事件 cold_snap_housing_crisis 重复, 重命名避免 id 冲突
    phase: "street",
    icon: "🥶",
    title: "寒潮来袭",
    story:
      "气象台发布了寒潮蓝色预警：未来三天最低气温降至零下10度。寒风像刀子一样割在脸上，街上的行人都裹紧了衣服。\n\n你看了看自己住的地方——",
    // [自洽新增] conditions：雪天/暴雨天气 + 住所≤豪华公寓以下
    conditions: function (st) {
      if (st.weather && st.weather.current === "heatwave") return false;
      var isColdWeather =
        st.weather &&
        (st.weather.current === "snowy" || st.weather.current === "stormy");
      if (!isColdWeather) return false;
      if (st.player.day < 5) return false;
      var housingTier =
        st.housing && st.housing.tier !== undefined ? st.housing.tier : 0;
      if (housingTier > 4) return false;
      if (st.flags._coldSnapHousingSeen) return false;
      return true;
    },
    probability: 0.06,
    repeatable: true,
    choices: function (st) {
      var housingTier =
        st.housing && st.housing.tier !== undefined ? st.housing.tier : 0;

      if (housingTier === 0) {
        return [
          {
            text: "🏚️ 找个桥洞凑合一晚",
            hint: "健康-12，但免费",
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              s.status.health = Math.max(0, (s.status.health || 70) - 12);
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 15);
              StateManager.addMessage(
                "🏚️ 桥洞里的风像冰锥一样扎人。你裹着所有衣服蜷缩了一夜，早上起来浑身僵硬。健康-12，疲劳+15。",
                "danger",
              );
            },
          },
          {
            text: "🏪 24小时便利店熬一晚",
            hint: "花¥30买咖啡，健康-3",
            cost: 30,
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              if (s.resources.cash >= 30) {
                s.resources.cash -= 30;
                s.status.health = Math.max(0, (s.status.health || 70) - 3);
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 5,
                );
                StateManager.addMessage(
                  "🏪 你买了杯热咖啡在便利店坐到天亮。虽然被保安赶了两次，但至少没冻着。健康-3，心情+5。",
                  "info",
                );
              } else {
                s.status.health = Math.max(0, (s.status.health || 70) - 8);
                StateManager.addMessage(
                  "🏪 你没钱买咖啡，只能在便利店门口站着。店员看你可怜，给了你半杯剩咖啡。健康-8。",
                  "warning",
                );
              }
            },
          },
        ];
      }

      if (housingTier === 1 || housingTier === 2) {
        return [
          {
            text: "🔥 把暖气开到最大",
            hint: "花¥50电费，但温暖",
            cost: 50,
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              if (s.resources.cash >= 50) {
                s.resources.cash -= 50;
                s.needs.happiness = Math.min(
                  100,
                  (s.needs.happiness || 50) + 10,
                );
                s.status.health = Math.min(100, (s.status.health || 70) + 5);
                StateManager.addMessage(
                  "🔥 你把暖气开到最大，房间里终于有了温度。虽然电费账单会让人心痛，但今晚能睡个好觉了。心情+10，健康+5。",
                  "success",
                );
              } else {
                s.needs.happiness = Math.max(0, (s.needs.happiness || 50) - 5);
                StateManager.addMessage(
                  "🔥 你想开暖气，但余额不够交电费。只能多盖一层被子。心情-5。",
                  "warning",
                );
              }
            },
          },
          {
            text: "🛏️ 裹紧被子硬扛",
            hint: "免费，但睡眠差",
            apply: function (s) {
              s.flags._coldSnapHousingSeen = true;
              s.needs.fatigue = Math.min(100, (s.needs.fatigue || 0) + 8);
              s.status.health = Math.max(0, (s.status.health || 70) - 3);
              StateManager.addMessage(
                "🛏️ 你裹紧被子，但寒气还是从墙壁渗进来。一夜没睡踏实，早上起来浑身酸痛。健康-3，疲劳+8。",
                "info",
              );
            },
          },
        ];
      }

      // 一居室及以上
      return [
        {
          text: "🍲 煮碗热汤面犒劳自己",
          hint: "花¥20，心情+10",
          cost: 20,
          apply: function (s) {
            s.flags._coldSnapHousingSeen = true;
            if (s.resources.cash >= 20) {
              s.resources.cash -= 20;
              s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 10);
              s.needs.hunger = Math.min(100, (s.needs.hunger || 50) + 15);
              StateManager.addMessage(
                "🍲 你煮了一碗热腾腾的汤面，加了鸡蛋和青菜。窗外的寒风和你碗里的热气形成两个世界。心情+10。",
                "success",
              );
            } else {
              StateManager.addMessage(
                "🍲 你想煮碗面，但连面条的钱都没有了。泡了杯热水凑合。",
                "warning",
              );
            }
          },
        },
        {
          text: "📱 给老家打个电话问候",
          hint: "亲情温暖，心情+8",
          apply: function (s) {
            s.flags._coldSnapHousingSeen = true;
            s.needs.happiness = Math.min(100, (s.needs.happiness || 50) + 8);
            s.player.mental = Math.min(100, (s.player.mental || 0) + 4);
            StateManager.addMessage(
              "📱 你拨通了家里的电话。妈妈说「天冷了多穿点」，你鼻子一酸。挂了电话后，房间好像没那么冷了。心情+8，心智+4。",
              "success",
            );
          },
        },
      ];
    },
  });

  // 场景8：连续多天同一行动 → 肌肉记忆/习惯事件
  // 设计意图：玩家反复做同一件事后，系统给予叙事反馈
  // 这是对"刻意练习"概念的 gamification 体现
  RANDOM_EVENTS.push({
    id: "muscle_memory_breakthrough",
    phase: "street",
    icon: "💪",
    title: "肌肉记住了",
    story:
      "你已经连续一周做同样的事了。今天，你突然发现——不用思考，手自己就知道该怎么做了。\n\n就像骑自行车一样，某些动作已经刻进了肌肉记忆里。你低头看了看自己的手，它们好像有了自己的意志。",
    // [自洽新增] conditions：任一行动类型累计≥50次
    conditions: function (st) {
      if (st.flags._muscleMemorySeen) return false;
      if (st.player.day < 20) return false;
      if (!st.stats || !st.stats.actionFreq) return false;
      var maxFreq = 0;
      var maxAction = "";
      for (var act in st.stats.actionFreq) {
        if (st.stats.actionFreq[act] > maxFreq) {
          maxFreq = st.stats.actionFreq[act];
          maxAction = act;
        }
      }
      if (maxFreq < 50) return false;
      st._muscleMemoryAction = maxAction;
      st._muscleMemoryFreq = maxFreq;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🧠 趁热打铁，继续练",
        hint: "相关技能+25XP",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          var action = st._muscleMemoryAction || "unknown";
          var skillMap = {
            manual_labor_construction: "physique",
            waste_recycling: "physique",
            food_stall: "cooking",
            street_vending_goods: "sales",
            delivery_rider: "driving",
            courier_gig: "agility",
          };
          var skillName = skillMap[action] || "physique";
          if (st.skills && st.skills[skillName]) {
            st.skills[skillName].xp = Math.min(
              1000,
              (st.skills[skillName].xp || 0) + 25,
            );
            StateManager.addMessage(
              "💪 你决定继续练。" +
                action +
                "你已经做了" +
                (st._muscleMemoryFreq || 0) +
                "次——肌肉记住了。" +
                skillName +
                "经验+25。",
              "success",
            );
          } else {
            st.player.physique = Math.min(100, (st.player.physique || 20) + 2);
            StateManager.addMessage(
              "💪 你继续练。" +
                action +
                "你已经做了" +
                (st._muscleMemoryFreq || 0) +
                "次——肌肉记住了。体质+2。",
              "success",
            );
          }
        },
      },
      {
        text: "🔄 换个新活试试",
        hint: "探索新方向",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 3);
          StateManager.addMessage(
            "🔄 你觉得该换个口味了。" +
              (st._muscleMemoryAction || "之前的活") +
              "练得够多了，是时候看看别的可能。心情+5，心智+3。",
            "info",
          );
        },
      },
      {
        text: "📝 记录心得，总结经验",
        hint: "智力+2，获得长期buff",
        apply: function (st) {
          st.flags._muscleMemorySeen = true;
          st.flags._muscleMemoryNotes = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 20) + 2,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "📝 你坐下来把这段时间的经验写成笔记。" +
              (st._muscleMemoryAction || "这份工作") +
              "的门道你摸透了。智力+2，心智+5。",
            "success",
          );
        },
      },
    ],
  });

  // 场景9：父母生日关怀 → 家庭系统联动
  // 设计意图：父母的生日/节日是游戏中少有的情感锚点，缺少叙事反馈
  // 连接"家庭系统"与"情感需求系统"的桥梁事件
  RANDOM_EVENTS.push({
    id: "parent_birthday_call",
    phase: "street",
    icon: "📞",
    title: "爸妈的电话",
    story:
      "手机响了。屏幕上跳动着「妈」两个字。\n\n你接起来，那边传来母亲熟悉的声音：「最近怎么样啊？吃得好不好？天冷了多穿点。」\n\n今天是个特别的日子，妈打电话来了。你差点忘了。",
    // [自洽新增] conditions：家庭系统存在 + 周末触发
    conditions: function (st) {
      if (!st.family) return false;
      if (st.flags._parentBirthdayCallSeen) return false;
      if (st.player.day < 15) return false;
      var isWeekend = st.player.day % 7 === 0 || st.player.day % 7 === 6;
      return isWeekend;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🎂 订个蛋糕寄回去",
        hint: "花¥150，家人陪伴↑",
        cost: 150,
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          if ((st.resources.cash || 0) >= 150) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150);
            st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 15);
            st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
            if (st.family && st.family.parents) {
              st.family.parents.father.companionship = Math.min(
                100,
                (st.family.parents.father.companionship || 10) + 15,
              );
              st.family.parents.mother.companionship = Math.min(
                100,
                (st.family.parents.mother.companionship || 10) + 15,
              );
            }
            StateManager.addMessage(
              "🎂 你订了一个蛋糕寄回老家。妈妈打来电话说爸爸感动得不得了。你听着电话那头的笑声，觉得¥150花得值。心情+15，家人陪伴+15。",
              "success",
            );
          } else {
            st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 5);
            StateManager.addMessage(
              "🎂 你想订个蛋糕，但算了算余额不够。只能打电话祝生日快乐。心情-5。",
              "warning",
            );
          }
        },
      },
      {
        text: "📞 陪他们聊久一点",
        hint: "免费，但情感满足",
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.player.mental = Math.min(100, (st.player.mental || 0) + 8);
          if (st.family && st.family.parents) {
            st.family.parents.father.companionship = Math.min(
              100,
              (st.family.parents.father.companionship || 10) + 8,
            );
            st.family.parents.mother.companionship = Math.min(
              100,
              (st.family.parents.mother.companionship || 10) + 8,
            );
          }
          StateManager.addMessage(
            "📞 你和爸妈聊了一个小时。从工作聊到邻居家的小事，最后爸爸说「累了就回家」。你挂断电话，眼眶有点热。心情+12，心智+8。",
            "success",
          );
        },
      },
      {
        text: "😶 随便聊几句就挂了",
        hint: "匆忙，省时间",
        apply: function (st) {
          st.flags._parentBirthdayCallSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 0) - 3);
          StateManager.addMessage(
            "😶 你说「还行，忙呢」就挂了电话。妈妈还想说什么，你已经把手机塞回了口袋。明天可能会后悔。心情-3。",
            "warning",
          );
        },
      },
    ],
  });

  // ====== NPC事件空白区填充：小陈/赵姐相关事件 ======
  // 小陈的夜宵局 — 好感≥30时邀请宵夜，社交+副业两不误
  RANDOM_EVENTS.push({
    id: "xiaochen_night_market",
    phase: "street",
    icon: "🍜",
    title: "骑手的深夜食堂",
    story:
      "晚上十一点，你看到小陈蹲在路边的电瓶车上扒拉盒饭。他看到你，扬了扬手里的筷子：「跑完了？来，这条街有家通宵面馆，老板手艺不错，我请你。」\n\n他的电瓶车灯在夜色里一闪一闪的。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.xiaochen) return false;
      if (!st.relationships.xiaochen.met) return false;
      if ((st.relationships.xiaochen.affinity || 0) < 30) return false;
      if (st.flags._xiaochenNightMarketSeen) return false;
      if (st.player.day < 5) return false;
      return true;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🍜 一起去，聊聊",
        hint: "心情+ 好感+ 副业灵感",
        apply: function (st) {
          st.flags._xiaochenNightMarketSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 12);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 25);
          st.relationships.xiaochen.affinity = Math.min(
            100,
            st.relationships.xiaochen.affinity + 5,
          );
          if (st.skills && st.skills.driving) {
            st.skills.driving.xp = (st.skills.driving.xp || 0) + 15;
          }
          StateManager.addMessage(
            "🍜 你们边吃边聊，小陈说了几个跑单窍门。心情+12，饱食-25，好感+5。",
            "success",
          );
        },
      },
      {
        text: "😅 太累了，回去睡了",
        hint: "保留体力",
        apply: function (st) {
          st.flags._xiaochenNightMarketSeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
          StateManager.addMessage(
            "😅 你说改天吧，小陈也没勉强：「早点休息，明天还要跑呢。」",
            "info",
          );
        },
      },
    ],
  });

  // 赵姐的商业情报 — 好感≥50时分享商业区铺面信息
  RANDOM_EVENTS.push({
    id: "zhaojie_shop_tip",
    phase: "street",
    icon: "🏪",
    title: "赵姐的内幕消息",
    story:
      "赵姐神神秘秘地把你拉到一边，压低声音说：「商业区有家奶茶店要转让，老板娘怀孕回老家了，设备都是九成新。我跟她熟，你要是想干，十万块就能盘下来——正常价至少十五万。」\n\n她拍了拍你的肩：「机会难得，自己琢磨琢磨。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.zhaojie) return false;
      if (!st.relationships.zhaojie.met) return false;
      if ((st.relationships.zhaojie.affinity || 0) < 50) return false;
      if (st.flags._zhaojieShopTipSeen) return false;
      if (st.player.day < 30) return false;
      return true;
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "💰 盘下来！",
        hint: "现金-100000 解锁店面",
        apply: function (st) {
          st.flags._zhaojieShopTipSeen = true;
          if ((st.resources.cash || 0) >= 100000) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100000);
            st.flags._hasShop = true;
            st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            st.relationships.zhaojie.affinity = Math.min(
              100,
              st.relationships.zhaojie.affinity + 8,
            );
            StateManager.addMessage(
              "💰 你盘下了奶茶店！设备齐全，位置也不错。赵姐替你高兴：「好好干！」名气+10。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "💸 你算了算存款，差了八万。赵姐看出你的窘迫：「差多少姐帮你垫点？」但你不想欠太多人情。",
              "warning",
            );
          }
        },
      },
      {
        text: "📝 先看看，钱不够",
        hint: "保留机会，记下信息",
        apply: function (st) {
          st.flags._zhaojieShopTipSeen = true;
          st.flags._zhaojieShopDeal = true;
          StateManager.addMessage(
            "📝 你记下赵姐说的联系方式，说等凑够钱再联系。她点点头：「别太久，好铺子不等人。」",
            "info",
          );
        },
      },
    ],
  });

  // 陈哥的经验之谈 — 好感≥35时分享工地/工厂人脉
  RANDOM_EVENTS.push({
    id: "chen_ge_connections",
    phase: "street",
    icon: "🤝",
    title: "陈哥的人脉",
    story:
      "陈哥叼着烟在街角蹲着，看到你过来招了招手：「小子，听说你最近在找活？我认识城东一个工头，最近缺人，一天¥280管一顿饭。你去了报我名字，他不敢压你价。」\n\n他把烟头摁灭，又补了一句：「别跟人说是我介绍的，我不想欠他人情。」",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.chen_ge) return false;
      if (!st.relationships.chen_ge.met) return false;
      if ((st.relationships.chen_ge.affinity || 0) < 35) return false;
      if (st.flags._chenGeConnectionsSeen) return false;
      if (st.player.day < 15) return false;
      return true;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🙏 谢谢陈哥，我去",
        hint: "现金+280 名声+",
        apply: function (st) {
          st.flags._chenGeConnectionsSeen = true;
          st.resources.cash = (st.resources.cash || 0) + 280;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + 280;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.relationships.chen_ge.affinity = Math.min(
            100,
            st.relationships.chen_ge.affinity + 5,
          );
          StateManager.addMessage(
            "🤝 你按陈哥说的去了工地，果然缺人。工头听说你是陈哥介绍的，多给了你¥30。现金+280，名声+3。",
            "success",
          );
        },
      },
      {
        text: "📱 记下联系方式",
        hint: "保留机会",
        apply: function (st) {
          st.flags._chenGeConnectionsSeen = true;
          st.flags._chenGeContact = true;
          StateManager.addMessage(
            "📱 你说改天去，陈哥把号码发给你了：「别拖太久，活不等人。」",
            "info",
          );
        },
      },
    ],
  });

  // 阿杰的创业邀约 — 好感≥40时邀请一起搞副业
  RANDOM_EVENTS.push({
    id: "ajie_side_project",
    phase: "street",
    icon: "💡",
    title: "阿杰的点子",
    story:
      "阿杰突然在微信上找你，发了一长串语音。你点开听，他声音里带着兴奋：「老同学，我最近在搞一个二手手机翻新的项目，利润空间很大。一台手机收过来¥200，翻新一下能卖¥500。你要不要一起干？你出人手我出渠道，五五分成。」\n\n他发来几张翻新后的手机照片，看起来确实不错。",
    conditions: function (st) {
      if (!st.relationships || !st.relationships.ajie) return false;
      if (!st.relationships.ajie.met) return false;
      if ((st.relationships.ajie.affinity || 0) < 40) return false;
      if (st.flags._ajieSideProjectSeen) return false;
      if (st.player.day < 20) return false;
      return true;
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "💪 一起干！",
        hint: "现金+ 技能+ 启动副业",
        apply: function (st) {
          st.flags._ajieSideProjectSeen = true;
          st.flags._ajiePartnership = true;
          var profit = Random.int(200, 500);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          st.relationships.ajie.affinity = Math.min(
            100,
            st.relationships.ajie.affinity + 8,
          );
          if (st.skills && st.skills.repair) {
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 20;
          }
          StateManager.addMessage(
            "💪 你和阿杰合伙干了一周，翻新了5台手机，净赚¥" +
              profit +
              "！维修XP+20，阿杰好感+8。",
            "success",
          );
        },
      },
      {
        text: "🤔 我先看看",
        hint: "观望，保留机会",
        apply: function (st) {
          st.flags._ajieSideProjectSeen = true;
          StateManager.addMessage(
            "🤔 你说先看看市场。阿杰也不急：「行，你想好了跟我说。」",
            "info",
          );
        },
      },
    ],
  });

  // ====== loop-R26 新增：4个空白区联动事件 ======

  // 事件1：雪天+地点情境 — 废品站的雪夜接头（空白区：snow天气无专属事件）
  RANDOM_EVENTS.push({
    id: "snow_night_scrap_deal",
    phase: "street",
    icon: "❄️",
    title: "雪夜废品站",
    story:
      "雪下了整整一夜，今天早上特别冷。废品站门口蹲着个缩成一团的人，手里拎着个黑色塑料袋——他东张西望，明显在等什么人。老周看了你一眼，压低声音：「这批货来路不太好，但成色真不赖。你要的话，¥800全拿走。」",
    conditions: function (st) {
      // [自洽修复] 检查雪天天气（story 明确"雪下了整整一夜"）
      var isSnowy = st.weather && st.weather.current === "snowy";
      // [自洽修复] 检查已结识老周（直呼"老周"，需已结识）
      var rel = st.relationships && st.relationships.old_zhou;
      if (!rel || !rel.met) return false;
      return (
        st.player.phase === "street" &&
        isSnowy &&
        rel.affinity >= 20 &&
        st.trade &&
        st.trade.currentLocation === "wholesaleMarket" &&
        !st.flags._snowNightScrapSeen
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💰 ¥800全拿下",
        hint: "来路不明但赚",
        cost: 800,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 800); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._snowNightScrapSeen = true;
          var profit = Random.int(400, 1200);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          st.relationships.old_zhou.affinity = Math.min(
            100,
            st.relationships.old_zhou.affinity + 5,
          );
          StateManager.addMessage(
            "💰 你咬着牙付了¥800。拆开发现有几台旧笔记本成色还行，转手净赚¥" +
              profit +
              "。老周看你痛快，好感+5。",
            "success",
          );
        },
      },
      {
        text: "✅ 只挑值钱的要（¥300）",
        hint: "谨慎试水",
        cost: 300,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._snowNightScrapSeen = true;
          var smallProfit = Random.int(100, 450);
          st.resources.cash = (st.resources.cash || 0) + smallProfit;
          st.resources.totalEarned =
            (st.resources.totalEarned || 0) + smallProfit;
          StateManager.addMessage(
            "✅ 你挑了几样确定能卖的，花了¥300，净赚¥" +
              smallProfit +
              "。「眼力见长啊。」老周笑了笑。",
            "info",
          );
        },
      },
      {
        text: "🚶 来路不正，算了",
        hint: "断然拒绝",
        apply: function (st) {
          st.flags._snowNightScrapSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          StateManager.addMessage(
            "🚶 你摇摇头走开了。雪越下越大，但心里踏踏实实的。道德+3。",
            "info",
          );
        },
      },
    ],
  });

  // 事件2：学历/证书里程碑（空白区：教育证书系统零事件覆盖）
  RANDOM_EVENTS.push({
    id: "cert_first_job_bonus",
    phase: "street",
    icon: "🎓",
    title: "证书的第一次兑现",
    story:
      "你去应聘一个还不错的岗位，面试官看了看你的简历，目光停在了那本证书上：「哦，你有这个证？」他抬头看你的眼神变了，从漫不经心变成了认真。\n\n「我们正缺有证的人。试用期工资可以上浮一档。」",
    conditions: function (st) {
      // 检查玩家持有任何证书（state.certificates 非空）
      var hasCert =
        st.certificates &&
        Array.isArray(st.certificates) &&
        st.certificates.length > 0;
      // 检查还没有稳定工作（employment.currentJob === null 或 day < 30）
      var lookingForWork =
        !st.employment || !st.employment.currentJob || st.player.day < 30;
      return (
        st.player.phase === "street" &&
        hasCert &&
        lookingForWork &&
        st.player.day >= 10 &&
        !st.flags._certBonusSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "💼 坦诚谈薪资",
        hint: "用证书争取溢价",
        apply: function (st) {
          st.flags._certBonusSeen = true;
          var raise = Random.int(300, 700);
          st.resources.cash = (st.resources.cash || 0) + raise;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + raise;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "💼 你拿出证书据理力争，对方同意试用期月薪上浮¥" +
              raise +
              "。知识真的能换钱。名气+3。",
            "success",
          );
          // 链式后续：3个月后变现
          scheduleChainEvent(st, "cert_bonus_recurring", 90, "street");
        },
      },
      {
        text: "🙂 接受，先干起来",
        hint: "稳扎稳打",
        apply: function (st) {
          st.flags._certBonusSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "🙂 你把证书复印件给了HR，正式入职。工作有了着落，心情+10。",
            "info",
          );
        },
      },
      {
        text: "🔍 先看看别的机会",
        hint: "不急决定",
        apply: function (st) {
          st.flags._certBonusSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "🔍 你没急着答应，出来后又投了两家比较比较。多一个选择，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // 链式后续：证书工资加成的长期回报
  RANDOM_EVENTS.push({
    id: "cert_bonus_recurring",
    _isChainEvent: true,
    phase: "street",
    icon: "💵",
    title: "证书的力量",
    story:
      "发工资了。你发现自己比同岗位的同事多了¥500——HR说那是「持证津贴」。同事偷偷问你为什么，你笑了笑没解释。晚上回到出租屋，看着多出来的那笔钱，你觉得当初考证花的那些时间值了。",
    conditions: function (st) {
      return (
        st.certificates &&
        Array.isArray(st.certificates) &&
        st.certificates.length > 0 &&
        !st.flags._certRecurringSeen
      );
    },
    probability: 0.6,
    repeatable: false,
    choices: [
      {
        text: "💰 存起来，细水长流",
        hint: "银行储蓄+心理安稳",
        apply: function (st) {
          st.flags._certRecurringSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "💰 你把多出来的¥500存进了银行。细水长流，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🎉 犒劳自己吃顿好的",
        hint: "心情+15",
        apply: function (st) {
          st.flags._certRecurringSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 30);
          StateManager.addMessage(
            "🎉 你破天荒去了趟小馆子，点了个硬菜。努力有了回报的味道，真好。心情+15，饱食-30。",
            "success",
          );
        },
      },
    ],
  });

  // 事件3：NPC好感100传家 — 老周的传家老关系深度兑现（空白区：好感100终极奖励）
  RANDOM_EVENTS.push({
    id: "oldzhou_affinity_max_heritage",
    phase: "street",
    icon: "🗝️",
    title: "老周的信任",
    story:
      "深夜收摊后，老周突然叫住你。他从抽屉里翻出一个泛黄的信封：「小伙子，跟了你这么久，我看你是个靠得住的人。这里面是我当年入行时的几个老客户关系——我年纪大了跑不动了，以后就交给你了。」\n\n信封里有三张名片，手写的电话号码，和一个名字：一个建材老板、一个物业经理、一个拆迁承包商。",
    conditions: function (st) {
      // [自洽修复] 检查已结识老周且好感达到100
      var rel = st.relationships && st.relationships.old_zhou;
      if (!rel || !rel.met) return false;
      return (
        st.player.phase === "street" &&
        rel.affinity >= 100 &&
        st.player.day >= 60 &&
        !st.flags._oldzhouHeritageSeen
      );
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🤝 郑重接过",
        hint: "解锁建材/物业/拆迁三条商业人脉线",
        apply: function (st) {
          st.flags._oldzhouHeritageSeen = true;
          st.flags._oldzhouContactsGiven = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "🤝 你双手接过信封，点了点头。老周眼眶有点红：「别给我丢人。」你获得了三条建材/物业/拆迁人脉线，名气+8，心情+12。",
            "success",
          );
        },
      },
      {
        text: "😢 推辞，说这太重了",
        hint: "老周感动+后续另给",
        apply: function (st) {
          st.flags._oldzhouHeritageSeen = true;
          st.relationships.old_zhou.affinity = 100; // 封顶
          st.relationships.old_zhou.trust = true;
          StateManager.addMessage(
            "😢 你真心觉得受之有愧。老周愣了一下，拍拍你肩膀：「你这人啊……」他没再说，但你知道这份信任已经传递了。",
            "info",
          );
        },
      },
    ],
  });

  // 事件4：低库存市场套利（空白区：交易供需动态零事件覆盖）
  RANDOM_EVENTS.push({
    id: "trading_supply_demand_gap",
    phase: "street",
    icon: "📊",
    title: "市场缺货了",
    story:
      "你路过批发市场，发现好几个摊主都在抱怨同一个问题：最近某种货特别紧俏，进价涨了三成还是拿不到。但你在前面的摊位似乎见过有不少存货——如果现在就低买高卖……",
    conditions: function (st) {
      // 检查玩家有交易经验（总交易次数>0）
      var hasTradeExp =
        st.stats &&
        st.stats.tradeFreq &&
        Object.keys(st.stats.tradeFreq).length > 0;
      return (
        st.player.phase === "street" &&
        hasTradeExp &&
        st.player.day >= 15 &&
        (st.resources.cash || 0) >= 200 &&
        !st.flags._supplyDemandSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "📦 低买高卖赚差价",
        hint: "利用信息差套利",
        cost: 200,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._supplyDemandSeen = true;
          var profit = Random.int(150, 500);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 15;
          }
          StateManager.addMessage(
            "📦 你在前面的摊位低价收了一批，转手以市价卖给急要的摊主。净赚¥" +
              profit +
              "，销售XP+15。",
            "success",
          );
        },
      },
      {
        text: "🤝 告诉缺货的摊主哪里有货",
        hint: "不赚但赚人情",
        apply: function (st) {
          st.flags._supplyDemandSeen = true;
          st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 2);
          StateManager.addMessage(
            "🤝 你告诉缺货的摊主前面有人有货。对方连声感谢。商圈里的人都愿意跟实诚人做生意。道德+3，名气+2。",
            "info",
          );
        },
      },
      {
        text: "👀 观望，不确定就不动",
        hint: "不冒险",
        apply: function (st) {
          st.flags._supplyDemandSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          StateManager.addMessage(
            "👀 你觉得信息不够确认，决定再等等。有时候，不亏钱就等于赚钱。心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // ====== loop-R27 新增：4个高影响空白区填充 ======

  // 事件1：技能满级(level 100) 巅峰时刻 — 区别于已有≥80的「行家找上门」
  // 设计心理学：峰终定律·峰值记忆 — 最难达成瞬间必须有叙事回响
  RANDOM_EVENTS.push({
    id: "skill_absolute_mastery_capstone",
    phase: "street",
    icon: "👑",
    title: "一代宗匠",
    story:
      "你没有刻意追求，但量变终于成了质变——你的手艺已经登峰造极。\n\n" +
      "今天发生了一件小事：一个年轻人慕名而来，怯生生地问你能不能「指点两下」。他说是朋友推荐的——有人说你是这个城市里这方面最厉害的人。\n\n" +
      "你愣了一下。什么时候起，你从那个什么都不会的街头小子，变成了别人口中的「师傅」？",
    conditions: function (st) {
      if (!st.skills) return false;
      // 找到第一个达到100级的技能
      var masterSkill = null;
      for (var sk in st.skills) {
        if (st.skills[sk] && (st.skills[sk].level || 0) >= 100) {
          if (st.flags["_skillCapstone_" + sk]) continue;
          masterSkill = sk;
          break;
        }
      }
      if (!masterSkill) return false;
      return true;
    },
    probability: 0.04,
    repeatable: true, // 每个技能满级都触发一次
    choices: [
      {
        text: "👨‍🏫 收徒，把手艺传下去",
        hint: "名气+10 心智+8（传承满足感）",
        apply: function (st) {
          var sk = st.flags._capstoneReadySkill || null;
          // 重新找到满级技能（apply时flags可能变化）
          if (!sk) {
            for (var s in st.skills) {
              if (st.skills[s] && (st.skills[s].level || 0) >= 100) {
                sk = s;
                break;
              }
            }
          }
          if (sk) st.flags["_skillCapstone_" + sk] = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          StateManager.addMessage(
            "👨‍🏫 你收下了这个徒弟。手艺这东西，练到顶了就该传下去。看着徒弟的眼神，你想起当初的自己。名气+10，心智+8，心情+12。",
            "success",
          );
        },
      },
      {
        text: "✍️ 写下心法笔记发到网上",
        hint: "帮助更多人 名声扩散",
        apply: function (st) {
          var sk = null;
          for (var s in st.skills) {
            if (st.skills[s] && (st.skills[s].level || 0) >= 100) {
              sk = s;
              break;
            }
          }
          if (sk) st.flags["_skillCapstone_" + sk] = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 15);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 5);
          StateManager.addMessage(
            "✍️ 你把这些年积累的心法写成帖子发到网上。从街头到宗匠的修行之路——三天内转发过万，很多人留言说「受益匪浅」。名气+15，道德+5。",
            "success",
          );
        },
      },
      {
        text: "😌 淡淡一笑，继续干活",
        hint: "匠人本色 心情+10",
        apply: function (st) {
          var sk = null;
          for (var s in st.skills) {
            if (st.skills[s] && (st.skills[s].level || 0) >= 100) {
              sk = s;
              break;
            }
          }
          if (sk) st.flags["_skillCapstone_" + sk] = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "😌 你说「指点谈不上，相互学习吧」，然后回头继续干活。山再高，路还得一步一步走。心情+10。",
            "info",
          );
        },
      },
    ],
  });

  // 事件2：六位数财富里程碑 (totalEarned ≥ ¥100,000)
  // 设计心理学：峰终定律·阶段性成就感知
  RANDOM_EVENTS.push({
    id: "wealth_six_figure_milestone",
    phase: "street",
    icon: "💰",
    title: "六位数时刻",
    story:
      "你无意中发现系统提示：累计收入突破了¥100,000。\n\n" +
      "你站在原地发了会儿呆。刚来这座城市的时候，口袋里只有¥300。露宿街头、吃馒头就咸菜、连个像样的住处都没有。\n\n" +
      "现在回头看，那些日子好像又近又远。¥100,000——这个数字三年前想都不敢想。但此刻你站在这里，觉得才刚刚开始。",
    conditions: function (st) {
      return (
        st.player.phase === "street" &&
        (st.resources.totalEarned || 0) >= 100000 &&
        !st.flags._wealthSixFigureSeen
      );
    },
    probability: 0.045,
    repeatable: false,
    choices: [
      {
        text: "🎉 给自己买个大件庆祝",
        hint: "犒劳自己 心情+15",
        cost: 3000,
        apply: function (st) {
          st.flags._wealthSixFigureSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 20);
          StateManager.addMessage(
            "🎉 你买了件一直想要的东西。三年了，这是第一次真正犒劳自己。那些苦，没白吃。心情+15，饱食-20。",
            "success",
          );
        },
      },
      {
        text: "🏦 存起来当启动资金",
        hint: "储蓄安全感 心智+5",
        apply: function (st) {
          st.flags._wealthSixFigureSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          var saveAmount = Math.min(
            st.resources.cash || 0,
            Math.floor((st.resources.cash || 0) * 0.3),
          );
          st.resources.bankBalance =
            (st.resources.bankBalance || 0) + saveAmount;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - saveAmount);
          StateManager.addMessage(
            "🏦 你把¥" +
              saveAmount.toLocaleString() +
              "存进银行。钱是胆气，有了这笔存款，下一步的选择更多了。心智+5。",
            "success",
          );
        },
      },
      {
        text: "📞 打个电话回家报喜",
        hint: "家的温度 心情+12 道德+2",
        apply: function (st) {
          st.flags._wealthSixFigureSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          st.player.morality = Math.min(100, (st.player.morality || 50) + 2);
          StateManager.addMessage(
            "📞 电话那头，妈妈连说了三个「好」。她说别光顾着赚钱，身体最重要。挂了电话，你在路边坐了好一会儿。心情+12，道德+2。",
            "info",
          );
        },
      },
    ],
  });

  // 事件3：住房豪华/豪宅里程碑 (tier 5-6 别墅或豪宅搬家)
  // 设计心理学：峰终定律·购买的终局记忆锚点
  RANDOM_EVENTS.push({
    id: "luxury_housing_new_life",
    phase: "street",
    icon: "🏡",
    title: "新生活的气味",
    story:
      "你站在新房子的窗前——这真的是你的家了。推窗望去，这座城市的夜景尽收眼底。\n\n" +
      "你想起第一次来这个城市的那天，拖着行李箱站在火车站广场上，连¥100一晚的旅馆都嫌贵。\n\n" +
      "那些日子好像已经很久远了。你用了很久，一步步走到了这里。",
    conditions: function (st) {
      var tier = st.housing && st.housing.tier;
      // 仅触发于别墅(5)或豪宅(6)
      if (tier !== 5 && tier !== 6) return false;
      if (st.flags._luxuryHousingSeen) return false;
      // 必须在搬入后30天内触发
      if (!st.housing.rentedDay) return false;
      if (st.player.day - st.housing.rentedDay > 30) return false;
      return st.player.phase === "street";
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🌸 邀请朋友们来新家做客",
        hint: "社交温度 心情+12 好感随机+",
        apply: function (st) {
          st.flags._luxuryHousingSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
          // 给所有已结识NPC随机加好感
          var npcList = st.relationships || {};
          for (var npcId in npcList) {
            if (npcList[npcId].met && npcList[npcId].affinity >= 30) {
              npcList[npcId].affinity = Math.min(
                100,
                (npcList[npcId].affinity || 0) + Random.int(3, 8),
              );
            }
          }
          StateManager.addMessage(
            "🌸 你下厨做了一大桌菜，朋友们来了十几个人。推杯换盏间你觉得——这一切都值了。心情+12，多位好友好感+3~8。",
            "success",
          );
        },
      },
      {
        text: "🪟 独自坐着看了很久的夜景",
        hint: "安静消化成就感 心智+6",
        apply: function (st) {
          st.flags._luxuryHousingSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🪟 你泡了杯茶，坐在窗前看了很久的城市灯火。从吃不饱饭到这座房子——走过来的人才知道这意味着什么。心智+6，心情+8。",
            "info",
          );
        },
      },
      {
        text: "💼 立刻着手规划下一步",
        hint: "行动派 名气+3",
        apply: function (st) {
          st.flags._luxuryHousingSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "💼 你只感慨了三分钟——然后打开电脑开始规划下一步。房子是终点，也是起点。名气+3，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // 事件4：夏季夜市旺季 (season === 'summer' 触发，填补季节叙事空白)
  // 设计心理学：稀缺性·季节性节奏感（夏天来了=夜生活经济爆发）
  RANDOM_EVENTS.push({
    id: "summer_night_market_boom",
    phase: "street",
    icon: "🌙",
    title: "夏夜出摊黄金期",
    story:
      "七月的夜晚热得睡不着，但街头的夜市却热闹非凡——烧烤摊烟雾缭绕、大排档坐满了人、小贩们吆喝声此起彼伏。\n\n" +
      "隔壁卖炒粉的阿珍跟你说：「夏天是我们的旺季，一天能赚两三个月的钱。趁这两个月多攒点，冬天就能歇歇了。」\n\n" +
      "夜风裹着孜然味吹过，几小时后就是这座城市最热闹的几个小时。",
    conditions: function (st) {
      // 检查是否为夏季（season字段）
      var isSummer = st.weather && st.weather.season === "summer";
      return (
        st.player.phase === "street" &&
        isSummer &&
        st.player.day >= 30 &&
        !st.flags._summerNightMarketSeen
      );
    },
    probability: 0.045,
    repeatable: false,
    choices: [
      {
        text: "🔥 趁机出摊多赚一波",
        hint: "疲劳+20 收入++++",
        apply: function (st) {
          st.flags._summerNightMarketSeen = true;
          var profit = Random.int(300, 700);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🔥 你支起了小摊。夏夜里人们兜里有钱也有心情，一晚上净赚¥" +
              profit +
              "。虽然累，但值得。收入¥" +
              profit +
              "，疲劳+20，心情+8。",
            "success",
          );
        },
      },
      {
        text: "🍺 跟朋友去吃烧烤喝啤酒",
        hint: "心情++ 好感+",
        cost: 150,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 150); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._summerNightMarketSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.needs.hunger = Math.max(0, (st.needs.hunger || 0) - 30);
          StateManager.addMessage(
            "🍺 你约了几个朋友，烤串配啤酒，吹着晚风聊到半夜。夏天就这一次，该享受的时候得享受。心情+15，饱食-30。",
            "success",
          );
        },
      },
      {
        text: "😴 不出摊，早点休息",
        hint: "存体力 疲劳-",
        apply: function (st) {
          st.flags._summerNightMarketSeen = true;
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "😴 你忍住诱惑早睡了。细水长流，旺季还长。疲劳-15，心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== loop-R28: NPC↔NPC关系动态（3个事件，填补关系网叙事空白）======

  // 事件1：旧识重逢 — 王婶和老周在巷口偶遇（基于NPC_RELATION_MATRIX: 旧识）
  // 设计意图：让玩家感受NPC有自己的生活，关系网不是摆设
  RANDOM_EVENTS.push({
    id: "npc_reunion_auntzhou",
    phase: "street",
    icon: "🍵",
    title: "巷口的老茶摊",
    story:
      "你路过城中村巷口，看见王婶和老周坐在一张矮桌旁喝茶——他们正聊得起劲，不时爆发出一阵笑声。看见你来了，王婶招手：「来来来，坐下来。我跟老周认识二十年了，当年一起在这城中村扛过来的！」\n\n老周点点头：「那时候她还是小姑娘，天天帮我收拾废品。」\n\n他们要你坐下来一起聊。",
    conditions: function (st) {
      // [自洽修复] 关系网门控：基于NPC_RELATION_MATRIX的 old_acquaintance 关系
      var rel = st.relationships || {};
      // 两个NPC都必须已结识且好感达标
      if (!rel.aunt_wang || !rel.aunt_wang.met) return false;
      if (!rel.old_zhou || !rel.old_zhou.met) return false;
      if ((rel.aunt_wang.affinity || 0) < 30) return false;
      if ((rel.old_zhou.affinity || 0) < 30) return false;
      return st.player.phase === "street" && !st.flags._npcReunionSeen;
    },
    probability: 0.035,
    repeatable: false,
    choices: [
      {
        text: "🪑 坐下听他们聊往事",
        hint: "好感双双+5 解锁关系往事",
        apply: function (st) {
          st.flags._npcReunionSeen = true;
          st.relationships.aunt_wang.affinity = Math.min(
            100,
            (st.relationships.aunt_wang.affinity || 0) + 5,
          );
          st.relationships.old_zhou.affinity = Math.min(
            100,
            (st.relationships.old_zhou.affinity || 0) + 5,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🪑 你坐下来听他们讲二十年的故事。两人的好感各+5，你感觉自己也是这个社区历史的一部分了。心情+8。",
            "success",
          );
        },
      },
      {
        text: "📸 给他们拍张合影",
        hint: "记录美好瞬间 名气+",
        apply: function (st) {
          st.flags._npcReunionSeen = true;
          st.relationships.aunt_wang.affinity = Math.min(
            100,
            (st.relationships.aunt_wang.affinity || 0) + 3,
          );
          st.relationships.old_zhou.affinity = Math.min(
            100,
            (st.relationships.old_zhou.affinity || 0) + 3,
          );
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "📸 你掏出手机给他们拍了张合影。王婶笑得合不拢嘴：「哎呀，这张照片我要放大挂在屋里！」两人好感各+3，名气+3。",
            "success",
          );
        },
      },
      {
        text: "😅 笑着摆摆手走开",
        hint: "不打扰 保留空间",
        apply: function (st) {
          st.flags._npcReunionSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "😅 你摆摆手走开了。那张矮桌旁的笑声，听起来真好。心情+3。",
            "info",
          );
        },
      },
    ],
  });

  // 事件2：竞争的代价 — boss_li和张姐抢活源爆发冲突（基于NPC_RELATION_MATRIX: 竞争/strained）
  // 设计心理学：损失厌恶·选择代价（帮一方=得罪另一方）
  RANDOM_EVENTS.push({
    id: "npc_competitor_clash",
    phase: "street",
    icon: "⚡",
    title: "两边的火气",
    story:
      "你同时收到两条消息——\n\n李工头：「有空吗？这边急需个懂行的人帮两天，日结¥500。」\n\n张姐：「我这边有个急活，靠谱的人介绍过来¥400一天。」\n\n你隐约听说他们最近在争同一个活源。两个人都帮过你，都知道你认识对方。\n\n这次你只能选一边。",
    conditions: function (st) {
      // [自洽修复] 关系网门控：boss_li和张姐存在竞争关系（strained/competitor）
      var rel = st.relationships || {};
      if (!rel.boss_li || !rel.boss_li.met) return false;
      if (!rel.sister_zhang || !rel.sister_zhang.met) return false;
      if ((rel.boss_li.affinity || 0) < 20) return false;
      if ((rel.sister_zhang.affinity || 0) < 20) return false;
      return st.player.phase === "street" && !st.flags._npcClashSeen;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🔨 帮李工头（日结¥500）",
        hint: "老板好感+张姐- 收入高",
        apply: function (st) {
          st.flags._npcClashSeen = true;
          var earn = 500;
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.relationships.boss_li.affinity = Math.min(
            100,
            (st.relationships.boss_li.affinity || 0) + 8,
          );
          st.relationships.sister_zhang.affinity = Math.max(
            -100,
            (st.relationships.sister_zhang.affinity || 0) - 5,
          );
          StateManager.addMessage(
            "🔨 你去了李工头那边。张姐知道后没说话，但看你的眼神变了。竞争之下，没有两全。收入¥500，李工头好感+8，张姐好感-5。",
            "warning",
          );
        },
      },
      {
        text: "🏗️ 帮张姐（日结¥400）",
        hint: "张姐好感+李工头- 收入略低",
        apply: function (st) {
          st.flags._npcClashSeen = true;
          var earn2 = 400;
          st.resources.cash = (st.resources.cash || 0) + earn2;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn2;
          st.relationships.sister_zhang.affinity = Math.min(
            100,
            (st.relationships.sister_zhang.affinity || 0) + 8,
          );
          st.relationships.boss_li.affinity = Math.max(
            -100,
            (st.relationships.boss_li.affinity || 0) - 5,
          );
          StateManager.addMessage(
            "🏗️ 你去了张姐那边。李工头知道后没说话，但看你的眼神变了。收入¥400，张姐好感+8，李工头好感-5。",
            "warning",
          );
        },
      },
      {
        text: "🤝 两边都帮半天（各¥200）",
        hint: "折中 两边好感都不低",
        apply: function (st) {
          st.flags._npcClashSeen = true;
          var half = 200;
          st.resources.cash = (st.resources.cash || 0) + half * 2;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + half * 2;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 15);
          StateManager.addMessage(
            "🤝 你上午去李工头那边，下午去张姐那边。虽然两边都不完全满意，但都没话说。收入¥400（两边各¥200），疲劳+15。",
            "info",
          );
        },
      },
    ],
  });

  // 事件3：同窗纽带 — 陈哥和阿杰是同学，介绍你入行（基于NPC_RELATION_MATRIX: classmate）
  // 设计心理学：社会认同·圈层归属感（"我们都是一路人"）
  RANDOM_EVENTS.push({
    id: "npc_classmate_endorsement",
    phase: "street",
    icon: "🎓",
    title: "老同学的话",
    story:
      "陈哥拍着你肩膀说：「我这个老同学阿杰，脑子活得很。我跟他提了你好几次，说你这人踏实肯干。他最近的项目缺人手，我跟他说了让他带你一带。」\n\n一旁的阿杰笑着点头：「陈哥推荐的人差不了。要不你明天来我那儿聊聊？不全职也行，兼职先试试。」",
    conditions: function (st) {
      // [自洽修复] 关系网门控：陈哥+阿杰都是玩家已结识NPC
      var rel = st.relationships || {};
      if (!rel.chen_ge || !rel.chen_ge.met) return false;
      if (!rel.ajie || !rel.ajie.met) return false;
      if ((rel.chen_ge.affinity || 0) < 40) return false;
      if ((rel.ajie.affinity || 0) < 30) return false;
      return st.player.phase === "street" && !st.flags._npcClassmateSeen;
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🤝 谢谢陈哥引荐，我去聊聊",
        hint: "副业收入 三个人好感+",
        apply: function (st) {
          st.flags._npcClassmateSeen = true;
          var earnings = Random.int(200, 450);
          st.resources.cash = (st.resources.cash || 0) + earnings;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earnings;
          st.relationships.chen_ge.affinity = Math.min(
            100,
            (st.relationships.chen_ge.affinity || 0) + 5,
          );
          st.relationships.ajie.affinity = Math.min(
            100,
            (st.relationships.ajie.affinity || 0) + 8,
          );
          StateManager.addMessage(
            "🤝 你去了阿杰那里。第一次兼职赚了¥" +
              earnings +
              "。陈哥和阿杰对你的好感大增——认识对的人，有时候比埋头苦干更重要。收入¥" +
              earnings +
              "，陈哥好感+5，阿杰好感+8。",
            "success",
          );
        },
      },
      {
        text: "😅 先忙完手头的再说",
        hint: "观望 陈哥略失望",
        apply: function (st) {
          st.flags._npcClassmateSeen = true;
          st.relationships.chen_ge.affinity = Math.max(
            -100,
            (st.relationships.chen_ge.affinity || 0) - 3,
          );
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "😅 你说等忙完这阵子。陈哥摆摆手说「没关系」，但你能看出来他有点失望。心情+3，陈哥好感-3。",
            "info",
          );
        },
      },
      {
        text: "📋 问问具体做什么再决定",
        hint: "详细了解再行动 心智+3",
        apply: function (st) {
          st.flags._npcClassmateSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          StateManager.addMessage(
            "📋 你问了半天细节：做什么、多少钱、需要多久。阿杰一一回答了。你没当即答应，但心里已经有谱了。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== loop-R29: 健康危机·损失厌恶驱动（2个负面里程碑事件，平衡正面成就事件）======

  // 事件1：健康红线 — health < 30 时的身体警报（区别于death事件，这是「慢性恶化」警告）
  // 设计心理学：损失厌恶·预警驱动行动（快失去才知珍贵）
  RANDOM_EVENTS.push({
    id: "health_crisis_slow_collapse",
    phase: "street",
    icon: "🩺",
    title: "身体的账单",
    story:
      "你在工地蹲久了站起来的时候，眼前突然一黑——耳鸣、恶心、小腿不受控制地发抖。\n\n工友老刘扶住你：「你脸色太差了，去看看医生吧。」\n\n你摇摇头说没事。但不是没事。你已经连续三天只能睡四个小时，每天馒头配咸菜，身体的亏空在一点点累计。\n\n今天它开始要账了。",
    conditions: function (st) {
      // 健康低于30但未到濒死（濒死由death事件处理）
      var h = st.status && st.status.health;
      if (h === undefined || h === null) return false;
      if (h > 30) return false;
      if (h < 5) return false; // 濒死区留给更紧急的事件
      return st.player.phase === "street" && !st.flags._healthCrisisSeen;
    },
    probability: 0.05,
    repeatable: false,
    choices: [
      {
        text: "🏥 请假去看病（花¥300）",
        hint: "健康+ 花钱止损",
        cost: 300,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 300); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._healthCrisisSeen = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 12);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "🏥 你去了社区诊所。医生说你是过度劳累+营养不良，开了一周的药。健康+12，心情+5。身体是革命的本钱——这句话真的太对了。",
            "success",
          );
        },
      },
      {
        text: "💊 自己买点药扛过去（花¥50）",
        hint: "稍有缓解 便宜",
        cost: 50,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._healthCrisisSeen = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 5);
          StateManager.addMessage(
            "💊 你在药店买了最便宜的药。健康+5。虽然不根治，但至少不那么难受了。",
            "info",
          );
        },
      },
      {
        text: "✊ 咬咬牙继续干活",
        hint: "收入但健康继续掉",
        apply: function (st) {
          st.flags._healthCrisisSeen = true;
          var earn = Random.int(150, 280);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.status.health = Math.max(0, (st.status.health || 0) - 8);
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          StateManager.addMessage(
            "✊ 你咬着牙上了一天工，赚了¥" +
              earn +
              "。但回家路上腿都在抖。健康-8，心情-8。有时候不选选项也是一种代价。",
            "danger",
          );
        },
      },
    ],
  });

  // 事件2：濒死边缘 — health < 15 时的紧急抉择（death march vs 最后一搏）
  // 设计心理学：峰终定律·人生最低谷（触底时刻的情感最深刻）
  RANDOM_EVENTS.push({
    id: "health_near_death_reckoning",
    phase: "street",
    icon: "🚨",
    title: "最后一次选择",
    story:
      "你醒来发现自己在地上——不知道什么时候晕过去的。头疼得像要裂开，视野边缘发黑。\n\n手机屏幕亮着，是今天的招工信息：日结¥300的搬运活。\n\n你已经三天没吃像样的饭了。口袋里只剩¥" +
      "[CASH]。身体在跟你说「不行了」，但今天不干，明天就没得吃。",
    conditions: function (st) {
      var h = st.status && st.status.health;
      if (h === undefined || h === null) return false;
      if (h >= 15) return false;
      return st.player.phase === "street" && !st.flags._nearDeathSeen;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "🆘 打120救命",
        hint: "救命但负债 健康大幅+",
        apply: function (st) {
          st.flags._nearDeathSeen = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 20);
          // 急救费用：¥1000-3000 负债（无力立即偿还转为债务）
          var bill = Random.int(1000, 3000);
          st.resources.debt = (st.resources.debt || 0) + bill;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "🆘 救护车来了。抢救及时，命保住了。但账单¥" +
              bill +
              "让你欠了新债。健康+20，债务+¥" +
              bill +
              "。活着，就有希望。心情+8。",
            "warning",
          );
        },
      },
      {
        text: "🛏️ 躺一天什么都不干",
        hint: "自然恢复一点 没收入",
        apply: function (st) {
          st.flags._nearDeathSeen = true;
          st.status.health = Math.min(100, (st.status.health || 0) + 8);
          st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
          StateManager.addMessage(
            "🛏️ 你在硬板床上躺了一整天，迷迷糊糊睡睡醒醒。第二天起来好了一点——但没干活就没收入。健康+8，疲劳-20。",
            "info",
          );
        },
      },
      {
        text: "💪 拼最后一次（¥300日结）",
        hint: "要么翻盘 要么更糟",
        apply: function (st) {
          st.flags._nearDeathSeen = true;
          if (Random.chance(0.5)) {
            var big = 300;
            st.resources.cash = (st.resources.cash || 0) + big;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + big;
            st.status.health = Math.max(0, (st.status.health || 0) - 5);
            StateManager.addMessage(
              "💪 你硬撑着干完了一天，拿到¥300。但回家又吐了一场。健康-5。拿命换钱，从来都不划算。",
              "warning",
            );
          } else {
            st.status.health = Math.max(0, (st.status.health || 0) - 12);
            st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 15);
            StateManager.addMessage(
              "💪 你干了半天就被人扶下来了——太虚弱了。工头没给钱让你走了。健康-12，心情-15。今天的代价，很沉重。",
              "danger",
            );
          }
        },
      },
    ],
  });

  // ====== R31 新增：P2 空白区填充 ======

  // ====== ① 技能组合双高门槛：销售+魅力 ======
  // 设计意图：sales≥40 + charm≥30 双技能 combo 解锁"大客户招待"场景
  RANDOM_EVENTS.push({
    id: "skill_combo_big_client",
    phase: "street",
    icon: "🤝",
    title: "大客户招待机会",
    story:
      "今天在市场里，一个穿着西装的中年人一直在看你的摊位。他自称是附近一家公司的采购经理，说看你做事利索、说话得体，想请你帮他们公司做一批员工福利采购——单子不小，但需要你‘能镇住场子’。",
    conditions: function (st) {
      // [自洽修复] 双技能门槛：sales≥40 + charm≥30
      var sales = st.skills && st.skills.sales ? st.skills.sales.level || 0 : 0;
      var charm = st.player ? st.player.charm || 0 : 0;
      return (
        st.player.phase === "street" &&
        sales >= 40 &&
        charm >= 29 &&
        st.player.day >= 30 &&
        !st.flags._bigClientDone
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "💼 亲自接待，谈下这笔单",
        hint: "销售经验+ 魅力+",
        apply: function (st) {
          st.flags._bigClientDone = true;
          var earn = Random.int(800, 1500);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 80;
          }
          st.player.charm = Math.min(100, (st.player.charm || 0) + 3);
          st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          StateManager.addMessage(
            "💼 你用自己的专业态度谈下了这笔福利采购单，到手¥" +
              earn +
              "。销售经验大涨，魅力+3，名气+5。",
            "success",
          );
        },
      },
      {
        text: "🤝 引荐给认识的老板",
        hint: "拿中介费 关系网+",
        apply: function (st) {
          st.flags._bigClientDone = true;
          var fee = Random.int(300, 500);
          st.resources.cash = (st.resources.cash || 0) + fee;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + fee;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          StateManager.addMessage(
            "🤝 你把采购经理引荐给了王婶认识的批发商，拿了¥" +
              fee +
              "中介费。名气+3。",
            "info",
          );
        },
      },
      {
        text: "😅 婉拒了，怕搞砸",
        hint: "什么也不发生",
        apply: function (st) {
          st.flags._bigClientDone = true;
          StateManager.addMessage(
            "😅 你婉拒了对方。大单子确实不是现在的你能接住的。",
            "info",
          );
        },
      },
    ],
  });

  // ====== ② 技能组合双高门槛：修理+管理 ======
  // 设计意图：repair≥30 + management≥20 → 有人邀你合伙开修理铺
  RANDOM_EVENTS.push({
    id: "skill_combo_repair_shop",
    phase: "street",
    icon: "🔧",
    title: "合伙开修理铺的机会",
    story:
      "经常来找你修东西的老赵今天带来一个主意——他说这条街上的住户电器坏了都要跑老远去修，不如你俩合伙在街角租个小铺面，他出钱你出技术，利润对半分。你算了算，这活儿你确实干得了。",
    conditions: function (st) {
      // [自洽修复] 双技能门槛：repair≥30 + management≥20
      var repair =
        st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
      var mgmt =
        st.skills && st.skills.management ? st.skills.management.level || 0 : 0;
      return (
        st.player.phase === "street" &&
        repair >= 30 &&
        mgmt >= 20 &&
        st.player.day >= 40 &&
        !st.flags._repairShopOfferDone
      );
    },
    probability: 0.025,
    repeatable: false,
    choices: [
      {
        text: "👍 同意合伙",
        hint: "副业收入+ 管理+",
        apply: function (st) {
          st.flags._repairShopOfferDone = true;
          st.flags._repairShopPartner = true;
          // 开启副业型收入：每周自动增加
          st.sideHustle = st.sideHustle || {};
          st.sideHustle.repairShop = {
            active: true,
            startedDay: st.player.day,
            totalEarned: 0,
          };
          var startBonus = Random.int(500, 1000);
          st.resources.cash = (st.resources.cash || 0) + startBonus;
          st.resources.totalEarned =
            (st.resources.totalEarned || 0) + startBonus;
          if (st.skills && st.skills.management) {
            st.skills.management.xp = (st.skills.management.xp || 0) + 50;
          }
          StateManager.addMessage(
            "🔧 你和老赵的修理铺开张了！第一个月就分了¥" +
              startBonus +
              "。管理经验+50。",
            "success",
          );
        },
      },
      {
        text: "🛠️ 只接私活，不合伙",
        hint: "修理经验+ 少量现金",
        apply: function (st) {
          st.flags._repairShopOfferDone = true;
          var earn = Random.int(200, 400);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          if (st.skills && st.skills.repair) {
            st.skills.repair.xp = (st.skills.repair.xp || 0) + 60;
          }
          StateManager.addMessage(
            "🛠️ 你接了老赵介绍的几单私活，赚了¥" +
              earn +
              "，修理技术又精进了。",
            "info",
          );
        },
      },
      {
        text: "😅 暂时没精力",
        hint: "婉拒",
        apply: function (st) {
          st.flags._repairShopOfferDone = true;
          StateManager.addMessage(
            "😅 你跟老赵说现在太忙了，以后有机会再说。",
            "info",
          );
        },
      },
    ],
  });

  // ====== ③ 季节 Spring 叙事：春季招聘会 ======
  // 设计意图：春季是招聘旺季，填补季节叙事空白
  RANDOM_EVENTS.push({
    id: "spring_job_fair",
    phase: "street",
    icon: "🌱",
    title: "春季招聘会",
    story:
      "春风吹走了冬天的寒冷。城市广场上搭起了一排排帐篷——一年一度的春季招聘会开始了！几十家企业摆摊招人，从工厂普工到写字楼文员，岗位多得让人眼花缭乱。你手里攥着简历，在人群里挤来挤去。",
    conditions: function (st) {
      // [自洽修复] 检查季节为春季 + 天数≥60
      if (!st.player.totalWorkDays || st.player.totalWorkDays < 1) return false; // [Layer3]
      var season = st.weather && st.weather.season;
      return (
        st.player.phase === "street" &&
        season === "spring" &&
        st.player.day >= 60 &&
        !st.flags._springJobFairDone
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "📄 认真投简历找工作",
        hint: "职业机会+ 智力+",
        apply: function (st) {
          st.flags._springJobFairDone = true;
          st.flags._springJobFairApplied = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 2,
          );
          st.player.mental = Math.min(100, (st.player.mental || 0) + 5);
          StateManager.addMessage(
            "🌱 你投了5份简历，和三个HR聊了聊。感觉离职场又近了一步。智力+2，心智+5。接下来几天可能会有面试通知。",
            "success",
          );
        },
      },
      {
        text: "👀 只是看看行情",
        hint: "了解市场",
        apply: function (st) {
          st.flags._springJobFairDone = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 0) + 1,
          );
          StateManager.addMessage(
            "👀 你转了一圈，了解了各行业薪资水平。心里有底了。智力+1。",
            "info",
          );
        },
      },
      {
        text: "📢 帮朋友打听岗位",
        hint: "名声+",
        apply: function (st) {
          st.flags._springJobFairDone = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage(
            "📢 你帮几个工友打听了合适的岗位，他们都很感激。名气+3，心情+5。",
            "info",
          );
        },
      },
    ],
  });

  // ====== ④ 季节 Autumn 叙事：秋收集市 ======
  // 设计意图：秋季是丰收季节，填补季节叙事空白
  RANDOM_EVENTS.push({
    id: "autumn_harvest_market",
    phase: "street",
    icon: "🍂",
    title: "秋收集市",
    story:
      "秋天的风带着果香和桂花味。城郊的农户们拉着满车的时令水果和蔬菜进城来了——红彤彤的苹果、金黄的柿子、刚挖出来的红薯。批发市场的价格比平时低了三成，但周末的市民市集上，这些农产品能卖出好价钱。",
    conditions: function (st) {
      // [自洽修复] 检查季节为秋季 + 天数≥30
      var season = st.weather && st.weather.season;
      return (
        st.player.phase === "street" &&
        season === "autumn" &&
        st.player.day >= 30 &&
        !st.flags._autumnHarvestDone
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "💰 批发水果去市集卖",
        hint: "赚差价 需要本钱",
        cost: 200,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._autumnHarvestDone = true;
          var profit = Random.int(300, 600);
          st.resources.cash = (st.resources.cash || 0) + profit;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
          if (st.skills && st.skills.sales) {
            st.skills.sales.xp = (st.skills.sales.xp || 0) + 30;
          }
          StateManager.addMessage(
            "🍂 你批了一箱苹果和一筐柿子，周末在市集上卖了个精光，净赚¥" +
              profit +
              "。销售经验+30。",
            "success",
          );
        },
      },
      {
        text: "🍎 买些水果犒劳自己",
        hint: "心情+ 健康+",
        cost: 50,
        apply: function (st) {
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 50); // [全系统自洽修复] 域B 修复:cost扣款缺失
          st.flags._autumnHarvestDone = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
          st.status.health = Math.min(100, (st.status.health || 70) + 3);
          StateManager.addMessage(
            "🍎 你买了一兜苹果和几个柿子，坐在公园长椅上吃了个痛快。秋天真好啊。心情+15，健康+3。",
            "success",
          );
        },
      },
      {
        text: "🚶 看看就好，不买",
        hint: "省钱",
        apply: function (st) {
          st.flags._autumnHarvestDone = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "🚶 你在集市里逛了一圈，闻着果香也挺满足的。心情+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== ⑤ 装备品质里程碑：首次获得高品质装备 ======
  // 设计意图：玩家第一次获得高品质装备时的仪式感事件
  RANDOM_EVENTS.push({
    id: "equipment_first_high_quality",
    phase: "street",
    icon: "✨",
    title: "意外的好东西",
    story:
      "你在翻找旧货时，手指碰到了一件手感格外特别的东西——拿起来仔细一看，成色比普通货色好太多了！这东西做工精良、用料扎实，一看就不是大路货。旁边的人凑过来问你在哪找到的，你心里美滋滋的。",
    conditions: function (st) {
      // [自洽修复] 玩家有高品质装备 或 首次获得高品质装备的flag
      var hasHighQuality = false;
      var eq = st.inventory && st.inventory.equipmentInstances;
      if (eq) {
        for (var slot in eq) {
          var inst = eq[slot];
          if (
            inst &&
            (inst.quality === "good" ||
              inst.quality === "excellent" ||
              inst.quality === "rare")
          ) {
            hasHighQuality = true;
            break;
          }
        }
      }
      // 也检查物品栏
      var items = st.inventory && st.inventory.items;
      if (items && !hasHighQuality) {
        // 如果有通用标志，也放行
      }
      return (
        st.player.phase === "street" &&
        st.player.day >= 15 &&
        hasHighQuality &&
        !st.flags._equipQualityMilestoneSeen
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "🧼 精心保养这件装备",
        hint: "耐久+ 心情+",
        apply: function (st) {
          st.flags._equipQualityMilestoneSeen = true;
          // 给所有高品质装备加耐久
          var eq2 = st.inventory && st.inventory.equipmentInstances;
          if (eq2) {
            for (var s2 in eq2) {
              var inst2 = eq2[s2];
              if (
                inst2 &&
                typeof inst2.durability === "number" &&
                (inst2.quality === "good" ||
                  inst2.quality === "excellent" ||
                  inst2.quality === "rare")
              ) {
                inst2.durability = Math.min(100, inst2.durability + 10);
              }
            }
          }
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          StateManager.addMessage(
            "✨ 你花了一下午把这件宝贝擦得锃亮，保养得妥妥当当。心情+8。好东西值得好好对待。",
            "success",
          );
        },
      },
      {
        text: "📸 发朋友圈显摆一下",
        hint: "名气+ 心情+",
        apply: function (st) {
          st.flags._equipQualityMilestoneSeen = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 4);
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
          StateManager.addMessage(
            "📸 你发了朋友圈，收获了几十个赞。朋友都在问在哪淘的。名气+4，心情+10。",
            "success",
          );
        },
      },
      {
        text: "🤫 低调收好，不声张",
        hint: "财不外露",
        apply: function (st) {
          st.flags._equipQualityMilestoneSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 3);
          StateManager.addMessage(
            "🤫 你默默收好了这件宝贝。心里有数就好——好东西自己知道就行。心智+3。",
            "info",
          );
        },
      },
    ],
  });

  // ====== R120 新增：5个空白区联动事件 ======

  // ① 老手特遇：长期做同一工作30天+ → 遇到老客户/贵人
  // 设计意图：填补"玩家长期做某类工作后的老手特遇"空白区
  RANDOM_EVENTS.push({
    id: "r120_veteran_client",
    phase: "street",
    icon: "🤝",
    title: "老客户的关照",
    story:
      "今天在市场里忙了一整天，收摊的时候一个熟客走过来，拍了拍你的肩膀说：「你在这条街干了不少时间了吧？我有个亲戚要搬家，需要人帮忙搬东西——一天¥300，干不干？」你愣了一下，没想到平时只是买卖关系的顾客，竟然记住了你。",
    conditions: function (st) {
      // [自洽修复] 检查玩家是否有任一工作类型的累计行动≥30次（老手标志）
      var freq = st.stats && st.stats.actionFreq ? st.stats.actionFreq : {};
      var total = 0;
      for (var k in freq) {
        if (Object.prototype.hasOwnProperty.call(freq, k) && freq[k] > total) {
          total = freq[k];
        }
      }
      return (
        st.player.phase === "street" &&
        st.player.day >= 35 &&
        total >= 30 &&
        !st.flags._veteranClientSeen
      );
    },
    probability: 0.03,
    repeatable: false,
    choices: [
      {
        text: "📦 接！搬东西赚钱",
        hint: "体力消耗大但收入高",
        apply: function (st) {
          st.flags._veteranClientSeen = true;
          var earn = Random.int(280, 380);
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 20);
          st.player.physique = Math.min(100, (st.player.physique || 22) + 1);
          StateManager.addMessage(
            "🤝 你帮那位熟客搬了一整天东西，赚了¥" +
              earn +
              "。搬完回家时胳膊都抬不起来，但钱是真的。体质+1，疲劳+20。",
            "success",
          );
        },
      },
      {
        text: "📋 问问能不能介绍更多人",
        hint: "拓展人脉",
        apply: function (st) {
          st.flags._veteranClientSeen = true;
          st.flags._veteranReferral = true;
          st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "🤝 你问能不能介绍更多人搬家。对方想了想：「行啊，把你电话给我，有活我就找你。」人脉+3，心智+2。",
            "success",
          );
        },
      },
      {
        text: "😅 今天太累了，改天吧",
        hint: "休息为主",
        apply: function (st) {
          st.flags._veteranClientSeen = true;
          st.player.mental = Math.min(100, (st.player.mental || 26) + 2);
          StateManager.addMessage(
            "🤝 你说了声抱歉。对方摆摆手：「没事，你在这条街干得不错，以后有活我再找你。」心智+2。",
            "info",
          );
        },
      },
    ],
  });

  // ② 专业人士视角：修理技能≥40 → 二手市场识别好货
  // 设计意图：填补"技能到达门槛后解锁专业人士视角"空白区
  RANDOM_EVENTS.push({
    id: "r120_repair_expert_eye",
    phase: "street",
    icon: "🔍",
    title: "行家眼光",
    story:
      "你路过二手市场，一个摊主正吆喝着卖旧家电。你扫了一眼——冰箱压缩机是原厂件，洗衣机主板没修过痕迹。这些东西在普通人眼里就是一堆旧铁，但你的眼睛告诉你：这里面有宝。",
    conditions: function (st) {
      // [自洽修复] 检查修理技能≥40（专业人士门槛）+ 在二手市场
      var repairLevel =
        st.skills && st.skills.repair ? st.skills.repair.level || 0 : 0;
      var curLoc = st.trade && st.trade.currentLocation;
      return (
        st.player.phase === "street" &&
        repairLevel >= 40 &&
        curLoc === "secondHandMarket" &&
        !st.flags._repairExpertEyeSeen
      );
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "🔧 挑几件便宜的买回去修",
        hint: "低价购入 高价卖出",
        apply: function (st) {
          st.flags._repairExpertEyeSeen = true;
          if ((st.resources.cash || 0) >= 200) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
            var profit = Random.int(400, 800);
            st.resources.cash = (st.resources.cash || 0) + profit;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            if (st.skills && st.skills.repair) {
              st.skills.repair.xp = (st.skills.repair.xp || 0) + 50;
            }
            StateManager.addMessage(
              "🔍 你花¥200挑了三件旧家电，回去花了两天修好转手卖了¥" +
                profit +
                "。修理XP+50。外行看热闹，内行看门道——你的门道值这个价。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🔍 你看准了几件好货，但口袋里钱不够。你记住了摊主的位置——下次有钱再来。",
              "info",
            );
          }
        },
      },
      {
        text: "📝 记下心得，不买东西",
        hint: "纯学习 无消耗",
        apply: function (st) {
          st.flags._repairExpertEyeSeen = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 20) + 2,
          );
          st.player.mental = Math.min(100, (st.player.mental || 26) + 3);
          StateManager.addMessage(
            "🔍 你在市场里转了一圈，光看就学到了不少辨别家电好坏的门道。智力+2，心智+3。行家之路，从观察开始。",
            "success",
          );
        },
      },
      {
        text: "🚶 不感兴趣，走了",
        hint: "不浪费时间",
        apply: function (st) {
          st.flags._repairExpertEyeSeen = true;
          StateManager.addMessage(
            "🔍 你摇了摇头走开了。看归看，买还得看钱包脸色。",
            "info",
          );
        },
      },
    ],
  });

  // ③ NPC意外发现：老周好感≥60 → 透露隐藏废品渠道
  // 设计意图：填补"NPC好感积累后的意外发现"空白区
  RANDOM_EVENTS.push({
    id: "r120_old_zhou_secret_channel",
    phase: "street",
    icon: "🤫",
    title: "老周的暗线",
    story:
      "你在废品站旁边等老周，他突然把你拉到一边，左右看了看说：「有个事我一直没跟别人说——城东工业园那边有个仓库，每个月月底都要清一批报废零件。别人收¥1/kg，我认识管理员，¥0.5/kg就能拿走。」他顿了顿，「这事你别跟第三个人说。」",
    conditions: function (st) {
      // [自洽修复] 检查老周好感≥60 + 已结识 + 天数>40
      var rel = st.relationships && st.relationships.old_zhou;
      return (
        st.player.phase === "street" &&
        rel &&
        rel.met &&
        (rel.affinity || 0) >= 60 &&
        st.player.day >= 40 &&
        !st.flags._oldZhouSecretChannelSeen
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 谢了周叔，第一次一起去",
        hint: "首次半价收废品",
        apply: function (st) {
          st.flags._oldZhouSecretChannelSeen = true;
          st.flags._secretChannelUnlocked = true;
          if ((st.resources.cash || 0) >= 500) {
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500);
            var profit = Random.int(800, 1500);
            st.resources.cash = (st.resources.cash || 0) + profit;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + profit;
            st.relationships.old_zhou.affinity = Math.min(
              100,
              (st.relationships.old_zhou.affinity || 0) + 10,
            );
            StateManager.addMessage(
              "🤫 你跟着老周去了城东工业园，花¥500/kg半价收了价值¥" +
                profit +
                "的报废零件。老周对你更信任了，好感+10。这条暗线以后可以常走。",
              "success",
            );
          } else {
            StateManager.addMessage(
              "🤫 你想去但启动资金不够。老周说：「没事，攒够了钱我叫你。」好感+3。",
              "info",
            );
          }
        },
      },
      {
        text: "📝 先记下，以后再说",
        hint: "不花钱先记住",
        apply: function (st) {
          st.flags._oldZhouSecretChannelSeen = true;
          st.flags._secretChannelKnown = true;
          st.player.intelligence = Math.min(
            100,
            (st.player.intelligence || 20) + 1,
          );
          st.relationships.old_zhou.affinity = Math.min(
            100,
            (st.relationships.old_zhou.affinity || 0) + 5,
          );
          StateManager.addMessage(
            "🤫 你把地址记在了手机备忘录里。老周拍拍你肩膀：「年轻人谨慎是对的。」好感+5，智力+1。",
            "success",
          );
        },
      },
      {
        text: "🚫 太冒险了，算了",
        hint: "拒绝 关系微降",
        apply: function (st) {
          st.flags._oldZhouSecretChannelSeen = true;
          st.relationships.old_zhou.affinity = Math.max(
            -100,
            (st.relationships.old_zhou.affinity || 0) - 5,
          );
          StateManager.addMessage(
            "🤫 你摇了摇头。老周叹了口气：「也是，这事儿确实不方便明说。」好感-5。",
            "warning",
          );
        },
      },
    ],
  });

  // ④ 天气×位置组合：暴雨时在市场 vs 暴雨时在公园
  // 设计意图：填补"天气与当前位置组合的情境事件"空白区
})();
