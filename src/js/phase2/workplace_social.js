/**
 * 职场社交深度系统 — Phase 2 核心交互
 *
 * 包含：
 * 1. 同事关系网 — 好感度、八卦传播、小团体
 * 2. 办公室政治 — 站队、甩锅、抢功、背刺
 * 3. 导师系统 — 带新人、收徒弟、人脉传承
 * 4. 人脉网络 — 弱连接、强连接、跨界人脉
 * 5. 社交事件 — 团建、聚餐、私下交流
 */

// ====== 同事关系定义 ======
const COLLEAGUE_ROLES = {
  mentor: { name: "导师", icon: "👨‍🏫", bonus: "能力+5%/月", risk: "被甩锅风险" },
  ally: { name: "盟友", icon: "🤝", bonus: "绩效互助", risk: "站队风险" },
  rival: { name: "竞争对手", icon: "⚔️", bonus: "激励成长", risk: "明争暗斗" },
  frenemy: { name: "塑料同事", icon: "🎭", bonus: "无", risk: "随时背刺" },
  neutral: { name: "普通同事", icon: "👤", bonus: "信息交换", risk: "低" },
  subordinate: {
    name: "下属",
    icon: "👥",
    bonus: "团队产出",
    risk: "管理负担",
  },
};

// ====== 办公室政治事件模板 ======
const OFFICE_POLITICS_EVENTS = {
  // 甩锅类
  blame_shifting: {
    name: "甩锅",
    icon: "🍠",
    desc: "有人想把项目失败的责任推给你",
    triggerConditions: { projectFailed: true, lowPopularity: true },
    options: [
      { text: "硬刚到底", effect: "尊严+10，人缘-15，风险+10", weight: 30 },
      {
        text: "默默背锅",
        effect: "尊严-15，KPI+5（老板觉得你顾全大局）",
        weight: 40,
      },
      {
        text: "反咬一口",
        effect: "需要证据，成功则对方人缘-20，失败则双输",
        weight: 20,
      },
      { text: "找导师求助", effect: "需要导师关系≥60，成功则化解", weight: 10 },
    ],
  },
  // 抢功类
  credit_stealing: {
    name: "抢功",
    icon: "💼",
    desc: "你的成果被同事抢先汇报给老板",
    triggerConditions: { completedProject: true, lowUpwardMgmt: true },
    options: [
      {
        text: "公开澄清",
        effect: "需要证据链，成功则声誉+10，失败则显得斤斤计较",
        weight: 30,
      },
      {
        text: "私下沟通",
        effect: "需要对方人缘≥40，成功则对方道歉并分享功劳",
        weight: 40,
      },
      {
        text: "向上管理补救",
        effect: "下次汇报时强调自己的贡献，需要向上管理≥50",
        weight: 20,
      },
      { text: "忍气吞声", effect: "尊严-10，但避免冲突", weight: 10 },
    ],
  },
  // 站队类
  faction_conflict: {
    name: "站队危机",
    icon: "⚖️",
    desc: "两个派系在斗争，需要你选边站",
    triggerConditions: { corpLevel: "P6+", departmentConflict: true },
    options: [
      {
        text: "加入A派",
        effect: "A派好感+30，B派好感-30，风险：A派失败则受牵连",
        weight: 35,
      },
      {
        text: "加入B派",
        effect: "B派好感+30，A派好感-30，风险：B派失败则受牵连",
        weight: 35,
      },
      { text: "保持中立", effect: "两边好感都不涨，但安全", weight: 20 },
      {
        text: "两边都不得罪",
        effect: "需要高情商（智力≥70），成功则两边都满意，失败则两边都讨厌",
        weight: 10,
      },
    ],
  },
  // 八卦传播类
  gossip_spread: {
    name: "八卦风波",
    icon: "👂",
    desc: "关于你的八卦在办公室传播",
    triggerConditions: { random: true },
    options: [
      {
        text: "澄清辟谣",
        effect: "需要证据，成功则声誉恢复，失败则越描越黑",
        weight: 30,
      },
      { text: "冷处理", effect: "随时间淡化，但需要3-5天", weight: 40 },
      { text: "反八卦", effect: "转移注意力到别人身上，道德风险", weight: 20 },
      {
        text: "找传播源头",
        effect: "需要人脉网络≥50，成功则找到源头并制止",
        weight: 10,
      },
    ],
  },
  // 邀功类
  credit_claiming: {
    name: "邀功",
    icon: "🏆",
    desc: "会议上有人把你的想法说成是他的",
    triggerConditions: { meetingPresented: true },
    options: [
      {
        text: "当场指出",
        effect: "需要证据，成功则挽回声誉，失败则显得不专业",
        weight: 30,
      },
      {
        text: "会后找老板",
        effect: "需要向上管理≥60，成功则老板了解真相",
        weight: 40,
      },
      {
        text: "下次更充分准备",
        effect: "下次汇报时更详细地展示过程",
        weight: 20,
      },
      { text: "忍了", effect: "尊严-5，但避免冲突升级", weight: 10 },
    ],
  },
};

// ====== 导师系统 ======
const MENTORSHIP_LEVELS = {
  stranger: { name: "陌生人", icon: "❓", level: 0, benefits: [] },
  acquaintance: { name: "认识", icon: "👋", level: 20, benefits: ["信息交换"] },
  friendly: {
    name: "友好",
    icon: "🙂",
    level: 40,
    benefits: ["信息交换", "小忙帮忙"],
  },
  trusted: {
    name: "信任",
    icon: "🤝",
    level: 60,
    benefits: ["信息交换", "帮忙", "引荐"],
  },
  mentor: {
    name: "导师",
    icon: "👨‍🏫",
    level: 80,
    benefits: ["全方位指导", "晋升推荐", "危机保护"],
  },
  master: {
    name: "恩师",
    icon: "🙏",
    level: 95,
    benefits: ["全方位指导", "晋升推荐", "危机保护", "人脉传承"],
  },
};

/**
 * 初始化同事关系网
 */
function initColleagueNetwork(state) {
  if (!state.corporate) state.corporate = {};
  if (!state.corporate.colleagues) {
    state.corporate.colleagues = {
      network: [],
      factions: [],
      gossipNetwork: {},
      mentorship: null,
      mentees: [],
    };
  }
}

/**
 * 生成随机同事
 */
function generateColleague(state, company) {
  const names = [
    "老王",
    "小张",
    "小李",
    "小王",
    "小刘",
    "小陈",
    "小赵",
    "小周",
    "小吴",
    "小郑",
    "小孙",
    "小徐",
    "小朱",
    "小高",
    "小林",
    "小何",
    "小罗",
    "小梁",
    "小谢",
    "小邓",
  ];
  const personalities = [
    { type: "热心肠", trait: "helpful", bonus: "愿意帮忙", risk: "容易被利用" },
    { type: "老油条", trait: "cynical", bonus: "经验丰富", risk: "甩锅高手" },
    {
      type: "卷王",
      trait: "competitive",
      bonus: "工作能力强",
      risk: "抢功狂魔",
    },
    {
      type: "和事佬",
      trait: "diplomatic",
      bonus: "调解能力",
      risk: "两边不讨好",
    },
    { type: "八卦王", trait: "gossipy", bonus: "信息灵通", risk: "传播八卦" },
    { type: "老实人", trait: "honest", bonus: "可靠", risk: "容易被欺负" },
    { type: "社交达人", trait: "social", bonus: "人脉广", risk: "浅交多" },
    { type: "技术宅", trait: "technical", bonus: "技术强", risk: "不善言辞" },
  ];

  const name = Random.fromArray(names);
  const personality = Random.fromArray(personalities);
  const roleKeys = Object.keys(COLLEAGUE_ROLES);
  const roleKey = Random.fromArray(roleKeys);

  return {
    id:
      "colleague_" +
      state.player.day +
      "_" +
      Random.float(0, 1).toString(36).substr(2, 9),
    name: name,
    role: roleKey,
    personality: personality,
    relationship: Random.int(20, 59), // 20-59 初始
    trust: Random.int(20, 49), // 20-49 初始信任
    faction: null, // 所属派系
    favors: [], // 欠你的人情
    secrets: [], // 知道你的秘密
    lastInteraction: state.player.day,
  };
}

/**
 * 增加同事好感度
 */
function increaseColleagueRelationship(state, colleagueId, amount, reason) {
  const colleagues = state.corporate.colleagues.network;
  const colleague = colleagues.find((c) => c.id === colleagueId);
  if (!colleague) return false;

  const oldRelationship = colleague.relationship;
  colleague.relationship = Math.min(100, colleague.relationship + amount);
  colleague.lastInteraction = state.player.day;

  // 关系升级事件
  if (oldRelationship < 40 && colleague.relationship >= 40) {
    StateManager.addMessage(
      `🤝 你和${colleague.name}的关系升级为"友好"！`,
      "success",
    );
  }
  if (oldRelationship < 60 && colleague.relationship >= 60) {
    StateManager.addMessage(
      `🤝 你和${colleague.name}的关系升级为"信任"！`,
      "success",
    );
  }
  if (oldRelationship < 80 && colleague.relationship >= 80) {
    StateManager.addMessage(
      `👨‍🏫 你和${colleague.name}的关系升级为"导师"级别！`,
      "success",
    );
  }

  StateManager.addMessage(
    `${reason} → ${colleague.name}好感度 +${amount}`,
    "info",
  );
  return true;
}

/**
 * 降低同事好感度
 */
function decreaseColleagueRelationship(state, colleagueId, amount, reason) {
  const colleagues = state.corporate.colleagues.network;
  const colleague = colleagues.find((c) => c.id === colleagueId);
  if (!colleague) return false;

  const oldRelationship = colleague.relationship;
  colleague.relationship = Math.max(0, colleague.relationship - amount);
  colleague.lastInteraction = state.player.day;

  // 关系降级事件
  if (oldRelationship >= 60 && colleague.relationship < 60) {
    StateManager.addMessage(
      `⚠️ 你和${colleague.name}的关系降级了...`,
      "warning",
    );
  }
  if (oldRelationship >= 40 && colleague.relationship < 40) {
    StateManager.addMessage(
      `⚠️ 你和${colleague.name}的关系变得疏远了...`,
      "warning",
    );
  }

  StateManager.addMessage(
    `${reason} → ${colleague.name}好感度 -${amount}`,
    "warning",
  );
  return true;
}

/**
 * 建立导师关系
 */
function establishMentorship(state, mentorId) {
  const colleagues = state.corporate.colleagues.network;
  const mentor = colleagues.find((c) => c.id === mentorId);
  if (!mentor) return { success: false, message: "找不到该同事" };

  if (mentor.relationship < 80) {
    return {
      success: false,
      message: `需要和${mentor.name}的关系达到80（信任级）才能拜师`,
    };
  }

  if (state.corporate.colleagues.mentorship) {
    return { success: false, message: "你已经有导师了，先解除现有导师关系" };
  }

  state.corporate.colleagues.mentorship = {
    mentorId: mentor.id,
    mentorName: mentor.name,
    startedDay: state.player.day,
    level: 80,
    benefitsReceived: [],
  };

  mentor.role = "mentor";
  mentor.relationship = Math.min(100, mentor.relationship + 5);

  StateManager.addMessage(
    `👨‍🏫 你拜${mentor.name}为师了！他将为你提供指导和保护。`,
    "success",
  );
  return { success: true, mentor: mentor };
}

/**
 * 解除导师关系
 */
function endMentorship(state) {
  if (!state.corporate.colleagues.mentorship) {
    return { success: false, message: "你目前没有导师" };
  }

  const mentor = state.corporate.colleagues.network.find(
    (c) => c.id === state.corporate.colleagues.mentorship.mentorId,
  );
  if (mentor) {
    mentor.role = "ally";
    mentor.relationship = Math.max(40, mentor.relationship - 20);
  }

  const mentorName = state.corporate.colleagues.mentorship.mentorName;
  state.corporate.colleagues.mentorship = null;

  StateManager.addMessage(`👋 你结束了和${mentorName}的导师关系。`, "warning");
  return { success: true };
}

/**
 * 收徒弟
 */
function takeMentee(state, menteeId) {
  const colleagues = state.corporate.colleagues.network;
  const mentee = colleagues.find((c) => c.id === menteeId);
  if (!mentee) return { success: false, message: "找不到该同事" };

  if (mentee.relationship < 60) {
    return {
      success: false,
      message: `需要和${mentee.name}的关系达到60（信任级）才能收徒`,
    };
  }

  if (!state.corporate.colleagues.mentees) {
    state.corporate.colleagues.mentees = [];
  }

  if (state.corporate.colleagues.mentees.length >= 3) {
    return { success: false, message: "最多同时带3个徒弟" };
  }

  state.corporate.colleagues.mentees.push({
    menteeId: mentee.id,
    menteeName: mentee.name,
    startedDay: state.player.day,
    progress: 0,
  });

  mentee.role = "subordinate";
  mentee.relationship = Math.min(100, mentee.relationship + 5);

  StateManager.addMessage(`👥 你收${mentee.name}为徒了！`, "success");
  return { success: true, mentee: mentee };
}

/**
 * 每日同事关系更新
 */
function tickColleagueRelationships(state) {
  const colleagues = state.corporate.colleagues.network;
  if (!colleagues || colleagues.length === 0) return;

  const day = state.player.day;

  for (const colleague of colleagues) {
    // 自然衰减（不互动的话关系会慢慢下降）
    if (day - colleague.lastInteraction > 30) {
      colleague.relationship = Math.max(0, colleague.relationship - 2);
    } else if (day - colleague.lastInteraction > 60) {
      colleague.relationship = Math.max(0, colleague.relationship - 5);
    }

    // 导师每日指导
    if (
      state.corporate.colleagues.mentorship &&
      colleague.id === state.corporate.colleagues.mentorship.mentorId
    ) {
      const mentorship = state.corporate.colleagues.mentorship;
      mentorship.level = Math.min(100, mentorship.level + 0.5);

      // 每日小指导
      if (Random.chance(0.3)) {
        const benefits = ["能力+1", "KPI+2", "向上管理+1", "人缘+1", "风险-1"];
        const benefit = Random.fromArray(benefits);
        StateManager.addMessage(
          `👨‍🏫 ${colleague.name}今天给了你一点指导：${benefit}`,
          "hint",
        );
      }
    }

    // 徒弟成长
    if (state.corporate.colleagues.mentees) {
      for (const mentee of state.corporate.colleagues.mentees) {
        if (mentee.menteeId === colleague.id) {
          mentee.progress = Math.min(100, mentee.progress + 1);
          if (mentee.progress >= 100) {
            StateManager.addMessage(`🎉 ${colleague.name}出师了！`, "success");
          }
        }
      }
    }
  }
}

/**
 * 触发办公室政治事件
 */
function triggerOfficePoliticsEvent(state, eventType) {
  const event = OFFICE_POLITICS_EVENTS[eventType];
  if (!event) return;

  const options = event.options;
  const body = `
    <div style="font-size:13px;">
      <div style="padding:12px;background:var(--bg-card);border-radius:8px;margin-bottom:12px;border-left:4px solid var(--warning);">
        <div style="font-size:14px;font-weight:bold;margin-bottom:8px;">${event.icon} ${event.name}</div>
        <div style="font-size:11px;color:var(--text-secondary);">${event.desc}</div>
      </div>

      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">选择你的应对方式：</div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        ${options
          .map(
            (opt, i) => `
          <div style="padding:10px;background:var(--bg-secondary);border-radius:6px;border:1px solid var(--border);cursor:pointer;" onclick="handlePoliticsChoice('${eventType}', ${i})">
            <div style="font-size:12px;font-weight:bold;margin-bottom:4px;">${opt.text}</div>
            <div style="font-size:10px;color:var(--text-muted);">${opt.effect}</div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:4px;">概率: ${opt.weight}%</div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  showModal({
    title: `🏢 办公室政治：${event.name}`,
    body: body,
    buttons: [{ text: "取消", cls: "", callback: () => {} }],
  });

  // 存储当前事件供选择处理
  state._pendingPoliticsEvent = { type: eventType, options: options };
}

/**
 * 处理办公室政治事件选择
 */
function handlePoliticsChoice(eventType, optionIndex) {
  const state = StateManager.getState();
  const pending = state._pendingPoliticsEvent;
  if (!pending) return;

  const option = pending.options[optionIndex];
  const event = OFFICE_POLITICS_EVENTS[eventType];

  // 解析效果
  const effects = parseEffectString(option.effect);

  // 应用效果
  applyPoliticsEffects(state, effects);

  StateManager.addMessage(
    `🏢 ${event.icon} ${event.name}：${option.text} → ${option.effect}`,
    "info",
  );

  // 关闭弹窗
  document.querySelector(".modal-overlay")?.remove();
  state._pendingPoliticsEvent = null;

  renderAll();
}

/**
 * 解析效果字符串
 */
function parseEffectString(effectStr) {
  const effects = {};
  const pairs = effectStr.split("，");
  for (const pair of pairs) {
    const match = pair.match(/([^\s，]+)([+-]\d+)/);
    if (match) {
      effects[match[1]] = parseInt(match[2]);
    }
  }
  return effects;
}

/**
 * 应用政治事件效果
 */
function applyPoliticsEffects(state, effects) {
  const p = state.player.corporate;

  for (const [key, value] of Object.entries(effects)) {
    if (key === "尊严" && p.hasOwnProperty("dignity"))
      p.dignity = Math.max(0, Math.min(100, p.dignity + value));
    if (key === "人缘" && p.hasOwnProperty("popularity"))
      p.popularity = Math.max(0, Math.min(100, p.popularity + value));
    if (key === "KPI" && p.hasOwnProperty("kpi"))
      p.kpi = Math.max(0, Math.min(150, p.kpi + value));
    if (key === "能力" && p.hasOwnProperty("ability"))
      p.ability = Math.max(0, Math.min(100, p.ability + value));
    if (key === "向上管理" && p.hasOwnProperty("upwardMgmt"))
      p.upwardMgmt = Math.max(0, Math.min(100, p.upwardMgmt + value));
    if (key === "风险" && p.hasOwnProperty("risk"))
      p.risk = Math.max(0, Math.min(100, p.risk + value));
    if (key === "声誉" && state.player.hasOwnProperty("fame"))
      state.player.fame = Math.max(0, state.player.fame + value);
  }
}

/**
 * 社交行动：请同事吃饭
 */
function treatColleagueMeal(state, colleagueId, tier) {
  const colleagues = state.corporate.colleagues.network;
  const colleague = colleagues.find((c) => c.id === colleagueId);
  if (!colleague) return { success: false, message: "找不到该同事" };

  const costs = { cheap: 50, normal: 150, fancy: 500 };
  const cost = costs[tier] || costs.normal;

  if (state.resources.cash < cost) {
    return { success: false, message: "现金不足" };
  }

  state.resources.cash -= cost;

  // 根据消费档次和关系度计算效果
  const baseBonus = { cheap: 3, normal: 5, fancy: 8 };
  const relationshipMod = colleague.relationship / 100;
  const bonus = Math.round((baseBonus[tier] || 5) * (0.5 + relationshipMod));

  increaseColleagueRelationship(
    state,
    colleagueId,
    bonus,
    `请${colleague.name}吃${tier === "fancy" ? "高档" : tier === "normal" ? "普通" : "便"}饭`,
  );

  return { success: true, message: `请${colleague.name}吃饭，关系+${bonus}` };
}

/**
 * 社交行动：私下聊天
 */
function chatWithColleague(state, colleagueId) {
  const colleagues = state.corporate.colleagues.network;
  const colleague = colleagues.find((c) => c.id === colleagueId);
  if (!colleague) return { success: false, message: "找不到该同事" };

  const AP_COST = 10;
  if (state.player.actionPoints < AP_COST) {
    return { success: false, message: "行动力不足" };
  }

  state.player.actionPoints -= AP_COST;

  // 随机聊天内容
  const topics = [
    { topic: "行业八卦", effect: "获得内幕信息", bonus: 2 },
    { topic: "工作经验", effect: "能力提升", bonus: 1 },
    { topic: "生活琐事", effect: "关系拉近", bonus: 3 },
    { topic: "吐槽老板", effect: "风险+5，但关系+5", bonus: -5, risk: 5 },
    { topic: "闲聊", effect: "关系+1", bonus: 1 },
  ];

  const topic = Random.fromArray(topics);
  const bonus = topic.bonus;

  increaseColleagueRelationship(
    state,
    colleagueId,
    Math.abs(bonus),
    `和${colleague.name}聊${topic.topic}`,
  );

  if (topic.risk) {
    state.player.corporate.risk = Math.min(
      100,
      state.player.corporate.risk + topic.risk,
    );
    StateManager.addMessage(
      `⚠️ 和${colleague.name}聊${topic.topic}，风险+${topic.risk}`,
      "warning",
    );
  }

  StateManager.addMessage(
    `💬 和${colleague.name}聊${topic.topic} → 关系+${Math.abs(bonus)}`,
    "info",
  );

  colleague.lastInteraction = state.player.day;
  return { success: true };
}

/**
 * 获取同事关系摘要
 */
function getColleagueSummary(state) {
  const colleagues = state.corporate.colleagues.network;
  if (!colleagues || colleagues.length === 0) return null;

  const mentor = state.corporate.colleagues.mentorship;
  const mentees = state.corporate.colleagues.mentees || [];

  return {
    total: colleagues.length,
    mentor: mentor ? colleagues.find((c) => c.id === mentor.mentorId) : null,
    menteeCount: mentees.length,
    avgRelationship: Math.round(
      colleagues.reduce((s, c) => s + c.relationship, 0) / colleagues.length,
    ),
    highTrustCount: colleagues.filter((c) => c.relationship >= 60).length,
    factions: state.corporate.colleagues.factions.length,
  };
}

/**
 * 百科注册
 */
if (typeof window !== "undefined") {
  window.MECHANICS = window.MECHANICS || {};
  window.MECHANICS.workplace_social = {
    id: "workplace_social",
    name: "职场社交网络",
    icon: "🏢",
    brief: "同事关系网、办公室政治、导师系统、人脉网络深度交互",
    version: "1.0.0",
    related: ["mechanics:corp_ops", "mechanics:perf", "mechanics:promo"],
    sections: [
      {
        kind: "desc",
        text: "职场不是简单的打卡上班，而是一个充满人情世故的微型社会。你的每个决策都可能在同事关系中产生涟漪效应。",
      },
      {
        kind: "subhead",
        text: "👥 同事关系等级",
      },
      {
        kind: "list",
        items: [
          "❓ 陌生人（0-19）：初次见面，互不了解",
          "👋 认识（20-39）：点头之交，可以交换信息",
          "🙂 友好（40-59）：关系不错，愿意互相帮忙",
          "🤝 信任（60-79）：可以托付小事，引荐人脉",
          "👨‍🏫 导师（80-94）：全方位指导，晋升推荐，危机保护",
          "🙏 恩师（95-100）：人脉传承，终身受益",
        ],
      },
      {
        kind: "subhead",
        text: "⚔️ 办公室政治类型",
      },
      {
        kind: "list",
        items: [
          "🍠 甩锅：有人想把责任推给你",
          "💼 抢功：你的成果被同事抢先汇报",
          "⚖️ 站队危机：派系斗争需要你选边",
          "👂 八卦风波：关于你的谣言在传播",
          "🏆 邀功：会议上有人把你的想法说成是他的",
        ],
      },
      {
        kind: "tip",
        text: "💡  tip：和导师关系≥80才能获得晋升推荐；徒弟出师后会成为你的人脉；办公室政治事件需要权衡利弊，有时候忍一时风平浪静",
      },
    ],
  };
}
