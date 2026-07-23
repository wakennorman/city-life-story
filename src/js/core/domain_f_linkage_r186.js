/*
 * 城市浮生记 — 域F（UI/UX）联动增强 · R186
 * 全系统优化 loop R186 · 联动增强 3项（2 street + 1 corporate）
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；里程碑类事件用 st.flags._xxxDone 去重。
 *  - 引擎按 e.phase 过滤（events_core.js），每个事件显式设 phase。
 *  - 数值用 [PLACEHOLDER] 语义占位（下方常量集中标注）。
 *  - 严守域D铁律：只读 st.relationships、rel && rel.met 守卫、跨NPC传导走 applyAffinityChange。
 *
 * 本轮字段真实性已核（R186 修复上下文）：
 *  - 证书真实字段 st.certificates（数组，main.js push cert.id）——本轮域F已修 state.certs 死字段。
 *  - 每日目标连击 st.flags._questStreak（daily_quest.js:676 每日维护，真实字段）。
 *  - 幸福感 st.needs.happiness；心智/名望 st.player.mental / st.player.fame。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR186) return;
  RANDOM_EVENTS._domainFLinkageR186 = true;

  // ---- [PLACEHOLDER] 数值常量（集中标注，便于平衡）----
  var P_CERT_WALL_COUNT = 2; // [PLACEHOLDER] F→C 证书上墙的证书数门槛
  var P_CERT_FAME = 2; // [PLACEHOLDER] F→C 证书展示的名望回馈
  var P_STREAK_RITUAL = 7; // [PLACEHOLDER] F→G 目标连击成为仪式的天数门槛
  var P_FRIEND_AFF = 20; // [PLACEHOLDER] F→D 可分享成长的好友好感门槛
  var P_AFF_GAIN = 5; // [PLACEHOLDER] F→D 分享成长曲线后的好感回馈
  var P_SKILL_XP = 6; // [PLACEHOLDER] F→C 复盘转化的技能XP

  // ---- 本地助手 ----
  function certCountR186(st) {
    if (!st || !Array.isArray(st.certificates)) return 0;
    return st.certificates.length;
  }
  function questStreakR186(st) {
    if (!st || !st.flags) return 0;
    return st.flags._questStreak || 0;
  }
  function getMetNpcsR186(st, minAff) {
    if (!st || !st.relationships) return [];
    var out = [];
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push(id);
    }
    return out;
  }
  function npcNameR186(id) {
    if (typeof getNpcDisplayName === "function") return getNpcDisplayName(id);
    if (typeof NPCS !== "undefined" && NPCS && NPCS.find) {
      var d = NPCS.find(function (n) {
        return n.id === id;
      });
      if (d && d.name) return d.name;
    }
    return id;
  }
  function affinityR186(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域F R186联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }
  function msgR186(text, kind) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage)
      StateManager.addMessage(text, kind || "info");
  }

  var F_EVENTS = [
    // ===== 1. F→C 证书上墙 · 自我呈现的职业底气 (street) =====
    // 设计意图：本轮修复让证书目标/首证引导真正生效；此事件为证书积累补一层
    //   「看得见的成就感」UI叙事——把纸面资质变成墙上的底气，反哺求职自信（F→C）。
    {
      id: "ui_r186_cert_wall",
      title: "把证书裱起来",
      desc:
        "整理抽屉时，你翻出了自己一张张考回来的证书。犹豫片刻，你去楼下文具店买了两个最便宜的相框，" +
        "把它们端端正正挂在了床头的墙上。\n\n出租屋还是那个出租屋，但每天睁眼看到它们，" +
        "你都会想起那些下了班还在啃书的夜晚——这面墙，是你亲手挣来的履历。",
      phase: "street",
      triggers: { minDay: 40 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._uiF186CertWallDone) return false;
        if (certCountR186(st) < P_CERT_WALL_COUNT) return false;
        return true;
      },
      choices: [
        {
          text: "🖼️ 挂上墙，每天提醒自己走了多远",
          apply: function (st) {
            if (st.flags) st.flags._uiF186CertWallDone = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
              st.player.fame = Math.min(100, (st.player.fame || 0) + P_CERT_FAME);
            }
            // 标记：职业域事件可消费此「资质自信」flag（C域桥接）
            if (st.flags) st.flags._certConfidence = true;
            msgR186(
              "证书上墙的那一刻，你挺直了些腰板。下次面试，你会讲得更有底气。心智+4，名望+" +
                P_CERT_FAME +
                "。",
              "good",
            );
          },
        },
        {
          text: "📁 收进文件袋，实力不需要展示",
          apply: function (st) {
            if (st.flags) st.flags._uiF186CertWallDone = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (st.flags) st.flags._certConfidence = true;
            msgR186("你把证书仔细收好。它们在不在墙上，都在你身上。心智+2。", "info");
          },
        },
      ],
      probability: 0.05,
    },

    // ===== 2. F→G 目标连击 · 把打卡过成仪式 (street) =====
    // 设计意图：每日目标面板的 _questStreak 连击数此前只是 UI 里的一个数字；
    //   此事件把它转化为「生活自律感」的人生叙事节点，让 UI 数据反哺核心机制体验（F→G）。
    {
      id: "ui_r186_quest_ritual",
      title: "连续打卡的这些天",
      desc:
        "睡前划掉今日目标清单上最后一项时，你注意到角落里的连击数字——不知不觉，" +
        "你已经连续好些天完成了给自己定下的所有小目标。\n\n" +
        "没有人监督你，也没有人奖励你。但正是这些微小的、按时兑现的承诺，" +
        "让漂在这座城市里的日子，第一次有了「被自己掌控」的形状。",
      phase: "street",
      triggers: { minDay: 20 },
      conditions: function (st) {
        if (!st || !st.player || !st.needs || !st.flags) return false;
        if (st.flags._uiF186QuestRitualDone) return false;
        if (questStreakR186(st) < P_STREAK_RITUAL) return false;
        return true;
      },
      choices: [
        {
          text: "📅 把这份自律固化成雷打不动的习惯",
          apply: function (st) {
            if (st.flags) st.flags._uiF186QuestRitualDone = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 4);
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            // 标记：核心域习惯类事件可消费此自律 flag（G域桥接）
            if (st.flags) st.flags._dailyRitualKeeper = true;
            msgR186(
              "自律不是苦行，而是你给自己的秩序感。心情+4，心智+5。",
              "good",
            );
          },
        },
        {
          text: "😌 偶尔断一天也没关系，别绷太紧",
          apply: function (st) {
            if (st.flags) st.flags._uiF186QuestRitualDone = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 0) + 5);
            msgR186(
              "松弛感也是一种能力。你决定和自己和解，不做清单的奴隶。心情+5。",
              "info",
            );
          },
        },
      ],
      probability: 0.05,
    },

    // ===== 3. F→D/C 成长曲线分享 · 复盘变成社交与职场资本 (corporate) =====
    // 设计意图：数据可视化面板里的成长曲线此前只有玩家自己看；此事件让「复盘习惯」
    //   被同事看见——分享方法论既加深关系（F→D），也把复盘转化为管理技能（F→C）。
    {
      id: "ui_r186_progress_share",
      title: "你的复盘习惯被同事看见了",
      desc:
        "午休时，一位相熟的同事凑过来，看到了你屏幕上自己整理的成长曲线和复盘笔记：" +
        "「你居然把自己的数据管理得这么清楚？教教我呗。」\n\n" +
        "你才意识到，这套每天顺手维护的小习惯，在别人眼里竟是一种稀缺的方法论。",
      phase: "corporate",
      triggers: { minDay: 50 },
      conditions: function (st) {
        if (!st || !st.player || !st.flags) return false;
        if (st.flags._uiF186ProgressShareDone) return false;
        if (getMetNpcsR186(st, P_FRIEND_AFF).length < 1) return false;
        return true;
      },
      choices: [
        {
          text: "📈 倾囊相授，把复盘方法讲给对方",
          apply: function (st) {
            if (st.flags) st.flags._uiF186ProgressShareDone = true;
            var met = getMetNpcsR186(st, P_FRIEND_AFF);
            if (met.length > 0) {
              var idx =
                typeof Random !== "undefined"
                  ? Random.int(0, met.length - 1)
                  : 0;
              var nid = met[idx];
              affinityR186(st, nid, P_AFF_GAIN, "分享复盘方法论");
              msgR186(
                "💬 你把自己的复盘框架讲给" +
                  npcNameR186(nid) +
                  "听，对方眼睛越听越亮：「这也太实用了。」你们的关系近了一步。",
                "good",
              );
            }
            if (typeof addSkillXp === "function")
              addSkillXp("management", P_SKILL_XP);
            msgR186("把方法讲清楚的过程，也是一次管理力的锻炼。管理经验+" + P_SKILL_XP + "。", "info");
          },
        },
        {
          text: "🙂 简单聊两句，核心方法留着自己用",
          apply: function (st) {
            if (st.flags) st.flags._uiF186ProgressShareDone = true;
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            msgR186("你笑着带过了话题。有些积累，是你安身立命的护城河。心智+3。", "info");
          },
        },
      ],
      probability: 0.045,
    },
  ];

  for (var i = 0; i < F_EVENTS.length; i++) {
    var evt = F_EVENTS[i];
    if (!evt.choices || !evt.choices.length) continue;
    if (!evt.conditions)
      evt.conditions = function () {
        return false;
      };
    RANDOM_EVENTS.push(evt);
  }
})();
