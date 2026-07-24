/**
 * 域G(核心机制/生命周期) 联动增强 R192
 * 主题承接本轮A类修复：life_ribbon.js「房奴一生」缎带死字段修复
 *   （原读 p.isSelfOccupied/p.mortgageRemaining 恒 undefined→缎带永不授予，
 *     改读真实字段 st.investment.selfLivePropertyId + st.family.mortgage.remainingDays）。
 *   「拥有自住房 / 背负房贷」这条生命周期主线此前只在缎带结算被读取、游戏过程中
 *   毫无叙事回响——本轮为其补三条跨域桥接，把「安家」里程碑接入社交/职业/数值成长。
 * 桥接：
 *   G→D  life_r192_housewarming     有了自己的家 → 请相熟街坊来暖房 → 已结识NPC好感(applyAffinityChange 守 met)
 *   G→C  life_r192_settled_focus    有了安稳落脚地 → 心气回稳、重拾手艺打磨 → addSkillXp(真实键)
 *   G→A  life_r192_mortgage_grit    月月还贷磨出的精打细算 → 心智/幸福感的数值成长(区别于纯金钱)
 *
 * 严格照 domain_c_linkage_r191.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段(minDay/excludeFlags)、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实（写条件前均已 grep 核对）：
 *   自住房 st.investment.selfLivePropertyId(state.js:216 初始化为 null，investment.js 维护)；
 *   家庭房贷 st.family.mortgage.remainingDays(daily_pipeline.js:1165 family_mortgage_tick 维护)；
 *   心智 st.player.mental；幸福 st.needs.happiness；技能 addSkillXp(真实键 repair/cooking/…)；
 *   NPC 好感一律走 applyAffinityChange 守 rel.met（域D铁律，只读 relationships）。数值 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR192Loaded) return;
  RANDOM_EVENTS._domainGLinkageR192Loaded = true;

  // 是否拥有自住房（真实字段 selfLivePropertyId，null/undefined 均视为无）
  function hasSelfHome(st) {
    return !!(st && st.investment && st.investment.selfLivePropertyId != null);
  }

  // 家庭房贷剩余天数（无 mortgage 结构时安全返回 0）
  function mortgageDaysLeft(st) {
    if (!st || !st.family || !st.family.mortgage) return 0;
    return st.family.mortgage.remainingDays || 0;
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
      // G→D: 有了自己的家,总想请相熟的街坊来坐坐——「安家」这件人生大事,值得和人分享
      id: "life_r192_housewarming",
      phase: "street",
      _isChainEvent: false,
      icon: "🏠",
      title: "暖房这件小事",
      story:
        "钥匙攥在手里,墙是自己的,灯也是自己的。这座城市转了一圈,你到底有了一块真正属于自己的落脚地。夜里你忽然想:该请相熟的街坊来坐坐——热热闹闹地暖个房,这份踏实,总要有人一起见证才算数。",
      triggers: { minDay: 30, excludeFlags: ["_lifeR192HousewarmSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!hasSelfHome(st)) return false; // 需已拥有自住房
        if (firstMetNpc(st) === null) return false; // 需有已结识街坊
        return true;
      },
      choices: [
        {
          text: "🍲 备一桌家常菜,请街坊来暖房",
          hint: "街坊好感+,心情+",
          apply: function (st) {
            st.flags._lifeR192HousewarmSeen = true;
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 6, "请街坊暖房"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6); // [PLACEHOLDER]
            if (st.resources)
              st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200); // [PLACEHOLDER] 待客花销
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🍲 一桌热菜、几句家常,屋子里第一次有了人气——原来『家』不只是砖和墙,是有人愿意进来坐坐。",
                "success",
              );
          },
        },
        {
          text: "🤫 先自己好好安顿,暖房不急",
          hint: "务实,心情小幅+",
          apply: function (st) {
            st.flags._lifeR192HousewarmSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🤫 你先把里里外外收拾妥帖——暖房的热闹不急,先把自己的日子过安稳了再说。",
                "info",
              );
          },
        },
      ],
    },
    {
      // G→C: 有了安稳的落脚地,心不再飘,人反而沉得下来重拾手艺——安居而后乐业
      id: "life_r192_settled_focus",
      phase: "street",
      _isChainEvent: false,
      icon: "🧭",
      title: "安顿后的心气",
      story:
        "从前租来的屋子住不长久,总有种随时要搬走的漂泊感,连练本事都静不下心。如今有了自己的窝,脚下踏实了,心也定了。你翻出搁置已久的工具,想把手上的活儿再往深里磨一磨——安居了,才谈得上乐业。",
      triggers: { minDay: 45, excludeFlags: ["_lifeR192SettledSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!hasSelfHome(st)) return false; // 安家是前提
        if (!st.skills) return false;
        return true;
      },
      choices: [
        {
          text: "🔧 沉下心,把看家本事再练深",
          hint: "技能经验+,心智+",
          apply: function (st) {
            st.flags._lifeR192SettledSeen = true;
            // 从玩家已有底子的手艺里挑一门追加经验，无则默认 repair（真实键，addSkillXp 内部容错）
            var keys = [
              "repair", "cooking", "driving", "electrician", "welding",
              "coding", "accounting", "management", "sales", "english",
            ];
            var pick = "repair";
            var best = -1;
            for (var i = 0; i < keys.length; i++) {
              var k = keys[i];
              var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0;
              if (lv > best) { best = lv; pick = k; }
            }
            if (typeof addSkillXp === "function") addSkillXp(pick, 8); // [PLACEHOLDER] 真实技能键
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🔧 灯下重新拿起家伙什,一招一式都比从前稳——脚跟站住了,手上的功夫才真长得进去。",
                "success",
              );
          },
        },
        {
          text: "☕ 先歇口气,享受这份难得的安稳",
          hint: "放松,幸福感+",
          apply: function (st) {
            st.flags._lifeR192SettledSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "☕ 你给自己泡了杯茶,靠在窗边什么也不干——漂泊了这么久,这份安稳值得先好好受用一阵。",
                "info",
              );
          },
        },
      ],
    },
    {
      // G→A: 月月盯着还贷的日子,逼着你把每一分钱都算清楚——压力磨出的精打细算,是攒钱之外的成长
      id: "life_r192_mortgage_grit",
      phase: "street",
      _isChainEvent: false,
      icon: "📒",
      title: "还贷磨出的算计",
      story:
        "房贷像头顶悬着的一笔账,月月要还。为了不断供,你开始把每一笔开销都记在心里:哪顿饭能省、哪样东西该等打折。日子是紧了些,可你也第一次真正摸清了自己钱袋子的深浅——这份精打细算,是压力硬逼出来的本事。",
      triggers: { minDay: 50, excludeFlags: ["_lifeR192MortgageGritSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        if (mortgageDaysLeft(st) <= 0) return false; // 需仍在还贷
        return true;
      },
      choices: [
        {
          text: "📒 认下这份精打细算,记进心里",
          hint: "心智+,幸福感+",
          apply: function (st) {
            st.flags._lifeR192MortgageGritSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "📒 你把日常开销一笔笔理顺,心里那本账越来越清——还贷的压力,竟也换来了一份对钱的清醒。",
                "success",
              );
          },
        },
        {
          text: "😮‍💨 太累了,别把弦绷得太紧",
          hint: "松口气,心智小幅+",
          apply: function (st) {
            st.flags._lifeR192MortgageGritSeen = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😮‍💨 你决定别太苛待自己——账要算,可日子也得过,弦绷得太紧,人先垮了。",
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
