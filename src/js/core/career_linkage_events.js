/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件
 * v3.107 · loop R16 全系统优化·Domain C 职业成长→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 职业体系唯一权威入口为 CAREER_PATHS（src/js/ui/career_dev.js），本文件仅做跨域桥接，
 *    不新建平行职业系统、不改 CAREER_PATHS 结构。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._careerLinkageLoaded) return;
  RANDOM_EVENTS._careerLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsC(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcC(st, minAff) {
    var met = getMetNpcsC(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityC(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取当前最高技能等级（衡量"成长成果"）
  function topSkillLevelC(st) {
    if (!st || !st.skills) return 0;
    var top = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > top) top = lv;
    }
    return top;
  }

  // ---- 域C 联动事件 ----

  var CAREER_EVENTS = [
    // ===== C→D：职业成长（技能被看见）↔ 社交（前辈提携） =====
    {
      id: "career_mentor_bond",
      title: "一位前辈递来了名片",
      desc: "你在专业上的成长，被圈子里一位资深前辈留意到了。饭桌上他半开玩笑地说：「后生可畏，以后多来往。」",
      phase: "street",
      triggers: { minDay: 75 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerMentorBondCooldown) return false;
        // 有一份工作 + 技能达到"被看见"的门槛 + 至少有一个已结识 NPC
        var hasJob = !!(st.career && st.career.currentJob);
        if (!hasJob) return false;
        if (topSkillLevelC(st) < 20) return false; // [PLACEHOLDER] 技能"被看见"门槛
        if (!getMetNpcsC(st, 5).length) return false;
        return true;
      },
      choices: [
        {
          text: "珍惜这份提携，主动维系关系",
          apply: function (st) {
            var npc = pickClosestMetNpcC(st, 5);
            if (npc) safeAffinityC(st, npc.id, 6, "前辈提携·职业成长");
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._careerMentorBondCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "专业上的成长，为你换来了一段值得珍惜的人脉。",
                "good",
              );
          },
        },
        {
          text: "客气收下，保持距离",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._careerMentorBondCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== C→A：技能里程碑 ↔ 数值成长（属性/心智回馈） =====
    {
      id: "career_skill_milestone",
      title: "技能树上亮起一颗节点",
      desc: "长期打磨的一项专长，终于跨过了熟练的分水岭。你能明显感觉到：处理同样的事，脑子转得更快、手也更稳了。",
      phase: "street",
      triggers: { minDay: 100 },
      conditions: function (st) {
        if (!st || !st.player || !st.skills) return false;
        if (st.flags && st.flags._careerSkillMilestoneDone) return false;
        if (topSkillLevelC(st) < 40) return false; // [PLACEHOLDER] 技能里程碑门槛
        return true;
      },
      choices: [
        {
          text: "把熟练转化为综合能力的提升",
          apply: function (st) {
            // A域桥接：技能里程碑回馈基础属性（智力/心智）
            if (st.player) {
              st.player.intelligence = (st.player.intelligence || 20) + 2; // [PLACEHOLDER] 属性回馈
              st.player.mental = (st.player.mental || 50) + 4;
            }
            if (st.flags) st.flags._careerSkillMilestoneDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "专精一项技能，反过来让你整个人都更从容了。",
                "good",
              );
          },
        },
        {
          text: "低调继续，稳扎稳打",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._careerSkillMilestoneDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→E：职场晋升势能 ↔ 经济/投资资本（公司阶段加薪奖金） =====
    {
      id: "career_promotion_bonus",
      title: "年度考评：一笔晋升奖金",
      desc: "长期积累的职场口碑与晋升势能，换来了一次实打实的加薪与年终奖。到账那一刻，你开始盘算：这笔钱，也该让它替你工作了。",
      phase: "corporate",
      triggers: { minDay: 130 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerPromotionBonusDone) return false;
        var upward =
          (st.player.corporate && st.player.corporate.upwardMgmt) || 0;
        if (upward < 60) return false; // [PLACEHOLDER] 晋升势能门槛
        return true;
      },
      choices: [
        {
          text: "拿出一部分奖金开始理财",
          apply: function (st) {
            // E域桥接：晋升奖金入银行户，释放可投资资金并强化投资心态
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 25000; // [PLACEHOLDER] 晋升奖金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) {
              st.flags._careerPromotionBonusDone = true;
              st.flags._dataInvestorMindset = true; // 与 R14 data_savings_milestone 复用同一投资心态 flag
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "职场努力兑现成一笔奖金，你把它变成了投资的起点。",
                "good",
              );
          },
        },
        {
          text: "全部存起来，落袋为安",
          apply: function (st) {
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 25000; // [PLACEHOLDER] 晋升奖金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._careerPromotionBonusDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→H：职业硬技能 ↔ Phase2/公司（创业阶段价值兑现） =====
    {
      id: "career_enterprise_readiness",
      title: "把职场经验带进了公司",
      desc: "当年在职场里摸爬滚打练出的那套方法论，如今在你自己的公司里派上了用场——招人、谈客户、控成本，你比谁都门儿清。",
      phase: "corporate",
      triggers: { minDay: 120 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerEnterpriseReadyDone) return false;
        var hasCo =
          (st.corporate && st.corporate.company) ||
          (st.startup && st.startup.companies && st.startup.companies.length);
        if (!hasCo) return false;
        if (topSkillLevelC(st) < 30) return false; // [PLACEHOLDER] 技能兑现门槛
        return true;
      },
      choices: [
        {
          text: "把经验系统化，赋能团队",
          apply: function (st) {
            // H域桥接：职业硬技能转化为公司 KPI（upward，惰性字段，全 || 防御）
            st.player.corporate = st.player.corporate || {};
            st.player.corporate.upwardMgmt =
              (st.player.corporate.upwardMgmt || 0) + 8; // [PLACEHOLDER] 价值兑现
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) st.flags._careerEnterpriseReadyDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "职场沉淀的方法论，成了你公司里最值钱的东西。",
                "good",
              );
          },
        },
        {
          text: "低调沿用，不声张",
          apply: function (st) {
            st.player.corporate = st.player.corporate || {};
            st.player.corporate.upwardMgmt =
              (st.player.corporate.upwardMgmt || 0) + 4; // [PLACEHOLDER]
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._careerEnterpriseReadyDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→B：职业成就 ↔ 事件/叙事（城里流传起你的故事） =====
    {
      id: "career_legacy_tale",
      title: "城里开始有人讲你的故事",
      desc: "不知从哪天起，行业里开始流传起你的名字——有人拿你当年的坚持当励志样本，也有人酸一句「运气好」。但你自己知道，每一步都不是白走的。",
      phase: "street",
      triggers: { minDay: 150 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerLegacyTaleDone) return false;
        if (!(st.career && st.career.currentJob)) return false;
        if (topSkillLevelC(st) < 35) return false; // [PLACEHOLDER] 故事传播门槛
        return true;
      },
      choices: [
        {
          text: "把故事讲给后来人听",
          apply: function (st) {
            if (st.player) {
              st.player.mental = (st.player.mental || 50) + 6;
              st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
            }
            if (st.needs)
              st.needs.happiness = Math.min(
                100,
                (st.needs.happiness || 50) + 5,
              );
            if (st.flags) {
              st.flags._careerLegacyTaleDone = true;
              st.flags._careerNarrativeSeen = true; // 供 B域叙事回调复用
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你的经历成了别人故事里的光，这感觉，比涨薪踏实。",
                "good",
              );
          },
        },
        {
          text: "一笑置之，继续赶路",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._careerLegacyTaleDone = true;
          },
        },
      ],
      probability: 0.035,
    },

    // ===== C→A：职业熟练度 ↔ 数据/数值（单位时间收入效率） =====
    {
      id: "career_resource_mastery",
      title: "熟练，是最实在的复利",
      desc: "同一件事你做得比新人快三倍，出错还少。省下的时间和精力，被你拿去学了新东西、接了私活——钱和本事，就这么滚了起来。",
      phase: "street",
      triggers: { minDay: 90 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerResourceMasteryDone) return false;
        if (!(st.career && st.career.currentJob)) return false;
        if (topSkillLevelC(st) < 25) return false; // [PLACEHOLDER] 熟练度门槛
        return true;
      },
      choices: [
        {
          text: "把效率换成真金白银",
          apply: function (st) {
            // A域桥接：技能熟练带来效率红利（现金 + 智力回馈）
            if (st.resources)
              st.resources.cash = (st.resources.cash || 0) + 3000; // [PLACEHOLDER] 效率红利
            if (st.player)
              st.player.intelligence = (st.player.intelligence || 20) + 2;
            if (st.flags) st.flags._careerResourceMasteryDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "熟练带来的不只是轻松，还有看得见摸得着的增长。",
                "good",
              );
          },
        },
        {
          text: "把时间投资回自己",
          apply: function (st) {
            if (st.player)
              st.player.intelligence = (st.player.intelligence || 20) + 3;
            if (st.flags) st.flags._careerResourceMasteryDone = true;
          },
        },
      ],
      probability: 0.045,
    },

    // ===== C→B/核心：技能Lv.50里程碑—技能达到半百(专家级) =====
    {
      id: "career_skill_halfcentury",
      title: "半百之技——你成了这门手艺的专家",
      desc: "经历了无数次练习与实践，你的一项核心技能突破了50级大关。从生疏到熟练，从熟练到精通——现在，你已经是这一行的专家了。\n\n走在街头，你看待世界的方式都不一样了——同样的工作，你一眼就能看出最省力的做法；同样的挑战，你胸有成竹。",
      phase: "street",
      triggers: { minDay: 60 },
      conditions: function (st) {
        if (!st || !st.skills) return false;
        if (st.flags && st.flags._careerSkillHalfCenturyDone) return false;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          if ((st.skills[k] && st.skills[k].level) >= 50) return true;
        }
        return false;
      },
      choices: [
        {
          text: "🎓 报名更高级的培训，冲击满级",
          hint: "智力+5，技能XP额外+100",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#5: st.flags 守卫
            if (!st.flags) st.flags = {};
            st.flags._careerSkillHalfCenturyDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 5);
            var topSkill = null, topLv = 0;
            for (var k in st.skills) {
              if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = st.skills[k]; }
            }
            if (topSkill) topSkill.xp = (topSkill.xp || 0) + 100;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🎓 你决定继续深造！智力+5，最高技能XP+100。向Lv.100前进！", "success");
          },
        },
        {
          text: "🏆 用专家级技能接更赚钱的活",
          hint: "名声+5，现金+¥2000",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#8: st.flags 守卫
            if (!st.flags) st.flags = {};
            st.flags._careerSkillHalfCenturyDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏆 你的专家名声传开了！名气+5，接了个大单赚了¥2000。", "success");
          },
        },
        {
          text: "📝 把经验写成教程，分享给新人",
          hint: "心智+5，道德+3",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#9: st.flags 守卫
            if (!st.flags) st.flags = {};
            st.flags._careerSkillHalfCenturyDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.morality = Math.min(100, (st.player.morality || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📝 你的教程帮到了很多人，心里暖暖的。心智+5，道德+3。", "good");
          },
        },
      ],
      probability: 0.08,
    },

    // ===== C→B/核心：技能Lv.100里程碑—登峰造极 =====
    {
      id: "career_skill_century",
      title: "登峰造极——你是活着的传奇",
      desc: "一项技能达到了100级满级！这意味着你已经站在了这个领域的最前沿。\n\n整个行业里，能达到这个水平的人屈指可数。你的名字开始在更广泛的圈子里流传，有人称你为「大师」，有人想拜你为师。\n\n这条路，你走了很久。但现在，你站在了山顶。",
      phase: "street",
      triggers: { minDay: 200 },
      conditions: function (st) {
        if (!st || !st.skills) return false;
        if (st.flags && st.flags._careerSkillCenturyDone) return false;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          if ((st.skills[k] && st.skills[k].level) >= 100) return true;
        }
        return false;
      },
      choices: [
        {
          text: "👑 开山收徒，将技艺传承下去",
          hint: "魅力+10，名声+15，获得学徒",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#6: st.flags 守卫
            if (!st.flags) st.flags = {};
            st.flags._careerSkillCenturyDone = true;
            st.flags._skillMasterHasApprentice = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 15);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👑 你开始收徒传承技艺。魅力+10，名声+15，心智+10。你的传奇刚刚开始。", "success");
          },
        },
        {
          text: "💎 用满级技能创业，打造自己的品牌",
          hint: "解锁创业加成，启动资金减免",
          apply: function (st) {
            // [全系统自洽修复] 域B A类#7: st.flags 守卫
            if (!st.flags) st.flags = {};
            st.flags._careerSkillCenturyDone = true;
            st.flags._skillMasterStartupBonus = true;
            if (st.player) {
              st.player.fame = Math.min(100, (st.player.fame || 0) + 10);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💎 满级技能就是你最好的名片！创业启动资金减免20%，名声+10。", "success");
          },
        },
        {
          text: "📖 写一本行业专著，留下你的思想",
          hint: "智力+10，名声+20，获得被动收入",
          apply: function (st) {
            st.flags._careerSkillCenturyDone = true;
            st.flags._skillMasterBookPublished = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 10);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 20);
            }
            // [全系统自洽修复] 域B A类#4: st.resources 守卫
            if (st.resources) {
              st.resources._passiveBookRoyalty = (st.resources._passiveBookRoyalty || 0) + 500;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📖 你的专著出版！智力+10，名声+20，每月版税¥500。后世会记得你的名字。", "success");
          },
        },
      ],
      probability: 0.12,
    },
  ];

  for (var i = 0; i < CAREER_EVENTS.length; i++) {
    RANDOM_EVENTS.push(CAREER_EVENTS[i]);
  }
})();

/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件 · 第二轮
 * v3.115 · loop R24 全系统优化·Domain C 职业成长→跨域桥接
 *
 * 设计约束（与 R11–R23 各域 linkage 文件一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 以覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 域D 桥接严守铁律：只读 state.relationships、rel&&rel.met 守卫、跨NPC传导走 applyAffinityChange。
 *  - 本文件事件 id 统一前缀 career2_*，与 R16 career_linkage_events.js 的 career_* 不冲突。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._career2LinkageR24Loaded) return;
  RANDOM_EVENTS._career2LinkageR24Loaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsR24(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcR24(st, minAff) {
    var met = getMetNpcsR24(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityR24(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // ============ 事件定义 ============

  // ===== C→D：职业被看见 ↔ 社交亲近（旧同事辗转找到你，重连一段旧缘） =====
  RANDOM_EVENTS.push({
    id: "career2_peer_reconnect",
    title: "一位老同事辗转找到了你",
    desc: "多年没联系的前同事忽然发来消息，说你当年带他入行时那股认真劲，他一直记着。聊起来，你们竟在同一个城市。",
    phase: "street",
    triggers: { minDay: 30 },
    conditions: function (st) {
      if (!st || !st.relationships) return false;
      if (st.flags && st.flags._career2PeerReconnectDone) return false;
      if (!getMetNpcsR24(st, 0).length) return false;
      return true;
    },
    choices: [
      {
        text: "约他出来，好好叙叙旧",
        apply: function (st) {
          var npc = pickClosestMetNpcR24(st, 0);
          if (npc) safeAffinityR24(st, npc.id, 6, "职场旧缘被重新看见");
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 3;
          if (st.flags) st.flags._career2PeerReconnectDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一份被记住的认真，让你对这座城市又近了一分。",
              "good",
            );
        },
      },
      {
        text: "客套几句，没多约",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2PeerReconnectDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== C→A：稳定就业 ↔ 生活底气（有活干、有进账，慢慢攒出一点缓冲） =====
  RANDOM_EVENTS.push({
    id: "career2_steady_grounding",
    title: "连续上班的日子，让你心里有了底",
    desc: "不知不觉已经在这个岗位上待了一阵。每月固定的进账，让你第一次觉得'明天'不是悬着的。你开始给未来留一点余量。",
    phase: "street",
    triggers: { minDay: 60 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "street") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._career2SteadyGroundingDone) return false;
      // [PLACEHOLDER] 触发所需的连续在职天数门槛
      if ((st.player.day || 0) < 60) return false;
      // 有一份稳定工作（employment 或 career 任一存在即视为在职）
      var employed =
        (st.employment && st.employment.currentJob) ||
        (st.career && st.career.currentJob);
      if (!employed) return false;
      return true;
    },
    choices: [
      {
        text: "把每月结余划出一小笔，攒应急金",
        apply: function (st) {
          // 稳定就业带来生活底气：属性稳定 + 储蓄缓冲（域A 数值平衡）
          if (st.player) st.player.mental = (st.player.mental || 50) + 4;
          if (st.needs) st.needs.happiness = (st.needs.happiness || 50) + 2;
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 800; // [PLACEHOLDER] 应急储蓄缓冲
          if (st.flags) st.flags._career2SteadyGroundingDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "有活干、有进账，你对日子的掌控感悄悄回来了。",
              "good",
            );
        },
      },
      {
        text: "还是先顾眼前开销",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2SteadyGroundingDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ===== C→E：项目分红 ↔ 投资嗅觉（职场阶段，分红到账，第一次认真想钱生钱） =====
  RANDOM_EVENTS.push({
    id: "career2_bonus_to_capital",
    title: "一笔项目分红，让你动了理财的念头",
    desc: "年底项目结项，你拿到一笔意料之外的分红。钱躺在卡里几天后，你第一次认真想：能不能让它别只是躺着。",
    phase: "corporate",
    triggers: { minDay: 120 },
    conditions: function (st) {
      if (!st || !st.player || st.player.phase !== "corporate") return false;
      if (!st.resources) return false;
      if (st.flags && st.flags._career2BonusToCapitalDone) return false;
      // [PLACEHOLDER] 触发所需的现金/存款储备阈值
      if ((st.resources.bankBalance || 0) < 8000) return false;
      if ((st.resources.cash || 0) < 3000) return false;
      return true;
    },
    choices: [
      {
        text: "拿分红的小头，开始留意理财",
        apply: function (st) {
          if (st.resources)
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 2000; // [PLACEHOLDER] 腾出可投资本金
          if (st.flags) st.flags._dataInvestorMindset = true; // 复用跨轮投资者心态标记
          if (st.player) st.player.mental = (st.player.mental || 50) + 3;
          if (st.flags) st.flags._career2BonusToCapitalDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "一笔分红，让你对'钱怎么生钱'第一次上了心。",
              "good",
            );
        },
      },
      {
        text: "分红先还了账单，没多想",
        apply: function (st) {
          if (st.player) st.player.mental = (st.player.mental || 50) + 1;
          if (st.flags) st.flags._career2BonusToCapitalDone = true;
        },
      },
    ],
    probability: 0.05,
  });

  // ================================================================
  // R165 — C→F 技能连携职业总览可视化（C→F）
  // ================================================================
  // 填补"技能连携有数据但UI无展示"的空白区——让玩家在事业Tab看到自己的连携加成。
  // 设计意图：连携效果不应只是后台数据，需要在前台可视化呈现。
  // 参考：BitLife连携提示 / Civilization政策连线
  RANDOM_EVENTS.push({
    id: "career_skill_synergy_visual_hint",
    phase: "street",
    icon: "🔗",
    title: "技能连携的火花",
    story:
      "今天你在整理技能树时突然意识到：编程40+英语35=能接英文外包单；烹饪50+销售30=摆摊收入 boosted。\n\n你的技能组合正在形成一种'连携'——不是单一技能多强，而是多种技能交叉产生的化学反应。去事业Tab看看你的技能加成吧！",
    triggers: { minDay: 20 },
    conditions: function (st) {
      if (!st.skills) return false;
      var skillCount = Object.keys(st.skills).filter(function(k) {
        return (st.skills[k] && typeof st.skills[k] === "object") ?
          (st.skills[k].level || 0) >= 20 :
          (st.skills[k] || 0) >= 20;
      }).length;
      return skillCount >= 2;
    },
    probability: 0.06,
    repeatable: false,
    choices: [
      {
        text: "💡 我去事业Tab看看我的连携加成",
        hint: "引导探索",
        apply: function (st) {
          st.flags._skillSynergyHintShown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🔗 你开始关注自己的技能组合了。事业Tab里，系统会自动计算所有连携加成。心智+2。", "success");
        },
      },
      {
        text: "🤷 有空再说",
        hint: "暂时忽略",
        apply: function (st) {
          st.flags._skillSynergyHintShown = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🤷 你可能觉得以后再看。但技能连携的加成是实实在在的。", "info");
        },
      },
    ],
  });

  // ================================================================
  // R165 — C→B 技能成长停滞预警（C→B）
  // ================================================================
  // 填补"成长系统只有正向反馈没有负向预警"的最大空白区。
  // 连续30天不提升任何技能 → 触发焦虑叙事事件。
  // 参考：This War of Mine的绝望感 / Papers Please的倦怠设计
  RANDOM_EVENTS.push({
    id: "career_stagnation_warning",
    phase: "street",
    icon: "⚠️",
    title: "你是不是停下来了？",
    story:
      "翻开昨天的日历——你已经整整30天没有提升任何技能了。\n\n工作、吃饭、睡觉……循环往复。你想起刚进城时的雄心壮志，如今只剩日复一日的平庸。\n\n隔壁大爷说：「小伙子，人不学不知道，越混越潦草。」\n\n是时候改变一下了。",
    triggers: { excludeFlags: ["_careerStagnationSeen"] },
    conditions: function (st) {
      if (!st.stats || !st.stats.actionFreq) return false;
      if (st.flags && st.flags._careerStagnationSeen) return false;
      // 过去30天内无任何技能XP获得
      var trainDays = st.stats.actionFreq["train_attributes"] || 0;
      var streetDays = st.stats.actionFreq["street_work_carry"] || 0;
      // 纯体力劳动且无任何训练→触发
      return streetDays > 10 && trainDays < 3 && st.player.day >= 35;
    },
    probability: 0.04,
    repeatable: false,
    choices: [
      {
        text: "📚 明天去培训中心学一门课",
        hint: "投资自己，短期亏钱长期赚",
        apply: function (st) {
          st.flags._careerStagnationSeen = true;
          st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("📚 你决定报名一个培训课程。虽然要花几百块，但你终于想明白了一件事——唯一不会贬值的就是自己。心情+5。", "success");
        },
      },
      {
        text: "🔄 换份更有挑战性的工作",
        hint: "换个环境重新开始",
        apply: function (st) {
          st.flags._careerStagnationSeen = true;
          st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🔄 你开始看新工作的招聘信息。有时换环境比硬撑更聪明。但做决定的这三天，你什么都没做。", "info");
        },
      },
      {
        text: "😤 继续干，日子总要过",
        hint: "拖延改变",
        apply: function (st) {
          st.flags._careerStagnationSeen = true;
          st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 8);
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("😤 你选择了继续。但夜深人静时，那种不安感越来越强烈。有些变化如果不主动发生，就会变成危机。心情-8。", "warning");
        },
      },
    ],
  });
})();
