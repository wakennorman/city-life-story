/**
 * 域C(职业/成长) 联动增强 R191
 * 主题承接本轮A类修复：long_haul_driver 死工作复活（requiredFlag 由无效的
 *   "_synergy_driving_accounting" 改为真实连携 "_synergy_driving_logistics"「长途运输」）。
 *   连携真正可激活后，「技能连携 → 副业/社交/成长」的价值链才闭合——本轮为其补三条桥接。
 * 桥接：
 *   C→E  skill_r191_synergy_gig    长途运输连携激活 → 有人介绍跑长途私活 → 一次性现金收入(资本积累)
 *   C→D  skill_r191_peer_respect   一技傍身赢得同行/街坊认可 → 已结识NPC好感(applyAffinityChange 守 met)
 *   C→G  skill_r191_hard_won       回望一路练就的硬本事 → 心智/幸福感(成长叙事，区别于R170里程碑事件)
 *
 * 严格照 domain_b_linkage_r190.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段(minDay/minCash/excludeFlags)、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   技能容器 st.skills.<key>.level（真实键 driving/accounting/…）；心智 st.player.mental；
 *   幸福 st.needs.happiness；现金 st.resources.cash；连携 flag st.flags._synergy_driving_logistics（skill_synergy.js 设置）；
 *   NPC 好感走 applyAffinityChange 守 rel.met（域D铁律，只读 relationships）。数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR191Loaded) return;
  RANDOM_EVENTS._domainCLinkageR191Loaded = true;

  // 安全读取技能等级（技能容器/子对象可能未初始化）
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 取首个已结识(met)的 NPC id——避免硬编码未激活NPC致死事件（域D铁律：只读 relationships + rel.met 守卫）
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      // C→E: 长途运输连携激活后，老货主辗转找上门，想请你帮忙跑一趟私活——技能连携第一次直接变现
      id: "skill_r191_synergy_gig",
      phase: "street",
      _isChainEvent: false,
      icon: "🚛",
      title: "连携接来的私活",
      story:
        "「听说你开车稳、账也算得清？」一位相熟的货主辗转找上门。你的驾驶和记账两门本事拧成了『长途运输』的连携，在圈子里传开了——有人愿意出高价请你帮忙跑一趟跨省的急货。活儿累，钱却实在。接不接？",
      triggers: { minDay: 20, excludeFlags: ["_skillR191GigSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        // 连携已激活(flag) 或 driving+accounting 都已有底子——双保险，避免 flag 时序漏触发
        var flagOn = st.flags && st.flags._synergy_driving_logistics;
        var skillOn = skillLv(st, "driving") >= 3 && skillLv(st, "accounting") >= 3; // [PLACEHOLDER]
        return !!(flagOn || skillOn);
      },
      choices: [
        {
          text: "🚚 接下这趟私活,连夜出发",
          hint: "现金+,疲劳+,驾驶经验+",
          apply: function (st) {
            st.flags._skillR191GigSeen = true;
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 1200; // [PLACEHOLDER] 私活报酬
            if (st.player)
              st.player.fatigue = Math.min(100, (st.player.fatigue || 0) + 20); // [PLACEHOLDER]
            if (typeof addSkillXp === "function") addSkillXp("driving", 5); // [PLACEHOLDER] 真实技能键
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🚚 一趟长途跑下来,人是散了架,兜里却添了实实在在的一笔——原来两门本事凑到一处,真能生钱。",
                "success",
              );
          },
        },
        {
          text: "😴 婉拒,身子骨要紧",
          hint: "保存体力,无变化",
          apply: function (st) {
            st.flags._skillR191GigSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😴 你摆摆手推了这趟活——钱是好,可身子是本钱,细水长流才走得远。",
                "info",
              );
          },
        },
      ],
    },
    {
      // C→D: 手艺练到一定火候,同行/街坊看在眼里,主动来请教切磋——一技傍身换来的是人情与认可
      id: "skill_r191_peer_respect",
      phase: "street",
      _isChainEvent: false,
      icon: "🤝",
      title: "同行的一声认可",
      story:
        "你在某门手艺上下的功夫,街坊同行都看在眼里。今天有人特地绕过来,想跟你讨教两手、顺便搭把手。行当里最难得的,不是钱,是这份『你行』的认可——它能换来往后一路的照应。",
      triggers: { minDay: 26, excludeFlags: ["_skillR191PeerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        if (firstMetNpc(st) === null) return false; // 需有已结识街坊
        // 任一核心手艺已练出名堂
        var top = Math.max(
          skillLv(st, "repair"),
          skillLv(st, "cooking"),
          skillLv(st, "driving"),
          skillLv(st, "electrician"),
          skillLv(st, "welding"),
        );
        return top >= 4; // [PLACEHOLDER] 手艺门槛
      },
      choices: [
        {
          text: "🤝 大方指点,顺手帮个忙",
          hint: "街坊好感+,心情+",
          apply: function (st) {
            st.flags._skillR191PeerSeen = true;
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 6, "手艺赢得同行认可"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🤝 你把压箱底的窍门倾囊相授,对方连声道谢——手艺不吝人,人情自会还。",
                "success",
              );
          },
        },
        {
          text: "🙂 谦虚几句,留一手看家本事",
          hint: "务实,好感小幅+",
          apply: function (st) {
            st.flags._skillR191PeerSeen = true;
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 2, "谦逊待人"); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🙂 你笑着谦虚了几句,该露的露、该藏的藏——手艺是饭碗,分寸也得有。",
                "info",
              );
          },
        },
      ],
    },
    {
      // C→G: 夜深回望这一路练就的硬本事,五味杂陈——成长的叙事层，把零散技能升华成"我是怎么走到今天的"
      id: "skill_r191_hard_won",
      phase: "street",
      _isChainEvent: false,
      icon: "🌱",
      title: "一路练就的本事",
      story:
        "夜里收工,你无意间盘点起自己这些年攒下的本事:从什么都不会,到如今样样能上手。每一样都是熬出来、磨出来的。这座城市从不心软,可你到底还是靠着一双手,给自己挣出了一块立足之地。",
      triggers: { minDay: 40, excludeFlags: ["_skillR191HardWonSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        // 至少练出两门有底子的手艺,回望才有分量
        var count = 0;
        var keys = [
          "cooking", "repair", "coding", "english", "driving", "sales",
          "management", "accounting", "electrician", "welding", "medicine", "social",
        ];
        for (var i = 0; i < keys.length; i++) {
          if (skillLv(st, keys[i]) >= 3) count++; // [PLACEHOLDER]
        }
        return count >= 2;
      },
      choices: [
        {
          text: "🌱 郑重地记下这份不易",
          hint: "心智+,幸福感+",
          apply: function (st) {
            st.flags._skillR191HardWonSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🌱 你把这份不易郑重记在心里——本事是别人抢不走的底气,日子再难,手上有活就不慌。",
                "success",
              );
          },
        },
        {
          text: "😌 一笑而过,继续赶路",
          hint: "平静,心智小幅+",
          apply: function (st) {
            st.flags._skillR191HardWonSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😌 你笑了笑,没多想——路还长,本事还得接着练,感慨留到以后再说。",
                "info",
              );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
