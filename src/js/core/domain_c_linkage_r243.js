/**
 * 域C(职业/成长) 联动增强 R243
 * 背景：C域A类修复：6处 addSkillXp("finance"/"physique") 非真实技能键→映射到accounting/repair。
 *   此外，C域联动方向仍有三个显著缺口：
 *   1) C→B 职业技能街头回响 — 玩家学到的本事从没用上；
 *   2) C→D 技能分支圈子归属 — SKILL_BRANCHES有30+分支定义但零事件消费；
 *   3) C→A/E 证书生活变现 — 证书只有工资加成没有日常生活折扣叙事。
 * 桥接：
 *   C→B  skill_street_echo          专业技能≥Lv.30→街头派上用场, cash+心智
 *   C→D  skill_branch_recognition    首个技能分支解锁→圈子归属感, NPC好感+心智
 *   C→A/E cert_life_shortcut         持有实用证书→日常生活隐性优惠, cash+心智
 *
 * 严格照 domain_c_linkage_r191.js 已验证 IIFE 注入范式。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR243Loaded) return;
  RANDOM_EVENTS._domainCLinkageR243Loaded = true;

  // 安全读取技能等级
  function skillLv(st, key) {
    if (!st || !st.skills || !st.skills[key]) return 0;
    return st.skills[key].level || 0;
  }

  // 取首个已结识(met)的NPC id——避免硬编码未激活NPC致死事件
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 获取玩家最高等级技能键及等级
  function topSkillKeyAndLevel(st) {
    var keys = ["cooking", "repair", "coding", "english", "driving", "sales",
                "management", "accounting", "electrician", "welding", "medicine", "social"];
    var bestKey = null;
    var bestLv = 0;
    for (var i = 0; i < keys.length; i++) {
      var lv = skillLv(st, keys[i]);
      if (lv > bestLv) { bestLv = lv; bestKey = keys[i]; }
    }
    return { key: bestKey, level: bestLv };
  }

  // 技能名中文映射
  var SKILL_CN = {
    cooking: "厨艺", repair: "维修", coding: "编程", english: "英语",
    driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
    electrician: "电工", welding: "焊工", medicine: "护理", social: "社交"
  };

  // 不同技能的街头场景描述
  function getSkillStreetScene(st) {
    var top = topSkillKeyAndLevel(st);
    if (!top.key) return { cn: "手艺", scene: "帮街坊解决了个难题", cashMin: 150, cashMax: 400 };
    var sceneMap = {
      cooking: { desc: "夜市出摊", cashMin: 200, cashMax: 500 },
      repair: { desc: "帮邻居修好了漏水的水管", cashMin: 150, cashMax: 350 },
      coding: { desc: "帮朋友的小店写了个下单小程序", cashMin: 300, cashMax: 600 },
      english: { desc: "导游团临时缺人,你客串了半小时翻译", cashMin: 200, cashMax: 400 },
      driving: { desc: "顺路帮人捎了一趟急件", cashMin: 150, cashMax: 300 },
      sales: { desc: "帮卖菜的大姐把滞销的西红柿吆喝完了", cashMin: 100, cashMax: 300 },
      management: { desc: "帮社区居委会整理了活动排班表", cashMin: 150, cashMax: 350 },
      accounting: { desc: "帮小店里老板理清了一堆乱账", cashMin: 200, cashMax: 450 },
      electrician: { desc: "帮小区物业查出了老旧线路的故障点", cashMin: 250, cashMax: 500 },
      welding: { desc: "帮工地师傅多焊了几个钢筋接头", cashMin: 200, cashMax: 400 },
      medicine: { desc: "在社区卫生站帮忙给老人测了血压", cashMin: 100, cashMax: 250 },
      social: { desc: "调解了两个吵架的邻居", cashMin: 100, cashMax: 200 }
    };
    var m = sceneMap[top.key];
    return { cn: SKILL_CN[top.key] || top.key, scene: m ? m.desc : "帮了别人一把", cashMin: m ? m.cashMin : 150, cashMax: m ? m.cashMax : 350 };
  }

  // 检查首个已达的技能分支
  function findFirstBranch(st) {
    if (typeof SKILL_BRANCHES === "undefined" || !st || !st.skills) return null;
    var branchNames = {
      home_chef: "家常菜大师", sous_chef: "帮厨主管", frontend_dev: "前端开发", backend_dev: "后端架构",
      security_expert: "安全专家", business_english: "商务英语", travel_english: "旅游英语",
      passenger_transport: "客运专线", freight_logistics: "货运物流", store_sales: "门店销售",
      biz_negotiation: "商务谈判", team_mgmt: "团队管理", individual_contrib: "独立贡献",
      audit_risk: "审计风控", industrial_electrician: "工业电工", building_electrician: "建筑电工",
      structural_welding: "结构焊接", pipeline_welding: "管道焊接", basic_nurse: "基础护理",
      elderly_care: "老年护理", business_travel: "商旅服务", interpretation: "笔译",
      community_edu: "社区教育", rural_edu: "乡村支教"
    };
    var branches = SKILL_BRANCHES;
    var branchKeys = Object.keys(branches);
    for (var b = 0; b < branchKeys.length; b++) {
      var bk = branchKeys[b];
      var branch = branches[bk];
      if (!branch || !branch.branchRequirement || !branch.reqSkill) continue;
      var reqSkill = branch.reqSkill;
      var reqLv = branch.levelRequirement || branch.minLevel || 50; // [PLACEHOLDER]
      var skillLvVal = skillLv(st, reqSkill);
      if (skillLvVal >= reqLv && st.flags && st.flags["_skillBranch_" + bk] !== true) {
        return { key: bk, name: branchNames[bk] || bk, skillName: SKILL_CN[reqSkill] || reqSkill, skillLevel: skillLvVal };
      }
    }
    return null;
  }

  // 检查玩家持有的可用于生活优惠的证书
  function findLifeCert(st) {
    if (!st || !st.certificates || !Array.isArray(st.certificates) || st.certificates.length === 0) return null;
    // 这些证书在日常生活中可能有隐性优惠
    var lifeCerts = ["food_safety", "nursing_cert", "health_manager", "rehab_therapist",
                     "cooking_cert", "repair_cert", "electrician_cert", "welding_cert"];
    for (var i = 0; i < st.certificates.length; i++) {
      var certId = st.certificates[i];
      if (lifeCerts.indexOf(certId) !== -1) return certId;
    }
    return null;
  }

  var CERT_SHORTCUT_MAP = {
    food_safety: { desc: "菜市场拿货,老板看你持有食品健康证直接给了批发价", bonusMin: 200, bonusMax: 500 },
    nursing_cert: { desc: "社区体检站缺人手,临时顶替半天拿了补贴", bonusMin: 300, bonusMax: 600 },
    health_manager: { desc: "朋友公司请你去做了半天的健康管理顾问", bonusMin: 400, bonusMax: 700 },
    rehab_therapist: { desc: "康复中心临时调人,你顶了半个班", bonusMin: 300, bonusMax: 550 },
    cooking_cert: { desc: "帮亲戚筹备家宴,持证厨师出手就是不一样,有人塞了劳务费", bonusMin: 250, bonusMax: 500 },
    repair_cert: { desc: "物业听说你有维修证,派了你几个私活", bonusMin: 200, bonusMax: 450 },
    electrician_cert: { desc: "小区电路检修,持证电工上门费翻倍", bonusMin: 300, bonusMax: 600 },
    welding_cert: { desc: "小作坊急需持证焊工,日结工资比临时工高出一截", bonusMin: 350, bonusMax: 700 }
  };

  var EVENTS = [
    {
      // C→B: 职业技能街头回响 — 学来的本事在街头也派上了用场
      id: "skill_street_echo",
      phase: "street",
      _isChainEvent: false,
      icon: "🔧",
      title: "学来的本事,街头也用得上",
      story:
        "今天在外面碰到一件事,意外发现你在公司学到的那门手艺居然派上了用场。那些白天熬过的加班、背过的方案、练过的技术,在这一刻变成了实打实的底气。你笑了——这城市里,总有一技之长不是白学的。",
      triggers: { minDay: 15, excludeFlags: ["_skillStreetEchoSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources || !st.player) return false;
        var top = topSkillKeyAndLevel(st);
        return top.level >= 3; // [PLACEHOLDER]: 技能达到Lv.3即触发
      },
      choices: [
        {
          text: "💪 顺手露一手,赚了点小钱",
          hint: "现金+[PLACEHOLDER],心智+2,心情+3",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._skillStreetEchoSeen = true;
            var scene = getSkillStreetScene(st);
            // [全系统自洽修复] 域C R400: Math.random()→Random.int()种子化随机(保证存档回放一致性)
            var bonus = (typeof Random !== "undefined" && Random.int) ? Random.int(scene.cashMin, scene.cashMax) : scene.cashMin;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + bonus;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "💪 你的" + scene.cn + "手艺在街上也派上了用场——" + scene.scene + ",赚了¥" + bonus + "。专业的事,到哪里都有价值。",
                "good"
              );
          }
        },
        {
          text: "🤝 顺手帮个忙,不留钱",
          hint: "心满意足,心智+3,心情+2",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._skillStreetEchoSeen = true;
            var scene = getSkillStreetScene(st);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🤝 你的" + scene.cn + "手艺帮了别人的忙——" + scene.scene + "。不求回报,心里挺踏实。",
                "success"
              );
          }
        }
      ]
    },
    {
      // C→D: 技能分支解锁→行业圈子归属感
      id: "skill_branch_recognition",
      phase: "street",
      _isChainEvent: false,
      icon: "🏷️",
      title: "圈子里多了一个身份",
      story:
        "你的{skill}技能终于达到了解锁「{branchName}」分支的标准。那天在行业聚会上,有人主动跟你打招呼——「原来你是做{branchName}的!」那一刻你突然意识到,自己不再是那个什么都会一点但什么都不精的外行,而是有了属于自己的圈子。",
      // [全系统自洽修复] 域C R685b A类: story中{skill}{branchName}占位符无任何动态渲染(渲染层只调text())→原样泄漏给玩家；补text()动态叙述+无占位符fallback
      text: function (st) {
        try {
          var br = findFirstBranch(st);
          if (br) {
            return "你的" + br.skillName + "技能终于达到了解锁「" + br.name + "」分支的标准。那天在行业聚会上,有人主动跟你打招呼——「原来你是做" + br.name + "的!」那一刻你突然意识到,自己不再是那个什么都会一点但什么都不精的外行,而是有了属于自己的圈子。";
          }
        } catch (e) { /* fallback */ }
        return "你的看家技能终于达到了解锁专业分支的标准。那天在行业聚会上,有人主动跟你打招呼。那一刻你突然意识到,自己不再是那个什么都会一点但什么都不精的外行,而是有了属于自己的圈子。";
      },
      triggers: { minDay: 30, excludeFlags: ["_skillBranchRecognized"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        var br = findFirstBranch(st);
        return !!br;
      },
      choices: [
        {
          text: "🎉 很高兴找到组织",
          hint: "NPC好感+4,心智+3",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._skillBranchRecognized = true;
            var br = findFirstBranch(st);
            if (!br) return;
            // 记录已解锁的分支flag
            if (st.flags) st.flags["_skillBranch_" + br.key] = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            // 首个已结识NPC涨好感(守met铁律)
            var npcId = firstMetNpc(st);
            if (npcId && typeof applyAffinityChange === "function") {
              try { applyAffinityChange(st, npcId, 4, "圈子认同感"); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "🎉 你的" + br.skillName + "技能解锁了「" + br.name + "」分支,终于有了自己的圈子。心智+3。",
                "success"
              );
          }
        },
        {
          text: "😄 低调做事,不声张",
          hint: "平静,心智+2",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._skillBranchRecognized = true;
            var br = findFirstBranch(st);
            if (!br) return;
            if (st.flags) st.flags["_skillBranch_" + br.key] = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "😄 你默默记下了自己的新身份——" + br.name + "。圈子不重要,重要的是你真的学到了东西。心智+2。",
                "info"
              );
          }
        }
      ]
    },
    {
      // C→A/E: 证书生活变现 — 持证的好处,日常生活也能感受到
      id: "cert_life_shortcut",
      phase: "street",
      _isChainEvent: false,
      icon: "📜",
      title: "持证的好处,用着才知道",
      story:
        "你翻出抽屉里的{certName},突然想起今天因为这张证省了不少事儿。那些考证时熬的夜、花的钱,在生活里悄悄回了本——证不只是为了找工作,它也是你在城市里行走的通行证。",
      triggers: { minDay: 10, excludeFlags: ["_certLifeShortcutSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var cert = findLifeCert(st);
        return !!cert;
      },
      // [全系统自洽修复] 域C R685b A类: renderStory是渲染层从不调用的死接口(events_core R455后只调text())→story中{certName}占位符原样泄漏给玩家；改为text()动态叙述+无占位符fallback
      text: function (st) {
        try {
          var certId = findLifeCert(st);
          if (certId && CERT_SHORTCUT_MAP[certId]) {
            var certNames = {
              food_safety: "食品健康证", nursing_cert: "护士资格证", health_manager: "健康管理师证",
              rehab_therapist: "康复治疗师证", cooking_cert: "厨师证", repair_cert: "维修资格证",
              electrician_cert: "电工证", welding_cert: "焊工证"
            };
            return "你翻出抽屉里的" + (certNames[certId] || certId) + ",突然想起今天因为这张证省了不少事儿。那些考证时熬的夜、花的钱,在生活里悄悄回了本——证不只是为了找工作,它也是你在城市里行走的通行证。";
          }
        } catch (e) { /* fallback */ }
        return "你翻出抽屉里的资格证书,突然想起今天因为这张证省了不少事儿。那些考证时熬的夜、花的钱,在生活里悄悄回了本——证不只是为了找工作,它也是你在城市里行走的通行证。";
      },
      choices: [
        {
          text: "💰 持证就是好办事",
          hint: "现金+[PLACEHOLDER],心智+2",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._certLifeShortcutSeen = true;
            var certId = findLifeCert(st);
            if (!certId || !CERT_SHORTCUT_MAP[certId]) return;
            var info = CERT_SHORTCUT_MAP[certId];
            // [全系统自洽修复] 域C R400: Math.random()→Random.int()种子化随机(保证存档回放一致性)
            var bonus = (typeof Random !== "undefined" && Random.int) ? Random.int(info.bonusMin, info.bonusMax) : info.bonusMin;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + bonus;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "💰 因为持有" + (info.desc) + ",赚了¥" + bonus + "。多一张证,就多一条路。",
                "good"
              );
          }
        },
        {
          text: "😊 这些好处是应该的",
          hint: "心情+3,心智+1",
          apply: function (st) {
            st.flags = st.flags || {};
            st.flags._certLifeShortcutSeen = true;
            var certId = findLifeCert(st);
            if (!certId || !CERT_SHORTCUT_MAP[certId]) return;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "😊 你觉得这些是持证应得的回报。踏实过日子,证件多多益善。心情+3。",
                "info"
              );
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
