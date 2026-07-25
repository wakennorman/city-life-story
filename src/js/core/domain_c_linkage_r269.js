/**
 * 域C(职业/成长) 联动增强 R269
 * 主题：连携本事的"被看见"——R269 修复了 getActiveSynergiesCount 字段错链
 * （此前技能Tab活跃连携数恒 0），本文件三事件让"连携"从修复后的数字
 * 变成可感知的叙事与跨域回报，全部是"写入/修复→首个消费"闭环。
 *
 * 桥接：
 *   C→F/G  c269_synergy_awakening   首个消费修复后真实非0的 getActiveSynergiesCount（连携被看见→自我认知）
 *   C→E    c269_review_to_craft     首个消费 R260 死flag _investReviewHabit（投资复盘习惯迁移到手艺精进）
 *   C→H    c269_synergy_promotion   复合连携本事在公司被看重（corporate 变现）
 *
 * 防御：全字段 || 守卫；函数 typeof 守卫；显式 phase；数值 [PLACEHOLDER] 已按同类事件基准取值。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainCLinkageR269Loaded) return;
  RANDOM_EVENTS._domainCLinkageR269Loaded = true;

  // 修复后的活跃连携数安全读取（skill_synergy.js getActiveSynergiesCount R269 修复版）
  function synergyCountC269(st) {
    if (typeof getActiveSynergiesCount !== "function") return 0;
    try {
      return getActiveSynergiesCount(st) || 0;
    } catch (e) {
      return 0;
    }
  }

  var EVENTS = [
    {
      // C→F/G：首个消费 R269 修复后的活跃连携计数——连携第一次"被看见"
      id: "c269_synergy_awakening",
      phase: "street",
      _isChainEvent: false,
      icon: "🔗",
      title: "本事连上了",
      story: "晚上翻看自己的技能面板，你忽然注意到一行以前从没亮过的字：「活跃连携」。\n\n原来这几门手艺不是各干各的——它们在暗处互相搭手，让你比单打独斗的人多出一截。你把这行字看了很久，像是第一次真正认识自己。",
      triggers: { minDay: 60, excludeFlags: ["_synergyAwakeningSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        return synergyCountC269(st) >= 1; // 修复前恒0→本事件即修复的首个叙事消费者
      },
      choices: [
        {
          text: "🧭 把连携思路记进小本子",
          hint: "心智+6，心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._synergyAwakeningSeen = true;
            st.flags._synergyAwareness = true; // 供后续域C/F事件消费
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔗 你第一次看清了自己手艺之间的连携。心智+6，心情+4。", "success");
            }
          },
        },
        {
          text: "😴 数字而已，睡觉",
          hint: "无变化",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._synergyAwakeningSeen = true;
          },
        },
      ],
    },
    {
      // C→E：首个消费 R260 置入后全库零消费者的死flag _investReviewHabit
      id: "c269_review_to_craft",
      phase: "street",
      _isChainEvent: false,
      icon: "📓",
      title: "复盘这把刀",
      story: "自从在投资上养成了复盘的习惯，你发现这把刀砍哪儿都快。\n\n今晚你把这套「哪里做对了、哪里靠运气」的追问用在了自己的手艺上——一笔笔账、一单单活地过。有些以前糊弄过去的粗糙处，第一次被自己看见。",
      triggers: { minDay: 90, excludeFlags: ["_reviewToCraftSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._investReviewHabit) return false; // R260 e260_streak_review 置入，此前零消费者
        return true;
      },
      choices: [
        {
          text: "🔍 给自己的手艺做一次全面复盘",
          hint: "账务经验+8，心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._reviewToCraftSeen = true;
            st.flags._craftReviewHabit = true; // 复盘习惯迁移到职业面
            if (typeof addSkillXp === "function") addSkillXp("accounting", 8); // [PLACEHOLDER] 真实技能键
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📓 投资场上学来的复盘，回头打磨了你的手艺。账务经验+8，心智+5。", "success");
            }
          },
        },
        {
          text: "🍵 习惯留在盘面上就好",
          hint: "心情+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._reviewToCraftSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
          },
        },
      ],
    },
    {
      // C→H：复合连携本事在公司阶段被看重→管理经验+现金回报
      id: "c269_synergy_promotion",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "复合型的人",
      story: "会议室里讨论一个跨部门的烂摊子，没人接得住。你开了口——一半用这门手艺的逻辑，一半用另一门的经验，把整件事拆成了三步。\n\n散会后，上级在走廊叫住你：「你这种几门本事能拧到一起的人，不多。」",
      triggers: { minDay: 120, excludeFlags: ["_synergyPromotionSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        var employed =
          (st.career && st.career.currentJob) ||
          (st.corporate && st.corporate.company);
        if (!employed) return false;
        return synergyCountC269(st) >= 2; // 至少两组活跃连携（复合型门槛）
      },
      choices: [
        {
          text: "💼 顺势牵头这个跨部门项目",
          hint: "管理经验+8，奖金+1200",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._synergyPromotionSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 8); // [PLACEHOLDER] 真实技能键
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1200; // [PLACEHOLDER]
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 3); // [PLACEHOLDER] 真实惰性字段
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你牵头搞定了跨部门项目，连携本事在职场兑了现。管理经验+8，奖金+1200。", "success");
            }
          },
        },
        {
          text: "🙏 谦虚两句，继续做好本职",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._synergyPromotionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4); // [PLACEHOLDER]
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
