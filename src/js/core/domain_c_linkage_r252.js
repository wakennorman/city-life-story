/**
 * 域C(职业/成长) 联动增强 R252
 * 职业积累的多维回响——技能不仅换来薪资，还在UI/叙事/自我认知层面留下痕迹。
 * 桥接：
 *   C→F  career_portfolio_showcase   多门技能半百→可制作作品集→心情/心智提升（UI展示成就感）
 *   C→G  career_anniversary_reflection 同一路径满一年→自我回顾叙事（峰终定律·时间里程碑）
 *   C→B  career_skill_crossover       两门不相关技能双高→独特组合叙事（禀赋效应·独特性认同）
 *
 * 严格照 domain_c_linkage_r191.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、triggers 用引擎白名单字段、
 *   conditions 全字段防御、gameOver 闸门、apply 内自理副作用。
 * 真实字段核实：
 *   技能容器 st.skills.<key>.level；职业容器 st.career.currentJob（含 path/workDays/levelId）；
 *   心情 st.needs.happiness；心智 st.player.mental；
 *   标志 _careerPortfolioSeen / _careerAnniversarySeen / _careerCrossoverSeen（去重）。
 *   数值标 [PLACEHOLDER] 待平衡组校准。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR252Loaded) return;
  RANDOM_EVENTS._domainCLinkageR252Loaded = true;

  // 计算玩家达到Lv.50+的技能数量
  function countHighSkillsC252(st, threshold) {
    threshold = threshold || 50;
    if (!st || !st.skills) return 0;
    var count = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv >= threshold) count++;
    }
    return count;
  }

  // 取两个最高等级的技能key（用于交叉叙事）
  function topTwoSkillsC252(st) {
    if (!st || !st.skills) return [];
    var arr = [];
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      arr.push({ key: k, level: lv });
    }
    arr.sort(function (a, b) { return b.level - a.level; });
    return arr.slice(0, 2);
  }

  // 技能中文名辅助（优先用全局函数，否则回退到key）
  function skillNameC252(key) {
    if (typeof getSkillChineseName === "function") return getSkillChineseName(key);
    return key;
  }

  var EVENTS = [
    {
      // C→F: 多门技能半百→可制作作品集→心情/心智提升（UI展示成就感）
      id: "career_portfolio_showcase",
      phase: "street",
      _isChainEvent: false,
      icon: "🎨",
      title: "作品集",
      story:
        "你翻看自己这些年的履历——好几门手艺都练到了半百以上。有人建议你：「你应该做个作品集，把你会的东西整理一下，以后不管是跳槽还是接私活都用得上。」\n\n你花了一个周末，把技能证书、工作成果、客户评价整理成一份简洁的作品集。看着这份沉甸甸的文档，你第一次觉得自己的努力有了「形状」。",
      triggers: { minDay: 60, excludeFlags: ["_careerPortfolioSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 至少3门技能达到Lv.50+
        return countHighSkillsC252(st, 50) >= 3;
      },
      choices: [
        {
          text: "📋 好好保存这份作品集",
          hint: "心情+8，心智+5，解锁作品集flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerPortfolioSeen = true;
            st.flags._careerPortfolio = true; // 解锁作品集flag（供UI展示）
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你做了一份作品集，把这些年积累的本事都整理出来了。心情+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🤷 没必要，本事在手上就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerPortfolioSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得没必要形式化，真本事不需要纸面证明。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
    {
      // C→G: 同一路径满一年→自我回顾叙事（峰终定律·时间里程碑）
      id: "career_anniversary_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "入职一周年",
      story:
        "今天是你在这条职业路上走到第365天。\n\n一年前的你，连入门都磕磕绊绊。现在的你，已经能独当一面了。你翻看手机里第一天上班时的照片——那时候连工牌都戴歪了。\n\n时间不声不响，但你确实和一年前不一样了。",
      triggers: { minDay: 365, excludeFlags: ["_careerAnniversarySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        // 同一路径工作满365天
        if ((job.workDays || 0) < 365) return false;
        // 一年内未触发过（按路径去重）
        if (st.flags && st.flags._careerAnniversarySeen && st.flags._careerAnniversarySeen[job.path]) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 给自己一个小奖励",
          hint: "心情+10，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerAnniversarySeen = st.flags._careerAnniversarySeen || {};
            var job = st.career && st.career.currentJob;
            if (job && job.path) st.flags._careerAnniversarySeen[job.path] = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌟 你给自己买了一杯奶茶庆祝。一年了，不容易。心情+10，心智+5。", "success");
            }
          },
        },
        {
          text: "📝 写下这一年的感悟",
          hint: "心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerAnniversarySeen = st.flags._careerAnniversarySeen || {};
            var job = st.career && st.career.currentJob;
            if (job && job.path) st.flags._careerAnniversarySeen[job.path] = true;
            st.flags._careerJournalKeeper = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你在手机备忘录里写下这一年的得失。文字让成长变得可见。心智+8。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      // C→B: 两门不相关技能双高→独特组合叙事（禀赋效应·独特性认同）
      id: "career_skill_crossover",
      phase: "street",
      _isChainEvent: false,
      icon: "🔀",
      title: "跨界高手",
      story:
        "圈子里的人都知道你——手艺路子特别宽。别人在一个坑里深耕，你却同时把两门不相关的本事都练到了行家级别。\n\n有人觉得你不务正业，但也有人说：「现在最缺的就是你这种跨界的。」\n\n你也不知道自己算哪行的，但你确实走出了一条没人走过的路。",
      triggers: { minDay: 90, excludeFlags: ["_careerCrossoverSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var top2 = topTwoSkillsC252(st);
        if (top2.length < 2) return false;
        // 两门技能都达到Lv.40+
        if (top2[0].level < 40 || top2[1].level < 40) return false;
        // 两门技能属于不同领域（不相关）
        var techSkills = ["coding", "electrician", "repair"];
        var peopleSkills = ["sales", "management", "social", "english"];
        var bodySkills = ["cooking", "welding", "driving", "medicine"];
        var allGroups = [techSkills, peopleSkills, bodySkills];
        var g0 = -1, g1 = -1;
        for (var i = 0; i < allGroups.length; i++) {
          if (allGroups[i].indexOf(top2[0].key) >= 0) g0 = i;
          if (allGroups[i].indexOf(top2[1].key) >= 0) g1 = i;
        }
        // 如果两门技能属于不同组（跨界），或者至少一门不在任何组里
        return g0 !== g1;
      },
      choices: [
        {
          text: "🎯 把跨界当成核心竞争力",
          hint: "心智+6，心情+5，解锁跨界flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCrossoverSeen = true;
            st.flags._careerCrossover = true; // 解锁跨界flag
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            }
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你决定把「跨界」当成自己的标签。不一样，就是优势。心智+6，心情+5。", "success");
            }
          },
        },
        {
          text: "🤔 还是专精一门更靠谱",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._careerCrossoverSeen = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤔 你觉得杂而不精不是好事，开始考虑聚焦一个方向。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.35,
      repeatable: false,
    },
  ];

  // 注入全局事件池
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
